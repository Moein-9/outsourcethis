
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInvoiceForm } from "./InvoiceFormContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wrench, Check } from "lucide-react";

export const RepairSection: React.FC = () => {
  const { language } = useLanguageStore();
  const { setValue, getValues } = useInvoiceForm();
  const [repairPrice, setRepairPrice] = useState<number>(getValues('repairPrice') || 0);
  const [repairDescription, setRepairDescription] = useState<string>(getValues('repairDescription') || '');
  const [repairType, setRepairType] = useState<string>(getValues('repairType') || '');

  const isRtl = language === 'ar';
  const textAlignClass = isRtl ? 'text-right' : 'text-left';

  const handleRepairPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseFloat(e.target.value) || 0;
    setRepairPrice(price);
    setValue('repairPrice', price);
    setValue('servicePrice', price);
  };

  const handleRepairTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepairType(e.target.value);
    setValue('repairType', e.target.value);
    setValue('serviceName', e.target.value);
  };

  const handleRepairDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRepairDescription(e.target.value);
    setValue('repairDescription', e.target.value);
    setValue('serviceDescription', e.target.value);
  };

  const commonRepairs = [
    { name: isRtl ? 'إصلاح الإطار' : 'Frame Repair', price: 5.000 },
    { name: isRtl ? 'استبدال المسامير' : 'Screw Replacement', price: 2.500 },
    { name: isRtl ? 'تعديل الإطار' : 'Frame Adjustment', price: 3.000 },
    { name: isRtl ? 'إصلاح العدسة' : 'Lens Repair', price: 10.000 },
    { name: isRtl ? 'تنظيف متخصص' : 'Professional Cleaning', price: 5.000 }
  ];

  const applyCommonRepair = (repair: { name: string, price: number }) => {
    setRepairType(repair.name);
    setRepairPrice(repair.price);
    setValue('repairType', repair.name);
    setValue('repairPrice', repair.price);
    setValue('serviceName', repair.name);
    setValue('servicePrice', repair.price);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-purple-50">
          <CardTitle className={`text-lg flex items-center gap-2 ${textAlignClass}`}>
            <Wrench className="w-5 h-5 text-purple-600" />
            {isRtl ? "خدمة الإصلاح" : "Repair Service"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {commonRepairs.map((repair, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className={`p-3 h-auto ${repairType === repair.name ? 'bg-purple-100 border-purple-500' : ''}`}
                  onClick={() => applyCommonRepair(repair)}
                >
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span className="font-medium text-sm">{repair.name}</span>
                    <span className="text-purple-700 font-semibold">{repair.price.toFixed(3)} KWD</span>
                    {repairType === repair.name && (
                      <Check className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                </Button>
              ))}
            </div>

            <div className="pt-4 border-t border-dashed border-purple-200">
              <Label className={`block mb-2 ${textAlignClass}`}>
                {isRtl ? "نوع الإصلاح المخصص" : "Custom Repair Type"}
              </Label>
              <Input
                placeholder={isRtl ? "أدخل نوع الإصلاح" : "Enter repair type"}
                value={repairType}
                onChange={handleRepairTypeChange}
                className={textAlignClass}
              />
            </div>

            <div>
              <Label className={`block mb-2 ${textAlignClass}`}>
                {isRtl ? "وصف الإصلاح" : "Repair Description"}
              </Label>
              <Textarea
                placeholder={isRtl ? "أدخل تفاصيل الإصلاح" : "Enter repair details"}
                value={repairDescription}
                onChange={handleRepairDescriptionChange}
                rows={3}
                className={textAlignClass}
              />
            </div>

            <div>
              <Label className={`block mb-2 ${textAlignClass}`}>
                {isRtl ? "سعر الإصلاح" : "Repair Price"} (KWD)
              </Label>
              <Input
                type="number"
                step="0.001"
                min="0"
                value={repairPrice || ''}
                onChange={handleRepairPriceChange}
                className={textAlignClass}
              />
            </div>

            <div className="mt-6 p-3 bg-purple-50 rounded-lg border border-purple-100 flex items-center justify-between">
              <span className="font-medium">
                {isRtl ? "السعر الإجمالي:" : "Total Price:"}
              </span>
              <span className="text-lg font-bold text-purple-700">
                {repairPrice.toFixed(3)} KWD
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
