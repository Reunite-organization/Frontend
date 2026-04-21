import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, VideoOff, Phone, PhoneOff, Mic, MicOff, Maximize, Minimize } from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';

export const VideoCallButton = ({ roomId, otherParticipant, onStartCall }) => {
  const { language } = useLanguage();
  const [isStarting, setIsStarting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleStartCall = async () => {
    setIsStarting(true);
    try {
      await onStartCall(roomId);
      setShowConfirm(false);
    } catch (error) {
      console.error('Failed to start call:', error);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="p-2 text-olive hover:text-terracotta transition-colors rounded-full hover:bg-warm-gray/20 relative group"
        title={language === 'am' ? 'የቪድዮ ጥሪ ጀምር' : 'Start video call'}
      >
        <Video className="w-5 h-5" />
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-charcoal text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {language === 'am' ? 'የቪድዮ ጥሪ' : 'Video Call'}
        </span>
      </button>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-charcoal rounded-2xl max-w-sm w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-terracotta" />
                </div>
                
                <h3 className="font-display text-xl font-semibold text-charcoal mb-2">
                  {language === 'am' 
                    ? `${otherParticipant?.profile?.realName || 'ተጠቃሚ'} ጋር የቪድዮ ጥሪ ይጀምሩ?`
                    : `Start video call with ${otherParticipant?.profile?.realName || 'User'}?`
                  }
                </h3>
                
                <p className="text-sm text-stone mb-6">
                  {language === 'am'
                    ? 'የቪድዮ ጥሪው ደህንነቱ የተጠበቀ እና ኢንክሪፕት የተደረገ ነው።'
                    : 'The video call is secure and end-to-end encrypted.'
                  }
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 px-4 py-2.5 border border-warm-gray rounded-full text-stone hover:bg-warm-gray/20 transition-colors"
                  >
                    {language === 'am' ? 'ይቅር' : 'Cancel'}
                  </button>
                  
                  <button
                    onClick={handleStartCall}
                    disabled={isStarting}
                    className="flex-1 px-4 py-2.5 bg-terracotta text-white rounded-full hover:bg-clay transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isStarting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{language === 'am' ? 'በመጀመር ላይ...' : 'Starting...'}</span>
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4" />
                        <span>{language === 'am' ? 'ጀምር' : 'Start'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
