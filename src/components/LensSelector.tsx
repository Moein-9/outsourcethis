
import React, { useState } from "react";
import { useInventoryStore, LensType, LensCoating } from "@/store/inventoryStore";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CompactLensSelector } from "@/components/CompactLensSelector";

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

  return (
    <div className="space-y-3 bg-white rounded-lg shadow-sm">
      {onSkipLensChange && (
        <div className="flex items-center space-x-2 space-x-reverse justify-end bg-muted/20 p-3 rounded-t-lg">
          <Checkbox 
            id="skipLensCheck" 
            checked={skipLens} 
            onCheckedChange={(checked) => handleSkipLensChange(checked === true)} 
          />
          <Label 
            htmlFor="skipLensCheck" 
            className="font-medium text-sm mr-2 cursor-pointer"
          >
            إطار فقط (بدون عدسات)
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
