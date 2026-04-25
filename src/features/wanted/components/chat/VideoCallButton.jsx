// VideoCallButton.jsx - FIXED VERSION
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Shield, X } from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';

export const VideoCallButton = ({ roomId, otherParticipant, onStartCall }) => {
  const { language } = useLanguage();
  const [isStarting, setIsStarting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);

  const handleStartCall = useCallback(async () => {
    if (!roomId) return;
    
    setIsStarting(true);
    setError(null);
    
    try {
      await onStartCall(roomId);
      setShowConfirm(false);
    } catch (error) {
      console.error('Failed to start call:', error);
      setError(
        language === 'am' 
          ? 'ጥሪ መጀመር አልተሳካም' 
          : 'Failed to start call'
      );
    } finally {
      setIsStarting(false);
    }
  }, [roomId, onStartCall, language]);

  const handleClose = useCallback(() => {
    setShowConfirm(false);
    setError(null);
  }, []);

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={!roomId}
        className="p-2 text-olive hover:text-terracotta transition-colors rounded-full hover:bg-warm-gray/20 relative group disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-charcoal rounded-2xl max-w-sm w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1 text-stone hover:text-charcoal transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-terracotta" />
                </div>
                
                <h3 className="font-display text-xl font-semibold text-charcoal dark:text-cream mb-2">
                  {language === 'am' 
                    ? `${otherParticipant?.profile?.realName || 'ተጠቃሚ'} ጋር የቪድዮ ጥሪ ይጀምሩ?`
                    : `Start video call with ${otherParticipant?.profile?.realName || 'User'}?`
                  }
                </h3>
                
                <div className="flex items-center justify-center gap-2 mb-4 text-sm text-stone">
                  <Shield className="w-4 h-4 text-hope-green" />
                  <p>
                    {language === 'am'
                      ? 'የቪድዮ ጥሪው ደህንነቱ የተጠበቀ ነው'
                      : 'Secure end-to-end encrypted call'
                    }
                  </p>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-error text-sm mb-4"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
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
                        <span>{language === 'am' ? 'ጀምር' : 'Start Call'}</span>
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
