// client/src/features/wanted/components/chat/MessageBubble.jsx
import { motion } from 'framer-motion';
import { Check, CheckCheck, Clock, Image, File, Play } from 'lucide-react';
import { formatMessageTime } from '../../utils/formatters';
import { useAuth } from '../../../../hooks/useAuth';
import { useState } from 'react';

const MessageStatus = ({ message, isOwn }) => {
  if (!isOwn) return null;

  if (message.pending) {
    return <Clock className="w-3.5 h-3.5 text-stone" />;
  }

  const readByOthers = message.readBy?.some(r => r.user !== message.sender);
  
  return readByOthers ? (
    <CheckCheck className="w-3.5 h-3.5 text-hope-green" />
  ) : (
    <Check className="w-3.5 h-3.5 text-stone" />
  );
};

const MessageContent = ({ message }) => {
  switch (message.type) {
    case 'photo':
      return (
        <div className="relative group">
          <img
            src={message.metadata?.photoUrl || message.content}
            alt="Shared photo"
            className="max-w-[250px] max-h-[250px] rounded-xl object-cover cursor-pointer"
            loading="lazy"
            onClick={() => window.open(message.metadata?.photoUrl || message.content, '_blank')}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Image className="w-6 h-6 text-white" />
          </div>
        </div>
      );

    case 'voice':
      return (
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-terracotta/20 flex items-center justify-center hover:bg-terracotta/30 transition-colors">
            <Play className="w-4 h-4 text-terracotta" />
          </button>
          <div>
            <div className="h-1.5 w-32 bg-warm-gray/50 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-terracotta rounded-full" />
            </div>
            <span className="text-xs text-stone mt-1">
              {message.metadata?.voiceDuration || '0:00'}
            </span>
          </div>
        </div>
      );

    case 'contact':
      return (
        <div className="bg-white dark:bg-charcoal/30 rounded-lg p-3 border border-warm-gray/30">
          <p className="text-sm font-medium mb-1">
            Shared contact
          </p>
          <p className="text-xs text-stone">
            {message.metadata?.contactType}: {message.metadata?.contactValue}
          </p>
        </div>
      );

    case 'system':
      return (
        <div className="text-center">
          <span className="px-3 py-1 bg-warm-gray/30 text-stone text-xs rounded-full">
            {message.content}
          </span>
        </div>
      );

    case 'file':
      return (
        <div className="flex items-center gap-3 bg-white dark:bg-charcoal/30 rounded-lg p-3 border border-warm-gray/30">
          <File className="w-8 h-8 text-terracotta" />
          <div>
            <p className="text-sm font-medium">{message.metadata?.fileName || 'File'}</p>
            <p className="text-xs text-stone">{message.metadata?.fileSize || 'Unknown size'}</p>
          </div>
        </div>
      );

    default:
      return (
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
      );
  }
};

export const MessageBubble = ({ message, isOwn, showAvatar, previousMessage }) => {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const isSystem = message.type === 'system';
  const isConsecutive = previousMessage?.sender === message.sender &&
    new Date(message.createdAt).getTime() - new Date(previousMessage.createdAt).getTime() < 5 * 60 * 1000;

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center my-2"
      >
        <MessageContent message={message} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar */}
      {!isOwn && showAvatar && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-terracotta to-sahara flex items-center justify-center text-white text-xs font-medium">
            {message.sender?.realName?.[0]?.toUpperCase() || '?'}
          </div>
        </div>
      )}

      {!isOwn && !showAvatar && <div className="w-8 flex-shrink-0" />}

      {/* Message Content */}
      <div
        className={`relative max-w-[70%] group ${
          isOwn ? 'items-end' : 'items-start'
        }`}
      >
        {/* Sender Name */}
        {!isOwn && showAvatar && (
          <p className="text-xs text-stone mb-1 ml-1">
            {message.sender?.realName || 'User'}
          </p>
        )}

        {/* Bubble */}
        <div
          className={`
            rounded-2xl px-4 py-2.5 shadow-sm
            ${isOwn 
              ? 'bg-terracotta text-white rounded-br-sm' 
              : 'bg-cream dark:bg-charcoal/20 text-charcoal rounded-bl-sm border border-warm-gray/30'
            }
            ${message.pending ? 'opacity-70' : ''}
          `}
        >
          <MessageContent message={message} />
        </div>

        {/* Time and Status */}
        <div
          className={`
            flex items-center gap-1 mt-1 text-xs text-stone
            ${isOwn ? 'justify-end' : 'justify-start'}
            ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
            transition-opacity
          `}
        >
          <span>{formatMessageTime(message.createdAt)}</span>
          <MessageStatus message={message} isOwn={isOwn} />
        </div>
      </div>

      {isOwn && showAvatar && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sahara to-terracotta flex items-center justify-center text-white text-xs font-medium">
            {user?.realName?.[0]?.toUpperCase() || '?'}
          </div>
        </div>
      )}
    </motion.div>
  );
};
