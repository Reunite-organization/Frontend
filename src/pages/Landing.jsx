import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
const assetImages = import.meta.glob('../assets/images/*.{png,jpg,jpeg,svg}', { 
  eager: true, 
  import: 'default' 
});
import { 
  Heart, 
  Users, 
  Globe, 
  Shield, 
  ArrowRight, 
  Play,
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  Search,
  PenTool,
  CheckCircle,
  Lock,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/i18n';
import {useImpactStats} from "../features/wanted/hooks/useImpactStats"

 
const getAsset = (name) => assetImages[`../assets/images/${name}.png`] || '';

// Hero Section
const HeroSection = () => {
  const { language } = useLanguage();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 150]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-warm-white" />
        <img 
          src={getAsset("hero1")}
          alt="People reuniting"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ opacity }}
          className="max-w-4xl"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
            <Heart className="w-4 h-4 text-terracotta" />
            <span className="text-white/90 text-sm font-medium">
              {language === 'am' 
                ? '847+ በላይ ሰዎች እንደገና ተገናኝተዋል'
                : '847+ people already reunited'
              }
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-tight">
            {language === 'am' ? (
              <>ያጡትን ሰው<br />እንደገና ያግኙ</>
            ) : (
              <>Find the People<br />You Thought You Lost</>
            )}
            <span className="text-gradient-warm block text-4xl md:text-6xl lg:text-7xl mt-4">
              {language === 'am' 
                ? 'ለዘላለም'
                : 'Forever'
              }
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mb-8 leading-relaxed">
            {language === 'am'
              ? 'በትዝታ፣ በማህበረሰብ እና በእምነት የተደገፈ የዳግም ግንኙነት መድረክ።'
              : 'Reconnect across time, distance, and silence — powered by memory, community, and trust.'
            }
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/wanted"
              className="group px-8 py-4 bg-white text-charcoal rounded-full font-semibold hover:bg-warm-white transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <Search className="w-5 h-5 group-hover:text-terracotta transition-colors" />
              {language === 'am' ? 'መፈለግ ጀምር' : 'Start Searching'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/wanted/create"
              className="px-8 py-4 bg-terracotta text-white rounded-full font-semibold hover:bg-clay transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              <PenTool className="w-5 h-5" />
              {language === 'am' ? 'ትዝታ አካፍል' : 'Share a Memory'}
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center gap-8 mt-12">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-sahara to-terracotta" />
              ))}
            </div>
            <p className="text-white/80 text-sm">
              <span className="font-bold">200+</span> {language === 'am' ? 'በዚህ ሳምንት ተቀላቅለዋል' : 'joined this week'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
};

