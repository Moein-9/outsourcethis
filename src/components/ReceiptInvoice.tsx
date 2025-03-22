
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
        padding: '3mm',
        fontSize: '12px',
        border: isPrintable ? 'none' : '1px solid #ddd',
        borderRadius: isPrintable ? '0' : '4px',
        boxShadow: isPrintable ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
        fontFamily: isRtl ? 'Zain, sans-serif' : 'Yrsa, serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always'
      }}
    >
      {/* Header Section - Bolder and bigger fonts */}
      <div className="text-center border-b-2 border-black pb-3 mb-3">
        <div className="flex justify-center mb-2">
          <MoenLogo className="w-auto h-12" />
        </div>
        <h2 className="font-bold text-xl mb-1">{storeInfo.name}</h2>
        <p className="text-[11px] font-medium">{storeInfo.address}</p>
        <p className="text-[11px] font-medium">{t("phone")}: {storeInfo.phone}</p>
      </div>

      {/* Receipt Title - More prominent */}
      <div className="mb-3 text-center">
        <div className="inline-flex items-center justify-center gap-1.5 border-2 border-black px-3 py-1 rounded">
          <Receipt className="w-4 h-4" />
          <span className="font-bold text-base">{t("invoice")}</span>
        </div>
      </div>

      {/* Customer Information Card - Redesigned for better readability */}
      <div className="mb-3 border-2 border-black rounded p-2.5">
        <div className="text-center border-b border-gray-400 mb-2 pb-1">
          <span className="font-bold text-base uppercase tracking-wide">{t("customerInfo")}</span>
        </div>
        
        <div className="grid grid-cols-1 gap-y-1.5">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-1.5">
            <User className="w-5 h-5" />
            <div className="flex flex-col">
              <span className="font-bold text-[11px]">{t("customer")}:</span>
              <span className="font-semibold text-[13px]">{name}</span>
            </div>
          </div>
          
          {phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="font-bold text-[11px]">{t("phone")}:</span>
                <span className="font-semibold text-[13px]">{phone}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Details - Simplified and bolder */}
      <div className="mb-3 border-2 border-black rounded p-2.5">
        <div className="text-center border-b border-gray-400 mb-2 pb-1">
          <span className="font-bold text-base uppercase tracking-wide">{t("invoiceDetails")}</span>
        </div>
        
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            <span className="font-bold text-[12px]">{t("invoiceNumber")}:</span>
          </div>
          <span className="font-semibold text-[13px]">{invoice.invoiceId}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span className="font-bold text-[12px]">{t("date")}:</span>
          </div>
          <span className="font-semibold text-[13px]">{format(new Date(invoice.createdAt), 'dd/MM/yyyy')}</span>
        </div>
      </div>

      {/* Products Section - Bolder headers, larger product text */}
      <div className="mb-3">
        <div className="text-center py-1 bg-black text-white mb-2.5 font-bold text-base uppercase tracking-wide rounded">
          {t("products")}
        </div>
        
        <div>
          {isContactLens && contactLenses && contactLenses.length > 0 ? (
            // Contact lens specific rendering
            contactLenses.map((lens, idx) => (
              <div key={idx} className="flex justify-between mb-2 border-b-2 border-gray-300 pb-2">
                <div>
                  <div className="font-bold text-[14px]">{lens.brand} {lens.type}</div>
                  <div className="text-[12px] font-medium">{lens.power}</div>
                </div>
                <span className="font-bold text-[14px]">{lens.price.toFixed(3)} KWD</span>
              </div>
            ))
          ) : (
            // Normal glasses rendering
            <>
              {lens && (
                <div className="flex justify-between mb-2 border-b-2 border-gray-300 pb-2">
                  <div>
                    <div className="font-bold text-[14px]">{t("lenses")}</div>
                    <div className="text-[12px] font-medium">{lens}</div>
                  </div>
                  <span className="font-bold text-[14px]">{lensP.toFixed(3)} KWD</span>
                </div>
              )}
              
              {coat && (
                <div className="flex justify-between mb-2 border-b-2 border-gray-300 pb-2">
                  <div>
                    <div className="font-bold text-[14px]">{t("coating")}</div>
                    <div className="text-[12px] font-medium">{coat}</div>
                  </div>
                  <span className="font-bold text-[14px]">{coatP.toFixed(3)} KWD</span>
                </div>
              )}
              
              {frameBrand && (
                <div className="flex justify-between mb-2 border-b-2 border-gray-300 pb-2">
                  <div>
                    <div className="font-bold text-[14px]">{t("frame")}</div>
                    <div className="text-[12px] font-medium">{frameBrand} {frameModel}</div>
                  </div>
                  <span className="font-bold text-[14px]">{frameP.toFixed(3)} KWD</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Totals Section - Bolder with stronger borders */}
      <div className="mb-3 border-2 border-black rounded p-2.5">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[13px]">
            <span className="font-bold">{t("subtotal")}:</span>
            <span className="font-semibold">{(tot + disc).toFixed(3)} KWD</span>
          </div>
          {disc > 0 && (
            <div className="flex justify-between text-[13px]">
              <span className="font-bold">{t("discount")}:</span>
              <span className="font-semibold">-{disc.toFixed(3)} KWD</span>
            </div>
          )}
          <div className="flex justify-between pt-1 mt-1 border-t-2 border-black">
            <span className="font-bold text-[15px]">{t("total")}:</span>
            <span className="font-bold text-[15px]">{tot.toFixed(3)} KWD</span>
          </div>
        </div>
      </div>

      {/* Payment Section - Enhanced with bigger and bolder text */}
      <div className="mb-3">
        <div className="text-center py-1 bg-black text-white mb-2.5 font-bold text-base uppercase tracking-wide rounded">
          {t("payments")}
        </div>
        
        <div>
          {invoice.payments?.map((payment, index) => (
            <div key={index} className="flex justify-between mb-2 pb-2 border-b-2 border-gray-300">
              <div>
                <div className="font-bold text-[14px]">
                  {format(new Date(payment.date), 'dd/MM/yyyy')}
                </div>
                <div className="text-[12px] font-medium flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  {payment.method}
                  {payment.authNumber && <span> - {payment.authNumber}</span>}
                </div>
              </div>
              <span className="font-bold text-[14px]">{payment.amount.toFixed(3)} KWD</span>
            </div>
          )) || (
            <div className="flex justify-between mb-2 pb-2 border-b-2 border-gray-300">
              <div>
                <div className="font-bold text-[14px]">
                  {format(new Date(invoice.createdAt), 'dd/MM/yyyy')}
                </div>
                <div className="text-[12px] font-medium flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  {payMethod}
                  {auth && <span> - {auth}</span>}
                </div>
              </div>
              <span className="font-bold text-[14px]">{dep.toFixed(3)} KWD</span>
            </div>
          )}
          
          {rem > 0 ? (
            <div className="flex justify-between font-bold mt-1.5 pt-1.5 border-t-2 border-black">
              <span className="text-[15px]">{t("remaining")}:</span>
              <span className="text-[15px]">{rem.toFixed(3)} KWD</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mt-2 font-bold border-2 border-black py-1.5 rounded">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-[14px]">{t("paidInFull")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section - Enhanced fonts */}
      <div className="text-center mt-3 pt-2 border-t-2 border-black">
        {isRtl ? (
          <p className="font-bold text-[13px]">شكراً لاختياركم نظارات المعين. يسعدنا خدمتكم دائماً!</p>
        ) : (
          <p className="font-bold text-[13px]">Thank you for choosing Moein Optical. We're always delighted to serve you!</p>
        )}
        <div className="mt-1 text-[10px] font-medium">
          {format(new Date(), 'yyyy-MM-dd')}
        </div>
      </div>
      
      {/* Updated Print-specific styles - Improved for better dynamic height */}
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
            
            /* Force content to be visible */
            .print-receipt * {
              visibility: visible !important;
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
