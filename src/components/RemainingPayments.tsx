
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
      <h2 className="text-2xl font-bold mb-4">قائمة الفواتير المتبقية</h2>
      
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="p-3 border">رقم الفاتورة</th>
              <th className="p-3 border">اسم العميل</th>
              <th className="p-3 border">رقم الهاتف</th>
              <th className="p-3 border">المبلغ الكلي (KWD)</th>
              <th className="p-3 border">المدفوع (KWD)</th>
              <th className="p-3 border text-destructive font-bold">المتبقي (KWD)</th>
              <th className="p-3 border">التاريخ</th>
              <th className="p-3 border">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {unpaidInvoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-3 text-center">لا توجد دفعات متبقية</td>
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
                  <td className="p-3 border">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 border">
                    <Button 
                      size="sm" 
                      onClick={() => handlePayFull(invoice.invoiceId)}
                    >
                      دفع بالكامل
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
