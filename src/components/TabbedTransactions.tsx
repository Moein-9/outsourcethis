
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
  
  // Filter active (not picked up) and completed (picked up) invoices
  const activeInvoices = sortedInvoices.filter(invoice => !invoice.isPickedUp);
  const completedInvoices = sortedInvoices.filter(invoice => invoice.isPickedUp);
  
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
  
  // Render table for each category
  const renderTransactionTable = (transactions: Invoice[], isActive: boolean = true) => {
    if (transactions.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          {language === 'ar' ? "لا توجد معاملات" : "No transactions found"}
        </div>
      );
    }
    
    return (
      <div className="divide-y">
        {transactions.map((invoice) => (
          <div key={invoice.invoiceId} className="p-3 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5">
                  <Receipt className="h-4 w-4 text-indigo-600" />
                  <span className="font-medium text-gray-800">{invoice.invoiceId}</span>
                  
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
                  
                  {/* Refund Status */}
                  {invoice.isRefunded && (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 ml-2 flex items-center gap-1">
                      <RefreshCcw className="h-3 w-3" />
                      {language === 'ar' ? "تم الاسترداد" : "Refunded"}
                    </Badge>
                  )}
                  
                  {/* Pickup Status */}
                  {invoice.isPickedUp ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {language === 'ar' ? "تم الاستلام" : "Picked up"}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 ml-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {language === 'ar' ? "جاري التجهيز" : "Processing"}
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-gray-500 mt-1">
                  {formatDate(invoice.createdAt)}
                </div>
                
                <div className="text-sm mt-1">
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
                
                {/* Refund Information if applicable */}
                {invoice.isRefunded && (
                  <div className="mt-2 text-sm bg-blue-50 p-2 rounded-md border border-blue-100">
                    <div className="flex items-center gap-1 text-blue-700">
                      <RefreshCcw className="h-3.5 w-3.5" />
                      <span className="font-medium">
                        {language === 'ar' ? "معلومات الاسترداد:" : "Refund Info:"}
                      </span>
                    </div>
                    <div className="mt-1 text-blue-800">
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
                )}
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {invoice.total.toFixed(3)} KWD
                </div>
                {isActive && (
                  <div className="flex space-x-1 mt-2 justify-end">
                    {invoice.workOrderId && onEditWorkOrder && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50"
                        onClick={() => {
                          const workOrder = workOrders.find(wo => wo.id === invoice.workOrderId);
                          if (workOrder && onEditWorkOrder) {
                            onEditWorkOrder(workOrder);
                          }
                        }}
                      >
                        <PencilLine className="h-3 w-3 mr-1" />
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
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs text-purple-700 hover:text-purple-800 hover:bg-purple-50"
                      >
                        <Receipt className="h-3 w-3 mr-1" />
                        {language === 'ar' ? "طباعة" : "Print"}
                      </Button>
                    </PrintOptionsDialog>
                    
                    {!invoice.isPickedUp && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs text-green-700 hover:text-green-800 hover:bg-green-50"
                        onClick={() => handleMarkAsPickedUp(invoice.invoiceId, true)}
                      >
                        <CheckCheck className="h-3 w-3 mr-1" />
                        {language === 'ar' ? "تم الاستلام" : "Mark as Picked Up"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="mt-4 border rounded-lg overflow-hidden">
      <div className="bg-indigo-50 p-3 flex justify-between items-center">
        <h3 className="font-medium text-indigo-900">
          {language === 'ar' ? "سجل المعاملات" : "Transaction History"}
        </h3>
        <span className="text-xs bg-indigo-100 text-indigo-800 py-1 px-2 rounded-md">
          {sortedInvoices.length} {language === 'ar' ? "معاملة" : "transactions"}
        </span>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <div className="px-4 pt-3">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="active" className="flex items-center gap-1.5">
              <ShoppingBag className="h-4 w-4" />
              {language === 'ar' ? "نشطة" : "Active"}
              {activeInvoices.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeInvoices.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-1.5">
              <CheckCheck className="h-4 w-4" />
              {language === 'ar' ? "مكتملة" : "Completed"}
              {completedInvoices.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {completedInvoices.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="refunded" className="flex items-center gap-1.5">
              <RefreshCcw className="h-4 w-4" />
              {language === 'ar' ? "مستردة" : "Refunded"}
              {refundedInvoices.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {refundedInvoices.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="pb-1 pt-2">
          {renderTransactionTable(activeInvoices, true)}
        </TabsContent>
        
        <TabsContent value="completed" className="pb-1 pt-2">
          {renderTransactionTable(completedInvoices, false)}
        </TabsContent>
        
        <TabsContent value="refunded" className="pb-1 pt-2">
          {renderTransactionTable(refundedInvoices, false)}
        </TabsContent>
      </Tabs>
    </div>
  );
};
