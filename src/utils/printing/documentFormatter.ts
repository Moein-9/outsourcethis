/**
 * Prepares an HTML document for printing thermal receipts with proper styling
 */
export const prepareReceiptDocument = (content: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Print Receipt</title>
      <style>
        @media print {
          @page {
            size: 80mm auto !important;
            margin: 0 !important;
          }
          body {
            width: 80mm !important;
            margin: 0 !important;
            padding: 0 !important;
            font-family: 'Arial', sans-serif !important;
            font-size: 10pt !important;
            page-break-inside: avoid !important;
            page-break-after: always !important;
          }
          .print-receipt {
            width: 80mm !important;
            padding: 2mm !important;
            box-sizing: border-box !important;
            page-break-after: always !important;
          }
          .hide-print {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;
};

/**
 * Prepares an HTML document for printing work order thermal receipts with proper styling
 */
export const prepareWorkOrderDocument = (content: string, title: string = 'Work Order') => {
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
          margin: 0 !important;
        }
        
        body {
          margin: 0 !important;
          padding: 0 !important;
          width: 80mm !important;
          font-family: 'Arial', sans-serif !important;
          font-size: 10px !important;
          line-height: 1.1 !important;
          page-break-inside: avoid !important;
          page-break-after: always !important;
        }
        
        /* RTL support */
        [dir="rtl"] {
          direction: rtl !important;
          text-align: right !important;
          font-family: 'Arial', sans-serif !important;
        }
        
        /* Ensure content is properly contained */
        .receipt-container {
          width: 76mm !important;
          padding: 2mm !important;
          margin: 0 !important;
          page-break-inside: avoid !important;
          page-break-after: always !important;
        }
        
        /* Compact elements */
        h1, h2, h3, p {
          margin: 0.5mm 0 !important;
        }
        
        /* Reduce spacing between elements */
        div {
          margin-bottom: 1mm !important;
        }
        
        /* Table styles */
        table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 1mm 0 !important;
        }
        
        td, th {
          border: 0.5px solid #000 !important;
          padding: 1px 2px !important;
          font-size: 9px !important;
          text-align: center !important;
        }
        
        /* General text styles */
        .mb-0 { margin-bottom: 0 !important; }
        .mb-0.5 { margin-bottom: 0.5mm !important; }
        .mb-1 { margin-bottom: 1mm !important; }
        .mb-2 { margin-bottom: 2mm !important; }
        .mt-3 { margin-top: 3mm !important; }
        .pt-1 { padding-top: 1mm !important; }
        .py-1 { padding-top: 1mm !important; padding-bottom: 1mm !important; }
        .font-bold { font-weight: bold !important; }
        .border-t { border-top: 0.5px solid #000 !important; }
        .border-b { border-bottom: 0.5px solid #000 !important; }
        .text-center { text-align: center !important; }
        .text-sm { font-size: 10px !important; }
        .text-xs { font-size: 8px !important; }
        .text-lg { font-size: 12px !important; }
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
        
        // Backup in case DOMContentLoaded doesn't fire properly
        setTimeout(function() {
          window.focus();
          window.print();
          setTimeout(function() {
            window.parent.postMessage('print-complete', '*');
          }, 500);
        }, 1000);
      </script>
    </body>
    </html>
  `;
};

/**
 * Prepares an HTML document for printing receipts with proper styling
 */
export const prepareLabelDocument = (content: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Print Label</title>
      <style>
        @media print {
          @page {
            size: 58mm 40mm;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }
          .label-container {
            display: flex;
            width: 58mm;
            height: 40mm;
            padding: 2mm;
            box-sizing: border-box;
            page-break-after: always;
          }
          .left-section {
            width: 40%;
            padding-right: 2mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .right-section {
            width: 60%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .store-logo {
            width: 100%;
            margin-bottom: 2mm;
          }
          .store-logo img {
            width: 100%;
            height: auto;
          }
          .qr-code {
            width: 100%;
          }
          .brand-name {
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 2mm;
          }
          .detail-info {
            font-size: 9pt;
            margin-bottom: 1mm;
          }
          .price {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 2mm;
          }
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;
};

/**
 * Prepares an HTML document for printing A4 format with proper styling
 */
export const prepareA4Document = (content: string, title: string = 'Print Document') => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.5;
            color: #000;
          }
          h1, h2, h3 {
            margin-top: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table th, table td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          .hide-print {
            display: none !important;
          }
          .page-break {
            page-break-after: always;
          }
          .print-only {
            display: block;
          }
        }
        
        .print-only {
          display: none;
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;
};
