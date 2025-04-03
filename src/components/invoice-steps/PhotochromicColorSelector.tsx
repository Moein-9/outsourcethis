
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

  // Helper to extract the appropriate language part from bilingual color names
  const extractColorName = (fullColorName: string): { name: string, color: string } => {
    if (fullColorName.includes(' | ')) {
      const [englishPart, arabicPart] = fullColorName.split(' | ');
      const colorName = language === 'ar' ? arabicPart : englishPart;
      return { 
        name: colorName,
        color: englishPart // Use English name for the color mapping
      };
    }
    return { name: fullColorName, color: fullColorName };
  };

  // Color mapping for visualization
  const getColorStyle = (colorName: string) => {
    const baseColorName = extractColorName(colorName).color;
    
    // Extract the basic color without any prefix like "Snow White" or "Contour"
    let simpleColorName = baseColorName;
    if (baseColorName.includes(' ')) {
      const words = baseColorName.split(' ');
      simpleColorName = words[words.length - 1];
    }
    
    const colorMap: Record<string, string> = {
      "Brown": "#8B4513",
      "Gray": "#808080",
      "Green": "#006400",
      "Blue": "#0000CD",
      "Silver": "#C0C0C0",
      "Gold": "#FFD700",
      "Red": "#FF0000",
      "Black": "#000000",
      "Hazel": "#8E7618",
      "Beige": "#F5F5DC",
      "Olive": "#808000",
      "Stone": "#A9A9A9",
      "Crystal": "#E0FFFF"
    };
    
    // Try to match part of the color name with our mapping
    for (const [key, value] of Object.entries(colorMap)) {
      if (simpleColorName.includes(key)) {
        return value;
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
                      {extractColorName(color).name}
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
              {extractColorName(selectedColor).name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
