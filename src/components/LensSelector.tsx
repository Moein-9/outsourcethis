
import React, { useState } from "react";
import { useInventoryStore, LensType, LensCoating } from "@/store/inventoryStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Glasses, Shield, Zap } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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
    <div className="space-y-5">
      {onSkipLensChange && (
        <div className="flex items-center space-x-2 space-x-reverse justify-end">
          <Checkbox 
            id="skipLensCheck" 
            checked={skipLens} 
            onCheckedChange={(checked) => handleSkipLensChange(checked === true)} 
          />
          <Label 
            htmlFor="skipLensCheck" 
            className="font-normal text-sm mr-2"
          >
            إطار فقط (بدون عدسات)
          </Label>
        </div>
      )}
      
      {!skipLens && (
        <>
          <div className="space-y-2">
            <Label className="text-muted-foreground block text-right">١) نوع العدسة:</Label>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(groupedLensTypes).map(([type, lenses]) => (
                <div key={type} className="space-y-2">
                  <h4 className="text-sm font-medium text-right text-primary">
                    {type === "distance" && "عدسات البعد"}
                    {type === "reading" && "عدسات القراءة"}
                    {type === "progressive" && "عدسات متعددة البؤر"}
                    {type === "bifocal" && "عدسات ثنائية البؤرة"}
                    {type === "sunglasses" && "عدسات شمسية"}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {lenses.map(lens => (
                      <div
                        key={lens.id}
                        className={`p-3 border rounded-md cursor-pointer transition-all ${
                          selectedLensId === lens.id
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "hover:border-primary/30 hover:bg-muted/10"
                        }`}
                        onClick={() => handleLensTypeChange(lens.id)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{lens.price.toFixed(2)} KWD</span>
                          <div className="flex items-center gap-1.5">
                            <span>{lens.name}</span>
                            <Eye className={`w-4 h-4 ${selectedLensId === lens.id ? "text-primary" : ""}`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-muted-foreground block text-right">٢) الطلاء (اختياري):</Label>
            <div className="grid grid-cols-1 gap-2">
              <div
                className={`p-3 border rounded-md cursor-pointer transition-all ${
                  selectedCoatingId === "no-coating"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "hover:border-primary/30 hover:bg-muted/10"
                }`}
                onClick={() => handleCoatingChange("no-coating")}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">0.00 KWD</span>
                  <div className="flex items-center gap-1.5">
                    <span>بدون طلاء</span>
                    <Shield className={`w-4 h-4 ${selectedCoatingId === "no-coating" ? "text-primary" : ""}`} />
                  </div>
                </div>
              </div>
              
              {lensCoatings.map(coating => (
                <div
                  key={coating.id}
                  className={`p-3 border rounded-md cursor-pointer transition-all ${
                    selectedCoatingId === coating.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "hover:border-primary/30 hover:bg-muted/10"
                  }`}
                  onClick={() => handleCoatingChange(coating.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{coating.price.toFixed(2)} KWD</span>
                    <div className="flex items-center gap-1.5">
                      <span>{coating.name}</span>
                      <Shield className={`w-4 h-4 ${selectedCoatingId === coating.id ? "text-primary" : ""}`} />
                    </div>
                  </div>
                  {coating.description && (
                    <div className="text-sm text-muted-foreground mt-1 text-right">
                      {coating.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
