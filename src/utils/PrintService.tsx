
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
          document.body.removeChild(iframe);
          if (onComplete) onComplete();
        }
      });
      
      // Write the content to the iframe
      if (iframe.contentWindow) {
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(htmlContent);
        iframe.contentWindow.document.close();
        
        // Focus and print after a slight delay to ensure content is loaded
        setTimeout(() => {
          if (iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            
            // Signal completion after printing
            setTimeout(() => {
              window.postMessage('print-complete', '*');
            }, 500);
          }
        }, 500);
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
        <style>
          @page {
            size: 80mm auto !important;
            margin: 0mm !important;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: 'Courier New', monospace;
            width: 80mm !important;
            max-width: 80mm !important;
            overflow: hidden !important;
          }
          
          /* Ensure Arabic displays correctly */
          [dir="rtl"] {
            direction: rtl;
            text-align: right;
            font-family: 'Arial', sans-serif;
          }
          
          /* Force single page printing */
          html, body {
            height: auto !important;
          }
          
          /* Ensure content is properly contained */
          .receipt-container {
            width: 80mm !important;
            max-width: 80mm !important;
            padding: 4mm !important;
            margin: 0 !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
          }
          
          /* Fix for Arabic text in receipts */
          @font-face {
            font-family: 'ArialForPrint';
            src: local('Arial');
            unicode-range: U+0600-06FF;
          }
          
          * {
            font-family: 'ArialForPrint', 'Arial', 'Courier New', monospace;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">${content}</div>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.parent.postMessage('print-complete', '*');
              }, 500);
            }, 300);
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
        <style>
          @page {
            size: 100mm 16mm !important;
            margin: 0mm !important;
            padding: 0mm !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100mm !important;
            max-width: 100mm !important;
            overflow: hidden !important;
          }
          
          .label-container {
            width: 100mm !important;
            height: 16mm !important;
            display: flex !important;
            justify-content: space-between !important;
            font-family: Arial, sans-serif !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            border-radius: 8mm !important;
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
            font-size: 9pt !important;
            margin-bottom: 1mm !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          
          .detail-info {
            font-size: 7pt !important;
            margin-bottom: 1mm !important;
            line-height: 1.1 !important;
          }
          
          .price {
            font-weight: bold !important;
            font-size: 9pt !important;
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
              }, 500);
            }, 300);
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
        <style>
          @page {
            size: A4 !important;
            margin: 10mm !important;
          }
          
          body {
            font-family: Arial, sans-serif;
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
              }, 500);
            }, 300);
          });
        </script>
      </body>
      </html>
    `;
  }
};
