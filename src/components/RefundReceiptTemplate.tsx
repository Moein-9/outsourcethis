
import React from 'react';
import { Refund } from '@/store/invoiceStore';
import { usePatientStore } from '@/store/patientStore';
import { format } from 'date-fns';

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
      className="w-full max-w-[80mm] mx-auto bg-white p-4 text-black"
      style={{ direction, textAlign }}
      id="refund-receipt"
    >
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-lg font-bold">
          {isArabic ? 'إيصال استرداد' : 'REFUND RECEIPT'}
        </div>
        <div className="text-sm">
          {isArabic ? `رقم الاسترداد: ${refund.refundId}` : `Refund #: ${refund.refundId}`}
        </div>
        <div className="text-sm">
          {isArabic ? `التاريخ: ${formattedDate}` : `Date: ${formattedDate}`}
        </div>
      </div>
      
      {/* Customer Information */}
      <div className="mb-4 text-sm">
        <div className="font-bold">
          {isArabic ? 'معلومات العميل:' : 'Customer Information:'}
        </div>
        <div>{refund.patientName}</div>
        <div>{refund.patientPhone}</div>
      </div>
      
      {/* Original Invoice Info */}
      <div className="mb-4 text-sm">
        <div className="font-bold">
          {isArabic ? 'معلومات الفاتورة الأصلية:' : 'Original Invoice Info:'}
        </div>
        <div>
          {isArabic ? `رقم الفاتورة: ${refund.invoiceId}` : `Invoice #: ${refund.invoiceId}`}
        </div>
      </div>
      
      {/* Product Information if available */}
      {(refund.frameBrand || refund.frameModel) && (
        <div className="mb-4 text-sm">
          <div className="font-bold">
            {isArabic ? 'معلومات المنتج:' : 'Product Information:'}
          </div>
          {refund.frameBrand && (
            <div>
              {isArabic ? `الماركة: ${refund.frameBrand}` : `Brand: ${refund.frameBrand}`}
            </div>
          )}
          {refund.frameModel && (
            <div>
              {isArabic ? `الموديل: ${refund.frameModel}` : `Model: ${refund.frameModel}`}
            </div>
          )}
        </div>
      )}
      
      {/* Refund Details */}
      <div className="mb-4 text-sm">
        <div className="font-bold">
          {isArabic ? 'تفاصيل الاسترداد:' : 'Refund Details:'}
        </div>
        <div>
          {isArabic 
            ? `طريقة الاسترداد: ${refund.refundMethod}` 
            : `Refund Method: ${refund.refundMethod}`}
        </div>
        <div>
          {isArabic 
            ? `سبب الاسترداد: ${refund.refundReason}` 
            : `Reason for Refund: ${refund.refundReason}`}
        </div>
      </div>
      
      {/* Amount Information */}
      <div className="my-4 border-t border-b border-gray-300 py-2">
        <div className="flex justify-between text-sm font-bold">
          <div>{isArabic ? 'المبلغ الأصلي:' : 'Original Amount:'}</div>
          <div>{refund.originalTotal.toFixed(3)} KWD</div>
        </div>
        <div className="flex justify-between text-sm font-bold">
          <div>{isArabic ? 'مبلغ الاسترداد:' : 'Refund Amount:'}</div>
          <div>{refund.refundAmount.toFixed(3)} KWD</div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center text-xs mt-6 pt-2 border-t border-gray-300">
        <p>{isArabic ? 'شكراً لزيارتكم' : 'Thank you for your visit'}</p>
        <p className="mt-1">
          {isArabic 
            ? 'جميع المبيعات نهائية بعد مغادرة المتجر ما لم يتم الاتفاق على خلاف ذلك' 
            : 'All sales are final after leaving the store unless otherwise agreed'
          }
        </p>
      </div>
    </div>
  );
};
