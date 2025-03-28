
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInvoiceStore, Invoice, Refund } from "@/store/invoiceStore";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { toast } from "sonner";
import { RefundReceipt } from "./RefundReceipt";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Printer, DollarSign, AlertCircle, ArrowLeft } from "lucide-react";

interface RefundFormProps {
  invoice: Invoice;
  onRefundComplete: () => void;
  onBack: () => void;
}

const refundFormSchema = z.object({
  amount: z.number().min(0.001, "Amount must be greater than 0"),
  reason: z.string().min(3, "Reason must be at least 3 characters"),
  method: z.string().min(1, "Payment method is required"),
  notes: z.string().optional(),
  authNumber: z.string().optional()
});

type RefundFormValues = z.infer<typeof refundFormSchema>;

export const RefundForm: React.FC<RefundFormProps> = ({ 
  invoice, 
  onRefundComplete,
  onBack
}) => {
  const { t, language } = useLanguageStore();
  const { processRefund } = useInvoiceStore();
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [completedRefund, setCompletedRefund] = useState<{invoice: Invoice, refund: Refund} | null>(null);
  
  const form = useForm<RefundFormValues>({
    resolver: zodResolver(refundFormSchema),
    defaultValues: {
      amount: invoice.total,
      reason: "",
      method: "Cash",
      notes: "",
      authNumber: ""
    }
  });
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP", { locale: language === 'ar' ? ar : enUS });
    } catch (error) {
      return language === 'ar' ? "تاريخ غير صالح" : "Invalid date";
    }
  };
  
  const onSubmit = (data: RefundFormValues) => {
    // Process the refund
    const refundId = processRefund(invoice.invoiceId, {
      amount: data.amount,
      reason: data.reason,
      method: data.method,
      notes: data.notes,
      authNumber: data.authNumber
    });
    
    // Get the updated invoice with refund info
    const updatedInvoice = useInvoiceStore.getState().getInvoiceById(invoice.invoiceId);
    
    if (updatedInvoice && updatedInvoice.refund) {
      setCompletedRefund({
        invoice: updatedInvoice,
        refund: updatedInvoice.refund
      });
      
      // Show success message
      toast.success(t('refundSuccess'));
      
      // Open the receipt
      setReceiptOpen(true);
      
      // Notify parent that refund is complete
      onRefundComplete();
    }
  };
  
  const handlePrintReceipt = () => {
    setTimeout(() => {
      window.print();
    }, 500);
  };
  
  return (
    <>
      <Card className="mb-6 border-amber-200 shadow-md">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100">
          <Button 
            variant="ghost" 
            className="w-fit mb-2 p-0 hover:bg-amber-200/50" 
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {language === 'ar' ? 'العودة إلى البحث' : 'Back to Search'}
          </Button>
          <CardTitle className="text-amber-800 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-amber-600" />
            {t('refundProcessTitle')}
          </CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? `معالجة استرداد للفاتورة رقم ${invoice.invoiceId}`
              : `Processing refund for invoice ${invoice.invoiceId}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-blue-800 font-medium mb-2">{t('invoiceDetails')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('invoice')}:</span>
                  <span className="font-medium">{invoice.invoiceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('date')}:</span>
                  <span>{formatDate(invoice.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('name')}:</span>
                  <span>{invoice.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('total')}:</span>
                  <span className="font-medium">{invoice.total.toFixed(3)} KWD</span>
                </div>
              </div>
            </div>
            
            {invoice.frameBrand && (
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                <h3 className="text-emerald-800 font-medium mb-2">{t('frameDetails')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('brand')}:</span>
                    <span className="font-medium">{invoice.frameBrand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('model')}:</span>
                    <span>{invoice.frameModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('color')}:</span>
                    <span>{invoice.frameColor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('price')}:</span>
                    <span className="font-medium">{invoice.framePrice.toFixed(3)} KWD</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">{language === 'ar' ? 'تنبيه مهم' : 'Important Note'}</p>
              <p>{language === 'ar' 
                ? 'معالجة الاسترداد ستقوم بتحديث سجل العميل ودفاتر الحسابات. لا يمكن التراجع عن هذه العملية.'
                : 'Processing a refund will update the customer record and accounting ledgers. This action cannot be undone.'}
              </p>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('refundAmount')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                          type="number" 
                          step="0.001" 
                          className="pl-10" 
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      {language === 'ar' 
                        ? 'أدخل المبلغ المراد استرداده (بالدينار الكويتي)'
                        : 'Enter the amount to be refunded (in KWD)'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('refundReason')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      {language === 'ar' 
                        ? 'أدخل سبب الاسترداد (مثال: منتج معيب، عدم رضا العميل)'
                        : 'Enter the reason for refund (e.g., defective product, customer dissatisfaction)'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('refundMethod')}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'ar' ? 'اختر طريقة الاسترداد' : 'Select refund method'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cash">{language === 'ar' ? 'نقداً' : 'Cash'}</SelectItem>
                        <SelectItem value="Card">{language === 'ar' ? 'بطاقة ائتمان' : 'Credit Card'}</SelectItem>
                        <SelectItem value="Bank Transfer">{language === 'ar' ? 'تحويل بنكي' : 'Bank Transfer'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {language === 'ar' 
                        ? 'اختر طريقة إرجاع المبلغ للعميل'
                        : 'Select the method of refunding the amount to the customer'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("method") === "Card" && (
                <FormField
                  control={form.control}
                  name="authNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'ar' ? 'رقم المعاملة' : 'Authorization Number'}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        {language === 'ar' 
                          ? 'أدخل رقم تفويض معاملة البطاقة (اختياري)'
                          : 'Enter card transaction authorization number (optional)'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('refundNotes')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <FormDescription>
                      {language === 'ar' 
                        ? 'ملاحظات إضافية حول عملية الاسترداد (اختياري)'
                        : 'Additional notes about the refund process (optional)'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                {t('processRefund')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {completedRefund && (
        <Sheet open={receiptOpen} onOpenChange={setReceiptOpen}>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto print:w-full print:max-w-none">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                {t('refundInvoice')}
              </SheetTitle>
              <SheetDescription>
                <Button onClick={handlePrintReceipt} className="mt-2">
                  <Printer className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {t('print')}
                </Button>
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 print:mt-0">
              <RefundReceipt 
                invoice={completedRefund.invoice}
                refund={completedRefund.refund}
                isPrintable={true}
              />
            </div>
            <SheetFooter className="print:hidden mt-4">
              <Button onClick={() => setReceiptOpen(false)}>{t('close')}</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};
