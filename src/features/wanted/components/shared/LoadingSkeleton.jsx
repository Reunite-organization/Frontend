import { motion } from 'framer-motion';

export const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const skeletons = {
    card: () => (
      <div className="card-humanitarian animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="h-6 w-24 bg-warm-gray/50 rounded-full" />
          <div className="h-6 w-16 bg-warm-gray/50 rounded-full" />
        </div>
        <div className="space-y-3 mb-4">
          <div className="h-4 bg-warm-gray/50 rounded w-full" />
          <div className="h-4 bg-warm-gray/50 rounded w-5/6" />
          <div className="h-4 bg-warm-gray/50 rounded w-4/6" />
        </div>
        <div className="flex gap-3 mb-4">
          <div className="h-4 w-20 bg-warm-gray/50 rounded" />
          <div className="h-4 w-16 bg-warm-gray/50 rounded" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-warm-gray/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-warm-gray/50" />
            <div className="h-4 w-20 bg-warm-gray/50 rounded" />
          </div>
          <div className="h-8 w-8 rounded-full bg-warm-gray/50" />
        </div>
      </div>
    ),
    detail: () => (
      <div className="space-y-8">
        <div className="h-12 w-32 bg-warm-gray/50 rounded-full" />
        <div className="bg-cream rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-warm-gray/50" />
            <div className="space-y-2">
              <div className="h-6 w-32 bg-warm-gray/50 rounded" />
              <div className="h-4 w-48 bg-warm-gray/50 rounded" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-warm-gray/50 rounded w-full" />
            <div className="h-4 bg-warm-gray/50 rounded w-full" />
            <div className="h-4 bg-warm-gray/50 rounded w-2/3" />
          </div>
        </div>
      </div>
    ),
    grid: () => (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <skeletons.card key={i} />
        ))}
      </div>
    ),
  };

  const SkeletonComponent = skeletons[type] || skeletons.card;

  if (type === 'grid') {
    return <SkeletonComponent />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </motion.div>
  );
};
