
import React from "react";
import { format } from "date-fns";
import { Invoice } from "@/store/invoiceStore";
import { CheckCircle2, Receipt } from "lucide-react";

interface ReceiptInvoiceProps {
  invoice: Invoice;
  isPrintable?: boolean;
}

export const ReceiptInvoice: React.FC<ReceiptInvoiceProps> = ({ invoice, isPrintable = false }) => {
  const containerClass = isPrintable 
    ? "w-[80mm] mx-auto bg-white p-4 text-[12px] border shadow-sm print:shadow-none" 
    : "w-full bg-white p-4 border rounded-lg shadow-sm";
  
  return (
    <div className={containerClass} style={{ fontFamily: 'Courier New, monospace' }}>
      <div className="text-center border-b pb-3 mb-3">
        <div className="flex justify-center mb-2">
          <Receipt className="w-10 h-10 text-primary" />
        </div>
        <h2 className="font-bold text-xl mb-1">OPTICS STORE</h2>
        <p className="text-sm text-muted-foreground">Kuwait City, Block 5</p>
        <p className="text-sm text-muted-foreground">Tel: +965 2345-6789</p>
      </div>

      <div className="mb-4 text-sm">
        <div className="flex justify-between border-b pb-1 mb-1">
          <span className="font-semibold">Invoice #:</span>
          <span>{invoice.invoiceId}</span>
        </div>
        <div className="flex justify-between border-b pb-1 mb-1">
          <span className="font-semibold">Date:</span>
          <span>{format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}</span>
        </div>
        <div className="flex justify-between border-b pb-1 mb-1">
          <span className="font-semibold">Customer:</span>
          <span>{invoice.patientName}</span>
        </div>
        {invoice.patientPhone && (
          <div className="flex justify-between border-b pb-1 mb-1">
            <span className="font-semibold">Phone:</span>
            <span>{invoice.patientPhone}</span>
          </div>
        )}
      </div>

      <div className="border-t border-b py-2 mb-3">
        <div className="text-center mb-2 font-bold text-xs uppercase tracking-wide">
          *** ITEMS ***
        </div>
        
        {invoice.lensType && (
          <div className="flex justify-between mb-1 text-sm">
            <span>Lenses ({invoice.lensType})</span>
            <span>{invoice.lensPrice.toFixed(2)} KWD</span>
          </div>
        )}
        
        {invoice.coating && (
          <div className="flex justify-between mb-1 text-sm">
            <span>Coating ({invoice.coating})</span>
            <span>{invoice.coatingPrice.toFixed(2)} KWD</span>
          </div>
        )}
        
        {invoice.frameBrand && (
          <div className="flex justify-between mb-1 text-sm">
            <span>Frame ({invoice.frameBrand} {invoice.frameModel})</span>
            <span>{invoice.framePrice.toFixed(2)} KWD</span>
          </div>
        )}
      </div>

      <div className="text-sm mb-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{(invoice.total + invoice.discount).toFixed(2)} KWD</span>
        </div>
        {invoice.discount > 0 && (
          <div className="flex justify-between text-destructive">
            <span>Discount:</span>
            <span>-{invoice.discount.toFixed(2)} KWD</span>
          </div>
        )}
        <div className="flex justify-between font-bold mt-1 pt-1 border-t">
          <span>Total:</span>
          <span>{invoice.total.toFixed(2)} KWD</span>
        </div>
      </div>

      <div className="space-y-1 text-sm mb-3">
        <div className="text-center mb-1 font-bold text-xs uppercase tracking-wide">
          *** PAYMENTS ***
        </div>
        
        {invoice.payments?.map((payment, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>
              {format(new Date(payment.date), 'dd/MM/yyyy')} ({payment.method})
              {payment.authNumber && ` - Auth: ${payment.authNumber}`}
            </span>
            <span>{payment.amount.toFixed(2)} KWD</span>
          </div>
        )) || (
          <div className="flex justify-between text-sm">
            <span>{format(new Date(invoice.createdAt), 'dd/MM/yyyy')} ({invoice.paymentMethod})</span>
            <span>{invoice.deposit.toFixed(2)} KWD</span>
          </div>
        )}
        
        {invoice.remaining > 0 && (
          <div className="flex justify-between font-bold mt-1 pt-1 border-t">
            <span>Balance Due:</span>
            <span>{invoice.remaining.toFixed(2)} KWD</span>
          </div>
        )}
      </div>

      {invoice.isPaid && (
        <div className="flex items-center justify-center gap-2 my-3 text-primary font-bold p-1 border border-primary rounded">
          <CheckCircle2 className="w-4 h-4" />
          <span>PAID IN FULL</span>
        </div>
      )}

      <div className="text-center mt-3 pt-3 border-t">
        <p className="font-semibold text-sm">Thank you for your business!</p>
        <p className="text-xs mt-1 text-muted-foreground">Keep this receipt for your records</p>
        <div className="mt-3 text-[10px] flex gap-1 justify-center">
          <span>{'•'.repeat(15)}</span>
        </div>
      </div>
    </div>
  );
};
