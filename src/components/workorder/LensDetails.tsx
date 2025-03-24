
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Card, CardContent } from "@/components/ui/card";

interface LensDetailsProps {
  lensType: string;
  lensName: string;
  lensPrice: number;
}

export const LensDetails: React.FC<LensDetailsProps> = ({
  lensType,
  lensName,
  lensPrice
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  if (!lensType) return null;
  
  return (
    <Card className="mb-2 border border-gray-200 rounded-md">
      <CardContent className="p-2">
        <div className="font-bold border-b border-gray-300 pb-1 mb-1">
          {isRtl ? "العدسات (Lenses)" : "Lenses (العدسات)"}
        </div>
        <div className="px-2 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="font-semibold">{isRtl ? "النوع" : "Type"}:</span>
            <span>{lensName}</span>
          </div>
          {lensPrice > 0 && (
            <div className="flex justify-between">
              <span className="font-semibold">{isRtl ? "السعر" : "Price"}:</span>
              <span className="font-bold">{lensPrice.toFixed(3)} KWD</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
