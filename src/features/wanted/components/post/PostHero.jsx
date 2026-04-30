import { motion } from 'framer-motion';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Users, 
  Shield, 
  Award,
  Clock,
  Share2
} from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { TrustBadge } from '../profile/TrustBadge';
import { formatRelativeTime } from '../../utils/formatters';
import { CATEGORIES } from '../../utils/constants';

export const PostHero = ({ post, onShare }) => {
  const { language } = useLanguage();
  
  const category = CATEGORIES.find(c => c.value === post.category);
  const categoryLabel = category?.[language === 'am' ? 'am' : 'en'] || post.category;

  const statusConfig = {
    active: {
      icon: Clock,
      color: 'text-hope-green',
      bg: 'bg-hope-green/10',
      border: 'border-hope-green/20',
      label: { en: 'Actively Looking', am: 'በንቃት በመፈለግ ላይ' }
    },
    claimed: {
      icon: Users,
      color: 'text-warmth',
      bg: 'bg-warmth/10',
      border: 'border-warmth/20',
      label: { en: 'Claimed', am: 'ተጠይቋል' }
    },
    reconnected: {
      icon: Award,
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/20',
      label: { en: 'Reconnected!', am: 'ተገኝተዋል!' }
    }
  };

  const status = statusConfig[post.status] || statusConfig.active;
  const StatusIcon = status.icon;

  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C4654A' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative">
        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.bg} ${status.border} border mb-6`}
        >
          <StatusIcon className={`w-4 h-4 ${status.color}`} />
          <span className={`text-sm font-medium ${status.color}`}>
            {language === 'am' ? status.label.am : status.label.en}
          </span>
          {post.status === 'active' && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hope-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-hope-green" />
            </span>
          )}
        </motion.div>

        {/* Category & Time */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warmth/10 rounded-full text-sm text-olive">
            <Heart className="w-3.5 h-3.5" />
            {categoryLabel}
          </span>
          <span className="text-sm text-stone flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatRelativeTime(post.createdAt, language)}
          </span>
        </div>

        {/* Poster Info */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-terracotta to-sahara flex items-center justify-center text-white text-xl font-medium shadow-md">
                {post.posterProfile?.realName?.[0]?.toUpperCase() || '?'}
              </div>
              {post.posterProfile?.verifiedReconnector && (
                <Shield className="absolute -bottom-1 -right-1 w-5 h-5 text-hope-green bg-warm-white rounded-full p-0.5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display text-lg font-semibold text-charcoal">
                  {post.posterProfile?.realName || (language === 'am' ? 'ስም ያልተገለጸ' : 'Anonymous')}
                </h2>
                <TrustBadge score={post.posterProfile?.trustScore} />
              </div>
              <div className="flex items-center gap-4 text-sm text-stone">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {post.city}{post.country && `, ${post.country}`}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.year}
                  {post.timeframe && ` (${post.timeframe})`}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onShare}
            className="p-3 text-olive hover:text-terracotta bg-cream rounded-full transition-colors shadow-sm"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Group Post Indicator */}
        {post.isGroupPost && (
          <div className="mb-4 p-3 bg-warmth/5 rounded-xl border border-warmth/20">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-terracotta" />
              <span className="text-sm font-medium text-charcoal">
                {language === 'am' ? 'የቡድን ፍለጋ' : 'Group Search'}
              </span>
              <span className="text-xs text-stone">
                ({post.approvedClaimants?.length || 0}/{post.maxClaimants} {language === 'am' ? 'ተገኝተዋል' : 'found'})
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
