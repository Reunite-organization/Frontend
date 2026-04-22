import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Clock, 
  Share2, 
  MessageCircle, 
  Shield, 
  ChevronLeft,
  Users,
  Star,
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { usePost } from '../../hooks/usePosts';
import { useClaims } from '../../hooks/useClaims';
import { useLanguage } from '../../../../lib/i18n';
import { TrustBadge } from '../profile/TrustBadge';
import { SecretQuestions } from './SecretQuestions';
import { ShareModal } from '../shared/ShareModal';
import { LoadingSkeleton } from '../shared/LoadingSkeleton';
import { formatDate, formatRelativeTime } from '../../utils/formatters';

export const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const { data: post, isLoading, error } = usePost(id);
  const { submitClaim, isSubmitting } = useClaims();

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  if (error || !post) {
    return <PostNotFound />;
  }

  const memoryText = post.memoryText?.[language] || post.memoryText?.en || post.memoryText?.am;
  const isOwner = false; // Check against current user
  const canClaim = post.status === 'active' && !isOwner;

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Hero Section with Background */}
      <section className="relative bg-gradient-to-b from-cream to-transparent pt-20 pb-12">
        {/* Back Navigation */}
        <div className="container mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-olive hover:text-terracotta transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>{language === 'am' ? 'ወደ ኋላ' : 'Back'}</span>
          </button>
        </div>

        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Status Banner */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-8 p-4 rounded-2xl border ${
                post.status === 'active' 
                  ? 'bg-hope-green/5 border-hope-green/20'
                  : post.status === 'reconnected'
                  ? 'bg-success/5 border-success/20'
                  : 'bg-warmth/5 border-warmth/20'
              }`}
            >
              <div className="flex items-center gap-3">
                {post.status === 'active' && (
                  <div className="relative">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hope-green opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-hope-green" />
                    </span>
                  </div>
                )}
                {post.status === 'reconnected' && (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                )}
                <div>
                  <h3 className="font-display text-lg font-semibold text-charcoal">
                    {post.status === 'active' && (
                      language === 'am' ? 'በንቃት በመፈለግ ላይ' : 'Actively Searching'
                    )}
                    {post.status === 'reconnected' && (
                      language === 'am' ? 'በተሳካ ሁኔታ ተገናኝተዋል!' : 'Successfully Reconnected!'
                    )}
                  </h3>
                  <p className="text-sm text-stone">
                    {post.status === 'active' && (
                      language === 'am' 
                        ? `ይህ ልጥፍ ከ${formatRelativeTime(post.createdAt, language)} በፊት ተፈጥሯል`
                        : `This post was created ${formatRelativeTime(post.createdAt)}`
                    )}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Main Content Card */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cream rounded-3xl p-8 md:p-12 border border-warm-gray/30 shadow-lg"
            >
              {/* Header with Poster Info */}
              <div className="flex items-start justify-between mb-8 pb-6 border-b border-warm-gray/30">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-terracotta to-sahara flex items-center justify-center text-white text-2xl font-medium">
                      {post.posterProfile?.realName?.[0]?.toUpperCase() || '?'}
                    </div>
                    {post.posterProfile?.verifiedReconnector && (
                      <Shield className="absolute -bottom-1 -right-1 w-6 h-6 text-hope-green bg-warm-white rounded-full p-1" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-display text-xl font-semibold text-charcoal">
                        {post.posterProfile?.realName || 'Anonymous'}
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
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="p-3 text-stone hover:text-terracotta bg-warm-white rounded-full transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Category Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-warmth/10 rounded-full mb-6">
                <Heart className="w-4 h-4 text-terracotta" />
                <span className="text-sm font-medium text-olive">
                  {categoryLabels[post.category]?.[language] || post.category}
                </span>
              </div>

              {/* Memory Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-charcoal text-lg leading-relaxed whitespace-pre-wrap">
                  {memoryText}
                </p>
              </div>

              {/* Group Post Info */}
              {post.isGroupPost && (
                <div className="mb-8 p-6 bg-warm-white rounded-2xl border border-warm-gray/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-terracotta" />
                    <h3 className="font-display text-lg font-semibold text-charcoal">
                      {language === 'am' ? 'የቡድን ፍለጋ' : 'Group Search'}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {post.soughtPeople?.map((person, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-charcoal">{person.name}</span>
                        <span className={`text-sm ${person.verified ? 'text-success' : 'text-stone'}`}>
                          {person.verified 
                            ? (language === 'am' ? '✓ ተረጋግጧል' : '✓ Verified')
                            : (language === 'am' ? 'በመጠበቅ ላይ' : 'Pending')
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-stone">
                    {post.availableSpots} {language === 'am' ? 'ቦታዎች ይቀራሉ' : 'spots remaining'}
                  </div>
                </div>
              )}

              {/* Trust & Safety Notice */}
              <div className="mb-8 p-4 bg-warm-white rounded-xl border border-warm-gray/30">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-olive mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-charcoal mb-1">
                      {language === 'am' ? 'የግላዊነት እና ደህንነት' : 'Privacy & Safety'}
                    </p>
                    <p className="text-sm text-stone">
                      {language === 'am'
                        ? 'የይገባኛል ጥያቄዎ እስኪጸድቅ ድረስ ማንነትዎ አይገለጽም። ሁሉም መልእክቶች በሁለቱም ወገን ከተፈቀዱ በኋላ ብቻ ነው የሚከፈቱት።'
                        : 'Your identity remains private until the poster approves your claim. All communication is only opened after mutual approval.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              {canClaim && (
                <div className="border-t border-warm-gray/30 pt-8">
                  {!showClaimForm ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center"
                    >
                      <p className="text-charcoal text-lg mb-4">
                        {language === 'am'
                          ? 'ይህ እርስዎ የሚፈልጉት ሰው ነው?'
                          : 'Is this the person you\'re looking for?'
                        }
                      </p>
                      <button
                        onClick={() => setShowClaimForm(true)}
                        className="btn-primary inline-flex items-center gap-2"
                      >
                        <MessageCircle className="w-5 h-5" />
                        {language === 'am' ? 'የይገባኛል ጥያቄ ያቅርቡ' : 'Submit a Claim'}
                      </button>
                      <p className="text-sm text-stone mt-4">
                        {language === 'am'
                          ? 'ሚስጥራዊ ጥያቄዎችን መመለስ ያስፈልግዎታል'
                          : 'You\'ll need to answer secret questions to verify your connection'
                        }
                      </p>
                    </motion.div>
                  ) : (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <SecretQuestions
                          questions={post.secretQuestions}
                          onSubmit={(answers, message) => {
                            submitClaim({
                              postId: id,
                              answers,
                              messageToPoster: message,
                            });
                          }}
                          onCancel={() => setShowClaimForm(false)}
                          isSubmitting={isSubmitting}
                        />
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              )}

              {/* Already Claimed Message */}
              {post.status === 'claimed' && !isOwner && (
                <div className="border-t border-warm-gray/30 pt-8">
                  <div className="text-center p-6 bg-warmth/10 rounded-2xl">
                    <AlertCircle className="w-12 h-12 text-warmth mx-auto mb-3" />
                    <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
                      {language === 'am' ? 'አስቀድሞ ተጠይቋል' : 'Already Claimed'}
                    </h3>
                    <p className="text-stone">
                      {language === 'am'
                        ? 'ይህ ልጥፍ አስቀድሞ የይገባኛል ጥያቄ ቀርቦበታል።'
                        : 'This post has already been claimed.'
                      }
                    </p>
                  </div>
                </div>
              )}
            </motion.article>
          </div>
        </div>
      </section>

      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        post={post}
      />
    </div>
  );
};

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
