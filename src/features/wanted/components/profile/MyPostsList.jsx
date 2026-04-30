import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye, 
  Share2,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../../lib/i18n';
import { formatRelativeTime } from '../../utils/formatters';
import { useDeletePost } from '../../hooks/usePosts';

const PostMenu = ({ post, onClose }) => {
  const { language } = useLanguage();
  const { mutate: deletePost } = useDeletePost();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-charcoal rounded-xl shadow-lg border border-warm-gray/30 overflow-hidden z-10"
    >
      <Link
        to={`/wanted/post/${post._id}`}
        className="w-full px-4 py-2.5 text-left hover:bg-cream transition-colors flex items-center gap-2 text-sm"
      >
        <Eye className="w-4 h-4" />
        {language === 'am' ? 'ይመልከቱ' : 'View'}
      </Link>
      
      {post.status === 'active' && (
        <Link
          to={`/wanted/post/${post._id}/edit`}
          className="w-full px-4 py-2.5 text-left hover:bg-cream transition-colors flex items-center gap-2 text-sm"
        >
          <Edit3 className="w-4 h-4" />
          {language === 'am' ? 'አርትዕ' : 'Edit'}
        </Link>
      )}
      
      <button
        onClick={() => {
          navigator.share?.({
            title: 'Reunite Post',
            url: `${window.location.origin}/wanted/post/${post._id}`,
          });
        }}
        className="w-full px-4 py-2.5 text-left hover:bg-cream transition-colors flex items-center gap-2 text-sm"
      >
        <Share2 className="w-4 h-4" />
        {language === 'am' ? 'አጋራ' : 'Share'}
      </button>
      
      <button
        onClick={() => {
          if (confirm(language === 'am' ? 'ልጥፉን መሰረዝ እንደሚፈልጉ እርግጠኛ ነዎት?' : 'Are you sure you want to delete this post?')) {
            deletePost(post._id);
          }
        }}
        className="w-full px-4 py-2.5 text-left hover:bg-error/10 transition-colors flex items-center gap-2 text-sm text-error"
      >
        <Trash2 className="w-4 h-4" />
        {language === 'am' ? 'ሰርዝ' : 'Delete'}
      </button>
    </motion.div>
  );
};

export const MyPostsList = ({ posts = [], isLoading }) => {
  const { language } = useLanguage();
  const [activeMenu, setActiveMenu] = useState(null);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return { icon: Clock, color: 'text-hope-green', bg: 'bg-hope-green/10', label: { en: 'Active', am: 'ንቁ' } };
      case 'claimed':
        return { icon: Users, color: 'text-warmth', bg: 'bg-warmth/10', label: { en: 'Claimed', am: 'ተጠይቋል' } };
      case 'reconnected':
        return { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: { en: 'Reconnected', am: 'ተገኝቷል' } };
      default:
        return { icon: AlertCircle, color: 'text-stone', bg: 'bg-stone/10', label: { en: status, am: status } };
    }
  };

  if (isLoading) {
    return <LoadingSkeleton type="card" count={3} />;
  }

  if (!posts.length) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-stone mx-auto mb-3 opacity-50" />
        <p className="text-stone mb-4">
          {language === 'am' ? 'እስካሁን ምንም ልጥፍ የለም' : 'No posts yet'}
        </p>
        <Link to="/wanted/create" className="btn-primary inline-block">
          {language === 'am' ? 'የመጀመሪያ ልጥፍዎን ይፍጠሩ' : 'Create Your First Post'}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const statusConfig = getStatusConfig(post.status);
        const StatusIcon = statusConfig.icon;

        return (
          <motion.div
            key={post._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-cream rounded-xl border border-warm-gray/30 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {language === 'am' ? statusConfig.label.am : statusConfig.label.en}
                  </span>
                  <span className="text-xs text-stone">
                    {formatRelativeTime(post.createdAt, language)}
                  </span>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === post._id ? null : post._id)}
                    className="p-1.5 text-stone hover:text-charcoal rounded-full hover:bg-warm-gray/20 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  <AnimatePresence>
                    {activeMenu === post._id && (
                      <PostMenu 
                        post={post} 
                        onClose={() => setActiveMenu(null)} 
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <Link to={`/wanted/post/${post._id}`}>
                <p className="text-charcoal mb-3 line-clamp-3 hover:text-terracotta transition-colors">
                  {post.memoryText?.[language] || post.memoryText?.en || post.memoryText?.am}
                </p>
              </Link>

              <div className="flex items-center gap-4 text-xs text-stone">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {post.city}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.year}
                </span>
                {post.isGroupPost && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {post.maxClaimants}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.views || 0}
                </span>
              </div>

              {post.status === 'active' && post.claims?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-warm-gray/30">
                  <Link
                    to="/wanted/claims"
                    className="text-sm text-terracotta hover:text-clay flex items-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5" />
                    {post.claims.length} {language === 'am' ? 'የይገባኛል ጥያቄዎች' : 'claims pending'}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
