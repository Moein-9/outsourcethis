
import { toast } from "sonner";

export class CustomPrintService {
  static printWorkOrder(workOrder: any, invoice?: any, patient?: any) {
    console.log("CustomPrintService: Printing work order", { workOrder, invoice, patient });
    
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Unable to open print window. Please allow popups for this site.");
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
                  text-align: center !important;
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
                  color: white !important;
                }
                
                .text-white {
                  color: white !important;
                }
                
                /* Red color for remaining payment */
                .payment-remaining, 
                [style*="color: #ea384c"],
                [style*="color: #B91C1C"] {
                  color: #ea384c !important;
                  background-color: #FEE2E2 !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  border: 2px solid #FECACA !important;
                  font-size: 16px !important;
                  font-weight: bold !important;
                  padding: 6px !important;
                }
                
                /* Compact product boxes styling */
                .product-box {
                  padding: 2px !important;
                  margin-bottom: 2px !important;
                  border: 1px solid #ddd !important;
                  border-radius: 2px !important;
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
                font-family: 'Zain', 'Yrsa', Arial, sans-serif;
                margin: 0;
                padding: 0;
                background: white;
                color: black;
              }
              
              /* Background classes */
              .bg-black {
                background-color: black !important;
                color: white !important;
              }
              
              /* Red color for remaining payment */
              .payment-remaining, 
              [style*="color: #ea384c"],
              [style*="color: #B91C1C"] {
                color: #ea384c !important;
                background-color: #FEE2E2 !important;
                border: 2px solid #FECACA !important;
                font-weight: bold !important;
                font-size: 16px !important;
                padding: 6px !important;
              }
              
              /* Compact product boxes styling */
              .product-box {
                padding: 2px !important;
                margin-bottom: 2px !important;
                border: 1px solid #ddd !important;
                border-radius: 2px !important;
              }
            </style>
          </head>
          <body>
            <div id="custom-work-order-content"></div>
            <script>
              window.onload = function() {
                // Force background colors to print properly
                document.body.style.webkitPrintColorAdjust = 'exact';
                document.body.style.printColorAdjust = 'exact';
                
                setTimeout(function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                }, 500);
              };
            </script>
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
          
          // Add compact styling to product boxes
          const productBoxes = printWindow.document.querySelectorAll('.p-1.border.border-gray-300.rounded.mb-1, div[style*="border: 1px solid"]');
          productBoxes.forEach(box => {
            if (box instanceof HTMLElement) {
              box.classList.add('product-box');
            }
          });
          
          // Remove thank you message and disclaimer if they exist
          const thankYouElements = printWindow.document.querySelectorAll('div[style*="text-align: center"]');
          thankYouElements.forEach(element => {
            if (element instanceof HTMLElement && 
                (element.textContent?.includes('Thank you') || 
                 element.textContent?.includes('شكراً') || 
                 element.textContent?.toLowerCase().includes('receipt is proof'))) {
              element.remove();
            }
          });
          
          // Enhance the remaining payment styling
          const remainingPaymentElements = printWindow.document.querySelectorAll('div[style*="color: #B91C1C"], div[style*="color: #ea384c"]');
          remainingPaymentElements.forEach(element => {
            if (element instanceof HTMLElement) {
              element.classList.add('payment-remaining');
              element.style.fontSize = '16px';
              element.style.padding = '6px';
              element.style.margin = '6px 0';
              element.style.fontWeight = 'bold';
              element.style.color = '#ea384c';
              element.style.backgroundColor = '#FEE2E2';
              element.style.border = '2px solid #FECACA';
            }
          });
          
          // Wait for content to load before proceeding
          printWindow.document.close();
        }
      } else {
        // Handle the case where the element doesn't exist
        printWindow.document.write("<p>Unable to find work order content. Please try again.</p>");
        printWindow.document.close();
      }
    } catch (error) {
      console.error("Error printing work order:", error);
      toast.error("An error occurred while trying to print the work order.");
    }
  }
}
