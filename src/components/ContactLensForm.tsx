
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";

interface EyePrescription {
  sphere: string;
  cylinder: string;
  axis: string;
  bc: string;
  dia: string;
}

interface ContactLensRx {
  rightEye: EyePrescription;
  leftEye: EyePrescription;
}

interface ContactLensFormProps {
  rxData: ContactLensRx;
  onChange: (data: ContactLensRx) => void;
}

export const ContactLensForm: React.FC<ContactLensFormProps> = ({ rxData, onChange }) => {
  const handleRightEyeChange = (field: keyof EyePrescription, value: string) => {
    const updatedRx = {
      ...rxData,
      rightEye: {
        ...rxData.rightEye,
        [field]: value
      }
    };
    onChange(updatedRx);
  };

  const handleLeftEyeChange = (field: keyof EyePrescription, value: string) => {
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
    <div className="mt-5 border rounded-lg p-4 bg-muted/5">
      <div className="mb-4 pb-2 border-b">
        <h4 className="font-medium text-primary flex items-center gap-2">
          <Eye className="w-4 h-4" />
          وصفة العدسات اللاصقة
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-4">
        <div className="space-y-5">
          <h4 className="font-medium text-primary border-b pb-1 text-right">العين اليمنى (OD)</h4>

          <div className="space-y-1">
            <Label className="text-muted-foreground block text-right">SPHERE</Label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-right"
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

          <div className="space-y-1">
            <Label className="text-muted-foreground block text-right">CYLINDER</Label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-right"
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

          <div className="space-y-1">
            <Label className="text-muted-foreground block text-right">AXIS</Label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-right"
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

          <div className="space-y-1">
            <Label className="text-muted-foreground block text-right">BC</Label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-right"
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

          <div className="space-y-1">
            <Label className="text-muted-foreground block text-right">DIA</Label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-right"
              value={rxData.rightEye.dia}
              onChange={(e) => handleRightEyeChange("dia", e.target.value)}
            >
              <option value="14.2">14.2</option>
              <option value="14.4">14.4</option>
            </select>
          </div>
        </div>

        <div className="space-y-5">
          <h4 className="font-medium text-primary border-b pb-1 text-right">العين اليسرى (OS)</h4>
          
          <div className="space-y-1">
            <Label className="text-muted-foreground block text-right">SPHERE</Label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-right"
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

          <div className="space-y-1">
            <Label className="text-muted-foreground block text-right">CYLINDER</Label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-right"
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

          <div className="space-y-1">
            <Label className="text-muted-foreground block text-right">AXIS</Label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-right"
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

          <div className="space-y-1">
            <Label className="text-muted-foreground block text-right">BC</Label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-right"
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

          <div className="space-y-1">
            <Label className="text-muted-foreground block text-right">DIA</Label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-right"
              value={rxData.leftEye.dia}
              onChange={(e) => handleLeftEyeChange("dia", e.target.value)}
            >
              <option value="14.2">14.2</option>
              <option value="14.4">14.4</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
