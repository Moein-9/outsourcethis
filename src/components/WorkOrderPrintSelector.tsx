
import React, { useState, useEffect } from "react";
import { Invoice, useInvoiceStore } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PrinterIcon, CheckCircle2 } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { toast } from "@/hooks/use-toast";
import { CustomPrintService } from "@/utils/CustomPrintService";

interface WorkOrderPrintSelectorProps {
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
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isNewInvoice?: boolean;
  onInvoiceSaved?: (invoiceId: string) => void;
}

export const WorkOrderPrintSelector: React.FC<WorkOrderPrintSelectorProps> = ({
  invoice,
  patientName,
  patientPhone,
  rx,
  lensType,
  coating,
  frame,
  contactLenses,
  contactLensRx,
  isOpen,
  onOpenChange,
  isNewInvoice = false,
  onInvoiceSaved,
}) => {
  const { t } = useLanguageStore();
  const [printingInProgress, setPrintingInProgress] = useState(false);
  const [printingCompleted, setPrintingCompleted] = useState(false);
  const { addInvoice } = useInvoiceStore();
  
  // Automatically start printing when dialog opens
  useEffect(() => {
    if (isOpen && !printingInProgress && !printingCompleted) {
      handlePrint();
    }
  }, [isOpen]);
  
  const handlePrint = async () => {
    if (printingInProgress) return;
    
    setPrintingInProgress(true);
    
    try {
      // Save invoice if it's new
      let currentInvoice = invoice;
      if (isNewInvoice && !invoice.invoiceId) {
        try {
          // Save the invoice to get an ID
          const invoiceId = addInvoice({
            patientId: invoice.patientId,
            patientName: invoice.patientName,
            patientPhone: invoice.patientPhone,
            lensType: invoice.lensType,
            lensPrice: invoice.lensPrice,
            coating: invoice.coating,
            coatingPrice: invoice.coatingPrice,
            frameBrand: invoice.frameBrand,
            frameModel: invoice.frameModel,
            frameColor: invoice.frameColor,
            frameSize: invoice.frameSize,
            framePrice: invoice.framePrice,
            discount: invoice.discount,
            deposit: invoice.deposit,
            total: invoice.total,
            paymentMethod: invoice.paymentMethod,
            authNumber: invoice.authNumber,
            workOrderId: invoice.workOrderId,
          });
          
          // Update the invoice with the new ID
          currentInvoice = { ...invoice, invoiceId };
          
          // If callback provided, call it with the new ID
          if (onInvoiceSaved) {
            onInvoiceSaved(invoiceId);
          }
          
          toast({
            title: t("invoiceSaved"),
            description: t("invoiceNumber") + ": " + invoiceId,
          });
        } catch (error) {
          console.error("Error saving invoice:", error);
          toast({
            title: t("error"),
            description: t("errorSavingInvoice"),
            variant: "destructive",
          });
          setPrintingInProgress(false);
          return;
        }
      }

      // Use CustomPrintService for thermal printing
      CustomPrintService.printWorkOrder(currentInvoice, currentInvoice, {
        name: patientName,
        phone: patientPhone,
        rx: rx
      });
      
      // Don't close the dialog, just show completion status
      setTimeout(() => {
        setPrintingInProgress(false);
        setPrintingCompleted(true);
        toast({
          title: t("success"),
          description: t("printingCompleted"),
        });
      }, 1000);
    } catch (error) {
      console.error('Printing error:', error);
      setPrintingInProgress(false);
      toast({
        title: t("error"),
        description: t("printingFailed"),
        variant: "destructive",
      });
    }
  };
  
  const handleClose = () => {
    setPrintingCompleted(false);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{printingCompleted ? t("printingComplete") : t("printingWorkOrder")}</DialogTitle>
          <DialogDescription>
            {printingCompleted 
              ? t("workOrderPrintedSuccessfully") 
              : t("preparingWorkOrderForPrinting")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-6">
          {printingCompleted ? (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-center text-muted-foreground">
                {t("workOrderSentToPrinter")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-pulse rounded-full bg-primary/10 p-3">
                <PrinterIcon className="h-8 w-8 text-primary" />
              </div>
              <p className="text-center text-muted-foreground">
                {t("sendingToPrinter")}
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-center">
          <Button
            type="button"
            onClick={handleClose}
          >
            {printingCompleted ? t("done") : t("cancel")}
          </Button>
          {printingCompleted && (
            <Button
              type="button"
              onClick={handlePrint}
              variant="outline"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              {t("printAgain")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
