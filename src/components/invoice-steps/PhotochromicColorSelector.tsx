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

  // Color mapping for visualization
  const getColorStyle = (colorName: string) => {
    const colorMap: Record<string, string> = {
      "Brown": "#8B4513",
      "Gray": "#808080",
      "Green": "#006400",
      "Blue": "#0000CD",
      "Silver": "#C0C0C0",
      "Gold": "#FFD700",
      "Red": "#FF0000"
    };
    
    // Extract the English color name when it's a bilingual format (e.g., "Color | اللون")
    const englishColorName = colorName.split(" | ")[0];
    
    // Try to find the color by the English name first (for bilingual colors)
    for (const [key, value] of Object.entries(colorMap)) {
      if (englishColorName.includes(key)) {
        return value;
      }
    }
    
    // Fallback to original mapping
    return colorMap[colorName] || "transparent";
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
    
  // Function to get the appropriate display name based on language
  const getDisplayName = (colorName: string): string => {
    // If the color name contains a separator for bilingual display
    if (colorName.includes(" | ")) {
      const [english, arabic] = colorName.split(" | ");
      return language === 'ar' ? arabic : english;
    }
    
    // Otherwise, try to translate it or return as is
    return t(colorName.toLowerCase()) || colorName;
  };

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
                      {getDisplayName(color)}
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
              {getDisplayName(selectedColor)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
