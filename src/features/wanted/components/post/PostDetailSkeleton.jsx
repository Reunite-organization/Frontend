import { motion } from 'framer-motion';

export const PostDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-warm-white">
      <section className="relative bg-gradient-to-b from-cream to-transparent pt-20 pb-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Back button skeleton */}
            <div className="mb-8">
              <div className="h-6 w-20 bg-warm-gray/30 rounded animate-pulse" />
            </div>

            {/* Status banner skeleton */}
            <div className="mb-8 p-4 rounded-2xl border bg-hope-green/5 border-hope-green/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-hope-green/30 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-warm-gray/30 rounded animate-pulse" />
                  <div className="h-3 w-48 bg-warm-gray/30 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Main content skeleton */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cream rounded-3xl p-8 md:p-12 border border-warm-gray/30 shadow-lg"
            >
              {/* Poster info skeleton */}
              <div className="flex items-start justify-between mb-8 pb-6 border-b border-warm-gray/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-warm-gray/30 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-6 w-32 bg-warm-gray/30 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-warm-gray/30 rounded animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Category tag skeleton */}
              <div className="h-8 w-32 bg-warm-gray/30 rounded-full animate-pulse mb-6" />

              {/* Memory content skeleton */}
              <div className="space-y-3 mb-8">
                <div className="h-4 w-full bg-warm-gray/30 rounded animate-pulse" />
                <div className="h-4 w-full bg-warm-gray/30 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-warm-gray/30 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-warm-gray/30 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-warm-gray/30 rounded animate-pulse" />
              </div>

              {/* Action button skeleton */}
              <div className="border-t border-warm-gray/30 pt-8">
                <div className="flex justify-center">
                  <div className="h-12 w-40 bg-warm-gray/30 rounded-full animate-pulse" />
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </section>
    </div>
  );
};
