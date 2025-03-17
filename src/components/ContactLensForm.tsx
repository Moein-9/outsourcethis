
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, AlertTriangle } from "lucide-react";
import { ContactLensRx } from "@/store/patientStore";
import { useLanguage } from "@/contexts/LanguageContext";
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
}

export const ContactLensForm: React.FC<ContactLensFormProps> = ({ 
  rxData, 
  onChange,
  showMissingRxWarning = false
}) => {
  const { t, language } = useLanguage();
  
  const handleRightEyeChange = (field: keyof ContactLensRx["rightEye"], value: string) => {
    const updatedRx = {
      ...rxData,
      rightEye: {
        ...rxData.rightEye,
        [field]: value
      }
    };
    onChange(updatedRx);
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
  };

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

  return (
    <div className="rounded-lg border p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b">
        <h4 className="font-medium text-blue-700 flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-600" />
          {t("contact_lens_prescription")}
        </h4>
      </div>

      {showMissingRxWarning && (
        <div className="p-3 mb-4 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-700 text-sm">
            {t("no_prescription_warning")}
          </p>
        </div>
      )}

      <div className="space-y-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="border border-blue-100 p-2 text-blue-700 text-sm"></th>
              <th className="border border-blue-100 p-2 text-blue-700 text-sm">{t("sphere")}</th>
              <th className="border border-blue-100 p-2 text-blue-700 text-sm">{t("cylinder")}</th>
              <th className="border border-blue-100 p-2 text-blue-700 text-sm">{t("axis")}</th>
              <th className="border border-blue-100 p-2 text-blue-700 text-sm">{t("base_curve")}</th>
              <th className="border border-blue-100 p-2 text-blue-700 text-sm">{t("diameter")}</th>
            </tr>
          </thead>
          <tbody>
            {/* Right Eye Row */}
            <tr className="bg-blue-50/30">
              <td className="border border-blue-100 p-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium text-blue-800">{t("right_eye")}</span>
                </div>
              </td>
              <td className="border border-blue-100 p-2">
                <select 
                  className="w-full p-1 rounded-md border border-blue-200 bg-white text-sm"
                  value={rxData.rightEye.sphere}
                  onChange={(e) => handleRightEyeChange("sphere", e.target.value)}
                >
                  {generateSphereOptions()}
                </select>
              </td>
              <td className="border border-blue-100 p-2">
                <select 
                  className="w-full p-1 rounded-md border border-blue-200 bg-white text-sm"
                  value={rxData.rightEye.cylinder}
                  onChange={(e) => handleRightEyeChange("cylinder", e.target.value)}
                >
                  {generateCylinderOptions()}
                </select>
              </td>
              <td className="border border-blue-100 p-2">
                <select 
                  className="w-full p-1 rounded-md border border-blue-200 bg-white text-sm"
                  value={rxData.rightEye.axis}
                  onChange={(e) => handleRightEyeChange("axis", e.target.value)}
                >
                  {generateAxisOptions()}
                </select>
              </td>
              <td className="border border-blue-100 p-2">
                <select 
                  className="w-full p-1 rounded-md border border-blue-200 bg-white text-sm"
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
              <td className="border border-blue-100 p-2">
                <select
                  className="w-full p-1 rounded-md border border-blue-200 bg-white text-sm"
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
            
            {/* Left Eye Row */}
            <tr className="bg-rose-50/30">
              <td className="border border-rose-100 p-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span className="font-medium text-rose-800">{t("left_eye")}</span>
                </div>
              </td>
              <td className="border border-rose-100 p-2">
                <select 
                  className="w-full p-1 rounded-md border border-rose-200 bg-white text-sm"
                  value={rxData.leftEye.sphere}
                  onChange={(e) => handleLeftEyeChange("sphere", e.target.value)}
                >
                  {generateSphereOptions()}
                </select>
              </td>
              <td className="border border-rose-100 p-2">
                <select 
                  className="w-full p-1 rounded-md border border-rose-200 bg-white text-sm"
                  value={rxData.leftEye.cylinder}
                  onChange={(e) => handleLeftEyeChange("cylinder", e.target.value)}
                >
                  {generateCylinderOptions()}
                </select>
              </td>
              <td className="border border-rose-100 p-2">
                <select 
                  className="w-full p-1 rounded-md border border-rose-200 bg-white text-sm"
                  value={rxData.leftEye.axis}
                  onChange={(e) => handleLeftEyeChange("axis", e.target.value)}
                >
                  {generateAxisOptions()}
                </select>
              </td>
              <td className="border border-rose-100 p-2">
                <select 
                  className="w-full p-1 rounded-md border border-rose-200 bg-white text-sm"
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
              <td className="border border-rose-100 p-2">
                <select
                  className="w-full p-1 rounded-md border border-rose-200 bg-white text-sm"
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
      </div>
    </div>
  );
};
