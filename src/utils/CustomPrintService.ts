
import { WorkOrder } from "@/store/invoiceStore";
import { Invoice } from "@/store/invoiceStore";
import { Patient } from "@/store/patientStore";

export class CustomPrintService {
  // Print work order with complete edit history
  static printWorkOrder(workOrder: WorkOrder, invoice?: Invoice, patient?: Patient) {
    // Prepare work order data for printing
    const printData = {
      workOrder,
      invoice,
      patient,
      timestamp: new Date().toISOString()
    };
    
    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '-9999px';
    iframe.style.bottom = '-9999px';
    iframe.style.width = '80mm';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    // Import the component dynamically to avoid server-side rendering issues
    import('@/components/CustomWorkOrderReceipt').then(module => {
      const CustomWorkOrderReceipt = module.CustomWorkOrderReceipt;
      
      // Get the component as a string by rendering it to a container element
      const printComponent = document.createElement('div');
      
      // Use a DOM manipulation library or React's renderToString
      import('react-dom').then(ReactDOM => {
        import('react').then(React => {
          ReactDOM.render(
            React.createElement(CustomWorkOrderReceipt, { 
              workOrder, 
              invoice, 
              patient, 
              isPrintable: true 
            }),
            printComponent
          );
          
          // Wait for rendering to complete
          setTimeout(() => {
            // Write the content to the iframe
            if (iframe.contentDocument) {
              iframe.contentDocument.open();
              iframe.contentDocument.write(`
                <html>
                  <head>
                    <title>Work Order #${workOrder.id}</title>
                    <style>
                      @media print {
                        @page { 
                          size: 80mm auto;
                          margin: 0;
                        }
                        body {
                          margin: 0;
                          padding: 0;
                        }
                      }
                    </style>
                  </head>
                  <body>
                    ${printComponent.innerHTML}
                  </body>
                </html>
              `);
              iframe.contentDocument.close();
              
              // Print the iframe
              setTimeout(() => {
                iframe.contentWindow?.print();
                
                // Remove the iframe after printing
                setTimeout(() => {
                  document.body.removeChild(iframe);
                }, 1000);
              }, 500);
            }
          }, 500);
        });
      });
    });
  }
  
  // Print invoice with complete edit history
  static printInvoice(invoice: Invoice) {
    // Similar implementation as printWorkOrder but for invoices
    console.log("Printing invoice:", invoice.invoiceId);
    
    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '-9999px';
    iframe.style.bottom = '-9999px';
    iframe.style.width = '80mm';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    // Import the component dynamically
    import('@/components/InvoiceReceipt').then(module => {
      const InvoiceReceipt = module.InvoiceReceipt;
      
      // Get the component as a string by rendering it to a container element
      const printComponent = document.createElement('div');
      
      // Use React's DOM rendering
      import('react-dom').then(ReactDOM => {
        import('react').then(React => {
          ReactDOM.render(
            React.createElement(InvoiceReceipt, { 
              invoice,
              isPrintable: true 
            }),
            printComponent
          );
          
          // Wait for rendering to complete
          setTimeout(() => {
            // Write the content to the iframe
            if (iframe.contentDocument) {
              iframe.contentDocument.open();
              iframe.contentDocument.write(`
                <html>
                  <head>
                    <title>Invoice #${invoice.invoiceId}</title>
                    <style>
                      @media print {
                        @page { 
                          size: 80mm auto;
                          margin: 0;
                        }
                        body {
                          margin: 0;
                          padding: 0;
                        }
                      }
                    </style>
                  </head>
                  <body>
                    ${printComponent.innerHTML}
                  </body>
                </html>
              `);
              iframe.contentDocument.close();
              
              // Print the iframe
              setTimeout(() => {
                iframe.contentWindow?.print();
                
                // Remove the iframe after printing
                setTimeout(() => {
                  document.body.removeChild(iframe);
                }, 1000);
              }, 500);
            }
          }, 500);
        });
      });
    });
  }
}
