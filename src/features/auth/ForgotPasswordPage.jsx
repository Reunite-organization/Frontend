import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from '../../lib/axios';
import { useLanguage } from '../../lib/i18n';

export const ForgotPasswordPage = () => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setMessage(
        response.data.message ||
          (language === 'am'
            ? 'የይለፍ ቃል መመለሻ መልእክት ተልኳል።'
            : 'Password reset instructions have been sent.'),
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          (language === 'am' ? 'ጥያቄውን ማስኬድ አልተሳካም።' : 'Failed to submit reset request.'),
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
          {language === 'am' ? 'የይለፍ ቃል መመለስ' : 'Forgot Password'}
        </h1>
        <p className="text-stone mb-6">
          {language === 'am'
            ? 'የመመለሻ አገናኝ ለመቀበል ኢሜይልዎን ያስገቡ።'
            : 'Enter your email to receive a password reset link.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              {language === 'am' ? 'ኢሜይል' : 'Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none"
                placeholder="name@example.com"
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
              ? language === 'am' ? 'በመላክ ላይ...' : 'Sending...'
              : language === 'am' ? 'መመለሻ አገናኝ ላክ' : 'Send Reset Link'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
