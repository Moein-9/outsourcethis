
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, AlertTriangle, Lock, CircleCheck } from "lucide-react";
import { ContactLensRx } from "@/store/patientStore";
import { useLanguageStore } from "@/store/languageStore";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
    
    // Validate cylinder/axis relationship on change
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
    
    // Validate cylinder/axis relationship on change
    if (field === 'cylinder' || field === 'axis') {
      validateCylinderAxis('leftEye', updatedRx.leftEye.cylinder, updatedRx.leftEye.axis);
    }
  };
  
  // Validate that if cylinder has a value, axis must also have a value
  const validateCylinderAxis = (eye: 'rightEye' | 'leftEye', cylinder: string, axis: string) => {
    // If cylinder has a non-empty value that's not "-", axis must also have a non-empty value that's not "-"
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
  
  // Initial validation on component mount and when rxData changes
  useEffect(() => {
    validateCylinderAxis('rightEye', rxData.rightEye.cylinder, rxData.rightEye.axis);
    validateCylinderAxis('leftEye', rxData.leftEye.cylinder, rxData.leftEye.axis);
  }, [rxData]);

  // Generate sphere options from +4.00 to -9.00
  const generateSphereOptions = () => {
    const options = [];
    options.push(<option key="sph-none" value="-">-</option>);
    
    // Add positive values from +4.00 to +0.25
    for (let i = 4.00; i >= 0.25; i -= 0.25) {
      const value = i.toFixed(2);
      options.push(
        <option key={`sph-plus-${value}`} value={`+${value}`}>+{value}</option>
      );
    }
    
    // Add 0.00
    options.push(<option key="sph-zero" value="0.00">0.00</option>);
    
    // Add negative values from -0.25 to -9.00
    for (let i = -0.25; i >= -9.00; i -= 0.25) {
      const value = i.toFixed(2);
      options.push(
        <option key={`sph-minus-${Math.abs(i)}`} value={value}>{value}</option>
      );
    }
    
    return options;
  };

  // Generate cylinder options: -0.75, -1.25, -1.75, -2.25
  const generateCylinderOptions = () => {
    const cylValues = ["-", "-0.75", "-1.25", "-1.75", "-2.25"];
    return cylValues.map(value => (
      <option key={`cyl-${value}`} value={value}>{value}</option>
    ));
  };

  // Generate axis options from 10° to 180° in increments of 10°
  const generateAxisOptions = () => {
    const options = [];
    options.push(<option key="axis-none" value="-">-</option>);
    
    for (let i = 10; i <= 180; i += 10) {
      options.push(
        <option key={`axis-${i}`} value={i.toString()}>{i}°</option>
      );
    }
    
    return options;
  };

  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  // Check if there are any validation errors
  const hasValidationErrors = validationErrors.rightEye.cylinderAxisError || 
                              validationErrors.leftEye.cylinderAxisError;

  // Column widths - making AXIS column wider
  const columnWidths = {
    label: "w-[15%]",
    sphere: "w-[17%]",
    cylinder: "w-[17%]",
    axis: "w-[20%]", // Increased width for better readability
    bc: "w-[15%]",
    dia: "w-[16%]"
  };

  return (
    <div className={`rounded-lg border p-4 bg-white shadow-sm ${dirClass} transition-all duration-300 hover:shadow-md`}>
      <div className={`flex items-center justify-between mb-4 pb-3 border-b border-blue-200 ${textAlignClass}`}>
        <h4 className="font-medium text-blue-700 flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-600" />
          <span className="text-lg">{t("contactLensPrescription")}</span>
        </h4>
        
        {readOnly && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-gray-100 px-2.5 py-1 rounded-full">
            <Lock className="w-3.5 h-3.5" />
            {t("readOnly") || "Read Only"}
          </div>
        )}
      </div>

      {showMissingRxWarning && (
        <div className="p-3 mb-4 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-700 text-sm">
            {t("noContactLensRx")}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Always left-to-right table regardless of language */}
        <div className="overflow-hidden rounded-lg border border-blue-100 shadow-sm">
          <table className="w-full border-collapse ltr">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                <th className={`border-b border-r border-blue-200 p-2.5 text-blue-700 text-sm font-semibold ${columnWidths.label}`}></th>
                <th className={`border-b border-r border-blue-200 p-2.5 text-blue-700 text-sm font-semibold ${columnWidths.sphere}`}>SPHERE (SPH)</th>
                <th className={`border-b border-r border-blue-200 p-2.5 text-blue-700 text-sm font-semibold ${columnWidths.cylinder}`}>CYLINDER (CYL)</th>
                <th className={`border-b border-r border-blue-200 p-2.5 text-blue-700 text-sm font-semibold ${columnWidths.axis}`}>AXIS</th>
                <th className={`border-b border-r border-blue-200 p-2.5 text-blue-700 text-sm font-semibold ${columnWidths.bc}`}>BASE CURVE (BC)</th>
                <th className={`border-b border-blue-200 p-2.5 text-blue-700 text-sm font-semibold ${columnWidths.dia}`}>DIAMETER (DIA)</th>
              </tr>
            </thead>
            <tbody>
              {/* Right Eye Row */}
              <tr className="bg-blue-50/30 hover:bg-blue-50/70 transition-colors">
                <td className={`border-r border-blue-100 p-3 ${columnWidths.label}`}>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">OD</span>
                      </div>
                    </div>
                    <span className="font-medium text-blue-800">{t("rightEye")}</span>
                  </div>
                </td>
                <td className={`border-r border-blue-100 p-2 ${columnWidths.sphere}`}>
                  <select 
                    className={`w-full p-2 rounded-md border ${readOnly ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-200'} 
                    text-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    ${readOnly ? 'opacity-80 cursor-not-allowed' : 'hover:border-blue-300'}`}
                    value={rxData.rightEye.sphere}
                    onChange={(e) => handleRightEyeChange("sphere", e.target.value)}
                    disabled={readOnly}
                  >
                    {generateSphereOptions()}
                  </select>
                </td>
                <td className={`border-r border-blue-100 p-2 ${columnWidths.cylinder}`}>
                  <select 
                    className={`w-full p-2 rounded-md border ${readOnly ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-200'} 
                    text-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    ${readOnly ? 'opacity-80 cursor-not-allowed' : 'hover:border-blue-300'}`}
                    value={rxData.rightEye.cylinder}
                    onChange={(e) => handleRightEyeChange("cylinder", e.target.value)}
                    disabled={readOnly}
                  >
                    {generateCylinderOptions()}
                  </select>
                </td>
                <td className={`border-r border-blue-100 p-2 ${columnWidths.axis}`}>
                  <select 
                    className={`w-full p-2 rounded-md 
                    ${validationErrors.rightEye.cylinderAxisError 
                      ? 'border-red-500 bg-red-50 ring-2 ring-red-200' 
                      : readOnly 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'border-blue-200 bg-white hover:border-blue-300'} 
                    text-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${readOnly ? 'opacity-80 cursor-not-allowed' : ''}`}
                    value={rxData.rightEye.axis}
                    onChange={(e) => handleRightEyeChange("axis", e.target.value)}
                    disabled={readOnly}
                  >
                    {generateAxisOptions()}
                  </select>
                </td>
                <td className={`border-r border-blue-100 p-2 ${columnWidths.bc}`}>
                  <select 
                    className={`w-full p-2 rounded-md border ${readOnly ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-200'} 
                    text-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    ${readOnly ? 'opacity-80 cursor-not-allowed' : 'hover:border-blue-300'}`}
                    value={rxData.rightEye.bc}
                    onChange={(e) => handleRightEyeChange("bc", e.target.value)}
                    disabled={readOnly}
                  >
                    <option value="-">-</option>
                    <option value="8.4">8.4</option>
                    <option value="8.5">8.5</option>
                    <option value="8.6">8.6</option>
                    <option value="8.7">8.7</option>
                    <option value="8.8">8.8</option>
                  </select>
                </td>
                <td className={`p-2 ${columnWidths.dia}`}>
                  <select
                    className={`w-full p-2 rounded-md border ${readOnly ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-200'} 
                    text-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    ${readOnly ? 'opacity-80 cursor-not-allowed' : 'hover:border-blue-300'}`}
                    value={rxData.rightEye.dia}
                    onChange={(e) => handleRightEyeChange("dia", e.target.value)}
                    disabled={readOnly}
                  >
                    <option value="-">-</option>
                    <option value="14.0">14.0</option>
                    <option value="14.2">14.2</option>
                    <option value="14.4">14.4</option>
                    <option value="14.5">14.5</option>
                  </select>
                </td>
              </tr>
              
              {/* Left Eye Row */}
              <tr className="bg-rose-50/30 hover:bg-rose-50/70 transition-colors">
                <td className={`border-r border-rose-100 p-3 ${columnWidths.label}`}>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">OS</span>
                      </div>
                    </div>
                    <span className="font-medium text-rose-800">{t("leftEye")}</span>
                  </div>
                </td>
                <td className={`border-r border-rose-100 p-2 ${columnWidths.sphere}`}>
                  <select 
                    className={`w-full p-2 rounded-md border ${readOnly ? 'bg-gray-50 border-gray-200' : 'bg-white border-rose-200'} 
                    text-sm transition-colors focus:ring-2 focus:ring-rose-500 focus:border-rose-500 
                    ${readOnly ? 'opacity-80 cursor-not-allowed' : 'hover:border-rose-300'}`}
                    value={rxData.leftEye.sphere}
                    onChange={(e) => handleLeftEyeChange("sphere", e.target.value)}
                    disabled={readOnly}
                  >
                    {generateSphereOptions()}
                  </select>
                </td>
                <td className={`border-r border-rose-100 p-2 ${columnWidths.cylinder}`}>
                  <select 
                    className={`w-full p-2 rounded-md border ${readOnly ? 'bg-gray-50 border-gray-200' : 'bg-white border-rose-200'} 
                    text-sm transition-colors focus:ring-2 focus:ring-rose-500 focus:border-rose-500 
                    ${readOnly ? 'opacity-80 cursor-not-allowed' : 'hover:border-rose-300'}`}
                    value={rxData.leftEye.cylinder}
                    onChange={(e) => handleLeftEyeChange("cylinder", e.target.value)}
                    disabled={readOnly}
                  >
                    {generateCylinderOptions()}
                  </select>
                </td>
                <td className={`border-r border-rose-100 p-2 ${columnWidths.axis}`}>
                  <select 
                    className={`w-full p-2 rounded-md 
                    ${validationErrors.leftEye.cylinderAxisError 
                      ? 'border-red-500 bg-red-50 ring-2 ring-red-200' 
                      : readOnly 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'border-rose-200 bg-white hover:border-rose-300'} 
                    text-sm transition-colors focus:ring-2 focus:ring-rose-500 focus:border-rose-500
                    ${readOnly ? 'opacity-80 cursor-not-allowed' : ''}`}
                    value={rxData.leftEye.axis}
                    onChange={(e) => handleLeftEyeChange("axis", e.target.value)}
                    disabled={readOnly}
                  >
                    {generateAxisOptions()}
                  </select>
                </td>
                <td className={`border-r border-rose-100 p-2 ${columnWidths.bc}`}>
                  <select 
                    className={`w-full p-2 rounded-md border ${readOnly ? 'bg-gray-50 border-gray-200' : 'bg-white border-rose-200'} 
                    text-sm transition-colors focus:ring-2 focus:ring-rose-500 focus:border-rose-500 
                    ${readOnly ? 'opacity-80 cursor-not-allowed' : 'hover:border-rose-300'}`}
                    value={rxData.leftEye.bc}
                    onChange={(e) => handleLeftEyeChange("bc", e.target.value)}
                    disabled={readOnly}
                  >
                    <option value="-">-</option>
                    <option value="8.4">8.4</option>
                    <option value="8.5">8.5</option>
                    <option value="8.6">8.6</option>
                    <option value="8.7">8.7</option>
                    <option value="8.8">8.8</option>
                  </select>
                </td>
                <td className={`p-2 ${columnWidths.dia}`}>
                  <select
                    className={`w-full p-2 rounded-md border ${readOnly ? 'bg-gray-50 border-gray-200' : 'bg-white border-rose-200'} 
                    text-sm transition-colors focus:ring-2 focus:ring-rose-500 focus:border-rose-500 
                    ${readOnly ? 'opacity-80 cursor-not-allowed' : 'hover:border-rose-300'}`}
                    value={rxData.leftEye.dia}
                    onChange={(e) => handleLeftEyeChange("dia", e.target.value)}
                    disabled={readOnly}
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
        </div>
        
        {/* Validation error message */}
        {hasValidationErrors && !readOnly && (
          <div className="p-3 mt-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">
              {t("axisValidationError") || "The AXIS values you've inserted are not correct! If CYL value is provided, AXIS value is required."}
            </p>
          </div>
        )}

        {/* Prescription Success indicator for read-only view */}
        {readOnly && !hasValidationErrors && (
          <div className="p-3 mt-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 animate-fade-in">
            <CircleCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700 text-sm">
              {t("validPrescription") || "Valid prescription loaded from patient record."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
