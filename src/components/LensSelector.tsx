
import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { LensType, LensCoating, LensThickness, useInventoryStore } from "@/store/inventoryStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Eye, Check, X, Glasses } from "lucide-react";

interface LensSelectorProps {
  onSelectLensType: (lens: LensType | null) => void;
  onSelectCoating: (coating: LensCoating | null) => void;
  onSelectThickness: (thickness: LensThickness | null) => void;
  skipLens?: boolean;
  onSkipLensChange?: (skip: boolean) => void;
  initialLensType?: LensType | null;
  initialCoating?: LensCoating | null;
  initialThickness?: LensThickness | null;
  rx?: {
    sphere?: { right: string; left: string };
    cylinder?: { right: string; left: string };
    axis?: { right: string; left: string };
    add?: { right: string; left: string };
    pd?: { right: string; left: string };
    // Support for direct rx format from store
    sphereOD?: string;
    sphereOS?: string;
    cylOD?: string;
    cylOS?: string;
    axisOD?: string;
    axisOS?: string;
    addOD?: string;
    addOS?: string;
    pdRight?: string;
    pdLeft?: string;
  };
}

export const LensSelector: React.FC<LensSelectorProps> = ({
  onSelectLensType,
  onSelectCoating,
  onSelectThickness,
  skipLens = false,
  onSkipLensChange,
  initialLensType = null,
  initialCoating = null,
  initialThickness = null,
  rx
}) => {
  const { t, language } = useLanguageStore();
  const lensTypes = useInventoryStore((state) => state.lensTypes);
  const { lensCoatings, lensThicknesses, getLensCoatingsByCategory, getLensThicknessesByCategory } = useInventoryStore();
  
  const [selectedLensType, setSelectedLensType] = useState<LensType | null>(initialLensType);
  const [selectedCoating, setSelectedCoating] = useState<LensCoating | null>(initialCoating);
  const [selectedThickness, setSelectedThickness] = useState<LensThickness | null>(initialThickness);
  const [activeCategory, setActiveCategory] = useState<"distance-reading" | "progressive" | "bifocal">("distance-reading");
  
  // Enhanced check for ADD values that handles both object formats
  const hasAddValues = React.useMemo(() => {
    if (!rx) return false;
    
    // Check for nested 'add' object format
    if (rx.add) {
      return (rx.add.right && rx.add.right !== '0' && rx.add.right !== '0.00') || 
             (rx.add.left && rx.add.left !== '0' && rx.add.left !== '0.00');
    }
    
    // Check for flat format (addOD, addOS)
    return (rx.addOD && rx.addOD !== '0' && rx.addOD !== '0.00') || 
           (rx.addOS && rx.addOS !== '0' && rx.addOS !== '0.00');
  }, [rx]);

  // Log rx and ADD values for debugging
  console.log('RX passed to LensSelector:', rx);
  console.log('Has ADD values:', hasAddValues);
  console.log('ADD values check - addOD:', rx?.addOD);
  console.log('ADD values check - addOS:', rx?.addOS);
  
  // Filter lens types based on ADD values
  const filteredLensTypes = React.useMemo(() => {
    if (hasAddValues) {
      // Show all lens types when ADD values are present
      return lensTypes;
    } else {
      // Hide Progressive and Bifocal lens types when ADD values are not present
      return lensTypes.filter(lens => 
        lens.type !== 'progressive' && lens.type !== 'bifocal'
      );
    }
  }, [lensTypes, hasAddValues]);

  // Get coatings and thicknesses based on lens type category
  const getCategory = (lensType: LensType | null): "distance-reading" | "progressive" | "bifocal" => {
    if (!lensType) return "distance-reading";
    
    switch (lensType.type) {
      case "progressive":
        return "progressive";
      case "bifocal":
        return "bifocal";
      case "distance":
      case "reading":
      case "sunglasses":
      default:
        return "distance-reading";
    }
  };
  
  // Initialize from props if provided
  useEffect(() => {
    if (initialLensType) {
      // Check if initialLensType is valid based on hasAddValues
      if (!hasAddValues && (initialLensType.type === 'progressive' || initialLensType.type === 'bifocal')) {
        // If we have an invalid lens type selected and no ADD values, reset it
        setSelectedLensType(null);
        onSelectLensType(null);
      } else {
        setSelectedLensType(initialLensType);
        setActiveCategory(getCategory(initialLensType));
      }
    }
    if (initialCoating) {
      setSelectedCoating(initialCoating);
    }
    if (initialThickness) {
      setSelectedThickness(initialThickness);
    }
  }, [initialLensType, initialCoating, initialThickness, hasAddValues, onSelectLensType]);
  
  // Update selected lens type if it becomes invalid (e.g., prescription changes)
  useEffect(() => {
    if (selectedLensType && !hasAddValues && 
        (selectedLensType.type === 'progressive' || selectedLensType.type === 'bifocal')) {
      setSelectedLensType(null);
      onSelectLensType(null);
      
      // Reset coating and thickness when lens type is reset
      setSelectedCoating(null);
      setSelectedThickness(null);
      onSelectCoating(null);
      onSelectThickness(null);
    }
  }, [hasAddValues, selectedLensType, onSelectLensType, onSelectCoating, onSelectThickness]);
  
  const handleLensTypeSelect = (lens: LensType) => {
    setSelectedLensType(lens);
    onSelectLensType(lens);
    
    // Update category based on lens type
    const newCategory = getCategory(lens);
    setActiveCategory(newCategory);
    
    // Reset coating and thickness when lens type changes
    setSelectedCoating(null);
    setSelectedThickness(null);
    onSelectCoating(null);
    onSelectThickness(null);
  };
  
  const handleCoatingSelect = (coating: LensCoating) => {
    setSelectedCoating(coating);
    onSelectCoating(coating);
  };
  
  const handleThicknessSelect = (thickness: LensThickness) => {
    setSelectedThickness(thickness);
    onSelectThickness(thickness);
  };
  
  const handleSkipLensChange = (checked: boolean) => {
    if (onSkipLensChange) {
      onSkipLensChange(checked);
    }
    
    if (checked) {
      setSelectedLensType(null);
      setSelectedCoating(null);
      setSelectedThickness(null);
      onSelectLensType(null);
      onSelectCoating(null);
      onSelectThickness(null);
    }
  };
  
  // Get filtered coatings and thicknesses based on active category
  const availableCoatings = getLensCoatingsByCategory(activeCategory);
  const availableThicknesses = getLensThicknessesByCategory(activeCategory);
  
  console.log('Available lensTypes:', filteredLensTypes);
  console.log('Has ADD values:', hasAddValues);
  console.log('Available coatings for category', activeCategory, ':', availableCoatings);
  console.log('Available thicknesses for category', activeCategory, ':', availableThicknesses);
  
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  
  return (
    <div className={`space-y-4 ${dirClass}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox 
          id="skipLensCheck" 
          checked={skipLens} 
          onCheckedChange={(checked) => handleSkipLensChange(checked === true)}
        />
        <Label 
          htmlFor="skipLensCheck" 
          className={`font-normal text-sm flex items-center gap-1 ${language === 'ar' ? 'mr-2' : 'ml-2'}`}
        >
          <Glasses className="w-4 h-4 text-amber-600" />
          {t('frameOnly')}
        </Label>
      </div>
      
      {!skipLens && (
        <Tabs defaultValue="lensType" className="w-full">
          <TabsList className="w-full mb-4 grid grid-cols-3">
            <TabsTrigger value="lensType" className="flex-1 bg-[#8B5CF6] data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
              <span className="text-white">1</span> - {t('selectLensType')}
            </TabsTrigger>
            <TabsTrigger value="coating" className="flex-1 bg-[#F97316] data-[state=active]:bg-[#F97316] data-[state=active]:text-white">
              <span className="text-white">2</span> - {t('selectCoatings')}
            </TabsTrigger>
            <TabsTrigger value="thickness" className="flex-1 bg-[#10B981] data-[state=active]:bg-[#10B981] data-[state=active]:text-white">
              <span className="text-white">3</span> - {t('selectThickness') || "Select Thickness"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lensType" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredLensTypes.map((lens) => (
                <div
                  key={lens.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedLensType?.id === lens.id
                      ? "border-[#8B5CF6] bg-[#8B5CF6]/10 shadow-sm" 
                      : "hover:border-[#8B5CF6]/30 hover:bg-muted/10"
                  }`}
                  onClick={() => handleLensTypeSelect(lens)}
                >
                  <div className="flex justify-between items-start">
                    <div className={`${textAlignClass}`}>
                      <div className="font-medium">{lens.name}</div>
                      <div className="text-sm text-muted-foreground">{lens.type}</div>
                    </div>
                  </div>
                  
                  {selectedLensType?.id === lens.id && (
                    <div className="mt-2 flex justify-end">
                      <div className="bg-[#8B5CF6] text-white rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="coating" className="space-y-4">
            {selectedLensType ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableCoatings.map((coating) => (
                  <div
                    key={coating.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedCoating?.id === coating.id
                        ? "border-[#F97316] bg-[#F97316]/10 shadow-sm" 
                        : "hover:border-[#F97316]/30 hover:bg-muted/10"
                    }`}
                    onClick={() => handleCoatingSelect(coating)}
                  >
                    <div className="flex justify-between items-start">
                      <div className={`${textAlignClass}`}>
                        <div className="font-medium">{coating.name}</div>
                        <div className="text-sm text-muted-foreground">{coating.description || ''}</div>
                      </div>
                      <div className="text-right font-semibold">
                        {coating.price.toFixed(2)} {t('kwd')}
                      </div>
                    </div>
                    
                    {selectedCoating?.id === coating.id && (
                      <div className="mt-2 flex justify-end">
                        <div className="bg-[#F97316] text-white rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                <div
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedCoating === null && !skipLens
                      ? "border-[#F97316] bg-[#F97316]/10 shadow-sm" 
                      : "hover:border-[#F97316]/30 hover:bg-muted/10"
                  }`}
                  onClick={() => {
                    setSelectedCoating(null);
                    onSelectCoating(null);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className={`${textAlignClass}`}>
                      <div className="font-medium">{t('noCoating')}</div>
                      <div className="text-sm text-muted-foreground">{t('noCoatingDesc')}</div>
                    </div>
                    <div className="text-right font-semibold">
                      0.00 {t('kwd')}
                    </div>
                  </div>
                  
                  {selectedCoating === null && !skipLens && (
                    <div className="mt-2 flex justify-end">
                      <div className="bg-[#F97316] text-white rounded-full p-1">
                        <X className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 border border-dashed rounded-lg bg-muted/10 text-center">
                <p className="text-muted-foreground">{t('selectLensTypeFirst') || "Please select a lens type first"}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="thickness" className="space-y-4">
            {selectedLensType ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableThicknesses.map((thickness) => (
                  <div
                    key={thickness.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedThickness?.id === thickness.id
                        ? "border-[#10B981] bg-[#10B981]/10 shadow-sm" 
                        : "hover:border-[#10B981]/30 hover:bg-muted/10"
                    }`}
                    onClick={() => handleThicknessSelect(thickness)}
                  >
                    <div className="flex justify-between items-start">
                      <div className={`${textAlignClass}`}>
                        <div className="font-medium">{thickness.name}</div>
                        <div className="text-sm text-muted-foreground">{thickness.description || ''}</div>
                      </div>
                      <div className="text-right font-semibold">
                        {thickness.price.toFixed(2)} {t('kwd')}
                      </div>
                    </div>
                    
                    {selectedThickness?.id === thickness.id && (
                      <div className="mt-2 flex justify-end">
                        <div className="bg-[#10B981] text-white rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                <div
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedThickness === null && !skipLens
                      ? "border-[#10B981] bg-[#10B981]/10 shadow-sm" 
                      : "hover:border-[#10B981]/30 hover:bg-muted/10"
                  }`}
                  onClick={() => {
                    setSelectedThickness(null);
                    onSelectThickness(null);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className={`${textAlignClass}`}>
                      <div className="font-medium">{t('noThickness') || "No Thickness"}</div>
                      <div className="text-sm text-muted-foreground">{t('noThicknessDesc') || "No additional thickness options"}</div>
                    </div>
                    <div className="text-right font-semibold">
                      0.00 {t('kwd')}
                    </div>
                  </div>
                  
                  {selectedThickness === null && !skipLens && (
                    <div className="mt-2 flex justify-end">
                      <div className="bg-[#10B981] text-white rounded-full p-1">
                        <X className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 border border-dashed rounded-lg bg-muted/10 text-center">
                <p className="text-muted-foreground">{t('selectLensTypeFirst') || "Please select a lens type first"}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
      
      {skipLens && (
        <div className="p-4 border border-dashed rounded-lg bg-muted/10 text-center">
          <Glasses className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-muted-foreground">{t('frameOnly')}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => handleSkipLensChange(false)}
          >
            {t('addLens')}
          </Button>
        </div>
      )}
    </div>
  );
};
