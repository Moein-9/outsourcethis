
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
              margin-bottom: 2mm !important;
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
              font-size: 11pt !important;
              font-weight: bold !important;
              margin: 2mm 0 !important;
              padding: 1mm !important;
              background-color: black !important;
              color: white !important;
              display: flex !important;
              align-items: center !important;
              justify-content: space-between !important;
            }
            
            .section-heading svg {
              margin-right: 2mm !important;
              color: white !important;
            }
            
            .data-row {
              display: flex !important;
              justify-content: space-between !important;
              margin-bottom: 1mm !important;
              font-size: 10pt !important;
            }
            
            .data-label {
              font-weight: bold !important;
              min-width: 25mm !important;
            }
            
            .data-value {
              flex: 1 !important;
              text-align: ${language === 'ar' ? 'right' : 'left'} !important;
            }
            
            .product-card {
              border: 0.5mm solid #ddd !important;
              border-radius: 2mm !important;
              padding: 2mm !important;
              margin-bottom: 2mm !important;
            }

            .product-title {
              font-weight: bold !important;
              border-bottom: 0.2mm solid #ddd !important;
              padding-bottom: 1mm !important;
              margin-bottom: 1mm !important;
              display: flex !important;
              justify-content: space-between !important;
            }
            
            .signature-box {
              border: 0.5mm solid #ccc !important;
              border-radius: 2mm !important;
              padding: 2mm !important;
              margin-top: 2mm !important;
              width: 36mm !important;
            }
            
            .signature-title {
              font-weight: bold !important;
              font-size: 10pt !important;
              margin-bottom: 2mm !important;
              display: flex !important;
              align-items: center !important;
            }
            
            .signature-line {
              border-bottom: 0.3mm solid #000 !important;
              height: 8mm !important;
              margin: 2mm 0 !important;
            }
            
            .date-line {
              font-size: 9pt !important;
              margin-top: 1mm !important;
            }

            .notes-box {
              border: 0.5mm solid #ccc !important;
              border-radius: 2mm !important;
              min-height: 15mm !important;
              margin-top: 2mm !important;
              padding: 1mm !important;
            }

            .signature-row {
              display: flex !important;
              justify-content: space-between !important;
              margin-top: 3mm !important;
            }
          }
        `}
      </style>

      <div id="work-order-print" className={dirClass} style={{ width: "80mm", padding: "2mm" }}>
        <div style={{ textAlign: "center", marginBottom: "3mm", position: "relative" }}>
          <div className="absolute right-0 top-0 hide-print">
            <ClipboardCheck className="w-10 h-10 text-primary" />
          </div>
          <MoenLogo className="mx-auto w-auto" style={{ height: "9mm", marginBottom: "1mm" }} />
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1mm", fontSize: "14pt", fontWeight: "bold", margin: "0" }}>
            <span>{t("workOrder")}</span>
            <span style={{ fontSize: "10pt" }}>{language === 'ar' ? '(Work Order)' : '(أمر عمل)'}</span>
          </div>
          <p style={{ fontSize: "13pt", margin: "0.5mm 0", color: "#333" }}>{orderNumber}</p>
          <p style={{ fontSize: "9pt", margin: "0.5mm 0", color: "#666" }}>
            {format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}
          </p>
          <div style={{ fontSize: "8pt", textAlign: "center", marginTop: "0.5mm" }}>
            <p style={{ margin: "0" }}>{storeInfo.address}</p>
            <p style={{ margin: "0" }}>{t("phone")}: {storeInfo.phone}</p>
          </div>
        </div>

        <div className="section-heading">
          <span>
            {t("patientInformation")} {language === 'ar' ? '(Patient Info)' : '(معلومات المريض)'}
          </span>
        </div>
        
        <div style={{ padding: "0 2mm", marginBottom: "3mm" }}>
          <div className="data-row">
            <span className="data-label">{t("name")}:</span>
            <span className="data-value">{name}</span>
          </div>
          <div className="data-row">
            <span className="data-label">{t("phone")}:</span>
            <span className="data-value">{phone}</span>
          </div>
        </div>

        {invoiceType === 'glasses' && frameData && (
          <>
            <div className="section-heading">
              <span>
                {t("productDetails")} {language === 'ar' ? '(Product Details)' : '(تفاصيل المنتج)'}
              </span>
            </div>
            <div style={{ padding: "0 2mm", marginBottom: "3mm" }}>
              <div className="product-card">
                <div className="product-title">
                  <span>{language === 'ar' ? 'الإطار' : 'Frame'}</span>
                  <span style={{ fontSize: "8pt" }}>{language === 'ar' ? '(Frame)' : '(الإطار)'}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">{t("brand")}:</span>
                  <span className="data-value">{frameData.brand}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">{t("model")}:</span>
                  <span className="data-value">{frameData.model}</span>
                </div>
                <div className="data-row">
                  <span className="data-label">{t("color")}:</span>
                  <span className="data-value">{frameData.color}</span>
                </div>
                {frameData.size && (
                  <div className="data-row">
                    <span className="data-label">{t("size")}:</span>
                    <span className="data-value">{frameData.size}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        
        {isContactLens && (
          <>
            <div className="section-heading">
              <span>
                {t("contactLensDetails")} {language === 'ar' ? '(Contact Lens Details)' : '(تفاصيل العدسات اللاصقة)'}
              </span>
            </div>
            <div style={{ padding: "0 2mm", marginBottom: "3mm" }}>
              {contactLensItems.map((lens, idx) => (
                <div key={idx} className="product-card">
                  <div className="product-title">
                    <span>{language === 'ar' ? 'العدسات اللاصقة' : 'Contact Lens'} {idx + 1}</span>
                    <span style={{ fontSize: "8pt" }}>{language === 'ar' ? '(Contact Lens)' : '(العدسات اللاصقة)'}</span>
                  </div>
                  <div className="data-row">
                    <span className="data-label">{t("brand")}:</span>
                    <span className="data-value">{lens.brand}</span>
                  </div>
                  <div className="data-row">
                    <span className="data-label">{t("type")}:</span>
                    <span className="data-value">{lens.type}</span>
                  </div>
                  {lens.color && (
                    <div className="data-row">
                      <span className="data-label">{t("color")}:</span>
                      <span className="data-value">{lens.color}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {invoiceType === 'glasses' && rx && (
          <>
            <div className="section-heading">
              <span>
                {t("prescriptionDetails")} {language === 'ar' ? '(Prescription Details)' : '(تفاصيل الوصفة الطبية)'}
              </span>
            </div>
            <div style={{ padding: "0 2mm", marginBottom: "3mm", direction: "ltr" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>{t("eye")}</th>
                    <th style={{ textAlign: "center" }}>SPH</th>
                    <th style={{ textAlign: "center" }}>CYL</th>
                    <th style={{ textAlign: "center" }}>AXIS</th>
                    <th style={{ textAlign: "center" }}>ADD</th>
                    <th style={{ textAlign: "center" }}>PD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "center", fontWeight: "bold" }}>OD {language === 'ar' ? '(يمين)' : 'R'}</td>
                    <td style={{ textAlign: "center" }}>{rx?.sphereOD || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{rx?.cylOD || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{rx?.axisOD || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{rx?.addOD || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{rx?.pdRight || rx?.pd || "_____"}</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "center", fontWeight: "bold" }}>OS {language === 'ar' ? '(يسار)' : 'L'}</td>
                    <td style={{ textAlign: "center" }}>{rx?.sphereOS || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{rx?.cylOS || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{rx?.axisOS || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{rx?.addOS || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{rx?.pdLeft || rx?.pd || "_____"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
        
        {isContactLens && contactLensRxData && (
          <>
            <div className="section-heading">
              <span>
                {t("contactLensPrescription")} {language === 'ar' ? '(Contact Lens Prescription)' : '(وصفة العدسات اللاصقة)'}
              </span>
            </div>
            <div style={{ padding: "0 2mm", marginBottom: "3mm", direction: "ltr" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>{t("eye")}</th>
                    <th style={{ textAlign: "center" }}>SPH</th>
                    <th style={{ textAlign: "center" }}>CYL</th>
                    <th style={{ textAlign: "center" }}>AXIS</th>
                    <th style={{ textAlign: "center" }}>BC</th>
                    <th style={{ textAlign: "center" }}>DIA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "center", fontWeight: "bold" }}>OD {language === 'ar' ? '(يمين)' : 'R'}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRxData.rightEye.sphere || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRxData.rightEye.cylinder || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRxData.rightEye.axis || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRxData.rightEye.bc || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRxData.rightEye.dia || "_____"}</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "center", fontWeight: "bold" }}>OS {language === 'ar' ? '(يسار)' : 'L'}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRxData.leftEye.sphere || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRxData.leftEye.cylinder || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRxData.leftEye.axis || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRxData.leftEye.bc || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRxData.leftEye.dia || "_____"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {invoiceType === 'glasses' && lensTypeValue && (
          <>
            <div className="product-card" style={{ margin: "0 2mm 3mm 2mm" }}>
              <div className="product-title">
                <span>{language === 'ar' ? 'العدسات' : 'Lenses'}</span>
                <span style={{ fontSize: "8pt" }}>{language === 'ar' ? '(Lenses)' : '(العدسات)'}</span>
              </div>
              <div className="data-row">
                <span className="data-label">{t("type")}:</span>
                <span className="data-value">{lensTypeValue}</span>
              </div>
              {coatingValue && (
                <div className="data-row">
                  <span className="data-label">{t("coating")}:</span>
                  <span className="data-value">{coatingValue}</span>
                </div>
              )}
              {thicknessValue && (
                <div className="data-row">
                  <span className="data-label">{t("thickness")}:</span>
                  <span className="data-value">{thicknessValue}</span>
                </div>
              )}
            </div>
          </>
        )}

        <div className="section-heading">
          <span>
            {t("notes")} {language === 'ar' ? '(Notes)' : '(ملاحظات)'}
          </span>
        </div>
        <div style={{ padding: "0 2mm", marginBottom: "3mm" }}>
          <div className="notes-box"></div>
        </div>

        <div className="signature-row">
          <div className="signature-box">
            <p className="signature-title">
              {t("technicianSignature")} {language === 'ar' ? '(Technician)' : '(الفني)'}
            </p>
            <div className="signature-line"></div>
            <div className="date-line">{t("date")}: ___ / ___ / _____</div>
          </div>
          
          <div className="signature-box">
            <p className="signature-title">
              {t("qualityConfirmation")} {language === 'ar' ? '(QC)' : '(مراقبة الجودة)'}
            </p>
            <div className="signature-line"></div>
            <div className="date-line">{t("date")}: ___ / ___ / _____</div>
          </div>
        </div>
      </div>
    </div>
  );
};
