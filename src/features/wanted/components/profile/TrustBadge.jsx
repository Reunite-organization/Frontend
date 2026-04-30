import { Shield, ShieldCheck, ShieldAlert, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../../lib/i18n';

const TrustLevel = ({ score, size = 'md', showLabel = true }) => {
  const { language } = useLanguage();
  
  const getLevel = (score) => {
    if (score >= 80) return { 
      level: 'verified',
      icon: Award,
      color: 'text-hope-green',
      bg: 'bg-hope-green/10',
      border: 'border-hope-green/30',
      label: { en: 'Verified Reconnector', am: 'የተረጋገጠ አገናኝ' }
    };
    if (score >= 60) return { 
      level: 'trusted',
      icon: ShieldCheck,
      color: 'text-sahara',
      bg: 'bg-sahara/10',
      border: 'border-sahara/30',
      label: { en: 'Trusted', am: 'የታመነ' }
    };
    if (score >= 40) return { 
      level: 'standard',
      icon: Shield,
      color: 'text-olive',
      bg: 'bg-olive/10',
      border: 'border-olive/30',
      label: { en: 'Standard', am: 'መደበኛ' }
    };
    return { 
      level: 'new',
      icon: ShieldAlert,
      color: 'text-stone',
      bg: 'bg-stone/10',
      border: 'border-stone/30',
      label: { en: 'New Member', am: 'አዲስ አባል' }
    };
  };

  const level = getLevel(score || 0);
  const Icon = level.icon;

  const sizes = {
    sm: { icon: 'w-3.5 h-3.5', text: 'text-xs', padding: 'px-2 py-0.5' },
    md: { icon: 'w-4 h-4', text: 'text-sm', padding: 'px-2.5 py-1' },
    lg: { icon: 'w-5 h-5', text: 'text-base', padding: 'px-3 py-1.5' },
  };

  const sizeConfig = sizes[size] || sizes.md;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative group"
    >
      <div
        className={`
          inline-flex items-center gap-1.5 rounded-full border
          ${level.bg} ${level.border} ${sizeConfig.padding}
          cursor-help transition-all hover:shadow-sm
        `}
      >
        <Icon className={`${sizeConfig.icon} ${level.color}`} />
        <span className={`${sizeConfig.text} font-medium ${level.color}`}>
          {score || 0}
        </span>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-charcoal text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        <div className="font-medium mb-1">
          {level.label[language] || level.label.en}
        </div>
        <div className="text-white/70">
          {language === 'am' 
            ? `የመተማመኛ ነጥብ፡ ${score}/100`
            : `Trust Score: ${score}/100`
          }
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-charcoal" />
      </div>
    </motion.div>
  );
};

export const TrustBadge = ({ score, size = 'md', showLabel = true, className = '' }) => {
  if (score === undefined || score === null) {
    return null;
  }

  return (
    <div className={className}>
      <TrustLevel score={score} size={size} showLabel={showLabel} />
    </div>
  );
};

// Extended Trust Badge with progress bar
export const TrustBadgeDetailed = ({ score, className = '' }) => {
  const { language } = useLanguage();
  const percentage = Math.min(score || 0, 100);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <TrustBadge score={score} size="md" />
        <span className="text-xs text-stone">
          {percentage}/100
        </span>
      </div>
      
      <div className="h-1.5 bg-warm-gray rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            percentage >= 80 ? 'bg-hope-green' :
            percentage >= 60 ? 'bg-sahara' :
            percentage >= 40 ? 'bg-olive' :
            'bg-stone'
          }`}
        />
      </div>

      <div className="flex justify-between text-xs text-stone">
        <span>{language === 'am' ? 'አዲስ' : 'New'}</span>
        <span>{language === 'am' ? 'መደበኛ' : 'Standard'}</span>
        <span>{language === 'am' ? 'የታመነ' : 'Trusted'}</span>
        <span>{language === 'am' ? 'የተረጋገጠ' : 'Verified'}</span>
      </div>
    </div>
  );
};
