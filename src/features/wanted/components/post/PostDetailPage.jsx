import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  MapPin,
  Calendar,
  Share2,
  Shield,
  ChevronLeft,
  Users,
  AlertCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useMarkReconnected, usePost } from "../../hooks/usePosts";
import { useLanguage } from "../../../../lib/i18n";
import { useAuth } from "../../../../hooks/useAuth";
import { isAdminRole } from "../../../../lib/authRoles";
import { TrustBadge } from "../profile/TrustBadge";
import { ShareModal } from "../shared/ShareModal";
import { ClaimSection } from "./ClaimSection";
import { PostDetailSkeleton } from "./PostDetailSkeleton";
import { formatRelativeTime } from "../../utils/formatters";
import { PostNotFound } from "./PostNotFound";

export const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { mutate: markReconnected, isPending: isMarkingReconnected } =
    useMarkReconnected();
  const [showShareModal, setShowShareModal] = useState(false);

  const { data: post, isLoading, error } = usePost(id);

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  if (error || !post) {
    return <PostNotFound />;
  }

  const memoryText =
    post.memoryText?.[language] || post.memoryText?.en || post.memoryText?.am;
  const isOwner = String(user?.id || "") === String(post.poster || "");
  const canManageReconnect = isOwner || isAdminRole(user?.role);

  const handleMarkReconnected = () => {
    markReconnected({ id: post._id });
  };

  return (
    <div className="min-h-screen bg-warm-white">
      <section className="relative bg-gradient-to-b from-cream to-transparent pt-20 pb-12">
        <div className="container mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-olive transition-colors group hover:text-terracotta"
          >
            <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span>{language === "am" ? "ወደ ኋላ" : "Back"}</span>
          </button>
        </div>

        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div
              className={`mb-8 rounded-2xl border p-4 ${
                post.status === "active"
                  ? "border-hope-green/20 bg-hope-green/5"
                  : post.status === "reconnected"
                    ? "border-success/20 bg-success/5"
                    : "border-warmth/20 bg-warmth/5"
              }`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {post.status === "active" && (
                    <div className="relative">
                      <span className="flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-hope-green opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-hope-green" />
                      </span>
                    </div>
                  )}
                  {post.status === "reconnected" && (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-semibold text-charcoal">
                      {post.status === "active" &&
                        (language === "am"
                          ? "በንቃት በመፈለግ ላይ"
                          : "Actively Searching")}
                      {post.status === "reconnected" &&
                        (language === "am"
                          ? "በተሳካ ሁኔታ ተገናኝተዋል!"
                          : "Successfully Reconnected!")}
                    </h3>
                    <p className="text-sm text-stone">
                      {post.status === "active" &&
                        (language === "am"
                          ? `ይህ ልጥፍ ከ${formatRelativeTime(post.createdAt, language)} በፊት ተፈጥሯል`
                          : `This post was created ${formatRelativeTime(post.createdAt)}`)}
                    </p>
                  </div>
                </div>

                {canManageReconnect && post.status === "active" && (
                  <button
                    type="button"
                    onClick={handleMarkReconnected}
                    disabled={isMarkingReconnected}
                    className="rounded-full bg-success px-4 py-2 text-sm font-semibold text-white transition hover:bg-success/90 disabled:opacity-60"
                  >
                    {isMarkingReconnected
                      ? language === "am"
                        ? "በማዘጋጀት ላይ..."
                        : "Closing..."
                      : language === "am"
                        ? "እንደገና ተገናኝቷል ይበሉ"
                        : "Mark Reconnected"}
                  </button>
                )}

                {isOwner &&
                  post.status === "reconnected" &&
                  !post.successStory?.shared && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/wanted/stories/share", {
                          state: { postId: post._id },
                        })
                      }
                      className="rounded-full border border-success/30 bg-white px-4 py-2 text-sm font-semibold text-success transition hover:bg-success/5"
                    >
                      {language === "am"
                        ? "የስኬት ታሪክ አጋራ"
                        : "Share Success Story"}
                    </button>
                  )}
              </div>
            </div>

            <article className="rounded-3xl border border-warm-gray/30 bg-cream p-8 shadow-lg md:p-12">
              <div className="mb-8 flex items-start justify-between border-b border-warm-gray/30 pb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-terracotta to-sahara text-2xl font-medium text-white">
                      {post.posterProfile?.avatarUrl ? (
                        <img
                          src={post.posterProfile.avatarUrl}
                          alt={post.posterProfile.realName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        post.posterProfile?.realName?.[0]?.toUpperCase() || "?"
                      )}
                    </div>
                    {post.posterProfile?.verifiedReconnector && (
                      <Shield className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-warm-white p-1 text-hope-green" />
                    )}
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h2 className="font-display text-xl font-semibold text-charcoal">
                        {post.posterProfile?.realName || "Anonymous"}
                      </h2>
                      <TrustBadge score={post.posterProfile?.trustScore} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-stone">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {post.city}
                        {post.country && `, ${post.country}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {post.year}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="rounded-full bg-warm-white p-3 text-stone transition-colors hover:text-terracotta"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-warmth/10 px-4 py-2">
                <Heart className="h-4 w-4 text-terracotta" />
                <span className="text-sm font-medium text-olive">
                  {categoryLabels[post.category]?.[language] || post.category}
                </span>
              </div>

              {post.personDetails?.personName && (
                <div className="mb-6 rounded-xl border border-warm-gray/30 bg-warm-white p-4">
                  <p className="mb-1 text-sm text-stone">
                    {language === "am" ? "የሚፈለጉት ሰው" : "Looking for"}
                  </p>
                  <p className="text-lg font-medium text-charcoal">
                    {post.personDetails.personName}
                    {post.personDetails.nickname && (
                      <span className="ml-2 text-stone">
                        "{post.personDetails.nickname}"
                      </span>
                    )}
                  </p>
                </div>
              )}

              <div className="prose prose-lg mb-8 max-w-none">
                <p className="whitespace-pre-wrap text-lg leading-relaxed text-charcoal">
                  {memoryText}
                </p>
              </div>

              {post.isGroupPost && (
                <div className="mb-8 rounded-2xl border border-warm-gray/30 bg-warm-white p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-terracotta" />
                    <h3 className="font-display text-lg font-semibold text-charcoal">
                      {language === "am" ? "የቡድን ፍለጋ" : "Group Search"}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {post.soughtPeople?.map((person, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-charcoal">{person.name}</span>
                        <span
                          className={`text-sm ${
                            person.verified ? "text-success" : "text-stone"
                          }`}
                        >
                          {person.verified
                            ? language === "am"
                              ? "✓ ተረጋግጧል"
                              : "✓ Verified"
                            : language === "am"
                              ? "በመጠበቅ ላይ"
                              : "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-stone">
                    {post.availableSpots}{" "}
                    {language === "am" ? "ቦታዎች ይቀራሉ" : "spots remaining"}
                  </div>
                </div>
              )}

              <div className="mb-8 rounded-xl border border-warm-gray/30 bg-warm-white p-4">
                <div className="flex items-start gap-3">
                  <Lock className="mt-0.5 h-5 w-5 text-olive" />
                  <div>
                    <p className="mb-1 text-sm font-medium text-charcoal">
                      {language === "am"
                        ? "የግላዊነት እና ደህንነት"
                        : "Privacy & Safety"}
                    </p>
                    <p className="text-sm text-stone">
                      {language === "am"
                        ? "የይገባኛል ጥያቄዎ እስኪጸድቅ ድረስ ማንነትዎ አይገለጽም። ሁሉም መልእክቶች በሁለቱም ወገን ከተፈቀዱ በኋላ ብቻ ነው የሚከፈቱት።"
                        : "Your identity remains private until the poster approves your claim. All communication is only opened after mutual approval."}
                    </p>
                  </div>
                </div>
              </div>

              <ClaimSection post={post} />

              {post.status === "claimed" && !isOwner && (
                <div className="border-t border-warm-gray/30 pt-8">
                  <div className="rounded-2xl bg-warmth/10 p-6 text-center">
                    <AlertCircle className="mx-auto mb-3 h-12 w-12 text-warmth" />
                    <h3 className="font-display text-lg font-semibold text-charcoal">
                      {language === "am" ? "አስቀድሞ ተጠይቋል" : "Already Claimed"}
                    </h3>
                    <p className="text-stone">
                      {language === "am"
                        ? "ይህ ልጥፍ አስቀድሞ የይገባኛል ጥያቄ ቀርቦበታል።"
                        : "This post has already been claimed."}
                    </p>
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </section>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        post={post}
      />
    </div>
  );
};

const categoryLabels = {
  childhood_friend: { en: "Childhood Friend", am: "የልጅነት ጓደኛ" },
  old_neighbor: { en: "Old Neighbor", am: "የቀድሞ ጎረቤት" },
  former_colleague: { en: "Former Colleague", am: "የቀድሞ የስራ ባልደረባ" },
  school_friend: { en: "School Friend", am: "የትምህርት ቤት ጓደኛ" },
  community_member: { en: "Community Member", am: "የማህበረሰብ አባል" },
  event_connection: { en: "Met at Event", am: "በክስተት የተዋወቅን" },
  family_connection: { en: "Family Connection", am: "የቤተሰብ ግንኙነት" },
  other: { en: "Other", am: "ሌላ" },
};
