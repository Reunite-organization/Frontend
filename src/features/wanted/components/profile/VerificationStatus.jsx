import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  AlertCircle,
  Shield,
  ArrowRight,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { usePhoneVerification, useTelegramVerification } from '../../hooks/useVerification';
import { toast } from 'sonner';

const VerificationCard = ({ 
  icon: Icon, 
  title, 
  description, 
  isVerified, 
  onVerify, 
  children,
  color = 'text-terracotta'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-cream rounded-xl border ${isVerified ? 'border-hope-green/30' : 'border-warm-gray/30'} overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full ${isVerified ? 'bg-hope-green/10' : 'bg-warm-gray/30'} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${isVerified ? 'text-hope-green' : color}`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-charcoal">{title}</h4>
              {isVerified && (
                <span className="flex items-center gap-1 text-xs text-hope-green">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-stone mb-3">{description}</p>
            
            {!isVerified && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-terracotta hover:text-clay flex items-center gap-1"
              >
                {isExpanded ? 'Cancel' : 'Verify Now'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && !isVerified && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-warm-gray/30"
          >
            <div className="p-4 bg-warm-white">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const VerificationStatus = ({ profile }) => {
  const { language } = useLanguage();
  const { sendCode, verifyCode, isSending, isVerifying, countdown } = usePhoneVerification();
  
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  const handleSendCode = () => {
    if (!phoneNumber) return;
    sendCode(phoneNumber, {
      onSuccess: () => setShowCodeInput(true),
    });
  };

  const handleVerifyCode = () => {
    if (!verificationCode) return;
    verifyCode({ phoneNumber, code: verificationCode });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(language === 'am' ? 'ተቀድቷል!' : 'Copied!');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-olive" />
        <h3 className="font-display text-lg font-semibold text-charcoal">
          {language === 'am' ? 'ማረጋገጫ' : 'Verification'}
        </h3>
      </div>

      {/* Phone Verification */}
      <VerificationCard
        icon={Phone}
        title={language === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'}
        description={language === 'am'
          ? 'የእምነት ነጥብዎን ለማሳደግ ስልክ ቁጥርዎን ያረጋግጡ'
          : 'Verify your phone number to increase your trust score'
        }
        isVerified={profile?.phoneVerified}
        color="text-terracotta"
      >
        {!showCodeInput ? (
          <div className="space-y-3">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+251 912 345 678"
              className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none"
            />
            <button
              onClick={handleSendCode}
              disabled={isSending || countdown > 0}
              className="w-full py-2.5 bg-terracotta text-white rounded-full font-medium hover:bg-clay transition-colors disabled:opacity-50"
            >
              {isSending ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {language === 'am' ? 'በመላክ ላይ...' : 'Sending...'}
                </span>
              ) : countdown > 0 ? (
                `${language === 'am' ? 'እንደገና ላክ' : 'Resend'} (${countdown}s)`
              ) : (
                language === 'am' ? 'ኮድ ላክ' : 'Send Code'
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-stone">
              {language === 'am'
                ? `የማረጋገጫ ኮድ ወደ ${phoneNumber} ተልኳል`
                : `Verification code sent to ${phoneNumber}`
              }
            </p>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none text-center text-2xl tracking-widest"
            />
            <button
              onClick={handleVerifyCode}
              disabled={isVerifying || verificationCode.length !== 6}
              className="w-full py-2.5 bg-hope-green text-white rounded-full font-medium hover:bg-hope-green/90 transition-colors disabled:opacity-50"
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {language === 'am' ? 'በማረጋገጥ ላይ...' : 'Verifying...'}
                </span>
              ) : (
                language === 'am' ? 'አረጋግጥ' : 'Verify'
              )}
            </button>
            <button
              onClick={() => setShowCodeInput(false)}
              className="w-full text-sm text-stone hover:text-charcoal"
            >
              {language === 'am' ? 'ተመለስ' : 'Back'}
            </button>
          </div>
        )}
      </VerificationCard>

      <VerificationCard
        icon={Shield}
        title={language === 'am' ? 'የፊት ማረጋገጫ' : 'Face verification'}
        description={language === 'am'
          ? 'የመለያ እምነትን ለማሳደግ አማራጭ ፎቶ መላክ ይችላሉ'
          : 'You can optionally submit a face photo to strengthen identity trust.'
        }
        isVerified={profile?.identityPhotoStatus === 'verified'}
        color="text-olive"
      >
        <div className="space-y-3">
          <p className="text-sm text-stone">
            {profile?.identityPhotoStatus === 'submitted'
              ? (language === 'am' ? 'ፎቶው ተልኳል እና በመገምገም ላይ ነው።' : 'Your photo has been submitted and is awaiting review.')
              : profile?.identityPhotoStatus === 'rejected'
                ? (language === 'am' ? 'ፎቶው እንደገና መላክ ይፈልጋል። ፕሮፋይልዎን ያርትዑ።' : 'That photo needs a re-upload. Edit your profile to submit a new one.')
                : (language === 'am' ? 'ፎቶ ለመጨመር ፕሮፋይልዎን ያርትዑ።' : 'Edit your profile to add a verification photo.')}
          </p>
          {profile?.identityPhotoUrl ? (
            <img
              src={profile.identityPhotoUrl}
              alt="Verification"
              className="h-36 w-full rounded-2xl object-cover"
            />
          ) : null}
        </div>
      </VerificationCard>


      {/* Trust Score Info */}
      <div className="p-4 bg-warmth/5 rounded-xl border border-warmth/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warmth flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-charcoal mb-1">
              {language === 'am' ? 'ስለ እምነት ነጥብ' : 'About Trust Score'}
            </p>
            <p className="text-sm text-stone">
              {language === 'am'
                ? 'እያንዳንዱ ማረጋገጫ የእምነት ነጥብዎን ይጨምራል። ከፍተኛ ነጥብ ያላቸው ተጠቃሚዎች በቀላሉ ይታመናሉ።'
                : 'Each verification increases your trust score. Higher trust scores help others feel more confident connecting with you.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
