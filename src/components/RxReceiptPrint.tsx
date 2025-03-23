
import React from "react";
import { format } from "date-fns";
import { RxData } from "@/store/patientStore";
import { Eye } from "lucide-react";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { toast } from "@/hooks/use-toast";

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

// COMPLETELY REWRITTEN PRINTING FUNCTION
export const printRxReceipt = (props: RxReceiptPrintProps) => {
  const { patientName, patientPhone, rx, notes, forcedLanguage } = props;
  const { language: appLanguage, t } = useLanguageStore.getState();
  const language = forcedLanguage || appLanguage;
  const isRtl = language === 'ar';
  
  console.log("Preparing to print RX receipt", { language, isRtl });
  
  try {
    // Direct HTML printing without using any external services
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${t("glassesPrescription")}</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 8px;
            width: 80mm;
            font-family: ${isRtl ? 'sans-serif' : 'serif'};
            font-size: 12px;
            direction: ${isRtl ? 'rtl' : 'ltr'};
            text-align: ${isRtl ? 'right' : 'left'};
          }
          .header {
            text-align: center;
            border-bottom: 1px solid #ddd;
            padding-bottom: 8px;
            margin-bottom: 8px;
          }
          .logo {
            text-align: center;
            margin-bottom: 8px;
            font-size: 20px;
            font-weight: bold;
          }
          .store-name {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 4px;
          }
          .store-info {
            font-size: 12px;
            color: #666;
          }
          .patient-info {
            margin-bottom: 12px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #eee;
            padding-bottom: 4px;
            margin-bottom: 4px;
            font-size: 12px;
          }
          .info-label {
            font-weight: bold;
          }
          .rx-section {
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            padding: 8px 0;
            margin-bottom: 8px;
          }
          .rx-title {
            text-align: center;
            margin-bottom: 8px;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            direction: ltr;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 4px;
            font-size: 10px;
            text-align: center;
          }
          th {
            background-color: #f5f5f5;
          }
          .eye-row {
            font-weight: 500;
          }
          .notes {
            margin-bottom: 8px;
            font-size: 11px;
          }
          .notes-title {
            font-weight: bold;
            margin-bottom: 4px;
          }
          .notes-content {
            font-size: 10px;
          }
          .care-tips {
            margin-bottom: 8px;
            font-size: 10px;
          }
          .care-title {
            text-align: center;
            font-weight: bold;
            border-bottom: 1px solid #eee;
            padding-bottom: 4px;
            margin-bottom: 4px;
          }
          .tips-list {
            list-style-type: disc;
            padding-left: ${isRtl ? '0' : '20px'};
            padding-right: ${isRtl ? '20px' : '0'};
            margin: 4px 0;
          }
          .tip-item {
            margin-bottom: 2px;
          }
          .footer {
            text-align: center;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #ddd;
          }
          .thank-you {
            font-weight: bold;
            font-size: 12px;
          }
          .dots {
            margin-top: 8px;
            font-size: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">${storeInfo.name}</div>
          <div class="store-info">${storeInfo.address}</div>
          <div class="store-info">${t("phone")}: ${storeInfo.phone}</div>
        </div>

        <div class="patient-info">
          <div class="info-row">
            <span class="info-label">${t("date")}:</span>
            <span>${format(new Date(), 'dd/MM/yyyy HH:mm')}</span>
          </div>
          <div class="info-row">
            <span class="info-label">${t("patient")}:</span>
            <span>${patientName}</span>
          </div>
          ${patientPhone ? `
          <div class="info-row">
            <span class="info-label">${t("phone")}:</span>
            <span>${patientPhone}</span>
          </div>
          ` : ''}
        </div>

        <div class="rx-section">
          <div class="rx-title">👁 ${t("glassesPrescription")}</div>
          
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
          <p class="notes-content">${notes}</p>
        </div>
        ` : ''}

        <div class="care-tips">
          <div class="care-title">${t("glassesCareTips")}</div>
          <ul class="tips-list">
            <li class="tip-item">${t("tip1")}</li>
            <li class="tip-item">${t("tip2")}</li>
            <li class="tip-item">${t("tip3")}</li>
            <li class="tip-item">${t("tip4")}</li>
          </ul>
        </div>

        <div class="footer">
          <p class="thank-you">${t("thankYou")}</p>
          <div class="dots">${'•'.repeat(15)}</div>
        </div>
      </body>
      </html>
    `;
    
    console.log("Generated HTML content for printing");
    
    // Direct printing approach
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      console.error("Failed to open print window - popup may be blocked");
      toast({
        title: t("error"),
        description: t("printWindowBlocked"),
        variant: "destructive"
      });
      return;
    }
    
    console.log("Print window opened successfully");
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      console.log("Print window loaded, printing in 500ms...");
      
      // Slight delay to ensure content is fully rendered
      setTimeout(() => {
        printWindow.print();
        
        // Close the window after printing
        setTimeout(() => {
          printWindow.close();
        }, 1000);
      }, 500);
    };
    
    toast({
      title: t("success"),
      description: t("printJobSent"),
    });
  } catch (error) {
    console.error('Error printing RX receipt:', error);
    toast({
      title: t("error"),
      description: t("printFailed"),
      variant: "destructive"
    });
  }
};
