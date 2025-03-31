
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContactLensRx } from "@/store/patientStore";
import { useLanguageStore } from "@/store/languageStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddContactLensRxDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rx: ContactLensRx) => void;
  initialRx?: ContactLensRx;
}

const defaultContactLensRx: ContactLensRx = {
  rightEye: {
    sphere: "",
    cylinder: "",
    axis: "",
    bc: "",
    dia: ""
  },
  leftEye: {
    sphere: "",
    cylinder: "",
    axis: "",
    bc: "",
    dia: ""
  }
};

export const AddContactLensRxDialog: React.FC<AddContactLensRxDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRx
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  const [formData, setFormData] = useState<ContactLensRx>(
    initialRx || defaultContactLensRx
  );
  
  useEffect(() => {
    if (initialRx) {
      setFormData(initialRx);
    } else {
      setFormData(defaultContactLensRx);
    }
  }, [initialRx, isOpen]);
  
  const handleChange = (
    eye: 'rightEye' | 'leftEye', 
    field: 'sphere' | 'cylinder' | 'axis' | 'bc' | 'dia', 
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const renderInputField = (
    eye: 'rightEye' | 'leftEye',
    field: 'sphere' | 'cylinder' | 'axis' | 'bc' | 'dia',
    label: string,
    placeholder: string = ""
  ) => (
    <div className="mb-2">
      <Label htmlFor={`${eye}-${field}`}>{label}</Label>
      <Input
        id={`${eye}-${field}`}
        value={formData[eye][field]}
        onChange={(e) => handleChange(eye, field, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir={isRtl ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="text-center">
            {language === 'ar' ? "إضافة وصفة عدسات لاصقة" : "Add Contact Lens Prescription"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {language === 'ar' 
              ? "أدخل تفاصيل وصفة العدسات اللاصقة للعميل" 
              : "Enter the patient's contact lens prescription details"
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium text-center bg-blue-100 py-1 rounded">
                {language === 'ar' ? "العين اليمنى (OD)" : "Right Eye (OD)"}
              </h3>
              {renderInputField('rightEye', 'sphere', language === 'ar' ? "محيط العدسة" : "Sphere", "0.00")}
              {renderInputField('rightEye', 'cylinder', language === 'ar' ? "الأسطوانة" : "Cylinder", "0.00")}
              {renderInputField('rightEye', 'axis', language === 'ar' ? "المحور" : "Axis", "0")}
              {renderInputField('rightEye', 'bc', language === 'ar' ? "تقوس القاعدة" : "Base Curve", "0.00")}
              {renderInputField('rightEye', 'dia', language === 'ar' ? "القطر" : "Diameter", "0.00")}
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-center bg-green-100 py-1 rounded">
                {language === 'ar' ? "العين اليسرى (OS)" : "Left Eye (OS)"}
              </h3>
              {renderInputField('leftEye', 'sphere', language === 'ar' ? "محيط العدسة" : "Sphere", "0.00")}
              {renderInputField('leftEye', 'cylinder', language === 'ar' ? "الأسطوانة" : "Cylinder", "0.00")}
              {renderInputField('leftEye', 'axis', language === 'ar' ? "المحور" : "Axis", "0")}
              {renderInputField('leftEye', 'bc', language === 'ar' ? "تقوس القاعدة" : "Base Curve", "0.00")}
              {renderInputField('leftEye', 'dia', language === 'ar' ? "القطر" : "Diameter", "0.00")}
            </div>
          </div>
          
          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {language === 'ar' ? "إلغاء" : "Cancel"}
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {language === 'ar' ? "حفظ" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
