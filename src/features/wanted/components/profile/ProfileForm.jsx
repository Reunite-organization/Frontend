import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, MapPin, Globe, Phone, MessageCircle, Shield } from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';

export const ProfileForm = ({ profile, onClose, onSubmit, isSubmitting }) => {
  const { language } = useLanguage();
  const isCreating = !profile;
  const [formData, setFormData] = useState({
    realName: profile?.realName || '',
    displayName: profile?.displayName || '',
    connectionCity: profile?.connectionCity || '',
    connectionCountry: profile?.connectionCountry || '',
    phoneNumber: profile?.phoneNumber || '',
    preferredLanguage: profile?.preferredLanguage || 'en',
    privacySettings: profile?.privacySettings || {
      showInSearch: true,
      allowNotifications: true,
    },
  });
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white dark:bg-charcoal rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-charcoal border-b border-warm-gray/30 px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-charcoal">
            {language === 'am'
              ? isCreating ? 'መገለጫ ፍጠር' : 'መገለጫ አርትዕ'
              : isCreating ? 'Create Profile' : 'Edit Profile'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-stone hover:text-charcoal rounded-full hover:bg-warm-gray/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Real Name */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              <User className="inline w-4 h-4 mr-1" />
              {language === 'am' ? 'ሙሉ ስም *' : 'Full Name *'}
            </label>
            <input
              type="text"
              value={formData.realName}
              onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
              placeholder={language === 'am' ? 'ሙሉ ስምዎን ያስገቡ' : 'Enter your full name'}
              className={`w-full px-4 py-2.5 bg-cream/50 border rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all ${
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
              @ {language === 'am' ? 'የማሳያ ስም (አማራጭ)' : 'Display Name (Optional)'}
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder={language === 'am' ? 'የሚታይ ስም' : 'How you want to appear'}
              className="w-full px-4 py-2.5 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                <MapPin className="inline w-4 h-4 mr-1" />
                {language === 'am' ? 'ከተማ *' : 'City *'}
              </label>
              <input
                type="text"
                value={formData.connectionCity}
                onChange={(e) => setFormData({ ...formData, connectionCity: e.target.value })}
                placeholder={language === 'am' ? 'አዲስ አበባ' : 'Addis Ababa'}
                className={`w-full px-4 py-2.5 bg-cream/50 border rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all ${
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
                className="w-full px-4 py-2.5 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
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
              className="w-full px-4 py-2.5 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
            />
          </div>

          {/* Language Preference */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              <Globe className="inline w-4 h-4 mr-1" />
              {language === 'am' ? 'የሚመረጥ ቋንቋ' : 'Preferred Language'}
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
                  className={`flex-1 py-2.5 px-4 rounded-xl border-2 transition-all ${
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
              <Shield className="inline w-4 h-4 mr-1" />
              {language === 'am' ? 'የግላዊነት ቅንብሮች' : 'Privacy Settings'}
            </label>
            
            <label className="flex items-center justify-between p-3 bg-cream rounded-xl border border-warm-gray/30">
              <span className="text-sm text-charcoal">
                {language === 'am' ? 'በፍለጋ ውጤቶች ውስጥ አሳይ' : 'Show in search results'}
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
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  formData.privacySettings.showInSearch ? 'bg-terracotta' : 'bg-warm-gray'
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  formData.privacySettings.showInSearch ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </label>

            <label className="flex items-center justify-between p-3 bg-cream rounded-xl border border-warm-gray/30">
              <span className="text-sm text-charcoal">
                {language === 'am' ? 'ማሳወቂያዎችን ፍቀድ' : 'Allow notifications'}
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

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-warm-gray/30">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 border border-warm-gray rounded-full text-stone hover:bg-warm-gray/20 transition-colors"
            >
              {language === 'am' ? 'ይቅር' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-2.5 bg-terracotta text-white rounded-full hover:bg-clay transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{language === 'am' ? 'በማስቀመጥ ላይ...' : 'Saving...'}</span>
                </>
              ) : (
                <span>{language === 'am' ? 'አስቀምጥ' : 'Save'}</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
