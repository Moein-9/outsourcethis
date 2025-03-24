
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice } from "@/store/invoiceStore";
import { CustomPrintWorkOrderButton } from "./CustomPrintWorkOrderButton";

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
  children?: React.ReactNode; // Add children prop for CustomPrintWorkOrderButton
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
  children,
}) => {
  const { t } = useLanguageStore();
  
  // Ensure the invoice has a valid ID for display and tracking
  const invoiceData = {
    ...invoice,
    invoiceId: invoice.invoiceId || `INV${Date.now().toString().slice(-6)}`,
    workOrderId: invoice.workOrderId || invoice.invoiceId || `WO${Date.now().toString().slice(-6)}`,
    // Add rx to the invoice data if it's provided as a prop
    rx: rx || invoice.rx
  };
  
  return (
    <CustomPrintWorkOrderButton
      workOrder={invoiceData}
      invoice={invoiceData}
      patient={{
        name: patientName || invoiceData.patientName,
        phone: patientPhone || invoiceData.patientPhone,
        rx: rx || invoiceData.rx
      }}
      className={className}
      variant={variant}
      size={size}
    >
      {children || (
        <Button variant={variant} size={size} className={className}>
          <Printer className="h-4 w-4 mr-1" /> {t("printWorkOrder")}
        </Button>
      )}
    </CustomPrintWorkOrderButton>
  );
};
