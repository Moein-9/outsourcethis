
import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { 
  LensType, 
  LensCoating, 
  LensThickness 
} from "@/store/inventoryStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LensSelector } from "@/components/LensSelector";
import { Eye, Check } from "lucide-react";
import { PhotochromicColorSelector } from "./PhotochromicColorSelector";

interface LensSectionProps {
  selectedLensType: LensType | null;
  selectedCoating: LensCoating | null;
  selectedThickness: LensThickness | null;
  skipFrame: boolean;
  onLensTypeSelect: (lens: LensType | null) => void;
  onCoatingSelect: (coating: LensCoating | null) => void;
  onThicknessSelect: (thickness: LensThickness | null) => void;
  onSkipFrameChange: (skip: boolean) => void;
  onCombinationPriceChange: (price: number | null) => void;
  onCoatingColorChange?: (color: string) => void; 
  selectedCoatingColor?: string;
  combinedLensPrice: number | null;
  rx: any;
}

export const LensSection: React.FC<LensSectionProps> = ({
  selectedLensType,
  selectedCoating,
  selectedThickness,
  skipFrame,
  onLensTypeSelect,
  onCoatingSelect,
  onThicknessSelect,
  onSkipFrameChange,
  onCombinationPriceChange,
  onCoatingColorChange,
  selectedCoatingColor = "",
  combinedLensPrice,
  rx
}) => {
  const { t } = useLanguageStore();

  // Debug logs to check the state of components
  useEffect(() => {
    if (selectedLensType) {
      console.log("Selected lens type:", selectedLensType);
    }
    if (selectedCoating) {
      console.log("Selected coating:", selectedCoating);
    }
    if (selectedThickness) {
      console.log("Selected thickness:", selectedThickness);
    }
  }, [selectedLensType, selectedCoating, selectedThickness]);

  // First define all variables that might be needed for the condition
  const hasAvailableColors = selectedCoating?.availableColors?.length > 0;
  const isPhotochromic = selectedCoating?.isPhotochromic || false;
  const isSunglasses = selectedCoating?.category === "sunglasses";
  
  // Determine if color selector should be shown (moved outside useMemo)
  const shouldShowColorSelector = hasAvailableColors && (isPhotochromic || isSunglasses);

  return (
    <Card className="border shadow-sm relative overflow-visible">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-violet-100/50 border-b">
        <CardTitle className={`text-base flex justify-between items-center`}>
          <span className="flex items-center gap-2 text-violet-800">
            <Eye className="w-4 h-4 text-violet-600" />
            {t('lensSection')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 overflow-visible">
        <LensSelector 
          onSelectLensType={onLensTypeSelect}
          onSelectCoating={onCoatingSelect}
          onSelectThickness={onThicknessSelect}
          skipLens={skipFrame}
          onSkipLensChange={onSkipFrameChange}
          initialLensType={selectedLensType}
          initialCoating={selectedCoating}
          initialThickness={selectedThickness}
          rx={rx}
          onCombinationPriceChange={onCombinationPriceChange}
        />
        
        {/* Unified color selector for both photochromic and sunglasses */}
        {shouldShowColorSelector && (
          <div className="mt-6">
            <PhotochromicColorSelector
              coating={selectedCoating}
              selectedColor={selectedCoatingColor || ""}
              onColorChange={onCoatingColorChange || (() => {})}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
