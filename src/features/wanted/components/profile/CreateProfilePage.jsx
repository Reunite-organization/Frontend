import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, MapPin, Globe, Phone, Heart } from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { useCreateProfile } from '../../hooks/useProfile';

export const CreateProfilePage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { mutate: createProfile, isPending } = useCreateProfile();
  
  const [formData, setFormData] = useState({
    realName: '',
    displayName: '',
    connectionCity: '',
    connectionCountry: '',
    phoneNumber: '',
    preferredLanguage: language,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    createProfile(formData, {
      onSuccess: () => {
        navigate('/wanted');
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-cream to-warm-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <Heart className="w-10 h-10 text-terracotta mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-charcoal mb-2">
            {language === 'am' ? 'መገለጫ ይፍጠሩ' : 'Create Your Profile'}
          </h2>
          <p className="text-stone">
            {language === 'am' 
              ? 'ለመቀጠል መገለጫዎን ያጠናቅቁ'
              : 'Complete your profile to continue'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              <User className="inline w-4 h-4 mr-1" />
              {language === 'am' ? 'ሙሉ ስም *' : 'Full Name *'}
            </label>
            <input
              type="text"
              value={formData.realName}
              onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              <MapPin className="inline w-4 h-4 mr-1" />
              {language === 'am' ? 'ከተማ *' : 'City *'}
            </label>
            <input
              type="text"
              value={formData.connectionCity}
              onChange={(e) => setFormData({ ...formData, connectionCity: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              <Globe className="inline w-4 h-4 mr-1" />
              {language === 'am' ? 'ሀገር' : 'Country'}
            </label>
            <input
              type="text"
              value={formData.connectionCountry}
              onChange={(e) => setFormData({ ...formData, connectionCountry: e.target.value })}
              className="w-full px-4 py-2.5 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              <Phone className="inline w-4 h-4 mr-1" />
              {language === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'}
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-4 py-2.5 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-terracotta text-white rounded-full font-semibold hover:bg-clay transition-all disabled:opacity-50"
          >
            {isPending 
              ? (language === 'am' ? 'በመፍጠር ላይ...' : 'Creating...')
              : (language === 'am' ? 'መገለጫ ፍጠር' : 'Create Profile')
            }
          </button>
        </form>
      </motion.div>
    </div>
  );
};
