
import React from 'react';
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
  UserCircle2
} from 'lucide-react';
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";

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
      className={`${dirClass} print-receipt`}
      id="refund-receipt"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Store Logo and Information Header */}
      <div className="border-b-2 border-black pb-1 mb-2">
        <div className="flex justify-center mb-1">
          <MoenLogo className="w-auto h-10" />
        </div>
        <h2 className="font-bold text-lg mb-0">{storeInfo.name}</h2>
        <p className="text-xs font-medium mb-0">{storeInfo.address}</p>
        <p className="text-xs font-medium">{isArabic ? "هاتف" : "Phone"}: {storeInfo.phone}</p>
      </div>
      
      {/* Refund Receipt Title */}
      <div className="mb-2">
        <div className="inline-flex items-center justify-center gap-1 border-2 border-black px-2 py-0.5 rounded">
          <RefreshCcw className="w-4 h-4" />
          <span className="font-bold text-base">
            {isArabic ? "إيصال استرداد | REFUND RECEIPT" : "REFUND RECEIPT | إيصال استرداد"}
          </span>
        </div>
      </div>

      {/* Customer Information */}
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
              <UserCircle2 className="w-3.5 h-3.5" />
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
      
      {/* Refund Details (ID and Date) */}
      <div className="mb-2 border-2 border-black rounded p-1.5">
        <div className="mb-1 border-b border-gray-400 pb-1">
          <div className="flex items-center justify-center gap-1">
            <Receipt className="w-4 h-4" />
            <span className="font-bold text-base">
              {isArabic ? "معلومات الاسترداد | Refund Info" : "Refund Info | معلومات الاسترداد"}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center px-2">
          <span className="font-semibold text-sm">#{refund.refundId}</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-semibold text-sm">{formattedDate}</span>
          </div>
        </div>
        <div className="flex justify-between items-center px-2 mt-1">
          <div className="flex items-center gap-1">
            <Receipt className="w-3.5 h-3.5" />
            <span className="font-semibold text-sm">{isArabic ? "رقم الفاتورة" : "Invoice"}:</span>
          </div>
          <span className="font-semibold text-sm">#{refund.invoiceId}</span>
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-2">
        <div className="py-1 bg-black text-white mb-2 font-bold text-base rounded">
          {isArabic ? "المنتجات | Products" : "Products | المنتجات"}
        </div>

        <div className="space-y-2 px-1">
          {/* Product Information if available */}
          {(refund.frameBrand || refund.frameModel || refund.lensType) && (
            <div className="space-y-2">
              {refund.frameBrand && (
                <div className="p-1.5 border border-gray-300 rounded">
                  <div className="flex justify-between px-2 mb-1">
                    <div className="font-bold text-sm">{isArabic ? "الإطار | Frame" : "Frame | الإطار"}</div>
                    <span className="font-bold text-sm">
                      {refund.invoiceItems?.find(item => item.name.includes(refund.frameBrand || ''))?.price.toFixed(3) || '0.000'} KWD
                    </span>
                  </div>
                  <div className="text-xs font-medium text-center">
                    {refund.frameBrand} {refund.frameModel} 
                    {refund.frameColor && ` (${refund.frameColor})`}
                  </div>
                </div>
              )}
              
              {refund.lensType && (
                <div className="p-1.5 border border-gray-300 rounded">
                  <div className="flex justify-between px-2 mb-1">
                    <div className="font-bold text-sm">{isArabic ? "العدسات | Lenses" : "Lenses | العدسات"}</div>
                    <span className="font-bold text-sm">
                      {refund.invoiceItems?.find(item => item.name.includes('lens') || item.name.includes('Lens'))?.price.toFixed(3) || '0.000'} KWD
                    </span>
                  </div>
                  <div className="text-xs font-medium text-center">{refund.lensType}</div>
                </div>
              )}
            </div>
          )}

          {/* Item Details if available */}
          {refund.invoiceItems && refund.invoiceItems.length > 0 && !refund.frameBrand && !refund.lensType && (
            <div className="space-y-2">
              {refund.invoiceItems.map((item, index) => (
                <div key={index} className="p-1.5 border border-gray-300 rounded">
                  <div className="flex justify-between px-2 mb-1">
                    <div className="font-bold text-sm">{item.name}</div>
                    <span className="font-bold text-sm">{item.price.toFixed(3)} KWD</span>
                  </div>
                  {item.quantity && item.quantity > 1 && (
                    <div className="text-xs font-medium text-center">
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
      <div className="mb-2">
        <div className="py-1 bg-black text-white mb-2 font-bold text-base rounded">
          {isArabic ? "تفاصيل الاسترداد | Refund Details" : "Refund Details | تفاصيل الاسترداد"}
        </div>
        
        <div className="space-y-2 px-1">
          <div className="p-1.5 border border-gray-300 rounded">
            <div className="flex justify-between px-2 mb-1">
              <div className="font-bold text-sm">{isArabic ? "طريقة الاسترداد" : "Refund Method"}</div>
              <div className="flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" />
                <span className="font-bold text-sm">{refund.refundMethod}</span>
              </div>
            </div>
          </div>
          
          <div className="p-1.5 border border-gray-300 rounded">
            <div className="px-2 mb-1">
              <div className="font-bold text-sm">{isArabic ? "سبب الاسترداد" : "Reason for Refund"}</div>
            </div>
            <div className="text-xs font-medium px-2 py-1 bg-gray-50">{refund.refundReason}</div>
          </div>
          
          {refund.staffNotes && (
            <div className="p-1.5 border border-gray-300 rounded">
              <div className="px-2 mb-1">
                <div className="font-bold text-sm">{isArabic ? "ملاحظات" : "Notes"}</div>
              </div>
              <div className="text-xs font-medium px-2 py-1 bg-gray-50 italic">{refund.staffNotes}</div>
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
          <div className="flex justify-between pt-0.5 mt-0.5 border-t-2 border-black">
            <span className="font-bold text-base">{isArabic ? "مبلغ الاسترداد" : "Refund Amount"}:</span>
            <span className="font-bold text-base">{refund.refundAmount.toFixed(3)} KWD</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-3 pt-1 border-t-2 border-black text-center">
        <div className="flex items-center justify-center gap-1 mt-2 font-bold border-2 border-black py-1 rounded">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm">{isArabic ? "تم الاسترداد" : "Refunded"}</span>
        </div>
        
        <p className="font-bold text-sm mt-2 mb-0">
          {isArabic
            ? "شكراً لاختياركم نظارات المعين. يسعدنا خدمتكم دائماً!"
            : "Thank you for choosing Moein Optical. We're always delighted to serve you!"}
        </p>
        <div className="text-xs font-medium">
          {format(new Date(), 'yyyy-MM-dd')}
        </div>
      </div>
    </div>
  );
};
