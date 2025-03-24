
import { printWorkOrderReceipt } from "@/components/WorkOrderReceiptPrint";
import { toast } from "@/hooks/use-toast";
import { createPrintFrame, executePrint, preparePrintArea, cleanupPrintArea } from "./printerCore";
import { prepareA4Document, prepareLabelDocument, prepareReceiptDocument } from "./documentFormatter";

/**
 * Main service for handling HTML-based printing
 */
export const printHtml = (htmlContent: string, type: 'label' | 'receipt' | 'a4' = 'receipt', onComplete?: () => void) => {
  try {
    const iframe = createPrintFrame(htmlContent);
    
    // Wait for iframe content to load
    setTimeout(() => {
      // Print the iframe content
      executePrint(iframe, 
        // On success
        () => {
          if (onComplete) onComplete();
          cleanupPrintArea(iframe);
        },
        // On error
        (error) => {
          console.error("Error printing HTML content:", error);
          cleanupPrintArea(iframe);
          toast({
            title: "Error",
            description: "Failed to print. Please try again.",
            variant: "destructive",
          });
        }
      );
    }, 300);
  } catch (error) {
    console.error("Error in printHtml:", error);
    toast({
      title: "Error",
      description: "Failed to print. Please try again.",
      variant: "destructive",
    });
    if (onComplete) onComplete();
  }
};

/**
 * Main service for handling text-based printing
 */
export const printText = (content: string, onComplete?: () => void) => {
  try {
    const printWindow = window.open('', '_blank', 'width=500,height=500');
    if (!printWindow) {
      throw new Error("Could not open print window");
    }
    
    printWindow.document.write(`
      <html>
        <head><title>Print</title></head>
        <body style="font-family: monospace; white-space: pre-wrap;">
          ${content}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      if (onComplete) onComplete();
    }, 300);
  } catch (error) {
    console.error("Error in printText:", error);
    toast({
      title: "Error",
      description: "Failed to print text. Please try again.",
      variant: "destructive",
    });
    if (onComplete) onComplete();
  }
};
