
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-700">
            {language === 'ar' ? "وصفة طبية جديدة" : "New Prescription"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <Card className="border-blue-200 shadow-md bg-gradient-to-r from-blue-50/50 to-indigo-50/50 overflow-hidden">
            <CardContent className="p-6">
              {/* New Horizontal RX Table Layout */}
              <div className="space-y-8">
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-4 px-2">
                  <div className="col-span-1"></div>
                  <div className="col-span-1">
                    <div className="text-center font-semibold text-blue-700 p-2 bg-blue-100 rounded-md shadow-sm">SPH</div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-center font-semibold text-blue-700 p-2 bg-blue-100 rounded-md shadow-sm">CYL</div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-center font-semibold text-blue-700 p-2 bg-blue-100 rounded-md shadow-sm">AXIS</div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-center font-semibold text-blue-700 p-2 bg-blue-100 rounded-md shadow-sm">ADD</div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-center font-semibold text-blue-700 p-2 bg-blue-100 rounded-md shadow-sm">PD</div>
                  </div>
                </div>
                
                {/* Right Eye (OD) Row */}
                <div className="grid grid-cols-6 gap-4 items-center bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                  <div className="col-span-1">
                    <div className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-md">
                      <Eye className="h-5 w-5" />
                      <span className="font-medium">
                        {language === 'ar' ? "العين اليمنى (OD)" : "Right Eye (OD)"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <Select
                      value={rx.sphereOD || "none"}
                      onValueChange={(value) => handleChange("sphereOD", value)}
                    >
                      <SelectTrigger className="w-full bg-white focus:ring-2 focus:ring-blue-300">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <SelectItem value="none">-</SelectItem>
                        {generateSphOptions()}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-1">
                    <Select
                      value={rx.cylOD || "none"}
                      onValueChange={(value) => handleChange("cylOD", value)}
                    >
                      <SelectTrigger className="w-full bg-white focus:ring-2 focus:ring-blue-300">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <SelectItem value="none">-</SelectItem>
                        {generateCylOptions()}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-1">
                    <Select
                      value={rx.axisOD || "none"}
                      onValueChange={(value) => handleChange("axisOD", value)}
                    >
                      <SelectTrigger className="w-full bg-white focus:ring-2 focus:ring-blue-300">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <SelectItem value="none">-</SelectItem>
                        {generateAxisOptions()}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-1">
                    <Select
                      value={rx.addOD || "none"}
                      onValueChange={(value) => handleChange("addOD", value)}
                    >
                      <SelectTrigger className="w-full bg-white focus:ring-2 focus:ring-blue-300">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {generateAddOptions()}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-1">
                    <Select
                      value={rx.pdRight || "none"}
                      onValueChange={(value) => handleChange("pdRight", value)}
                    >
                      <SelectTrigger className="w-full bg-white focus:ring-2 focus:ring-blue-300">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {generatePdOptions()}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Left Eye (OS) Row */}
                <div className="grid grid-cols-6 gap-4 items-center bg-white p-4 rounded-lg shadow-sm border border-rose-100">
                  <div className="col-span-1">
                    <div className="flex items-center space-x-2 bg-rose-500 text-white px-3 py-2 rounded-md">
                      <EyeOff className="h-5 w-5" />
                      <span className="font-medium">
                        {language === 'ar' ? "العين اليسرى (OS)" : "Left Eye (OS)"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <Select
                      value={rx.sphereOS || "none"}
                      onValueChange={(value) => handleChange("sphereOS", value)}
                    >
                      <SelectTrigger className="w-full bg-white focus:ring-2 focus:ring-rose-300">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <SelectItem value="none">-</SelectItem>
                        {generateSphOptions()}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-1">
                    <Select
                      value={rx.cylOS || "none"}
                      onValueChange={(value) => handleChange("cylOS", value)}
                    >
                      <SelectTrigger className="w-full bg-white focus:ring-2 focus:ring-rose-300">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <SelectItem value="none">-</SelectItem>
                        {generateCylOptions()}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-1">
                    <Select
                      value={rx.axisOS || "none"}
                      onValueChange={(value) => handleChange("axisOS", value)}
                    >
                      <SelectTrigger className="w-full bg-white focus:ring-2 focus:ring-rose-300">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <SelectItem value="none">-</SelectItem>
                        {generateAxisOptions()}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-1">
                    <Select
                      value={rx.addOS || "none"}
                      onValueChange={(value) => handleChange("addOS", value)}
                    >
                      <SelectTrigger className="w-full bg-white focus:ring-2 focus:ring-rose-300">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {generateAddOptions()}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-1">
                    <Select
                      value={rx.pdLeft || "none"}
                      onValueChange={(value) => handleChange("pdLeft", value)}
                    >
                      <SelectTrigger className="w-full bg-white focus:ring-2 focus:ring-rose-300">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {generatePdOptions()}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Educational Information */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-700" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-800 mb-1">{language === 'ar' ? "معلومات الوصفة:" : "Prescription Information:"}</h4>
                      <ul className="list-disc pl-5 space-y-1 text-amber-700">
                        <li>{language === 'ar' ? "SPH (كروي): قوة العدسة الكروية" : "SPH (Sphere): The spherical power of the lens"}</li>
                        <li>{language === 'ar' ? "CYL (اسطواني): قوة الانحراف الاسطواني" : "CYL (Cylinder): The cylindrical power for astigmatism"}</li>
                        <li>{language === 'ar' ? "AXIS (محور): اتجاه تصحيح الانحراف" : "AXIS: The direction of the cylindrical correction"}</li>
                        <li>{language === 'ar' ? "ADD: القوة الإضافية للقراءة" : "ADD: Additional power for reading"}</li>
                        <li>{language === 'ar' ? "PD: المسافة البؤبؤية" : "PD: Pupillary Distance"}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-gray-300">
            {language === 'ar' ? "إلغاء" : "Cancel"}
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            {language === 'ar' ? "حفظ" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
