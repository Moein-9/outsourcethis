
import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, WorkOrder as InvoiceWorkOrder, useInvoiceStore } from "@/store/invoiceStore";
import { TabbedTransactions } from "./TabbedTransactions";
import { Patient } from "@/store/patientStore";
import { PrintOptionsDialog } from "./PrintOptionsDialog";
import { Button } from "@/components/ui/button";
import { Printer, AlertCircle } from "lucide-react";
import { CustomPrintService } from "@/utils/CustomPrintService";
import { CustomPrintWorkOrderButton } from "./CustomPrintWorkOrderButton";
import { DeleteOrderConfirmDialog } from "./DeleteOrderConfirmDialog";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PatientTransactionsProps {
  invoices: Invoice[];
  workOrders: InvoiceWorkOrder[];
  patient?: Patient;
}

export const PatientTransactions: React.FC<PatientTransactionsProps> = ({
  invoices,
  workOrders,
  patient
}) => {
  const { t, language } = useLanguageStore();
  const { deleteWorkOrder, getArchivedInvoicesByPatientId, getArchivedWorkOrdersByPatientId } = useInvoiceStore();
  const [lastEditTimestamp, setLastEditTimestamp] = useState<string | null>(null);
  const [localInvoices, setLocalInvoices] = useState<Invoice[]>(invoices);
  const [localWorkOrders, setLocalWorkOrders] = useState<InvoiceWorkOrder[]>(workOrders);
  const [archivedInvoices, setArchivedInvoices] = useState<Invoice[]>([]);
  const [archivedWorkOrders, setArchivedWorkOrders] = useState<InvoiceWorkOrder[]>([]);
  
  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [workOrderToDelete, setWorkOrderToDelete] = useState<InvoiceWorkOrder | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
  // Effect to update local state when props change
  useEffect(() => {
    setLocalInvoices(invoices);
    setLocalWorkOrders(workOrders);
    
    // Load archived items if patient ID is available
    if (patient?.patientId) {
      setArchivedInvoices(getArchivedInvoicesByPatientId(patient.patientId));
      setArchivedWorkOrders(getArchivedWorkOrdersByPatientId(patient.patientId));
    }
  }, [invoices, workOrders, patient, getArchivedInvoicesByPatientId, getArchivedWorkOrdersByPatientId, refreshTrigger]);
  
  // Effect to detect changes in work orders (especially edits)
  useEffect(() => {
    // Find the most recent edit timestamp across all work orders and invoices
    let latestEdit: string | null = null;
    
    // Check work orders
    localWorkOrders.forEach(workOrder => {
      if (workOrder.lastEditedAt && (!latestEdit || new Date(workOrder.lastEditedAt) > new Date(latestEdit))) {
        latestEdit = workOrder.lastEditedAt;
      }
    });
    
    // Check invoices
    localInvoices.forEach(invoice => {
      if (invoice.lastEditedAt && (!latestEdit || new Date(invoice.lastEditedAt) > new Date(latestEdit))) {
        latestEdit = invoice.lastEditedAt;
      }
    });
    
    setLastEditTimestamp(latestEdit);
  }, [localWorkOrders, localInvoices]);
  
  // Filter out active invoices (not refunded)
  const activeInvoices = localInvoices.filter(invoice => !invoice.isRefunded && !invoice.isArchived);
  
  // Filter out refunded invoices
  const refundedInvoices = localInvoices.filter(invoice => invoice.isRefunded && !invoice.isArchived);
  
  const handlePrintWorkOrder = (workOrder: InvoiceWorkOrder) => {
    // Find related invoice for this work order
    const relatedInvoice = localInvoices.find(inv => inv.workOrderId === workOrder.id);
    
    console.log("[PatientTransactions] Printing work order:", workOrder.id);
    console.log("[PatientTransactions] Related invoice:", relatedInvoice?.invoiceId);
    
    // Call the CustomPrintService with the proper parameters
    CustomPrintService.printWorkOrder(workOrder, relatedInvoice, patient);
  };
  
  const handlePrintInvoice = (invoice: Invoice) => {
    console.log("[PatientTransactions] Printing invoice:", invoice.invoiceId);
    
    // Call the CustomPrintService to handle invoice printing
    if (typeof CustomPrintService.printInvoice === 'function') {
      CustomPrintService.printInvoice(invoice);
    } else {
      console.error('CustomPrintService.printInvoice is not implemented');
    }
  };
  
  const handleDeleteWorkOrder = (workOrder: InvoiceWorkOrder) => {
    setWorkOrderToDelete(workOrder);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteWorkOrder = async () => {
    if (!workOrderToDelete) return;
    
    try {
      // Find related invoice to check payment status
      const relatedInvoice = localInvoices.find(inv => inv.workOrderId === workOrderToDelete?.id);
      const reason = language === 'ar' ? "تم حذف الطلب من قبل المستخدم" : "Order deleted by user";
      
      // Call deleteWorkOrder function
      const refundId = deleteWorkOrder(workOrderToDelete.id, reason);
      
      if (refundId) {
        // A refund was processed
        toast.success(
          language === 'ar' 
            ? "تم حذف الطلب ومعالجة الاسترداد بنجاح" 
            : "Order deleted and refund processed successfully"
        );
      } else {
        // No refund was needed
        toast.success(
          language === 'ar' 
            ? "تم حذف الطلب بنجاح" 
            : "Order deleted successfully"
        );
      }
      
      // Manually update local state to reflect changes immediately
      if (workOrderToDelete) {
        // Remove from active work orders and add to archived
        setLocalWorkOrders(prev => prev.filter(wo => wo.id !== workOrderToDelete.id));
        
        const updatedWorkOrder = {...workOrderToDelete, isArchived: true, archivedAt: new Date().toISOString()};
        setArchivedWorkOrders(prev => [...prev, updatedWorkOrder]);
        
        // If there's a related invoice, update that too
        if (relatedInvoice) {
          setLocalInvoices(prev => prev.filter(inv => inv.invoiceId !== relatedInvoice.invoiceId));
          
          const updatedInvoice = {
            ...relatedInvoice, 
            isArchived: true, 
            archivedAt: new Date().toISOString(),
            remaining: 0
          };
          
          setArchivedInvoices(prev => [...prev, updatedInvoice]);
        }
      }
      
      // Trigger refresh to update UI anyway for safety
      setRefreshTrigger(prev => prev + 1);
      
      // Close the dialog
      setIsDeleteDialogOpen(false);
      setWorkOrderToDelete(null);
      
    } catch (error) {
      console.error("Error deleting work order:", error);
      toast.error(
        language === 'ar'
          ? "حدث خطأ أثناء حذف الطلب"
          : "Error deleting the order"
      );
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Add a visible alert to show the feature is working */}
      <Alert variant="default" className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">
          {language === 'ar' ? "ميزة حذف الطلبات" : "Order Deletion Feature"}
        </AlertTitle>
        <AlertDescription className="text-amber-700">
          {language === 'ar' 
            ? "يمكنك الآن حذف الطلبات وسيتم نقلها تلقائيًا إلى تبويب الأرشيف. سيتم إرجاع أي مدفوعات سابقة."
            : "You can now delete orders. They will be automatically moved to the Archive tab. Any previous payments will be refunded."
          }
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-end">
        {localWorkOrders.length > 0 && localInvoices.length > 0 && (
          <PrintOptionsDialog
            workOrder={localWorkOrders[0]}
            invoice={localInvoices[0]}
            patient={patient}
            onPrintWorkOrder={() => handlePrintWorkOrder(localWorkOrders[0])}
            onPrintInvoice={() => handlePrintInvoice(localInvoices[0])}
          >
            <Button 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Printer className="h-4 w-4" />
              {t('print')}
            </Button>
          </PrintOptionsDialog>
        )}
      </div>
      
      <TabbedTransactions
        key={`transactions-${refreshTrigger}`}
        invoices={activeInvoices}
        workOrders={localWorkOrders.filter(wo => !wo.isArchived)}
        refundedInvoices={refundedInvoices}
        archivedInvoices={archivedInvoices}
        archivedWorkOrders={archivedWorkOrders}
        patient={patient}
        onDeleteWorkOrder={handleDeleteWorkOrder}
        lastEditTimestamp={lastEditTimestamp}
      />
      
      {/* Delete Confirmation Dialog */}
      {workOrderToDelete && (
        <DeleteOrderConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDeleteWorkOrder}
          hasPaidAmount={!!(localInvoices.find(inv => inv.workOrderId === workOrderToDelete?.id)?.deposit > 0)}
          amountPaid={localInvoices.find(inv => inv.workOrderId === workOrderToDelete?.id)?.deposit}
        />
      )}
    </div>
  );
};
