
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
            <Select
              value={selectedLensId}
              onValueChange={handleLensTypeChange}
            >
              <SelectTrigger className="text-right">
                <SelectValue placeholder="اختر نوع العدسة" />
              </SelectTrigger>
              <SelectContent position="popper">
                {lensTypes.map((lens) => (
                  <SelectItem key={lens.id} value={lens.id} className="text-right">
                    <div className="flex items-center justify-between w-full">
                      <span>{lens.price.toFixed(2)} KWD</span>
                      <span>{lens.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedLensId && (
              <div className="mt-2 p-2 bg-primary/5 border border-primary/20 rounded-md text-right">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-primary">
                    {lensTypes.find(l => l.id === selectedLensId)?.price.toFixed(2)} KWD
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span>{lensTypes.find(l => l.id === selectedLensId)?.name}</span>
                    <Eye className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label className="text-muted-foreground block text-right">٢) الطلاء (اختياري):</Label>
            <Select
              value={selectedCoatingId}
              onValueChange={handleCoatingChange}
            >
              <SelectTrigger className="text-right">
                <SelectValue placeholder="اختر الطلاء" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="" className="text-right">
                  <div className="flex items-center justify-between w-full">
                    <span>0.00 KWD</span>
                    <span>بدون طلاء</span>
                  </div>
                </SelectItem>
                {lensCoatings.map((coating) => (
                  <SelectItem key={coating.id} value={coating.id} className="text-right">
                    <div className="flex items-center justify-between w-full">
                      <span>{coating.price.toFixed(2)} KWD</span>
                      <span>{coating.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedCoatingId && (
              <div className="mt-2 p-2 bg-primary/5 border border-primary/20 rounded-md text-right">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-primary">
                    {lensCoatings.find(c => c.id === selectedCoatingId)?.price.toFixed(2)} KWD
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span>{lensCoatings.find(c => c.id === selectedCoatingId)?.name}</span>
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                </div>
                {lensCoatings.find(c => c.id === selectedCoatingId)?.description && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {lensCoatings.find(c => c.id === selectedCoatingId)?.description}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
