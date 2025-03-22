import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/languageStore";
import { Printer, Save, RefreshCw, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { Invoice } from "@/store/invoiceStore";
import { toast } from "@/hooks/use-toast";
import { PrintWorkOrderButton } from "./PrintWorkOrderButton";
import { CustomPrintWorkOrderButton } from "./CustomPrintWorkOrderButton";
import { CustomPrintService } from "@/utils/CustomPrintService";

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
  onComplete?: () => void;
  patient?: any;
  workOrder?: any;
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
  onComplete,
  patient,
  workOrder,
}) => {
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  const [currentStep, setCurrentStep] = useState(1);
  const [savedInvoiceId, setSavedInvoiceId] = useState<string | null>(null);
  const [printedInvoice, setPrintedInvoice] = useState(false);
  const [printedWorkOrder, setPrintedWorkOrder] = useState(false);
  
  const handleInvoiceSaved = (invoiceId: string) => {
    setSavedInvoiceId(invoiceId);
    setCurrentStep(2);
    toast({
      title: t("invoiceSaved"),
      description: `${t("invoiceNumber")}: ${invoiceId}`,
    });
  };
  
  const handlePrintInvoice = () => {
    try {
      if (workOrder) {
        CustomPrintService.printInvoice(workOrder, invoice, patient);
        setPrintedInvoice(true);
        setCurrentStep(3);
        toast({
          title: t("invoicePrinted"),
          description: t("invoicePrintedSuccess"),
        });
      } else {
        toast({
          title: t("error"),
          description: t("workOrderNotFound"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error printing invoice:", error);
      toast({
        title: t("error"),
        description: t("printingFailed"),
        variant: "destructive",
      });
    }
  };
  
  const handlePrintWorkOrderComplete = () => {
    setPrintedWorkOrder(true);
    setCurrentStep(4);
    toast({
      title: t("workOrderPrinted"),
      description: t("workOrderPrintedSuccess"),
    });
  };
  
  const handleFinishProcess = () => {
    if (onComplete) {
      onComplete();
    } else {
      window.location.reload();
    }
  };
  
  const steps = [
    {
      number: 1,
      title: t("saveWorkOrder"),
      description: t("saveWorkOrderDescription"),
      icon: <Save className="h-5 w-5" />,
      completed: savedInvoiceId !== null,
    },
    {
      number: 2,
      title: t("printInvoice"),
      description: t("printInvoiceDescription"),
      icon: <Printer className="h-5 w-5" />,
      completed: printedInvoice,
      disabled: !savedInvoiceId,
    },
    {
      number: 3,
      title: t("printWorkOrder"),
      description: t("printWorkOrderDescription"),
      icon: <Printer className="h-5 w-5" />,
      completed: printedWorkOrder,
      disabled: !printedInvoice,
    },
    {
      number: 4,
      title: t("finish"),
      description: t("finishDescription"),
      icon: <RefreshCw className="h-5 w-5" />,
      completed: false,
      disabled: !printedWorkOrder,
    },
  ];
  
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="w-full space-y-4 p-4 border rounded-lg bg-background shadow-sm">
      <div className="flex justify-between items-center mb-6">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center relative">
            {index < steps.length - 1 && (
              <div 
                className={`absolute top-4 h-0.5 ${
                  step.completed ? 'bg-primary' : 'bg-muted'
                } ${isRtl ? 'right-6' : 'left-6'} w-[calc(100%-1.5rem)]`}
                style={{ width: 'calc(100% - 3rem)' }}
              />
            )}
            
            <div 
              className={`flex items-center justify-center h-8 w-8 rounded-full z-10 ${
                currentStep === step.number 
                  ? 'bg-primary text-primary-foreground'
                  : step.completed
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {step.completed ? <Check className="h-4 w-4" /> : step.number}
            </div>
            
            <span className={`text-xs mt-1 font-medium ${
              currentStep === step.number 
                ? 'text-foreground'
                : step.completed
                  ? 'text-foreground'
                  : 'text-muted-foreground'
            }`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
      
      <div className="p-4 border rounded-lg bg-card text-card-foreground">
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {steps[currentStep - 1].icon}
            {steps[currentStep - 1].title}
          </h3>
          <p className="text-sm text-center text-muted-foreground mb-4">
            {steps[currentStep - 1].description}
          </p>
          
          {currentStep === 1 && (
            <div className="flex flex-col items-center gap-2 w-full">
              <PrintWorkOrderButton
                invoice={invoice}
                patientName={patientName}
                patientPhone={patientPhone}
                rx={rx}
                lensType={lensType}
                coating={coating}
                frame={frame}
                contactLenses={contactLenses}
                contactLensRx={contactLensRx}
                thermalOnly={true}
                isNewInvoice={true}
                onInvoiceSaved={handleInvoiceSaved}
                className="w-full"
                size="lg"
                variant="default"
              />
              {savedInvoiceId && (
                <div className="text-sm font-medium text-green-600 mt-2">
                  {t("invoiceNumber")}: {savedInvoiceId}
                </div>
              )}
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="flex flex-col items-center gap-2 w-full">
              <Button 
                onClick={handlePrintInvoice} 
                size="lg" 
                className="w-full gap-2"
                disabled={!savedInvoiceId}
              >
                <Printer className="h-5 w-5" />
                {t("printInvoice")}
              </Button>
              {savedInvoiceId && (
                <div className="text-sm font-medium text-primary mt-2">
                  {t("invoiceNumber")}: {savedInvoiceId}
                </div>
              )}
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="flex flex-col items-center gap-2 w-full">
              {workOrder ? (
                <CustomPrintWorkOrderButton
                  workOrder={workOrder}
                  invoice={invoice}
                  patient={patient}
                  className="w-full gap-2"
                  size="lg"
                  variant="default"
                  onPrintComplete={handlePrintWorkOrderComplete}
                />
              ) : (
                <PrintWorkOrderButton
                  invoice={invoice}
                  patientName={patientName}
                  patientPhone={patientPhone}
                  rx={rx}
                  lensType={lensType}
                  coating={coating}
                  frame={frame}
                  contactLenses={contactLenses}
                  contactLensRx={contactLensRx}
                  thermalOnly={true}
                  isNewInvoice={false}
                  className="w-full"
                  size="lg"
                  variant="default"
                  onPrintComplete={handlePrintWorkOrderComplete}
                />
              )}
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="flex flex-col items-center gap-2 w-full">
              <Button 
                onClick={handleFinishProcess} 
                size="lg" 
                className="w-full gap-2"
              >
                <RefreshCw className="h-5 w-5" />
                {t("finishProcess")}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {t("finishProcessDescription")}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="gap-1"
        >
          {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {t("previous")}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
          disabled={
            (currentStep === 1 && !savedInvoiceId) ||
            (currentStep === 2 && !printedInvoice) ||
            (currentStep === 3 && !printedWorkOrder) ||
            currentStep === 4
          }
          className="gap-1"
        >
          {t("next")}
          {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      
      {savedInvoiceId && (
        <div className="mt-2 px-3 py-2 bg-muted rounded text-sm">
          <div className="flex items-center gap-2">
            <div className="font-medium">{t("status")}:</div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${steps[0].completed ? "bg-green-500" : "bg-muted-foreground"}`}></div>
                <span className={steps[0].completed ? "text-foreground" : "text-muted-foreground"}>
                  {t("workOrderSaved")} {savedInvoiceId && `(${t("id")}: ${savedInvoiceId})`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${printedInvoice ? "bg-green-500" : "bg-muted-foreground"}`}></div>
                <span className={printedInvoice ? "text-foreground" : "text-muted-foreground"}>
                  {t("invoicePrinted")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${printedWorkOrder ? "bg-green-500" : "bg-muted-foreground"}`}></div>
                <span className={printedWorkOrder ? "text-foreground" : "text-muted-foreground"}>
                  {t("workOrderPrinted")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
