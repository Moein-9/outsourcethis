
import React from 'react';
import ReactDOM from 'react-dom';
import { CustomWorkOrderReceipt } from '@/components/CustomWorkOrderReceipt';
import { useLanguageStore } from '@/store/languageStore';
import { toast } from '@/hooks/use-toast';

export class CustomPrintService {
  static printWorkOrder(workOrder: any, invoice?: any, patient?: any) {
    console.log("CustomPrintService: Printing work order", { workOrder, invoice, patient });
    
    // Check if work order has workOrderId, if not but has invoiceId, create one
    if (!workOrder.workOrderId && workOrder.invoiceId) {
      workOrder = {
        ...workOrder,
        workOrderId: `WO${workOrder.invoiceId.substring(3)}` // Convert INV1234 to WO1234
      };
    }
    
    const printContainer = document.createElement('div');
    printContainer.style.position = 'fixed';
    printContainer.style.top = '0';
    printContainer.style.left = '0';
    printContainer.style.width = '100%';
    printContainer.style.height = '100%';
    printContainer.style.backgroundColor = 'white';
    printContainer.style.zIndex = '9999';
    printContainer.style.overflow = 'auto';
    printContainer.style.display = 'none'; // Initially hidden
    document.body.appendChild(printContainer);
    
    try {
      // Render receipt to container
      const receiptElement = <CustomWorkOrderReceipt workOrder={workOrder} invoice={invoice} patient={patient} isPrintable={true} />;
      ReactDOM.render(receiptElement, printContainer);
      
      // Add print styles
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          body * {
            visibility: hidden;
          }
          #custom-work-order-receipt, #custom-work-order-receipt * {
            visibility: visible;
          }
          #custom-work-order-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          @page {
            size: 80mm auto;
            margin: 0mm;
          }
        }
      `;
      printContainer.appendChild(style);
      
      // Use timeout to ensure rendering is complete
      setTimeout(() => {
        window.print();
        
        // Add a small delay before removing the print container
        setTimeout(() => {
          if (document.body.contains(printContainer)) {
            ReactDOM.unmountComponentAtNode(printContainer);
            document.body.removeChild(printContainer);
          }
          
          toast({
            title: useLanguageStore.getState().t("success"),
            description: useLanguageStore.getState().t("printJobSent")
          });
        }, 1000);
      }, 500);
    } catch (error) {
      console.error('Error printing work order:', error);
      if (document.body.contains(printContainer)) {
        ReactDOM.unmountComponentAtNode(printContainer);
        document.body.removeChild(printContainer);
      }
      toast({
        title: useLanguageStore.getState().t("error"),
        description: useLanguageStore.getState().t("printError"),
        variant: "destructive"
      });
    }
  }
}
