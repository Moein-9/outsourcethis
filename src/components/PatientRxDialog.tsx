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
  AlertCircle,
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
  const { language, t } = useLanguageStore();
  
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-indigo-700">
            {language === 'ar' ? "وصفة طبية جديدة" : "New Prescription"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <Card className="border-indigo-200 shadow-md bg-gradient-to-r from-indigo-50/50 to-purple-50/50 overflow-hidden">
            <CardContent className="p-4">
              {/* Compact RX Table Layout - Always kept in English format (LTR) */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse ltr">
                  <thead>
                    <tr>
                      <th className="p-2 bg-indigo-100 text-indigo-800 font-semibold border border-indigo-200 text-left"></th>
                      <th className="p-2 bg-indigo-100 text-indigo-800 font-semibold border border-indigo-200 text-left">SPH</th>
                      <th className="p-2 bg-indigo-100 text-indigo-800 font-semibold border border-indigo-200 text-left">CYL</th>
                      <th className="p-2 bg-indigo-100 text-indigo-800 font-semibold border border-indigo-200 text-left">AXIS</th>
                      <th className="p-2 bg-indigo-100 text-indigo-800 font-semibold border border-indigo-200 text-left">ADD</th>
                      <th className="p-2 bg-indigo-100 text-indigo-800 font-semibold border border-indigo-200 text-left">PD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Right Eye (OD) Row - Keeping consistent eye icon, translating text only */}
                    <tr>
                      <td className="p-2 bg-indigo-50 text-indigo-800 font-medium border border-indigo-200 text-left">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-indigo-600" />
                          {language === 'ar' ? "العين اليمنى (OD)" : "Right Eye (OD)"}
                        </div>
                      </td>
                      <td className="p-1 border border-indigo-200">
                        <Select
                          value={rx.sphereOD || "none"}
                          onValueChange={(value) => handleChange("sphereOD", value)}
                        >
                          <SelectTrigger className="w-full h-9 bg-white focus:ring-1 focus:ring-indigo-300">
                            <SelectValue placeholder={language === 'ar' ? "اختر" : "Select"} />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            <SelectItem value="none">-</SelectItem>
                            {generateSphOptions()}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-1 border border-indigo-200">
                        <Select
                          value={rx.cylOD || "none"}
                          onValueChange={(value) => handleChange("cylOD", value)}
                        >
                          <SelectTrigger className="w-full h-9 bg-white focus:ring-1 focus:ring-indigo-300">
                            <SelectValue placeholder={language === 'ar' ? "اختر" : "Select"} />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            <SelectItem value="none">-</SelectItem>
                            {generateCylOptions()}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-1 border border-indigo-200">
                        <Select
                          value={rx.axisOD || "none"}
                          onValueChange={(value) => handleChange("axisOD", value)}
                        >
                          <SelectTrigger className="w-full h-9 bg-white focus:ring-1 focus:ring-indigo-300">
                            <SelectValue placeholder={language === 'ar' ? "اختر" : "Select"} />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            <SelectItem value="none">-</SelectItem>
                            {generateAxisOptions()}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-1 border border-indigo-200">
                        <Select
                          value={rx.addOD || "none"}
                          onValueChange={(value) => handleChange("addOD", value)}
                        >
                          <SelectTrigger className="w-full h-9 bg-white focus:ring-1 focus:ring-indigo-300">
                            <SelectValue placeholder={language === 'ar' ? "اختر" : "Select"} />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {generateAddOptions()}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-1 border border-indigo-200">
                        <Select
                          value={rx.pdRight || "none"}
                          onValueChange={(value) => handleChange("pdRight", value)}
                        >
                          <SelectTrigger className="w-full h-9 bg-white focus:ring-1 focus:ring-indigo-300">
                            <SelectValue placeholder={language === 'ar' ? "اختر" : "Select"} />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {generatePdOptions()}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                    
                    {/* Left Eye (OS) Row - Same eye icon, only translating text */}
                    <tr>
                      <td className="p-2 bg-purple-50 text-purple-800 font-medium border border-purple-200 text-left">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-indigo-600" />
                          {language === 'ar' ? "العين اليسرى (OS)" : "Left Eye (OS)"}
                        </div>
                      </td>
                      <td className="p-1 border border-purple-200">
                        <Select
                          value={rx.sphereOS || "none"}
                          onValueChange={(value) => handleChange("sphereOS", value)}
                        >
                          <SelectTrigger className="w-full h-9 bg-white focus:ring-1 focus:ring-purple-300">
                            <SelectValue placeholder={language === 'ar' ? "اختر" : "Select"} />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            <SelectItem value="none">-</SelectItem>
                            {generateSphOptions()}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-1 border border-purple-200">
                        <Select
                          value={rx.cylOS || "none"}
                          onValueChange={(value) => handleChange("cylOS", value)}
                        >
                          <SelectTrigger className="w-full h-9 bg-white focus:ring-1 focus:ring-purple-300">
                            <SelectValue placeholder={language === 'ar' ? "اختر" : "Select"} />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            <SelectItem value="none">-</SelectItem>
                            {generateCylOptions()}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-1 border border-purple-200">
                        <Select
                          value={rx.axisOS || "none"}
                          onValueChange={(value) => handleChange("axisOS", value)}
                        >
                          <SelectTrigger className="w-full h-9 bg-white focus:ring-1 focus:ring-purple-300">
                            <SelectValue placeholder={language === 'ar' ? "اختر" : "Select"} />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            <SelectItem value="none">-</SelectItem>
                            {generateAxisOptions()}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-1 border border-purple-200">
                        <Select
                          value={rx.addOS || "none"}
                          onValueChange={(value) => handleChange("addOS", value)}
                        >
                          <SelectTrigger className="w-full h-9 bg-white focus:ring-1 focus:ring-purple-300">
                            <SelectValue placeholder={language === 'ar' ? "اختر" : "Select"} />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {generateAddOptions()}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-1 border border-purple-200">
                        <Select
                          value={rx.pdLeft || "none"}
                          onValueChange={(value) => handleChange("pdLeft", value)}
                        >
                          <SelectTrigger className="w-full h-9 bg-white focus:ring-1 focus:ring-purple-300">
                            <SelectValue placeholder={language === 'ar' ? "اختر" : "Select"} />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {generatePdOptions()}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Educational Information - Text translates based on language */}
              <div className="mt-4 bg-amber-50 p-3 rounded-lg border border-amber-200 text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
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
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-gray-300">
            {language === 'ar' ? "إلغاء" : "Cancel"}
          </Button>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
            {language === 'ar' ? "حفظ" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
