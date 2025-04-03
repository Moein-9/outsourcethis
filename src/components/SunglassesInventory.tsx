
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Trash2, Edit2, Save, X, Sunglasses, Package } from "lucide-react";

export const SunglassesInventory: React.FC = () => {
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  const frames = useInventoryStore((state) => state.frames);
  const addFrame = useInventoryStore((state) => state.addFrame);
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  const [searchTerm, setSearchTerm] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newQty, setNewQty] = useState("");
  
  // Filter for sunglasses
  const sunglassesFrames = frames.filter(frame => frame.isSunglasses);
  
  // Filter based on search term
  const filteredSunglasses = searchTerm
    ? sunglassesFrames.filter(
        (frame) =>
          frame.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          frame.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          frame.color.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : sunglassesFrames;
  
  const handleAddSunglasses = () => {
    if (!newBrand || !newModel || !newColor || !newPrice || !newQty) {
      toast.error(t('pleaseCompleteAllFieldsError'));
      return;
    }
    
    const price = parseFloat(newPrice);
    const qty = parseInt(newQty);
    
    if (isNaN(price) || price <= 0) {
      toast.error(t('invalidPriceError'));
      return;
    }
    
    if (isNaN(qty) || qty <= 0) {
      toast.error(t('invalidQuantityError'));
      return;
    }
    
    addFrame({
      brand: newBrand,
      model: newModel,
      color: newColor,
      size: newSize,
      price,
      qty,
      isSunglasses: true
    });
    
    // Reset form fields
    setNewBrand("");
    setNewModel("");
    setNewColor("");
    setNewSize("");
    setNewPrice("");
    setNewQty("");
    
    toast.success(t('sunglassesAddedSuccess'));
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory">
            <Package className="w-4 h-4 mr-2" />
            {t('inventory')}
          </TabsTrigger>
          <TabsTrigger value="addNew">
            <Plus className="w-4 h-4 mr-2" />
            {t('addNew')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 items-end">
            <div className="w-full sm:w-2/3">
              <Label htmlFor="searchSunglasses" className="text-muted-foreground mb-1 block">
                {t('searchSunglasses')}
              </Label>
              <Input
                id="searchSunglasses"
                placeholder={t('searchSunglassesPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={textAlignClass}
              />
            </div>
            <Button
              variant="outline"
              className="bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100 w-full sm:w-auto"
              onClick={() => setSearchTerm("")}
            >
              <Search className="w-4 h-4 mr-2" />
              {t('clearSearch')}
            </Button>
          </div>
          
          {filteredSunglasses.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-2 text-left border">{t('brand')}</th>
                      <th className="p-2 text-left border">{t('model')}</th>
                      <th className="p-2 text-left border">{t('color')}</th>
                      <th className="p-2 text-left border">{t('size')}</th>
                      <th className="p-2 text-left border">{t('price')} ({t('kwd')})</th>
                      <th className="p-2 text-left border">{t('quantity')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSunglasses.map((frame) => (
                      <tr key={frame.frameId} className="hover:bg-muted/30">
                        <td className="p-2 border">{frame.brand}</td>
                        <td className="p-2 border">{frame.model}</td>
                        <td className="p-2 border">{frame.color}</td>
                        <td className="p-2 border">{frame.size}</td>
                        <td className="p-2 border">{frame.price.toFixed(2)}</td>
                        <td className="p-2 border">{frame.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md bg-muted/10">
              <Sunglasses className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">
                {searchTerm ? t('noSunglassesFound') : t('noSunglassesInInventory')}
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="addNew" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('addNewSunglasses')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="brand">{t('brand')}</Label>
                    <Input
                      id="brand"
                      placeholder={t('enterBrand')}
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className={textAlignClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="model">{t('model')}</Label>
                    <Input
                      id="model"
                      placeholder={t('enterModel')}
                      value={newModel}
                      onChange={(e) => setNewModel(e.target.value)}
                      className={textAlignClass}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="color">{t('color')}</Label>
                    <Input
                      id="color"
                      placeholder={t('enterColor')}
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className={textAlignClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="size">{t('size')}</Label>
                    <Input
                      id="size"
                      placeholder={t('enterSize')}
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      className={textAlignClass}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="price">{t('price')} ({t('kwd')})</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className={textAlignClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="quantity">{t('quantity')}</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="1"
                      value={newQty}
                      onChange={(e) => setNewQty(e.target.value)}
                      className={textAlignClass}
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleAddSunglasses}
                  className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('addSunglasses')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
