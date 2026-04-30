import { motion } from 'framer-motion';
import { Search, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../../lib/i18n';

export const PostNotFound = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-warm-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-warmth/10 flex items-center justify-center">
          <Search className="w-10 h-10 text-warmth" />
        </div>
        
        <h2 className="font-display text-2xl font-bold text-charcoal mb-3">
          {language === 'am' ? 'ልጥፍ አልተገኘም' : 'Post Not Found'}
        </h2>
        
        <p className="text-stone mb-8">
          {language === 'am'
            ? 'ይህ ልጥፍ ላይኖር ወይም ሊሰረዝ ይችላል።'
            : 'This post may have been removed or never existed.'
          }
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/wanted"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            {language === 'am' ? 'ልጥፎችን ያስሱ' : 'Browse Posts'}
          </Link>
          
          <Link
            to="/"
            className="btn-outline inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            {language === 'am' ? 'ወደ መነሻ' : 'Go Home'}
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
