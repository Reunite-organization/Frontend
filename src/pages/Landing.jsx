import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useLanguage } from '../lib/i18n';
const assetImages = import.meta.glob('../assets/images/*.{png,jpg,jpeg,svg}', { 
  eager: true, 
  import: 'default' 
});
import {useImpactStats} from "../features/wanted/hooks/useImpactStats"
import { ImpactStats } from '../features/wanted/components/layout/ImpactStats';
import { 
  ArrowRight, 
  Shield, 
  Users, 
  MapPin, 
  Clock, 
  Heart,
  Search,
  MessageCircle,
  Share2,
  Sparkles,
  ContactRound
} from "lucide-react";



// ============================================
// 1. ORGANIZATIONAL HERO
// ============================================
const OrgHeroSection = () => {
  const { language } = useLanguage();


  const getAsset = (name) => assetImages[`../assets/images/${name}.png`] || '';

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-b from-charcoal to-charcoal/95 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container relative py-20 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            {language === "am" ? (
              <>የጠፉትን ይፈልጉ የልቦትን ሰው ያግኙ </>
            ) : (
              <>Find the lost. Reconnect the heart </>
            )}
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            {language === "am"
              ? "ምንም እንኳ ረጅም ጊዜ ቢቆጠር፣ የቱንም ያህል ርቀት ቢኖር፣ ወይም የአድራሻቸው መረጃ ቢጎድልዎ፤ ድረ ገጻችን ይህንን ክፍተት እንድታገናኙ ታሳቢ ተደርጎ የተዘጋጀ ነው። የግል ምስጢሮችን መጠበቅ፣ ሁሉን አቃፊነት እና ታአማኒነት የድረ ገጻችን መገለጫ ነው።"
              : "No matter how long it has been, how far away they are, or how little information you have, our platform is designed to help you bridge that gap. Privacy, inclusivity, and trust are the hallmarks of our platform."}
          </p>

          {/* CTA Split */}
          <div className="flex flex-wrap justify-center gap-4">
           
            
          </div>
        </motion.div>

        {/* Scroll Indicator */}
      </div>
    </section>
  );
};

