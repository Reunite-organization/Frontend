import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff,
  Maximize,
  Minimize,
  Users
} from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { useAuth } from '../../../../hooks/useAuth';
import { wantedApi } from '../../services/wantedApi';

export const VideoCallModal = ({ isOpen, onClose, roomId }) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const zegoRef = useRef(null);
  const callSessionRef = useRef(null);
  const endingCallRef = useRef(false);

  useEffect(() => {
    if (isOpen && roomId) {
      initializeCall();
    }
    return () => {
      void endCall();
      cleanupCall();
    };
  }, [isOpen, roomId]);

  const initializeCall = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const { token, roomId: videoRoomId, appId } = await wantedApi.generateVideoToken(roomId);
      const userId = user?.id ? String(user.id) : Date.now().toString();
      const userName = user?.name || 'Falagiye User';

      callSessionRef.current = { callId: videoRoomId };
      
      const { ZegoUIKitPrebuilt } = await import('@zegocloud/zego-uikit-prebuilt');
      
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        appId,
        token,
        videoRoomId,
        userId,
        userName,
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        onUserJoin: () => {
          setIsConnecting(false);
          startTimer();
        },
        onUserLeave: () => {
          onClose();
        },
      });

      zegoRef.current = zp;
    } catch (err) {
      console.error('Failed to initialize call:', err);
      setError(language === 'am' ? 'ጥሪ መጀመር አልተሳካም' : 'Failed to start call');
      setIsConnecting(false);
    }
  };

  const cleanupCall = () => {
    if (zegoRef.current) {
      zegoRef.current.destroy();
      zegoRef.current = null;
    }
    stopTimer();
  };

  const endCall = async () => {
    if (endingCallRef.current || !callSessionRef.current?.callId || !roomId) {
      return;
    }

    endingCallRef.current = true;

    try {
      await wantedApi.endVideoCall(roomId, {
        callId: callSessionRef.current.callId,
        duration: callDuration,
      });
    } catch (requestError) {
      console.error('Failed to end video call cleanly:', requestError);
    } finally {
      endingCallRef.current = false;
      callSessionRef.current = null;
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleHangup = () => {
    void endCall();
    cleanupCall();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-charcoal flex items-center justify-center"
        >
          {/* Video Container */}
          <div ref={containerRef} className="w-full h-full relative">
            {/* Connecting Overlay */}
            <AnimatePresence>
              {isConnecting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-charcoal/90 flex items-center justify-center z-10"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">
                      {language === 'am' ? 'በመገናኘት ላይ...' : 'Connecting...'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Overlay */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-charcoal/90 flex items-center justify-center z-10"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center mx-auto mb-4">
                      <VideoOff className="w-8 h-8 text-error" />
                    </div>
                    <p className="text-white text-lg mb-4">{error}</p>
                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-terracotta text-white rounded-full hover:bg-clay transition-colors"
                    >
                      {language === 'am' ? 'ዝጋ' : 'Close'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Call Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-charcoal/80 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-4 z-20">
            {/* Duration */}
            <span className="text-white text-sm min-w-[3rem]">
              {formatDuration(callDuration)}
            </span>

            {/* Mute */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full transition-colors ${
                isMuted ? 'bg-error text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3 rounded-full transition-colors ${
                isVideoOff ? 'bg-error text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            {/* Hangup */}
            <button
              onClick={handleHangup}
              className="p-3 bg-error text-white rounded-full hover:bg-error/90 transition-colors"
            >
              <PhoneOff className="w-5 h-5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-charcoal/50 text-white rounded-full hover:bg-charcoal/70 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
