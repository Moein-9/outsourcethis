
import React, { useState, useEffect } from "react";
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
  const [lastEditTimestamp, setLastEditTimestamp] = useState<string | null>(null);
  const [localInvoices, setLocalInvoices] = useState<Invoice[]>(invoices);
  const [localWorkOrders, setLocalWorkOrders] = useState<InvoiceWorkOrder[]>(workOrders);
  
  // Effect to update local state when props change
  useEffect(() => {
    setLocalInvoices(invoices);
    setLocalWorkOrders(workOrders);
  }, [invoices, workOrders]);
  
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
  const activeInvoices = localInvoices.filter(invoice => !invoice.isRefunded);
  
  // Filter out refunded invoices
  const refundedInvoices = localInvoices.filter(invoice => invoice.isRefunded);
  
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
  
  return (
    <div className="space-y-4">
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
        invoices={activeInvoices}
        workOrders={localWorkOrders}
        refundedInvoices={refundedInvoices}
        patient={patient}
        onEditWorkOrder={onEditWorkOrder}
        lastEditTimestamp={lastEditTimestamp}
      />
    </div>
  );
};
