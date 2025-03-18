
import React from "react";
import { format } from "date-fns";
import { Invoice } from "@/store/invoiceStore";
import { Eye, CircleDot, User, Glasses, Contact } from "lucide-react";
import { ContactLensItem } from "./ContactLensSelector";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";

interface WorkOrderReceiptPrintProps {
  invoice: Invoice;
  patientName?: string;
  patientPhone?: string;
  rx?: any;
  lensType?: string;
  coating?: string;
  frame?: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  };
  contactLenses?: ContactLensItem[];
  contactLensRx?: {
    rightEye: {
      sphere: string;
      cylinder: string;
      axis: string;
      bc: string;
      dia: string;
    };
    leftEye: {
      sphere: string;
      cylinder: string;
      axis: string;
      bc: string;
      dia: string;
    };
  };
}

export const WorkOrderReceiptPrint: React.FC<WorkOrderReceiptPrintProps> = ({ 
  invoice,
  patientName,
  patientPhone,
  rx,
  lensType,
  coating,
  frame,
  contactLenses,
  contactLensRx
}) => {
  const { language, t } = useLanguageStore();
  
  const name = patientName || invoice.patientName;
  const phone = patientPhone || invoice.patientPhone;
  const lensTypeValue = lensType || invoice.lensType;
  const coatingValue = coating || invoice.coating;
  const frameData = frame || (invoice.frameBrand ? {
    brand: invoice.frameBrand,
    model: invoice.frameModel,
    color: invoice.frameColor,
    size: "",
    price: invoice.framePrice
  } : undefined);
  
  const isContactLens = contactLenses && contactLenses.length > 0;
  const dirClass = language === 'ar' ? 'rtl text-right' : 'ltr text-left';

  // Add special CSS for print media to ensure only this component is printed - receipt format
  return (
    <div className={`max-w-md mx-auto bg-white p-4 border rounded-lg shadow-sm print:shadow-none ${dirClass}`}>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #work-order-receipt, #work-order-receipt * {
              visibility: visible;
            }
            #work-order-receipt {
              position: absolute;
              left: 0;
              top: 0;
              width: 80mm;
              padding: 0.5rem;
              font-size: 10px;
            }
            @page {
              size: 80mm auto;
              margin: 0;
            }
          }
        `}
      </style>
      
      <div id="work-order-receipt" className={`${dirClass} text-xs`}>
        <div className="text-center border-b pb-2 mb-3">
          <MoenLogo className="mx-auto w-auto h-12 mb-1" />
          <h1 className="text-base font-bold mb-1">{t("workOrder")}</h1>
          <p className="text-sm text-primary font-medium">{t("orderNumber")}: {invoice.invoiceId}</p>
          <p className="text-muted-foreground text-xs">
            {format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}
          </p>
          <div className="text-xs text-center mt-1">
            <p>{storeInfo.address}</p>
            <p>{t("phone")}: {storeInfo.phone}</p>
          </div>
        </div>

        <div className="mb-3 border-b pb-2">
          <h3 className="font-semibold mb-1 flex items-center gap-1 text-primary">
            <User className="w-3 h-3" />
            {t("patientInformation")}
          </h3>
          <div className="space-y-1">
            <div className="flex">
              <span className="font-semibold w-16">{t("name")}:</span>
              <span>{name}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-16">{t("phone")}:</span>
              <span>{phone}</span>
            </div>
            {invoice.patientId && (
              <div className="flex">
                <span className="font-semibold w-16">{t("patientId")}:</span>
                <span>{invoice.patientId}</span>
              </div>
            )}
          </div>
        </div>

        {!isContactLens && frameData && (
          <div className="mb-3 border-b pb-2">
            <h3 className="font-semibold mb-1 flex items-center gap-1 text-primary">
              <Glasses className="w-3 h-3" />
              {t("frameDetails")}
            </h3>
            <div className="space-y-1">
              <div className="flex">
                <span className="font-semibold w-16">{t("brand")}:</span>
                <span>{frameData.brand}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-16">{t("model")}:</span>
                <span>{frameData.model}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-16">{t("color")}:</span>
                <span>{frameData.color}</span>
              </div>
            </div>
          </div>
        )}
        
        {isContactLens && (
          <div className="mb-3 border-b pb-2">
            <h3 className="font-semibold mb-1 flex items-center gap-1 text-primary">
              <Contact className="w-3 h-3" />
              {t("contactLensDetails")}
            </h3>
            <div className="space-y-1">
              {contactLenses.map((lens, idx) => (
                <div key={idx} className="space-y-0.5 border-b pb-1 border-dashed border-gray-200 last:border-0">
                  <div className="flex">
                    <span className="font-semibold w-16">{t("lens")} {idx + 1}:</span>
                    <span>{lens.brand} {lens.type}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-16">{t("power")}:</span>
                    <span>{lens.power}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-16">BC:</span>
                    <span>{lens.bc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isContactLens && rx && (
          <div className="mb-3 border-b pb-2">
            <h3 className="font-semibold mb-1 flex items-center gap-1 text-primary">
              <Eye className="w-3 h-3" />
              {t("prescriptionDetails")}
            </h3>
            <table className="w-full border-collapse text-xs">
              <thead className="bg-muted">
                <tr>
                  <th className="border p-1 text-center">{t("eye")}</th>
                  <th className="border p-1 text-center">SPH</th>
                  <th className="border p-1 text-center">CYL</th>
                  <th className="border p-1 text-center">AX</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1 font-medium text-center">{t("rightEye")}</td>
                  <td className="border p-1 text-center">{rx?.sphereOD || "_"}</td>
                  <td className="border p-1 text-center">{rx?.cylOD || "_"}</td>
                  <td className="border p-1 text-center">{rx?.axisOD || "_"}</td>
                </tr>
                <tr>
                  <td className="border p-1 font-medium text-center">{t("leftEye")}</td>
                  <td className="border p-1 text-center">{rx?.sphereOS || "_"}</td>
                  <td className="border p-1 text-center">{rx?.cylOS || "_"}</td>
                  <td className="border p-1 text-center">{rx?.axisOS || "_"}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-between mt-1 text-xs">
              <span><b>ADD:</b> {rx?.addOD || rx?.addOS || "_"}</span>
              <span><b>PD:</b> {rx?.pdRight || "_"}/{rx?.pdLeft || "_"}</span>
            </div>
          </div>
        )}
        
        {isContactLens && contactLensRx && (
          <div className="mb-3 border-b pb-2">
            <h3 className="font-semibold mb-1 flex items-center gap-1 text-primary">
              <Eye className="w-3 h-3" />
              {t("contactLensPrescription")}
            </h3>
            <table className="w-full border-collapse text-xs">
              <thead className="bg-muted">
                <tr>
                  <th className="border p-1 text-center">{t("eye")}</th>
                  <th className="border p-1 text-center">SPH</th>
                  <th className="border p-1 text-center">CYL</th>
                  <th className="border p-1 text-center">BC</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1 font-medium text-center">{t("rightEye")}</td>
                  <td className="border p-1 text-center">{contactLensRx.rightEye.sphere || "_"}</td>
                  <td className="border p-1 text-center">{contactLensRx.rightEye.cylinder || "_"}</td>
                  <td className="border p-1 text-center">{contactLensRx.rightEye.bc || "_"}</td>
                </tr>
                <tr>
                  <td className="border p-1 font-medium text-center">{t("leftEye")}</td>
                  <td className="border p-1 text-center">{contactLensRx.leftEye.sphere || "_"}</td>
                  <td className="border p-1 text-center">{contactLensRx.leftEye.cylinder || "_"}</td>
                  <td className="border p-1 text-center">{contactLensRx.leftEye.bc || "_"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {!isContactLens && (
          <div className="mb-3 border-b pb-2">
            <h3 className="font-semibold mb-1 flex items-center gap-1 text-primary">
              {t("lensDetails")}
            </h3>
            <div className="space-y-1">
              <div className="flex">
                <span className="font-semibold w-16">{t("type")}:</span>
                <span>{lensTypeValue}</span>
              </div>
              {coatingValue && (
                <div className="flex">
                  <span className="font-semibold w-16">{t("coating")}:</span>
                  <span>{coatingValue}</span>
                </div>
              )}
              <div className="flex">
                <span className="font-semibold w-16">{t("price")}:</span>
                <span>{invoice.lensPrice.toFixed(2)} KWD</span>
              </div>
              {coatingValue && (
                <div className="flex">
                  <span className="font-semibold w-16">{t("coatingPrice")}:</span>
                  <span>{invoice.coatingPrice.toFixed(2)} KWD</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mb-3">
          <h3 className="font-semibold mb-1 flex items-center gap-1 text-primary">
            <CircleDot className="w-3 h-3" />
            {t("additionalNotes")}
          </h3>
          <div className="border rounded p-2 min-h-[50px] bg-white text-xs"></div>
        </div>

        <div className="mt-3 pt-2 border-t text-center text-xs">
          <p className="font-semibold">{t("totalAmount")}: {invoice.total.toFixed(2)} KWD</p>
          <p className="mt-4 text-muted-foreground">{t("thankYouMessage")}</p>
        </div>
      </div>
    </div>
  );
};
