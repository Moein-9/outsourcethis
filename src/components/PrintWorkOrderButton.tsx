
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, ChevronRight, ClipboardCheck } from "lucide-react";
import { WorkOrderPrintSelector } from "./WorkOrderPrintSelector";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, useInvoiceStore } from "@/store/invoiceStore";
import { toast } from "sonner";

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
  thermalOnly = false,
  isNewInvoice = false,
  onInvoiceSaved,
}) => {
  const { t, language } = useLanguageStore();
  const [loading, setLoading] = useState(false);
  const { addInvoice, addExistingInvoice, addWorkOrder } = useInvoiceStore();
  const isRtl = language === 'ar';
  
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
          coatingColor: invoice.coatingColor,
          thickness: invoice.thickness || "",   // Add the thickness property
          thicknessPrice: invoice.thicknessPrice || 0,  // Add the thicknessPrice property
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
        
        toast(t("invoiceSaved"), {
          description: t("invoiceNumber") + ": " + invoiceId
        });
        
        // Show the print selector with the updated invoice that has an ID
        showPrintSelector(updatedInvoice);
      } catch (error) {
        console.error("Error saving invoice:", error);
        toast(t("error"), {
          description: t("errorSavingInvoice")
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
      />
    );
    
    return selector;
  };

  // Full-width version with description for detailed buttons
  if (className?.includes("w-full")) {
    return (
      <Button 
        variant={variant} 
        className={`w-full justify-between group hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 hover:shadow-sm p-4 h-auto ${className}`}
        onClick={handlePrint}
        disabled={loading}
      >
        <div className={`flex items-center ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className={`w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center ${isRtl ? 'ml-4' : 'mr-4'} group-hover:bg-blue-200 transition-colors`}>
            <ClipboardCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div className={`text-${isRtl ? 'right' : 'left'}`}>
            <div className="font-medium">{loading ? t("saving") : t("printWorkOrder")}</div>
            <div className="text-xs text-muted-foreground">{t("printWorkOrderDescription")}</div>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
      </Button>
    );
  }

  // Original compact version
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
