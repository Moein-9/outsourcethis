
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
            size: 80mm auto;
            margin: 0;
          }
          body {
            width: 80mm;
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            font-size: 10pt;
          }
          .print-receipt {
            width: 80mm;
            padding: 2mm;
            box-sizing: border-box;
            page-break-after: always;
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
