
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
        padding: '4mm',
        fontSize: '11px',
        border: isPrintable ? 'none' : '1px solid #eee',
        borderRadius: isPrintable ? '0' : '5px',
        boxShadow: isPrintable ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
        fontFamily: isRtl ? 'Zain, sans-serif' : 'Yrsa, serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always'
      }}
    >
      {/* Header Section */}
      <div className="text-center border-b pb-3 mb-3">
        <div className="flex justify-center mb-2">
          <MoenLogo className="w-auto h-14" />
        </div>
        <h2 className="font-bold text-xl mb-1">{storeInfo.name}</h2>
        <p className="text-xs text-muted-foreground">{storeInfo.address}</p>
        <p className="text-xs text-muted-foreground">{t("phone")}: {storeInfo.phone}</p>
      </div>

      {/* Receipt Title */}
      <div className="mb-3 text-center">
        <div className="inline-flex items-center justify-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-md">
          <Receipt className="w-4 h-4" />
          <span className="font-semibold text-base">{t("invoice")}</span>
        </div>
      </div>

      {/* Invoice Info Section */}
      <div className="mb-3 p-2 bg-slate-50 rounded-md text-xs">
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center gap-1">
            <Receipt className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-semibold">{t("invoiceNumber")}:</span>
          </div>
          <span className="font-medium">{invoice.invoiceId}</span>
        </div>
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-semibold">{t("date")}:</span>
          </div>
          <span>{format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}</span>
        </div>
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-semibold">{t("customer")}:</span>
          </div>
          <span>{name}</span>
        </div>
        {phone && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-semibold">{t("phone")}:</span>
            </div>
            <span>{phone}</span>
          </div>
        )}
      </div>

      {/* Products Section */}
      <div className="mb-3">
        <div className="text-center p-1 bg-primary/10 rounded-t-md mb-2 font-medium text-xs uppercase tracking-wide border-b">
          {t("products")}
        </div>
        
        <div className="px-2">
          {isContactLens && contactLenses && contactLenses.length > 0 ? (
            // Contact lens specific rendering
            contactLenses.map((lens, idx) => (
              <div key={idx} className="flex justify-between my-1.5 text-xs border-b pb-1.5">
                <div>
                  <div className="font-semibold">{lens.brand} {lens.type}</div>
                  <div className="text-muted-foreground text-[10px]">{lens.power}</div>
                </div>
                <span className="font-medium">{lens.price.toFixed(3)} KWD</span>
              </div>
            ))
          ) : (
            // Normal glasses rendering
            <>
              {lens && (
                <div className="flex justify-between my-1.5 text-xs border-b pb-1.5">
                  <div>
                    <div className="font-semibold">{t("lenses")}</div>
                    <div className="text-muted-foreground text-[10px]">{lens}</div>
                  </div>
                  <span className="font-medium">{lensP.toFixed(3)} KWD</span>
                </div>
              )}
              
              {coat && (
                <div className="flex justify-between my-1.5 text-xs border-b pb-1.5">
                  <div>
                    <div className="font-semibold">{t("coating")}</div>
                    <div className="text-muted-foreground text-[10px]">{coat}</div>
                  </div>
                  <span className="font-medium">{coatP.toFixed(3)} KWD</span>
                </div>
              )}
              
              {frameBrand && (
                <div className="flex justify-between my-1.5 text-xs border-b pb-1.5">
                  <div>
                    <div className="font-semibold">{t("frame")}</div>
                    <div className="text-muted-foreground text-[10px]">{frameBrand} {frameModel}</div>
                  </div>
                  <span className="font-medium">{frameP.toFixed(3)} KWD</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Totals Section */}
      <div className="mb-3 p-2 rounded-md bg-slate-50 text-xs">
        <div className="flex justify-between mb-1">
          <span>{t("subtotal")}:</span>
          <span>{(tot + disc).toFixed(3)} KWD</span>
        </div>
        {disc > 0 && (
          <div className="flex justify-between text-destructive mb-1">
            <span>{t("discount")}:</span>
            <span>-{disc.toFixed(3)} KWD</span>
          </div>
        )}
        <div className="flex justify-between font-bold mt-1 pt-1 border-t">
          <span>{t("total")}:</span>
          <span>{tot.toFixed(3)} KWD</span>
        </div>
      </div>

      {/* Payment Section */}
      <div className="mb-3">
        <div className="text-center p-1 bg-primary/10 rounded-t-md mb-2 font-medium text-xs uppercase tracking-wide border-b">
          {t("payments")}
        </div>
        
        <div className="px-2">
          {invoice.payments?.map((payment, index) => (
            <div key={index} className="flex justify-between text-xs mb-1.5">
              <div>
                <div className="font-semibold">
                  {format(new Date(payment.date), 'dd/MM/yyyy')}
                </div>
                <div className="text-muted-foreground text-[10px] flex items-center gap-0.5">
                  <CreditCard className="w-3 h-3" />
                  {payment.method}
                  {payment.authNumber && <span> - {payment.authNumber}</span>}
                </div>
              </div>
              <span className="font-medium">{payment.amount.toFixed(3)} KWD</span>
            </div>
          )) || (
            <div className="flex justify-between text-xs mb-1.5">
              <div>
                <div className="font-semibold">
                  {format(new Date(invoice.createdAt), 'dd/MM/yyyy')}
                </div>
                <div className="text-muted-foreground text-[10px] flex items-center gap-0.5">
                  <CreditCard className="w-3 h-3" />
                  {payMethod}
                  {auth && <span> - {auth}</span>}
                </div>
              </div>
              <span className="font-medium">{dep.toFixed(3)} KWD</span>
            </div>
          )}
          
          {rem > 0 ? (
            <div className="flex justify-between font-bold mt-2 pt-2 border-t">
              <span>{t("remaining")}:</span>
              <span>{rem.toFixed(3)} KWD</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1 mt-2 text-green-600 font-medium p-1 border border-green-200 bg-green-50 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-xs">{t("paidInFull")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className="text-center mt-3 pt-2 border-t">
        {isRtl ? (
          <p className="font-semibold text-xs">شكراً لاختياركم نظارات المعين. يسعدنا خدمتكم دائماً ونتطلع لزيارتكم القادمة!</p>
        ) : (
          <p className="font-semibold text-xs">Thank you for choosing Moein Optical. We're always delighted to serve you and look forward to your next visit!</p>
        )}
        <div className="mt-1 text-[8px] text-muted-foreground">
          {format(new Date(), 'yyyy-MM-dd')}
        </div>
      </div>
      
      {/* Print-specific styles */}
      <style>
        {`
          @media print {
            @page {
              size: 80mm auto;
              margin: 0;
            }
            
            body {
              width: 80mm;
              margin: 0;
              padding: 0;
            }
            
            #receipt-invoice {
              width: 80mm !important;
              max-width: 80mm !important;
              page-break-after: always;
              page-break-inside: avoid;
              border: none !important;
              box-shadow: none !important;
              padding: 4mm !important;
              margin: 0 !important;
            }
          }
        `}
      </style>
    </div>
  );
};
