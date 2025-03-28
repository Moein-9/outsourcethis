
import React, { useState, useEffect } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/store/languageStore';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { EditWorkOrderDialog } from './EditWorkOrderDialog';
import { Eye, Pencil, Receipt, Calendar, DollarSign, Printer, CheckCircle, CreditCard, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrintOptionsDialog } from './PrintOptionsDialog';
import { toast } from 'sonner';
import { usePatientStore } from '@/store/patientStore';
import { CustomPrintService } from '@/utils/CustomPrintService';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion';
import { ProductDetailsDisplay } from './ProductDetailsDisplay';

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
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  
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
  
  const toggleAccordion = (invoiceId: string) => {
    setExpandedAccordion(expandedAccordion === invoiceId ? null : invoiceId);
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
                  const paid = invoice.payments 
                    ? invoice.payments.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0)
                    : invoice.deposit || 0;
                  
                  return (
                    <React.Fragment key={invoice.invoiceId}>
                      <TableRow className="hover:bg-accent/5 transition-colors cursor-pointer" onClick={() => toggleAccordion(invoice.invoiceId)}>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              viewInvoiceDetails(invoice);
                            }}
                            title={t("view")}
                            className="hover:bg-blue-100 hover:text-blue-700 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {!invoice.isPickedUp && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(invoice);
                              }}
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
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </PrintOptionsDialog>
                          
                          {!invoice.isPickedUp && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsPickedUp(invoice.invoiceId, true);
                              }}
                              title={language === 'ar' ? "تم الاستلام" : "Mark as Picked Up"}
                              className="hover:bg-green-100 hover:text-green-700 transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                      
                      {/* Expandable detail section */}
                      <TableRow className={expandedAccordion === invoice.invoiceId ? "" : "hidden"}>
                        <TableCell colSpan={5} className="p-0">
                          <div className="bg-gray-50 p-4 border-t">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-sm font-medium mb-2 flex items-center gap-1 text-primary">
                                  <Package className="h-4 w-4" />
                                  {t('productDetails')}
                                </h3>
                                <ProductDetailsDisplay invoice={invoice} />
                              </div>
                              
                              <div>
                                <h3 className="text-sm font-medium mb-2 flex items-center gap-1 text-primary">
                                  <CreditCard className="h-4 w-4" />
                                  {t('paymentDetails')}
                                </h3>
                                <div className="bg-white border border-gray-200 rounded-md p-4">
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="text-sm text-gray-500">{t('total')}:</div>
                                      <div className="text-sm font-medium">{invoice.total.toFixed(3)} KWD</div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="text-sm text-gray-500">{t('paid')}:</div>
                                      <div className="text-sm font-medium text-blue-600">{paid.toFixed(3)} KWD</div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="text-sm text-gray-500">{t('remaining')}:</div>
                                      <div className="text-sm font-medium text-amber-600">{remaining.toFixed(3)} KWD</div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="text-sm text-gray-500">{t('paymentStatus')}:</div>
                                      <div className="text-sm font-medium">
                                        {isPaid ? 
                                          <span className="text-green-600">{t('paid')}</span> : 
                                          <span className="text-amber-600">{t('partiallyPaid')}</span>
                                        }
                                      </div>
                                    </div>
                                    
                                    {invoice.discount > 0 && (
                                      <div className="grid grid-cols-2 gap-2">
                                        <div className="text-sm text-gray-500">{t('discount')}:</div>
                                        <div className="text-sm font-medium text-green-600">{invoice.discount.toFixed(3)} KWD</div>
                                      </div>
                                    )}
                                    
                                    {/* Payment History */}
                                    {invoice.payments && invoice.payments.length > 0 && (
                                      <div className="mt-3 pt-3 border-t border-gray-100">
                                        <h4 className="text-xs font-medium text-gray-600 mb-2">{t('paymentHistory')}:</h4>
                                        {invoice.payments.map((payment: any, idx: number) => (
                                          <div key={idx} className="grid grid-cols-3 gap-2 text-xs mb-1">
                                            <div>{format(new Date(payment.date), 'dd/MM/yyyy')}</div>
                                            <div className="text-gray-600">{payment.method}</div>
                                            <div className="font-medium">{payment.amount.toFixed(3)} KWD</div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
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
