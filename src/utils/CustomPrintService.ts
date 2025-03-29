import { Invoice, WorkOrder } from "@/store/invoiceStore";
import { Patient } from "@/store/patientStore";
import { PrintService } from "./PrintService";
import { toast } from "@/hooks/use-toast";
import { createRoot } from 'react-dom/client';
import React from 'react';
import { CustomWorkOrderReceipt } from '@/components/CustomWorkOrderReceipt';
import { ReceiptInvoice } from "@/components/ReceiptInvoice";

export const CustomPrintService = {
  /**
   * Print a work order using the CustomWorkOrderReceipt component directly
   */
  printWorkOrder: (workOrder: WorkOrder, invoice?: Invoice, patient?: Patient) => {
    try {
      console.log("[CustomPrintService] Starting work order print process");
      
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
      
      // Add basic HTML structure with styles for the receipt
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Work Order</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap">
            <style>
              @page {
                size: 80mm auto !important;
                margin: 0mm !important;
                padding: 0mm !important;
              }
              
              body {
                width: 80mm !important;
                margin: 0mm !important;
                padding: 0mm !important;
                font-family: 'Cairo', Arial, sans-serif !important;
                background: white !important;
                color: black !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              
              #print-container {
                width: 80mm !important;
                max-width: 80mm !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              
              .print-receipt {
                width: 76mm !important;
                max-width: 76mm !important;
                margin: 0mm auto !important;
                padding: 1mm !important;
                background-color: white !important;
                color: black !important;
                page-break-after: always !important;
                page-break-inside: avoid !important;
                box-shadow: none !important;
                border: none !important;
              }
              
              .print-receipt * {
                visibility: visible !important;
                opacity: 1 !important;
                color-adjust: exact !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              .bg-black {
                background-color: black !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
                color: white !important;
              }
              
              .bg-\\[\\#FFDEE2\\] {
                background-color: #FFDEE2 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              
              .text-white {
                color: white !important;
              }
              
              /* Table Styles */
              table {
                direction: ltr !important;
                table-layout: fixed !important;
                width: 100% !important;
                border-collapse: collapse !important;
              }
              
              table th, table td {
                padding: 0.5px !important;
                text-align: center !important;
                font-size: 8px !important;
                border: 1px solid #d1d5db !important;
              }
              
              /* Fix signature boxes */
              .h-7 {
                height: 1.75rem !important;
                min-height: 1.75rem !important;
              }
              
              /* Tailwind-like classes for printing */
              .flex { display: flex !important; }
              .flex-col { flex-direction: column !important; }
              .items-center { align-items: center !important; }
              .justify-center { justify-content: center !important; }
              .justify-between { justify-content: space-between !important; }
              .text-center { text-align: center !important; }
              .font-bold { font-weight: bold !important; }
              .text-xs { font-size: 0.65rem !important; }
              .text-sm { font-size: 0.75rem !important; }
              .text-base { font-size: 0.85rem !important; }
              .text-lg { font-size: 1rem !important; }
              .mb-0 { margin-bottom: 0 !important; }
              .mb-1 { margin-bottom: 0.15rem !important; }
              .mb-2 { margin-bottom: 0.25rem !important; }
              .mb-3 { margin-bottom: 0.5rem !important; }
              .py-0.5 { padding-top: 0.1rem !important; padding-bottom: 0.1rem !important; }
              .px-1 { padding-left: 0.15rem !important; padding-right: 0.15rem !important; }
              .p-1 { padding: 0.15rem !important; }
              .p-2 { padding: 0.25rem !important; }
              .p-3 { padding: 0.5rem !important; }
              .rounded { border-radius: 0.25rem !important; }
              .border { border-width: 1px !important; }
              .border-gray-300 { border-color: #d1d5db !important; }
              .border-b { border-bottom-width: 1px !important; }
              .bg-gray-100 { background-color: #f3f4f6 !important; }
              .text-gray-600 { color: #4b5563 !important; }
              
              .card { 
                background-color: white !important; 
                border-radius: 0.375rem !important;
                border: 1px solid #e5e7eb !important;
                overflow: hidden !important;
                margin-bottom: 0.15rem !important;
              }
              
              .card-content {
                padding: 0.15rem !important;
              }
              
              /* Reduce space in nested elements */
              .space-y-0.5 > * + * {
                margin-top: 0.1rem !important;
              }
              
              /* Smaller text sizes */
              .text-[9px] {
                font-size: 8px !important;
              }
              
              .text-[8px] {
                font-size: 7px !important;
              }
              
              /* Print-specific overrides */
              @media print {
                html, body {
                  width: 80mm !important;
                  height: auto !important;
                  min-height: 0 !important;
                  max-height: none !important;
                  overflow: visible !important;
                  background: white !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  margin: 0mm !important;
                  padding: 0mm !important;
                }
                
                #print-container {
                  width: 80mm !important;
                  max-width: 80mm !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }
                
                .print-receipt {
                  width: 76mm !important;
                  max-width: 76mm !important;
                  margin: 0mm auto !important;
                  padding: 1mm !important;
                  background-color: white !important;
                  color: black !important;
                  page-break-after: always !important;
                  page-break-inside: avoid !important;
                  box-shadow: none !important;
                  border: none !important;
                }
                
                .bg-black {
                  background-color: black !important;
                  color: white !important;
                }
                
                .bg-\\[\\#FFDEE2\\] {
                  background-color: #FFDEE2 !important;
                }
                
                body * {
                  visibility: visible !important;
                }
                
                table {
                  width: 100% !important;
                  border-collapse: collapse !important;
                  direction: ltr !important;
                  table-layout: fixed !important;
                }
                
                table th, table td {
                  border: 1px solid #d1d5db !important;
                  padding: 0.5px !important;
                  font-size: 8px !important;
                  text-align: center !important;
                }
                
                /* Ensure all content fits on one page */
                .min-h-8 {
                  min-height: 0.5rem !important;
                  max-height: 1rem !important;
                }
              }
            </style>
          </head>
          <body>
            <div id="print-container"></div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.focus();
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
      
      // Create a div element to hold our component temporarily in the current document
      const tempDiv = document.createElement('div');
      document.body.appendChild(tempDiv);
      tempDiv.style.display = 'none';
      
      // Render our component to the temp div
      const root = createRoot(tempDiv);
      root.render(
        React.createElement(CustomWorkOrderReceipt, {
          workOrder: workOrder,
          invoice: invoice,
          patient: patient,
          isPrintable: true
        })
      );
      
      // Wait for React to render the component
      setTimeout(() => {
        try {
          // Get the HTML content of the rendered component
          const contentHtml = tempDiv.innerHTML;
          
          // Insert it into the print window
          const printContainer = printWindow.document.getElementById('print-container');
          if (printContainer) {
            printContainer.innerHTML = contentHtml;
            
            // Apply specific print styles directly to the element that will be printed
            const printedReceipt = printWindow.document.querySelector('.print-receipt');
            if (printedReceipt) {
              printedReceipt.setAttribute('style', `
                width: 76mm !important;
                max-width: 76mm !important;
                margin: 0 auto !important;
                padding: 1mm !important;
                background-color: white !important;
                color: black !important;
                font-family: 'Cairo', sans-serif !important;
                page-break-inside: avoid !important;
                page-break-after: always !important;
                box-shadow: none !important;
                border: none !important;
              `);
            }
            
            // Ensure all black backgrounds render properly in print
            const blackBgElements = printWindow.document.querySelectorAll('.bg-black');
            blackBgElements.forEach(el => {
              (el as HTMLElement).style.backgroundColor = 'black';
              (el as HTMLElement).style.color = 'white';
              (el as HTMLElement).setAttribute('style', `
                background-color: black !important;
                color: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              `);
            });
            
            // Ensure soft red background renders properly
            const redBgElements = printWindow.document.querySelectorAll('.bg-\\[\\#FFDEE2\\]');
            redBgElements.forEach(el => {
              (el as HTMLElement).style.backgroundColor = '#FFDEE2';
              (el as HTMLElement).setAttribute('style', `
                background-color: #FFDEE2 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              `);
            });
            
            // Ensure all tables have proper borders and LTR direction
            const tables = printWindow.document.querySelectorAll('table');
            tables.forEach(table => {
              table.setAttribute('dir', 'ltr');
              table.setAttribute('style', `
                width: 100% !important;
                border-collapse: collapse !important;
                margin-bottom: 2px !important;
                direction: ltr !important;
                table-layout: fixed !important;
              `);
              
              const cells = table.querySelectorAll('th, td');
              cells.forEach(cell => {
                (cell as HTMLElement).setAttribute('style', `
                  border: 1px solid #d1d5db !important;
                  padding: 0.5px !important;
                  font-size: 8px !important;
                  text-align: center !important;
                `);
              });
            });
            
            // Fix signature boxes
            const signatureBoxes = printWindow.document.querySelectorAll('.h-7');
            signatureBoxes.forEach(box => {
              (box as HTMLElement).setAttribute('style', `
                height: 1.75rem !important;
                min-height: 1.75rem !important;
                border: 1px dashed #d1d5db !important;
                border-radius: 0.125rem !important;
              `);
            });
          }
          
          // Close the document to finish loading
          printWindow.document.close();
          
          // Clean up
          root.unmount();
          document.body.removeChild(tempDiv);
          
          console.log("[CustomPrintService] Work order print complete");
          
        } catch (err) {
          console.error("Error in print preparation:", err);
          
          // Clean up
          if (tempDiv && tempDiv.parentNode) {
            root.unmount();
            document.body.removeChild(tempDiv);
          }
          
          if (printWindow) {
            printWindow.close();
          }
          
          toast({
            title: "Print Error",
            description: "Failed to prepare the print layout. Please try again.",
            variant: "destructive",
          });
        }
      }, 300); // Give enough time for the component to render
      
    } catch (error) {
      console.error("Error printing work order:", error);
      toast({
        title: "Error",
        description: "An error occurred while trying to print the work order.",
        variant: "destructive",
      });
    }
  },
  
  /**
   * Print an invoice using the invoice receipt template
   */
  printInvoice: (invoice: Invoice) => {
    try {
      console.log("[CustomPrintService] Starting invoice print process");
      
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
      
      // Add basic HTML structure with styles for the receipt
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zain:wght@400;700&display=swap">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yrsa:wght@400;500;600;700&display=swap">
            <style>
              @page {
                size: 80mm auto !important;
                margin: 0mm !important;
                padding: 0mm !important;
              }
              
              body {
                width: 80mm !important;
                margin: 0mm !important;
                padding: 0mm !important;
                background: white !important;
                color: black !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              
              #print-container {
                width: 80mm !important;
                max-width: 80mm !important;
                margin: 0 !important;
                padding: 0 !important;
                background-color: white !important;
              }
              
              #receipt-invoice {
                width: 76mm !important;
                max-width: 76mm !important;
                margin: 0mm auto !important;
                padding: 2mm !important;
                background-color: white !important;
                color: black !important;
                page-break-after: always !important;
                page-break-inside: avoid !important;
                box-shadow: none !important;
                border: none !important;
                text-align: center !important;
                overflow: hidden !important;
                font-family: 'Yrsa', serif !important;
              }

              #receipt-invoice[dir="rtl"] {
                font-family: 'Zain', sans-serif !important;
              }
              
              #receipt-invoice * {
                visibility: visible !important;
                opacity: 1 !important;
                color-adjust: exact !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              /* Background colors */
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

              /* Special styled elements */
              .payment-paid {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                gap: 2px !important;
                background-color: #E6F7E6 !important;
                padding: 2px !important;
                border-radius: 3px !important;
                margin: 2px 0 !important;
                font-weight: bold !important;
                font-size: 12px !important;
                border: 1px solid #A3D9A3 !important;
                color: #1F7A1F !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              .payment-remaining {
                display: flex !important;
                justify-content: space-between !important;
                background-color: #FEE2E2 !important;
                padding: 2px !important;
                border-radius: 3px !important;
                margin: 2px 0 !important;
                font-weight: bold !important;
                font-size: 12px !important;
                border: 1px solid #FECACA !important;
                color: #B91C1C !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              /* Tailwind-like classes for printing */
              .flex { display: flex !important; }
              .flex-col { flex-direction: column !important; }
              .items-center { align-items: center !important; }
              .justify-center { justify-content: center !important; }
              .justify-between { justify-content: space-between !important; }
              .text-center { text-align: center !important; }
              .font-bold { font-weight: bold !important; }
              .text-xs { font-size: 9px !important; }
              .text-sm { font-size: 10px !important; }
              .text-base { font-size: 11px !important; }
              .text-lg { font-size: 12px !important; }
              .mb-0 { margin-bottom: 0 !important; }
              .mb-1 { margin-bottom: 1mm !important; }
              .mb-2 { margin-bottom: 2mm !important; }
              .pb-1 { padding-bottom: 1mm !important; }
              .py-1 { padding-top: 1mm !important; padding-bottom: 1mm !important; }
              .px-2 { padding-left: 2mm !important; padding-right: 2mm !important; }
              .p-1 { padding: 1mm !important; }
              .p-1\\.5 { padding: 1.5mm !important; }
              .p-2 { padding: 2mm !important; }
              .rounded { border-radius: 0.25rem !important; }
              .border { border-width: 1px !important; }
              .border-2 { border-width: 2px !important; }
              .border-gray-300 { border-color: #d1d5db !important; }
              .border-black { border-color: black !important; }
              .border-b { border-bottom-width: 1px !important; }
              .border-b-2 { border-bottom-width: 2px !important; }
              .border-t-2 { border-top-width: 2px !important; }
              .border-gray-400 { border-color: #9ca3af !important; }
              .space-y-1 > * + * { margin-top: 1mm !important; }
              .space-y-2 > * + * { margin-top: 2mm !important; }
              .gap-1 { gap: 1mm !important; }
              .inline-flex { display: inline-flex !important; }
              
              /* Print-specific overrides */
              @media print {
                html, body {
                  width: 80mm !important;
                  height: auto !important;
                  min-height: 0 !important;
                  max-height: none !important;
                  overflow: visible !important;
                  background: white !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  margin: 0mm !important;
                  padding: 0mm !important;
                }
                
                #print-container {
                  width: 80mm !important;
                  max-width: 80mm !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background-color: white !important;
                }
                
                #receipt-invoice {
                  width: 76mm !important;
                  max-width: 76mm !important;
                  margin: 0mm auto !important;
                  padding: 2mm !important;
                  background-color: white !important;
                  color: black !important;
                  page-break-after: always !important;
                  page-break-inside: avoid !important;
                  box-shadow: none !important;
                  border: none !important;
                  text-align: center !important;
                }
                
                .bg-black {
                  background-color: black !important;
                  color: white !important;
                }
                
                body * {
                  visibility: visible !important;
                }
                
                .payment-paid {
                  background-color: #E6F7E6 !important;
                  color: #1F7A1F !important;
                  border-color: #A3D9A3 !important;
                }
                
                .payment-remaining {
                  background-color: #FEE2E2 !important;
                  color: #B91C1C !important;
                  border-color: #FECACA !important;
                }
              }
            </style>
          </head>
          <body>
            <div id="print-container"></div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.focus();
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
      
      // Create a div element to hold our component temporarily in the current document
      const tempDiv = document.createElement('div');
      document.body.appendChild(tempDiv);
      tempDiv.style.display = 'none';
      
      // Render our component to the temp div
      const root = createRoot(tempDiv);
      root.render(
        React.createElement(ReceiptInvoice, {
          invoice: invoice,
          isPrintable: true
        })
      );
      
      // Wait for React to render the component
      setTimeout(() => {
        try {
          // Get the HTML content of the rendered component
          const contentHtml = tempDiv.innerHTML;
          
          // Insert it into the print window
          const printContainer = printWindow.document.getElementById('print-container');
          if (printContainer) {
            printContainer.innerHTML = contentHtml;
            
            // Apply specific print styles to colored elements
            const blackBgElements = printWindow.document.querySelectorAll('.bg-black');
            blackBgElements.forEach(el => {
              (el as HTMLElement).style.backgroundColor = 'black';
              (el as HTMLElement).style.color = 'white';
              (el as HTMLElement).setAttribute('style', `
                background-color: black !important;
                color: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              `);
            });
            
            // Ensure paid/remaining elements retain their proper styling
            const paidElements = printWindow.document.querySelectorAll('.payment-paid');
            paidElements.forEach(el => {
              (el as HTMLElement).setAttribute('style', `
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                gap: 2px !important;
                background-color: #E6F7E6 !important;
                padding: 2px !important;
                border-radius: 3px !important;
                margin: 2px 0 !important;
                font-weight: bold !important;
                font-size: 12px !important;
                border: 1px solid #A3D9A3 !important;
                color: #1F7A1F !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              `);
            });
            
            const remainingElements = printWindow.document.querySelectorAll('.payment-remaining');
            remainingElements.forEach(el => {
              (el as HTMLElement).setAttribute('style', `
                display: flex !important;
                justify-content: space-between !important;
                background-color: #FEE2E2 !important;
                padding: 2px !important;
                border-radius: 3px !important;
                margin: 2px 0 !important;
                font-weight: bold !important;
                font-size: 12px !important;
                border: 1px solid #FECACA !important;
                color: #B91C1C !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              `);
            });
          }
          
          // Close the document to finish loading
          printWindow.document.close();
          
          // Clean up
          root.unmount();
          document.body.removeChild(tempDiv);
          
          console.log("[CustomPrintService] Invoice print complete");
          
        } catch (err) {
          console.error("Error in print preparation:", err);
          
          // Clean up
          if (tempDiv && tempDiv.parentNode) {
            root.unmount();
            document.body.removeChild(tempDiv);
          }
          
          if (printWindow) {
            printWindow.close();
          }
          
          toast({
            title: "Print Error",
            description: "Failed to prepare the print layout. Please try again.",
            variant: "destructive",
          });
        }
      }, 300); // Give enough time for the component to render
    } catch (error) {
      console.error('[CustomPrintService] Error printing invoice:', error);
      toast({
        title: "Print Error",
        description: "An error occurred while printing invoice.",
        variant: "destructive",
      });
    }
  }
};
