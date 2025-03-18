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
import { WorkOrderPrint } from "./WorkOrderPrint";
import { WorkOrderReceiptPrint } from "./WorkOrderReceiptPrint";
import { useLanguageStore } from "@/store/languageStore";

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
  trigger
}) => {
  const { t } = useLanguageStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"a4" | "receipt" | null>(null);
  const [printingInProgress, setPrintingInProgress] = useState(false);
  
  const handlePrint = () => {
    if (!selectedFormat || printingInProgress) return;
    
    setPrintingInProgress(true);
    
    // Create and use an iframe for printing to avoid Chrome's preview issues
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    
    document.body.appendChild(iframe);
    
    // Set up a message listener to know when printing is done
    window.addEventListener('message', function handler(e) {
      if (e.data === 'print-complete') {
        window.removeEventListener('message', handler);
        document.body.removeChild(iframe);
        setPrintingInProgress(false);
        setIsDialogOpen(false);
      }
    }, { once: true });
    
    if (iframe.contentWindow) {
      // Set up the iframe content
      iframe.contentWindow.document.open();
      
      // Write the basic structure
      iframe.contentWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print ${selectedFormat === 'a4' ? 'Work Order' : 'Receipt'}</title>
          <meta charset="utf-8">
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            #print-content {
              width: ${selectedFormat === 'receipt' ? '80mm' : '210mm'};
              margin: 0 auto;
              padding: ${selectedFormat === 'receipt' ? '0' : '10mm'};
            }
            @media print {
              @page {
                margin: ${selectedFormat === 'receipt' ? '0' : '10mm'};
                padding: 0;
                size: ${selectedFormat === 'receipt' ? '80mm' : 'A4'};
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div id="print-content"></div>
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              setTimeout(function() {
                window.focus();
                window.print();
                setTimeout(function() {
                  window.parent.postMessage('print-complete', '*');
                }, 500);
              }, 800);
            });
          </script>
        </body>
        </html>
      `);
      
      iframe.contentWindow.document.close();
      
      // After document is loaded, inject the content
      const printContent = document.createElement('div');
      
      if (selectedFormat === "a4") {
        const workOrderPrint = document.createElement('div');
        workOrderPrint.innerHTML = `
          <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px;">${t("workOrder")}</h1>
          <p style="text-align: center; font-size: 18px; margin-bottom: 20px;">${t("orderNumber")}: ${invoice.invoiceId}</p>
          <!-- Additional work order content would be inserted here -->
        `;
        printContent.appendChild(workOrderPrint);
      } else {
        const receiptPrint = document.createElement('div');
        receiptPrint.innerHTML = `
          <h1 style="text-align: center; font-size: 16px; margin-bottom: 10px;">${t("receiptFormat")}</h1>
          <p style="text-align: center; font-size: 14px; margin-bottom: 10px;">${t("orderNumber")}: ${invoice.invoiceId}</p>
          <!-- Additional receipt content would be inserted here -->
        `;
        printContent.appendChild(receiptPrint);
      }
      
      iframe.onload = () => {
        const contentDiv = iframe.contentDocument?.getElementById('print-content');
        if (contentDiv) {
          if (selectedFormat === "a4") {
            const componentHtml = `
              <div id="work-order">
                <!-- Using the full WorkOrderPrint component content -->
              </div>
            `;
            contentDiv.innerHTML = componentHtml;
            
            // Append styles for proper rendering
            const style = document.createElement('style');
            style.textContent = `
              #work-order {
                width: 100%;
                max-width: 210mm;
                margin: 0 auto;
                font-family: Arial, sans-serif;
              }
            `;
            iframe.contentDocument?.head.appendChild(style);
            
            // Render the actual component content
            const workOrder = iframe.contentDocument?.getElementById('work-order');
            if (workOrder) {
              // This simplified version just shows the essential information
              workOrder.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                  <h1 style="font-size: 24px; margin-bottom: 10px;">${t("workOrder")}</h1>
                  <p style="font-size: 16px;">${t("orderNumber")}: ${invoice.invoiceId}</p>
                  <p style="font-size: 14px;">${new Date(invoice.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                  <h2 style="font-size: 18px; margin-bottom: 10px;">${t("patientInformation")}</h2>
                  <p><strong>${t("name")}:</strong> ${patientName || invoice.patientName || "-"}</p>
                  <p><strong>${t("phone")}:</strong> ${patientPhone || invoice.patientPhone || "-"}</p>
                </div>
                
                ${frame ? `
                <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                  <h2 style="font-size: 18px; margin-bottom: 10px;">${t("frameDetails")}</h2>
                  <p><strong>${t("brand")}:</strong> ${frame.brand}</p>
                  <p><strong>${t("model")}:</strong> ${frame.model}</p>
                  <p><strong>${t("color")}:</strong> ${frame.color}</p>
                  <p><strong>${t("price")}:</strong> ${frame.price.toFixed(3)} KWD</p>
                </div>
                ` : ''}
                
                ${rx ? `
                <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                  <h2 style="font-size: 18px; margin-bottom: 10px;">${t("prescriptionDetails")}</h2>
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
                
                <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                  <h2 style="font-size: 18px; margin-bottom: 10px;">${t("paymentInformation")}</h2>
                  <p><strong>${t("total")}:</strong> ${invoice.total.toFixed(3)} KWD</p>
                  <p><strong>${t("paid")}:</strong> ${(invoice.deposit || 0).toFixed(3)} KWD</p>
                  <p><strong>${t("remaining")}:</strong> ${(invoice.total - (invoice.deposit || 0)).toFixed(3)} KWD</p>
                </div>
                
                <div style="margin-top: 40px; display: flex; justify-content: space-between;">
                  <div>
                    <p style="font-weight: bold;">${t("technicianSignature")}</p>
                    <div style="margin-top: 30px; border-bottom: 1px solid #000; width: 150px;"></div>
                  </div>
                  <div>
                    <p style="font-weight: bold;">${t("qualityConfirmation")}</p>
                    <div style="margin-top: 30px; border-bottom: 1px solid #000; width: 150px;"></div>
                  </div>
                </div>
              `;
            }
          } else {
            // Receipt format
            contentDiv.innerHTML = `
              <div style="width: 80mm; font-family: Arial, sans-serif; padding: 5mm 2mm;">
                <div style="text-align: center; margin-bottom: 10px;">
                  <h1 style="font-size: 16px; margin-bottom: 5px;">${t("receiptFormat")}</h1>
                  <p style="font-size: 14px;">${t("orderNumber")}: ${invoice.invoiceId}</p>
                  <p style="font-size: 12px;">${new Date(invoice.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div style="margin-bottom: 10px; border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 5px 0;">
                  <p><strong>${t("name")}:</strong> ${patientName || invoice.patientName || "-"}</p>
                  <p><strong>${t("phone")}:</strong> ${patientPhone || invoice.patientPhone || "-"}</p>
                </div>
                
                ${frame ? `
                <div style="margin-bottom: 10px;">
                  <h2 style="font-size: 14px; margin-bottom: 5px;">${t("frameDetails")}</h2>
                  <p><strong>${t("brand")}:</strong> ${frame.brand}</p>
                  <p><strong>${t("model")}:</strong> ${frame.model}</p>
                  <p><strong>${t("color")}:</strong> ${frame.color}</p>
                  <p><strong>${t("price")}:</strong> ${frame.price.toFixed(3)} KWD</p>
                </div>
                ` : ''}
                
                <div style="margin-top: 10px; border-top: 1px dashed #000; padding-top: 5px;">
                  <p><strong>${t("total")}:</strong> ${invoice.total.toFixed(3)} KWD</p>
                  <p><strong>${t("paid")}:</strong> ${(invoice.deposit || 0).toFixed(3)} KWD</p>
                  <p><strong>${t("remaining")}:</strong> ${(invoice.total - (invoice.deposit || 0)).toFixed(3)} KWD</p>
                </div>
                
                <div style="text-align: center; margin-top: 20px; font-size: 12px;">
                  <p>${t("thankYouForYourPurchase")}</p>
                  <p>${t("pleaseKeepReceipt")}</p>
                </div>
              </div>
            `;
          }
        }
      };
    } else {
      setPrintingInProgress(false);
      toast.error(t("printFrameCreationFailed"));
    }
  };
  
  const renderPrintComponent = () => {
    if (selectedFormat === "a4") {
      return (
        <WorkOrderPrint
          invoice={invoice}
          patientName={patientName}
          patientPhone={patientPhone}
          rx={rx}
          lensType={lensType}
          coating={coating}
          frame={frame}
          contactLenses={contactLenses}
          contactLensRx={contactLensRx}
        />
      );
    } else if (selectedFormat === "receipt") {
      return (
        <WorkOrderReceiptPrint
          invoice={invoice}
          patientName={patientName}
          patientPhone={patientPhone}
          rx={rx}
          lensType={lensType}
          coating={coating}
          frame={frame}
          contactLenses={contactLenses}
          contactLensRx={contactLensRx}
        />
      );
    }
    
    return null;
  };
  
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm" className="gap-1">
              <PrinterIcon className="h-4 w-4" /> {t("printWorkOrder")}
            </Button>
          )}
        </DialogTrigger>
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
              {printingInProgress ? t("printing") : t("print")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Hidden print component */}
      <div className="hidden print:block print:m-0">
        {renderPrintComponent()}
      </div>
    </>
  );
};
