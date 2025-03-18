
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/languageStore";
import { Globe } from "lucide-react";

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguageStore();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  // Determine button appearance based on current language
  const variant = "outline";
  const size = "sm";

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 hover:bg-primary/10"
      title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <Globe className="h-3.5 w-3.5" />
      <span className={language === 'ar' ? 'text-blue-600 font-medium' : 'text-green-600 font-medium'}>
        {language === 'ar' ? 'English' : 'العربية'}
      </span>
    </Button>
  );
};
