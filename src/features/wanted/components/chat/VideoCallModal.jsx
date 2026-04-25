import { useState, useEffect, useRef, useCallback } from 'react';
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
  Loader
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
  const [isConnecting, setIsConnecting] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const zegoRef = useRef(null);
  const callSessionRef = useRef(null);
  const endingCallRef = useRef(false);
  const isCleaningUp = useRef(false);

  // Memoize cleanup function to prevent recreation
  const cleanupCall = useCallback(() => {
    if (isCleaningUp.current) return;
    isCleaningUp.current = true;

    try {
      if (zegoRef.current) {
        zegoRef.current.destroy();
        zegoRef.current = null;
      }
      stopTimer();
    } catch (err) {
      console.error('Error during call cleanup:', err);
    } finally {
      isCleaningUp.current = false;
    }
  }, []);

  // Memoize end call function
  const endCall = useCallback(async () => {
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
  }, [roomId, callDuration]);

  const initializeCall = useCallback(async () => {
    if (!roomId) return;

    setIsConnecting(true);
    setError(null);

    try {
      const { token, roomId: videoRoomId, appId } = await wantedApi.generateVideoToken(roomId);
      
      if (!token || !videoRoomId || !appId) {
        throw new Error('Invalid token response');
      }

      const userId = user?.id ? String(user.id) : Date.now().toString();
      const userName = user?.name || 'User';

      callSessionRef.current = { callId: videoRoomId };
      
      // Dynamically import ZegoUIKit
      const { ZegoUIKitPrebuilt } = await import('@zegocloud/zego-uikit-prebuilt');
      
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        appId,
        token,
        videoRoomId,
        userId,
        userName,
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zegoRef.current = zp;

      await zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        showLeavingView: false,
        onUserJoin: (users) => {
          setIsConnecting(false);
          startTimer();
        },
        onUserLeave: (users) => {
          if (users.length === 0) {
            handleHangup();
          }
        },
        onRoomStateUpdate: (state) => {
          if (state === 'DISCONNECTED') {
            handleHangup();
          }
        },
      });

    } catch (err) {
      console.error('Failed to initialize call:', err);
      setError(
        language === 'am' 
          ? 'ጥሪ መጀመር አልተሳካም' 
          : 'Failed to start video call. Please try again.'
      );
      setIsConnecting(false);
    }
  }, [roomId, user, language]);

  useEffect(() => {
    if (isOpen && roomId) {
      initializeCall();
    }

    return () => {
      cleanupCall();
    };
  }, [isOpen, roomId, initializeCall, cleanupCall]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const startTimer = () => {
    if (timerRef.current) return;
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

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  const handleHangup = useCallback(() => {
    endCall();
    cleanupCall();
    onClose();
  }, [endCall, cleanupCall, onClose]);

  const toggleMute = () => {
    if (zegoRef.current) {
      const newState = !isMuted;
      zegoRef.current.toggleMic(!newState);
      setIsMuted(newState);
    }
  };

  const toggleVideo = () => {
    if (zegoRef.current) {
      const newState = !isVideoOff;
      zegoRef.current.toggleCamera(!newState);
      setIsVideoOff(newState);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-charcoal flex items-center justify-center"
      >
        {/* Video Container */}
        <div ref={containerRef} className="w-full h-full relative">
          {/* Connecting Overlay */}
          {isConnecting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-charcoal/90 flex items-center justify-center z-10"
            >
              <div className="text-center">
                <Loader className="w-12 h-12 text-terracotta animate-spin mx-auto mb-4" />
                <p className="text-white text-lg">
                  {language === 'am' ? 'በመገናኘት ላይ...' : 'Connecting...'}
                </p>
              </div>
            </motion.div>
          )}

          {/* Error Overlay */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-charcoal/90 flex items-center justify-center z-10"
            >
              <div className="text-center px-8">
                <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center mx-auto mb-4">
                  <VideoOff className="w-8 h-8 text-error" />
                </div>
                <p className="text-white text-lg mb-6">{error}</p>
                <button
                  onClick={handleHangup}
                  className="px-6 py-3 bg-terracotta text-white rounded-full hover:bg-clay transition-colors"
                >
                  {language === 'am' ? 'ዝጋ' : 'Close'}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Call Controls */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-charcoal/80 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-4 z-20 shadow-2xl"
        >
          {/* Duration */}
          <span className="text-white text-sm font-mono min-w-[3rem]">
            {formatDuration(callDuration)}
          </span>

          {/* Mute */}
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full transition-all ${
              isMuted ? 'bg-error text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-all ${
              isVideoOff ? 'bg-error text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          {/* Hangup */}
          <button
            onClick={handleHangup}
            className="p-3 bg-error text-white rounded-full hover:bg-error/90 transition-all hover:scale-110"
            title="End call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </motion.div>

        {/* Close Button */}
        <button
          onClick={handleHangup}
          className="fixed top-4 right-4 p-2 bg-charcoal/50 text-white rounded-full hover:bg-charcoal/70 transition-colors z-20 backdrop-blur-sm"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
