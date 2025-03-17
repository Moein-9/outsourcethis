
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, AlertTriangle } from "lucide-react";
import { ContactLensRx } from "@/store/patientStore";

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

  return (
    <div className="rounded-lg border p-4 bg-gradient-to-r from-blue-50 to-white shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-blue-100">
        <h4 className="font-medium text-blue-700 flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-600" />
          وصفة العدسات اللاصقة
        </h4>
      </div>

      {showMissingRxWarning && (
        <div className="p-3 mb-4 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-700 text-sm">
            لا توجد وصفة عدسات لاصقة لهذا العميل. يرجى إدخال وصفة العدسات.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Right Eye Column */}
        <div className="space-y-4 bg-gradient-to-br from-blue-50/80 to-white p-4 rounded-lg border border-blue-100 shadow-sm">
          <h5 className="font-medium text-blue-800 border-b border-blue-100 pb-2 text-sm flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            العين اليمنى (OD)
          </h5>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sphereOD" className="text-blue-700 text-xs font-medium">SPHERE (SPH)</Label>
              <select 
                id="sphereOD"
                className="w-full h-9 rounded-md border border-blue-200 bg-white px-3 py-1 text-sm shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={rxData.rightEye.sphere}
                onChange={(e) => handleRightEyeChange("sphere", e.target.value)}
              >
                <option value="-">-</option>
                <option value="-0.50">-0.50</option>
                <option value="-1.00">-1.00</option>
                <option value="-1.50">-1.50</option>
                <option value="-2.00">-2.00</option>
                <option value="-2.50">-2.50</option>
                <option value="-3.00">-3.00</option>
                <option value="-3.50">-3.50</option>
                <option value="-4.00">-4.00</option>
                <option value="-4.50">-4.50</option>
                <option value="-5.00">-5.00</option>
                <option value="+0.50">+0.50</option>
                <option value="+1.00">+1.00</option>
                <option value="+1.50">+1.50</option>
                <option value="+2.00">+2.00</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cylOD" className="text-blue-700 text-xs font-medium">CYLINDER (CYL)</Label>
              <select 
                id="cylOD"
                className="w-full h-9 rounded-md border border-blue-200 bg-white px-3 py-1 text-sm shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={rxData.rightEye.cylinder}
                onChange={(e) => handleRightEyeChange("cylinder", e.target.value)}
              >
                <option value="-">-</option>
                <option value="-0.75">-0.75</option>
                <option value="-1.25">-1.25</option>
                <option value="-1.75">-1.75</option>
                <option value="-2.25">-2.25</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="axisOD" className="text-blue-700 text-xs font-medium">AXIS</Label>
              <select 
                id="axisOD"
                className="w-full h-9 rounded-md border border-blue-200 bg-white px-3 py-1 text-sm shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={rxData.rightEye.axis}
                onChange={(e) => handleRightEyeChange("axis", e.target.value)}
              >
                <option value="-">-</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
                <option value="60">60</option>
                <option value="70">70</option>
                <option value="80">80</option>
                <option value="90">90</option>
                <option value="100">100</option>
                <option value="110">110</option>
                <option value="120">120</option>
                <option value="130">130</option>
                <option value="140">140</option>
                <option value="150">150</option>
                <option value="160">160</option>
                <option value="170">170</option>
                <option value="180">180</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bcOD" className="text-blue-700 text-xs font-medium">BASE CURVE (BC)</Label>
              <select 
                id="bcOD"
                className="w-full h-9 rounded-md border border-blue-200 bg-white px-3 py-1 text-sm shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diaOD" className="text-blue-700 text-xs font-medium">DIAMETER (DIA)</Label>
            <select
              id="diaOD"
              className="w-full h-9 rounded-md border border-blue-200 bg-white px-3 py-1 text-sm shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={rxData.rightEye.dia}
              onChange={(e) => handleRightEyeChange("dia", e.target.value)}
            >
              <option value="-">-</option>
              <option value="14.0">14.0</option>
              <option value="14.2">14.2</option>
              <option value="14.4">14.4</option>
              <option value="14.5">14.5</option>
            </select>
          </div>
        </div>

        {/* Left Eye Column */}
        <div className="space-y-4 bg-gradient-to-br from-rose-50/80 to-white p-4 rounded-lg border border-rose-100 shadow-sm">
          <h5 className="font-medium text-rose-800 border-b border-rose-100 pb-2 text-sm flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            العين اليسرى (OS)
          </h5>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sphereOS" className="text-rose-700 text-xs font-medium">SPHERE (SPH)</Label>
              <select 
                id="sphereOS"
                className="w-full h-9 rounded-md border border-rose-200 bg-white px-3 py-1 text-sm shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                value={rxData.leftEye.sphere}
                onChange={(e) => handleLeftEyeChange("sphere", e.target.value)}
              >
                <option value="-">-</option>
                <option value="-0.50">-0.50</option>
                <option value="-1.00">-1.00</option>
                <option value="-1.50">-1.50</option>
                <option value="-2.00">-2.00</option>
                <option value="-2.50">-2.50</option>
                <option value="-3.00">-3.00</option>
                <option value="-3.50">-3.50</option>
                <option value="-4.00">-4.00</option>
                <option value="-4.50">-4.50</option>
                <option value="-5.00">-5.00</option>
                <option value="+0.50">+0.50</option>
                <option value="+1.00">+1.00</option>
                <option value="+1.50">+1.50</option>
                <option value="+2.00">+2.00</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cylOS" className="text-rose-700 text-xs font-medium">CYLINDER (CYL)</Label>
              <select 
                id="cylOS"
                className="w-full h-9 rounded-md border border-rose-200 bg-white px-3 py-1 text-sm shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                value={rxData.leftEye.cylinder}
                onChange={(e) => handleLeftEyeChange("cylinder", e.target.value)}
              >
                <option value="-">-</option>
                <option value="-0.75">-0.75</option>
                <option value="-1.25">-1.25</option>
                <option value="-1.75">-1.75</option>
                <option value="-2.25">-2.25</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="axisOS" className="text-rose-700 text-xs font-medium">AXIS</Label>
              <select 
                id="axisOS"
                className="w-full h-9 rounded-md border border-rose-200 bg-white px-3 py-1 text-sm shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                value={rxData.leftEye.axis}
                onChange={(e) => handleLeftEyeChange("axis", e.target.value)}
              >
                <option value="-">-</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
                <option value="60">60</option>
                <option value="70">70</option>
                <option value="80">80</option>
                <option value="90">90</option>
                <option value="100">100</option>
                <option value="110">110</option>
                <option value="120">120</option>
                <option value="130">130</option>
                <option value="140">140</option>
                <option value="150">150</option>
                <option value="160">160</option>
                <option value="170">170</option>
                <option value="180">180</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bcOS" className="text-rose-700 text-xs font-medium">BASE CURVE (BC)</Label>
              <select 
                id="bcOS"
                className="w-full h-9 rounded-md border border-rose-200 bg-white px-3 py-1 text-sm shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
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
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diaOS" className="text-rose-700 text-xs font-medium">DIAMETER (DIA)</Label>
            <select
              id="diaOS"
              className="w-full h-9 rounded-md border border-rose-200 bg-white px-3 py-1 text-sm shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
              value={rxData.leftEye.dia}
              onChange={(e) => handleLeftEyeChange("dia", e.target.value)}
            >
              <option value="-">-</option>
              <option value="14.0">14.0</option>
              <option value="14.2">14.2</option>
              <option value="14.4">14.4</option>
              <option value="14.5">14.5</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
