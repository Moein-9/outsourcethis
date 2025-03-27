
import React, { useState, useEffect } from "react";
import { useInventoryStore, LensType, LensCoating } from "@/store/inventoryStore";
import { Card, CardContent } from "@/components/ui/card";
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

  // Get lens price safely (with a fallback to 0)
  const getLensPrice = (lens: LensType): number => {
    return lens.price !== undefined ? lens.price : 0;
  };

  // Category colors
  const categoryColors = {
    distance: "bg-blue-50 border-blue-200 text-blue-700",
    reading: "bg-green-50 border-green-200 text-green-700",
    progressive: "bg-purple-50 border-purple-200 text-purple-700",
    bifocal: "bg-amber-50 border-amber-200 text-amber-700",
    sunglasses: "bg-gray-50 border-gray-200 text-gray-700"
  };
  
  return (
    <div className="space-y-3">
      {/* Lens Type Selector */}
      <div className="rounded-md border shadow-sm">
        <div 
          className="p-2.5 font-medium border-b bg-gradient-to-r from-blue-50 to-purple-50 flex justify-between items-center cursor-pointer transition-colors hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
          onClick={() => toggleSection("lens")}
        >
          <span className="flex items-center gap-2 font-semibold text-blue-900">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            اختر نوع العدسة
          </span>
          {selectedLens && (
            <span className="text-sm font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              {selectedLens.name} - {getLensPrice(selectedLens).toFixed(2)} د.ك
            </span>
          )}
        </div>
        
        {expandedSection === "lens" && (
          <>
            <div className="p-3 bg-gradient-to-b from-blue-50/50 to-white">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full bg-white shadow-sm border-blue-200">
                  <SelectValue placeholder="اختر نوع العدسة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance" className="focus:bg-blue-50">النظر البعيد</SelectItem>
                  <SelectItem value="reading" className="focus:bg-green-50">القراءة</SelectItem>
                  <SelectItem value="progressive" className="focus:bg-purple-50">التقدمية</SelectItem>
                  <SelectItem value="bifocal" className="focus:bg-amber-50">ثنائية البؤرة</SelectItem>
                  <SelectItem value="sunglasses" className="focus:bg-gray-50">الشمسية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <ScrollArea className="h-[160px] bg-white">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2">
                {lensTypesByCategory[activeTab as keyof typeof lensTypesByCategory].map((lens) => (
                  <Card 
                    key={lens.id} 
                    className={`cursor-pointer transition-all border hover:shadow ${
                      isLensSelected(lens) 
                        ? `${categoryColors[activeTab as keyof typeof categoryColors]} border-2` 
                        : "bg-white hover:bg-blue-50/30"
                    }`}
                    onClick={() => onSelectLens(isLensSelected(lens) ? null : lens)}
                  >
                    <CardContent className="p-2 flex items-center justify-between">
                      <div className="font-medium truncate text-sm">{lens.name}</div>
                      <div className="whitespace-nowrap text-xs font-semibold rounded-full px-1.5 py-0.5 bg-white/80">
                        {getLensPrice(lens).toFixed(2)} د.ك
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
      <div className="rounded-md border shadow-sm">
        <div 
          className="p-2.5 font-medium border-b bg-gradient-to-r from-amber-50 to-orange-50 flex justify-between items-center cursor-pointer transition-colors hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100"
          onClick={() => toggleSection("coating")}
        >
          <span className="flex items-center gap-2 font-semibold text-amber-900">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            اختر الطلاءات
          </span>
          {selectedCoatings.length > 0 && (
            <span className="text-sm font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
              {selectedCoatings.length} طلاء محدد
            </span>
          )}
        </div>
        
        {expandedSection === "coating" && (
          <ScrollArea className="h-[160px] bg-gradient-to-b from-amber-50/30 to-white">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3">
              {lensCoatings.map((coating) => (
                <Card 
                  key={coating.id} 
                  className={`cursor-pointer transition-all border hover:shadow ${
                    isCoatingSelected(coating) 
                      ? "bg-amber-50 border-amber-200 border-2 text-amber-700" 
                      : "bg-white hover:bg-amber-50/30"
                  }`}
                  onClick={() => toggleCoating(coating)}
                >
                  <CardContent className="p-2 flex items-center justify-between">
                    <div className="font-medium truncate text-sm">{coating.name}</div>
                    <div className="whitespace-nowrap text-xs font-semibold rounded-full px-1.5 py-0.5 bg-white/80">
                      {coating.price.toFixed(2)} د.ك
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
        <div className="rounded-md border p-3 bg-gradient-to-b from-gray-50 to-white shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">الاختيارات الحالية</h3>
          {selectedLens && (
            <div className="flex justify-between items-center text-sm mb-2 bg-blue-50 p-2 rounded-md border border-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="font-medium">{selectedLens.name}</span>
                <span className="text-xs font-semibold bg-white px-1.5 py-0.5 rounded-full">{getLensPrice(selectedLens).toFixed(2)} د.ك</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 rounded-full hover:bg-blue-100 p-0"
                onClick={() => onSelectLens(null)}
              >
                <X size={12} />
              </Button>
            </div>
          )}
          
          {selectedCoatings.length > 0 && (
            <div className="space-y-1.5">
              {selectedCoatings.map((coating) => (
                <div key={coating.id} className="flex justify-between items-center text-sm bg-amber-50 p-2 rounded-md border border-amber-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="font-medium">{coating.name}</span>
                    <span className="text-xs font-semibold bg-white px-1.5 py-0.5 rounded-full">{coating.price.toFixed(2)} د.ك</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 rounded-full hover:bg-amber-100 p-0"
                    onClick={() => toggleCoating(coating)}
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
