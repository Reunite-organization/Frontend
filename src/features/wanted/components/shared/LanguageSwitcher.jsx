import { Globe } from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-olive hover:text-terracotta transition-colors rounded-full hover:bg-cream"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {language === 'en' ? 'EN' : 'አማ'}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-warm-gray overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-cream transition-colors ${
                  language === lang.code ? 'text-terracotta font-medium' : 'text-charcoal'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm">{lang.label}</span>
                {language === lang.code && (
                  <span className="ml-auto text-terracotta">✓</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
