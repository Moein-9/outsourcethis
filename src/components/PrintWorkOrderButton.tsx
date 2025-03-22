
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { WorkOrderPrintSelector } from "./WorkOrderPrintSelector";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice } from "@/store/invoiceStore";

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
}) => {
  const { t } = useLanguageStore();

  return (
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
  );
};
