
import React from 'react';
import { toast } from 'sonner';

/**
 * Unified PrintService for handling all printing needs across the application
 */
export const PrintService = {
  /**
   * Creates a hidden print frame for printing
   * @returns The iframe element
   */
  createPrintFrame: () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.visibility = 'hidden';
    iframe.style.width = '0';
    iframe.style.height = '0';
    document.body.appendChild(iframe);
    return iframe;
  },

  /**
   * Print HTML content with support for different paper types
   * @param htmlContent HTML content to print
   * @param paperType Type of paper to print on (receipt, label, a4)
   * @param onComplete Callback after printing
   */
  printHtml: (
    htmlContent: string, 
    paperType: 'receipt' | 'label' | 'a4' = 'receipt',
    onComplete?: () => void
  ) => {
    try {
      // Create the print frame
      const iframe = PrintService.createPrintFrame();
      
      // Add a listener for print completion
      window.addEventListener('message', function handler(e) {
        if (e.data === 'print-complete') {
          window.removeEventListener('message', handler);
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          if (onComplete) onComplete();
        }
      });
      
      // Write the content to the iframe
      if (iframe.contentWindow) {
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(htmlContent);
        iframe.contentWindow.document.close();
        
        // Focus and print after a slight delay to ensure content is loaded
        // DISABLE SET TIMEOUT< this causing multiple print modal displayed
        // setTimeout(() => {
        //   if (iframe.contentWindow) {
        //     iframe.contentWindow.focus();
        //     // Use printImmediately for a more direct approach
        //     iframe.contentWindow.print();
            
        //     // Signal completion after printing
        //     setTimeout(() => {
        //       window.postMessage('print-complete', '*');
        //     }, 1000); // Increased timeout for better reliability
        //   }
        // }, 800); // Increased delay to ensure content is fully loaded
      } else {
        toast.error("Failed to create print frame");
        if (onComplete) onComplete();
      }
    } catch (error) {
      console.error('Print error:', error);
      toast.error("Failed to print");
      if (onComplete) onComplete();
    }
  },
  
  /**
   * Prepares HTML for receipt printing (thermal printer, 80mm width)
   * @param content HTML content to print
   * @param title Document title
   * @returns Complete HTML document
   */
  prepareReceiptDocument: (content: string, title: string = 'Receipt') => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zain:wght@400;700&display=swap">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yrsa:wght@400;600;700&display=swap">
        <style>
          @page {
            size: 80mm auto !important;
            margin: 0mm !important;
          }
          
          @font-face {
            font-family: 'Zain';
            src: url('https://fonts.googleapis.com/css2?family=Zain:wght@400;700&display=swap');
            font-weight: normal;
            font-style: normal;
          }
          
          @font-face {
            font-family: 'Yrsa';
            src: url('https://fonts.googleapis.com/css2?family=Yrsa:wght@400;600;700&display=swap');
            font-weight: normal;
            font-style: normal;
          }
          
          body {
            margin: 0;
            padding: 0;
            width: 80mm;
            font-family: 'Yrsa', serif;
            direction: initial;
          }
          
          /* Ensure Arabic displays correctly */
          [dir="rtl"] {
            direction: rtl;
            text-align: right;
            font-family: 'Zain', sans-serif;
          }
          
          .arabic {
            font-family: 'Zain', sans-serif;
            direction: rtl;
            text-align: right;
          }
          
          /* Force single page printing */
          html, body {
            height: auto;
          }
          
          /* Ensure content is properly contained */
          .receipt-container {
            width: 72mm;
            padding: 4mm;
            margin: 0;
            page-break-after: always;
            page-break-inside: avoid;
          }
          
          /* Fix for print dialog appearing but not working - RED FLAG #1 */
          @media print {
            body {
              width: 80mm !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .receipt-container {
              width: 72mm !important;
              margin: 0 !important;
              padding: 4mm !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">${content}</div>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            // Force printing after a delay to ensure everything is loaded
            setTimeout(function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.parent.postMessage('print-complete', '*');
              }, 1000);
            }, 500);
          });
        </script>
      </body>
      </html>
    `;
  },
  
  /**
   * Prepares HTML for label printing (100mm × 16mm)
   * @param content HTML content to print
   * @param title Document title
   * @returns Complete HTML document
   */
  prepareLabelDocument: (content: string, title: string = 'Label') => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yrsa:wght@400;600;700&display=swap">
        <style>
          @page {
            size: 100mm 16mm !important;
            margin: 0mm !important;
            padding: 0mm !important;
          }
          
          @font-face {
            font-family: 'Yrsa';
            src: url('https://fonts.googleapis.com/css2?family=Yrsa:wght@400;600;700&display=swap');
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100mm !important;
            max-width: 100mm !important;
            overflow: hidden !important;
            font-family: 'Yrsa', serif !important;
          }
          
          .label-container {
            width: 50mm !important;
            height: 16mm !important;
            display: flex !important;
            justify-content: space-between !important;
            margin: 0 0 0 auto !important;
            padding: 0 !important;
            overflow: hidden !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
          }
          
          .right-section {
            width: 45mm !important;
            height: 100% !important;
            padding: 1mm 2mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
          }
          
          .left-section {
            width: 45mm !important;
            height: 100% !important;
            padding: 1mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
          }
          
          .brand-name {
            font-weight: bold !important;
            font-size: 6pt !important;
            margin-bottom: 0.5mm !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          
          .detail-info {
            font-size: 5pt !important;
            margin-bottom: 0.5mm !important;
            line-height: 1.1 !important;
          }
          
          .price {
            font-weight: bold !important;
            font-size: 8pt !important;
          }
          
          .store-logo {
            display: flex !important;
            justify-content: center !important;
            width: 100% !important;
            margin-bottom: 1mm !important;
          }
          
          .store-logo img {
            max-height: 4mm !important;
            width: auto !important;
          }
          
          .qr-code {
            display: flex !important;
            justify-content: center !important;
          }
          
          .qr-code img, .qr-code svg {
            height: 22px !important;
            width: 22px !important;
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.parent.postMessage('print-complete', '*');
              }, 1000);
            }, 500);
          });
        </script>
      </body>
      </html>
    `;
  },
  
  /**
   * Prepares HTML for RX printing (thermal printer, 80mm width)
   * @param content HTML content to print
   * @param title Document title
   * @returns Complete HTML document
   */
  prepareRxDocument: (content: string, title: string = 'Prescription') => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zain:wght@400;700&display=swap">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yrsa:wght@400;600;700&display=swap">
        <style>
          @page {
            size: 80mm auto !important;
            margin: 0mm !important;
          }
          
          @font-face {
            font-family: 'Zain';
            src: url('https://fonts.googleapis.com/css2?family=Zain:wght@400;700&display=swap');
          }
          
          @font-face {
            font-family: 'Yrsa';
            src: url('https://fonts.googleapis.com/css2?family=Yrsa:wght@400;600;700&display=swap');
          }
          
          body {
            margin: 0;
            padding: 0;
            width: 80mm;
            font-family: 'Yrsa', serif;
          }
          
          /* Ensure Arabic displays correctly */
          [dir="rtl"] {
            direction: rtl;
            text-align: right;
            font-family: 'Zain', sans-serif;
          }
          
          .arabic {
            font-family: 'Zain', sans-serif;
            direction: rtl;
            text-align: right;
          }
          
          /* Force single page printing */
          html, body {
            height: auto;
          }
          
          /* Ensure content is properly contained */
          .rx-container {
            width: 72mm;
            padding: 4mm;
            margin: 0;
            page-break-after: always;
            page-break-inside: avoid;
          }
          
          /* Additional styles for RX */
          .rx-header {
            text-align: center;
            margin-bottom: 5mm;
          }
          
          .rx-logo {
            max-width: 60mm;
            max-height: 10mm;
            margin: 0 auto;
            display: block;
          }
          
          .rx-title {
            font-size: 12pt;
            font-weight: bold;
            margin: 3mm 0;
          }
          
          .rx-section {
            margin-bottom: 4mm;
          }
          
          .rx-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .rx-table td, .rx-table th {
            border: 1px solid #000;
            padding: 1mm 2mm;
            font-size: 8pt;
          }
          
          /* Fix for print dialog */
          @media print {
            body {
              width: 80mm !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .rx-container {
              width: 72mm !important;
              margin: 0 !important;
              padding: 4mm !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="rx-container">${content}</div>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.parent.postMessage('print-complete', '*');
              }, 1000);
            }, 500);
          });
        </script>
      </body>
      </html>
    `;
  },
  
  /**
   * Prepares HTML for work order printing (thermal printer, 80mm width)
   * @param content HTML content to print
   * @param title Document title
   * @returns Complete HTML document
   */
  prepareWorkOrderDocument: (content: string, title: string = 'Work Order') => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zain:wght@400;700&display=swap">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yrsa:wght@400;600;700&display=swap">
        <style>
          @page {
            size: 80mm auto !important;
            margin: 0mm !important;
          }
          
          @font-face {
            font-family: 'Zain';
            src: url('https://fonts.googleapis.com/css2?family=Zain:wght@400;700&display=swap');
          }
          
          @font-face {
            font-family: 'Yrsa';
            src: url('https://fonts.googleapis.com/css2?family=Yrsa:wght@400;600;700&display=swap');
          }
          
          body {
            margin: 0;
            padding: 0;
            width: 80mm;
            font-family: 'Yrsa', serif;
          }
          
          /* Ensure Arabic displays correctly */
          [dir="rtl"] {
            direction: rtl;
            text-align: right;
            font-family: 'Zain', sans-serif;
          }
          
          .arabic {
            font-family: 'Zain', sans-serif;
            direction: rtl;
            text-align: right;
          }
          
          /* Force single page printing */
          html, body {
            height: auto;
          }
          
          /* Ensure content is properly contained */
          .workorder-container {
            width: 72mm;
            padding: 4mm;
            margin: 0;
            page-break-after: always;
            page-break-inside: avoid;
          }
          
          /* WorkOrder specific styles */
          .order-header {
            text-align: center;
            margin-bottom: 5mm;
          }
          
          .order-logo {
            max-width: 60mm;
            max-height: 10mm;
            margin: 0 auto;
            display: block;
          }
          
          .order-title {
            font-size: 12pt;
            font-weight: bold;
            margin: 3mm 0;
            text-align: center;
          }
          
          .order-section {
            margin-bottom: 4mm;
          }
          
          .order-field {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2mm;
            font-size: 8pt;
          }
          
          .order-label {
            font-weight: bold;
          }
          
          .order-divider {
            border-top: 1px dashed #000;
            margin: 3mm 0;
          }
          
          .order-signature {
            margin-top: 5mm;
            text-align: center;
            font-size: 8pt;
          }
          
          /* Fix for print dialog */
          @media print {
            body {
              width: 80mm !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .workorder-container {
              width: 72mm !important;
              margin: 0 !important;
              padding: 4mm !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="workorder-container">${content}</div>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.parent.postMessage('print-complete', '*');
              }, 1000);
            }, 500);
          });
        </script>
      </body>
      </html>
    `;
  },
  
  /**
   * Prepares HTML for A4 document printing
   * @param content HTML content to print
   * @param title Document title
   * @returns Complete HTML document
   */
  prepareA4Document: (content: string, title: string = 'Document') => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zain:wght@400;700&display=swap">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yrsa:wght@400;600;700&display=swap">
        <style>
          @page {
            size: A4 !important;
            margin: 10mm !important;
          }
          
          @font-face {
            font-family: 'Zain';
            src: url('https://fonts.googleapis.com/css2?family=Zain:wght@400;700&display=swap');
          }
          
          @font-face {
            font-family: 'Yrsa';
            src: url('https://fonts.googleapis.com/css2?family=Yrsa:wght@400;600;700&display=swap');
          }
          
          body {
            font-family: 'Yrsa', serif;
            margin: 0;
            padding: 0;
          }
          
          .a4-container {
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
            page-break-after: always;
            page-break-inside: avoid;
          }
          
          /* Ensure Arabic displays correctly */
          [dir="rtl"] {
            direction: rtl;
            text-align: right;
            font-family: 'Zain', sans-serif;
          }
          
          .arabic {
            font-family: 'Zain', sans-serif;
            direction: rtl;
            text-align: right;
          }
          
          /* Fix for print dialog */
          @media print {
            body {
              width: 210mm !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            .a4-container {
              width: 190mm !important;
              margin: 10mm !important;
              padding: 0 !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="a4-container">${content}</div>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.parent.postMessage('print-complete', '*');
              }, 1000);
            }, 500);
          });
        </script>
      </body>
      </html>
    `;
  }
};
