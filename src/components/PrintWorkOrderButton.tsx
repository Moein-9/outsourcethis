
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { WorkOrderPrintSelector } from "./WorkOrderPrintSelector";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, useInvoiceStore } from "@/store/invoiceStore";
import { toast } from "@/hooks/use-toast";
import { WorkOrderWorkflow } from "./WorkOrderWorkflow";

interface PrintWorkOrderButtonProps {
  invoice: Invoice;
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
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  thermalOnly?: boolean;
  isNewInvoice?: boolean;
  onInvoiceSaved?: (invoiceId: string) => void;
  useWorkflow?: boolean;
  onComplete?: () => void;
}

export const PrintWorkOrderButton: React.FC<PrintWorkOrderButtonProps> = ({
  invoice,
  patientName,
  patientPhone,
  rx,
  lensType,
  coating,
  frame,
  contactLenses,
  contactLensRx,
  className,
  variant = "outline",
  size = "sm",
  thermalOnly = false,
  isNewInvoice = false,
  onInvoiceSaved,
  useWorkflow = false,
  onComplete
}) => {
  const { t } = useLanguageStore();
  const [loading, setLoading] = useState(false);
  const { addInvoice, addExistingInvoice } = useInvoiceStore();
  
  // If using the workflow UI, render that instead of the buttons
  if (useWorkflow) {
    return (
      <WorkOrderWorkflow
        invoice={invoice}
        patientName={patientName}
        patientPhone={patientPhone}
        rx={rx}
        lensType={lensType}
        coating={coating}
        frame={frame}
        contactLenses={contactLenses}
        contactLensRx={contactLensRx}
        isNewInvoice={isNewInvoice}
        onInvoiceSaved={onInvoiceSaved}
        onComplete={onComplete}
      />
    );
  }
  
  const handlePrint = () => {
    // If it's a new invoice, save it first to generate an invoice ID
    if (isNewInvoice && !invoice.invoiceId) {
      setLoading(true);
      try {
        // Save the invoice to get an ID
        const invoiceId = addInvoice({
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
        
        // Update the invoice with the new ID
        const updatedInvoice = { ...invoice, invoiceId };
        
        // If callback provided, call it with the new ID
        if (onInvoiceSaved) {
          onInvoiceSaved(invoiceId);
        }
        
        toast({
          title: t("invoiceSaved"),
          description: t("invoiceNumber") + ": " + invoiceId,
        });
        
        // Show the print selector with the updated invoice that has an ID
        showPrintSelector(updatedInvoice);
      } catch (error) {
        console.error("Error saving invoice:", error);
        toast({
          title: t("error"),
          description: t("errorSavingInvoice"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      // If already has an ID, just show the print selector
      showPrintSelector(invoice);
    }
  };
  
  const showPrintSelector = (invoiceToUse: Invoice) => {
    // Create the print selector with proper styling for printing
    const selectorContainer = document.createElement('div');
    selectorContainer.style.overflow = 'hidden'; // Prevent scrollbars
    document.body.appendChild(selectorContainer);
    
    const selector = (
      <WorkOrderPrintSelector
        invoice={invoiceToUse}
        patientName={patientName}
        patientPhone={patientPhone}
        rx={rx}
        lensType={lensType}
        coating={coating}
        frame={frame}
        contactLenses={contactLenses}
        contactLensRx={contactLensRx}
        thermalOnly={thermalOnly}
        onPrintComplete={() => {}} // Add an empty function to avoid type error
      />
    );
    
    return selector;
  };

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={handlePrint}
        disabled={loading}
      >
        <Printer className="h-4 w-4 mr-1" /> 
        {loading ? t("saving") : t("printWorkOrder")}
      </Button>
      
      {!isNewInvoice && (
        <WorkOrderPrintSelector
          invoice={invoice}
          patientName={patientName}
          patientPhone={patientPhone}
          rx={rx}
          lensType={lensType}
          coating={coating}
          frame={frame}
          contactLenses={contactLenses}
          contactLensRx={contactLensRx}
          thermalOnly={thermalOnly}
          onPrintComplete={() => {}} // Add an empty function to avoid type error
          trigger={
            <Button variant={variant} size={size} className={className}>
              <Printer className="h-4 w-4 mr-1" /> {t("printWorkOrder")}
            </Button>
          }
        />
      )}
    </>
  );
};
