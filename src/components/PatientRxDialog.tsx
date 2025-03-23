
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface PatientRxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  currentRx?: RxData;
  onRxSaved?: () => void;
}

export function PatientRxDialog({ open, onOpenChange, patientId, currentRx, onRxSaved }: PatientRxDialogProps) {
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
      createdAt: new Date().toISOString()
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
      if (!rx.sphereOD || !rx.sphereOS) {
        toast({
          title: t("error"),
          description: t("pleaseFillRequiredFields"),
          variant: "destructive",
        });
        return;
      }

      const updatedRx = {
        ...rx,
        createdAt: new Date().toISOString()
      };

      updatePatientRx(patientId, updatedRx);
      
      toast({
        title: t("success"),
        description: t("rxUpdated"),
      });
      
      if (onRxSaved) {
        onRxSaved();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating RX:", error);
      toast({
        title: t("error"),
        description: t("errorUpdatingRx"),
        variant: "destructive",
      });
    }
  };

  // Generate select options for different fields
  const generateSphereOptions = () => {
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

  const generateCylinderOptions = () => {
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
          {i}
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
          {i}
        </SelectItem>
      );
    }
    return options;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto" dir={isRtl ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>{t("newRx")}</DialogTitle>
          <DialogDescription>
            {t("enterRxDetailsForPatient")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Right Eye (OD) */}
          <div className="bg-blue-50/30 rounded-md border p-4">
            <h3 className="text-md font-medium mb-3 text-blue-800">
              {t("rightEye")} (OD)
            </h3>
            
            <div className="grid grid-cols-5 gap-4">
              <div>
                <Label htmlFor="sphereOD" className="text-xs mb-1 block">
                  {t("sphere")}
                </Label>
                <Select 
                  value={rx.sphereOD} 
                  onValueChange={(value) => handleChange("sphereOD", value)}
                >
                  <SelectTrigger id="sphereOD" className="w-full">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    {generateSphereOptions()}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="cylOD" className="text-xs mb-1 block">
                  {t("cylinder")}
                </Label>
                <Select 
                  value={rx.cylOD} 
                  onValueChange={(value) => handleChange("cylOD", value)}
                >
                  <SelectTrigger id="cylOD" className="w-full">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    {generateCylinderOptions()}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="axisOD" className="text-xs mb-1 block">
                  {t("axis")}
                </Label>
                <Select 
                  value={rx.axisOD} 
                  onValueChange={(value) => handleChange("axisOD", value)}
                >
                  <SelectTrigger id="axisOD" className="w-full">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    {generateAxisOptions()}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="addOD" className="text-xs mb-1 block">
                  {t("add")}
                </Label>
                <Select 
                  value={rx.addOD} 
                  onValueChange={(value) => handleChange("addOD", value)}
                >
                  <SelectTrigger id="addOD" className="w-full">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    {generateAddOptions()}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="pdRight" className="text-xs mb-1 block">
                  {t("pd")}
                </Label>
                <Select 
                  value={rx.pdRight} 
                  onValueChange={(value) => handleChange("pdRight", value)}
                >
                  <SelectTrigger id="pdRight" className="w-full">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    {generatePdOptions()}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Left Eye (OS) */}
          <div className="bg-rose-50/30 rounded-md border p-4">
            <h3 className="text-md font-medium mb-3 text-rose-800">
              {t("leftEye")} (OS)
            </h3>
            
            <div className="grid grid-cols-5 gap-4">
              <div>
                <Label htmlFor="sphereOS" className="text-xs mb-1 block">
                  {t("sphere")}
                </Label>
                <Select 
                  value={rx.sphereOS} 
                  onValueChange={(value) => handleChange("sphereOS", value)}
                >
                  <SelectTrigger id="sphereOS" className="w-full">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    {generateSphereOptions()}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="cylOS" className="text-xs mb-1 block">
                  {t("cylinder")}
                </Label>
                <Select 
                  value={rx.cylOS} 
                  onValueChange={(value) => handleChange("cylOS", value)}
                >
                  <SelectTrigger id="cylOS" className="w-full">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    {generateCylinderOptions()}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="axisOS" className="text-xs mb-1 block">
                  {t("axis")}
                </Label>
                <Select 
                  value={rx.axisOS} 
                  onValueChange={(value) => handleChange("axisOS", value)}
                >
                  <SelectTrigger id="axisOS" className="w-full">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    {generateAxisOptions()}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="addOS" className="text-xs mb-1 block">
                  {t("add")}
                </Label>
                <Select 
                  value={rx.addOS} 
                  onValueChange={(value) => handleChange("addOS", value)}
                >
                  <SelectTrigger id="addOS" className="w-full">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    {generateAddOptions()}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="pdLeft" className="text-xs mb-1 block">
                  {t("pd")}
                </Label>
                <Select 
                  value={rx.pdLeft} 
                  onValueChange={(value) => handleChange("pdLeft", value)}
                >
                  <SelectTrigger id="pdLeft" className="w-full">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    {generatePdOptions()}
                  </SelectContent>
                </Select>
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
