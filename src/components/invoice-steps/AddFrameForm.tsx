
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AddFrameFormProps {
  onFrameAdded: (frame: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  }) => void;
  isSunglasses?: boolean;
}

export const AddFrameForm: React.FC<AddFrameFormProps> = ({ 
  onFrameAdded,
  isSunglasses = false 
}) => {
  const { language } = useLanguageStore();
  const { addFrame } = useInventoryStore();
  
  const [frameData, setFrameData] = useState({
    brand: "",
    model: "",
    color: "",
    size: "",
    price: 0,
    qty: 1,
    isSunglasses: isSunglasses // Use the prop to set the type
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!frameData.brand || !frameData.model) {
      toast.error(language === 'ar' ? "الرجاء إدخال الماركة والموديل" : "Please enter brand and model");
      return;
    }
    
    if (frameData.price <= 0) {
      toast.error(language === 'ar' ? "الرجاء إدخال سعر صحيح" : "Please enter a valid price");
      return;
    }
    
    // Add the frame to inventory
    const frameId = addFrame({
      brand: frameData.brand,
      model: frameData.model,
      color: frameData.color,
      size: frameData.size,
      price: frameData.price,
      qty: frameData.qty,
      isSunglasses: frameData.isSunglasses
    });
    
    // Notify the parent component
    onFrameAdded({
      brand: frameData.brand,
      model: frameData.model,
      color: frameData.color,
      size: frameData.size,
      price: frameData.price
    });
    
    // Show a success message
    toast.success(
      language === 'ar' 
        ? `تمت إضافة ${frameData.isSunglasses ? 'النظارة الشمسية' : 'الإطار'} بنجاح`
        : `${frameData.isSunglasses ? 'Sunglasses' : 'Frame'} added successfully`
    );
  };
  
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  return (
    <Card className="mt-4 border-dashed">
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand" className={textAlignClass}>
                {language === 'ar' ? "الماركة" : "Brand"}
              </Label>
              <Input
                id="brand"
                placeholder={language === 'ar' ? "أدخل الماركة" : "Enter brand"}
                value={frameData.brand}
                onChange={(e) => setFrameData({ ...frameData, brand: e.target.value })}
                className={textAlignClass}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model" className={textAlignClass}>
                {language === 'ar' ? "الموديل" : "Model"}
              </Label>
              <Input
                id="model"
                placeholder={language === 'ar' ? "أدخل الموديل" : "Enter model"}
                value={frameData.model}
                onChange={(e) => setFrameData({ ...frameData, model: e.target.value })}
                className={textAlignClass}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color" className={textAlignClass}>
                {language === 'ar' ? "اللون" : "Color"}
              </Label>
              <Input
                id="color"
                placeholder={language === 'ar' ? "أدخل اللون" : "Enter color"}
                value={frameData.color}
                onChange={(e) => setFrameData({ ...frameData, color: e.target.value })}
                className={textAlignClass}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="size" className={textAlignClass}>
                {language === 'ar' ? "المقاس" : "Size"}
              </Label>
              <Input
                id="size"
                placeholder={language === 'ar' ? "أدخل المقاس" : "Enter size"}
                value={frameData.size}
                onChange={(e) => setFrameData({ ...frameData, size: e.target.value })}
                className={textAlignClass}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className={textAlignClass}>
                {language === 'ar' ? "السعر" : "Price"}
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="0.000"
                value={frameData.price || ""}
                onChange={(e) => setFrameData({ ...frameData, price: parseFloat(e.target.value) || 0 })}
                className={textAlignClass}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="qty" className={textAlignClass}>
                {language === 'ar' ? "الكمية" : "Quantity"}
              </Label>
              <Input
                id="qty"
                type="number"
                placeholder="1"
                value={frameData.qty || ""}
                onChange={(e) => setFrameData({ ...frameData, qty: parseInt(e.target.value) || 1 })}
                className={textAlignClass}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit"
              className={isSunglasses ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              {language === 'ar' ? "إضافة" : "Add"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
