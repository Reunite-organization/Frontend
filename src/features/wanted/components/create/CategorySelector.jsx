import { motion } from 'framer-motion';
import { 
  Heart, 
  Home, 
  Briefcase, 
  GraduationCap, 
  Users, 
  Calendar, 
  Users2, 
  MoreHorizontal,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { CATEGORIES } from '../../utils/constants';

const CategoryIcon = ({ category }) => {
  const icons = {
    childhood_friend: Heart,
    old_neighbor: Home,
    former_colleague: Briefcase,
    school_friend: GraduationCap,
    community_member: Users,
    event_connection: Calendar,
    family_connection: Users2,
    other: MoreHorizontal,
  };
  
  const Icon = icons[category] || Heart;
  return <Icon className="w-5 h-5" />;
};

export const CategorySelector = ({ value, onChange, error }) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-charcoal">
        {language === 'am' ? 'ምድብ *' : 'Category *'}
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CATEGORIES.map((category) => (
          <motion.button
            key={category.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(category.value)}
            className={`
              relative p-4 rounded-xl border-2 text-left transition-all
              ${value === category.value
                ? 'border-terracotta bg-terracotta/5 shadow-md'
                : 'border-warm-gray/30 bg-cream/50 hover:border-terracotta/50 hover:shadow-sm'
              }
            `}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center transition-colors
                ${value === category.value
                  ? 'bg-terracotta text-white'
                  : 'bg-warm-gray/30 text-olive group-hover:bg-terracotta/20'
                }
              `}>
                <CategoryIcon category={category.value} />
              </div>
              <div>
                <p className={`font-medium text-sm ${
                  value === category.value ? 'text-terracotta' : 'text-charcoal'
                }`}>
                  {language === 'am' ? category.am : category.en}
                </p>
              </div>
            </div>

            {value === category.value && (
              <motion.div
                layoutId="selectedCategory"
                className="absolute -top-2 -right-2 w-6 h-6 bg-terracotta rounded-full flex items-center justify-center"
              >
                <span className="text-white text-xs">✓</span>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error flex items-center gap-1"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </motion.p>
      )}
    </div>
  );
};
