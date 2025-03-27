
import { toast } from "@/hooks/use-toast";

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
                  color: white !important;
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
                color: white !important;
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
      
      // Create a hidden div, render the component to get its HTML content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.innerHTML = `
        <div id="temp-work-order-receipt" class="print-receipt" style="width: 80mm; max-width: 80mm;">
          <!-- CustomWorkOrderReceipt will be rendered here -->
        </div>
      `;
      document.body.appendChild(tempDiv);
      
      // Import React and ReactDOM dynamically to render the component
      import('react').then((React) => {
        import('react-dom/client').then((ReactDOM) => {
          import('../components/CustomWorkOrderReceipt').then((module) => {
            const CustomWorkOrderReceipt = module.CustomWorkOrderReceipt;
            
            // Create a root and render the component
            const root = ReactDOM.createRoot(document.getElementById('temp-work-order-receipt')!);
            root.render(
              React.createElement(CustomWorkOrderReceipt, {
                workOrder,
                invoice,
                patient,
                isPrintable: true
              })
            );
            
            // Wait for the component to render
            setTimeout(() => {
              const tempReceiptElement = document.getElementById('temp-work-order-receipt');
              if (tempReceiptElement) {
                // Get the rendered HTML content
                const contentContainer = printWindow.document.getElementById('custom-work-order-content');
                if (contentContainer) {
                  contentContainer.innerHTML = tempReceiptElement.innerHTML;
                  
                  // Clean up
                  document.body.removeChild(tempDiv);
                  root.unmount();
                  
                  // Close the document to finish writing
                  printWindow.document.close();
                }
              } else {
                console.error("Could not find temp receipt element");
                printWindow.document.write("<p>Error rendering work order content.</p>");
                printWindow.document.close();
              }
            }, 300);
          });
        });
      }).catch(error => {
        console.error("Error loading dependencies:", error);
        printWindow.document.write("<p>Error loading dependencies.</p>");
        printWindow.document.close();
      });
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