// ============================================
// 2. DUAL SYSTEM SECTION
// ============================================
const DualSystemSection = () => {
  const { language } = useLanguage();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0 });
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-warm-white to-white">
      <div className="container">
        <motion.div
          ref={ref}
          initial=""
          animate={controls}
          variants={containerVariants}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2 
            variants={cardVariants}
            className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4"
          >
            {language === "am"
              ? "ሪዩናይት ምን አገልግሎት ይሰጣል።"
              : "What Reunite Offers"}
          </motion.h2>
          <motion.p 
            variants={cardVariants}
            className="text-lg text-stone/70"
          >
            {language === "am"
              ? " ሪዩናይት ለእናንተ ሁለት ዋና ዋና መንገዶችን ያቀርባል፤ የመጀመሪያው በድንገት ለጠፉ ሰዎች እና  ፈጣን ምላሽ ለሚሹ ጉዳዮች በማህበረሰቡ ተሳትፎ ፈጣን ምላሽ የሚሰጥ ሲሆን። ሁለተኛው ደግሞ ለረጅም ጊዜ አድራሻቸውን በማጣት ከተለዩዋቸው ከምትወዳቸው ሰዎች ጋር ለመገናኘት አስተማማኝ መንገድ ማቅረብ የሚቀርብ ነው።በሕይወት ያለ ሰው ይገናኛል እና ማንም ሰው ጠፍቶ መቅረት የለበትም። ፍለጋዎን ዛረዉኑ ይጀምሩ።"
              : "Reunite delivers a dual approach to reconnection. Our Rapid Response system  provides immediate community visibility for urgent situations, helping you mobilize resources when every second counts, while our Heart-Centered Connection offers a secure, private, and verified bridge for finding those you have lost touch with, ensuring dignity and safety throughout the process. At the core of our platform is an unwavering commitment: we believe no one should stay lost. We provide the essential tools, technology, and community trust required to turn 'missing' into 'found. " }
          </motion.p>

          <motion.h2 
            variants={cardVariants}
            className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4"
          >
            {language === "am"
              ? "ሪዩናይትን እንዴት ልጠቀም።"
              : "How to Use Reunite"}
          </motion.h2>
          <motion.p 
            variants={cardVariants}
            className="text-lg text-stone/70"
          >
            {language === "am"
              ? "የምትወዱትን ሰው መፈለግ ጥንቃቄ የሚጠይቅ ሂደት ነው። ፍለጋዎን ለመጀመር፣ ከእርሶ ፍለጋ ጋር የሚስማማውን ሂደት ይምረጡ።"
              : "Finding a loved one is a sensitive process. To get started, please choose the system that best matches your current needs:" }
          </motion.p>
          
        </motion.div>

        <motion.div 
          initial=""
          animate={controls}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {/* Emergency System */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="group bg-white rounded-3xl p-8 border-2 border-red-100 hover:border-red-200 shadow-lg hover:shadow-xl transition-all"
          >
            {/* <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <i class="fas fa-divide    ">Reunite AI" (Emergency)</i>
            </div> */}

            <h3 className="text-2xl font-bold mb-3 text-charcoal">
              {language === "am" ? "የጠፉቦትን ሰው ይፈልጉ" : "Missing Person Search"}
            </h3>

            <p className="text-stone/70 mb-6 leading-relaxed">
              {language === "am"
                ? " በቅርብ ጊዜም ሆነ ከረጅም ጊዜ  በፊት በድንገት የጠፉ ሰዎችን ለመፈለግ እሄኛውን መተግበሪያ ይጠቀሙ።።"
                : "Use this system if you are dealing with a sudden loss or an urgent situation where time is of the essence."}
            </p>

            <ul className="space-y-3 mb-8">
              {[
                { icon: Clock, text: language === "am" ? "መቼ ልጠቀም?" : "When to use:" , description:language === "am" ? "ይህንን ለጠፉ ሰዎች ወይም ቅድሚያ ለሚሹ ሁኔታዎች ይጠቀሙ። ማህበረሰቡን በማስተባበር፣ የምትፈልጓቸውን ሰዎች በፍጥነት ለማግኘት እና የፍለጋ ሂደቱን ለማገዝ አስፈላጊውን ድጋፍ እንሰጣለን።": "Use this system for missing persons or emergency situations where every minute matters. We coordinate community alerts and rapid response teams to help bring your loved ones home quickly and safely." },
                { icon: Users, text: language === "am" ? "እንዴት ላመልክት?" : "How to use it" , description: language === "am" ? "የጠፉቦትን ሰው ይፈልጉ የሚለውን ከታች ይጫኑ": "Click the Find Missing Person search below" },
                { icon: MapPin, text: language === "am" ? "እንዴት ልከታተል?" : "What to expect:", description: language === "am" ? "ፍለጋውን ሲጀምሩ፣ ጉዳይዎ እንደየሁኔታው ቅድሚያ ይሰጠዋል። ከማህበረሰቡ ጋር በመተባበር ወዲያውኑ  መረጃዎችን ማሰባሰብ እንጀምራለን። በዚህ ሂደት ውስጥ ፈጣን ፣ የተረጋገጡ የመረጃ ውጤቶች እና ቀጣይነት ያለቸው ታማኝ መረጃ እናደርሶታለን።": "When you start a search, your report is prioritized immediately. Our response team begins coordinating the search, reaching out to the community, and tracking leads. You can expect real-time updates, verified information, and clear communication from us as we work to bring them home." }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-stone/80">
                  <item.icon className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="font-bold p-1 text-blue-800 text-md">{item.text}</span>
                  <p> {item.description}</p>
                </li>
              ))}
            </ul>

             <Link to="/wanted">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-red-700 hover:bg-red-8500 text-white rounded-full font-semibold shadow-lg shadow-red-500/25 transition-all flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                {language === "am" ? "የጠፉቦትን ሰው ይፈልጉ " : "Find Missing Person"}
              </motion.button>
            </Link>

          </motion.div>

          {/* Reconnection System */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="group bg-white rounded-3xl p-8 border-2 border-amber-100 hover:border-amber-200 shadow-lg hover:shadow-xl transition-all"
          >
            <h3 className="text-2xl font-bold mb-3 text-charcoal">
              {language === "am" ? "የልቦትን ሰው ያግኙ" : "Reunite Memory"}
            </h3>

            <p className="text-stone/70 mb-6 leading-relaxed">
              {language === "am"
                ? "በትዝታ እና በታሪኮች ላይ ተመስርቶ የተለዩ ሰዎችን እንደገና የሚያገናኝ ስርዓት። ደህንነቱ የተጠበቀ ማረጋገጫ እና የግል ግንኙነት ያቀርባል።"
                : "Reconnect with people from your past using shared memories and stories. Safe verification and private reconnection built in."}
            </p>

             <ul className="space-y-3 mb-8">
              {[
                { icon: Clock, text: language === "am" ? "መቼ ልጠቀም?" : "When to use:" , description:language === "am" ? "አድራሻቸው ለጠፋባችሁ የልጅነት ጓደኞች፣ የትህምርት ቤት ጓደኛዮች፣ ቀደም ሲል ለነበሩዎት የሥራ ባልደረቦች፣ እና የመሳሰሉትን ሰዎች ለመፈለግ ይሄንን ይጠቀሙ።": "Use this to reconnect with people from your past, such as former colleagues, childhood friends, or anyone with whom you have simply lost touch." },
                { icon: Users, text: language === "am" ? "እንዴት ላመልክት?" : "How to use it" , description: language === "am" ? "ከተራራቁት ሰዎች ጋር ይገናኙ የሚለውን ከታች ይጫኑ": "Click the Reconnect With Someone search below" },
                { icon: MapPin, text: language === "am" ? "እንዴት ልከታተል?" : "What to expect:", description: language === "am" ? "ፍለጋውን ሲጀምሩ፣ ስለሚፈልጉት ሰው ያለዎትን ትዝታ ወይም መረጃ ለማህበረሰቡ ያጋሩ። የምትፈልጉት ሰው ያጋሩትን መረጃ  ካየ እና  ለመነጋገር ፍላጎት ካለው፣ መልእክት በመላክ ምላሽ ይሰጣል። አንዴ ከተገናኛችሁ በኋላ በግል በማውራት ትገናኛላችሁ።": "When you begin, share a memory or detail about the person with our community. If the person you’re looking for sees your post and wants to reconnect, they can respond to you. Once connected, you can start chatting privately." }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-stone/80">
                  <item.icon className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="font-bold p-1 text-blue-800 text-md">{item.text}</span>
                  <p> {item.description}</p>
                </li>
              ))}
            </ul>

            <Link to="/wanted">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-amber-800 hover:bg-amber-900 text-white rounded-full font-semibold shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2"
              >
                {language === "am" ? "ከተራራቁት ሰዎች ጋር ይገናኙ" : "Reconnect With Someone"}
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// 3. TWO TYPES OF LOSS SECTION
// ============================================
const LossUnderstandingSection = () => {
  const { language } = useLanguage();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0 });
  }, [controls, inView]);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-cream/50">
      <div className="container max-w-4xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-charcoal">
            {language === "am" 
              ? "ሰዎች በተለያየ መንገድ ይራራቃሉ"
              : "People Get Lost in Different Ways"}
          </h2>
          <p className="text-lg text-stone/70 mb-16 max-w-2xl mx-auto">
            {language === "am"
              ? "ሰዎች በድንገት ይጠፋፋሉ፣ በጊዜ ሂደት ውስጥም ኑሮን ለማሸነፍ በሚያደርጉት ውጣ ውረድ ውስጥ አንዱ የአንዱ አንድራሳ በማጣት፣ ይራራቃሉ አንዱ የሕይወት አካል ነውና። "
              : "Understanding the nature of separation helps us build better tools for reconnection."}
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Sudden Loss */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={controls}
              transition={{ delay: 0.2 }}
              className="relative p-8 bg-white rounded-2xl shadow-sm border border-red-100"
            >
              <div className="absolute -top-4 left-8 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-red-600 mb-3">
                🚨 {language === "am" ? "በድንገት መጥፋት" : "Sudden Loss"}
              </h3>
              <p className="text-stone/70">
                {language === "am"
                  ? "በድንገት የጠፉ ሰዎች በፍጥነት መረጃን ማሰራጭት እና ፈጣን ምላሽ ያስፈልጋቸዋል "
                  : "Missing persons, emergencies, urgent situations where every minute matters. Fast action required."}
              </p>
            </motion.div>

            {/* Silent Loss */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={controls}
              transition={{ delay: 0.4 }}
              className="relative p-8 bg-white rounded-2xl shadow-sm border border-amber-100"
            >
              <div className="absolute -top-4 left-8 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-amber-600 mb-3">
                💛 {language === "am" ? "አርዳሻቸውን በማጣት መራራቅ" : "Silent Loss"}
              </h3>
              <p className="text-stone/70">
                {language === "am"
                  ? "የተጠፋፉ ጓደኛሞች፣ የተለያዩ ቤተሰቦች፣ በጊዜ ሂደት ግንኙነታቸው እየደበዘዘ ትዝታቸው እየጨመረ ናፍቆትን ያባብሳልና ። ዘላቂ መፍትሄ ያስፈልግርዋል።"
                  : "Lost friends and separated families. As time passes, connections may fade, but memories linger—deepening the longing. We provide the lasting solution to bridge the gap.."}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// 4. IMPACT STATS
// ============================================
const ImpactSection = () => {
  const { language } = useLanguage();
  const { data: stats } = useImpactStats();

  return (
    <section className="py-20 bg-charcoal text-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            {language === "am" ? "የእኛ ተጽዕኖ" : "Our Impact"}
          </h2>
          <p className="text-white/60">
            {language === "am" 
              ? "በመላው ዓለም እና በኢትዮጵያ ውስጥ ኢትዮጵያዊያንን እንደገና ማገናኘት"
              : "Reconnecting Ethiopians worldwide and across Ethiopia."}
          </p>
        </div>
         <ImpactStats />
      </div>
    </section>
  );
};

// ============================================
// 5. TRUST SECTION
// ============================================
const TrustSection = () => {
  const { language } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: language === "am" ? "ደንነቱ የተረጋገጠ" : "Verified Safety",
      description: language === "am" 
        ? "ሁሉም ግንኙነቶች ደንነቱ በተረጋገጠ መንገድ ይከናወናሉ"
        : "All connections verified before proceeding"
    },
    {
      icon: Users,
      title: language === "am" ? "በማህበረሰቡ የተደገፈ" : "Community Powered",
      description: language === "am"
        ? "በሺዎች በሚቆጠሩ በጎ ፈቃደኞች የሚደገፍ"
        : "Thousands of volunteers helping reunite"
    },
    {
      icon: Share2,
      title: language === "am" ? "የግል ምስጢሮ የተጠበቀ" : "Privacy First",
      description: language === "am"
        ? "የእርስዎ መረጃ ደህንነቱ የተጠበቀ ነው"
        : "Your information stays protected"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-charcoal mb-4">
            {language === "am" ? "ለምን Reunite?" : "Why Reunite?"}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="text-center p-6"
            >
              <div className="w-12 h-12 bg-charcoal rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">{feature.title}</h3>
              <p className="text-sm text-stone/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// 6. FINAL CTA
// ============================================
const FinalCTASection = () => {
  const { language } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-charcoal to-stone-900 text-white">
      <div className="container text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {language === "am" 
              ? "ፍለጋውትን ለመጀመር ዝግጁ ነዎት?"
              : "Ready to Find Someone?"}
          </h2>
          <p className="text-white/70 mb-10 text-lg">
            {language === "am"
              ? "ፍለጋዎን ለመጀመር፣ ከእርሶ ፍለጋ ጋር የሚስማማውን ሂደት ይምረጡ።"
              : "Choose your path — we're here to help you reconnect."}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/wanted">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-red-500 hover:bg-red-600 rounded-full font-semibold shadow-lg"
              >
                🚨 {language === "am" ? "የጠፉቦትን ሰው ይፈልጉ " : "Find Missing Person"}
              </motion.button>
            </Link>

            <Link to="/reconnect">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 rounded-full font-semibold shadow-lg"
              >
                💛 {language === "am" ? "ከተራራቁት ሰዎች ጋር ይገናኙ" : "Reconnect With Someone"}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// MAIN LANDING PAGE COMPONENT
// ============================================
export const LandingPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-warm-white">
      <OrgHeroSection />
      <DualSystemSection />
      <LossUnderstandingSection />
      <TrustSection />
      <ImpactSection />
      <FinalCTASection />
    </div>
  );
};

export default LandingPage;
