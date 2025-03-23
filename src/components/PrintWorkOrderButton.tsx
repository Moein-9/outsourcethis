
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { WorkOrderPrintSelector } from "./WorkOrderPrintSelector";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, useInvoiceStore } from "@/store/invoiceStore";
import { toast } from "@/hooks/use-toast";
import { CustomPrintService } from "@/utils/CustomPrintService";

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
}) => {
  const { t } = useLanguageStore();
  const [loading, setLoading] = useState(false);
  const { addInvoice, addExistingInvoice } = useInvoiceStore();
  
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
        
        // Print the work order directly using CustomPrintService
        CustomPrintService.printWorkOrder(updatedInvoice, updatedInvoice, {
          name: patientName,
          phone: patientPhone,
          rx: rx
        });
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
      // If already has an ID, just print
      CustomPrintService.printWorkOrder(invoice, invoice, {
        name: patientName,
        phone: patientPhone,
        rx: rx
      });
    }
  };

  return (
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
  );
};
