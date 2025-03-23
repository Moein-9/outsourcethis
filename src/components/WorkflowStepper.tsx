
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Save, 
  Printer, 
  FileCheck, 
  CheckCircle2,
  ArrowRight,
  RefreshCw 
} from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, useInvoiceStore } from "@/store/invoiceStore";
import { toast } from "@/hooks/use-toast";
import { WorkOrderPrintSelector } from "./WorkOrderPrintSelector";
import { ReceiptInvoice } from "./ReceiptInvoice";
import { Badge } from "@/components/ui/badge";

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
    { id: 4, label: t("finish"), icon: <CheckCircle2 className="h-4 w-4" /> }
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
    <div className="space-y-6">
      {/* Visual step progress indicator */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className="flex flex-col items-center z-10"
            >
              <div 
                className={`relative flex items-center justify-center w-10 h-10 rounded-full 
                ${step.id === currentStep 
                  ? "bg-indigo-500 text-white ring-4 ring-indigo-100" 
                  : step.id < currentStep 
                    ? "bg-green-500 text-white" 
                    : "bg-slate-100 text-slate-400"
                } transition-all duration-200`}
              >
                {step.id < currentStep ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  step.icon
                )}
                
                {/* Step indicator badge */}
                {step.id === currentStep && (
                  <Badge 
                    className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-indigo-600 text-[10px] border-2 border-white"
                  >
                    {step.id}
                  </Badge>
                )}
              </div>
              <span className={`mt-2 text-xs font-medium ${
                step.id === currentStep 
                  ? "text-indigo-700" 
                  : step.id < currentStep 
                    ? "text-green-600" 
                    : "text-slate-400"
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
        
        {/* Progress bar connecting steps */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-100 -z-0">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Invoice ID display */}
      {invoiceId && (
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-md">
          <div className="flex flex-col items-center text-center">
            <span className="text-sm text-indigo-600 font-semibold mb-1">{t("generatedIds")}</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1 border-indigo-200 bg-white">
                {t("invoiceNumber")}: <span className="font-bold ml-1">{invoiceId}</span>
              </Badge>
            </div>
          </div>
        </div>
      )}
      
      {/* Action buttons based on current step */}
      <div className="space-y-3">
        {/* Step 1: Save Work Order */}
        {currentStep === 1 && (
          <Button 
            onClick={handleSaveWorkOrder} 
            className="w-full relative overflow-hidden group bg-indigo-600 hover:bg-indigo-700"
            size="lg"
            disabled={saving}
          >
            <span className="absolute right-full top-0 h-full w-12 bg-gradient-to-r from-indigo-600 to-indigo-500 opacity-30 transform skew-x-[-20deg] group-hover:animate-shine"></span>
            <Save className="h-4 w-4 mr-2" />
            {saving ? (
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                {t("saving")}
              </div>
            ) : (
              <div className="flex items-center">
                {t("saveWorkOrder")}
                <ArrowRight className="h-4 w-4 ml-1 opacity-70" />
              </div>
            )}
          </Button>
        )}
        
        {/* Step 2: Print Invoice */}
        {currentStep === 2 && (
          <Button 
            onClick={handlePrintInvoice} 
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            size="lg"
          >
            <Printer className="h-4 w-4 mr-2" />
            <div className="flex items-center">
              {t("printInvoice")}
              <ArrowRight className="h-4 w-4 ml-1 opacity-70" />
            </div>
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
            thermalOnly={true}
            onCompletePrinting={printWorkOrder}
            trigger={
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                size="lg"
              >
                <FileCheck className="h-4 w-4 mr-2" />
                <div className="flex items-center">
                  {t("printWorkOrder")}
                  <ArrowRight className="h-4 w-4 ml-1 opacity-70" />
                </div>
              </Button>
            }
          />
        )}
        
        {/* Step 4: Finish */}
        {currentStep === 4 && (
          <Button 
            onClick={handleFinish} 
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {t("finishAndReset")}
          </Button>
        )}
      </div>
    </div>
  );
};
