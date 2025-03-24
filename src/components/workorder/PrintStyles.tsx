
import React from "react";

export const PrintStyles: React.FC = () => {
  return (
    <style>
      {`
        @media print {
          @page {
            size: 80mm auto !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          body {
            width: 80mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
          }
          
          #work-order-receipt {
            width: 76mm !important; /* 80mm - 4mm for padding */
            max-width: 76mm !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            border: none !important;
            box-shadow: none !important;
            padding: 2mm !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
          }
          
          .print-receipt * {
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          html, body {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
          }
          
          body {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .print-receipt {
            height: fit-content !important;
            min-height: fit-content !important;
            max-height: fit-content !important;
          }
          
          .print-receipt {
            break-inside: avoid !important;
            break-after: avoid-page !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
          }
          
          @supports (-webkit-appearance:none) {
            body, html, #work-order-receipt {
              height: fit-content !important;
              min-height: fit-content !important;
              max-height: fit-content !important;
            }
          }
          
          /* Ensure black backgrounds print properly */
          .bg-black {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            background-color: black !important;
            color: white !important;
          }
        }
      `}
    </style>
  );
};
