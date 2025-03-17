
import React from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export const RemainingPayments: React.FC = () => {
  const { invoices, markAsPaid } = useInvoiceStore();
  
  // Get unpaid invoices
  const unpaidInvoices = invoices.filter(invoice => !invoice.isPaid);
  
  // Handle pay full action
  const handlePayFull = (invoiceId: string) => {
    markAsPaid(invoiceId);
    toast({
      description: "Payment recorded successfully.",
    });
  };
  
  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold mb-4">Remaining Payments</h2>
      
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="p-3 border">Invoice ID</th>
              <th className="p-3 border">Customer Name</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Total (KWD)</th>
              <th className="p-3 border">Paid (KWD)</th>
              <th className="p-3 border text-destructive font-bold">Remaining (KWD)</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {unpaidInvoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-3 text-center">No remaining payments</td>
              </tr>
            ) : (
              unpaidInvoices.map((invoice) => (
                <tr key={invoice.invoiceId}>
                  <td className="p-3 border">{invoice.invoiceId}</td>
                  <td className="p-3 border">{invoice.patientName}</td>
                  <td className="p-3 border">{invoice.patientPhone}</td>
                  <td className="p-3 border">{invoice.total.toFixed(2)}</td>
                  <td className="p-3 border">{invoice.deposit.toFixed(2)}</td>
                  <td className="p-3 border text-destructive font-bold">{invoice.remaining.toFixed(2)}</td>
                  <td className="p-3 border">{new Date(invoice.createdAt).toLocaleDateString("en-US")}</td>
                  <td className="p-3 border">
                    <Button 
                      size="sm" 
                      onClick={() => handlePayFull(invoice.invoiceId)}
                    >
                      Pay in Full
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
