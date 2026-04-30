import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Sparkles, AlertCircle, User, Tag, Users } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n";

export const MemoryInput = ({
  value = { en: "", am: "" },
  onChange,
  error,
}) => {
  const { language } = useLanguage();
  const [activeLanguage, setActiveLanguage] = useState(language);

  const [personDetails, setPersonDetails] = useState({
    personName: "", 
    nickname: "",
    knownAs: "", 
  });

  const [charCount, setCharCount] = useState({
    en: value.en?.length || 0,
    am: value.am?.length || 0,
  });

  const MAX_CHARS = 2000;

  const handleChange = (lang, text) => {
  setCharCount({ ...charCount, [lang]: text.length });

  onChange({
    memoryText: {
      ...value.memoryText,
      [lang]: text,
    },
  });
};

  const handlePersonDetailChange = (field, fieldValue) => {
    const updatedDetails = { ...personDetails, [field]: fieldValue };
    setPersonDetails(updatedDetails);
    if (onChange) {
onChange({
  personDetails: updatedDetails,
});    }
  };
  const languages = [
    { code: "en", label: "English", flag: "🇺🇸", hint: "Write in English" },
    { code: "am", label: "አማርኛ", flag: "🇪🇹", hint: "በአማርኛ ይጻፉ" },
  ];

  const prompts = {
    en: [
      "How did you meet?",
      "What do you remember most about them?",
      "Where did you spend time together?",
      "Any special memories or stories?",
    ],
    am: [
      "እንዴት ነው የተገናኙት?",
      "ስለነሱ በጣም የሚያስታውሱት ነገር ምንድን ነው?",
      "የት ነበር አብራችሁ ጊዜ የምታሳልፉት?",
      "ልዩ ትዝታ ካሎት ያጋሩን?",
    ],
  };

  return (
    <div className="space-y-4">
      {/* Person Details Section */}
      <div className="p-4 bg-cream/30 rounded-xl border border-warm-gray/20 space-y-3">
        {activeLanguage === "am" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-charcoal flex items-center gap-1">
                  <User className="w-4 h-4 text-terracotta" />
                  የሚፈልጉት ሰው ሙሉ ስም *
                </label>
                <input
                  placeholder="ለምሳሌ፡ አበበ ከበደ"
                  value={personDetails.personName}
                  onChange={(e) =>
                    handlePersonDetailChange("personName", e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-charcoal flex items-center gap-1">
                  <Tag className="w-4 h-4 text-sahara" />
                  ቅጽል ስም (ካለ)
                </label>
                <input
                  placeholder="ለምሳሌ፡ ቦንያ"
                  value={personDetails.nickname}
                  onChange={(e) =>
                    handlePersonDetailChange("nickname", e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Row 2: What they knew you as */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-charcoal flex items-center gap-1">
                <Users className="w-4 h-4 text-hope-green" />ያ ሰው በምን ስም ነው
                የሚያውቀዎት? *
              </label>
              <input
                placeholder="ለምሳሌ፡ አበበ ጓደኛው 'ጎንደሬ' እያለ ይጠራኝ ነበር"
                value={personDetails.knownAs}
                onChange={(e) =>
                  handlePersonDetailChange("knownAs", e.target.value)
                }
                className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
              />
              <p className="text-xs text-stone mt-1">
                ለምሳሌ፡ ቅጽል ስምዎ፣ የመጀመሪያ ስምዎ፣ ወይም እርስዎን ለይቶ የሚጠራበት ማንኛውም ስም
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Row 1: Full Name + Nickname */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-charcoal flex items-center gap-1">
                  <User className="w-4 h-4 text-terracotta" />
                  Full name of the person *
                </label>
                <input
                  placeholder="e.g., Abebe Kebede"
                  value={personDetails.personName}
                  onChange={(e) =>
                    handlePersonDetailChange("personName", e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-charcoal flex items-center gap-1">
                  <Tag className="w-4 h-4 text-sahara" />
                  Nickname (optional)
                </label>
                <input
                  placeholder="e.g., Boni"
                  value={personDetails.nickname}
                  onChange={(e) =>
                    handlePersonDetailChange("nickname", e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Row 2: What they knew you as */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-charcoal flex items-center gap-1">
                <Users className="w-4 h-4 text-hope-green" />
                What name did they know you by? *
              </label>
              <input
                placeholder="e.g., Abebe's friend called me 'Gondere'"
                value={personDetails.knownAs}
                onChange={(e) =>
                  handlePersonDetailChange("knownAs", e.target.value)
                }
                className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-xl focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all"
              />
              <p className="text-xs text-stone mt-1">
                e.g., Your nickname, first name, or any name they used to call
                you
              </p>
            </div>
          </>
        )}
      </div>

      {/* Language Tabs */}
      <div className="flex gap-2 border-b border-warm-gray/30">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setActiveLanguage(lang.code)}
            className={`
              flex items-center gap-2 px-4 py-2.5 font-medium transition-all relative
              ${
                activeLanguage === lang.code
                  ? "text-terracotta"
                  : "text-stone hover:text-charcoal"
              }
            `}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.label}</span>
            {value.memoryText?.[lang.code] && (
              <span className="w-1.5 h-1.5 bg-hope-green rounded-full" />
            )}
            {activeLanguage === lang.code && (
              <motion.div
                layoutId="activeLang"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta"
              />
            )}
          </button>
        ))}
      </div>

      {/* Writing Prompts */}
      <div className="flex flex-wrap gap-2">
        {prompts[activeLanguage].map((prompt, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => {
              const current = value[activeLanguage] || "";
              const newText = current + (current ? "\n\n" : "") + prompt + " ";
              handleChange(activeLanguage, newText);
            }}
            className="px-3 py-1.5 bg-cream hover:bg-warm-gray/30 text-olive text-xs rounded-full transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            {prompt}
          </motion.button>
        ))}
      </div>

      {/* Text Areas */}
      <AnimatePresence mode="wait">
        {activeLanguage === "en" && (
          <motion.div
            key="en"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <div className="relative">
              <textarea
                value={value.memoryText?.en || ""}
                onChange={(e) => handleChange("en", e.target.value)}
                placeholder="Share your memory in here... 
For example: We met at Lideta Catholic Cathedral school in Addis Ababa. We used to play soccer together after school..."
                rows={8}
                className={`
                  w-full px-4 py-4 bg-cream/50 border rounded-xl resize-none
                  focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all
                  font-body text-charcoal leading-relaxed
                  ${error ? "border-error" : "border-warm-gray"}
                `}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span
                  className={`
                  text-xs px-2 py-1 rounded-full
                  ${charCount.en > MAX_CHARS * 0.9 ? "bg-warmth/20 text-warmth" : "bg-warm-gray/30 text-stone"}
                `}
                >
                  {charCount.en} / {MAX_CHARS}
                </span>
              </div>
            </div>
            {charCount.en > MAX_CHARS && (
              <p className="text-sm text-error flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Character limit exceeded
              </p>
            )}
          </motion.div>
        )}

        {activeLanguage === "am" && (
          <motion.div
            key="am"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <div className="relative">
              <textarea
                value={value.memoryText?.am || ""}
                onChange={(e) => handleChange("am", e.target.value)}
                placeholder="ትዝታዎን በትክክል ያካፍሉ...
ለምሳሌ፡ በአዲስ አበባ ልደታ ካቶሊክ ካቴድራል ትምህርት ቤት ተገናኘን። ከትምህርት በኋላ አብረን እግር ኳስ እንጫወት ነበር..."
                rows={8}
                className={`
                  w-full px-4 py-4 bg-cream/50 border rounded-xl resize-none
                  focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 outline-none transition-all
                  font-amharic text-charcoal leading-loose text-lg
                  ${error ? "border-error" : "border-warm-gray"}
                `}
                dir="auto"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span
                  className={`
                  text-xs px-2 py-1 rounded-full
                  ${charCount.am > MAX_CHARS * 0.9 ? "bg-warmth/20 text-warmth" : "bg-warm-gray/30 text-stone"}
                `}
                >
                  {charCount.am} / {MAX_CHARS}
                </span>
              </div>
            </div>
            {charCount.am > MAX_CHARS && (
              <p className="text-sm text-error flex items-center gap-1 font-amharic">
                <AlertCircle className="w-3.5 h-3.5" />
                የፊደል ገደብ አልፏል
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Requirement Note */}
      <div className="flex items-start gap-3 p-4 bg-warmth/5 rounded-xl border border-warmth/20">
        <Globe className="w-5 h-5 text-warmth flex-shrink-0 mt-0.5" />
        <div className="text-sm text-stone">
          <p className="font-medium text-charcoal mb-1">
            {language === "am"
              ? "ቢያንስ በአንድ ቋንቋ ይጻፉ"
              : "Write in at least one language"}
          </p>
          <p>
            {language === "am"
              ? "በእንግሊዝኛ፣ በአማርኛ ወይም በሁለቱም መጻፍ ይችላሉ። በብዙ ቋንቋዎች መጻፍ ብዙ ሰዎች እንዲያገኙት ይረዳል።"
              : "You can write in English, Amharic, or both. Writing in multiple languages helps more people find your post."}
          </p>
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
