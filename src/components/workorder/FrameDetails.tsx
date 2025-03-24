
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Card, CardContent } from "@/components/ui/card";

interface FrameDetailsProps {
  frameData: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  };
}

export const FrameDetails: React.FC<FrameDetailsProps> = ({
  frameData
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  if (!frameData.brand) return null;
  
  return (
    <Card className="mb-2 border border-gray-200 rounded-md">
      <CardContent className="p-2">
        <div className="font-bold border-b border-gray-300 pb-1 mb-1">
          {isRtl ? "الإطار (Frame)" : "Frame (الإطار)"}
        </div>
        <div className="px-2 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="font-semibold">{isRtl ? "الماركة" : "Brand"}:</span>
            <span>{frameData.brand}</span>
          </div>
          {frameData.model && (
            <div className="flex justify-between">
              <span className="font-semibold">{isRtl ? "الموديل" : "Model"}:</span>
              <span>{frameData.model}</span>
            </div>
          )}
          {frameData.color && (
            <div className="flex justify-between">
              <span className="font-semibold">{isRtl ? "اللون" : "Color"}:</span>
              <span>{frameData.color}</span>
            </div>
          )}
          {frameData.size && (
            <div className="flex justify-between">
              <span className="font-semibold">{isRtl ? "المقاس" : "Size"}:</span>
              <span>{frameData.size}</span>
            </div>
          )}
          {frameData.price > 0 && (
            <div className="flex justify-between">
              <span className="font-semibold">{isRtl ? "السعر" : "Price"}:</span>
              <span className="font-bold">{frameData.price.toFixed(3)} KWD</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
