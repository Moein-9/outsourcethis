
import React from "react";
import { format } from "date-fns";
import { Invoice } from "@/store/invoiceStore";
import { CheckCircle2, Receipt, CreditCard, Calendar, Phone, User, UserCircle2, ShieldCheck, PackageCheck } from "lucide-react";
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
        border: isPrintable ? 'none' : '1px solid #eaeaea',
        borderRadius: isPrintable ? '0' : '8px',
        boxShadow: isPrintable ? 'none' : '0 2px 10px rgba(0,0,0,0.08)',
        fontFamily: isRtl ? 'Zain, sans-serif' : 'Yrsa, serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always',
        overflow: 'hidden'
      }}
    >
      {/* Modern Header with logo and store info */}
      <div className="bg-black text-white p-3 text-center">
        <div className="flex justify-center mb-2">
          <MoenLogo className="w-auto h-10" />
        </div>
        <h2 className="font-bold text-lg mb-0">{storeInfo.name}</h2>
        <p className="text-xs font-medium mb-0 opacity-90">{storeInfo.address}</p>
        <p className="text-xs font-medium opacity-90">{t("phone")}: {storeInfo.phone}</p>
      </div>

      {/* Invoice Title Bar */}
      <div className="bg-black text-white py-2 flex items-center justify-center gap-2 font-bold text-base">
        <Receipt className="w-4 h-4" />
        <span>{t("invoice")} {isRtl ? "Invoice" : "الفاتورة"}</span>
        <span className="font-mono">#{invoice.invoiceId}</span>
      </div>
      
      {/* Customer & Invoice Info */}
      <div className="p-3 border-b border-gray-200">
        <div className="bg-gray-100 rounded-lg p-2 mb-2">
          <div className="flex items-center justify-center gap-1 font-bold mb-1 text-gray-700 border-b border-gray-200 pb-1">
            <UserCircle2 className="w-4 h-4" />
            <span>{t("customerInfo")}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-1 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <User className="w-3 h-3" />
              <span>{t("name")}:</span>
            </div>
            <div className="font-semibold text-right">{name}</div>
            
            {phone && (
              <>
                <div className="flex items-center gap-1 text-gray-600">
                  <Phone className="w-3 h-3" />
                  <span>{t("phone")}:</span>
                </div>
                <div className="text-right">{phone}</div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>{t("date")}:</span>
          </div>
          <span>{formatDate(invoice.createdAt)}</span>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-black text-white py-2 px-3 font-bold flex items-center gap-2">
        <PackageCheck className="w-4 h-4" />
        <span>{t("products")}</span>
      </div>
      
      <div className="p-3 space-y-2">
        {isContactLens && contactLensItems.length > 0 ? (
          <div>
            {contactLensItems.map((lens, idx) => (
              <div key={idx} className={`${idx !== 0 ? "border-t border-gray-200 pt-2 mt-2" : ""} bg-gray-50 rounded-lg p-2`}>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t("lenses")}</span>
                  <span className="font-bold text-gray-800">KWD {lens.price.toFixed(3)}</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {lens.brand} {lens.type} {lens.color && `- ${lens.color}`}
                </div>
                <div className="text-xs text-right rtl:text-left text-gray-500">
                  {t("quantity")}: {lens.qty || 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {lens && (
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t("lenses")}</span>
                  <span className="font-bold text-gray-800">KWD {lensP.toFixed(3)}</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">{lens}</div>
              </div>
            )}
            
            {coat && (
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t("coating")}</span>
                  <span className="font-bold text-gray-800">KWD {coatP.toFixed(3)}</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">{coat}</div>
              </div>
            )}
            
            {frameBrand && (
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t("frame")}</span>
                  <span className="font-bold text-gray-800">KWD {frameP.toFixed(3)}</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">{frameBrand} {frameModel}</div>
              </div>
            )}
          </div>
        )}
        
        {/* Summary */}
        <div className="mt-3 pt-2 border-t border-gray-200">
          {disc > 0 && (
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{t("subtotal")}:</span>
              <span>KWD {(tot + disc).toFixed(3)}</span>
            </div>
          )}
          
          {disc > 0 && (
            <div className="flex justify-between text-sm mb-1 text-green-600">
              <span>{t("discount")}:</span>
              <span>-KWD {disc.toFixed(3)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-bold text-base">
            <span>{t("total")}:</span>
            <span>KWD {tot.toFixed(3)}</span>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="bg-black text-white py-2 px-3 font-bold flex items-center gap-2">
        <CreditCard className="w-4 h-4" />
        <span>{t("payment")}</span>
      </div>
      
      <div className="p-3 space-y-2">
        {invoice.payments?.map((payment, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-2 flex flex-col">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{formatDate(payment.date)}</span>
              <span className="font-bold">KWD {payment.amount.toFixed(3)}</span>
            </div>
            <div className="text-xs flex items-center justify-center gap-1 mt-1 text-gray-600">
              <CreditCard className="w-3 h-3" />
              <span>{payment.method}</span>
              {payment.authNumber && <span className="text-gray-500"> - {payment.authNumber}</span>}
            </div>
          </div>
        )) || (
          <div className="bg-gray-50 rounded-lg p-2 flex flex-col">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{formatDate(invoice.createdAt)}</span>
              <span className="font-bold">KWD {dep.toFixed(3)}</span>
            </div>
            <div className="text-xs flex items-center justify-center gap-1 mt-1 text-gray-600">
              <CreditCard className="w-3 h-3" />
              <span>{payMethod}</span>
              {auth && <span className="text-gray-500"> - {auth}</span>}
            </div>
          </div>
        )}
        
        {/* Paid in Full / Remaining */}
        {isPaid ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-2 flex items-center justify-center gap-2 text-green-700">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold">{t("paidInFull")}</span>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
            <div className="flex justify-between items-center text-amber-700 font-bold">
              <span>{t("remaining")}:</span>
              <span>KWD {rem.toFixed(3)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-100 py-3 px-2 text-center">
        <p className="font-medium text-sm mb-1 text-gray-700">
          {isRtl ? 
            "شكراً لاختياركم نظارات المعين. يسعدنا خدمتكم دائماً!" : 
            "Thank you for choosing Moein Optical. We're always delighted to serve you!"}
        </p>
        <div className="flex items-center justify-center text-xs text-gray-500 gap-1">
          <ShieldCheck className="w-3 h-3" />
          <div>{format(new Date(), 'yyyy-MM-dd')}</div>
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
            
            .bg-gray-50, .bg-gray-100 {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            .bg-green-50 {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              background-color: #f0fdf4 !important;
            }
            
            .bg-amber-50 {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              background-color: #fffbeb !important;
            }
          }
        `}
      </style>
    </div>
  );
};
