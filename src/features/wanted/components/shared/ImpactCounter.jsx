import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Users, Globe, Award, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { useImpactStats } from '../../hooks/useImpactStats';

const Counter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * value);
      
      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration, isInView]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

const ImpactCard = ({ icon: Icon, value, label, suffix = '', color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="text-center"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cream to-warm-white border border-warm-gray/30 flex items-center justify-center">
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
      
      <div className={`text-3xl md:text-4xl font-display font-bold ${color} mb-2`}>
        <Counter value={value} />
        {suffix}
      </div>
      
      <p className="text-sm text-stone uppercase tracking-wider">
        {label}
      </p>
    </motion.div>
  );
};

export const ImpactCounter = ({ variant = 'full' }) => {
  const { language } = useLanguage();
  const { data: stats, isLoading } = useImpactStats();

  const defaultStats = {
    reunited: 2847,
    activeSearches: 12450,
    countries: 89,
    successRate: 94,
    monthlyGrowth: 15,
  };

  const displayStats = stats || defaultStats;

  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-around py-4">
        <div className="text-center">
          <div className="text-2xl font-display font-bold text-terracotta">
            <Counter value={displayStats.reunited} />
          </div>
          <div className="text-xs text-stone">
            {language === 'am' ? 'ተገናኝተዋል' : 'Reunited'}
          </div>
        </div>
        <div className="w-px h-8 bg-warm-gray/30" />
        <div className="text-center">
          <div className="text-2xl font-display font-bold text-sahara">
            <Counter value={displayStats.countries} />
          </div>
          <div className="text-xs text-stone">
            {language === 'am' ? 'ሀገራት' : 'Countries'}
          </div>
        </div>
        <div className="w-px h-8 bg-warm-gray/30" />
        <div className="text-center">
          <div className="text-2xl font-display font-bold text-hope-green">
            {displayStats.successRate}%
          </div>
          <div className="text-xs text-stone">
            {language === 'am' ? 'የስኬት መጠን' : 'Success Rate'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/10 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-terracotta" />
            <span className="text-sm font-medium text-olive">
              {language === 'am' ? 'ተጽዕኖአችን' : 'Our Impact'}
            </span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-4">
            {language === 'am'
              ? 'ሰዎችን እንደገና በማገናኘት'
              : 'Reconnecting People'
            }
          </h2>
          
          <p className="text-stone">
            {language === 'am'
              ? 'በየቀኑ በመቶዎች የሚቆጠሩ ሰዎች በፈላጊዬ አማካኝነት እንደገና ይገናኛሉ'
              : 'Every day, hundreds of people reconnect through Falagiye'
            }
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          <ImpactCard
            icon={Heart}
            value={displayStats.reunited}
            label={language === 'am' ? 'የተገናኙ' : 'Reunited'}
            color="text-terracotta"
            delay={0}
          />
          
          <ImpactCard
            icon={Users}
            value={displayStats.activeSearches}
            label={language === 'am' ? 'በመፈለግ ላይ' : 'Searching'}
            color="text-sahara"
            delay={0.1}
          />
          
          <ImpactCard
            icon={Globe}
            value={displayStats.countries}
            label={language === 'am' ? 'ሀገራት' : 'Countries'}
            color="text-hope-green"
            delay={0.2}
          />
          
          <ImpactCard
            icon={Award}
            value={displayStats.successRate}
            suffix="%"
            label={language === 'am' ? 'የስኬት መጠን' : 'Success Rate'}
            color="text-warmth"
            delay={0.3}
          />
          
          <ImpactCard
            icon={TrendingUp}
            value={displayStats.monthlyGrowth}
            suffix="%"
            label={language === 'am' ? 'ወርሃዊ እድገት' : 'Monthly Growth'}
            color="text-olive"
            delay={0.4}
          />
        </div>

        {/* Trust Message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-stone">
            {language === 'am'
              ? '⭐ 4.9 ኮከብ ደረጃ ከ200+ ግምገማዎች'
              : '⭐ 4.9 star rating from 200+ reviews'
            }
          </p>
        </motion.div>
      </div>
    </section>
  );
};
