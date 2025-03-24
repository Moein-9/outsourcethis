
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
  
  return (
    <CustomPrintWorkOrderButton
      workOrder={invoice}
      invoice={invoice}
      patient={{
        name: patientName,
        phone: patientPhone,
        rx: rx
      }}
      className={className}
      variant={variant}
      size={size}
    >
      <Button variant={variant} size={size} className={className}>
        <Printer className="h-4 w-4 mr-1" /> {t("printWorkOrder")}
      </Button>
    </CustomPrintWorkOrderButton>
  );
};
