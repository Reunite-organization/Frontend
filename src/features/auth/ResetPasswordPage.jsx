import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from '../../lib/axios';
import { useLanguage } from '../../lib/i18n';

export const ResetPasswordPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError(language === 'am' ? 'የመመለሻ ቶከን አልተገኘም።' : 'Missing reset token.');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError(language === 'am' ? 'አዲሱ የይለፍ ቃል ቢያንስ 6 ፊደላት መሆን አለበት።' : 'Password must be at least 6 characters.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError(language === 'am' ? 'የይለፍ ቃሎቹ አይዛመዱም።' : 'Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/auth/reset-password', {
        token,
        newPassword: formData.newPassword,
      });

      setMessage(
        response.data.message ||
          (language === 'am' ? 'የይለፍ ቃልዎ ተቀይሯል።' : 'Your password has been reset.'),
      );

      window.setTimeout(() => navigate('/auth/login', { replace: true }), 1500);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          (language === 'am' ? 'የይለፍ ቃል መቀየር አልተሳካም።' : 'Failed to reset password.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-cream to-warm-white">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-warm-gray/30 p-8"
      >
        <Link to="/auth/login" className="inline-flex items-center gap-2 text-sm text-stone hover:text-charcoal mb-6">
          <ArrowLeft className="w-4 h-4" />
          {language === 'am' ? 'ወደ መግቢያ ተመለስ' : 'Back to login'}
        </Link>

        <h1 className="font-display text-3xl font-bold text-charcoal mb-2">
          {language === 'am' ? 'አዲስ የይለፍ ቃል' : 'Set New Password'}
        </h1>
        <p className="text-stone mb-6">
          {language === 'am'
            ? 'አዲስ የይለፍ ቃል ያስገቡ።'
            : 'Choose a new password for your account.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              {language === 'am' ? 'አዲስ የይለፍ ቃል' : 'New Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
              <input
                type="password"
                value={formData.newPassword}
                onChange={(event) => setFormData((current) => ({ ...current, newPassword: event.target.value }))}
                required
                className="w-full pl-11 pr-4 py-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              {language === 'am' ? 'የይለፍ ቃል ያረጋግጡ' : 'Confirm Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(event) => setFormData((current) => ({ ...current, confirmPassword: event.target.value }))}
                required
                className="w-full pl-11 pr-4 py-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none"
              />
            </div>
          </div>

          {message ? <p className="text-sm text-hope-green">{message}</p> : null}
          {error ? <p className="text-sm text-error">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-terracotta text-white rounded-full font-semibold hover:bg-clay transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? language === 'am' ? 'በማስቀመጥ ላይ...' : 'Resetting...'
              : language === 'am' ? 'የይለፍ ቃል ቀይር' : 'Reset Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
