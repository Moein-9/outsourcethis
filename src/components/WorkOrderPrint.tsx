
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

  // Add special CSS for print media to ensure only this component is printed and only print 1 copy
  return (
    <div className={`max-w-2xl mx-auto bg-white p-6 border rounded-lg shadow-sm print:shadow-none ${dirClass}`}>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #work-order-print, #work-order-print * {
              visibility: visible;
            }
            #work-order-print {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              padding: 2rem;
            }
            @page {
              size: A4;
              margin: 1cm;
            }
          }
        `}
      </style>
      
      <div id="work-order-print" className={dirClass}>
        <div className="text-center border-b pb-4 mb-6 relative">
          <div className="absolute right-0 top-0">
            <ClipboardCheck className="w-10 h-10 text-primary" />
          </div>
          <MoenLogo className="mx-auto w-auto h-20 mb-2" />
          <h1 className="text-2xl font-bold mb-1">{t("workOrder")}</h1>
          <p className="text-lg text-primary font-medium">{t("orderNumber")}: {invoice.invoiceId}</p>
          <p className="text-muted-foreground">
            {format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}
          </p>
          <div className="text-sm text-center mt-2">
            <p>{storeInfo.address}</p>
            <p>{t("phone")}: {storeInfo.phone}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-muted/10 p-4 rounded-lg border">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
              <User className="w-5 h-5" />
              {t("patientInformation")}
            </h3>
            <div className="space-y-2">
              <div className="flex">
                <span className="font-semibold w-20">{t("name")}:</span>
                <span>{name}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-20">{t("phone")}:</span>
                <span>{phone}</span>
              </div>
              {invoice.patientId && (
                <div className="flex">
                  <span className="font-semibold w-20">{t("patientId")}:</span>
                  <span>{invoice.patientId}</span>
                </div>
              )}
            </div>
          </div>

          {!isContactLens && frameData && (
            <div className="bg-muted/10 p-4 rounded-lg border">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
                <Glasses className="w-5 h-5" />
                {t("frameDetails")}
              </h3>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-semibold w-20">{t("brand")}:</span>
                  <span>{frameData.brand}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-20">{t("model")}:</span>
                  <span>{frameData.model}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold w-20">{t("color")}:</span>
                  <span>{frameData.color}</span>
                </div>
              </div>
            </div>
          )}
          
          {isContactLens && (
            <div className="bg-muted/10 p-4 rounded-lg border">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
                <Contact className="w-5 h-5" />
                {t("contactLensDetails")}
              </h3>
              <div className="space-y-2">
                {contactLenses.map((lens, idx) => (
                  <div key={idx} className="space-y-1 border-b pb-2 border-dashed border-gray-200 last:border-0">
                    <div className="flex">
                      <span className="font-semibold w-20">{t("lens")} {idx + 1}:</span>
                      <span>{lens.brand} {lens.type}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold w-20">{t("power")}:</span>
                      <span>{lens.power}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold w-20">BC:</span>
                      <span>{lens.bc}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold w-20">{t("diameter")}:</span>
                      <span>{lens.diameter}</span>
                    </div>
                    {lens.color && (
                      <div className="flex">
                        <span className="font-semibold w-20">{t("color")}:</span>
                        <span>{lens.color}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!isContactLens && (
          <div className="mb-6 bg-muted/10 p-4 rounded-lg border">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
              <Eye className="w-5 h-5" />
              {t("prescriptionDetails")}
            </h3>
            <table className="w-full border-collapse bg-white">
              <thead className="bg-muted">
                <tr>
                  <th className="border p-2 text-center">{t("eye")}</th>
                  <th className="border p-2 text-center">SPH</th>
                  <th className="border p-2 text-center">CYL</th>
                  <th className="border p-2 text-center">AXIS</th>
                  <th className="border p-2 text-center">ADD</th>
                  <th className="border p-2 text-center">PD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium text-center">{t("rightEye")} (OD)</td>
                  <td className="border p-2 text-center">{rx?.sphereOD || "_____"}</td>
                  <td className="border p-2 text-center">{rx?.cylOD || "_____"}</td>
                  <td className="border p-2 text-center">{rx?.axisOD || "_____"}</td>
                  <td className="border p-2 text-center">{rx?.addOD || "_____"}</td>
                  <td className="border p-2 text-center">{rx?.pdRight || "_____"}</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium text-center">{t("leftEye")} (OS)</td>
                  <td className="border p-2 text-center">{rx?.sphereOS || "_____"}</td>
                  <td className="border p-2 text-center">{rx?.cylOS || "_____"}</td>
                  <td className="border p-2 text-center">{rx?.axisOS || "_____"}</td>
                  <td className="border p-2 text-center">{rx?.addOS || "_____"}</td>
                  <td className="border p-2 text-center">{rx?.pdLeft || "_____"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        {isContactLens && contactLensRx && (
          <div className="mb-6 bg-muted/10 p-4 rounded-lg border">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
              <Eye className="w-5 h-5" />
              {t("contactLensPrescription")}
            </h3>
            <table className="w-full border-collapse bg-white">
              <thead className="bg-muted">
                <tr>
                  <th className="border p-2 text-center">{t("eye")}</th>
                  <th className="border p-2 text-center">Sphere</th>
                  <th className="border p-2 text-center">Cylinder</th>
                  <th className="border p-2 text-center">Axis</th>
                  <th className="border p-2 text-center">BC</th>
                  <th className="border p-2 text-center">Dia</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium text-center">{t("rightEye")} (OD)</td>
                  <td className="border p-2 text-center">{contactLensRx.rightEye.sphere || "_____"}</td>
                  <td className="border p-2 text-center">{contactLensRx.rightEye.cylinder || "_____"}</td>
                  <td className="border p-2 text-center">{contactLensRx.rightEye.axis || "_____"}</td>
                  <td className="border p-2 text-center">{contactLensRx.rightEye.bc || "_____"}</td>
                  <td className="border p-2 text-center">{contactLensRx.rightEye.dia || "_____"}</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium text-center">{t("leftEye")} (OS)</td>
                  <td className="border p-2 text-center">{contactLensRx.leftEye.sphere || "_____"}</td>
                  <td className="border p-2 text-center">{contactLensRx.leftEye.cylinder || "_____"}</td>
                  <td className="border p-2 text-center">{contactLensRx.leftEye.axis || "_____"}</td>
                  <td className="border p-2 text-center">{contactLensRx.leftEye.bc || "_____"}</td>
                  <td className="border p-2 text-center">{contactLensRx.leftEye.dia || "_____"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {!isContactLens && (
          <div className="space-y-4">
            <div className="bg-muted/10 p-4 rounded-lg border">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
                <Ruler className="w-5 h-5" />
                {t("lensDetails")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex">
                    <span className="font-semibold w-20">{t("type")}:</span>
                    <span>{lensTypeValue}</span>
                  </div>
                  {coatingValue && (
                    <div className="flex">
                      <span className="font-semibold w-20">{t("coating")}:</span>
                      <span>{coatingValue}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="font-semibold w-20">{t("price")}:</span>
                    <span>{invoice.lensPrice.toFixed(2)} KWD</span>
                  </div>
                  {coatingValue && (
                    <div className="flex">
                      <span className="font-semibold w-20">{t("coatingPrice")}:</span>
                      <span>{invoice.coatingPrice.toFixed(2)} KWD</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-muted/10 p-4 rounded-lg border mt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
            <CircleDot className="w-5 h-5" />
            {t("additionalNotes")}
          </h3>
          <div className="border rounded p-4 min-h-[100px] bg-white"></div>
        </div>

        <div className="mt-8 pt-4 border-t grid grid-cols-2 gap-6">
          <div>
            <p className="font-semibold text-primary">{t("technicianSignature")}</p>
            <div className="mt-6 border-b w-40 h-8"></div>
            <div className="mt-2 text-sm text-muted-foreground">{t("date")}: ___ / ___ / _____</div>
          </div>
          <div>
            <p className="font-semibold text-primary">{t("qualityConfirmation")}</p>
            <div className="flex items-center mt-6 gap-2">
              <BadgeCheck className="w-6 h-6 text-primary" />
              <div className="border-b w-32 h-8"></div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{t("date")}: ___ / ___ / _____</div>
          </div>
        </div>
      </div>
    </div>
  );
};
