import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Image, 
  Phone, 
  Video, 
  MoreVertical,
  ChevronLeft,
  Check,
  CheckCheck,
  Smile,
  Paperclip,
  Shield
} from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useSocket } from '../../hooks/useSocket';
import { useLanguage } from '../../../../lib/i18n';
import { useAuth } from '../../../../hooks/useAuth';
import { ChatSidebar } from './ChatSidebar';
import { MessageBubble } from './MessageBubble';
import { VideoCallModal } from './VideoCallModal';
import { TrustBadge } from '../profile/TrustBadge';
import { formatMessageTime } from '../../utils/formatters';

export const ChatPage = () => {
  const { roomId } = useParams();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { 
    rooms, 
    currentRoom, 
    messages, 
    sendMessage, 
    sendTyping,
    markAsRead,
    isLoading 
  } = useChat(roomId);
  
  const { isConnected } = useSocket();
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      sendTyping(true);
    }
    
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTyping(false);
    }, 1000);
  };

  const handleSend = () => {
    if (!messageInput.trim()) return;
    
    sendMessage({
      roomId: currentRoom?._id,
      content: messageInput.trim(),
      type: 'text',
    });
    
    setMessageInput('');
    setIsTyping(false);
  };

  const otherParticipant = currentRoom?.participants?.find(
    p => p.role === 'poster' || p.role === 'claimant'
  );

  if (isLoading) {
    return <ChatSkeleton />;
  }

  return (
    <div className="h-screen flex bg-warm-white">
      {/* Sidebar */}
      <ChatSidebar 
        rooms={rooms}
        currentRoomId={roomId}
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <header className="flex-shrink-0 bg-cream/95 backdrop-blur-md border-b border-warm-gray/30 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowSidebar(true)}
                className="lg:hidden p-2 text-olive hover:text-terracotta transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Participant Info */}
              {otherParticipant && (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-terracotta to-sahara flex items-center justify-center text-white font-medium">
                      {otherParticipant.profile?.realName?.[0]?.toUpperCase() || '?'}
                    </div>
                    {isConnected && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-hope-green rounded-full border-2 border-cream" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display font-semibold text-charcoal">
                        {otherParticipant.profile?.realName || 'User'}
                      </h2>
                      <TrustBadge score={otherParticipant.profile?.trustScore} size="sm" />
                    </div>
                    <p className="text-xs text-stone">
                      {isTyping ? (
                        <span className="text-hope-green">
                          {language === 'am' ? 'እየጻፈ ነው...' : 'Typing...'}
                        </span>
                      ) : isConnected ? (
                        language === 'am' ? 'በመስመር ላይ' : 'Online'
                      ) : (
                        language === 'am' ? 'ከመስመር ውጭ' : 'Offline'
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                className="p-2 text-olive hover:text-terracotta transition-colors rounded-full hover:bg-warm-gray/20"
                title={language === 'am' ? 'የድምጽ ጥሪ' : 'Voice Call'}
              >
                <Phone className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowVideoCall(true)}
                className="p-2 text-olive hover:text-terracotta transition-colors rounded-full hover:bg-warm-gray/20"
                title={language === 'am' ? 'የቪድዮ ጥሪ' : 'Video Call'}
              >
                <Video className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-olive hover:text-terracotta transition-colors rounded-full hover:bg-warm-gray/20"
                title={language === 'am' ? 'ተጨማሪ' : 'More'}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Trust Banner */}
        <div className="flex-shrink-0 px-4 py-2 bg-hope-green/5 border-b border-hope-green/20">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-hope-green" />
            <span className="text-olive">
              {language === 'am'
                ? 'ግንኙነቱ እስኪጸና ድረስ የእውቂያ መረጃ አይለዋወጡ'
                : 'Keep conversations here until you\'re ready to exchange contact info'
              }
            </span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {messages.map((message, idx) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={message.sender?._id === user?.id || message.sender === user?.id}
                showAvatar={idx === 0 || (messages[idx - 1]?.sender?._id || messages[idx - 1]?.sender) !== (message.sender?._id || message.sender)}
              />
            ))}
          </AnimatePresence>
          
          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-terracotta/30 to-sahara/30" />
                <div className="bg-cream rounded-2xl rounded-tl-sm px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-stone rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-stone rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-stone rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="flex-shrink-0 p-4 bg-cream/50 border-t border-warm-gray/30">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  handleTyping();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={language === 'am' ? 'መልእክት ይጻፉ...' : 'Type a message...'}
                rows={1}
                className="w-full px-4 py-3 pr-24 bg-warm-white border border-warm-gray rounded-2xl resize-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
                style={{ maxHeight: '120px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <button
                  className="p-1.5 text-stone hover:text-terracotta transition-colors rounded-full"
                  title={language === 'am' ? 'ኢሞጂ' : 'Emoji'}
                >
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  className="p-1.5 text-stone hover:text-terracotta transition-colors rounded-full"
                  title={language === 'am' ? 'ፋይል አያይዝ' : 'Attach file'}
                >
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={!messageInput.trim()}
              className="p-3 bg-terracotta text-white rounded-full hover:bg-clay transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        roomId={currentRoom?._id}
      />
    </div>
  );
};
