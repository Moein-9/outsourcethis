
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
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Failed to open print window');
    return;
  }
  
  // Add necessary styles for printing
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      font-family: ${isRtl ? 'Cairo' : 'Arial'}, sans-serif;
      background-color: white;
      width: 100%;
      height: 100%;
    }
    
    .print-container {
      width: 100%;
      max-width: 210mm;
      margin: 0 auto;
      padding: 10mm;
      background-color: white;
      box-sizing: border-box;
    }
    
    .rx-content {
      width: 80mm;
      margin: 0 auto;
      background-color: white;
      padding: 5mm;
      border: 1px solid #eee;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    @media print {
      @page {
        size: A4;
        margin: 0;
      }
      
      body {
        margin: 0;
        padding: 0;
      }
      
      .print-container {
        width: 100%;
        height: 100%;
        padding: 10mm;
        margin: 0;
        box-shadow: none;
        border: none;
      }
      
      .rx-content {
        width: 80mm;
        margin: 0 auto;
        box-shadow: none;
        border: none;
      }
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    
    th, td {
      border: 1px solid #ccc;
      padding: 4px;
      text-align: center;
    }
    
    th {
      background-color: #f5f5f5;
    }
  `;
  printWindow.document.head.appendChild(style);
  
  // Add title
  const title = document.createElement('title');
  title.textContent = t("glassesPrescription");
  printWindow.document.head.appendChild(title);
  
  // Create container
  const container = document.createElement('div');
  container.className = 'print-container';
  printWindow.document.body.appendChild(container);
  
  // Create content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'rx-content';
  container.appendChild(contentWrapper);
  
  // Add HTML content
  const htmlContent = `
    <div dir="${isRtl ? 'rtl' : 'ltr'}" style="text-align: ${isRtl ? 'right' : 'left'};">
      <div style="text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 10px;">
        <h1 style="font-size: 16px; font-weight: bold; margin: 5px 0;">${storeInfo.name}</h1>
        <p style="font-size: 12px; margin: 2px 0;">${storeInfo.address}</p>
        <p style="font-size: 12px; margin: 2px 0;">${t("phone")}: ${storeInfo.phone}</p>
      </div>

      <div style="margin-bottom: 15px; font-size: 12px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px; border-bottom: 1px solid #eee; padding-bottom: 3px;">
          <span style="font-weight: bold;">${t("date")}:</span>
          <span>${format(new Date(), 'dd/MM/yyyy HH:mm')}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px; border-bottom: 1px solid #eee; padding-bottom: 3px;">
          <span style="font-weight: bold;">${t("patient")}:</span>
          <span>${patientName}</span>
        </div>
        ${patientPhone ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px; border-bottom: 1px solid #eee; padding-bottom: 3px;">
          <span style="font-weight: bold;">${t("phone")}:</span>
          <span>${patientPhone}</span>
        </div>
        ` : ''}
      </div>

      <div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 10px 0; margin-bottom: 15px;">
        <div style="text-align: center; margin-bottom: 10px; font-weight: bold; font-size: 12px; text-transform: uppercase;">
          ${t("glassesPrescription")}
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr>
              <th style="border: 1px solid #ccc; padding: 4px; text-align: center;"></th>
              <th style="border: 1px solid #ccc; padding: 4px; text-align: center;">SPH</th>
              <th style="border: 1px solid #ccc; padding: 4px; text-align: center;">CYL</th>
              <th style="border: 1px solid #ccc; padding: 4px; text-align: center;">AXIS</th>
              <th style="border: 1px solid #ccc; padding: 4px; text-align: center;">ADD</th>
              <th style="border: 1px solid #ccc; padding: 4px; text-align: center;">PD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ccc; padding: 4px; font-weight: bold; text-align: center;">${t("rightEye")} (OD)</td>
              <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">${rx.sphereOD}</td>
              <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">${rx.cylOD}</td>
              <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">${rx.axisOD}</td>
              <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">${rx.addOD}</td>
              <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">${rx.pdRight || "-"}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 4px; font-weight: bold; text-align: center;">${t("leftEye")} (OS)</td>
              <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">${rx.sphereOS}</td>
              <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">${rx.cylOS}</td>
              <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">${rx.axisOS}</td>
              <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">${rx.addOS}</td>
              <td style="border: 1px solid #ccc; padding: 4px; text-align: center;">${rx.pdLeft || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      ${notes ? `
      <div style="margin-bottom: 15px; font-size: 12px;">
        <div style="font-weight: bold; margin-bottom: 5px;">${t("notes")}:</div>
        <p style="font-size: 11px;">${notes}</p>
      </div>
      ` : ''}

      <div style="margin-bottom: 15px; font-size: 12px;">
        <div style="font-weight: bold; text-align: center; margin-bottom: 5px; border-bottom: 1px solid #eee; padding-bottom: 3px;">
          ${t("glassesCareTips")}
        </div>
        <ul style="padding-left: ${isRtl ? '0' : '20px'}; padding-right: ${isRtl ? '20px' : '0'}; margin: 5px 0;">
          <li style="margin-bottom: 3px;">${t("tip1")}</li>
          <li style="margin-bottom: 3px;">${t("tip2")}</li>
          <li style="margin-bottom: 3px;">${t("tip3")}</li>
          <li style="margin-bottom: 3px;">${t("tip4")}</li>
        </ul>
      </div>

      <div style="text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid #ccc;">
        <p style="font-weight: bold; font-size: 12px;">${t("thankYou")}</p>
      </div>
    </div>
  `;
  
  contentWrapper.innerHTML = htmlContent;
  
  // Add print script
  const script = document.createElement('script');
  script.innerHTML = `
    // Wait for content and images to load
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 500);
    };
  `;
  printWindow.document.body.appendChild(script);
};

