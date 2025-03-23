
import React from "react";
import { RxData } from "@/store/patientStore";
import { useLanguageStore } from "@/store/languageStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Save, Eye, Plus, FileSymlink } from "lucide-react";

interface PatientRxDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rx: RxData) => void;
  initialRx: RxData;
}

export const PatientRxDialog: React.FC<PatientRxDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRx,
}) => {
  const { language, t } = useLanguageStore();
  const [rx, setRx] = React.useState<RxData>(initialRx);

  React.useEffect(() => {
    setRx(initialRx);
  }, [initialRx]);

  const handleSave = () => {
    onSave(rx);
  };

  // Helper for generating sphere/cylinder options
  const generateDiopterOptions = () => {
    const options = [];
    
    // Negative values from -10.00 to -0.25 in steps of 0.25
    for (let i = -10; i < 0; i += 0.25) {
      options.push(i.toFixed(2));
    }
    
    // Zero
    options.push("0.00");
    
    // Positive values from +0.25 to +10.00 in steps of 0.25
    for (let i = 0.25; i <= 10; i += 0.25) {
      options.push(`+${i.toFixed(2)}`);
    }
    
    return options;
  };
  
  // Helper for generating axis options
  const generateAxisOptions = () => {
    const options = [];
    
    // Axis from 1 to 180 in steps of 1
    for (let i = 1; i <= 180; i++) {
      options.push(i.toString());
    }
    
    return options;
  };
  
  // Helper for generating add options
  const generateAddOptions = () => {
    const options = ["none"];
    
    // Add from +0.25 to +4.00 in steps of 0.25
    for (let i = 0.25; i <= 4; i += 0.25) {
      options.push(`+${i.toFixed(2)}`);
    }
    
    return options;
  };
  
  // Helper for generating PD options
  const generatePdOptions = () => {
    const options = [];
    
    // PD from 50 to 80 in steps of 0.5
    for (let i = 50; i <= 80; i += 0.5) {
      options.push(i.toFixed(1));
    }
    
    return options;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gradient-to-b from-white to-slate-50 shadow-lg border-slate-200">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-primary">
            <Eye className="h-6 w-6 text-indigo-500" />
            {language === 'ar' ? "وصفة طبية جديدة" : "New Prescription"}
          </DialogTitle>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-indigo-700">
              <FileSymlink className="h-5 w-5" />
              <span className="font-medium">{language === 'ar' ? "وصفة طبية جديدة" : "New Prescription"}</span>
            </div>
            <p className="text-sm text-slate-600">
              {language === 'ar' 
                ? "أدخل تفاصيل الوصفة الطبية لكلا العينين. جميع القيم تستخدم التنسيق الإنجليزي القياسي." 
                : "Enter prescription details for both eyes. All values use standard English notation."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Horizontal Table Layout */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse ltr">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border border-slate-200 p-2 text-sm font-medium text-slate-700"></th>
                      <th className="border border-slate-200 p-2 text-sm font-medium text-slate-700">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                          <span>{t("rightEye")} (OD)</span>
                        </div>
                      </th>
                      <th className="border border-slate-200 p-2 text-sm font-medium text-slate-700">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                          <span>{t("leftEye")} (OS)</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* SPH Row */}
                    <tr>
                      <td className="border border-slate-200 p-2 font-medium text-slate-700 bg-slate-50">SPH</td>
                      <td className="border border-slate-200 p-2">
                        <Select
                          value={rx.sphereOD || "none"}
                          onValueChange={(value) => setRx({ ...rx, sphereOD: value === "none" ? "" : value })}
                        >
                          <SelectTrigger className="border-slate-300 focus:ring-indigo-500">
                            <SelectValue placeholder="Select SPH" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t("choose")}</SelectItem>
                            {generateDiopterOptions().map((value) => (
                              <SelectItem key={`sph-od-${value}`} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="border border-slate-200 p-2">
                        <Select
                          value={rx.sphereOS || "none"}
                          onValueChange={(value) => setRx({ ...rx, sphereOS: value === "none" ? "" : value })}
                        >
                          <SelectTrigger className="border-slate-300 focus:ring-rose-500">
                            <SelectValue placeholder="Select SPH" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t("choose")}</SelectItem>
                            {generateDiopterOptions().map((value) => (
                              <SelectItem key={`sph-os-${value}`} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                    
                    {/* CYL Row */}
                    <tr>
                      <td className="border border-slate-200 p-2 font-medium text-slate-700 bg-slate-50">CYL</td>
                      <td className="border border-slate-200 p-2">
                        <Select
                          value={rx.cylOD || "none"}
                          onValueChange={(value) => setRx({ ...rx, cylOD: value === "none" ? "" : value })}
                        >
                          <SelectTrigger className="border-slate-300 focus:ring-indigo-500">
                            <SelectValue placeholder="Select CYL" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t("choose")}</SelectItem>
                            {generateDiopterOptions().map((value) => (
                              <SelectItem key={`cyl-od-${value}`} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="border border-slate-200 p-2">
                        <Select
                          value={rx.cylOS || "none"}
                          onValueChange={(value) => setRx({ ...rx, cylOS: value === "none" ? "" : value })}
                        >
                          <SelectTrigger className="border-slate-300 focus:ring-rose-500">
                            <SelectValue placeholder="Select CYL" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t("choose")}</SelectItem>
                            {generateDiopterOptions().map((value) => (
                              <SelectItem key={`cyl-os-${value}`} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                    
                    {/* AXIS Row */}
                    <tr>
                      <td className="border border-slate-200 p-2 font-medium text-slate-700 bg-slate-50">AXIS</td>
                      <td className="border border-slate-200 p-2">
                        <Select
                          value={rx.axisOD || "none"}
                          onValueChange={(value) => setRx({ ...rx, axisOD: value === "none" ? "" : value })}
                        >
                          <SelectTrigger className="border-slate-300 focus:ring-indigo-500">
                            <SelectValue placeholder="Select AXIS" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t("choose")}</SelectItem>
                            {generateAxisOptions().map((value) => (
                              <SelectItem key={`axis-od-${value}`} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="border border-slate-200 p-2">
                        <Select
                          value={rx.axisOS || "none"}
                          onValueChange={(value) => setRx({ ...rx, axisOS: value === "none" ? "" : value })}
                        >
                          <SelectTrigger className="border-slate-300 focus:ring-rose-500">
                            <SelectValue placeholder="Select AXIS" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t("choose")}</SelectItem>
                            {generateAxisOptions().map((value) => (
                              <SelectItem key={`axis-os-${value}`} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                    
                    {/* ADD Row */}
                    <tr>
                      <td className="border border-slate-200 p-2 font-medium text-slate-700 bg-slate-50">ADD</td>
                      <td className="border border-slate-200 p-2">
                        <Select
                          value={rx.addOD || "none"}
                          onValueChange={(value) => setRx({ ...rx, addOD: value === "none" ? "" : value })}
                        >
                          <SelectTrigger className="border-slate-300 focus:ring-indigo-500">
                            <SelectValue placeholder="Select ADD" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t("none")}</SelectItem>
                            {generateAddOptions().filter(v => v !== "none").map((value) => (
                              <SelectItem key={`add-od-${value}`} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="border border-slate-200 p-2">
                        <Select
                          value={rx.addOS || "none"}
                          onValueChange={(value) => setRx({ ...rx, addOS: value === "none" ? "" : value })}
                        >
                          <SelectTrigger className="border-slate-300 focus:ring-rose-500">
                            <SelectValue placeholder="Select ADD" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t("none")}</SelectItem>
                            {generateAddOptions().filter(v => v !== "none").map((value) => (
                              <SelectItem key={`add-os-${value}`} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                    
                    {/* PD Row */}
                    <tr>
                      <td className="border border-slate-200 p-2 font-medium text-slate-700 bg-slate-50">PD</td>
                      <td className="border border-slate-200 p-2">
                        <Select
                          value={rx.pdRight || "none"}
                          onValueChange={(value) => setRx({ ...rx, pdRight: value === "none" ? "" : value })}
                        >
                          <SelectTrigger className="border-slate-300 focus:ring-indigo-500">
                            <SelectValue placeholder="Select PD" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t("choose")}</SelectItem>
                            {generatePdOptions().map((value) => (
                              <SelectItem key={`pd-od-${value}`} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="border border-slate-200 p-2">
                        <Select
                          value={rx.pdLeft || "none"}
                          onValueChange={(value) => setRx({ ...rx, pdLeft: value === "none" ? "" : value })}
                        >
                          <SelectTrigger className="border-slate-300 focus:ring-rose-500">
                            <SelectValue placeholder="Select PD" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t("choose")}</SelectItem>
                            {generatePdOptions().map((value) => (
                              <SelectItem key={`pd-os-${value}`} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 border-slate-300"
          >
            {language === 'ar' ? "إلغاء" : "Cancel"}
          </Button>
          <Button 
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {language === 'ar' ? "حفظ" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
