
import React from "react";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { RxData, ContactLensRx } from "@/store/patientStore";
import { Eye, Calendar, User, Phone } from "lucide-react";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";

interface RxReceiptPrintProps {
  patientName: string;
  patientPhone?: string;
  rx?: RxData;  // Make rx optional to handle cases where it might be undefined
  isPrintable?: boolean;
  forcedLanguage?: 'en' | 'ar';
  contactLensRx?: ContactLensRx;
  printContactLens?: boolean;
}

export const RxReceiptPrint: React.FC<RxReceiptPrintProps> = ({
  patientName,
  patientPhone,
  rx,
  isPrintable = false,
  forcedLanguage,
  contactLensRx,
  printContactLens = false
}) => {
  const { language: appLanguage, t } = useLanguageStore();
  const language = forcedLanguage || appLanguage;
  const isRtl = language === 'ar';
  
  // Create a safe default rx object if rx is undefined
  const safeRx: RxData = rx || {
    sphereOD: "",
    cylOD: "",
    axisOD: "",
    addOD: "",
    sphereOS: "",
    cylOS: "",
    axisOS: "",
    addOS: "",
    pdRight: "",
    pdLeft: "",
  };
  
  const containerClass = isPrintable 
    ? "w-[72mm] mx-auto bg-white p-2 text-[11px] border shadow-sm print:shadow-none" 
    : "w-full bg-white p-4 border rounded-lg shadow-sm";
  
  const dirClass = isRtl ? 'rtl text-right' : 'ltr text-left';

  const formattedRxDate = safeRx.createdAt 
    ? format(parseISO(safeRx.createdAt), 'MM/dd/yyyy HH:mm', { locale: enUS })
    : format(new Date(), 'MM/dd/yyyy HH:mm', { locale: enUS });

  return (
    <div 
      className={`${containerClass} ${dirClass}`} 
      dir={isRtl ? "rtl" : "ltr"}
      style={{ fontFamily: 'Cairo, sans-serif' }}
    >
      <div className="text-center border-b pb-2 mb-2">
        <div className="flex justify-center mb-1">
          <MoenLogo className="w-auto h-12" />
        </div>
        <h2 className="font-bold text-base mb-0.5">{storeInfo.name}</h2>
        <p className="text-[10px] text-muted-foreground">{storeInfo.address}</p>
        <p className="text-[10px] text-muted-foreground">{t("phone")}: {storeInfo.phone}</p>
      </div>

      <div className="bg-gray-800 text-white py-1 px-2 text-center font-bold text-sm mb-2 rounded-sm print:bg-black print:text-white">
        <div className="flex items-center justify-center gap-1">
          <Eye className="h-3 w-3" /> 
          {isRtl 
            ? (printContactLens ? "وصفة العدسات اللاصقة" : "وصفة النظارات الطبية") 
            : (printContactLens ? "CONTACT LENS PRESCRIPTION" : "GLASSES PRESCRIPTION")
          }
        </div>
      </div>

      <div className="px-6 mb-2 text-[11px]">
        <div className="flex justify-between border-b pb-0.5 mb-0.5">
          <span className="font-semibold flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" /> {t("date")}:
          </span>
          <span>{formattedRxDate}</span>
        </div>
        <div className="flex justify-between border-b pb-0.5 mb-0.5">
          <span className="font-semibold flex items-center">
            <User className="h-3.5 w-3.5 mr-1" /> {t("patient")}:
          </span>
          <span>{patientName}</span>
        </div>
        {patientPhone && (
          <div className="flex justify-between border-b pb-0.5 mb-0.5">
            <span className="font-semibold flex items-center">
              <Phone className="h-3.5 w-3.5 mr-1" /> {t("phone")}:
            </span>
            <span>{patientPhone}</span>
          </div>
        )}
      </div>

      <div className="px-5 mb-3">
        {printContactLens && contactLensRx ? (
          <table className="w-full border-collapse text-[10px] ltr" style={{ maxWidth: "62mm", direction: "ltr" }}>
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 p-0.5 text-center"></th>
                <th className="border border-gray-400 p-0.5 text-center">SPH</th>
                <th className="border border-gray-400 p-0.5 text-center">CYL</th>
                <th className="border border-gray-400 p-0.5 text-center">AXIS</th>
                <th className="border border-gray-400 p-0.5 text-center">BC</th>
                <th className="border border-gray-400 p-0.5 text-center">DIA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 p-0.5 text-center font-medium">OD</td>
                <td className="border border-gray-400 p-0.5 text-center">{contactLensRx.rightEye.sphere || "-"}</td>
                <td className="border border-gray-400 p-0.5 text-center">{contactLensRx.rightEye.cylinder || "-"}</td>
                <td className="border border-gray-400 p-0.5 text-center">{contactLensRx.rightEye.axis || "-"}</td>
                <td className="border border-gray-400 p-0.5 text-center">{contactLensRx.rightEye.bc || "-"}</td>
                <td className="border border-gray-400 p-0.5 text-center">{contactLensRx.rightEye.dia || "-"}</td>
              </tr>
              <tr>
                <td className="border border-gray-400 p-0.5 text-center font-medium">OS</td>
                <td className="border border-gray-400 p-0.5 text-center">{contactLensRx.leftEye.sphere || "-"}</td>
                <td className="border border-gray-400 p-0.5 text-center">{contactLensRx.leftEye.cylinder || "-"}</td>
                <td className="border border-gray-400 p-0.5 text-center">{contactLensRx.leftEye.axis || "-"}</td>
                <td className="border border-gray-400 p-0.5 text-center">{contactLensRx.leftEye.bc || "-"}</td>
                <td className="border border-gray-400 p-0.5 text-center">{contactLensRx.leftEye.dia || "-"}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className="w-full border-collapse text-[10px] ltr" style={{ maxWidth: "62mm", direction: "ltr" }}>
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
                <td className="border border-gray-400 p-0.5 text-center">{safeRx.sphereOD || "-"}</td>
                <td className="border border-gray-400 p-0.5 text-center">{safeRx.cylOD || "-"}</td>
                <td className="border border-gray-400 p-0.5 text-center">{safeRx.axisOD || "-"}</td>
                <td className="border border-gray-400 p-0.5 text-center">{safeRx.addOD || "-"}</td>
                <td className="border border-gray-400 p-0.5 text-center">{safeRx.pdRight || "-"}</td>
              </tr>
              <tr>
                <td className="border border-gray-400 p-0.5 text-center font-medium">OS</td>
                <td className="border border-gray-400 p-0.5 text-center">{safeRx.sphereOS || "-"}</td>
                <td className="border border-gray-400 p-0.5 text-center">{safeRx.cylOS || "-"}</td>
                <td className="border border-gray-400 p-0.5 text-center">{safeRx.axisOS || "-"}</td>
                <td className="border border-gray-400 p-0.5 text-center">{safeRx.addOS || "-"}</td>
                <td className="border border-gray-400 p-0.5 text-center">{safeRx.pdLeft || "-"}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <div className="my-2 text-center text-[10px] text-muted-foreground">
        {isRtl 
          ? "تم إصدار هذه الوصفة الطبية بواسطة نظام إدارة العيادة من عيادة العيون"
          : "This prescription was issued by the Clinic Management System"}
      </div>
      
      <div className="mt-4 text-center border-t pt-2 text-[10px]">
        <p>© {new Date().getFullYear()} {storeInfo.name} - {isRtl ? "جميع الحقوق محفوظة" : "All Rights Reserved"}</p>
      </div>
    </div>
  );
};
