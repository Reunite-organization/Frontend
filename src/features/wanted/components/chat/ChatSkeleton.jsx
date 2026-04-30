import { motion } from 'framer-motion';

export const ChatSkeleton = () => {
  const shimmerClass = "animate-shimmer bg-gradient-to-r from-warm-gray/20 via-warm-gray/10 to-warm-gray/20 bg-[length:200%_100%]";
  
  return (
    <div className="h-screen flex bg-gradient-to-br from-warm-white via-cream/30 to-warmth/5">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex flex-col w-96 bg-gradient-to-b from-cream via-cream/95 to-warmth/10 border-r border-warm-gray/20 backdrop-blur-sm">
        {/* Sidebar Header */}
        <div className="flex-shrink-0 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warm-gray/40 to-warm-gray/20 animate-pulse" />
              <div className="space-y-2">
                <div className={`h-5 w-28 rounded-lg ${shimmerClass}`} />
                <div className={`h-3 w-20 rounded-md ${shimmerClass}`} />
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-warm-gray/20 animate-pulse" />
          </div>
          
          {/* Search Bar Skeleton */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-terracotta/10 to-sahara/10 rounded-2xl blur-lg" />
            <div className="h-12 w-full bg-white/50 backdrop-blur-sm border border-warm-gray/20 rounded-2xl animate-pulse flex items-center px-4">
              <div className="w-4 h-4 rounded-full bg-warm-gray/30 mr-3" />
              <div className={`h-3 w-32 rounded-md ${shimmerClass}`} />
            </div>
          </div>
        </div>

        {/* Chat List Skeleton */}
        <div className="flex-1 px-3 py-2 space-y-1">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="relative"
            >
              <div className="flex items-start gap-3 p-3.5 rounded-2xl hover:bg-warm-gray/5 transition-colors duration-200">
                {/* Avatar with status */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-warm-gray/40 to-warm-gray/20 animate-pulse shadow-lg" />
                  {i === 0 && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-warm-gray/50 to-warm-gray/30 rounded-full border-2 border-cream"
                    />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`h-4 w-24 rounded-md ${shimmerClass}`} />
                    <div className={`h-3 w-12 rounded-md ${shimmerClass} opacity-60`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`h-3.5 w-40 rounded-md ${shimmerClass} opacity-70`} />
                    {i < 2 && (
                      <div className="min-w-[1.5rem] h-5 bg-gradient-to-r from-warm-gray/40 to-warm-gray/20 rounded-full animate-pulse" />
                    )}
                  </div>
                  {i % 3 === 0 && (
                    <div className="mt-2 flex gap-1">
                      <div className={`h-5 w-14 rounded-full ${shimmerClass} opacity-50`} />
                      <div className="h-5 w-1 rounded-full bg-warm-gray/20" />
                      <div className={`h-5 w-12 rounded-full ${shimmerClass} opacity-50`} />
                    </div>
                  )}
                </div>
              </div>
              {i < 5 && <div className="mx-4 h-px bg-gradient-to-r from-transparent via-warm-gray/10 to-transparent" />}
            </motion.div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="flex-shrink-0 p-4 border-t border-warm-gray/10 bg-gradient-to-t from-cream/80 to-transparent backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warm-gray/20 animate-pulse" />
            <div className={`h-3 w-36 rounded-md ${shimmerClass}`} />
          </div>
        </div>
      </div>

      {/* Main Chat Area Skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex-shrink-0 bg-gradient-to-b from-cream/95 via-cream/90 to-transparent backdrop-blur-xl border-b border-warm-gray/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-warm-gray/40 to-warm-gray/20 animate-pulse shadow-lg" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-br from-hope-green/40 to-emerald-400/30 rounded-full border-2 border-cream animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <div className={`h-5 w-36 rounded-lg ${shimmerClass}`} />
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-20 rounded-md ${shimmerClass} opacity-70`} />
                  <div className="w-1 h-1 rounded-full bg-warm-gray/30" />
                  <div className={`h-3 w-16 rounded-md ${shimmerClass} opacity-50`} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-9 h-9 rounded-xl bg-warm-gray/20 animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Date Divider */}
          <div className="flex items-center justify-center my-4">
            <div className={`h-6 w-28 rounded-full ${shimmerClass} opacity-60`} />
          </div>

          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex items-end gap-2.5 max-w-[75%] ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar (only for received messages) */}
                {i % 2 === 0 && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-warm-gray/40 to-warm-gray/20 animate-pulse flex-shrink-0" />
                )}
                
                {/* Message Bubble */}
                <div className={`flex flex-col ${i % 2 === 0 ? 'items-start' : 'items-end'} gap-1`}>
                  <div 
                    className={`
                      rounded-2xl px-4 py-3 animate-pulse
                      ${i % 2 === 0 
                        ? 'bg-gradient-to-br from-cream to-warm-white border border-warm-gray/10 rounded-bl-md shadow-sm' 
                        : 'bg-gradient-to-br from-terracotta/20 to-sahara/10 rounded-br-md shadow-sm'
                      }
                    `}
                  >
                    <div className={`space-y-2 ${i % 2 === 0 ? 'w-56' : 'w-48'}`}>
                      <div className={`h-3 rounded-md ${i % 2 === 0 ? shimmerClass : 'bg-terracotta/10'}`} />
                      <div className={`h-3 w-3/4 rounded-md ${i % 2 === 0 ? shimmerClass : 'bg-terracotta/10'}`} />
                      {i % 3 === 0 && (
                        <div className={`h-3 w-1/2 rounded-md ${i % 2 === 0 ? shimmerClass : 'bg-terracotta/10'}`} />
                      )}
                    </div>
                  </div>
                  
                  {/* Timestamp */}
                  <div className={`flex items-center gap-1.5 px-1 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                    <div className={`h-3 w-10 rounded-md ${shimmerClass} opacity-50`} />
                    {i % 2 !== 0 && (
                      <div className="w-3.5 h-3.5 rounded-full bg-warm-gray/20 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 bg-gradient-to-t from-cream/95 via-cream/80 to-transparent backdrop-blur-xl border-t border-warm-gray/10 px-6 py-4">
          <div className="flex items-end gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-warm-gray/30 to-warm-gray/10 animate-pulse flex-shrink-0 shadow-inner" />
            <div className="flex-1 relative">
              <div className="h-14 w-full bg-white/60 backdrop-blur-sm border border-warm-gray/15 rounded-2xl animate-pulse shadow-inner flex items-center px-5">
                <div className="flex items-center gap-2 w-full">
                  <div className={`h-3 w-28 rounded-md ${shimmerClass}`} />
                  <div className="flex-1" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-warm-gray/20 animate-pulse" />
                    <div className="w-8 h-8 rounded-lg bg-warm-gray/20 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-terracotta/30 to-sahara/20 animate-pulse flex-shrink-0 shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
