
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
  children?: React.ReactNode;
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
  
  // Create a new object for invoice data instead of trying to modify the original invoice
  const invoiceData = {
    ...invoice,
    invoiceId: invoice.invoiceId || `INV${Date.now().toString().slice(-6)}`,
    workOrderId: invoice.workOrderId || `WO${Date.now().toString().slice(-6)}`
    // Don't try to access rx directly from invoice since it doesn't exist on the Invoice type
  };
  
  return (
    <CustomPrintWorkOrderButton
      workOrder={invoiceData}
      invoice={invoiceData}
      patient={{
        name: patientName || invoiceData.patientName,
        phone: patientPhone || invoiceData.patientPhone,
        rx: rx // Use the rx prop directly instead of trying to get it from invoice
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
