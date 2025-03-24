
import React from 'react';
import { toast } from "@/hooks/use-toast";
import { createRoot } from 'react-dom/client';

export class CustomPrintService {
  static printWorkOrder(workOrder: any, invoice?: any, patient?: any) {
    console.log("CustomPrintService: Printing work order", { workOrder, invoice, patient });
    
    try {
      // Create a container and render the receipt first to ensure it exists in the DOM
      const tempContainer = document.createElement('div');
      tempContainer.id = 'temp-print-container';
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);
      
      // Import the component dynamically to render it
      import('../components/CustomWorkOrderReceipt').then(({ CustomWorkOrderReceipt }) => {
        // Use createRoot to render the component (React 18 approach)
        const root = createRoot(tempContainer);
        root.render(
          <CustomWorkOrderReceipt
            workOrder={workOrder} 
            invoice={invoice} 
            patient={patient}
            isPrintable={true} 
          />
        );
        
        // Once rendered, proceed with printing
        setTimeout(() => {
          // Create a new window for printing
          const printWindow = window.open('', '_blank');
          if (!printWindow) {
            toast({
              title: "Error",
              description: "Unable to open print window. Please allow popups for this site.",
              variant: "destructive",
            });
            
            // Clean up
            if (document.body.contains(tempContainer)) {
              root.unmount();
              document.body.removeChild(tempContainer);
            }
            return;
          }
          
          // Add all the required styles and content
          printWindow.document.write(`
            <html>
              <head>
                <title>Work Order</title>
                <style>
                  /* Reset and base styles */
                  * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                  }
                  
                  @media print {
                    @page {
                      size: 80mm auto !important;
                      margin: 0 !important;
                      padding: 0 !important;
                    }
                    
                    html, body {
                      width: 80mm !important;
                      margin: 0 !important;
                      padding: 0 !important;
                      background: white !important;
                      color: black !important;
                      height: auto !important;
                      min-height: 0 !important;
                      max-height: none !important;
                      overflow: visible !important;
                    }
                    
                    #work-order-receipt {
                      width: 76mm !important;
                      max-width: 76mm !important;
                      page-break-after: avoid !important;
                      page-break-inside: avoid !important;
                      position: relative !important;
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
                    
                    /* Force single page */
                    body {
                      display: block !important;
                      page-break-after: always !important;
                      page-break-before: always !important;
                      page-break-inside: avoid !important;
                    }
                    
                    /* Force content to be visible */
                    * {
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
                    
                    /* Fix Chrome printing issues */
                    body {
                      -webkit-print-color-adjust: exact !important;
                      color-adjust: exact !important;
                      print-color-adjust: exact !important;
                    }
                    
                    /* Ensure proper page breaks and avoid blank pages */
                    #custom-work-order-content {
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
                    width: 80mm;
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
          
          // Now get the content from the temporary container
          const workOrderElement = document.getElementById('work-order-receipt');
          
          // If the element exists, copy its innerHTML to the print window
          if (workOrderElement) {
            const contentContainer = printWindow.document.getElementById('custom-work-order-content');
            if (contentContainer) {
              contentContainer.innerHTML = workOrderElement.innerHTML;
              
              // Wait for content to load before proceeding
              printWindow.document.close();
              
              // Clean up the temporary container after printing is triggered
              setTimeout(() => {
                if (document.body.contains(tempContainer)) {
                  root.unmount();
                  document.body.removeChild(tempContainer);
                }
              }, 1000);
            }
          } else {
            // Handle the case where the element doesn't exist
            printWindow.document.write("<p>Unable to find work order content. Please try again.</p>");
            printWindow.document.close();
            
            toast({
              title: "Error",
              description: "Unable to find work order content for printing.",
              variant: "destructive",
            });
            
            // Clean up
            if (document.body.contains(tempContainer)) {
              root.unmount();
              document.body.removeChild(tempContainer);
            }
          }
        }, 300);
      }).catch(error => {
        console.error("Error loading CustomWorkOrderReceipt component:", error);
        toast({
          title: "Error",
          description: "Failed to load print template.",
          variant: "destructive",
        });
        
        // Clean up
        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
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

  static printReceipt(invoice: any, patient?: any) {
    console.log("CustomPrintService: Printing receipt", { invoice, patient });
    
    try {
      // Create a container and render the receipt first to ensure it exists in the DOM
      const tempContainer = document.createElement('div');
      tempContainer.id = 'temp-receipt-container';
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);
      
      // Import the component dynamically to render it
      import('../components/ReceiptInvoice').then(({ ReceiptInvoice }) => {
        // Use createRoot to render the component
        const root = createRoot(tempContainer);
        root.render(
          <ReceiptInvoice
            invoice={invoice} 
            patientName={invoice.patientName || patient?.name}
            patientPhone={invoice.patientPhone || patient?.phone}
            isPrintable={true} 
          />
        );
        
        // Once rendered, proceed with printing
        setTimeout(() => {
          // Create a new window for printing
          const printWindow = window.open('', '_blank');
          if (!printWindow) {
            toast({
              title: "Error",
              description: "Unable to open print window. Please allow popups for this site.",
              variant: "destructive",
            });
            
            // Clean up
            if (document.body.contains(tempContainer)) {
              root.unmount();
              document.body.removeChild(tempContainer);
            }
            return;
          }
          
          // Add all the required styles and content
          printWindow.document.write(`
            <html>
              <head>
                <title>Receipt</title>
                <style>
                  /* Reset and base styles */
                  * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                  }
                  
                  @media print {
                    @page {
                      size: 80mm auto !important;
                      margin: 0 !important;
                      padding: 0 !important;
                    }
                    
                    html, body {
                      width: 80mm !important;
                      margin: 0 !important;
                      padding: 0 !important;
                      background: white !important;
                      color: black !important;
                      height: auto !important;
                      min-height: 0 !important;
                      max-height: none !important;
                      overflow: visible !important;
                    }
                    
                    #receipt-to-print {
                      width: 76mm !important;
                      max-width: 76mm !important;
                      page-break-after: avoid !important;
                      page-break-inside: avoid !important;
                      position: relative !important;
                      border: none !important;
                      box-shadow: none !important;
                      padding: 2mm !important;
                      margin: 0 !important;
                      background: white !important;
                      color: black !important;
                      height: auto !important;
                    }
                    
                    /* Force single page */
                    body {
                      display: block !important;
                      page-break-after: always !important;
                      page-break-before: always !important;
                      page-break-inside: avoid !important;
                    }
                    
                    /* Force content to be visible */
                    * {
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
                    
                    /* Fix Chrome printing issues */
                    body {
                      -webkit-print-color-adjust: exact !important;
                      color-adjust: exact !important;
                      print-color-adjust: exact !important;
                    }
                    
                    /* Ensure proper page breaks and avoid blank pages */
                    #custom-receipt-content {
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
                    width: 80mm;
                  }
                  
                  /* Background classes */
                  .bg-black {
                    background-color: black !important;
                    color: white !important;
                  }
                </style>
              </head>
              <body>
                <div id="custom-receipt-content"></div>
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
          
          // Now get the content from the temporary container
          const receiptElement = document.getElementById('receipt-to-print');
          
          // If the element exists, copy its innerHTML to the print window
          if (receiptElement) {
            const contentContainer = printWindow.document.getElementById('custom-receipt-content');
            if (contentContainer) {
              contentContainer.innerHTML = receiptElement.innerHTML;
              
              // Wait for content to load before proceeding
              printWindow.document.close();
              
              // Clean up the temporary container after printing is triggered
              setTimeout(() => {
                if (document.body.contains(tempContainer)) {
                  root.unmount();
                  document.body.removeChild(tempContainer);
                }
              }, 1000);
            }
          } else {
            // Handle the case where the element doesn't exist
            printWindow.document.write("<p>Unable to find receipt content. Please try again.</p>");
            printWindow.document.close();
            
            toast({
              title: "Error",
              description: "Unable to find receipt content for printing.",
              variant: "destructive",
            });
            
            // Clean up
            if (document.body.contains(tempContainer)) {
              root.unmount();
              document.body.removeChild(tempContainer);
            }
          }
        }, 300);
      }).catch(error => {
        console.error("Error loading ReceiptInvoice component:", error);
        toast({
          title: "Error",
          description: "Failed to load receipt template.",
          variant: "destructive",
        });
        
        // Clean up
        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      });
    } catch (error) {
      console.error("Error printing receipt:", error);
      toast({
        title: "Error",
        description: "An error occurred while trying to print the receipt.",
        variant: "destructive",
      });
    }
  }
}
