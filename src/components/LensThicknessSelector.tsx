
import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { LensThickness, useInventoryStore } from "@/store/inventoryStore";
import { Check } from "lucide-react";

interface LensThicknessSelectorProps {
  onSelectThickness: (thickness: LensThickness | null) => void;
  initialThickness?: LensThickness | null;
  disabled?: boolean;
}

export const LensThicknessSelector: React.FC<LensThicknessSelectorProps> = ({
  onSelectThickness,
  initialThickness = null,
  disabled = false
}) => {
  const { t, language } = useLanguageStore();
  const thicknesses = useInventoryStore((state) => state.lensThicknesses);
  
  const [selectedThickness, setSelectedThickness] = useState<LensThickness | null>(initialThickness);
  
  // Initialize from props if provided
  useEffect(() => {
    if (initialThickness) {
      setSelectedThickness(initialThickness);
    }
  }, [initialThickness]);
  
  const handleThicknessSelect = (thickness: LensThickness) => {
    if (disabled) return;
    setSelectedThickness(thickness);
    onSelectThickness(thickness);
  };
  
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  
  if (disabled) {
    return (
      <div className="p-4 border border-dashed rounded-lg bg-muted/10 text-center">
        <p className="text-muted-foreground">{t('pleaseSelectLensAndCoatingFirst')}</p>
      </div>
    );
  }
  
  if (thicknesses.length === 0) {
    return (
      <div className="p-4 border border-dashed rounded-lg bg-muted/10 text-center">
        <p className="text-muted-foreground">{t('noThicknessesAvailable')}</p>
      </div>
    );
  }
  
  return (
    <div className={`space-y-4 ${dirClass}`}>
      <h3 className={`text-base font-medium mb-2 ${textAlignClass}`}>{t('selectLensThickness')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {thicknesses.map((thickness) => (
          <div
            key={thickness.id}
            className={`border rounded-lg p-3 cursor-pointer transition-all ${
              selectedThickness?.id === thickness.id
                ? "border-[#5EEAD4] bg-[#5EEAD4]/10 shadow-sm" 
                : "hover:border-[#5EEAD4]/30 hover:bg-muted/10"
            }`}
            onClick={() => handleThicknessSelect(thickness)}
          >
            <div className="flex justify-between items-start">
              <div className={`${textAlignClass} flex-1`}>
                <div className="font-medium">{thickness.name}</div>
                <div className="text-sm text-muted-foreground">{thickness.description || ''}</div>
              </div>
              <div className="text-right font-semibold">
                {thickness.price.toFixed(2)} {t('kwd')}
              </div>
            </div>
            
            {selectedThickness?.id === thickness.id && (
              <div className={`mt-2 flex ${language === 'ar' ? 'justify-start' : 'justify-end'}`}>
                <div className="bg-[#5EEAD4] text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
