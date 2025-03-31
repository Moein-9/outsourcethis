import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Eye, AlertTriangle } from "lucide-react";
import { ContactLensRx } from "@/store/patientStore";
import { useLanguageStore } from "@/store/languageStore";

interface ContactLensFormProps {
  rxData: ContactLensRx;
  onChange: (data: ContactLensRx) => void;
  showMissingRxWarning?: boolean;
}

export const ContactLensForm: React.FC<ContactLensFormProps> = ({ 
  rxData, 
  onChange,
  showMissingRxWarning = false
}) => {
  const { language, t } = useLanguageStore();
  const [validationErrors, setValidationErrors] = useState({
    rightEye: { cylinderAxisError: false },
    leftEye: { cylinderAxisError: false }
  });

  const handleRightEyeChange = (field: keyof ContactLensRx["rightEye"], value: string) => {
    const updatedRx = {
      ...rxData,
      rightEye: {
        ...rxData.rightEye,
        [field]: value
      }
    };
    onChange(updatedRx);
    
    if (field === 'cylinder' || field === 'axis') {
      validateCylinderAxis('rightEye', updatedRx.rightEye.cylinder, updatedRx.rightEye.axis);
    }
  };

  const handleLeftEyeChange = (field: keyof ContactLensRx["leftEye"], value: string) => {
    const updatedRx = {
      ...rxData,
      leftEye: {
        ...rxData.leftEye,
        [field]: value
      }
    };
    onChange(updatedRx);
    
    if (field === 'cylinder' || field === 'axis') {
      validateCylinderAxis('leftEye', updatedRx.leftEye.cylinder, updatedRx.leftEye.axis);
    }
  };
  
  const validateCylinderAxis = (eye: 'rightEye' | 'leftEye', cylinder: string, axis: string) => {
    const hasCylinder = cylinder !== "-" && cylinder !== "";
    const hasAxis = axis !== "-" && axis !== "";
    
    setValidationErrors(prev => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        cylinderAxisError: hasCylinder && !hasAxis
      }
    }));
  };
  
  useEffect(() => {
    validateCylinderAxis('rightEye', rxData.rightEye.cylinder, rxData.rightEye.axis);
    validateCylinderAxis('leftEye', rxData.leftEye.cylinder, rxData.leftEye.axis);
  }, [rxData]);

  const generateSphereOptions = () => {
    const options = [];
    options.push(<option key="sph-none" value="-">-</option>);
    
    for (let i = 4.00; i >= 0.25; i -= 0.25) {
      const value = i.toFixed(2);
      options.push(
        <option key={`sph-plus-${value}`} value={`+${value}`}>+{value}</option>
      );
    }
    
    options.push(<option key="sph-zero" value="0.00">0.00</option>);
    
    for (let i = -0.25; i >= -9.00; i -= 0.25) {
      const value = i.toFixed(2);
      options.push(
        <option key={`sph-minus-${Math.abs(i)}`} value={value}>{value}</option>
      );
    }
    
    return options;
  };

  const generateCylinderOptions = () => {
    const cylValues = ["-", "-0.75", "-1.25", "-1.75", "-2.25"];
    return cylValues.map(value => (
      <option key={`cyl-${value}`} value={value}>{value}</option>
    ));
  };

  const generateAxisOptions = () => {
    const options = [];
    options.push(<option key="axis-none" value="-">-</option>);
    
    for (let i = 1; i <= 180; i += 1) {
      options.push(
        <option key={`axis-${i}`} value={i.toString()}>{i}°</option>
      );
    }
    
    return options;
  };

  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  const hasValidationErrors = validationErrors.rightEye.cylinderAxisError || 
                              validationErrors.leftEye.cylinderAxisError;

  const columnWidths = {
    label: "w-[15%]",
    sphere: "w-[17%]",
    cylinder: "w-[17%]",
    axis: "w-[20%]",
    bc: "w-[15%]",
    dia: "w-[16%]"
  };

  return (
    <div className={`rounded-lg border p-4 bg-white shadow-sm ${dirClass}`}>
      <div className={`flex items-center justify-between mb-4 pb-2 border-b ${textAlignClass}`}>
        <h4 className="font-medium text-purple-700 flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-600" />
          {language === 'ar' ? "وصفة العدسات اللاصقة" : "Contact Lens Prescription"}
        </h4>
      </div>

      {showMissingRxWarning && (
        <div className="p-3 mb-4 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-700 text-sm">
            {language === 'ar' ? "لا توجد وصفة عدسات لاصقة متاحة" : "No contact lens prescription is available"}
          </p>
        </div>
      )}

      <div className="space-y-6">
        <table className="w-full border-collapse ltr">
          <thead>
            <tr className="bg-purple-50">
              <th className={`border border-purple-100 p-2 text-purple-700 text-sm ${columnWidths.label}`}></th>
              <th className={`border border-purple-100 p-2 text-purple-700 text-sm ${columnWidths.sphere}`}>SPHERE (SPH)</th>
              <th className={`border border-purple-100 p-2 text-purple-700 text-sm ${columnWidths.cylinder}`}>CYLINDER (CYL)</th>
              <th className={`border border-purple-100 p-2 text-purple-700 text-sm ${columnWidths.axis}`}>AXIS</th>
              <th className={`border border-purple-100 p-2 text-purple-700 text-sm ${columnWidths.bc}`}>BASE CURVE (BC)</th>
              <th className={`border border-purple-100 p-2 text-purple-700 text-sm ${columnWidths.dia}`}>DIAMETER (DIA)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-purple-50/30">
              <td className={`border border-purple-100 p-2 ${columnWidths.label}`}>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="font-medium text-purple-800">{language === 'ar' ? "العين اليمنى" : "Right Eye"} (OD)</span>
                </div>
              </td>
              <td className={`border border-purple-100 p-2 ${columnWidths.sphere}`}>
                <select 
                  className="w-full p-1 rounded-md border border-purple-200 bg-white text-sm"
                  value={rxData.rightEye.sphere}
                  onChange={(e) => handleRightEyeChange("sphere", e.target.value)}
                >
                  {generateSphereOptions()}
                </select>
              </td>
              <td className={`border border-purple-100 p-2 ${columnWidths.cylinder}`}>
                <select 
                  className="w-full p-1 rounded-md border border-purple-200 bg-white text-sm"
                  value={rxData.rightEye.cylinder}
                  onChange={(e) => handleRightEyeChange("cylinder", e.target.value)}
                >
                  {generateCylinderOptions()}
                </select>
              </td>
              <td className={`border border-purple-100 p-2 ${columnWidths.axis}`}>
                <select 
                  className={`w-full p-1 rounded-md border ${validationErrors.rightEye.cylinderAxisError ? 'border-red-500 bg-red-50' : 'border-purple-200 bg-white'} text-sm`}
                  value={rxData.rightEye.axis}
                  onChange={(e) => handleRightEyeChange("axis", e.target.value)}
                >
                  {generateAxisOptions()}
                </select>
              </td>
              <td className={`border border-purple-100 p-2 ${columnWidths.bc}`}>
                <select 
                  className="w-full p-1 rounded-md border border-purple-200 bg-white text-sm"
                  value={rxData.rightEye.bc}
                  onChange={(e) => handleRightEyeChange("bc", e.target.value)}
                >
                  <option value="-">-</option>
                  <option value="8.4">8.4</option>
                  <option value="8.5">8.5</option>
                  <option value="8.6">8.6</option>
                  <option value="8.7">8.7</option>
                  <option value="8.8">8.8</option>
                </select>
              </td>
              <td className={`border border-purple-100 p-2 ${columnWidths.dia}`}>
                <select
                  className="w-full p-1 rounded-md border border-purple-200 bg-white text-sm"
                  value={rxData.rightEye.dia}
                  onChange={(e) => handleRightEyeChange("dia", e.target.value)}
                >
                  <option value="-">-</option>
                  <option value="14.0">14.0</option>
                  <option value="14.2">14.2</option>
                  <option value="14.4">14.4</option>
                  <option value="14.5">14.5</option>
                </select>
              </td>
            </tr>
            
            <tr className="bg-indigo-50/30">
              <td className={`border border-indigo-100 p-2 ${columnWidths.label}`}>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span className="font-medium text-indigo-800">{language === 'ar' ? "العين اليسرى" : "Left Eye"} (OS)</span>
                </div>
              </td>
              <td className={`border border-indigo-100 p-2 ${columnWidths.sphere}`}>
                <select 
                  className="w-full p-1 rounded-md border border-indigo-200 bg-white text-sm"
                  value={rxData.leftEye.sphere}
                  onChange={(e) => handleLeftEyeChange("sphere", e.target.value)}
                >
                  {generateSphereOptions()}
                </select>
              </td>
              <td className={`border border-indigo-100 p-2 ${columnWidths.cylinder}`}>
                <select 
                  className="w-full p-1 rounded-md border border-indigo-200 bg-white text-sm"
                  value={rxData.leftEye.cylinder}
                  onChange={(e) => handleLeftEyeChange("cylinder", e.target.value)}
                >
                  {generateCylinderOptions()}
                </select>
              </td>
              <td className={`border border-indigo-100 p-2 ${columnWidths.axis}`}>
                <select 
                  className={`w-full p-1 rounded-md border ${validationErrors.leftEye.cylinderAxisError ? 'border-red-500 bg-red-50' : 'border-indigo-200 bg-white'} text-sm`}
                  value={rxData.leftEye.axis}
                  onChange={(e) => handleLeftEyeChange("axis", e.target.value)}
                >
                  {generateAxisOptions()}
                </select>
              </td>
              <td className={`border border-indigo-100 p-2 ${columnWidths.bc}`}>
                <select 
                  className="w-full p-1 rounded-md border border-indigo-200 bg-white text-sm"
                  value={rxData.leftEye.bc}
                  onChange={(e) => handleLeftEyeChange("bc", e.target.value)}
                >
                  <option value="-">-</option>
                  <option value="8.4">8.4</option>
                  <option value="8.5">8.5</option>
                  <option value="8.6">8.6</option>
                  <option value="8.7">8.7</option>
                  <option value="8.8">8.8</option>
                </select>
              </td>
              <td className={`border border-indigo-100 p-2 ${columnWidths.dia}`}>
                <select
                  className="w-full p-1 rounded-md border border-indigo-200 bg-white text-sm"
                  value={rxData.leftEye.dia}
                  onChange={(e) => handleLeftEyeChange("dia", e.target.value)}
                >
                  <option value="-">-</option>
                  <option value="14.0">14.0</option>
                  <option value="14.2">14.2</option>
                  <option value="14.4">14.4</option>
                  <option value="14.5">14.5</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        
        {hasValidationErrors && (
          <div className="p-3 mt-2 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">
              {language === 'ar' 
                ? "إذا تم تحديد قيمة الأسطوانة، يجب تحديد قيمة المحور أيضًا."
                : "If cylinder value is provided, axis value is required."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
