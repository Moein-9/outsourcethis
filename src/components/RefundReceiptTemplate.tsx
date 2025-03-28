
import React from 'react';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  Calendar, 
  Receipt, 
  CreditCard,
  User, 
  Phone, 
  FileText,
  CircleDollarSign,
  Undo2,
  ArrowLeftRight,
  Store
} from 'lucide-react';
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
  const { t } = useLanguageStore();
  const isArabic = language === 'ar';
  const dirClass = isArabic ? 'rtl' : 'ltr';
  
  // Format the date using date-fns
  const formattedDate = format(new Date(refund.refundDate), 'dd/MM/yyyy hh:mm a');
  
  return (
    <div 
      className={`${dirClass} print-receipt bg-white`} 
      id="refund-receipt"
      dir={isArabic ? "rtl" : "ltr"}
      style={{ 
        width: '80mm', 
        maxWidth: '80mm',
        margin: '0 auto',
        padding: '3mm',
        fontSize: '12px',
        fontFamily: isArabic ? 'Zain, sans-serif' : 'Yrsa, serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always',
      }}
    >
      {/* Store Logo and Information Header */}
      <div className="flex flex-col items-center border-b-2 border-black pb-2 mb-3">
        <MoenLogo className="w-auto h-9 mb-1" />
        <h2 className="font-bold text-base mb-0.5">{storeInfo.name}</h2>
        <p className="text-xs text-gray-700 mb-0.5">{storeInfo.address}</p>
        <div className="flex items-center justify-center text-xs text-gray-700">
          <Phone className="w-3 h-3 mr-1" />
          <span>{storeInfo.phone}</span>
        </div>
      </div>
      
      {/* Refund Receipt Title */}
      <div className="mb-3 text-center">
        <div className="bg-black text-white py-1.5 px-3 rounded-md inline-flex items-center justify-center gap-1.5 mx-auto">
          <Undo2 className="h-4 w-4" />
          <span className="font-bold text-base">
            {isArabic ? "إيصال استرداد | REFUND RECEIPT" : "REFUND RECEIPT | إيصال استرداد"}
          </span>
        </div>
      </div>

      {/* Customer Information */}
      <div className="mb-3">
        <div className="bg-gray-100 py-1 px-2 rounded-t-md border-t border-x border-gray-300">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span className="font-bold text-sm">
              {isArabic ? "معلومات العميل | Customer Info" : "Customer Info | معلومات العميل"}
            </span>
          </div>
        </div>
        
        <div className="p-2 border border-gray-300 rounded-b-md space-y-1.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-gray-600" />
              <span className="font-medium text-sm">{isArabic ? "الاسم" : "Name"}:</span>
            </div>
            <span className="font-semibold text-sm">{refund.patientName}</span>
          </div>
          
          {refund.patientPhone && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-gray-600" />
                <span className="font-medium text-sm">{isArabic ? "الهاتف" : "Phone"}:</span>
              </div>
              <span className="font-semibold text-sm">{refund.patientPhone}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Refund Info */}
      <div className="mb-3">
        <div className="bg-gray-100 py-1 px-2 rounded-t-md border-t border-x border-gray-300">
          <div className="flex items-center gap-1">
            <Receipt className="w-4 h-4" />
            <span className="font-bold text-sm">
              {isArabic ? "معلومات الاسترداد | Refund Info" : "Refund Info | معلومات الاسترداد"}
            </span>
          </div>
        </div>
        
        <div className="p-2 border border-gray-300 rounded-b-md space-y-1.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5 text-gray-600" />
              <span className="font-medium text-sm">{isArabic ? "رقم الاسترداد" : "Refund ID"}:</span>
            </div>
            <span className="font-semibold text-sm">#{refund.refundId}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-600" />
              <span className="font-medium text-sm">{isArabic ? "التاريخ" : "Date"}:</span>
            </div>
            <span className="font-semibold text-sm">{formattedDate}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-gray-600" />
              <span className="font-medium text-sm">{isArabic ? "رقم الفاتورة" : "Invoice"}:</span>
            </div>
            <span className="font-semibold text-sm">#{refund.invoiceId}</span>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-3">
        <div className="bg-black text-white py-1 px-2 rounded-t-md flex items-center justify-center gap-1.5">
          <Store className="w-4 h-4" />
          <span className="font-bold text-sm">
            {isArabic ? "المنتجات | Products" : "Products | المنتجات"}
          </span>
        </div>
        
        <div className="border-x border-b border-gray-300 rounded-b-md p-2 space-y-2">
          {/* Product Information if available */}
          {(refund.frameBrand || refund.frameModel || refund.lensType) ? (
            <div className="space-y-2">
              {refund.frameBrand && (
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="bg-gray-50 py-1 px-2 border-b border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-sm">{isArabic ? "الإطار | Frame" : "Frame | الإطار"}</span>
                    <span className="font-semibold text-sm bg-gray-100 px-2 py-0.5 rounded">
                      {refund.invoiceItems?.find(item => item.name.includes(refund.frameBrand || ''))?.price.toFixed(3) || '0.000'} KWD
                    </span>
                  </div>
                  <div className="p-1.5 text-center">
                    <span className="text-xs">
                      {refund.frameBrand} {refund.frameModel} 
                      {refund.frameColor && ` (${refund.frameColor})`}
                    </span>
                  </div>
                </div>
              )}
              
              {refund.lensType && (
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="bg-gray-50 py-1 px-2 border-b border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-sm">{isArabic ? "العدسات | Lenses" : "Lenses | العدسات"}</span>
                    <span className="font-semibold text-sm bg-gray-100 px-2 py-0.5 rounded">
                      {refund.invoiceItems?.find(item => item.name.includes('lens') || item.name.includes('Lens'))?.price.toFixed(3) || '0.000'} KWD
                    </span>
                  </div>
                  <div className="p-1.5 text-center">
                    <span className="text-xs">{refund.lensType}</span>
                  </div>
                </div>
              )}
            </div>
          ) : refund.invoiceItems && refund.invoiceItems.length > 0 ? (
            <div className="space-y-2">
              {refund.invoiceItems.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="bg-gray-50 py-1 px-2 border-b border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-sm">{item.name}</span>
                    <span className="font-semibold text-sm bg-gray-100 px-2 py-0.5 rounded">
                      {item.price.toFixed(3)} KWD
                    </span>
                  </div>
                  {item.quantity && item.quantity > 1 && (
                    <div className="p-1.5 text-center">
                      <span className="text-xs">{isArabic ? "الكمية" : "Quantity"}: {item.quantity}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-3 text-center text-sm text-gray-500 italic">
              {isArabic ? "لا توجد منتجات" : "No products"}
            </div>
          )}
        </div>
      </div>
      
      {/* Refund Details */}
      <div className="mb-3">
        <div className="bg-black text-white py-1 px-2 rounded-t-md flex items-center justify-center gap-1.5">
          <ArrowLeftRight className="w-4 h-4" />
          <span className="font-bold text-sm">
            {isArabic ? "تفاصيل الاسترداد | Refund Details" : "Refund Details | تفاصيل الاسترداد"}
          </span>
        </div>

        <div className="border-x border-b border-gray-300 rounded-b-md p-2 space-y-2">
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="bg-gray-50 py-1 px-2 border-b border-gray-200">
              <span className="font-bold text-sm">{isArabic ? "طريقة الاسترداد" : "Refund Method"}</span>
            </div>
            <div className="p-1.5 text-center">
              <span className="text-sm font-medium">{refund.refundMethod}</span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="bg-gray-50 py-1 px-2 border-b border-gray-200">
              <span className="font-bold text-sm">{isArabic ? "سبب الاسترداد" : "Reason for Refund"}</span>
            </div>
            <div className="p-1.5 text-center">
              <span className="text-xs">{refund.refundReason}</span>
            </div>
          </div>
          
          {refund.staffNotes && (
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-50 py-1 px-2 border-b border-gray-200">
                <span className="font-bold text-sm">{isArabic ? "ملاحظات" : "Notes"}</span>
              </div>
              <div className="p-1.5 text-center">
                <span className="text-xs italic">{refund.staffNotes}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Amount Information */}
      <div className="mb-3 border-2 border-black rounded-md overflow-hidden">
        <div className="p-2 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm">{isArabic ? "المبلغ الأصلي" : "Original Amount"}:</span>
            <span className="font-semibold text-sm">{refund.originalTotal.toFixed(3)} KWD</span>
          </div>
          
          <Separator className="my-1 bg-gray-300" />
          
          <div className="bg-gray-100 p-2 rounded-md flex justify-between items-center">
            <div className="flex items-center gap-1">
              <CircleDollarSign className="h-4 w-4 text-black" />
              <span className="font-bold text-sm">{isArabic ? "مبلغ الاسترداد" : "Refund Amount"}</span>
            </div>
            <span className="font-bold text-sm">{refund.refundAmount.toFixed(3)} KWD</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="pt-2 mt-3 border-t-2 border-black text-center">
        <div className="mb-2">
          <Button variant="default" size="sm" className="bg-black text-white hover:bg-black/90 gap-1 py-1 h-auto">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-bold text-sm">{isArabic ? "تم الاسترداد" : "Refunded"}</span>
          </Button>
        </div>
        
        <p className="font-bold text-xs mb-1 text-gray-800">
          {isArabic
            ? "شكراً لاختياركم نظارات المعين. يسعدنا خدمتكم دائماً!"
            : "Thank you for choosing Moein Optical. We're always delighted to serve you!"}
        </p>
        <div className="text-xs text-gray-500">
          {format(new Date(), 'yyyy-MM-dd')}
        </div>
      </div>
      
      <style>
        {`
          @media print {
            @page {
              size: 80mm auto !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            body {
              width: 80mm !important;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }
            
            #refund-receipt {
              width: 74mm !important; /* 80mm - 6mm for padding */
              max-width: 74mm !important;
              page-break-after: always !important;
              page-break-inside: avoid !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              border: none !important;
              box-shadow: none !important;
              padding: 3mm !important;
              margin: 0 !important;
              background: white !important;
              height: auto !important;
              min-height: 0 !important;
              max-height: none !important;
            }
            
            .print-receipt * {
              visibility: visible !important;
              opacity: 1 !important;
            }
            
            html, body {
              height: auto !important;
              min-height: 0 !important;
              max-height: none !important;
              overflow: visible !important;
            }
            
            body {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .print-receipt {
              height: fit-content !important;
              min-height: fit-content !important;
              max-height: fit-content !important;
            }
            
            .print-receipt {
              break-inside: avoid !important;
              break-after: avoid-page !important;
              page-break-inside: avoid !important;
              page-break-after: avoid !important;
            }
            
            /* Button styling for print */
            .print-receipt button {
              background-color: black !important;
              color: white !important;
              border: none !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            @supports (-webkit-appearance:none) {
              body, html, #refund-receipt {
                height: fit-content !important;
                min-height: fit-content !important;
                max-height: fit-content !important;
              }
            }
          }
        `}
      </style>
    </div>
  );
};
