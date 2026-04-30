import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, MessageCircle, Link as LinkIcon, Mail, AtSign } from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { useState } from 'react';
import { toast } from 'sonner';

export const ShareModal = ({ isOpen, onClose, post }) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const shareUrl = `${window.location.origin}/wanted/post/${post._id}`;
  const shareTitle = language === 'am' 
    ? 'ፈላጊዬ ላይ ይህን ልጥፍ ተመልከት' 
    : 'Check out this post on Reunite';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success(language === 'am' ? 'ሊንክ ተቀድቷል!' : 'Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: X,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      color: 'bg-[#1DA1F2]',
    },
    {
      name: 'Facebook',
      icon: AtSign,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#4267B2]',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`,
      color: 'bg-stone',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-semibold text-charcoal">
                {language === 'am' ? 'አጋራ' : 'Share'}
              </h3>
              <button
                onClick={onClose}
                className="p-1 text-stone hover:text-charcoal transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Post Preview */}
            <div className="bg-cream rounded-xl p-4 mb-6">
              <p className="text-sm text-charcoal line-clamp-2">
                {post.memoryText?.[language] || post.memoryText?.en}
              </p>
              <p className="text-xs text-stone mt-2">
                {post.city} • {post.year}
              </p>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${link.color} text-white p-3 rounded-xl flex flex-col items-center gap-1 hover:opacity-90 transition-opacity`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="text-xs">{link.name}</span>
                </a>
              ))}
            </div>

            {/* Copy Link */}
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-cream border border-warm-gray rounded-lg text-sm text-charcoal"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-clay transition-colors flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                {copied 
                  ? (language === 'am' ? 'ተቀድቷል!' : 'Copied!')
                  : (language === 'am' ? 'ቅዳ' : 'Copy')
                }
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
