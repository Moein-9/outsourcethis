
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Translations;
}

// Add translations for English and Arabic
const translations: Translations = {
  submit: {
    en: 'Submit',
    ar: 'إرسال'
  },
  cancel: {
    en: 'Cancel',
    ar: 'إلغاء'
  },
  // Add new location translations
  changeLocation: {
    en: 'Change location',
    ar: 'تغيير الموقع'
  },
  phone: {
    en: 'Phone',
    ar: 'هاتف'
  },
  
  // ... Add other translations here
  // More translations will be added here
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to English or get from localStorage if available
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang && (savedLang === 'en' || savedLang === 'ar') ? savedLang : 'en';
  });
  
  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Set document direction based on language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    // Add language-specific class to body for global styling
    document.body.className = language === 'ar' ? 'font-arabic' : 'font-english';
  }, [language]);
  
  // Translation function
  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    console.warn(`Translation key not found: ${key}`);
    return key; // fallback to key if translation not found
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
