
import React, { useState, useEffect } from "react";
import { usePatientStore } from "@/store/patientStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Check, ArrowLeft, ArrowRight, Glasses, Eye, Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceStepPatient } from "@/components/invoice-steps/InvoiceStepPatient";
import { InvoiceStepProducts } from "@/components/invoice-steps/InvoiceStepProducts";
import { InvoiceStepPayment } from "@/components/invoice-steps/InvoiceStepPayment";
import { InvoiceStepSummary } from "@/components/invoice-steps/InvoiceStepSummary";
import { InvoiceFormProvider } from "@/components/invoice-steps/InvoiceFormContext";
import { ReceiptInvoice } from "@/components/ReceiptInvoice";
import { WorkOrderPrint } from "@/components/WorkOrderPrint";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Printer } from "lucide-react";

const CreateInvoiceContent: React.FC = () => {
  const { t, language } = useLanguageStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [invoiceType, setInvoiceType] = useState<"glasses" | "contacts">("glasses");
  const [invoicePrintOpen, setInvoicePrintOpen] = useState(false);
  const [workOrderPrintOpen, setWorkOrderPrintOpen] = useState(false);
  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  
  const steps = [
    { title: t('clientSection'), icon: "user" },
    { title: t('productSection'), icon: invoiceType === "glasses" ? "glasses" : "eye" },
    { title: t('paymentSection'), icon: "creditCard" },
    { title: t('summarySection'), icon: "fileText" },
  ];

  const variants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    })
  };

  const [direction, setDirection] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handlePrintWorkOrder = () => {
    setWorkOrderPrintOpen(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };
  
  const handlePrintInvoice = () => {
    setInvoicePrintOpen(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // We need to use useInvoiceForm here to access the form context
  const { getValues } = useInvoiceForm();

  const previewInvoice = {
    invoiceId: getValues("workOrderId") || "PREVIEW",
    createdAt: new Date().toISOString(),
    patientName: getValues("patientName") || "Customer Name",
    patientPhone: getValues("patientPhone") || "",
    patientId: getValues("patientId"),
    lensType: getValues("lensType") || "",
    lensPrice: getValues("lensPrice") || 0,
    coating: getValues("coating") || "",
    coatingPrice: getValues("coatingPrice") || 0,
    frameBrand: getValues("frameBrand") || "",
    frameModel: getValues("frameModel") || "",
    frameColor: getValues("frameColor") || "",
    framePrice: getValues("framePrice") || 0,
    discount: getValues("discount") || 0,
    deposit: getValues("deposit") || 0,
    total: getValues("total") || 0,
    remaining: getValues("remaining") || 0,
    paymentMethod: getValues("paymentMethod") || "Cash",
    isPaid: (getValues("remaining") || 0) <= 0,
    authNumber: getValues("authNumber") || ""
  };

  const handleSaveInvoice = () => {
    const formData = getValues();
    const invoiceData = {
      patientId: formData.patientId,
      patientName: formData.patientName,
      patientPhone: formData.patientPhone,
      
      lensType: formData.lensType,
      lensPrice: formData.lensPrice,
      
      coating: formData.coating,
      coatingPrice: formData.coatingPrice,
      
      frameBrand: formData.frameBrand,
      frameModel: formData.frameModel,
      frameColor: formData.frameColor,
      framePrice: formData.framePrice,
      
      discount: formData.discount,
      deposit: formData.deposit,
      total: formData.total,
      
      paymentMethod: formData.paymentMethod,
      authNumber: formData.authNumber
    };
    
    const invoiceId = addInvoice(invoiceData);
    getValues("workOrderId", invoiceId);
    
    toast({
      title: t('success'),
      description: `${t('invoiceSavedSuccess')} ${invoiceId}.`,
    });
    
    setCurrentStep(3);
  };

  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="py-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className={`text-2xl font-bold flex items-center gap-2 ${textAlignClass}`}>
          <FileText className="w-6 h-6 text-primary" />
          {t('invoiceTitle')}
        </h2>
      </div>

      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className={`relative flex flex-col items-center ${idx === currentStep ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                ${idx === currentStep ? 'border-primary bg-primary text-white' : 
                  idx < currentStep ? 'border-primary bg-primary/10 text-primary' : 'border-muted-foreground'}`}
              >
                {idx < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span className="mt-2 text-sm font-medium">{step.title}</span>
              {idx < steps.length - 1 && (
                <div 
                  className={`absolute top-5 left-10 w-[calc(100%-20px)] h-0.5 
                  ${idx < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="border border-muted-foreground/10 shadow-md">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-primary">
            {steps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="min-h-[400px]"
            >
              {currentStep === 0 && (
                <InvoiceStepPatient 
                  invoiceType={invoiceType} 
                  onInvoiceTypeChange={setInvoiceType} 
                />
              )}

              {currentStep === 1 && (
                <InvoiceStepProducts invoiceType={invoiceType} />
              )}

              {currentStep === 2 && (
                <InvoiceStepPayment />
              )}

              {currentStep === 3 && (
                <InvoiceStepSummary 
                  setInvoicePrintOpen={setInvoicePrintOpen}
                  setWorkOrderPrintOpen={setWorkOrderPrintOpen}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('previous')}
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={nextStep} 
                className="flex items-center gap-2"
              >
                {t('next')}
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(0)}
                  className="flex items-center gap-2"
                >
                  {t('newInvoice')}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Sheet open={invoicePrintOpen} onOpenChange={setInvoicePrintOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto print:w-full print:max-w-none">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-4" />
              {t('invoice')}
            </SheetTitle>
            <SheetDescription>
              <Button onClick={handlePrintInvoice} className="mt-2">
                <Printer className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {t('print')}
              </Button>
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 print:mt-0">
            <ReceiptInvoice 
              invoice={previewInvoice}
              isPrintable={true}
            />
          </div>
          <SheetFooter className="print:hidden mt-4">
            <Button onClick={() => setInvoicePrintOpen(false)}>{t('close')}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      <Sheet open={workOrderPrintOpen} onOpenChange={setWorkOrderPrintOpen}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto print:w-full print:!px-1 print:max-w-none">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 hide-print">
              <FileText className="w-5 h-5" />
              {t('workOrder')}
            </SheetTitle>
            <SheetDescription>
              <Button onClick={handlePrintWorkOrder} className="mt-2">
                <Printer className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {t('print')}
              </Button>
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 print:mt-0">
            <WorkOrderPrint 
              invoice={previewInvoice}
              patientName={getValues("patientName") || ""}
              patientPhone={getValues("patientPhone") || ""}
              rx={getValues("rx")}
              lensType={getValues("lensType") || ""}
              coating={getValues("coating") || ""}
              frame={getValues("skipFrame") ? undefined : {
                brand: getValues("frameBrand") || "",
                model: getValues("frameModel") || "",
                color: getValues("frameColor") || "",
                size: getValues("frameSize") || "",
                price: getValues("framePrice") || 0
              }}
            />
          </div>
          <SheetFooter className="print:hidden mt-4">
            <Button onClick={() => setWorkOrderPrintOpen(false)}>{t('close')}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

// This is the main component that wraps the content with InvoiceFormProvider
const CreateInvoice: React.FC = () => {
  return (
    <InvoiceFormProvider>
      <CreateInvoiceContent />
    </InvoiceFormProvider>
  );
};

export default CreateInvoice;
