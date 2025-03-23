
import { toast } from "@/hooks/use-toast";
import { useLanguageStore } from "@/store/languageStore";
import { printWorkOrderReceipt } from "@/components/WorkOrderReceiptPrint";

export class CustomPrintService {
  static printWorkOrder(workOrder: any, invoice?: any, patient?: any) {
    console.log("CustomPrintService: Printing work order", { workOrder, invoice, patient });
    
    try {
      // First approach: Try to print via printWorkOrderReceipt function
      if (typeof printWorkOrderReceipt === 'function') {
        printWorkOrderReceipt(workOrder);
        return;
      }
      
      // Backup approach: Create and print manually
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({
          title: "Error",
          description: "Unable to open print window. Please allow popups for this site.",
          variant: "destructive",
        });
        return;
      }
      
      // Add all the required styles and content
      printWindow.document.write(`
        <html>
          <head>
            <title>Work Order</title>
            <style>
              @media print {
                @page {
                  size: 80mm auto !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }
                
                body {
                  width: 80mm !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: white !important;
                }
                
                #work-order-receipt {
                  width: 76mm !important;
                  max-width: 76mm !important;
                  page-break-after: always !important;
                  page-break-inside: avoid !important;
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                  padding: 2mm !important;
                  margin: 0 !important;
                  background: white !important;
                  height: auto !important;
                  min-height: 0 !important;
                  max-height: none !important;
                }
                
                /* Force content to be visible */
                .print-receipt * {
                  visibility: visible !important;
                  opacity: 1 !important;
                }
                
                /* Improve dynamic sizing */
                html, body {
                  height: auto !important;
                  min-height: 0 !important;
                  max-height: none !important;
                  overflow: visible !important;
                }
                
                /* Fix Chrome printing issues */
                body {
                  -webkit-print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                
                /* Dynamic height adjustment */
                .print-receipt {
                  height: fit-content !important;
                  min-height: fit-content !important;
                  max-height: fit-content !important;
                }
                
                /* Ensure proper page breaks and avoid blank pages */
                .print-receipt {
                  break-inside: avoid !important;
                  break-after: avoid-page !important;
                  page-break-inside: avoid !important;
                  page-break-after: avoid !important;
                }
              }
              
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
              }
              
              /* Add any additional styles needed for the work order */
            </style>
          </head>
          <body>
            <div id="custom-work-order-content"></div>
          </body>
        </html>
      `);
      
      // Get the content of the custom work order
      const workOrderElement = document.getElementById('work-order-receipt');
      
      // If the element exists, copy its innerHTML to the print window
      if (workOrderElement) {
        const contentContainer = printWindow.document.getElementById('custom-work-order-content');
        if (contentContainer) {
          contentContainer.innerHTML = workOrderElement.innerHTML;
          
          // Ensure timestamps are showing original creation dates
          if (invoice?.rx?.createdAt || workOrder?.rx?.createdAt) {
            // Use the original RX creation date rather than printing date
            const rxCreationDate = invoice?.rx?.createdAt || workOrder?.rx?.createdAt;
            const dateElements = printWindow.document.querySelectorAll('.rx-creation-date');
            
            dateElements.forEach(element => {
              if (element instanceof HTMLElement) {
                element.textContent = new Date(rxCreationDate).toLocaleString();
              }
            });
          }
          
          // Wait for content to load, then print
          setTimeout(() => {
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
          }, 500);
        } else {
          printWindow.document.write("<p>Unable to locate content container. Please try again.</p>");
          printWindow.document.close();
        }
      } else {
        // Try another approach - call WorkOrderReceiptPrint directly
        printWindow.document.write(`
          <div style="padding: 20px; text-align: center;">
            <h2>Loading work order content...</h2>
            <p>If printing doesn't start automatically, please use the browser print button.</p>
          </div>
        `);
        
        // Manually generate content based on workOrder data
        if (workOrder.invoice) {
          printWorkOrderReceipt(workOrder);
          printWindow.document.close();
        } else {
          printWindow.document.write("<p>Work order data incomplete. Please try again.</p>");
          printWindow.document.close();
        }
      }
    } catch (error) {
      console.error("Error printing work order:", error);
      toast({
        title: "Error",
        description: "An error occurred while trying to print the work order.",
        variant: "destructive",
      });
    }
  }
}
