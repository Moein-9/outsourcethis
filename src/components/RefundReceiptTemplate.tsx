
import React from 'react';
import { Refund } from '@/store/invoiceStore';
import { usePatientStore } from '@/store/patientStore';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  Calendar, 
  Receipt, 
  CreditCard, 
  User, 
  Phone, 
  Glasses, 
  Info, 
  RefreshCcw
} from 'lucide-react';

interface RefundReceiptTemplateProps {
  refund: {
    refundId: string;
    invoiceId: string;
    patientName: string;
    patientPhone: string;
    patientId?: string;
    refundAmount: number;
    refundMethod: string;
    refundReason: string;
    refundDate: string;
    originalTotal: number;
    frameBrand?: string;
    frameModel?: string;
    frameColor?: string;
    lensType?: string;
    invoiceItems?: Array<{
      name: string;
      price: number;
      quantity?: number;
    }>;
    staffNotes?: string;
  };
  language: string;
}

export const RefundReceiptTemplate: React.FC<RefundReceiptTemplateProps> = ({ refund, language }) => {
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const textAlign = isArabic ? 'right' : 'left';
  
  // Format the date using date-fns
  const formattedDate = format(new Date(refund.refundDate), 'dd/MM/yyyy hh:mm a');
  
  return (
    <div 
      className="w-full max-w-[80mm] mx-auto bg-white text-black"
      style={{ direction, textAlign }}
      id="refund-receipt"
    >
      {/* Header with styling to match invoice */}
      <div className="bg-blue-600 text-white text-center p-3 rounded-t-md">
        <div className="text-lg font-bold flex items-center justify-center gap-2">
          <RefreshCcw size={18} />
          {isArabic ? 'إيصال استرداد' : 'REFUND RECEIPT'}
        </div>
        <div className="text-sm opacity-90">
          {isArabic ? `رقم الاسترداد: ${refund.refundId}` : `Refund #: ${refund.refundId}`}
        </div>
      </div>
      
      {/* Date and Invoice Reference */}
      <div className="bg-blue-50 p-3 border-b border-blue-200 flex justify-between items-center">
        <div className="flex items-center gap-1 text-blue-700">
          <Calendar size={14} />
          <span className="text-sm font-medium">
            {isArabic ? `التاريخ: ${formattedDate}` : `Date: ${formattedDate}`}
          </span>
        </div>
        <div className="flex items-center gap-1 text-blue-700">
          <Receipt size={14} />
          <span className="text-sm font-medium">
            {isArabic ? `الفاتورة: ${refund.invoiceId}` : `Invoice: ${refund.invoiceId}`}
          </span>
        </div>
      </div>
      
      {/* Customer Information */}
      <div className="p-3 border-b border-gray-200">
        <div className="font-bold text-sm flex items-center gap-1 mb-1 text-blue-700">
          <User size={14} />
          {isArabic ? 'معلومات العميل:' : 'Customer Information:'}
        </div>
        <div className="pl-5">
          <div className="text-sm font-medium">{refund.patientName}</div>
          <div className="text-sm flex items-center gap-1 opacity-75">
            <Phone size={12} />
            {refund.patientPhone}
          </div>
        </div>
      </div>
      
      {/* Product Information if available */}
      {(refund.frameBrand || refund.frameModel || refund.lensType) && (
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <div className="font-bold text-sm flex items-center gap-1 mb-1 text-blue-700">
            <Glasses size={14} />
            {isArabic ? 'معلومات المنتج:' : 'Product Information:'}
          </div>
          <div className="pl-5">
            {refund.frameBrand && (
              <div className="text-sm">
                {isArabic ? `الماركة: ${refund.frameBrand}` : `Brand: ${refund.frameBrand}`}
                {refund.frameModel && ` - ${refund.frameModel}`}
                {refund.frameColor && ` (${refund.frameColor})`}
              </div>
            )}
            {refund.lensType && (
              <div className="text-sm">
                {isArabic ? `نوع العدسة: ${refund.lensType}` : `Lens Type: ${refund.lensType}`}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Item Details if available */}
      {refund.invoiceItems && refund.invoiceItems.length > 0 && (
        <div className="p-3 border-b border-gray-200">
          <div className="font-bold text-sm mb-1">
            {isArabic ? 'تفاصيل العناصر:' : 'Item Details:'}
          </div>
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-1 text-left">{isArabic ? 'العنصر' : 'Item'}</th>
                <th className="p-1 text-right">{isArabic ? 'السعر' : 'Price'}</th>
              </tr>
            </thead>
            <tbody>
              {refund.invoiceItems.map((item, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="p-1">
                    {item.name} 
                    {item.quantity && item.quantity > 1 ? ` (x${item.quantity})` : ''}
                  </td>
                  <td className="p-1 text-right font-medium">{item.price.toFixed(3)} KWD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Refund Details */}
      <div className="p-3 border-b border-gray-200">
        <div className="font-bold text-sm flex items-center gap-1 mb-1 text-blue-700">
          <Info size={14} />
          {isArabic ? 'تفاصيل الاسترداد:' : 'Refund Details:'}
        </div>
        <div className="pl-5">
          <div className="text-sm flex justify-between">
            <span>{isArabic ? 'طريقة الاسترداد:' : 'Refund Method:'}</span>
            <span className="font-medium flex items-center gap-1">
              <CreditCard size={12} />
              {refund.refundMethod}
            </span>
          </div>
          <div className="text-sm">
            <div className="mb-1">{isArabic ? 'سبب الاسترداد:' : 'Reason for Refund:'}</div>
            <div className="bg-gray-50 p-1.5 rounded text-xs border border-gray-200">
              {refund.refundReason}
            </div>
          </div>
          
          {refund.staffNotes && (
            <div className="text-xs mt-2 italic opacity-75">
              <div className="mb-0.5">{isArabic ? 'ملاحظات:' : 'Notes:'}</div>
              <div className="bg-gray-50 p-1.5 rounded text-xs border border-gray-100">
                {refund.staffNotes}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Amount Information */}
      <div className="p-3 bg-blue-50 border-b border-blue-200">
        <div className="flex justify-between text-sm mb-1">
          <div className="font-medium">{isArabic ? 'المبلغ الأصلي:' : 'Original Amount:'}</div>
          <div className="font-medium">{refund.originalTotal.toFixed(3)} KWD</div>
        </div>
        <div className="flex justify-between text-base font-bold text-blue-700">
          <div className="flex items-center gap-1">
            <CheckCircle2 size={14} className="text-green-600" />
            {isArabic ? 'مبلغ الاسترداد:' : 'Refund Amount:'}
          </div>
          <div>{refund.refundAmount.toFixed(3)} KWD</div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center text-xs p-3 pt-4 bg-gray-50 rounded-b-md">
        <div className="mb-1 font-medium">
          {isArabic ? 'شكراً لزيارتكم' : 'Thank you for your visit'}
        </div>
        <p className="opacity-75">
          {isArabic 
            ? 'جميع المبيعات نهائية بعد مغادرة المتجر ما لم يتم الاتفاق على خلاف ذلك' 
            : 'All sales are final after leaving the store unless otherwise agreed'
          }
        </p>
      </div>
    </div>
  );
};
