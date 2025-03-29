import React, { useState, useEffect } from "react";
import { useInvoiceStore, Payment, Invoice } from "@/store/invoiceStore";
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
import { useLanguageStore } from "@/store/languageStore";
import { CustomPrintService } from "@/utils/CustomPrintService";
import { PrintReportButton } from "./reports/PrintReportButton";

export const RemainingPayments: React.FC = () => {
  const { language, t } = useLanguageStore();
  const { invoices, getInvoiceById, addPartialPayment, markAsPaid } = useInvoiceStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [invoiceForPrint, setInvoiceForPrint] = useState<string | null>(null);
  const [invoiceDataForPrint, setInvoiceDataForPrint] = useState<Invoice | null>(null);
  const [showReceipt, setShowReceipt] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const [paymentEntries, setPaymentEntries] = useState<{method: string; amount: number; authNumber?: string}[]>([
    { method: language === 'ar' ? "نقداً" : "Cash", amount: 0 }
  ]);
  
  useEffect(() => {
    setPaymentEntries(entries => 
      entries.map(entry => ({
        ...entry,
        method: updatePaymentMethodByLanguage(entry.method)
      }))
    );
  }, [language]);
  
  const updatePaymentMethodByLanguage = (method: string): string => {
    if (language === 'ar') {
      if (method === "Cash") return "نقداً";
      if (method === "KNET") return "كي نت";
      return method;
    } else {
      if (method === "نقداً") return "Cash";
      if (method === "كي نت") return "KNET";
      return method;
    }
  };
  
  const [remainingAfterPayment, setRemainingAfterPayment] = useState<number | null>(null);
  
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
  
  let unpaidInvoices = invoices.filter(invoice => !invoice.isPaid);
  
  if (searchTerm) {
    unpaidInvoices = unpaidInvoices.filter(inv => 
      inv.patientName.includes(searchTerm) || 
      inv.patientPhone.includes(searchTerm) ||
      inv.invoiceId.includes(searchTerm)
    );
  }
  
  unpaidInvoices = [...unpaidInvoices].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });
  
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
  
  const addPaymentEntry = () => {
    setPaymentEntries([...paymentEntries, { method: language === 'ar' ? "نقداً" : "Cash", amount: 0 }]);
  };
  
  const removePaymentEntry = (index: number) => {
    if (paymentEntries.length > 1) {
      const newEntries = [...paymentEntries];
      newEntries.splice(index, 1);
      setPaymentEntries(newEntries);
    }
  };
  
  const updatePaymentEntry = (index: number, field: string, value: string | number) => {
    const newEntries = [...paymentEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setPaymentEntries(newEntries);
  };
  
  const calculateTotalPayment = () => {
    return paymentEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  };
  
  const handleSubmitPayment = (invoiceId: string) => {
    const invoice = getInvoiceById(invoiceId);
    if (!invoice) return;
    
    const totalPayment = calculateTotalPayment();
    if (totalPayment <= 0) {
      toast.error(language === 'ar' ? "يرجى إدخال مبلغ الدفع" : "Please enter a payment amount");
      return;
    }
    
    if (totalPayment > invoice.remaining) {
      toast.error(language === 'ar' ? "المبلغ المدخل أكبر من المبلغ المتبقي" : "The entered amount is larger than the remaining amount");
      return;
    }
    
    const willCompletePay = (totalPayment === invoice.remaining);
    
    if (willCompletePay) {
      const invoiceCopy = { ...invoice };
      setInvoiceDataForPrint(invoiceCopy);
    }
    
    for (const entry of paymentEntries) {
      if (entry.amount > 0) {
        addPartialPayment(invoiceId, {
          amount: entry.amount,
          method: entry.method,
          authNumber: entry.authNumber
        });
      }
    }
    
    toast.success(language === 'ar' ? "تم تسجيل الدفع بنجاح" : "Payment recorded successfully");
    
    const updatedInvoice = getInvoiceById(invoiceId);
    if (updatedInvoice?.isPaid) {
      setInvoiceForPrint(invoiceId);
    }
    
    setPaymentEntries([{ method: language === 'ar' ? "نقداً" : "Cash", amount: 0 }]);
    setSelectedInvoice(null);
  };
  
  const handlePrintReceipt = (invoiceId: string) => {
    if (invoiceDataForPrint && invoiceId === invoiceDataForPrint.invoiceId) {
      CustomPrintService.printInvoice(invoiceDataForPrint);
      setInvoiceDataForPrint(null);
      return;
    }
    
    const invoice = getInvoiceById(invoiceId);
    if (!invoice) {
      toast.error(language === 'ar' ? "لم يتم العثور على الفاتورة" : "Invoice not found");
      return;
    }
    
    CustomPrintService.printInvoice(invoice);
  };
  
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  return (
    <div className={`space-y-6 py-4 ${dirClass}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${textAlignClass}`}>{t('remainingPayments')}</h2>
          <p className={`text-muted-foreground ${textAlignClass}`}>
            {t('duePayments')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className={`absolute ${language === 'ar' ? 'left-2.5' : 'right-2.5'} top-2.5 h-4 w-4 text-muted-foreground`} />
            <Input
              placeholder={language === 'ar' ? "البحث عن عميل أو رقم فاتورة..." : "Search for client or invoice number..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={language === 'ar' ? 'pl-8 w-full' : 'pr-8 w-full'}
            />
          </div>
          
          <Select 
            value={sortOrder} 
            onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder={language === 'ar' ? "ترتيب حسب" : "Sort by"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">{language === 'ar' ? "الأحدث أولاً" : "Newest first"}</SelectItem>
              <SelectItem value="asc">{language === 'ar' ? "الأقدم أولاً" : "Oldest first"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {unpaidInvoices.length === 0 ? (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-12 w-12 text-muted mb-4" />
            <h3 className="text-xl font-medium mb-2">{language === 'ar' ? "جميع ا��فواتير مدفوعة بالكامل" : "All invoices fully paid"}</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {language === 'ar' 
                ? "لا توجد فواتير تحتاج إلى دفعات متبقية. جميع المعاملات مكتملة."
                : "No invoices require remaining payments. All transactions are complete."}
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
                    {language === 'ar' ? "متبقي" : "Remaining"} {invoice.remaining.toFixed(2)} {t('kwd')}
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
                    <span>{new Date(invoice.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="w-full border rounded-md">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="px-3 text-sm font-medium">
                      {language === 'ar' ? "تفاصيل النظارة" : "Glasses Details"}
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 text-sm">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <EyeIcon className="h-3.5 w-3.5 text-blue-500" />
                          <span>{language === 'ar' ? "نوع العدسة:" : "Lens Type:"}</span>
                          <span className="font-medium">{invoice.lensType}</span>
                        </div>
                        
                        {invoice.frameBrand && (
                          <div className="flex items-center gap-1.5">
                            <Frame className="h-3.5 w-3.5 text-gray-500" />
                            <span>{language === 'ar' ? "الإطار:" : "Frame:"}</span>
                            <span className="font-medium">{invoice.frameBrand} / {invoice.frameModel}</span>
                          </div>
                        )}
                        
                        {invoice.coating && (
                          <div className="flex items-center gap-1.5">
                            <Droplets className="h-3.5 w-3.5 text-cyan-500" />
                            <span>{language === 'ar' ? "الطلاء:" : "Coating:"}</span>
                            <span className="font-medium">{invoice.coating}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <Tag className="h-3.5 w-3.5" />
                          <span>{language === 'ar' ? "السعر الإجمالي:" : "Total Price:"}</span>
                          <span className="font-medium">{invoice.total.toFixed(2)} {t('kwd')}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="border-t border-dashed pt-3">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">{language === 'ar' ? "إجمالي الفاتورة" : "Invoice Total"}</p>
                      <p className="font-bold text-lg">{invoice.total.toFixed(2)} {t('kwd')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{language === 'ar' ? "المدفوع" : "Paid"}</p>
                      <p className="text-blue-600 font-medium">{invoice.deposit.toFixed(2)} {t('kwd')}</p>
                    </div>
                  </div>
                  
                  {invoice.payments && invoice.payments.length > 0 && (
                    <div className="mt-2 bg-slate-50 p-2 rounded-md text-xs">
                      <p className="font-medium mb-1">{language === 'ar' ? "سجل الدفعات:" : "Payment History:"}</p>
                      {invoice.payments.map((payment, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span>{new Date(payment.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
                          <span className="font-medium">{payment.amount.toFixed(2)} {t('kwd')} ({payment.method})</span>
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
                        {language === 'ar' ? "عرض الفاتورة" : "View Invoice"}
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-sm">
                      <DialogHeader>
                        <DialogTitle>{language === 'ar' ? "فاتورة" : "Invoice"} {invoice.invoiceId}</DialogTitle>
                      </DialogHeader>
                      
                      <div className="max-h-[70vh] overflow-y-auto py-4" id={`print-receipt-${invoice.invoiceId}`}>
                        <ReceiptInvoice invoice={invoice} isPrintable={false} />
                      </div>
                      
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowReceipt(null)}
                        >
                          {language === 'ar' ? "إغلاق" : "Close"}
                        </Button>
                        <PrintReportButton 
                          onPrint={() => {
                            setShowReceipt(null);
                            handlePrintReceipt(invoice.invoiceId);
                          }}
                          label={language === 'ar' ? "طباعة الفاتورة" : "Print Invoice"}
                        />
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    className="flex-1 text-xs border-purple-200 hover:bg-purple-50 text-purple-700"
                    onClick={() => goToPatientProfile(invoice.patientId, invoice.patientName, invoice.patientPhone)}
                  >
                    <UserCircle className="h-4 w-4 mr-1" />
                    {language === 'ar' ? "ملف العميل" : "Client File"}
                  </Button>
                  
                  <Dialog open={selectedInvoice === invoice.invoiceId} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        className="flex-1 text-xs bg-amber-500 hover:bg-amber-600"
                        onClick={() => {
                          setSelectedInvoice(invoice.invoiceId);
                          setPaymentEntries([{ method: language === 'ar' ? "نقداً" : "Cash", amount: invoice.remaining }]);
                          setRemainingAfterPayment(0);
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        {language === 'ar' ? "تسديد الدفعة" : "Make Payment"}
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{language === 'ar' ? "تسجيل دفعة جديدة" : "Record New Payment"}</DialogTitle>
                        <DialogDescription>
                          {language === 'ar' ? "تسجيل دفعة للفاتورة" : "Record payment for invoice"} {invoice.invoiceId}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="py-4 space-y-4">
                        <div className="bg-muted p-4 rounded-md space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">{language === 'ar' ? "المبلغ الإجمالي:" : "Total Amount:"}</span>
                            <span className="font-medium">{invoice.total.toFixed(2)} {t('kwd')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">{language === 'ar' ? "المدفوع سابقاً:" : "Previously Paid:"}</span>
                            <span className="font-medium text-blue-600">{invoice.deposit.toFixed(2)} {t('kwd')}</span>
                          </div>
                          <div className="flex justify-between font-bold border-t pt-2 mt-2">
                            <span>{language === 'ar' ? "المبلغ المتبقي:" : "Remaining Amount:"}</span>
                            <span className="text-amber-600 text-lg">{invoice.remaining.toFixed(2)} {t('kwd')}</span>
                          </div>
                          
                          {remainingAfterPayment !== null && (
                            <div className="flex justify-between font-bold mt-3 bg-blue-50 p-2 rounded-md">
                              <span className="text-blue-700">{language === 'ar' ? "المتبقي بعد الدفع:" : "Remaining After Payment:"}</span>
                              <span className="text-blue-700 text-lg">{remainingAfterPayment.toFixed(2)} {t('kwd')}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{language === 'ar' ? "طرق الدفع" : "Payment Methods"}</h4>
                            <Button 
                              type="button" 
                              size="sm" 
                              variant="outline" 
                              onClick={addPaymentEntry}
                              className="h-8"
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" /> {language === 'ar' ? "إضافة طريقة دفع" : "Add Payment Method"}
                            </Button>
                          </div>
                          
                          {paymentEntries.map((entry, index) => (
                            <div key={index} className="space-y-3 bg-slate-50 p-3 rounded-md">
                              <div className="flex justify-between items-center">
                                <Label className="font-medium">{language === 'ar' ? "طريقة الدفع" : "Payment Method"} #{index + 1}</Label>
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
                                  <Label htmlFor={`payment-method-${index}`}>{language === 'ar' ? "طريقة الدفع" : "Payment Method"}</Label>
                                  <Select 
                                    value={entry.method} 
                                    onValueChange={(value) => updatePaymentEntry(index, 'method', value)}
                                  >
                                    <SelectTrigger id={`payment-method-${index}`}>
                                      <SelectValue placeholder={language === 'ar' ? "اختر طريقة الدفع" : "Select payment method"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value={language === 'ar' ? "نقداً" : "Cash"}>{language === 'ar' ? "نقداً" : "Cash"}</SelectItem>
                                      <SelectItem value={language === 'ar' ? "كي نت" : "KNET"}>{language === 'ar' ? "كي نت" : "KNET"}</SelectItem>
                                      <SelectItem value="Visa">Visa</SelectItem>
                                      <SelectItem value="MasterCard">MasterCard</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-1.5">
                                  <Label htmlFor={`payment-amount-${index}`}>{language === 'ar' ? "المبلغ (د.ك)" : "Amount (KWD)"}</Label>
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
                              
                              {(entry.method === (language === 'ar' ? "كي نت" : "KNET") || entry.method === "Visa" || entry.method === "MasterCard") && (
                                <div className="space-y-1.5">
                                  <Label htmlFor={`auth-number-${index}`}>{language === 'ar' ? "رقم التفويض" : "Authorization Number"}</Label>
                                  <Input
                                    id={`auth-number-${index}`}
                                    placeholder={language === 'ar' ? "رقم التفويض" : "Authorization number"}
                                    value={entry.authNumber || ""}
                                    onChange={(e) => updatePaymentEntry(index, 'authNumber', e.target.value)}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                          
                          <div className="flex justify-between font-medium p-2 border-t">
                            <span>{language === 'ar' ? "إجمالي المدفوع:" : "Total Payment:"}</span>
                            <span>{calculateTotalPayment().toFixed(2)} {t('kwd')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
                          {language === 'ar' ? "إلغاء" : "Cancel"}
                        </Button>
                        <Button 
                          onClick={() => handleSubmitPayment(invoice.invoiceId)}
                          className="bg-amber-500 hover:bg-amber-600"
                        >
                          {language === 'ar' ? "تأكيد الدفع" : "Confirm Payment"}
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
      
      {invoiceForPrint && (
        <Dialog
          open={Boolean(invoiceForPrint)}
          onOpenChange={(open) => !open && setInvoiceForPrint(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-green-600">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2" />
                {language === 'ar' ? "تم تسجيل الدفع بنجاح" : "Payment Successfully Recorded"}
              </DialogTitle>
              <DialogDescription className="text-center">
                {language === 'ar' 
                  ? "تم إكمال الدفع بنجاح! هل ترغب في طباعة الفاتورة النهائية؟" 
                  : "Payment completed successfully! Would you like to print the final invoice?"}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center space-x-4 space-x-reverse pt-4">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setInvoiceForPrint(null);
                  setInvoiceDataForPrint(null);
                }}
              >
                <span>{language === 'ar' ? "إغلاق" : "Close"}</span>
              </Button>
              <PrintReportButton
                className="bg-blue-600 hover:bg-blue-700"
                onPrint={() => {
                  const invoiceId = invoiceForPrint;
                  setInvoiceForPrint(null);
                  handlePrintReceipt(invoiceId);
                }}
                label={language === 'ar' ? "طباعة الفاتورة" : "Print Invoice"}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
