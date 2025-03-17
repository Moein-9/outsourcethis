
import React, { useState } from "react";
import { useInventoryStore, LensType, LensCoating } from "@/store/inventoryStore";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, Glasses, Shield, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

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
  const lensTypes = useInventoryStore((state) => state.lensTypes);
  const lensCoatings = useInventoryStore((state) => state.lensCoatings);
  
  const [selectedLensId, setSelectedLensId] = useState<string>("");
  const [selectedCoatingId, setSelectedCoatingId] = useState<string>("");
  
  const handleLensTypeChange = (lensId: string) => {
    setSelectedLensId(lensId);
    const selectedLens = lensTypes.find(lens => lens.id === lensId) || null;
    onSelectLensType(selectedLens);
  };
  
  const handleCoatingChange = (coatingId: string) => {
    setSelectedCoatingId(coatingId);
    const selectedCoating = lensCoatings.find(coating => coating.id === coatingId) || null;
    onSelectCoating(selectedCoating);
  };
  
  const handleSkipLensChange = (checked: boolean) => {
    if (onSkipLensChange) {
      onSkipLensChange(checked);
      if (checked) {
        setSelectedLensId("");
        setSelectedCoatingId("");
        onSelectLensType(null);
        onSelectCoating(null);
      }
    }
  };

  // Group lens types by category
  const groupedLensTypes = lensTypes.reduce((groups, lens) => {
    if (!groups[lens.type]) {
      groups[lens.type] = [];
    }
    groups[lens.type].push(lens);
    return groups;
  }, {} as Record<string, LensType[]>);
  
  return (
    <div className="space-y-6 bg-white rounded-lg shadow-sm">
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
        <div className="p-4 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="text-primary h-5 w-5" />
              <Label className="text-lg font-medium text-primary">١) نوع العدسة:</Label>
            </div>
            <Separator className="my-3" />
            
            <div className="grid grid-cols-1 gap-5">
              {Object.entries(groupedLensTypes).map(([type, lenses]) => (
                <div key={type} className="space-y-3">
                  <h4 className="text-md font-semibold text-right text-primary/90 bg-muted/20 py-2 px-3 rounded-md">
                    {type === "distance" && "عدسات البعد"}
                    {type === "reading" && "عدسات القراءة"}
                    {type === "progressive" && "عدسات متعددة البؤر"}
                    {type === "bifocal" && "عدسات ثنائية البؤرة"}
                    {type === "sunglasses" && "عدسات شمسية"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {lenses.map(lens => (
                      <div
                        key={lens.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedLensId === lens.id
                            ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary"
                            : "hover:border-primary/30 hover:bg-muted/10"
                        }`}
                        onClick={() => handleLensTypeChange(lens.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5 flex-1 justify-end">
                            <span className="font-medium text-right">{lens.name}</span>
                            {selectedLensId === lens.id && (
                              <Check className="w-4 h-4 text-primary" />
                            )}
                          </div>
                        </div>
                        <div className="mt-2 text-left">
                          <span className="font-bold text-primary">{lens.price.toFixed(2)} KWD</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="text-primary h-5 w-5" />
              <Label className="text-lg font-medium text-primary">٢) الطلاء (اختياري):</Label>
            </div>
            <Separator className="my-3" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedCoatingId === "no-coating"
                    ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary"
                    : "hover:border-primary/30 hover:bg-muted/10"
                }`}
                onClick={() => handleCoatingChange("no-coating")}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 flex-1 justify-end">
                    <span className="font-medium text-right">بدون طلاء</span>
                    {selectedCoatingId === "no-coating" && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </div>
                <div className="mt-2 text-left">
                  <span className="font-bold text-primary">0.00 KWD</span>
                </div>
              </div>
              
              {lensCoatings.map(coating => (
                <div
                  key={coating.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedCoatingId === coating.id
                      ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary"
                      : "hover:border-primary/30 hover:bg-muted/10"
                  }`}
                  onClick={() => handleCoatingChange(coating.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 flex-1 justify-end">
                      <span className="font-medium text-right">{coating.name}</span>
                      {selectedCoatingId === coating.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-left">
                    <span className="font-bold text-primary">{coating.price.toFixed(2)} KWD</span>
                  </div>
                  {coating.description && (
                    <div className="text-sm text-muted-foreground mt-2 text-right bg-muted/10 p-2 rounded-md">
                      {coating.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
