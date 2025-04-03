
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
    // Extract English part if it's a bilingual string
    const simplifiedColorName = colorName.includes('|') 
      ? colorName.split('|')[0].trim().split(' - ').pop() || '' 
      : colorName;
      
    const colorMap: Record<string, string> = {
      "Brown": "#8B4513",
      "Gray": "#808080",
      "Green": "#006400",
      "Blue": "#0000CD",
      "Silver": "#C0C0C0",
      "Gold": "#FFD700",
      "Red": "#FF0000",
      // Add simple color mappings for common colors in Bella lenses
      "Contour Gray": "#707070",
      "Contour Green": "#2E5C2E",
      "Contour Hazel": "#A67D3D",
      "Platinum Gray": "#A9A9A9",
      "Agate Brown": "#614126",
      "Bluish Gray": "#6699CC",
      "Jade Green": "#00A86B",
      "Ocean Blue": "#4F42B5",
      "Navy Gray": "#3B444B"
    };
    
    // Try to match based on the end of the color name
    for (const [key, value] of Object.entries(colorMap)) {
      if (simplifiedColorName.endsWith(key)) {
        return value;
      }
    }
    
    // Default basic colors based on general color mentions
    if (simplifiedColorName.toLowerCase().includes("brown")) return "#8B4513";
    if (simplifiedColorName.toLowerCase().includes("gray")) return "#808080";
    if (simplifiedColorName.toLowerCase().includes("green")) return "#006400";
    if (simplifiedColorName.toLowerCase().includes("blue")) return "#0000CD";
    if (simplifiedColorName.toLowerCase().includes("hazel")) return "#A67D3D";
    if (simplifiedColorName.toLowerCase().includes("gold")) return "#FFD700";
    
    return "transparent";
  };
  
  // Format the display text based on language
  const formatColorText = (colorName: string): string => {
    if (colorName.includes('|')) {
      const [english, arabic] = colorName.split('|').map(part => part.trim());
      return language === 'ar' ? arabic : english;
    }
    return colorName;
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
                    <span className="text-base whitespace-normal break-words leading-tight">{formatColorText(color)}</span>
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
              {formatColorText(selectedColor)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
