
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
  
  console.log("Starting to print RX receipt:", {
    patientName,
    language,
    isRtl,
    rx
  });
  
  // Create a complete standalone HTML document for printing
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${t("glassesPrescription")}</title>
      <style>
        @page {
          size: 80mm auto !important;
          margin: 0mm !important;
        }
        body {
          font-family: ${isRtl ? "'Arial', sans-serif" : "'Times New Roman', serif"};
          margin: 0;
          padding: 0;
          width: 80mm;
          direction: ${isRtl ? 'rtl' : 'ltr'};
          background-color: #ffffff;
        }
        .container {
          padding: 5mm;
          text-align: ${isRtl ? 'right' : 'left'};
        }
        .header {
          text-align: center;
          border-bottom: 1px solid #ccc;
          padding-bottom: 3mm;
          margin-bottom: 3mm;
        }
        .store-name {
          font-weight: bold;
          font-size: 14pt;
          margin: 3mm 0;
        }
        .info {
          font-size: 9pt;
          margin: 1mm 0;
          color: #555;
        }
        .section {
          margin-bottom: 4mm;
          font-size: 10pt;
        }
        .field {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #eee;
          padding-bottom: 1mm;
          margin-bottom: 1mm;
        }
        .field-label {
          font-weight: bold;
        }
        .table-container {
          margin: 3mm 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          direction: ltr; /* Tables are always LTR for clarity */
        }
        table th, table td {
          border: 1px solid #ccc;
          padding: 1mm;
          text-align: center;
          font-size: 8pt;
        }
        table th {
          background-color: #f0f0f0;
        }
        .prescription-title {
          text-align: center;
          font-weight: bold;
          margin: 2mm 0;
          font-size: 10pt;
          text-transform: uppercase;
          border-bottom: 1px solid #eee;
          padding-bottom: 1mm;
        }
        .notes {
          margin: 3mm 0;
          font-size: 9pt;
        }
        .notes-title {
          font-weight: bold;
          margin-bottom: 1mm;
        }
        .tips {
          margin: 3mm 0;
          font-size: 9pt;
        }
        .tips-title {
          text-align: center;
          font-weight: bold;
          border-bottom: 1px solid #eee;
          padding-bottom: 1mm;
          margin-bottom: 2mm;
        }
        .tips-list {
          padding-left: ${isRtl ? '0' : '15px'};
          padding-right: ${isRtl ? '15px' : '0'};
          margin: 0;
        }
        .tips-list li {
          margin-bottom: 1mm;
        }
        .footer {
          text-align: center;
          margin-top: 3mm;
          padding-top: 3mm;
          border-top: 1px solid #ccc;
          font-size: 9pt;
        }
        .thank-you {
          font-weight: bold;
          margin-bottom: 2mm;
        }
        .dots {
          letter-spacing: 2px;
          color: #aaa;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="store-name">${storeInfo.name}</div>
          <div class="info">${storeInfo.address}</div>
          <div class="info">${t("phone")}: ${storeInfo.phone}</div>
        </div>
        
        <div class="section">
          <div class="field">
            <span class="field-label">${t("date")}:</span>
            <span>${format(new Date(), 'dd/MM/yyyy HH:mm')}</span>
          </div>
          <div class="field">
            <span class="field-label">${t("patient")}:</span>
            <span>${patientName}</span>
          </div>
          ${patientPhone ? `
          <div class="field">
            <span class="field-label">${t("phone")}:</span>
            <span>${patientPhone}</span>
          </div>
          ` : ''}
        </div>
        
        <div class="prescription-title">
          ${t("glassesPrescription")}
        </div>
        
        <div class="table-container">
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
              <tr>
                <td style="font-weight: bold;">${t("rightEye")} (OD)</td>
                <td>${rx.sphereOD || "-"}</td>
                <td>${rx.cylOD || "-"}</td>
                <td>${rx.axisOD || "-"}</td>
                <td>${rx.addOD || "-"}</td>
                <td>${rx.pdRight || "-"}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">${t("leftEye")} (OS)</td>
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
          <div>${notes}</div>
        </div>
        ` : ''}
        
        <div class="tips">
          <div class="tips-title">${t("glassesCareTips")}</div>
          <ul class="tips-list">
            <li>${t("tip1")}</li>
            <li>${t("tip2")}</li>
            <li>${t("tip3")}</li>
            <li>${t("tip4")}</li>
          </ul>
        </div>
        
        <div class="footer">
          <div class="thank-you">${t("thankYou")}</div>
          <div class="dots">•••••••••••••••</div>
        </div>
      </div>
      
      <script>
        // Print immediately when loaded
        window.onload = function() {
          console.log("Document loaded, printing...");
          setTimeout(function() {
            window.print();
            console.log("Print command executed");
          }, 500);
        };
      </script>
    </body>
    </html>
  `;
  
  console.log("HTML content generated for printing", htmlContent.substring(0, 200) + "...");
  
  try {
    // Create a new window with the content for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      console.error("Failed to open print window - popup might be blocked");
      alert(t("printWindowBlocked"));
      return;
    }
    
    // Write the HTML content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Log success
    console.log("Print window created and populated with content");
    
    // Focus the window to bring it to front
    printWindow.focus();
    
    // Also print directly in case onload doesn't fire
    setTimeout(() => {
      try {
        console.log("Triggering print via timeout");
        printWindow.print();
      } catch (error) {
        console.error("Error during delayed print:", error);
      }
    }, 1000);
  } catch (error) {
    console.error("Error during prescription printing:", error);
    alert(t("printError"));
  }
};
