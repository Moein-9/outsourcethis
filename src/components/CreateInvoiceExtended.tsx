
import React, { useState } from "react";
import CreateInvoice from "@/components/CreateInvoice";
import { InvoiceWorkOrderActions } from "@/components/InvoiceWorkOrderActions";

export const CreateInvoiceExtended: React.FC = () => {
  // State to track if work order has been printed
  const [workOrderPrinted, setWorkOrderPrinted] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [patient, setPatient] = useState<any>(null);
  
  // Handler for when invoice is saved
  const handleInvoiceSave = (invoice: any, patientData: any) => {
    setInvoiceData(invoice);
    setPatient(patientData);
    setIsSaved(true);
  };
  
  // Manual save button handler
  const handleSaveButtonClick = () => {
    // This would trigger the save action in the CreateInvoice component
    if (invoiceData) {
      setIsSaved(true);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4">
        {/* Original CreateInvoice component with data passing */}
        <CreateInvoice 
          onInvoiceSave={handleInvoiceSave}
          hideActionButtons={true}
        />
        
        {/* Add our new InvoiceWorkOrderActions component */}
        <InvoiceWorkOrderActions
          invoice={invoiceData}
          onSaveInvoice={handleSaveButtonClick}
          isSaved={isSaved}
          workOrderPrinted={workOrderPrinted}
          setWorkOrderPrinted={setWorkOrderPrinted}
          patient={patient}
        />
      </div>
    </div>
  );
};
