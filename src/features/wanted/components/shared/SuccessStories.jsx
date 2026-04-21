import { motion } from 'framer-motion';
import { Heart, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../../lib/i18n';
import { useSuccessStories } from '../../hooks/usePosts';
import { LoadingSkeleton } from './LoadingSkeleton';

export const SuccessStories = ({ limit = 3 }) => {
  const { language } = useLanguage();
  const { data, isLoading } = useSuccessStories();

  if (isLoading) {
    return <LoadingSkeleton type="grid" count={limit} />;
  }

  const stories = data?.stories?.slice(0, limit) || [];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story, idx) => (
        <motion.article
          key={story._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="card-humanitarian group"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-hope-green/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-hope-green" />
            </div>
            <span className="text-sm font-medium text-hope-green">
              {language === 'am' ? 'እንደገና ተገናኝተዋል' : 'Reunited'}
            </span>
          </div>

          <p className="text-charcoal mb-4 line-clamp-4">
            "{story.successStory?.story || story.memoryText?.[language]}"
          </p>

          <div className="flex items-center gap-3 text-sm text-stone mb-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {story.city}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {story.year}
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-warm-gray/30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sahara to-terracotta flex items-center justify-center text-white text-xs font-medium">
                {story.posterProfile?.realName?.[0]}
              </div>
              <span className="text-sm font-medium text-charcoal">
                {story.posterProfile?.realName}
              </span>
            </div>
            <button className="text-olive hover:text-terracotta transition-colors text-sm">
              {story.successStory?.likes || 0} ❤️
            </button>
          </div>
        </motion.article>
      ))}
    </div>
  );
};
