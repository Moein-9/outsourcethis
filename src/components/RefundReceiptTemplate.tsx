
import React from 'react';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  Calendar, 
  Receipt, 
  CreditCard, 
  User, 
  Phone, 
  BanknoteIcon, 
  FileText,
  CircleDollarSign,
  Undo2,
  ArrowLeftRight,
  RefreshCw,
  Store
} from 'lucide-react';
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
        padding: '2mm',
        fontSize: '12px',
        fontFamily: isArabic ? 'Zain, sans-serif' : 'Yrsa, serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always',
        textAlign: 'center',
      }}
    >
      {/* Store Logo and Information Header */}
      <div className="border-b border-black pb-1 mb-2">
        <div className="flex justify-center mb-1">
          <MoenLogo className="w-auto h-8" />
        </div>
        <h2 className="font-bold text-base mb-0">{storeInfo.name}</h2>
        <p className="text-xs text-gray-700 mb-0">{storeInfo.address}</p>
        <div className="flex items-center justify-center text-xs text-gray-700 gap-1">
          <Phone className="w-3 h-3" />
          <span>{storeInfo.phone}</span>
        </div>
      </div>
      
      {/* Refund Receipt Title */}
      <div className="mb-2">
        <div className="inline-flex items-center justify-center gap-1 border-2 border-black px-2 py-0.5 rounded">
          <Undo2 className="h-4 w-4" />
          <span className="font-bold text-base">
            {isArabic ? "إيصال استرداد | REFUND RECEIPT" : "REFUND RECEIPT | إيصال استرداد"}
          </span>
        </div>
      </div>

      {/* Customer Information Card */}
      <div className="mb-2 border-2 border-black rounded p-1.5">
        <div className="mb-1 border-b border-gray-400 pb-1">
          <div className="flex items-center justify-center gap-1">
            <User className="w-4 h-4" />
            <span className="font-bold text-base">
              {isArabic ? "معلومات العميل | Customer Info" : "Customer Info | معلومات العميل"}
            </span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span className="font-semibold text-sm">{isArabic ? "الاسم" : "Name"}:</span>
            </div>
            <span className="font-semibold text-sm">{refund.patientName}</span>
          </div>
          
          {refund.patientPhone && (
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span className="font-semibold text-sm">{isArabic ? "الهاتف" : "Phone"}:</span>
              </div>
              <span className="font-semibold text-sm">{refund.patientPhone}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Refund Info Card */}
      <div className="mb-2 border-2 border-black rounded p-1.5">
        <div className="mb-1 border-b border-gray-400 pb-1">
          <div className="flex items-center justify-center gap-1">
            <Receipt className="w-4 h-4" />
            <span className="font-bold text-base">
              {isArabic ? "معلومات الاسترداد | Refund Info" : "Refund Info | معلومات الاسترداد"}
            </span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5" />
              <span className="font-semibold text-sm">{isArabic ? "رقم الاسترداد" : "Refund ID"}:</span>
            </div>
            <span className="font-semibold text-sm">#{refund.refundId}</span>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-semibold text-sm">{isArabic ? "التاريخ" : "Date"}:</span>
            </div>
            <span className="font-semibold text-sm">{formattedDate}</span>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span className="font-semibold text-sm">{isArabic ? "رقم الفاتورة" : "Invoice"}:</span>
            </div>
            <span className="font-semibold text-sm">#{refund.invoiceId}</span>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-2">
        <div className="py-1 bg-black text-white mb-2 font-bold text-base rounded">
          <div className="flex items-center justify-center gap-1">
            <Store className="w-4 h-4" />
            {isArabic ? "المنتجات | Products" : "Products | المنتجات"}
          </div>
        </div>
        
        <div className="space-y-2 px-1">
          {/* Product Information if available */}
          {(refund.frameBrand || refund.frameModel || refund.lensType) ? (
            <div className="space-y-2">
              {refund.frameBrand && (
                <div className="p-1.5 border border-gray-300 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold text-sm">{isArabic ? "الإطار | Frame" : "Frame | الإطار"}</div>
                    <span className="font-bold text-sm bg-gray-100 px-2 py-0.5 rounded">
                      {refund.invoiceItems?.find(item => item.name.includes(refund.frameBrand || ''))?.price.toFixed(3) || '0.000'} KWD
                    </span>
                  </div>
                  <div className="text-xs text-center bg-gray-50 py-1 px-2 rounded border border-gray-200">
                    {refund.frameBrand} {refund.frameModel} 
                    {refund.frameColor && ` (${refund.frameColor})`}
                  </div>
                </div>
              )}
              
              {refund.lensType && (
                <div className="p-1.5 border border-gray-300 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold text-sm">{isArabic ? "العدسات | Lenses" : "Lenses | العدسات"}</div>
                    <span className="font-bold text-sm bg-gray-100 px-2 py-0.5 rounded">
                      {refund.invoiceItems?.find(item => item.name.includes('lens') || item.name.includes('Lens'))?.price.toFixed(3) || '0.000'} KWD
                    </span>
                  </div>
                  <div className="text-xs text-center bg-gray-50 py-1 px-2 rounded border border-gray-200">
                    {refund.lensType}
                  </div>
                </div>
              )}
            </div>
          ) : refund.invoiceItems && refund.invoiceItems.length > 0 ? (
            <div className="space-y-2">
              {refund.invoiceItems.map((item, index) => (
                <div key={index} className="p-1.5 border border-gray-300 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold text-sm">{item.name}</div>
                    <span className="font-bold text-sm bg-gray-100 px-2 py-0.5 rounded">
                      {item.price.toFixed(3)} KWD
                    </span>
                  </div>
                  {item.quantity && item.quantity > 1 && (
                    <div className="text-xs text-center bg-gray-50 py-1 px-2 rounded border border-gray-200">
                      {isArabic ? "الكمية" : "Quantity"}: {item.quantity}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-sm text-gray-500 italic py-2">
              {isArabic ? "لا توجد منتجات" : "No products"}
            </div>
          )}
        </div>
      </div>
      
      {/* Refund Details */}
      <div className="mb-2">
        <div className="py-1 bg-black text-white mb-2 font-bold text-base rounded">
          <div className="flex items-center justify-center gap-1">
            <ArrowLeftRight className="w-4 h-4" />
            {isArabic ? "تفاصيل الاسترداد | Refund Details" : "Refund Details | تفاصيل الاسترداد"}
          </div>
        </div>

        <div className="space-y-2 px-1">
          <div className="p-1.5 border border-gray-300 rounded">
            <div className="flex justify-between items-center mb-1">
              <div className="font-bold text-sm">{isArabic ? "طريقة الاسترداد" : "Refund Method"}</div>
              <span className="font-bold text-sm bg-gray-100 px-2 py-0.5 rounded">
                {refund.refundMethod}
              </span>
            </div>
          </div>
          
          <div className="p-1.5 border border-gray-300 rounded">
            <div className="mb-1">
              <div className="font-bold text-sm">{isArabic ? "سبب الاسترداد" : "Reason for Refund"}</div>
            </div>
            <div className="text-xs bg-gray-50 py-1 px-2 rounded border border-gray-200">
              {refund.refundReason}
            </div>
          </div>
          
          {refund.staffNotes && (
            <div className="p-1.5 border border-gray-300 rounded">
              <div className="mb-1">
                <div className="font-bold text-sm">{isArabic ? "ملاحظات" : "Notes"}</div>
              </div>
              <div className="text-xs bg-gray-50 py-1 px-2 rounded border border-gray-200 italic">
                {refund.staffNotes}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Amount Information */}
      <div className="mb-2 border-2 border-black rounded p-1.5">
        <div className="space-y-1 px-2">
          <div className="flex justify-between text-sm">
            <span className="font-bold">{isArabic ? "المبلغ الأصلي" : "Original Amount"}:</span>
            <span className="font-semibold">{refund.originalTotal.toFixed(3)} KWD</span>
          </div>
          
          <div className="border-t border-gray-400 my-1 pt-1"></div>
          
          <div className="flex justify-between bg-gray-100 p-1 rounded">
            <div className="flex items-center gap-1">
              <CircleDollarSign className="h-4 w-4" />
              <span className="font-bold text-sm">{isArabic ? "مبلغ الاسترداد" : "Refund Amount"}</span>
            </div>
            <span className="font-bold text-sm">{refund.refundAmount.toFixed(3)} KWD</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-3 pt-1 border-t-2 border-black">
        <div className="inline-flex items-center justify-center gap-1 bg-black text-white py-1 px-3 rounded mb-2">
          <CheckCircle2 className="h-4 w-4" />
          <span className="font-bold text-sm">{isArabic ? "تم الاسترداد" : "Refunded"}</span>
        </div>
        
        <p className="font-bold text-xs mt-2 mb-0 text-gray-800">
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
              width: 76mm !important; /* 80mm - 4mm for padding */
              max-width: 76mm !important;
              page-break-after: always !important;
              page-break-inside: avoid !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              border: none !important;
              box-shadow: none !important;
              padding: 2mm !important;
              margin: 0 !important;
              background: white !important;
              height: auto !important;
              min-height: 0 !important;
              max-height: none !important;
              text-align: center !important;
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
