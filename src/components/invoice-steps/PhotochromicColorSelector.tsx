
import React from "react";
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
  const isRtl = language === 'ar';

  // Color mapping for visualization
  const getColorStyle = (colorName: string) => {
    const colorMap: Record<string, string> = {
      "Brown": "#8B4513",
      "Gray": "#808080",
      "Green": "#006400",
      "Blue": "#0000CD"
    };
    
    return colorMap[colorName] || "transparent";
  };

  if (!coating.isPhotochromic || !coating.availableColors || coating.availableColors.length === 0) {
    return null;
  }

  return (
    <div className="w-full" dir={isRtl ? "rtl" : "ltr"}>
      <Label className="mb-3 block font-medium text-base">
        {t('selectPhotochromicColor')}
      </Label>
      
      <div className="w-full bg-slate-50 rounded-lg p-4 border shadow-sm">
        <div className="relative w-full mb-4">
          <Select 
            value={selectedColor} 
            onValueChange={onColorChange}
          >
            <SelectTrigger className={`w-full bg-white h-12 text-base`}>
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
                  className="py-3 h-auto hover:bg-slate-100 photochromic-select-item"
                >
                  <div className={`flex items-center gap-3 w-full ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div 
                      className="min-w-6 h-6 rounded-full border shrink-0"
                      style={{ backgroundColor: getColorStyle(color) }}
                    ></div>
                    <span className="text-base whitespace-normal break-words leading-tight">{t(color.toLowerCase())}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Color Preview with larger space */}
        {selectedColor && (
          <div className={`flex items-start gap-3 p-4 bg-white rounded-md border ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div 
              className="w-8 h-8 rounded-full border-2 shrink-0 mt-0.5"
              style={{ backgroundColor: getColorStyle(selectedColor) }}
            ></div>
            <span className="text-base font-medium break-words whitespace-normal leading-relaxed">{t(selectedColor.toLowerCase())}</span>
          </div>
        )}
      </div>
    </div>
  );
};
