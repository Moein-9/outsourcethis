
import React, { useState } from "react";
import { Invoice } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import { PrinterIcon } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { toast } from "sonner";
import { printWorkOrderReceipt } from "./WorkOrderReceiptPrint";

interface WorkOrderPrintSelectorProps {
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
  onCompletePrinting?: () => void;
  trigger?: React.ReactNode;
  thermalOnly?: boolean; // Added the missing property
}

export const WorkOrderPrintSelector: React.FC<WorkOrderPrintSelectorProps> = ({
  invoice,
  patientName,
  patientPhone,
  rx,
  lensType,
  coating,
  frame,
  contactLenses,
  contactLensRx,
  trigger,
  onCompletePrinting,
  thermalOnly = true // Default to true since we're only using thermal paper now
}) => {
  const { t } = useLanguageStore();
  const [printingInProgress, setPrintingInProgress] = useState(false);
  
  const handleTriggerClick = () => {
    // Since we only support thermal paper now, immediately print without showing dialog
    handlePrint();
  };
  
  const handlePrint = (event?: React.MouseEvent) => {
    if (printingInProgress) return;
    
    setPrintingInProgress(true);
    
    try {
      // Print thermal receipt
      printWorkOrderReceipt({
        invoice,
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
        
        // Call the callback if provided
        if (onCompletePrinting) {
          onCompletePrinting();
        }
      }, 1000);
    } catch (error) {
      console.error('Printing error:', error);
      setPrintingInProgress(false);
      toast.error(t("printingFailed"));
    }
  };
  
  return (
    <>
      <div onClick={handleTriggerClick}>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1" disabled={printingInProgress}>
            <PrinterIcon className="h-4 w-4" /> 
            {printingInProgress ? t("printing") : t("printWorkOrder")}
          </Button>
        )}
      </div>
    </>
  );
};
