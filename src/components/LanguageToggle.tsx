
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/languageStore";
import { Globe } from "lucide-react";

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguageStore();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className={`flex items-center gap-2 rounded-full transition-all duration-300 ${
        language === 'ar' 
          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200' 
          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200'
      }`}
    >
      <Globe className={`h-4 w-4 ${language === 'ar' ? 'text-emerald-500' : 'text-blue-500'}`} />
      <span className="font-medium">
        {language === 'ar' ? 'English' : 'العربية'}
      </span>
    </Button>
  );
};
