
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
        padding: '10px',
        fontSize: '14px', // Increased base font size from 12px to 14px
        border: isPrintable ? 'none' : '1px solid #ddd',
        borderRadius: isPrintable ? '0' : '4px',
        boxShadow: isPrintable ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
        fontFamily: isRtl ? 'Zain, sans-serif' : 'Yrsa, serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always',
        textAlign: 'center' // Center all content in the receipt
      }}
    >
      <div className="mb-3">
        <div className="flex justify-center mb-1">
          <MoenLogo className="w-auto h-14" /> {/* Increased logo size from h-12 to h-14 */}
        </div>
        <h2 className="font-bold text-xl mb-0">{storeInfo.name}</h2> {/* Increased from text-lg to text-xl */}
        <p className="text-sm font-medium mb-0">{storeInfo.address}</p> {/* Increased from text-xs to text-sm */}
        <p className="text-sm font-medium">{t("phone")}: {storeInfo.phone}</p> {/* Increased from text-xs to text-sm */}
      </div>

      <div className="mb-3">
        <div className="inline-flex items-center justify-center gap-1 border-2 border-black px-5 py-2 rounded"> {/* Increased padding */}
          <Receipt className="w-6 h-6" /> {/* Increased icon size from w-5/h-5 to w-6/h-6 */}
          <span className="font-bold text-lg">{t("invoice")}</span> {/* Increased from text-base to text-lg */}
        </div>
      </div>

      <div className="mb-3 border-2 border-black rounded p-3">
        <div className="mb-2 border-b border-gray-400 pb-2">
          <div className="flex items-center justify-center gap-1">
            <User className="w-6 h-6" /> {/* Increased icon size from w-5/h-5 to w-6/h-6 */}
            <span className="font-bold text-lg"> {/* Increased from text-base to text-lg */}
              {isRtl ? "معلومات العميل | Customer Info" : "Customer Info | معلومات العميل"}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-1">
              <UserCircle2 className="w-5 h-5" /> {/* Increased from w-4/h-4 to w-5/h-5 */}
              <span className="font-semibold text-base">{t("name")}:</span> {/* Increased from text-sm to text-base */}
            </div>
            <span className="font-semibold text-base">{name}</span> {/* Increased from text-sm to text-base */}
          </div>
          
          {phone && (
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1">
                <Phone className="w-5 h-5" /> {/* Increased from w-4/h-4 to w-5/h-5 */}
                <span className="font-semibold text-base">{t("phone")}:</span> {/* Increased from text-sm to text-base */}
              </div>
              <span className="font-semibold text-base">{phone}</span> {/* Increased from text-sm to text-base */}
            </div>
          )}
        </div>
      </div>

      <div className="mb-3 border-2 border-black rounded p-3">
        <div className="mb-2 border-b border-gray-400 pb-2">
          <div className="flex items-center justify-center gap-1">
            <Receipt className="w-6 h-6" /> {/* Increased icon size from w-5/h-5 to w-6/h-6 */}
            <span className="font-bold text-lg"> {/* Increased from text-base to text-lg */}
              {isRtl ? "رقم الفاتورة | Invoice Number" : "Invoice Number | رقم الفاتورة"}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-5 h-5" /> {/* Increased from w-4/h-4 to w-5/h-5 */}
            <span className="font-semibold text-base">{format(new Date(invoice.createdAt), 'dd/MM/yyyy')}</span> {/* Increased from text-sm to text-base */}
          </div>
          <span className="font-semibold text-lg text-primary">#{invoice.invoiceId}</span> {/* Increased from text-sm to text-lg */}
        </div>
      </div>

      <div className="mb-3">
        <div className="py-2 bg-black text-white mb-3 font-bold text-lg rounded"> {/* Increased from text-base to text-lg */}
          {isRtl ? "المنتجات | Products" : "Products | المنتجات"}
        </div>
        
        <div className="space-y-2 px-2">
          {isContactLens && contactLensItems.length > 0 ? (
            contactLensItems.map((lens, idx) => (
              <div key={idx} className="p-2 border-2 border-gray-300 rounded">
                <div className="flex justify-between px-2 mb-1">
                  <div className="font-bold text-base">{lens.brand} {lens.type}</div> {/* Increased from text-sm to text-base */}
                  <span className="font-bold text-base">KWD {lens.price.toFixed(3)}</span> {/* Increased from text-sm to text-base */}
                </div>
                <div className="text-sm font-medium text-center"> {/* Increased from text-xs to text-sm */}
                  {lens.color && <span>{t("color")}: {lens.color} - </span>}
                  <span>{t("quantity")}: {lens.qty || 1}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-2">
              {lens && (
                <div className="p-2 border-2 border-gray-300 rounded">
                  <div className="flex justify-between px-2 mb-1">
                    <div className="font-bold text-base">{isRtl ? "العدسات | Lenses" : "Lenses | العدسات"}</div> {/* Increased from text-sm to text-base */}
                    <span className="font-bold text-base">KWD {lensP.toFixed(3)}</span> {/* Increased from text-sm to text-base */}
                  </div>
                  <div className="text-sm font-medium text-center">{lens}</div> {/* Increased from text-xs to text-sm */}
                </div>
              )}
              
              {frameBrand && (
                <div className="p-2 border-2 border-gray-300 rounded">
                  <div className="flex justify-between px-2 mb-1">
                    <div className="font-bold text-base">{isRtl ? "الإطار | Frame" : "Frame | الإطار"}</div> {/* Increased from text-sm to text-base */}
                    <span className="font-bold text-base">KWD {frameP.toFixed(3)}</span> {/* Increased from text-sm to text-base */}
                  </div>
                  <div className="text-sm font-medium text-center">{frameBrand} {frameModel}</div> {/* Increased from text-xs to text-sm */}
                </div>
              )}
              
              {coat && (
                <div className="p-2 border-2 border-gray-300 rounded">
                  <div className="flex justify-between px-2 mb-1">
                    <div className="font-bold text-base">{isRtl ? "الطلاء | Coating" : "Coating | الطلاء"}</div> {/* Increased from text-sm to text-base */}
                    <span className="font-bold text-base">KWD {coatP.toFixed(3)}</span> {/* Increased from text-sm to text-base */}
                  </div>
                  <div className="text-sm font-medium text-center">{coat}</div> {/* Increased from text-xs to text-sm */}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-3 border-2 border-gray-300 rounded p-2">
          <div className="flex justify-between px-2 font-bold">
            <span className="text-base">{isRtl ? "المجموع الفرعي" : "Subtotal"}:</span> {/* Increased from default to text-base */}
            <span className="text-base">KWD {tot.toFixed(3)}</span> {/* Increased from default to text-base */}
          </div>
          
          <div className="flex justify-between px-2 font-bold mt-1">
            <span className="text-base">{isRtl ? "المجموع" : "Total"}:</span> {/* Increased from default to text-base */}
            <span className="text-base">KWD {tot.toFixed(3)}</span> {/* Increased from default to text-base */}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="py-2 bg-black text-white mb-3 font-bold text-lg rounded"> {/* Increased from text-base to text-lg */}
          {isRtl ? "الدفع | Payment" : "Payment | الدفع"}
        </div>
        
        <div className="px-2">
          {invoice.payments?.map((payment, index) => (
            <div key={index} className="border-b border-gray-300 py-2">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-base"> {/* Increased from text-sm to text-base */}
                  {format(new Date(payment.date), 'dd/MM/yyyy')}
                </span>
                <span className="font-bold text-base">KWD {payment.amount.toFixed(3)}</span> {/* Increased from text-sm to text-base */}
              </div>
              <div className="text-sm font-medium flex items-center justify-center gap-1"> {/* Increased from text-xs to text-sm */}
                <CreditCard className="w-5 h-5" /> {/* Increased from w-4/h-4 to w-5/h-5 */}
                {payment.method}
                {payment.authNumber && <span> - {payment.authNumber}</span>}
              </div>
            </div>
          )) || (
            <div className="border-b border-gray-300 py-2">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-base"> {/* Increased from text-sm to text-base */}
                  {format(new Date(invoice.createdAt), 'dd/MM/yyyy')}
                </span>
                <span className="font-bold text-base">KWD {dep.toFixed(3)}</span> {/* Increased from text-sm to text-base */}
              </div>
              <div className="text-sm font-medium flex items-center justify-center gap-1"> {/* Increased from text-xs to text-sm */}
                <CreditCard className="w-5 h-5" /> {/* Increased from w-4/h-4 to w-5/h-5 */}
                {payMethod}
                {auth && <span> - {auth}</span>}
              </div>
            </div>
          )}
          
          {rem > 0 ? (
            <div className="flex justify-between font-bold mt-2 pt-1">
              <span className="text-lg">{t("remaining")}:</span> {/* Increased from text-base to text-lg */}
              <span className="text-lg">KWD {rem.toFixed(3)}</span> {/* Increased from text-base to text-lg */}
            </div>
          ) : (
            <div className="mt-2 flex items-center justify-center gap-1 font-bold">
              <CheckCircle2 className="w-6 h-6" /> {/* Increased from w-5/h-5 to w-6/h-6 */}
              <span className="text-base">{t("paidInFull")}</span> {/* Increased from text-sm to text-base */}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t-2 border-gray-300">
        {isRtl ? (
          <p className="font-bold text-base mb-0">شكراً لاختياركم نظارات المعين. يسعدنا خدمتكم دائماً!</p> /* Increased from text-sm to text-base */
        ) : (
          <p className="font-bold text-base mb-0">Thank you for choosing Moein Optical. We're always delighted to serve you!</p> /* Increased from text-sm to text-base */
        )}
        <div className="text-sm font-medium"> {/* Increased from text-xs to text-sm */}
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
              color: black !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
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
              padding: 10px !important;
              margin: 0 !important;
              background-color: white !important;
              color: black !important;
              text-align: center !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              font-size: 14px !important; /* Increased base font size for printing */
            }
            
            .print-receipt * {
              visibility: visible !important;
              opacity: 1 !important;
              color: black !important;
            }
            
            .bg-black {
              background-color: black !important;
              color: white !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            .text-white {
              color: white !important;
            }
            
            .bg-black * {
              color: white !important;
            }
            
            #receipt-invoice .border-2 {
              border-width: 2px !important;
              border-style: solid !important;
            }
            
            #receipt-invoice .border-black {
              border-color: black !important;
            }
            
            #receipt-invoice .border-gray-300, #receipt-invoice .border-gray-400 {
              border-color: #d1d5db !important;
            }
            
            #receipt-invoice .rounded {
              border-radius: 0.25rem !important;
            }
            
            .thermal-receipt {
              font-family: ${isRtl ? 'Zain, sans-serif' : 'Yrsa, serif'} !important;
            }
            
            .mb-1 { margin-bottom: 0.25rem !important; }
            .mb-2 { margin-bottom: 0.5rem !important; }
            .mb-3 { margin-bottom: 0.75rem !important; }
            .mt-2 { margin-top: 0.5rem !important; }
            .mt-3 { margin-top: 0.75rem !important; }
            .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
            .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
            .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
            .p-2 { padding: 0.5rem !important; }
            .p-3 { padding: 0.75rem !important; }
            .pt-1 { padding-top: 0.25rem !important; }
            .pt-2 { padding-top: 0.5rem !important; }
            .pb-2 { padding-bottom: 0.5rem !important; }
            
            .text-primary { color: rgb(var(--primary)) !important; }
            
            html, body {
              height: auto !important;
              min-height: 0 !important;
              max-height: none !important;
              overflow: visible !important;
            }
            
            .print-receipt {
              height: fit-content !important;
              min-height: fit-content !important;
              max-height: fit-content !important;
            }
            
            .print-receipt img, .print-receipt svg {
              max-height: 14mm !important; /* Increased from 12mm to 14mm */
              width: auto !important;
            }
            
            body {
              font-family: ${isRtl ? 'Zain, sans-serif' : 'Yrsa, serif'} !important;
            }
            
            /* Increase text sizes for better readability when printing */
            .text-base { font-size: 14px !important; }
            .text-lg { font-size: 16px !important; }
            .text-xl { font-size: 18px !important; }
            .text-sm { font-size: 12px !important; }
            
            /* Make the invoice number stand out more */
            .text-primary { font-size: 16px !important; font-weight: bold !important; }
          }
        `}
      </style>
    </div>
  );
};
