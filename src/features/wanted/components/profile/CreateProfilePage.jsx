import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, MapPin, Globe, Phone, Shield, Heart, ArrowRight, Camera, Upload, X } from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { useCreateProfile } from '../../hooks/useProfile';
import { wantedApi } from '../../services/wantedApi';
import { toast } from 'sonner';

export const CreateProfilePage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: createProfile, isPending: isCreating } = useCreateProfile();
  const fileInputRef = useRef(null);
  
  const from = location.state?.from || '/wanted';
  
  const [formData, setFormData] = useState({
    realName: '',
    displayName: '',
    connectionCity: '',
    connectionCountry: '',
    phoneNumber: '',
    preferredLanguage: language,
    privacySettings: {
      showInSearch: true,
      allowNotifications: true,
    },
    avatarUrl: '',
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(language === 'am' ? 'ፋይሉ ከ2MB መብለጥ የለበትም' : 'Image size must be less than 2MB');
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.realName.trim()) {
      newErrors.realName = language === 'am' ? 'ስም ያስፈልጋል' : 'Name is required';
    }
    if (!formData.connectionCity.trim()) {
      newErrors.connectionCity = language === 'am' ? 'ከተማ ያስፈልጋል' : 'City is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    let finalAvatarUrl = formData.avatarUrl;

    if (avatarFile) {
      setIsUploading(true);
      try {
        const uploadData = new FormData();
        uploadData.append('avatar', avatarFile);
        const result = await wantedApi.uploadAvatar(uploadData);
        finalAvatarUrl = result.avatarUrl;
      } catch (err) {
        console.error('Avatar upload failed:', err);
        toast.error(language === 'am' ? 'ፎቶ መጫን አልተሳካም' : 'Failed to upload profile photo');
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }
    
    createProfile({ ...formData, avatarUrl: finalAvatarUrl }, {
      onSuccess: () => {
        navigate(from, { replace: true });
      },
    });
  };

  const isPending = isCreating || isUploading;

  return (
    <div className="min-h-screen bg-warm-white py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-terracotta/10 rounded-full mb-4">
            <Heart className="w-8 h-8 text-terracotta" />
          </div>
          <h1 className="font-display text-3xl font-bold text-charcoal mb-2">
            {language === 'am' ? 'የራሶትን ፕሮፋይል ይፍጠሩ' : 'Create Your Profile'}
          </h1>
          <p className="text-stone">
            {language === 'am'
              ? 'ለመቀጠል ፕሮፋይሎትን ያጠናቅቁ'
              : 'Complete your profile to continue'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-5">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-cream border-2 border-warm-gray/30 flex items-center justify-center overflow-hidden shadow-inner">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-stone/40" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-terracotta text-white rounded-full shadow-lg hover:bg-clay transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatarPreview(null);
                    setAvatarFile(null);
                  }}
                  className="absolute -top-1 -right-1 p-1 bg-white text-error rounded-full shadow-md border border-warm-gray/20 hover:bg-error/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-stone mt-3">
              {language === 'am' ? 'ፎቶ ይጫኑ (optional)' : 'Upload profile photo (Optional)'}
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Real Name */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              <User className="inline w-4 h-4 mr-1 text-terracotta" />
              {language === 'am' ? 'ሙሉ ስም *' : 'Full Name *'}
            </label>
            <input
              type="text"
              value={formData.realName}
              onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
              placeholder={language === 'am' ? 'ሙሉ ስምዎን ያስገቡ' : 'Enter your full name'}
              className={`w-full px-4 py-3 bg-cream/50 border rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all ${
                errors.realName ? 'border-error' : 'border-warm-gray'
              }`}
            />
            {errors.realName && (
              <p className="text-xs text-error mt-1">{errors.realName}</p>
            )}
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              @ {language === 'am' ? 'Display Name (አማራጭ)' : 'Display Name (Optional)'}
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder={language === 'am' ? 'የእይታ ገደብ' : 'How you want to appear'}
              className="w-full px-4 py-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                <MapPin className="inline w-4 h-4 mr-1 text-terracotta" />
                {language === 'am' ? 'ከተማ *' : 'City *'}
              </label>
              <input
                type="text"
                value={formData.connectionCity}
                onChange={(e) => setFormData({ ...formData, connectionCity: e.target.value })}
                placeholder={language === 'am' ? 'አዲስ አበባ' : 'Addis Ababa'}
                className={`w-full px-4 py-3 bg-cream/50 border rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all ${
                  errors.connectionCity ? 'border-error' : 'border-warm-gray'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                <Globe className="inline w-4 h-4 mr-1" />
                {language === 'am' ? 'ሀገር' : 'Country'}
              </label>
              <input
                type="text"
                value={formData.connectionCountry}
                onChange={(e) => setFormData({ ...formData, connectionCountry: e.target.value })}
                placeholder={language === 'am' ? 'ኢትዮጵያ' : 'Ethiopia'}
                className="w-full px-4 py-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              <Phone className="inline w-4 h-4 mr-1" />
              {language === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'}
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="+251 912 345 678"
              className="w-full px-4 py-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
            />
          </div>

          {/* Language Preference */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              <Globe className="inline w-4 h-4 mr-1" />
              {language === 'am' ? 'የሚመርጡት ቋንቋ' : 'Preferred Language'}
            </label>
            <div className="flex gap-3">
              {[
                { value: 'en', label: 'English', flag: '🇺🇸' },
                { value: 'am', label: 'አማርኛ', flag: '🇪🇹' },
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, preferredLanguage: option.value })}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                    formData.preferredLanguage === option.value
                      ? 'border-terracotta bg-terracotta/5 text-terracotta'
                      : 'border-warm-gray text-stone hover:border-terracotta/50'
                  }`}
                >
                  <span className="mr-2">{option.flag}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-charcoal">
              <Shield className="inline w-4 h-4 mr-1 text-terracotta" />
              {language === 'am' ? 'ማስተካከያዎች' : 'Privacy Settings'}
            </label>
            
            <label className="flex items-center justify-between p-1 bg-cream rounded-xl border border-warm-gray/30 cursor-pointer">
              <span className="text-sm text-charcoal">
                {language === 'am' ? 'በፍለጋ ውጤቶች ላይ ይታይ' : 'Show in search results'}
              </span>
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  privacySettings: {
                    ...formData.privacySettings,
                    showInSearch: !formData.privacySettings.showInSearch,
                  },
                })}
                className={`relative w-11 h-6 rounded- transition-colors ${
                  formData.privacySettings.showInSearch ? 'bg-terracotta' : 'bg-warm-gray'
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  formData.privacySettings.showInSearch ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </label>

            <label className="flex items-center justify-between p-3 bg-cream rounded-xl border border-warm-gray/30 cursor-pointer">
              <span className="text-sm text-charcoal">
                {language === 'am' ? 'notifications ፍቀዱ' : 'Allow notifications'}
              </span>
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  privacySettings: {
                    ...formData.privacySettings,
                    allowNotifications: !formData.privacySettings.allowNotifications,
                  },
                })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  formData.privacySettings.allowNotifications ? 'bg-terracotta' : 'bg-warm-gray'
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  formData.privacySettings.allowNotifications ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 bg-terracotta text-white rounded-full font-semibold hover:bg-clay transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{language === 'am' ? 'ትንሽ ይጠብቁ...' : 'Creating Profile...'}</span>
              </>
            ) : (
              <>
                <span>{language === 'am' ? 'ፕሮፋይል ይፍጠሩ' : 'Create Profile'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
