
import React, { useState, useEffect } from "react";
import { useInventoryStore, FrameItem } from "@/store/inventoryStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Glasses, Package, Edit, Copy, Save, Tag } from "lucide-react";
import { FrameLabelTemplate } from "./FrameLabelTemplate";

// Frame Item Component
const FrameItemCard = ({ frame, index }: { frame: FrameItem; index: number }) => {
  return (
    <Card key={index} className="overflow-hidden hover:shadow-md transition-all duration-200">
      <CardHeader className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Glasses className="h-4 w-4 text-indigo-600" />
              {frame.brand} - {frame.model}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              {frame.price.toFixed(2)} KWD
            </CardDescription>
          </div>
          <Badge variant={frame.qty > 5 ? "outline" : "destructive"} className="text-xs">
            {frame.qty} في المخزون
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">اللون:</span>
          <span className="font-medium">{frame.color}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">المقاس:</span>
          <span className="font-medium">{frame.size || "غير محدد"}</span>
        </div>
      </CardContent>
      <CardFooter className="p-0 border-t">
        <div className="grid grid-cols-2 w-full divide-x divide-x-reverse">
          <Button variant="ghost" className="rounded-none h-10 text-blue-600">
            <Edit className="h-4 w-4 mr-1" /> تعديل
          </Button>
          <Button variant="ghost" className="rounded-none h-10 text-amber-600">
            <Copy className="h-4 w-4 mr-1" /> نسخ
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export const FrameInventory: React.FC = () => {
  const { frames, addFrame, searchFrames } = useInventoryStore();
  
  // State variables
  const [frameSearchTerm, setFrameSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchFrames>>([]);
  const [isAddFrameDialogOpen, setIsAddFrameDialogOpen] = useState(false);
  const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false);
  
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
      setSearchResults(frames);
      return;
    }
    
    const results = searchFrames(frameSearchTerm);
    setSearchResults(results);
    
    if (results.length === 0) {
      toast.info("لم يتم العثور على إطارات مطابقة للبحث.");
    }
  };
  
  // Handle adding a new frame
  const handleAddFrame = () => {
    if (!frameBrand || !frameModel || !frameColor || !framePrice) {
      toast.error("الرجاء إدخال تفاصيل الإطار كاملة");
      return;
    }
    
    const price = parseFloat(framePrice);
    const qty = parseInt(frameQty);
    
    if (isNaN(price) || price <= 0) {
      toast.error("الرجاء إدخال سعر صحيح");
      return;
    }
    
    if (isNaN(qty) || qty <= 0) {
      toast.error("الرجاء إدخال كمية صحيحة");
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
    
    toast.success(`تم إضافة الإطار بنجاح: ${frameBrand} ${frameModel}`);
    
    // Reset form and close dialog
    setFrameBrand("");
    setFrameModel("");
    setFrameColor("");
    setFrameSize("");
    setFramePrice("");
    setFrameQty("1");
    setIsAddFrameDialogOpen(false);
    
    // Refresh search results
    setSearchResults(frames);
  };
  
  // Initialize search results
  useEffect(() => {
    setSearchResults(frames);
  }, [frames]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={frameSearchTerm}
              onChange={(e) => setFrameSearchTerm(e.target.value)}
              placeholder="البحث عن إطار (ماركة، موديل، لون...)"
              className="pl-9 w-full"
              onKeyDown={(e) => e.key === 'Enter' && handleFrameSearch()}
            />
          </div>
          <Button onClick={handleFrameSearch} variant="secondary" className="shrink-0">
            <Search className="h-4 w-4 mr-1" /> بحث
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsLabelDialogOpen(true)}
            className="shrink-0"
          >
            <Tag className="h-4 w-4 mr-1" /> طباعة البطاقات
          </Button>
          
          <Dialog open={isAddFrameDialogOpen} onOpenChange={setIsAddFrameDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0">
                <Plus className="h-4 w-4 mr-1" /> إضافة إطار جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>إضافة إطار جديد</DialogTitle>
                <DialogDescription>
                  أدخل تفاصيل الإطار الجديد لإضافته إلى المخزون
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frameBrand">الماركة</Label>
                    <Input
                      id="frameBrand"
                      value={frameBrand}
                      onChange={(e) => setFrameBrand(e.target.value)}
                      placeholder="مثال: RayBan"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frameModel">الموديل</Label>
                    <Input
                      id="frameModel"
                      value={frameModel}
                      onChange={(e) => setFrameModel(e.target.value)}
                      placeholder="مثال: RB3025"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frameColor">اللون</Label>
                    <Input
                      id="frameColor"
                      value={frameColor}
                      onChange={(e) => setFrameColor(e.target.value)}
                      placeholder="مثال: أسود"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frameSize">المقاس</Label>
                    <Input
                      id="frameSize"
                      value={frameSize}
                      onChange={(e) => setFrameSize(e.target.value)}
                      placeholder="مثال: 52-18-145"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="framePrice">السعر (KWD)</Label>
                    <Input
                      id="framePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={framePrice}
                      onChange={(e) => setFramePrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frameQty">الكمية</Label>
                    <Input
                      id="frameQty"
                      type="number"
                      step="1"
                      min="1"
                      value={frameQty}
                      onChange={(e) => setFrameQty(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddFrameDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleAddFrame}>
                  <Save className="h-4 w-4 mr-1" /> حفظ الإطار
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((frame, index) => (
            <FrameItemCard key={frame.frameId} frame={frame} index={index} />
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-1">لا توجد إطارات</h3>
          <p className="text-muted-foreground mb-4">
            لم يتم العثور على إطارات مطابقة للبحث.
          </p>
          <Button variant="outline" onClick={() => {
            setFrameSearchTerm("");
            setSearchResults(frames);
          }}>
            عرض جميع الإطارات
          </Button>
        </div>
      )}
      
      {/* Label Print Dialog */}
      <Dialog open={isLabelDialogOpen} onOpenChange={setIsLabelDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>طباعة بطاقات الإطارات</DialogTitle>
            <DialogDescription>
              حدد الإطارات التي تريد طباعة بطاقات لها
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto">
            <FrameLabelTemplate />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLabelDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
