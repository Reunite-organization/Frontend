import React from 'react';
import { Link } from 'react-router-dom';
import { Heart,  Mail, Globe, Shield, X, Share2, Camera } from 'lucide-react';
import { useLanguage } from '../../lib/i18n';

export const MainFooter = () => {
  const { language } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white/80">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Heart className="w-7 h-7 text-terracotta" />
              <span className="font-display text-xl font-bold text-white">
                Reunite
                <span className="text-white/60 text-sm ml-1">× Falagiye</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 mb-4">
              {language === 'am'
                ? 'ሰዎችን በትዝታ፣ በማህበረሰብ እና በእምነት እንደገና ማገናኘት።'
                : 'Reconnecting people through memory, community, and trust.'
              }
            </p>
            <div className="flex gap-3">
              <a href="https://twitter.com/reunite" className="p-2 bg-white/10 rounded-full hover:bg-terracotta transition-colors">
                <X className="w-4 h-4" />
              </a>
              <a href="https://facebook.com/reunite" className="p-2 bg-white/10 rounded-full hover:bg-terracotta transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/reunite" className="p-2 bg-white/10 rounded-full hover:bg-terracotta transition-colors">
                <Camera className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-display text-white mb-4">
              {language === 'am' ? 'መድረክ' : 'Platform'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/wanted" className="text-white/60 hover:text-white transition-colors">{language === 'am' ? 'አስስ' : 'Browse'}</Link></li>
              <li><Link to="/wanted/create" className="text-white/60 hover:text-white transition-colors">{language === 'am' ? 'ልጥፍ ፍጠር' : 'Create Post'}</Link></li>
              <li><Link to="/stories" className="text-white/60 hover:text-white transition-colors">{language === 'am' ? 'የስኬት ታሪኮች' : 'Success Stories'}</Link></li>
              <li><Link to="/how-it-works" className="text-white/60 hover:text-white transition-colors">{language === 'am' ? 'እንዴት እንደሚሰራ' : 'How It Works'}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display text-white mb-4">
              {language === 'am' ? 'ኩባንያ' : 'Company'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-white/60 hover:text-white transition-colors">{language === 'am' ? 'ስለ እኛ' : 'About'}</Link></li>
              <li><Link to="/mission" className="text-white/60 hover:text-white transition-colors">{language === 'am' ? 'ተልዕኳችን' : 'Our Mission'}</Link></li>
              <li><Link to="/contact" className="text-white/60 hover:text-white transition-colors">{language === 'am' ? 'ያግኙን' : 'Contact'}</Link></li>
              <li><Link to="/careers" className="text-white/60 hover:text-white transition-colors">{language === 'am' ? 'ስራዎች' : 'Careers'}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display text-white mb-4">
              {language === 'am' ? 'ህጋዊ' : 'Legal'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-white/60 hover:text-white transition-colors">{language === 'am' ? 'የግላዊነት ፖሊሲ' : 'Privacy'}</Link></li>
              <li><Link to="/terms" className="text-white/60 hover:text-white transition-colors">{language === 'am' ? 'የአገልግሎት ውል' : 'Terms'}</Link></li>
              <li><Link to="/safety" className="text-white/60 hover:text-white transition-colors">{language === 'am' ? 'ደህንነት' : 'Safety'}</Link></li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 py-6 border-t border-white/10">
          <div className="flex items-center gap-2 text-white/40">
            <Shield className="w-4 h-4" />
            <span className="text-xs">{language === 'am' ? 'ደህንነቱ የተጠበቀ' : 'Secure & Private'}</span>
          </div>
          <div className="flex items-center gap-2 text-white/40">
            <Globe className="w-4 h-4" />
            <span className="text-xs">{language === 'am' ? '89+ ሀገራት' : '89+ Countries'}</span>
          </div>
          <div className="flex items-center gap-2 text-white/40">
            <Mail className="w-4 h-4" />
            <span className="text-xs">support@reunite.com</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-white/30 mt-6">
          © {year} Reunite × Falagiye. {language === 'am' ? 'መብቱ በህግ የተጠበቀ ነው።' : 'All rights reserved.'}
        </div>
      </div>
    </footer>
  );
};
