
import React from "react";
import { format } from "date-fns";
import { RxData } from "@/store/patientStore";
import { Eye } from "lucide-react";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";

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
  
  const containerClass = isPrintable 
    ? "w-[80mm] mx-auto bg-white p-4 text-[12px] border shadow-sm print:shadow-none" 
    : "w-full bg-white p-4 border rounded-lg shadow-sm";
  
  const dirClass = language === 'ar' ? 'rtl text-right' : 'ltr text-left';
  
  return (
    <div className={`${containerClass} ${dirClass}`} style={{ fontFamily: 'Courier New, monospace' }}>
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
        
        {/* Always left-to-right table regardless of language */}
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

// Language selection dialog for RX printing - fixed to be centered regardless of scroll position
export const RxLanguageDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (language: 'en' | 'ar') => void;
}> = ({ isOpen, onClose, onSelect }) => {
  const { t } = useLanguageStore();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
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
