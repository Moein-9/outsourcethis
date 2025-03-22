
import React from 'react';
import { createRoot } from 'react-dom/client';
import { CustomWorkOrderReceipt } from '@/components/CustomWorkOrderReceipt';
import { toast } from '@/hooks/use-toast';
import { useLanguageStore } from '@/store/languageStore';
import { useInventoryStore } from '@/store/inventoryStore';

export const CustomPrintService = {
  printWorkOrder: (workOrder: any, invoice?: any, patient?: any) => {
    console.log("CustomPrintService: Printing work order", { workOrder, invoice, patient });
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Failed to open print window');
      toast({
        title: "Error",
        description: "Failed to open print window. Please check your browser settings.",
        variant: "destructive"
      });
      return;
    }

    // Create a container for the receipt
    const container = document.createElement('div');
    container.className = 'print-container';
    printWindow.document.body.appendChild(container);

    // Add necessary styles
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
      body {
        margin: 0;
        padding: 0;
        font-family: 'Cairo', sans-serif;
      }
      .print-container {
        width: 80mm;
        margin: 0 auto;
      }
      @media print {
        @page {
          size: 80mm auto;
          margin: 0;
        }
        body {
          width: 80mm;
        }
      }
      /* Basic utility classes */
      .text-center { text-align: center; }
      .text-xs { font-size: 10px; }
      .text-sm { font-size: 12px; }
      .text-base { font-size: 14px; }
      .text-lg { font-size: 16px; }
      .text-xl { font-size: 18px; }
      .font-bold { font-weight: bold; }
      .font-semibold { font-weight: 600; }
      .border-b { border-bottom: 1px solid #ccc; }
      .border-t { border-top: 1px solid #ccc; }
      .border-dashed { border-style: dashed; }
      .border { border: 1px solid; }
      .border-black { border-color: black; }
      .border-green-300 { border-color: #86efac; }
      .border-red-300 { border-color: #fca5a5; }
      .rounded { border-radius: 0.25rem; }
      .mb-1 { margin-bottom: 0.25rem; }
      .mb-2 { margin-bottom: 0.5rem; }
      .mb-3 { margin-bottom: 0.75rem; }
      .mb-4 { margin-bottom: 1rem; }
      .mt-1 { margin-top: 0.25rem; }
      .mt-2 { margin-top: 0.5rem; }
      .mt-4 { margin-top: 1rem; }
      .mx-auto { margin-left: auto; margin-right: auto; }
      .p-1 { padding: 0.25rem; }
      .p-2 { padding: 0.5rem; }
      .p-3 { padding: 0.75rem; }
      .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
      .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
      .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
      .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
      .pl-2 { padding-left: 0.5rem; }
      .pb-1 { padding-bottom: 0.25rem; }
      .pb-2 { padding-bottom: 0.5rem; }
      .pt-2 { padding-top: 0.5rem; }
      .grid { display: grid; }
      .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .grid-cols-8 { grid-template-columns: repeat(8, minmax(0, 1fr)); }
      .gap-1 { gap: 0.25rem; }
      .gap-2 { gap: 0.5rem; }
      .gap-x-1 { column-gap: 0.25rem; }
      .flex { display: flex; }
      .flex-1 { flex: 1 1 0%; }
      .flex-col { flex-direction: column; }
      .space-y-0.5 > * + * { margin-top: 0.125rem; }
      .space-y-1 > * + * { margin-top: 0.25rem; }
      .space-y-1.5 > * + * { margin-top: 0.375rem; }
      .space-y-2 > * + * { margin-top: 0.5rem; }
      .justify-between { justify-content: space-between; }
      .justify-center { justify-content: center; }
      .items-center { align-items: center; }
      .items-end { align-items: flex-end; }
      .h-4 { height: 1rem; }
      .h-8 { height: 2rem; }
      .h-10 { height: 2.5rem; }
      .h-14 { height: 3.5rem; }
      .w-4 { width: 1rem; }
      .w-auto { width: auto; }
      .w-full { width: 100%; }
      .bg-green-100 { background-color: #dcfce7; }
      .bg-red-100 { background-color: #fee2e2; }
      .bg-muted { background-color: #f3f4f6; }
      .bg-muted\\/50 { background-color: rgba(243, 244, 246, 0.5); }
      .text-muted-foreground { color: #6b7280; }
      .text-white { color: white; }
      .text-green-600 { color: #16a34a; }
      .text-green-700 { color: #15803d; }
      .text-red-600 { color: #dc2626; }
      .text-red-700 { color: #b91c1c; }
      .text-base { font-size: 1rem; line-height: 1.5rem; }
      .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
      .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
      .text-xs { font-size: 0.75rem; line-height: 1rem; }
      .text-\\[9px\\] { font-size: 9px; }
      .border-y { border-top: 1px solid; border-bottom: 1px solid; border-color: #e5e7eb; }
      .border { border: 1px solid #e5e7eb; }
      .rtl { direction: rtl; }
      .ltr { direction: ltr; }
      .text-right { text-align: right; }
      .bg-slate-50 { background-color: #f8fafc; }
    `;
    printWindow.document.head.appendChild(style);

    // Render the receipt
    const { language, t } = useLanguageStore.getState();
    
    // Get the inventory store state directly
    const inventoryStoreState = useInventoryStore.getState();
    
    createRoot(container).render(
      <CustomWorkOrderReceipt
        workOrder={workOrder}
        invoice={invoice}
        patient={patient}
        isPrintable={true}
      />
    );

    // Print after resources are loaded
    printWindow.onload = function() {
      setTimeout(() => {
        try {
          // Force Chrome's print dialog instead of browser's default print dialog
          if (printWindow.document.execCommand) {
            printWindow.document.execCommand('print', false, null);
          } else {
            printWindow.print();
          }
          
          // Notify success
          toast({
            title: t("printJobSent"),
            description: t("printJobSentDescription"),
          });
        } catch (error) {
          console.error('Print error:', error);
          toast({
            title: t("error"),
            description: t("printError"),
            variant: "destructive"
          });
        }
      }, 500);
    };
  }
};
