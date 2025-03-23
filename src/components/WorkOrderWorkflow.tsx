
import React, { useState } from "react";
import { Invoice } from "@/store/invoiceStore";
import { WorkflowStepper } from "./WorkflowStepper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, Printer, FileCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { CustomPrintWorkOrderButton } from "./CustomPrintWorkOrderButton";

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
  const [workOrderSaved, setWorkOrderSaved] = useState(false);

  // Combine patient data for the workflow
  const patient = {
    name: patientName,
    phone: patientPhone,
    rx: rx
  };

  // Handle completion of workflow steps
  const handleStepComplete = (step: number) => {
    setCurrentStep(step + 1);
    if (step === 3) {
      setWorkOrderSaved(true);
    }
  };

  return (
    <Card className="shadow-lg border border-indigo-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-100 to-violet-50 p-4 border-b">
        <h3 className="text-lg font-semibold text-center text-indigo-900">
          {t("workOrderWorkflow")}
        </h3>
        <div className="flex justify-center gap-2 mt-2">
          <Badge variant="outline" className="bg-white border-indigo-200 text-indigo-700 font-medium">
            {isNewInvoice ? t("newOrder") : t("existingOrder")}
          </Badge>
          {workOrderSaved && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {t("saved")}
            </Badge>
          )}
        </div>
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
        
        {workOrderSaved && (
          <div className="mt-4 flex justify-center">
            <CustomPrintWorkOrderButton
              workOrder={invoice}
              invoice={invoice}
              patient={patient}
              variant="default"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
