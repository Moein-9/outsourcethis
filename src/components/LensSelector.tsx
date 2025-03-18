
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { LensType, LensCoating, useInventoryStore } from "@/store/inventoryStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Eye, Check, X } from "lucide-react";

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
  onSkipLensChange,
}) => {
  const { t, language } = useLanguageStore();
  const lensTypes = useInventoryStore((state) => state.lensTypes);
  const coatings = useInventoryStore((state) => state.lensCoatings);
  
  const [selectedLensType, setSelectedLensType] = useState<LensType | null>(null);
  const [selectedCoating, setSelectedCoating] = useState<LensCoating | null>(null);
  
  const handleLensTypeSelect = (lens: LensType) => {
    setSelectedLensType(lens);
    onSelectLensType(lens);
  };
  
  const handleCoatingSelect = (coating: LensCoating) => {
    setSelectedCoating(coating);
    onSelectCoating(coating);
  };
  
  const handleSkipLensChange = (checked: boolean) => {
    if (onSkipLensChange) {
      onSkipLensChange(checked);
    }
    
    if (checked) {
      setSelectedLensType(null);
      setSelectedCoating(null);
      onSelectLensType(null);
      onSelectCoating(null);
    }
  };
  
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
          className={`font-normal text-sm ${language === 'ar' ? 'mr-2' : 'ml-2'}`}
        >
          {t('skipLens')}
        </Label>
      </div>
      
      {!skipLens && (
        <Tabs defaultValue="lensType" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="lensType" className="flex-1">
              Select Lens Type
            </TabsTrigger>
            <TabsTrigger value="coating" className="flex-1">
              Select Coatings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lensType" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lensTypes.map((lens) => (
                <div
                  key={lens.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedLensType?.id === lens.id
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "hover:border-primary/30 hover:bg-muted/10"
                  }`}
                  onClick={() => handleLensTypeSelect(lens)}
                >
                  <div className="flex justify-between items-start">
                    <div className={`${textAlignClass}`}>
                      <div className="font-medium">{lens.name}</div>
                      <div className="text-sm text-muted-foreground">{lens.type}</div>
                    </div>
                    <div className="text-right font-semibold">
                      {lens.price.toFixed(2)} {t('kwd')}
                    </div>
                  </div>
                  
                  {selectedLensType?.id === lens.id && (
                    <div className="mt-2 flex justify-end">
                      <div className="bg-primary text-white rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="coating" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {coatings.map((coating) => (
                <div
                  key={coating.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedCoating?.id === coating.id
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "hover:border-primary/30 hover:bg-muted/10"
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
                      <div className="bg-primary text-white rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <div
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedCoating === null && !skipLens
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "hover:border-primary/30 hover:bg-muted/10"
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
                    <div className="bg-primary text-white rounded-full p-1">
                      <X className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      {skipLens && (
        <div className="p-4 border border-dashed rounded-lg bg-muted/10 text-center">
          <Eye className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">{t('lensSkipped')}</p>
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
