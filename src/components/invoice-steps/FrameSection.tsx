
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FrameSearch } from "./FrameSearch";
import { AddFrameForm } from "./AddFrameForm";
import { Glasses, Plus, Sun } from "lucide-react";

interface FrameSectionProps {
  selectedFrame: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  };
  onFrameSelected: (frame: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  }) => void;
}

export const FrameSection: React.FC<FrameSectionProps> = ({ selectedFrame, onFrameSelected }) => {
  const { t, language } = useLanguageStore();
  const [showManualFrame, setShowManualFrame] = useState(false);
  const [frameType, setFrameType] = useState<"regular" | "sunglasses">("regular");

  return (
    <Card className="border shadow-sm">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-b">
        <CardTitle className={`text-base flex items-center gap-2 text-amber-800`}>
          <Glasses className="w-4 h-4 text-amber-600" />
          {t('frameSection')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs 
          value={frameType} 
          onValueChange={(value) => setFrameType(value as "regular" | "sunglasses")}
          className="w-full mb-4"
        >
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger 
              value="regular" 
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Glasses className="w-4 h-4 mr-2" />
              {language === 'ar' ? "إطارات عادية" : "Regular Frames"}
            </TabsTrigger>
            <TabsTrigger 
              value="sunglasses" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <Sun className="w-4 h-4 mr-2" />
              {language === 'ar' ? "نظارات شمسية" : "Sunglasses"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="regular" className="mt-0">
            <div className="space-y-4">
              <FrameSearch 
                onFrameSelected={onFrameSelected}
                selectedFrame={selectedFrame}
                sunglassesMode={false}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="sunglasses" className="mt-0">
            <div className="space-y-4">
              <FrameSearch 
                onFrameSelected={onFrameSelected}
                selectedFrame={selectedFrame}
                sunglassesMode={true}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <Button 
          variant="outline" 
          onClick={() => setShowManualFrame(!showManualFrame)}
          className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 mt-2"
        >
          <Plus className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
          {t('addFrameButton')}
        </Button>
        
        {showManualFrame && (
          <AddFrameForm 
            onFrameAdded={(frame) => {
              onFrameSelected(frame);
              setShowManualFrame(false);
            }}
            isSunglasses={frameType === "sunglasses"}
          />
        )}
      </CardContent>
    </Card>
  );
};
