
import React, { useState } from "react";
import { useInventoryStore, LensType, LensCoating } from "@/store/inventoryStore";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CompactLensSelector } from "@/components/CompactLensSelector";
import { useLanguageStore } from "@/store/languageStore";

interface LensSelectorProps {
  onSelectLensType: (lens: LensType | null) => void;
  onSelectCoating: (coating: LensCoating | null) => void;
  skipLens?: boolean;
  onSkipLensChange?: (skip: boolean) => void;
}

export const LensSelector: React.FC<LensSelectorProps> = ({
  onSelectLensType,
  onSelectCoating,
  skipLens = false,
  onSkipLensChange
}) => {
  const { language, t } = useLanguageStore();
  const [selectedLensId, setSelectedLensId] = useState<string>("");
  const [selectedCoatingId, setSelectedCoatingId] = useState<string>("");
  const [selectedLens, setSelectedLens] = useState<LensType | null>(null);
  const [selectedCoatings, setSelectedCoatings] = useState<LensCoating[]>([]);
  
  const handleLensTypeChange = (lens: LensType | null) => {
    setSelectedLens(lens);
    setSelectedLensId(lens?.id || "");
    onSelectLensType(lens);
  };
  
  const handleCoatingChange = (coatings: LensCoating[]) => {
    setSelectedCoatings(coatings);
    // For backward compatibility, only pass the first coating to the parent component
    const firstCoating = coatings.length > 0 ? coatings[0] : null;
    setSelectedCoatingId(firstCoating?.id || "");
    onSelectCoating(firstCoating);
  };
  
  const handleSkipLensChange = (checked: boolean) => {
    if (onSkipLensChange) {
      onSkipLensChange(checked);
      if (checked) {
        setSelectedLensId("");
        setSelectedCoatingId("");
        setSelectedLens(null);
        setSelectedCoatings([]);
        onSelectLensType(null);
        onSelectCoating(null);
      }
    }
  };

  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';

  return (
    <div className={`space-y-3 bg-white rounded-lg shadow-sm border border-gray-200 ${dirClass}`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg py-2 px-3">
        <h3 className={`text-white font-medium text-sm ${textAlignClass}`}>{t('lensDetails')}</h3>
      </div>
      
      {onSkipLensChange && (
        <div className={`flex items-center space-x-2 ${language === 'ar' ? 'space-x-reverse justify-end' : 'justify-start'} px-3 py-2 border-b border-gray-100`}>
          <Checkbox 
            id="skipLensCheck" 
            checked={skipLens}
            className="border-blue-400 text-blue-600"
            onCheckedChange={(checked) => handleSkipLensChange(checked === true)} 
          />
          <Label 
            htmlFor="skipLensCheck" 
            className={`font-medium text-sm ${language === 'ar' ? 'mr-2' : 'ml-2'} cursor-pointer text-gray-700`}
          >
            {t('frameOnly')}
          </Label>
        </div>
      )}
      
      {!skipLens && (
        <div className="p-3">
          <CompactLensSelector 
            onSelectLens={handleLensTypeChange}
            onSelectCoating={handleCoatingChange}
            selectedLens={selectedLens}
            selectedCoatings={selectedCoatings}
          />
        </div>
      )}
    </div>
  );
};
