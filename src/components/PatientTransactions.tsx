
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, WorkOrder } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PencilLine, Receipt, Clock, CheckCircle, RefreshCcw, AlertTriangle, Printer, Package } from "lucide-react";
import { format, isValid } from "date-fns";

interface PatientTransactionsProps {
  invoices: Invoice[];
  workOrders: WorkOrder[];
  onEditWorkOrder?: (workOrder: WorkOrder) => void;
}

export const PatientTransactions: React.FC<PatientTransactionsProps> = ({
  invoices,
  workOrders,
  onEditWorkOrder
}) => {
  const { language } = useLanguageStore();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, "dd/MM/yyyy") : "Invalid Date";
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Sort invoices by date, newest first
  const sortedInvoices = [...invoices].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Filter invoices into active and completed
  const activeInvoices = sortedInvoices.filter(invoice => !invoice.isPickedUp);
  const completedInvoices = sortedInvoices.filter(invoice => invoice.isPickedUp);
  
  // Separate refunded invoices
  const refundedInvoices = sortedInvoices.filter(invoice => invoice.isRefunded);

  const renderInvoiceItem = (invoice: Invoice) => (
    <div key={invoice.invoiceId} className="p-3 hover:bg-gray-50 border-b last:border-b-0">
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
          
          {!invoice.isPickedUp && invoice.workOrderId && onEditWorkOrder && (
            <div className="flex flex-col gap-1 mt-1">
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
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs text-green-700 hover:text-green-800 hover:bg-green-50"
              >
                <Printer className="h-3 w-3 mr-1" />
                {language === 'ar' ? "طباعة الفاتورة" : "Print Invoice"}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs text-purple-700 hover:text-purple-800 hover:bg-purple-50"
              >
                <Package className="h-3 w-3 mr-1" />
                {language === 'ar' ? "تحديث الحالة" : "Mark as Picked Up"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
        <div className="px-3 pt-2 bg-gray-50 border-b">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="active" className="text-sm">
              {language === 'ar' ? "المعاملات النشطة" : "Active Transactions"}
              {activeInvoices.length > 0 && (
                <span className="ml-1.5 bg-indigo-100 text-indigo-800 text-xs px-1.5 py-0.5 rounded-full">
                  {activeInvoices.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-sm">
              {language === 'ar' ? "المعاملات المكتملة" : "Completed Transactions"}
              {completedInvoices.length > 0 && (
                <span className="ml-1.5 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full">
                  {completedInvoices.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active" className="mt-0">
          {activeInvoices.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {language === 'ar' ? "لا توجد معاملات نشطة" : "No active transactions"}
            </div>
          ) : (
            <div className="divide-y">
              {activeInvoices.map(invoice => renderInvoiceItem(invoice))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          {completedInvoices.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {language === 'ar' ? "لا توجد معاملات مكتملة" : "No completed transactions"}
            </div>
          ) : (
            <div className="divide-y">
              {completedInvoices.map(invoice => renderInvoiceItem(invoice))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Refunded Transactions Section (if any) */}
      {refundedInvoices.length > 0 && (
        <div className="mt-4 border-t pt-2">
          <div className="px-3 py-2 bg-blue-50 flex items-center">
            <RefreshCcw className="h-4 w-4 text-blue-600 mr-2" />
            <h4 className="font-medium text-blue-900">
              {language === 'ar' ? "العناصر المستردة" : "Refunded Items"}
            </h4>
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 py-0.5 px-1.5 rounded-full">
              {refundedInvoices.length}
            </span>
          </div>
          <div className="divide-y">
            {refundedInvoices.map(invoice => renderInvoiceItem(invoice))}
          </div>
        </div>
      )}
    </div>
  );
};
