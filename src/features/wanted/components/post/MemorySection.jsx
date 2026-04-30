import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Globe, 
  ChevronDown, 
  Copy, 
  CheckCircle2,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { toast } from 'sonner';

export const MemorySection = ({ post }) => {
  const { language } = useLanguage();
  const [activeLanguage, setActiveLanguage] = useState(language);
  const [showFullMemory, setShowFullMemory] = useState(false);
  const [copied, setCopied] = useState(false);

  const memoryText = post.memoryText?.[activeLanguage] || 
                     post.memoryText?.en || 
                     post.memoryText?.am;

  const hasBothLanguages = post.memoryText?.en && post.memoryText?.am;
  const isLongMemory = memoryText?.length > 300;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(memoryText);
    setCopied(true);
    toast.success(language === 'am' ? 'ተቀድቷል!' : 'Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const displayText = showFullMemory || !isLongMemory 
    ? memoryText 
    : memoryText?.slice(0, 300) + '...';

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-terracotta" />
          <h2 className="font-display text-xl font-semibold text-charcoal">
            {language === 'am' ? 'ትዝታ' : 'Memory'}
          </h2>
        </div>

        {/* Language Toggle */}
        {hasBothLanguages && (
          <div className="flex gap-1 bg-cream rounded-full p-1 border border-warm-gray/30">
            {['en', 'am'].map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLanguage(lang)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                  activeLanguage === lang
                    ? 'bg-terracotta text-white shadow-sm'
                    : 'text-stone hover:text-charcoal'
                }`}
              >
                <span className="mr-1">{lang === 'en' ? '🇺🇸' : '🇪🇹'}</span>
                {lang === 'en' ? 'EN' : 'አማ'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Memory Content */}
      <motion.div
        key={activeLanguage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <div className={`bg-cream rounded-2xl p-6 md:p-8 border border-warm-gray/30 ${
          activeLanguage === 'am' ? 'font-amharic text-lg leading-loose' : 'leading-relaxed'
        }`}>
          <p className="text-charcoal whitespace-pre-wrap">
            {displayText}
          </p>

          {/* Translation Notice */}
          {activeLanguage !== language && hasBothLanguages && (
            <div className="mt-4 pt-4 border-t border-warm-gray/30 flex items-start gap-2">
              <Globe className="w-4 h-4 text-stone flex-shrink-0 mt-0.5" />
              <p className="text-xs text-stone">
                {language === 'am'
                  ? 'ይህ የተተረጎመ ጽሑፍ ነው። ዋናውን ለማየት ቋንቋ ይቀይሩ።'
                  : 'This is a translated version. Switch language to see original.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {isLongMemory && (
              <button
                onClick={() => setShowFullMemory(!showFullMemory)}
                className="text-sm text-terracotta hover:text-clay flex items-center gap-1"
              >
                {showFullMemory 
                  ? (language === 'am' ? 'አሳጥር' : 'Show less')
                  : (language === 'am' ? 'ሙሉውን አሳይ' : 'Read more')
                }
                <ChevronDown className={`w-4 h-4 transition-transform ${showFullMemory ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          <button
            onClick={handleCopy}
            className="p-2 text-stone hover:text-terracotta transition-colors rounded-full hover:bg-warm-gray/20"
            title={language === 'am' ? 'ቅዳ' : 'Copy'}
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-hope-green" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Memory Prompts - Show if user is poster */}
      {post.isOwner && post.status === 'active' && (
        <div className="mt-6 p-4 bg-warmth/5 rounded-xl border border-warmth/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-warmth flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-charcoal mb-2">
                {language === 'am' 
                  ? 'ተጨማሪ ዝርዝሮችን ማከል ይፈልጋሉ?'
                  : 'Want to add more details?'
                }
              </p>
              <p className="text-sm text-stone mb-3">
                {language === 'am'
                  ? 'ተጨማሪ ትዝታዎች ትክክለኛውን ሰው ለማግኘት ይረዳሉ'
                  : 'More memories help the right person recognize you'
                }
              </p>
              <button className="text-sm text-terracotta hover:text-clay flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                {language === 'am' ? 'ትዝታ አክል' : 'Add Memory'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
