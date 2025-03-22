
import React from 'react';
import { createRoot } from 'react-dom/client';
import { CustomWorkOrderReceipt } from '@/components/CustomWorkOrderReceipt';
import { toast } from '@/hooks/use-toast';
import { useLanguageStore } from '@/store/languageStore';
import { Button } from '@/components/ui/button';
import { X, Printer } from 'lucide-react';

export const CustomPrintService = {
  previewWorkOrder: (workOrder: any, invoice?: any, patient?: any) => {
    console.log("CustomPrintService: Previewing work order", { workOrder, invoice, patient });
    
    // Create a new window for preview
    const previewWindow = window.open('', '_blank');
    if (!previewWindow) {
      console.error('Failed to open preview window');
      toast({
        title: "Error",
        description: "Failed to open preview window. Please check your browser settings.",
        variant: "destructive"
      });
      return;
    }

    // Create a container for the receipt
    const container = document.createElement('div');
    container.className = 'preview-container';
    previewWindow.document.body.appendChild(container);

    // Add styles including reduced spacing
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
      body {
        margin: 0;
        padding: 0;
        font-family: 'Cairo', sans-serif;
        background-color: #f4f4f4;
      }
      .preview-container {
        width: 80mm;
        margin: 20px auto;
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        border-radius: 5px;
        overflow: hidden;
      }
      .print-actions {
        display: flex;
        justify-content: space-between;
        padding: 10px 20px;
        background: white;
        box-shadow: 0 -1px 5px rgba(0,0,0,0.1);
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 100;
      }
      .print-button, .close-button {
        cursor: pointer;
        padding: 10px 20px;
        border-radius: 4px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .print-button {
        background: #4CAF50;
        color: white;
        border: none;
      }
      .close-button {
        background: #f0f0f0;
        color: #333;
        border: 1px solid #ddd;
      }
      .print-button svg, .close-button svg {
        width: 16px;
        height: 16px;
      }
      @media print {
        @page {
          size: 80mm auto;
          margin: 0;
        }
        body {
          width: 80mm;
          background: none;
        }
        .preview-container {
          width: 100%;
          margin: 0;
          box-shadow: none;
          border-radius: 0;
        }
        .print-actions {
          display: none;
        }
      }
      /* Style utilities */
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
      .text-blue-500 { color: #3b82f6; }
      .text-base { font-size: 1rem; line-height: 1.5rem; }
      .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
      .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
      .text-xs { font-size: 0.75rem; line-height: 1rem; }
      .text-\\[9px\\] { font-size: 9px; }
      .text-\\[8px\\] { font-size: 8px; }
      .border-y { border-top: 1px solid; border-bottom: 1px solid; border-color: #e5e7eb; }
      .border { border: 1px solid #e5e7eb; }
      .rtl { direction: rtl; }
      .ltr { direction: ltr; }
    `;
    previewWindow.document.head.appendChild(style);

    // Render the receipt
    const { language, t } = useLanguageStore.getState();
    
    // Create print actions
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'print-actions';

    // Render the receipt content
    createRoot(container).render(
      <CustomWorkOrderReceipt
        workOrder={workOrder}
        invoice={invoice}
        patient={patient}
        isPrintable={true}
      />
    );

    // Render print and close buttons
    createRoot(actionsContainer).render(
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button className="print-button" onClick={() => {
          previewWindow.print();
          
          // Notify success
          toast({
            title: t("printJobSent"),
            description: t("printJobSentDescription"),
          });
        }}>
          <Printer />
          {language === 'ar' ? 'طباعة' : 'Print'}
        </button>
        <button className="close-button" onClick={() => previewWindow.close()}>
          <X />
          {language === 'ar' ? 'إغلاق' : 'Close'}
        </button>
      </div>
    );
    
    previewWindow.document.body.appendChild(actionsContainer);
  }
};
