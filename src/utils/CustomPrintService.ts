
import { Invoice, WorkOrder } from "@/store/invoiceStore";
import { Patient } from "@/store/patientStore";
import { PrintService } from "./PrintService";
import { toast } from "@/hooks/use-toast";

export const CustomPrintService = {
  /**
   * Print a work order using the work order receipt template
   */
  printWorkOrder: (workOrder: WorkOrder, invoice?: Invoice, patient?: Patient) => {
    try {
      console.log("[CustomPrintService] Starting work order print process");
      
      // Get the work order template element
      const workOrderElement = document.getElementById('work-order-receipt');
      
      if (!workOrderElement) {
        console.error('[CustomPrintService] Work order element not found in DOM');
        toast({
          title: "Print Error",
          description: "Work order template could not be found. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Clone the element to avoid modifying the displayed version
      const clonedContent = workOrderElement.cloneNode(true) as HTMLElement;
      
      // Add printable class to ensure proper styling during print
      clonedContent.classList.add('printable');
      
      // Use PrintService to print the HTML content
      const htmlContent = clonedContent.outerHTML;
      
      console.log("[CustomPrintService] Sending work order to PrintService");
      
      // Set a small timeout to ensure the DOM is ready
      setTimeout(() => {
        PrintService.printHtml(
          PrintService.prepareWorkOrderDocument(htmlContent, 'Work Order'),
          'receipt',
          () => {
            console.log("[CustomPrintService] Work order print complete");
          }
        );
      }, 100);
    } catch (error) {
      console.error('[CustomPrintService] Error printing work order:', error);
      toast({
        title: "Print Error",
        description: "An error occurred while printing work order.",
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
      
      // Get the invoice template element
      const invoiceElement = document.getElementById('receipt-invoice');
      
      if (!invoiceElement) {
        console.error('[CustomPrintService] Invoice element not found in DOM');
        toast({
          title: "Print Error",
          description: "Invoice template could not be found. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Clone the element to avoid modifying the displayed version
      const clonedContent = invoiceElement.cloneNode(true) as HTMLElement;
      
      // Add printable class to ensure proper styling during print
      clonedContent.classList.add('printable');
      
      // Use PrintService to print the HTML content
      const htmlContent = clonedContent.outerHTML;
      
      console.log("[CustomPrintService] Sending invoice to PrintService");
      
      // Set a small timeout to ensure the DOM is ready
      setTimeout(() => {
        PrintService.printHtml(
          PrintService.prepareReceiptDocument(htmlContent, 'Invoice'),
          'receipt',
          () => {
            console.log("[CustomPrintService] Invoice print complete");
          }
        );
      }, 100);
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
