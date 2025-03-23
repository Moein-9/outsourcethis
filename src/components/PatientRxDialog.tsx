
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { usePatientStore, RxData } from "@/store/patientStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PatientRxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  currentRx?: RxData;
}

export function PatientRxDialog({ open, onOpenChange, patientId, currentRx }: PatientRxDialogProps) {
  const { t, language } = useLanguageStore();
  const { updatePatientRx } = usePatientStore();
  const isRtl = language === 'ar';

  const [rx, setRx] = useState<RxData>(
    currentRx || {
      sphereOD: "",
      cylOD: "",
      axisOD: "",
      addOD: "",
      sphereOS: "",
      cylOS: "",
      axisOS: "",
      addOS: "",
      pdRight: "",
      pdLeft: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRx((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    try {
      updatePatientRx(patientId, rx);
      toast.success(language === 'ar' ? "تم تحديث الوصفة الطبية بنجاح" : "Prescription updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating RX:", error);
      toast.error(language === 'ar' ? "حدث خطأ أثناء تحديث الوصفة الطبية" : "Error updating prescription");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{language === 'ar' ? "وصفة طبية جديدة" : "New Prescription"}</DialogTitle>
          <DialogDescription>
            {language === 'ar' 
              ? "أدخل بيانات الوصفة الطبية الجديدة للعميل"
              : "Enter the new prescription details for the client"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-md border p-4 bg-amber-50/30">
              <h3 className="text-md font-medium mb-3 text-amber-800">
                {language === 'ar' ? "العين اليمنى (OD)" : "Right Eye (OD)"}
              </h3>
              
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label htmlFor="sphereOD" className="text-xs">
                    {language === 'ar' ? "كروي" : "Sphere"}
                  </Label>
                  <Input
                    id="sphereOD"
                    name="sphereOD"
                    value={rx.sphereOD}
                    onChange={handleChange}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="cylOD" className="text-xs">
                    {language === 'ar' ? "اسطواني" : "Cylinder"}
                  </Label>
                  <Input
                    id="cylOD"
                    name="cylOD"
                    value={rx.cylOD}
                    onChange={handleChange}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="axisOD" className="text-xs">
                    {language === 'ar' ? "محور" : "Axis"}
                  </Label>
                  <Input
                    id="axisOD"
                    name="axisOD"
                    value={rx.axisOD}
                    onChange={handleChange}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="addOD" className="text-xs">
                    {language === 'ar' ? "إضافة" : "Add"}
                  </Label>
                  <Input
                    id="addOD"
                    name="addOD"
                    value={rx.addOD}
                    onChange={handleChange}
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-md border p-4 bg-blue-50/30">
              <h3 className="text-md font-medium mb-3 text-blue-800">
                {language === 'ar' ? "العين اليسرى (OS)" : "Left Eye (OS)"}
              </h3>
              
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label htmlFor="sphereOS" className="text-xs">
                    {language === 'ar' ? "كروي" : "Sphere"}
                  </Label>
                  <Input
                    id="sphereOS"
                    name="sphereOS"
                    value={rx.sphereOS}
                    onChange={handleChange}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="cylOS" className="text-xs">
                    {language === 'ar' ? "اسطواني" : "Cylinder"}
                  </Label>
                  <Input
                    id="cylOS"
                    name="cylOS"
                    value={rx.cylOS}
                    onChange={handleChange}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="axisOS" className="text-xs">
                    {language === 'ar' ? "محور" : "Axis"}
                  </Label>
                  <Input
                    id="axisOS"
                    name="axisOS"
                    value={rx.axisOS}
                    onChange={handleChange}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="addOS" className="text-xs">
                    {language === 'ar' ? "إضافة" : "Add"}
                  </Label>
                  <Input
                    id="addOS"
                    name="addOS"
                    value={rx.addOS}
                    onChange={handleChange}
                    className="h-9"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-md border p-4 bg-green-50/30">
              <h3 className="text-md font-medium mb-3 text-green-800">
                {language === 'ar' ? "المسافة بين الحدقتين (PD)" : "Pupillary Distance (PD)"}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="pdRight" className="text-xs">
                    {language === 'ar' ? "المسافة اليمنى" : "Right PD"}
                  </Label>
                  <Input
                    id="pdRight"
                    name="pdRight"
                    value={rx.pdRight}
                    onChange={handleChange}
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="pdLeft" className="text-xs">
                    {language === 'ar' ? "المسافة اليسرى" : "Left PD"}
                  </Label>
                  <Input
                    id="pdLeft"
                    name="pdLeft"
                    value={rx.pdLeft}
                    onChange={handleChange}
                    className="h-9"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave}>
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
