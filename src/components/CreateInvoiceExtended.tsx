
import React, { useState } from "react";
import CreateInvoice from "@/components/CreateInvoice";
import { InvoiceWorkOrderActions } from "@/components/InvoiceWorkOrderActions";

export const CreateInvoiceExtended: React.FC = () => {
  // State to track if work order has been printed
  const [workOrderPrinted, setWorkOrderPrinted] = useState(false);
  
  return (
    <div className="container mx-auto p-4">
      {/* Original CreateInvoice component with data passing */}
      <CreateInvoiceWrapper 
        workOrderPrinted={workOrderPrinted}
        setWorkOrderPrinted={setWorkOrderPrinted}
      />
    </div>
  );
};

// Wrapper to handle state between CreateInvoice and InvoiceWorkOrderActions
const CreateInvoiceWrapper: React.FC<{
  workOrderPrinted: boolean;
  setWorkOrderPrinted: (printed: boolean) => void;
}> = ({ workOrderPrinted, setWorkOrderPrinted }) => {
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [patient, setPatient] = useState<any>(null);
  
  // Handler for when invoice is saved (to be passed to original component)
  const handleInvoiceSave = (invoice: any, patientData: any) => {
    setInvoiceData(invoice);
    setPatient(patientData);
    setIsSaved(true);
  };
  
  // Manual save button handler
  const handleSaveButtonClick = () => {
    // This would trigger the save action in the CreateInvoice component
    // For now, we'll assume invoiceData is already populated
    if (invoiceData) {
      setIsSaved(true);
    }
  };
  
  return (
    <>
      {/* Render original CreateInvoice with onInvoiceSave prop */}
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
    </>
  );
};
