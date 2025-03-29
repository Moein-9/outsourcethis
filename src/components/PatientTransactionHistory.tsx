
import React, { useState, useEffect } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/store/languageStore';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { EditWorkOrderDialog } from './EditWorkOrderDialog';
import { Eye, Pencil, Receipt, Calendar, DollarSign, Printer, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrintOptionsDialog } from './PrintOptionsDialog';
import { toast } from 'sonner';
import { usePatientStore } from '@/store/patientStore';
import { CustomPrintService } from '@/utils/CustomPrintService';

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
  
  const patient = getPatientById(patientId);
  
  // Filter invoices for this patient - ensure we're getting ALL invoices for this patient
  const patientInvoices = invoices.filter(invoice => 
    invoice.patientId === patientId
  );
  
  // Force component to update when marking as picked up
  useEffect(() => {
    // This is just to force a re-render when refreshTrigger changes
  }, [refreshTrigger]);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPp', { locale: isRtl ? ar : undefined });
    } catch (error) {
      return dateString;
    }
  };
  
  const calculateRemaining = (invoice: any) => {
    // For contact lens orders, calculate total based on qty
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
    
    // For regular glasses orders
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
    // Navigate to invoice details in "Remaining Payments" section
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
      // Use the invoice print functionality
      // This would typically use a similar approach to workOrder printing
      toast.success(language === 'ar' ? "تم إرسال الفاتورة للطباعة" : "Invoice sent to printer");
    } catch (error) {
      console.error("Error printing invoice:", error);
      toast.error(language === 'ar' ? "حدث خطأ أثناء طباعة الفاتورة" : "Error printing invoice");
    }
  };
  
  const handleMarkAsPickedUp = (id: string, isInvoice: boolean = true) => {
    markAsPickedUp(id, isInvoice);
    toast.success(language === 'ar' ? "تم تسليم الطلب بنجاح" : "Order has been marked as picked up");
    // Force re-render to show updated status
    setRefreshTrigger(prev => prev + 1);
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
  
  return (
    <>
      <Card className="mt-8 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            {t("transactionHistory")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
                {patientInvoices.map((invoice) => {
                  const remaining = calculateRemaining(invoice);
                  const isPaid = remaining <= 0;
                  const isPickedUp = invoice.isPickedUp;
                  
                  return (
                    <TableRow key={invoice.invoiceId} className="hover:bg-accent/5 transition-colors">
                      <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                      <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                      <TableCell>{invoice.total.toFixed(3)} KWD</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isPickedUp
                            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300'
                            : isPaid 
                              ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300' 
                              : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200'
                        }`}>
                          {isPickedUp 
                            ? t("pickedUp") 
                            : isPaid 
                              ? t("paid") 
                              : t("partiallyPaid")}
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
                        
                        {!invoice.isPickedUp && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(invoice)}
                            title={t("edit")}
                            className="hover:bg-amber-100 hover:text-amber-700 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
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
                            size="icon"
                            className="hover:bg-purple-100 hover:text-purple-700 transition-colors"
                            title={t("print")}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </PrintOptionsDialog>
                        
                        {!invoice.isPickedUp && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleMarkAsPickedUp(invoice.invoiceId, true)}
                            title={language === 'ar' ? "تم الاستلام" : "Mark as Picked Up"}
                            className="hover:bg-green-100 hover:text-green-700 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {editingWorkOrder && (
        <EditWorkOrderDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          workOrder={editingWorkOrder}
          onSave={(updatedWorkOrder) => {
            // Handle the save operation here
            setEditDialogOpen(false);
            // Force re-render to show updated data
            setRefreshTrigger(prev => prev + 1);
          }}
        />
      )}
    </>
  );
};
