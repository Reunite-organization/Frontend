import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../../lib/i18n';
import { Camera, MapPin, Calendar, Heart, AlertCircle } from 'lucide-react';
import { useStoryActions, useUserPosts } from '../hooks/usePosts';
import { toast } from 'sonner';

export const CreateStory = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { shareStory, isSharing } = useStoryActions();
  
  // Get reconnected posts to pick from
  const { data: reconnectedPosts, isLoading: isLoadingPosts } = useUserPosts('reconnected');
  
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    postId: location.state?.postId || '',
    title: { am: '', en: '' },
    story: { am: '', en: '' },  
    city: '',
    year: new Date().getFullYear(),
    photos: [] 
  });

  // Pre-fill if postId comes from state
  useEffect(() => {
    if (location.state?.postId && reconnectedPosts) {
      const post = reconnectedPosts.find(p => p._id === location.state.postId);
      if (post) {
        setForm(prev => ({
          ...prev,
          postId: post._id,
          city: post.city || prev.city,
          year: post.year || prev.year
        }));
      }
    }
  }, [location.state, reconnectedPosts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.postId) {
      setError(language === 'am' ? 'እባክዎን ታሪክ የሚያጋሩለትን ልጥፍ ይምረጡ' : 'Please select a post to share a story for');
      return;
    }

    try {
      // Use FormData if we want to support actual file uploads
      const result = await shareStory({
        postId: form.postId,
        title: form.title,
        story: form.story,
        city: form.city,
        year: form.year
      });
      
      if (result) {
        toast.success(language === 'am' ? 'ታሪክዎ በተሳካ ሁኔታ ተጋርቷል!' : 'Story shared successfully!');
        navigate('/wanted/stories');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to share story');
    }
  };

  if (isLoadingPosts) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-hope-green/30 border-t-hope-green rounded-full animate-spin mx-auto mb-4" />
        <p className="text-stone">{language === 'am' ? 'በመጫን ላይ...' : 'Loading...'}</p>
      </div>
    );
  }

  if (!reconnectedPosts || reconnectedPosts.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-charcoal mb-4">
          {language === 'am' ? 'ገና ምንም ግንኙነቶች የሉም' : 'No Reconnections Yet'}
        </h2>
        <p className="text-stone mb-8">
          {language === 'am' 
            ? 'የስኬት ታሪክ ለማጋራት መጀመሪያ እንደገና የተገናኘ ልጥፍ ሊኖርዎት ይገባል።' 
            : 'You need to have a reconnected post first to share a success story.'}
        </p>
        <button onClick={() => navigate('/wanted')} className="btn-primary">
          {language === 'am' ? 'ሰዎችን ይፈልጉ' : 'Browse Posts'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-charcoal mb-2">
          {language === 'am' ? 'የስኬት ታሪክ አጋራ' : 'Share Success Story'}
        </h1>
        <p className="text-stone">
          {language === 'am' 
            ? 'የተገናኙበትን ታሪክ ያጋሩ እና ሌሎችን ያበረታቱ'
            : 'Share your reunion story and inspire others'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl border border-warm-gray/30 shadow-sm">
        {/* Post Selection */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            {language === 'am' ? 'ልጥፍ ይምረጡ' : 'Select Reconnected Post'}
          </label>
          <select
            value={form.postId}
            onChange={(e) => {
              const post = reconnectedPosts.find(p => p._id === e.target.value);
              setForm({ 
                ...form, 
                postId: e.target.value,
                city: post?.city || form.city,
                year: post?.year || form.year
              });
            }}
            className="w-full p-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-hope-green outline-none"
            required
          >
            <option value="">{language === 'am' ? '-- ልጥፍ ይምረጡ --' : '-- Select a post --'}</option>
            {reconnectedPosts.map(post => (
              <option key={post._id} value={post._id}>
                {post.personDetails?.personName || post.memoryText?.[language] || post.memoryText?.en || 'Untitled Post'}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              {language === 'am' ? 'ርዕስ (እንግሊዝኛ)' : 'Title (English)'}
            </label>
            <input
              type="text"
              value={form.title.en}
              onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })}
              placeholder="e.g., Finally Reunited after 10 years!"
              className="w-full p-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-hope-green outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              {language === 'am' ? 'ርዕስ (አማርኛ)' : 'Title (Amharic)'}
            </label>
            <input
              type="text"
              value={form.title.am}
              onChange={(e) => setForm({ ...form, title: { ...form.title, am: e.target.value } })}
              placeholder="ለምሳሌ፡ ከ10 ዓመት በኋላ ተገናኘን!"
              className="w-full p-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-hope-green outline-none"
            />
          </div>
        </div>

        {/* Story Text */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              {language === 'am' ? 'ታሪክ (እንግሊዝኛ)' : 'Your Story (English)'}
            </label>
            <textarea
              value={form.story.en}
              onChange={(e) => setForm({
                ...form, 
                story: { ...form.story, en: e.target.value }
              })}
              placeholder="Tell us how you found your loved one..."
              className="w-full p-4 bg-cream/50 border border-warm-gray rounded-xl min-h-[150px] focus:border-hope-green outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              {language === 'am' ? 'ታሪክ (አማርኛ)' : 'Your Story (Amharic)'}
            </label>
            <textarea
              value={form.story.am}
              onChange={(e) => setForm({
                ...form, 
                story: { ...form.story, am: e.target.value }
              })}
              placeholder="የምትወዱትን ሰው እንዴት እንዳገኙት ይንገሩን..."
              className="w-full p-4 bg-cream/50 border border-warm-gray rounded-xl min-h-[150px] focus:border-hope-green outline-none"
            />
          </div>
        </div>

        {/* Location & Year */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              <MapPin className="w-4 h-4 inline mr-1 text-hope-green" />
              {language === 'am' ? 'ከተማ' : 'City'}
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full p-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-hope-green outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              <Calendar className="w-4 h-4 inline mr-1 text-hope-green" />
              {language === 'am' ? 'ዓመት' : 'Year'}
            </label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="w-full p-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-hope-green outline-none"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSharing}
            className="w-full py-4 bg-hope-green text-white rounded-xl font-bold text-lg
                     hover:bg-hope-green/90 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all shadow-lg shadow-hope-green/20 active:scale-95 flex items-center justify-center gap-2"
          >
            {isSharing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{language === 'am' ? 'በመላክ ላይ...' : 'Sharing...'}</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 fill-current" />
                <span>{language === 'am' ? 'ታሪክ አጋራ' : 'Share Story'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
