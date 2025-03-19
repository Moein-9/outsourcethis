
import React from 'react';
import { toast } from 'sonner';

/**
 * PrintService handles printing functionality across the application
 * It ensures consistent printing behavior for different document types
 */
export const PrintService = {
  /**
   * Create a hidden iframe for printing to bypass browser print preview
   * @returns The created iframe element
   */
  createPrintFrame: () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    return iframe;
  },
  
  /**
   * Print HTML content in an iframe
   * @param htmlContent The HTML content to print
   * @param onComplete Callback function to execute when printing is complete
   */
  printHtml: (htmlContent: string, onComplete?: () => void) => {
    const iframe = PrintService.createPrintFrame();
    
    // Set up a message listener to know when printing is done
    window.addEventListener('message', function handler(e) {
      if (e.data === 'print-complete') {
        window.removeEventListener('message', handler);
        document.body.removeChild(iframe);
        if (onComplete) onComplete();
      }
    }, { once: true });
    
    if (iframe.contentWindow) {
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(htmlContent);
      iframe.contentWindow.document.close();
      
      // Attempt to force iframe onload before printing
      iframe.onload = function() {
        try {
          setTimeout(() => {
            if (iframe.contentWindow) {
              iframe.contentWindow.focus();
              iframe.contentWindow.print();
            }
          }, 500);
        } catch (error) {
          console.error('Print error:', error);
          toast.error("Failed to print");
          document.body.removeChild(iframe);
          if (onComplete) onComplete();
        }
      };
    } else {
      toast.error("Failed to create print frame");
      document.body.removeChild(iframe);
      if (onComplete) onComplete();
    }
  },
  
  /**
   * Generate base HTML template for printing
   * @param title Document title
   * @param contentId ID for the content container
   * @param css Additional CSS styles
   * @param size Page size (e.g., 'A4', '80mm')
   * @param margins Page margins
   * @returns HTML template string
   */
  getHtmlTemplate: (
    title: string,
    contentId: string = 'print-content',
    css: string = '',
    size: string = 'A4',
    margins: string = '10mm'
  ) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8">
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }
          #${contentId} {
            margin: 0 auto;
          }
          @media print {
            @page {
              margin: ${margins};
              padding: 0;
              size: ${size};
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            html, body {
              width: ${size.includes('mm') ? size : 'auto'};
              height: auto !important;
              overflow: hidden;
            }
          }
          ${css}
        </style>
      </head>
      <body>
        <div id="${contentId}"></div>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.parent.postMessage('print-complete', '*');
              }, 500);
            }, 800);
          });
        </script>
      </body>
      </html>
    `;
  },
  
  /**
   * Prepare a standardized HTML document for A4 printing
   * @param content HTML content to insert in the document
   * @param title Document title
   * @returns Complete HTML document for printing
   */
  prepareA4Document: (content: string, title: string = 'Print Document') => {
    const css = `
      #print-content {
        width: 210mm;
        padding: 10mm;
      }
    `;
    
    const htmlTemplate = PrintService.getHtmlTemplate(title, 'print-content', css, 'A4', '10mm');
    
    // Insert content into the template
    return htmlTemplate.replace('<div id="print-content"></div>', `<div id="print-content">${content}</div>`);
  },
  
  /**
   * Prepare a standardized HTML document for receipt printing
   * @param content HTML content to insert in the document
   * @param title Document title
   * @returns Complete HTML document for printing
   */
  prepareReceiptDocument: (content: string, title: string = 'Receipt') => {
    const css = `
      @page {
        size: 80mm auto !important;
        margin: 0 !important;
      }
      /* Force exact dimensions and prevent browser scaling */
      html, body {
        width: 80mm !important;
        max-width: 80mm !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
      }
      #print-content {
        width: 80mm !important;
        max-width: 80mm !important;
        padding: 0 !important;
        margin: 0 !important;
        font-family: 'Courier New', monospace;
        page-break-after: always;
        page-break-inside: avoid;
      }
      .receipt-container {
        width: 80mm !important;
        max-width: 80mm !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      /* Disable browser page-break behavior */
      * {
        page-break-inside: avoid !important;
      }
      /* Explicitly hide all elements except the receipt */
      body * {
        visibility: visible !important;
      }
      /* Ensure only one page prints */
      #print-content:after {
        content: "";
        display: block;
        page-break-after: always;
        height: 0;
      }
    `;
    
    const htmlTemplate = PrintService.getHtmlTemplate(title, 'print-content', css, '80mm auto', '0');
    
    // Insert content into the template
    return htmlTemplate.replace('<div id="print-content"></div>', `<div id="print-content">${content}</div>`);
  },
  
  /**
   * Prepare a standardized HTML document for label printing
   * @param content HTML content to insert in the document
   * @param title Document title
   * @returns Complete HTML document for printing
   */
  prepareLabelDocument: (content: string, title: string = 'Labels') => {
    const css = `
      #print-content {
        width: 100mm;
        padding: 0;
      }
      @page {
        size: 100mm 16mm;
        margin: 0;
      }
      .label-container {
        width: 100mm;
        height: 16mm;
        display: flex;
        justify-content: space-between;
        font-family: Arial, sans-serif;
        page-break-inside: avoid;
        page-break-after: always;
        position: relative;
        overflow: hidden;
        border-radius: 8mm;
      }
      .right-section {
        width: 45mm;
        height: 100%;
        padding: 1mm 2mm;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .left-section {
        width: 45mm;
        height: 100%;
        padding: 1mm;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .brand-name {
        font-weight: bold;
        font-size: 9pt;
        margin-bottom: 1mm;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .detail-info {
        font-size: 7pt;
        margin-bottom: 1mm;
        line-height: 1.1;
      }
      .price {
        font-weight: bold;
        font-size: 9pt;
      }
      .store-logo {
        display: flex;
        justify-content: center;
        width: 100%;
        margin-bottom: 1mm;
      }
      .store-logo img {
        max-height: 4mm;
        width: auto;
      }
      .qr-code {
        display: flex;
        justify-content: center;
      }
      .qr-code img {
        height: 22px;
        width: 22px;
      }
    `;
    
    const htmlTemplate = PrintService.getHtmlTemplate(title, 'print-content', css, '100mm 16mm', '0');
    
    // Insert content into the template
    return htmlTemplate.replace('<div id="print-content"></div>', `<div id="print-content">${content}</div>`);
  }
};
