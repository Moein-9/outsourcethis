
import React from "react";
import { format } from "date-fns";
import { Invoice } from "@/store/invoiceStore";
import { CheckCircle2 } from "lucide-react";

interface ReceiptInvoiceProps {
  invoice: Invoice;
  isPrintable?: boolean;
}

export const ReceiptInvoice: React.FC<ReceiptInvoiceProps> = ({ invoice, isPrintable = false }) => {
  const containerClass = isPrintable ? "w-[80mm] mx-auto bg-white p-4 text-[12px]" : "w-full bg-white p-4";
  
  return (
    <div className={containerClass} style={{ fontFamily: 'Courier New, monospace' }}>
      <div className="text-center border-b pb-2 mb-2">
        <h2 className="font-bold text-xl mb-1">OPTICS STORE</h2>
        <p className="text-sm text-muted-foreground">Kuwait City, Block 5</p>
        <p className="text-sm text-muted-foreground">Tel: +965 2345-6789</p>
      </div>

      <div className="mb-4 text-sm">
        <p>Invoice #: {invoice.invoiceId}</p>
        <p>Date: {format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}</p>
        <p>Customer: {invoice.patientName}</p>
        {invoice.patientPhone && <p>Phone: {invoice.patientPhone}</p>}
      </div>

      <div className="border-t border-b py-2 mb-2">
        {invoice.lensType && (
          <div className="flex justify-between mb-1">
            <span>Lenses ({invoice.lensType})</span>
            <span>{invoice.lensPrice.toFixed(2)} KWD</span>
          </div>
        )}
        
        {invoice.coating && (
          <div className="flex justify-between mb-1">
            <span>Coating ({invoice.coating})</span>
            <span>{invoice.coatingPrice.toFixed(2)} KWD</span>
          </div>
        )}
        
        {invoice.frameBrand && (
          <div className="flex justify-between mb-1">
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
        <div className="flex justify-between font-bold mt-1">
          <span>Total:</span>
          <span>{invoice.total.toFixed(2)} KWD</span>
        </div>
      </div>

      <div className="space-y-1 text-sm">
        {invoice.payments?.map((payment, index) => (
          <div key={index} className="flex justify-between">
            <span>
              {format(new Date(payment.date), 'dd/MM/yyyy')} ({payment.method})
              {payment.authNumber && ` - Auth: ${payment.authNumber}`}
            </span>
            <span>{payment.amount.toFixed(2)} KWD</span>
          </div>
        ))}
      </div>

      {invoice.isPaid && (
        <div className="flex items-center justify-center gap-2 mt-4 text-primary font-bold">
          <CheckCircle2 className="w-5 h-5" />
          <span>PAID IN FULL</span>
        </div>
      )}

      <div className="text-center mt-4 text-sm">
        <p>Thank you for your business!</p>
        <p className="text-xs mt-1">Keep this receipt for your records</p>
      </div>
    </div>
  );
};
