
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
  RefreshCcw,
  UserCircle2,
  Clock,
  CircleDollarSign
} from 'lucide-react';
import { MoenLogo, storeInfo } from "@/assets/logo";
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

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
      className="print-receipt"
      id="refund-receipt"
      dir={isArabic ? "rtl" : "ltr"}
      style={{ 
        width: '80mm', 
        maxWidth: '80mm',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '0',
        fontSize: '12px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        fontFamily: isArabic ? 'Zain, sans-serif' : 'Yrsa, serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always',
        textAlign: 'center',
        overflow: 'hidden',
        direction
      }}
    >
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white p-4 mb-2">
        <div className="flex justify-center mb-2">
          <MoenLogo className="w-auto h-12 filter brightness-0 invert" />
        </div>
        <h2 className="font-bold text-lg mb-1">{storeInfo.name}</h2>
        <p className="text-xs font-medium mb-0 opacity-90">{storeInfo.address}</p>
        <p className="text-xs font-medium opacity-90">{isArabic ? "هاتف" : "Phone"}: {storeInfo.phone}</p>
      </div>
      
      {/* Refund Receipt Title */}
      <div className="mx-4 mb-3">
        <div className="bg-white rounded-full border-2 border-teal-500 py-2 px-4 flex items-center justify-center gap-2 shadow-sm">
          <RefreshCcw className="w-5 h-5 text-teal-600" />
          <span className="font-bold text-base text-teal-800">
            {isArabic ? "إيصال استرداد | REFUND RECEIPT" : "REFUND RECEIPT | إيصال استرداد"}
          </span>
        </div>
      </div>

      {/* Customer Information Card */}
      <div className="mx-4 mb-3">
        <Card className="shadow-sm border-blue-100">
          <div className="bg-blue-50 px-4 py-2 border-b border-blue-100">
            <div className="flex items-center justify-center gap-1">
              <User className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-blue-800">
                {isArabic ? "معلومات العميل | Customer Info" : "Customer Info | معلومات العميل"}
              </span>
            </div>
          </div>
          
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <UserCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-medium text-gray-600">{isArabic ? "الاسم" : "Name"}:</span>
              </div>
              <span className="font-semibold">{refund.patientName}</span>
            </div>
            
            {refund.patientPhone && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-medium text-gray-600">{isArabic ? "الهاتف" : "Phone"}:</span>
                </div>
                <span className="font-semibold">{refund.patientPhone}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Refund Details Card */}
      <div className="mx-4 mb-3">
        <Card className="shadow-sm border-teal-100">
          <div className="bg-teal-50 px-4 py-2 border-b border-teal-100">
            <div className="flex items-center justify-center gap-1">
              <Receipt className="w-4 h-4 text-teal-600" />
              <span className="font-bold text-teal-800">
                {isArabic ? "معلومات الاسترداد | Refund Info" : "Refund Info | معلومات الاسترداد"}
              </span>
            </div>
          </div>
          
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="px-2.5 py-1 text-xs bg-gray-50 text-gray-700 border-gray-200 font-semibold">
                #{refund.refundId}
              </Badge>
              <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full text-xs">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="font-medium text-gray-700">{formattedDate}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-1 pt-1 border-t border-dashed border-gray-200">
              <div className="flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5 text-gray-500" />
                <span className="font-medium text-gray-600">{isArabic ? "رقم الفاتورة" : "Invoice"}:</span>
              </div>
              <span className="font-semibold">#{refund.invoiceId}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Section */}
      <div className="mx-4 mb-3">
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-1.5 px-4 mb-2 font-bold text-sm rounded-md shadow-sm">
          {isArabic ? "المنتجات | Products" : "Products | المنتجات"}
        </div>

        <div className="space-y-2">
          {/* Product Information if available */}
          {(refund.frameBrand || refund.frameModel || refund.lensType) && (
            <div className="space-y-2">
              {refund.frameBrand && (
                <Card className="shadow-sm border-gray-100">
                  <CardContent className="p-3">
                    <div className="flex justify-between mb-1 items-center">
                      <div className="font-bold text-sm bg-gray-50 px-2 py-0.5 rounded-full text-gray-700">
                        {isArabic ? "الإطار | Frame" : "Frame | الإطار"}
                      </div>
                      <Badge className="bg-blue-500">
                        {refund.invoiceItems?.find(item => item.name.includes(refund.frameBrand || ''))?.price.toFixed(3) || '0.000'} KWD
                      </Badge>
                    </div>
                    <div className="text-xs font-medium text-center bg-gray-50 p-1 rounded-md mt-1">
                      {refund.frameBrand} {refund.frameModel} 
                      {refund.frameColor && ` (${refund.frameColor})`}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {refund.lensType && (
                <Card className="shadow-sm border-gray-100">
                  <CardContent className="p-3">
                    <div className="flex justify-between mb-1 items-center">
                      <div className="font-bold text-sm bg-gray-50 px-2 py-0.5 rounded-full text-gray-700">
                        {isArabic ? "العدسات | Lenses" : "Lenses | العدسات"}
                      </div>
                      <Badge className="bg-teal-500">
                        {refund.invoiceItems?.find(item => item.name.includes('lens') || item.name.includes('Lens'))?.price.toFixed(3) || '0.000'} KWD
                      </Badge>
                    </div>
                    <div className="text-xs font-medium text-center bg-gray-50 p-1 rounded-md mt-1">
                      {refund.lensType}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Item Details if available */}
          {refund.invoiceItems && refund.invoiceItems.length > 0 && !refund.frameBrand && !refund.lensType && (
            <div className="space-y-2">
              {refund.invoiceItems.map((item, index) => (
                <Card key={index} className="shadow-sm border-gray-100">
                  <CardContent className="p-3">
                    <div className="flex justify-between mb-1 items-center">
                      <div className="font-bold text-sm">{item.name}</div>
                      <Badge className="bg-blue-500">
                        {item.price.toFixed(3)} KWD
                      </Badge>
                    </div>
                    {item.quantity && item.quantity > 1 && (
                      <div className="text-xs font-medium text-center bg-gray-50 p-1 rounded-md mt-1">
                        {isArabic ? "الكمية" : "Quantity"}: {item.quantity}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Refund Details */}
      <div className="mx-4 mb-3">
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-1.5 px-4 mb-2 font-bold text-sm rounded-md shadow-sm">
          {isArabic ? "تفاصيل الاسترداد | Refund Details" : "Refund Details | تفاصيل الاسترداد"}
        </div>
        
        <div className="space-y-2">
          <Card className="shadow-sm border-gray-100">
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div className="font-medium text-gray-700">{isArabic ? "طريقة الاسترداد" : "Refund Method"}</div>
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-semibold text-sm">{refund.refundMethod}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-gray-100">
            <CardContent className="p-3">
              <div className="mb-1">
                <div className="font-medium text-gray-700">{isArabic ? "سبب الاسترداد" : "Reason for Refund"}</div>
              </div>
              <div className="text-xs font-medium px-3 py-2 bg-gray-50 rounded-md">
                {refund.refundReason}
              </div>
            </CardContent>
          </Card>
          
          {refund.staffNotes && (
            <Card className="shadow-sm border-gray-100">
              <CardContent className="p-3">
                <div className="mb-1">
                  <div className="font-medium text-gray-700">{isArabic ? "ملاحظات" : "Notes"}</div>
                </div>
                <div className="text-xs font-medium px-3 py-2 bg-gray-50 rounded-md italic">
                  {refund.staffNotes}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Amount Information */}
      <div className="mx-4 mb-4">
        <Card className="shadow-sm border-2 border-teal-200">
          <CardContent className="p-3">
            <div className="flex justify-between text-sm items-center">
              <span className="font-medium text-gray-600">{isArabic ? "المبلغ الأصلي" : "Original Amount"}:</span>
              <span className="font-semibold text-gray-800">{refund.originalTotal.toFixed(3)} KWD</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between pt-1 items-center">
              <span className="font-bold text-base flex items-center gap-1 text-teal-800">
                <CircleDollarSign className="h-4 w-4" />
                {isArabic ? "مبلغ الاسترداد" : "Refund Amount"}:
              </span>
              <span className="font-bold text-base text-teal-800 bg-teal-50 px-3 py-1 rounded-md">
                {refund.refundAmount.toFixed(3)} KWD
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <div className="mt-auto">
        <div className="flex items-center justify-center gap-1 mx-4 mb-3">
          <div className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 w-full shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">{isArabic ? "تم الاسترداد" : "Refunded"}</span>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 border-t border-gray-200">
          <p className="font-bold text-xs mb-1 text-gray-700">
            {isArabic
              ? "شكراً لاختياركم نظارات المعين. يسعدنا خدمتكم دائماً!"
              : "Thank you for choosing Moein Optical. We're always delighted to serve you!"}
          </p>
          <div className="text-xs font-medium text-gray-500">
            {format(new Date(), 'yyyy-MM-dd')}
          </div>
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
            width: 80mm !important;
            max-width: 80mm !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            text-align: center !important;
            border-radius: 0 !important;
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
          
          /* Ensure gradients and colors print correctly */
          .bg-gradient-to-r {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Ensure shadows appear in print */
          .shadow-sm {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
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
