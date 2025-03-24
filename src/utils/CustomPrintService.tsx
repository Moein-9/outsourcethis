
import { toast } from "@/hooks/use-toast";
import { useLanguageStore } from "@/store/languageStore";
import { PrintService } from "./PrintService";

export class CustomPrintService {
  static printWorkOrder(workOrder: any, invoice?: any, patient?: any) {
    console.log("CustomPrintService: Printing work order", { workOrder, invoice, patient });
    
    // Get current language
    const currentLanguage = useLanguageStore.getState().language;
    const isRtl = currentLanguage === 'ar';
    
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
        <html ${isRtl ? 'dir="rtl"' : 'dir="ltr"'}>
          <head>
            <title>Work Order</title>
            <style>
              @media print {
                @page {
                  size: 80mm auto !important; /* Fixed width but auto height */
                  margin: 0 !important;
                  padding: 0 !important;
                }
                
                body {
                  width: 80mm !important;
                  height: auto !important;
                  overflow: hidden !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: white !important; /* White background for print */
                  color: black !important;
                  direction: ${isRtl ? 'rtl' : 'ltr'} !important;
                  font-family: ${isRtl ? 'Cairo, Arial' : 'Arial'}, sans-serif !important;
                  font-size: 10px !important; /* Smaller font to fit 48 columns */
                  line-height: 1.1 !important; /* Tighter line height */
                }
                
                #work-order-receipt {
                  width: 76mm !important; /* 80mm minus margin */
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
                  transform-origin: top left !important;
                  transform: scale(1) !important;
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
                
                /* Keep RX table in LTR mode regardless of language */
                table.rx-table {
                  direction: ltr !important;
                  font-size: 8px !important; /* Smaller font for tables */
                }
                
                /* Make sure technical terms stay in English */
                .technical-term {
                  font-family: Arial, sans-serif !important;
                }
                
                /* Make tables more compact to fit 48 columns */
                table {
                  max-width: 74mm !important;
                  border-collapse: collapse !important;
                }
                
                th, td {
                  padding: 0.5mm !important;
                  font-size: 8px !important;
                }
                
                /* Reduce padding and margins throughout */
                .p-3 { padding: 1mm !important; }
                .p-2 { padding: 0.8mm !important; }
                .p-1 { padding: 0.5mm !important; }
                .mb-2 { margin-bottom: 1mm !important; }
                .mb-3 { margin-bottom: 1.5mm !important; }
                .gap-2 { gap: 0.8mm !important; }
                
                /* Chrome-specific fixes */
                @supports (-webkit-appearance:none) {
                  body, html, #work-order-receipt {
                    height: fit-content !important;
                    min-height: fit-content !important;
                    max-height: fit-content !important;
                  }
                }
              }
              
              body {
                font-family: ${isRtl ? 'Cairo, Arial' : 'Arial'}, sans-serif;
                margin: 0;
                padding: 0;
                background: white;
                color: black;
                direction: ${isRtl ? 'rtl' : 'ltr'};
                width: 80mm;
                font-size: 10px;
                line-height: 1.1;
              }
              
              /* Background classes */
              .bg-black {
                background-color: black !important;
                color: white !important;
              }
              
              /* Keep RX table in LTR mode regardless of language */
              table.rx-table {
                direction: ltr !important;
                font-size: 8px;
              }
              
              /* Make sure technical terms stay in English */
              .technical-term {
                font-family: Arial, sans-serif !important;
              }
              
              /* Make tables more compact */
              table {
                max-width: 74mm;
                border-collapse: collapse;
              }
              
              th, td {
                padding: 0.5mm;
                font-size: 8px;
              }
              
              /* Reduce padding and margins throughout */
              .p-3 { padding: 1mm; }
              .p-2 { padding: 0.8mm; }
              .p-1 { padding: 0.5mm; }
              .mb-2 { margin-bottom: 1mm; }
              .mb-3 { margin-bottom: 1.5mm; }
              .gap-2 { gap: 0.8mm; }
            </style>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap">
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
          
          // Make sure technical rx terms stay in English
          const technicalTerms = printWindow.document.querySelectorAll('th:not(:first-child)');
          technicalTerms.forEach(term => {
            if (term instanceof HTMLElement) {
              term.classList.add('technical-term');
            }
          });
          
          // Add rx-table class to prescription tables to maintain LTR
          const tables = printWindow.document.querySelectorAll('table');
          tables.forEach(table => {
            table.classList.add('rx-table');
          });
          
          // Wait for content to load before proceeding
          printWindow.document.close();
        }
      } else {
        // Use PrintService as fallback method to prevent the "Unable to find work order" error
        printWindow.close();
        
        const workOrders = document.querySelectorAll('.print-receipt');
        if (workOrders.length > 0) {
          const workOrderContent = workOrders[0].innerHTML;
          
          PrintService.printHtml(
            PrintService.prepareWorkOrderDocument(workOrderContent, 'Work Order Receipt'),
            'receipt',
            () => {
              console.log('Work order receipt printed successfully using fallback method');
            }
          );
        } else {
          // Handle the case where the element doesn't exist
          console.error("Unable to find work order element with ID 'work-order-receipt'");
          printWindow.document.write("<p>Unable to find work order content. Please try again.</p>");
          printWindow.document.close();
          
          // Show toast notification
          toast({
            title: "Error",
            description: "Unable to find work order content. Please try again.",
            variant: "destructive",
          });
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
