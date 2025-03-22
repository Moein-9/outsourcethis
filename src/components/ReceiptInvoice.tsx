
import React from "react";
import { format } from "date-fns";
import { Invoice } from "@/store/invoiceStore";
import { CheckCircle2, Receipt, CreditCard, Calendar, Phone, User } from "lucide-react";
import { ContactLensItem } from "./ContactLensSelector";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";

interface ReceiptInvoiceProps {
  invoice: Invoice;
  isPrintable?: boolean;
  
  // Optional direct props
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
  
  // Use either passed props or invoice data
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
  
  const isContactLens = invoiceType === "contacts" || !frameBrand;
  
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
        padding: '2mm',
        fontSize: '12px',
        border: isPrintable ? 'none' : '1px solid #ddd',
        borderRadius: isPrintable ? '0' : '4px',
        boxShadow: isPrintable ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
        fontFamily: isRtl ? 'Zain, sans-serif' : 'Yrsa, serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always'
      }}
    >
      {/* Header Section - More compact with less vertical spacing */}
      <div className="text-center border-b-2 border-black pb-1 mb-2">
        <div className="flex justify-center mb-1">
          <MoenLogo className="w-auto h-10" />
        </div>
        <h2 className="font-bold text-lg mb-0">{storeInfo.name}</h2>
        <p className="text-xs font-medium mb-0">{storeInfo.address}</p>
        <p className="text-xs font-medium">{t("phone")}: {storeInfo.phone}</p>
      </div>

      {/* Receipt Title - Compact and centered */}
      <div className="mb-2 text-center">
        <div className="inline-flex items-center justify-center gap-1 border-2 border-black px-2 py-0.5 rounded">
          <Receipt className="w-4 h-4" />
          <span className="font-bold text-base">{t("invoice")}</span>
        </div>
      </div>

      {/* Customer Information Card - More compact design */}
      <div className="mb-2 border-2 border-black rounded p-1.5">
        <div className="flex items-center justify-between mb-1 border-b border-gray-400 pb-1">
          <span className="font-bold text-base">{t("customerInfo")}</span>
          <div className="flex items-center gap-0.5">
            <User className="w-4 h-4" />
            <span className="font-bold text-sm">{name}</span>
          </div>
        </div>
        
        {phone && (
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">{t("phone")}:</span>
            <div className="flex items-center gap-0.5">
              <Phone className="w-3.5 h-3.5" />
              <span className="font-semibold text-sm">{phone}</span>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Details - Compact horizontal layout */}
      <div className="mb-2 border-2 border-black rounded p-1.5">
        <div className="flex items-center justify-between mb-1 border-b border-gray-400 pb-1">
          <span className="font-bold text-base">{t("invoiceDetails")}</span>
          <div className="flex items-center gap-0.5">
            <Receipt className="w-4 h-4" />
            <span className="font-bold text-sm">#{invoice.invoiceId}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm">{t("date")}:</span>
          <div className="flex items-center gap-0.5">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-semibold text-sm">{format(new Date(invoice.createdAt), 'dd/MM/yyyy')}</span>
          </div>
        </div>
      </div>

      {/* Products Section - More compact with less padding */}
      <div className="mb-2">
        <div className="text-center py-0.5 bg-black text-white mb-1 font-bold text-base rounded">
          {t("products")}
        </div>
        
        <div>
          {isContactLens && contactLenses && contactLenses.length > 0 ? (
            // Contact lens specific rendering
            contactLenses.map((lens, idx) => (
              <div key={idx} className="flex justify-between mb-1 border-b border-gray-300 pb-1">
                <div>
                  <div className="font-bold text-sm">{lens.brand} {lens.type}</div>
                  <div className="text-xs font-medium">{lens.power}</div>
                </div>
                <span className="font-bold text-sm">{lens.price.toFixed(3)} KWD</span>
              </div>
            ))
          ) : (
            // Normal glasses rendering
            <>
              {lens && (
                <div className="flex justify-between mb-1 border-b border-gray-300 pb-1">
                  <div>
                    <div className="font-bold text-sm">{t("lenses")}</div>
                    <div className="text-xs font-medium">{lens}</div>
                  </div>
                  <span className="font-bold text-sm">{lensP.toFixed(3)} KWD</span>
                </div>
              )}
              
              {coat && (
                <div className="flex justify-between mb-1 border-b border-gray-300 pb-1">
                  <div>
                    <div className="font-bold text-sm">{t("coating")}</div>
                    <div className="text-xs font-medium">{coat}</div>
                  </div>
                  <span className="font-bold text-sm">{coatP.toFixed(3)} KWD</span>
                </div>
              )}
              
              {frameBrand && (
                <div className="flex justify-between mb-1 border-b border-gray-300 pb-1">
                  <div>
                    <div className="font-bold text-sm">{t("frame")}</div>
                    <div className="text-xs font-medium">{frameBrand} {frameModel}</div>
                  </div>
                  <span className="font-bold text-sm">{frameP.toFixed(3)} KWD</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Totals Section - More compact with less padding */}
      <div className="mb-2 border-2 border-black rounded p-1.5">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-bold">{t("subtotal")}:</span>
            <span className="font-semibold">{(tot + disc).toFixed(3)} KWD</span>
          </div>
          {disc > 0 && (
            <div className="flex justify-between text-sm">
              <span className="font-bold">{t("discount")}:</span>
              <span className="font-semibold">-{disc.toFixed(3)} KWD</span>
            </div>
          )}
          <div className="flex justify-between pt-0.5 mt-0.5 border-t-2 border-black">
            <span className="font-bold text-base">{t("total")}:</span>
            <span className="font-bold text-base">{tot.toFixed(3)} KWD</span>
          </div>
        </div>
      </div>

      {/* Payment Section - More compact display */}
      <div className="mb-2">
        <div className="text-center py-0.5 bg-black text-white mb-1 font-bold text-base rounded">
          {t("payments")}
        </div>
        
        <div>
          {invoice.payments?.map((payment, index) => (
            <div key={index} className="flex justify-between mb-1 pb-1 border-b border-gray-300">
              <div>
                <div className="font-bold text-sm">
                  {format(new Date(payment.date), 'dd/MM/yyyy')}
                </div>
                <div className="text-xs font-medium flex items-center gap-0.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  {payment.method}
                  {payment.authNumber && <span> - {payment.authNumber}</span>}
                </div>
              </div>
              <span className="font-bold text-sm">{payment.amount.toFixed(3)} KWD</span>
            </div>
          )) || (
            <div className="flex justify-between mb-1 pb-1 border-b border-gray-300">
              <div>
                <div className="font-bold text-sm">
                  {format(new Date(invoice.createdAt), 'dd/MM/yyyy')}
                </div>
                <div className="text-xs font-medium flex items-center gap-0.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  {payMethod}
                  {auth && <span> - {auth}</span>}
                </div>
              </div>
              <span className="font-bold text-sm">{dep.toFixed(3)} KWD</span>
            </div>
          )}
          
          {rem > 0 ? (
            <div className="flex justify-between font-bold mt-1 pt-1 border-t-2 border-black">
              <span className="text-base">{t("remaining")}:</span>
              <span className="text-base">{rem.toFixed(3)} KWD</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1 mt-1 font-bold border-2 border-black py-1 rounded">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">{t("paidInFull")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section - Compact footer */}
      <div className="text-center mt-2 pt-1 border-t-2 border-black">
        {isRtl ? (
          <p className="font-bold text-sm mb-0">شكراً لاختياركم نظارات المعين. يسعدنا خدمتكم دائماً!</p>
        ) : (
          <p className="font-bold text-sm mb-0">Thank you for choosing Moein Optical. We're always delighted to serve you!</p>
        )}
        <div className="text-xs font-medium">
          {format(new Date(), 'yyyy-MM-dd')}
        </div>
      </div>
      
      {/* Updated Print-specific styles for more compact printing */}
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
            }
            
            /* Force content to be visible */
            .print-receipt * {
              visibility: visible !important;
              opacity: 1 !important;
            }
            
            /* Improve dynamic sizing */
            html, body {
              height: auto !important;
              min-height: 0 !important;
              max-height: none !important;
              overflow: visible !important;
            }
            
            /* Fix Chrome printing issues */
            body {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            /* Dynamic height adjustment */
            .print-receipt {
              height: fit-content !important;
              min-height: fit-content !important;
              max-height: fit-content !important;
            }
            
            /* Ensure proper page breaks and avoid blank pages */
            .print-receipt {
              break-inside: avoid !important;
              break-after: avoid-page !important;
              page-break-inside: avoid !important;
              page-break-after: avoid !important;
            }
            
            /* Fix for Google Cloud Print */
            @supports (-webkit-appearance:none) {
              body, html, #receipt-invoice {
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
