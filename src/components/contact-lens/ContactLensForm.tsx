
import React from "react";
import { CustomSelect } from "@/components/ui/custom-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { ContactLensItem } from "@/store/inventoryStore";

// Common values for dropdowns
const COMMON_BC_VALUES = ["8.3", "8.4", "8.5", "8.6", "8.7", "8.8", "8.9", "9.0"];
const COMMON_DIAMETER_VALUES = ["13.8", "14.0", "14.2", "14.5", "14.8"];
const COMMON_BRANDS = ["Acuvue", "Air Optix", "Biofinty", "Bella", "FreshLook", "PureVision", "SofLens"];
const COMMON_TYPES = ["Daily", "Monthly", "Biweekly", "Yearly", "Color"];
const COMMON_COLORS = ["Clear", "Blue", "Green", "Brown", "Hazel", "Gray", "Honey"];

interface ContactLensFormProps {
  onSubmit: (data: Omit<ContactLensItem, "id">) => void;
  onCancel: () => void;
  initialValues?: Partial<ContactLensItem>;
  savedCustomBrands: string[];
  savedCustomTypes: string[];
  isEditing?: boolean;
}

export const ContactLensForm: React.FC<ContactLensFormProps> = ({
  onSubmit,
  onCancel,
  initialValues = {},
  savedCustomBrands,
  savedCustomTypes,
  isEditing = false,
}) => {
  const { language, t } = useLanguageStore();
  
  const [brand, setBrand] = React.useState(initialValues.brand || "");
  const [type, setType] = React.useState(initialValues.type || "");
  const [bc, setBc] = React.useState(initialValues.bc || "");
  const [diameter, setDiameter] = React.useState(initialValues.diameter || "");
  const [power, setPower] = React.useState(initialValues.power || "-0.00");
  const [color, setColor] = React.useState(initialValues.color || "");
  const [price, setPrice] = React.useState(initialValues.price?.toString() || "");
  const [qty, setQty] = React.useState(initialValues.qty?.toString() || "1");
  
  // Combine standard values with saved custom values
  const allBrands = [...COMMON_BRANDS, ...savedCustomBrands.filter(b => !COMMON_BRANDS.includes(b))];
  const allTypes = [...COMMON_TYPES, ...savedCustomTypes.filter(t => !COMMON_TYPES.includes(t))];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!brand || !type || !bc || !diameter || !price) {
      return; // Form validation will show errors
    }
    
    const parsedPrice = parseFloat(price);
    const parsedQty = parseInt(qty);
    
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return; // Invalid price
    }
    
    if (isNaN(parsedQty) || parsedQty <= 0) {
      return; // Invalid quantity
    }

    onSubmit({
      brand,
      type,
      bc,
      diameter,
      power,
      price: parsedPrice,
      qty: parsedQty,
      color: color || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomSelect
          label={language === 'ar' ? 'الماركة' : 'Brand'}
          options={allBrands}
          value={brand}
          onChange={setBrand}
          placeholder={language === 'ar' ? 'اختر الماركة' : 'Select brand'}
          customValuePlaceholder={language === 'ar' ? 'أدخل اسم الماركة' : 'Enter brand name'}
        />
        
        <CustomSelect
          label={language === 'ar' ? 'النوع' : 'Type'}
          options={allTypes}
          value={type}
          onChange={setType}
          placeholder={language === 'ar' ? 'اختر النوع' : 'Select type'}
          customValuePlaceholder={language === 'ar' ? 'أدخل النوع' : 'Enter type'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CustomSelect
          label="BC"
          options={COMMON_BC_VALUES}
          value={bc}
          onChange={setBc}
          placeholder={language === 'ar' ? 'اختر BC' : 'Select BC'}
          customValuePlaceholder={language === 'ar' ? 'أدخل BC' : 'Enter BC'}
        />
        
        <CustomSelect
          label={language === 'ar' ? 'القطر' : 'Diameter'}
          options={COMMON_DIAMETER_VALUES}
          value={diameter}
          onChange={setDiameter}
          placeholder={language === 'ar' ? 'اختر القطر' : 'Select diameter'}
          customValuePlaceholder={language === 'ar' ? 'أدخل القطر' : 'Enter diameter'}
        />

        <div className="space-y-2">
          <Label htmlFor="power">Power</Label>
          <Input
            id="power"
            type="text"
            value={power}
            onChange={(e) => setPower(e.target.value)}
            placeholder="-0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CustomSelect
          label={language === 'ar' ? 'اللون (اختياري)' : 'Color (Optional)'}
          options={["none", ...COMMON_COLORS]}
          value={color || "none"}
          onChange={(val) => setColor(val === "none" ? "" : val)}
          placeholder={language === 'ar' ? 'اختر اللون' : 'Select color'}
          customValuePlaceholder={language === 'ar' ? 'أدخل اللون' : 'Enter color'}
        />
        
        <div className="space-y-2">
          <Label htmlFor="price">{language === 'ar' ? 'السعر (KWD)' : 'Price (KWD)'}</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="qty">{language === 'ar' ? 'الكمية' : 'Quantity'}</Label>
          <Input
            id="qty"
            type="number"
            step="1"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="1"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-1" />
          {language === 'ar' ? 'إلغاء' : 'Cancel'}
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-1" />
          {isEditing 
            ? (language === 'ar' ? 'تحديث' : 'Update') 
            : (language === 'ar' ? 'حفظ العدسة' : 'Save Lens')}
        </Button>
      </div>
    </form>
  );
};
