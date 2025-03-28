
import React, { useState } from 'react';
import { useInvoiceStore, Invoice } from '@/store/invoiceStore';
import { usePatientStore } from '@/store/patientStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from '@/hooks/use-toast';
import { useLanguageStore } from '@/store/languageStore';
import { RefreshCw, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RefundReceiptTemplate } from './RefundReceiptTemplate';
import { PrintService } from '@/utils/PrintService';

export const RefundManager: React.FC = () => {
  const { language, t } = useLanguageStore();
  const { invoices, workOrders, processRefund } = useInvoiceStore();
  const { getPatientById } = usePatientStore();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundMethod, setRefundMethod] = useState<string>('');
  const [refundReason, setRefundReason] = useState<string>('');
  const [staffNotes, setStaffNotes] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setError(language === 'ar' ? 'يرجى إدخال رقم الفاتورة أو اسم العميل' : 
        'Please enter an invoice number or customer name');
      return;
    }
    
    setIsSearching(true);
    setError('');
    
    // Search by invoice ID or patient name
    const results = invoices.filter(invoice => 
      !invoice.isRefunded && 
      (invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) || 
       invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setSearchResults(results);
    setIsSearching(false);
    
    if (results.length === 0) {
      setError(language === 'ar' ? 'لم يتم العثور على فواتير' : 'No invoices found');
    }
  };
  
  const handleSelectInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setRefundAmount(invoice.total);
    setError('');
    setSuccess('');
  };
  
  const handleRefundAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) {
      setRefundAmount(0);
    } else {
      setRefundAmount(value);
      
      // Validate refund amount
      if (selectedInvoice && value > selectedInvoice.total) {
        setError(language === 'ar' ? 'مبلغ الاسترداد لا يمكن أن يتجاوز إجمالي الفاتورة' : 
          'Refund amount cannot exceed the invoice total');
      } else {
        setError('');
      }
    }
  };
  
  const validateRefund = () => {
    if (!selectedInvoice) {
      setError(language === 'ar' ? 'يرجى اختيار فاتورة أولاً' : 'Please select an invoice first');
      return false;
    }
    
    if (refundAmount <= 0) {
      setError(language === 'ar' ? 'يجب أن يكون مبلغ الاسترداد أكبر من 0' : 'Refund amount must be greater than 0');
      return false;
    }
    
    if (refundAmount > selectedInvoice.total) {
      setError(language === 'ar' ? 'مبلغ الاسترداد لا يمكن أن يتجاوز إجمالي الفاتورة' : 
        'Refund amount cannot exceed the invoice total');
      return false;
    }
    
    if (!refundMethod) {
      setError(language === 'ar' ? 'يرجى اختيار طريقة الاسترداد' : 'Please select a refund method');
      return false;
    }
    
    if (!refundReason.trim()) {
      setError(language === 'ar' ? 'يرجى إدخال سبب الاسترداد' : 'Please enter a reason for the refund');
      return false;
    }
    
    return true;
  };
  
  const handleProcessRefund = () => {
    if (!validateRefund() || !selectedInvoice) return;
    
    try {
      // Process the refund
      const refundId = processRefund(
        selectedInvoice.invoiceId,
        refundAmount,
        refundMethod,
        refundReason,
        staffNotes
      );
      
      // Show success message
      setSuccess(language === 'ar' ? 'تم معالجة استرداد الأموال بنجاح' : 'Refund processed successfully');
      toast({
        title: language === 'ar' ? 'تم استرداد الأموال' : 'Refund Processed',
        description: language === 'ar' ? 'تمت معالجة استرداد الأموال بنجاح' : 'The refund has been processed successfully',
        variant: "default",
      });
      
      // Print refund receipt
      const patient = selectedInvoice.patientId ? getPatientById(selectedInvoice.patientId) : null;
      
      const refundInfo = {
        refundId,
        invoiceId: selectedInvoice.invoiceId,
        patientName: selectedInvoice.patientName,
        patientPhone: selectedInvoice.patientPhone,
        patientId: selectedInvoice.patientId,
        refundAmount,
        refundMethod,
        refundReason,
        refundDate: new Date().toISOString(),
        originalTotal: selectedInvoice.total,
        frameBrand: selectedInvoice.frameBrand,
        frameModel: selectedInvoice.frameModel
      };
      
      printRefundReceipt(refundInfo);
      
      // Reset form
      setTimeout(() => {
        setSelectedInvoice(null);
        setRefundAmount(0);
        setRefundMethod('');
        setRefundReason('');
        setStaffNotes('');
        setSearchResults([]);
        setSearchTerm('');
      }, 2000);
      
    } catch (error: any) {
      setError(error.message || 'An error occurred while processing the refund');
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: error.message || (language === 'ar' ? 'حدث خطأ أثناء معالجة الاسترداد' : 'An error occurred while processing the refund'),
        variant: "destructive",
      });
    }
  };
  
  const printRefundReceipt = (refundInfo: any) => {
    const receiptContent = RefundReceiptTemplate({
      refund: refundInfo,
      language
    });
    
    PrintService.printReport(
      receiptContent, 
      language === 'ar' ? `إيصال استرداد - ${refundInfo.refundId}` : `Refund Receipt - ${refundInfo.refundId}`,
      () => {
        toast({
          title: language === 'ar' ? 'تم إرسال الإيصال للطباعة' : 'Receipt sent to printer',
          description: language === 'ar' ? 'تتم معالجة طباعة الإيصال' : 'Processing print request',
          variant: "default",
        });
      }
    );
  };
  
  const goToPatientProfile = () => {
    if (selectedInvoice && selectedInvoice.patientId) {
      navigate(`/patient/${selectedInvoice.patientId}`);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'إدارة استرداد الأموال' : 'Refund Management'}</CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'ابحث عن الفاتورة أولاً ثم قم بمعالجة استرداد الأموال للعميل'
              : 'Search for the invoice first, then process a refund for the customer'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="search">{language === 'ar' ? 'ابحث عن الفاتورة أو العميل' : 'Search for Invoice or Customer'}</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    id="search" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={language === 'ar' ? 'رقم الفاتورة أو اسم العميل' : 'Invoice number or customer name'}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button 
                    onClick={handleSearch} 
                    disabled={isSearching}
                    className="gap-2"
                  >
                    {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    {language === 'ar' ? 'بحث' : 'Search'}
                  </Button>
                </div>
              </div>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            {searchResults.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-2 px-3 text-start text-xs font-medium text-muted-foreground">
                        {language === 'ar' ? 'رقم الفاتورة' : 'Invoice ID'}
                      </th>
                      <th className="py-2 px-3 text-start text-xs font-medium text-muted-foreground">
                        {language === 'ar' ? 'العميل' : 'Customer'}
                      </th>
                      <th className="py-2 px-3 text-start text-xs font-medium text-muted-foreground">
                        {language === 'ar' ? 'التاريخ' : 'Date'}
                      </th>
                      <th className="py-2 px-3 text-start text-xs font-medium text-muted-foreground">
                        {language === 'ar' ? 'المبلغ الإجمالي' : 'Total Amount'}
                      </th>
                      <th className="py-2 px-3 text-end text-xs font-medium text-muted-foreground">
                        {language === 'ar' ? 'الإجراءات' : 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {searchResults.map((invoice) => (
                      <tr 
                        key={invoice.invoiceId} 
                        className={`hover:bg-muted/30 ${selectedInvoice?.invoiceId === invoice.invoiceId ? 'bg-primary/10' : ''}`}
                      >
                        <td className="py-2 px-3 text-sm">{invoice.invoiceId}</td>
                        <td className="py-2 px-3 text-sm">{invoice.patientName}</td>
                        <td className="py-2 px-3 text-sm">
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-3 text-sm">{invoice.total.toFixed(3)} KWD</td>
                        <td className="py-2 px-3 text-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSelectInvoice(invoice)}
                          >
                            {language === 'ar' ? 'اختيار' : 'Select'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {selectedInvoice && (
              <div className="border rounded-lg p-4 space-y-4 mt-4 bg-muted/5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">
                    {language === 'ar' ? 'معلومات استرداد الأموال' : 'Refund Information'}
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={goToPatientProfile}
                    disabled={!selectedInvoice.patientId}
                  >
                    {language === 'ar' ? 'عرض ملف العميل' : 'View Patient Profile'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="refundAmount">{language === 'ar' ? 'مبلغ الاسترداد' : 'Refund Amount'}</Label>
                    <Input
                      id="refundAmount"
                      type="number"
                      step="0.001"
                      value={refundAmount}
                      onChange={handleRefundAmountChange}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'ar' 
                        ? `المبلغ الإجمالي للفاتورة: ${selectedInvoice.total.toFixed(3)} KWD`
                        : `Total invoice amount: ${selectedInvoice.total.toFixed(3)} KWD`}
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="refundMethod">{language === 'ar' ? 'طريقة الاسترداد' : 'Refund Method'}</Label>
                    <Select value={refundMethod} onValueChange={setRefundMethod}>
                      <SelectTrigger id="refundMethod" className="mt-1">
                        <SelectValue placeholder={language === 'ar' ? 'اختر طريقة الاسترداد' : 'Select refund method'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">{language === 'ar' ? 'نقداً' : 'Cash'}</SelectItem>
                        <SelectItem value="KNET">{language === 'ar' ? 'كي نت' : 'KNET'}</SelectItem>
                        <SelectItem value="Credit Card">{language === 'ar' ? 'بطاقة ائتمان' : 'Credit Card'}</SelectItem>
                        <SelectItem value="Store Credit">{language === 'ar' ? 'رصيد المتجر' : 'Store Credit'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="refundReason">{language === 'ar' ? 'سبب الاسترداد' : 'Refund Reason'}</Label>
                  <Select value={refundReason} onValueChange={setRefundReason}>
                    <SelectTrigger id="refundReason" className="mt-1">
                      <SelectValue placeholder={language === 'ar' ? 'اختر سبب الاسترداد' : 'Select refund reason'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Customer Dissatisfied">{language === 'ar' ? 'العميل غير راضٍ' : 'Customer Dissatisfied'}</SelectItem>
                      <SelectItem value="Product Defect">{language === 'ar' ? 'عيب في المنتج' : 'Product Defect'}</SelectItem>
                      <SelectItem value="Incorrect Prescription">{language === 'ar' ? 'وصفة طبية غير صحيحة' : 'Incorrect Prescription'}</SelectItem>
                      <SelectItem value="Frame Exchange">{language === 'ar' ? 'استبدال الإطار' : 'Frame Exchange'}</SelectItem>
                      <SelectItem value="Billing Error">{language === 'ar' ? 'خطأ في الفواتير' : 'Billing Error'}</SelectItem>
                      <SelectItem value="Other">{language === 'ar' ? 'آخر' : 'Other'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="staffNotes">{language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}</Label>
                  <Textarea
                    id="staffNotes"
                    value={staffNotes}
                    onChange={(e) => setStaffNotes(e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل أي ملاحظات إضافية هنا...' : 'Enter any additional notes here...'}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
        {selectedInvoice && (
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setSelectedInvoice(null)}
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleProcessRefund}>
              {language === 'ar' ? 'معالجة استرداد الأموال' : 'Process Refund'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
