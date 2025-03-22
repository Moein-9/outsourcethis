
import React from "react";
import { format } from "date-fns";
import { Invoice } from "@/store/invoiceStore";
import { CheckCircle2 } from "lucide-react";
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
        fontSize: '12px',
        border: isPrintable ? 'none' : '1px solid #ddd',
        borderRadius: isPrintable ? '0' : '5px',
        boxShadow: isPrintable ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
        fontFamily: isRtl ? 'Zain, sans-serif' : 'Yrsa, serif'
      }}
    >
      <div className="text-center border-b pb-3 mb-3">
        <div className="flex justify-center mb-2">
          <MoenLogo className="w-auto h-16 mb-2" />
        </div>
        <h2 className="font-bold text-xl mb-1">{storeInfo.name}</h2>
        <p className="text-sm text-muted-foreground">{storeInfo.address}</p>
        <p className="text-sm text-muted-foreground">{t("phone")}: {storeInfo.phone}</p>
      </div>

      <div className="mb-4 text-sm">
        <div className="flex justify-between border-b pb-1 mb-1">
          <span className="font-semibold">{t("invoiceNumber")} {isRtl && '(رقم الفاتورة)'}:</span>
          <span>{invoice.invoiceId}</span>
        </div>
        <div className="flex justify-between border-b pb-1 mb-1">
          <span className="font-semibold">{t("date")}:</span>
          <span>{format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}</span>
        </div>
        <div className="flex justify-between border-b pb-1 mb-1">
          <span className="font-semibold">{t("customer")} {isRtl && '(العميل)'}:</span>
          <span>{name}</span>
        </div>
        {phone && (
          <div className="flex justify-between border-b pb-1 mb-1">
            <span className="font-semibold">{t("phone")}:</span>
            <span>{phone}</span>
          </div>
        )}
      </div>

      <div className="border-t border-b py-2 mb-3">
        <div className="text-center mb-2 font-bold text-xs uppercase tracking-wide">
          {isRtl ? "*** المنتجات ***" : "*** PRODUCTS ***"}
        </div>
        
        {isContactLens && contactLenses && contactLenses.length > 0 ? (
          // Contact lens specific rendering
          contactLenses.map((lens, idx) => (
            <div key={idx} className="flex justify-between mb-1 text-sm">
              <span>{lens.brand} {lens.type} {lens.power}</span>
              <span>{lens.price.toFixed(3)} KWD</span>
            </div>
          ))
        ) : (
          // Normal glasses rendering
          <>
            {lens && (
              <div className="flex justify-between mb-1 text-sm">
                <span>{t("lenses")} ({lens})</span>
                <span>{lensP.toFixed(3)} KWD</span>
              </div>
            )}
            
            {coat && (
              <div className="flex justify-between mb-1 text-sm">
                <span>{t("coating")} ({coat})</span>
                <span>{coatP.toFixed(3)} KWD</span>
              </div>
            )}
            
            {frameBrand && (
              <div className="flex justify-between mb-1 text-sm">
                <span>{t("frame")} ({frameBrand} {frameModel})</span>
                <span>{frameP.toFixed(3)} KWD</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="text-sm mb-4">
        <div className="flex justify-between">
          <span>{t("subtotal")}:</span>
          <span>{(tot + disc).toFixed(3)} KWD</span>
        </div>
        {disc > 0 && (
          <div className="flex justify-between text-destructive">
            <span>{t("discount")}:</span>
            <span>-{disc.toFixed(3)} KWD</span>
          </div>
        )}
        <div className="flex justify-between font-bold mt-1 pt-1 border-t">
          <span>{t("total")}:</span>
          <span>{tot.toFixed(3)} KWD</span>
        </div>
      </div>

      <div className="space-y-1 text-sm mb-3">
        <div className="text-center mb-1 font-bold text-xs uppercase tracking-wide">
          {isRtl ? "*** المدفوعات ***" : "*** PAYMENTS ***"}
        </div>
        
        {invoice.payments?.map((payment, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>
              {format(new Date(payment.date), 'dd/MM/yyyy')} ({payment.method})
              {payment.authNumber && ` - ${t("authNumber")}: ${payment.authNumber}`}
            </span>
            <span>{payment.amount.toFixed(3)} KWD</span>
          </div>
        )) || (
          <div className="flex justify-between text-sm">
            <span>
              {format(new Date(invoice.createdAt), 'dd/MM/yyyy')} ({payMethod})
              {auth && ` - ${t("authNumber")}: ${auth}`}
            </span>
            <span>{dep.toFixed(3)} KWD</span>
          </div>
        )}
        
        {rem > 0 && (
          <div className="flex justify-between font-bold mt-1 pt-1 border-t">
            <span>{t("remaining")}:</span>
            <span>{rem.toFixed(3)} KWD</span>
          </div>
        )}
      </div>

      {isPaid && (
        <div className="flex items-center justify-center gap-2 my-3 text-primary font-bold p-1 border border-primary rounded">
          <CheckCircle2 className="w-4 h-4" />
          <span>{t("paidInFull")}</span>
        </div>
      )}

      <div className="text-center mt-3 pt-3 border-t">
        {isRtl ? (
          <p className="font-semibold text-sm">شكراً لاختياركم نظارات المعين. يسعدنا خدمتكم دائماً ونتطلع لزيارتكم القادمة!</p>
        ) : (
          <>
            <p className="font-semibold text-sm">Thank you for choosing Moein Optical.</p>
            <p className="text-xs mt-1">We're always delighted to serve you and look forward to your next visit!</p>
          </>
        )}
        <div className="mt-3 text-[10px] flex gap-1 justify-center">
          <span>{'•'.repeat(15)}</span>
        </div>
      </div>
    </div>
  );
};
