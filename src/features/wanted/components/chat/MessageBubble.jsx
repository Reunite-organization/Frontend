import { motion } from 'framer-motion';
import { Check, CheckCheck, Clock, Image, File, Trash2 } from 'lucide-react';
import { formatMessageTime } from '../../utils/formatters';
import { useAuth } from '../../../../hooks/useAuth';
import { apiBaseUrl } from '../../../../lib/apiConfig';
import { useState } from 'react';

const MessageStatus = ({ message, isOwn }) => {
  if (!isOwn) return null;

  if (message.pending) {
    return <Clock className="w-3 h-3 text-stone/60" />;
  }

  const readByOthers = message.readBy?.some(r => r.user !== message.sender);
  
  return readByOthers ? (
    <CheckCheck className="w-3 h-3 text-hope-green" />
  ) : (
    <Check className="w-3 h-3 text-stone/60" />
  );
};

const resolveMediaUrl = (input) => {
  if (!input) return "";
  if (String(input).startsWith("/")) {
    return `${apiBaseUrl}${input}`;
  }
  return String(input).replace(/http:\/\/localhost:5173/g, apiBaseUrl);
};

const MessageContent = ({ message }) => {
  switch (message.type) {
  
case 'photo': {
  const rawUrl = message.metadata?.photoUrl || message.content;
  const photoUrl = resolveMediaUrl(rawUrl);
  
  return (
    <div className="relative group -mx-2 -my-1.5">
      <img
        src={photoUrl}
        alt="Shared photo"
        className="max-w-[220px] max-h-[220px] rounded-lg object-cover cursor-pointer shadow-sm"
        loading="lazy"
        onClick={() => window.open(photoUrl, '_blank')}
        onError={(e) => {
          e.target.style.display = 'none';
          const fallback = e.target.parentElement?.querySelector('.photo-fallback');
          if (fallback) fallback.classList.remove('hidden');
        }}
      />
      {/* Fallback */}
      <div className="photo-fallback hidden w-[220px] h-[220px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <Image className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500 mb-1">Image unavailable</p>
          <button
            onClick={() => window.open(photoUrl, '_blank')}
            className="text-xs text-blue-500 underline"
          >
            Open image
          </button>
        </div>
      </div>
    </div>
  );
}
    case 'voice':
      const voiceUrl = resolveMediaUrl(
        message.metadata?.voiceUrl || message.content,
      );
      return (
        <div className="flex items-center gap-2.5">
          <div className="flex-1 min-w-[180px]">
            <audio controls preload="metadata" className="h-9 w-full">
              <source src={voiceUrl} />
            </audio>
            <span className="text-[11px] opacity-70 mt-0.5 block">
              {message.metadata?.voiceDuration
                ? `${message.metadata.voiceDuration}s`
                : 'Voice message'}
            </span>
          </div>
        </div>
      );

    case 'contact':
      return (
        <div className="bg-white/10 rounded-lg px-3 py-2 -mx-1.5">
          <p className="text-xs font-medium opacity-90">Shared contact</p>
          <p className="text-[11px] opacity-70 mt-0.5">
            {message.metadata?.contactType}: {message.metadata?.contactValue}
          </p>
        </div>
      );

    case 'system':
      return (
        <div className="flex justify-center my-1">
          <span className="px-3 py-1 bg-warm-gray/10 text-stone/60 text-[11px] rounded-full font-medium">
            {message.content}
          </span>
        </div>
      );

    case 'file':
      return (
        <div className="flex items-center gap-2.5 bg-white/10 rounded-lg px-3 py-2 -mx-1.5">
          <File className="w-6 h-6 opacity-80" />
          <div className="min-w-0">
            <p className="text-xs font-medium truncate">{message.metadata?.fileName || 'File'}</p>
            <p className="text-[11px] opacity-70">{message.metadata?.fileSize || 'Unknown size'}</p>
          </div>
        </div>
      );

    default:
      return (
        <p className="text-[14px] leading-[1.45] whitespace-pre-wrap break-words">
          {message.content}
        </p>
      );
  }
};

export const MessageBubble = ({ message, isOwn, showAvatar, previousMessage, onDelete }) => {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const isSystem = message.type === 'system';
  const isConsecutive = previousMessage?.sender === message.sender &&
    new Date(message.createdAt).getTime() - new Date(previousMessage.createdAt).getTime() < 5 * 60 * 1000;

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        <MessageContent message={message} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex items-end ${isOwn ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex items-end gap-1.5 max-w-[85%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!isOwn && (
          <div className="flex-shrink-0 mb-0.5">
            {showAvatar ? (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-terracotta to-sahara flex items-center justify-center text-white text-[11px] font-semibold shadow-sm">
                {message.sender?.realName?.[0]?.toUpperCase() || '?'}
              </div>
            ) : (
              <div className="w-7 flex-shrink-0" />
            )}
          </div>
        )}

        {/* Message Body */}
        <div className={`flex flex-col min-w-0 ${isOwn ? 'items-end' : 'items-start'}`}>
          {/* Sender Name */}
          {!isOwn && showAvatar && !isConsecutive && (
            <span className="text-[11px] font-medium text-stone/60 mb-0.5 px-1">
              {message.sender?.realName || 'User'}
            </span>
          )}

          {/* Bubble */}
          <div
            className={`
              relative px-3.5 py-2 rounded-2xl
              ${isOwn 
                ? 'bg-terracotta text-white rounded-br-md' 
                : 'bg-white dark:bg-charcoal/40 text-charcoal dark:text-cream rounded-bl-md border border-warm-gray/10 dark:border-charcoal/20'
              }
              ${message.pending ? 'opacity-60' : ''}
              shadow-[0_1px_2px_rgba(0,0,0,0.05)]
              ${!isConsecutive && !isOwn ? 'mt-0.5' : ''}
            `}
          >
            <MessageContent message={message} />
          </div>

          {/* Timestamp, Status, and Actions */}
          <div
            className={`
              flex items-center gap-1 px-1 mt-0.5
              text-[10px] text-stone/50
              transition-all duration-150
              ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}
              ${isOwn ? 'flex-row-reverse' : 'flex-row'}
            `}
          >
            {isOwn && onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(message)}
                className="rounded p-0.5 text-stone/60 transition hover:bg-red-50 hover:text-red-600"
                aria-label="Delete message"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            ) : null}
            <span>{formatMessageTime(message.createdAt)}</span>
            <MessageStatus message={message} isOwn={isOwn} />
          </div>
        </div>

        {/* Own Avatar */}
        {isOwn && (
          <div className="flex-shrink-0 mb-0.5">
            {showAvatar ? (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-sahara to-terracotta flex items-center justify-center text-white text-[11px] font-semibold shadow-sm">
                {user?.realName?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            ) : (
              <div className="w-7 flex-shrink-0" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
