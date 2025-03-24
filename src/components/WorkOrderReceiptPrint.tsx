
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import ReactDOM from "react-dom";
import { CustomWorkOrderReceipt } from "./CustomWorkOrderReceipt";
import { toast } from "@/hooks/use-toast";

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
  
  try {
    // Clean up any existing print frames first
    const existingPrintElements = document.querySelectorAll('#thermal-print');
    existingPrintElements.forEach(el => {
      ReactDOM.unmountComponentAtNode(el as HTMLElement);
      el.remove();
    });
    
    // Create a new div for printing
    const workOrderElement = document.createElement('div');
    workOrderElement.id = 'thermal-print';
    
    // Set direction and other styles
    workOrderElement.dir = isRtl ? 'rtl' : 'ltr';
    workOrderElement.style.width = '80mm';
    workOrderElement.style.maxWidth = '80mm';
    workOrderElement.style.fontFamily = isRtl ? 'Cairo, sans-serif' : 'Arial, sans-serif';
    workOrderElement.style.visibility = 'hidden'; // Hide until ready to print
    workOrderElement.style.position = 'fixed';
    workOrderElement.style.top = '0';
    workOrderElement.style.left = '0';
    workOrderElement.style.zIndex = '-1000'; // Keep it below everything
    workOrderElement.style.overflow = 'hidden';
    
    // Add class for print styling
    workOrderElement.classList.add('print-receipt');
    
    // Append to body
    document.body.appendChild(workOrderElement);
    
    const Root = () => {
      return (
        <CustomWorkOrderReceipt 
          workOrder={invoice}
          invoice={invoice}
          patient={{
            name: options.patientName,
            phone: options.patientPhone,
            rx: options.rx
          }}
          isPrintable={true}
        />
      );
    };
    
    // Render the component
    ReactDOM.render(<Root />, workOrderElement);
    
    // Ensure content is fully rendered before printing
    setTimeout(() => {
      workOrderElement.style.visibility = 'visible';
      workOrderElement.style.position = 'absolute';
      workOrderElement.style.zIndex = '9999'; // Bring it to the front for printing
      
      // Use a single print operation to prevent multiple popups
      window.print();
      
      // Clean up after printing
      setTimeout(() => {
        if (document.body.contains(workOrderElement)) {
          workOrderElement.style.zIndex = '-1000'; // Hide it again
          workOrderElement.style.visibility = 'hidden';
          
          // Clean up React components after a delay
          setTimeout(() => {
            if (document.body.contains(workOrderElement)) {
              ReactDOM.unmountComponentAtNode(workOrderElement);
              document.body.removeChild(workOrderElement);
            }
          }, 500);
        }
      }, 500);
    }, 300);
  } catch (error) {
    console.error("Error printing work order:", error);
    toast({
      title: "Error",
      description: "Failed to print work order. Please try again.",
      variant: "destructive",
    });
  }
};
