
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
            
            .section-title {
              background-color: black !important;
              color: white !important;
              font-size: 12pt !important;
              font-weight: bold !important;
              padding: 2mm 0 !important;
              margin-bottom: 2mm !important;
              text-align: center !important;
              border-radius: 1mm !important;
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

            .product-card {
              border: 0.3mm solid black !important;
              border-radius: 1mm !important;
              margin-bottom: 2mm !important;
              padding: 0 !important;
              overflow: hidden !important;
            }

            .product-card-header {
              font-weight: bold !important; 
              background-color: #f0f0f0 !important;
              border-bottom: 0.2mm solid black !important;
              padding: 1.5mm !important;
            }

            .product-card-content {
              padding: 1.5mm !important;
            }

            .signature-box {
              border: 0.3mm solid #000 !important;
              border-radius: 1mm !important;
              padding: 1.5mm !important;
            }
            
            .signature-box-title {
              font-weight: bold !important;
              font-size: 10pt !important;
              text-align: center !important;
              margin-bottom: 1mm !important;
              border-bottom: 0.2mm solid #000 !important;
              padding-bottom: 1mm !important;
            }
          }
        `}
      </style>

      <div id="work-order-print" className={dirClass} style={{ width: "80mm", padding: "2mm" }}>
        <div style={{ textAlign: "center", marginBottom: "3mm", position: "relative" }}>
          <div className="absolute right-0 top-0 hide-print">
            <ClipboardCheck className="w-10 h-10 text-primary" />
          </div>
          <MoenLogo className="mx-auto w-auto" style={{ height: "8mm", marginBottom: "1mm" }} />
          <div style={{ backgroundColor: "black", color: "white", padding: "1.5mm 0", marginBottom: "1.5mm", borderRadius: "1mm" }}>
            <h1 style={{ fontSize: "14pt", fontWeight: "bold", margin: "0" }}>{language === 'ar' ? "أمر عمل | WORK ORDER" : "WORK ORDER | أمر عمل"}</h1>
          </div>
          <div className="flex justify-center items-center gap-2">
            <p style={{ fontSize: "13pt", margin: "0", color: "#333", fontWeight: "bold" }}>{orderNumber}</p>
            <span className="mx-1">-</span>
            <p style={{ fontSize: "9pt", margin: "0", color: "#666" }}>
              {format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}
            </p>
          </div>
          <div style={{ fontSize: "8pt", textAlign: "center", marginTop: "1mm" }}>
            <p style={{ margin: "0" }}>{storeInfo.address}</p>
            <p style={{ margin: "0" }}>{t("phone")}: {storeInfo.phone}</p>
          </div>
        </div>

        <div className="section-title">
          {language === 'ar' ? "معلومات المريض | Patient Info" : "Patient Info | معلومات المريض"}
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

        <div className="section-title">
          {language === 'ar' ? "تفاصيل الوصفة الطبية | Prescription" : "Prescription | تفاصيل الوصفة الطبية"}
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
          <div style={{ marginTop: "1mm", fontSize: "8pt", display: "flex", justifyContent: "space-between" }}>
            <span>OD = {language === 'ar' ? "العين اليمنى" : "Right Eye"}</span>
            <span>OS = {language === 'ar' ? "العين اليسرى" : "Left Eye"}</span>
          </div>
        </div>

        {invoiceType === 'glasses' && frameData && (
          <>
            <div className="section-title">
              {language === 'ar' ? "تفاصيل المنتج | Product Details" : "Product Details | تفاصيل المنتج"}
            </div>
            <div style={{ padding: "0 2mm", marginBottom: "3mm" }}>
              <div className="product-card">
                <div className="product-card-header">
                  {language === 'ar' ? "الإطار | Frame" : "Frame | الإطار"}
                </div>
                <div className="product-card-content">
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
              </div>
              
              {lensTypeValue && (
                <div className="product-card">
                  <div className="product-card-header">
                    {language === 'ar' ? "العدسات | Lenses" : "Lenses | العدسات"}
                  </div>
                  <div className="product-card-content">
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
                </div>
              )}
            </div>
          </>
        )}
        
        {isContactLens && contactLensItems.length > 0 && (
          <>
            <div className="section-title">
              {language === 'ar' ? "تفاصيل المنتج | Product Details" : "Product Details | تفاصيل المنتج"}
            </div>
            <div style={{ padding: "0 2mm", marginBottom: "3mm" }}>
              <div className="product-card">
                <div className="product-card-header">
                  {language === 'ar' ? "العدسات اللاصقة | Contact Lenses" : "Contact Lenses | العدسات اللاصقة"}
                </div>
                {contactLensItems.map((lens, idx) => (
                  <div key={idx} className="product-card-content" style={{ 
                    borderTop: idx > 0 ? "0.2mm dashed #ccc" : "none",
                  }}>
                    <div className="data-row">
                      <span className="data-label">{t("type")}:</span>
                      <span className="data-value">{lens.brand} {lens.type}</span>
                    </div>
                    {lens.color && (
                      <div className="data-row">
                        <span className="data-label">{t("color")}:</span>
                        <span className="data-value">{lens.color}</span>
                      </div>
                    )}
                    <div className="data-row">
                      <span className="data-label">{t("quantity")}:</span>
                      <span className="data-value">{lens.qty || 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {isContactLens && contactLensRxData && (
          <>
            <div className="section-title">
              {language === 'ar' ? "وصفة العدسات اللاصقة | Contact Lens Rx" : "Contact Lens Rx | وصفة العدسات اللاصقة"}
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

        <div className="section-title">
          {language === 'ar' ? "ملاحظات | Notes" : "Notes | ملاحظات"}
        </div>
        <div style={{ padding: "0 2mm", marginBottom: "3mm" }}>
          <div style={{ border: "0.2mm solid #000", minHeight: "15mm", backgroundColor: "#fff", width: "100%" }}></div>
        </div>

        <div style={{ marginTop: "4mm", paddingTop: "2mm", borderTop: "0.3mm solid #000" }}>
          <div style={{ display: "flex", gap: "2mm" }}>
            <div style={{ flex: "1" }}>
              <div className="signature-box">
                <div className="signature-box-title">
                  {language === 'ar' ? "توقيع الفني" : "Technician"}
                </div>
                <div className="signature-line" style={{ margin: "0 auto" }}></div>
              </div>
            </div>
            
            <div style={{ flex: "1" }}>
              <div className="signature-box">
                <div className="signature-box-title">
                  {language === 'ar' ? "توقيع المدير" : "Manager"}
                </div>
                <div className="signature-line" style={{ margin: "0 auto" }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: "4mm", textAlign: "center", fontSize: "8pt", color: "#666" }}>
          <p style={{ marginBottom: "1mm" }}>
            {language === 'ar' ? "شكراً لاختياركم نظارات المعين" : "Thank you for choosing Moein Optical"}
          </p>
        </div>
      </div>
    </div>
  );
};
