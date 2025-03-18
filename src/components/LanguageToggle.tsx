
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/languageStore";
import { Globe } from "lucide-react";

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguageStore();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  // Determine the appearance based on current language
  const variant = "outline";
  const size = "sm";

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={toggleLanguage}
      className={`flex items-center gap-1.5 ${language === 'ar' ? 'bg-green-50' : 'bg-blue-50'} hover:bg-primary/10 transition-all duration-300`}
      title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <Globe className={`h-3.5 w-3.5 ${language === 'ar' ? 'text-green-600' : 'text-blue-600'}`} />
      <span className={language === 'ar' ? 'text-blue-600 font-medium' : 'text-green-600 font-medium'}>
        {language === 'ar' ? 'English' : 'العربية'}
      </span>
    </Button>
  );
};
