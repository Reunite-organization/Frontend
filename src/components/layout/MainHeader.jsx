import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Search, 
  PenTool, 
  User, 
  MessageCircle, 
  Globe,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  Shield,
  Users,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../lib/i18n';
import { useAuth } from '../../hooks/useAuth';
import { TrustBadge } from '../../features/wanted/components/profile/TrustBadge';

export const MainHeader = () => {
  const { language, setLanguage } = useLanguage();
  const { user, profile, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { 
      path: '/wanted', 
      label: { en: 'Browse', am: 'አስስ' },
      icon: Search,
      description: { en: 'Find people', am: 'ሰዎችን ያግኙ' }
    },
    { 
      path: '/wanted/create', 
      label: { en: 'Post Memory', am: 'ትዝታ አካፍል' },
      icon: PenTool,
      description: { en: 'Start a search', am: 'ፍለጋ ጀምር' }
    },
    { 
      path: '/wanted/stories', 
      label: { en: 'Stories', am: 'ታሪኮች' },
      icon: Sparkles,
      description: { en: 'Success stories', am: 'የስኬት ታሪኮች' }
    },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = async () => {
    await logout();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-warm-white/95 backdrop-blur-xl shadow-sm border-b border-warm-gray/20' 
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 group"
            >
              <div className="relative">
                <Heart className="w-8 h-8 text-terracotta group-hover:scale-110 transition-transform" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-hope-green rounded-full border-2 border-warm-white"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl md:text-2xl font-bold text-charcoal leading-tight">
                  Reunite
                </span>
                <span className="text-xs text-stone -mt-1">
                  × Falagiye
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 rounded-full transition-all group ${
                      active 
                        ? 'text-terracotta bg-terracotta/5' 
                        : 'text-charcoal hover:text-terracotta hover:bg-cream'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${active ? 'text-terracotta' : 'text-stone group-hover:text-terracotta'}`} />
                      <span className="font-medium">
                        {language === 'am' ? link.label.am : link.label.en}
                      </span>
                    </div>
                    
                    {/* Active Indicator */}
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="p-2 text-stone hover:text-charcoal rounded-full hover:bg-cream transition-colors flex items-center gap-1"
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:block">
                    {language === 'en' ? 'EN' : 'አማ'}
                  </span>
                </button>

                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-warm-gray overflow-hidden"
                    >
                      {[
                        { code: 'en', label: 'English', flag: '🇺🇸' },
                        { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-cream transition-colors flex items-center gap-3 ${
                            language === lang.code ? 'text-terracotta font-medium bg-terracotta/5' : 'text-charcoal'
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.label}</span>
                          {language === lang.code && <span className="ml-auto">✓</span>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Auth Actions */}
              {isAuthenticated && profile ? (
                <>
                  {/* Messages */}
                  <Link
                    to="/wanted/chat"
                    className="relative p-2 text-stone hover:text-charcoal rounded-full hover:bg-cream transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {/* Unread indicator - would come from real data */}
                    <span className="absolute top-1 right-1 w-2 h-2 bg-terracotta rounded-full" />
                  </Link>

                  {/* Profile Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-full hover:bg-cream transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-terracotta to-sahara flex items-center justify-center text-white font-medium shadow-sm">
                        {profile.realName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-stone transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-warm-gray overflow-hidden"
                        >
                          {/* User Info */}
                          <div className="p-4 border-b border-warm-gray/30">
                            <p className="font-medium text-charcoal">{profile.realName}</p>
                            <p className="text-sm text-stone">{user?.email}</p>
                            <div className="mt-2">
                              <TrustBadge score={profile.trustScore} size="sm" />
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <Link
                              to="/wanted/profile"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="w-full px-4 py-2.5 text-left hover:bg-cream transition-colors flex items-center gap-3 text-sm"
                            >
                              <User className="w-4 h-4 text-stone" />
                              <span>{language === 'am' ? 'መገለጫ' : 'Profile'}</span>
                            </Link>
                            
                            <Link
                              to="/wanted/my-posts"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="w-full px-4 py-2.5 text-left hover:bg-cream transition-colors flex items-center gap-3 text-sm"
                            >
                              <PenTool className="w-4 h-4 text-stone" />
                              <span>{language === 'am' ? 'የኔ ልጥፎች' : 'My Posts'}</span>
                            </Link>
                            
                            <Link
                              to="/wanted/claims"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="w-full px-4 py-2.5 text-left hover:bg-cream transition-colors flex items-center gap-3 text-sm"
                            >
                              <Users className="w-4 h-4 text-stone" />
                              <span>{language === 'am' ? 'ጥያቄዎች' : 'Claims'}</span>
                            </Link>
                          </div>

                          <div className="border-t border-warm-gray/30 py-2">
                            <Link
                              to="/settings"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="w-full px-4 py-2.5 text-left hover:bg-cream transition-colors flex items-center gap-3 text-sm"
                            >
                              <Settings className="w-4 h-4 text-stone" />
                              <span>{language === 'am' ? 'ቅንብሮች' : 'Settings'}</span>
                            </Link>
                            
                            <Link
                              to="/help"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="w-full px-4 py-2.5 text-left hover:bg-cream transition-colors flex items-center gap-3 text-sm"
                            >
                              <HelpCircle className="w-4 h-4 text-stone" />
                              <span>{language === 'am' ? 'እርዳታ' : 'Help'}</span>
                            </Link>
                          </div>

                          <div className="border-t border-warm-gray/30 py-2">
                            <button
                              onClick={handleLogout}
                              className="w-full px-4 py-2.5 text-left hover:bg-error/10 transition-colors flex items-center gap-3 text-sm text-error"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>{language === 'am' ? 'ውጣ' : 'Sign Out'}</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/auth/login"
                    className="hidden sm:block px-4 py-2 text-olive hover:text-terracotta font-medium transition-colors"
                  >
                    {language === 'am' ? 'ግባ' : 'Sign In'}
                  </Link>
                  <Link
                    to="/auth/register"
                    className="px-5 py-2.5 bg-terracotta text-white rounded-full font-medium hover:bg-clay transition-all shadow-sm hover:shadow-md"
                  >
                    {language === 'am' ? 'ተመዝገብ' : 'Join Free'}
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-charcoal rounded-full hover:bg-cream transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-warm-white shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                    <Heart className="w-6 h-6 text-terracotta" />
                    <span className="font-display text-xl font-bold text-charcoal">Reunite</span>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-stone hover:text-charcoal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.path);
                    
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          active 
                            ? 'bg-terracotta/10 text-terracotta' 
                            : 'hover:bg-cream text-charcoal'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <div>
                          <p className="font-medium">{language === 'am' ? link.label.am : link.label.en}</p>
                          <p className="text-xs text-stone">{language === 'am' ? link.description.am : link.description.en}</p>
                        </div>
                      </Link>
                    );
                  })}
                </nav>

                {!isAuthenticated && (
                  <div className="mt-8 p-4 bg-cream rounded-xl">
                    <p className="text-sm text-charcoal mb-3">
                      {language === 'am' 
                        ? 'ለመጀመር ይቀላቀሉ'
                        : 'Join to start reconnecting'
                      }
                    </p>
                    <Link
                      to="/auth/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-3 bg-terracotta text-white rounded-full font-medium text-center"
                    >
                      {language === 'am' ? 'ተመዝገብ' : 'Sign Up Free'}
                    </Link>
                    <Link
                      to="/auth/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-3 text-olive font-medium text-center mt-2"
                    >
                      {language === 'am' ? 'ግባ' : 'Sign In'}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20" />
    </>
  );
};
