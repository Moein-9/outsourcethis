
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
  const isRtl = language === 'ar';
  
  const containerClass = isPrintable 
    ? "w-[76mm] mx-auto bg-white p-2 text-[11px] border shadow-sm print:shadow-none" 
    : "w-full bg-white p-4 border rounded-lg shadow-sm";
  
  const dirClass = isRtl ? 'rtl text-right' : 'ltr text-left';

  return (
    <div 
      className={`${containerClass} ${dirClass}`} 
      dir={isRtl ? "rtl" : "ltr"}
      style={{ fontFamily: isRtl ? 'Cairo, sans-serif' : 'Cairo, sans-serif' }}
    >
      {/* Header with logo */}
      <div className="text-center border-b pb-2 mb-2">
        <div className="flex justify-center mb-1">
          <MoenLogo className="w-auto h-12" />
        </div>
        <h2 className="font-bold text-base mb-0.5">{storeInfo.name}</h2>
        <p className="text-[10px] text-muted-foreground">{storeInfo.address}</p>
        <p className="text-[10px] text-muted-foreground">{t("phone")}: {storeInfo.phone}</p>
      </div>

      {/* Prescription title */}
      <div className="bg-gray-800 text-white py-1 px-2 text-center font-bold text-sm mb-2 rounded-sm">
        <div className="flex items-center justify-center gap-1">
          <Eye className="h-3 w-3" /> 
          {isRtl ? "وصفة النظارات الطبية" : "GLASSES PRESCRIPTION"}
        </div>
      </div>

      {/* Patient info */}
      <div className="px-2 mb-2 text-[10px]">
        <div className="flex justify-between border-b pb-0.5 mb-0.5">
          <span className="font-semibold">{t("date")}:</span>
          <span>{format(new Date(), 'dd/MM/yyyy HH:mm')}</span>
        </div>
        <div className="flex justify-between border-b pb-0.5 mb-0.5">
          <span className="font-semibold">{t("patient")}:</span>
          <span>{patientName}</span>
        </div>
        {patientPhone && (
          <div className="flex justify-between border-b pb-0.5 mb-0.5">
            <span className="font-semibold">{t("phone")}:</span>
            <span>{patientPhone}</span>
          </div>
        )}
      </div>

      {/* Prescription table */}
      <div className="px-2 mb-3">
        <table className="w-full border-collapse text-[9px] ltr" style={{ maxWidth: "72mm" }}>
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-0.5 text-center"></th>
              <th className="border border-gray-400 p-0.5 text-center">SPH</th>
              <th className="border border-gray-400 p-0.5 text-center">CYL</th>
              <th className="border border-gray-400 p-0.5 text-center">AXIS</th>
              <th className="border border-gray-400 p-0.5 text-center">ADD</th>
              <th className="border border-gray-400 p-0.5 text-center">PD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 p-0.5 text-center font-medium">OD</td>
              <td className="border border-gray-400 p-0.5 text-center">{rx.sphereOD || "-"}</td>
              <td className="border border-gray-400 p-0.5 text-center">{rx.cylOD || "-"}</td>
              <td className="border border-gray-400 p-0.5 text-center">{rx.axisOD || "-"}</td>
              <td className="border border-gray-400 p-0.5 text-center">{rx.addOD || "-"}</td>
              <td className="border border-gray-400 p-0.5 text-center">{rx.pdRight || "-"}</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-0.5 text-center font-medium">OS</td>
              <td className="border border-gray-400 p-0.5 text-center">{rx.sphereOS || "-"}</td>
              <td className="border border-gray-400 p-0.5 text-center">{rx.cylOS || "-"}</td>
              <td className="border border-gray-400 p-0.5 text-center">{rx.axisOS || "-"}</td>
              <td className="border border-gray-400 p-0.5 text-center">{rx.addOS || "-"}</td>
              <td className="border border-gray-400 p-0.5 text-center">{rx.pdLeft || "-"}</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-1 text-[8px] flex justify-between px-1">
          <span>OD = {isRtl ? "العين اليمنى" : "Right Eye"}</span>
          <span>OS = {isRtl ? "العين اليسرى" : "Left Eye"}</span>
        </div>
      </div>

      {/* Notes section */}
      {notes && (
        <div className="px-2 mb-2">
          <div className="bg-gray-200 py-0.5 px-1 font-semibold text-[10px] mb-1">
            {t("notes")}:
          </div>
          <p className="text-[9px] px-1">{notes}</p>
        </div>
      )}

      {/* Care tips */}
      <div className="px-2 mb-2">
        <div className="bg-gray-200 py-0.5 px-1 font-semibold text-[10px] mb-1 text-center">
          {t("glassesCareTips")}
        </div>
        <ul className={`list-disc px-4 space-y-0.5 text-[8px] ${dirClass}`}>
          <li>{t("tip1")}</li>
          <li>{t("tip2")}</li>
          <li>{t("tip3")}</li>
          <li>{t("tip4")}</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="text-center mt-2 pt-2 border-t">
        <p className="font-semibold text-[10px]">
          {isRtl 
            ? "شكرًا على دعمكم، ونشوفكم على خير قريبًا!" 
            : "Thank you so much for your support—we look forward to seeing you again soon!"}
        </p>
        <div className="mt-1 text-[12px] flex gap-1 justify-center">
          <span>{'•'.repeat(12)}</span>
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
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${isRtl ? 'وصفة النظارات' : 'Glasses Prescription'}</title>
  <style>
    @page {
      size: 80mm auto;
      margin: 0;
    }
    body {
      font-family: 'Cairo', sans-serif;
      margin: 0;
      padding: 0;
      width: 76mm;
      direction: ${isRtl ? 'rtl' : 'ltr'};
      text-align: ${isRtl ? 'right' : 'left'};
      background-color: white;
      color: black;
    }
    .container {
      padding: 4mm;
      max-width: 72mm;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #333;
      padding-bottom: 2mm;
      margin-bottom: 2mm;
    }
    .logo {
      max-width: 50mm;
      height: auto;
      margin: 0 auto 1mm;
      display: block;
    }
    .store-name {
      font-weight: bold;
      font-size: 14px;
      margin: 1mm 0;
    }
    .store-info {
      font-size: 9px;
      color: #333;
    }
    .field {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 1mm 0;
      font-size: 10px;
    }
    .field-label {
      font-weight: bold;
    }
    .rx-title {
      text-align: center;
      font-weight: bold;
      font-size: 12px;
      margin: 2mm 0;
      text-transform: uppercase;
      background-color: #333;
      color: white;
      padding: 1mm;
      border-radius: 1mm;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      direction: ltr;
      font-size: 9px;
      margin: 2mm 0;
    }
    th, td {
      border: 1px solid #333;
      padding: 1mm;
      text-align: center;
    }
    th {
      background-color: #eee;
      font-size: 9px;
    }
    .eye-legend {
      display: flex;
      justify-content: space-between;
      font-size: 8px;
      margin-top: 1mm;
      padding: 0 1mm;
    }
    .section-title {
      font-weight: bold;
      font-size: 10px;
      background-color: #eee;
      padding: 1mm;
      margin: 2mm 0 1mm 0;
      text-align: ${isRtl ? 'right' : 'left'};
    }
    .notes {
      margin: 2mm 0;
      font-size: 9px;
      padding: 0 1mm;
    }
    .tips-title {
      text-align: center;
      font-weight: bold;
      background-color: #eee;
      padding: 1mm;
      margin: 2mm 0 1mm 0;
      font-size: 10px;
    }
    .tips-list {
      padding-${isRtl ? 'right' : 'left'}: 5mm;
      margin: 1mm;
      font-size: 8px;
    }
    .tips-list li {
      margin-bottom: 1mm;
    }
    .footer {
      text-align: center;
      margin-top: 2mm;
      padding-top: 2mm;
      border-top: 1px solid #333;
      font-size: 10px;
    }
    .thank-you {
      font-weight: bold;
      font-size: 10px;
      margin-bottom: 1mm;
    }
    .dots {
      margin-top: 2mm;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img class="logo" src="/lovable-uploads/d0902afc-d6a5-486b-9107-68104dfd2a68.png" alt="Moen Optician Logo">
      <div class="store-name">${storeInfo.name}</div>
      <div class="store-info">${storeInfo.address}</div>
      <div class="store-info">${isRtl ? 'الهاتف' : 'Phone'}: ${storeInfo.phone}</div>
    </div>
    
    <div class="rx-title">
      ${isRtl ? 'وصفة النظارات الطبية' : 'GLASSES PRESCRIPTION'}
    </div>
    
    <div class="patient-info">
      <div class="field">
        <span class="field-label">${isRtl ? 'التاريخ' : 'Date'}:</span>
        <span>${format(new Date(), 'dd/MM/yyyy HH:mm')}</span>
      </div>
      <div class="field">
        <span class="field-label">${isRtl ? 'المريض' : 'Patient'}:</span>
        <span>${patientName}</span>
      </div>
      ${patientPhone ? `
      <div class="field">
        <span class="field-label">${isRtl ? 'الهاتف' : 'Phone'}:</span>
        <span>${patientPhone}</span>
      </div>
      ` : ''}
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
        <tr>
          <td style="font-weight: bold;">OD</td>
          <td>${rx.sphereOD || "-"}</td>
          <td>${rx.cylOD || "-"}</td>
          <td>${rx.axisOD || "-"}</td>
          <td>${rx.addOD || "-"}</td>
          <td>${rx.pdRight || "-"}</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">OS</td>
          <td>${rx.sphereOS || "-"}</td>
          <td>${rx.cylOS || "-"}</td>
          <td>${rx.axisOS || "-"}</td>
          <td>${rx.addOS || "-"}</td>
          <td>${rx.pdLeft || "-"}</td>
        </tr>
      </tbody>
    </table>
    
    <div class="eye-legend">
      <span>OD = ${isRtl ? 'العين اليمنى' : 'Right Eye'}</span>
      <span>OS = ${isRtl ? 'العين اليسرى' : 'Left Eye'}</span>
    </div>
    
    ${notes ? `
    <div class="section-title">${isRtl ? 'ملاحظات' : 'Notes'}:</div>
    <div class="notes">${notes}</div>
    ` : ''}
    
    <div class="tips-title">${isRtl ? 'نصائح للعناية بالنظارات' : 'Glasses Care Tips'}</div>
    <ul class="tips-list">
      <li>${isRtl ? 'استخدم دائماً كلتا اليدين عند وضع النظارات أو إزالتها' : 'Always use both hands to put on or remove your glasses'}</li>
      <li>${isRtl ? 'نظف العدسات بقطعة قماش نظيفة وناعمة وبمنظف مناسب للعدسات' : 'Clean lenses with a clean, soft cloth and proper lens cleaner'}</li>
      <li>${isRtl ? 'احفظ النظارات في علبتها عندما لا تكون قيد الاستعمال' : 'Store your glasses in their case when not in use'}</li>
      <li>${isRtl ? 'تجنب وضع النظارات على الوجه المقلوب على الأسطح' : 'Avoid placing your glasses face down on surfaces'}</li>
    </ul>
    
    <div class="footer">
      <div class="thank-you">${isRtl ? 'شكرًا على دعمكم، ونشوفكم على خير قريبًا!' : 'Thank you so much for your support—we look forward to seeing you again soon!'}</div>
      <div class="dots">•••••••••••</div>
    </div>
  </div>
  
  <script>
    window.onload = function() {
      window.print();
      window.onafterprint = function() {
        window.close();
      };
    };
  </script>
</body>
</html>
  `;
  
  try {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert(isRtl ? 'تم منع النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة لطباعة الوصفة.' : 
        'Popup blocked. Please allow popups to print prescription.');
      return;
    }
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } catch (error) {
    console.error("Error printing prescription:", error);
    alert(isRtl ? 'حدث خطأ أثناء الطباعة' : 'Error during printing');
  }
};
