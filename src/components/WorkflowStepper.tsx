import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Save, 
  Printer, 
  FileCheck, 
  CheckCircle,
  RefreshCw 
} from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice } from "@/store/invoiceStore";
import { toast } from "@/hooks/use-toast";
import { WorkOrderPrintSelector } from "./WorkOrderPrintSelector";
import { ReceiptInvoice } from "./ReceiptInvoice";

interface WorkflowStepperProps {
  invoice: Invoice;
  onSave: (invoiceId: string) => void;
  patientName?: string;
  patientPhone?: string;
  rx?: any;
  lensType?: string;
  coating?: string;
  frame?: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  };
  contactLenses?: any[];
  contactLensRx?: any;
  onComplete?: () => void;
  isNewInvoice?: boolean;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  invoice,
  onSave,
  patientName,
  patientPhone,
  rx,
  lensType,
  coating,
  frame,
  contactLenses,
  contactLensRx,
  onComplete,
  isNewInvoice = true
}) => {
  const { t } = useLanguageStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [invoicePrinted, setInvoicePrinted] = useState(false);
  const [workOrderPrinted, setWorkOrderPrinted] = useState(false);
  
  // Current step properties
  const steps = [
    { id: 1, label: t("saveWorkOrder"), icon: <Save className="h-4 w-4" /> },
    { id: 2, label: t("printInvoice"), icon: <Printer className="h-4 w-4" /> },
    { id: 3, label: t("printWorkOrder"), icon: <FileCheck className="h-4 w-4" /> },
    { id: 4, label: t("finish"), icon: <CheckCircle className="h-4 w-4" /> }
  ];

  // Handle saving the work order
  const handleSaveWorkOrder = async () => {
    if (saving) return;
    
    setSaving(true);
    try {
      // Use the callback to save the invoice and get the ID
      const savedInvoiceId = await addInvoiceAndGetId();
      
      // Save the invoice ID for display
      setInvoiceId(savedInvoiceId);
      
      // Call the onSave callback with the generated invoice ID
      if (onSave) {
        onSave(savedInvoiceId);
      }
      
      // Move to the next step
      setCurrentStep(2);
      
      toast({
        title: t("workOrderSaved"),
        description: `${t("invoiceNumber")}: ${savedInvoiceId}`,
      });
    } catch (error) {
      console.error("Error saving work order:", error);
      toast({
        title: t("error"),
        description: t("errorSavingWorkOrder"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // This is a placeholder - in the actual implementation, 
  // you would use the addInvoice function from useInvoiceStore
  const addInvoiceAndGetId = async (): Promise<string> => {
    // This simulates the async operation that would occur when saving to a store
    return new Promise((resolve) => {
      // If the invoice already has an ID, use that
      if (invoice.invoiceId) {
        resolve(invoice.invoiceId);
      } else {
        // Otherwise generate a new ID (this is just a placeholder, the actual implementation 
        // would use the logic from useInvoiceStore)
        const newId = `INV${Date.now()}`;
        resolve(newId);
      }
    });
  };

  // Handle printing the invoice
  const handlePrintInvoice = () => {
    // Create a popup window for the invoice
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${t("invoice")}</title>
            <style>
              @media print {
                body { margin: 0; padding: 0; }
              }
            </style>
          </head>
          <body>
            <div id="print-content"></div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `);
      
      // Render the ReceiptInvoice in the popup
      const ReactDOM = require('react-dom');
      const React = require('react');
      
      const invoiceElement = React.createElement(ReceiptInvoice, {
        invoice: { ...invoice, invoiceId: invoiceId || invoice.invoiceId },
        isPrintable: true,
        patientName,
        patientPhone,
        lensType,
        coating,
        frame,
        contactLenses,
      });
      
      ReactDOM.render(
        invoiceElement,
        printWindow.document.getElementById('print-content')
      );
      
      // Mark this step as completed
      setInvoicePrinted(true);
      setCurrentStep(3);
    } else {
      toast({
        title: t("error"),
        description: t("errorPrintingInvoice"),
        variant: "destructive",
      });
    }
  };

  // Handle printing the work order
  const printWorkOrder = () => {
    setWorkOrderPrinted(true);
    setCurrentStep(4);
  };

  // Handle finishing the workflow
  const handleFinish = () => {
    if (onComplete) {
      onComplete();
    }
    // Reset the stepper state
    setCurrentStep(1);
    setInvoiceId(null);
    setInvoicePrinted(false);
    setWorkOrderPrinted(false);
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">{t("workOrderWorkflow")}</h3>
      
      {/* Steps indicator */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`flex flex-col items-center ${
              step.id === currentStep 
                ? "text-primary" 
                : step.id < currentStep 
                  ? "text-green-500" 
                  : "text-gray-400"
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              step.id === currentStep 
                ? "bg-primary text-white" 
                : step.id < currentStep 
                  ? "bg-green-500 text-white" 
                  : "bg-gray-200 text-gray-500"
            }`}>
              {step.id < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <div>{step.id}</div>
              )}
            </div>
            <span className="text-xs text-center">{step.label}</span>
            
            {/* Connecting line */}
            {step.id < steps.length && (
              <div className="h-0.5 w-16 bg-gray-300 absolute left-[calc(100%/8)] translate-x-[calc(100%*0.75*{step.id})]" />
            )}
          </div>
        ))}
      </div>
      
      {/* Display invoice ID if available */}
      {invoiceId && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="font-semibold">{t("generatedIds")}:</p>
          <p>{t("invoiceNumber")}: <span className="font-bold">{invoiceId}</span></p>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="space-y-3">
        {/* Step 1: Save Work Order */}
        {currentStep === 1 && (
          <Button 
            onClick={handleSaveWorkOrder} 
            className="w-full" 
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? t("saving") : t("saveWorkOrder")}
          </Button>
        )}
        
        {/* Step 2: Print Invoice */}
        {currentStep === 2 && (
          <Button 
            onClick={handlePrintInvoice} 
            className="w-full"
            variant="outline"
          >
            <Printer className="h-4 w-4 mr-2" />
            {t("printInvoice")}
          </Button>
        )}
        
        {/* Step 3: Print Work Order */}
        {currentStep === 3 && (
          <WorkOrderPrintSelector
            invoice={{ ...invoice, invoiceId: invoiceId || invoice.invoiceId }}
            patientName={patientName}
            patientPhone={patientPhone}
            rx={rx}
            lensType={lensType}
            coating={coating}
            frame={frame}
            contactLenses={contactLenses}
            contactLensRx={contactLensRx}
            thermalOnly={false}
            onCompletePrinting={printWorkOrder}
            trigger={
              <Button 
                className="w-full"
                variant="outline"
              >
                <FileCheck className="h-4 w-4 mr-2" />
                {t("printWorkOrder")}
              </Button>
            }
          />
        )}
        
        {/* Step 4: Finish */}
        {currentStep === 4 && (
          <Button 
            onClick={handleFinish} 
            className="w-full"
            variant="secondary"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("finishAndReset")}
          </Button>
        )}
      </div>
    </div>
  );
};
