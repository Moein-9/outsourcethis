
// If this file doesn't exist yet, we'll create it
export class CustomPrintService {
  static printWorkOrder(workOrder: any, invoice?: any, patient?: any) {
    console.log('Printing work order:', workOrder);
    console.log('With invoice:', invoice);
    console.log('For patient:', patient);
    
    // Log available prescription data
    console.log('Glasses RX data:', workOrder.rx);
    console.log('Contact lens RX data:', workOrder.contactLensRx);
    
    // Create a temporary div to hold the receipt for printing
    const printContainer = document.createElement('div');
    printContainer.style.width = '80mm';
    printContainer.style.position = 'fixed';
    printContainer.style.left = '-9999px';
    document.body.appendChild(printContainer);
    
    // Get the print content (we'll assume this is provided by another method/component)
    const printContent = document.getElementById('work-order-receipt');
    
    if (printContent) {
      // Clone the content to avoid modifying the original
      const contentClone = printContent.cloneNode(true) as HTMLElement;
      printContainer.appendChild(contentClone);
      
      // Print the content
      window.print();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(printContainer);
      }, 1000);
    } else {
      console.error('Print content not found');
    }
  }
}
