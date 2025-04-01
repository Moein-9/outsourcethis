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
  
  // Get prescription data from multiple possible sources with fallbacks
  const rxData = rx || invoice.rx || (invoice as any).rx || {
    sphereOD: '',
    cylOD: '',
    axisOD: '',
    addOD: '',
    pdOD: '',
    sphereOS: '',
    cylOS: '',
    axisOS: '',
    addOS: '',
    pdOS: '',
    pd: ''
  };
  
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
  const date = format(new Date(invoice.createdAt || new Date()), "dd/MM/yyyy");

  return (
    <div className="print-wrapper">
      <div id="thermal-print" className={`px-2 py-3 ${dirClass}`}>
        <div className="print-section text-center">
          <MoenLogo className="mx-auto h-12 mb-1" />
          <h2 className="print-text-lg font-bold">{storeInfo.name}</h2>
          <p className="print-text-sm">{storeInfo.address}</p>
          <p className="print-text-sm">{t('phone')}: {storeInfo.phone}</p>
        </div>

        <div className="print-section mb-4">
          <div className="bg-black text-white py-1 text-center rounded print-text-md font-bold">
            {language === 'ar' ? "أمر عمل | WORK ORDER" : "WORK ORDER | أمر عمل"}
          </div>
          <div className="text-center my-1">
            <p className="font-bold">
              {language === 'ar' ? "رقم الطلب: " : "Order Number: "}
              {orderNumber}
            </p>
            <p className="text-xs">{date}</p>
          </div>
        </div>

        <div className="print-section mb-4">
          <div className="bg-black text-white py-1 text-center rounded print-text-md font-bold">
            {language === 'ar' ? "معلومات العميل | Customer Info" : "Customer Info | معلومات العميل"}
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold"><User className="inline h-4 w-4 mr-1" /> {t('name')}:</span>
              <span>{name}</span>
            </div>
            {phone && (
              <div className="flex justify-between items-center">
                <span className="font-semibold"><Phone className="inline h-4 w-4 mr-1" /> {t('phone')}:</span>
                <span>{phone}</span>
              </div>
            )}
          </div>
        </div>

        <div className="print-section mb-4">
          <div className="bg-black text-white py-1 text-center rounded print-text-md font-bold">
            {language === 'ar' ? "معلومات الوصفة | Prescription Info" : "Prescription Info | معلومات الوصفة"}
          </div>
          <div className="mt-2">
            <div className="text-center mb-1">
              <strong className="flex items-center justify-center">
                <Eye className="h-4 w-4 mr-1" /> {t('glassesRx')}
              </strong>
            </div>
            <table className="w-full border-collapse" style={{ direction: 'ltr' }}>
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-500 px-1 py-0.5 text-xs">Eye</th>
                  <th className="border border-gray-500 px-1 py-0.5 text-xs">SPH</th>
                  <th className="border border-gray-500 px-1 py-0.5 text-xs">CYL</th>
                  <th className="border border-gray-500 px-1 py-0.5 text-xs">AXIS</th>
                  <th className="border border-gray-500 px-1 py-0.5 text-xs">ADD</th>
                  <th className="border border-gray-500 px-1 py-0.5 text-xs">PD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-500 px-1 py-0.5 text-xs font-semibold">OD</td>
                  <td className="border border-gray-500 px-1 py-0.5 text-xs">{rxData.sphereOD || "—"}</td>
                  <td className="border border-gray-500 px-1 py-0.5 text-xs">{rxData.cylOD || "—"}</td>
                  <td className="border border-gray-500 px-1 py-0.5 text-xs">{rxData.axisOD || "—"}</td>
                  <td className="border border-gray-500 px-1 py-0.5 text-xs">{rxData.addOD || rxData.add || "—"}</td>
                  <td className="border border-gray-500 px-1 py-0.5 text-xs">{rxData.pdOD || rxData.pdRight || (rxData.pd ? rxData.pd : "—")}</td>
                </tr>
                <tr>
                  <td className="border border-gray-500 px-1 py-0.5 text-xs font-semibold">OS</td>
                  <td className="border border-gray-500 px-1 py-0.5 text-xs">{rxData.sphereOS || "—"}</td>
                  <td className="border border-gray-500 px-1 py-0.5 text-xs">{rxData.cylOS || "—"}</td>
                  <td className="border border-gray-500 px-1 py-0.5 text-xs">{rxData.axisOS || "—"}</td>
                  <td className="border border-gray-500 px-1 py-0.5 text-xs">{rxData.addOS || rxData.add || "—"}</td>
                  <td className="border border-gray-500 px-1 py-0.5 text-xs">{rxData.pdOS || rxData.pdLeft || (rxData.pd ? rxData.pd : "—")}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-between mt-1 text-xs">
              <span>OD = {language === 'ar' ? "اليمين" : "Right"}</span>
              <span>OS = {language === 'ar' ? "اليسار" : "Left"}</span>
            </div>
          </div>

          {/* Contact lens prescription if available */}
          {contactLensRxData && (
            <div className="mt-3">
              <div className="text-center mb-1">
                <strong className="flex items-center justify-center">
                  <Contact className="h-4 w-4 mr-1" /> {t('contactLensRx')}
                </strong>
              </div>
              <table className="w-full border-collapse" style={{ direction: 'ltr' }}>
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-500 px-1 py-0.5 text-xs">Eye</th>
                    <th className="border border-gray-500 px-1 py-0.5 text-xs">SPH</th>
                    <th className="border border-gray-500 px-1 py-0.5 text-xs">CYL</th>
                    <th className="border border-gray-500 px-1 py-0.5 text-xs">AXIS</th>
                    <th className="border border-gray-500 px-1 py-0.5 text-xs">BC</th>
                    <th className="border border-gray-500 px-1 py-0.5 text-xs">DIA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-500 px-1 py-0.5 text-xs font-semibold">R</td>
                    <td className="border border-gray-500 px-1 py-0.5 text-xs">{contactLensRxData?.rightEye?.sphere || "—"}</td>
                    <td className="border border-gray-500 px-1 py-0.5 text-xs">{contactLensRxData?.rightEye?.cylinder || "—"}</td>
                    <td className="border border-gray-500 px-1 py-0.5 text-xs">{contactLensRxData?.rightEye?.axis || "—"}</td>
                    <td className="border border-gray-500 px-1 py-0.5 text-xs">{contactLensRxData?.rightEye?.bc || "—"}</td>
                    <td className="border border-gray-500 px-1 py-0.5 text-xs">{contactLensRxData?.rightEye?.dia || "—"}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-500 px-1 py-0.5 text-xs font-semibold">L</td>
                    <td className="border border-gray-500 px-1 py-0.5 text-xs">{contactLensRxData?.leftEye?.sphere || "—"}</td>
                    <td className="border border-gray-500 px-1 py-0.5 text-xs">{contactLensRxData?.leftEye?.cylinder || "—"}</td>
                    <td className="border border-gray-500 px-1 py-0.5 text-xs">{contactLensRxData?.leftEye?.axis || "—"}</td>
                    <td className="border border-gray-500 px-1 py-0.5 text-xs">{contactLensRxData?.leftEye?.bc || "—"}</td>
                    <td className="border border-gray-500 px-1 py-0.5 text-xs">{contactLensRxData?.leftEye?.dia || "—"}</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-between mt-1 text-xs">
                <span>R = {language === 'ar' ? "اليمين" : "Right"}</span>
                <span>L = {language === 'ar' ? "اليسار" : "Left"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Frame Details */}
        {invoiceType === 'glasses' && frameData && (
          <div className="print-section mb-4">
            <div className="bg-black text-white py-1 text-center rounded print-text-md font-bold">
              {language === 'ar' ? "تفاصيل الإطار | Frame Details" : "Frame Details | تفاصيل الإطار"}
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold"><Glasses className="inline h-4 w-4 mr-1" /> {t('brand')}:</span>
                <span>{frameData.brand}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">{t('model')}:</span>
                <span>{frameData.model}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">{t('color')}:</span>
                <span>{frameData.color}</span>
              </div>
              {frameData.size && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{t('size')}:</span>
                  <span>{frameData.size}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lens Details */}
        {invoiceType === 'glasses' && lensTypeValue && (
          <div className="print-section mb-4">
            <div className="bg-black text-white py-1 text-center rounded print-text-md font-bold">
              {language === 'ar' ? "تفاصيل العدسة | Lens Details" : "Lens Details | تفاصيل العدسة"}
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold"><Ruler className="inline h-4 w-4 mr-1" /> {t('type')}:</span>
                <span>{lensTypeValue}</span>
              </div>
              {coatingValue && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{t('coating')}:</span>
                  <span>{coatingValue}</span>
                </div>
              )}
              {thicknessValue && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{t('thickness')}:</span>
                  <span>{thicknessValue}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Lens Details */}
        {isContactLens && (
          <div className="print-section mb-4">
            <div className="bg-black text-white py-1 text-center rounded print-text-md font-bold">
              {language === 'ar' ? "تفاصيل العدسات اللاصقة | Contact Lens Details" : "Contact Lens Details | تفاصيل العدسات اللاصقة"}
            </div>
            <div className="mt-2 space-y-1">
              {contactLensItems.map((lens, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-semibold"><Contact className="inline h-4 w-4 mr-1" /> {t('lens')} {index + 1}:</span>
                  <span>{lens.brand} {lens.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div className="print-section mb-4">
          <div className="bg-black text-white py-1 text-center rounded print-text-md font-bold">
            {language === 'ar' ? "معلومات الدفع | Payment Information" : "Payment Information | معلومات الدفع"}
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{t('total')}:</span>
              <span>{invoice.total.toFixed(3)} KWD</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">{t('deposit')}:</span>
              <span>{invoice.deposit.toFixed(3)} KWD</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">{t('remaining')}:</span>
              <span className="font-bold">{(invoice.total - invoice.deposit).toFixed(3)} KWD</span>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="print-section mb-4">
          <div className="bg-black text-white py-1 text-center rounded print-text-md font-bold">
            {language === 'ar' ? "ملاحظات إضافية | Additional Notes" : "Additional Notes | ملاحظات إضافية"}
          </div>
          <div className="mt-2 border border-gray-300 rounded p-1 min-h-16">
            {/* Notes will be written here */}
          </div>
        </div>

        {/* Signatures */}
        <div className="print-section mt-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs font-semibold mb-1">{t('technicianSignature')}</p>
              <div className="border-b border-black w-full"></div>
              <p className="text-xs mt-1">{t('date')}: ___/___/_____</p>
            </div>
            <div>
              <p className="text-xs font-semibold mb-1">{t('qualityConfirmation')}</p>
              <div className="border-b border-black w-full"></div>
              <p className="text-xs mt-1">{t('date')}: ___/___/_____</p>
            </div>
          </div>
        </div>

        {/* Store Information Footer */}
        <div className="print-section mt-4 pt-3 border-t border-gray-300 text-center text-xs text-gray-500">
          <p>{storeInfo.name}</p>
          <p>{storeInfo.address}</p>
          <p>{t('phone')}: {storeInfo.phone}</p>
        </div>

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
      </div>
    </div>
  );
};
