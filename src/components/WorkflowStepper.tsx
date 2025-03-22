
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Save, 
  Printer, 
  FileCheck, 
  CheckCircle
} from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, useInvoiceStore } from "@/store/invoiceStore";
import { toast } from "@/hooks/use-toast";
import { WorkOrderPrintSelector } from "./WorkOrderPrintSelector";
import { PrintService } from "@/utils/PrintService";

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
  const { t, language } = useLanguageStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [invoicePrinted, setInvoicePrinted] = useState(false);
  const [workOrderPrinted, setWorkOrderPrinted] = useState(false);
  const { addInvoice } = useInvoiceStore();
  const isRtl = language === 'ar';
  
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
    // Create invoice content
    const invoiceContent = `
      <div style="font-family: ${isRtl ? 'Cairo, sans-serif' : 'Yrsa, serif'}; direction: ${isRtl ? 'rtl' : 'ltr'}; text-align: ${isRtl ? 'right' : 'left'}; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 24px; margin-bottom: 5px;">${t("invoice")}</h1>
          <p style="font-size: 18px; margin-bottom: 5px;">${t("invoiceNumber")}: ${invoiceId || invoice.invoiceId}</p>
          <p style="font-size: 14px;">${new Date(invoice.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div style="margin-bottom: 20px; border: 1px solid #ddd; border-radius: 5px; padding: 15px;">
          <h2 style="font-size: 18px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">${t("customerInformation")}</h2>
          <p><strong>${t("name")}:</strong> ${patientName || invoice.patientName || "-"}</p>
          <p><strong>${t("phone")}:</strong> ${patientPhone || invoice.patientPhone || "-"}</p>
        </div>
        
        <div style="margin-bottom: 20px; border: 1px solid #ddd; border-radius: 5px; padding: 15px;">
          <h2 style="font-size: 18px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">${t("invoiceDetails")}</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: ${isRtl ? 'right' : 'left'};">${t("item")}</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">${t("price")}</th>
              </tr>
            </thead>
            <tbody>
              ${frame ? `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: ${isRtl ? 'right' : 'left'};">${t("frame")}: ${frame.brand} ${frame.model} (${frame.color})</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${frame.price.toFixed(3)} KWD</td>
              </tr>
              ` : ''}
              
              ${lensType ? `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: ${isRtl ? 'right' : 'left'};">${t("lenses")}: ${lensType}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${invoice.lensPrice.toFixed(3)} KWD</td>
              </tr>
              ` : ''}
              
              ${coating ? `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: ${isRtl ? 'right' : 'left'};">${t("coating")}: ${coating}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${invoice.coatingPrice.toFixed(3)} KWD</td>
              </tr>
              ` : ''}
              
              ${contactLenses && contactLenses.length > 0 ? contactLenses.map((lens, idx) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: ${isRtl ? 'right' : 'left'};">${t("contactLens")} ${idx + 1}: ${lens.brand} ${lens.type}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${lens.price.toFixed(3)} KWD</td>
              </tr>
              `).join('') : ''}
            </tbody>
          </table>
        </div>
        
        <div style="margin-bottom: 20px; border: 1px solid #ddd; border-radius: 5px; padding: 15px;">
          <h2 style="font-size: 18px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">${t("paymentSummary")}</h2>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 5px 0; text-align: ${isRtl ? 'right' : 'left'}; font-weight: bold;">${t("subtotal")}:</td>
              <td style="padding: 5px 0; text-align: ${isRtl ? 'left' : 'right'};">${(invoice.total + invoice.discount).toFixed(3)} KWD</td>
            </tr>
            ${invoice.discount > 0 ? `
            <tr>
              <td style="padding: 5px 0; text-align: ${isRtl ? 'right' : 'left'}; font-weight: bold;">${t("discount")}:</td>
              <td style="padding: 5px 0; text-align: ${isRtl ? 'left' : 'right'};">-${invoice.discount.toFixed(3)} KWD</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 5px 0; text-align: ${isRtl ? 'right' : 'left'}; font-weight: bold;">${t("total")}:</td>
              <td style="padding: 5px 0; text-align: ${isRtl ? 'left' : 'right'};">${invoice.total.toFixed(3)} KWD</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; text-align: ${isRtl ? 'right' : 'left'}; font-weight: bold;">${t("paid")}:</td>
              <td style="padding: 5px 0; text-align: ${isRtl ? 'left' : 'right'};">${invoice.deposit.toFixed(3)} KWD</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; text-align: ${isRtl ? 'right' : 'left'}; font-weight: bold; font-size: 16px;">${t("remaining")}:</td>
              <td style="padding: 5px 0; text-align: ${isRtl ? 'left' : 'right'}; font-size: 16px; ${(invoice.total - invoice.deposit) > 0 ? 'color: #e53e3e;' : 'color: #38a169;'}">${(invoice.total - invoice.deposit).toFixed(3)} KWD</td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
          <p>${t("thankYouMessage")}</p>
        </div>
      </div>
    `;
    
    try {
      const htmlContent = PrintService.prepareA4Document(invoiceContent, t("invoice"));
      PrintService.printHtml(htmlContent, 'a4', () => {
        // Move to the next step
        setInvoicePrinted(true);
        setCurrentStep(3);
        toast.success(t("invoicePrinted"));
      });
    } catch (error) {
      console.error("Error printing invoice:", error);
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
