
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface PaymentSectionProps {
  total: number;
  deposit: number;
  discount: number;
  amountPaid: number;
  remaining: number;
  isPaid: boolean;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  total,
  deposit,
  discount,
  amountPaid,
  remaining,
  isPaid
}) => {
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  const subtotal = total + discount;
  
  return (
    <div className="mb-3">
      <div className="text-center bg-black text-white py-1 mb-2 font-bold text-base rounded">
        {isRtl 
          ? "معلومات الدفع | Payment Information" 
          : "Payment Information | معلومات الدفع"}
      </div>
      
      <Card className="border border-gray-200 rounded-md">
        <CardContent className="p-3">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="font-bold">{t("subtotal")}:</span>
              <span className="font-semibold">{subtotal.toFixed(3)} KWD</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="font-bold">{t("discount")}:</span>
                <span className="font-semibold">-{discount.toFixed(3)} KWD</span>
              </div>
            )}
            
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span className="font-bold">{t("total")}:</span>
              <span className="font-semibold">{total.toFixed(3)} KWD</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-bold">{t("paid")}:</span>
              <span className="font-semibold">{amountPaid.toFixed(3)} KWD</span>
            </div>
            
            {isPaid ? (
              <div className="mt-2 p-1.5 bg-green-100 rounded border border-green-300 text-center">
                <div className="flex items-center justify-center gap-1 text-green-800 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isRtl ? "تم الدفع بالكامل" : "PAID IN FULL"}</span>
                </div>
                {!isRtl ? <div className="text-green-700 text-xs">تم الدفع بالكامل</div> : 
                         <div className="text-green-700 text-xs">PAID IN FULL</div>}
              </div>
            ) : (
              <div className="mt-2">
                <div className="p-1.5 bg-red-100 rounded border border-red-300 text-center">
                  <div className="font-bold text-red-700 text-base">
                    {isRtl ? "المبلغ المتبقي" : "REMAINING AMOUNT"}
                  </div>
                  <div className="text-lg font-bold text-red-800">
                    {remaining.toFixed(3)} KWD
                  </div>
                  {!isRtl ? <div className="text-red-700 text-xs">المبلغ المتبقي</div> : 
                           <div className="text-red-700 text-xs">REMAINING AMOUNT</div>}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
