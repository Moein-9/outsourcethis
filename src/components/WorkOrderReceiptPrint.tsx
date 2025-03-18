
import React from "react";
import { Invoice } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { enUS } from "date-fns/locale/en-US";
import { QRCodeSVG } from "qrcode.react";
import { MoenLogo, storeInfo } from "@/assets/logo";

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
  contactLenses?: any[];
  contactLensRx?: any;
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
  contactLensRx,
}) => {
  const { t, language } = useLanguageStore();
  const isRtl = language === "ar";
  const dir = isRtl ? "rtl" : "ltr";
  
  // Format date based on language
  const formatDate = (date: Date | string) => {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "PPP", { locale: isRtl ? ar : enUS });
  };
  
  // Generate QR code data
  const generateQRData = () => {
    return JSON.stringify({
      invoiceId: invoice.invoiceId,
      patientName,
      total: invoice.total,
      date: invoice.createdAt,
    });
  };

  // Calculate subtotal (total + discount)
  const subtotal = invoice.total + invoice.discount;
  
  // Calculate amount paid (deposit or sum of payments)
  const amountPaid = invoice.payments 
    ? invoice.payments.reduce((sum, payment) => sum + payment.amount, 0) 
    : invoice.deposit;

  return (
    <div 
      style={{ 
        width: "80mm", 
        fontFamily: "Arial, sans-serif",
        maxHeight: "100%",
        overflow: "hidden" 
      }} 
      dir={dir} 
      className="print-receipt"
    >
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-receipt, .print-receipt * {
              visibility: visible;
            }
            .print-receipt {
              position: absolute;
              left: 0;
              top: 0;
              width: 80mm;
              margin: 0;
              padding: 0;
            }
            @page {
              size: 80mm auto;
              margin: 0;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 80mm;
            }
          }
        `}
      </style>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "8px" }}>
        <div style={{ marginBottom: "4px", display: "flex", justifyContent: "center" }}>
          <MoenLogo className="w-auto" style={{ height: "28px", margin: "0 auto" }} />
        </div>
        <h1 style={{ fontSize: "14px", fontWeight: "bold", margin: "4px 0" }}>
          {storeInfo.name}
        </h1>
        <p style={{ fontSize: "10px", margin: "2px 0" }}>{storeInfo.address}</p>
        <p style={{ fontSize: "10px", margin: "2px 0" }}>{storeInfo.phone}</p>
      </div>
      
      {/* Divider */}
      <div style={{ borderTop: "1px dashed #000", margin: "8px 0" }}></div>
      
      {/* Order Info */}
      <div style={{ marginBottom: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "4px" }}>
          <span style={{ fontWeight: "bold" }}>{t("workOrderNumber")}:</span>
          <span>{invoice.invoiceId}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "4px" }}>
          <span style={{ fontWeight: "bold" }}>{t("date")}:</span>
          <span>{formatDate(invoice.createdAt)}</span>
        </div>
      </div>
      
      {/* Patient Info */}
      <div style={{ marginBottom: "8px", fontSize: "10px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: "bold", margin: "4px 0", borderBottom: "1px solid #ccc", paddingBottom: "2px" }}>
          {t("patientInformation")}
        </h2>
        <div style={{ marginLeft: "4px" }}>
          <div style={{ marginBottom: "2px" }}>
            <span style={{ fontWeight: "bold", marginRight: "4px" }}>{t("name")}:</span>
            <span>{patientName || t("notSpecified")}</span>
          </div>
          {patientPhone && (
            <div style={{ marginBottom: "2px" }}>
              <span style={{ fontWeight: "bold", marginRight: "4px" }}>{t("phone")}:</span>
              <span>{patientPhone}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Prescription - Simplified */}
      {rx && (
        <div style={{ marginBottom: "8px", fontSize: "10px" }}>
          <h2 style={{ fontSize: "12px", fontWeight: "bold", margin: "4px 0", borderBottom: "1px solid #ccc", paddingBottom: "2px" }}>
            {t("prescription")}
          </h2>
          
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9px", marginTop: "4px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}></th>
                <th style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>SPH</th>
                <th style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>CYL</th>
                <th style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>AXIS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "2px", fontWeight: "bold", textAlign: "center" }}>
                  {t("rightEye")}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>{rx.sphereOD || "-"}</td>
                <td style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>{rx.cylOD || "-"}</td>
                <td style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>{rx.axisOD || "-"}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "2px", fontWeight: "bold", textAlign: "center" }}>
                  {t("leftEye")}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>{rx.sphereOS || "-"}</td>
                <td style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>{rx.cylOS || "-"}</td>
                <td style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>{rx.axisOS || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      
      {/* Product Details - Simplified */}
      <div style={{ marginBottom: "8px", fontSize: "10px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: "bold", margin: "4px 0", borderBottom: "1px solid #ccc", paddingBottom: "2px" }}>
          {t("productDetails")}
        </h2>
        
        {frame && (
          <div style={{ marginBottom: "6px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: "bold", margin: "4px 0" }}>{t("frame")}</h3>
            <div style={{ marginLeft: "4px" }}>
              <div style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("brand")}/{t("model")}:</span>
                <span>{frame.brand} {frame.model}</span>
              </div>
              <div style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("color")}:</span>
                <span>{frame.color}</span>
              </div>
              <div style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("price")}:</span>
                <span>{frame.price.toFixed(3)} KWD</span>
              </div>
            </div>
          </div>
        )}
        
        {lensType && (
          <div style={{ marginBottom: "6px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: "bold", margin: "4px 0" }}>{t("lensType")}</h3>
            <div style={{ marginLeft: "4px" }}>
              <div style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("type")}:</span>
                <span>{lensType}</span>
              </div>
              <div style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("price")}:</span>
                <span>{invoice.lensPrice.toFixed(3)} KWD</span>
              </div>
            </div>
          </div>
        )}
        
        {contactLenses && contactLenses.length > 0 && (
          <div style={{ marginBottom: "6px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: "bold", margin: "4px 0" }}>{t("contactLenses")}</h3>
            {contactLenses.slice(0, 2).map((lens, index) => (
              <div key={index} style={{ marginLeft: "4px", marginBottom: "4px" }}>
                <div style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "bold" }}>{t("brand")}:</span>
                  <span>{lens.brand}</span>
                </div>
                <div style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "bold" }}>{t("price")}:</span>
                  <span>{lens.price.toFixed(3)} KWD</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Payment Info */}
      <div style={{ marginBottom: "8px", fontSize: "10px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: "bold", margin: "4px 0", borderBottom: "1px solid #ccc", paddingBottom: "2px" }}>
          {t("paymentInformation")}
        </h2>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
          <span style={{ fontWeight: "bold" }}>{t("subtotal")}:</span>
          <span>{subtotal.toFixed(3)} KWD</span>
        </div>
        {invoice.discount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
            <span style={{ fontWeight: "bold" }}>{t("discount")}:</span>
            <span>-{invoice.discount.toFixed(3)} KWD</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
          <span style={{ fontWeight: "bold" }}>{t("total")}:</span>
          <span>{invoice.total.toFixed(3)} KWD</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
          <span style={{ fontWeight: "bold" }}>{t("paid")}:</span>
          <span>{amountPaid.toFixed(3)} KWD</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
          <span style={{ fontWeight: "bold" }}>{t("remaining")}:</span>
          <span>{(invoice.total - amountPaid).toFixed(3)} KWD</span>
        </div>
      </div>
      
      {/* Divider */}
      <div style={{ borderTop: "1px dashed #000", margin: "8px 0" }}></div>
      
      {/* Footer */}
      <div style={{ textAlign: "center", marginBottom: "8px", fontSize: "9px" }}>
        <p style={{ margin: "2px 0" }}>{t("thankYouForYourPurchase")}</p>
        <p style={{ margin: "2px 0" }}>{t("pleaseKeepReceipt")}</p>
        <div style={{ margin: "8px auto", width: "50px", height: "50px" }}>
          <QRCodeSVG value={generateQRData()} size={50} />
        </div>
      </div>
    </div>
  );
};
