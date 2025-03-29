
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
  trigger?: React.ReactNode;
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
}) => {
  const { t } = useLanguageStore();
  const [printingInProgress, setPrintingInProgress] = useState(false);
  
  const handlePrint = () => {
    if (printingInProgress) return;
    
    setPrintingInProgress(true);
    
    try {
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
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1" 
          onClick={handlePrint}
          disabled={printingInProgress}
        >
          <PrinterIcon className="h-4 w-4" /> 
          {printingInProgress ? t("printing") : t("printWorkOrder")}
        </Button>
      )}
    </>
  );
};
