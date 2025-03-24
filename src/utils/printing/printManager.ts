
import { toast } from "@/hooks/use-toast";
import { createPrintFrame, executePrint, preparePrintArea, cleanupPrintArea } from "./printerCore";
import { prepareA4Document, prepareLabelDocument, prepareReceiptDocument, prepareWorkOrderDocument } from "./documentFormatter";

/**
 * Main service for handling HTML-based printing
 */
export const printHtml = (htmlContent: string, type: 'label' | 'receipt' | 'a4' = 'receipt', onComplete?: () => void) => {
  try {
    // Create a print frame with the content
    const iframe = createPrintFrame(htmlContent);
    
    // Prepare the print area
    preparePrintArea();
    
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
    // Prepare a simple HTML document with the text content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print Text</title>
        <style>
          @page {
            size: 80mm auto !important;
            margin: 0mm !important;
          }
          body {
            font-family: monospace !important;
            white-space: pre-wrap !important;
            width: 80mm !important;
            margin: 0 !important;
            padding: 5mm !important;
            font-size: 10pt !important;
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;
    
    // Use the printHtml method for consistency
    printHtml(htmlContent, 'receipt', onComplete);
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
