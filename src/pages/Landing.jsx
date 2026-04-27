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




// 1. ORGANIZATIONAL HERO

const OrgHeroSection = () => {
  const { language } = useLanguage();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center text-white overflow-hidden">

      {/* 🎥 VIDEO BACKGROUND */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/vedio1.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

      {/* ✨ CONTENT */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >

          {/* HEADLINE */}
          <h1 className="
            text-4xl 
            sm:text-5xl 
            md:text-6xl 
            lg:text-7xl 
            font-bold 
            tracking-tight 
            leading-[1.1] 
            mb-6
          ">
            {language === "am" ? (
              <>የጠፉትን ይፈልጉ የልቦትን ሰው ያግኙ</>
            ) : (
              <>Find the lost. Reconnect the heart</>
            )}
          </h1>

          {/* SUBTEXT */}
          <p className="
            text-base 
            sm:text-lg 
            md:text-xl 
            text-white/80 
            leading-relaxed 
            mb-10 
            max-w-2xl 
            mx-auto
          ">
            {language === "am"
              ? "ምንም እንኳ ረጅም ጊዜ ቢቆጠር፣ የቱንም ያህል ርቀት ቢኖር፣ ወይም የአድራሻቸው መረጃ ቢጎድልዎ፤ ድረ ገጻችን ይህንን ክፍተት እንድታገናኙ ታሳቢ ተደርጎ የተዘጋጀ ነው። የግል ምስጢሮችን መጠበቅ፣ ሁሉን አቃፊነት እና ታአማኒነት የድረ ገጻችን መገለጫ ነው።"
              : "No matter how long it has been, how far away they are, or how little information you have, our platform is designed to help you bridge that gap. Privacy, inclusivity, and trust are the hallmarks of our platform."}
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-wrap justify-center gap-4">

            <Link to="/wanted">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="
                  px-8 py-4 
                  bg-red-500 
                  hover:bg-red-600 
                  rounded-full 
                  font-semibold 
                  shadow-lg 
                  shadow-red-500/30 
                  transition-all
                "
              >
                 {language === "am" ? "ዝርዝሩን ይመልከቱ" : "Read More"}
              </motion.button>
            </Link>

            

          </div>
        </motion.div>
      </div>
    </section>
  );
};


const DualSystemSection = () => {
  const { language } = useLanguage();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative py-28 md:py-32 bg-white">

      {/* subtle divider */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

      <div className="container">

        {/* == HEADER == */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="text-center max-w-5xl mx-auto mb-20 md:mb-24 space-y-6"
        >

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold tracking-tight text-charcoal"
          >
            {language === "am"
              ? "ሪዩናይት ምን አገልግሎት ይሰጣል።"
              : "What Reunite Offers"}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-stone-600 leading-relaxed"
          >
            {language === "am"
              ? " ሪዩናይት ለእናንተ ሁለት ዋና ዋና መንገዶችን ያቀርባል፤ የመጀመሪያው በድንገት ለጠፉ ሰዎች እና  ፈጣን ምላሽ ለሚሹ ጉዳዮች በማህበረሰቡ ተሳትፎ ፈጣን ምላሽ የሚሰጥ ሲሆን። ሁለተኛው ደግሞ ለረጅም ጊዜ አድራሻቸውን በማጣት ከተለዩዋቸው ከምትወዳቸው ሰዎች ጋር ለመገናኘት አስተማማኝ መንገድ ማቅረብ የሚቀርብ ነው።በሕይወት ያለ ሰው ይገናኛል እና ማንም ሰው ጠፍቶ መቅረት የለበትም። ፍለጋዎን ዛረዉኑ ይጀምሩ።"
              : "Reunite delivers a dual approach to reconnection. Our Rapid Response system  provides immediate community visibility for urgent situations, helping you mobilize resources when every second counts, while our Heart-Centered Connection offers a secure, private, and verified bridge for finding those you have lost touch with, ensuring dignity and safety throughout the process. At the core of our platform is an unwavering commitment: we believe no one should stay lost. We provide the essential tools, technology, and community trust required to turn 'missing' into 'found. "}
          </motion.p>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold tracking-tight text-charcoal pt-8"
          >
            {language === "am"
              ? "ሪዩናይትን እንዴት ልጠቀም።"
              : "How to Use Reunite"}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-stone-600 leading-relaxed"
          >
            {language === "am"
              ? "የምትወዱትን ሰው መፈለግ ጥንቃቄ የሚጠይቅ ሂደት ነው። ፍለጋዎን ለመጀመር፣ ከእርሶ ፍለጋ ጋር የሚስማማውን ሂደት ይምረጡ።"
              : "Finding a loved one is a sensitive process. To get started, please choose the system that best matches your current needs:"}
          </motion.p>

        </motion.div>

        {/* == CARDS  */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid md:grid-cols-2 gap-10 md:gap-12 max-w-5xl mx-auto"
        >

          {/* ===== LEFT CARD ===== */}
          <motion.div
            variants={itemVariants}
            className="group bg-white rounded-3xl p-8 md:p-10 border border-stone-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-charcoal">
              {language === "am" ? "የጠፉቦትን ሰው ይፈልጉ" : "Missing Person Search"}
            </h3>

            <p className="text-stone-600 mb-6 leading-relaxed">
              {language === "am"
                ? " በቅርብ ጊዜም ሆነ ከረጅም ጊዜ  በፊት በድንገት የጠፉ ሰዎችን ለመፈለግ እሄኛውን መተግበሪያ ይጠቀሙ።።"
                : "Use this system if you are dealing with a sudden loss or an urgent situation where time is of the essence."}
            </p>

            <ul className="space-y-4">
              {[
                { icon: Clock, text: language === "am" ? "መቼ ልጠቀም?" : "When to use:" , description:language === "am" ? "..." : "Use this system for missing persons or emergency situations..." },
                { icon: Users, text: language === "am" ? "እንዴት ላመልክት?" : "How to use it" , description: language === "am" ? "..." : "Click the Find Missing Person search below" },
                { icon: MapPin, text: language === "am" ? "እንዴት ልከታተል?" : "What to expect:", description: language === "am" ? "..." : "When you start a search, your report is prioritized..." }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                  <item.icon className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-charcoal">{item.text}</span>
                    <p className="text-stone-500">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link to="/wanted">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                >
                  {language === "am" ? "የጠፉቦትን ሰው ይፈልጉ " : "Find Missing Person"}
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* ===== RIGHT CARD ===== */}
          <motion.div
            variants={itemVariants}
            className="group bg-white rounded-3xl p-8 md:p-10 border border-stone-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-charcoal">
              {language === "am" ? "የልቦትን ሰው ያግኙ" : "Reunite Memory"}
            </h3>

            <p className="text-stone-600 mb-6 leading-relaxed">
              {language === "am"
                ? "በትዝታ እና በታሪኮች ላይ ተመስርቶ..."
                : "Reconnect with people from your past using shared memories and stories. Safe verification and private reconnection built in."}
            </p>

            <ul className="space-y-4">
              {[
                { icon: Clock, text: language === "am" ? "መቼ ልጠቀም?" : "When to use:" , description: language === "am" ? "..." : "Use this to reconnect with people from your past..." },
                { icon: Users, text: language === "am" ? "እንዴት ላመልክት?" : "How to use it" , description: language === "am" ? "..." : "Click the Reconnect With Someone search below" },
                { icon: MapPin, text: language === "am" ? "እንዴት ልከታተል?" : "What to expect:", description: language === "am" ? "..." : "When you begin, share a memory..." }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                  <item.icon className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-charcoal">{item.text}</span>
                    <p className="text-stone-500">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link to="/reconnect">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                >
                  {language === "am" ? "ከተራራቁት ሰዎች ጋር ይገናኙ" : "Reconnect With Someone"}
                </motion.button>
              </Link>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

// 3. TWO TYPES OF LOSS SECTION
const LossUnderstandingSection = () => {
  const { language } = useLanguage();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0 });
  }, [controls, inView]);

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-white to-stone-50">
      <div className="container max-w-5xl">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={controls}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* ===== TITLE ===== */}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-charcoal">
            {language === "am" 
              ? "ሰዎች በተለያየ መንገድ ይራራቃሉ"
              : "People Get Lost in Different Ways"}
          </h2>

          {/* ===== SUBTEXT ===== */}
          <p className="text-base md:text-lg text-stone-600 mb-20 max-w-2xl mx-auto leading-relaxed">
            {language === "am"
              ? "ሰዎች በድንገት ይጠፋፋሉ፣ በጊዜ ሂደት ውስጥም ኑሮን ለማሸነፍ በሚያደርጉት ውጣ ውረድ ውስጥ አንዱ የአንዱ አንድራሳ በማጣት፣ ይራራቃሉ አንዱ የሕይወት አካል ነውና። "
              : "Understanding the nature of separation helps us build better tools for reconnection."}
          </p>

          {/* ===== CARDS ===== */}
          <div className="grid md:grid-cols-2 gap-12">

            {/* ===== SUDDEN LOSS ===== */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={controls}
              transition={{ delay: 0.2 }}
              className="
                relative p-8 md:p-10 
                rounded-3xl 
                bg-white/70 backdrop-blur-md 
                border border-red-100 
                shadow-lg shadow-red-100/40
                hover:shadow-xl hover:shadow-red-200/50
                hover:-translate-y-1
                transition-all duration-300
              "
            >
              {/* subtle glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-100/20 to-transparent pointer-events-none" />

              <h3 className="text-xl md:text-2xl font-semibold text-red-600 mb-4">
                 {language === "am" ? "በድንገት መጥፋት" : "Sudden Loss"}
              </h3>

              <p className="text-stone-600 leading-relaxed">
                {language === "am"
                  ? "በድንገት የጠፉ ሰዎች በፍጥነት መረጃን ማሰራጭት እና ፈጣን ምላሽ ያስፈልጋቸዋል "
                  : "Missing persons, emergencies, urgent situations where every minute matters. Fast action required."}
              </p>
            </motion.div>

            {/* ===== SILENT LOSS ===== */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={controls}
              transition={{ delay: 0.4 }}
              className="
                relative p-8 md:p-10 
                rounded-3xl 
                bg-white/70 backdrop-blur-md 
                border border-amber-100 
                shadow-lg shadow-amber-100/40
                hover:shadow-xl hover:shadow-amber-200/50
                hover:-translate-y-1
                transition-all duration-300
              "
            >
              {/* subtle glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-100/20 to-transparent pointer-events-none" />

              <h3 className="text-xl md:text-2xl font-semibold text-yellow-500 mb-4">
                 {language === "am" ? "አርዳሻቸውን በማጣት መራራቅ" : "Silent Loss"}
              </h3>

              <p className="text-stone-600 leading-relaxed">
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


// 4. IMPACT STATS

const ImpactSection = () => {
  const { language } = useLanguage();
  const { data: stats } = useImpactStats();

  return (
    <section className="p-10 bg-charcoal text-white">
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


// 5. TRUST SECTION

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


// 6. FINAL CTA

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


// MAIN LANDING PAGE COMPONENT

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
