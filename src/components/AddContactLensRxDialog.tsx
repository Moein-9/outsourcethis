import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ContactLensRx } from "@/store/patientStore";
import { useLanguageStore } from "@/store/languageStore";
import { ContactLensForm } from "@/components/ContactLensForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddContactLensRxDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rx: ContactLensRx) => void;
  initialRx?: ContactLensRx;
  patientId: string;
}

const defaultContactLensRx: ContactLensRx = {
  rightEye: {
    sphere: "-",
    cylinder: "-",
    axis: "-",
    bc: "-",
    dia: "14.2",
  },
  leftEye: {
    sphere: "-",
    cylinder: "-",
    axis: "-",
    bc: "-",
    dia: "14.2",
  },
};

export const AddContactLensRxDialog: React.FC<AddContactLensRxDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRx,
  patientId,
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === "ar";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ContactLensRx>(
    initialRx || defaultContactLensRx
  );

  const [validationErrors, setValidationErrors] = useState({
    cylinderAxisError: false,
  });

  useEffect(() => {
    if (initialRx) {
      setFormData(initialRx);
    } else {
      setFormData(defaultContactLensRx);
    }
  }, [initialRx, isOpen]);

  const handleRxChange = (rxData: ContactLensRx) => {
    setFormData(rxData);

    // Validate cylinder/axis relationship
    let hasError = false;

    if (rxData.rightEye.cylinder !== "-" && rxData.rightEye.axis === "-") {
      hasError = true;
    }

    if (rxData.leftEye.cylinder !== "-" && rxData.leftEye.axis === "-") {
      hasError = true;
    }

    setValidationErrors({
      cylinderAxisError: hasError,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validationErrors.cylinderAxisError) {
      return; // Don't save if validation errors exist
    }

    try {
      setIsSubmitting(true);

      // Save to Supabase
      const prescriptionData = {
        patient_id: patientId,
        prescription_date: new Date().toISOString().split("T")[0],
        od_sphere:
          formData.rightEye.sphere !== "-" ? formData.rightEye.sphere : null,
        od_cylinder:
          formData.rightEye.cylinder !== "-"
            ? formData.rightEye.cylinder
            : null,
        od_axis: formData.rightEye.axis !== "-" ? formData.rightEye.axis : null,
        od_base_curve:
          formData.rightEye.bc !== "-" ? formData.rightEye.bc : null,
        od_diameter:
          formData.rightEye.dia !== "-" ? formData.rightEye.dia : null,
        os_sphere:
          formData.leftEye.sphere !== "-" ? formData.leftEye.sphere : null,
        os_cylinder:
          formData.leftEye.cylinder !== "-" ? formData.leftEye.cylinder : null,
        os_axis: formData.leftEye.axis !== "-" ? formData.leftEye.axis : null,
        os_base_curve: formData.leftEye.bc !== "-" ? formData.leftEye.bc : null,
        os_diameter: formData.leftEye.dia !== "-" ? formData.leftEye.dia : null,
      };

      const { data, error } = await supabase
        .from("contact_lens_prescriptions")
        .insert(prescriptionData)
        .select();

      if (error) {
        console.error("Error saving contact lens prescription:", error);
        toast.error(
          language === "ar"
            ? "حدث خطأ أثناء حفظ الوصفة"
            : "Error saving prescription"
        );
        return;
      }

      // Still call the original onSave function for backward compatibility
      onSave(formData);

      toast.success(
        language === "ar"
          ? "تم حفظ وصفة العدسات اللاصقة بنجاح"
          : "Contact lens prescription saved successfully"
      );
      onClose();
    } catch (error) {
      console.error("Error in save process:", error);
      toast.error(
        language === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl bg-white p-0 overflow-hidden"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
          <DialogTitle className="text-xl font-bold">
            {language === "ar"
              ? "إضافة وصفة عدسات لاصقة"
              : "Add Contact Lens Prescription"}
          </DialogTitle>
          <DialogDescription className="text-white/80">
            {language === "ar"
              ? "أدخل تفاصيل وصفة العدسات اللاصقة للعميل"
              : "Enter the patient's contact lens prescription details"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <ContactLensForm rxData={formData} onChange={handleRxChange} />

            {validationErrors.cylinderAxisError && (
              <div className="p-3 mt-2 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                <p className="text-red-700 text-sm font-medium">
                  {language === "ar"
                    ? "إذا تم تحديد قيمة الأسطوانة، يجب تحديد قيمة المحور أيضًا."
                    : "If a cylinder value is set, an axis value must also be provided."}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-row justify-end gap-3 mt-8 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {language === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              type="submit"
              disabled={validationErrors.cylinderAxisError || isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSubmitting
                ? language === "ar"
                  ? "جاري الحفظ..."
                  : "Saving..."
                : language === "ar"
                ? "حفظ"
                : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
