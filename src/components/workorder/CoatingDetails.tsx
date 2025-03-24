
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Card, CardContent } from "@/components/ui/card";

interface CoatingDetailsProps {
  coating: string;
  coatingName: string;
  coatingPrice: number;
}

export const CoatingDetails: React.FC<CoatingDetailsProps> = ({
  coating,
  coatingName,
  coatingPrice
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  if (!coating) return null;
  
  return (
    <Card className="mb-2 border border-gray-200 rounded-md">
      <CardContent className="p-2">
        <div className="font-bold border-b border-gray-300 pb-1 mb-1">
          {isRtl ? "الطلاء (Coating)" : "Coating (الطلاء)"}
        </div>
        <div className="px-2 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="font-semibold">{isRtl ? "النوع" : "Type"}:</span>
            <span>{coatingName}</span>
          </div>
          {coatingPrice > 0 && (
            <div className="flex justify-between">
              <span className="font-semibold">{isRtl ? "السعر" : "Price"}:</span>
              <span className="font-bold">{coatingPrice.toFixed(3)} KWD</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
