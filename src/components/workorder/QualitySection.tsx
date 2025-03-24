
import React from "react";
import { useLanguageStore } from "@/store/languageStore";

export const QualitySection: React.FC = () => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  return (
    <div className="mb-3">
      <div className="text-center bg-black text-white py-1 mb-2 font-bold text-base rounded">
        {isRtl 
          ? "تأكيد الجودة | Quality Confirmation" 
          : "Quality Confirmation | تأكيد الجودة"}
      </div>
      
      <div className="flex gap-2 text-sm mb-1 px-1">
        <div className="border border-gray-300 rounded p-1 flex-1">
          <div className="font-bold mb-1 text-center border-b border-gray-300 pb-0.5 text-xs">
            {isRtl ? "توقيع الفني" : "Technician Signature"}
          </div>
          <div className="h-8"></div>
        </div>
        
        <div className="border border-gray-300 rounded p-1 flex-1">
          <div className="font-bold mb-1 text-center border-b border-gray-300 pb-0.5 text-xs">
            {isRtl ? "توقيع المدير" : "Manager Signature"}
          </div>
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
};
