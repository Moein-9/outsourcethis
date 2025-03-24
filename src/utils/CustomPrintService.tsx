
import { toast } from "@/hooks/use-toast";
import { useLanguageStore } from "@/store/languageStore";

export class CustomPrintService {
  static printWorkOrder(workOrder: any, invoice?: any, patient?: any) {
    console.log("CustomPrintService: Printing work order", { workOrder, invoice, patient });
    
    try {
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
                  background: white !important; /* White background for print */
                  color: black !important;
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
                  color: black !important;
                  height: auto !important;
                  min-height: 0 !important;
                  max-height: none !important;
                }
                
                /* Force content to be visible */
                .print-receipt * {
                  visibility: visible !important;
                  opacity: 1 !important;
                }
                
                /* Background colors should print properly */
                .bg-black {
                  background-color: black !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                }
                
                .text-white {
                  color: white !important;
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
                font-family: Cairo, Arial, sans-serif;
                margin: 0;
                padding: 0;
                background: white;
                color: black;
              }
              
              /* Background classes */
              .bg-black {
                background-color: black !important;
              }
              
              .text-white {
                color: white !important;
              }
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
                // Format date in English format MM/DD/YYYY HH:MM
                element.textContent = new Date(rxCreationDate).toLocaleString('en-US');
              }
            });
          }
          
          // Wait for content to load, then print
          setTimeout(() => {
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            
            // Close the window after printing (or allow user to close it)
            // printWindow.close();
          }, 500);
        }
      } else {
        // Handle the case where the element doesn't exist
        printWindow.document.write("<p>Unable to find work order content. Please try again.</p>");
        printWindow.document.close();
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
