import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MapPin, Clock, Send } from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { useSuccessStories } from '../../hooks/usePosts';
import { useState } from 'react';

const StoryCard = ({ story }) => {
  const { language } = useLanguage();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(story.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');

  // Get text based on language
  const title = story.title?.[language] || story.title?.en;
  const content = story.story?.[language] || story.story?.en;

  const handleLike = async () => {
    try {
      await fetch(`/api/stories/${story._id}/like`, { method: 'POST' });
      setLiked(!liked);
      setLikesCount(prev => liked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Like failed:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    try {
      await fetch(`/api/stories/${story._id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: comment })
      });
      setComment('');
      // Refresh comments
    } catch (error) {
      console.error('Comment failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Author Header */}
      <div className="p-4 flex items-center gap-3">
        {story.poster?.avatarUrl ? (
          <img 
            src={story.poster.avatarUrl} 
            alt={story.poster.name} 
            className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" 
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sahara to-terracotta 
                        flex items-center justify-center text-white font-medium text-sm shadow-sm">
            {story.poster?.name?.[0] || '?'}
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-sm">
            {story.poster?.name || 'Anonymous'}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            {story.city}
            <Clock className="w-3 h-3 ml-1" />
            {story.year}
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="px-4 pb-3">
        {title && <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
          {content}
        </p>
      </div>

      {/* Story Image (if any) */}
      {story.images?.[0] && (
        <div className="aspect-video bg-gray-100">
          <img src={story.images[0]} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-50">
        <div className="flex items-center justify-between">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm transition-colors
              ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            {likesCount}
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500"
          >
            <MessageCircle className="w-4 h-4" />
            {story.comments?.length || 0}
          </button>
          
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-500">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-3 space-y-2">
            {story.comments?.map((comment, idx) => (
              <div key={idx} className="flex gap-2 text-sm">
                <span className="font-medium text-gray-700">
                  {comment.user?.realName || 'User'}:
                </span>
                <span className="text-gray-600">{comment.text}</span>
              </div>
            ))}
            
            {/* Add Comment */}
            <form onSubmit={handleComment} className="flex gap-2 mt-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 text-sm border border-gray-200 rounded-full px-3 py-1.5
                         focus:outline-none focus:border-hope-green"
              />
              <button
                type="submit"
                disabled={!comment.trim()}
                className="text-hope-green disabled:text-gray-300"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const SuccessStories = ({ limit = 6 }) => {
  const { language } = useLanguage();
  const { data, isLoading } = useSuccessStories();
  const [activeFilter, setActiveFilter] = useState('recent');

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-2xl h-48" />
        ))}
      </div>
    );
  }

  const stories = data?.stories || [];

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Simple Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto py-2 scrollbar-hide">
        {['recent', 'popular', 'nearby'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all
              ${activeFilter === filter 
                ? 'bg-hope-green text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {language === 'am' 
              ? { recent: 'የቅርብ ጊዜ', popular: 'ታዋቂ', nearby: 'በአቅራቢያ' }[filter]
              : filter}
          </button>
        ))}
      </div>

      {/* Stories Feed */}
      <div className="space-y-4">
        {stories.slice(0, limit).map((story) => (
          <StoryCard key={story._id} story={story} />
        ))}
      </div>

      {/* Empty State */}
      {stories.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">📖</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {language === 'am' ? 'እስካሁን ምንም ታሪኮች የሉም' : 'No stories yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {language === 'am' 
              ? 'የእርስዎን የስኬት ታሪክ ያጋሩ እና ሌሎችን ያነሳሱ!'
              : 'Share your success story and inspire others!'}
          </p>
          <Link
            to="/wanted/stories/share"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-hope-green text-white 
                     rounded-full hover:bg-hope-green/90 transition-colors"
          >
            <Heart className="w-4 h-4" />
            {language === 'am' ? 'ታሪክ አጋራ' : 'Share Your Story'}
          </Link>
        </div>
      )}
    </div>
  );
};
