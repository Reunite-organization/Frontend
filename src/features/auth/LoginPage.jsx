import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Heart,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../lib/i18n';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage = () => {
  const { language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const from = location.state?.from?.pathname || '/wanted';

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = language === 'am' ? 'ኢሜይል ያስፈልጋል' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'am' ? 'ትክክለኛ ኢሜይል አድራሻ አይደለም' : 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = language === 'am' ? 'የይለፍ ቃል ያስፈልጋል' : 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setLoginError(result.error);
    }
    
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cream to-warm-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-5">
          <h2 className="font-display text-3xl font-bold text-charcoal mb-2">
            {language === 'am' ? 'እንኳን ደህና መጡ' : 'Welcome Back'}
          </h2>
          <p className="text-stone">
            {language === 'am' 
              ? 'ለመቀጠል Sign in ያርጉ'
              : 'Sign in to continue'
            }
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-warm-gray/30">
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error">{loginError}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                {language === 'am' ? 'ኢሜይል' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={language === 'am' ? 'ኢሜይልዎን ያስገቡ' : 'Enter your email'}
                  className={`w-full pl-11 pr-4 py-3 bg-cream/50 border rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all ${
                    errors.email ? 'border-error' : 'border-warm-gray'
                  }`}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-error mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                {language === 'am' ? 'የይለፍ ቃል' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={language === 'am' ? 'የይለፍ ቃልዎትን ያስገቡ' : 'Enter your password'}
                  className={`w-full pl-11 pr-12 py-3 bg-cream/50 border rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all ${
                    errors.password ? 'border-error' : 'border-warm-gray'
                  }`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone hover:text-charcoal"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-error mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/auth/forgot-password"
                className="text-sm text-terracotta hover:text-clay transition-colors"
              >
                {language === 'am' ? 'የይለፍ ቃል ረሳው?' : 'Forgot password?'}
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-terracotta text-white rounded-full font-semibold hover:bg-clay transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{language === 'am' ? 'ትንሽ ይጠብቁ...' : 'Signing in...'}</span>
                </>
              ) : (
                <>
                  <span>{language === 'am' ? 'ይግቡ' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-warm-gray/30"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-stone">
                {language === 'am' ? 'ወይም' : 'or'}
              </span>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-stone">
            {language === 'am' ? 'አካውንት የሎትም?' : 'Don\'t have an account?'}
            {' '}
            <Link
              to="/auth/register"
              className="text-terracotta hover:text-clay font-medium"
            >
              {language === 'am' ? 'አሁኑኑ ይመዝገቡ' : 'Sign up now'}
            </Link>
          </p>
        </div>

        {/* Trust Message */}
        <p className="text-center text-xs text-stone mt-6">
          <Lock className="inline w-3 h-3 mr-1" />
          {language === 'am' 
            ? 'የግል መረጃዎ ደህንነት የተጠበቀ ነው'
            : 'Secure login • Your information is private'
          }
        </p>
      </motion.div>
    </div>
  );
};
