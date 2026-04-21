import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MessageCircle, 
  X, 
  ChevronRight,
  Users,
  Clock,
  CheckCheck,
  Circle
} from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { formatRelativeTime } from '../../utils/formatters';
import { TrustBadge } from '../profile/TrustBadge';

export const ChatSidebar = ({ rooms = [], currentRoomId, isOpen, onClose }) => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRooms = rooms.filter(room => {
    const otherParticipant = room.participants?.find(p => p.role !== 'poster' || p.role === 'claimant');
    const name = otherParticipant?.profile?.realName || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getOtherParticipant = (room) => {
    return room.participants?.find(p => p.role === 'claimant' || p.role === 'poster');
  };

  const getLastMessagePreview = (room) => {
    if (!room.lastMessage) return null;
    
    const message = room.lastMessage;
    if (message.type === 'photo') {
      return language === 'am' ? '📷 ፎቶ' : '📷 Photo';
    }
    if (message.type === 'voice') {
      return language === 'am' ? '🎤 የድምጽ መልእክት' : '🎤 Voice message';
    }
    if (message.type === 'system') {
      return message.content;
    }
    
    const preview = message.content?.slice(0, 30);
    return preview + (message.content?.length > 30 ? '...' : '');
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
          w-80 lg:w-96 bg-cream dark:bg-charcoal/10 border-r border-warm-gray/30
          flex flex-col h-screen lg:h-full
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
        `}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-warm-gray/30">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-xl font-semibold text-charcoal">
              {language === 'am' ? 'መልእክቶች' : 'Messages'}
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-stone hover:text-charcoal rounded-full hover:bg-warm-gray/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'am' ? 'ፈልግ...' : 'Search...'}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-charcoal/20 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Room List */}
        <div className="flex-1 overflow-y-auto">
          {filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageCircle className="w-12 h-12 text-stone mb-3 opacity-50" />
              <p className="text-stone">
                {searchTerm 
                  ? (language === 'am' ? 'ምንም ውጤት አልተገኘም' : 'No results found')
                  : (language === 'am' ? 'እስካሁን ምንም መልእክት የለም' : 'No messages yet')
                }
              </p>
            </div>
          ) : (
            <div className="py-2">
              <AnimatePresence>
                {filteredRooms.map((room) => {
                  const other = getOtherParticipant(room);
                  const isActive = room._id === currentRoomId;
                  const hasUnread = room.unreadCount > 0;

                  return (
                    <motion.div
                      key={room._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Link
                        to={`/wanted/chat/${room._id}`}
                        onClick={() => onClose()}
                        className={`
                          block p-4 transition-colors relative
                          ${isActive 
                            ? 'bg-terracotta/10 border-l-4 border-terracotta' 
                            : 'hover:bg-warm-gray/20 border-l-4 border-transparent'
                          }
                          ${hasUnread ? 'bg-warmth/5' : ''}
                        `}
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-terracotta to-sahara flex items-center justify-center text-white font-medium text-lg">
                              {other?.profile?.realName?.[0]?.toUpperCase() || '?'}
                            </div>
                            {hasUnread && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-terracotta rounded-full border-2 border-cream" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className={`font-medium truncate ${hasUnread ? 'text-charcoal' : 'text-charcoal'}`}>
                                  {other?.profile?.realName || (language === 'am' ? 'ተጠቃሚ' : 'User')}
                                </span>
                                {room.isGroupChat && (
                                  <Users className="w-3.5 h-3.5 text-stone" />
                                )}
                              </div>
                              <span className="text-xs text-stone flex-shrink-0">
                                {room.lastMessage?.createdAt && formatRelativeTime(room.lastMessage.createdAt, language)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <p className={`text-sm truncate ${hasUnread ? 'text-charcoal font-medium' : 'text-stone'}`}>
                                {getLastMessagePreview(room) || (language === 'am' ? 'አዲስ ውይይት' : 'New conversation')}
                              </p>
                              
                              <div className="flex items-center gap-1">
                                {hasUnread ? (
                                  <span className="min-w-[1.25rem] h-5 px-1.5 bg-terracotta text-white text-xs font-medium rounded-full flex items-center justify-center">
                                    {room.unreadCount}
                                  </span>
                                ) : room.lastMessage?.sender === other?.user ? null : (
                                  room.lastMessage?.readBy?.some(r => r.user !== room.lastMessage.sender) ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-hope-green" />
                                  ) : (
                                    <Circle className="w-3.5 h-3.5 text-stone" />
                                  )
                                )}
                              </div>
                            </div>

                            {/* Trust Badge */}
                            {other?.profile?.trustScore && (
                              <div className="mt-1">
                                <TrustBadge score={other.profile.trustScore} size="sm" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Active Indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeRoom"
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                          >
                            <ChevronRight className="w-5 h-5 text-terracotta" />
                          </motion.div>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-warm-gray/30">
          <p className="text-xs text-center text-stone">
            {language === 'am'
              ? 'መልእክቶች ከ30 ቀናት በኋላ ያበቃሉ'
              : 'Messages expire after 30 days'
            }
          </p>
        </div>
      </motion.aside>
    </>
  );
};
