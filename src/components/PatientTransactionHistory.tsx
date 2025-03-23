
import React, { useState } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/store/languageStore';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { EditWorkOrderDialog } from './EditWorkOrderDialog';
import { Eye, Pencil, Receipt, FileText, ChevronDown, ChevronRight, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrintWorkOrderButton } from './PrintWorkOrderButton';
import { WorkOrderPrintSelector } from './WorkOrderPrintSelector';
import { CustomPrintWorkOrderButton } from './CustomPrintWorkOrderButton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PatientTransactionHistoryProps {
  patientId: string;
}

export const PatientTransactionHistory: React.FC<PatientTransactionHistoryProps> = ({ patientId }) => {
  const { t, language } = useLanguageStore();
  const { invoices } = useInvoiceStore();
  const navigate = useNavigate();
  const isRtl = language === 'ar';
  
  const [editingWorkOrder, setEditingWorkOrder] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  
  // Filter invoices for this patient
  const patientInvoices = invoices.filter(invoice => invoice.patientId === patientId);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPp', { locale: isRtl ? ar : undefined });
    } catch (error) {
      return dateString;
    }
  };
  
  const calculateRemaining = (invoice: any) => {
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
  
  const toggleRowExpand = (invoiceId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [invoiceId]: !prev[invoiceId]
    }));
  };
  
  const printInvoice = (invoice: any) => {
    // Find the patient info from the invoice
    const patient = {
      name: invoice.patientName,
      phone: invoice.patientPhone,
      id: invoice.patientId
    };
    
    // Print the work order using the selector or custom print service
    console.log("Printing invoice:", invoice.invoiceId);
  };
  
  if (!patientInvoices.length) {
    return (
      <Card className="mt-8 w-full">
        <CardHeader className="bg-primary text-primary-foreground">
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
      <Card className="mt-8 w-full">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            {t("transactionHistory")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>{t("invoiceId")}</TableHead>
                  <TableHead>{t("date")}</TableHead>
                  <TableHead>{t("total")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientInvoices.map((invoice) => {
                  const remaining = calculateRemaining(invoice);
                  const isPaid = remaining <= 0;
                  const isExpanded = expandedRows[invoice.invoiceId] || false;
                  
                  return (
                    <React.Fragment key={invoice.invoiceId}>
                      <TableRow>
                        <TableCell className="p-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toggleRowExpand(invoice.invoiceId)}
                            className="h-7 w-7"
                          >
                            {isExpanded ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                          </Button>
                        </TableCell>
                        <TableCell>{invoice.invoiceId}</TableCell>
                        <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                        <TableCell>{invoice.total.toFixed(3)} KWD</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${isPaid ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                            {isPaid ? t("paid") : t("partiallyPaid")}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => viewInvoiceDetails(invoice)}
                            title={t("view")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(invoice)}
                            title={t("edit")}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <WorkOrderPrintSelector
                            invoice={invoice}
                            patientName={invoice.patientName}
                            patientPhone={invoice.patientPhone}
                            rx={invoice.rx}
                            lensType={invoice.lensType}
                            coating={invoice.coating}
                            frame={{
                              brand: invoice.frameBrand || '',
                              model: invoice.frameModel || '',
                              color: invoice.frameColor || '',
                              size: invoice.frameSize || '',
                              price: invoice.framePrice || 0
                            }}
                            trigger={
                              <Button 
                                variant="ghost" 
                                size="icon"
                                title={t("print")}
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                            }
                          />
                        </TableCell>
                      </TableRow>
                      
                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-muted/30 p-4">
                            <div className="grid gap-4">
                              {invoice.frameBrand && (
                                <div className="border rounded p-3 bg-white">
                                  <h4 className="font-medium mb-2">{t("frame")}</h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div><span className="font-medium">{t("brand")}:</span> {invoice.frameBrand}</div>
                                    <div><span className="font-medium">{t("model")}:</span> {invoice.frameModel}</div>
                                    <div><span className="font-medium">{t("color")}:</span> {invoice.frameColor}</div>
                                    <div><span className="font-medium">{t("price")}:</span> {invoice.framePrice.toFixed(3)} KWD</div>
                                  </div>
                                </div>
                              )}
                              
                              {invoice.lensType && (
                                <div className="border rounded p-3 bg-white">
                                  <h4 className="font-medium mb-2">{t("lens")}</h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div><span className="font-medium">{t("type")}:</span> {invoice.lensType}</div>
                                    <div><span className="font-medium">{t("price")}:</span> {invoice.lensPrice.toFixed(3)} KWD</div>
                                    {invoice.coating && (
                                      <>
                                        <div><span className="font-medium">{t("coating")}:</span> {invoice.coating}</div>
                                        <div><span className="font-medium">{t("coatingPrice")}:</span> {invoice.coatingPrice.toFixed(3)} KWD</div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {invoice.contactLenses && invoice.contactLenses.length > 0 && (
                                <div className="border rounded p-3 bg-white">
                                  <h4 className="font-medium mb-2">{t("contactLenses")}</h4>
                                  <div className="grid gap-3">
                                    {invoice.contactLenses.map((lens: any, idx: number) => (
                                      <div key={idx} className="border-b pb-2 last:border-b-0 last:pb-0 grid grid-cols-2 text-sm gap-2">
                                        <div><span className="font-medium">{t("brand")}:</span> {lens.brand}</div>
                                        <div><span className="font-medium">{t("type")}:</span> {lens.type}</div>
                                        <div><span className="font-medium">{t("power")}:</span> {lens.power}</div>
                                        <div><span className="font-medium">{t("price")}:</span> {lens.price.toFixed(3)} KWD</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <div className="border rounded p-3 bg-white">
                                <h4 className="font-medium mb-2">{t("paymentSummary")}</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div><span className="font-medium">{t("subtotal")}:</span> {(invoice.total + invoice.discount).toFixed(3)} KWD</div>
                                  <div><span className="font-medium">{t("discount")}:</span> {invoice.discount.toFixed(3)} KWD</div>
                                  <div><span className="font-medium">{t("total")}:</span> {invoice.total.toFixed(3)} KWD</div>
                                  <div><span className="font-medium">{t("paid")}:</span> {(invoice.total - remaining).toFixed(3)} KWD</div>
                                  <div><span className="font-medium">{t("remaining")}:</span> {remaining.toFixed(3)} KWD</div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
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
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          workOrder={editingWorkOrder}
          patientId={patientId}
        />
      )}
    </>
  );
};
