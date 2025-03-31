
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { WorkOrderPrintSelector } from "./WorkOrderPrintSelector";
import { useLanguageStore } from "@/store/languageStore";
import { useStoreLocation, LocationId } from "@/store/storeLocationStore";
import { Invoice, useInvoiceStore } from "@/store/invoiceStore";
import { toast } from "@/hooks/use-toast";

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
  const { t } = useLanguageStore();
  const { selectedLocation } = useStoreLocation();
  const [loading, setLoading] = useState(false);
  const { addInvoice, addExistingInvoice, addWorkOrder } = useInvoiceStore();
  
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
          },
          locationId: selectedLocation // Add location ID to work order
        };
        
        // Generate work order ID
        const workOrderId = addWorkOrder?.(workOrder) || `WO${Date.now()}`;
        
        // Save the invoice to get an ID and link to work order
        // Create a copy without locationId first
        const { locationId, ...invoiceData } = invoice;
        
        // Then add locationId as a separate property
        const invoiceId = addInvoice({
          ...invoiceData,
          workOrderId: workOrderId,
          locationId: selectedLocation
        });
        
        // Update the invoice with the new IDs
        const updatedInvoice = { 
          ...invoice, 
          invoiceId, 
          workOrderId,
          locationId: selectedLocation
        };
        
        // If callback provided, call it with the new IDs
        if (onInvoiceSaved) {
          onInvoiceSaved(invoiceId, workOrderId);
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
        locationId={invoiceToUse.locationId || selectedLocation}
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
          locationId={invoice.locationId || selectedLocation}
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
