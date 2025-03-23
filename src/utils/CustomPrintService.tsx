
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
                  background: white !important;
                }
                
                #custom-work-order-content {
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
      
      // Get the content from CustomWorkOrderReceipt by rendering it
      const getWorkOrderContent = () => {
        // Use workOrder data to create the content
        const { invoiceId, workOrderId, patientName, patientPhone, lensType, coating, frameBrand, frameModel, total } = workOrder;
        
        // Create a simple HTML structure similar to the CustomWorkOrderReceipt component
        return `
          <div class="print-receipt">
            <h2 style="text-align:center; margin-bottom: 10px; font-size: 16px;">Work Order Receipt</h2>
            <div style="border-bottom: 1px dashed #ccc; margin-bottom: 10px;"></div>
            <div style="margin-bottom: 5px;"><strong>Invoice ID:</strong> ${invoiceId}</div>
            <div style="margin-bottom: 5px;"><strong>Work Order ID:</strong> ${workOrderId}</div>
            <div style="margin-bottom: 5px;"><strong>Patient:</strong> ${patientName}</div>
            ${patientPhone ? `<div style="margin-bottom: 5px;"><strong>Phone:</strong> ${patientPhone}</div>` : ''}
            ${lensType ? `<div style="margin-bottom: 5px;"><strong>Lens:</strong> ${lensType}</div>` : ''}
            ${coating ? `<div style="margin-bottom: 5px;"><strong>Coating:</strong> ${coating}</div>` : ''}
            ${frameBrand ? `<div style="margin-bottom: 5px;"><strong>Frame:</strong> ${frameBrand} ${frameModel || ''}</div>` : ''}
            <div style="border-bottom: 1px dashed #ccc; margin: 10px 0;"></div>
            <div style="margin-bottom: 5px;"><strong>Total:</strong> ${total.toFixed(3)} KWD</div>
            <div style="margin-top: 15px; text-align: center; font-size: 12px;">Thank you for your business!</div>
          </div>
        `;
      };
      
      // Set the content directly in the print window
      const contentContainer = printWindow.document.getElementById('custom-work-order-content');
      if (contentContainer) {
        contentContainer.innerHTML = getWorkOrderContent();
        
        // Wait for content to load, then print
        setTimeout(() => {
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          
          // Close the window after printing (optional)
          // printWindow.close();
        }, 500);
      } else {
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
