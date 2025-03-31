
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

// Basic translations
const translations: Translations = {
  changeLocation: {
    en: 'Change location',
    ar: 'تغيير الموقع'
  },
  phone: {
    en: 'Phone',
    ar: 'الهاتف'
  },
  printWorkOrder: {
    en: 'Print Work Order',
    ar: 'طباعة أمر العمل'
  },
  printing: {
    en: 'Printing...',
    ar: 'جاري الطباعة...'
  },
  print: {
    en: 'Print',
    ar: 'طباعة'
  },
  workOrderPreview: {
    en: 'Work Order Preview',
    ar: 'معاينة أمر العمل'
  },
  previewBeforePrinting: {
    en: 'Preview before printing',
    ar: 'معاينة قبل الطباعة'
  },
  invoiceSaved: {
    en: 'Invoice Saved',
    ar: 'تم حفظ الفاتورة'
  },
  invoiceNumber: {
    en: 'Invoice Number',
    ar: 'رقم الفاتورة'
  },
  error: {
    en: 'Error',
    ar: 'خطأ'
  },
  errorSavingInvoice: {
    en: 'Error saving invoice',
    ar: 'خطأ في حفظ الفاتورة'
  },
  saving: {
    en: 'Saving...',
    ar: 'جاري الحفظ...'
  },
  anonymous: {
    en: 'Anonymous',
    ar: 'مجهول'
  },
  // Add more translations as needed
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar') 
      ? savedLanguage 
      : 'en';
  });
  
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  
  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    console.warn(`Translation missing for key: ${key}`);
    return key;
  };
  
  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage,
      t,
      dir: language === 'ar' ? 'rtl' : 'ltr'
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageStore = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageStore must be used within a LanguageProvider');
  }
  return context;
};
