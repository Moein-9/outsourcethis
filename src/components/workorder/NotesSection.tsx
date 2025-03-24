
import React from "react";
import { useLanguageStore } from "@/store/languageStore";

export const NotesSection: React.FC = () => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  return (
    <div className="mb-3">
      <div className="text-center bg-black text-white py-1 mb-2 font-bold text-base rounded">
        {isRtl 
          ? "ملاحظات | Notes" 
          : "Notes | ملاحظات"}
      </div>
      
      <div className="border border-gray-300 rounded p-2 min-h-16">
        
      </div>
    </div>
  );
};
