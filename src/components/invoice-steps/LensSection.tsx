
import React, { useState } from "react";
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

  return (
    <Card className="border shadow-sm relative">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-violet-100/50 border-b">
        <CardTitle className={`text-base flex justify-between items-center`}>
          <span className="flex items-center gap-2 text-violet-800">
            <Eye className="w-4 h-4 text-violet-600" />
            {t('lensSection')}
          </span>
          
          {combinedLensPrice !== null && (
            <Badge 
              className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 font-medium flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              {t('combinedPrice')}: {combinedLensPrice.toFixed(3)} {t('kwd')}
            </Badge>
          )}
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
        
        {/* Photochromic color selector when applicable */}
        {selectedCoating?.isPhotochromic && (
          <div className="mt-4 pb-2">
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
