import React, { useState, useEffect } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/store/languageStore';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { EditWorkOrderDialog } from './EditWorkOrderDialog';
import { Eye, Pencil, Receipt, Calendar, DollarSign, Printer, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrintOptionsDialog } from './PrintOptionsDialog';
import { toast } from 'sonner';
import { usePatientStore } from '@/store/patientStore';
import { CustomPrintService } from '@/utils/CustomPrintService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface PatientTransactionHistoryProps {
  patientId: string;
}

export const PatientTransactionHistory: React.FC<PatientTransactionHistoryProps> = ({ patientId }) => {
  const { t, language } = useLanguageStore();
  const { invoices, markAsPickedUp } = useInvoiceStore();
  const { getPatientById } = usePatientStore();
  const navigate = useNavigate();
  const isRtl = language === 'ar';
  
  const [editingWorkOrder, setEditingWorkOrder] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [pickedUpInvoices, setPickedUpInvoices] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('active');
  
  const patient = getPatientById(patientId);
  
  const patientInvoices = invoices.filter(invoice => 
    invoice.patientId === patientId
  );
  
  const activeInvoices = patientInvoices.filter(invoice => 
    !pickedUpInvoices.includes(invoice.invoiceId) && !invoice.isPickedUp
  );
  
  const completedInvoices = patientInvoices.filter(invoice => 
    pickedUpInvoices.includes(invoice.invoiceId) || invoice.isPickedUp
  );
  
  useEffect(() => {
  }, [refreshTrigger]);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPp', { locale: isRtl ? ar : undefined });
    } catch (error) {
      return dateString;
    }
  };
  
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: isRtl ? ar : undefined });
    } catch (error) {
      return "";
    }
  };
  
  const calculateRemaining = (invoice: any) => {
    if (invoice.invoiceType === 'contacts' && invoice.contactLensItems?.length) {
      const contactLensTotal = invoice.contactLensItems.reduce(
        (sum: number, lens: any) => sum + (lens.price || 0) * (lens.qty || 1), 0
      );
      const total = Math.max(0, contactLensTotal - (invoice.discount || 0));
      const paid = invoice.payments 
        ? invoice.payments.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0)
        : invoice.deposit || 0;
      
      return total - paid;
    }
    
    const total = invoice.total || 0;
    const paid = invoice.payments 
      ? invoice.payments.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0)
      : invoice.deposit || 0;
    
    return total - paid;
  };
  
  const handleEdit = (invoice: any) => {
    setEditingWorkOrder(invoice);
    setEditDialogOpen(true);
  };
  
  const viewInvoiceDetails = (invoice: any) => {
    navigate('/', { state: { section: 'remainingPayments', selectedInvoice: invoice.invoiceId } });
  };
  
  const handlePrintWorkOrder = (workOrder: any, invoice?: any) => {
    console.log("Printing work order:", workOrder);
    try {
      CustomPrintService.printWorkOrder(workOrder, invoice, patient);
      toast.success(language === 'ar' ? "تم إرسال أمر العمل للطباعة" : "Work order sent to printer");
    } catch (error) {
      console.error("Error printing work order:", error);
      toast.error(language === 'ar' ? "حدث خطأ أثناء الطباعة" : "Error printing work order");
    }
  };

  const handlePrintInvoice = (invoice: any) => {
    console.log("Printing invoice:", invoice);
    try {
      CustomPrintService.printInvoice(invoice);
      toast.success(language === 'ar' ? "تم إرسال الفاتورة للطباعة" : "Invoice sent to printer");
    } catch (error) {
      console.error("Error printing invoice:", error);
      toast.error(language === 'ar' ? "حدث خطأ أثناء طباعة الفاتورة" : "Error printing invoice");
    }
  };
  
  const handleMarkAsPickedUp = (id: string, isInvoice: boolean = true) => {
    setPickedUpInvoices(prev => [...prev, id]);
    markAsPickedUp(id, isInvoice);
    toast.success(language === 'ar' ? "تم تسليم الطلب بنجاح" : "Order has been marked as picked up");
    setTimeout(() => {
      setActiveTab('completed');
    }, 300);
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 500);
  };
  
  if (!patientInvoices.length) {
    return (
      <Card className="mt-8">
        <CardHeader className="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            {t("transactionHistory")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-center text-muted-foreground py-4">
            {t("noTransactionsYet")}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const sortedActiveInvoices = [...activeInvoices].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const sortedCompletedInvoices = [...completedInvoices].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return (
    <>
      <div className="mt-8">
        <div className="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground p-4 rounded-t-lg flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          <h3 className="font-medium text-lg">{t("transactionHistory")}</h3>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="border border-t-0 rounded-b-lg overflow-hidden">
          <TabsList className="w-full grid grid-cols-2 rounded-none bg-gradient-to-r from-background/90 to-muted/50 border-b">
            <TabsTrigger value="active" className="rounded-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-800">
              {language === 'ar' ? "المعاملات النشطة" : "Active Transactions"}
              {sortedActiveInvoices.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                  {sortedActiveInvoices.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-none data-[state=active]:bg-green-50 data-[state=active]:text-green-800">
              {language === 'ar' ? "المعاملات المكتملة" : "Completed Transactions"}
              {sortedCompletedInvoices.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                  {sortedCompletedInvoices.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="p-0 animate-fade-in">
            {sortedActiveInvoices.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>{t("invoiceId")}</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {t("date")}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          {t("total")}
                        </div>
                      </TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedActiveInvoices.map((invoice) => {
                      const remaining = calculateRemaining(invoice);
                      const isPaid = remaining <= 0;
                      
                      return (
                        <TableRow key={invoice.invoiceId} className="hover:bg-accent/5 transition-colors animate-fade-in">
                          <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                          <TableCell>
                            <div>{formatDate(invoice.createdAt)}</div>
                            {invoice.lastEditedAt && (
                              <div className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                {language === 'ar' ? "تم التعديل: " : "Last edited: "}
                                {formatTime(invoice.lastEditedAt)}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{invoice.total.toFixed(3)} KWD</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isPaid 
                                ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300' 
                                : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200'
                            }`}>
                              {isPaid ? t("paid") : t("partiallyPaid")}
                            </span>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => viewInvoiceDetails(invoice)}
                              title={t("view")}
                              className="hover:bg-blue-100 hover:text-blue-700 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEdit(invoice)}
                              title={t("edit")}
                              className="hover:bg-amber-100 hover:text-amber-700 transition-colors"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            
                            <PrintOptionsDialog
                              workOrder={invoice}
                              invoice={invoice}
                              patient={patient}
                              onPrintWorkOrder={() => handlePrintWorkOrder(invoice)}
                              onPrintInvoice={() => handlePrintInvoice(invoice)}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-purple-100 hover:text-purple-700 transition-colors"
                                title={t("print")}
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                            </PrintOptionsDialog>
                            
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleMarkAsPickedUp(invoice.invoiceId, true)}
                              title={language === 'ar' ? "تم الاستلام" : "Mark as Picked Up"}
                              className="hover:bg-green-100 hover:text-green-700 transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground bg-blue-50/20">
                {t("noActiveTransactions")}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="p-0 animate-fade-in">
            {sortedCompletedInvoices.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-green-50">
                      <TableHead>{t("invoiceId")}</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {t("date")}
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          {t("total")}
                        </div>
                      </TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCompletedInvoices.map((invoice) => {
                      const remaining = calculateRemaining(invoice);
                      const isPaid = remaining <= 0;
                      const pickedUpAt = invoice.pickedUpAt || new Date().toISOString();
                      
                      return (
                        <TableRow key={invoice.invoiceId} className="hover:bg-green-50 transition-colors animate-fade-in">
                          <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                          <TableCell>
                            <div>{formatDate(invoice.createdAt)}</div>
                            <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {language === 'ar' ? "تم الاستلام: " : "Picked up: "}
                              {formatTime(pickedUpAt)}
                            </div>
                            {invoice.lastEditedAt && (
                              <div className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                {language === 'ar' ? "تم التعديل: " : "Last edited: "}
                                {formatTime(invoice.lastEditedAt)}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{invoice.total.toFixed(3)} KWD</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300">
                              {t("pickedUp")}
                            </span>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => viewInvoiceDetails(invoice)}
                              title={t("view")}
                              className="hover:bg-blue-100 hover:text-blue-700 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <PrintOptionsDialog
                              workOrder={invoice}
                              invoice={invoice}
                              patient={patient}
                              onPrintWorkOrder={() => handlePrintWorkOrder(invoice)}
                              onPrintInvoice={() => handlePrintInvoice(invoice)}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-purple-100 hover:text-purple-700 transition-colors"
                                title={t("print")}
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                            </PrintOptionsDialog>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground bg-green-50/20">
                {language === 'ar' ? "لا توجد معاملات مكتملة" : "No completed transactions"}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {editingWorkOrder && (
        <EditWorkOrderDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          workOrder={editingWorkOrder}
          onSave={(updatedWorkOrder) => {
            setEditDialogOpen(false);
            setRefreshTrigger(prev => prev + 1);
          }}
        />
      )}
    </>
  );
};
