
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
  const { t } = useLanguageStore();

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
    <div className="mt-4 pt-4 border-t border-dashed">
      <Label className="mb-2 block font-medium">
        {t('selectPhotochromicColor')}
      </Label>
      
      <div className="relative w-full">
        <Select 
          value={selectedColor} 
          onValueChange={onColorChange}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder={t('selectColor')} />
          </SelectTrigger>
          <SelectContent className="bg-white z-[200] w-full max-h-[180px] overflow-auto">
            {coating.availableColors.map(color => (
              <SelectItem key={color} value={color} className="flex items-center">
                <div className="flex items-center gap-2 w-full">
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: getColorStyle(color) }}
                  ></div>
                  <span>{t(color.toLowerCase())}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Color Preview */}
      {selectedColor && (
        <div className="mt-3 flex items-center gap-3">
          <div 
            className="w-6 h-6 rounded-full border"
            style={{ backgroundColor: getColorStyle(selectedColor) }}
          ></div>
          <span className="text-sm">{t(selectedColor.toLowerCase())}</span>
        </div>
      )}
    </div>
  );
};
