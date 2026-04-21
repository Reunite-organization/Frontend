import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Minus, 
  Plus, 
  X,
  AlertCircle,
  Info
} from 'lucide-react';
import { useLanguage } from '../../../../lib/i18n';

export const GroupPostSettings = ({ 
  isGroupPost = false, 
  maxClaimants = 1, 
  soughtPeople = [], 
  onChange 
}) => {
  const { language } = useLanguage();
  const [newPersonName, setNewPersonName] = useState('');

  const handleToggleGroupPost = (enabled) => {
    onChange({
      isGroupPost: enabled,
      maxClaimants: enabled ? Math.max(2, maxClaimants) : 1,
      soughtPeople: enabled ? soughtPeople : [],
    });
  };

  const handleMaxClaimantsChange = (delta) => {
    const newMax = Math.max(1, Math.min(5, maxClaimants + delta));
    onChange({ maxClaimants: newMax });
  };

  const addPerson = () => {
    if (!newPersonName.trim() || soughtPeople.length >= maxClaimants) return;
    
    onChange({
      soughtPeople: [
        ...soughtPeople,
        { name: newPersonName.trim(), description: '' },
      ],
    });
    setNewPersonName('');
  };

  const removePerson = (index) => {
    onChange({
      soughtPeople: soughtPeople.filter((_, i) => i !== index),
    });
  };

  const updatePerson = (index, field, value) => {
    const updated = [...soughtPeople];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ soughtPeople: updated });
  };

  return (
    <div className="space-y-6">
      {/* Toggle Group Post */}
      <div className="flex items-center justify-between p-4 bg-cream rounded-xl border border-warm-gray/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-terracotta" />
          </div>
          <div>
            <h4 className="font-medium text-charcoal">
              {language === 'am' ? 'የቡድን ልጥፍ' : 'Group Post'}
            </h4>
            <p className="text-sm text-stone">
              {language === 'am'
                ? 'ብዙ ሰዎችን በአንድ ልጥፍ ይፈልጉ'
                : 'Look for multiple people in one post'
              }
            </p>
          </div>
        </div>
        
        <button
          onClick={() => handleToggleGroupPost(!isGroupPost)}
          className={`
            relative w-14 h-7 rounded-full transition-colors
            ${isGroupPost ? 'bg-terracotta' : 'bg-warm-gray'}
          `}
        >
          <motion.div
            className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow"
            animate={{ left: isGroupPost ? '1.75rem' : '0.25rem' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      {/* Group Post Settings */}
      <AnimatePresence>
        {isGroupPost && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-6 overflow-hidden"
          >
            {/* Number of People */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-charcoal">
                {language === 'am'
                  ? 'ስንት ሰዎችን ነው የሚፈልጉት?'
                  : 'How many people are you looking for?'
                }
              </label>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleMaxClaimantsChange(-1)}
                  disabled={maxClaimants <= 1}
                  className="p-2 rounded-full border border-warm-gray hover:border-terracotta disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <span className="text-2xl font-display text-terracotta min-w-[3rem] text-center">
                  {maxClaimants}
                </span>
                
                <button
                  onClick={() => handleMaxClaimantsChange(1)}
                  disabled={maxClaimants >= 5}
                  className="p-2 rounded-full border border-warm-gray hover:border-terracotta disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* People List */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-charcoal">
                {language === 'am'
                  ? 'የሚፈለጉ ሰዎች (አማራጭ)'
                  : 'People you\'re looking for (Optional)'
                }
              </label>

              {/* Add Person Input */}
              {soughtPeople.length < maxClaimants && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addPerson()}
                    placeholder={language === 'am' ? 'ስም ያስገቡ' : 'Enter name'}
                    className="flex-1 px-3 py-2 bg-white border border-warm-gray rounded-lg focus:border-terracotta focus:ring-1 focus:ring-terracotta/20 outline-none text-sm"
                  />
                  <button
                    onClick={addPerson}
                    disabled={!newPersonName.trim()}
                    className="px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-clay disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    <UserPlus className="w-4 h-4" />
                    {language === 'am' ? 'አክል' : 'Add'}
                  </button>
                </div>
              )}

              {/* People Cards */}
              <AnimatePresence>
                {soughtPeople.map((person, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-start gap-3 p-3 bg-white rounded-lg border border-warm-gray/30"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sahara/20 flex items-center justify-center">
                      <span className="text-sahara text-sm font-medium">
                        {index + 1}
                      </span>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={person.name}
                        onChange={(e) => updatePerson(index, 'name', e.target.value)}
                        placeholder={language === 'am' ? 'ስም' : 'Name'}
                        className="w-full px-2 py-1 bg-transparent border-b border-warm-gray focus:border-terracotta outline-none text-sm"
                      />
                      <input
                        type="text"
                        value={person.description || ''}
                        onChange={(e) => updatePerson(index, 'description', e.target.value)}
                        placeholder={language === 'am' 
                          ? 'መግለጫ (አማራጭ)' 
                          : 'Description (optional)'
                        }
                        className="w-full px-2 py-1 bg-transparent border-b border-warm-gray focus:border-terracotta outline-none text-xs text-stone"
                      />
                    </div>

                    <button
                      onClick={() => removePerson(index)}
                      className="p-1 text-stone hover:text-error transition-colors rounded-full hover:bg-error/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-2 p-3 bg-warmth/5 rounded-lg border border-warmth/20">
              <Info className="w-4 h-4 text-warmth flex-shrink-0 mt-0.5" />
              <p className="text-xs text-stone">
                {language === 'am'
                  ? `እያንዳንዱ ሰው ማንነቱን ለማረጋገጥ ሚስጥራዊ ጥያቄዎችን መመለስ አለበት። ቢበዛ ${maxClaimants} ሰዎች ይህን ልጥፍ መጠየቅ ይችላሉ።`
                  : `Each person will need to answer the secret questions to verify their identity. Up to ${maxClaimants} people can claim this post.`
                }
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
