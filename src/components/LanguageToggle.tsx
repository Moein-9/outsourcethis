
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/languageStore";
import { Globe } from "lucide-react";

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguageStore();
  const isRtl = language === 'ar';

  const toggleLanguage = () => {
    setLanguage(isRtl ? 'en' : 'ar');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse bg-green-50 hover:bg-green-100' : 'bg-blue-50 hover:bg-blue-100'} transition-all duration-300`}
      title={isRtl ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <Globe className={`h-4 w-4 ${isRtl ? 'text-green-600' : 'text-blue-600'}`} />
      <span className={`${isRtl ? 'text-green-600' : 'text-blue-600'} font-medium`}>
        {isRtl ? 'English' : 'العربية'}
      </span>
    </Button>
  );
};