// Problem Section
const ProblemSection = () => {
  const { language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const problems = [
    {
      icon: Users,
      title: { en: 'Migration Separates', am: 'ስደት ይለያል' },
      description: { 
        en: 'Friends lost after moving countries',
        am: 'ሀገር ከቀየሩ በኋላ የጠፉ ጓደኞች'
      }
    },
    {
      icon: Globe,
      title: { en: 'Families Scattered', am: 'ቤተሰቦች ተበታትነዋል' },
      description: { 
        en: 'Generations separated across continents',
        am: 'በአህጉራት የተለያዩ ትውልዶች'
      }
    },
    {
      icon: Heart,
      title: { en: 'Connections Fade', am: 'ግንኙነቶች ይደበዝዛሉ' },
      description: { 
        en: 'Classmates you never found again',
        am: 'ዳግም ያላገኟቸው የክፍል ጓደኞች'
      }
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-cream">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-6">
            {language === 'am' 
              ? 'በየቀኑ ግንኙነቶች ይጠፋሉ'
              : 'Every Day, Connections Disappear'
            }
          </h2>
          <p className="text-xl text-stone">
            {language === 'am'
              ? 'ማህበራዊ ሚዲያ ለዚህ አልተሰራም። የፍለጋ ሞተሮች ትዝታዎችን አይረዱም።'
              : 'Social media wasn\'t built for this. Search engines don\'t understand memories.'
            }
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="text-center p-8 bg-white rounded-2xl shadow-sm"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-terracotta/10 flex items-center justify-center">
                <problem.icon className="w-8 h-8 text-terracotta" />
              </div>
              <h3 className="text-xl font-display font-semibold text-charcoal mb-3">
                {language === 'am' ? problem.title.am : problem.title.en}
              </h3>
              <p className="text-stone">
                {language === 'am' ? problem.description.am : problem.description.en}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Solution Section with Horizontal Scroll
const SolutionSection = () => {
  const { language } = useLanguage();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const images = [
    { src: getAsset('sol 2'), title: 'Share Memories', desc: 'Post what you remember' },
    { src: getAsset('hero 2'), title: 'Discover Matches', desc: 'Find similar stories' },
    { src: getAsset('hero 3'), title: 'Verify Identity', desc: 'Secret questions only they know' },
    { src: getAsset('hero 4'), title: 'Reconnect Safely', desc: 'Chat after approval' },
    { src: getAsset('hero 5'), title: 'Community Support', desc: 'Others help find them' },
  ];

  return (
    <section className="py-20 bg-warm-white overflow-hidden">
      <div className="container mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-6">
            {language === 'am' 
              ? 'አንድ መድረክ። ሁለት ኃይለኛ ስርዓቶች።'
              : 'One Platform. Two Powerful Systems.'
            }
          </h2>
        </motion.div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-warm-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-charcoal" />
          </button>
        )}

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-warm-white transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-charcoal" />
          </button>
        )}

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 px-4 md:px-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex-shrink-0 w-[300px] md:w-[400px] snap-start"
            >
              <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
                <div className="aspect-[4/5] bg-gradient-to-br from-terracotta/20 to-sahara/20">
                  <img 
                    src={item.src} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-display font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-white/80 text-sm">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* System Cards */}
      <div className="container mt-20">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-terracotta to-clay text-white rounded-3xl p-8 md:p-12"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-6">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-4">Reunite</h3>
            <p className="text-white/80 mb-6">Discovery Engine</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-white/60" />
                Post memories, not just names
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-white/60" />
                Smart matching based on story & place
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-white/60" />
                Community-powered discovery
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-sahara to-sahara-dark text-white rounded-3xl p-8 md:p-12"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-4">Falagiye</h3>
            <p className="text-white/80 mb-6">Verification Engine</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-white/60" />
                Secret questions only they can answer
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-white/60" />
                Trust scoring system
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-white/60" />
                Safe, controlled reconnection
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Impact Section with Stats
const ImpactSection = () => {
  const { language } = useLanguage();
  const { data: stats } = useImpactStats();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const impactStories = [
    {
      quote: { 
        en: "After 20 years, I found my mother's long-lost sister through a single memory.",
        am: "ከ20 ዓመታት በኋላ የእናቴን የጠፋች እህት በአንድ ትዝታ አገኘኋት።"
      },
      author: { en: "Selam T.", am: "ሰላም ተ." },
      image: "/images/stories/story-1.jpg"
    },
    {
      quote: { 
        en: "My childhood best friend and I reunited. We hadn't spoken in 15 years.",
        am: "የልጅነት ጓደኛዬን አገኘሁት። ለ15 ዓመታት አልተነጋገርንም ነበር።"
      },
      author: { en: "Henok D.", am: "ሄኖክ ደ." },
      image: "/images/stories/story-2.jpg"
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-warm-white to-cream">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-6">
            {language === 'am' 
              ? 'ይህ ምርት ብቻ አይደለም።'
              : 'This Isn\'t Just a Product.'
            }
          </h2>
          <p className="text-2xl text-terracotta font-display">
            {language === 'am' 
              ? 'ዲጂታል ማህበራዊ ፈውስ ነው።'
              : 'It\'s Digital Social Healing.'
            }
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="text-center p-6 bg-white rounded-2xl shadow-sm"
          >
            <div className="text-4xl font-display font-bold text-terracotta mb-2">
              {stats?.reunited || '847'}+
            </div>
            <div className="text-stone text-sm">
              {language === 'am' ? 'የተገናኙ' : 'Reunited'}
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-center p-6 bg-white rounded-2xl shadow-sm"
          >
            <div className="text-4xl font-display font-bold text-sahara mb-2">
              {stats?.countries || '9'}
            </div>
            <div className="text-stone text-sm">
              {language === 'am' ? 'ሀገራት' : 'Countries'}
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="text-center p-6 bg-white rounded-2xl shadow-sm"
          >
            <div className="text-4xl font-display font-bold text-hope-green mb-2">
              {stats?.successRate || '74'}%
            </div>
            <div className="text-stone text-sm">
              {language === 'am' ? 'የስኬት መጠን' : 'Success Rate'}
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-center p-6 bg-white rounded-2xl shadow-sm"
          >
            <div className="text-4xl font-display font-bold text-warmth mb-2">
              {stats?.activeSearches || '4K'}+
            </div>
            <div className="text-stone text-sm">
              {language === 'am' ? 'በመፈለግ ላይ' : 'Searching'}
            </div>
          </motion.div>
        </div>

        {/* Impact Stories */}
        <div className="grid md:grid-cols-2 gap-8">
          {impactStories.map((story, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="aspect-[3/2] bg-gradient-to-br from-terracotta/20 to-sahara/20">
                <img src={getAsset("hero 3")} alt="Story" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <Quote className="w-8 h-8 text-terracotta/30 mb-4" />
                <p className="text-lg text-charcoal mb-4 italic">
                  "{language === 'am' ? story.quote.am : story.quote.en}"
                </p>
                <p className="text-sm font-medium text-terracotta">
                  — {story.author[language] || story.author.en}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Trust Section
const TrustSection = () => {
  const { language } = useLanguage();
  const features = [
    { icon: Lock, title: { en: 'Identity Verification', am: 'ማንነት ማረጋገጫ' } },
    { icon: Award, title: { en: 'Trust Score System', am: 'የእምነት ነጥብ ስርዓት' } },
    { icon: Shield, title: { en: 'Abuse Prevention', am: 'አላግባብ መከላከል' } },
    { icon: Lock, title: { en: 'Private Chat After Approval', am: 'ከፈቃድ በኋላ የግል ቻት' } },
  ];

  return (
    <section className="py-20 bg-charcoal text-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <Shield className="w-12 h-12 text-terracotta mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {language === 'am' 
              ? 'የተገነባው በእምነት እና ደህንነት ላይ ነው'
              : 'Built on Trust & Safety'
            }
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-6 bg-white/5 rounded-2xl border border-white/10"
            >
              <feature.icon className="w-8 h-8 text-terracotta mx-auto mb-4" />
              <p className="text-sm font-medium">
                {language === 'am' ? feature.title.am : feature.title.en}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Final CTA Section
const FinalCTASection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-24 bg-gradient-to-br from-terracotta to-clay text-white">
      <div className="container text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Heart className="w-16 h-16 mx-auto mb-6 text-white/80" />
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            {language === 'am' 
              ? 'ምናልባት አንድ ሰው እርስዎን እየፈለገ ሊሆን ይችላል'
              : 'Someone might already be looking for you'
            }
          </h2>
          <p className="text-xl text-white/80 mb-10">
            {language === 'am'
              ? 'ዛሬ የመጀመሪያ እርምጃዎን ይውሰዱ።'
              : 'Take the first step today.'
            }
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/wanted"
              className="px-8 py-4 bg-white text-terracotta rounded-full font-semibold hover:bg-warm-white transition-all shadow-lg inline-flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              {language === 'am' ? 'መፈለግ ጀምር' : 'Start Searching'}
            </Link>
            <Link
              to="/wanted/create"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all inline-flex items-center gap-2"
            >
              <PenTool className="w-5 h-5" />
              {language === 'am' ? 'ትዝታ አካፍል' : 'Post a Memory'}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Main Landing Page Component
export const LandingPage = () => {
  return (
    <div className="bg-warm-white">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <ImpactSection />
      <TrustSection />
      <FinalCTASection />
      
      {/* Footer */}
      <footer className="bg-charcoal text-white/60 py-8">
        <div className="container text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Reunite × Falagiye • Built for real-world reconnection • Privacy-first architecture
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
