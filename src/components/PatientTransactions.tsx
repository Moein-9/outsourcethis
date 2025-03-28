
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, WorkOrder } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PencilLine, Receipt, Clock, CheckCircle, RefreshCcw, AlertTriangle } from "lucide-react";
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

      <div className="divide-y">
        {sortedInvoices.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {language === 'ar' ? "لا يوجد معاملات" : "No transaction history"}
          </div>
        ) : (
          sortedInvoices.map((invoice) => (
            <div key={invoice.invoiceId} className={`p-3 hover:bg-gray-50 ${invoice.isRefunded ? 'bg-red-50' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Receipt className={`h-4 w-4 ${invoice.isRefunded ? 'text-red-600' : 'text-indigo-600'}`} />
                    <span className={`font-medium ${invoice.isRefunded ? 'text-red-800' : 'text-gray-800'}`}>
                      {invoice.invoiceId}
                    </span>
                    
                    {/* Payment Status */}
                    {invoice.isRefunded ? (
                      <Badge className="bg-red-100 text-red-800 border-red-200 ml-2 flex items-center gap-1">
                        <RefreshCcw className="h-3 w-3" />
                        {language === 'ar' ? "تم الاسترداد" : "Refunded"}
                      </Badge>
                    ) : invoice.isPaid ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2">
                        {language === 'ar' ? "مدفوع" : "Paid"}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 ml-2">
                        {language === 'ar' ? "غير مدفوع" : "Unpaid"}
                      </Badge>
                    )}
                    
                    {/* Pickup Status */}
                    {invoice.isPickedUp && !invoice.isRefunded && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {language === 'ar' ? "تم الاستلام" : "Picked up"}
                      </Badge>
                    )}
                    
                    {!invoice.isPickedUp && !invoice.isRefunded && (
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
                    <div className="mt-2 text-sm bg-red-50 p-2 rounded-md border border-red-100">
                      <div className="flex items-center gap-1 text-red-700">
                        <RefreshCcw className="h-3.5 w-3.5" />
                        <span className="font-medium">
                          {language === 'ar' ? "معلومات الاسترداد:" : "Refund Info:"}
                        </span>
                      </div>
                      <div className="mt-1 text-red-800">
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
                  <div className={`font-semibold ${invoice.isRefunded ? 'text-red-900 line-through' : 'text-gray-900'}`}>
                    {invoice.total.toFixed(3)} KWD
                  </div>
                  {invoice.workOrderId && onEditWorkOrder && !invoice.isRefunded && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-1 h-8 text-xs text-indigo-700 hover:text-indigo-800 hover:bg-indigo-50"
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
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
