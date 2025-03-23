
import React from "react";
import { format } from "date-fns";
import { RxData } from "@/store/patientStore";
import { Eye } from "lucide-react";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { PrintService } from "@/utils/PrintService";

interface RxReceiptPrintProps {
  patientName: string;
  patientPhone?: string;
  rx: RxData;
  notes?: string;
  isPrintable?: boolean;
  forcedLanguage?: 'en' | 'ar'; // For forced language printing
}

export const RxReceiptPrint: React.FC<RxReceiptPrintProps> = ({
  patientName,
  patientPhone,
  rx,
  notes,
  isPrintable = false,
  forcedLanguage
}) => {
  const { language: appLanguage, t } = useLanguageStore();
  const language = forcedLanguage || appLanguage;
  const isRtl = language === 'ar';
  
  const containerClass = isPrintable 
    ? "w-[80mm] mx-auto bg-white p-4 text-[12px] border shadow-sm print:shadow-none" 
    : "w-full bg-white p-4 border rounded-lg shadow-sm";
  
  const dirClass = isRtl ? 'rtl text-right' : 'ltr text-left';

  return (
    <div 
      className={`${containerClass} ${dirClass}`} 
      dir={isRtl ? "rtl" : "ltr"}
      style={{ fontFamily: isRtl ? 'Zain, sans-serif' : 'Yrsa, serif' }}
    >
      <div className="text-center border-b pb-3 mb-3">
        <div className="flex justify-center mb-2">
          <MoenLogo className="w-auto h-16 mb-2" />
        </div>
        <h2 className="font-bold text-xl mb-1">{storeInfo.name}</h2>
        <p className="text-sm text-muted-foreground">{storeInfo.address}</p>
        <p className="text-sm text-muted-foreground">{t("phone")}: {storeInfo.phone}</p>
      </div>

      <div className="mb-4 text-sm">
        <div className="flex justify-between border-b pb-1 mb-1">
          <span className="font-semibold">{t("date")}:</span>
          <span>{format(new Date(), 'dd/MM/yyyy HH:mm')}</span>
        </div>
        <div className="flex justify-between border-b pb-1 mb-1">
          <span className="font-semibold">{t("patient")}:</span>
          <span>{patientName}</span>
        </div>
        {patientPhone && (
          <div className="flex justify-between border-b pb-1 mb-1">
            <span className="font-semibold">{t("phone")}:</span>
            <span>{patientPhone}</span>
          </div>
        )}
      </div>

      <div className="border-t border-b py-2 mb-3">
        <div className="text-center mb-2 font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-1">
          <Eye className="h-3 w-3" /> {t("glassesPrescription")}
        </div>
        
        <table className="w-full border-collapse mt-2 ltr">
          <thead>
            <tr>
              <th className="border border-gray-300 p-1 text-xs"></th>
              <th className="border border-gray-300 p-1 text-xs">SPH</th>
              <th className="border border-gray-300 p-1 text-xs">CYL</th>
              <th className="border border-gray-300 p-1 text-xs">AXIS</th>
              <th className="border border-gray-300 p-1 text-xs">ADD</th>
              <th className="border border-gray-300 p-1 text-xs">PD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-1 text-xs font-medium">{t("rightEye")} (OD)</td>
              <td className="border border-gray-300 p-1 text-xs">{rx.sphereOD}</td>
              <td className="border border-gray-300 p-1 text-xs">{rx.cylOD}</td>
              <td className="border border-gray-300 p-1 text-xs">{rx.axisOD}</td>
              <td className="border border-gray-300 p-1 text-xs">{rx.addOD}</td>
              <td className="border border-gray-300 p-1 text-xs">{rx.pdRight || "-"}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 text-xs font-medium">{t("leftEye")} (OS)</td>
              <td className="border border-gray-300 p-1 text-xs">{rx.sphereOS}</td>
              <td className="border border-gray-300 p-1 text-xs">{rx.cylOS}</td>
              <td className="border border-gray-300 p-1 text-xs">{rx.axisOS}</td>
              <td className="border border-gray-300 p-1 text-xs">{rx.addOS}</td>
              <td className="border border-gray-300 p-1 text-xs">{rx.pdLeft || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {notes && (
        <div className="mb-3 text-sm">
          <div className="font-semibold mb-1">{t("notes")}:</div>
          <p className="text-xs">{notes}</p>
        </div>
      )}

      <div className="space-y-2 text-xs mb-3">
        <div className="text-center font-semibold border-b pb-1 mb-1">
          {t("glassesCareTips")}
        </div>
        <ul className={`list-disc list-inside space-y-1 ${dirClass}`}>
          <li>{t("tip1")}</li>
          <li>{t("tip2")}</li>
          <li>{t("tip3")}</li>
          <li>{t("tip4")}</li>
        </ul>
      </div>

      <div className="text-center mt-3 pt-3 border-t">
        <p className="font-semibold text-sm">{t("thankYou")}</p>
        <div className="mt-3 text-[10px] flex gap-1 justify-center">
          <span>{'•'.repeat(15)}</span>
        </div>
      </div>
    </div>
  );
};

export const RxLanguageDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (language: 'en' | 'ar') => void;
}> = ({ isOpen, onClose, onSelect }) => {
  const { t } = useLanguageStore();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-auto">
        <h3 className="text-lg font-medium mb-4 text-center">{t("selectLanguageForPrinting")}</h3>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onSelect('en')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            English
          </button>
          <button
            onClick={() => onSelect('ar')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            العربية
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 w-full border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
};

export const printRxReceipt = (props: RxReceiptPrintProps) => {
  const { patientName, patientPhone, rx, notes, forcedLanguage } = props;
  const { language: appLanguage, t } = useLanguageStore.getState();
  const language = forcedLanguage || appLanguage;
  const isRtl = language === 'ar';
  
  // Create optimized HTML for 80mm thermal printer with 48 columns
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${t("glassesPrescription")}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
            font-family: ${isRtl ? 'Arial, sans-serif' : 'Arial, serif'};
            font-size: 10px;
            line-height: 1.2;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
        
        body {
          width: 80mm;
          margin: 0;
          padding: 0;
          font-family: ${isRtl ? 'Arial, sans-serif' : 'Arial, serif'};
          font-size: 10px;
          line-height: 1.2;
          background-color: white;
        }
        
        .receipt-container {
          width: 76mm;
          padding: 2mm;
          background-color: white;
        }
        
        .header {
          text-align: center;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
          margin-bottom: 5px;
        }
        
        .logo {
          max-width: 60%;
          height: auto;
          margin: 0 auto 5px auto;
          display: block;
        }
        
        .store-name {
          font-weight: bold;
          font-size: 14px;
          margin: 3px 0;
        }
        
        .store-info {
          font-size: 10px;
          margin: 2px 0;
          color: #444;
        }
        
        .patient-info {
          margin-bottom: 8px;
          font-size: 10px;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px dotted #eee;
          padding-bottom: 2px;
          margin-bottom: 2px;
        }
        
        .label {
          font-weight: bold;
        }
        
        .rx-section {
          border-top: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
          padding: 5px 0;
          margin-bottom: 6px;
        }
        
        .rx-title {
          text-align: center;
          font-weight: bold;
          font-size: 10px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
        }
        
        table th, table td {
          border: 1px solid #ccc;
          padding: 2px;
          text-align: center;
        }
        
        table th {
          background-color: #f5f5f5;
        }
        
        .eye-row td:first-child {
          font-weight: bold;
        }
        
        .notes {
          margin-bottom: 6px;
          font-size: 9px;
        }
        
        .notes-title {
          font-weight: bold;
          margin-bottom: 2px;
        }
        
        .notes-content {
          font-size: 9px;
        }
        
        .care-tips {
          margin-bottom: 6px;
        }
        
        .care-title {
          text-align: center;
          font-weight: bold;
          border-bottom: 1px dotted #ccc;
          padding-bottom: 2px;
          margin-bottom: 3px;
          font-size: 10px;
        }
        
        ul {
          padding-left: ${isRtl ? '0' : '15px'};
          padding-right: ${isRtl ? '15px' : '0'};
          margin: 3px 0;
          font-size: 9px;
        }
        
        li {
          margin-bottom: 1px;
        }
        
        .footer {
          text-align: center;
          margin-top: 6px;
          padding-top: 4px;
          border-top: 1px solid #ccc;
        }
        
        .thank-you {
          font-weight: bold;
          font-size: 10px;
        }
        
        .dots {
          margin-top: 5px;
          font-size: 8px;
          letter-spacing: 2px;
        }
        
        /* RTL Specific */
        .rtl {
          direction: rtl;
          text-align: right;
        }
        
        .ltr {
          direction: ltr;
          text-align: left;
        }
      </style>
    </head>
    <body dir="${isRtl ? 'rtl' : 'ltr'}">
      <div class="receipt-container ${isRtl ? 'rtl' : 'ltr'}">
        <div class="header">
          <svg width="150" height="45" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg" style="margin: 0 auto 5px auto; display: block;">
            <text x="150" y="40" font-family="Arial" font-size="28" font-weight="bold" text-anchor="middle" fill="#000">
              ${storeInfo.name}
            </text>
          </svg>
          <div class="store-name">${storeInfo.name}</div>
          <div class="store-info">${storeInfo.address}</div>
          <div class="store-info">${t("phone")}: ${storeInfo.phone}</div>
        </div>

        <div class="patient-info">
          <div class="info-row">
            <span class="label">${t("date")}:</span>
            <span>${format(new Date(), 'dd/MM/yyyy HH:mm')}</span>
          </div>
          <div class="info-row">
            <span class="label">${t("patient")}:</span>
            <span>${patientName}</span>
          </div>
          ${patientPhone ? `
          <div class="info-row">
            <span class="label">${t("phone")}:</span>
            <span>${patientPhone}</span>
          </div>
          ` : ''}
        </div>

        <div class="rx-section">
          <div class="rx-title">
            <span style="display: inline-block; margin-right: 3px; vertical-align: middle;">👁️</span> ${t("glassesPrescription")}
          </div>
          
          <table>
            <thead>
              <tr>
                <th></th>
                <th>SPH</th>
                <th>CYL</th>
                <th>AXIS</th>
                <th>ADD</th>
                <th>PD</th>
              </tr>
            </thead>
            <tbody>
              <tr class="eye-row">
                <td>${t("rightEye")} (OD)</td>
                <td>${rx.sphereOD || "-"}</td>
                <td>${rx.cylOD || "-"}</td>
                <td>${rx.axisOD || "-"}</td>
                <td>${rx.addOD || "-"}</td>
                <td>${rx.pdRight || "-"}</td>
              </tr>
              <tr class="eye-row">
                <td>${t("leftEye")} (OS)</td>
                <td>${rx.sphereOS || "-"}</td>
                <td>${rx.cylOS || "-"}</td>
                <td>${rx.axisOS || "-"}</td>
                <td>${rx.addOS || "-"}</td>
                <td>${rx.pdLeft || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        ${notes ? `
        <div class="notes">
          <div class="notes-title">${t("notes")}:</div>
          <div class="notes-content">${notes}</div>
        </div>
        ` : ''}

        <div class="care-tips">
          <div class="care-title">
            ${t("glassesCareTips")}
          </div>
          <ul>
            <li>${t("tip1")}</li>
            <li>${t("tip2")}</li>
            <li>${t("tip3")}</li>
            <li>${t("tip4")}</li>
          </ul>
        </div>

        <div class="footer">
          <div class="thank-you">${t("thankYou")}</div>
          <div class="dots">• • • • • • • • • • • • • • •</div>
        </div>
      </div>

      <script>
        // Force the print dialog to open immediately
        window.onload = function() {
          setTimeout(function() {
            window.print();
            setTimeout(function() {
              window.parent.postMessage('print-complete', '*');
            }, 500);
          }, 200);
        };
      </script>
    </body>
    </html>
  `;
  
  try {
    // Use direct printing instead of preparing through PrintService to ensure proper content display
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.visibility = 'hidden';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    printFrame.style.left = '0';
    printFrame.style.top = '0';
    printFrame.className = 'print-frame';
    document.body.appendChild(printFrame);
    
    if (printFrame.contentWindow) {
      printFrame.contentWindow.document.open();
      printFrame.contentWindow.document.write(htmlContent);
      printFrame.contentWindow.document.close();
      
      printFrame.onload = function() {
        setTimeout(() => {
          if (printFrame.contentWindow) {
            printFrame.contentWindow.focus();
            try {
              printFrame.contentWindow.print();
              
              // Set a timeout to remove the frame after printing
              setTimeout(() => {
                if (document.body.contains(printFrame)) {
                  document.body.removeChild(printFrame);
                }
              }, 2000);
            } catch (printError) {
              console.error('Print error:', printError);
              document.body.removeChild(printFrame);
            }
          }
        }, 300);
      };
    } else {
      document.body.removeChild(printFrame);
      console.error('Could not access print frame content window');
    }
  } catch (error) {
    console.error('Error printing RX receipt:', error);
  }
};
