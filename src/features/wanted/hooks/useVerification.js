import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { wantedApi } from '../services/wantedApi';
import { useLanguage } from '../../../lib/i18n';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export const usePhoneVerification = () => {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendCode = useMutation({
    mutationFn: (phoneNumber) => wantedApi.sendPhoneVerification(phoneNumber),
    onSuccess: () => {
      setCountdown(60);
      toast.success(
        language === 'am'
          ? 'የማረጋገጫ ኮድ ተልኳል'
          : 'Verification code sent'
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const verifyCode = useMutation({
    mutationFn: ({ phoneNumber, code }) => 
      wantedApi.verifyPhoneCode(phoneNumber, code),
    onSuccess: () => {
      toast.success(
        language === 'am'
          ? 'ስልክ ቁጥር ተረጋግጧል'
          : 'Phone number verified'
      );
      queryClient.invalidateQueries({ queryKey: ['wanted', 'profile'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });

  return {
    sendCode: sendCode.mutate,
    verifyCode: verifyCode.mutate,
    isSending: sendCode.isPending,
    isVerifying: verifyCode.isPending,
    countdown,
  };
};

export const useTelegramVerification = () => {
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  const generateCode = useMutation({
    mutationFn: () => wantedApi.generateTelegramCode(),
    onSuccess: (data) => {
      toast.success(
        language === 'am'
          ? 'ኮድ ተፈጥሯል። ከቴሌግራም ቦት ጋር ያጋሩት።'
          : 'Code generated. Share it with the Telegram bot.'
      );
      queryClient.invalidateQueries({ queryKey: ['wanted', 'profile'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });

  return {
    generateCode: generateCode.mutate,
    isGenerating: generateCode.isPending,
    code: generateCode.data?.code,
    botUsername: generateCode.data?.botUsername,
  };
};
