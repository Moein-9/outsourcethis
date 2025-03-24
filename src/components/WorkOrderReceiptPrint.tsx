
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { WorkOrderPrint } from "./WorkOrderPrint";
import ReactDOM from "react-dom";

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
  workOrderElement.style.fontFamily = isRtl ? 'Cairo, sans-serif' : 'Arial, sans-serif';
  workOrderElement.style.visibility = 'hidden'; // Hide until ready to print
  workOrderElement.style.position = 'fixed';
  workOrderElement.style.top = '0';
  workOrderElement.style.left = '0';
  
  // Render the WorkOrderPrint component inside the div
  document.body.appendChild(workOrderElement);
  
  const Root = () => {
    return (
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
    );
  };
  
  // Use ReactDOM.render directly
  ReactDOM.render(<Root />, workOrderElement);
  
  // Ensure content is fully rendered before printing
  setTimeout(() => {
    workOrderElement.style.visibility = 'visible';
    window.print();
    
    // Remove the element after printing
    setTimeout(() => {
      if (document.body.contains(workOrderElement)) {
        // Clean up React components before removing element
        ReactDOM.unmountComponentAtNode(workOrderElement);
        document.body.removeChild(workOrderElement);
      }
    }, 1000);
  }, 500);
};
