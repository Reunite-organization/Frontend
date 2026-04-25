import { useState, useRef, useEffect } from "react";
import { motion, useInView } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Heart,
  Sparkles,
  ArrowRight,
  Users,
  X,
  Globe,
  StopCircleIcon,
} from "lucide-react";
import { usePosts } from "../../hooks/usePosts";
import { PostGrid } from "./PostGrid";
import { SearchFilters } from "./SearchFilters";
import { ImpactStats } from "../layout/ImpactStats";
import { SuccessStories } from "../shared/SuccessStories";
import { LoadingSkeleton } from "../shared/LoadingSkeleton";
import { useLanguage } from "../../../../lib/i18n";
import { Link } from "react-router-dom";

const assetImages = import.meta.glob('../../../../assets/images/*.{png,jpg,jpeg,svg}', { 
  eager: true, 
  import: 'default' 
});
const getAsset = (name) => assetImages[`../../../../assets/images/${name}.png`] || '';

const HeroSection = () => {
  const { language } = useLanguage();
  const [currentImage, setCurrentImage] = useState(0);

  const heroBackgrounds = [
    { src: 'hero1', alt: 'Family reunion' },
    { src: 'hero 2', alt: 'Friends connecting' },
    { src: 'hero 3', alt: 'Community support' },
    { src: 'hero 4', alt: 'Reconnection moment' },
    { src: 'hero 5', alt: 'Joyful reunion' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // How it works steps
  const steps = [
    {
      step: '1',
      icon: Search,
      title: { en: 'Browse Memories', am: 'ትዝታዎችን ያስሱ' },
      description: { 
        en: 'Search through thousands of memory posts from people looking for loved ones',
        am: 'ሰዎች ሰለተራቋቸው የልብ ጓደኞች ካጋሩት ትዝታ ውስጥ የእርሶን የልብ ጓደኛ በማሰስ ይፈልጉ'
      }
    },
    {
      step: '2',
      icon: Heart,
      title: { en: 'Share Your Story', am: 'ታሪክዎን ያካፍሉ' },
      description: { 
        en: 'Post a memory with details only the person you\'re looking for would know',
        am: 'እርስዎ የሚፈልጉት ሰው ሊያውቀው የሚችለውን  ትዝታ በማጋራት ተፈላጊውን ያግኙ'
      }
    },
    {
      step: '3',
      icon: Users,
      title: { en: 'Get Verified', am: 'ያረጋግጡ' },
      description: { 
        en: 'Our community helps verify matches through sharing your posts and trust scoring',
        am: 'ማህበረሰባችን እርሶ ያጋሩትን ትዝታ ለሌሎች በማካፋል እና በታማኝነት መረጃዎት ግቡን እንዲመታ ያግዞታል'
      }
    },
    {
      step: '4',
      icon: Sparkles,
      title: { en: 'Reconnect Safely', am: 'በደህንነት ይገናኙ' },
      description: { 
        en: 'Once verified, you can chat through text,vedio send photo and reconnect securely through our platform',
        am: 'አንዴ የሚፈልጉትን ካገኙ ቡኃላ መተግበሪያችንን በመጠቀም ምስጢሮ በተጠበቀ መንገድ ቢፈልጉ በጹፍ፣ በድምጽ ወይም ቪዲዮ ማውራት ይችላሉ'
      }
    }
  ];

  return (
    <section className="relative min-h-screen flex bg-white">
      <div className="w-full lg:w-1/2 relative overflow-hidden bg-charcoal">
        {heroBackgrounds.map((bg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: idx === currentImage ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img 
              src={getAsset(bg.src)}
              alt={bg.alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
        
        <div className="absolute inset-0 " />
        
        {/* Hero Text Content */}
        <div className="relative z-10 h-full flex items-center px-8 md:px-12 lg:px-16 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight">
              {language === 'am' ? (
                <>የጠፉትን ይፈልጉ<br />የልቦትን ሰው ያግኙ</>
              ) : (
                <>Find the lost<br />Reconnect the heart <span className="text-3xl md:text-4xl lg:text-5xl font-display  font-bold text-terracotta mb-6 ">
            </span></>
              )}
            </h1>
            
            

            {/* Subheadline */}
            <p className="text-lg text-white/90 max-w-md lg:mb-4 font-semibold leading-relaxed mt-8 mb-8">
              {language === 'am'
                ? 'ምንም እንኳ ረጅም ጊዜ ቢቆጠር፣ የቱንም ያህል ርቀት ቢኖር፣ ወይም የአድራሻቸው መረጃ ቢጎድልዎ፤ በድረ ገጻችን በመገናኘት ናፍቆቶን ይወጡ።'
                : 'No matter how much time has passed, how great the distance, or if their contact details are lost—reconnect through our platform and ease your longing.'
              }
            </p>

            {/* Image navigation dots */}
            <div className="flex gap-2 absolute bottom-10 left-1/2 -translate-x-1/2">
              {heroBackgrounds.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImage 
                      ? 'w-8 bg-terracotta' 
                      : 'w-4 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="hidden w-full lg:flex lg:w-1/2 md:w-1/2 bg-white items-center">
        <div className="px-12 lg:px-16 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-2xl font-display font-bold text-charcoal mb-2">
              {language === 'am' ? 'እንዴት እንደሚሰራ' : 'How It Works'}
            </h3>
            <p className="text-stone mb-8">
              {language === 'am' 
                ? 'በነዚህ ቀላል መንገዶች የጠፉትን ሰዎች ያግኙ'
                : 'Find lost connections in this simple steps'
              }
            </p>
            
            <div className="space-y-6">
              {steps.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="flex gap-4"
                >
                  {/* Step number with icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-terracotta" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h4 className="text-charcoal font-semibold mb-1">
                      {language === 'am' ? item.title.am : item.title.en}
                    </h4>
                    <p className="text-stone text-sm leading-relaxed">
                      {language === 'am' ? item.description.am : item.description.en}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="lg:hidden w-full bg-white py-16 px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-display font-bold text-charcoal mb-2">
            {language === 'am' ? 'እንዴት እንደሚሰራ' : 'How It Works'}
          </h3>
          <p className="text-stone mb-8">
            {language === 'am' 
              ? 'በነዚህ ቀላል መንገዶች የጠፉትን ሰዎች ያግኙ'
              : 'Find lost connections in  simple steps'
            }
          </p>
          
          <div className="space-y-6">
            {steps.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-terracotta" />
                  </div>
                </div>
                <div>
                  <h4 className="text-charcoal font-semibold mb-1">
                    {language === 'am' ? item.title.am : item.title.en}
                  </h4>
                  <p className="text-stone text-sm leading-relaxed">
                    {language === 'am' ? item.description.am : item.description.en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ProblemSection = () => {
  const { language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const problems = [
    {
      icon: Users,
      image: 'hero 2',
      title: { en: 'Migration Separates', am: 'ስደት ይለያል' },
      description: { 
        en: 'Whether seeking a better life, peace, or new career opportunities, people often move or migrate. Unfortunately, this often leads to distance and the loss of long-held connections.',
        am: 'ሰዎች ሕይወትን ለማሸነፍ፣ ሰላምን ፍለጋ፣ በሥራ ምክንያት በሀገር ውስጥም ሆነ ከሀገር ውጭ ሊዘዋወሩ፣ ሊሰደዱ ይችላሉ  ይሄም መራራቅን መጠፋፋትን ሊያስከትል ይችላል።'
      }
    },
    {
      icon: Globe,
      image: 'hero 3',
      title: { en: 'Connections Fade', am: 'የጊዜ ርዝመት ያደበዘዘው ግንኙነት' },
      description: { 
        en: 'Classmates, colleagues, communities you never found again. Time erases connections.',
        am: 'ሰዎች በሥራ፣ በትምህርት ቤት እና በተለላዩ ቦታዎች በአጭር ጊዜ ውስጥ ጥሩ ጓደኝነት ሊመሰርቱ ይችላሉ። በዛው ፍጥነት መለያየት ሊመጣ ይችላል። ጊዜ ዳኛ ነውና።'
      }
    },
    {
      icon: StopCircleIcon,
      image: 'hero 4',
      title: { en: 'Silence Grows', am: 'በኛ በዝምታ የመገናኘት ጊዘው ሊረዝም ይቻላል። ' },
      description: { 
        en: 'Years of silence turn into decades. The longer you wait, the harder it gets to reconnect.',
        am: 'የዕለት ተለት ዝምታችን ዓመታትን እየወለደ በመጣ ቁጥር የመገናኘት ዕድላችንን ሊያጠበው ይችላል። እርሶም ፍለጋውን ዛረዉኑ ይጀምሩ።'
      }
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-warm-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4">
            {language === 'am' 
              ? 'ሰዎች በተለያዩ ምክንያቶች ይለያያሉ'
              : 'Every Day, Connections Disappear'
            }
          </h2>
          {/* <p className="text-stone text-lg max-w-2xl mx-auto">
            {language === 'am'
              ? 'ማህበራዊ ሚዲያ ለዚህ አልተሰራም። የፍለጋ ሞተሮች ትዝታዎችን አይረዱም።'
              : 'Social media wasn\'t built for this. Search engines don\'t understand memories.'
            }
          </p> */}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.2 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image with icon */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={getAsset(problem.image)}
                  alt={language === 'am' ? problem.title.am : problem.title.en}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                
              </div>
              
              {/* Text content */}
              <div className="p-8">
                <h3 className="text-xl font-display font-semibold text-charcoal mb-3">
                  {language === 'am' ? problem.title.am : problem.title.en}
                </h3>
                <p className="text-stone leading-relaxed">
                  {language === 'am' ? problem.description.am : problem.description.en}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const BrowsePage = () => {
  const { language } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
 const [activeFilters, setActiveFilters] = useState([]);
  const [filters, setFilters] = useState({
    city: "",
    year: "",
    category: "",
  });
  const { data, isLoading, fetchNextPage, hasNextPage } = usePosts(filters);
  const allPosts = data?.pages?.flatMap((page) => page?.data || page?.posts || []) || [];

  const quickFilters = [
    { label: "Addis Ababa", type: "city", value: "Addis Ababa" },
    { label: "Washington DC", type: "city", value: "Washington DC" },
    { label: "London", type: "city", value: "London" },
    { label: "Toronto", type: "city", value: "Toronto" },
    { label: "2020", type: "year", value: "2020" },
    { label: "Childhood", type: "category", value: "Childhood" },
  ];

  // Handle quick filter click
  const handleQuickFilter = (filter) => {
    // Check if filter is already active
    const isActive = activeFilters.find(f => f.value === filter.value && f.type === filter.type);
    
    if (isActive) {
      // Remove filter
      const newActiveFilters = activeFilters.filter(f => !(f.value === filter.value && f.type === filter.type));
      setActiveFilters(newActiveFilters);
      
      // Update filters state
      const newFilters = { ...filters };
      if (filter.type === "city") newFilters.city = "";
      if (filter.type === "year") newFilters.year = "";
      if (filter.type === "category") newFilters.category = "";
      setFilters(newFilters);
    } else {
      // Add filter (replace same type)
      const newActiveFilters = activeFilters.filter(f => f.type !== filter.type);
      newActiveFilters.push(filter);
      setActiveFilters(newActiveFilters);
      
      // Update filters state
      const newFilters = { ...filters };
      if (filter.type === "city") newFilters.city = filter.value;
      if (filter.type === "year") newFilters.year = filter.value;
      if (filter.type === "category") newFilters.category = filter.value;
      setFilters(newFilters);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters([]);
    setFilters({
      city: "",
      year: "",
      category: "",
    });
  };


  return (
    <div className="min-h-screen bg-warm-white">
      <HeroSection />
      <ProblemSection />

      {/* Browse/Search Section */}
      <section className="py-16 bg-cream/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
              {language === "am"
                ? "የሚፈልጉትን ሰው ያግኙ"
                : "Find who you're looking for"}
            </h2>
            <p className="text-stone mb-8">
              {language === "am"
                ? "ትዝታዎችን በያስስ የልብ ጓደኛዎትን ይፈልጉ።"
                : "Browse thousands of posts. Filter by city, year, or category."}
            </p>

            {/* Search Bar */}
            <div className="flex gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                <input
                  type="text"
                  placeholder={
                    language === "am"
                      ? "በስም፣ ከተማ ይፈልጉ..."
                      : "Search by name, city..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-warm-gray focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 outline-none transition-all shadow-sm"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-5 rounded-xl border transition-all ${
                  showFilters
                    ? "bg-terracotta text-white border-terracotta"
                    : "bg-white border-warm-gray hover:border-terracotta"
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>

          
            {/* Active Filters Display */}
            {activeFilters.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-sm text-stone">
                  {language === "am" ? "የመረጡትን ከተማ/ሀገር:" : "Active filters:"}
                </span>
                {activeFilters.map((filter, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-terracotta/10 text-terracotta rounded-full text-sm"
                  >
                    {filter.label}
                    <button
                      onClick={() => handleQuickFilter(filter)}
                      className="hover:bg-terracotta/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-stone hover:text-terracotta underline"
                >
                  {language === "am" ? "ሁሉንም አጽዳ/ጂ" : "Clear all"}
                </button>
              </div>
            )}

            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {quickFilters.map((filter) => {
                const isActive = activeFilters.some(
                  f => f.value === filter.value && f.type === filter.type
                );
                
                return (
                  <button
                    key={filter.label}
                    onClick={() => handleQuickFilter(filter)}
                    className={`px-4 py-2 text-sm rounded-full transition-all border ${
                      isActive
                        ? "bg-terracotta text-white border-terracotta shadow-sm"
                        : "bg-white hover:bg-warm-gray text-charcoal border-warm-gray"
                    }`}
                  >
                    {filter.label}
                    {isActive && (
                      <X className="w-3 h-3 inline ml-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6"
              >
                <SearchFilters filters={filters} onChange={setFilters} />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-10 border-y border-warm-gray/20 bg-white">
        <div className="container">
          <ImpactStats compact />
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-charcoal">
              {language === "am" ? "በቅርብ ጊዜ የተለጠፉ ትዝታዎች" : "Latest Memories"}
            </h2>
            <span className="text-sm text-stone">
              {data?.pages[0]?.total || 0} {language === "am" ? "ልጥፎች" : "posts"}
            </span>
          </div>

          {isLoading ? (
            <LoadingSkeleton type="grid" count={8} />
          ) : (
            <PostGrid
              posts={allPosts}
              hasMore={hasNextPage}
              loadMore={fetchNextPage}
              isLoading={isLoading}
            />
          )}
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-cream/30">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full mb-4">
              <span className="text-green-600 text-sm font-medium">
                {language === "am" ? "የተሳኩ ታሪኮች" : "Success Stories"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
              {language === "am"
                ? "እንደገና የተገናኙ ሰዎች"
                : "People who found each other"}
            </h2>
            <p className="text-stone max-w-2xl mx-auto">
              {language === "am"
                ? "በዚህ መተግበሪያ አማካኝነት እንደገና የተገናኙ ሰዎች እውነተኛ ታሪኮች።"
                : "Real stories of people reconnected through This Platform."}
            </p>
          </div>

          <SuccessStories limit={3} />

          <div className="text-center mt-10">
            <Link
              to="/wanted/stories"
              className="inline-flex items-center gap-2 text-terracotta hover:text-clay font-medium transition-colors"
            >
              {language === "am" ? "ሁሉንም ይመልከቱ" : "View all stories"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="bg-gradient-to-br from-terracotta to-sahara rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              {language === "am"
                ? "እርስዎስ የሚፈልጉት ማንን ነው?"
                : "Who are you looking for?"}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              {language === "am"
                ? "የራስዎን ትዝታ በማጋራት ማህበረሰባችን የመገናኘት ዕድሎችትን እንዲያሰፋሎት ያድርጉ።"
                : "Create your own post and let the community help you reconnect."}
            </p>
            <Link
              to="/wanted/create"
              className="inline-flex px-8 py-4 bg-white text-terracotta rounded-lg font-semibold hover:bg-warm-white transition-colors shadow-lg"
            >
              {language === "am" ? "ትዝታ ያጋሩ" : "Create a Post"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
