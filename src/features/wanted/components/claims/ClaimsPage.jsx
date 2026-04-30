import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Inbox, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User,
  MapPin,
  Calendar,
  ChevronRight,
  MessageCircle,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../../lib/i18n';
import { usePendingClaims, useReviewClaim } from '../../hooks/useClaims';
import { TrustBadge } from '../profile/TrustBadge';
import { LoadingSkeleton } from '../shared/LoadingSkeleton';
import { EmptyState } from '../browse/EmptyState';
import { formatRelativeTime } from '../../utils/formatters';
import { toast } from 'sonner';

const ClaimCard = ({ claim, onReview }) => {
  const { language } = useLanguage();
  const [showFullMessage, setShowFullMessage] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-cream rounded-xl border border-warm-gray/30 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {claim.claimantProfile?.avatarUrl ? (
              <img 
                src={claim.claimantProfile.avatarUrl} 
                alt={claim.claimantProfile.realName} 
                className="w-12 h-12 rounded-full object-cover border border-warm-gray/20 shadow-sm" 
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-terracotta to-sahara flex items-center justify-center text-white font-medium text-lg shadow-sm">
                {claim.claimantProfile?.realName?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-semibold text-charcoal">
                  {claim.claimantProfile?.realName || (language === 'am' ? 'ተጠቃሚ' : 'User')}
                </h3>
                <TrustBadge score={claim.claimantProfile?.trustScore} size="sm" />
              </div>
              <p className="text-xs text-stone">
                {formatRelativeTime(claim.createdAt, language)}
              </p>
            </div>
          </div>
          
          <span className="px-2.5 py-1 bg-warmth/10 text-warmth text-xs rounded-full border border-warmth/20 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {language === 'am' ? 'በመጠባበቅ ላይ' : 'Pending'}
          </span>
        </div>

        {/* Post Reference */}
        <Link 
          to={`/wanted/post/${claim.post?._id}`}
          className="block mb-4 p-3 bg-warm-white rounded-lg border border-warm-gray/20 hover:border-terracotta/30 transition-colors"
        >
          <p className="text-sm text-charcoal line-clamp-2">
            {claim.post?.memoryText?.en?.slice(0, 100) || claim.post?.memoryText?.am?.slice(0, 100)}...
          </p>
          <div className="flex items-center gap-3 text-xs text-stone mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {claim.post?.city}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {claim.post?.year}
            </span>
          </div>
        </Link>

        {/* Message from Claimant */}
        <div className="mb-4">
          <p className="text-xs font-medium text-stone mb-1.5 flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {language === 'am' ? 'መልእክት' : 'Message'}
          </p>
          <div className="bg-warm-white rounded-lg p-3 border border-warm-gray/20">
            <p className={`text-sm text-charcoal ${!showFullMessage && claim.messageToPoster?.length > 150 ? 'line-clamp-3' : ''}`}>
              {claim.messageToPoster}
            </p>
            {claim.messageToPoster?.length > 150 && (
              <button
                onClick={() => setShowFullMessage(!showFullMessage)}
                className="text-xs text-terracotta mt-1 hover:text-clay"
              >
                {showFullMessage 
                  ? (language === 'am' ? 'አሳጥር' : 'Show less')
                  : (language === 'am' ? 'ተጨማሪ አሳይ' : 'Show more')
                }
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onReview(claim._id, 'approved')}
            className="flex-1 py-2.5 bg-hope-green text-white rounded-full font-medium hover:bg-hope-green/90 transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            {language === 'am' ? 'አጽድቅ' : 'Approve'}
          </button>
          <button
            onClick={() => onReview(claim._id, 'rejected')}
            className="flex-1 py-2.5 border border-error text-error rounded-full font-medium hover:bg-error/10 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            {language === 'am' ? 'ውድቅ አድርግ' : 'Reject'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const ClaimsPage = () => {
  const { language } = useLanguage();
  const { data: pendingClaims, isLoading } = usePendingClaims();
  const { mutate: reviewClaim } = useReviewClaim();

  const handleReview = (claimId, status) => {
    reviewClaim(
      { claimId, status },
      {
        onSuccess: (data) => {
          if (status === 'approved') {
            toast.success(
              language === 'am' 
                ? 'ጥያቄው ጸድቋል! ቻት ተከፍቷል።' 
                : 'Claim approved! Chat is now open.'
            );
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-2">
            {language === 'am' ? 'የይገባኛል ጥያቄዎች' : 'Claims'}
          </h1>
          <p className="text-stone">
            {language === 'am'
              ? 'እርስዎን የሚፈልጉ ሰዎች የላኳቸው መልእክቶች'
              : 'Messages from people who think they know you'
            }
          </p>
        </div>

        {/* Claims List */}
        <div className="max-w-3xl">
          {isLoading ? (
            <LoadingSkeleton type="card" count={3} />
          ) : !pendingClaims?.length ? (
            <EmptyState 
              type="claims"
              title={
                language === 'am' 
                  ? 'ምንም በመጠባበቅ ላይ ያለ ጥያቄ የለም' 
                  : 'No pending claims'
              }
              description={
                language === 'am'
                  ? 'አንድ ሰው ልጥፍዎን ሲጠይቅ እዚህ ይታያል'
                  : 'When someone claims your post, they\'ll appear here'
              }
            />
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {pendingClaims.map((claim) => (
                  <ClaimCard
                    key={claim._id}
                    claim={claim}
                    onReview={handleReview}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
