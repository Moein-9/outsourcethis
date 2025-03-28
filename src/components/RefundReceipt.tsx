
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, Refund } from "@/store/invoiceStore";
import { format, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { MoenLogoGreen } from "@/assets/logo";

interface RefundReceiptProps {
  invoice: Invoice;
  refund: Refund;
  isPrintable?: boolean;
}

export const RefundReceipt: React.FC<RefundReceiptProps> = ({ 
  invoice, 
  refund,
  isPrintable = false 
}) => {
  const { language } = useLanguageStore();
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP", { locale: language === 'ar' ? ar : enUS });
    } catch (error) {
      return language === 'ar' ? "تاريخ غير صالح" : "Invalid date";
    }
  };
  
  const formatTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), "p", { locale: language === 'ar' ? ar : enUS });
    } catch (error) {
      return "";
    }
  };
  
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const textAlign = language === 'ar' ? 'text-right' : 'text-left';
  
  return (
    <div className={`font-cairo ${dir} ${isPrintable ? 'print-receipt' : ''}`}>
      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center justify-center">
            <MoenLogoGreen className="h-20 w-auto" />
          </div>
          <h1 className="text-xl font-bold mt-3 text-primary">
            {language === 'ar' ? 'إيصال استرداد' : 'Refund Receipt'}
          </h1>
        </div>
        
        <div className="border-t border-b border-dashed border-gray-200 py-3 mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-600 text-sm">
              {language === 'ar' ? 'رقم الإيصال' : 'Receipt No'}:
            </span>
            <span className="font-bold">{refund.refundId}</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-600 text-sm">
              {language === 'ar' ? 'التاريخ' : 'Date'}:
            </span>
            <span>{formatDate(refund.date)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">
              {language === 'ar' ? 'الوقت' : 'Time'}:
            </span>
            <span>{formatTime(refund.date)}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <h2 className={`font-semibold text-gray-800 mb-2 ${textAlign}`}>
            {language === 'ar' ? 'معلومات العميل' : 'Customer Information'}
          </h2>
          <div className="bg-gray-50 rounded-md p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-600 text-sm">
                {language === 'ar' ? 'الاسم' : 'Name'}:
              </span>
              <span className="font-medium">{invoice.patientName}</span>
            </div>
            {invoice.patientPhone && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  {language === 'ar' ? 'الهاتف' : 'Phone'}:
                </span>
                <span dir="ltr">{invoice.patientPhone}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <h2 className={`font-semibold text-gray-800 mb-2 ${textAlign}`}>
            {language === 'ar' ? 'تفاصيل الفاتورة الأصلية' : 'Original Invoice Details'}
          </h2>
          <div className="bg-gray-50 rounded-md p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-600 text-sm">
                {language === 'ar' ? 'رقم الفاتورة' : 'Invoice No'}:
              </span>
              <span className="font-medium">{invoice.invoiceId}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-600 text-sm">
                {language === 'ar' ? 'تاريخ الفاتورة' : 'Invoice Date'}:
              </span>
              <span>{formatDate(invoice.createdAt)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">
                {language === 'ar' ? 'إجمالي الفاتورة' : 'Invoice Total'}:
              </span>
              <span className="font-bold">{invoice.total.toFixed(3)} KWD</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-dashed border-gray-200 pt-4 mb-4">
          <h2 className={`font-semibold text-gray-800 mb-2 ${textAlign}`}>
            {language === 'ar' ? 'تفاصيل الاسترداد' : 'Refund Details'}
          </h2>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {language === 'ar' ? 'المبلغ المسترد' : 'Refund Amount'}:
              </span>
              <span className="font-bold text-lg text-red-600">{refund.amount.toFixed(3)} KWD</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {language === 'ar' ? 'طريقة الاسترداد' : 'Refund Method'}:
              </span>
              <span>
                {refund.method === 'Cash' 
                  ? (language === 'ar' ? 'نقداً' : 'Cash')
                  : refund.method === 'Card' 
                    ? (language === 'ar' ? 'بطاقة ائتمان' : 'Credit Card')
                    : refund.method}
              </span>
            </div>
            
            {refund.authNumber && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  {language === 'ar' ? 'رقم التفويض' : 'Auth Number'}:
                </span>
                <span>{refund.authNumber}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-600">
                {language === 'ar' ? 'سبب الاسترداد' : 'Reason'}:
              </span>
              <span className="text-sm max-w-[60%] text-right">{refund.reason}</span>
            </div>
          </div>
        </div>
        
        {refund.notes && (
          <div className="border-t border-dashed border-gray-200 pt-3 mb-4">
            <h2 className={`font-semibold text-gray-800 mb-2 ${textAlign}`}>
              {language === 'ar' ? 'ملاحظات' : 'Notes'}
            </h2>
            <p className={`text-sm text-gray-700 ${textAlign}`}>{refund.notes}</p>
          </div>
        )}
        
        <div className="border-t border-dashed border-gray-200 pt-4 mt-6 text-center">
          <p className="text-sm text-gray-600 mb-1">
            {language === 'ar' 
              ? 'شكراً لتعاملكم معنا'
              : 'Thank you for your business'}
          </p>
          
          <p className="text-xs text-gray-500">
            {language === 'ar' 
              ? 'هذا الإيصال هو إثبات رسمي للاسترداد'
              : 'This receipt is an official proof of refund'}
          </p>
        </div>
      </div>
    </div>
  );
};
