
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, WorkOrder } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PencilLine, Receipt, Clock, CheckCircle, RefreshCcw, Printer, Package } from "lucide-react";
import { format, isValid } from "date-fns";
import { toast } from "sonner";
import { ReceiptInvoice } from "./ReceiptInvoice";
import { RefundReceiptTemplate } from "./RefundReceiptTemplate"; 
import { WorkOrderPrintSelector } from "./WorkOrderPrintSelector";
import ReactDOMServer from 'react-dom/server';
import { PrintService } from "@/utils/PrintService";

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
  const { language, t } = useLanguageStore();

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

  // Filter invoices into active, completed and refunded
  const activeInvoices = sortedInvoices.filter(invoice => !invoice.isPickedUp && !invoice.isRefunded);
  const completedInvoices = sortedInvoices.filter(invoice => invoice.isPickedUp && !invoice.isRefunded);
  const refundedInvoices = sortedInvoices.filter(invoice => invoice.isRefunded);

  const handlePrintInvoice = (invoice: Invoice) => {
    try {
      // Create receipt content using client-side ReactDOMServer
      const receiptContent = ReactDOMServer.renderToString(
        <ReceiptInvoice invoice={invoice} isPrintable={true} />
      );
      
      // Prepare the HTML for printing
      const htmlContent = PrintService.prepareReceiptDocument(receiptContent, `Invoice ${invoice.invoiceId}`);
      
      // Print the receipt
      PrintService.printHtml(htmlContent, 'receipt', () => {
        toast.success(language === 'ar' ? "تمت طباعة الفاتورة بنجاح" : "Invoice printed successfully");
      });
    } catch (error) {
      console.error("Print error:", error);
      toast.error(language === 'ar' ? "حدث خطأ أثناء الطباعة" : "Error printing invoice");
    }
  };

  const handlePrintRefundInvoice = (invoice: Invoice) => {
    try {
      // For refunded invoices, use the RefundReceiptTemplate
      const refundData = {
        refundId: invoice.refundId || `RF${Date.now()}`,
        invoiceId: invoice.invoiceId,
        patientName: invoice.patientName,
        patientPhone: invoice.patientPhone,
        patientId: invoice.patientId,
        refundAmount: invoice.refundAmount || 0,
        refundMethod: invoice.refundMethod || "Cash",
        refundReason: invoice.refundReason || "",
        refundDate: invoice.refundDate || new Date().toISOString(),
        originalTotal: invoice.total,
        frameBrand: invoice.frameBrand,
        frameModel: invoice.frameModel,
        frameColor: invoice.frameColor,
        lensType: invoice.lensType,
        invoiceItems: [
          ...(invoice.frameBrand ? [{ name: invoice.frameBrand, price: invoice.framePrice }] : []),
          ...(invoice.lensType ? [{ name: invoice.lensType, price: invoice.lensPrice }] : []),
          ...(invoice.coating ? [{ name: invoice.coating, price: invoice.coatingPrice }] : [])
        ]
      };
      
      // Create refund receipt content
      const receiptContent = ReactDOMServer.renderToString(
        <RefundReceiptTemplate refund={refundData} language={language} />
      );
      
      // Prepare the HTML for printing with a special title
      const htmlContent = PrintService.prepareReceiptDocument(
        receiptContent, 
        `Refund ${invoice.invoiceId}`
      );
      
      // Print the refund receipt
      PrintService.printHtml(htmlContent, 'receipt', () => {
        toast.success(language === 'ar' ? "تمت طباعة إيصال الاسترداد بنجاح" : "Refund receipt printed successfully");
      });
    } catch (error) {
      console.error("Print error:", error);
      toast.error(language === 'ar' ? "حدث خطأ أثناء طباعة إيصال الاسترداد" : "Error printing refund receipt");
    }
  };

  const renderInvoiceItem = (invoice: Invoice, isRefundSection = false) => {
    // Determine if this is a refunded invoice to apply special styling
    const isRefunded = invoice.isRefunded;
    const refundBgClass = isRefunded ? "bg-red-50" : "";
    
    // Find the work order associated with this invoice
    const workOrder = invoice.workOrderId ? 
      workOrders.find(wo => wo.id === invoice.workOrderId) : undefined;
    
    return (
      <div key={invoice.invoiceId} className={`p-3 hover:bg-gray-50 border-b last:border-b-0 ${refundBgClass}`}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
          <div className="flex-1">
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
                <Badge className="bg-red-100 text-red-800 hover:bg-red-200 ml-2 flex items-center gap-1">
                  <RefreshCcw className="h-3 w-3" />
                  {language === 'ar' ? "تم الاسترداد" : "Refunded"}
                </Badge>
              )}
              
              {/* Pickup Status - Only show if not refunded */}
              {!invoice.isRefunded && (
                invoice.isPickedUp ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {language === 'ar' ? "تم الاستلام" : "Picked up"}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 ml-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {language === 'ar' ? "جاري التجهيز" : "Processing"}
                  </Badge>
                )
              )}
            </div>
            
            <div className="text-sm text-gray-500 mt-2">
              {language === 'ar' ? "تاريخ الإنشاء:" : "Created:"} {formatDate(invoice.createdAt)}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 bg-gray-50 p-2 rounded-md">
              <div>
                <h4 className="text-xs text-gray-500">{language === 'ar' ? "نوع الفاتورة" : "Invoice Type"}</h4>
                <p className="font-medium">
                  {invoice.invoiceType === 'glasses' ? 
                    (language === 'ar' ? "نظارات" : "Glasses") : 
                    (language === 'ar' ? "عدسات لاصقة" : "Contact Lenses")}
                </p>
              </div>
              <div>
                <h4 className="text-xs text-gray-500">{language === 'ar' ? "الحالة" : "Status"}</h4>
                <p className="font-medium">
                  {invoice.isRefunded ? 
                    (language === 'ar' ? "مسترد" : "Refunded") : 
                    invoice.isPickedUp ? 
                      (language === 'ar' ? "مكتمل" : "Completed") : 
                      (language === 'ar' ? "قيد التنفيذ" : "In Progress")}
                </p>
              </div>
            </div>
            
            <div className="mt-3 bg-white border rounded-md p-2">
              <h4 className="text-sm font-medium mb-1">{language === 'ar' ? "تفاصيل المنتج" : "Product Details"}</h4>
              
              {invoice.invoiceType === 'glasses' ? (
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'ar' ? "الإطار:" : "Frame:"}</span>
                    <span>{invoice.frameBrand} {invoice.frameModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{language === 'ar' ? "نوع العدسة:" : "Lens Type:"}</span>
                    <span>{invoice.lensType}</span>
                  </div>
                  {invoice.coating && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{language === 'ar' ? "الطلاء:" : "Coating:"}</span>
                      <span>{invoice.coating}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm">
                  {language === 'ar' ? "عدسات لاصقة" : "Contact Lenses"}
                </div>
              )}
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <h4 className="text-xs text-gray-500">{language === 'ar' ? "المبلغ الإجمالي" : "Total Amount"}</h4>
                <p className="font-bold text-base">{invoice.total.toFixed(3)} KWD</p>
              </div>
              <div>
                <h4 className="text-xs text-gray-500">{language === 'ar' ? "المبلغ المتبقي" : "Remaining"}</h4>
                <p className={`font-medium text-base ${invoice.remaining > 0 ? "text-amber-600" : "text-green-600"}`}>
                  {invoice.remaining.toFixed(3)} KWD
                </p>
              </div>
            </div>
            
            {/* Refund Information if applicable */}
            {invoice.isRefunded && (
              <div className="mt-3 text-sm bg-red-50 p-2 rounded-md border border-red-100">
                <div className="flex items-center gap-1 text-red-700">
                  <RefreshCcw className="h-3.5 w-3.5" />
                  <span className="font-medium">
                    {language === 'ar' ? "معلومات الاسترداد:" : "Refund Info:"}
                  </span>
                </div>
                <div className="mt-1 text-red-800 grid grid-cols-2 gap-x-2 gap-y-1">
                  <div>
                    {language === 'ar' ? `المبلغ:` : `Amount:`}
                    <span className="font-medium"> {invoice.refundAmount?.toFixed(3)} KWD</span>
                  </div>
                  <div>
                    {language === 'ar' ? `التاريخ:` : `Date:`}
                    <span className="font-medium"> {formatDate(invoice.refundDate || '')}</span>
                  </div>
                  <div>
                    {language === 'ar' ? `الطريقة:` : `Method:`}
                    <span className="font-medium"> {invoice.refundMethod}</span>
                  </div>
                  <div>
                    {language === 'ar' ? `السبب:` : `Reason:`}
                    <span className="font-medium"> {invoice.refundReason}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-row md:flex-col gap-2">
            {isRefundSection ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs text-red-700 hover:text-red-800 hover:bg-red-50"
                onClick={() => handlePrintRefundInvoice(invoice)}
              >
                <Printer className="h-3 w-3 mr-1" />
                {language === 'ar' ? "طباعة إيصال الاسترداد" : "Print Refund Receipt"}
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                  onClick={() => handlePrintInvoice(invoice)}
                >
                  <Printer className="h-3 w-3 mr-1" />
                  {language === 'ar' ? "طباعة الفاتورة" : "Print Invoice"}
                </Button>
                
                {!invoice.isPickedUp && !invoice.isRefunded && invoice.workOrderId && (
                  <WorkOrderPrintSelector
                    invoice={invoice}
                    patientName={invoice.patientName}
                    patientPhone={invoice.patientPhone}
                    rx={workOrder?.rx}
                    lensType={invoice.lensType}
                    coating={invoice.coating}
                    frame={{
                      brand: invoice.frameBrand,
                      model: invoice.frameModel,
                      color: invoice.frameColor,
                      size: invoice.frameSize || '',
                      price: invoice.framePrice
                    }}
                    contactLenses={invoice.contactLensItems}
                    contactLensRx={invoice.contactLensRx}
                    trigger={
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs text-green-700 hover:text-green-800 hover:bg-green-50"
                      >
                        <Receipt className="h-3 w-3 mr-1" />
                        {language === 'ar' ? "طباعة أمر العمل" : "Print Work Order"}
                      </Button>
                    }
                  />
                )}
              </>
            )}
            
            {!invoice.isPickedUp && !invoice.isRefunded && invoice.workOrderId && onEditWorkOrder && (
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
            
            {!invoice.isPickedUp && !invoice.isRefunded && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs text-purple-700 hover:text-purple-800 hover:bg-purple-50"
              >
                <Package className="h-3 w-3 mr-1" />
                {language === 'ar' ? "تحديث الحالة" : "Mark as Picked Up"}
              </Button>
            )}
          </div>
        </div>
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
        <div className="px-3 pt-2 bg-gray-50 border-b">
          <TabsList className="grid grid-cols-3">
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
            <TabsTrigger value="refunded" className="text-sm">
              {language === 'ar' ? "المعاملات المستردة" : "Refunded Transactions"}
              {refundedInvoices.length > 0 && (
                <span className="ml-1.5 bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded-full">
                  {refundedInvoices.length}
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

        <TabsContent value="refunded" className="mt-0">
          {refundedInvoices.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {language === 'ar' ? "لا توجد معاملات مستردة" : "No refunded transactions"}
            </div>
          ) : (
            <div className="divide-y">
              {refundedInvoices.map(invoice => renderInvoiceItem(invoice, true))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
