
import React, { useState } from "react";
import { useInvoiceStore, Payment } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  Receipt, 
  Wallet, 
  CreditCard, 
  Printer, 
  CheckCircle2,
  User,
  Phone,
  Calendar,
  Eye,
  Frame,
  Droplets,
  ArrowRight,
  Tag,
  Search,
  Filter,
  Plus,
  Trash2,
  Eye as EyeIcon,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const RemainingPayments: React.FC = () => {
  const { invoices, getInvoiceById, addPartialPayment } = useInvoiceStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [invoiceForPrint, setInvoiceForPrint] = useState<string | null>(null);
  
  // Payment form state
  const [paymentEntries, setPaymentEntries] = useState<{method: string; amount: number; authNumber?: string}[]>([
    { method: "نقداً", amount: 0 }
  ]);
  
  // Get unpaid invoices
  let unpaidInvoices = invoices.filter(invoice => !invoice.isPaid);
  
  // Apply search filter
  if (searchTerm) {
    unpaidInvoices = unpaidInvoices.filter(inv => 
      inv.patientName.includes(searchTerm) || 
      inv.patientPhone.includes(searchTerm) ||
      inv.invoiceId.includes(searchTerm)
    );
  }
  
  // Apply sorting
  unpaidInvoices = [...unpaidInvoices].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });
  
  // Add payment entry
  const addPaymentEntry = () => {
    setPaymentEntries([...paymentEntries, { method: "نقداً", amount: 0 }]);
  };
  
  // Remove payment entry
  const removePaymentEntry = (index: number) => {
    if (paymentEntries.length > 1) {
      const newEntries = [...paymentEntries];
      newEntries.splice(index, 1);
      setPaymentEntries(newEntries);
    }
  };
  
  // Update payment entry
  const updatePaymentEntry = (index: number, field: string, value: string | number) => {
    const newEntries = [...paymentEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setPaymentEntries(newEntries);
  };
  
  // Calculate total payment amount
  const calculateTotalPayment = () => {
    return paymentEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  };
  
  // Handle payment submission
  const handleSubmitPayment = (invoiceId: string) => {
    const invoice = getInvoiceById(invoiceId);
    if (!invoice) return;
    
    // Validate payment entries
    const totalPayment = calculateTotalPayment();
    if (totalPayment <= 0) {
      toast.error("يرجى إدخال مبلغ الدفع");
      return;
    }
    
    if (totalPayment > invoice.remaining) {
      toast.error("المبلغ المدخل أكبر من المبلغ المتبقي");
      return;
    }
    
    // Process each payment entry
    for (const entry of paymentEntries) {
      if (entry.amount > 0) {
        addPartialPayment(invoiceId, {
          amount: entry.amount,
          method: entry.method,
          authNumber: entry.authNumber
        });
      }
    }
    
    toast.success("تم تسجيل الدفع بنجاح");
    
    // Check if payment is complete
    const updatedInvoice = getInvoiceById(invoiceId);
    if (updatedInvoice?.isPaid) {
      // Set the invoice for printing
      setInvoiceForPrint(invoiceId);
    }
    
    // Reset form and close dialog
    setPaymentEntries([{ method: "نقداً", amount: 0 }]);
    setSelectedInvoice(null);
  };
  
  // Handle print receipt
  const handlePrintReceipt = (invoiceId: string) => {
    const invoice = getInvoiceById(invoiceId);
    if (!invoice) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const pageTitle = `فاتورة ${invoice.invoiceId}`;
    
    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <title>${pageTitle}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            padding: 30px;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            direction: rtl;
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #8B5CF6;
          }
          .company-details {
            text-align: right;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #8B5CF6;
            margin: 0;
          }
          .company-info {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
          }
          .invoice-details {
            text-align: left;
          }
          .invoice-id {
            font-size: 18px;
            font-weight: bold;
            color: #8B5CF6;
            margin: 0;
          }
          .invoice-date {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
          }
          .customer-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #8B5CF6;
            display: flex;
            align-items: center;
          }
          .section-title svg {
            margin-left: 6px;
          }
          .customer-name {
            font-size: 18px;
            font-weight: bold;
            margin: 0;
          }
          .customer-contact {
            font-size: 14px;
            color: #555;
            margin-top: 5px;
          }
          .items-section {
            margin-bottom: 30px;
          }
          .item-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
          }
          .item-card {
            padding: 15px;
            border-radius: 8px;
            background-color: #fff;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
          .item-title {
            font-weight: bold;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 5px;
          }
          .item-title svg {
            color: #8B5CF6;
          }
          .item-detail {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 14px;
          }
          .item-value {
            font-weight: bold;
          }
          .payment-details {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .payment-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #ddd;
          }
          .payment-row:last-child {
            border-bottom: none;
          }
          .payment-label {
            font-weight: bold;
          }
          .total-row {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid #8B5CF6;
            font-size: 18px;
            font-weight: bold;
          }
          .discount {
            color: #10B981;
          }
          .thank-you {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
          .thank-message {
            font-size: 18px;
            color: #8B5CF6;
            margin-bottom: 5px;
          }
          .come-again {
            font-size: 14px;
            color: #666;
          }
          .paid-stamp {
            position: absolute;
            top: 200px;
            right: 200px;
            transform: rotate(20deg);
            font-size: 40px;
            color: rgba(16, 185, 129, 0.4);
            border: 10px solid rgba(16, 185, 129, 0.4);
            border-radius: 10px;
            padding: 10px 20px;
            text-transform: uppercase;
            font-weight: bold;
            pointer-events: none;
          }
          .payments-history {
            margin-top: 20px;
            padding: 15px;
            background-color: #f0f9ff;
            border-radius: 8px;
          }
          .payment-history-title {
            font-weight: bold;
            color: #0369a1;
            margin-bottom: 8px;
          }
          .payment-history-item {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px dashed #ccc;
            font-size: 14px;
          }
          .payment-history-item:last-child {
            border-bottom: none;
          }
          .payment-date {
            color: #666;
            font-size: 12px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 4px;
          }
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div class="company-details">
            <h1 class="company-name">النظارات الطبية</h1>
            <p class="company-info">
              العنوان: شارع الاستقلال، الكويت<br>
              هاتف: 1234 567 965+
            </p>
          </div>
          <div class="invoice-details">
            <h2 class="invoice-id">فاتورة #${invoice.invoiceId}</h2>
            <p class="invoice-date">
              التاريخ: ${new Date(invoice.createdAt).toLocaleDateString('en-US')}
            </p>
          </div>
        </div>
        
        <div class="customer-details">
          <h3 class="section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            معلومات العميل
          </h3>
          <p class="customer-name">${invoice.patientName}</p>
          <p class="customer-contact">
            هاتف: ${invoice.patientPhone}<br>
            ${invoice.patientId ? `رقم الملف: ${invoice.patientId}` : ''}
          </p>
        </div>
        
        <div class="items-section">
          <h3 class="section-title">تفاصيل المنتجات</h3>
          <div class="item-grid">
            <div class="item-card">
              <div class="item-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                العدسات
              </div>
              <div class="item-detail">
                <span>نوع العدسة:</span>
                <span class="item-value">${invoice.lensType}</span>
              </div>
              <div class="item-detail">
                <span>السعر:</span>
                <span class="item-value">${invoice.lensPrice.toFixed(2)} KWD</span>
              </div>
            </div>
            
            <div class="item-card">
              <div class="item-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 8a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1"/>
                  <path d="M2 15a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4v-1"/>
                  <path d="M18 16h.01"/>
                  <path d="M6 16h.01"/>
                  <path d="M12 16v.01"/>
                  <path d="M12 12v.01"/>
                  <path d="M12 8v.01"/>
                  <path d="M18 12v.01"/>
                  <path d="M18 8v.01"/>
                  <path d="M6 12v.01"/>
                  <path d="M6 8v.01"/>
                </svg>
                الإطار
              </div>
              <div class="item-detail">
                <span>الماركة:</span>
                <span class="item-value">${invoice.frameBrand}</span>
              </div>
              <div class="item-detail">
                <span>الموديل:</span>
                <span class="item-value">${invoice.frameModel}</span>
              </div>
              <div class="item-detail">
                <span>اللون:</span>
                <span class="item-value">${invoice.frameColor}</span>
              </div>
              <div class="item-detail">
                <span>السعر:</span>
                <span class="item-value">${invoice.framePrice.toFixed(2)} KWD</span>
              </div>
            </div>
            
            <div class="item-card">
              <div class="item-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 12A10 10 0 0 0 12 2v10z"/>
                  <path d="M2 12a10 10 0 0 0 10 10v-10z"/>
                  <path d="M2 12a10 10 0 0 1 10-10v10z"/>
                  <path d="M12 2a10 10 0 0 1 10 10h-10z"/>
                </svg>
                الطلاء
              </div>
              <div class="item-detail">
                <span>نوع الطلاء:</span>
                <span class="item-value">${invoice.coating}</span>
              </div>
              <div class="item-detail">
                <span>السعر:</span>
                <span class="item-value">${invoice.coatingPrice.toFixed(2)} KWD</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="payment-details">
          <h3 class="section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2"/>
              <line x1="2" x2="22" y1="10" y2="10"/>
            </svg>
            تفاصيل الدفع
          </h3>
          <div class="payment-row">
            <span class="payment-label">إجمالي العدسات:</span>
            <span>${invoice.lensPrice.toFixed(2)} KWD</span>
          </div>
          <div class="payment-row">
            <span class="payment-label">إجمالي الإطار:</span>
            <span>${invoice.framePrice.toFixed(2)} KWD</span>
          </div>
          <div class="payment-row">
            <span class="payment-label">إجمالي الطلاء:</span>
            <span>${invoice.coatingPrice.toFixed(2)} KWD</span>
          </div>
          ${invoice.discount > 0 ? `
          <div class="payment-row discount">
            <span class="payment-label">الخصم:</span>
            <span>- ${invoice.discount.toFixed(2)} KWD</span>
          </div>
          ` : ''}
          <div class="payment-row total-row">
            <span>المجموع النهائي:</span>
            <span>${invoice.total.toFixed(2)} KWD</span>
          </div>
          
          ${invoice.payments && invoice.payments.length > 0 ? `
          <div class="payments-history">
            <div class="payment-history-title">سجل الدفعات:</div>
            ${invoice.payments.map(payment => `
              <div class="payment-history-item">
                <div>
                  <span>${payment.amount.toFixed(2)} KWD</span>
                  <span> (${payment.method})</span>
                  ${payment.authNumber ? `<span> - رقم التفويض: ${payment.authNumber}</span>` : ''}
                </div>
                <div class="payment-date">${new Date(payment.date).toLocaleDateString('en-US')}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
        
        <div class="thank-you">
          <p class="thank-message">شكراً لثقتكم</p>
          <p class="come-again">نتطلع لزيارتكم مرة أخرى</p>
        </div>
        
        ${invoice.isPaid ? `<div class="paid-stamp">مدفوع</div>` : ''}
        
        <div class="footer">
          <p>النظارات الطبية - جميع الحقوق محفوظة © ${new Date().getFullYear()}</p>
        </div>
        
        <div class="no-print">
          <button onclick="window.print()" style="padding: 10px 20px; margin: 20px auto; display: block; background: #8B5CF6; color: white; border: none; border-radius: 5px; cursor: pointer;">
            طباعة الفاتورة
          </button>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    printWindow.onload = function() {
      printWindow.focus();
    };
  };
  
  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">المتبقي للدفع</h2>
          <p className="text-muted-foreground">إدارة الفواتير غير المكتملة وتسجيل الدفعات المتبقية</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث عن عميل أو رقم فاتورة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          
          <Select 
            value={sortOrder} 
            onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="ترتيب حسب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">الأحدث أولاً</SelectItem>
              <SelectItem value="asc">الأقدم أولاً</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {unpaidInvoices.length === 0 ? (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-12 w-12 text-muted mb-4" />
            <h3 className="text-xl font-medium mb-2">جميع الفواتير مدفوعة بالكامل</h3>
            <p className="text-muted-foreground text-center max-w-md">
              لا توجد فواتير تحتاج إلى دفعات متبقية. جميع المعاملات مكتملة.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unpaidInvoices.map((invoice) => (
            <Card key={invoice.invoiceId} className="overflow-hidden border border-amber-200 hover:border-amber-300 transition-all duration-200">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold">{invoice.patientName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{invoice.invoiceId}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="bg-amber-100 text-amber-800 border-amber-300 text-lg font-bold px-3 py-1"
                  >
                    متبقي {invoice.remaining.toFixed(2)} KWD
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{invoice.patientPhone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(invoice.createdAt).toLocaleDateString('en-US')}</span>
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="w-full border rounded-md">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="px-3 text-sm font-medium">
                      تفاصيل النظارة
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 text-sm">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <EyeIcon className="h-3.5 w-3.5 text-blue-500" />
                          <span>نوع العدسة:</span>
                          <span className="font-medium">{invoice.lensType}</span>
                        </div>
                        
                        {invoice.frameBrand && (
                          <div className="flex items-center gap-1.5">
                            <Frame className="h-3.5 w-3.5 text-gray-500" />
                            <span>الإطار:</span>
                            <span className="font-medium">{invoice.frameBrand} / {invoice.frameModel}</span>
                          </div>
                        )}
                        
                        {invoice.coating && (
                          <div className="flex items-center gap-1.5">
                            <Droplets className="h-3.5 w-3.5 text-cyan-500" />
                            <span>الطلاء:</span>
                            <span className="font-medium">{invoice.coating}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <Tag className="h-3.5 w-3.5" />
                          <span>السعر الإجمالي:</span>
                          <span className="font-medium">{invoice.total.toFixed(2)} KWD</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="border-t border-dashed pt-3">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">إجمالي الفاتورة</p>
                      <p className="font-bold text-lg">{invoice.total.toFixed(2)} KWD</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">المدفوع</p>
                      <p className="text-blue-600 font-medium">{invoice.deposit.toFixed(2)} KWD</p>
                    </div>
                  </div>
                  
                  {invoice.payments && invoice.payments.length > 0 && (
                    <div className="mt-2 bg-slate-50 p-2 rounded-md text-xs">
                      <p className="font-medium mb-1">سجل الدفعات:</p>
                      {invoice.payments.map((payment, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span>{new Date(payment.date).toLocaleDateString('en-US')}</span>
                          <span className="font-medium">{payment.amount.toFixed(2)} KWD ({payment.method})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 text-xs border-blue-200 hover:bg-blue-50 text-blue-700"
                    onClick={() => handlePrintReceipt(invoice.invoiceId)}
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    طباعة الفاتورة
                  </Button>
                  
                  <Dialog open={selectedInvoice === invoice.invoiceId} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        className="flex-1 text-xs bg-amber-500 hover:bg-amber-600"
                        onClick={() => setSelectedInvoice(invoice.invoiceId)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        تسديد الدفعة
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>تسجيل دفعة جديدة</DialogTitle>
                        <DialogDescription>
                          تسجيل دفعة للفاتورة {invoice.invoiceId}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="py-4 space-y-4">
                        <div className="bg-muted p-4 rounded-md space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">المبلغ الإجمالي:</span>
                            <span className="font-medium">{invoice.total.toFixed(2)} KWD</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">المدفوع سابقاً:</span>
                            <span className="font-medium">{invoice.deposit.toFixed(2)} KWD</span>
                          </div>
                          <div className="flex justify-between font-bold border-t pt-2 mt-2">
                            <span>المبلغ المتبقي:</span>
                            <span className="text-amber-600 text-lg">{invoice.remaining.toFixed(2)} KWD</span>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">طرق الدفع</h4>
                            <Button 
                              type="button" 
                              size="sm" 
                              variant="outline" 
                              onClick={addPaymentEntry}
                              className="h-8"
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" /> إضافة طريقة دفع
                            </Button>
                          </div>
                          
                          {paymentEntries.map((entry, index) => (
                            <div key={index} className="space-y-3 bg-slate-50 p-3 rounded-md">
                              <div className="flex justify-between items-center">
                                <Label className="font-medium">طريقة الدفع #{index + 1}</Label>
                                {paymentEntries.length > 1 && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 w-7 p-0 text-red-500 hover:text-red-600" 
                                    onClick={() => removePaymentEntry(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label htmlFor={`payment-method-${index}`}>طريقة الدفع</Label>
                                  <Select 
                                    value={entry.method} 
                                    onValueChange={(value) => updatePaymentEntry(index, 'method', value)}
                                  >
                                    <SelectTrigger id={`payment-method-${index}`}>
                                      <SelectValue placeholder="اختر طريقة الدفع" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="نقداً">نقداً</SelectItem>
                                      <SelectItem value="كي نت">كي نت</SelectItem>
                                      <SelectItem value="Visa">Visa</SelectItem>
                                      <SelectItem value="MasterCard">MasterCard</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-1.5">
                                  <Label htmlFor={`payment-amount-${index}`}>المبلغ (KWD)</Label>
                                  <Input
                                    id={`payment-amount-${index}`}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max={invoice.remaining}
                                    value={entry.amount || ""}
                                    onChange={(e) => updatePaymentEntry(index, 'amount', parseFloat(e.target.value) || 0)}
                                  />
                                </div>
                              </div>
                              
                              {(entry.method === "كي نت" || entry.method === "Visa" || entry.method === "MasterCard") && (
                                <div className="space-y-1.5">
                                  <Label htmlFor={`auth-number-${index}`}>رقم التفويض</Label>
                                  <Input
                                    id={`auth-number-${index}`}
                                    placeholder="رقم التفويض"
                                    value={entry.authNumber || ""}
                                    onChange={(e) => updatePaymentEntry(index, 'authNumber', e.target.value)}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                          
                          <div className="flex justify-between font-medium p-2 border-t">
                            <span>إجمالي المدفوع:</span>
                            <span>{calculateTotalPayment().toFixed(2)} KWD</span>
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
                          إلغاء
                        </Button>
                        <Button 
                          onClick={() => handleSubmitPayment(invoice.invoiceId)}
                          className="bg-amber-500 hover:bg-amber-600"
                        >
                          تأكيد الدفع
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* After payment success - Print invoice dialog */}
      {invoiceForPrint && (
        <Dialog
          open={Boolean(invoiceForPrint)}
          onOpenChange={(open) => !open && setInvoiceForPrint(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-green-600">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2" />
                تم تسجيل الدفع بنجاح
              </DialogTitle>
              <DialogDescription className="text-center">
                تم إكمال الدفع بنجاح! هل ترغب في طباعة الفاتورة النهائية؟
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center space-x-4 space-x-reverse pt-4">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setInvoiceForPrint(null)}
              >
                <span>إغلاق</span>
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 gap-2"
                onClick={() => {
                  const invoiceId = invoiceForPrint;
                  setInvoiceForPrint(null);
                  handlePrintReceipt(invoiceId);
                }}
              >
                <Printer className="h-4 w-4" />
                <span>طباعة الفاتورة</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
