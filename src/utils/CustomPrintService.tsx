
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { createRoot } from 'react-dom/client';
import { CustomWorkOrderReceipt } from '@/components/CustomWorkOrderReceipt';
import { ReceiptInvoice } from '@/components/ReceiptInvoice';

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
      
      // Check if this is a contact lens order
      const isContactLens = workOrder?.contactLenses?.length > 0 || 
                          invoice?.contactLensItems?.length > 0 ||
                          workOrder?.isContactLens === true;
                          
      console.log("Is contact lens order:", isContactLens);
      
      // Add basic HTML structure with improved styles for the receipt
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Work Order</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zain:wght@400;700&display=swap">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yrsa:wght@400;500;600;700&display=swap">
            <style>
              @page {
                size: 80mm auto !important;
                margin: 3mm !important; /* Increased margins for safety */
                padding: 0 !important;
              }
              
              body {
                width: 74mm !important; /* 80mm - 6mm for margins */
                margin: 0 auto !important;
                padding: 0 !important;
                font-family: Cairo, Arial, sans-serif !important;
                background: white !important;
                color: black !important;
                font-size: 14px !important; /* Increased base font size from 12px */
              }
              
              #work-order-receipt {
                width: 74mm !important;
                max-width: 74mm !important;
                page-break-after: always !important;
                page-break-inside: avoid !important;
                position: relative !important; 
                left: 0 !important;
                top: 0 !important;
                border: none !important;
                box-shadow: none !important;
                padding: 2mm !important;
                margin: 0 auto !important;
                background: white !important;
                color: black !important;
              }
              
              .print-receipt {
                height: auto !important;
                min-height: 0 !important;
                max-height: none !important;
              }
              
              .print-receipt * {
                visibility: visible !important;
                opacity: 1 !important;
              }
              
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
              
              /* Tailwind-like classes for printing */
              .flex { display: flex !important; }
              .flex-col { flex-direction: column !important; }
              .items-center { align-items: center !important; }
              .justify-center { justify-content: center !important; }
              .justify-between { justify-content: space-between !important; }
              .text-center { text-align: center !important; }
              .font-bold { font-weight: bold !important; }
              .text-xs { font-size: 11px !important; } /* Increased from 9px */
              .text-sm { font-size: 13px !important; } /* Increased from 11px */
              .text-base { font-size: 15px !important; } /* Increased from 13px */
              .text-lg { font-size: 17px !important; } /* Increased from 15px */
              .mb-0 { margin-bottom: 0 !important; }
              .mb-1 { margin-bottom: 0.25rem !important; }
              .mb-2 { margin-bottom: 0.5rem !important; }
              .mb-3 { margin-bottom: 0.75rem !important; }
              .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
              .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
              .p-1 { padding: 0.25rem !important; }
              .p-2 { padding: 0.5rem !important; }
              .p-3 { padding: 0.75rem !important; }
              .rounded { border-radius: 0.25rem !important; }
              .border { border-width: 1px !important; }
              .border-2 { border-width: 2px !important; }
              .border-gray-300 { border-color: #d1d5db !important; }
              .border-black { border-color: black !important; }
              .border-b { border-bottom-width: 1px !important; }
              .bg-gray-100 { background-color: #f3f4f6 !important; }
              .text-gray-600 { color: #4b5563 !important; }
              
              .card { 
                background-color: white !important; 
                border-radius: 0.375rem !important;
                border: 1px solid #e5e7eb !important;
                overflow: hidden !important;
                margin-bottom: 0.5rem !important;
              }
              
              .card-content {
                padding: 0.5rem !important;
              }
              
              /* RTL direction */
              .rtl {
                direction: rtl !important;
                font-family: 'Zain', sans-serif !important;
              }
              
              .ltr {
                direction: ltr !important;
                font-family: 'Yrsa', serif !important;
              }
              
              /* Print-specific overrides */
              @media print {
                html, body {
                  width: 74mm !important;
                  height: auto !important;
                  min-height: 0 !important;
                  max-height: none !important;
                  overflow: visible !important;
                  background: white !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                }
                
                .bg-black {
                  background-color: black !important;
                  color: white !important;
                }
                
                .text-white {
                  color: white !important;
                }
                
                body * {
                  visibility: visible !important;
                }
                
                /* Improved table styles */
                table {
                  width: 100% !important;
                  border-collapse: collapse !important;
                  font-size: 12px !important; /* Increased from 10px */
                  margin: 0 auto !important;
                }
                
                table th, table td {
                  padding: 3px !important; /* Increased from 2px */
                  text-align: center !important;
                  border: 1px solid #d1d5db !important;
                }
                
                /* Notes section */
                div[class*="min-h-"] {
                  min-height: 50px !important; /* Increased from 40px */
                  border: 2px solid #d1d5db !important;
                  background-color: white !important;
                }
                
                /* Logo sizing */
                img, svg {
                  max-height: 12mm !important;
                  width: auto !important;
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
      
      // Prepare the workOrder object with contactLensRx if necessary
      if (isContactLens && !workOrder.contactLensRx) {
        if (invoice?.contactLensRx) {
          workOrder = { ...workOrder, contactLensRx: invoice.contactLensRx };
        } else if (patient?.contactLensRx) {
          workOrder = { ...workOrder, contactLensRx: patient.contactLensRx };
        }
      }
      
      // Render our component to the temp div
      const root = createRoot(tempDiv);
      root.render(
        <CustomWorkOrderReceipt
          workOrder={workOrder}
          invoice={invoice}
          patient={patient}
          isPrintable={true}
        />
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
              printedReceipt.setAttribute('id', 'work-order-receipt');
              printedReceipt.setAttribute('style', `
                width: 74mm !important;
                max-width: 74mm !important;
                margin: 0 auto !important;
                padding: 2mm !important;
                background-color: white !important;
                color: black !important;
                font-family: 'Cairo', sans-serif !important;
                page-break-inside: avoid !important;
                page-break-after: always !important;
                font-size: 14px !important;
              `);
            }
            
            // Ensure all tables have proper text size
            const tables = printWindow.document.querySelectorAll('table');
            tables.forEach(table => {
              table.style.fontSize = '12px';
              
              const cells = table.querySelectorAll('th, td');
              cells.forEach(cell => {
                (cell as HTMLElement).style.padding = '3px';
                (cell as HTMLElement).style.fontSize = '12px';
              });
            });
            
            // Make the notes section more visible
            const notesSection = printWindow.document.querySelector('.min-h-\\[40px\\]');
            if (notesSection) {
              (notesSection as HTMLElement).style.minHeight = '50px';
              (notesSection as HTMLElement).style.border = '2px solid #d1d5db';
              (notesSection as HTMLElement).style.backgroundColor = 'white';
            }
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
  }
  
  static printInvoice(invoice: any) {
    console.log("CustomPrintService: Printing invoice", { invoice });
    
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
      
      // Add basic HTML structure with styles for the receipt
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zain:wght@400;700&display=swap">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yrsa:wght@400;500;600;700&display=swap">
            <style>
              @page {
                size: 80mm auto !important;
                margin: 3mm !important; /* Increased margins for safety */
                padding: 0 !important;
              }
              
              body {
                width: 74mm !important; /* 80mm - 6mm for margins */
                margin: 0 !important;
                padding: 0 !important;
                font-family: Cairo, Arial, sans-serif !important;
                background: white !important;
                color: black !important;
                font-size: 14px !important; /* Increased base font size */
              }
              
              #receipt-invoice {
                width: 74mm !important;
                max-width: 74mm !important;
                page-break-after: always !important;
                page-break-inside: avoid !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                border: none !important;
                box-shadow: none !important;
                padding: 10px !important;
                margin: 0 !important;
                background: white !important;
                color: black !important;
                text-align: center !important;
              }
              
              .print-receipt {
                height: auto !important;
                min-height: 0 !important;
                max-height: none !important;
              }
              
              .print-receipt * {
                visibility: visible !important;
                opacity: 1 !important;
              }
              
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
              
              /* Tailwind-like classes for printing */
              .flex { display: flex !important; }
              .flex-col { flex-direction: column !important; }
              .items-center { align-items: center !important; }
              .justify-center { justify-content: center !important; }
              .justify-between { justify-content: space-between !important; }
              .text-center { text-align: center !important; }
              .font-bold { font-weight: bold !important; }
              .text-xs { font-size: 11px !important; } /* Increased from 0.75rem */
              .text-sm { font-size: 13px !important; } /* Increased from 0.875rem */
              .text-base { font-size: 15px !important; } /* Increased from 1rem */
              .text-lg { font-size: 17px !important; } /* Increased from 1.125rem */
              .mb-0 { margin-bottom: 0 !important; }
              .mb-1 { margin-bottom: 0.25rem !important; }
              .mb-2 { margin-bottom: 0.5rem !important; }
              .mb-3 { margin-bottom: 0.75rem !important; }
              .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
              .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
              .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
              .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
              .p-1 { padding: 0.25rem !important; }
              .p-2 { padding: 0.5rem !important; }
              .p-3 { padding: 0.75rem !important; }
              .rounded { border-radius: 0.25rem !important; }
              .border { border-width: 1px !important; }
              .border-2 { border-width: 2px !important; }
              .border-black { border-color: black !important; }
              .border-gray-300 { border-color: #d1d5db !important; }
              .border-gray-400 { border-color: #9ca3af !important; }
              .border-b { border-bottom-width: 1px !important; }
              .bg-gray-100 { background-color: #f3f4f6 !important; }
              .text-gray-600 { color: #4b5563 !important; }
              
              .card { 
                background-color: white !important; 
                border-radius: 0.375rem !important;
                border: 1px solid #e5e7eb !important;
                overflow: hidden !important;
                margin-bottom: 0.5rem !important;
              }
              
              .card-content {
                padding: 0.5rem !important;
              }
              
              /* RTL direction */
              .rtl {
                direction: rtl !important;
                font-family: 'Zain', sans-serif !important;
              }
              
              .ltr {
                direction: ltr !important;
                font-family: 'Yrsa', serif !important;
              }
              
              /* Print-specific overrides */
              @media print {
                html, body {
                  width: 74mm !important;
                  height: auto !important;
                  min-height: 0 !important;
                  max-height: none !important;
                  overflow: visible !important;
                  background: white !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                }
                
                .bg-black {
                  background-color: black !important;
                  color: white !important;
                }
                
                .bg-black * {
                  color: white !important;
                }
                
                body * {
                  visibility: visible !important;
                }
                
                #receipt-invoice .border-2 {
                  border-width: 2px !important;
                  border-style: solid !important;
                }
                
                #receipt-invoice .border-black {
                  border-color: black !important;
                }
                
                #receipt-invoice .border-gray-300, #receipt-invoice .border-gray-400 {
                  border-color: #d1d5db !important;
                }
                
                #receipt-invoice .rounded {
                  border-radius: 0.25rem !important;
                }
                
                /* Work order number styling */
                .work-order-number {
                  font-size: 14px !important;
                  font-weight: bold !important;
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
        <ReceiptInvoice
          invoice={invoice}
          isPrintable={true}
        />
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
              printedReceipt.setAttribute('id', 'receipt-invoice');
              printedReceipt.setAttribute('style', `
                width: 74mm !important;
                max-width: 74mm !important;
                margin: 0 auto !important;
                padding: 10px !important;
                background-color: white !important;
                color: black !important;
                font-family: ${printedReceipt.dir === 'rtl' ? "'Zain', sans-serif" : "'Yrsa', serif"} !important;
                page-break-inside: avoid !important;
                page-break-after: always !important;
                text-align: center !important;
                font-size: 14px !important;
              `);
            }
            
            // Enhance work order number visibility
            const workOrderElements = printWindow.document.querySelectorAll('.text-xs');
            workOrderElements.forEach(el => {
              if ((el as HTMLElement).textContent && (el as HTMLElement).textContent.includes("ORDER #")) {
                (el as HTMLElement).classList.add('work-order-number');
                (el as HTMLElement).style.fontSize = '14px';
                (el as HTMLElement).style.fontWeight = 'bold';
              }
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
      console.error("Error printing invoice:", error);
      toast({
        title: "Error",
        description: "An error occurred while trying to print the invoice.",
        variant: "destructive",
      });
    }
  }
}
