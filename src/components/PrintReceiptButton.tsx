
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice } from "@/store/invoiceStore";
import { CustomPrintService } from "@/utils/CustomPrintService";

interface PrintReceiptButtonProps {
  invoice: Invoice;
  patientName?: string;
  patientPhone?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

export const PrintReceiptButton: React.FC<PrintReceiptButtonProps> = ({
  invoice,
  patientName,
  patientPhone,
  className,
  variant = "outline",
  size = "sm",
  children,
}) => {
  const { t, language } = useLanguageStore();
  const [isPrinting, setIsPrinting] = useState(false);
  
  const handlePrint = () => {
    if (isPrinting) return;
    
    setIsPrinting(true);
    
    try {
      // Make sure we have proper invoice data
      const invoiceData = {
        ...invoice,
        invoiceId: invoice.invoiceId || `INV${Date.now().toString().slice(-6)}`,
        patientName: patientName || invoice.patientName,
        patientPhone: patientPhone || invoice.patientPhone
      };
      
      // Use the custom print service to print the receipt
      CustomPrintService.printReceipt(invoiceData);
      
      // Reset the printing state after a delay
      setTimeout(() => {
        setIsPrinting(false);
      }, 1000);
    } catch (error) {
      console.error("Error printing receipt:", error);
      setIsPrinting(false);
    }
  };
  
  return (
    <>
      {children ? (
        <div onClick={handlePrint} className={className}>
          {children}
        </div>
      ) : (
        <Button 
          variant={variant} 
          size={size} 
          className={className}
          onClick={handlePrint}
          disabled={isPrinting}
        >
          <Printer className="h-4 w-4 mr-1" /> 
          {language === 'ar' ? 'طباعة الإيصال' : t("printReceipt")}
        </Button>
      )}
    </>
  );
};
