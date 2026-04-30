import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Globe, Search, X, Navigation, ChevronRight, AlertCircle} from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';

// Popular cities with countries
const POPULAR_CITIES = [
  { city: 'Addis Ababa', country: 'Ethiopia' },
  { city: 'Washington DC', country: 'USA' },
  { city: 'London', country: 'UK' },
  { city: 'Toronto', country: 'Canada' },
  { city: 'Dubai', country: 'UAE' },
  { city: 'Nairobi', country: 'Kenya' },
  { city: 'Johannesburg', country: 'South Africa' },
  { city: 'Sydney', country: 'Australia' },
  { city: 'Tel Aviv', country: 'Israel' },
  { city: 'Rome', country: 'Italy' },
  { city: 'Stockholm', country: 'Sweden' },
  { city: 'Amsterdam', country: 'Netherlands' },
];

// Ethiopian cities
const ETHIOPIAN_CITIES = [
  'Addis Ababa', 'Dire Dawa', 'Mekelle', 'Gondar', 'Bahir Dar',
  'Hawassa', 'Jimma', 'Dessie', 'Jijiga', 'Shashamane', 'Arba Minch',
  'Harar', 'Adama', 'Debre Zeit', 'Kombolcha', 'Axum', 'Lalibela',
];

export const LocationPicker = ({ city, country, onChange, error }) => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showEthiopianCities, setShowEthiopianCities] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }

    const filtered = POPULAR_CITIES.filter(c => 
      c.city.toLowerCase().includes(term.toLowerCase()) ||
      c.country.toLowerCase().includes(term.toLowerCase())
    );
    
    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSelectCity = (selectedCity, selectedCountry = '') => {
    onChange({ 
      city: selectedCity, 
      country: selectedCountry || getCountryForCity(selectedCity) 
    });
    setSearchTerm(selectedCity);
    setShowSuggestions(false);
  };

  const getCountryForCity = (cityName) => {
    const found = POPULAR_CITIES.find(c => c.city === cityName);
    return found?.country || '';
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const cityName = data.address?.city || data.address?.town || data.address?.village || '';
            const countryName = data.address?.country || '';
            onChange({ city: cityName, country: countryName });
            setSearchTerm(cityName);
          } catch (error) {
            console.error('Geocoding failed:', error);
          }
        },
        (error) => {
          console.error('Geolocation failed:', error);
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* City Input with Autocomplete */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal">
          <MapPin className="inline w-4 h-4 mr-1" />
          {language === 'am' ? 'ከተማ *' : 'City *'}
        </label>
        
        <div className="relative" ref={suggestionsRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
            <input
              ref={inputRef}
              type="text"
              value={city || searchTerm}
              onChange={(e) => {
                onChange({ city: e.target.value, country });
                handleSearch(e.target.value);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={language === 'am' ? 'ለምሳሌ አዲስ አበባ' : 'e.g., Addis Ababa'}
              className={`
                w-full pl-10 pr-10 py-3 bg-cream/50 border rounded-xl
                focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all
                ${error ? 'border-error' : 'border-warm-gray'}
              `}
            />
            {city && (
              <button
                onClick={() => {
                  onChange({ city: '', country });
                  setSearchTerm('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone hover:text-charcoal rounded-full hover:bg-warm-gray/20"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && (suggestions.length > 0 || searchTerm.length >= 2) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-1 bg-white dark:bg-charcoal rounded-xl border border-warm-gray shadow-lg overflow-hidden"
              >
                {suggestions.length > 0 ? (
                  suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectCity(s.city, s.country)}
                      className="w-full px-4 py-2.5 text-left hover:bg-cream transition-colors flex items-center justify-between group"
                    >
                      <span className="text-charcoal">{s.city}</span>
                      <span className="text-sm text-stone group-hover:text-terracotta flex items-center gap-1">
                        {s.country}
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </button>
                  ))
                ) : searchTerm.length >= 2 && (
                  <div className="px-4 py-3 text-center text-stone">
                    {language === 'am' ? 'ምንም ውጤት አልተገኘም' : 'No results found'}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Use Current Location */}
        <button
          onClick={handleUseCurrentLocation}
          className="text-sm text-terracotta hover:text-clay flex items-center gap-1 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          {language === 'am' ? 'አሁን ያሉበትን ቦታ ይጠቀሙ' : 'Use current location'}
        </button>
      </div>

      {/* Country Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal">
          <Globe className="inline w-4 h-4 mr-1" />
          {language === 'am' ? 'ሀገር (አማራጭ)' : 'Country (Optional)'}
        </label>
        <input
          type="text"
          value={country || ''}
          onChange={(e) => onChange({ city, country: e.target.value })}
          placeholder={language === 'am' ? 'ለምሳሌ ኢትዮጵያ' : 'e.g., Ethiopia'}
          className="w-full px-4 py-3 bg-cream/50 border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
        />
      </div>

      {/* Ethiopian Cities Quick Select */}
      <div>
        <button
          onClick={() => setShowEthiopianCities(!showEthiopianCities)}
          className="text-sm text-olive hover:text-terracotta transition-colors flex items-center gap-1"
        >
          <span className="text-lg mr-1">🇪🇹</span>
          {language === 'am' ? 'የኢትዮጵያ ከተሞች' : 'Ethiopian Cities'}
          <motion.span animate={{ rotate: showEthiopianCities ? 90 : 0 }}>
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.span>
        </button>

        <AnimatePresence>
          {showEthiopianCities && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-3">
                {ETHIOPIAN_CITIES.map((ethCity) => (
                  <button
                    key={ethCity}
                    onClick={() => handleSelectCity(ethCity, 'Ethiopia')}
                    className={`
                      px-3 py-1.5 text-sm rounded-full transition-all
                      ${city === ethCity
                        ? 'bg-terracotta text-white'
                        : 'bg-cream hover:bg-warm-gray/30 text-olive border border-warm-gray/30'
                      }
                    `}
                  >
                    {ethCity}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Popular Cities */}
      <div>
        <p className="text-xs text-stone mb-2">
          {language === 'am' ? 'ታዋቂ ከተሞች' : 'Popular Cities'}
        </p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CITIES.slice(0, 8).map((c) => (
            <button
              key={c.city}
              onClick={() => handleSelectCity(c.city, c.country)}
              className={`
                px-3 py-1.5 text-sm rounded-full transition-all
                ${city === c.city
                  ? 'bg-terracotta text-white'
                  : 'bg-cream hover:bg-warm-gray/30 text-olive border border-warm-gray/30'
                }
              `}
            >
              {c.city}
            </button>
          ))}
        </div>
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


