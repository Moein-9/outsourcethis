
import React from "react";
import { useLanguageStore } from "@/store/languageStore";

export const ReceiptFooter: React.FC = () => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  return (
    <div className="text-center border-t border-gray-300 pt-2 text-xs">
      <p className="font-bold text-sm mb-0">
        {isRtl ? "شكراً لاختياركم نظارات المعين" : "Thank you for choosing Moein Optical"}
      </p>
      <p className="text-[9px] mt-1 text-gray-500">
        {isRtl ? "هذا الإيصال يعتبر إثبات للطلب فقط وليس إيصال دفع" : 
                "This receipt is proof of order only and not a payment receipt"}
      </p>
    </div>
  );
};
