
import React from "react";
import { format } from "date-fns";
import { Invoice } from "@/store/invoiceStore";
import { Eye, Ruler, CircleDot, ClipboardCheck, User, Glasses, BadgeCheck, Contact, Calendar, Phone, Home } from "lucide-react";
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
  thickness?: string;
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
  thickness,
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
  const thicknessValue = thickness || (invoice as any).thickness;
  
  const contactLensItems = contactLenses || (invoice as any).contactLensItems || [];
  const contactLensRxData = contactLensRx || (invoice as any).contactLensRx;
  
  const frameData = frame || (invoice.frameBrand ? {
    brand: invoice.frameBrand,
    model: invoice.frameModel,
    color: invoice.frameColor,
    size: invoice.frameSize || "",
    price: invoice.framePrice
  } : undefined);
  
  const isContactLens = contactLensItems && contactLensItems.length > 0;
  const invoiceType = (invoice as any).invoiceType || 'glasses';
  
  const orderNumber = invoice.workOrderId || "NEW ORDER";
  const date = format(new Date(invoice.createdAt), "dd/MM/yyyy");

  return (
    <div className="print-wrapper">
      <style>
        {`
          @media print {
            .hide-print {
              display: none !important;
            }
    
            @page {
              size: 80mm auto !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            /* Reset visibility */
            * {
              visibility: visible !important;
            }

            html, body {
              width: 80mm !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            .print-wrapper {
              visibility: visible !important;
              width: 80mm !important;
            }

            #thermal-print {
              visibility: visible !important;
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 80mm !important;
              padding: 0mm !important;
              margin: 0 !important;
              background: white !important;
            }

            /* Content styles */
            .print-section {
              width: 75mm !important;
              margin-bottom: 3mm !important;
              padding: 0 1mm !important;
            }

            .print-text-lg { font-size: 14pt !important; }
            .print-text-md { font-size: 12pt !important; }
            .print-text-sm { font-size: 10pt !important; }

            table {
              width: 100% !important;
              border-collapse: collapse !important;
              direction: ltr !important;
            }

            td, th {
              border: 0.2mm solid black !important;
              padding: 1mm !important;
              text-align: center !important;
              font-size: 9pt !important;
            }
            
            th {
              font-weight: bold !important;
              background-color: #f0f0f0 !important;
            }
            
            .section-heading {
              font-size: 12pt !important;
              font-weight: bold !important;
              margin: 4mm 0 2mm 0 !important;
              border-bottom: 0.3mm solid #000 !important;
              padding-bottom: 1mm !important;
              display: flex !important;
              align-items: center !important;
            }
            
            .section-heading svg {
              margin-right: 2mm !important;
            }
            
            .data-row {
              display: flex !important;
              justify-content: space-between !important;
              margin-bottom: 1mm !important;
              font-size: 10pt !important;
            }
            
            .data-label {
              font-weight: bold !important;
              min-width: 30mm !important;
            }
            
            .data-value {
              flex: 1 !important;
              text-align: ${language === 'ar' ? 'right' : 'left'} !important;
            }
            
            .signature-line {
              border-bottom: 0.3mm solid #000 !important;
              width: 50mm !important;
              height: 8mm !important;
              margin: 2mm 0 !important;
            }
            
            .date-line {
              font-size: 9pt !important;
              margin-top: 1mm !important;
            }
          }
        `}
      </style>

      <div id="work-order-print" className={`${dirClass} bg-white`} style={{ width: "80mm", padding: "2mm" }}>
        {/* Header with logo and title */}
        <div className="flex flex-col items-center justify-center border-b border-gray-300 pb-2 mb-3">
          <MoenLogo className="h-10 mb-2" />
          <h1 className="text-xl font-bold">{t("workOrder")}</h1>
          <div className="flex justify-between items-center w-full mt-1">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="text-sm">{date}</span>
            </div>
            <div className="text-sm text-primary font-bold">#{orderNumber}</div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="mb-3 border-b border-gray-300 pb-2">
          <div className="font-semibold flex items-center mb-2 text-primary">
            <User className="w-4 h-4 mr-1" />
            {t("patientInformation")}
          </div>
          <div className="space-y-1">
            <div className="flex items-start">
              <div className="w-5 flex-shrink-0 text-gray-500">
                <User className="w-4 h-4" />
              </div>
              <div className="ml-1">
                <div className="font-medium">{name}</div>
              </div>
            </div>
            {phone && (
              <div className="flex items-start">
                <div className="w-5 flex-shrink-0 text-gray-500">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="ml-1">{phone}</div>
              </div>
            )}
            {invoice.patientId && (
              <div className="flex items-start">
                <div className="w-5 flex-shrink-0 text-gray-500">
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <div className="ml-1 text-sm text-gray-600">ID: {invoice.patientId}</div>
              </div>
            )}
          </div>
        </div>

        {/* Frame Details */}
        {invoiceType === 'glasses' && frameData && (
          <div className="mb-3 border-b border-gray-300 pb-2">
            <div className="font-semibold flex items-center mb-2 text-primary">
              <Glasses className="w-4 h-4 mr-1" />
              {t("frameDetails")}
            </div>
            <div className="space-y-1 text-sm">
              <div className="grid grid-cols-3 gap-1">
                <div className="font-medium">{t("brand")}:</div>
                <div className="col-span-2">{frameData.brand}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="font-medium">{t("model")}:</div>
                <div className="col-span-2">{frameData.model}</div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="font-medium">{t("color")}:</div>
                <div className="col-span-2">{frameData.color}</div>
              </div>
              {frameData.size && (
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">{t("size")}:</div>
                  <div className="col-span-2">{frameData.size}</div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Contact Lens Details */}
        {isContactLens && (
          <div className="mb-3 border-b border-gray-300 pb-2">
            <div className="font-semibold flex items-center mb-2 text-primary">
              <Contact className="w-4 h-4 mr-1" />
              {t("contactLensDetails")}
            </div>
            <div className="space-y-2 text-sm">
              {contactLensItems.map((lens, idx) => (
                <div key={idx} className={idx < contactLensItems.length - 1 ? "pb-1 border-b border-dashed border-gray-200" : ""}>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="font-medium">{t("lens")} {idx + 1}:</div>
                    <div className="col-span-2">{lens.brand} {lens.type}</div>
                  </div>
                  {lens.color && (
                    <div className="grid grid-cols-3 gap-1">
                      <div className="font-medium">{t("color")}:</div>
                      <div className="col-span-2">{lens.color}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prescription Details */}
        {invoiceType === 'glasses' && rx && (
          <div className="mb-3 border-b border-gray-300 pb-2">
            <div className="font-semibold flex items-center mb-2 text-primary">
              <Eye className="w-4 h-4 mr-1" />
              {t("prescriptionDetails")}
            </div>
            <div className="text-xs">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-1 text-center">{t("eye")}</th>
                    <th className="border border-gray-300 p-1 text-center">SPH</th>
                    <th className="border border-gray-300 p-1 text-center">CYL</th>
                    <th className="border border-gray-300 p-1 text-center">AXIS</th>
                    <th className="border border-gray-300 p-1 text-center">ADD</th>
                    <th className="border border-gray-300 p-1 text-center">PD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-1 text-center font-semibold">R</td>
                    <td className="border border-gray-300 p-1 text-center">{rx?.sphereOD || "-"}</td>
                    <td className="border border-gray-300 p-1 text-center">{rx?.cylOD || "-"}</td>
                    <td className="border border-gray-300 p-1 text-center">{rx?.axisOD || "-"}</td>
                    <td className="border border-gray-300 p-1 text-center">{rx?.addOD || "-"}</td>
                    <td className="border border-gray-300 p-1 text-center">{rx?.pdRight || rx?.pd || "-"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-1 text-center font-semibold">L</td>
                    <td className="border border-gray-300 p-1 text-center">{rx?.sphereOS || "-"}</td>
                    <td className="border border-gray-300 p-1 text-center">{rx?.cylOS || "-"}</td>
                    <td className="border border-gray-300 p-1 text-center">{rx?.axisOS || "-"}</td>
                    <td className="border border-gray-300 p-1 text-center">{rx?.addOS || "-"}</td>
                    <td className="border border-gray-300 p-1 text-center">{rx?.pdLeft || rx?.pd || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Contact Lens Prescription */}
        {isContactLens && contactLensRxData && (
          <div className="mb-3 border-b border-gray-300 pb-2">
            <div className="font-semibold flex items-center mb-2 text-primary">
              <Eye className="w-4 h-4 mr-1" />
              {t("contactLensPrescription")}
            </div>
            <div className="text-xs">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-1 text-center">{t("eye")}</th>
                    <th className="border border-gray-300 p-1 text-center">SPH</th>
                    <th className="border border-gray-300 p-1 text-center">CYL</th>
                    <th className="border border-gray-300 p-1 text-center">AXIS</th>
                    <th className="border border-gray-300 p-1 text-center">BC</th>
                    <th className="border border-gray-300 p-1 text-center">DIA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-1 text-center font-semibold">R</td>
                    <td className="border border-gray-300 p-1 text-center">{contactLensRxData.rightEye.sphere || "-"}</td>
                    <td className="border border-gray-300 p-1 text-center">{contactLensRxData.rightEye.cylinder || "-"}</td>
                    <td className="border border-gray-300 p-1 text-center">{contactLensRxData.rightEye.axis || "-"}</td>
                    <td className="border border-gray-300 p-1 text-center">{contactLensRxData.rightEye.bc || "-"}</td>
                    <td className="border border-gray-300 p-1 text-center">{contactLensRxData.rightEye.dia || "-"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-1 text-center font-semibold">L</td>
                    <td className="border border-gray-300 p-1 text-center">{contactLensRxData.leftEye.sphere || "-"}</td>
                    <td className="border border-gray-300 p-1 text-center">{contactLensRxData.leftEye.cylinder || "-"}</td>
                    <td className="border border-gray-300 p-1 text-center">{contactLensRxData.leftEye.axis || "-"}</td>
                    <td className="border border-gray-300 p-1 text-center">{contactLensRxData.leftEye.bc || "-"}</td>
                    <td className="border border-gray-300 p-1 text-center">{contactLensRxData.leftEye.dia || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Lens Details */}
        {invoiceType === 'glasses' && lensTypeValue && (
          <div className="mb-3 border-b border-gray-300 pb-2">
            <div className="font-semibold flex items-center mb-2 text-primary">
              <Ruler className="w-4 h-4 mr-1" />
              {t("lensDetails")}
            </div>
            <div className="space-y-1 text-sm">
              <div className="grid grid-cols-3 gap-1">
                <div className="font-medium">{t("type")}:</div>
                <div className="col-span-2">{lensTypeValue}</div>
              </div>
              {coatingValue && (
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">{t("coating")}:</div>
                  <div className="col-span-2">{coatingValue}</div>
                </div>
              )}
              {thicknessValue && (
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">{t("thickness")}:</div>
                  <div className="col-span-2">{thicknessValue}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div className="mb-3 border-b border-gray-300 pb-2">
          <div className="font-semibold flex items-center mb-2 text-primary">
            <Home className="w-4 h-4 mr-1" />
            {t("paymentInformation")}
          </div>
          <div className="space-y-1 text-sm">
            <div className="grid grid-cols-3 gap-1">
              <div className="font-medium">{t("total")}:</div>
              <div className="col-span-2">{invoice.total.toFixed(3)} KWD</div>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div className="font-medium">{t("deposit")}:</div>
              <div className="col-span-2">{invoice.deposit.toFixed(3)} KWD</div>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div className="font-medium">{t("remaining")}:</div>
              <div className="col-span-2 font-bold">{(invoice.total - invoice.deposit).toFixed(3)} KWD</div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mb-3 border-b border-gray-300 pb-2">
          <div className="font-semibold flex items-center mb-2 text-primary">
            <CircleDot className="w-4 h-4 mr-1" />
            {t("additionalNotes")}
          </div>
          <div className="border border-gray-300 rounded min-h-16 p-1 text-sm">
            {/* Notes will be written here */}
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-4 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs font-semibold mb-4">{t("technicianSignature")}</p>
              <div className="border-b border-black w-full"></div>
              <p className="text-xs mt-1">{t("date")}: ___/___/_____</p>
            </div>
            <div>
              <p className="text-xs font-semibold mb-4">{t("qualityConfirmation")}</p>
              <div className="border-b border-black w-full"></div>
              <p className="text-xs mt-1">{t("date")}: ___/___/_____</p>
            </div>
          </div>
        </div>

        {/* Store Information Footer */}
        <div className="mt-4 pt-3 border-t border-gray-300 text-center text-xs text-gray-500">
          <p>{storeInfo.name}</p>
          <p>{storeInfo.address}</p>
          <p>{t("phone")}: {storeInfo.phone}</p>
        </div>
      </div>
    </div>
  );
};
