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
  Circle,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { formatRelativeTime } from '../../utils/formatters';
import { TrustBadge } from '../profile/TrustBadge';
import { useAuth } from '../../../../hooks/useAuth';

export const ChatSidebar = ({ rooms = [], currentRoomId, isOpen, onClose }) => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const { user: currentUser } = useAuth();

  // ✅ FIXED: Get other participant with proper checks
  const getOtherParticipant = (room) => {
    if (!room) return null;

    // If service already provided otherUser, use it
    if (room.otherUser) {
      const profile = room.otherUser;
      return {
        user: profile.user || profile._id,
        profile: {
          realName: profile.realName || profile.displayName || 'Unknown',
          displayName: profile.displayName || '',
          trustScore: profile.trustScore || 0,
          avatarUrl: profile.avatarUrl,
        },
      };
    }

    if (!currentUser?.id || !room?.participants?.length) return null;
    
    const currentUserId = currentUser.id.toString();
    
    // Find the other participant who hasn't left
    let other = room.participants.find(p => {
      if (!p.user) return false;
      const pUserId = (p.user?._id || p.user)?.toString();
      return pUserId !== currentUserId && !p.hasLeft;
    });
    
    // Fallback: Just find anyone who isn't the current user
    if (!other) {
      other = room.participants.find(p => {
        if (!p.user) return false;
        const pUserId = (p.user?._id || p.user)?.toString();
        return pUserId !== currentUserId;
      });
    }
    
    if (!other) return null;
    
    const profile = other.profile || other.user?.profile || {};
    
    return {
      ...other,
      profile: {
        realName: profile.realName || profile.displayName || 'Unknown',
        displayName: profile.displayName || '',
        trustScore: profile.trustScore || 0,
        avatarUrl: profile.avatarUrl,
      },
    };
  };

  const filteredRooms = rooms.filter(room => {
    const otherParticipant = getOtherParticipant(room);
    const name = otherParticipant?.profile?.realName || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gradient-to-br from-charcoal/60 to-charcoal/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
          w-80 lg:w-96 bg-gradient-to-b from-cream via-cream/95 to-warmth/10 
          border-r border-warm-gray/20
          flex flex-col h-screen lg:h-full shadow-2xl lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out
        `}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-terracotta to-sahara rounded-xl">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-charcoal">
                  {language === 'am' ? 'መልእክቶች' : 'Messages'}
                </h2>
                {rooms.length > 0 && (
                  <p className="text-xs text-stone mt-0.5">
                    {rooms.length} {language === 'am' ? 'ውይይቶች' : 'conversations'}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-warm-gray/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-stone" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'am' ? 'ውይይቶችን ይፈልጉ...' : 'Search conversations...'}
              className="w-full pl-12 pr-4 py-3 bg-white/70 border-2 border-warm-gray/20 rounded-2xl focus:border-terracotta/50 focus:ring-4 focus:ring-terracotta/10 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Room List */}
        <div className="flex-1 overflow-y-auto px-3">
          {filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageCircle className="w-16 h-16 text-stone/30 mb-6" />
              <h3 className="text-lg font-semibold text-charcoal/50 mb-2">
                {searchTerm 
                  ? (language === 'am' ? 'ምንም ውጤት አልተገኘም' : 'No results found')
                  : (language === 'am' ? 'እስካሁን ምንም መልእክት የለም' : 'No messages yet')
                }
              </h3>
              <p className="text-sm text-stone/40">
                {searchTerm 
                  ? (language === 'am' ? 'ሌላ ቁልፍ ቃል ይሞክሩ' : 'Try a different search term')
                  : (language === 'am' ? 'የመጀመሪያ ውይይትዎን ይጀምሩ' : 'Start your first conversation')
                }
              </p>
            </div>
          ) : (
            <div className="py-3 space-y-1">
              <AnimatePresence mode="popLayout">
                {filteredRooms.map((room, index) => {
                  if (!room) return null;
                  const other = getOtherParticipant(room);
                  const isActive = room._id === currentRoomId;
                  const hasUnread = room.unreadCount > 0;

                  // ✅ FIXED: Get the correct display name with extra safety
                  const displayName = other?.profile?.realName || 
                                     other?.profile?.displayName || 
                                     (language === 'am' ? 'ተጠቃሚ' : 'User');

                  const initials = displayName && typeof displayName === 'string' 
                    ? displayName[0]?.toUpperCase() 
                    : '?';

                  return (
                    <motion.div
                      key={room._id}
                      layout
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={`/wanted/chat/${room._id}`}
                        onClick={() => onClose()}
                        className="block group"
                      >
                        <div
                          className={`
                            relative p-4 rounded-2xl transition-all duration-300
                            ${isActive 
                              ? 'bg-gradient-to-r from-terracotta/20 via-terracotta/10 to-transparent border-2 border-terracotta/30' 
                              : 'hover:bg-warm-gray/10 border-2 border-transparent'
                            }
                          `}
                        >
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-terracotta to-sahara flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                                {other?.profile?.avatarUrl ? (
                                  <img src={other.profile.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                                ) : (
                                  initials
                                )}
                              </div>
                              {hasUnread && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta rounded-full border-2 border-cream flex items-center justify-center">
                                  <Sparkles className="w-2.5 h-2.5 text-white" />
                                </span>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                {/* ✅ FIXED: Display correct name */}
                                <span className={`font-semibold truncate ${
                                  hasUnread ? 'text-charcoal' : 'text-charcoal/70'
                                }`}>
                                  {displayName}
                                </span>
                                {room.lastMessage?.createdAt && (
                                  <span className="text-xs text-stone/60 flex-shrink-0 ml-2">
                                    {formatRelativeTime(room.lastMessage.createdAt, language)}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <p className={`text-sm truncate ${
                                  hasUnread ? 'text-charcoal/80 font-medium' : 'text-stone/60'
                                }`}>
                                  {getLastMessagePreview(room)}
                                </p>
                                {hasUnread && (
                                  <span className="min-w-[1.5rem] h-6 px-2 bg-terracotta text-white text-xs font-bold rounded-full flex items-center justify-center ml-2">
                                    {room.unreadCount}
                                  </span>
                                )}
                              </div>

                              {/* Trust Badge */}
                              {other?.profile?.trustScore > 0 && (
                                <div className="mt-2">
                                  <TrustBadge score={other.profile.trustScore} size="sm" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-warm-gray/20">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-3.5 h-3.5 text-stone/50" />
            <p className="text-xs text-stone/50">
              {language === 'am'
                ? 'መልእክቶች ከ30 ቀናት በኋላ ያበቃሉ'
                : 'Messages expire after 30 days'
              }
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
