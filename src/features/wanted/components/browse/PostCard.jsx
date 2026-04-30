import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, Share2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useLanguage } from '../../../../lib/i18n';

export const PostCard = ({ post, index }) => {
  const { language } = useLanguage();
  
  const categoryLabels = {
    childhood_friend: { en: 'Childhood Friend', am: 'የልጅነት ጓደኛ' },
    old_neighbor: { en: 'Old Neighbor', am: 'የቀድሞ ጎረቤት' },
    former_colleague: { en: 'Former Colleague', am: 'የቀድሞ የስራ ባልደረባ' },
    school_friend: { en: 'School Friend', am: 'የትምህርት ቤት ጓደኛ' },
    community_member: { en: 'Community Member', am: 'የማህበረሰብ አባል' },
    event_connection: { en: 'Met at Event', am: 'በክስተት የተዋወቅን' },
    family_connection: { en: 'Family Connection', am: 'የቤተሰብ ግንኙነት' },
    other: { en: 'Other', am: 'ሌላ' },
  };

  const statusColors = {
    active: 'bg-hope-green/10 text-hope-green border-hope-green/20',
    claimed: 'bg-warmth/10 text-warmth border-warmth/20',
    reconnected: 'bg-success/10 text-success border-success/20',
  };

  const statusLabels = {
    active: { en: 'Looking', am: 'በመፈለግ ላይ' },
    claimed: { en: 'Claimed', am: 'ተጠይቋል' },
    reconnected: { en: 'Found', am: 'ተገኝቷል' },
  };

  const memoryText = post.memoryText?.[language] || post.memoryText?.en || post.memoryText?.am;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group card-humanitarian hover:border-terracotta/20"
    >
      <Link to={`/wanted/post/${post._id}`} className="block space-y-4">
        {/* Header - Category & Status */}
        <div className="flex items-start justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warm-gray/30 rounded-full text-xs font-medium text-olive">
            <Heart className="w-3 h-3" />
            {categoryLabels[post.category]?.[language] || post.category}
          </span>
          
          <span className={`text-xs px-2.5 py-1 rounded-full border ${statusColors[post.status]}`}>
            {statusLabels[post.status]?.[language]}
          </span>
        </div>

        {/* Memory Text */}
        <div>
          <p className="text-charcoal line-clamp-3 leading-relaxed">
            {memoryText}
          </p>
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-3 text-sm text-stone">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {post.city}
            {post.country && `, ${post.country}`}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {post.year}
          </span>
        </div>

        {/* Footer - Poster & Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-warm-gray/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sahara to-terracotta flex items-center justify-center text-white text-xs font-medium overflow-hidden">
              {post.posterProfile?.avatarUrl ? (
                <img src={post.posterProfile.avatarUrl} alt={post.posterProfile.realName} className="w-full h-full object-cover" />
              ) : (
                post.posterProfile?.realName?.[0]?.toUpperCase() || '?'
              )}
            </div>
            <div className="text-sm">
              <p className="font-medium text-charcoal">
                {post.posterProfile?.realName || 'Anonymous'}
              </p>
              <p className="text-xs text-stone">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {post.isGroupPost && (
              <span className="flex items-center gap-1 text-xs text-stone">
                <Users className="w-3.5 h-3.5" />
                {post.maxClaimants}
              </span>
            )}
            <button 
              className="p-2 text-stone hover:text-terracotta transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Handle share
              }}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
