
import React, { useState } from "react";
import { Invoice } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PrinterIcon, Newspaper, FileText } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { toast } from "sonner";
import { PrintService } from "@/utils/PrintService";
import { CustomPrintService } from "@/utils/CustomPrintService";
import { CustomWorkOrderReceipt } from "@/components/CustomWorkOrderReceipt";

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
  trigger?: React.ReactNode;
  thermalOnly?: boolean;
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
  trigger,
  thermalOnly = false
}) => {
  const { t, language } = useLanguageStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"a4" | "receipt" | null>(thermalOnly ? "receipt" : null);
  const [printingInProgress, setPrintingInProgress] = useState(false);
  const isRtl = language === 'ar';
  
  const handleTriggerClick = () => {
    if (thermalOnly) {
      handlePrint();
    } else {
      setIsDialogOpen(true);
    }
  };
  
  const handlePrint = () => {
    if (!selectedFormat || printingInProgress) return;
    
    setPrintingInProgress(true);
    
    try {
      // Prepare the work order object with all necessary data
      const workOrderData = {
        ...invoice,
        rx,
        patientName,
        patientPhone,
        lensType,
        coating,
        frameBrand: frame?.brand,
        frameModel: frame?.model,
        frameColor: frame?.color,
        frameSize: frame?.size,
        framePrice: frame?.price,
        contactLenses
      };
      
      if (selectedFormat === "receipt") {
        // Use CustomPrintService for thermal receipt printing
        CustomPrintService.printWorkOrder(workOrderData, invoice, {
          name: patientName,
          phone: patientPhone,
          rx
        });
        
        setTimeout(() => {
          setPrintingInProgress(false);
          setIsDialogOpen(false);
          toast.success(t("printingCompleted"));
        }, 1000);
      } else {
        // For A4 format, create a custom A4 layout using the same design
        const a4Content = `
          <div style="font-family: ${isRtl ? 'Zain, sans-serif' : 'Yrsa, serif'}; max-width: 210mm; margin: 0 auto; padding: 20mm 10mm;" dir="${isRtl ? 'rtl' : 'ltr'}">
            <div style="text-align: center; margin-bottom: 10mm;">
              <h1 style="font-size: 24px; margin-bottom: 5mm;">${t("workOrder")}</h1>
              <p style="font-size: 18px; margin-bottom: 2mm;">${t("orderNumber")}: ${invoice.workOrderId}</p>
              <p style="font-size: 14px;">${new Date(invoice.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
            
            <div style="margin: 0 auto; max-width: 80mm; transform: scale(1.3); transform-origin: top center;">
              ${CustomPrintService.generateCustomWorkOrderHtml(workOrderData, invoice, {
                name: patientName,
                phone: patientPhone,
                rx
              })}
            </div>
          </div>
        `;
        
        const htmlContent = PrintService.prepareA4Document(a4Content, t("workOrder"));
        PrintService.printHtml(htmlContent, 'a4', () => {
          setPrintingInProgress(false);
          setIsDialogOpen(false);
          toast.success(t("printingCompleted"));
        });
      }
    } catch (error) {
      console.error('Printing error:', error);
      setPrintingInProgress(false);
      toast.error(t("printingFailed"));
    }
  };
  
  return (
    <>
      <Dialog open={isDialogOpen && !thermalOnly} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild onClick={handleTriggerClick}>
          {trigger || (
            <Button variant="outline" size="sm" className="gap-1">
              <PrinterIcon className="h-4 w-4" /> {t("printWorkOrder")}
            </Button>
          )}
        </DialogTrigger>
        {!thermalOnly && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("selectPrintFormat")}</DialogTitle>
              <DialogDescription>
                {t("choosePrintFormatDescription")}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 py-4">
              <div 
                className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedFormat === "a4" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedFormat("a4")}
              >
                <FileText className={`h-8 w-8 ${selectedFormat === "a4" ? "text-primary" : "text-muted-foreground"}`} />
                <span className="font-medium">A4 {t("paper")}</span>
                <span className="text-xs text-center text-muted-foreground">{t("standardFormat")}</span>
              </div>
              
              <div 
                className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedFormat === "receipt" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedFormat("receipt")}
              >
                <Newspaper className={`h-8 w-8 ${selectedFormat === "receipt" ? "text-primary" : "text-muted-foreground"}`} />
                <span className="font-medium">{t("receiptFormat")}</span>
                <span className="text-xs text-center text-muted-foreground">{t("compactFormat")}</span>
              </div>
            </div>
            
            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button
                type="button"
                onClick={handlePrint}
                disabled={!selectedFormat || printingInProgress}
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                {printingInProgress ? t('printing') : t('print')}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
