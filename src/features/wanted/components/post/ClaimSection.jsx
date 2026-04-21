// client/src/features/wanted/components/post/ClaimSection.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  MessageCircle,
  ArrowRight,
  Users,
  Clock,
  X
} from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { useAuth } from '../../../../hooks/useAuth';
import { SecretQuestions } from './SecretQuestions';
import { useSubmitClaim } from '../../hooks/useClaims';

export const ClaimSection = ({ post, onClaimSubmitted }) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { mutate: submitClaim, isPending } = useSubmitClaim();
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [selectedPersonIndex, setSelectedPersonIndex] = useState(null);

  const isOwner = user?.id === post.poster;
  const hasClaimed = post.claims?.some(c => c.claimant === user?.id);
  const canClaim = post.status === 'active' && !isOwner && !hasClaimed;
  const availableSpots = post.isGroupPost 
    ? post.maxClaimants - (post.approvedClaimants?.length || 0)
    : post.status === 'active' ? 1 : 0;

  if (post.status === 'reconnected') {
    return (
      <div className="bg-success/5 rounded-2xl p-6 border border-success/20 text-center">
        <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
        <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
          {language === 'am' ? 'በተሳካ ሁኔታ ተገናኝተዋል!' : 'Successfully Reconnected!'}
        </h3>
        <p className="text-stone">
          {language === 'am'
            ? 'ይህ ልጥፍ አሁን ተዘግቷል። ሌሎች የስኬት ታሪኮችን ይመልከቱ።'
            : 'This post is now closed. Check out other success stories!'
          }
        </p>
      </div>
    );
  }

  if (isOwner) {
    return (
      <div className="bg-cream rounded-2xl p-6 border border-warm-gray/30">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-terracotta" />
          <h3 className="font-display text-lg font-semibold text-charcoal">
            {language === 'am' ? 'የእርስዎ ልጥፍ' : 'Your Post'}
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-stone">
              {language === 'am' ? 'የቀረቡ ጥያቄዎች' : 'Claims Received'}
            </span>
            <span className="font-medium text-charcoal">
              {post.claims?.length || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-stone">
              {language === 'am' ? 'የጸደቁ' : 'Approved'}
            </span>
            <span className="font-medium text-charcoal">
              {post.approvedClaimants?.length || 0}
            </span>
          </div>

          {post.claims?.length > 0 && (
            <button className="w-full mt-4 btn-outline flex items-center justify-center gap-2">
              {language === 'am' ? 'ጥያቄዎችን ይገምግሙ' : 'Review Claims'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (hasClaimed) {
    const myClaim = post.claims?.find(c => c.claimant === user?.id);
    
    return (
      <div className={`rounded-2xl p-6 border ${
        myClaim?.status === 'approved' 
          ? 'bg-hope-green/5 border-hope-green/20'
          : 'bg-warmth/5 border-warmth/20'
      }`}>
        <div className="text-center">
          {myClaim?.status === 'approved' ? (
            <>
              <CheckCircle className="w-12 h-12 text-hope-green mx-auto mb-3" />
              <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
                {language === 'am' ? 'ጥያቄዎ ጸድቋል!' : 'Claim Approved!'}
              </h3>
              <p className="text-stone mb-4">
                {language === 'am'
                  ? 'አሁን መወያየት መጀመር ይችላሉ'
                  : 'You can now start chatting'
                }
              </p>
              <button className="btn-primary inline-flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                {language === 'am' ? 'ቻት ክፈት' : 'Open Chat'}
              </button>
            </>
          ) : myClaim?.status === 'pending' ? (
            <>
              <Clock className="w-12 h-12 text-warmth mx-auto mb-3" />
              <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
                {language === 'am' ? 'በመገምገም ላይ' : 'Under Review'}
              </h3>
              <p className="text-stone">
                {language === 'am'
                  ? 'የይገባኛል ጥያቄዎ በመገምገም ላይ ነው። ውሳኔ ሲደረግ እናሳውቅዎታለን።'
                  : 'Your claim is being reviewed. We\'ll notify you when there\'s a decision.'
                }
              </p>
            </>
          ) : (
            <>
              <X className="w-12 h-12 text-error mx-auto mb-3" />
              <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
                {language === 'am' ? 'አልተሳካም' : 'Not Successful'}
              </h3>
              <p className="text-stone">
                {language === 'am'
                  ? 'በሚያሳዝን ሁኔታ የይገባኛል ጥያቄዎ አልጸደቀም።'
                  : 'Unfortunately, your claim was not approved.'
                }
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!canClaim) {
    return (
      <div className="bg-warmth/5 rounded-2xl p-6 border border-warmth/20 text-center">
        <Users className="w-12 h-12 text-stone mx-auto mb-3 opacity-50" />
        <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
          {language === 'am' ? 'ልጥፉ ሙሉ ነው' : 'Post is Full'}
        </h3>
        <p className="text-stone">
          {language === 'am'
            ? 'ይህ ልጥፍ አሁን ተጨማሪ ጥያቄ አይቀበልም።'
            : 'This post is no longer accepting claims.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Available Spots Banner */}
      {post.isGroupPost && (
        <div className="bg-warmth/5 rounded-xl p-4 border border-warmth/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone">
              {language === 'am' ? 'የቀሩ ቦታዎች' : 'Available Spots'}
            </span>
            <span className="font-display text-2xl font-bold text-terracotta">
              {availableSpots}
            </span>
          </div>
        </div>
      )}

      {/* Claim Form Toggle */}
      {!showClaimForm ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-cream rounded-2xl p-8 border border-warm-gray/30 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-terracotta" />
          </div>
          
          <h3 className="font-display text-xl font-semibold text-charcoal mb-2">
            {language === 'am' 
              ? 'ይህ እርስዎ የሚፈልጉት ሰው ነው?'
              : 'Is this who you\'re looking for?'
            }
          </h3>
          
          <p className="text-stone mb-6">
            {language === 'am'
              ? 'ማንነትዎን ለማረጋገጥ ሚስጥራዊ ጥያቄዎችን ይመለሳሉ'
              : 'You\'ll answer secret questions to verify your identity'
            }
          </p>

          <button
            onClick={() => setShowClaimForm(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            {language === 'am' ? 'የይገባኛል ጥያቄ ያቅርቡ' : 'Submit a Claim'}
          </button>

          <p className="text-xs text-stone mt-4 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            {language === 'am'
              ? 'ማንነትዎ እስኪጸድቅ ድረስ አይገለጽም'
              : 'Your identity stays private until approved'
            }
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-cream rounded-2xl p-6 border border-warm-gray/30"
          >
            {/* Group Post Person Selection */}
            {post.isGroupPost && post.soughtPeople?.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-charcoal mb-3">
                  {language === 'am' 
                    ? 'ማንን ነው የሚጠይቁት?'
                    : 'Who are you claiming?'
                  }
                </label>
                <div className="space-y-2">
                  {post.soughtPeople.map((person, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPersonIndex(idx)}
                      disabled={person.claimedBy}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        selectedPersonIndex === idx
                          ? 'border-terracotta bg-terracotta/5'
                          : 'border-warm-gray/30 hover:border-terracotta/50'
                      } ${person.claimedBy ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-charcoal">{person.name}</span>
                        {person.claimedBy ? (
                          <span className="text-xs text-stone">
                            {language === 'am' ? 'ተጠይቋል' : 'Claimed'}
                          </span>
                        ) : selectedPersonIndex === idx && (
                          <CheckCircle className="w-4 h-4 text-terracotta" />
                        )}
                      </div>
                      {person.description && (
                        <p className="text-xs text-stone mt-1">{person.description}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <SecretQuestions
              questions={post.secretQuestions}
              onSubmit={(answers, message) => {
                submitClaim({
                  postId: post._id,
                  answers,
                  messageToPoster: message,
                  claimedPersonIndex: selectedPersonIndex,
                }, {
                  onSuccess: () => {
                    setShowClaimForm(false);
                    onClaimSubmitted?.();
                  },
                });
              }}
              onCancel={() => setShowClaimForm(false)}
              isSubmitting={isPending}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
