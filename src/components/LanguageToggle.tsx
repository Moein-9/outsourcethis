
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/languageStore";
import { Globe } from "lucide-react";

export const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage } = useLanguageStore();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className={`flex items-center gap-2 ${language === 'ar' ? 'bg-green-50 hover:bg-green-100' : 'bg-blue-50 hover:bg-blue-100'} transition-all duration-300`}
      title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <Globe className={`h-4 w-4 ${language === 'ar' ? 'text-green-600' : 'text-blue-600'}`} />
      <span className={`${language === 'ar' ? 'text-green-600' : 'text-blue-600'} font-medium`}>
        {language === 'ar' ? 'English' : 'العربية'}
      </span>
    </Button>
  );
};
