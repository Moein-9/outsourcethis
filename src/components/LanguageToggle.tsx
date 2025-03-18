
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/languageStore";
import { Globe } from "lucide-react";

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguageStore();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className="flex items-center gap-1.5"
    >
      <Globe className="h-3.5 w-3.5" />
      <span>{t('languageCode')}</span>
    </Button>
  );
};
