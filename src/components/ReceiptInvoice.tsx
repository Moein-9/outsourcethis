
import React from "react";
import { format } from "date-fns";
import { Invoice } from "@/store/invoiceStore";
import { CheckCircle2, Receipt, CreditCard, Calendar, Phone, User, UserCircle2 } from "lucide-react";
import { ContactLensItem } from "./ContactLensSelector";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";

interface ReceiptInvoiceProps {
  invoice: Invoice;
  isPrintable?: boolean;
  
  patientName?: string;
  patientPhone?: string;
  invoiceType?: "glasses" | "contacts";
  lensType?: string;
  lensPrice?: number;
  coating?: string;
  coatingPrice?: number;
  frame?: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  };
  framePrice?: number;
  discount?: number;
  total?: number;
  deposit?: number;
  remaining?: number;
  paymentMethod?: string;
  authNumber?: string;
  contactLenses?: ContactLensItem[];
}

export const ReceiptInvoice: React.FC<ReceiptInvoiceProps> = ({ 
  invoice,
  isPrintable = false,
  patientName,
  patientPhone,
  invoiceType,
  lensType,
  lensPrice,
  coating,
  coatingPrice,
  frame,
  framePrice,
  discount,
  total,
  deposit,
  remaining,
  paymentMethod,
  authNumber,
  contactLenses
}) => {
  const { language, t } = useLanguageStore();
  const isRtl = language === 'ar';
  const dirClass = isRtl ? 'rtl' : 'ltr';
  
  const name = patientName || invoice.patientName;
  const phone = patientPhone || invoice.patientPhone;
  const lens = lensType || invoice.lensType;
  const lensP = lensPrice !== undefined ? lensPrice : invoice.lensPrice;
  const coat = coating || invoice.coating;
  const coatP = coatingPrice !== undefined ? coatingPrice : invoice.coatingPrice;
  const frameBrand = frame?.brand || invoice.frameBrand;
  const frameModel = frame?.model || invoice.frameModel;
  const frameP = framePrice !== undefined ? framePrice : invoice.framePrice;
  const disc = discount !== undefined ? discount : invoice.discount;
  const tot = total !== undefined ? total : invoice.total;
  const dep = deposit !== undefined ? deposit : invoice.deposit;
  const rem = remaining !== undefined ? remaining : invoice.remaining;
  const payMethod = paymentMethod || invoice.paymentMethod;
  const auth = authNumber || (invoice as any).authNumber;
  const isPaid = rem <= 0;
  
  const contactLensItems = contactLenses || invoice.contactLensItems || [];
  
  const isContactLens = invoiceType === "contacts" || invoice.invoiceType === "contacts" || contactLensItems.length > 0;
  
  const formatDate = (date: Date | string | number) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };
  
  return (
    <div 
      className={`${dirClass} print-receipt`} 
      id="receipt-invoice"
      dir={isRtl ? "rtl" : "ltr"}
      style={{ 
        width: '80mm', 
        maxWidth: '80mm',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '0',
        fontSize: '12px',
        border: isPrintable ? 'none' : '1px solid #ddd',
        borderRadius: isPrintable ? '0' : '4px',
        boxShadow: isPrintable ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
        fontFamily: isRtl ? 'Zain, sans-serif' : 'Yrsa, serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always',
        textAlign: 'center' // Center all content in the receipt
      }}
    >
      {/* Header with logo and store info */}
      <div className="border-b border-black pb-1 mb-2">
        <div className="flex justify-center mb-1 pt-2">
          <MoenLogo className="w-auto h-10" />
        </div>
        <h2 className="font-bold text-lg mb-0">{storeInfo.name}</h2>
        <p className="text-xs font-medium mb-0">{storeInfo.address}</p>
        <p className="text-xs font-medium">{t("phone")}: {storeInfo.phone}</p>
      </div>

      {/* Invoice Header */}
      <div className="border border-black rounded mx-2 mb-3">
        <div className="bg-black text-white py-1 mb-2 font-bold text-base">
          <Receipt className="inline-block w-4 h-4 mr-1" />
          <span>{t("invoice")} | {isRtl ? "Invoice" : "الفاتورة"}</span>
        </div>
        
        {/* Customer Info Box */}
        <div className="border-t border-b border-black mx-3 py-1 mb-2">
          <div className="flex items-center justify-center gap-1 font-bold mb-1">
            <UserCircle2 className="w-4 h-4" />
            <span>{t("customerInfo")} | {isRtl ? "Customer Info" : "معلومات العميل"}</span>
          </div>
          
          <div className="flex justify-between px-3 text-sm">
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>{t("name")}:</span>
            </div>
            <span className="font-semibold">{name}</span>
          </div>
          
          {phone && (
            <div className="flex justify-between px-3 text-sm">
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span>{t("phone")}:</span>
              </div>
              <span className="font-semibold">{phone}</span>
            </div>
          )}
        </div>
        
        {/* Invoice Number Box */}
        <div className="border-b border-black mx-3 py-1 mb-2">
          <div className="flex items-center justify-center gap-1 font-bold mb-1">
            <Receipt className="w-4 h-4" />
            <span>{t("invoiceNumber")} | {isRtl ? "Invoice Number" : "رقم الفاتورة"}</span>
          </div>
          
          <div className="flex justify-between items-center px-3 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(invoice.createdAt)}</span>
            </div>
            <span className="font-semibold">#{invoice.invoiceId}</span>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-3">
        <div className="bg-black text-white py-1 mx-2 mb-2 font-bold text-base">
          {t("products")} | {isRtl ? "Products" : "المنتجات"}
        </div>
        
        <div className="space-y-2 px-2">
          {isContactLens && contactLensItems.length > 0 ? (
            <div className="border border-black rounded p-2">
              {contactLensItems.map((lens, idx) => (
                <div key={idx} className={idx !== 0 ? "border-t border-gray-300 pt-2 mt-2" : ""}>
                  <div className="flex justify-between text-sm">
                    <span>{t("lenses")} | {isRtl ? "Lenses" : "العدسات"}</span>
                    <span className="font-semibold">KWD {lens.price.toFixed(3)}</span>
                  </div>
                  <div className="text-xs text-left rtl:text-right mt-1">
                    {lens.brand} {lens.type} {lens.color && `- ${lens.color}`}
                  </div>
                  <div className="text-xs text-right rtl:text-left">
                    {t("quantity")}: {lens.qty || 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-black rounded p-2">
              {lens && (
                <div className="mb-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("lenses")} | {isRtl ? "Lenses" : "العدسات"}</span>
                    <span className="font-semibold">KWD {lensP.toFixed(3)}</span>
                  </div>
                  <div className="text-xs text-left rtl:text-right">{lens}</div>
                </div>
              )}
              
              {coat && (
                <div className="border-t border-gray-300 pt-2 mb-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("coating")} | {isRtl ? "Coating" : "الطلاء"}</span>
                    <span className="font-semibold">KWD {coatP.toFixed(3)}</span>
                  </div>
                  <div className="text-xs text-left rtl:text-right">{coat}</div>
                </div>
              )}
              
              {frameBrand && (
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("frame")} | {isRtl ? "Frame" : "الإطار"}</span>
                    <span className="font-semibold">KWD {frameP.toFixed(3)}</span>
                  </div>
                  <div className="text-xs text-left rtl:text-right">{frameBrand} {frameModel}</div>
                </div>
              )}
            </div>
          )}
          
          {/* Subtotal */}
          <div className="flex justify-between px-2 py-1 border-t border-b border-black">
            <span className="font-bold">{t("subtotal")}:</span>
            <span className="font-bold">KWD {(tot + disc).toFixed(3)}</span>
          </div>
          
          {/* Total */}
          <div className="flex justify-between px-2 py-1 font-bold">
            <span>{t("total")}:</span>
            <span>KWD {tot.toFixed(3)}</span>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="mb-3">
        <div className="bg-black text-white py-1 mx-2 mb-2 font-bold text-base">
          {t("payment")} | {isRtl ? "Payment" : "الدفع"}
        </div>
        
        <div className="px-2 space-y-2">
          {invoice.payments?.map((payment, index) => (
            <div key={index} className="border border-gray-300 rounded p-2">
              <div className="flex justify-between text-sm">
                <span>{formatDate(payment.date)}</span>
                <span className="font-semibold">KWD {payment.amount.toFixed(3)}</span>
              </div>
              <div className="text-xs flex items-center justify-center gap-1 mt-1">
                <CreditCard className="w-3 h-3" />
                <span>{payment.method}</span>
                {payment.authNumber && <span> - {payment.authNumber}</span>}
              </div>
            </div>
          )) || (
            <div className="border border-gray-300 rounded p-2">
              <div className="flex justify-between text-sm">
                <span>{formatDate(invoice.createdAt)}</span>
                <span className="font-semibold">KWD {dep.toFixed(3)}</span>
              </div>
              <div className="text-xs flex items-center justify-center gap-1 mt-1">
                <CreditCard className="w-3 h-3" />
                <span>{payMethod}</span>
                {auth && <span> - {auth}</span>}
              </div>
            </div>
          )}
          
          {/* Paid in Full / Remaining */}
          {isPaid ? (
            <div className="border border-black rounded p-2 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-bold">{t("paidInFull")}</span>
            </div>
          ) : (
            <div className="flex justify-between px-2 py-1 font-bold text-base">
              <span>{t("remaining")}:</span>
              <span>KWD {rem.toFixed(3)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-black pt-2 pb-4 px-2 text-center">
        <p className="font-semibold text-sm mb-1">
          {isRtl ? 
            "شكراً لاختياركم نظارات المعين. يسعدنا خدمتكم دائماً!" : 
            "Thank you for choosing Moein Optical. We're always delighted to serve you!"}
        </p>
        <div className="text-xs text-gray-600">
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
            
            #receipt-invoice {
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
              body, html, #receipt-invoice {
                height: fit-content !important;
                min-height: fit-content !important;
                max-height: fit-content !important;
              }
            }
            
            .bg-black {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              background-color: black !important;
              color: white !important;
            }
          }
        `}
      </style>
    </div>
  );
};
