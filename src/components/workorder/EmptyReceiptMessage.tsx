
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { AlertTriangle } from "lucide-react";

export const EmptyReceiptMessage: React.FC = () => {
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  const dirClass = isRtl ? "rtl" : "ltr";
  
  return (
    <div 
      className={`${dirClass} print-receipt`} 
      id="work-order-receipt"
      dir={isRtl ? "rtl" : "ltr"}
      style={{ 
        width: '80mm', 
        maxWidth: '80mm',
        margin: '0 auto',
        backgroundColor: '#FFFBEB',
        padding: '6mm',
        fontSize: '12px',
        border: '1px solid #FDE68A',
        borderRadius: '4px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        fontFamily: 'Cairo, sans-serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always'
      }}
    >
      <div className="flex flex-col items-center justify-center h-full gap-3 py-6">
        <AlertTriangle className="w-10 h-10 text-amber-500" />
        <h3 className="font-bold text-amber-800 text-lg text-center">
          {t("startBySelectingClient")}
        </h3>
      </div>
    </div>
  );
};
