
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
import { PlusCircle, Save } from "lucide-react";

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
      <DialogContent className="max-w-4xl bg-white rounded-lg shadow-lg border border-blue-100">
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg p-4">
          <DialogTitle className="text-xl flex items-center gap-2 text-blue-700">
            <PlusCircle className="h-5 w-5" />
            {language === "ar" ? "إضافة وصفة طبية جديدة" : "Add New Prescription"}
          </DialogTitle>
          <DialogDescription>
            {language === "ar"
              ? "أدخل بيانات الوصفة الطبية الجديدة"
              : "Enter the details for the new prescription"}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-blue-800">
              {language === "ar" ? "بيانات الوصفة" : "Prescription Details"}
            </h3>
            
            <div className="overflow-hidden rounded-md border border-blue-100 mb-4">
              <table className="w-full ltr" dir="ltr">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="p-2 text-left font-medium text-blue-700"></th>
                    <th className="p-2 text-left font-medium text-blue-700">SPH</th>
                    <th className="p-2 text-left font-medium text-blue-700">CYL</th>
                    <th className="p-2 text-left font-medium text-blue-700">AXIS</th>
                    <th className="p-2 text-left font-medium text-blue-700">ADD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-blue-50/30 border-b">
                    <td className="p-2 font-medium">
                      {language === "ar" ? "العين اليمنى (OD)" : "Right Eye (OD)"}
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full border border-blue-200 rounded px-2 py-1"
                        value={rxData.sphereOD}
                        onChange={(e) => handleChange("sphereOD", e.target.value)}
                      >
                        <option value="">-</option>
                        {sphValues.map((val) => (
                          <option key={`sph-od-${val}`} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full border border-blue-200 rounded px-2 py-1"
                        value={rxData.cylOD}
                        onChange={(e) => handleChange("cylOD", e.target.value)}
                      >
                        <option value="">-</option>
                        {cylValues.map((val) => (
                          <option key={`cyl-od-${val}`} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full border border-blue-200 rounded px-2 py-1"
                        value={rxData.axisOD}
                        onChange={(e) => handleChange("axisOD", e.target.value)}
                      >
                        <option value="">-</option>
                        {axisValues.map((val) => (
                          <option key={`axis-od-${val}`} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full border border-blue-200 rounded px-2 py-1"
                        value={rxData.addOD}
                        onChange={(e) => handleChange("addOD", e.target.value)}
                      >
                        <option value="">-</option>
                        {addValues.map((val) => (
                          <option key={`add-od-${val}`} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">
                      {language === "ar" ? "العين اليسرى (OS)" : "Left Eye (OS)"}
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full border border-blue-200 rounded px-2 py-1"
                        value={rxData.sphereOS}
                        onChange={(e) => handleChange("sphereOS", e.target.value)}
                      >
                        <option value="">-</option>
                        {sphValues.map((val) => (
                          <option key={`sph-os-${val}`} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full border border-blue-200 rounded px-2 py-1"
                        value={rxData.cylOS}
                        onChange={(e) => handleChange("cylOS", e.target.value)}
                      >
                        <option value="">-</option>
                        {cylValues.map((val) => (
                          <option key={`cyl-os-${val}`} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full border border-blue-200 rounded px-2 py-1"
                        value={rxData.axisOS}
                        onChange={(e) => handleChange("axisOS", e.target.value)}
                      >
                        <option value="">-</option>
                        {axisValues.map((val) => (
                          <option key={`axis-os-${val}`} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        className="w-full border border-blue-200 rounded px-2 py-1"
                        value={rxData.addOS}
                        onChange={(e) => handleChange("addOS", e.target.value)}
                      >
                        <option value="">-</option>
                        {addValues.map((val) => (
                          <option key={`add-os-${val}`} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-1 block">
                  {language === "ar" ? "المسافة البؤبؤية (يمين)" : "Pupillary Distance (Right)"}
                </Label>
                <select
                  className="w-full border border-blue-200 rounded px-2 py-1"
                  value={rxData.pdRight}
                  onChange={(e) => handleChange("pdRight", e.target.value)}
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
                <Label className="mb-1 block">
                  {language === "ar" ? "المسافة البؤبؤية (يسار)" : "Pupillary Distance (Left)"}
                </Label>
                <select
                  className="w-full border border-blue-200 rounded px-2 py-1"
                  value={rxData.pdLeft}
                  onChange={(e) => handleChange("pdLeft", e.target.value)}
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
        
        <DialogFooter className="bg-gray-50 p-4 rounded-b-lg border-t">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="mr-2"
          >
            {language === "ar" ? "إلغاء" : "Cancel"}
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {language === "ar" ? "حفظ الوصفة" : "Save Prescription"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
