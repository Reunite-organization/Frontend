import { motion } from 'framer-motion';
import { Heart, Users, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../../lib/i18n';

export const WantedHero = () => {
  const { t, language } = useLanguage();
  
  const stats = [
    { 
      value: '2,847', 
      label: { en: 'Reunited', am: 'ተገናኝተዋል' },
      icon: Heart 
    },
    { 
      value: '450', 
      label: { en: 'Searching', am: 'በመፈለግ ላይ' },
      icon: Users 
    },
    { 
      value: '9', 
      label: { en: 'Countries', am: 'ሀገራት' },
      icon: MapPin 
    },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C4654A' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-warmth/10 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hope-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-hope-green" />
              </span>
              <span className="text-sm font-medium text-olive">
                {language === 'am' ? 'ዳግም መገናኘት ይቻላል' : 'Reconnection is possible'}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              <span className="text-charcoal">
                {language === 'am' ? 'ያጡትን ሰው ' : 'Find the ones '}
              </span>
              <span className="text-gradient-warm">
                {language === 'am' ? 'ያለፈውን ግንኙነት' : 'you thought'}
              </span>
              <br />
              <span className="text-charcoal">
                {language === 'am' ? 'እንደገና ያግኙ' : 'were lost forever'}
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-stone max-w-lg leading-relaxed">
              {language === 'am' 
                ? 'በትዝታዎች እና በማህበረሰብ እምነት ላይ የተመሰረተ የዳግም ግንኙነት መድረክ። ከጠፉት ጋር እንደገና ለመገናኘት አስተማማኝ እና ሰብአዊ መንገድ።'
                : 'A reconnection platform built on shared memories and community trust. A safe, human way to find those you\'ve lost touch with.'
              }
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/wanted/browse" className="btn-primary inline-flex items-center gap-2">
                {language === 'am' ? 'መፈለግ ጀምር' : 'Start Searching'}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/wanted/create" className="btn-outline">
                {language === 'am' ? 'ልጥፍ ፍጠር' : 'Create a Post'}
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-warm-white bg-gradient-to-br from-sahara to-terracotta flex items-center justify-center text-white text-sm font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-stone">
                <span className="font-bold text-charcoal">1,200+</span>{' '}
                {language === 'am' ? 'በዚህ ሳምንት ተቀላቅለዋል' : 'joined this week'}
              </p>
            </div>
          </motion.div>

          {/* Right Content - Impact Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main Image/Illustration */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-terracotta/20 to-sahara/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Heart className="w-20 h-20 text-terracotta mx-auto mb-4 animate-float" />
                  <p className="font-display text-2xl text-charcoal">
                    {language === 'am' ? 'እያንዳንዱ ግንኙነት' : 'Every connection'}
                    <br />
                    <span className="text-gradient-warm text-3xl font-bold">
                      {language === 'am' ? 'ዋጋ አለው' : 'matters'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute -bottom-6 -left-6 right-6">
              <div className="grid grid-cols-3 gap-3">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="stat-card"
                  >
                    <stat.icon className="w-5 h-5 text-terracotta mx-auto mb-2" />
                    <div className="stat-number text-2xl">{stat.value}</div>
                    <div className="stat-label text-xs">
                      {language === 'am' ? stat.label.am : stat.label.en}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-warm-white to-transparent pointer-events-none" />
    </section>
  );
};
