import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { LensType, LensCoating, LensThickness } from "@/store/inventoryStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LensSelector } from "@/components/LensSelector";
import { Eye, Check } from "lucide-react";
import { PhotochromicColorSelector } from "./PhotochromicColorSelector";
import { supabase } from "@/integrations/supabase/client";

interface LensPricingCombination {
  combination_id: string;
  lens_type_id: string;
  coating_id: string;
  thickness_id: string;
  price: number;
  lens_types?: any;
  lens_coatings?: any;
  lens_thicknesses?: any;
}

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
  rx,
}) => {
  const { t } = useLanguageStore();
  const [isLoading, setIsLoading] = useState(false);
  const [lensPricingCombinations, setLensPricingCombinations] = useState<
    LensPricingCombination[]
  >([]);

  // Fetch the lens pricing combinations on component mount
  useEffect(() => {
    const fetchLensPricingCombinations = async () => {
      setIsLoading(true);
      try {
        // @ts-ignore - Tables exist at runtime but not in TypeScript definitions
        const { data, error } = await supabase.from("lens_pricing_combinations")
          .select(`
            combination_id,
            lens_type_id,
            coating_id,
            thickness_id,
            price,
            lens_types(lens_id, name, type),
            lens_coatings(coating_id, name, price, description, category, is_photochromic, available_colors),
            lens_thicknesses(thickness_id, name, price, description, category)
          `);

        if (error) {
          console.error("Error fetching lens pricing combinations:", error);
          return;
        }

        if (data) {
          setLensPricingCombinations(data);
        }
      } catch (err) {
        console.error("Error in fetching lens pricing combinations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLensPricingCombinations();
  }, []);

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

  // Determine if color selector should be shown
  const shouldShowColorSelector =
    selectedCoating?.availableColors?.length > 0 &&
    (selectedCoating?.isPhotochromic ||
      selectedCoating?.category === "sunglasses");

  // Function to find the combination price when all selections are made
  useEffect(() => {
    if (selectedLensType && selectedCoating && selectedThickness) {
      const matchingCombination = lensPricingCombinations.find(
        (combo) =>
          combo.lens_type_id === selectedLensType.id &&
          combo.coating_id === selectedCoating.id &&
          combo.thickness_id === selectedThickness.id
      );

      if (matchingCombination) {
        onCombinationPriceChange(matchingCombination.price);
      } else {
        // If no combination found in the database, calculate a default price
        const defaultPrice =
          (selectedLensType.price || 0) +
          selectedCoating.price +
          selectedThickness.price;
        onCombinationPriceChange(defaultPrice);
      }
    } else {
      onCombinationPriceChange(null);
    }
  }, [
    selectedLensType,
    selectedCoating,
    selectedThickness,
    lensPricingCombinations,
    onCombinationPriceChange,
  ]);

  return (
    <Card className="border shadow-sm relative overflow-visible">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-violet-100/50 border-b">
        <CardTitle className={`text-base flex justify-between items-center`}>
          <span className="flex items-center gap-2 text-violet-800">
            <Eye className="w-4 h-4 text-violet-600" />
            {t("lensSection")}
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
          lensPricingCombinations={lensPricingCombinations}
          isLoading={isLoading}
        />

        {/* Unified color selector for both photochromic and sunglasses */}
        {shouldShowColorSelector && selectedCoating && (
          <div className="mt-6">
            <PhotochromicColorSelector
              coating={selectedCoating}
              selectedColor={selectedCoatingColor}
              onColorChange={onCoatingColorChange || (() => {})}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
