
import React from 'react';
import { createRoot } from 'react-dom/client';
import { CustomWorkOrderReceipt } from '@/components/CustomWorkOrderReceipt';

export const CustomPrintService = {
  printWorkOrder: (workOrder: any, invoice?: any, patient?: any) => {
    console.log("CustomPrintService: Printing work order", { workOrder, invoice, patient });
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Failed to open print window');
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
      .p-2 { padding: 0.5rem; }
      .p-3 { padding: 0.75rem; }
      .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
      .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
      .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
      .pl-2 { padding-left: 0.5rem; }
      .pb-2 { padding-bottom: 0.5rem; }
      .grid { display: grid; }
      .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .grid-cols-8 { grid-template-columns: repeat(8, minmax(0, 1fr)); }
      .gap-1 { gap: 0.25rem; }
      .gap-2 { gap: 0.5rem; }
      .gap-x-1 { column-gap: 0.25rem; }
      .flex { display: flex; }
      .flex-col { flex-direction: column; }
      .space-y-1 > * + * { margin-top: 0.25rem; }
      .space-y-2 > * + * { margin-top: 0.5rem; }
      .justify-between { justify-content: space-between; }
      .justify-center { justify-content: center; }
      .items-center { align-items: center; }
      .h-8 { height: 2rem; }
      .h-10 { height: 2.5rem; }
      .w-full { width: 100%; }
      .bg-green-100 { background-color: #dcfce7; }
      .bg-red-100 { background-color: #fee2e2; }
      .bg-green-500 { background-color: #22c55e; }
      .bg-red-500 { background-color: #ef4444; }
      .text-white { color: white; }
      .text-green-600 { color: #16a34a; }
      .text-green-700 { color: #15803d; }
      .text-red-600 { color: #dc2626; }
      .text-red-700 { color: #b91c1c; }
      .text-blue-500 { color: #3b82f6; }
      .rtl { direction: rtl; }
      .ltr { direction: ltr; }
    `;
    printWindow.document.head.appendChild(style);

    // Render the receipt
    createRoot(container).render(
      <CustomWorkOrderReceipt
        workOrder={workOrder}
        invoice={invoice}
        patient={patient}
      />
    );

    // Print after resources are loaded
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.print();
        // Close window automatically after printing
        // printWindow.close();
      }, 500);
    };
  }
};
