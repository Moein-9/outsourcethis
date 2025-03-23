
import React, { useState } from "react";
import { RxData } from "@/store/patientStore";
import { useLanguageStore } from "@/store/languageStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PatientRxDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rx: RxData) => void;
  initialRx?: RxData;
}

export const PatientRxDialog: React.FC<PatientRxDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRx,
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  const [rx, setRx] = useState<RxData>(initialRx || {
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
  });
  
  // Generate options for select elements
  const generateSphOptions = () => {
    const options = [];
    for (let i = 20; i >= -30; i -= 0.25) {
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
    for (let i = 0; i >= -10; i -= 0.25) {
      const formatted = i === 0 ? "0.00" : i.toFixed(2);
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
    for (let i = 0; i <= 180; i += 5) {
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
    options.push(<SelectItem key="add-none" value="none">-</SelectItem>);
    for (let i = 0.25; i <= 4; i += 0.25) {
      const formatted = `+${i.toFixed(2)}`;
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
    options.push(<SelectItem key="pd-none" value="none">-</SelectItem>);
    for (let i = 50; i <= 80; i += 0.5) {
      options.push(
        <SelectItem key={`pd-${i}`} value={i.toString()}>
          {i}
        </SelectItem>
      );
    }
    return options;
  };
  
  const handleChange = (field: keyof RxData, value: string) => {
    setRx(prev => ({
      ...prev,
      [field]: value === "none" ? "" : value,
    }));
  };
  
  const handleSave = () => {
    onSave(rx);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {language === 'ar' ? "وصفة طبية جديدة" : "New Prescription"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <Card className="border-blue-200 shadow-md">
            <CardContent className="pt-6">
              {/* Horizontal RX Table Layout */}
              <div className="space-y-8">
                {/* Right Eye (OD) Row */}
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-blue-50 px-4 py-2 flex items-center border-b">
                    <Eye className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium">
                      {language === 'ar' ? "العين اليمنى (OD)" : "Right Eye (OD)"}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2 p-4">
                    <div>
                      <Label className="text-center block mb-1">SPH</Label>
                      <Select
                        value={rx.sphereOD || "none"}
                        onValueChange={(value) => handleChange("sphereOD", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">-</SelectItem>
                          {generateSphOptions()}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-center block mb-1">CYL</Label>
                      <Select
                        value={rx.cylOD || "none"}
                        onValueChange={(value) => handleChange("cylOD", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">-</SelectItem>
                          {generateCylOptions()}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-center block mb-1">AXIS</Label>
                      <Select
                        value={rx.axisOD || "none"}
                        onValueChange={(value) => handleChange("axisOD", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">-</SelectItem>
                          {generateAxisOptions()}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-center block mb-1">ADD</Label>
                      <Select
                        value={rx.addOD || "none"}
                        onValueChange={(value) => handleChange("addOD", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateAddOptions()}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-center block mb-1">PD</Label>
                      <Select
                        value={rx.pdRight || "none"}
                        onValueChange={(value) => handleChange("pdRight", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          {generatePdOptions()}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Left Eye (OS) Row */}
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-indigo-50 px-4 py-2 flex items-center border-b">
                    <EyeOff className="h-5 w-5 text-indigo-600 mr-2" />
                    <h3 className="font-medium">
                      {language === 'ar' ? "العين اليسرى (OS)" : "Left Eye (OS)"}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2 p-4">
                    <div>
                      <Label className="text-center block mb-1">SPH</Label>
                      <Select
                        value={rx.sphereOS || "none"}
                        onValueChange={(value) => handleChange("sphereOS", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">-</SelectItem>
                          {generateSphOptions()}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-center block mb-1">CYL</Label>
                      <Select
                        value={rx.cylOS || "none"}
                        onValueChange={(value) => handleChange("cylOS", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">-</SelectItem>
                          {generateCylOptions()}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-center block mb-1">AXIS</Label>
                      <Select
                        value={rx.axisOS || "none"}
                        onValueChange={(value) => handleChange("axisOS", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">-</SelectItem>
                          {generateAxisOptions()}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-center block mb-1">ADD</Label>
                      <Select
                        value={rx.addOS || "none"}
                        onValueChange={(value) => handleChange("addOS", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateAddOptions()}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-center block mb-1">PD</Label>
                      <Select
                        value={rx.pdLeft || "none"}
                        onValueChange={(value) => handleChange("pdLeft", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="-" />
                        </SelectTrigger>
                        <SelectContent>
                          {generatePdOptions()}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {language === 'ar' ? "إلغاء" : "Cancel"}
          </Button>
          <Button onClick={handleSave}>
            {language === 'ar' ? "حفظ" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
