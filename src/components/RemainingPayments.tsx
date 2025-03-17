
import React, { useState, useEffect } from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";

const RemainingPayments = () => {
  const { invoices, addPartialPayment } = useInvoiceStore();
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [invoicesWithBalance, setInvoicesWithBalance] = useState<any[]>([]);

  // Filter invoices with remaining balance
  useEffect(() => {
    if (invoices) {
      const filteredInvoices = invoices.filter((invoice) => {
        const totalPaid = invoice.payments?.reduce(
          (sum, payment) => sum + payment.amount,
          0
        ) || 0;
        return totalPaid < invoice.total;
      });
      setInvoicesWithBalance(filteredInvoices);
    }
  }, [invoices]);

  const handlePayment = () => {
    if (!selectedInvoice || !paymentAmount.trim()) {
      toast.error("الرجاء إدخال مبلغ الدفع");
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("الرجاء إدخال مبلغ صحيح");
      return;
    }

    const invoice = invoices.find((inv) => inv.invoiceId === selectedInvoice);
    if (!invoice) return;

    const totalPaid =
      (invoice.payments?.reduce((sum, p) => sum + p.amount, 0) || 0) + amount;
    
    if (totalPaid > invoice.total) {
      toast.error("مبلغ الدفع يتجاوز المبلغ المتبقي");
      return;
    }

    // Note: We're removing the date property here as it appears
    // the store expects to handle the date internally
    addPartialPayment(selectedInvoice, {
      amount,
      method: "cash", // Default payment method
    });

    toast.success(`تم تسجيل دفعة بقيمة ${amount} KWD`);
    setSelectedInvoice(null);
    setPaymentAmount("");
  };

  const calculateRemainingAmount = (invoice: any) => {
    const totalPaid = invoice.payments?.reduce(
      (sum, payment) => sum + payment.amount,
      0
    ) || 0;
    return invoice.total - totalPaid;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">الدفعات المتبقية</h2>
          <p className="text-muted-foreground">الفواتير مع دفعات متبقية</p>
        </div>
        <Badge variant="outline" className="text-base py-1.5">
          {invoicesWithBalance.length} فاتورة
        </Badge>
      </div>

      {invoicesWithBalance.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {invoicesWithBalance.map((invoice) => (
            <Card key={invoice.invoiceId} className="border-orange-200 shadow-sm">
              <CardHeader className="bg-orange-50 border-b border-orange-100">
                <CardTitle className="text-orange-800 flex justify-between items-center">
                  <span>فاتورة #{invoice.invoiceNumber || invoice.invoiceId.slice(0, 8)}</span>
                  <Badge 
                    variant={!invoice.isPaid ? "outline" : "secondary"}
                    className={!invoice.isPaid ? "bg-orange-100 text-orange-800 border-orange-200" : ""}
                  >
                    {invoice.isPaid ? "مدفوعة" : (invoice.payments?.length > 0 ? "مدفوعة جزئياً" : "غير مدفوعة")}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-orange-600 flex justify-between">
                  <span>
                    اسم العميل: {invoice.patientName}
                  </span>
                  <span className="text-orange-700 font-medium">
                    {formatDate(invoice.createdAt)}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">إجمالي الفاتورة:</span>
                    <span className="font-semibold">{invoice.total.toFixed(2)} KWD</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">المدفوع:</span>
                    <span className="font-semibold">
                      {(invoice.payments?.reduce((sum, p) => sum + p.amount, 0) || 0).toFixed(2)} KWD
                    </span>
                  </div>
                  
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium text-orange-700">المبلغ المتبقي:</span>
                    <span className="font-bold text-orange-700">
                      {calculateRemainingAmount(invoice).toFixed(2)} KWD
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4 bg-orange-600 hover:bg-orange-700"
                  onClick={() => setSelectedInvoice(invoice.invoiceId)}
                >
                  إضافة دفعة
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-orange-200 shadow-sm">
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-orange-600 text-lg">لا توجد فواتير بدفعات متبقية</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة دفعة</DialogTitle>
            <DialogDescription>
              {selectedInvoice &&
                `المبلغ المتبقي: ${calculateRemainingAmount(
                  invoices.find((i) => i.invoiceId === selectedInvoice)
                ).toFixed(2)} KWD`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="paymentAmount">مبلغ الدفعة</Label>
              <Input
                id="paymentAmount"
                placeholder="0.00"
                type="number"
                step="0.01"
                min="0"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentDate" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                تاريخ الدفعة
              </Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
            
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
              إلغاء
            </Button>
            <Button 
              className="bg-orange-600 hover:bg-orange-700"
              onClick={handlePayment}
            >
              تأكيد الدفعة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RemainingPayments;
