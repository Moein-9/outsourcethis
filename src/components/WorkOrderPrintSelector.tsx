
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
import { PrinterIcon, Newspaper, FileText } from "lucide-react";
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
  const [selectedFormat, setSelectedFormat] = useState<"a4" | "receipt" | "thermal" | null>(null);
  const [printingInProgress, setPrintingInProgress] = useState(false);
  const isRtl = language === 'ar';
  const { addInvoice } = useInvoiceStore();
  
  const handlePrint = async () => {
    if (!selectedFormat || printingInProgress) return;
    
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

      if (selectedFormat === "thermal") {
        // Use CustomPrintService for thermal printing
        CustomPrintService.printWorkOrder(currentInvoice, currentInvoice, {
          name: patientName,
          phone: patientPhone,
          rx: rx
        });
        
        setTimeout(() => {
          setPrintingInProgress(false);
          onOpenChange(false);
          toast.success(t("printingCompleted"));
        }, 1000);
      } else if (selectedFormat === "receipt") {
        // Use the existing receipt printer
        printWorkOrderReceipt({
          invoice: currentInvoice,
          patientName,
          patientPhone,
          rx,
          lensType,
          coating,
          frame,
          contactLenses,
          contactLensRx
        });
        
        setTimeout(() => {
          setPrintingInProgress(false);
          onOpenChange(false);
          toast.success(t("printingCompleted"));
        }, 1000);
      } else {
        // Use A4 format
        const a4Content = `
          <div style="font-family: ${isRtl ? 'Zain, sans-serif' : 'Yrsa, serif'}; max-width: 210mm; margin: 0 auto; padding: 20mm 10mm;" dir="${isRtl ? 'rtl' : 'ltr'}">
            <div style="text-align: center; margin-bottom: 10mm;">
              <h1 style="font-size: 24px; margin-bottom: 5mm;">${t("workOrder")}</h1>
              <p style="font-size: 18px; margin-bottom: 2mm;">${t("orderNumber")}: ${currentInvoice.invoiceId}</p>
              <p style="font-size: 14px;">${new Date(currentInvoice.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div style="margin-bottom: 10mm; border: 1px solid #ddd; border-radius: 5px; padding: 15px;">
              <h2 style="font-size: 18px; margin-bottom: 5mm; border-bottom: 1px solid #eee; padding-bottom: 5px;">${t("patientInformation")}</h2>
              <p><strong>${t("name")}:</strong> ${patientName || currentInvoice.patientName || "-"}</p>
              <p><strong>${t("phone")}:</strong> ${patientPhone || currentInvoice.patientPhone || "-"}</p>
            </div>
            
            ${frame ? `
            <div style="margin-bottom: 10mm; border: 1px solid #ddd; border-radius: 5px; padding: 15px;">
              <h2 style="font-size: 18px; margin-bottom: 5mm; border-bottom: 1px solid #eee; padding-bottom: 5px;">${t("frameDetails")}</h2>
              <p><strong>${t("brand")}:</strong> ${frame.brand}</p>
              <p><strong>${t("model")}:</strong> ${frame.model}</p>
              <p><strong>${t("color")}:</strong> ${frame.color}</p>
              <p><strong>${t("price")}:</strong> ${frame.price.toFixed(3)} ${t("currency")}</p>
            </div>
            ` : ''}
            
            ${rx ? `
            <div style="margin-bottom: 10mm; border: 1px solid #ddd; border-radius: 5px; padding: 15px;">
              <h2 style="font-size: 18px; margin-bottom: 5mm; border-bottom: 1px solid #eee; padding-bottom: 5px;">${t("prescriptionDetails")}</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">${t("eye")}</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">SPH</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">CYL</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">AXIS</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">ADD</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">PD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${t("rightEye")} (OD)</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${rx.sphereOD || "-"}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${rx.cylOD || "-"}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${rx.axisOD || "-"}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${rx.addOD || "-"}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${rx.pdRight || "-"}</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${t("leftEye")} (OS)</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${rx.sphereOS || "-"}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${rx.cylOS || "-"}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${rx.axisOS || "-"}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${rx.addOS || "-"}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${rx.pdLeft || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            ` : ''}
            
            ${lensType ? `
            <div style="margin-bottom: 10mm; border: 1px solid #ddd; border-radius: 5px; padding: 15px;">
              <h2 style="font-size: 18px; margin-bottom: 5mm; border-bottom: 1px solid #eee; padding-bottom: 5px;">${t("lensDetails")}</h2>
              <p><strong>${t("type")}:</strong> ${lensType}</p>
              <p><strong>${t("price")}:</strong> ${currentInvoice.lensPrice.toFixed(3)} ${t("currency")}</p>
              ${coating ? `<p><strong>${t("coating")}:</strong> ${coating}</p>` : ''}
              ${coating ? `<p><strong>${t("coatingPrice")}:</strong> ${currentInvoice.coatingPrice.toFixed(3)} ${t("currency")}</p>` : ''}
            </div>
            ` : ''}
            
            <div style="margin-bottom: 10mm; border: 1px solid #ddd; border-radius: 5px; padding: 15px;">
              <h2 style="font-size: 18px; margin-bottom: 5mm; border-bottom: 1px solid #eee; padding-bottom: 5px;">${t("paymentInformation")}</h2>
              <p><strong>${t("subtotal")}:</strong> ${(currentInvoice.total + currentInvoice.discount).toFixed(3)} ${t("currency")}</p>
              ${currentInvoice.discount > 0 ? `<p><strong>${t("discount")}:</strong> -${currentInvoice.discount.toFixed(3)} ${t("currency")}</p>` : ''}
              <p><strong>${t("total")}:</strong> ${currentInvoice.total.toFixed(3)} ${t("currency")}</p>
              <p><strong>${t("paid")}:</strong> ${currentInvoice.deposit.toFixed(3)} ${t("currency")}</p>
              <p><strong>${t("remaining")}:</strong> ${(currentInvoice.total - currentInvoice.deposit).toFixed(3)} ${t("currency")}</p>
            </div>
            
            <div style="margin-top: 20mm; display: flex; justify-content: space-between;">
              <div>
                <p style="font-weight: bold; margin-bottom: 30px;">${t("technicianSignature")}</p>
                <div style="border-bottom: 1px solid #000; width: 150px;"></div>
                <p style="margin-top: 5px; font-size: 12px;">${t("date")}: ___/___/_____</p>
              </div>
              <div>
                <p style="font-weight: bold; margin-bottom: 30px;">${t("qualityConfirmation")}</p>
                <div style="border-bottom: 1px solid #000; width: 150px;"></div>
                <p style="margin-top: 5px; font-size: 12px;">${t("date")}: ___/___/_____</p>
              </div>
            </div>
          </div>
        `;
        
        const htmlContent = PrintService.prepareA4Document(a4Content, t("workOrder"));
        PrintService.printHtml(htmlContent, 'a4', () => {
          setPrintingInProgress(false);
          onOpenChange(false);
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("selectPrintFormat")}</DialogTitle>
          <DialogDescription>
            {t("choosePrintFormatDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 py-4">
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
          
          <div 
            className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all ${
              selectedFormat === "thermal" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onClick={() => setSelectedFormat("thermal")}
          >
            <PrinterIcon className={`h-8 w-8 ${selectedFormat === "thermal" ? "text-primary" : "text-muted-foreground"}`} />
            <span className="font-medium">{t("thermalPrint")}</span>
            <span className="text-xs text-center text-muted-foreground">{t("smallReceiptFormat")}</span>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={handlePrint}
            disabled={!selectedFormat || printingInProgress}
          >
            <PrinterIcon className="h-4 w-4 mr-2" />
            {printingInProgress ? t("printing") : t("print")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
