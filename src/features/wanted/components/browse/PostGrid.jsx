import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PostCard } from './PostCard';
import { EmptyState } from './EmptyState';
import { LoadingSkeleton } from '../shared/LoadingSkeleton';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '../../../../lib/i18n';

export const PostGrid = ({ posts, hasMore, loadMore, isLoading }) => {
  const { language } = useLanguage();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, loadMore]);

  // 🚨 CRITICAL: Ensure posts is always an array
  const safePosts = Array.isArray(posts) ? posts : [];
  
  // Filter out invalid posts
  const validPosts = safePosts.filter(post => post && typeof post === 'object' && post._id);
  const shouldAnimateList = useMemo(() => {
    // Animation is nice for small lists, but becomes expensive on large feeds / low-end phones.
    if (reducedMotion) return false;
    return validPosts.length <= 24;
  }, [reducedMotion, validPosts.length]);

  // Loading state
  if (isLoading && validPosts.length === 0) {
    return <LoadingSkeleton type="grid" count={6} />;
  }

  // Empty state
  if (validPosts.length === 0) {
    return (
      <EmptyState
        title={language === 'am' ? 'ምንም ልጥፎች አልተገኙም' : 'No posts found'}
        description={
          language === 'am'
            ? 'የፍለጋ መስፈርትዎን ያስተካክሉ ወይም አዲስ ልጥፍ ይፍጠሩ'
            : 'Try adjusting your filters or create a new post'
        }
        action={{
          label: language === 'am' ? 'ልጥፍ ፍጠር' : 'Create Post',
          to: '/wanted/create',
        }}
      />
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shouldAnimateList ? (
          <AnimatePresence mode="popLayout">
            {validPosts.map((post, index) => (
              <motion.div
                key={post._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.25,
                  delay: Math.min(index * 0.04, 0.2)
                }}
              >
                <PostCard post={post} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          validPosts.map((post, index) => (
            <div key={post._id}>
              <PostCard post={post} index={index} />
            </div>
          ))
        )}
      </div>

      {/* Load More Trigger */}
      {hasMore && (
        <div ref={ref} className="py-12 flex justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 bg-terracotta rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
            <p className="text-sm text-stone">
              {language === 'am' ? 'ተጨማሪ በመጫን ላይ...' : 'Loading more posts...'}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
