
import React, { useState } from "react";
import { Invoice } from "@/store/invoiceStore";
import { WorkflowStepper } from "./WorkflowStepper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, Printer, FileCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

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
  const { t } = useLanguageStore();
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <Card className="shadow-lg border-2 border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-violet-100 to-indigo-50 p-4 border-b">
        <h3 className="text-lg font-semibold text-center text-slate-800">
          {t("workOrderWorkflow")}
        </h3>
      </div>
      
      <CardContent className="p-5">
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
      </CardContent>
    </Card>
  );
};
