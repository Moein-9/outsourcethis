
import React from "react";
import { Invoice } from "@/store/invoiceStore";
import { WorkflowStepper } from "./WorkflowStepper";

interface WorkOrderWorkflowProps {
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
  isNewInvoice?: boolean;
  onInvoiceSaved?: (invoiceId: string) => void;
  onComplete?: () => void;
}

export const WorkOrderWorkflow: React.FC<WorkOrderWorkflowProps> = ({
  invoice,
  patientName,
  patientPhone,
  rx,
  lensType,
  coating,
  frame,
  contactLenses,
  contactLensRx,
  isNewInvoice = true,
  onInvoiceSaved,
  onComplete
}) => {
  return (
    <WorkflowStepper
      invoice={invoice}
      onSave={onInvoiceSaved || (() => {})}
      patientName={patientName}
      patientPhone={patientPhone}
      rx={rx}
      lensType={lensType}
      coating={coating}
      frame={frame}
      contactLenses={contactLenses}
      contactLensRx={contactLensRx}
      onComplete={onComplete}
      isNewInvoice={isNewInvoice}
    />
  );
};
