
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Eye, AlertTriangle } from "lucide-react";
import { ContactLensRx } from "@/store/patientStore";
import { useLanguageStore } from "@/store/languageStore";
import { CustomSelect } from "./ui/custom-select";

interface ContactLensFormProps {
  rxData: ContactLensRx;
  onChange: (data: ContactLensRx) => void;
  showMissingRxWarning?: boolean;
  readOnly?: boolean;
}

export const ContactLensForm: React.FC<ContactLensFormProps> = ({ 
  rxData, 
  onChange,
  showMissingRxWarning = false,
  readOnly = false
}) => {
  const { language, t } = useLanguageStore();
  const [validationErrors, setValidationErrors] = useState({
    rightEye: { cylinderAxisError: false },
    leftEye: { cylinderAxisError: false }
  });

  const handleRightEyeChange = (field: keyof ContactLensRx["rightEye"], value: string) => {
    if (readOnly) return;
    
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
    if (readOnly) return;
    
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
    const options = ["-"];
    
    for (let i = 4.00; i >= 0.25; i -= 0.25) {
      const value = i.toFixed(2);
      options.push(`+${value}`);
    }
    
    options.push("0.00");
    
    for (let i = -0.25; i >= -9.00; i -= 0.25) {
      const value = i.toFixed(2);
      options.push(value);
    }
    
    return options;
  };

  const generateCylinderOptions = () => {
    return ["-", "-0.75", "-1.25", "-1.75", "-2.25"];
  };

  const generateAxisOptions = () => {
    const options = ["-"];
    
    for (let i = 1; i <= 180; i += 1) {
      options.push(i.toString());
    }
    
    return options;
  };

  const generateBCOptions = () => {
    return ["-", "8.4", "8.5", "8.6", "8.7", "8.8"];
  };

  const generateDiaOptions = () => {
    return ["-", "14.0", "14.2", "14.4", "14.5"];
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

  // Render form field (select or read-only display)
  const renderFormField = (
    eye: 'rightEye' | 'leftEye',
    field: keyof ContactLensRx['rightEye'],
    value: string,
    options: string[],
    errorCondition = false,
    handleChange: (field: keyof ContactLensRx['rightEye' | 'leftEye'], value: string) => void,
    bgClass = 'bg-white',
    borderClass = ''
  ) => {
    // For read-only mode, show a clear display of the value
    if (readOnly) {
      return (
        <div className={`p-1 min-h-[30px] flex items-center justify-center ${bgClass} rounded-md text-center text-sm font-medium border ${borderClass || 'border-gray-200'}`}>
          {value === '-' ? '—' : value}
        </div>
      );
    }
    
    return (
      <div className="w-full">
        <CustomSelect
          label=""
          options={options}
          value={value}
          onChange={(newValue) => handleChange(field, newValue)}
          className={errorCondition ? 'border-red-500' : ''}
        />
      </div>
    );
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
                {renderFormField(
                  'rightEye',
                  'sphere',
                  rxData.rightEye.sphere,
                  generateSphereOptions(),
                  false,
                  handleRightEyeChange,
                  'bg-white',
                  'border-purple-200'
                )}
              </td>
              <td className={`border border-purple-100 p-2 ${columnWidths.cylinder}`}>
                {renderFormField(
                  'rightEye',
                  'cylinder',
                  rxData.rightEye.cylinder,
                  generateCylinderOptions(),
                  false,
                  handleRightEyeChange,
                  'bg-white',
                  'border-purple-200'
                )}
              </td>
              <td className={`border border-purple-100 p-2 ${columnWidths.axis}`}>
                {renderFormField(
                  'rightEye',
                  'axis',
                  rxData.rightEye.axis,
                  generateAxisOptions(),
                  validationErrors.rightEye.cylinderAxisError,
                  handleRightEyeChange,
                  validationErrors.rightEye.cylinderAxisError ? 'bg-red-50' : 'bg-white',
                  'border-purple-200'
                )}
              </td>
              <td className={`border border-purple-100 p-2 ${columnWidths.bc}`}>
                {renderFormField(
                  'rightEye',
                  'bc',
                  rxData.rightEye.bc,
                  generateBCOptions(),
                  false,
                  handleRightEyeChange,
                  'bg-white',
                  'border-purple-200'
                )}
              </td>
              <td className={`border border-purple-100 p-2 ${columnWidths.dia}`}>
                {renderFormField(
                  'rightEye',
                  'dia',
                  rxData.rightEye.dia,
                  generateDiaOptions(),
                  false,
                  handleRightEyeChange,
                  'bg-white',
                  'border-purple-200'
                )}
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
                {renderFormField(
                  'leftEye',
                  'sphere',
                  rxData.leftEye.sphere,
                  generateSphereOptions(),
                  false,
                  handleLeftEyeChange,
                  'bg-white',
                  'border-indigo-200'
                )}
              </td>
              <td className={`border border-indigo-100 p-2 ${columnWidths.cylinder}`}>
                {renderFormField(
                  'leftEye',
                  'cylinder',
                  rxData.leftEye.cylinder,
                  generateCylinderOptions(),
                  false,
                  handleLeftEyeChange,
                  'bg-white',
                  'border-indigo-200'
                )}
              </td>
              <td className={`border border-indigo-100 p-2 ${columnWidths.axis}`}>
                {renderFormField(
                  'leftEye',
                  'axis',
                  rxData.leftEye.axis,
                  generateAxisOptions(),
                  validationErrors.leftEye.cylinderAxisError,
                  handleLeftEyeChange,
                  validationErrors.leftEye.cylinderAxisError ? 'bg-red-50' : 'bg-white',
                  'border-indigo-200'
                )}
              </td>
              <td className={`border border-indigo-100 p-2 ${columnWidths.bc}`}>
                {renderFormField(
                  'leftEye',
                  'bc',
                  rxData.leftEye.bc,
                  generateBCOptions(),
                  false,
                  handleLeftEyeChange,
                  'bg-white',
                  'border-indigo-200'
                )}
              </td>
              <td className={`border border-indigo-100 p-2 ${columnWidths.dia}`}>
                {renderFormField(
                  'leftEye',
                  'dia',
                  rxData.leftEye.dia,
                  generateDiaOptions(),
                  false,
                  handleLeftEyeChange,
                  'bg-white',
                  'border-indigo-200'
                )}
              </td>
            </tr>
          </tbody>
        </table>
        
        {hasValidationErrors && !readOnly && (
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
