import { motion } from 'framer-motion';
import { Heart, Users, Globe, Star } from 'lucide-react';
import { useImpactStats } from '../../hooks/useImpactStats';
import { useLanguage } from '../../../../lib/i18n';

export const ImpactStats = ({ compact = false }) => {
  const { language } = useLanguage();
  const { data: stats, isLoading } = useImpactStats();

  const items = [
    {
      value: stats?.reunited || '147',
      label: { en: 'People Reunited', am: 'የተገናኙ ሰዎች' },
      icon: Heart,
      color: 'text-terracotta',
    },
    {
      value: stats?.activePosts || '450',
      label: { en: 'Active Searches', am: 'በፍለጋ ላይ ያሉ' },
      icon: Users,
      color: 'text-sahara',
    },
    {
      value: stats?.countries || '9',
      label: { en: 'Countries', am: 'ሀገራት' },
      icon: Globe,
      color: 'text-hope-green',
    },
    {
      value: stats?.successRate || '74%',
      label: { en: 'Success Rate', am: 'የስኬት መለኪያ' },
      icon: Star,
      color: 'text-warmth',
    },
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="text-center">
            <div className={`text-2xl md:text-3xl font-display font-bold ${item.color}`}>
              {item.value}
            </div>
            <div className="text-xs md:text-sm text-stone">
              {language === 'am' ? item.label.am : item.label.en}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="stat-card"
        >
          <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-4`} />
          <div className={`stat-number ${item.color}`}>{item.value}</div>
          <div className="stat-label">
            {language === 'am' ? item.label.am : item.label.en}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
