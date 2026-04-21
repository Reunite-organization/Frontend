// client/src/features/wanted/components/claims/ClaimsPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Inbox, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User,
  Calendar,
  MapPin,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../../lib/i18n';
import { usePendingClaims, useMyClaims, useReviewClaim } from '../../hooks/useClaims';
import { TrustBadge } from '../profile/TrustBadge';
import { LoadingSkeleton } from '../shared/LoadingSkeleton';
import { EmptyState } from '../browse/EmptyState';
import { formatRelativeTime } from '../../utils/formatters';

const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-6 py-3 font-medium transition-all relative
      ${active ? 'text-terracotta' : 'text-stone hover:text-charcoal'}
    `}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
    {count > 0 && (
      <span className={`
        ml-2 px-2 py-0.5 text-xs rounded-full
        ${active ? 'bg-terracotta text-white' : 'bg-warm-gray/30 text-stone'}
      `}>
        {count}
      </span>
    )}
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta"
      />
    )}
  </button>
);

const ClaimCard = ({ claim, type = 'pending', onReview }) => {
  const { language } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);

  const statusConfig = {
    pending: { icon: Clock, color: 'text-warmth', bg: 'bg-warmth/10', border: 'border-warmth/20' },
    approved: { icon: CheckCircle, color: 'text-hope-green', bg: 'bg-hope-green/10', border: 'border-hope-green/20' },
    rejected: { icon: XCircle, color: 'text-error', bg: 'bg-error/10', border: 'border-error/20' },
  };

  const config = statusConfig[claim.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-cream rounded-xl border ${config.border} overflow-hidden`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
              <StatusIcon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div>
              <Link 
                to={`/wanted/post/${claim.post?._id}`}
                className="font-medium text-charcoal hover:text-terracotta transition-colors"
              >
                {claim.post?.memoryText?.en?.slice(0, 50) || claim.post?.memoryText?.am?.slice(0, 50)}...
              </Link>
              <div className="flex items-center gap-3 text-xs text-stone mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {claim.post?.city}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {claim.post?.year}
                </span>
              </div>
            </div>
          </div>
          
          <span className="text-xs text-stone">
            {formatRelativeTime(claim.createdAt, language)}
          </span>
        </div>

        {/* Claimant Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sahara to-terracotta flex items-center justify-center text-white text-xs font-medium">
              {claim.claimantProfile?.realName?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-sm font-medium text-charcoal">
                {claim.claimantProfile?.realName || (language === 'am' ? 'ተጠቃሚ' : 'User')}
              </p>
              <TrustBadge score={claim.claimantProfile?.trustScore} size="sm" />
            </div>
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-terracotta hover:text-clay flex items-center gap-1"
          >
            {showDetails 
              ? (language === 'am' ? 'ደብቅ' : 'Hide')
              : (language === 'am' ? 'ዝርዝር' : 'Details')
            }
            <ChevronRight className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-warm-gray/30 space-y-3">
                {/* Answers */}
                <div>
                  <p className="text-xs font-medium text-stone mb-2">
                    {language === 'am' ? 'መልሶች' : 'Answers'}
                  </p>
                  {claim.answers?.map((ans, idx) => (
                    <div key={idx} className="text-sm mb-2">
                      <p className="text-stone">
                        Q: {claim.post?.secretQuestions?.[ans.questionIndex]?.question?.[language] || 
                            claim.post?.secretQuestions?.[ans.questionIndex]?.question?.en}
                      </p>
                      <p className="text-charcoal font-medium">
                        A: {ans.answer}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Message */}
                {claim.messageToPoster && (
                  <div>
                    <p className="text-xs font-medium text-stone mb-1">
                      {language === 'am' ? 'መልእክት' : 'Message'}
                    </p>
                    <p className="text-sm text-charcoal bg-white dark:bg-charcoal/20 p-3 rounded-lg">
                      {claim.messageToPoster}
                    </p>
                  </div>
                )}

                {/* Actions for pending claims */}
                {type === 'pending' && (
                  <div className="flex gap-3 pt-3">
                    <button
                      onClick={() => onReview(claim._id, 'approved')}
                      className="flex-1 py-2.5 bg-hope-green text-white rounded-full font-medium hover:bg-hope-green/90 transition-colors"
                    >
                      {language === 'am' ? 'አጽድቅ' : 'Approve'}
                    </button>
                    <button
                      onClick={() => onReview(claim._id, 'rejected')}
                      className="flex-1 py-2.5 border border-error text-error rounded-full font-medium hover:bg-error/10 transition-colors"
                    >
                      {language === 'am' ? 'ውድቅ አድርግ' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const ClaimsPage = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('pending');
  const { data: pendingClaims, isLoading: pendingLoading } = usePendingClaims();
  const { data: myClaims, isLoading: myLoading } = useMyClaims();
  const { mutate: reviewClaim } = useReviewClaim();

  const tabs = [
    { 
      id: 'pending', 
      icon: Clock, 
      label: language === 'am' ? 'በመጠባበቅ ላይ' : 'Pending',
      count: pendingClaims?.length || 0,
      data: pendingClaims,
      loading: pendingLoading,
    },
    { 
      id: 'my', 
      icon: User, 
      label: language === 'am' ? 'የኔ ጥያቄዎች' : 'My Claims',
      count: myClaims?.length || 0,
      data: myClaims,
      loading: myLoading,
    },
  ];

  const activeTabData = tabs.find(t => t.id === activeTab);

  const handleReview = (claimId, status) => {
    reviewClaim({ claimId, status });
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
              ? 'የቀረቡ ጥያቄዎችን ይገምግሙ እና ያስተዳድሩ'
              : 'Review and manage submitted claims'
            }
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-warm-gray/30 mb-6">
          <div className="flex">
            {tabs.map(tab => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                icon={tab.icon}
                label={tab.label}
                count={tab.count}
              />
            ))}
          </div>
        </div>

        {/* Claims List */}
        <div className="max-w-3xl">
          {activeTabData?.loading ? (
            <LoadingSkeleton type="card" count={3} />
          ) : !activeTabData?.data?.length ? (
            <EmptyState 
              type="claims"
              title={
                activeTab === 'pending'
                  ? (language === 'am' ? 'ምንም በመጠባበቅ ላይ ያለ ጥያቄ የለም' : 'No pending claims')
                  : (language === 'am' ? 'ምንም የቀረበ ጥያቄ የለም' : 'No claims submitted')
              }
              description={
                activeTab === 'pending'
                  ? (language === 'am' 
                      ? 'አንድ ሰው ልጥፍዎን ሲጠይቅ እዚህ ይታያል' 
                      : 'When someone claims your post, they\'ll appear here')
                  : (language === 'am'
                      ? 'እስካሁን ምንም የይገባኛል ጥያቄ አላቀረቡም'
                      : 'You haven\'t submitted any claims yet')
              }
            />
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {activeTabData?.data?.map(claim => (
                  <ClaimCard
                    key={claim._id}
                    claim={claim}
                    type={activeTab}
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
