
import React from "react";
import { format } from "date-fns";
import { Invoice } from "@/store/invoiceStore";
import { Eye, Ruler, CircleDot, ClipboardCheck, User, Glasses, BadgeCheck, Contact } from "lucide-react";
import { ContactLensItem } from "./ContactLensSelector";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";

interface WorkOrderPrintProps {
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

export const WorkOrderPrint: React.FC<WorkOrderPrintProps> = ({ 
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
  const dirClass = language === 'ar' ? 'rtl text-right' : 'ltr text-left';
  
  const name = patientName || invoice.patientName;
  const phone = patientPhone || invoice.patientPhone;
  const lensTypeValue = lensType || invoice.lensType;
  const coatingValue = coating || invoice.coating;
  const frameData = frame || (invoice.frameBrand ? {
    brand: invoice.frameBrand,
    model: invoice.frameModel,
    color: invoice.frameColor,
    size: invoice.frameSize || "",
    price: invoice.framePrice
  } : undefined);
  
  const isContactLens = contactLenses && contactLenses.length > 0;

  return (
    <div className="print-wrapper">
      <style>
        {`
          @media print {
            .hide-print {
              display: none !important;
            }
    
            @page {
              size: portrait;
              width: 58mm;
              margin: 0;
            }

            /* Reset visibility */
            * {
              visibility: visible !important;
            }

            html, body {
              width: 58mm !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            .print-wrapper {
              visibility: visible !important;
              width: 58mm !important;
            }

            #thermal-print {
              visibility: visible !important;
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 56mm !important;
              padding: 0mm !important;
              margin: 0 !important;
              background: white !important;
            }

            /* Hide everything else */
 
            /* Content styles */
            .print-section {
              width: 54mm !important;
              margin-bottom: 2mm !important;
              padding: 0 1mm !important;
            }

            .print-text-lg { font-size: 9pt !important; }
            .print-text-md { font-size: 8pt !important; }
            .print-text-sm { font-size: 7pt !important; }

            table {
              width: 100% !important;
              border-collapse: collapse !important;
            }

            td, th {
              border: 0.1mm solid black !important;
              padding: 0.5mm !important;
              text-align: center !important;
            }
          }
        `}
      </style>

      <div id="work-order-print" className={dirClass}>
        <div className="text-center border-b pb-4 mb-6 relative">
          <div className="absolute right-0 top-0">
            <ClipboardCheck className="w-10 h-10 text-primary hide-print" />
          </div>
          <MoenLogo className="mx-auto w-auto h-8 mb-2" />
          <h1 className="text-2xl font-bold mb-1">{t("workOrder")}</h1>
          <p className="text-lg text-primary font-medium">{invoice.invoiceId || invoice.workOrderId}</p>
          <p className="text-muted-foreground">
            {format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}
          </p>
          <div className="text-sm text-center mt-2">
            <p>{storeInfo.address}</p>
            <p>{t("phone")}: {storeInfo.phone}</p>
          </div>
        </div>

        <div className="grid gap-4 mb-4">
          <div className="bg-muted/10 p-3 print:!p-0 rounded-lg border print:!border-none">
            <h3 className="font-semibold mb-2 flex items-center gap-1 text-primary text-sm">
              <User className="w-4 h-4" />
              {t("patientInformation")} {language === 'ar' && '(معلومات المريض)'}
            </h3>
            <div className="space-y-1 text-sm">
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
            <div className="bg-muted/10 p-3 print:!p-0 rounded-lg border print:!border-none">
              <h3 className="font-semibold mb-2 flex items-center gap-1 text-primary text-sm">
                <Glasses className="w-4 h-4" />
                {t("frameDetails")} {language === 'ar' && '(تفاصيل الإطار)'}
              </h3>
              <div className="space-y-1 text-sm">
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
                <div className="flex">
                  <span className="font-semibold w-16">{t("size")}:</span>
                  <span>{frameData.size || "-"}</span>
                </div>
              </div>
            </div>
          )}
          
          {isContactLens && (
            <div className="bg-muted/10 p-3 print:!p-0 rounded-lg border print:!border-none">
              <h3 className="font-semibold mb-2 flex items-center gap-1 text-primary text-sm">
                <Contact className="w-4 h-4" />
                {t("contactLensDetails")} {language === 'ar' && '(تفاصيل العدسات اللاصقة)'}
              </h3>
              <div className="space-y-1 text-sm">
                {contactLenses.map((lens, idx) => (
                  <div key={idx} className="space-y-0.5 border-b pb-1 border-dashed border-gray-200 last:border-0 text-xs">
                    <div className="flex">
                      <span className="font-semibold w-16">{t("lens")} {idx + 1}:</span>
                      <span>{lens.brand} {lens.type}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold w-16">{t("power")}:</span>
                      <span>{lens.power}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!isContactLens && rx && (
          <div className="mb-4 bg-muted/10 p-3 print:!p-0 rounded-lg border print:!border-none">
            <h3 className="font-semibold mb-2 flex items-center gap-1 text-primary text-sm">
              <Eye className="w-4 h-4" />
              {t("prescriptionDetails")} {language === 'ar' && '(تفاصيل الوصفة الطبية)'}
            </h3>
            <table className="w-full border-collapse bg-white text-xs">
              <thead className="bg-muted">
                <tr>
                  <th className="border p-1 text-center">{t("eye")}</th>
                  <th className="border p-1 text-center">SPH</th>
                  <th className="border p-1 text-center">CYL</th>
                  <th className="border p-1 text-center">AXIS</th>
                  <th className="border p-1 text-center">ADD</th>
                  <th className="border p-1 text-center">PD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1 font-medium text-center">OD {language === 'ar' && '(يمين)'}</td>
                  <td className="border p-1 text-center">{rx?.sphereOD || "_____"}</td>
                  <td className="border p-1 text-center">{rx?.cylOD || "_____"}</td>
                  <td className="border p-1 text-center">{rx?.axisOD || "_____"}</td>
                  <td className="border p-1 text-center">{rx?.addOD || "_____"}</td>
                  <td className="border p-1 text-center">{rx?.pdRight || "_____"}</td>
                </tr>
                <tr>
                  <td className="border p-1 font-medium text-center">OS {language === 'ar' && '(يسار)'}</td>
                  <td className="border p-1 text-center">{rx?.sphereOS || "_____"}</td>
                  <td className="border p-1 text-center">{rx?.cylOS || "_____"}</td>
                  <td className="border p-1 text-center">{rx?.axisOS || "_____"}</td>
                  <td className="border p-1 text-center">{rx?.addOS || "_____"}</td>
                  <td className="border p-1 text-center">{rx?.pdLeft || "_____"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        {isContactLens && contactLensRx && (
          <div className="mb-4 bg-muted/10 p-3 print:!p-0 rounded-lg border print:!border-none">
            <h3 className="font-semibold mb-2 flex items-center gap-1 text-primary text-sm">
              <Eye className="w-4 h-4" />
              {t("contactLensPrescription")} {language === 'ar' && '(وصفة العدسات اللاصقة)'}
            </h3>
            <table className="w-full border-collapse bg-white text-xs">
              <thead className="bg-muted">
                <tr>
                  <th className="border p-1 text-center">{t("eye")}</th>
                  <th className="border p-1 text-center">Sphere</th>
                  <th className="border p-1 text-center">Cylinder</th>
                  <th className="border p-1 text-center">Axis</th>
                  <th className="border p-1 text-center">BC</th>
                  <th className="border p-1 text-center">Dia</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1 font-medium text-center">OD {language === 'ar' && '(يمين)'}</td>
                  <td className="border p-1 text-center">{contactLensRx.rightEye.sphere || "_____"}</td>
                  <td className="border p-1 text-center">{contactLensRx.rightEye.cylinder || "_____"}</td>
                  <td className="border p-1 text-center">{contactLensRx.rightEye.axis || "_____"}</td>
                  <td className="border p-1 text-center">{contactLensRx.rightEye.bc || "_____"}</td>
                  <td className="border p-1 text-center">{contactLensRx.rightEye.dia || "_____"}</td>
                </tr>
                <tr>
                  <td className="border p-1 font-medium text-center">OS {language === 'ar' && '(يسار)'}</td>
                  <td className="border p-1 text-center">{contactLensRx.leftEye.sphere || "_____"}</td>
                  <td className="border p-1 text-center">{contactLensRx.leftEye.cylinder || "_____"}</td>
                  <td className="border p-1 text-center">{contactLensRx.leftEye.axis || "_____"}</td>
                  <td className="border p-1 text-center">{contactLensRx.leftEye.bc || "_____"}</td>
                  <td className="border p-1 text-center">{contactLensRx.leftEye.dia || "_____"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {!isContactLens && (
          <div className="space-y-3">
            <div className="bg-muted/10 p-3 print:!p-0 rounded-lg border print:!border-none">
              <h3 className="font-semibold mb-2 flex items-center gap-1 text-primary text-sm">
                <Ruler className="w-4 h-4" />
                {t("lensDetails")} {language === 'ar' && '(تفاصيل العدسات)'}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
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
                </div>
                <div className="space-y-1">
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
            </div>
          </div>
        )}

        <div className="bg-muted/10 p-3 print:!p-0 rounded-lg border print:!border-none mt-4">
          <h3 className="font-semibold mb-2 flex items-center gap-1 text-primary text-sm">
            <CircleDot className="w-4 h-4" />
            {t("additionalNotes")} {language === 'ar' && '(ملاحظات إضافية)'}
          </h3>
          <div className="border rounded p-2 min-h-[50px] bg-white"></div>
        </div>

        <div className="mt-6 pt-3 border-t grid gap-4">
          <div>
            <p className="font-semibold text-primary text-sm">{t("technicianSignature")} {language === 'ar' && '(توقيع الفني)'}</p>
            <div className="mt-4 border-b w-32 h-6"></div>
            <div className="mt-1 text-xs text-muted-foreground">{t("date")}: ___ / ___ / _____</div>
          </div>
          <div>
            <p className="font-semibold text-primary text-sm">{t("qualityConfirmation")} {language === 'ar' && '(تأكيد الجودة)'}</p>
            <div className="flex items-center mt-4 gap-1">
              <BadgeCheck className="w-4 h-4 text-primary" />
              <div className="border-b w-28 h-6"></div>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{t("date")}: ___ / ___ / _____</div>
          </div>
        </div>
      </div>
    </div>
  );
};
