
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, WorkOrder as InvoiceWorkOrder } from "@/store/invoiceStore";
import { TabbedTransactions } from "./TabbedTransactions";
import { Patient } from "@/store/patientStore";
import { PrintOptionsDialog } from "./PrintOptionsDialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { CustomPrintService } from "@/utils/CustomPrintService";
import { CustomPrintWorkOrderButton } from "./CustomPrintWorkOrderButton";

interface PatientTransactionsProps {
  invoices: Invoice[];
  workOrders: InvoiceWorkOrder[];
  patient?: Patient;
  onEditWorkOrder?: (workOrder: InvoiceWorkOrder) => void;
}

export const PatientTransactions: React.FC<PatientTransactionsProps> = ({
  invoices,
  workOrders,
  patient,
  onEditWorkOrder
}) => {
  const { t } = useLanguageStore();
  
  // Filter out active invoices (not refunded)
  const activeInvoices = invoices.filter(invoice => !invoice.isRefunded);
  
  // Filter out refunded invoices
  const refundedInvoices = invoices.filter(invoice => invoice.isRefunded);
  
  const handlePrintWorkOrder = (workOrder: InvoiceWorkOrder) => {
    // Find related invoice for this work order
    const relatedInvoice = invoices.find(inv => inv.workOrderId === workOrder.id);
    
    console.log("[PatientTransactions] Printing work order:", workOrder.id);
    console.log("[PatientTransactions] Related invoice:", relatedInvoice?.invoiceId);
    console.log("[PatientTransactions] Edit history:", workOrder.editHistory);
    
    // Call the CustomPrintService with the proper parameters
    CustomPrintService.printWorkOrder(workOrder, relatedInvoice, patient);
  };
  
  const handlePrintInvoice = (invoice: Invoice) => {
    console.log("[PatientTransactions] Printing invoice:", invoice.invoiceId);
    
    // Get the related work order to ensure edit history is included
    const relatedWorkOrder = workOrders.find(wo => wo.id === invoice.workOrderId);
    if (relatedWorkOrder && relatedWorkOrder.editHistory?.length) {
      console.log("[PatientTransactions] Invoice has edit history from work order:", relatedWorkOrder.editHistory);
    }
    
    // Call the CustomPrintService to handle invoice printing
    if (typeof CustomPrintService.printInvoice === 'function') {
      CustomPrintService.printInvoice(invoice);
    } else {
      console.error('CustomPrintService.printInvoice is not implemented');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {workOrders.length > 0 && invoices.length > 0 && (
          <PrintOptionsDialog
            workOrder={workOrders[0]}
            invoice={invoices[0]}
            patient={patient}
            onPrintWorkOrder={() => handlePrintWorkOrder(workOrders[0])}
            onPrintInvoice={() => handlePrintInvoice(invoices[0])}
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
        invoices={activeInvoices}
        workOrders={workOrders}
        refundedInvoices={refundedInvoices}
        patient={patient}
        onEditWorkOrder={onEditWorkOrder}
      />
    </div>
  );
};
