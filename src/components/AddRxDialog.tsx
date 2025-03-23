
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
import { Save, Glasses, Eye } from "lucide-react";

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
    onSave({
      ...rxData,
      createdAt: new Date().toISOString()
    });
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
      <DialogContent className="max-w-2xl bg-white rounded-lg shadow-xl border-0 p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-lg">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Glasses className="h-5 w-5" />
            {language === "ar" ? "إضافة وصفة جديدة" : "Add New Prescription"}
          </DialogTitle>
          <DialogDescription className="text-indigo-100 opacity-90 text-sm">
            {language === "ar"
              ? "أدخل بيانات الوصفة الطبية الجديدة للنظارات"
              : "Enter the details for the new glasses prescription"}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Prescription Table */}
            <div className="overflow-x-auto bg-white border border-indigo-100 rounded-lg shadow-sm">
              <table className="w-full text-sm ltr compact-table">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="p-2 text-left font-medium"></th>
                    <th className="p-2 text-left font-medium">SPH</th>
                    <th className="p-2 text-left font-medium">CYL</th>
                    <th className="p-2 text-left font-medium">AXIS</th>
                    <th className="p-2 text-left font-medium">ADD</th>
                    <th className="p-2 text-left font-medium">PD</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Right Eye (OD) Row */}
                  <tr className="border-b border-indigo-100 bg-indigo-50/50">
                    <td className="p-2 font-medium text-indigo-800 flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5 text-indigo-600" />
                      {language === "ar" ? "العين اليمنى (OD)" : "Right Eye (OD)"}
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full h-8 text-xs rounded border border-indigo-200 bg-white px-2 ltr"
                        value={rxData.sphereOD}
                        onChange={(e) => handleChange("sphereOD", e.target.value)}
                        dir="ltr"
                      >
                        <option value="">-</option>
                        {sphValues.map((val) => (
                          <option key={`sph-od-${val}`} value={val}>{val}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full h-8 text-xs rounded border border-indigo-200 bg-white px-2 ltr"
                        value={rxData.cylOD}
                        onChange={(e) => handleChange("cylOD", e.target.value)}
                        dir="ltr"
                      >
                        <option value="">-</option>
                        {cylValues.map((val) => (
                          <option key={`cyl-od-${val}`} value={val}>{val}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full h-8 text-xs rounded border border-indigo-200 bg-white px-2 ltr"
                        value={rxData.axisOD}
                        onChange={(e) => handleChange("axisOD", e.target.value)}
                        dir="ltr"
                      >
                        <option value="">-</option>
                        {axisValues.map((val) => (
                          <option key={`axis-od-${val}`} value={val}>{val}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full h-8 text-xs rounded border border-indigo-200 bg-white px-2 ltr"
                        value={rxData.addOD}
                        onChange={(e) => handleChange("addOD", e.target.value)}
                        dir="ltr"
                      >
                        <option value="">-</option>
                        {addValues.map((val) => (
                          <option key={`add-od-${val}`} value={val}>{val}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full h-8 text-xs rounded border border-indigo-200 bg-white px-2 ltr"
                        value={rxData.pdRight}
                        onChange={(e) => handleChange("pdRight", e.target.value)}
                        dir="ltr"
                      >
                        <option value="">-</option>
                        {pdValues.map((val) => (
                          <option key={`pd-right-${val}`} value={val}>{val}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  
                  {/* Left Eye (OS) Row */}
                  <tr className="bg-purple-50/50">
                    <td className="p-2 font-medium text-purple-800 flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5 text-purple-600" />
                      {language === "ar" ? "العين اليسرى (OS)" : "Left Eye (OS)"}
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full h-8 text-xs rounded border border-purple-200 bg-white px-2 ltr"
                        value={rxData.sphereOS}
                        onChange={(e) => handleChange("sphereOS", e.target.value)}
                        dir="ltr"
                      >
                        <option value="">-</option>
                        {sphValues.map((val) => (
                          <option key={`sph-os-${val}`} value={val}>{val}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full h-8 text-xs rounded border border-purple-200 bg-white px-2 ltr"
                        value={rxData.cylOS}
                        onChange={(e) => handleChange("cylOS", e.target.value)}
                        dir="ltr"
                      >
                        <option value="">-</option>
                        {cylValues.map((val) => (
                          <option key={`cyl-os-${val}`} value={val}>{val}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full h-8 text-xs rounded border border-purple-200 bg-white px-2 ltr"
                        value={rxData.axisOS}
                        onChange={(e) => handleChange("axisOS", e.target.value)}
                        dir="ltr"
                      >
                        <option value="">-</option>
                        {axisValues.map((val) => (
                          <option key={`axis-os-${val}`} value={val}>{val}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full h-8 text-xs rounded border border-purple-200 bg-white px-2 ltr"
                        value={rxData.addOS}
                        onChange={(e) => handleChange("addOS", e.target.value)}
                        dir="ltr"
                      >
                        <option value="">-</option>
                        {addValues.map((val) => (
                          <option key={`add-os-${val}`} value={val}>{val}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full h-8 text-xs rounded border border-purple-200 bg-white px-2 ltr"
                        value={rxData.pdLeft}
                        onChange={(e) => handleChange("pdLeft", e.target.value)}
                        dir="ltr"
                      >
                        <option value="">-</option>
                        {pdValues.map((val) => (
                          <option key={`pd-left-${val}`} value={val}>{val}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <DialogFooter className="bg-gray-50 p-4 border-t flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="rounded-md border-gray-300 hover:bg-gray-100 transition-all"
          >
            {language === "ar" ? "إلغاء" : "Cancel"}
          </Button>
          <Button 
            onClick={handleSave}
            className="rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
          >
            <Save className="h-4 w-4 mr-2" />
            {language === "ar" ? "حفظ الوصفة" : "Save Prescription"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
