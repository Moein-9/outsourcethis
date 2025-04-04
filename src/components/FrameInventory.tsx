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
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Glasses, 
  Package, 
  Edit, 
  Copy, 
  Save, 
  Tag, 
  QrCode,
  Printer,
  FileUp 
} from "lucide-react";
import { FrameLabelTemplate, usePrintLabel } from "./FrameLabelTemplate";
import { useLanguageStore } from "@/store/languageStore";
import { ImportFramesDialog } from "./ImportFramesDialog";

const FrameItemCard = ({ frame, index, onPrintLabel }: { 
  frame: FrameItem; 
  index: number;
  onPrintLabel: (frameId: string) => void;
}) => {
  const { t, language } = useLanguageStore();
  
  const getBrandColor = (brand: string): string => {
    const colors = [
      'bg-blue-50 border-blue-200 text-blue-800',
      'bg-purple-50 border-purple-200 text-purple-800',
      'bg-teal-50 border-teal-200 text-teal-800',
      'bg-amber-50 border-amber-200 text-amber-800',
      'bg-pink-50 border-pink-200 text-pink-800',
      'bg-indigo-50 border-indigo-200 text-indigo-800',
      'bg-emerald-50 border-emerald-200 text-emerald-800'
    ];
    
    let hash = 0;
    for (let i = 0; i < brand.length; i++) {
      hash = brand.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  const colorClass = getBrandColor(frame.brand);
  const [bgClass, borderClass, textClass] = colorClass.split(' ');
  
  return (
    <Card key={index} className={`overflow-hidden hover:shadow-md transition-all duration-200 border-gray-200 border ${bgClass.replace('bg-', 'bg-opacity-30 bg-')}`}>
      <CardHeader className={`p-3 ${bgClass} ${borderClass} border-b flex flex-row justify-between items-start`}>
        <div className="flex items-start gap-2">
          <Glasses className={`h-5 w-5 ${textClass.replace('text-', 'text-')} mt-0.5`} />
          <div>
            <div className="font-bold text-base">{frame.brand} - {frame.model}</div>
            <div className="text-sm font-medium mt-0.5">{frame.price.toFixed(2)} KWD</div>
          </div>
        </div>
        <Badge variant={frame.qty > 5 ? "outline" : "destructive"} className={`text-xs rounded-full ${frame.qty > 5 ? textClass : ''}`}>
          {language === 'ar' ? `في المخزون: ${frame.qty}` : `In Stock: ${frame.qty}`}
        </Badge>
      </CardHeader>
      <CardContent className="p-3 pt-2 text-sm">
        <div className="flex justify-between py-1 border-b border-gray-100">
          <span className={textClass}>{t('color')}:</span>
          <span>{frame.color || "-"}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className={textClass}>{t('size')}:</span>
          <span>{frame.size || "-"}</span>
        </div>
      </CardContent>
      <CardFooter className="p-0 border-t">
        <div className="grid grid-cols-3 w-full divide-x divide-x-reverse">
          <Button variant="ghost" className={`rounded-none h-10 ${textClass}`}>
            <Edit className="h-4 w-4 mr-1" /> {t('edit')}
          </Button>
          <Button variant="ghost" className="rounded-none h-10 text-amber-600">
            <Copy className="h-4 w-4 mr-1" /> {t('copy')}
          </Button>
          <Button 
            variant="ghost" 
            className="rounded-none h-10 text-green-600"
            onClick={(e) => {
              e.stopPropagation();
              onPrintLabel(frame.frameId);
            }}
          >
            <QrCode className="h-4 w-4 mr-1" /> {t('print')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export const FrameInventory: React.FC = () => {
  const { frames, addFrame, searchFrames } = useInventoryStore();
  const { printSingleLabel } = usePrintLabel();
  const { t, language } = useLanguageStore();
  
  const [frameSearchTerm, setFrameSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchFrames>>([]);
  const [isAddFrameDialogOpen, setIsAddFrameDialogOpen] = useState(false);
  const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  
  const [frameBrand, setFrameBrand] = useState("");
  const [frameModel, setFrameModel] = useState("");
  const [frameColor, setFrameColor] = useState("");
  const [frameSize, setFrameSize] = useState("");
  const [framePrice, setFramePrice] = useState("");
  const [frameQty, setFrameQty] = useState("1");
  
  const groupedByBrand = React.useMemo(() => {
    const grouped: Record<string, FrameItem[]> = {};
    
    searchResults.forEach(frame => {
      if (!grouped[frame.brand]) {
        grouped[frame.brand] = [];
      }
      grouped[frame.brand].push(frame);
    });
    
    return Object.fromEntries(
      Object.entries(grouped).sort(([brandA], [brandB]) => brandA.localeCompare(brandB))
    );
  }, [searchResults]);
  
  const handleFrameSearch = () => {
    if (!frameSearchTerm.trim()) {
      setSearchResults(frames);
      return;
    }
    
    const results = searchFrames(frameSearchTerm);
    setSearchResults(results);
    
    if (results.length === 0) {
      toast(t('noFramesMatchingSearch'));
    }
  };
  
  const handleAddFrame = () => {
    if (!frameBrand || !frameModel || !frameColor || !framePrice) {
      toast.error(t("pleaseEnterCompleteFrameDetails"));
      return;
    }
    
    const price = parseFloat(framePrice);
    const qty = parseInt(frameQty);
    
    if (isNaN(price) || price <= 0) {
      toast.error(t("pleaseEnterValidPrice"));
      return;
    }
    
    if (isNaN(qty) || qty <= 0) {
      toast.error(t("pleaseEnterValidQuantity"));
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
    
    toast.success(t("frameAddedSuccessfully"));
    
    setFrameBrand("");
    setFrameModel("");
    setFrameColor("");
    setFrameSize("");
    setFramePrice("");
    setFrameQty("1");
    setIsAddFrameDialogOpen(false);
    
    setSearchResults(frames);
  };
  
  useEffect(() => {
    setSearchResults(frames);
  }, [frames]);
  
  const isRtl = language === 'ar';
  const dirClass = isRtl ? 'rtl' : 'ltr';
  
  return (
    <div className={`space-y-6 ${dirClass}`}>
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
            <Input
              value={frameSearchTerm}
              onChange={(e) => setFrameSearchTerm(e.target.value)}
              placeholder={isRtl ? "بحث عن إطار" : "Search for frame"}
              className={`${isRtl ? 'pr-9 text-right' : 'pl-9 text-left'} w-full`}
              onKeyDown={(e) => e.key === 'Enter' && handleFrameSearch()}
            />
          </div>
          <Button onClick={handleFrameSearch} variant="secondary" className="shrink-0">
            <Search className={`h-4 w-4 ${isRtl ? 'ml-1' : 'mr-1'}`} /> {t('search')}
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsLabelDialogOpen(true)}
            className="shrink-0"
          >
            <Tag className={`h-4 w-4 ${isRtl ? 'ml-1' : 'mr-1'}`} /> 
            {isRtl ? "طباعة الملصقات" : "Print Labels"}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsImportDialogOpen(true)}
            className="shrink-0"
          >
            <FileUp className={`h-4 w-4 ${isRtl ? 'ml-1' : 'mr-1'}`} />
            {isRtl ? "استيراد الإطارات" : "Import Frames"}
          </Button>
          
          <Dialog open={isAddFrameDialogOpen} onOpenChange={setIsAddFrameDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0">
                <Plus className={`h-4 w-4 ${isRtl ? 'ml-1' : 'mr-1'}`} /> 
                {isRtl ? "إضافة إطار جديد" : "Add New Frame"}
              </Button>
            </DialogTrigger>
            <DialogContent className={`max-w-md ${dirClass}`}>
              <DialogHeader>
                <DialogTitle>{isRtl ? "إضافة إطار جديد" : "Add New Frame"}</DialogTitle>
                <DialogDescription>
                  {isRtl ? "أدخل بيانات الإطار الجديد لإضافته إلى المخزون" : "Enter the new frame details to add it to inventory"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frameBrand">{t('brand')}</Label>
                    <Input
                      id="frameBrand"
                      value={frameBrand}
                      onChange={(e) => setFrameBrand(e.target.value)}
                      placeholder={isRtl ? "مثال: ريبان" : "Example: RayBan"}
                      className={isRtl ? "text-right" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frameModel">{t('model')}</Label>
                    <Input
                      id="frameModel"
                      value={frameModel}
                      onChange={(e) => setFrameModel(e.target.value)}
                      placeholder={isRtl ? "مثال: واي فيرر" : "Example: Wayfarer"}
                      className={isRtl ? "text-right" : ""}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frameColor">{t('color')}</Label>
                    <Input
                      id="frameColor"
                      value={frameColor}
                      onChange={(e) => setFrameColor(e.target.value)}
                      placeholder={isRtl ? "مثال: أسود" : "Example: Black"}
                      className={isRtl ? "text-right" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frameSize">{t('size')}</Label>
                    <Input
                      id="frameSize"
                      value={frameSize}
                      onChange={(e) => setFrameSize(e.target.value)}
                      placeholder={isRtl ? "مثال: 52-18-145" : "Example: 52-18-145"}
                      className={isRtl ? "text-right" : ""}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="framePrice">{isRtl ? "السعر (د.ك)" : "Price (KWD)"}</Label>
                    <Input
                      id="framePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={framePrice}
                      onChange={(e) => setFramePrice(e.target.value)}
                      placeholder="0.00"
                      className={isRtl ? "text-right" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frameQty">{t('quantity')}</Label>
                    <Input
                      id="frameQty"
                      type="number"
                      step="1"
                      min="1"
                      value={frameQty}
                      onChange={(e) => setFrameQty(e.target.value)}
                      className={isRtl ? "text-right" : ""}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter className={isRtl ? "flex-row-reverse" : ""}>
                <Button variant="outline" onClick={() => setIsAddFrameDialogOpen(false)}>
                  {isRtl ? "إلغاء" : "Cancel"}
                </Button>
                <Button onClick={handleAddFrame}>
                  <Save className={`h-4 w-4 ${isRtl ? 'ml-1' : 'mr-1'}`} /> 
                  {isRtl ? "حفظ الإطار" : "Save Frame"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {Object.keys(groupedByBrand).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedByBrand).map(([brand, brandFrames]) => (
            <CollapsibleCard
              key={brand}
              title={`${brand} (${brandFrames.length})`} 
              defaultOpen={true}
              headerClassName="bg-gradient-to-r from-amber-50 to-amber-100"
              titleClassName="text-amber-800 font-medium flex items-center gap-2"
              contentClassName="p-4 bg-white"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brandFrames.map((frame, index) => (
                  <FrameItemCard
                    key={frame.frameId}
                    frame={frame}
                    index={index}
                    onPrintLabel={printSingleLabel}
                  />
                ))}
              </div>
            </CollapsibleCard>
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-1">{isRtl ? "لم يتم العثور على إطارات" : "No frames found"}</h3>
          <p className="text-muted-foreground mb-4">
            {isRtl ? "لم يتم العثور على إطارات مطابقة لمعايير البحث." : "No frames matching search criteria found."}
          </p>
          <Button variant="outline" onClick={() => {
            setFrameSearchTerm("");
            setSearchResults(frames);
          }}>
            {isRtl ? "عرض جميع الإطارات" : "Show all frames"}
          </Button>
        </div>
      )}
      
      <Dialog open={isLabelDialogOpen} onOpenChange={setIsLabelDialogOpen}>
        <DialogContent className={`max-w-5xl max-h-[90vh] ${dirClass}`}>
          <DialogHeader>
            <DialogTitle>{isRtl ? "طباعة ملصقات الإطارات" : "Print Frame Labels"}</DialogTitle>
            <DialogDescription>
              {isRtl ? "اختر الإطارات المراد طباعة ملصقات لها" : "Select frames for label printing"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto">
            <FrameLabelTemplate />
          </div>
          
          <DialogFooter className={isRtl ? "flex-row-reverse" : ""}>
            <Button variant="outline" onClick={() => setIsLabelDialogOpen(false)}>
              {isRtl ? "إغلاق" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImportFramesDialog 
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
      />
    </div>
  );
};
