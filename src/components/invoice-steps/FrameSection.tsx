
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FrameSearch } from "./FrameSearch";
import { AddFrameForm } from "./AddFrameForm";
import { Glasses, Plus, Sunglasses } from "lucide-react";

interface FrameSectionProps {
  selectedFrame: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
    isSunglasses?: boolean;
  };
  onFrameSelected: (frame: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
    isSunglasses?: boolean;
  }) => void;
}

export const FrameSection: React.FC<FrameSectionProps> = ({ selectedFrame, onFrameSelected }) => {
  const { t, language } = useLanguageStore();
  const [showManualFrame, setShowManualFrame] = useState(false);

  return (
    <Card className="border shadow-sm">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-b">
        <CardTitle className={`text-base flex items-center gap-2 text-amber-800`}>
          {selectedFrame.isSunglasses ? (
            <Sunglasses className="w-4 h-4 text-amber-600" />
          ) : (
            <Glasses className="w-4 h-4 text-amber-600" />
          )}
          {selectedFrame.isSunglasses ? t('sunglassesSection') : t('frameSection')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <FrameSearch 
            onFrameSelected={onFrameSelected}
            selectedFrame={selectedFrame}
          />
          
          <Button 
            variant="outline" 
            onClick={() => setShowManualFrame(!showManualFrame)}
            className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
          >
            <Plus className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
            {t('addFrameButton')}
          </Button>
          
          {showManualFrame && (
            <AddFrameForm onFrameAdded={(frame) => {
              onFrameSelected(frame);
              setShowManualFrame(false);
            }} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
