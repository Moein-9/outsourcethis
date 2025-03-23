
import React, { useState } from "react";
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
import { PrinterIcon, CheckCircle } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { toast } from "@/hooks/use-toast";
import { PrintService } from "@/utils/PrintService";
import { printWorkOrderReceipt } from "./WorkOrderReceiptPrint";
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
  const { t, language } = useLanguageStore();
  const [printingInProgress, setPrintingInProgress] = useState(false);
  const [printCompleted, setPrintCompleted] = useState(false);
  const isRtl = language === 'ar';
  const { addInvoice } = useInvoiceStore();
  
  const handlePrint = async () => {
    if (printingInProgress) return;
    
    setPrintingInProgress(true);
    setPrintCompleted(false);
    
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

      // Always use thermal printing by default
      CustomPrintService.printWorkOrder(currentInvoice, currentInvoice, {
        name: patientName,
        phone: patientPhone,
        rx: rx
      });
      
      setTimeout(() => {
        setPrintingInProgress(false);
        setPrintCompleted(true);
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

  const handleDone = () => {
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("printWorkOrder")}</DialogTitle>
          <DialogDescription>
            {printCompleted 
              ? t("printingCompletedDescription") 
              : t("printWorkOrderDescription")}
          </DialogDescription>
        </DialogHeader>
        
        {printCompleted ? (
          <div className="flex flex-col items-center py-6">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-center mb-4">
              {t("workOrderPrintedSuccessfully")}
            </p>
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="mb-4">
              {t("printWillUseDefaultThermalFormat")}
            </p>
          </div>
        )}
        
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleDone}
          >
            {t("done")}
          </Button>
          {!printCompleted && (
            <Button
              type="button"
              onClick={handlePrint}
              disabled={printingInProgress}
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              {printingInProgress ? t("printing") : t("print")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
