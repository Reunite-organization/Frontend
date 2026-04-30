import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Heart,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Phone
} from 'lucide-react';
import { useLanguage } from '../../lib/i18n';
import { useAuth } from '../../hooks/useAuth';
import { GoogleSignInButton } from './GoogleSignInButton';

export const RegisterPage = () => {
  const { language } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = language === 'am' ? 'ስም ያስፈልጋል (ቢያንስ 2 ፊደላት)' : 'Name is required (min 2 characters)';
    }
    
    if (!formData.email) {
      newErrors.email = language === 'am' ? 'ኢሜይል ያስፈልጋል' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'am' ? 'ትክክለኛ ኢሜይል አድራሻ አይደለም' : 'Invalid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = language === 'am' ? 'የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት' : 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = language === 'am' ? 'የይለፍ ቃሎች አይዛመዱም' : 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    
    if (!validateStep2()) return;
    
    setIsLoading(true);
    
    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      password: formData.password,
    });
    
    if (result.success) {
      navigate('/wanted/profile/create', { 
        state: { message: language === 'am' ? 'እንኳን ደህና መጡ! መገለጫዎን ያጠናቅቁ።' : 'Welcome! Complete your profile.' }
      });
    } else {
      setRegisterError(result.error);
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
    <div className="min-h-screen flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cream to-warm-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-2">
          <h2 className="font-display text-3xl font-bold text-charcoal mb-1">
            {language === 'am' ? 'መለያ ይፍጠሩ' : 'Create Account'}
          </h2>
          <p className="text-stone">
            {language === 'am' 
              ? 'ዛሬ መፈለግ ይጀምሩ'
              : 'Start your search today'
            }
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
            step === 1 ? 'bg-terracotta text-white' : 'bg-hope-green text-white'
          }`}>
            {step === 1 ? '1' : <CheckCircle className="w-4 h-4" />}
          </div>
          <div className={`w-12 h-0.5 ${step === 2 ? 'bg-terracotta' : 'bg-warm-gray'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
            step === 2 ? 'bg-terracotta text-white' : 'bg-warm-gray/30 text-stone'
          }`}>
            2
          </div>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-warm-gray/30">
          {step === 1 ? (
            <div className="mb-6">
              <GoogleSignInButton
                onSuccess={() => {
                  navigate('/wanted/profile/create', {
                    state: {
                      message:
                        language === 'am'
                          ? 'ጉግል በመጠቀም ገብተዋል። ፕሮፋይልዎን ያጠናቅቁ።'
                          : 'Signed in with Google. Complete your profile.',
                    },
                  });
                }}
              />
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-warm-gray/30"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-stone">
                    {language === 'am' ? 'ወይም በኢሜይል' : 'or continue with email'}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
          {registerError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error">{registerError}</p>
            </motion.div>
          )}

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit}>
            {step === 1 ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    {language === 'am' ? 'ሙሉ ስም' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={language === 'am' ? 'ሙሉ ስምዎን ያስገቡ' : 'Enter your full name'}
                      className={`w-full pl-11 pr-4 py-3 bg-cream/50 border rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all ${
                        errors.name ? 'border-error' : 'border-warm-gray'
                      }`}
                      autoComplete="name"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-error mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

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

                {/* Phone (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    {language === 'am' ? 'ስልክ ቁጥር (አማራጭ)' : 'Phone Number (Optional)'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+251 912 345 678"
                      className="w-full pl-11 pr-4 py-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-terracotta text-white rounded-full font-semibold hover:bg-clay transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>{language === 'am' ? 'ቀጥል' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
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
                      placeholder={language === 'am' ? 'የይለፍ ቃል ይፍጠሩ' : 'Create a password'}
                      className={`w-full pl-11 pr-12 py-3 bg-cream/50 border rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all ${
                        errors.password ? 'border-error' : 'border-warm-gray'
                      }`}
                      autoComplete="new-password"
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    {language === 'am' ? 'የይለፍ ቃል አረጋግጥ' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder={language === 'am' ? 'የይለፍ ቃልዎን ያረጋግጡ' : 'Confirm your password'}
                      className={`w-full pl-11 pr-12 py-3 bg-cream/50 border rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all ${
                        errors.confirmPassword ? 'border-error' : 'border-warm-gray'
                      }`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone hover:text-charcoal"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-error mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 border border-warm-gray text-stone rounded-full font-medium hover:bg-warm-gray/10 transition-colors"
                  >
                    {language === 'am' ? 'ወደ ኋላ' : 'Back'}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3.5 bg-terracotta text-white rounded-full font-semibold hover:bg-clay transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{language === 'am' ? 'በመመዝገብ ላይ...' : 'Creating...'}</span>
                      </>
                    ) : (
                      <span>{language === 'am' ? 'ተመዝገብ' : 'Sign Up'}</span>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-stone mt-6">
            {language === 'am' ? 'መለያ አለዎት?' : 'Already have an account?'}
            {' '}
            <Link
              to="/auth/login"
              className="text-terracotta hover:text-clay font-medium"
            >
              {language === 'am' ? 'ግባ' : 'Sign in'}
            </Link>
          </p>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-stone mt-6">
          {language === 'am' 
            ? 'በመመዝገብ የእኛን '
            : 'By signing up, you agree to our '
          }
          <Link to="/terms" className="text-terracotta hover:underline">
            {language === 'am' ? 'የአገልግሎት ውል' : 'Terms of Service'}
          </Link>
          {' '}{language === 'am' ? 'እና' : 'and'}{' '}
          <Link to="/privacy" className="text-terracotta hover:underline">
            {language === 'am' ? 'የግላዊነት ፖሊሲ' : 'Privacy Policy'}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
