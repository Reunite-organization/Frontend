import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  ChevronDown,
  Search,
  Heart,
  MessageCircle,
  Phone,
  Shield,
  Clock,
  Users,
  Globe,
  Smartphone,
  MapPin,
  Mail,
  ArrowRight,
} from 'lucide-react';

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedItems, setExpandedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const toggleItem = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { id: 'general', label: 'General', icon: HelpCircle },
    { id: 'reporting', label: 'Reporting', icon: Phone },
    { id: 'searching', label: 'Searching', icon: Search },
    { id: 'volunteers', label: 'Volunteers', icon: Users },
    { id: 'privacy', label: 'Privacy & Safety', icon: Shield },
    { id: 'technical', label: 'Technical', icon: Smartphone },
  ];

  const faqs = {
    general: [
      {
        id: 'gen-1',
        q: 'What is Reunite?',
        a: 'Reunite  is a cross-platform missing person coordination system that uses artificial intelligence to extract information from reports, generates search zones, and coordinates volunteer search efforts through multiple communication channels.',
      },
      {
        id: 'gen-2',
        q: 'Is Reunite  free to use?',
        a: 'Yes! The core platform is completely free for families, volunteers, and community members. All essential features work on free-tier services.',
      },
      {
        id: 'gen-3',
        q: 'What areas does Reunite cover?',
        a: 'Reunite  operates globally. While initially focused on Ethiopian diaspora communities, the platform supports search coordination worldwide.',
      },
      {
        id: 'gen-4',
        q: 'How is this different from social media searches?',
        a: 'Unlike social media, Reunite  uses structured  extraction, automated search zone generation, coordinated volunteer assignment, and multi-channel alerts — making searches more efficient and organized.',
      },
    ],
    reporting: [
      {
        id: 'rep-1',
        q: 'How do I report a missing person?',
        a: 'You can report through our website, Telegram bot (@reunite_bot), WhatsApp message, or SMS. Simply provide details about the missing person and our AI will extract the critical information.',
      },
      {
        id: 'rep-2',
        q: 'What information do I need to provide?',
        a: 'Provide as much detail as possible: name, age, clothing description, last seen location and time, distinguishing features, and any medical conditions. Even basic information helps.',
      },
      {
        id: 'rep-3',
        q: 'Can I report via voice or image?',
        a: 'Yes! Our web form supports voice transcription and image upload. Telegram and WhatsApp also accept voice notes and images.',
      },
      {
        id: 'rep-4',
        q: 'What happens after I submit a report?',
        a: 'Our AI extracts information within 10 seconds, calculates priority, generates search zones, and alerts nearby volunteers. You\'ll receive a case ID for tracking.',
      },
    ],
    searching: [
      {
        id: 'sea-1',
        q: 'How are search zones determined?',
        a: 'Search zones are based on last seen location, time elapsed, age of person, weather conditions, area type (urban/suburban/rural), and movement direction from sightings.',
      },
      {
        id: 'sea-2',
        q: 'How long do searches last?',
        a: 'Cases remain ACTIVE for 30 days, then move to EXTENDED status. After 90 days without activity, cases are archived but remain searchable. Legacy cases (1+ year) are available for reactivation.',
      },
      {
        id: 'sea-3',
        q: 'Can I search for someone from years ago?',
        a: 'Yes! Our Legacy Case system allows searching archived cases. You can search by name, date range, location, and physical description. If you find a match, you can request reactivation.',
      },
      {
        id: 'sea-4',
        q: 'What if multiple sightings conflict?',
        a: 'All sightings are displayed with timestamps. The system calculates probability weighted by recency. Coordinators can review conflicting information.',
      },
    ],
    volunteers: [
      {
        id: 'vol-1',
        q: 'How do I become a volunteer?',
        a: 'Register on our website or via Telegram (@reunite_bot). Set your availability status and preferred search radius. You\'ll receive alerts when cases match your area.',
      },
      {
        id: 'vol-2',
        q: 'What do volunteers do?',
        a: 'Volunteers search assigned zones, report sightings through a rapid interface, update search status, and help coordinate local efforts. Maximum 3 active assignments at a time.',
      },
      {
        id: 'vol-3',
        q: 'Do I need special training?',
        a: 'Basic volunteers need no special training. Verified volunteers and coordinators require additional certification. Training materials are provided.',
      },
      {
        id: 'vol-4',
        q: 'Can I volunteer remotely?',
        a: 'Yes! You can help by monitoring social media, sharing alerts in your network, or assisting with coordination tasks remotely.',
      },
    ],
    privacy: [
      {
        id: 'pri-1',
        q: 'How is my personal data protected?',
        a: 'All data is encrypted with TLS 1.3. Personal information is deleted 90 days after case resolution. We never share your data without consent.',
      },
      {
        id: 'pri-2',
        q: 'Who can see my report?',
        a: 'Active case details are visible to registered volunteers and coordinators. Personal contact information is never public. You control what information is shared.',
      },
      {
        id: 'pri-3',
        q: 'What happens when a case is resolved?',
        a: 'Resolution requires multi-step verification. After resolution, personal data is anonymized after 90 days. Case statistics are retained for system improvement.',
      },
      {
        id: 'pri-4',
        q: 'Can I delete my data?',
        a: 'Yes! You can request data export or deletion at any time. We comply with data protection regulations and the right to be forgotten.',
      },
    ],
    technical: [
      {
        id: 'tec-1',
        q: 'What devices can I use?',
        a: 'Reunite works on any modern browser (Chrome, Firefox, Safari, Edge). Mobile access via PWA on iOS 14+ and Android 10+. Also available via Telegram, WhatsApp, and SMS.',
      },
      {
        id: 'tec-2',
        q: 'Does it work offline?',
        a: 'The web app supports offline mode via PWA. You can view cached cases and your reports sync automatically when back online.',
      },
      {
        id: 'tec-3',
        q: 'How accurate is the AI?',
        a: 'Primary AI (Google Gemini) achieves high accuracy for standard reports. Low-confidence extractions (<40%) are flagged for human review. Fallback AI models ensure 99.9% reliability.',
      },
      {
        id: 'tec-4',
        q: 'What if the AI makes a mistake?',
        a: 'Coordinators can review and correct AI extractions before broadcasting. Low-confidence results are automatically queued for human review.',
      },
    ],
  };

  // Filter FAQs by search term
  const getFilteredFaqs = () => {
    if (!searchTerm) return faqs[activeCategory] || [];
    
    const term = searchTerm.toLowerCase();
    let results = [];
    Object.values(faqs).forEach(categoryFaqs => {
      categoryFaqs.forEach(faq => {
        if (faq.q.toLowerCase().includes(term) || faq.a.toLowerCase().includes(term)) {
          results.push(faq);
        }
      });
    });
    return results;
  };

  const displayFaqs = searchTerm ? getFilteredFaqs() : (faqs[activeCategory] || []);

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-cream to-transparent pt-24 pb-12">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >        
           <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-stone mb-8">
              Find answers to common questions about Reunite AI
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      {!searchTerm && (
        <div className="container mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
                  activeCategory === cat.id
                    ? 'bg-terracotta text-white shadow-md'
                    : 'bg-cream text-stone hover:text-charcoal hover:bg-warm-gray/30'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Items */}
      <div className="container pb-20">
        <div className="max-w-3xl mx-auto">
          {searchTerm && displayFaqs.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-stone mx-auto mb-4 opacity-50" />
              <p className="text-stone">No results found for "{searchTerm}"</p>
            </div>
          )}

          <div className="space-y-3">
            {displayFaqs.map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-warm-gray/30 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-cream/50 transition-colors"
                >
                  <span className="font-medium text-charcoal pr-4">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedItems[faq.id] ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-stone" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedItems[faq.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-stone border-t border-warm-gray/20">
                        <p className="pt-4 leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Still Need Help */}
      <section className="py-16 bg-cream">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            <MessageCircle className="w-12 h-12 text-terracotta mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-charcoal mb-3">
              Still Have Questions?
            </h3>
            <p className="text-stone mb-6">
              We're here to help. Contact us through any of these channels:
            </p>
            <div className="space-y-3">
              <a href="mailto:support@reunite.com" className="flex items-center justify-center gap-2 text-terracotta hover:text-clay">
                <Mail className="w-5 h-5" />
                support@reunite.com
              </a>
              <a href="https://t.me/reunite_support" className="flex items-center justify-center gap-2 text-terracotta hover:text-clay">
                <MessageCircle className="w-5 h-5" />
                @reunite_support
              </a>
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2 mt-4">
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
