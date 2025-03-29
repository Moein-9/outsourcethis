
import { Invoice, WorkOrder } from "@/store/invoiceStore";
import { Patient } from "@/store/patientStore";
import { PrintService } from "./PrintService";

export const CustomPrintService = {
  /**
   * Print a work order using the existing work order receipt template
   */
  printWorkOrder: (workOrder: WorkOrder, invoice?: Invoice, patient?: Patient) => {
    // Get the work order template element
    const workOrderElement = document.getElementById('work-order-receipt');
    
    if (!workOrderElement) {
      console.error('Work order element not found');
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
  },
  
  /**
   * Print an invoice using the existing invoice receipt template
   */
  printInvoice: (invoice: Invoice) => {
    // Get the invoice template element
    const invoiceElement = document.getElementById('receipt-invoice');
    
    if (!invoiceElement) {
      console.error('Invoice element not found');
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
  }
};
