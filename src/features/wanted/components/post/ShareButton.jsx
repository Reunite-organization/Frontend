import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2,  
  Linkedin, 
  Link as LinkIcon, 
  Mail,
  MessageCircle,
  Check,
  X,
  Copy
} from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { toast } from 'sonner';

export const ShareButton = ({ post, variant = 'icon', className = '' }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/wanted/post/${post._id}`;
  const shareTitle = post.memoryText?.en?.slice(0, 100) || post.memoryText?.am?.slice(0, 100) || 'Falagiye Post';
  const shareDescription = language === 'am'
    ? `${post.city}, ${post.year} - በፈላጊዬ ላይ ዳግም የመገናኘት ልጥፍ`
    : `${post.city}, ${post.year} - Reconnection post on Falagiye`;

  const shareLinks = [
    {
      name: 'Twitter',
      icon: X,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      color: 'bg-[#1DA1F2] hover:bg-[#1a8cd8]',
    },
    {
      name: 'Facebook',
      icon: MessageCircle,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#4267B2] hover:bg-[#365899]',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
      color: 'bg-[#25D366] hover:bg-[#20bd5a]',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#0077B5] hover:bg-[#006699]',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareDescription + '\n\n' + shareUrl)}`,
      color: 'bg-stone hover:bg-stone-dark',
    },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success(language === 'am' ? 'ሊንክ ተቀድቷል!' : 'Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          setIsOpen(true);
        }
      }
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleNativeShare}
        className={`
          ${variant === 'icon' 
            ? 'p-3 text-olive hover:text-terracotta bg-cream rounded-full transition-colors shadow-sm' 
            : 'btn-outline flex items-center gap-2'
          }
        `}
      >
        <Share2 className="w-5 h-5" />
        {variant !== 'icon' && (
          <span>{language === 'am' ? 'አጋራ' : 'Share'}</span>
        )}
      </button>

      {/* Share Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-charcoal rounded-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-warm-gray/30">
                <h3 className="font-display text-lg font-semibold text-charcoal">
                  {language === 'am' ? 'አጋራ' : 'Share'}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-stone hover:text-charcoal rounded-full hover:bg-warm-gray/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Post Preview */}
              <div className="p-6 border-b border-warm-gray/30">
                <div className="bg-cream rounded-xl p-4">
                  <p className="text-sm text-charcoal line-clamp-2 mb-2">
                    {shareTitle}
                  </p>
                  <p className="text-xs text-stone">
                    {post.city} • {post.year}
                  </p>
                </div>
              </div>

              {/* Share Options */}
              <div className="p-6">
                <p className="text-xs text-stone mb-3">
                  {language === 'am' ? 'በ... በኩል አጋራ' : 'Share via'}
                </p>
                
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {shareLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${link.color} text-white p-3 rounded-xl flex flex-col items-center gap-1 transition-colors`}
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="text-xs hidden sm:block">{link.name}</span>
                    </a>
                  ))}
                </div>

                {/* Copy Link */}
                <div>
                  <p className="text-xs text-stone mb-2">
                    {language === 'am' ? 'ወይም ሊንክ ቅዳ' : 'Or copy link'}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 px-4 py-2.5 bg-cream border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none"
                    />
                    <button
                      onClick={handleCopy}
                      className={`px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                        copied 
                          ? 'bg-hope-green text-white' 
                          : 'bg-terracotta text-white hover:bg-clay'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          {language === 'am' ? 'ተቀድቷል' : 'Copied'}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {language === 'am' ? 'ቅዳ' : 'Copy'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
