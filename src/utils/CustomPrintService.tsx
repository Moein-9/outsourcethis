
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { createRoot } from 'react-dom/client';
import { CustomWorkOrderReceipt } from '@/components/CustomWorkOrderReceipt';

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
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap">
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
      
      // Create a div to temporarily render our React component to HTML
      const tempDiv = document.createElement('div');
      tempDiv.style.display = 'none';
      document.body.appendChild(tempDiv);
      
      // Mount the CustomWorkOrderReceipt to this temp div to get its HTML
      const root = createRoot(tempDiv);
      
      // This will render the component once to get its HTML
      root.render(
        <CustomWorkOrderReceipt 
          workOrder={workOrder} 
          invoice={invoice}
          patient={patient}
          isPrintable={true}
        />
      );
      
      // Wait a bit for the component to fully render
      setTimeout(() => {
        try {
          // Get the rendered HTML from our temporary div
          const workOrderHtml = tempDiv.innerHTML;
          
          // Put this HTML into the print window
          const contentContainer = printWindow.document.getElementById('custom-work-order-content');
          if (contentContainer) {
            contentContainer.innerHTML = workOrderHtml;
            
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
          }
          
          // Clean up
          document.body.removeChild(tempDiv);
          root.unmount();
          
          // Close the document to finish loading
          printWindow.document.close();
        } catch (err) {
          console.error("Error while preparing print content:", err);
          document.body.removeChild(tempDiv);
          root.unmount();
          printWindow.close();
          
          toast({
            title: "Print Error",
            description: "Failed to prepare print content. Please try again.",
            variant: "destructive",
          });
        }
      }, 100);
      
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
