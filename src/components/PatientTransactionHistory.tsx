import React, { useState } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/store/languageStore';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { EditWorkOrderDialog } from './EditWorkOrderDialog';
import { Eye, Pencil, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrintWorkOrderButton } from './PrintWorkOrderButton';

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
  
  // Filter invoices for this patient - ensure we're getting ALL invoices for this patient
  const patientInvoices = invoices.filter(invoice => 
    invoice.patientId === patientId
  );
  
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
    // Navigate to invoice details in "Remaining Payments" section
    navigate('/', { state: { section: 'remainingPayments', selectedInvoice: invoice.invoiceId } });
  };
  
  if (!patientInvoices.length) {
    return (
      <Card className="mt-8">
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
      <Card className="mt-8">
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
                  
                  return (
                    <TableRow key={invoice.invoiceId}>
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
                        <PrintWorkOrderButton 
                          invoice={invoice}
                          variant="ghost"
                          size="icon"
                          className="ml-1"
                        />
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
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          workOrder={editingWorkOrder}
          patientId={patientId}
        />
      )}
    </>
  );
};
