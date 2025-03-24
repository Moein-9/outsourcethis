
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { WorkOrderPrint } from "./WorkOrderPrint";
import ReactDOM from "react-dom";
import { PrintService } from "@/utils/PrintService";

interface PrintWorkOrderReceiptOptions {
  invoice: any;
  patientName?: string;
  patientPhone?: string;
  rx?: any;
  lensType?: string;
  coating?: string;
  frame?: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  };
  contactLenses?: any[];
  contactLensRx?: any;
  forcedLanguage?: 'en' | 'ar';
}

export const printWorkOrderReceipt = (options: PrintWorkOrderReceiptOptions) => {
  const currentLanguage = options.forcedLanguage || useLanguageStore.getState().language;
  const isRtl = currentLanguage === 'ar';
  
  // Clone the invoice object and set the createAt if not present
  const invoice = {
    ...options.invoice,
    createdAt: options.invoice.createdAt || new Date().toISOString()
  };
  
  const workOrderElement = document.createElement('div');
  workOrderElement.id = 'thermal-print';
  
  // Set direction and other styles
  workOrderElement.dir = isRtl ? 'rtl' : 'ltr';
  workOrderElement.style.width = '80mm';
  workOrderElement.style.maxWidth = '80mm'; // Ensure it doesn't exceed 80mm
  workOrderElement.style.fontFamily = isRtl ? 'Cairo, sans-serif' : 'Arial, sans-serif';
  workOrderElement.style.visibility = 'hidden'; // Hide until ready to print
  workOrderElement.style.position = 'fixed';
  workOrderElement.style.top = '0';
  workOrderElement.style.left = '0';
  workOrderElement.style.zIndex = '-1000'; // Keep it out of view
  workOrderElement.style.fontSize = '10px'; // Ensure small font size to fit 48 columns
  
  // Render the WorkOrderPrint component inside the div
  document.body.appendChild(workOrderElement);
  
  const Root = () => {
    return (
      <div className="print-receipt" style={{ width: '80mm', maxWidth: '80mm', overflow: 'hidden', padding: '1mm' }}>
        <WorkOrderPrint 
          invoice={invoice}
          patientName={options.patientName}
          patientPhone={options.patientPhone}
          rx={options.rx}
          lensType={options.lensType}
          coating={options.coating}
          frame={options.frame}
          contactLenses={options.contactLenses}
          contactLensRx={options.contactLensRx}
        />
      </div>
    );
  };
  
  // Use ReactDOM.render directly
  ReactDOM.render(<Root />, workOrderElement);
  
  // Generate html content for the print service
  setTimeout(() => {
    if (workOrderElement && document.body.contains(workOrderElement)) {
      const htmlContent = workOrderElement.innerHTML;
      
      // Clean up React components before removing element
      ReactDOM.unmountComponentAtNode(workOrderElement);
      document.body.removeChild(workOrderElement);
      
      // Use the PrintService to handle the printing with the proper formatting
      PrintService.printHtml(
        PrintService.prepareWorkOrderDocument(htmlContent, 'Work Order Receipt'),
        'receipt',
        () => {
          console.log('Work order receipt printed successfully');
        }
      );
    }
  }, 300);
};
