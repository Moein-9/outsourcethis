
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, WorkOrder } from "@/store/invoiceStore";
import { TabbedTransactions } from "./TabbedTransactions";
import { Patient } from "@/store/patientStore";
import { PrintOptionsDialog } from "./PrintOptionsDialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PatientTransactionsProps {
  invoices: Invoice[];
  workOrders: WorkOrder[];
  patient?: Patient;
  onEditWorkOrder?: (workOrder: WorkOrder) => void;
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
  
  const handlePrintWorkOrder = (workOrder: WorkOrder) => {
    // Use the PrintService or window.print() implementation
    window.print();
  };
  
  const handlePrintInvoice = (invoice: Invoice) => {
    // Use the PrintService or window.print() implementation
    window.print();
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
