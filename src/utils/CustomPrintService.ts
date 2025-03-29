
import { Invoice, WorkOrder } from "@/store/invoiceStore";
import { Patient } from "@/store/patientStore";
import { PrintService } from "./PrintService";
import { toast } from "@/hooks/use-toast";

export const CustomPrintService = {
  /**
   * Print a work order using the existing work order receipt template
   */
  printWorkOrder: (workOrder: WorkOrder, invoice?: Invoice, patient?: Patient) => {
    try {
      // Get the work order template element
      const workOrderElement = document.getElementById('work-order-receipt');
      
      if (!workOrderElement) {
        console.error('Work order element not found');
        toast({
          title: "Print Error",
          description: "Work order template could not be found. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Clone the element to avoid modifying the displayed version
      const clonedContent = workOrderElement.cloneNode(true) as HTMLElement;
      
      // Add printable class to ensure proper styling
      clonedContent.classList.add('printable');
      
      // Use PrintService to print the HTML content
      const htmlContent = clonedContent.outerHTML;
      PrintService.printHtml(
        PrintService.prepareWorkOrderDocument(htmlContent, 'Work Order'),
        'receipt'
      );
    } catch (error) {
      console.error('Error printing work order:', error);
      toast({
        title: "Print Error",
        description: "An error occurred while printing work order.",
        variant: "destructive",
      });
    }
  },
  
  /**
   * Print an invoice using the existing invoice receipt template
   */
  printInvoice: (invoice: Invoice) => {
    try {
      // Get the invoice template element
      const invoiceElement = document.getElementById('receipt-invoice');
      
      if (!invoiceElement) {
        console.error('Invoice element not found');
        toast({
          title: "Print Error",
          description: "Invoice template could not be found. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Clone the element to avoid modifying the displayed version
      const clonedContent = invoiceElement.cloneNode(true) as HTMLElement;
      
      // Add printable class to ensure proper styling
      clonedContent.classList.add('printable');
      
      // Use PrintService to print the HTML content
      const htmlContent = clonedContent.outerHTML;
      PrintService.printHtml(
        PrintService.prepareReceiptDocument(htmlContent, 'Invoice'),
        'receipt'
      );
    } catch (error) {
      console.error('Error printing invoice:', error);
      toast({
        title: "Print Error",
        description: "An error occurred while printing invoice.",
        variant: "destructive",
      });
    }
  }
};
