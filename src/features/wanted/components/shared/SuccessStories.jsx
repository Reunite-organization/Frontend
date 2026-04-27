import { motion } from "framer-motion";
import { Heart, MapPin, Calendar, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../../lib/i18n";
import { useSuccessStories } from "../../hooks/usePosts";
import { LoadingSkeleton } from "./LoadingSkeleton";

export const SuccessStories = ({ limit = 3, showTitle = false }) => {
  const { language } = useLanguage();
  const { data, isLoading, isError } = useSuccessStories();

  if (isLoading) {
    return <LoadingSkeleton type="grid" count={limit} />;
  }

  if (isError) {
    return (
      <div className="text-center py-12 bg-cream rounded-2xl border border-warm-gray/30">
        <p className="text-stone">
          {language === "am" ? "ለጊዘው የተሳኩ ታሪኮች የሉም" : "There are no successful stories for now"}
        </p>
      </div>
    );
  }

  const stories = data?.stories?.slice(0, limit) || [];

  if (stories.length === 0) {
    return (
      <div className="text-center py-12 bg-cream rounded-2xl border border-warm-gray/30">
        <div className="w-16 h-16 bg-hope-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-hope-green" />
        </div>
        <h3 className="text-lg font-semibold text-charcoal mb-2">
          {language === "am" ? "ምንም ታሪኮች የሉም" : "No stories yet"}
        </h3>
        <p className="text-stone mb-6">
          {language === "am" 
            ? "የመጀመሪያው ታሪክ አጋሪ ይሁኑ!" 
            : "Be the first to share a success story!"}
        </p>
        <Link to="/wanted/stories/share" className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {language === "am" ? "ታሪክ አጋራ" : "Share Story"}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {showTitle && (
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-charcoal">
            {language === "am" ? "የስኬት ታሪኮች" : "Success Stories"}
          </h2>
          <p className="text-stone mt-2">
            {language === "am" 
              ? "የደስታ እና የተስፋ ታሪኮች" 
              : "Stories of joy and hope from our community"}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story, idx) => (
          <motion.article
            key={story._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="card-humanitarian group h-full flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-hope-green/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-hope-green" />
              </div>
              <span className="text-sm font-medium text-hope-green">
                {language === "am" ? "እንደገና ተገናኝተዋል" : "Reunited"}
              </span>
            </div>

            <p className="text-charcoal mb-4 line-clamp-4 flex-1 italic">
              "{story.story || story.successStory?.story?.[language] || story.memoryText?.[language] || ""}"
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sahara to-terracotta flex items-center justify-center text-white text-xs font-medium overflow-hidden">
                  {story.posterProfile?.avatarUrl ? (
                    <img src={story.posterProfile.avatarUrl} alt={story.posterProfile.realName} className="w-full h-full object-cover" />
                  ) : (
                    story.poster?.avatar || story.posterProfile?.realName?.[0] || "?"
                  )}
                </div>
                <span className="text-sm font-medium text-charcoal">
                  {story.poster?.name || story.posterProfile?.realName}
                </span>
              </div>
              <div className="flex items-center gap-1 text-terracotta text-sm">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{story.likes || 0}</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Link
          to="/wanted/stories/share"
          className="flex items-center gap-2 px-6 py-3 bg-hope-green text-white rounded-full 
             shadow-lg hover:bg-hope-green/90 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>{language === "am" ? "ታሪክ አጋራ" : "Share Your Story"}</span>
        </Link>
      </div>
    </div>
  );
};
