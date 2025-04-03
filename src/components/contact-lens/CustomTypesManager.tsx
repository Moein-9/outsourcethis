
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguageStore } from '@/store/languageStore';
import { toast } from 'sonner';

interface CustomTypesManagerProps {
  savedTypes: string[];
  onSaveType: (type: string) => void;
  onDeleteType: (type: string) => void;
}

export const CustomTypesManager: React.FC<CustomTypesManagerProps> = ({
  savedTypes,
  onSaveType,
  onDeleteType
}) => {
  const { language } = useLanguageStore();
  const [newType, setNewType] = React.useState('');

  // Check if "Daily" and "Monthly" types should be added when component mounts
  React.useEffect(() => {
    const requiredTypes = ["Daily", "Monthly"];
    
    requiredTypes.forEach(type => {
      if (!savedTypes.includes(type)) {
        onSaveType(type);
      }
    });
  }, []);

  const handleAddType = () => {
    if (!newType.trim()) {
      toast.error(language === 'ar' ? 'يرجى إدخال نوع العدسة' : 'Please enter a lens type');
      return;
    }

    if (savedTypes.includes(newType.trim())) {
      toast.error(language === 'ar' ? 'هذا النوع موجود بالفعل' : 'This type already exists');
      return;
    }

    onSaveType(newType.trim());
    setNewType('');
    toast.success(
      language === 'ar' 
        ? `تمت إضافة النوع "${newType}" بنجاح` 
        : `Type "${newType}" has been added successfully`
    );
  };

  const handleDeleteType = (type: string) => {
    // Prevent deletion of required types
    if (["Daily", "Monthly"].includes(type)) {
      toast.error(
        language === 'ar'
          ? `لا يمكن حذف النوع "${type}" لأنه نوع أساسي`
          : `Cannot delete the type "${type}" as it is a core type`
      );
      return;
    }
    
    onDeleteType(type);
    toast.success(
      language === 'ar' 
        ? `تم حذف النوع "${type}" بنجاح` 
        : `Type "${type}" has been deleted successfully`
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          placeholder={language === 'ar' ? 'أدخل نوع العدسة الجديد' : 'Enter new lens type'}
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleAddType()}
        />
        <Button 
          onClick={handleAddType}
          type="button"
          className="shrink-0"
        >
          <Plus className="h-4 w-4 mr-1" />
          {language === 'ar' ? 'إضافة' : 'Add'}
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {savedTypes.length === 0 ? (
          <div className="text-muted-foreground text-sm italic">
            {language === 'ar' ? 'لا توجد أنواع مخصصة' : 'No custom types'}
          </div>
        ) : (
          savedTypes.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className={`px-3 py-1.5 flex items-center gap-1.5 bg-muted/60 ${
                ["Daily", "Monthly"].includes(type) ? "border-green-300 bg-green-50" : ""
              }`}
            >
              {type}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteType(type)}
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
