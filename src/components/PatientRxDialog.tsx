
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PatientRxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  currentRx?: RxData;
}

export function PatientRxDialog({ open, onOpenChange, patientId, currentRx }: PatientRxDialogProps) {
  const { t, language } = useLanguageStore();
  const { updatePatientRx } = usePatientStore();

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

  const handleChange = (field: keyof RxData, value: string) => {
    setRx((prev) => ({
      ...prev,
      [field]: value,
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

  // Generate options for select elements
  const generateSphOptions = () => {
    const options = [];
    for (let i = 10; i >= -10; i -= 0.25) {
      const formatted = i >= 0 ? `+${i.toFixed(2)}` : i.toFixed(2);
      options.push(
        <SelectItem key={`sph-${i}`} value={formatted}>
          {formatted}
        </SelectItem>
      );
    }
    return options;
  };
  
  const generateCylOptions = () => {
    const options = [];
    for (let i = 0; i >= -6; i -= 0.25) {
      const formatted = i.toFixed(2);
      options.push(
        <SelectItem key={`cyl-${i}`} value={formatted}>
          {formatted}
        </SelectItem>
      );
    }
    return options;
  };
  
  const generateAxisOptions = () => {
    const options = [];
    for (let i = 0; i <= 180; i += 1) {
      options.push(
        <SelectItem key={`axis-${i}`} value={i.toString()}>
          {i}°
        </SelectItem>
      );
    }
    return options;
  };
  
  const generateAddOptions = () => {
    const options = [];
    for (let i = 0; i <= 3; i += 0.25) {
      const formatted = i === 0 ? "0.00" : `+${i.toFixed(2)}`;
      options.push(
        <SelectItem key={`add-${i}`} value={formatted}>
          {formatted}
        </SelectItem>
      );
    }
    return options;
  };
  
  const generatePdOptions = () => {
    const options = [];
    for (let i = 40; i <= 80; i += 1) {
      options.push(
        <SelectItem key={`pd-${i}`} value={i.toString()}>
          {i} mm
        </SelectItem>
      );
    }
    return options;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" dir="ltr">
        <DialogHeader>
          <DialogTitle className="text-center">
            {language === 'ar' ? "وصفة طبية جديدة" : "New Prescription"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {language === 'ar' 
              ? "أدخل بيانات الوصفة الطبية الجديدة للعميل"
              : "Enter the new prescription details for the client"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-md border p-4 bg-amber-50/30">
              <h3 className="text-md font-medium mb-3 text-amber-800 text-center">
                {language === 'ar' ? "العين اليمنى (OD)" : "Right Eye (OD)"}
              </h3>
              
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label htmlFor="sphereOD" className="text-xs text-center block mb-1">
                    SPH
                  </Label>
                  <Select
                    value={rx.sphereOD}
                    onValueChange={(value) => handleChange("sphereOD", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">---</SelectItem>
                      {generateSphOptions()}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cylOD" className="text-xs text-center block mb-1">
                    CYL
                  </Label>
                  <Select
                    value={rx.cylOD}
                    onValueChange={(value) => handleChange("cylOD", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">---</SelectItem>
                      {generateCylOptions()}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="axisOD" className="text-xs text-center block mb-1">
                    AXIS
                  </Label>
                  <Select
                    value={rx.axisOD}
                    onValueChange={(value) => handleChange("axisOD", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">---</SelectItem>
                      {generateAxisOptions()}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="addOD" className="text-xs text-center block mb-1">
                    ADD
                  </Label>
                  <Select
                    value={rx.addOD}
                    onValueChange={(value) => handleChange("addOD", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">---</SelectItem>
                      {generateAddOptions()}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="rounded-md border p-4 bg-blue-50/30">
              <h3 className="text-md font-medium mb-3 text-blue-800 text-center">
                {language === 'ar' ? "العين اليسرى (OS)" : "Left Eye (OS)"}
              </h3>
              
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label htmlFor="sphereOS" className="text-xs text-center block mb-1">
                    SPH
                  </Label>
                  <Select
                    value={rx.sphereOS}
                    onValueChange={(value) => handleChange("sphereOS", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">---</SelectItem>
                      {generateSphOptions()}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cylOS" className="text-xs text-center block mb-1">
                    CYL
                  </Label>
                  <Select
                    value={rx.cylOS}
                    onValueChange={(value) => handleChange("cylOS", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">---</SelectItem>
                      {generateCylOptions()}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="axisOS" className="text-xs text-center block mb-1">
                    AXIS
                  </Label>
                  <Select
                    value={rx.axisOS}
                    onValueChange={(value) => handleChange("axisOS", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">---</SelectItem>
                      {generateAxisOptions()}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="addOS" className="text-xs text-center block mb-1">
                    ADD
                  </Label>
                  <Select
                    value={rx.addOS}
                    onValueChange={(value) => handleChange("addOS", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">---</SelectItem>
                      {generateAddOptions()}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="rounded-md border p-4 bg-green-50/30">
              <h3 className="text-md font-medium mb-3 text-green-800 text-center">
                {language === 'ar' ? "المسافة بين الحدقتين (PD)" : "Pupillary Distance (PD)"}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="pdRight" className="text-xs text-center block mb-1">
                    PD (R)
                  </Label>
                  <Select
                    value={rx.pdRight}
                    onValueChange={(value) => handleChange("pdRight", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">---</SelectItem>
                      {generatePdOptions()}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pdLeft" className="text-xs text-center block mb-1">
                    PD (L)
                  </Label>
                  <Select
                    value={rx.pdLeft}
                    onValueChange={(value) => handleChange("pdLeft", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">---</SelectItem>
                      {generatePdOptions()}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-2 rtl:space-x-reverse">
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
