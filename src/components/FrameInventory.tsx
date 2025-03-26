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
  Printer 
} from "lucide-react";
import { FrameLabelTemplate, usePrintLabel } from "./FrameLabelTemplate";
import { useLanguageStore } from "@/store/languageStore";

// Frame Item Component
const FrameItemCard = ({ frame, index, onPrintLabel }: { 
  frame: FrameItem; 
  index: number;
  onPrintLabel: (frameId: string) => void;
}) => {
  const { t, language } = useLanguageStore();
  
  return (
    <Card key={index} className="overflow-hidden hover:shadow-md transition-all duration-200 border-gray-200">
      <CardHeader className="p-3 bg-gray-50 border-b flex flex-row justify-between items-start">
        <div className="flex items-start gap-2">
          <Glasses className="h-5 w-5 text-indigo-600 mt-0.5" />
          <div>
            <div className="font-bold text-base">{frame.brand} - {frame.model}</div>
            <div className="text-sm font-medium mt-0.5">{frame.price.toFixed(2)} KWD</div>
          </div>
        </div>
        <Badge variant="destructive" className="text-xs rounded-full">
          {language === 'ar' ? `في المخزون:${frame.qty}` : `In Stock: ${frame.qty}`}
        </Badge>
      </CardHeader>
      <CardContent className="p-3 pt-2 text-sm">
        <div className="flex justify-between py-1 border-b border-gray-100">
          <span className="text-blue-500">{t('color')}:</span>
          <span>{frame.color || "-"}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-blue-500">{t('size')}:</span>
          <span>{frame.size || "-"}</span>
        </div>
      </CardContent>
      <CardFooter className="p-0 border-t">
        <div className="grid grid-cols-3 w-full divide-x divide-x-reverse">
          <Button variant="ghost" className="rounded-none h-10 text-blue-600">
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
  
  const [frameBrand, setFrameBrand] = useState("");
  const [frameModel, setFrameModel] = useState("");
  const [frameColor, setFrameColor] = useState("");
  const [frameSize, setFrameSize] = useState("");
  const [framePrice, setFramePrice] = useState("");
  const [frameQty, setFrameQty] = useState("1");
  
  const handleFrameSearch = () => {
    if (!frameSearchTerm.trim()) {
      setSearchResults(frames);
      return;
    }
    
    const results = searchFrames(frameSearchTerm);
    setSearchResults(results);
    
    if (results.length === 0) {
      toast.info(t('noFramesMatchingSearch'));
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
    
    toast.success(t("frameAddedSuccessfully", { brand: frameBrand, model: frameModel }));
    
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={frameSearchTerm}
              onChange={(e) => setFrameSearchTerm(e.target.value)}
              placeholder={t('searchForFrame')}
              className="pl-9 w-full"
              onKeyDown={(e) => e.key === 'Enter' && handleFrameSearch()}
            />
          </div>
          <Button onClick={handleFrameSearch} variant="secondary" className="shrink-0">
            <Search className="h-4 w-4 mr-1" /> {t('search')}
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsLabelDialogOpen(true)}
            className="shrink-0"
          >
            <Tag className="h-4 w-4 mr-1" /> {t('printLabels')}
          </Button>
          
          <Dialog open={isAddFrameDialogOpen} onOpenChange={setIsAddFrameDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0">
                <Plus className="h-4 w-4 mr-1" /> {t('addNewFrame')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t('addNewFrameTitle')}</DialogTitle>
                <DialogDescription>
                  {t('addNewFrameDescription')}
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
                      placeholder={t('brandExample')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frameModel">{t('model')}</Label>
                    <Input
                      id="frameModel"
                      value={frameModel}
                      onChange={(e) => setFrameModel(e.target.value)}
                      placeholder={t('modelExample')}
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
                      placeholder={t('colorExample')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frameSize">{t('size')}</Label>
                    <Input
                      id="frameSize"
                      value={frameSize}
                      onChange={(e) => setFrameSize(e.target.value)}
                      placeholder={t('sizeExample')}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="framePrice">{t('price')} (KWD)</Label>
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
                    <Label htmlFor="frameQty">{t('quantity')}</Label>
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
                  {t('cancel')}
                </Button>
                <Button onClick={handleAddFrame}>
                  <Save className="h-4 w-4 mr-1" /> {t('saveFrame')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((frame, index) => (
            <FrameItemCard 
              key={frame.frameId} 
              frame={frame} 
              index={index} 
              onPrintLabel={printSingleLabel}
            />
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-1">{t('noFramesFound')}</h3>
          <p className="text-muted-foreground mb-4">
            {t('noFramesMatchingSearch')}
          </p>
          <Button variant="outline" onClick={() => {
            setFrameSearchTerm("");
            setSearchResults(frames);
          }}>
            {t('showAllFrames')}
          </Button>
        </div>
      )}
      
      <Dialog open={isLabelDialogOpen} onOpenChange={setIsLabelDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{t('printFrameLabels')}</DialogTitle>
            <DialogDescription>
              {t('selectFramesForLabels')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto">
            <FrameLabelTemplate />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLabelDialogOpen(false)}>
              {t('close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
