import { useState } from 'react';
import {
  MessageCircle,
  Shield,
  CheckCircle,
  Clock,
  X,
  Send,
  User,
  Users,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../../lib/i18n';
import { useAuth } from '../../../../hooks/useAuth';
import { useSubmitClaim } from '../../hooks/useClaims';
import { toast } from 'sonner';

export const ClaimSection = ({ post, onClaimSubmitted }) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { mutate: submitClaim, isPending } = useSubmitClaim();
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedPersonIndex, setSelectedPersonIndex] = useState(null);

  const isOwner = user?.id === post.poster;
  const hasClaimed = post.claims?.some((claim) => claim.claimant === user?.id);
  const canClaim = post.status === 'active' && !isOwner && !hasClaimed;

  const handleSubmitClaim = () => {
    if (!message.trim() || message.length < 10) {
      toast.error(
        language === 'am'
          ? 'እባክዎ ቢያንስ 10 ቁምፊዎች ያስገቡ'
          : 'Please enter at least 10 characters',
      );
      return;
    }

    const claimData = {
      messageToPoster: message.trim(),
    };

    if (post.isGroupPost && selectedPersonIndex !== null) {
      claimData.claimedPersonIndex = selectedPersonIndex;
    }

    submitClaim(
      {
        postId: post._id,
        ...claimData,
      },
      {
        onSuccess: () => {
          setShowClaimForm(false);
          setMessage('');
          setSelectedPersonIndex(null);
          onClaimSubmitted?.();
        },
        onError: (error) => {
          console.error('Claim submission failed:', error);
          toast.error(
            error.response?.data?.message ||
              (language === 'am'
                ? 'ጥያቄ ማቅረብ አልተሳካም'
                : 'Failed to submit claim'),
          );
        },
      },
    );
  };

  if (post.status === 'reconnected') {
    return (
      <div className="rounded-2xl border border-success/20 bg-success/5 p-6 text-center">
        <CheckCircle className="mx-auto mb-3 h-12 w-12 text-success" />
        <h3 className="mb-2 font-display text-lg font-semibold text-charcoal">
          {language === 'am'
            ? 'በተሳካ ሁኔታ ተገናኝተዋል!'
            : 'Successfully Reconnected!'}
        </h3>
        <p className="text-stone">
          {language === 'am'
            ? 'ይህ ልጥፍ አሁን ተዘግቷል።'
            : 'This post is now closed.'}
        </p>
      </div>
    );
  }

  if (isOwner) {
    return (
      <div className="rounded-2xl border border-warm-gray/30 bg-cream p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-terracotta" />
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
            <Link
              to="/wanted/claims"
              className="mt-4 flex w-full items-center justify-center gap-2 btn-outline"
            >
              {language === 'am' ? 'ጥያቄዎችን ይገምግሙ' : 'Review Claims'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (hasClaimed) {
    const myClaim = post.claims?.find((claim) => claim.claimant === user?.id);

    return (
      <div
        className={`rounded-2xl border p-6 ${
          myClaim?.status === 'approved'
            ? 'border-hope-green/20 bg-hope-green/5'
            : myClaim?.status === 'pending'
              ? 'border-warmth/20 bg-warmth/5'
              : 'border-error/20 bg-error/5'
        }`}
      >
        <div className="text-center">
          {myClaim?.status === 'approved' ? (
            <>
              <CheckCircle className="mx-auto mb-3 h-12 w-12 text-hope-green" />
              <h3 className="mb-2 font-display text-lg font-semibold text-charcoal">
                {language === 'am' ? 'ጥያቄዎ ጸድቋል!' : 'Claim Approved!'}
              </h3>
              <p className="mb-4 text-stone">
                {language === 'am'
                  ? 'አሁን መወያየት መጀመር ይችላሉ'
                  : 'You can now start chatting'}
              </p>
              <Link
                to={`/wanted/chat/${myClaim.chatRoomId}`}
                className="btn-primary inline-flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                {language === 'am' ? 'ቻት ክፈት' : 'Open Chat'}
              </Link>
            </>
          ) : myClaim?.status === 'pending' ? (
            <>
              <Clock className="mx-auto mb-3 h-12 w-12 text-warmth" />
              <h3 className="mb-2 font-display text-lg font-semibold text-charcoal">
                {language === 'am' ? 'በመገምገም ላይ' : 'Under Review'}
              </h3>
              <p className="text-stone">
                {language === 'am'
                  ? 'ጥያቄዎ በመገምገም ላይ ነው። ውሳኔ ሲደረግ እናሳውቅዎታለን።'
                  : "Your claim is being reviewed. We'll notify you when there's a decision."}
              </p>
            </>
          ) : (
            <>
              <X className="mx-auto mb-3 h-12 w-12 text-error" />
              <h3 className="mb-2 font-display text-lg font-semibold text-charcoal">
                {language === 'am' ? 'አልተሳካም' : 'Not Approved'}
              </h3>
              <p className="text-stone">
                {language === 'am'
                  ? 'በሚያሳዝን ሁኔታ ጥያቄዎ አልጸደቀም።'
                  : 'Unfortunately, your claim was not approved.'}
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!canClaim) {
    return (
      <div className="rounded-2xl border border-warmth/20 bg-warmth/5 p-6 text-center">
        <Users className="mx-auto mb-3 h-12 w-12 text-stone opacity-50" />
        <h3 className="mb-2 font-display text-lg font-semibold text-charcoal">
          {language === 'am' ? 'ልጥፉ ሙሉ ነው' : 'Post is Full'}
        </h3>
        <p className="text-stone">
          {language === 'am'
            ? 'ይህ ልጥፍ አሁን ተጨማሪ ጥያቄ አይቀበልም።'
            : 'This post is no longer accepting claims.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!showClaimForm ? (
        <div className="rounded-2xl border border-warm-gray/30 bg-cream p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-terracotta/10">
            <User className="h-8 w-8 text-terracotta" />
          </div>

          <h3 className="mb-2 font-display text-xl font-semibold text-charcoal">
            {language === 'am' ? 'ይህ እርስዎ ነዎት?' : 'Is this you?'}
          </h3>

          <p className="mb-6 text-stone">
            {language === 'am'
              ? 'ከለጣፊው ጋር ለመገናኘት መልእክት ይላኩ'
              : 'Send a message to connect with the poster'}
          </p>

          <button
            onClick={() => setShowClaimForm(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            {language === 'am' ? 'መልእክት ላክ' : 'Send Message'}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-warm-gray/30 bg-cream p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-charcoal">
              {language === 'am' ? 'መልእክትዎን ይጻፉ' : 'Write Your Message'}
            </h3>
            <button
              onClick={() => setShowClaimForm(false)}
              className="rounded-full p-1.5 text-stone transition-colors hover:bg-warm-gray/20 hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {post.isGroupPost && post.soughtPeople?.length > 0 && (
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-charcoal">
                  {language === 'am' ? 'ማን ነዎት?' : 'Who are you?'}
                </label>
                <div className="space-y-2">
                  {post.soughtPeople.map((person, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPersonIndex(idx)}
                      disabled={person.claimedBy}
                      className={`w-full rounded-xl border p-3 text-left transition-all ${
                        selectedPersonIndex === idx
                          ? 'border-terracotta bg-terracotta/5'
                          : 'border-warm-gray/30 hover:border-terracotta/50'
                      } ${person.claimedBy ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-charcoal">{person.name}</span>
                        {person.claimedBy ? (
                          <span className="text-xs text-stone">
                            {language === 'am' ? 'ተጠይቋል' : 'Claimed'}
                          </span>
                        ) : (
                          selectedPersonIndex === idx && (
                            <CheckCircle className="h-4 w-4 text-terracotta" />
                          )
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-charcoal">
                {language === 'am'
                  ? 'እራስዎን ያስተዋውቁ *'
                  : 'Introduce yourself *'}
              </label>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={
                  language === 'am'
                    ? 'ለምሳሌ፡ ሰላም! እኔ አበበ ነኝ። አብረን ትምህርት ቤት ነበርን...'
                    : "e.g., Hi! I'm Abebe. We went to school together..."
                }
                rows={5}
                maxLength={500}
                className="w-full resize-none rounded-xl border border-warm-gray bg-white px-4 py-3 outline-none transition-all focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
              />
              <div className="mt-1 flex justify-between">
                <p className="text-xs text-stone">
                  {language === 'am' ? 'ቢያንስ 10 ቁምፊዎች' : 'Minimum 10 characters'}
                </p>
                <p className="text-xs text-stone">{message.length} / 500</p>
              </div>
            </div>

            <div className="rounded-lg border border-warmth/20 bg-warmth/5 p-3">
              <p className="flex items-start gap-2 text-xs text-stone">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-warmth" />
                <span>
                  {language === 'am'
                    ? 'መልእክትዎ ለለጣፊው ብቻ ይታያል። ማንነትዎ እስኪጸድቅ ድረስ አይገለጽም።'
                    : 'Your message is only visible to the poster. Your identity remains private until approved.'}
                </span>
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClaimForm(false)}
                className="flex-1 rounded-full border border-warm-gray px-6 py-2.5 text-stone transition-colors hover:bg-warm-gray/20"
              >
                {language === 'am' ? 'ይቅር' : 'Cancel'}
              </button>
              <button
                onClick={handleSubmitClaim}
                disabled={isPending || message.length < 10}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-2.5 font-medium text-white transition-colors hover:bg-clay disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>{language === 'am' ? 'በመላክ ላይ...' : 'Sending...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>{language === 'am' ? 'ላክ' : 'Send'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
