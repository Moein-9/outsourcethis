import React, { useState, useEffect } from "react";
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
  FileText,
  UserCircle,
  History
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
import { useNavigate } from "react-router-dom";
import { ReceiptInvoice } from "./ReceiptInvoice";

export const RemainingPayments: React.FC = () => {
  const { invoices, getInvoiceById, addPartialPayment, markAsPaid } = useInvoiceStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [invoiceForPrint, setInvoiceForPrint] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Payment form state
  const [paymentEntries, setPaymentEntries] = useState<{method: string; amount: number; authNumber?: string}[]>([
    { method: "نقداً", amount: 0 }
  ]);
  
  // Calculate remaining amount after current payment entries
  const [remainingAfterPayment, setRemainingAfterPayment] = useState<number | null>(null);
  
  // Update remaining amount when payment entries change
  useEffect(() => {
    if (selectedInvoice) {
      const invoice = getInvoiceById(selectedInvoice);
      if (invoice) {
        const totalPayment = calculateTotalPayment();
        const newRemaining = Math.max(0, invoice.remaining - totalPayment);
        setRemainingAfterPayment(newRemaining);
      }
    }
  }, [paymentEntries, selectedInvoice, getInvoiceById]);
  
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
  
  // Navigate to patient search with patient details
  const goToPatientProfile = (patientId?: string, patientName?: string, patientPhone?: string) => {
    if (patientId) {
      navigate('/', { 
        state: { 
          section: "patientSearch", 
          patientId: patientId,
          searchMode: 'id'
        } 
      });
    } else if (patientName || patientPhone) {
      navigate('/', { 
        state: { 
          section: "patientSearch", 
          searchTerm: patientName || patientPhone,
          searchMode: 'name'
        } 
      });
    }
  };
  
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
    
    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <title>فاتورة ${invoice.invoiceId}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @media print {
            body { 
              width: 80mm;
              margin: 0;
              padding: 0;
            }
          }
          body {
            font-family: 'Arial', sans-serif;
            direction: rtl;
            padding: 10px;
            max-width: 80mm;
            margin: 0 auto;
          }
          .receipt-container {
            border: 1px solid #ddd;
            padding: 10px;
          }
          .hidden-print {
            display: block;
          }
          @media print {
            .hidden-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div id="receipt-container"></div>
        <button class="hidden-print" onclick="window.print()">طباعة</button>
        <script>
          // This script will render the receipt
          document.getElementById('receipt-container').innerHTML = \`
            <div id="receipt-content">
              ${document.getElementById('print-receipt-' + invoice.invoiceId)?.innerHTML || ''}
            </div>
          \`;
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
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
                    className="bg-amber-100 text-amber-800 border-amber-300 text-xl font-bold px-4 py-1.5"
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
                    <span>{new Date(invoice.createdAt).toLocaleDateString('ar-EG')}</span>
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
                          <span>{new Date(payment.date).toLocaleDateString('ar-EG')}</span>
                          <span className="font-medium">{payment.amount.toFixed(2)} KWD ({payment.method})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Dialog open={showReceipt === invoice.invoiceId} onOpenChange={(open) => !open && setShowReceipt(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex-1 text-xs border-blue-200 hover:bg-blue-50 text-blue-700"
                        onClick={() => setShowReceipt(invoice.invoiceId)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        عرض الفاتورة
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-sm">
                      <DialogHeader>
                        <DialogTitle>فاتورة {invoice.invoiceId}</DialogTitle>
                      </DialogHeader>
                      
                      <div className="max-h-[70vh] overflow-y-auto py-4" id={`print-receipt-${invoice.invoiceId}`}>
                        <ReceiptInvoice invoice={invoice} isPrintable={false} />
                      </div>
                      
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowReceipt(null)}
                        >
                          إغلاق
                        </Button>
                        <Button 
                          onClick={() => {
                            setShowReceipt(null);
                            handlePrintReceipt(invoice.invoiceId);
                          }}
                          className="gap-2"
                        >
                          <Printer className="h-4 w-4" />
                          طباعة
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    className="flex-1 text-xs border-purple-200 hover:bg-purple-50 text-purple-700"
                    onClick={() => goToPatientProfile(invoice.patientId, invoice.patientName, invoice.patientPhone)}
                  >
                    <UserCircle className="h-4 w-4 mr-1" />
                    ملف العميل
                  </Button>
                  
                  <Dialog open={selectedInvoice === invoice.invoiceId} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        className="flex-1 text-xs bg-amber-500 hover:bg-amber-600"
                        onClick={() => {
                          setSelectedInvoice(invoice.invoiceId);
                          // Reset payment entries with calculated remaining amount
                          setPaymentEntries([{ method: "نقداً", amount: invoice.remaining }]);
                          setRemainingAfterPayment(0);
                        }}
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
                            <span className="font-medium text-blue-600">{invoice.deposit.toFixed(2)} KWD</span>
                          </div>
                          <div className="flex justify-between font-bold border-t pt-2 mt-2">
                            <span>المبلغ المتبقي:</span>
                            <span className="text-amber-600 text-lg">{invoice.remaining.toFixed(2)} KWD</span>
                          </div>
                          
                          {remainingAfterPayment !== null && (
                            <div className="flex justify-between font-bold mt-3 bg-blue-50 p-2 rounded-md">
                              <span className="text-blue-700">المتبقي بعد الدفع:</span>
                              <span className="text-blue-700 text-lg">{remainingAfterPayment.toFixed(2)} KWD</span>
                            </div>
                          )}
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
