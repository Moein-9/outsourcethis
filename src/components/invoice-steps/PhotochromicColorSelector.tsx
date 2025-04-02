
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
    <div className="w-full">
      <Label className="mb-3 block font-medium text-base">
        {t('selectPhotochromicColor')}
      </Label>
      
      <div className="relative w-full">
        <Select 
          value={selectedColor} 
          onValueChange={onColorChange}
        >
          <SelectTrigger className="w-full bg-white h-12 text-base">
            <SelectValue placeholder={t('selectColor')} />
          </SelectTrigger>
          <SelectContent 
            className="bg-white z-[200]" 
            style={{ width: "100%", maxHeight: "220px" }}
          >
            {coating.availableColors.map(color => (
              <SelectItem key={color} value={color} className="py-2">
                <div className="flex items-center gap-3 w-full">
                  <div 
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: getColorStyle(color) }}
                  ></div>
                  <span className="text-base">{t(color.toLowerCase())}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Color Preview - Make it bigger */}
      {selectedColor && (
        <div className="mt-4 flex items-center gap-3 p-3 bg-slate-50 rounded-md">
          <div 
            className="w-8 h-8 rounded-full border-2"
            style={{ backgroundColor: getColorStyle(selectedColor) }}
          ></div>
          <span className="text-base font-medium">{t(selectedColor.toLowerCase())}</span>
        </div>
      )}
    </div>
  );
};
