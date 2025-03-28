
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
  CreditCard as CardIcon,
  ClipboardList,
  FileText,
  CircleDollarSign,
  Undo2,
  ArrowLeftRight,
  RefreshCw
} from 'lucide-react';
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

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
      <div className="text-center mb-3">
        <div className="flex justify-center mb-2">
          <MoenLogo className="w-auto h-14" />
        </div>
        <h2 className="font-bold text-lg mb-0.5">{storeInfo.name}</h2>
        <p className="text-xs text-gray-700 mb-0">{storeInfo.address}</p>
        <div className="flex items-center justify-center text-xs text-gray-700 gap-1">
          <Phone className="w-3 h-3" />
          <span>{storeInfo.phone}</span>
        </div>
      </div>
      
      {/* Elegant divider */}
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-3 text-gray-600">
          <RefreshCw className="w-4 h-4" />
        </span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Refund Receipt Title */}
      <div className="bg-gray-100 py-1.5 px-2 rounded-md text-center mb-3">
        <div className="flex items-center justify-center gap-1.5">
          <Undo2 className="h-5 w-5 text-gray-700" />
          <span className="font-bold text-base text-gray-800">
            {isArabic ? "إيصال استرداد | REFUND RECEIPT" : "REFUND RECEIPT | إيصال استرداد"}
          </span>
        </div>
      </div>

      {/* Customer Information Card */}
      <Card className="mb-3 bg-white border border-gray-300 shadow-sm">
        <CardHeader className="py-2 px-3 bg-gray-50 border-b flex flex-row items-center gap-1.5">
          <User className="h-4 w-4 text-gray-700" />
          <h3 className="font-bold text-sm text-gray-800 m-0">
            {isArabic ? "معلومات العميل | Customer Info" : "Customer Info | معلومات العميل"}
          </h3>
        </CardHeader>
        <CardContent className="p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-700">
              <User className="h-3.5 w-3.5" />
              <span className="font-semibold text-sm">{isArabic ? "الاسم" : "Name"}:</span>
            </div>
            <span className="font-semibold text-sm">{refund.patientName}</span>
          </div>
          
          {refund.patientPhone && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-gray-700">
                <Phone className="h-3.5 w-3.5" />
                <span className="font-semibold text-sm">{isArabic ? "الهاتف" : "Phone"}:</span>
              </div>
              <span className="font-semibold text-sm">{refund.patientPhone}</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Refund Info Card */}
      <Card className="mb-3 bg-white border border-gray-300 shadow-sm">
        <CardHeader className="py-2 px-3 bg-gray-50 border-b flex flex-row items-center gap-1.5">
          <FileText className="h-4 w-4 text-gray-700" />
          <h3 className="font-bold text-sm text-gray-800 m-0">
            {isArabic ? "معلومات الاسترداد | Refund Info" : "Refund Info | معلومات الاسترداد"}
          </h3>
        </CardHeader>
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">#{refund.refundId}</span>
            <div className="flex items-center gap-1.5 text-gray-700">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-sm">{formattedDate}</span>
            </div>
          </div>
          <Separator className="my-1" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-700">
              <Receipt className="h-3.5 w-3.5" />
              <span className="font-semibold text-sm">{isArabic ? "رقم الفاتورة" : "Invoice"}:</span>
            </div>
            <span className="font-semibold text-sm">#{refund.invoiceId}</span>
          </div>
        </CardContent>
      </Card>

      {/* Products Section */}
      <div className="mb-3">
        <div className="bg-gray-800 text-white py-1.5 px-3 rounded-t-md flex items-center justify-center gap-1.5">
          <ClipboardList className="h-4 w-4" />
          <h3 className="font-bold text-sm m-0">
            {isArabic ? "المنتجات | Products" : "Products | المنتجات"}
          </h3>
        </div>

        <div className="border border-gray-300 border-t-0 rounded-b-md p-2 bg-white">
          {/* Product Information if available */}
          {(refund.frameBrand || refund.frameModel || refund.lensType) && (
            <div className="space-y-2">
              {refund.frameBrand && (
                <div className="p-2 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold text-sm text-gray-700">{isArabic ? "الإطار | Frame" : "Frame | الإطار"}</div>
                    <span className="font-bold text-sm bg-gray-100 px-2 py-0.5 rounded-md">
                      {refund.invoiceItems?.find(item => item.name.includes(refund.frameBrand || ''))?.price.toFixed(3) || '0.000'} KWD
                    </span>
                  </div>
                  <div className="text-xs text-center bg-white py-1 px-2 rounded border border-gray-100">
                    {refund.frameBrand} {refund.frameModel} 
                    {refund.frameColor && ` (${refund.frameColor})`}
                  </div>
                </div>
              )}
              
              {refund.lensType && (
                <div className="p-2 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold text-sm text-gray-700">{isArabic ? "العدسات | Lenses" : "Lenses | العدسات"}</div>
                    <span className="font-bold text-sm bg-gray-100 px-2 py-0.5 rounded-md">
                      {refund.invoiceItems?.find(item => item.name.includes('lens') || item.name.includes('Lens'))?.price.toFixed(3) || '0.000'} KWD
                    </span>
                  </div>
                  <div className="text-xs text-center bg-white py-1 px-2 rounded border border-gray-100">
                    {refund.lensType}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Item Details if available */}
          {refund.invoiceItems && refund.invoiceItems.length > 0 && !refund.frameBrand && !refund.lensType && (
            <div className="space-y-2">
              {refund.invoiceItems.map((item, index) => (
                <div key={index} className="p-2 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold text-sm text-gray-700">{item.name}</div>
                    <span className="font-bold text-sm bg-gray-100 px-2 py-0.5 rounded-md">
                      {item.price.toFixed(3)} KWD
                    </span>
                  </div>
                  {item.quantity && item.quantity > 1 && (
                    <div className="text-xs text-center bg-white py-1 px-2 rounded border border-gray-100">
                      {isArabic ? "الكمية" : "Quantity"}: {item.quantity}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Refund Details */}
      <div className="mb-3">
        <div className="bg-gray-800 text-white py-1.5 px-3 rounded-t-md flex items-center justify-center gap-1.5">
          <ArrowLeftRight className="h-4 w-4" />
          <h3 className="font-bold text-sm m-0">
            {isArabic ? "تفاصيل الاسترداد | Refund Details" : "Refund Details | تفاصيل الاسترداد"}
          </h3>
        </div>

        <div className="border border-gray-300 border-t-0 rounded-b-md p-2 bg-white space-y-2">
          <div className="p-2 border border-gray-200 rounded-md bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-gray-700">
                <CardIcon className="h-3.5 w-3.5" />
                <span className="font-semibold text-sm">{isArabic ? "طريقة الاسترداد" : "Refund Method"}</span>
              </div>
              <span className="font-semibold text-sm bg-gray-100 px-2 py-0.5 rounded-md">
                {refund.refundMethod}
              </span>
            </div>
          </div>
          
          <div className="p-2 border border-gray-200 rounded-md bg-gray-50">
            <div className="mb-1">
              <div className="font-semibold text-sm text-gray-700 flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" />
                <span>{isArabic ? "سبب الاسترداد" : "Reason for Refund"}</span>
              </div>
            </div>
            <div className="text-xs bg-white py-1.5 px-2 rounded border border-gray-100">
              {refund.refundReason}
            </div>
          </div>
          
          {refund.staffNotes && (
            <div className="p-2 border border-gray-200 rounded-md bg-gray-50">
              <div className="mb-1">
                <div className="font-semibold text-sm text-gray-700 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  <span>{isArabic ? "ملاحظات" : "Notes"}</span>
                </div>
              </div>
              <div className="text-xs bg-white py-1.5 px-2 rounded border border-gray-100 italic">
                {refund.staffNotes}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Amount Information */}
      <Card className="mb-3 bg-white border border-gray-300 shadow-sm">
        <CardContent className="p-3">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-semibold text-gray-700">{isArabic ? "المبلغ الأصلي" : "Original Amount"}:</span>
            <span className="font-semibold">{refund.originalTotal.toFixed(3)} KWD</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
            <div className="flex items-center gap-1.5">
              <CircleDollarSign className="h-4 w-4 text-gray-700" />
              <span className="font-bold text-sm">{isArabic ? "مبلغ الاسترداد" : "Refund Amount"}</span>
            </div>
            <span className="font-bold text-sm bg-gray-100 px-2 py-0.5 rounded-md">
              {refund.refundAmount.toFixed(3)} KWD
            </span>
          </div>
        </CardContent>
      </Card>
      
      {/* Elegant divider */}
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-3 text-gray-600">
          <CheckCircle2 className="w-4 h-4" />
        </span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      
      {/* Footer */}
      <div className="text-center mt-2">
        <div className="inline-flex items-center justify-center gap-1.5 bg-gray-800 text-white py-1.5 px-4 rounded-md mb-2">
          <CheckCircle2 className="h-4 w-4" />
          <span className="font-bold text-sm">{isArabic ? "تم الاسترداد" : "Refunded"}</span>
        </div>
        
        <p className="font-semibold text-sm mt-2 mb-0.5 text-gray-800">
          {isArabic
            ? "شكراً لاختياركم نظارات المعين. يسعدنا خدمتكم دائماً!"
            : "Thank you for choosing Moein Optical. We're always delighted to serve you!"}
        </p>
        <div className="text-xs text-gray-600">
          {format(new Date(), 'yyyy-MM-dd')}
        </div>
      </div>
    </div>
  );
};
