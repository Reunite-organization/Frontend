import { motion } from 'framer-motion';
import { Heart, Search, Inbox, UserPlus, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../../lib/i18n';

const icons = {
  posts: Search,
  claims: Inbox,
  messages: MessageCircle,
  profile: UserPlus,
  default: Heart,
};

const defaultMessages = {
  posts: {
    en: {
      title: 'No posts found',
      description: 'Be the first to create a post and start reconnecting',
    },
    am: {
      title: 'ምንም ልጥፎች አልተገኙም',
      description: 'የመጀመሪያው ልጥፍ ይፍጠሩ እና እንደገና መገናኘት ይጀምሩ',
    },
  },
  claims: {
    en: {
      title: 'No claims yet',
      description: 'When someone claims your post, they\'ll appear here',
    },
    am: {
      title: 'እስካሁን ምንም የይገባኛል ጥያቄ የለም',
      description: 'አንድ ሰው ልጥፍዎን ሲጠይቅ እዚህ ይታያል',
    },
  },
  messages: {
    en: {
      title: 'No messages yet',
      description: 'Start a conversation after a claim is approved',
    },
    am: {
      title: 'እስካሁን ምንም መልእክት የለም',
      description: 'የይገባኛል ጥያቄ ከጸደቀ በኋላ ውይይት ይጀምሩ',
    },
  },
  default: {
    en: {
      title: 'Nothing here yet',
      description: 'Check back later',
    },
    am: {
      title: 'እስካሁን ምንም የለም',
      description: 'ቆይተው ያረጋግጡ',
    },
  },
};

export const EmptyState = ({ 
  type = 'default', 
  title, 
  description, 
  action,
  icon: CustomIcon,
}) => {
  const { language } = useLanguage();
  
  const messages = defaultMessages[type] || defaultMessages.default;
  const displayTitle = title || messages[language]?.title || messages.en.title;
  const displayDescription = description || messages[language]?.description || messages.en.description;
  
  const Icon = CustomIcon || icons[type] || icons.default;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-6"
      >
        <div className="w-24 h-24 rounded-full bg-terracotta/10 flex items-center justify-center">
          <Icon className="w-12 h-12 text-terracotta" />
        </div>
      </motion.div>

      <h3 className="font-display text-2xl font-semibold text-charcoal mb-3">
        {displayTitle}
      </h3>
      
      <p className="text-stone max-w-md mb-8">
        {displayDescription}
      </p>

      {action && (
        <Link
          to={action.to}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Icon className="w-4 h-4" />
          {action.label}
        </Link>
      )}
    </motion.div>
  );
};
