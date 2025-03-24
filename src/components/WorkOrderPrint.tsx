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
  const orderNumber = invoice.invoiceId || invoice.workOrderId || "NEW ORDER";

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

      <div id="work-order-print" className={dirClass} style={{ width: "80mm", padding: "2mm" }}>
        <div style={{ textAlign: "center", marginBottom: "5mm", position: "relative" }}>
          <div className="absolute right-0 top-0 hide-print">
            <ClipboardCheck className="w-10 h-10 text-primary" />
          </div>
          <MoenLogo className="mx-auto w-auto" style={{ height: "10mm", marginBottom: "1mm" }} />
          <h1 style={{ fontSize: "16pt", fontWeight: "bold", margin: "1mm 0" }}>{t("workOrder")}</h1>
          <p style={{ fontSize: "14pt", margin: "1mm 0", color: "#333" }}>{orderNumber}</p>
          <p style={{ fontSize: "10pt", margin: "1mm 0", color: "#666" }}>
            {format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}
          </p>
          <div style={{ fontSize: "9pt", textAlign: "center", marginTop: "1mm" }}>
            <p style={{ margin: "0" }}>{storeInfo.address}</p>
            <p style={{ margin: "0" }}>{t("phone")}: {storeInfo.phone}</p>
          </div>
        </div>

        <div className="section-heading">
          <User style={{ width: "4mm", height: "4mm", marginRight: "1mm" }} />
          <span>{t("patientInformation")} {language === 'ar' && '(Patient Information)'}</span>
        </div>
        
        <div style={{ padding: "0 2mm", marginBottom: "4mm" }}>
          <div className="data-row">
            <span className="data-label">{t("name")}:</span>
            <span className="data-value">{name}</span>
          </div>
          <div className="data-row">
            <span className="data-label">{t("phone")}:</span>
            <span className="data-value">{phone}</span>
          </div>
          {invoice.patientId && (
            <div className="data-row">
              <span className="data-label">{t("patientId")}:</span>
              <span className="data-value">{invoice.patientId}</span>
            </div>
          )}
        </div>

        {!isContactLens && frameData && (
          <>
            <div className="section-heading">
              <Glasses style={{ width: "4mm", height: "4mm", marginRight: "1mm" }} />
              <span>{t("frameDetails")} {language === 'ar' && '(Frame Details)'}</span>
            </div>
            <div style={{ padding: "0 2mm", marginBottom: "4mm" }}>
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
              <div className="data-row">
                <span className="data-label">{t("size")}:</span>
                <span className="data-value">{frameData.size || "-"}</span>
              </div>
            </div>
          </>
        )}
        
        {isContactLens && (
          <>
            <div className="section-heading">
              <Contact style={{ width: "4mm", height: "4mm", marginRight: "1mm" }} />
              <span>{t("contactLensDetails")} {language === 'ar' && '(Contact Lens Details)'}</span>
            </div>
            <div style={{ padding: "0 2mm", marginBottom: "4mm" }}>
              {contactLenses.map((lens, idx) => (
                <div key={idx} style={{ marginBottom: "2mm", borderBottom: idx < contactLenses.length - 1 ? "0.2mm dashed #ccc" : "none", paddingBottom: "1mm" }}>
                  <div className="data-row">
                    <span className="data-label">{t("lens")} {idx + 1}:</span>
                    <span className="data-value">{lens.brand} {lens.type}</span>
                  </div>
                  <div className="data-row">
                    <span className="data-label">{t("power")}:</span>
                    <span className="data-value">{lens.power}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!isContactLens && rx && (
          <>
            <div className="section-heading">
              <Eye style={{ width: "4mm", height: "4mm", marginRight: "1mm" }} />
              <span>{t("prescriptionDetails")} {language === 'ar' && '(Prescription Details)'}</span>
            </div>
            <div style={{ padding: "0 2mm", marginBottom: "4mm", direction: "ltr" }}>
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
                    <td style={{ textAlign: "center", fontWeight: "bold" }}>OD {language === 'ar' ? '(Right)' : 'R'}</td>
                    <td style={{ textAlign: "center" }}>{rx?.sphereOD || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{rx?.cylOD || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{rx?.axisOD || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{rx?.addOD || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{rx?.pdRight || rx?.pd || "_____"}</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "center", fontWeight: "bold" }}>OS {language === 'ar' ? '(Left)' : 'L'}</td>
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
        
        {isContactLens && contactLensRx && (
          <>
            <div className="section-heading">
              <Eye style={{ width: "4mm", height: "4mm", marginRight: "1mm" }} />
              <span>{t("contactLensPrescription")} {language === 'ar' && '(Contact Lens Prescription)'}</span>
            </div>
            <div style={{ padding: "0 2mm", marginBottom: "4mm", direction: "ltr" }}>
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
                    <td style={{ textAlign: "center", fontWeight: "bold" }}>OD {language === 'ar' ? '(Right)' : 'R'}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRx.rightEye.sphere || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRx.rightEye.cylinder || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRx.rightEye.axis || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRx.rightEye.bc || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRx.rightEye.dia || "_____"}</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "center", fontWeight: "bold" }}>OS {language === 'ar' ? '(Left)' : 'L'}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRx.leftEye.sphere || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRx.leftEye.cylinder || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRx.leftEye.axis || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRx.leftEye.bc || "_____"}</td>
                    <td style={{ textAlign: "center" }}>{contactLensRx.leftEye.dia || "_____"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {!isContactLens && (
          <>
            <div className="section-heading">
              <Ruler style={{ width: "4mm", height: "4mm", marginRight: "1mm" }} />
              <span>{t("lensDetails")} {language === 'ar' && '(Lens Details)'}</span>
            </div>
            <div style={{ padding: "0 2mm", marginBottom: "4mm" }}>
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
              <div className="data-row">
                <span className="data-label">{t("price")}:</span>
                <span className="data-value">{invoice.lensPrice.toFixed(3)} KWD</span>
              </div>
              {coatingValue && (
                <div className="data-row">
                  <span className="data-label">{t("coatingPrice")}:</span>
                  <span className="data-value">{invoice.coatingPrice.toFixed(3)} KWD</span>
                </div>
              )}
            </div>
          </>
        )}

        <div className="section-heading">
          <CircleDot style={{ width: "4mm", height: "4mm", marginRight: "1mm" }} />
          <span>{t("additionalNotes")} {language === 'ar' && '(Additional Notes)'}</span>
        </div>
        <div style={{ padding: "0 2mm", marginBottom: "4mm" }}>
          <div style={{ border: "0.2mm solid #000", minHeight: "15mm", backgroundColor: "#fff", width: "100%" }}></div>
        </div>

        <div style={{ marginTop: "5mm", paddingTop: "2mm", borderTop: "0.3mm solid #000" }}>
          <div style={{ marginBottom: "5mm" }}>
            <p style={{ fontSize: "11pt", fontWeight: "600", marginBottom: "2mm" }}>
              {t("technicianSignature")} {language === 'ar' && '(Technician Signature)'}
            </p>
            <div className="signature-line"></div>
            <div className="date-line">{t("date")}: ___ / ___ / _____</div>
          </div>
          
          <div>
            <p style={{ fontSize: "11pt", fontWeight: "600", marginBottom: "2mm", display: "flex", alignItems: "center" }}>
              <BadgeCheck style={{ width: "4mm", height: "4mm", marginRight: "1mm" }} />
              {t("qualityConfirmation")} {language === 'ar' && '(Quality Confirmation)'}
            </p>
            <div className="signature-line"></div>
            <div className="date-line">{t("date")}: ___ / ___ / _____</div>
          </div>
        </div>
      </div>
    </div>
  );
};
