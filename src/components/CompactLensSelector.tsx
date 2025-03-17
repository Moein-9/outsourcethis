
import React, { useState, useEffect } from "react";
import { useInventoryStore, LensType, LensCoating } from "@/store/inventoryStore";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [expandedSection, setExpandedSection] = useState<"lens" | "coating" | null>(null);
  
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

  // Toggle expanded section
  const toggleSection = (section: "lens" | "coating") => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  return (
    <div className="space-y-3">
      {/* Lens Type Selector */}
      <div className="rounded-md border">
        <div 
          className="p-2.5 font-medium border-b bg-muted/40 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("lens")}
        >
          <span>اختر نوع العدسة</span>
          {selectedLens && (
            <span className="text-sm text-primary">{selectedLens.name} - {selectedLens.price.toFixed(2)} د.ك</span>
          )}
        </div>
        
        {expandedSection === "lens" && (
          <>
            <div className="p-2">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر نوع العدسة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">النظر البعيد</SelectItem>
                  <SelectItem value="reading">القراءة</SelectItem>
                  <SelectItem value="progressive">التقدمية</SelectItem>
                  <SelectItem value="bifocal">ثنائية البؤرة</SelectItem>
                  <SelectItem value="sunglasses">الشمسية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <ScrollArea className="h-[140px]">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 p-2">
                {lensTypesByCategory[activeTab as keyof typeof lensTypesByCategory].map((lens) => (
                  <Card 
                    key={lens.id} 
                    className={`cursor-pointer transition-all border-[1px] hover:border-primary shadow-sm ${
                      isLensSelected(lens) ? "bg-primary/10 border-primary" : "bg-background"
                    }`}
                    onClick={() => onSelectLens(isLensSelected(lens) ? null : lens)}
                  >
                    <CardContent className="p-1.5">
                      <div className="flex items-center justify-between gap-1 text-sm">
                        <div className="font-medium truncate">{lens.name}</div>
                        <div className="whitespace-nowrap text-xs font-semibold">{lens.price.toFixed(2)} د.ك</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {lensTypesByCategory[activeTab as keyof typeof lensTypesByCategory].length === 0 && (
                  <p className="col-span-3 text-center p-2 text-muted-foreground text-sm">
                    لا توجد عدسات في هذه الفئة
                  </p>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </div>
      
      {/* Coating Selector */}
      <div className="rounded-md border">
        <div 
          className="p-2.5 font-medium border-b bg-muted/40 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("coating")}
        >
          <span>اختر الطلاءات</span>
          {selectedCoatings.length > 0 && (
            <span className="text-sm text-primary">{selectedCoatings.length} طلاء محدد</span>
          )}
        </div>
        
        {expandedSection === "coating" && (
          <ScrollArea className="h-[140px]">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 p-2">
              {lensCoatings.map((coating) => (
                <Card 
                  key={coating.id} 
                  className={`cursor-pointer transition-all border-[1px] hover:border-primary shadow-sm ${
                    isCoatingSelected(coating) ? "bg-primary/10 border-primary" : "bg-background"
                  }`}
                  onClick={() => toggleCoating(coating)}
                >
                  <CardContent className="p-1.5">
                    <div className="flex items-center justify-between gap-1 text-sm">
                      <div className="font-medium truncate">{coating.name}</div>
                      <div className="whitespace-nowrap text-xs font-semibold">{coating.price.toFixed(2)} د.ك</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {lensCoatings.length === 0 && (
                <p className="col-span-3 text-center p-2 text-muted-foreground text-sm">
                  لا توجد طلاءات متاحة
                </p>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
      
      {/* Selected Items Summary */}
      {(selectedLens || selectedCoatings.length > 0) && (
        <div className="rounded-md border p-2 bg-muted/10">
          {selectedLens && (
            <div className="flex justify-between items-center text-sm mb-1">
              <div>
                <span className="font-medium text-muted-foreground">العدسة:</span>
                <span className="ml-2">{selectedLens.name} - {selectedLens.price.toFixed(2)} د.ك</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => onSelectLens(null)}
              >
                <X size={14} />
              </Button>
            </div>
          )}
          
          {selectedCoatings.length > 0 && (
            <>
              {selectedLens && <div className="border-t my-1"></div>}
              <div className="text-sm">
                <span className="font-medium text-muted-foreground">الطلاءات المختارة:</span>
                {selectedCoatings.map((coating) => (
                  <div key={coating.id} className="flex justify-between items-center mt-1">
                    <span>{coating.name} - {coating.price.toFixed(2)} د.ك</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => toggleCoating(coating)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
