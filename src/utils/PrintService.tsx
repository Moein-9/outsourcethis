import React from 'react';
import { toast } from '@/hooks/use-toast';

/**
 * Unified PrintService for handling all printing needs across the application
 */
export const PrintService = {
  /**
   * Creates a hidden print frame for printing
   * @returns The iframe element
   */
  createPrintFrame: () => {
    // Remove any existing print frames to prevent issues
    const existingFrames = document.querySelectorAll('iframe.print-frame');
    existingFrames.forEach(frame => {
      document.body.removeChild(frame);
    });
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.visibility = 'hidden';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.left = '0';
    iframe.style.top = '0';
    iframe.className = 'print-frame';
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
      console.log(`[PrintService] Starting print process for ${paperType}`);
      
      // Use a consistent approach: window-based for all prints
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      if (!printWindow) {
        console.error('[PrintService] Failed to open print window - likely blocked by browser');
        toast({
          title: "Print Error",
          description: "Popup blocked. Please allow popups for this site and try again.",
          variant: "destructive"
        });
        if (onComplete) onComplete();
        return;
      }
      
      // Set up completion handler
      let printCompleted = false;
      let documentLoaded = false;
      
      // Listen for beforeunload to detect when print dialog is closed
      printWindow.addEventListener('beforeunload', () => {
        console.log('[PrintService] Print window closing');
        if (!printCompleted) {
          printCompleted = true;
          if (onComplete) {
            console.log('[PrintService] Running completion callback');
            setTimeout(() => onComplete(), 100);
          }
        }
      });
      
      // Write content to the window
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Handle document loaded event
      printWindow.onload = () => {
        documentLoaded = true;
        console.log('[PrintService] Document loaded in print window');
        
        // Focus window before printing (important for Firefox)
        printWindow.focus();
        
        // Wait for resources to load
        setTimeout(() => {
          try {
            // Track print dialog showing
            console.log('[PrintService] Triggering browser print dialog');
            printWindow.print();
            
            // Set a fallback completion handler (in case beforeunload doesn't fire)
            setTimeout(() => {
              if (!printCompleted) {
                console.log('[PrintService] Using fallback completion (timeout)');
                printCompleted = true;
                // Close window in case it's still open
                try { printWindow.close(); } catch (e) {}
                if (onComplete) onComplete();
              }
            }, 5000);
          } catch (printError) {
            console.error('[PrintService] Error during print:', printError);
            printWindow.close();
            toast({
              title: "Print Error",
              description: "Failed to print. Try refreshing the page or using a different browser.",
              variant: "destructive"
            });
            if (onComplete) onComplete();
          }
        }, 500); // Increased timeout to ensure resources load
      };
      
      // Handle load failures
      setTimeout(() => {
        if (!documentLoaded) {
          console.error('[PrintService] Document failed to load in print window');
          try { printWindow.close(); } catch (e) {}
          toast({
            title: "Print Error",
            description: "Document failed to load for printing. Please try again.",
            variant: "destructive"
          });
          if (onComplete) onComplete();
        }
      }, 3000);
      
    } catch (error) {
      console.error('[PrintService] Critical error:', error);
      toast({
        title: "Print Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
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
            margin: 0 !important;
            padding: 0 !important;
            width: 80mm !important;
            font-family: 'Yrsa', serif !important;
            direction: initial !important;
            font-size: 10px !important;
            line-height: 1.1 !important;
          }
          
          /* Ensure Arabic displays correctly */
          [dir="rtl"] {
            direction: rtl !important;
            text-align: right !important;
            font-family: 'Zain', sans-serif !important;
          }
          
          .arabic {
            font-family: 'Zain', sans-serif !important;
            direction: rtl !important;
            text-align: right !important;
          }
          
          /* Force single page printing */
          html, body {
            height: auto !important;
            width: 80mm !important;
          }
          
          /* Ensure content is properly contained */
          .receipt-container {
            width: 74mm !important;
            padding: 3mm !important;
            margin: 0 !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
          }
          
          /* Compact elements */
          h1, h2, h3, p {
            margin: 1px 0 !important;
          }
          
          /* Remove all unnecessary spacing */
          table td, table th {
            padding: 1px !important;
          }
          
          /* Reduce spacing between elements */
          div {
            margin-bottom: 2px !important;
          }
          
          /* Fix for print dialog appearing but not working */
          @media print {
            body {
              width: 80mm !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: visible !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
              font-size: 10px !important;
              line-height: 1.1 !important;
            }
            
            .receipt-container {
              width: 74mm !important;
              margin: 0 !important;
              padding: 3mm !important;
            }
            
            /* Ensure only one copy prints */
            @page {
              size: 80mm auto !important;
              margin: 0mm !important;
              margin-left: 0mm !important;
              margin-right: 0mm !important;
              margin-top: 0mm !important;
              margin-bottom: 0mm !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">${content}</div>
        <script>
          window.addEventListener('DOMContentLoaded', function() {
            // Wait for the content to be fully loaded before focusing and printing
            setTimeout(function() {
              window.parent.postMessage('print-complete', '*');
            }, 2000);
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yrsa:wght@400;600;700&display=swap">
        <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
        <style>
          @page {
            size: 100mm 16mm landscape !important;
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
            height: 16mm !important;
            max-width: 100mm !important;
            max-height: 16mm !important;
            overflow: hidden !important;
            font-family: 'Yrsa', serif !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            transform-origin: top left !important;
          }
          
          .label-container {
            width: 100mm !important;
            height: 16mm !important;
            display: flex !important;
            flex-direction: row !important;
            justify-content: flex-start !important;
            align-items: center !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            position: relative !important;
          }
          
          .left-section {
            width: 35mm !important;
            height: 16mm !important;
            padding: 1mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            align-items: center !important;
            border-right: 0.5px solid #ccc !important;
            box-sizing: border-box !important;
          }
          
          .right-section {
            width: 35mm !important;
            height: 16mm !important;
            padding: 1mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
            /* Account for 30mm unprintable tail - safe zone */
            margin-right: 30mm !important;
            overflow: hidden !important;
          }
          
          .brand-name {
            font-weight: bold !important;
            font-size: 8pt !important;
            margin-bottom: 0.5mm !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: normal !important;
            max-width: 100% !important;
            line-height: 1.1 !important;
            max-height: 4mm !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
          }
          
          .detail-info {
            font-size: 7pt !important;
            font-weight: bold !important;
            margin-bottom: 0.25mm !important;
            line-height: 1.1 !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
          }
          
          .price {
            font-weight: bold !important;
            font-size: 12pt !important;
            margin-top: 0.5mm !important;
            color: #000000 !important;
          }
          
          .store-logo {
            display: flex !important;
            justify-content: center !important;
            width: 100% !important;
            margin-bottom: 1mm !important;
          }
          
          .store-logo img {
            max-height: 5mm !important;
            width: auto !important;
          }
          
          .qr-code {
            display: flex !important;
            justify-content: center !important;
            margin-bottom: 1mm !important;
          }
          
          .qr-code img, .qr-code canvas, .qr-code svg {
            height: 9mm !important;
            width: 9mm !important;
          }
          
          /* Fix for print dialog appearing but not working */
          @media print {
            html {
              width: 100mm !important;
              height: 16mm !important;
              overflow: hidden !important;
            }
            
            body {
              width: 100mm !important;
              height: 16mm !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            /* Ensure only one label prints per page */
            @page {
              size: 100mm 16mm landscape !important;
              margin: 0mm !important;
              margin-left: 0mm !important;
              margin-right: 0mm !important;
              margin-top: 0mm !important;
              margin-bottom: 0mm !important;
            }
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.addEventListener('DOMContentLoaded', function() {
            // Force landscape orientation
            if (window.matchMedia) {
              const mediaQueryList = window.matchMedia('print');
              mediaQueryList.addListener(function(mql) {
                if (mql.matches) {
                  document.body.style.width = '100mm';
                  document.body.style.height = '16mm';
                }
              });
            }
            
            // Wait for the content to be fully loaded before notifying completion
            setTimeout(function() {
              window.parent.postMessage('print-complete', '*');
            }, 1000);
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
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-size: 10px !important;
            line-height: 1.1 !important;
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
            width: 74mm;
            padding: 3mm;
            margin: 0;
            page-break-after: always;
            page-break-inside: avoid;
          }
          
          /* Additional styles for RX */
          .rx-header {
            text-align: center;
            margin-bottom: 3mm;
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
            margin: 2mm 0;
          }
          
          .rx-section {
            margin-bottom: 3mm;
          }
          
          .rx-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .rx-table td, .rx-table th {
            border: 1px solid #000;
            padding: 1mm;
            font-size: 8pt;
          }
          
          /* Compact styles */
          h1, h2, h3, p {
            margin: 1px 0 !important;
          }
          
          /* Fix for print dialog */
          @media print {
            body {
              width: 80mm !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              font-size: 10px !important;
            }
            
            .rx-container {
              width: 74mm !important;
              margin: 0 !important;
              padding: 3mm !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="rx-container">${content}</div>
        <script>
          window.addEventListener('DOMContentLoaded', function() {
            // Wait for the content to be fully loaded before notifying completion
            setTimeout(function() {
              window.parent.postMessage('print-complete', '*');
            }, 1000);
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
            margin: 0 !important;
            padding: 0 !important;
            width: 80mm !important;
            font-family: 'Yrsa', serif !important;
            direction: initial !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-size: 12px !important;
            line-height: 1.2 !important;
          }
          
          /* Ensure Arabic displays correctly */
          [dir="rtl"] {
            direction: rtl !important;
            text-align: right !important;
            font-family: 'Zain', sans-serif !important;
          }
          
          .arabic {
            font-family: 'Zain', sans-serif !important;
            direction: rtl !important;
            text-align: right !important;
          }
          
          /* Force single page printing */
          html, body {
            height: auto !important;
            width: 80mm !important;
          }
          
          /* Ensure content is properly contained */
          .workorder-container {
            width: 76mm !important;
            padding: 2mm !important;
            margin: 0 !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
          }
          
          /* WorkOrder specific styles */
          .order-header {
            text-align: center !important;
            margin-bottom: 3mm !important;
          }
          
          .order-logo {
            max-width: 60mm !important;
            max-height: 10mm !important;
            margin: 0 auto !important;
            display: block !important;
          }
          
          .order-title {
            font-size: 16pt !important;
            font-weight: bold !important;
            margin: 2mm 0 !important;
            text-align: center !important;
          }
          
          .order-section {
            margin-bottom: 3mm !important;
          }
          
          .order-field {
            display: flex !important;
            justify-content: space-between !important;
            margin-bottom: 1mm !important;
            font-size: 11pt !important;
          }
          
          .order-label {
            font-weight: bold !important;
            min-width: 30mm !important;
          }
          
          .order-value {
            flex: 1 !important;
          }
          
          .order-divider {
            border-top: 1px dashed #000 !important;
            margin: 2mm 0 !important;
          }
          
          .order-signature {
            margin-top: 4mm !important;
            text-align: center !important;
            font-size: 10pt !important;
          }
          
          .section-heading {
            font-size: 12pt !important;
            font-weight: bold !important;
            margin: 4mm 0 2mm 0 !important;
            border-bottom: 0.3mm solid #000 !important;
            padding-bottom: 1mm !important;
          }
          
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            direction: ltr !important;
          }
          
          td, th {
            border: 0.2mm solid black !important;
            padding: 1mm !important;
            text-align: center !important;
            font-size: 10pt !important;
          }
          
          th {
            font-weight: bold !important;
            background-color: #f0f0f0 !important;
          }
          
          /* Compact styles */
          h1, h2, h3, p {
            margin: 1mm 0 !important;
          }
          
          /* Fix for print dialog */
          @media print {
            body {
              width: 80mm !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: visible !important;
              font-size: 12px !important;
              line-height: 1.2 !important;
            }
            
            .workorder-container {
              width: 76mm !important;
              margin: 0 !important;
              padding: 2mm !important;
            }
            
            /* Ensure only one copy prints */
            @page {
              size: 80mm auto !important;
              margin: 0mm !important;
              margin-left: 0mm !important;
              margin-right: 0mm !important;
              margin-top: 0mm !important;
              margin-bottom: 0mm !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="workorder-container">${content}</div>
        <script>
          window.addEventListener('DOMContentLoaded', function() {
            // Wait for the content to be fully loaded before notifying completion
            setTimeout(function() {
              window.parent.postMessage('print-complete', '*');
            }, 1000);
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
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
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
            direction: rtl !important;
            text-align: right !important;
            font-family: 'Zain', sans-serif !important;
          }
          
          .arabic {
            font-family: 'Zain', sans-serif !important;
            direction: rtl !important;
            text-align: right !important;
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
          window.addEventListener('DOMContentLoaded', function() {
            // Wait for the content to be fully loaded before notifying completion
            setTimeout(function() {
              window.parent.postMessage('print-complete', '*');
            }, 1000);
          });
        </script>
      </body>
      </html>
    `;
  },
  
  /**
   * Prepares HTML for report printing (thermal printer, 80mm width)
   * @param content HTML content to print
   * @param title Report title
   * @returns Complete HTML document
   */
  prepareReportDocument: (content: string, title: string = 'Report') => {
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
            margin: 0 !important;
            padding: 0 !important;
            width: 80mm !important;
            font-family: 'Yrsa', serif !important;
            direction: initial !important;
            font-size: 12px !important;
            line-height: 1.3 !important;
          }
          
          /* Ensure Arabic displays correctly */
          [dir="rtl"] {
            direction: rtl !important;
            text-align: right !important;
            font-family: 'Zain', sans-serif !important;
          }
          
          .arabic {
            font-family: 'Zain', sans-serif !important;
            direction: rtl !important;
            text-align: right !important;
          }
          
          /* Force single page printing */
          html, body {
            height: auto !important;
            width: 80mm !important;
          }
          
          /* Ensure content is properly contained */
          .report-container {
            width: 72mm !important;
            padding: 4mm !important;
            margin: 0 !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
          }
          
          .store-logo {
            text-align: center !important;
            margin-bottom: 3mm !important;
          }
          
          .store-logo img {
            max-width: 50mm !important;
            max-height: 15mm !important;
          }
          
          .store-info {
            text-align: center !important;
            margin-bottom: 3mm !important;
            font-size: 11px !important;
          }
          
          .store-info p {
            margin: 1mm 0 !important;
          }
          
          .report-header {
            text-align: center !important;
            margin-bottom: 4mm !important;
            padding-bottom: 3mm !important;
            border-bottom: 0.5mm dashed #000 !important;
          }
          
          .report-title {
            font-size: 16pt !important;
            font-weight: bold !important;
            margin: 0 0 2mm 0 !important;
          }
          
          .report-date {
            font-size: 10pt !important;
            margin: 0 !important;
          }
          
          .summary-section {
            margin-bottom: 4mm !important;
          }
          
          .section-title {
            font-size: 12pt !important;
            font-weight: bold !important;
            margin: 0 0 2mm 0 !important;
            padding-bottom: 1mm !important;
            border-bottom: 0.3mm solid #ccc !important;
          }
          
          .summary-item {
            margin-bottom: 2mm !important;
          }
          
          .summary-item-row {
            display: flex !important;
            justify-content: space-between !important;
            margin-bottom: 1mm !important;
            padding: 1mm 2mm !important;
          }
          
          .summary-item-title {
            font-size: 10pt !important;
            font-weight: normal !important;
          }
          
          .summary-item-value {
            font-size: 11pt !important;
            font-weight: bold !important;
          }
          
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-top: 2mm !important;
            font-size: 9pt !important;
          }
          
          th, td {
            border: 0.2mm solid black !important;
            padding: 1.5mm !important;
            text-align: center !important;
          }
          
          th {
            font-weight: bold !important;
            background-color: #f0f0f0 !important;
          }
          
          .footer {
            margin-top: 4mm !important;
            padding-top: 3mm !important;
            border-top: 0.5mm dashed #000 !important;
            text-align: center !important;
            font-size: 9pt !important;
          }
          
          .divider {
            border-top: 0.3mm dashed #aaa !important;
            margin: 3mm 0 !important;
          }
          
          /* Fix for print dialog appearing but not working */
          @media print {
            body {
              width: 80mm !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: visible !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
              font-size: 12px !important;
              line-height: 1.3 !important;
            }
            
            .report-container {
              width: 72mm !important;
              margin: 0 !important;
              padding: 4mm !important;
            }
            
            /* Ensure only one copy prints */
            @page {
              size: 80mm auto !important;
              margin: 0mm !important;
              margin-left: 0mm !important;
              margin-right: 0mm !important;
              margin-top: 0mm !important;
              margin-bottom: 0mm !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-container">${content}</div>
        <script>
          window.addEventListener('DOMContentLoaded', function() {
            // Wait for the content to be fully loaded before focusing and printing
            setTimeout(function() {
              window.parent.postMessage('print-complete', '*');
            }, 2000);
          });
        </script>
      </body>
      </html>
    `;
  },
  
  /**
   * Print a report using the thermal printer format
   * @param reportContent HTML content to print
   * @param title Report title
   * @param onComplete Callback after printing
   */
  printReport: (
    reportContent: string,
    title: string = 'Daily Sales Report',
    onComplete?: () => void
  ) => {
    const htmlContent = PrintService.prepareReportDocument(reportContent, title);
    PrintService.printHtml(htmlContent, 'receipt', onComplete);
  }
};
