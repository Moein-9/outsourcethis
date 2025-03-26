
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Eye, AlertTriangle } from "lucide-react";
import { ContactLensRx } from "@/store/patientStore";
import { useLanguageStore } from "@/store/languageStore";
import { PrescriptionInput } from "@/components/ui/PrescriptionInput";

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
    rightEye: { cylinderWithoutAxis: false },
    leftEye: { cylinderWithoutAxis: false }
  });

  // Validate CYL/AXIS pairing on form data change
  useEffect(() => {
    setValidationErrors({
      rightEye: { 
        cylinderWithoutAxis: rxData.rightEye.cylinder !== "-" && rxData.rightEye.axis === "-" 
      },
      leftEye: { 
        cylinderWithoutAxis: rxData.leftEye.cylinder !== "-" && rxData.leftEye.axis === "-" 
      }
    });
  }, [rxData]);

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
    options.push({ value: "-", label: "-" });
    
    // Add positive values from +4.00 to +0.25
    for (let i = 4.00; i >= 0.25; i -= 0.25) {
      const value = `+${i.toFixed(2)}`;
      options.push({ value, label: value });
    }
    
    // Add 0.00
    options.push({ value: "0.00", label: "0.00" });
    
    // Add negative values from -0.25 to -9.00
    for (let i = -0.25; i >= -9.00; i -= 0.25) {
      const value = i.toFixed(2);
      options.push({ value, label: value });
    }
    
    return options;
  };

  // Generate cylinder options: -0.75, -1.25, -1.75, -2.25
  const generateCylinderOptions = () => {
    const cylValues = ["-", "-0.75", "-1.25", "-1.75", "-2.25"];
    return cylValues.map(value => ({ value, label: value }));
  };

  // Generate axis options from 10° to 180° in increments of 10°
  const generateAxisOptions = () => {
    const options = [{ value: "-", label: "-" }];
    
    for (let i = 10; i <= 180; i += 10) {
      const value = i.toString();
      options.push({ value, label: `${value}°` });
    }
    
    return options;
  };

  // Generate BC (base curve) options
  const generateBcOptions = () => {
    const values = ["-", "8.4", "8.5", "8.6", "8.7", "8.8"];
    return values.map(value => ({ value, label: value }));
  };

  // Generate diameter options
  const generateDiaOptions = () => {
    const values = ["-", "14.0", "14.2", "14.4", "14.5"];
    return values.map(value => ({ value, label: value }));
  };

  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';

  return (
    <div className={`rounded-lg border p-4 bg-white shadow-sm ${dirClass}`}>
      <div className={`flex items-center justify-between mb-4 pb-2 border-b ${textAlignClass}`}>
        <h4 className="font-medium text-blue-700 flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-600" />
          {t("contactLensPrescription")}
        </h4>
      </div>

      {showMissingRxWarning && (
        <div className="p-3 mb-4 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-700 text-sm">
            {t("noContactLensRx")}
          </p>
        </div>
      )}

      {/* Validation error messages */}
      {(validationErrors.rightEye.cylinderWithoutAxis || validationErrors.leftEye.cylinderWithoutAxis) && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm">
            {t("cylAxisError")}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Always left-to-right table regardless of language */}
        <table className="w-full border-collapse ltr">
          <thead>
            <tr className="bg-blue-50">
              <th className="border border-blue-100 p-2 text-blue-700 text-sm"></th>
              <th className="border border-blue-100 p-2 text-blue-700 text-sm">SPHERE (SPH)</th>
              <th className="border border-blue-100 p-2 text-blue-700 text-sm">CYLINDER (CYL)</th>
              <th className="border border-blue-100 p-2 text-blue-700 text-sm">AXIS</th>
              <th className="border border-blue-100 p-2 text-blue-700 text-sm">BASE CURVE (BC)</th>
              <th className="border border-blue-100 p-2 text-blue-700 text-sm">DIAMETER (DIA)</th>
            </tr>
          </thead>
          <tbody>
            {/* Right Eye Row */}
            <tr className="bg-blue-50/30">
              <td className="border border-blue-100 p-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium text-blue-800">{t("rightEye")} (OD)</span>
                </div>
              </td>
              <td className="border border-blue-100 p-2">
                <PrescriptionInput
                  id="right-sphere"
                  value={rxData.rightEye.sphere}
                  onChange={(value) => handleRightEyeChange("sphere", value)}
                  options={generateSphereOptions()}
                  placeholder={t("choose")}
                />
              </td>
              <td className="border border-blue-100 p-2">
                <PrescriptionInput
                  id="right-cylinder"
                  value={rxData.rightEye.cylinder}
                  onChange={(value) => handleRightEyeChange("cylinder", value)}
                  options={generateCylinderOptions()}
                  placeholder={t("choose")}
                  isInvalid={validationErrors.rightEye.cylinderWithoutAxis}
                />
              </td>
              <td className="border border-blue-100 p-2">
                <PrescriptionInput
                  id="right-axis"
                  value={rxData.rightEye.axis}
                  onChange={(value) => handleRightEyeChange("axis", value)}
                  options={generateAxisOptions()}
                  placeholder={t("choose")}
                  isInvalid={validationErrors.rightEye.cylinderWithoutAxis}
                />
              </td>
              <td className="border border-blue-100 p-2">
                <PrescriptionInput
                  id="right-bc"
                  value={rxData.rightEye.bc}
                  onChange={(value) => handleRightEyeChange("bc", value)}
                  options={generateBcOptions()}
                  placeholder={t("choose")}
                />
              </td>
              <td className="border border-blue-100 p-2">
                <PrescriptionInput
                  id="right-dia"
                  value={rxData.rightEye.dia}
                  onChange={(value) => handleRightEyeChange("dia", value)}
                  options={generateDiaOptions()}
                  placeholder={t("choose")}
                />
              </td>
            </tr>
            
            {/* Left Eye Row */}
            <tr className="bg-rose-50/30">
              <td className="border border-rose-100 p-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span className="font-medium text-rose-800">{t("leftEye")} (OS)</span>
                </div>
              </td>
              <td className="border border-rose-100 p-2">
                <PrescriptionInput
                  id="left-sphere"
                  value={rxData.leftEye.sphere}
                  onChange={(value) => handleLeftEyeChange("sphere", value)}
                  options={generateSphereOptions()}
                  placeholder={t("choose")}
                />
              </td>
              <td className="border border-rose-100 p-2">
                <PrescriptionInput
                  id="left-cylinder"
                  value={rxData.leftEye.cylinder}
                  onChange={(value) => handleLeftEyeChange("cylinder", value)}
                  options={generateCylinderOptions()}
                  placeholder={t("choose")}
                  isInvalid={validationErrors.leftEye.cylinderWithoutAxis}
                />
              </td>
              <td className="border border-rose-100 p-2">
                <PrescriptionInput
                  id="left-axis"
                  value={rxData.leftEye.axis}
                  onChange={(value) => handleLeftEyeChange("axis", value)}
                  options={generateAxisOptions()}
                  placeholder={t("choose")}
                  isInvalid={validationErrors.leftEye.cylinderWithoutAxis}
                />
              </td>
              <td className="border border-rose-100 p-2">
                <PrescriptionInput
                  id="left-bc"
                  value={rxData.leftEye.bc}
                  onChange={(value) => handleLeftEyeChange("bc", value)}
                  options={generateBcOptions()}
                  placeholder={t("choose")}
                />
              </td>
              <td className="border border-rose-100 p-2">
                <PrescriptionInput
                  id="left-dia"
                  value={rxData.leftEye.dia}
                  onChange={(value) => handleLeftEyeChange("dia", value)}
                  options={generateDiaOptions()}
                  placeholder={t("choose")}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
