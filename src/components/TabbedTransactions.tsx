import React, { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { Invoice, WorkOrder, useInvoiceStore } from '@/store/invoiceStore';
import { Patient } from '@/store/patientStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format, isValid, formatDistanceToNow } from 'date-fns';
import { PencilLine, Receipt, Clock, CheckCircle, RefreshCcw, AlertTriangle, ShoppingBag, CheckCheck, Ban, User, Phone, Calendar, History, Archive, Trash2 } from 'lucide-react';
import { PrintOptionsDialog } from './PrintOptionsDialog';
import { CustomPrintService } from '@/utils/CustomPrintService';
import { toast } from 'sonner';
import { PrintReportButton } from './reports/PrintReportButton';
import { RefundReceiptTemplate } from './RefundReceiptTemplate';
import * as ReactDOMServer from 'react-dom/server';
import { PrintService } from '@/utils/PrintService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { DeleteOrderConfirmDialog } from './DeleteOrderConfirmDialog';

interface TabbedTransactionsProps {
  invoices: Invoice[];
  workOrders: WorkOrder[];
  refundedInvoices: Invoice[];
  archivedInvoices: Invoice[];
  archivedWorkOrders: WorkOrder[];
  patient?: Patient;
  onDeleteWorkOrder?: (workOrder: WorkOrder) => void;
  lastEditTimestamp?: string | null;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const TabbedTransactions: React.FC<TabbedTransactionsProps> = ({
  invoices,
  workOrders,
  refundedInvoices,
  archivedInvoices,
  archivedWorkOrders,
  patient,
  onDeleteWorkOrder,
  lastEditTimestamp,
  activeTab: externalActiveTab,
  onTabChange
}) => {
  const { language, t } = useLanguageStore();
  const { markAsPickedUp } = useInvoiceStore();
  const [internalActiveTab, setInternalActiveTab] = useState('active');
  const [pickedUpInvoices, setPickedUpInvoices] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Use either external (controlled) or internal (uncontrolled) active tab
  const activeTab = externalActiveTab || internalActiveTab;
  
  // Handle tab change, either through external handler or internal state
  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    } else {
      setInternalActiveTab(value);
    }
  };
  
  // Sort invoices by date, newest first
  const sortedInvoices = [...invoices].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Filter active (not picked up and not refunded)
  const activeInvoices = sortedInvoices
    .filter(invoice => !invoice.isPickedUp && !invoice.isRefunded)
    .filter(invoice => !pickedUpInvoices.includes(invoice.invoiceId)); // Also exclude locally picked up invoices
  
  // Filter completed (picked up and not refunded)
  const completedInvoices = [...sortedInvoices
    .filter(invoice => invoice.isPickedUp && !invoice.isRefunded),
    // Also include locally picked up invoices that haven't synced from the store yet
    ...sortedInvoices.filter(invoice => pickedUpInvoices.includes(invoice.invoiceId))
  ];
  
  // Remove duplicates from completedInvoices (in case an invoice is in both lists)
  const uniqueCompletedInvoices = completedInvoices.filter((invoice, index, self) =>
    index === self.findIndex((i) => i.invoiceId === invoice.invoiceId)
  );
  
  // Sort archived items by date, newest first
  const sortedArchivedInvoices = [...archivedInvoices].sort((a, b) => 
    new Date(b.archivedAt || b.createdAt).getTime() - new Date(a.archivedAt || a.createdAt).getTime()
  );
  
  // Effect to force refresh on lastEditTimestamp change
  useEffect(() => {
    if (lastEditTimestamp) {
      setRefreshTrigger(prev => prev + 1);
    }
  }, [lastEditTimestamp]);
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, "dd/MM/yyyy") : "Invalid Date";
    } catch (error) {
      return "Invalid Date";
    }
  };
  
  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return "";
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "";
    }
  };
  
  const handlePrintWorkOrder = (workOrder: WorkOrder) => {
    const relatedInvoice = invoices.find(inv => inv.workOrderId === workOrder.id);
    CustomPrintService.printWorkOrder(workOrder, relatedInvoice, patient);
  };
  
  const handlePrintInvoice = (invoice: Invoice) => {
    if (typeof CustomPrintService.printInvoice === 'function') {
      CustomPrintService.printInvoice(invoice);
    } else {
      console.error('CustomPrintService.printInvoice is not implemented');
    }
  };
  
  const handlePrintRefundReceipt = (invoice: Invoice) => {
    const refundReceiptHTML = ReactDOMServer.renderToString(<RefundReceiptTemplate invoice={invoice} />);
    PrintService.printReport(refundReceiptHTML, `Refund Receipt - ${invoice.invoiceId}`);
  };
  
  const handleMarkAsPickedUp = (id: string, isInvoice: boolean = true) => {
    setPickedUpInvoices(prev => [...prev, id]);
    toast.success(language === 'ar' ? "تم تسليم الطلب بنجاح" : "Order has been marked as picked up");
    setTimeout(() => {
      handleTabChange('completed');
    }, 300);
    markAsPickedUp(id, isInvoice);
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 500);
  };
  
  const renderActiveTable = (activeInvoices: Invoice[]) => {
    if (activeInvoices.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg my-2">
          <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p className="font-medium">{language === 'ar' ? "لا توجد طلبات نشطة" : "No active orders"}</p>
        </div>
      );
    }
    
    return (
      <div className="divide-y border border-gray-200 rounded-lg overflow-hidden">
        {activeInvoices.map((invoice) => (
          <div key={invoice.invoiceId} className="p-4 hover:bg-gray-50 transition-all">
            <div className="flex justify-between items-start">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold text-gray-900 text-lg">{invoice.invoiceId}</span>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 ml-2">
                    {language === 'ar' ? "نشط" : "Active"}
                  </Badge>
                </div>
                
                <div className="text-sm font-medium">
                  {invoice.patientName || t('anonymous')}
                </div>
                
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(invoice.createdAt)}
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-gray-900 text-xl">
                  {invoice.total.toFixed(3)} KWD
                </div>
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300"
                    onClick={() => handlePrintInvoice(invoice)}
                  >
                    <Receipt className="h-3.5 w-3.5 mr-1" />
                    {language === 'ar' ? "طباعة الفاتورة" : "Print Invoice"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderCompletedTable = (completedInvoices: Invoice[]) => {
    if (completedInvoices.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg my-2">
          <CheckCheck className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p className="font-medium">{language === 'ar' ? "لا توجد طلبات مكتملة" : "No completed orders"}</p>
        </div>
      );
    }
    
    return (
      <div className="divide-y border border-gray-200 rounded-lg overflow-hidden">
        {completedInvoices.map((invoice) => (
          <div key={invoice.invoiceId} className="p-4 hover:bg-gray-50 transition-all">
            <div className="flex justify-between items-start">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-1.5">
                  <CheckCheck className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold text-gray-900 text-lg">{invoice.invoiceId}</span>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 ml-2">
                    {language === 'ar' ? "مكتمل" : "Completed"}
                  </Badge>
                </div>
                
                <div className="text-sm font-medium">
                  {invoice.patientName || t('anonymous')}
                </div>
                
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(invoice.createdAt)}
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-gray-900 text-xl">
                  {invoice.total.toFixed(3)} KWD
                </div>
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300"
                    onClick={() => handlePrintInvoice(invoice)}
                  >
                    <Receipt className="h-3.5 w-3.5 mr-1" />
                    {language === 'ar' ? "طباعة الفاتورة" : "Print Invoice"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderRefundedTable = (transactions: Invoice[]) => {
    if (transactions.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg my-2">
          <RefreshCcw className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p className="font-medium">
            {language === 'ar' ? "لا توجد مبالغ مستردة" : "No refunded transactions"}
          </p>
        </div>
      );
    }
    
    return (
      <div className="divide-y border border-red-200 rounded-lg overflow-hidden bg-gradient-to-r from-red-50/30 to-pink-50/30">
        {transactions.map((invoice) => {
          return (
            <div key={invoice.invoiceId} className="p-4 hover:bg-red-50/60 transition-all">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-1.5">
                    <RefreshCcw className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-900 text-lg">{invoice.invoiceId}</span>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 ml-2">
                      {language === 'ar' ? "مسترد" : "Refunded"}
                    </Badge>
                  </div>
                  
                  {/* Refund Details */}
                  <Card className="bg-red-50/80 border-red-200 max-w-xs">
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-1.5">
                        <Receipt className="h-4 w-4" />
                        {language === 'ar' ? "معلومات الاسترداد" : "Refund Info"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3 pt-0 space-y-1">
                      <div className="text-sm font-medium">
                        {invoice.patientName || t('anonymous')}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(invoice.createdAt)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="text-sm mt-1 font-medium text-red-700">
                    {invoice.invoiceType === 'glasses' ? (
                      <span>
                        {invoice.frameBrand} {invoice.frameModel} - {invoice.lensType || ''}
                      </span>
                    ) : (
                      <span>
                        {language === 'ar' ? "عدسات لاصقة" : "Contact Lenses"}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-red-900 text-xl">
                    {invoice.total.toFixed(3)} KWD
                  </div>
                  <div className="mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800 hover:border-red-300"
                      onClick={() => handlePrintInvoice(invoice)}
                    >
                      <Receipt className="h-3.5 w-3.5 mr-1" />
                      {language === 'ar' ? "طباعة الفاتورة" : "Print Invoice"}
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
  
  const renderArchivedTable = (sortedArchivedInvoices: Invoice[]) => {
    if (sortedArchivedInvoices.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg my-2">
          <Archive className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p className="font-medium">{language === 'ar' ? "لا توجد طلبات مؤرشفة" : "No archived orders"}</p>
        </div>
      );
    }
    
    return (
      <div className="divide-y border border-gray-200 rounded-lg overflow-hidden">
        {sortedArchivedInvoices.map((invoice) => (
          <div key={invoice.invoiceId} className="p-4 hover:bg-gray-50 transition-all">
            <div className="flex justify-between items-start">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-1.5">
                  <Archive className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold text-gray-900 text-lg">{invoice.invoiceId}</span>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 ml-2">
                    {language === 'ar' ? "مؤرشف" : "Archived"}
                  </Badge>
                </div>
                
                <div className="text-sm font-medium">
                  {invoice.patientName || t('anonymous')}
                </div>
                
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(invoice.createdAt)}
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-gray-900 text-xl">
                  {invoice.total.toFixed(3)} KWD
                </div>
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300"
                    onClick={() => handlePrintInvoice(invoice)}
                  >
                    <Receipt className="h-3.5 w-3.5 mr-1" />
                    {language === 'ar' ? "طباعة الفاتورة" : "Print Invoice"}
                  </Button>
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
          {sortedInvoices.length + refundedInvoices.length + sortedArchivedInvoices.length} {language === 'ar' ? "معاملة" : "transactions"}
        </span>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="w-full grid grid-cols-4">
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
            <TabsTrigger value="archive" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              {language === 'ar' ? "أرشيف" : "Archive"}
              {sortedArchivedInvoices.length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-gray-100 text-gray-800">
                  {sortedArchivedInvoices.length}
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
        
        <TabsContent value="archive" className="pb-4 pt-2 px-4">
          {renderArchivedTable(sortedArchivedInvoices)}
        </TabsContent>
      </Tabs>
    </div>
  );
};
