import { useEffect } from 'react';
import { useSocket } from './useSocket';
import { toast } from 'sonner';
import { useLanguage } from '../../../lib/i18n';

export const useClaimNotifications = () => {
  const { language } = useLanguage();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('new-claim', (data) => {
      toast.info(
        language === 'am'
          ? `አዲስ የይገባኛል ጥያቄ ከ${data.claimantName}`
          : `New claim from ${data.claimantName}`,
        {
          action: {
            label: language === 'am' ? 'ይመልከቱ' : 'View',
            onClick: () => window.location.href = '/wanted/claims',
          },
          duration: 10000,
        }
      );
    });

    return () => {
      socket.off('new-claim');
    };
  }, [socket, language]);
};
