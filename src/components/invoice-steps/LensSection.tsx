import React, { useState, useEffect } from "react";
import { useInventoryStore, LensType, LensCoating, LensThickness } from "@/store/inventoryStore";
import { useLanguageStore } from "@/store/languageStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  onCoatingColorChange: (color: string) => void;
  selectedCoatingColor: string;
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
  selectedCoatingColor,
  combinedLensPrice,
  rx
}) => {
  const { t, language } = useLanguageStore();
  const lensTypes = useInventoryStore((state) => state.lensTypes);
  const allLensCoatings = useInventoryStore((state) => state.lensCoatings);
  const allLensThicknesses = useInventoryStore((state) => state.lensThicknesses);
  const getLensPricingByComponents = useInventoryStore((state) => state.getLensPricingByComponents);
  const getLensCoatingsByCategory = useInventoryStore((state) => state.getLensCoatingsByCategory);
  const getLensThicknessesByCategory = useInventoryStore((state) => state.getLensThicknessesByCategory);
  const getAvailableCoatings = useInventoryStore((state) => state.getAvailableCoatings);
  const getAvailableThicknesses = useInventoryStore((state) => state.getAvailableThicknesses);
  
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  const [activeTab, setActiveTab] = useState("lens-type");
  const [lensCategory, setLensCategory] = useState<"distance-reading" | "progressive" | "bifocal">("distance-reading");
  
  const [filteredLensTypes, setFilteredLensTypes] = useState<LensType[]>(lensTypes);
  
  const [availableCoatings, setAvailableCoatings] = useState<LensCoating[]>([]);
  const [availableThicknesses, setAvailableThicknesses] = useState<LensThickness[]>([]);
  
  useEffect(() => {
    if (rx && rx.sphOD) {
      const isPrescriptionForReading = isPrescriptionReading(rx);
      const isPrescriptionForDistance = isPrescriptionDistance(rx);
      const isProgressive = isPrescriptionProgressive(rx);
      
      let appropriate: LensType[] = [];
      
      if (isProgressive) {
        setLensCategory("progressive");
        appropriate = lensTypes.filter(lens => lens.type === "progressive");
      } else if (isPrescriptionForDistance) {
        setLensCategory("distance-reading");
        appropriate = lensTypes.filter(lens => lens.type === "distance");
      } else if (isPrescriptionForReading) {
        setLensCategory("distance-reading");
        appropriate = lensTypes.filter(lens => lens.type === "reading");
      } else {
        setLensCategory("distance-reading");
        appropriate = lensTypes;
      }
      
      setFilteredLensTypes(appropriate);
    } else {
      setFilteredLensTypes(lensTypes);
    }
  }, [rx, lensTypes]);
  
  useEffect(() => {
    if (selectedLensType) {
      const coatings = getAvailableCoatings(selectedLensType.id, lensCategory);
      setAvailableCoatings(coatings);
      
      if (selectedCoating && !coatings.some(c => c.id === selectedCoating.id)) {
        onCoatingSelect(null);
      }
    } else {
      const categoryCoatings = getLensCoatingsByCategory(lensCategory);
      setAvailableCoatings(categoryCoatings);
      
      if (selectedCoating && !categoryCoatings.some(c => c.id === selectedCoating.id)) {
        onCoatingSelect(null);
      }
    }
  }, [selectedLensType, lensCategory, getLensCoatingsByCategory, getAvailableCoatings]);
  
  useEffect(() => {
    if (selectedLensType && selectedCoating) {
      const thicknesses = getAvailableThicknesses(selectedLensType.id, selectedCoating.id, lensCategory);
      setAvailableThicknesses(thicknesses);
      
      if (selectedThickness && !thicknesses.some(t => t.id === selectedThickness.id)) {
        onThicknessSelect(null);
      }
    } else {
      const categoryThicknesses = getLensThicknessesByCategory(lensCategory);
      setAvailableThicknesses(categoryThicknesses);
      
      if (selectedThickness && !categoryThicknesses.some(t => t.id === selectedThickness.id)) {
        onThicknessSelect(null);
      }
    }
  }, [selectedLensType, selectedCoating, lensCategory, getLensThicknessesByCategory, getAvailableThicknesses]);
  
  useEffect(() => {
    if (selectedLensType && selectedCoating && selectedThickness) {
      const combinationPrice = getLensPricingByComponents(
        selectedLensType.id,
        selectedCoating.id,
        selectedThickness.id
      );
      
      onCombinationPriceChange(combinationPrice);
    } else {
      onCombinationPriceChange(null);
    }
  }, [selectedLensType, selectedCoating, selectedThickness, getLensPricingByComponents, onCombinationPriceChange]);
  
  const isPrescriptionReading = (rx: any) => {
    if (!rx) return false;
    
    const sphOD = parseFloat(rx.sphOD || "0");
    const sphOS = parseFloat(rx.sphOS || "0");
    
    return (sphOD > 0.25 || sphOS > 0.25);
  };
  
  const isPrescriptionDistance = (rx: any) => {
    if (!rx) return false;
    
    const sphOD = parseFloat(rx.sphOD || "0");
    const sphOS = parseFloat(rx.sphOS || "0");
    
    return (sphOD < -0.25 || sphOS < -0.25);
  };
  
  const isPrescriptionProgressive = (rx: any) => {
    if (!rx) return false;
    
    const addOD = parseFloat(rx.addOD || "0");
    const addOS = parseFloat(rx.addOS || "0");
    
    return (addOD > 0.25 || addOS > 0.25);
  };
  
  const getLensTypeBadgeColor = (type: string) => {
    switch (type) {
      case "distance":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "reading":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "progressive":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "bifocal":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "sunglasses":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };
  
  return (
    <Card className="border shadow-sm relative overflow-visible">
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
        
        {selectedCoating?.isPhotochromic && (
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
