
import React from "react";
import { Invoice } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { enUS } from "date-fns/locale/en-US";
import { QRCodeSVG } from "qrcode.react";

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
    <div style={{ width: "80mm", fontFamily: "Arial, sans-serif" }} dir={dir} className="print-receipt">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "16px", fontWeight: "bold", margin: "5px 0" }}>
          {t("opticalStoreName")}
        </h1>
        <p style={{ fontSize: "12px", margin: "2px 0" }}>{t("opticalStoreAddress")}</p>
        <p style={{ fontSize: "12px", margin: "2px 0" }}>{t("opticalStorePhone")}</p>
      </div>
      
      {/* Divider */}
      <div style={{ borderTop: "1px dashed #000", margin: "10px 0" }}></div>
      
      {/* Order Info */}
      <div style={{ marginBottom: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "5px" }}>
          <span style={{ fontWeight: "bold" }}>{t("workOrderNumber")}:</span>
          <span>{invoice.invoiceId}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "5px" }}>
          <span style={{ fontWeight: "bold" }}>{t("date")}:</span>
          <span>{formatDate(invoice.createdAt)}</span>
        </div>
      </div>
      
      {/* Patient Info */}
      <div style={{ marginBottom: "10px", fontSize: "12px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: "bold", margin: "5px 0", borderBottom: "1px solid #ccc", paddingBottom: "3px" }}>
          {t("patientInformation")}
        </h2>
        <div style={{ marginLeft: "5px" }}>
          <div style={{ marginBottom: "3px" }}>
            <span style={{ fontWeight: "bold", marginRight: "5px" }}>{t("name")}:</span>
            <span>{patientName || t("notSpecified")}</span>
          </div>
          {patientPhone && (
            <div style={{ marginBottom: "3px" }}>
              <span style={{ fontWeight: "bold", marginRight: "5px" }}>{t("phone")}:</span>
              <span>{patientPhone}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Prescription */}
      {rx && (
        <div style={{ marginBottom: "10px", fontSize: "12px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "bold", margin: "5px 0", borderBottom: "1px solid #ccc", paddingBottom: "3px" }}>
            {t("prescription")}
          </h2>
          
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", marginTop: "5px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "3px", textAlign: "center" }}></th>
                <th style={{ border: "1px solid #ddd", padding: "3px", textAlign: "center" }}>SPH</th>
                <th style={{ border: "1px solid #ddd", padding: "3px", textAlign: "center" }}>CYL</th>
                <th style={{ border: "1px solid #ddd", padding: "3px", textAlign: "center" }}>AXIS</th>
                <th style={{ border: "1px solid #ddd", padding: "3px", textAlign: "center" }}>ADD</th>
                <th style={{ border: "1px solid #ddd", padding: "3px", textAlign: "center" }}>PD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "3px", fontWeight: "bold", textAlign: "center" }}>
                  {t("rightEye")}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "3px", textAlign: "center" }}>{rx.sphereOD || "-"}</td>
                <td style={{ border: "1px solid #ddd", padding: "3px", textAlign: "center" }}>{rx.cylOD || "-"}</td>
                <td style={{ border: "1px solid #ddd", padding: "3px", textAlign: "center" }}>{rx.axisOD || "-"}</td>
                <td style={{ border: "1px solid #ddd", padding: "3px", textAlign: "center" }}>{rx.addOD || "-"}</td>
                <td style={{ border: "1px solid #ddd", padding: "3px", textAlign: "center" }}>{rx.pdRight || "-"}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "3px", fontWeight: "bold", textAlign: "center" }}>
                  {t("leftEye")}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "3px", textAlign: "center" }}>{rx.sphereOS || "-"}</td>
                <td style={{ border: "1px solid #ddd", padding: "3px", textAlign: "center" }}>{rx.cylOS || "-"}</td>
                <td style={{ border: "1px solid #ddd", padding: "3px", textAlign: "center" }}>{rx.axisOS || "-"}</td>
                <td style={{ border: "1px solid #ddd", padding: "3px", textAlign: "center" }}>{rx.addOS || "-"}</td>
                <td style={{ border: "1px solid #ddd", padding: "3px", textAlign: "center" }}>{rx.pdLeft || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      
      {/* Product Details */}
      <div style={{ marginBottom: "10px", fontSize: "12px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: "bold", margin: "5px 0", borderBottom: "1px solid #ccc", paddingBottom: "3px" }}>
          {t("productDetails")}
        </h2>
        
        {frame && (
          <div style={{ marginBottom: "8px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: "bold", margin: "5px 0" }}>{t("frame")}</h3>
            <div style={{ marginLeft: "5px" }}>
              <div style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("brand")}:</span>
                <span>{frame.brand}</span>
              </div>
              <div style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("model")}:</span>
                <span>{frame.model}</span>
              </div>
              <div style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("color")}:</span>
                <span>{frame.color}</span>
              </div>
              <div style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("size")}:</span>
                <span>{frame.size}</span>
              </div>
              <div style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("price")}:</span>
                <span>{frame.price.toFixed(3)} KWD</span>
              </div>
            </div>
          </div>
        )}
        
        {lensType && (
          <div style={{ marginBottom: "8px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: "bold", margin: "5px 0" }}>{t("lensType")}</h3>
            <div style={{ marginLeft: "5px" }}>
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
        
        {coating && (
          <div style={{ marginBottom: "8px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: "bold", margin: "5px 0" }}>{t("coating")}</h3>
            <div style={{ marginLeft: "5px" }}>
              <div style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("type")}:</span>
                <span>{coating}</span>
              </div>
              <div style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("price")}:</span>
                <span>{invoice.coatingPrice.toFixed(3)} KWD</span>
              </div>
            </div>
          </div>
        )}
        
        {contactLenses && contactLenses.length > 0 && (
          <div style={{ marginBottom: "8px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: "bold", margin: "5px 0" }}>{t("contactLenses")}</h3>
            {contactLenses.map((lens, index) => (
              <div key={index} style={{ marginLeft: "5px", marginBottom: "5px" }}>
                <div style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "bold" }}>{t("brand")}:</span>
                  <span>{lens.brand}</span>
                </div>
                <div style={{ marginBottom: "2px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "bold" }}>{t("type")}:</span>
                  <span>{lens.type}</span>
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
      <div style={{ marginBottom: "10px", fontSize: "12px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: "bold", margin: "5px 0", borderBottom: "1px solid #ccc", paddingBottom: "3px" }}>
          {t("paymentInformation")}
        </h2>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
          <span style={{ fontWeight: "bold" }}>{t("subtotal")}:</span>
          <span>{subtotal.toFixed(3)} KWD</span>
        </div>
        {invoice.discount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
            <span style={{ fontWeight: "bold" }}>{t("discount")}:</span>
            <span>-{invoice.discount.toFixed(3)} KWD</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
          <span style={{ fontWeight: "bold" }}>{t("total")}:</span>
          <span>{invoice.total.toFixed(3)} KWD</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
          <span style={{ fontWeight: "bold" }}>{t("paid")}:</span>
          <span>{amountPaid.toFixed(3)} KWD</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
          <span style={{ fontWeight: "bold" }}>{t("remaining")}:</span>
          <span>{(invoice.total - amountPaid).toFixed(3)} KWD</span>
        </div>
      </div>
      
      {/* Divider */}
      <div style={{ borderTop: "1px dashed #000", margin: "10px 0" }}></div>
      
      {/* Footer */}
      <div style={{ textAlign: "center", marginBottom: "10px", fontSize: "10px" }}>
        <p style={{ margin: "2px 0" }}>{t("thankYouForYourPurchase")}</p>
        <p style={{ margin: "2px 0" }}>{t("pleaseKeepReceipt")}</p>
        <div style={{ margin: "10px auto", width: "70px", height: "70px" }}>
          <QRCodeSVG value={generateQRData()} size={70} />
        </div>
      </div>
    </div>
  );
};
