
import React, { useState, useEffect } from "react";
import { useInventoryStore, LensType, LensCoating } from "@/store/inventoryStore";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface CompactLensSelectorProps {
  onSelectLens: (lens: LensType | null) => void;
  onSelectCoating: (coatings: LensCoating[]) => void;
  selectedLens: LensType | null;
  selectedCoatings: LensCoating[];
}

export const CompactLensSelector: React.FC<CompactLensSelectorProps> = ({
  onSelectLens,
  onSelectCoating,
  selectedLens,
  selectedCoatings,
}) => {
  const { lensTypes, lensCoatings } = useInventoryStore();
  const [activeTab, setActiveTab] = useState<string>("distance");
  
  // Group lenses by type
  const lensTypesByCategory = {
    distance: lensTypes.filter((lens) => lens.type === "distance"),
    reading: lensTypes.filter((lens) => lens.type === "reading"),
    progressive: lensTypes.filter((lens) => lens.type === "progressive"),
    bifocal: lensTypes.filter((lens) => lens.type === "bifocal"),
    sunglasses: lensTypes.filter((lens) => lens.type === "sunglasses"),
  };
  
  // Toggle coating selection
  const toggleCoating = (coating: LensCoating) => {
    if (selectedCoatings.some((c) => c.id === coating.id)) {
      onSelectCoating(selectedCoatings.filter((c) => c.id !== coating.id));
    } else {
      onSelectCoating([...selectedCoatings, coating]);
    }
  };
  
  // Check if lens is selected
  const isLensSelected = (lens: LensType) => {
    return selectedLens?.id === lens.id;
  };
  
  // Check if coating is selected
  const isCoatingSelected = (coating: LensCoating) => {
    return selectedCoatings.some((c) => c.id === coating.id);
  };
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="p-3 font-medium border-b bg-muted/40">
          اختر نوع العدسة
        </div>
        
        <Tabs defaultValue="distance" value={activeTab} onValueChange={setActiveTab}>
          <div className="p-3 pb-0">
            <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full">
              <TabsTrigger value="distance">النظر البعيد</TabsTrigger>
              <TabsTrigger value="reading">القراءة</TabsTrigger>
              <TabsTrigger value="progressive">التقدمية</TabsTrigger>
              <TabsTrigger value="bifocal">ثنائية البؤرة</TabsTrigger>
              <TabsTrigger value="sunglasses">الشمسية</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="mt-0">
            <ScrollArea className="h-[160px] p-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {lensTypesByCategory[activeTab as keyof typeof lensTypesByCategory].map((lens) => (
                  <Card 
                    key={lens.id} 
                    className={`cursor-pointer transition-all hover:border-primary ${
                      isLensSelected(lens) ? "bg-primary text-primary-foreground border-primary" : "bg-background"
                    }`}
                    onClick={() => onSelectLens(isLensSelected(lens) ? null : lens)}
                  >
                    <CardContent className="p-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium truncate">{lens.name}</div>
                        <div className="text-sm font-bold whitespace-nowrap">{lens.price.toFixed(2)} د.ك</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {lensTypesByCategory[activeTab as keyof typeof lensTypesByCategory].length === 0 && (
                  <p className="col-span-3 text-center p-4 text-muted-foreground">
                    لا توجد عدسات في هذه الفئة
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="rounded-md border">
        <div className="p-3 font-medium border-b bg-muted/40">
          اختر الطلاءات
        </div>
        
        <ScrollArea className="h-[140px]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3">
            {lensCoatings.map((coating) => (
              <Card 
                key={coating.id} 
                className={`cursor-pointer transition-all hover:border-primary ${
                  isCoatingSelected(coating) ? "bg-primary text-primary-foreground border-primary" : "bg-background"
                }`}
                onClick={() => toggleCoating(coating)}
              >
                <CardContent className="p-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium truncate">{coating.name}</div>
                    <div className="text-sm font-bold whitespace-nowrap">{coating.price.toFixed(2)} د.ك</div>
                  </div>
                  {coating.description && (
                    <p className="text-xs text-muted-foreground truncate">{coating.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
            {lensCoatings.length === 0 && (
              <p className="col-span-3 text-center p-4 text-muted-foreground">
                لا توجد طلاءات متاحة
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
      
      {selectedLens && (
        <div className="rounded-md border p-3 bg-muted/20">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">العدسة المختارة:</h3>
              <p>{selectedLens.name} - {selectedLens.price.toFixed(2)} د.ك</p>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onSelectLens(null)}
            >
              <X size={16} />
            </Button>
          </div>
          
          {selectedCoatings.length > 0 && (
            <div className="mt-2 pt-2 border-t">
              <h3 className="font-medium">الطلاءات المختارة:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                {selectedCoatings.map((coating) => (
                  <div key={coating.id} className="flex justify-between items-center text-sm">
                    <span>{coating.name}</span>
                    <span>{coating.price.toFixed(2)} د.ك</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
