
import React from "react";
import { format } from "date-fns";
import { RxData } from "@/store/patientStore";
import { Eye } from "lucide-react";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { PrintService } from "@/utils/PrintService";
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

export const printRxReceipt = (props: RxReceiptPrintProps) => {
  const { patientName, patientPhone, rx, notes, forcedLanguage } = props;
  const { language: appLanguage, t } = useLanguageStore.getState();
  const language = forcedLanguage || appLanguage;
  const isRtl = language === 'ar';
  
  try {
    console.log("Preparing to print RX receipt");
    
    const logoSvg = `<div style="text-align: center; margin-bottom: 10px;">
      <svg width="100" height="40" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 30 L160 30 L160 50 L40 50 Z" fill="#3B82F6" />
        <text x="100" y="45" text-anchor="middle" font-family="Arial" font-size="16" fill="white">
          ${storeInfo.name}
        </text>
      </svg>
    </div>`;
    
    const htmlContent = `
      <div class="${isRtl ? 'rtl' : 'ltr'}" style="
        font-family: ${isRtl ? 'Zain, Arial, sans-serif' : 'Yrsa, serif'};
        direction: ${isRtl ? 'rtl' : 'ltr'};
        text-align: ${isRtl ? 'right' : 'left'};
        width: 74mm;
        padding: 3mm;
      ">
        <div style="text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 8px; margin-bottom: 8px;">
          ${logoSvg}
          <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${storeInfo.name}</div>
          <div style="font-size: 12px; color: #666;">${storeInfo.address}</div>
          <div style="font-size: 12px; color: #666;">${t("phone")}: ${storeInfo.phone}</div>
        </div>

        <div style="margin-bottom: 12px; font-size: 12px;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 4px; margin-bottom: 4px;">
            <span style="font-weight: bold;">${t("date")}:</span>
            <span>${format(new Date(), 'dd/MM/yyyy HH:mm')}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 4px; margin-bottom: 4px;">
            <span style="font-weight: bold;">${t("patient")}:</span>
            <span>${patientName}</span>
          </div>
          ${patientPhone ? `
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 4px; margin-bottom: 4px;">
            <span style="font-weight: bold;">${t("phone")}:</span>
            <span>${patientPhone}</span>
          </div>
          ` : ''}
        </div>

        <div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 8px 0; margin-bottom: 8px;">
          <div style="text-align: center; margin-bottom: 6px; font-weight: bold; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">
            👁 ${t("glassesPrescription")}
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 6px; direction: ltr;">
            <thead>
              <tr>
                <th style="border: 1px solid #ccc; padding: 4px; font-size: 10px;"></th>
                <th style="border: 1px solid #ccc; padding: 4px; font-size: 10px;">SPH</th>
                <th style="border: 1px solid #ccc; padding: 4px; font-size: 10px;">CYL</th>
                <th style="border: 1px solid #ccc; padding: 4px; font-size: 10px;">AXIS</th>
                <th style="border: 1px solid #ccc; padding: 4px; font-size: 10px;">ADD</th>
                <th style="border: 1px solid #ccc; padding: 4px; font-size: 10px;">PD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #ccc; padding: 4px; font-size: 10px; font-weight: 500; background-color: #f0f7ff;">${t("rightEye")} (OD)</td>
                <td style="border: 1px solid #ccc; padding: 4px; font-size: 10px;">${rx.sphereOD || "-"}</td>
                <td style="border: 1px solid #ccc; padding: 4px; font-size: 10px;">${rx.cylOD || "-"}</td>
                <td style="border: 1px solid #ccc; padding: 4px; font-size: 10px;">${rx.axisOD || "-"}</td>
                <td style="border: 1px solid #ccc; padding: 4px; font-size: 10px;">${rx.addOD || "-"}</td>
                <td style="border: 1px solid #ccc; padding: 4px; font-size: 10px;">${rx.pdRight || "-"}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ccc; padding: 4px; font-size: 10px; font-weight: 500; background-color: #fff0f3;">${t("leftEye")} (OS)</td>
                <td style="border: 1px solid #ccc; padding: 4px; font-size: 10px;">${rx.sphereOS || "-"}</td>
                <td style="border: 1px solid #ccc; padding: 4px; font-size: 10px;">${rx.cylOS || "-"}</td>
                <td style="border: 1px solid #ccc; padding: 4px; font-size: 10px;">${rx.axisOS || "-"}</td>
                <td style="border: 1px solid #ccc; padding: 4px; font-size: 10px;">${rx.addOS || "-"}</td>
                <td style="border: 1px solid #ccc; padding: 4px; font-size: 10px;">${rx.pdLeft || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        ${notes ? `
        <div style="margin-bottom: 8px; font-size: 11px;">
          <div style="font-weight: bold; margin-bottom: 4px;">${t("notes")}:</div>
          <p style="font-size: 10px;">${notes}</p>
        </div>
        ` : ''}

        <div style="margin-bottom: 8px; font-size: 10px;">
          <div style="text-align: center; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 4px; margin-bottom: 4px;">
            ${t("glassesCareTips")}
          </div>
          <ul style="list-style-type: disc; padding-left: ${isRtl ? '0' : '20px'}; padding-right: ${isRtl ? '20px' : '0'}; margin: 4px 0;">
            <li style="margin-bottom: 2px;">${t("tip1")}</li>
            <li style="margin-bottom: 2px;">${t("tip2")}</li>
            <li style="margin-bottom: 2px;">${t("tip3")}</li>
            <li style="margin-bottom: 2px;">${t("tip4")}</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 8px; padding-top: 8px; border-top: 1px solid #ccc;">
          <p style="font-weight: bold; font-size: 12px;">${t("thankYou")}</p>
          <div style="margin-top: 8px; font-size: 10px;">${'•'.repeat(15)}</div>
        </div>
      </div>
    `;
    
    // Use the custom print service with the proper paper type
    const formattedHtml = PrintService.prepareReceiptDocument(htmlContent, t("glassesPrescription"));
    console.log("Formatted HTML for printing:", formattedHtml.substring(0, 200) + "...");
    
    PrintService.printHtml(formattedHtml, 'receipt', () => {
      console.log("RX receipt printing completed");
    });
    
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
