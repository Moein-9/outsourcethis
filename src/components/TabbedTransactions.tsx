import React, { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { Invoice, WorkOrder, useInvoiceStore } from '@/store/invoiceStore';
import { Patient } from '@/store/patientStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format, isValid } from 'date-fns';
import { PencilLine, Receipt, Clock, CheckCircle, RefreshCcw, AlertTriangle, ShoppingBag, CheckCheck, Ban, User, Phone, Calendar } from 'lucide-react';
import { PrintOptionsDialog } from './PrintOptionsDialog';
import { CustomPrintService } from '@/utils/CustomPrintService';
import { toast } from 'sonner';
import { PrintReportButton } from './reports/PrintReportButton';
import { RefundReceiptTemplate } from './RefundReceiptTemplate';
import * as ReactDOMServer from 'react-dom/server';
import { PrintService } from '@/utils/PrintService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

interface TabbedTransactionsProps {
  invoices: Invoice[];
  workOrders: WorkOrder[];
  refundedInvoices: Invoice[];
  patient?: Patient;
  onEditWorkOrder?: (workOrder: WorkOrder) => void;
}

export const TabbedTransactions: React.FC<TabbedTransactionsProps> = ({
  invoices,
  workOrders,
  refundedInvoices,
  patient,
  onEditWorkOrder
}) => {
  const { language, t } = useLanguageStore();
  const { markAsPickedUp } = useInvoiceStore();
  const [activeTab, setActiveTab] = useState('active');
  const [pickedUpInvoices, setPickedUpInvoices] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const sortedInvoices = [...invoices].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const activeInvoices = sortedInvoices
    .filter(invoice => !invoice.isPickedUp && !invoice.isRefunded)
    .filter(invoice => !pickedUpInvoices.includes(invoice.invoiceId));
  
  const completedInvoices = [...sortedInvoices
    .filter(invoice => invoice.isPickedUp && !invoice.isRefunded),
    ...sortedInvoices.filter(invoice => pickedUpInvoices.includes(invoice.invoiceId))
  ];
  
  const uniqueCompletedInvoices = completedInvoices.filter((invoice, index, self) =>
    index === self.findIndex((i) => i.invoiceId === invoice.invoiceId)
  );
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, "dd/MM/yyyy") : "Invalid Date";
    } catch (error) {
      return "Invalid Date";
    }
  };
  
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, "dd/MM/yyyy HH:mm") : "Invalid Date";
    } catch (error) {
      return "Invalid Date";
    }
  };
  
  const handlePrintWorkOrder = (workOrder: any, invoice?: any) => {
    try {
      CustomPrintService.printWorkOrder(workOrder, invoice, patient);
      toast.success(language === 'ar' ? "تم إرسال أمر العمل للطباعة" : "Work order sent to printer");
    } catch (error) {
      console.error("Error printing work order:", error);
      toast.error(language === 'ar' ? "حدث خطأ أثناء الطباعة" : "Error printing work order");
    }
  };

  const handlePrintInvoice = (invoice: any) => {
    try {
      CustomPrintService.printInvoice(invoice);
      toast.success(language === 'ar' ? "تم إرسال الفاتورة للطباعة" : "Invoice sent to printer");
    } catch (error) {
      console.error("Error printing invoice:", error);
      toast.error(language === 'ar' ? "حدث خطأ أثناء طباعة الفاتورة" : "Error printing invoice");
    }
  };

  const handlePrintRefundReceipt = (invoice: any) => {
    try {
      const refundInfo = {
        refundId: invoice.refundId || 'N/A',
        invoiceId: invoice.invoiceId,
        patientName: invoice.patientName,
        patientPhone: invoice.patientPhone,
        patientId: invoice.patientId,
        refundAmount: invoice.refundAmount || 0,
        refundMethod: invoice.refundMethod || 'N/A',
        refundReason: invoice.refundReason || 'N/A',
        refundDate: invoice.refundDate || new Date().toISOString(),
        originalTotal: invoice.total,
        frameBrand: invoice.frameBrand,
        frameModel: invoice.frameModel,
        frameColor: invoice.frameColor,
        lensType: invoice.lensType,
        invoiceItems: [
          ...(invoice.frameBrand ? [{
            name: invoice.frameBrand + ' ' + invoice.frameModel,
            price: invoice.framePrice,
            quantity: 1
          }] : []),
          ...(invoice.lensType ? [{
            name: invoice.lensType,
            price: invoice.lensPrice,
            quantity: 1
          }] : []),
          ...(invoice.coating ? [{
            name: invoice.coating,
            price: invoice.coatingPrice,
            quantity: 1
          }] : []),
          ...(invoice.contactLensItems ? invoice.contactLensItems.map((item: any) => ({
            name: `${item.brand} ${item.type} ${item.color || ''}`.trim(),
            price: item.price,
            quantity: item.qty || 1
          })) : [])
        ],
        staffNotes: invoice.refundNotes || ''
      };
      
      const receiptElement = (
        <RefundReceiptTemplate
          refund={refundInfo}
          language={language}
        />
      );
      
      const receiptHtml = ReactDOMServer.renderToString(receiptElement);
      
      PrintService.printHtml(
        PrintService.prepareReceiptDocument(receiptHtml, language === 'ar' ? `إيصال استرداد - ${refundInfo.refundId}` : `Refund Receipt - ${refundInfo.refundId}`),
        'receipt',
        () => {
          toast.success(language === 'ar' ? 'تم إرسال الإيصال للطباعة' : 'Receipt sent to printer');
        }
      );
    } catch (error) {
      console.error("Error printing refund receipt:", error);
      toast.error(language === 'ar' ? "حدث خطأ أثناء طباعة إيصال الاسترداد" : "Error printing refund receipt");
    }
  };
  
  const handleMarkAsPickedUp = (id: string, isInvoice: boolean = true) => {
    setPickedUpInvoices(prev => [...prev, id]);
    toast.success(language === 'ar' ? "تم تسليم الطلب بنجاح" : "Order has been marked as picked up");
    setTimeout(() => {
      setActiveTab('completed');
    }, 300);
    markAsPickedUp(id, isInvoice);
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 500);
  };
  
  const renderActiveTable = (transactions: Invoice[]) => {
    if (transactions.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500 bg-blue-50/30 rounded-lg my-2">
          <ShoppingBag className="h-12 w-12 mx-auto text-blue-300 mb-2" />
          <p className="font-medium">
            {language === 'ar' ? "لا توجد معاملات نشطة" : "No active transactions"}
          </p>
        </div>
      );
    }
    
    return (
      <div className="divide-y border border-blue-200 rounded-lg overflow-hidden bg-gradient-to-r from-blue-50/30 to-indigo-50/30">
        {transactions.map((invoice) => {
          const relatedWorkOrder = workOrders.find(wo => wo.id === invoice.workOrderId);
          const hasBeenEdited = relatedWorkOrder?.editHistory?.length > 0 || 
                                relatedWorkOrder?.lastEditedAt || 
                                invoice.editHistory?.length > 0 || 
                                invoice.lastEditedAt;
          
          const lastEditTime = relatedWorkOrder?.lastEditedAt || invoice.lastEditedAt;
          
          return (
            <div key={invoice.invoiceId} className="p-4 hover:bg-blue-50/60 transition-all animate-fade-in">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Receipt className="h-5 w-5 text-indigo-600" />
                    <span className="font-semibold text-indigo-900 text-lg">{invoice.invoiceId}</span>
                    
                    {invoice.isPaid ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2">
                        {language === 'ar' ? "مدفوع" : "Paid"}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 ml-2">
                        {language === 'ar' ? "غير مدفوع" : "Unpaid"}
                      </Badge>
                    )}
                    
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 ml-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {language === 'ar' ? "جاري التجهيز" : "Processing"}
                    </Badge>
                    
                    {hasBeenEdited && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 ml-2 flex items-center gap-1">
                        <RefreshCcw className="h-3 w-3" />
                        {language === 'ar' ? "تم التعديل" : "Edited"}
                      </Badge>
                    )}
                  </div>
                  
                  <Card className="bg-blue-50/80 border-blue-200 max-w-xs">
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        {language === 'ar' ? "معلومات العميل" : "Customer Info"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3 pt-0 space-y-1">
                      <div className="text-sm font-medium">
                        {invoice.patientName || t('anonymous')}
                      </div>
                      {invoice.patientPhone && (
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {invoice.patientPhone}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(invoice.createdAt)}
                      </div>
                      
                      {lastEditTime && (
                        <div className="text-xs text-amber-600 flex items-center gap-1 mt-1 font-medium">
                          <RefreshCcw className="h-3 w-3" />
                          {language === 'ar' ? "آخر تعديل: " : "Last edit: "}
                          {formatDateTime(lastEditTime)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="text-sm mt-1 font-medium text-indigo-700">
                    {invoice.invoiceType === 'glasses' ? (
                      <span>
                        {invoice.frameBrand} {invoice.frameModel} - {
                          invoice.lensType ? (
                            typeof invoice.lensType === 'object' && invoice.lensType !== null
                              ? invoice.lensType.name 
                              : String(invoice.lensType ?? '')
                          ) : ''
                        }
                      </span>
                    ) : (
                      <span>
                        {language === 'ar' ? "عدسات لاصقة" : "Contact Lenses"}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-indigo-900 text-xl">
                    {invoice.total.toFixed(3)} KWD
                  </div>
                  {invoice.remaining > 0 && (
                    <div className="text-amber-600 font-medium text-sm mt-1">
                      {language === 'ar' ? "المتبقي:" : "Remaining:"} {invoice.remaining.toFixed(3)} KWD
                    </div>
                  )}
                  <div className="flex space-x-2 mt-3 justify-end">
                    {invoice.workOrderId && onEditWorkOrder && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 text-xs bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 hover:text-violet-800 hover:border-violet-300"
                        onClick={() => {
                          const workOrder = workOrders.find(wo => wo.id === invoice.workOrderId);
                          if (workOrder && onEditWorkOrder) {
                            onEditWorkOrder(workOrder);
                          }
                        }}
                      >
                        <PencilLine className="h-3.5 w-3.5 mr-1" />
                        {language === 'ar' ? "تعديل أمر العمل" : "Edit Work Order"}
                      </Button>
                    )}
                    
                    <PrintOptionsDialog
                      workOrder={invoice}
                      invoice={invoice}
                      patient={patient}
                      onPrintWorkOrder={() => handlePrintWorkOrder(invoice)}
                      onPrintInvoice={() => handlePrintInvoice(invoice)}
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 text-xs bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100 hover:text-cyan-800 hover:border-cyan-300"
                      >
                        <Receipt className="h-3.5 w-3.5 mr-1" />
                        {language === 'ar' ? "طباعة" : "Print"}
                      </Button>
                    </PrintOptionsDialog>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 text-xs bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-300"
                      onClick={() => handleMarkAsPickedUp(invoice.invoiceId, true)}
                    >
                      <CheckCheck className="h-3.5 w-3.5 mr-1" />
                      {language === 'ar' ? "تم الاستلام" : "Mark as Picked Up"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderCompletedTable = (transactions: Invoice[]) => {
    if (transactions.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500 bg-green-50/30 rounded-lg my-2">
          <CheckCheck className="h-12 w-12 mx-auto text-green-300 mb-2" />
          <p className="font-medium">
            {language === 'ar' ? "لا توجد معاملات مكتملة" : "No completed transactions"}
          </p>
        </div>
      );
    }
    
    return (
      <div className="divide-y border border-green-200 rounded-lg overflow-hidden bg-gradient-to-r from-green-50/30 to-emerald-50/30">
        {transactions.map((invoice) => {
          const relatedWorkOrder = workOrders.find(wo => wo.id === invoice.workOrderId);
          const hasBeenEdited = relatedWorkOrder?.editHistory?.length > 0 || 
                                relatedWorkOrder?.lastEditedAt || 
                                invoice.editHistory?.length > 0 || 
                                invoice.lastEditedAt;
          
          const lastEditTime = relatedWorkOrder?.lastEditedAt || invoice.lastEditedAt;
          
          return (
            <div key={invoice.invoiceId} className="p-4 hover:bg-green-50/60 transition-all">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Receipt className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800 text-lg">{invoice.invoiceId}</span>
                    
                    {invoice.isPaid ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2">
                        {language === 'ar' ? "مدفوع" : "Paid"}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 ml-2">
                        {language === 'ar' ? "غير مدفوع" : "Unpaid"}
                      </Badge>
                    )}
                    
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {language === 'ar' ? "تم الاستلام" : "Picked up"}
                    </Badge>
                    
                    {hasBeenEdited && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 ml-2 flex items-center gap-1">
                        <RefreshCcw className="h-3 w-3" />
                        {language === 'ar' ? "تم التعديل" : "Edited"}
                      </Badge>
                    )}
                  </div>
                  
                  <Card className="bg-green-50/80 border-green-200 max-w-xs">
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        {language === 'ar' ? "معلومات العميل" : "Customer Info"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3 pt-0 space-y-1">
                      <div className="text-sm font-medium">
                        {invoice.patientName || t('anonymous')}
                      </div>
                      {invoice.patientPhone && (
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {invoice.patientPhone}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(invoice.createdAt)}
                      </div>
                      
                      {lastEditTime && (
                        <div className="text-xs text-amber-600 flex items-center gap-1 mt-1 font-medium">
                          <RefreshCcw className="h-3 w-3" />
                          {language === 'ar' ? "آخر تعديل: " : "Last edit: "}
                          {formatDateTime(lastEditTime)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="text-sm mt-1 font-medium text-green-700">
                    {invoice.invoiceType === 'glasses' ? (
                      <span>
                        {invoice.frameBrand} {invoice.frameModel} - {
                          invoice.lensType ? (
                            typeof invoice.lensType === 'object' && invoice.lensType !== null
                              ? invoice.lensType.name 
                              : String(invoice.lensType ?? '')
                          ) : ''
                        }
                      </span>
                    ) : (
                      <span>
                        {language === 'ar' ? "عدسات لاصقة" : "Contact Lenses"}
                      </span>
                    )}
                  </div>
                  
                  {invoice.pickedUpAt && (
                    <div className="text-xs mt-1.5 text-green-600 bg-green-50 rounded-md inline-block px-2 py-0.5">
                      {language === 'ar' ? "تم الاستلام بتاريخ:" : "Picked up on:"} {formatDate(invoice.pickedUpAt)}
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-green-800 text-xl">
                    {invoice.total.toFixed(3)} KWD
                  </div>
                  {invoice.remaining > 0 && (
                    <div className="text-amber-600 font-medium text-sm mt-1">
                      {language === 'ar' ? "المتبقي:" : "Remaining:"} {invoice.remaining.toFixed(3)} KWD
                    </div>
                  )}
                  <div className="mt-3">
                    <PrintOptionsDialog
                      workOrder={invoice}
                      invoice={invoice}
                      patient={patient}
                      onPrintWorkOrder={() => handlePrintWorkOrder(invoice)}
                      onPrintInvoice={() => handlePrintInvoice(invoice)}
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800 hover:border-green-300"
                      >
                        <Receipt className="h-3.5 w-3.5 mr-1" />
                        {language === 'ar' ? "طباعة" : "Print"}
                      </Button>
                    </PrintOptionsDialog>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderRefundedTable = (transactions: Invoice[]) => {
    if (transactions.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500 bg-red-50/30 rounded-lg my-2">
          <RefreshCcw className="h-12 w-12 mx-auto text-red-300 mb-2" />
          <p className="font-medium">
            {language === 'ar' ? "لا توجد معاملات مستردة" : "No refunded transactions"}
          </p>
        </div>
      );
    }
    
    return (
      <div className="divide-y border border-red-200 rounded-lg overflow-hidden bg-gradient-to-r from-red-50/20 to-pink-50/20">
        {transactions.map((invoice) => (
          <div key={invoice.invoiceId} className="p-4 hover:bg-red-50/40 transition-all">
            <div className="flex justify-between items-start">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-1.5">
                  <Receipt className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-800 text-lg">{invoice.invoiceId}</span>
                  
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200 ml-2 flex items-center gap-1">
                    <RefreshCcw className="h-3 w-3" />
                    {language === 'ar' ? "تم الاسترداد" : "Refunded"}
                  </Badge>
                </div>
                
                <Card className="bg-red-50/80 border-red-200 max-w-xs">
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      {language === 'ar' ? "معلومات العميل" : "Customer Info"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3 pt-0 space-y-1">
                    <div className="text-sm font-medium">
                      {invoice.patientName || t('anonymous')}
                    </div>
                    {invoice.patientPhone && (
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {invoice.patientPhone}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(invoice.createdAt)}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-sm mt-1 font-medium text-red-700">
                  {invoice.invoiceType === 'glasses' ? (
                    <span>
                      {invoice.frameBrand} {invoice.frameModel} - {invoice.lensType ?? ''}
                    </span>
                  ) : (
                    <span>
                      {language === 'ar' ? "عدسات لاصقة" : "Contact Lenses"}
                    </span>
                  )}
                </div>
                
                <div className="mt-2 text-sm bg-red-50 p-3 rounded-md border border-red-200 shadow-sm">
                  <div className="flex items-center gap-1 text-red-700 font-medium mb-2">
                    <RefreshCcw className="h-4 w-4" />
                    <span>
                      {language === 'ar' ? "معلومات الاسترداد:" : "Refund Info:"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                    <div className="flex items-center gap-1 text-red-800">
                      <span className="font-medium text-xs">{language === 'ar' ? "المبلغ:" : "Amount:"}</span>
                      <span className="font-semibold">{invoice.refundAmount?.toFixed(3)} KWD</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-800">
                      <span className="font-medium text-xs">{language === 'ar' ? "التاريخ:" : "Date:"}</span>
                      <span>{formatDate(invoice.refundDate || '')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-800">
                      <span className="font-medium text-xs">{language === 'ar' ? "الطريقة:" : "Method:"}</span>
                      <span>{invoice.refundMethod}</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-800">
                      <span className="font-medium text-xs">{language === 'ar' ? "السبب:" : "Reason:"}</span>
                      <span>{invoice.refundReason}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-red-800 text-xl">
                  {invoice.total.toFixed(3)} KWD
                </div>
                <div className="mt-3">
                  <PrintReportButton 
                    onPrint={() => handlePrintRefundReceipt(invoice)}
                    className="h-8 text-xs"
                    label={language === 'ar' ? "طباعة إيصال الاسترداد" : "Print Refund Receipt"}
                    variant="outline"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="mt-4 border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-indigo-100 to-blue-50 p-4 flex justify-between items-center">
        <h3 className="font-medium text-indigo-900 text-lg">
          {language === 'ar' ? "سجل المعاملات" : "Transaction History"}
        </h3>
        <span className="text-xs bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full">
          {sortedInvoices.length + refundedInvoices.length} {language === 'ar' ? "معاملة" : "transactions"}
        </span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              {language === 'ar' ? "نشطة" : "Active"}
              {activeInvoices.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-800">
                  {activeInvoices.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCheck className="h-4 w-4" />
              {language === 'ar' ? "مكتملة" : "Completed"}
              {uniqueCompletedInvoices.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-green-100 text-green-800">
                  {uniqueCompletedInvoices.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="refunded" className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              {language === 'ar' ? "مستردة" : "Refunded"}
              {refundedInvoices.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-red-100 text-red-800">
                  {refundedInvoices.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="pb-4 pt-2 px-4">
          {renderActiveTable(activeInvoices)}
        </TabsContent>
        
        <TabsContent value="completed" className="pb-4 pt-2 px-4 animate-fade-in">
          {renderCompletedTable(uniqueCompletedInvoices)}
        </TabsContent>
        
        <TabsContent value="refunded" className="pb-4 pt-2 px-4">
          {renderRefundedTable(refundedInvoices)}
        </TabsContent>
      </Tabs>
    </div>
  );
};
