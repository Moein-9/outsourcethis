
import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-primary" />
      <ToggleGroup type="single" value={language} onValueChange={(value) => value && setLanguage(value as "ar" | "en")}>
        <ToggleGroupItem value="ar" size="sm" className="px-3 py-1">
          العربية
        </ToggleGroupItem>
        <ToggleGroupItem value="en" size="sm" className="px-3 py-1">
          English
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
