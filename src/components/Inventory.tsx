
import React, { useState } from "react";
import { useInventoryStore } from "@/store/inventoryStore";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Inventory: React.FC = () => {
  const { frames, addFrame, searchFrames } = useInventoryStore();
  
  // Frame search states
  const [frameSearchTerm, setFrameSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchFrames>>([]);
  
  // New frame states
  const [frameBrand, setFrameBrand] = useState("");
  const [frameModel, setFrameModel] = useState("");
  const [frameColor, setFrameColor] = useState("");
  const [frameSize, setFrameSize] = useState("");
  const [framePrice, setFramePrice] = useState("");
  const [frameQty, setFrameQty] = useState("1");
  
  // Handle frame search
  const handleFrameSearch = () => {
    if (!frameSearchTerm.trim()) {
      toast({
        description: "الرجاء إدخال كلمة البحث.",
      });
      return;
    }
    
    const results = searchFrames(frameSearchTerm);
    setSearchResults(results);
    
    if (results.length === 0) {
      toast({
        description: "لم يتم العثور على إطارات.",
      });
    }
  };
  
  // Handle adding a new frame
  const handleAddFrame = () => {
    if (!frameBrand || !frameModel || !frameColor || !framePrice) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال تفاصيل الإطار كاملة.",
        variant: "destructive"
      });
      return;
    }
    
    const price = parseFloat(framePrice);
    const qty = parseInt(frameQty);
    
    if (isNaN(price) || price <= 0) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال سعر صحيح.",
        variant: "destructive"
      });
      return;
    }
    
    if (isNaN(qty) || qty <= 0) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال كمية صحيحة.",
        variant: "destructive"
      });
      return;
    }
    
    const frameId = addFrame({
      brand: frameBrand,
      model: frameModel,
      color: frameColor,
      size: frameSize,
      price,
      qty
    });
    
    toast({
      description: `تم إضافة الإطار بنجاح: ${frameBrand} ${frameModel}`,
    });
    
    // Reset form
    setFrameBrand("");
    setFrameModel("");
    setFrameColor("");
    setFrameSize("");
    setFramePrice("");
    setFrameQty("1");
  };
  
  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-primary text-center mb-4">إدارة المخزون</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Frames Management */}
        <div className="bg-card rounded-md p-4 border">
          <div className="text-lg font-semibold text-primary pb-2 mb-4 border-b border-primary">
            إدارة الإطارات (Frames)
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="searchFrameBox">البحث عن إطار (ماركة/موديل/لون/مقاس):</Label>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Input
                id="searchFrameBox"
                value={frameSearchTerm}
                onChange={(e) => setFrameSearchTerm(e.target.value)}
                placeholder="مثال: RayBan..."
              />
              <Button onClick={handleFrameSearch}>بحث</Button>
            </div>
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-4 border rounded-md">
              {searchResults.map((frame, index) => (
                <div 
                  key={index} 
                  className="p-3 border-b hover:bg-muted/20 cursor-pointer"
                >
                  Brand: {frame.brand}, Model: {frame.model}, Color: {frame.color}, 
                  Size: {frame.size}, Price: {frame.price.toFixed(2)} KWD, Qty: {frame.qty}
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 bg-white p-4 rounded-md border">
            <h4 className="font-semibold text-primary mb-4">إضافة إطار جديد</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="frameBrand">الماركة (Brand):</Label>
                <Input
                  id="frameBrand"
                  value={frameBrand}
                  onChange={(e) => setFrameBrand(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frameModel">رقم الموديل (Model #):</Label>
                <Input
                  id="frameModel"
                  value={frameModel}
                  onChange={(e) => setFrameModel(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frameColor">رمز اللون (Color Code):</Label>
                <Input
                  id="frameColor"
                  value={frameColor}
                  onChange={(e) => setFrameColor(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frameSize">المقاس (Size):</Label>
                <Input
                  id="frameSize"
                  value={frameSize}
                  onChange={(e) => setFrameSize(e.target.value)}
                  placeholder="مثال: 51-18-145"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="framePrice">السعر (KWD):</Label>
                <Input
                  id="framePrice"
                  type="number"
                  step="0.01"
                  value={framePrice}
                  onChange={(e) => setFramePrice(e.target.value)}
                  placeholder="مثال: 30.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frameQty">الكمية (Quantity):</Label>
                <Input
                  id="frameQty"
                  type="number"
                  step="1"
                  value={frameQty}
                  onChange={(e) => setFrameQty(e.target.value)}
                  placeholder="مثال: 10"
                />
              </div>
              
              <Button className="mt-2" onClick={handleAddFrame}>
                حفظ الإطار
              </Button>
            </div>
          </div>
        </div>
        
        {/* Optional: Contact Lenses Section */}
        <div className="bg-card rounded-md p-4 border">
          <div className="text-lg font-semibold text-primary pb-2 mb-4 border-b border-primary">
            إدارة العدسات اللاصقة (Contact Lenses)
          </div>
          
          <p className="text-muted-foreground">هنا يمكنك إضافة أو بحث عن عدسات لاصقة (قريباً).</p>
        </div>
      </div>
    </div>
  );
};
