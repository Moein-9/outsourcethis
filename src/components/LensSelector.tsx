
import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { LensType, LensCoating, LensThickness, useInventoryStore } from "@/store/inventoryStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Check, X, Glasses, PanelTop, AlertCircle } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  onCombinationPriceChange?: (price: number | null) => void;
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
  rx,
  onCombinationPriceChange
}) => {
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  const lensTypes = useInventoryStore((state) => state.lensTypes);
  const { 
    getLensCoatingsByCategory, 
    getLensThicknessesByCategory, 
    getLensPricingByComponents,
    getAvailableCoatings,
    getAvailableThicknesses,
    lensCoatings,
    lensThicknesses
  } = useInventoryStore();
  
  const [selectedLensType, setSelectedLensType] = useState<LensType | null>(initialLensType);
  const [selectedCoating, setSelectedCoating] = useState<LensCoating | null>(initialCoating);
  const [selectedThickness, setSelectedThickness] = useState<LensThickness | null>(initialThickness);
  const [activeCategory, setActiveCategory] = useState<"distance-reading" | "progressive" | "bifocal">("distance-reading");
  
  const hasAddValues = React.useMemo(() => {
    if (!rx) return false;
    
    const isValidAddValue = (value?: string) => {
      if (!value) return false;
      if (value === '0' || value === '0.00' || value === '-' || value === '0-' || value.trim() === '') return false;
      const numValue = parseFloat(value);
      return !isNaN(numValue) && numValue > 0;
    };
    
    if (rx.add) {
      return isValidAddValue(rx.add.right) || isValidAddValue(rx.add.left);
    }
    
    return isValidAddValue(rx.addOD) || isValidAddValue(rx.addOS);
  }, [rx]);

  const filteredLensTypes = React.useMemo(() => {
    if (hasAddValues) {
      return lensTypes;
    } else {
      return lensTypes.filter(lens => 
        lens.type !== 'progressive' && lens.type !== 'bifocal'
      );
    }
  }, [lensTypes, hasAddValues]);

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
  
  useEffect(() => {
    if (initialLensType) {
      if (!hasAddValues && (initialLensType.type === 'progressive' || initialLensType.type === 'bifocal')) {
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
  
  useEffect(() => {
    if (selectedLensType && !hasAddValues && 
        (selectedLensType.type === 'progressive' || selectedLensType.type === 'bifocal')) {
      setSelectedLensType(null);
      onSelectLensType(null);
      
      setSelectedCoating(null);
      setSelectedThickness(null);
      onSelectCoating(null);
      onSelectThickness(null);
    }
  }, [hasAddValues, selectedLensType, onSelectLensType, onSelectCoating, onSelectThickness]);
  
  useEffect(() => {
    if (selectedLensType && selectedCoating && selectedThickness && onCombinationPriceChange) {
      const combinedPrice = getLensPricingByComponents(
        selectedLensType.id,
        selectedCoating.id,
        selectedThickness.id
      );

      // Silently update the combination price without toast notification
      onCombinationPriceChange(combinedPrice);
    } else if (onCombinationPriceChange) {
      onCombinationPriceChange(null);
    }
  }, [selectedLensType, selectedCoating, selectedThickness, getLensPricingByComponents, onCombinationPriceChange]);
  
  const handleLensTypeSelect = (lens: LensType) => {
    setSelectedLensType(lens);
    onSelectLensType(lens);
    
    const newCategory = getCategory(lens);
    setActiveCategory(newCategory);
    
    setSelectedCoating(null);
    setSelectedThickness(null);
    onSelectCoating(null);
    onSelectThickness(null);
    
    if (onCombinationPriceChange) {
      onCombinationPriceChange(null);
    }
  };
  
  const handleCoatingSelect = (coating: LensCoating) => {
    setSelectedCoating(coating);
    onSelectCoating(coating);
    
    // Reset thickness when coating changes as available thicknesses might change
    setSelectedThickness(null);
    onSelectThickness(null);
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
      
      if (onCombinationPriceChange) {
        onCombinationPriceChange(null);
      }
    }
  };
  
  const availableCoatings = selectedLensType 
    ? getAvailableCoatings(selectedLensType.id, activeCategory) 
    : [];
  
  const availableThicknesses = (selectedLensType && selectedCoating)
    ? getAvailableThicknesses(selectedLensType.id, selectedCoating.id, activeCategory)
    : [];

  // Group coatings by description type
  const groupCoatingsByType = (coatings: LensCoating[]) => {
    const groups: Record<string, LensCoating[]> = {};
    
    // Create default groups
    groups[t('basicCoatings') || 'Basic Coatings'] = [];
    groups[t('premiumCoatings') || 'Premium Coatings'] = [];
    groups[t('specialtyCoatings') || 'Specialty Coatings'] = [];
    
    coatings.forEach(coating => {
      if (coating.name.includes('Basic') || coating.name.includes('عادي')) {
        groups[t('basicCoatings') || 'Basic Coatings'].push(coating);
      } else if (coating.isPhotochromic) {
        groups[t('specialtyCoatings') || 'Specialty Coatings'].push(coating);
      } else {
        groups[t('premiumCoatings') || 'Premium Coatings'].push(coating);
      }
    });
    
    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });
    
    return groups;
  };
  
  // Group thicknesses by type
  const groupThicknessesByType = (thicknesses: LensThickness[]) => {
    const groups: Record<string, LensThickness[]> = {};
    
    // Create default groups
    groups[t('standardThickness') || 'Standard'] = [];
    groups[t('thinThickness') || 'Thin'] = [];
    groups[t('ultraThinThickness') || 'Ultra Thin'] = [];
    
    thicknesses.forEach(thickness => {
      if (thickness.name.includes('1.67') || thickness.name.includes('Super Thin') || thickness.name.includes('رقيق جداً')) {
        groups[t('ultraThinThickness') || 'Ultra Thin'].push(thickness);
      } else if (thickness.name.includes('1.6') || thickness.name.includes('Thin') || thickness.name.includes('رقيق')) {
        groups[t('thinThickness') || 'Thin'].push(thickness);
      } else {
        groups[t('standardThickness') || 'Standard'].push(thickness);
      }
    });
    
    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });
    
    return groups;
  };
  
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  
  if (skipLens) {
    return (
      <div className="border rounded-lg p-4 text-center bg-muted/20">
        <Glasses className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <p className="text-muted-foreground font-medium">{t('frameOnly')}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3"
          onClick={() => handleSkipLensChange(false)}
        >
          {t('addLens')}
        </Button>
      </div>
    );
  }

  const groupedCoatings = groupCoatingsByType(availableCoatings);
  const groupedThicknesses = groupThicknessesByType(availableThicknesses);

  return (
    <div className={`space-y-6 ${dirClass}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox 
          id="skipLensCheck" 
          checked={skipLens} 
          onCheckedChange={(checked) => handleSkipLensChange(checked === true)}
        />
        <Label 
          htmlFor="skipLensCheck" 
          className={`font-medium text-sm flex items-center gap-1 ${language === 'ar' ? 'mr-2' : 'ml-2'}`}
        >
          <Glasses className="w-4 h-4 text-amber-600" />
          {t('frameOnly')}
        </Label>
      </div>

      <Card>
        <CardContent className="p-4 pb-0">
          <div className="mb-3 flex items-center">
            <div className="bg-violet-100 p-1.5 rounded-md">
              <PanelTop className="w-4 h-4 text-violet-600" />
            </div>
            <h3 className="font-semibold text-violet-800 ml-2">1. {t('selectLensType')}</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            {filteredLensTypes.map((lens) => (
              <Button
                key={lens.id}
                variant={selectedLensType?.id === lens.id ? "default" : "outline"}
                className={`
                  h-auto py-2 px-3 justify-start text-left flex-col items-start gap-1
                  ${selectedLensType?.id === lens.id ? "bg-violet-600 hover:bg-violet-700 text-white" : "hover:bg-violet-50"}
                `}
                onClick={() => handleLensTypeSelect(lens)}
              >
                <span className="font-medium">{lens.name}</span>
                <span className="text-xs opacity-80">{lens.type}</span>
                {selectedLensType?.id === lens.id && (
                  <Badge variant="secondary" className="bg-white/20 text-white mt-1">
                    <Check className="w-3 h-3 mr-1" />
                    {t('selected')}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 pb-0">
          <div className="mb-3 flex items-center">
            <div className="bg-orange-100 p-1.5 rounded-md">
              <PanelTop className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="font-semibold text-orange-800 ml-2">2. {t('selectCoating')}</h3>
          </div>
          
          {selectedLensType ? (
            availableCoatings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {Object.entries(groupedCoatings).map(([groupName, coatings]) => (
                  <DropdownMenu key={groupName}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between h-auto py-3"
                      >
                        <span>{groupName}</span>
                        <Badge variant="outline" className="ml-2">
                          {coatings.length}
                        </Badge>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white">
                      <DropdownMenuLabel>{groupName}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {coatings.map((coating) => (
                          <DropdownMenuItem
                            key={coating.id}
                            className={`flex items-start gap-2 py-2 ${selectedCoating?.id === coating.id ? "bg-orange-50" : ""}`}
                            onClick={() => handleCoatingSelect(coating)}
                          >
                            <div className="flex flex-col flex-1">
                              <span className="font-medium">{coating.name}</span>
                              <span className="text-xs text-muted-foreground">{coating.description}</span>
                              {coating.isPhotochromic && (
                                <span className="text-xs text-blue-600 mt-1">
                                  {t('photochromic')}
                                </span>
                              )}
                            </div>
                            {selectedCoating?.id === coating.id && (
                              <Check className="h-4 w-4 text-orange-600" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 bg-orange-50/50 rounded-lg mb-3">
                <AlertCircle className="mx-auto h-8 w-8 text-orange-400 mb-2" />
                <p className="text-orange-800 font-medium">{t('noCoatingsAvailable') || "No coating options available for this lens type."}</p>
                <p className="text-sm text-orange-600 mt-1">{t('selectDifferentLens') || "Please select a different lens type."}</p>
              </div>
            )
          ) : (
            <div className="text-center py-3 text-muted-foreground">
              {t('selectLensTypeFirst')}
            </div>
          )}
          
          {selectedCoating && (
            <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{selectedCoating.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedCoating.description}</p>
                  {selectedCoating.isPhotochromic && (
                    <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                      {t('photochromic')}
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    setSelectedCoating(null);
                    onSelectCoating(null);
                    setSelectedThickness(null);
                    onSelectThickness(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 pb-0">
          <div className="mb-3 flex items-center">
            <div className="bg-emerald-100 p-1.5 rounded-md">
              <PanelTop className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-emerald-800 ml-2">3. {t('selectThickness') || "Select Thickness"}</h3>
          </div>
          
          {selectedLensType && selectedCoating ? (
            availableThicknesses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {Object.entries(groupedThicknesses).map(([groupName, thicknesses]) => (
                  <DropdownMenu key={groupName}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between h-auto py-3"
                      >
                        <span>{groupName}</span>
                        <Badge variant="outline" className="ml-2">
                          {thicknesses.length}
                        </Badge>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white">
                      <DropdownMenuLabel>{groupName}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {thicknesses.map((thickness) => (
                          <DropdownMenuItem
                            key={thickness.id}
                            className={`flex items-start gap-2 py-2 ${selectedThickness?.id === thickness.id ? "bg-emerald-50" : ""}`}
                            onClick={() => handleThicknessSelect(thickness)}
                          >
                            <div className="flex flex-col flex-1">
                              <span className="font-medium">{thickness.name}</span>
                              <span className="text-xs text-muted-foreground">{thickness.description}</span>
                              <Badge variant="outline" className="mt-1 w-fit">
                                {thickness.price.toFixed(2)} {t('kwd')}
                              </Badge>
                            </div>
                            {selectedThickness?.id === thickness.id && (
                              <Check className="h-4 w-4 text-emerald-600" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 bg-emerald-50/50 rounded-lg mb-3">
                <AlertCircle className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
                <p className="text-emerald-800 font-medium">{t('noThicknessAvailable') || "No thickness options available for this combination."}</p>
                <p className="text-sm text-emerald-600 mt-1">{t('selectDifferentCoating') || "Please select a different coating."}</p>
              </div>
            )
          ) : (
            <div className="text-center py-3 text-muted-foreground">
              {selectedLensType ? t('selectCoatingFirst') || "Select a coating first" : t('selectLensTypeFirst')}
            </div>
          )}
          
          {selectedThickness && (
            <div className="mt-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{selectedThickness.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedThickness.description}</p>
                  <Badge variant="outline" className="mt-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                    {selectedThickness.price.toFixed(2)} {t('kwd')}
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    setSelectedThickness(null);
                    onSelectThickness(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
