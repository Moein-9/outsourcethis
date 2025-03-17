
import React from "react";
import { format } from "date-fns";
import { Invoice } from "@/store/invoiceStore";
import { CheckCircle2, Receipt } from "lucide-react";

interface ReceiptInvoiceProps {
  invoice: Invoice;
  isPrintable?: boolean;
  
  // Additional props for direct usage without an Invoice object
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
}

export const ReceiptInvoice: React.FC<ReceiptInvoiceProps> = ({ 
  invoice,
  isPrintable = false,
  // Optional direct props
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
  authNumber
}) => {
  // Use either the passed props or invoice data
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
  const auth = authNumber || (invoice as any).authNumber; // Use passed or from invoice
  const isPaid = rem <= 0;

  const containerClass = isPrintable 
    ? "w-[80mm] mx-auto bg-white p-4 text-[12px] border shadow-sm print:shadow-none" 
    : "w-full bg-white p-4 border rounded-lg shadow-sm";
  
  return (
    <div className={containerClass} style={{ fontFamily: 'Courier New, monospace' }}>
      <div className="text-center border-b pb-3 mb-3">
        <div className="flex justify-center mb-2">
          <Receipt className="w-10 h-10 text-primary" />
        </div>
        <h2 className="font-bold text-xl mb-1">متجر النظارات</h2>
        <p className="text-sm text-muted-foreground">مدينة الكويت، بلوك 5</p>
        <p className="text-sm text-muted-foreground">هاتف: 6789-2345 965+</p>
      </div>

      <div className="mb-4 text-sm">
        <div className="flex justify-between border-b pb-1 mb-1">
          <span className="font-semibold">رقم الفاتورة:</span>
          <span>{invoice.invoiceId}</span>
        </div>
        <div className="flex justify-between border-b pb-1 mb-1">
          <span className="font-semibold">التاريخ:</span>
          <span>{format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}</span>
        </div>
        <div className="flex justify-between border-b pb-1 mb-1">
          <span className="font-semibold">العميل:</span>
          <span>{name}</span>
        </div>
        {phone && (
          <div className="flex justify-between border-b pb-1 mb-1">
            <span className="font-semibold">الهاتف:</span>
            <span>{phone}</span>
          </div>
        )}
      </div>

      <div className="border-t border-b py-2 mb-3">
        <div className="text-center mb-2 font-bold text-xs uppercase tracking-wide">
          *** المنتجات ***
        </div>
        
        {lens && (
          <div className="flex justify-between mb-1 text-sm">
            <span>العدسات ({lens})</span>
            <span>{lensP.toFixed(2)} د.ك</span>
          </div>
        )}
        
        {coat && (
          <div className="flex justify-between mb-1 text-sm">
            <span>الطلاء ({coat})</span>
            <span>{coatP.toFixed(2)} د.ك</span>
          </div>
        )}
        
        {frameBrand && (
          <div className="flex justify-between mb-1 text-sm">
            <span>الإطار ({frameBrand} {frameModel})</span>
            <span>{frameP.toFixed(2)} د.ك</span>
          </div>
        )}
      </div>

      <div className="text-sm mb-4">
        <div className="flex justify-between">
          <span>المجموع الفرعي:</span>
          <span>{(tot + disc).toFixed(2)} د.ك</span>
        </div>
        {disc > 0 && (
          <div className="flex justify-between text-destructive">
            <span>الخصم:</span>
            <span>-{disc.toFixed(2)} د.ك</span>
          </div>
        )}
        <div className="flex justify-between font-bold mt-1 pt-1 border-t">
          <span>الإجمالي:</span>
          <span>{tot.toFixed(2)} د.ك</span>
        </div>
      </div>

      <div className="space-y-1 text-sm mb-3">
        <div className="text-center mb-1 font-bold text-xs uppercase tracking-wide">
          *** المدفوعات ***
        </div>
        
        {invoice.payments?.map((payment, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>
              {format(new Date(payment.date), 'dd/MM/yyyy')} ({payment.method})
              {payment.authNumber && ` - رقم الموافقة: ${payment.authNumber}`}
            </span>
            <span>{payment.amount.toFixed(2)} د.ك</span>
          </div>
        )) || (
          <div className="flex justify-between text-sm">
            <span>
              {format(new Date(invoice.createdAt), 'dd/MM/yyyy')} ({payMethod})
              {auth && ` - رقم الموافقة: ${auth}`}
            </span>
            <span>{dep.toFixed(2)} د.ك</span>
          </div>
        )}
        
        {rem > 0 && (
          <div className="flex justify-between font-bold mt-1 pt-1 border-t">
            <span>المبلغ المتبقي:</span>
            <span>{rem.toFixed(2)} د.ك</span>
          </div>
        )}
      </div>

      {isPaid && (
        <div className="flex items-center justify-center gap-2 my-3 text-primary font-bold p-1 border border-primary rounded">
          <CheckCircle2 className="w-4 h-4" />
          <span>تم الدفع بالكامل</span>
        </div>
      )}

      <div className="text-center mt-3 pt-3 border-t">
        <p className="font-semibold text-sm">شكراً لتعاملكم معنا!</p>
        <p className="text-xs mt-1 text-muted-foreground">يرجى الاحتفاظ بهذه الفاتورة للرجوع إليها</p>
        <div className="mt-3 text-[10px] flex gap-1 justify-center">
          <span>{'•'.repeat(15)}</span>
        </div>
      </div>
    </div>
  );
};
