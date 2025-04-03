
import React, { useMemo } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { LensCoating } from "@/store/inventoryStore";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PhotochromicColorSelectorProps {
  coating: LensCoating;
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const PhotochromicColorSelector: React.FC<PhotochromicColorSelectorProps> = ({
  coating,
  selectedColor,
  onColorChange
}) => {
  const { t, language } = useLanguageStore();

  // Function to extract appropriate language part from bilingual string
  const extractLocalizedText = (text: string): string => {
    // Check if the text contains a separator indicating it's bilingual
    if (text.includes(' | ')) {
      const [english, arabic] = text.split(' | ');
      return language === 'ar' ? arabic : english;
    }
    
    return text;
  };

  // Color mapping for visualization
  const getColorStyle = (colorName: string): string => {
    const baseColorName = extractLocalizedText(colorName).toLowerCase();
    
    const colorMap: Record<string, string> = {
      // Basic colors
      "brown": "#8B4513",
      "gray": "#808080",
      "green": "#006400",
      "blue": "#0000CD",
      "silver": "#C0C0C0",
      "gold": "#FFD700",
      "red": "#FF0000",
      "black": "#000000",
      
      // Specialty colors
      "amber gray": "#A99D97",
      "cinnamon brown": "#7E4D3A",
      "cloudy gray": "#B6B6B4",
      "crystal": "#A7D8DE",
      "emerald green": "#2AAD73",
      "lavender gray": "#9C9CB0",
      "midnight blue": "#003366",
      "mint gray": "#B5BCB6",
      "sandy brown": "#C4A484",
      "sandy gray": "#B9B8B5",
      "silky gold": "#D4AF37",
      "silky gray": "#C0C0C0",
      "hazel": "#AF753A",
      "caramel": "#C68E17",
      "radiant brown": "#8B4513",
      "radiant gray": "#808080",
      "vivid blue": "#0000FF",
      "oak": "#806517",
      "pine": "#01796F",
    };
    
    // Try to match specific multi-word colors first
    for (const [key, value] of Object.entries(colorMap)) {
      if (baseColorName.includes(key)) {
        return value;
      }
    }
    
    // Fallback to basic color matching
    for (const basicColor of ["brown", "gray", "green", "blue", "silver", "gold", "red", "black"]) {
      if (baseColorName.includes(basicColor)) {
        return colorMap[basicColor];
      }
    }
    
    return "transparent";
  };

  // Determine if the component should display
  const shouldRender = useMemo(() => {
    return coating.availableColors && coating.availableColors.length > 0;
  }, [coating.availableColors]);

  if (!shouldRender) {
    return null;
  }

  // Determine the title based on coating type
  const titleKey = coating.isPhotochromic 
    ? 'selectPhotochromicColor' 
    : 'selectSunglassColor';

  return (
    <div className="w-full">
      <Label className="mb-3 block font-medium text-base">
        {t(titleKey) || (coating.isPhotochromic ? "Select Photochromic Color" : "Select Sunglasses Color")}
      </Label>
      
      <div className="w-full bg-slate-50 rounded-lg p-4 border shadow-sm">
        <div className="relative w-full mb-4">
          <Select 
            value={selectedColor} 
            onValueChange={onColorChange}
          >
            <SelectTrigger className={`w-full bg-white h-12 text-base ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              <SelectValue placeholder={t('selectColor')} />
            </SelectTrigger>
            <SelectContent 
              className="bg-white z-[200]" 
              position="popper"
              style={{ 
                width: "var(--radix-select-trigger-width)", 
                maxHeight: "220px",
                overflow: "auto"
              }}
            >
              {coating.availableColors.map(color => (
                <SelectItem 
                  key={color} 
                  value={color} 
                  className="py-3 h-auto hover:bg-slate-100"
                >
                  <div className={`flex items-center gap-3 w-full ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div 
                      className="min-w-6 h-6 rounded-full border shrink-0"
                      style={{ backgroundColor: getColorStyle(color) }}
                    ></div>
                    <span className="text-base whitespace-normal break-words leading-tight">
                      {extractLocalizedText(color)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Color Preview with larger space */}
        {selectedColor && (
          <div className={`flex items-start gap-3 p-4 bg-white rounded-md border ${language === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
            <div 
              className="w-8 h-8 rounded-full border-2 shrink-0 mt-0.5"
              style={{ backgroundColor: getColorStyle(selectedColor) }}
            ></div>
            <span className="text-base font-medium break-words whitespace-normal leading-relaxed">
              {extractLocalizedText(selectedColor)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
