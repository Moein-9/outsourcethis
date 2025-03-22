
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
import { Invoice, useInvoiceStore } from "@/store/invoiceStore";
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
  const { addInvoice } = useInvoiceStore();
  
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
      let savedInvoiceId;
      
      if (isNewInvoice) {
        // Extract the relevant fields from the invoice for saving
        savedInvoiceId = addInvoice({
          patientId: invoice.patientId,
          patientName: invoice.patientName,
          patientPhone: invoice.patientPhone,
          lensType: invoice.lensType,
          lensPrice: invoice.lensPrice,
          coating: invoice.coating,
          coatingPrice: invoice.coatingPrice,
          frameBrand: invoice.frameBrand,
          frameModel: invoice.frameModel,
          frameColor: invoice.frameColor,
          frameSize: invoice.frameSize,
          framePrice: invoice.framePrice,
          discount: invoice.discount,
          deposit: invoice.deposit,
          total: invoice.total,
          paymentMethod: invoice.paymentMethod,
          authNumber: invoice.authNumber,
          workOrderId: invoice.workOrderId,
        });
      } else {
        // If it already has an ID, use that
        savedInvoiceId = invoice.invoiceId;
      }
      
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
                * { text-align: center; }
              }
              body { font-family: Arial, sans-serif; }
              .print-content { text-align: center; }
            </style>
          </head>
          <body>
            <div id="print-content" class="print-content"></div>
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
    <div className="border rounded-lg p-4 bg-card">
      <h3 className="text-lg font-semibold mb-4 text-center">{t("workOrderWorkflow")}</h3>
      
      {/* Steps indicator */}
      <div className="flex items-center justify-between mb-6 relative">
        {steps.map((step, index) => (
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
                step.icon
              )}
            </div>
            <span className="text-xs text-center">{step.label}</span>
          </div>
        ))}
        
        {/* Connecting lines between steps */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
      </div>
      
      {/* Display invoice ID if available */}
      {invoiceId && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-center">
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
            <CheckCircle className="h-4 w-4 mr-2" />
            {t("finishAndReset")}
          </Button>
        )}
      </div>
    </div>
  );
};
