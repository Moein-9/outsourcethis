
import React from "react";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

interface ReceiptHeaderProps {
  invoiceNumber: string;
}

export const ReceiptHeader: React.FC<ReceiptHeaderProps> = ({
  invoiceNumber,
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  return (
    <>
      {/* Header with logo */}
      <div className="text-center border-b border-gray-300 pb-2 mb-2">
        <div className="flex justify-center mb-1">
          <MoenLogo className="w-auto h-12" />
        </div>
        <h2 className="font-bold text-lg mb-0">{storeInfo.name}</h2>
        <p className="text-xs font-medium mb-0 text-gray-600">{storeInfo.address}</p>
        <p className="text-xs font-medium text-gray-600">{isRtl ? "الهاتف" : "Phone"}: {storeInfo.phone}</p>
      </div>

      {/* Work Order Title */}
      <div className="text-center mb-3">
        <div className="bg-black text-white py-1 px-2 mb-2 font-bold text-base rounded">
          {isRtl ? "أمر عمل | WORK ORDER" : "WORK ORDER | أمر عمل"}
        </div>
        <p className="text-xs mb-0 text-gray-600">
          {isRtl ? "ORDER #: " : "رقم الطلب: "}
          <span className="font-semibold">{invoiceNumber}</span>
        </p>
        <p className="text-xs text-gray-600 rx-creation-date">
          {format(new Date(), 'yyyy-MM-dd HH:mm', { locale: enUS })}
        </p>
      </div>
    </>
  );
};
