import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext({});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem('falagiye-language');
    return stored || 'en';
  });

  useEffect(() => {
    localStorage.setItem('falagiye-language', language);
  }, [language]);

  const t = (key, replacements = {}) => {
    const translations = {
    };
    
    let text = translations[key]?.[language] || key;
    
    Object.entries(replacements).forEach(([k, v]) => {
      text = text.replace(`{{${k}}}`, v);
    });
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
