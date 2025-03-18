
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
            @media print {
              @page {
                margin: ${selectedFormat === 'receipt' ? '0' : '10mm'};
                padding: 0;
                size: ${selectedFormat === 'receipt' ? '80mm auto' : 'auto'};
              }
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div id="content"></div>
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
      iframe.onload = () => {
        const contentDiv = iframe.contentDocument?.getElementById('content');
        if (contentDiv) {
          if (selectedFormat === "a4") {
            // Render A4 content directly
            const container = document.createElement('div');
            container.style.width = '210mm';
            container.style.margin = '0 auto';
            
            // Copy styles to the iframe
            const styles = Array.from(document.styleSheets)
              .map(styleSheet => {
                try {
                  return Array.from(styleSheet.cssRules)
                    .map(rule => rule.cssText)
                    .join('\n');
                } catch (e) {
                  return '';
                }
              })
              .join('\n');
            
            const styleElement = iframe.contentDocument.createElement('style');
            styleElement.textContent = styles;
            iframe.contentDocument.head.appendChild(styleElement);
            
            // Create a version of WorkOrderPrint in the iframe
            contentDiv.innerHTML = `
              <div style="width: 210mm; margin: 0 auto; padding: 10mm;">
                <!-- The invoice content will be injected here by React rendering -->
              </div>
            `;
            
          } else {
            // Receipt content
            contentDiv.innerHTML = `
              <div style="width: 80mm; margin: 0 auto;">
                <!-- The receipt content will be injected here by React rendering -->
              </div>
            `;
          }
        }
      };
    } else {
      setPrintingInProgress(false);
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
