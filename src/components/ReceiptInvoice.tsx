
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
        fontSize: '10px',
        border: isPrintable ? 'none' : '1px solid #ddd',
        borderRadius: isPrintable ? '0' : '4px',
        boxShadow: isPrintable ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
        fontFamily: isRtl ? 'Zain, sans-serif' : 'Yrsa, serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always'
      }}
    >
      {/* Header Section - More compact */}
      <div className="text-center border-b border-gray-200 pb-2 mb-2">
        <div className="flex justify-center mb-1">
          <MoenLogo className="w-auto h-10" />
        </div>
        <h2 className="font-bold text-lg mb-0.5">{storeInfo.name}</h2>
        <p className="text-[9px] text-gray-600">{storeInfo.address}</p>
        <p className="text-[9px] text-gray-600">{t("phone")}: {storeInfo.phone}</p>
      </div>

      {/* Receipt Title - More subtle */}
      <div className="mb-2 text-center">
        <div className="inline-flex items-center justify-center gap-1 border border-gray-300 px-2 py-0.5 rounded-sm">
          <Receipt className="w-3 h-3" />
          <span className="font-semibold text-sm">{t("invoice")}</span>
        </div>
      </div>

      {/* Invoice Info Section - More compact with clearer borders */}
      <div className="mb-2 border border-gray-200 rounded-sm text-[9px]">
        <div className="grid grid-cols-2 gap-x-1 p-1.5">
          <div className="flex items-center gap-0.5">
            <Receipt className="w-3 h-3 text-gray-600" />
            <span className="font-semibold">{t("invoiceNumber")}:</span>
          </div>
          <span className="text-right font-medium">{invoice.invoiceId}</span>
          
          <div className="flex items-center gap-0.5">
            <Calendar className="w-3 h-3 text-gray-600" />
            <span className="font-semibold">{t("date")}:</span>
          </div>
          <span className="text-right">{format(new Date(invoice.createdAt), 'dd/MM/yyyy')}</span>
          
          <div className="flex items-center gap-0.5">
            <User className="w-3 h-3 text-gray-600" />
            <span className="font-semibold">{t("customer")}:</span>
          </div>
          <span className="text-right">{name}</span>
          
          {phone && (
            <>
              <div className="flex items-center gap-0.5">
                <Phone className="w-3 h-3 text-gray-600" />
                <span className="font-semibold">{t("phone")}:</span>
              </div>
              <span className="text-right">{phone}</span>
            </>
          )}
        </div>
      </div>

      {/* Products Section - Table layout for better alignment */}
      <div className="mb-2">
        <div className="text-center py-0.5 border-y border-gray-400 mb-1.5 font-medium text-[9px] uppercase tracking-wide">
          {t("products")}
        </div>
        
        <div>
          {isContactLens && contactLenses && contactLenses.length > 0 ? (
            // Contact lens specific rendering
            contactLenses.map((lens, idx) => (
              <div key={idx} className="flex justify-between mb-1 text-[9px] border-b border-gray-200 pb-1">
                <div>
                  <div className="font-semibold">{lens.brand} {lens.type}</div>
                  <div className="text-gray-600 text-[8px]">{lens.power}</div>
                </div>
                <span className="font-medium">{lens.price.toFixed(3)} KWD</span>
              </div>
            ))
          ) : (
            // Normal glasses rendering
            <>
              {lens && (
                <div className="flex justify-between mb-1 text-[9px] border-b border-gray-200 pb-1">
                  <div>
                    <div className="font-semibold">{t("lenses")}</div>
                    <div className="text-gray-600 text-[8px]">{lens}</div>
                  </div>
                  <span className="font-medium">{lensP.toFixed(3)} KWD</span>
                </div>
              )}
              
              {coat && (
                <div className="flex justify-between mb-1 text-[9px] border-b border-gray-200 pb-1">
                  <div>
                    <div className="font-semibold">{t("coating")}</div>
                    <div className="text-gray-600 text-[8px]">{coat}</div>
                  </div>
                  <span className="font-medium">{coatP.toFixed(3)} KWD</span>
                </div>
              )}
              
              {frameBrand && (
                <div className="flex justify-between mb-1 text-[9px] border-b border-gray-200 pb-1">
                  <div>
                    <div className="font-semibold">{t("frame")}</div>
                    <div className="text-gray-600 text-[8px]">{frameBrand} {frameModel}</div>
                  </div>
                  <span className="font-medium">{frameP.toFixed(3)} KWD</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Totals Section - Better aligned with borders */}
      <div className="mb-2 border border-gray-200 rounded-sm text-[9px]">
        <div className="p-1.5 space-y-0.5">
          <div className="flex justify-between">
            <span>{t("subtotal")}:</span>
            <span>{(tot + disc).toFixed(3)} KWD</span>
          </div>
          {disc > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>{t("discount")}:</span>
              <span>-{disc.toFixed(3)} KWD</span>
            </div>
          )}
          <div className="flex justify-between font-bold pt-0.5 mt-0.5 border-t border-gray-200">
            <span>{t("total")}:</span>
            <span>{tot.toFixed(3)} KWD</span>
          </div>
        </div>
      </div>

      {/* Payment Section - Better styled with clear payment status */}
      <div className="mb-2">
        <div className="text-center py-0.5 border-y border-gray-400 mb-1.5 font-medium text-[9px] uppercase tracking-wide">
          {t("payments")}
        </div>
        
        <div>
          {invoice.payments?.map((payment, index) => (
            <div key={index} className="flex justify-between text-[9px] mb-1 pb-0.5 border-b border-gray-200">
              <div>
                <div className="font-semibold">
                  {format(new Date(payment.date), 'dd/MM/yyyy')}
                </div>
                <div className="text-gray-600 text-[8px] flex items-center gap-0.5">
                  <CreditCard className="w-2.5 h-2.5" />
                  {payment.method}
                  {payment.authNumber && <span> - {payment.authNumber}</span>}
                </div>
              </div>
              <span className="font-medium">{payment.amount.toFixed(3)} KWD</span>
            </div>
          )) || (
            <div className="flex justify-between text-[9px] mb-1 pb-0.5 border-b border-gray-200">
              <div>
                <div className="font-semibold">
                  {format(new Date(invoice.createdAt), 'dd/MM/yyyy')}
                </div>
                <div className="text-gray-600 text-[8px] flex items-center gap-0.5">
                  <CreditCard className="w-2.5 h-2.5" />
                  {payMethod}
                  {auth && <span> - {auth}</span>}
                </div>
              </div>
              <span className="font-medium">{dep.toFixed(3)} KWD</span>
            </div>
          )}
          
          {rem > 0 ? (
            <div className="flex justify-between font-bold text-[9px] mt-1 pt-0.5 border-t border-gray-200">
              <span>{t("remaining")}:</span>
              <span>{rem.toFixed(3)} KWD</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-0.5 mt-1 text-gray-800 font-medium border border-gray-300 py-0.5 rounded-sm">
              <CheckCircle2 className="w-3 h-3" />
              <span className="text-[9px]">{t("paidInFull")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section - More compact */}
      <div className="text-center mt-2 pt-1 border-t border-gray-200">
        {isRtl ? (
          <p className="font-medium text-[9px]">شكراً لاختياركم نظارات المعين. يسعدنا خدمتكم دائماً!</p>
        ) : (
          <p className="font-medium text-[9px]">Thank you for choosing Moein Optical. We're always delighted to serve you!</p>
        )}
        <div className="mt-0.5 text-[7px] text-gray-500">
          {format(new Date(), 'yyyy-MM-dd')}
        </div>
      </div>
      
      {/* Print-specific styles - More precise size control */}
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
            }
            
            /* Force content to be visible */
            .print-receipt * {
              visibility: visible !important;
            }
            
            /* Ensure proper height calculation */
            html, body {
              height: auto !important;
            }
            
            /* Prevent Chrome from adding extra margin */
            body {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}
      </style>
    </div>
  );
};
