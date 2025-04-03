
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";

interface AddFrameFormProps {
  onFrameAdded: (frame: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
    isSunglasses?: boolean;
  }) => void;
}

export const AddFrameForm: React.FC<AddFrameFormProps> = ({ onFrameAdded }) => {
  const { t, language } = useLanguageStore();
  const addFrame = useInventoryStore((state) => state.addFrame);
  
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newQty, setNewQty] = useState("1");
  const [isSunglasses, setIsSunglasses] = useState(false);
  
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  const handleAddNewFrame = () => {
    if (!newBrand || !newModel || !newColor || !newPrice) {
      toast(t('frameDetailsError'));
      return;
    }
    
    const price = parseFloat(newPrice);
    const qty = parseInt(newQty);
    
    if (isNaN(price) || price <= 0) {
      toast(t('priceError'));
      return;
    }
    
    if (isNaN(qty) || qty <= 0) {
      toast(t('quantityError'));
      return;
    }
    
    addFrame({
      brand: newBrand,
      model: newModel,
      color: newColor,
      size: newSize,
      price,
      qty,
      isSunglasses
    });
    
    const newFrameData = {
      brand: newBrand,
      model: newModel,
      color: newColor,
      size: newSize,
      price,
      isSunglasses
    };
    
    onFrameAdded(newFrameData);
    
    setNewBrand("");
    setNewModel("");
    setNewColor("");
    setNewSize("");
    setNewPrice("");
    setNewQty("1");
    setIsSunglasses(false);
    
    toast(t('frameAddedSuccess'));
  };

  return (
    <div className="p-4 border rounded-lg mt-2 bg-amber-50/30 border-amber-200/50">
      <h4 className={`font-semibold mb-3 text-amber-800 ${textAlignClass}`}>{t('newFrameDetails')}</h4>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="newBrand" className="text-muted-foreground">{t('brand')}:</Label>
            <Input
              id="newBrand"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              className={textAlignClass}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="newModel" className="text-muted-foreground">{t('model')}:</Label>
            <Input
              id="newModel"
              value={newModel}
              onChange={(e) => setNewModel(e.target.value)}
              className={textAlignClass}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="newColor" className="text-muted-foreground">{t('color')}:</Label>
            <Input
              id="newColor"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className={textAlignClass}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="newSize" className="text-muted-foreground">{t('size')}:</Label>
            <Input
              id="newSize"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder={t('searchExample')}
              className={textAlignClass}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="newPrice" className="text-muted-foreground">{t('price')} ({t('kwd')}):</Label>
            <Input
              id="newPrice"
              type="number"
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className={textAlignClass}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="newQty" className="text-muted-foreground">{t('quantity')} ({t('pieces')}):</Label>
            <Input
              id="newQty"
              type="number"
              step="1"
              value={newQty}
              onChange={(e) => setNewQty(e.target.value)}
              className={textAlignClass}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox 
            id="isSunglasses" 
            checked={isSunglasses} 
            onCheckedChange={(checked) => setIsSunglasses(checked === true)}
          />
          <Label htmlFor="isSunglasses" className="cursor-pointer">
            {t('isSunglasses')}
          </Label>
        </div>
        <Button 
          onClick={handleAddNewFrame} 
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        >
          {t('saveFrame')}
        </Button>
      </div>
    </div>
  );
};
