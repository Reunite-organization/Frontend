import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronDown, 
  MapPin, 
  Calendar, 
  Tag, 
  Filter,
  RotateCcw 
} from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';
import { CATEGORIES } from '../../utils/constants';

const FilterSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-warm-gray/30 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="flex items-center gap-2 text-charcoal font-medium">
          {Icon && <Icon className="w-4 h-4 text-terracotta" />}
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-stone" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SearchFilters = ({ filters, onChange, onClose }) => {
  const { language } = useLanguage();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (updates) => {
    const newFilters = { ...localFilters, ...updates };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const clearFilters = () => {
    const empty = { city: '', country: '', year: '', category: '' };
    setLocalFilters(empty);
    onChange(empty);
  };

  const hasActiveFilters = Object.values(localFilters).some(v => v);

  const popularCities = ['Addis Ababa', 'Washington DC', 'London', 'Toronto', 'Dubai', 'Nairobi'];
  const popularYears = ['2020', '2015', '2010', '2005', '2000', '1995'];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-cream dark:bg-charcoal/10 rounded-2xl border border-warm-gray/30 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-warm-gray/30">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-terracotta" />
          <h3 className="font-display text-lg font-semibold text-charcoal">
            {language === 'am' ? 'ማጣሪያዎች' : 'Filters'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="p-2 text-stone hover:text-terracotta transition-colors rounded-full hover:bg-warm-gray/20"
              title={language === 'am' ? 'አጽዳ' : 'Clear all'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-stone hover:text-charcoal transition-colors rounded-full hover:bg-warm-gray/20"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="px-4">
        <FilterSection 
          title={language === 'am' ? 'አካባቢ' : 'Location'} 
          icon={MapPin}
          defaultOpen
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-stone mb-1">
                {language === 'am' ? 'ከተማ' : 'City'}
              </label>
              <input
                type="text"
                value={localFilters.city || ''}
                onChange={(e) => handleChange({ city: e.target.value })}
                placeholder={language === 'am' ? 'ለምሳሌ አዲስ አበባ' : 'e.g., Addis Ababa'}
                className="w-full px-4 py-2.5 bg-white dark:bg-charcoal/20 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs text-stone mb-1">
                {language === 'am' ? 'ሀገር (አማራጭ)' : 'Country (Optional)'}
              </label>
              <input
                type="text"
                value={localFilters.country || ''}
                onChange={(e) => handleChange({ country: e.target.value })}
                placeholder={language === 'am' ? 'ለምሳሌ ኢትዮጵያ' : 'e.g., Ethiopia'}
                className="w-full px-4 py-2.5 bg-white dark:bg-charcoal/20 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
              />
            </div>

            {/* Popular Cities */}
            <div>
              <p className="text-xs text-stone mb-2">
                {language === 'am' ? 'ታዋቂ ከተሞች' : 'Popular Cities'}
              </p>
              <div className="flex flex-wrap gap-2">
                {popularCities.map(city => (
                  <button
                    key={city}
                    onClick={() => handleChange({ city })}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      localFilters.city === city
                        ? 'bg-terracotta text-white'
                        : 'bg-white dark:bg-charcoal/20 border border-warm-gray hover:border-terracotta'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </FilterSection>

        <FilterSection 
          title={language === 'am' ? 'ጊዜ' : 'Time Period'} 
          icon={Calendar}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-stone mb-1">
                {language === 'am' ? 'ዓመት' : 'Year'}
              </label>
              <input
                type="number"
                value={localFilters.year || ''}
                onChange={(e) => handleChange({ year: e.target.value })}
                placeholder={language === 'am' ? 'ለምሳሌ 2010' : 'e.g., 2010'}
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-4 py-2.5 bg-white dark:bg-charcoal/20 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
              />
            </div>

            <div>
              <p className="text-xs text-stone mb-2">
                {language === 'am' ? 'ታዋቂ ዓመታት' : 'Popular Years'}
              </p>
              <div className="flex flex-wrap gap-2">
                {popularYears.map(year => (
                  <button
                    key={year}
                    onClick={() => handleChange({ year })}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      localFilters.year === year
                        ? 'bg-terracotta text-white'
                        : 'bg-white dark:bg-charcoal/20 border border-warm-gray hover:border-terracotta'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </FilterSection>

        <FilterSection 
          title={language === 'am' ? 'ምድብ' : 'Category'} 
          icon={Tag}
        >
          <div className="grid grid-cols-1 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleChange({ category: cat.value })}
                className={`px-4 py-2.5 rounded-xl text-sm text-left transition-all ${
                  localFilters.category === cat.value
                    ? 'bg-terracotta text-white shadow-md'
                    : 'bg-white dark:bg-charcoal/20 border border-warm-gray hover:border-terracotta hover:shadow-sm'
                }`}
              >
                {language === 'am' ? cat.am : cat.en}
              </button>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="p-4 bg-warmth/5 border-t border-warm-gray/30">
          <p className="text-xs text-stone mb-2">
            {language === 'am' ? 'ንቁ ማጣሪያዎች' : 'Active Filters'}
          </p>
          <div className="flex flex-wrap gap-2">
            {localFilters.city && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-terracotta/10 text-terracotta text-xs rounded-full">
                <MapPin className="w-3 h-3" />
                {localFilters.city}
                <button
                  onClick={() => handleChange({ city: '' })}
                  className="ml-1 hover:text-clay"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.year && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-terracotta/10 text-terracotta text-xs rounded-full">
                <Calendar className="w-3 h-3" />
                {localFilters.year}
                <button
                  onClick={() => handleChange({ year: '' })}
                  className="ml-1 hover:text-clay"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-terracotta/10 text-terracotta text-xs rounded-full">
                <Tag className="w-3 h-3" />
                {CATEGORIES.find(c => c.value === localFilters.category)?.[language === 'am' ? 'am' : 'en']}
                <button
                  onClick={() => handleChange({ category: '' })}
                  className="ml-1 hover:text-clay"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
