
import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInventoryStore, FrameItem } from "@/store/inventoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Edit, Trash, Sun, Info } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const SunglassesInventory: React.FC = () => {
  const { t, language } = useLanguageStore();
  const { frames, addFrame, updateFrameQuantity, searchFrames } = useInventoryStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFrames, setFilteredFrames] = useState<FrameItem[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newFrame, setNewFrame] = useState({
    brand: "",
    model: "",
    color: "",
    size: "",
    price: 0,
    qty: 1,
    isSunglasses: true // Mark this frame as sunglasses
  });
  
  // Filter frames that are marked as sunglasses
  useEffect(() => {
    const results = searchFrames(searchQuery).filter(frame => frame.isSunglasses === true);
    setFilteredFrames(results);
  }, [searchQuery, frames, searchFrames]);
  
  const handleAddFrame = () => {
    if (!newFrame.brand || !newFrame.model) {
      toast.error(language === 'ar' ? "الرجاء إدخال الماركة والموديل" : "Please enter brand and model");
      return;
    }
    
    if (newFrame.price <= 0) {
      toast.error(language === 'ar' ? "الرجاء إدخال سعر صحيح" : "Please enter a valid price");
      return;
    }
    
    addFrame(newFrame);
    
    toast.success(
      language === 'ar' 
        ? "تمت إضافة النظارة الشمسية بنجاح" 
        : "Sunglasses added successfully"
    );
    
    setNewFrame({
      brand: "",
      model: "",
      color: "",
      size: "",
      price: 0,
      qty: 1,
      isSunglasses: true
    });
    
    setShowAddDialog(false);
  };
  
  const handleQuantityChange = (frameId: string, newQty: number) => {
    if (newQty < 0) return;
    updateFrameQuantity(frameId, newQty);
  };
  
  const directionClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  return (
    <div className="space-y-4" dir={directionClass}>
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={language === 'ar' ? "البحث عن نظارات شمسية..." : "Search sunglasses..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 w-full md:w-80 ${textAlignClass}`}
          />
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              {language === 'ar' ? "إضافة نظارة شمسية" : "Add Sunglasses"}
            </Button>
          </DialogTrigger>
          <DialogContent className="md:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-orange-500" />
                {language === 'ar' ? "إضافة نظارة شمسية جديدة" : "Add New Sunglasses"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">
                    {language === 'ar' ? "الماركة" : "Brand"}
                  </Label>
                  <Input
                    id="brand"
                    value={newFrame.brand}
                    onChange={(e) => setNewFrame({...newFrame, brand: e.target.value})}
                    className={textAlignClass}
                    placeholder="Ray-Ban, Gucci..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">
                    {language === 'ar' ? "الموديل" : "Model"}
                  </Label>
                  <Input
                    id="model"
                    value={newFrame.model}
                    onChange={(e) => setNewFrame({...newFrame, model: e.target.value})}
                    className={textAlignClass}
                    placeholder="Wayfarer, Aviator..."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">
                    {language === 'ar' ? "اللون" : "Color"}
                  </Label>
                  <Input
                    id="color"
                    value={newFrame.color}
                    onChange={(e) => setNewFrame({...newFrame, color: e.target.value})}
                    className={textAlignClass}
                    placeholder="Black, Tortoise..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">
                    {language === 'ar' ? "الحجم" : "Size"}
                  </Label>
                  <Input
                    id="size"
                    value={newFrame.size}
                    onChange={(e) => setNewFrame({...newFrame, size: e.target.value})}
                    className={textAlignClass}
                    placeholder="52-18-140"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    {language === 'ar' ? "السعر" : "Price"}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={newFrame.price}
                    onChange={(e) => setNewFrame({...newFrame, price: parseFloat(e.target.value) || 0})}
                    className={textAlignClass}
                    placeholder="0.000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qty">
                    {language === 'ar' ? "الكمية" : "Quantity"}
                  </Label>
                  <Input
                    id="qty"
                    type="number"
                    value={newFrame.qty}
                    onChange={(e) => setNewFrame({...newFrame, qty: parseInt(e.target.value) || 0})}
                    className={textAlignClass}
                    placeholder="1"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                {language === 'ar' ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white" 
                onClick={handleAddFrame}
              >
                {language === 'ar' ? "إضافة" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {filteredFrames.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/20">
          <CardContent className="py-10 flex flex-col items-center justify-center gap-4">
            <div className="bg-orange-100 rounded-full p-3">
              <Sun className="h-8 w-8 text-orange-600" />
            </div>
            <div className="text-center space-y-1">
              <CardTitle className="text-lg">
                {language === 'ar' ? "لا توجد نظارات شمسية" : "No Sunglasses Found"}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {language === 'ar' 
                  ? "ابدأ بإضافة نظارات شمسية إلى المخزون الخاص بك"
                  : "Get started by adding sunglasses to your inventory"}
              </p>
            </div>
            <Button 
              variant="outline" 
              className="mt-2 border-orange-200 text-orange-700 hover:bg-orange-50"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {language === 'ar' ? "إضافة نظارة شمسية" : "Add Sunglasses"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-orange-50">
              <TableRow>
                <TableHead className={textAlignClass}>
                  {language === 'ar' ? "الماركة" : "Brand"}
                </TableHead>
                <TableHead className={textAlignClass}>
                  {language === 'ar' ? "الموديل" : "Model"}
                </TableHead>
                <TableHead className={textAlignClass}>
                  {language === 'ar' ? "اللون" : "Color"}
                </TableHead>
                <TableHead className={textAlignClass}>
                  {language === 'ar' ? "الحجم" : "Size"}
                </TableHead>
                <TableHead className={textAlignClass}>
                  {language === 'ar' ? "السعر" : "Price"}
                </TableHead>
                <TableHead className={textAlignClass}>
                  {language === 'ar' ? "الكمية" : "Quantity"}
                </TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFrames.map((frame) => (
                <TableRow key={frame.frameId}>
                  <TableCell className={textAlignClass}>{frame.brand}</TableCell>
                  <TableCell className={textAlignClass}>{frame.model}</TableCell>
                  <TableCell className={textAlignClass}>{frame.color}</TableCell>
                  <TableCell className={textAlignClass}>{frame.size}</TableCell>
                  <TableCell className={textAlignClass}>{frame.price.toFixed(3)} KWD</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(frame.frameId, frame.qty - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{frame.qty}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(frame.frameId, frame.qty + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div className="flex justify-end">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4" />
          <span>
            {language === 'ar' 
              ? "النظارات الشمسية متاحة لإضافتها إلى الفواتير"
              : "Sunglasses are available to add to invoices"}
          </span>
        </div>
      </div>
    </div>
  );
};
