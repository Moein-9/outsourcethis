
import React, { useState } from "react";
import { Invoice } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { toast } from "sonner";
import { printWorkOrderReceipt } from "./WorkOrderReceiptPrint";
import { PrintButton } from "./PrintButton";

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
  trigger?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
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
  variant = "default",
  size = "sm",
}) => {
  const { t } = useLanguageStore();
  const [printingInProgress, setPrintingInProgress] = useState(false);
  
  // Single function to handle printing that prevents multiple dialogs
  const handlePrint = () => {
    if (printingInProgress) return;
    
    setPrintingInProgress(true);
    
    try {
      // Using the printWorkOrderReceipt function from the imported file
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
      }, 1000);
    } catch (error) {
      console.error('Printing error:', error);
      setPrintingInProgress(false);
      toast.error(t("printingFailed"));
    }
  };
  
  return (
    <>
      {trigger ? (
        <div onClick={handlePrint}>
          {trigger}
        </div>
      ) : (
        <PrintButton
          onClick={handlePrint}
          label={printingInProgress ? t("printing") : t("printWorkOrder")}
          disabled={printingInProgress}
          variant={variant}
          size={size}
        />
      )}
    </>
  );
};
