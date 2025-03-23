
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { RxData } from "@/store/patientStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusCircle, Save, Glasses, Eye, ArrowRight } from "lucide-react";

interface AddRxDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rxData: RxData) => void;
  initialRx?: RxData;
}

export const AddRxDialog: React.FC<AddRxDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRx,
}) => {
  const { language } = useLanguageStore();
  
  const [rxData, setRxData] = useState<RxData>(
    initialRx || {
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
    setRxData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(rxData);
    onClose();
  };

  // Generate values for dropdowns
  const generateSphValues = () => {
    const values = [];
    for (let i = -30; i <= 20; i += 0.25) {
      values.push(i.toFixed(2));
    }
    return values;
  };

  const generateCylValues = () => {
    const values = [];
    for (let i = -10; i <= 0; i += 0.25) {
      values.push(i.toFixed(2));
    }
    return values;
  };

  const generateAxisValues = () => {
    const values = [];
    for (let i = 0; i <= 180; i += 1) {
      values.push(i.toString());
    }
    return values;
  };

  const generateAddValues = () => {
    const values = [""];
    for (let i = 0.75; i <= 4; i += 0.25) {
      values.push(i.toFixed(2));
    }
    return values;
  };

  const generatePdValues = () => {
    const values = [""];
    for (let i = 15; i <= 60; i += 1) {
      values.push(i.toString());
    }
    return values;
  };

  const sphValues = generateSphValues();
  const cylValues = generateCylValues();
  const axisValues = generateAxisValues();
  const addValues = generateAddValues();
  const pdValues = generatePdValues();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white rounded-xl shadow-xl border-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 -mx-6 -mt-6 rounded-t-xl">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Glasses className="h-6 w-6" />
            {language === "ar" ? "إضافة وصفة طبية جديدة" : "Add New Prescription"}
          </DialogTitle>
          <DialogDescription className="text-indigo-100 opacity-90 mt-1">
            {language === "ar"
              ? "أدخل بيانات الوصفة الطبية الجديدة للنظارات"
              : "Enter the details for the new glasses prescription"}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 md:p-6 pt-8">
          <div className="mb-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Right Eye (OD) Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-800">
                    {language === "ar" ? "العين اليمنى (OD)" : "Right Eye (OD)"}
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="sphereOD" className="text-blue-700 font-medium mb-1.5 block">SPH</Label>
                    <select
                      id="sphereOD"
                      className="w-full h-11 rounded-lg border border-blue-200 bg-white px-3 py-2 shadow-sm transition-colors hover:border-blue-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
                      value={rxData.sphereOD}
                      onChange={(e) => handleChange("sphereOD", e.target.value)}
                      dir="ltr"
                    >
                      <option value="">-</option>
                      {sphValues.map((val) => (
                        <option key={`sph-od-${val}`} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="cylOD" className="text-blue-700 font-medium mb-1.5 block">CYL</Label>
                    <select
                      id="cylOD"
                      className="w-full h-11 rounded-lg border border-blue-200 bg-white px-3 py-2 shadow-sm transition-colors hover:border-blue-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
                      value={rxData.cylOD}
                      onChange={(e) => handleChange("cylOD", e.target.value)}
                      dir="ltr"
                    >
                      <option value="">-</option>
                      {cylValues.map((val) => (
                        <option key={`cyl-od-${val}`} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="axisOD" className="text-blue-700 font-medium mb-1.5 block">AXIS</Label>
                    <select
                      id="axisOD"
                      className="w-full h-11 rounded-lg border border-blue-200 bg-white px-3 py-2 shadow-sm transition-colors hover:border-blue-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
                      value={rxData.axisOD}
                      onChange={(e) => handleChange("axisOD", e.target.value)}
                      dir="ltr"
                    >
                      <option value="">-</option>
                      {axisValues.map((val) => (
                        <option key={`axis-od-${val}`} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="addOD" className="text-blue-700 font-medium mb-1.5 block">ADD</Label>
                    <select
                      id="addOD"
                      className="w-full h-11 rounded-lg border border-blue-200 bg-white px-3 py-2 shadow-sm transition-colors hover:border-blue-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
                      value={rxData.addOD}
                      onChange={(e) => handleChange("addOD", e.target.value)}
                      dir="ltr"
                    >
                      <option value="">-</option>
                      {addValues.map((val) => (
                        <option key={`add-od-${val}`} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Left Eye (OS) Section */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-purple-800">
                    {language === "ar" ? "العين اليسرى (OS)" : "Left Eye (OS)"}
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="sphereOS" className="text-purple-700 font-medium mb-1.5 block">SPH</Label>
                    <select
                      id="sphereOS"
                      className="w-full h-11 rounded-lg border border-purple-200 bg-white px-3 py-2 shadow-sm transition-colors hover:border-purple-300 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none"
                      value={rxData.sphereOS}
                      onChange={(e) => handleChange("sphereOS", e.target.value)}
                      dir="ltr"
                    >
                      <option value="">-</option>
                      {sphValues.map((val) => (
                        <option key={`sph-os-${val}`} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="cylOS" className="text-purple-700 font-medium mb-1.5 block">CYL</Label>
                    <select
                      id="cylOS"
                      className="w-full h-11 rounded-lg border border-purple-200 bg-white px-3 py-2 shadow-sm transition-colors hover:border-purple-300 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none"
                      value={rxData.cylOS}
                      onChange={(e) => handleChange("cylOS", e.target.value)}
                      dir="ltr"
                    >
                      <option value="">-</option>
                      {cylValues.map((val) => (
                        <option key={`cyl-os-${val}`} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="axisOS" className="text-purple-700 font-medium mb-1.5 block">AXIS</Label>
                    <select
                      id="axisOS"
                      className="w-full h-11 rounded-lg border border-purple-200 bg-white px-3 py-2 shadow-sm transition-colors hover:border-purple-300 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none"
                      value={rxData.axisOS}
                      onChange={(e) => handleChange("axisOS", e.target.value)}
                      dir="ltr"
                    >
                      <option value="">-</option>
                      {axisValues.map((val) => (
                        <option key={`axis-os-${val}`} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="addOS" className="text-purple-700 font-medium mb-1.5 block">ADD</Label>
                    <select
                      id="addOS"
                      className="w-full h-11 rounded-lg border border-purple-200 bg-white px-3 py-2 shadow-sm transition-colors hover:border-purple-300 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none"
                      value={rxData.addOS}
                      onChange={(e) => handleChange("addOS", e.target.value)}
                      dir="ltr"
                    >
                      <option value="">-</option>
                      {addValues.map((val) => (
                        <option key={`add-os-${val}`} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* PD Section */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-xl border border-emerald-100 shadow-sm">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">
                  {language === "ar" ? "المسافة البؤبؤية (PD)" : "Pupillary Distance (PD)"}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="pdRight" className="text-emerald-700 font-medium mb-1.5 block">
                      {language === "ar" ? "اليمين" : "Right"}
                    </Label>
                    <select
                      id="pdRight"
                      className="w-full h-11 rounded-lg border border-emerald-200 bg-white px-3 py-2 shadow-sm transition-colors hover:border-emerald-300 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none"
                      value={rxData.pdRight}
                      onChange={(e) => handleChange("pdRight", e.target.value)}
                      dir="ltr"
                    >
                      <option value="">-</option>
                      {pdValues.map((val) => (
                        <option key={`pd-right-${val}`} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="pdLeft" className="text-emerald-700 font-medium mb-1.5 block">
                      {language === "ar" ? "اليسار" : "Left"}
                    </Label>
                    <select
                      id="pdLeft"
                      className="w-full h-11 rounded-lg border border-emerald-200 bg-white px-3 py-2 shadow-sm transition-colors hover:border-emerald-300 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none"
                      value={rxData.pdLeft}
                      onChange={(e) => handleChange("pdLeft", e.target.value)}
                      dir="ltr"
                    >
                      <option value="">-</option>
                      {pdValues.map((val) => (
                        <option key={`pd-left-${val}`} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 -mx-6 -mb-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="rounded-lg border-gray-300 hover:bg-gray-100 transition-all"
          >
            {language === "ar" ? "إلغاء" : "Cancel"}
          </Button>
          <Button 
            onClick={handleSave}
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white transition-all shadow-md"
          >
            <Save className="h-4 w-4 mr-2" />
            {language === "ar" ? "حفظ الوصفة" : "Save Prescription"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
