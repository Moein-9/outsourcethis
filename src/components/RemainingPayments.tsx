
import React, { useState } from 'react';
import { useInvoiceStore } from "@/store/invoiceStore";
import { useToast } from "@/hooks/use-toast";
import { useLanguageStore } from "@/store/languageStore";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReceiptInvoice } from "@/components/ReceiptInvoice";
import { PrintReportButton } from "@/components/reports/PrintReportButton";
import { Calendar } from "lucide-react";
import { Calendar as CalendarDate } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface PaymentEntry {
  amount: number | null;
  method: string;
  authNumber?: string;
  date?: Date;
}

interface RemainingPaymentsProps {
  invoiceId: string;
}

export const RemainingPayments: React.FC<RemainingPaymentsProps> = ({ invoiceId }) => {
  const { toast } = useToast();
  const { language } = useLanguageStore();
  const { getInvoiceById, addPartialPayment, markAsPaid } = useInvoiceStore();
  const [formData, setFormData] = useState<{ [invoiceId: string]: PaymentEntry[] }>({});
  const [invoiceForPrint, setInvoiceForPrint] = useState<string | null>(null);
  const [invoiceDataForPrint, setInvoiceDataForPrint] = useState<any>(null);
  
  const invoice = getInvoiceById(invoiceId);
  
  if (!invoice) {
    return <div>{language === 'ar' ? "لم يتم العثور على الفاتورة" : "Invoice not found"}</div>;
  }
  
  const formatDate = (date: Date | string) => {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "PPP", { locale: language === "ar" ? ar : enUS });
  };
  
  const handleAddPayment = () => {
    setFormData(prev => ({
      ...prev,
      [invoiceId]: [...(prev[invoiceId] || []), { amount: null, method: 'cash' }]
    }));
  };
  
  const handleInputChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const invoiceEntries = prev[invoiceId] || [];
      const updatedEntries = [...invoiceEntries];
      updatedEntries[index] = { ...updatedEntries[index], [field]: value };
      return { ...prev, [invoiceId]: updatedEntries };
    });
  };
  
  const handleRemovePayment = (index: number) => {
    setFormData(prev => {
      const invoiceEntries = prev[invoiceId] || [];
      const updatedEntries = invoiceEntries.filter((_, i) => i !== index);
      return { ...prev, [invoiceId]: updatedEntries };
    });
  };

  const handleSubmitPayment = (invoiceId: string) => {
    const invoice = getInvoiceById(invoiceId);
    if (!invoice) {
      toast({
        variant: "destructive",
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "لم يتم العثور على الفاتورة" : "Invoice not found"
      });
      return;
    }
    
    const paymentEntries = formData[invoiceId] || [];
    const totalPayment = paymentEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
    
    if (totalPayment <= 0) {
      toast({
        variant: "destructive",
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يرجى إدخال مبلغ الدفع" : "Please enter a payment amount"
      });
      return;
    }
    
    const willCompletePay = (totalPayment === invoice.remaining);
    
    if (willCompletePay) {
      // Create a complete copy of the invoice with updated payment status
      const invoiceCopy = { 
        ...invoice,
        isPaid: true,
        remaining: 0,
        deposit: invoice.total, // Update deposit to match total
        payments: [
          ...(invoice.payments || []),
          // Add the new payment that will complete the invoice
          ...paymentEntries.filter(entry => entry.amount > 0).map(entry => ({
            amount: entry.amount || 0,
            method: entry.method || 'cash',
            date: new Date().toISOString(),
            authNumber: entry.authNumber
          }))
        ]
      };
      setInvoiceDataForPrint(invoiceCopy);
    }
    
    for (const entry of paymentEntries) {
      if (entry.amount > 0) {
        addPartialPayment(invoiceId, {
          amount: entry.amount,
          method: entry.method || 'cash',
          authNumber: entry.authNumber
        });
      }
    }
    
    // Clear the form data for this invoice
    setFormData(prev => ({
      ...prev,
      [invoiceId]: []
    }));
    
    toast({
      title: language === 'ar' ? "نجاح" : "Success",
      description: language === 'ar' ? "تم تسجيل الدفع بنجاح" : "Payment recorded successfully"
    });
    
    if (willCompletePay) {
      setInvoiceForPrint(invoiceId);
    }
  };
  
  const handlePrintReceipt = () => {
    if (invoiceForPrint) {
      setInvoiceForPrint(null); // Reset the invoiceForPrint state
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{language === 'ar' ? "تسجيل دفعة" : "Record Payment"}</h2>
      
      {/* Display existing payments */}
      {invoice.payments && invoice.payments.length > 0 && (
        <div className="border rounded p-4">
          <h3 className="text-md font-semibold mb-2">{language === 'ar' ? "المدفوعات السابقة" : "Previous Payments"}</h3>
          <ul className="list-disc list-inside">
            {invoice.payments.map((payment, index) => (
              <li key={index} className="mb-1">
                {language === 'ar' ? "المبلغ" : "Amount"}: {payment.amount}, {language === 'ar' ? "الطريقة" : "Method"}: {payment.method}, {language === 'ar' ? "التاريخ" : "Date"}: {formatDate(payment.date)}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Payment recording form */}
      <div>
        {formData[invoiceId] && formData[invoiceId].map((entry, index) => (
          <div key={index} className="flex items-center space-x-4 mb-2">
            <div className="grid gap-2">
              <Label htmlFor={`amount-${index}`}>{language === 'ar' ? "المبلغ" : "Amount"}</Label>
              <Input
                type="number"
                id={`amount-${index}`}
                placeholder={language === 'ar' ? "أدخل المبلغ" : "Enter amount"}
                value={entry.amount !== null ? entry.amount.toString() : ''}
                onChange={(e) => handleInputChange(index, 'amount', parseFloat(e.target.value))}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor={`method-${index}`}>{language === 'ar' ? "الطريقة" : "Method"}</Label>
              <Select onValueChange={(value) => handleInputChange(index, 'method', value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={language === 'ar' ? "اختر طريقة الدفع" : "Select payment method"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">{language === 'ar' ? "نقدي" : "Cash"}</SelectItem>
                  <SelectItem value="card">{language === 'ar' ? "بطاقة" : "Card"}</SelectItem>
                  <SelectItem value="online">{language === 'ar' ? "عبر الإنترنت" : "Online"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {entry.method === 'card' && (
              <div className="grid gap-2">
                <Label htmlFor={`authNumber-${index}`}>{language === 'ar' ? "رقم التفويض" : "Auth Number"}</Label>
                <Input
                  type="text"
                  id={`authNumber-${index}`}
                  placeholder={language === 'ar' ? "أدخل رقم التفويض" : "Enter auth number"}
                  value={entry.authNumber || ''}
                  onChange={(e) => handleInputChange(index, 'authNumber', e.target.value)}
                />
              </div>
            )}
            
            <Button type="button" variant="destructive" size="sm" onClick={() => handleRemovePayment(index)}>
              {language === 'ar' ? "إزالة" : "Remove"}
            </Button>
          </div>
        ))}
        
        <Button type="button" variant="secondary" size="sm" onClick={handleAddPayment}>
          {language === 'ar' ? "إضافة دفعة" : "Add Payment"}
        </Button>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={() => handleSubmitPayment(invoiceId)}>
          {language === 'ar' ? "تسجيل الدفع" : "Submit Payment"}
        </Button>
        
        {/* Print receipt button */}
        {invoiceForPrint === invoiceId && (
          <PrintReportButton 
            onPrint={() => handlePrintReceipt()}
            label={language === 'ar' ? "طباعة الإيصال" : "Print Receipt"}
          />
        )}
      </div>
      
      {/* Render ReceiptInvoice when invoiceForPrint is set */}
      {invoiceForPrint === invoiceId && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-50 overflow-auto">
          <div className="max-w-md mx-auto py-8">
            <ReceiptInvoice invoice={invoiceDataForPrint || invoice} isPrintable={true} />
          </div>
        </div>
      )}
    </div>
  );
};
