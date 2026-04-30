import { Link } from 'react-router-dom';
import { Heart, Mail, Globe, Shield, MessageCircle, Share2, Share } from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';

export const WantedFooter = () => {
  const { language } = useLanguage();
  const year = new Date().getFullYear();

  const links = {
    platform: [
      { to: '/wanted', label: { en: 'Browse', am: 'ተመን' } },
      { to: '/wanted/stories', label: { en: 'Success Stories', am: 'የስኬት ታሪኮች' } },
      { to: '/wanted/create', label: { en: 'Create Post', am: 'ልጥፍ ፍጠር' } },
    ],
    about: [
      { to: '/about', label: { en: 'Our Mission', am: 'ተልዕኳችን' } },
      { to: '/faq', label: { en: 'FAQS', am: 'ተደጋጋሚ ጥያቄዎች' } },
      { to: '/trust-safety', label: { en: 'Trust & Safety', am: 'እምነት እና ደህንነት' } },
    ],
    support: [
      { to: '/help', label: { en: 'Help Center', am: 'የእርዳታ ማዕከል' } },
      { to: '/contact', label: { en: 'Contact Us', am: 'ያግኙን' } },
      { to: '/report', label: { en: 'Report Issue', am: 'ችግር ሪፖርት አድርግ' } },
    ],
    legal: [
      { to: '/privacy', label: { en: 'Privacy Policy', am: 'የግላዊነት ፖሊሲ' } },
      { to: '/terms', label: { en: 'Terms of Service', am: 'የአገልግሎት ውል' } },
      { to: '/cookies', label: { en: 'Cookie Policy', am: 'የኩኪ ፖሊሲ' } },
    ],
  };

  return (
    <footer className="bg-charcoal text-warm-white/80">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/wanted" className="flex items-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-terracotta" />
              <span className="font-display text-2xl font-bold text-warm-white">
                ፈላጊዬ
                <span className="text-warm-white/60 text-lg ml-2 font-body">Falagiye</span>
              </span>
            </Link>
            <p className="text-sm text-warm-white/60 mb-6">
              {language === 'am'
                ? 'ሰዎችን በጋራ ትዝታዎች እና በማህበረሰብ እምነት እንደገና ማገናኘት።'
                : 'Reconnecting people through shared memories and community trust.'
              }
            </p>
            <div className="flex gap-3">
              <a href="https://twitter.com/falagiye" className="p-2 bg-warm-white/10 rounded-full hover:bg-terracotta transition-colors">
                <Share className="w-4 h-4" />
              </a>
              <a href="https://facebook.com/falagiye" className="p-2 bg-warm-white/10 rounded-full hover:bg-terracotta transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/falagiye" className="p-2 bg-warm-white/10 rounded-full hover:bg-terracotta transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-display text-warm-white mb-4">
              {language === 'am' ? 'መድረክ' : 'Platform'}
            </h3>
            <ul className="space-y-2">
              {links.platform.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-warm-white/60 hover:text-terracotta transition-colors">
                    {language === 'am' ? link.label.am : link.label.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-warm-white mb-4">
              {language === 'am' ? 'ስለ እኛ' : 'About'}
            </h3>
            <ul className="space-y-2">
              {links.about.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-warm-white/60 hover:text-terracotta transition-colors">
                    {language === 'am' ? link.label.am : link.label.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-warm-white mb-4">
              {language === 'am' ? 'ድጋፍ' : 'Support'}
            </h3>
            <ul className="space-y-2">
              {links.support.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-warm-white/60 hover:text-terracotta transition-colors">
                    {language === 'am' ? link.label.am : link.label.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-warm-white mb-4">
              {language === 'am' ? 'ህጋዊ' : 'Legal'}
            </h3>
            <ul className="space-y-2">
              {links.legal.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-warm-white/60 hover:text-terracotta transition-colors">
                    {language === 'am' ? link.label.am : link.label.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 py-8 border-y border-warm-white/10 my-8">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-hope-green" />
            <span className="text-sm">{language === 'am' ? 'ደህንነቱ የተጠበቀ' : 'Secure & Private'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-sahara" />
            <span className="text-sm">{language === 'am' ? '89+ ሀገራት' : '89+ Countries'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-terracotta" />
            <span className="text-sm">support@ethioreunite.com</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-warm-white/40">
          <p>
            © {year} Falagiye (ፈላጊዬ). {' '}
            {language === 'am'
              ? 'መብቱ በህግ የተጠበቀ ነው። በፍቅር የተሰራ።'
              : 'All rights reserved. Made with love.'
            }
          </p>
        </div>
      </div>
    </footer>
  );
};
