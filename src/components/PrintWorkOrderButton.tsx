
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, useInvoiceStore } from "@/store/invoiceStore";
import { toast } from "sonner";
import { printWorkOrderReceipt } from "./WorkOrderReceiptPrint";

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
  isNewInvoice?: boolean;
  onInvoiceSaved?: (invoiceId: string, workOrderId: string) => void;
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
  isNewInvoice = false,
  onInvoiceSaved,
}) => {
  const { t } = useLanguageStore();
  const [loading, setLoading] = useState(false);
  const { addInvoice, addWorkOrder } = useInvoiceStore();
  
  const handlePrint = () => {
    // If it's a new invoice, save it first to generate an invoice ID
    if (isNewInvoice && !invoice.invoiceId) {
      setLoading(true);
      try {
        // Create a work order
        const workOrder = {
          patientId: invoice.patientId || 'anonymous',
          lensType: {
            name: invoice.lensType,
            price: invoice.lensPrice
          }
        };
        
        // Generate work order ID
        const workOrderId = addWorkOrder?.(workOrder) || `WO${Date.now()}`;
        
        // Save the invoice to get an ID and link to work order
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
          workOrderId: workOrderId
        });
        
        // Update the invoice with the new IDs
        const updatedInvoice = { 
          ...invoice, 
          invoiceId, 
          workOrderId 
        };
        
        // If callback provided, call it with the new IDs
        if (onInvoiceSaved) {
          onInvoiceSaved(invoiceId, workOrderId);
        }
        
        toast.success(t("invoiceSaved"));
        
        // Print the work order directly with the updated invoice
        printWorkOrder(updatedInvoice);
      } catch (error) {
        console.error("Error saving invoice:", error);
        toast.error(t("errorSavingInvoice"));
      } finally {
        setLoading(false);
      }
    } else {
      // If already has an ID, just print the work order
      printWorkOrder(invoice);
    }
  };
  
  const printWorkOrder = (invoiceToUse: Invoice) => {
    try {
      if (printingInProgress) return;
      setPrintingInProgress(true);
      
      printWorkOrderReceipt({
        invoice: invoiceToUse,
        patientName,
        patientPhone,
        rx,
        lensType,
        coating,
        frame,
        contactLenses,
        contactLensRx
      });
      
      setTimeout(() => {
        setPrintingInProgress(false);
        toast.success(t("printingCompleted"));
      }, 1000);
    } catch (error) {
      console.error('Printing error:', error);
      setPrintingInProgress(false);
      toast.error(t("printingFailed"));
    }
  };

  // State to track if printing is in progress to prevent double-clicking
  const [printingInProgress, setPrintingInProgress] = useState(false);

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={handlePrint}
      disabled={loading || printingInProgress}
    >
      <Printer className="h-4 w-4 mr-1" /> 
      {loading ? t("saving") : (printingInProgress ? t("printing") : t("printWorkOrder"))}
    </Button>
  );
};
