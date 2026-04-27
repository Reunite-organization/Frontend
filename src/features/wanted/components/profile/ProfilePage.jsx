import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Shield, 
  Award,
  Edit3,
  CheckCircle,
  AlertCircle,
  Clock,
  Heart,
  Users,
  Globe,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../../lib/i18n';
import { useCreateProfile, useWantedProfile, useUpdateProfile } from '../../hooks/useProfile';
import { useUserPosts } from '../../hooks/usePosts';
import { TrustBadgeDetailed } from './TrustBadge';
import { VerificationStatus } from './VerificationStatus';
import { ProfileForm } from './ProfileForm';
import { LoadingSkeleton } from '../shared/LoadingSkeleton';
import { formatDate } from '../../utils/formatters';

const StatCard = ({ icon: Icon, value, label, color = 'text-terracotta' }) => (
  <div className="bg-cream rounded-xl p-4 border border-warm-gray/30 text-center">
    <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
    <div className={`text-2xl font-display font-bold ${color}`}>{value || 0}</div>
    <div className="text-xs text-stone mt-1">{label}</div>
  </div>
);

export const ProfilePage = () => {
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  
  const { data: profile, isLoading: profileLoading } = useWantedProfile();
  const hasProfile = Boolean(profile);
  const { data: posts, isLoading: postsLoading } = useUserPosts('active', hasProfile);
  const { data: reconnectedPosts } = useUserPosts('reconnected', hasProfile);
  const { mutate: createProfile, isPending: isCreating } = useCreateProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  if (profileLoading) {
    return (
      <div className="container py-8">
        <LoadingSkeleton type="detail" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-8">
        <div className="max-w-md mx-auto text-center py-12">
          <User className="w-16 h-16 text-stone mx-auto mb-4 opacity-50" />
          <h2 className="font-display text-2xl font-bold text-charcoal mb-3">
            {language === 'am' ? 'Profile አልተገኘም' : 'Profile Not Found'}
          </h2>
          <p className="text-stone mb-6">
            {language === 'am'
              ? 'እባክዎ ፕሮፋይሎን ያጠናቅቁ'
              : 'Please complete your profile to continue'
            }
          </p>
          <Link
            to={'/wanted/profile/create'}
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            {language === 'am' ? 'ፕሮፋይል ይፍጠሩ' : 'Create Profile'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-cream to-transparent pt-8 pb-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-terracotta to-sahara flex items-center justify-center text-white text-3xl md:text-4xl font-medium shadow-lg overflow-hidden">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.realName} className="w-full h-full object-cover" />
                  ) : (
                    profile.realName?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
                {profile.verifiedReconnector && (
                  <div className="absolute -bottom-2 -right-2 bg-hope-green text-white p-2 rounded-full shadow-md">
                    <Award className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-1">
                      {profile.realName}
                    </h1>
                    {profile.displayName && (
                      <p className="text-stone mb-2">@{profile.displayName}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-stone">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.connectionCity}
                        {profile.connectionCountry && `, ${profile.connectionCountry}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {language === 'am' ? 'ተቀላቅሏል' : 'Joined'} {formatDate(profile.createdAt, language)}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-3 text-olive hover:text-terracotta transition-colors rounded-full hover:bg-warm-gray/20"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                </div>

                {/* Trust Score */}
                <div className="max-w-md">
                  <TrustBadgeDetailed score={profile.trustScore} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="container -mt-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              icon={Heart} 
              value={profile.successfulReconnections} 
              label={language === 'am' ? 'የተሳኩ ግኝኙነቶች' : 'Reconnections'}
              color="text-hope-green"
            />
            <StatCard 
              icon={Users} 
              value={posts?.length || 0} 
              label={language === 'am' ? 'በፍለጋ ላይ ያሉ ልጥፎች' : 'Active Posts'}
              color="text-terracotta"
            />
            <StatCard 
              icon={Globe} 
              value={profile.connectionCity?.split(',')[0]} 
              label={language === 'am' ? 'ከተማ' : 'City'}
              color="text-sahara"
            />
            <StatCard 
              icon={Award} 
              value={profile.trustScore} 
              label={language === 'am' ? 'የታማኝነት ደረጃ' : 'Trust Score'}
              color="text-olive"
            />
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <VerificationStatus profile={profile} />
        </div>
      </div>

      {/* Tabs */}
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="border-b border-warm-gray/30 mb-6">
            <div className="flex gap-6">
              {[
                { id: 'posts', label: language === 'am' ? 'የኔ ልጥፎች' : 'My Posts', count: posts?.length },
                { id: 'reconnected', label: language === 'am' ? 'የተገኙ' : 'Reconnected', count: reconnectedPosts?.length },
                { id: 'settings', label: language === 'am' ? 'ማስተካከያ' : 'Settings' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 font-medium transition-all relative ${
                    activeTab === tab.id ? 'text-terracotta' : 'text-stone hover:text-charcoal'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="ml-2 text-xs">({tab.count})</span>
                  )}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="profileTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto py-6">
            <AnimatePresence mode="wait">
              {activeTab === 'posts' && (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {postsLoading ? (
                    <LoadingSkeleton type="card" count={3} />
                  ) : posts?.length > 0 ? (
                    <div className="space-y-4">
                      {posts.map(post => (
                        <Link
                          key={post._id}
                          to={`/wanted/post/${post._id}`}
                          className="block bg-cream rounded-xl p-4 border border-warm-gray/30 hover:border-terracotta/30 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-charcoal mb-2 line-clamp-2">
                                {post.memoryText?.[language] || post.memoryText?.en || post.memoryText?.am}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-stone">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {post.city}
                                </span>
                                <span>{post.year}</span>
                                <span className={`px-2 py-0.5 rounded-full ${
                                  post.status === 'active' ? 'bg-hope-green/10 text-hope-green' : 'bg-warmth/10 text-warmth'
                                }`}>
                                  {post.status}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-stone" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-stone mx-auto mb-3 opacity-50" />
                      <p className="text-stone">
                        {language === 'am' ? 'እስካሁን ምንም ልጥፍ የለም' : 'No posts yet'}
                      </p>
                      <Link to="/wanted/create" className="btn-primary mt-4 inline-block">
                        {language === 'am' ? 'ልጥፍ ይፍጠሩ' : 'Create a Post'}
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'reconnected' && (
                <motion.div
                  key="reconnected"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {reconnectedPosts?.length > 0 ? (
                    <div className="space-y-4">
                      {reconnectedPosts.map(post => (
                        <div key={post._id} className="bg-hope-green/5 rounded-xl p-4 border border-hope-green/20">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-hope-green" />
                            <span className="text-sm font-medium text-hope-green">
                              {language === 'am' ? 'የተሳኩ ግኝኙነት' : 'Reconnected'}
                            </span>
                          </div>
                          <p className="text-charcoal mb-2">{post.memoryText?.en || post.memoryText?.am}</p>
                          {post.successStory?.shared && (
                            <p className="text-sm text-stone italic">
                              "{post.successStory.story}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="w-12 h-12 text-stone mx-auto mb-3 opacity-50" />
                      <p className="text-stone">
                        {language === 'am' ? 'እስካሁን የተሳኩ ግኝኙነቶች የሉም' : 'No reconnections yet'}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="bg-cream rounded-xl border border-warm-gray/30 divide-y divide-warm-gray/30">
                    <button className="w-full p-4 flex items-center justify-between hover:bg-warm-gray/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-olive" />
                        <span className="text-charcoal">
                          {language === 'am' ? 'ቋንቋ' : 'Language'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-stone">
                          {profile.preferredLanguage === 'am' ? 'አማርኛ' : 'English'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-stone" />
                      </div>
                    </button>
                    
                    <button className="w-full p-4 flex items-center justify-between hover:bg-warm-gray/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-olive" />
                        <span className="text-charcoal">
                          {language === 'am' ? 'ፕራይቬሲ' : 'Privacy'}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone" />
                    </button>
                    
                    <button className="w-full p-4 flex items-center justify-between hover:bg-warm-gray/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-olive" />
                        <span className="text-charcoal">
                          {language === 'am' ? 'ኖቲፊኬሽን' : 'Notifications'}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone" />
                    </button>
                    
                    <button className="w-full p-4 flex items-center justify-between text-error hover:bg-error/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <LogOut className="w-5 h-5" />
                        <span>{language === 'am' ? 'ይውጡ' : 'Sign Out'}</span>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <ProfileForm
            profile={profile}
            onClose={() => setIsEditing(false)}
            onSubmit={(data) => {
              const saveProfile = profile ? updateProfile : createProfile;
              saveProfile(data);
              setIsEditing(false);
            }}
            isSubmitting={isUpdating || isCreating}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
