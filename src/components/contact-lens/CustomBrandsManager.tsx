
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguageStore } from '@/store/languageStore';
import { toast } from 'sonner';

interface CustomBrandsManagerProps {
  savedBrands: string[];
  onSaveBrand: (brand: string) => void;
  onDeleteBrand: (brand: string) => void;
}

export const CustomBrandsManager: React.FC<CustomBrandsManagerProps> = ({
  savedBrands,
  onSaveBrand,
  onDeleteBrand
}) => {
  const { language } = useLanguageStore();
  const [newBrand, setNewBrand] = React.useState('');

  // Check if "Bella" and "M-Bella" brands should be added when component mounts
  React.useEffect(() => {
    const requiredBrands = ["Bella", "M-Bella"];
    
    requiredBrands.forEach(brand => {
      if (!savedBrands.includes(brand)) {
        onSaveBrand(brand);
      }
    });
  }, []);

  const handleAddBrand = () => {
    if (!newBrand.trim()) {
      toast.error(language === 'ar' ? 'يرجى إدخال اسم البراند' : 'Please enter a brand name');
      return;
    }

    if (savedBrands.includes(newBrand.trim())) {
      toast.error(language === 'ar' ? 'هذا البراند موجود بالفعل' : 'This brand already exists');
      return;
    }

    onSaveBrand(newBrand.trim());
    setNewBrand('');
    toast.success(
      language === 'ar' 
        ? `تمت إضافة البراند "${newBrand}" بنجاح` 
        : `Brand "${newBrand}" has been added successfully`
    );
  };

  const handleDeleteBrand = (brand: string) => {
    // Prevent deletion of required brands
    if (["Bella", "M-Bella"].includes(brand)) {
      toast.error(
        language === 'ar'
          ? `لا يمكن حذف البراند "${brand}" لأنه براند أساسي`
          : `Cannot delete the brand "${brand}" as it is a core brand`
      );
      return;
    }
    
    onDeleteBrand(brand);
    toast.success(
      language === 'ar' 
        ? `تم حذف البراند "${brand}" بنجاح` 
        : `Brand "${brand}" has been deleted successfully`
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
          placeholder={language === 'ar' ? 'أدخل اسم البراند الجديد' : 'Enter new brand name'}
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleAddBrand()}
        />
        <Button 
          onClick={handleAddBrand}
          type="button"
          className="shrink-0"
        >
          <Plus className="h-4 w-4 mr-1" />
          {language === 'ar' ? 'إضافة' : 'Add'}
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {savedBrands.length === 0 ? (
          <div className="text-muted-foreground text-sm italic">
            {language === 'ar' ? 'لا توجد براندات مخصصة' : 'No custom brands'}
          </div>
        ) : (
          savedBrands.map((brand) => (
            <Badge
              key={brand}
              variant="secondary"
              className={`px-3 py-1.5 flex items-center gap-1.5 bg-muted/60 ${
                ["Bella", "M-Bella"].includes(brand) ? "border-blue-300 bg-blue-50" : ""
              }`}
            >
              {brand}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteBrand(brand)}
                className="h-auto w-auto p-0.5 -mr-1 rounded-full hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </Badge>
          ))
        )}
      </div>
    </div>
  );
};
