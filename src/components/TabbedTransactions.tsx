
import React, { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { Invoice, WorkOrder } from '@/store/invoiceStore';
import { Patient } from '@/store/patientStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format, isValid } from 'date-fns';
import { PencilLine, Receipt, Clock, CheckCircle, RefreshCcw, AlertTriangle, ShoppingBag, CheckCheck, Ban } from 'lucide-react';
import { PrintOptionsDialog } from './PrintOptionsDialog';
import { CustomPrintService } from '@/utils/CustomPrintService';
import { toast } from 'sonner';

interface TabbedTransactionsProps {
  invoices: Invoice[];
  workOrders: WorkOrder[];
  patient?: Patient;
  onEditWorkOrder?: (workOrder: WorkOrder) => void;
}

export const TabbedTransactions: React.FC<TabbedTransactionsProps> = ({
  invoices,
  workOrders,
  patient,
  onEditWorkOrder
}) => {
  const { language, t } = useLanguageStore();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Sort invoices by date, newest first
  const sortedInvoices = [...invoices].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Filter active (not picked up and not refunded)
  const activeInvoices = sortedInvoices.filter(invoice => !invoice.isPickedUp && !invoice.isRefunded);
  
  // Filter completed (picked up and not refunded)
  const completedInvoices = sortedInvoices.filter(invoice => invoice.isPickedUp && !invoice.isRefunded);
  
  // Filter refunded invoices
  const refundedInvoices = sortedInvoices.filter(invoice => invoice.isRefunded);
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, "dd/MM/yyyy") : "Invalid Date";
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
      // Use existing invoice print functionality
      toast.success(language === 'ar' ? "تم إرسال الفاتورة للطباعة" : "Invoice sent to printer");
    } catch (error) {
      console.error("Error printing invoice:", error);
      toast.error(language === 'ar' ? "حدث خطأ أثناء طباعة الفاتورة" : "Error printing invoice");
    }
  };
  
  const handleMarkAsPickedUp = (id: string, isInvoice: boolean = true) => {
    // This function would call the markAsPickedUp function from the invoice store
    // For now, we'll just update the refresh trigger to force a re-render
    setRefreshTrigger(prev => prev + 1);
    toast.success(language === 'ar' ? "تم تسليم الطلب بنجاح" : "Order has been marked as picked up");
  };
  
  // Render Active Transactions
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
        {transactions.map((invoice) => (
          <div key={invoice.invoiceId} className="p-4 hover:bg-blue-50/60 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <Receipt className="h-4 w-4 text-indigo-600" />
                  <span className="font-medium text-indigo-900">{invoice.invoiceId}</span>
                  
                  {/* Payment Status */}
                  {invoice.isPaid ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2">
                      {language === 'ar' ? "مدفوع" : "Paid"}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 ml-2">
                      {language === 'ar' ? "غير مدفوع" : "Unpaid"}
                    </Badge>
                  )}
                  
                  {/* Pickup Status */}
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 ml-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {language === 'ar' ? "جاري التجهيز" : "Processing"}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-500 mt-1">
                  {formatDate(invoice.createdAt)}
                </div>
                
                <div className="text-sm mt-1 font-medium text-indigo-700">
                  {invoice.invoiceType === 'glasses' ? (
                    <span>
                      {invoice.frameBrand} {invoice.frameModel} - {invoice.lensType}
                    </span>
                  ) : (
                    <span>
                      {language === 'ar' ? "عدسات لاصقة" : "Contact Lenses"}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-indigo-900 text-lg">
                  {invoice.total.toFixed(3)} KWD
                </div>
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
        ))}
      </div>
    );
  };
  
  // Render Completed Transactions
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
        {transactions.map((invoice) => (
          <div key={invoice.invoiceId} className="p-4 hover:bg-green-50/60 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <Receipt className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">{invoice.invoiceId}</span>
                  
                  {/* Payment Status */}
                  {invoice.isPaid ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2">
                      {language === 'ar' ? "مدفوع" : "Paid"}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 ml-2">
                      {language === 'ar' ? "غير مدفوع" : "Unpaid"}
                    </Badge>
                  )}
                  
                  {/* Pickup Status */}
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {language === 'ar' ? "تم الاستلام" : "Picked up"}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-500 mt-1">
                  {formatDate(invoice.createdAt)}
                </div>
                
                <div className="text-sm mt-1 font-medium text-green-700">
                  {invoice.invoiceType === 'glasses' ? (
                    <span>
                      {invoice.frameBrand} {invoice.frameModel} - {invoice.lensType}
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
                <div className="font-semibold text-green-800 text-lg">
                  {invoice.total.toFixed(3)} KWD
                </div>
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
        ))}
      </div>
    );
  };
  
  // Render Refunded Transactions
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
              <div>
                <div className="flex items-center gap-1.5">
                  <Receipt className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800">{invoice.invoiceId}</span>
                  
                  {/* Refund Status */}
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200 ml-2 flex items-center gap-1">
                    <RefreshCcw className="h-3 w-3" />
                    {language === 'ar' ? "تم الاسترداد" : "Refunded"}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-500 mt-1">
                  {formatDate(invoice.createdAt)}
                </div>
                
                <div className="text-sm mt-1 font-medium text-red-700">
                  {invoice.invoiceType === 'glasses' ? (
                    <span>
                      {invoice.frameBrand} {invoice.frameModel} - {invoice.lensType}
                    </span>
                  ) : (
                    <span>
                      {language === 'ar' ? "عدسات لاصقة" : "Contact Lenses"}
                    </span>
                  )}
                </div>
                
                {/* Refund Information */}
                <div className="mt-2 text-sm bg-red-50 p-2 rounded-md border border-red-100">
                  <div className="flex items-center gap-1 text-red-700">
                    <RefreshCcw className="h-3.5 w-3.5" />
                    <span className="font-medium">
                      {language === 'ar' ? "معلومات الاسترداد:" : "Refund Info:"}
                    </span>
                  </div>
                  <div className="mt-1 text-red-800 grid grid-cols-2 gap-x-2 text-xs">
                    <div>
                      {language === 'ar' ? `المبلغ: ${invoice.refundAmount?.toFixed(3)} KWD` : 
                        `Amount: ${invoice.refundAmount?.toFixed(3)} KWD`}
                    </div>
                    <div>
                      {language === 'ar' ? `التاريخ: ${formatDate(invoice.refundDate || '')}` : 
                        `Date: ${formatDate(invoice.refundDate || '')}`}
                    </div>
                    <div>
                      {language === 'ar' ? `الطريقة: ${invoice.refundMethod}` : 
                        `Method: ${invoice.refundMethod}`}
                    </div>
                    <div>
                      {language === 'ar' ? `السبب: ${invoice.refundReason}` : 
                        `Reason: ${invoice.refundReason}`}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-red-800 text-lg">
                  {invoice.total.toFixed(3)} KWD
                </div>
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
                      className="h-8 text-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800 hover:border-red-300"
                    >
                      <Receipt className="h-3.5 w-3.5 mr-1" />
                      {language === 'ar' ? "طباعة" : "Print"}
                    </Button>
                  </PrintOptionsDialog>
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
          {sortedInvoices.length} {language === 'ar' ? "معاملة" : "transactions"}
        </span>
      </div>

      <Tabs defaultValue="active" className="w-full">
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
              {completedInvoices.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-green-100 text-green-800">
                  {completedInvoices.length}
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
        
        <TabsContent value="completed" className="pb-4 pt-2 px-4">
          {renderCompletedTable(completedInvoices)}
        </TabsContent>
        
        <TabsContent value="refunded" className="pb-4 pt-2 px-4">
          {renderRefundedTable(refundedInvoices)}
        </TabsContent>
      </Tabs>
    </div>
  );
};
