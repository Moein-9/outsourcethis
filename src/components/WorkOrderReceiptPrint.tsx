
import React from "react";
import { Invoice } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { enUS } from "date-fns/locale/en-US";
import { QRCodeSVG } from "qrcode.react";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { PrintService } from "@/utils/PrintService";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

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
  
  const formatDate = (date: Date | string) => {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "PPP", { locale: isRtl ? ar : enUS });
  };
  
  const generateQRData = () => {
    return JSON.stringify({
      invoiceId: invoice.invoiceId,
      patientName,
      total: invoice.total,
      date: invoice.createdAt,
    });
  };

  const subtotal = invoice.total + invoice.discount;
  
  const amountPaid = invoice.payments 
    ? invoice.payments.reduce((sum, payment) => sum + payment.amount, 0) 
    : invoice.deposit || 0;
    
  const remaining = invoice.total - amountPaid;
  const isPaid = remaining <= 0;

  const invoiceNumber = invoice.invoiceId || invoice.workOrderId || "";

  return (
    <div 
      id="work-order-receipt"
      dir={isRtl ? "rtl" : "ltr"}
      className="print-receipt"
      style={{ 
        width: "80mm", 
        fontFamily: isRtl ? "'Zain', sans-serif" : "'Yrsa', serif",
        maxWidth: "80mm",
        overflow: "hidden", /* Changed from visible to hidden to remove scrollbars */
        margin: "0 auto",
        padding: "2mm",
        backgroundColor: "white",
        fontSize: "10px",
        lineHeight: "1.2"
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        <div style={{ marginBottom: "2px", display: "flex", justifyContent: "center" }}>
          <MoenLogo className="w-auto" style={{ height: "24px", margin: "0 auto" }} />
        </div>
        <h1 style={{ fontSize: "14px", fontWeight: "bold", margin: "2px 0" }}>
          {storeInfo.name}
        </h1>
        <p style={{ fontSize: "9px", margin: "0" }}>{storeInfo.address}</p>
        <p style={{ fontSize: "9px", margin: "0" }}>{storeInfo.phone}</p>
      </div>
      
      <div style={{ borderTop: "1px dashed #000", margin: "4px 0" }}></div>
      
      <div style={{ marginBottom: "4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "2px" }}>
          <span style={{ fontWeight: "bold" }}>{t("workOrderNumber")}:</span> 
          <span>{invoiceNumber}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "2px" }}>
          <span style={{ fontWeight: "bold" }}>{t("date")}:</span>
          <span>{formatDate(invoice.createdAt)}</span>
        </div>
      </div>
      
      <div style={{ marginBottom: "4px", fontSize: "10px" }}>
        <h2 style={{ 
          fontSize: "12px", 
          fontWeight: "bold", 
          margin: "2px 0", 
          borderBottom: "1px solid #ccc", 
          paddingBottom: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4px" /* Added gap for better spacing */
        }}>
          <span>{t("patientInformation")}</span>
          {!isRtl && <span style={{ fontSize: "10px" }}>معلومات المريض</span>}
          {isRtl && <span style={{ fontSize: "10px" }}>Patient Info</span>}
        </h2>
        <div style={{ marginLeft: "2px" }}>
          <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: "bold" }}>{t("name")}:</span>
            <span>{patientName || t("notSpecified")}</span>
          </div>
          {patientPhone && (
            <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "bold" }}>{t("phone")}:</span>
              <span>{patientPhone}</span>
            </div>
          )}
        </div>
      </div>
      
      {rx && (
        <div style={{ marginBottom: "4px", fontSize: "10px" }}>
          <h2 style={{ 
            fontSize: "12px", 
            fontWeight: "bold", 
            margin: "2px 0", 
            borderBottom: "1px solid #ccc", 
            paddingBottom: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "4px" /* Added gap for better spacing */
          }}>
            <span>{t("prescription")}</span>
            {!isRtl && <span style={{ fontSize: "10px" }}>وصفة طبية</span>}
            {isRtl && <span style={{ fontSize: "10px" }}>Prescription</span>}
          </h2>
          
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse", 
            fontSize: "8px", 
            marginTop: "2px",
            direction: "ltr" // Always LTR for RX table
          }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}></th>
                <th style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>SPH</th>
                <th style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>CYL</th>
                <th style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>AX</th>
                {(rx.pdOD || rx.pdOS || rx.pd) && <th style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>PD</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "2px", fontWeight: "bold", textAlign: "center" }}>
                  OD {isRtl ? '(يمين)' : '(Right)'}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>{rx.sphereOD || "-"}</td>
                <td style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>{rx.cylOD || "-"}</td>
                <td style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>{rx.axisOD || "-"}</td>
                {(rx.pdOD || rx.pdOS || rx.pd) && (
                  <td style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>
                    {rx.pdOD || rx.pd || "-"}
                  </td>
                )}
              </tr>
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "2px", fontWeight: "bold", textAlign: "center" }}>
                  OS {isRtl ? '(يسار)' : '(Left)'}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>{rx.sphereOS || "-"}</td>
                <td style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>{rx.cylOS || "-"}</td>
                <td style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>{rx.axisOS || "-"}</td>
                {(rx.pdOD || rx.pdOS || rx.pd) && (
                  <td style={{ border: "1px solid #ddd", padding: "2px", textAlign: "center" }}>
                    {rx.pdOS || rx.pd || "-"}
                  </td>
                )}
              </tr>
            </tbody>
          </table>
          
          {rx.add && (
            <div style={{ marginTop: "2px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "bold" }}>ADD:</span>
              <span>{rx.add}</span>
            </div>
          )}
        </div>
      )}
      
      <div style={{ marginBottom: "4px", fontSize: "10px" }}>
        <h2 style={{ 
          fontSize: "12px", 
          fontWeight: "bold", 
          margin: "2px 0", 
          borderBottom: "1px solid #ccc", 
          paddingBottom: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4px" /* Added gap for better spacing */
        }}>
          <span>{t("productDetails")}</span>
          {!isRtl && <span style={{ fontSize: "10px" }}>تفاصيل المنتج</span>}
          {isRtl && <span style={{ fontSize: "10px" }}>Product Details</span>}
        </h2>
        
        {frame && (
          <div style={{ marginBottom: "3px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: "bold", margin: "2px 0" }}>
              {t("frame")} {!isRtl ? "(الإطار)" : "(Frame)"}
            </h3>
            <div style={{ marginLeft: "2px" }}>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("brand")}/{t("model")}:</span>
                <span>{frame.brand} {frame.model}</span>
              </div>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("color")}:</span>
                <span>{frame.color}</span>
              </div>
              {frame.size && (
                <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "bold" }}>{t("size")}:</span>
                  <span>{frame.size}</span>
                </div>
              )}
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("price")}:</span>
                <span>{frame.price.toFixed(3)} KWD</span>
              </div>
            </div>
          </div>
        )}
        
        {lensType && (
          <div style={{ marginBottom: "3px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: "bold", margin: "2px 0" }}>
              {t("lensType")} {!isRtl ? "(العدسات الطبية)" : "(Lenses)"}
            </h3>
            <div style={{ marginLeft: "2px" }}>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("type")}:</span>
                <span>
                  {lensType} 
                  {/* Always include both languages for lens type */}
                  {isRtl ? ` (${t("lensType")} - Lens Type)` : ` (${t("lensType")} - نوع العدسات)`}
                </span>
              </div>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("price")}:</span>
                <span>{invoice.lensPrice.toFixed(3)} KWD</span>
              </div>
            </div>
          </div>
        )}
        
        {coating && (
          <div style={{ marginBottom: "3px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: "bold", margin: "2px 0" }}>
              {t("coating")} {!isRtl ? "(الطلاء)" : "(Coating)"}
            </h3>
            <div style={{ marginLeft: "2px" }}>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("type")}:</span>
                <span>
                  {coating}
                  {/* Always include both languages for coating */}
                  {isRtl ? ` (${t("coating")} - Coating)` : ` (${t("coating")} - طلاء)`}
                </span>
              </div>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{t("price")}:</span>
                <span>{invoice.coatingPrice.toFixed(3)} KWD</span>
              </div>
            </div>
          </div>
        )}
        
        {contactLenses && contactLenses.length > 0 && (
          <div style={{ marginBottom: "3px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: "bold", margin: "2px 0" }}>
              {t("contactLenses")} {!isRtl ? "(العدسات اللاصقة)" : "(Contact Lenses)"}
            </h3>
            {contactLenses.slice(0, 2).map((lens, index) => (
              <div key={index} style={{ marginLeft: "2px", marginBottom: "1px" }}>
                <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "bold" }}>{t("brand")}:</span>
                  <span>{lens.brand}</span>
                </div>
                <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "bold" }}>{t("price")}:</span>
                  <span>{lens.price.toFixed(3)} KWD</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ 
        marginBottom: "3px", /* Reduced from 4px to 3px */
        fontSize: "11px", 
        border: "1px solid #ccc", 
        padding: "3px",
        borderRadius: "3px",
        backgroundColor: "#f8f8f8" /* Added light background to make payment section stand out */
      }}>
        <h2 style={{ 
          fontSize: "13px", 
          fontWeight: "bold", 
          margin: "1px 0 2px 0", /* Reduced from 3px to 2px */
          borderBottom: "1px solid #ccc", 
          paddingBottom: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4px" /* Added gap for better spacing */
        }}>
          <span>{t("paymentInformation")}</span>
          {!isRtl && <span style={{ fontSize: "11px" }}>معلومات الدفع</span>}
          {isRtl && <span style={{ fontSize: "11px" }}>Payment Info</span>}
        </h2>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1px" }}>
          <span style={{ fontWeight: "bold" }}>{t("subtotal")}:</span>
          <span>{subtotal.toFixed(3)} KWD</span>
        </div>
        {invoice.discount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1px" }}>
            <span style={{ fontWeight: "bold" }}>{t("discount")}:</span>
            <span>-{invoice.discount.toFixed(3)} KWD</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1px" }}>
          <span style={{ fontWeight: "bold" }}>{t("total")}:</span>
          <span>{invoice.total.toFixed(3)} KWD</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1px" }}>
          <span style={{ fontWeight: "bold" }}>{t("paid")}:</span>
          <span>{amountPaid.toFixed(3)} KWD</span>
        </div>
        
        {/* Enhanced payment status indicators */}
        {isPaid ? (
          <div className="payment-paid" style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            gap: "4px",
            backgroundColor: "#E6F7E6", 
            padding: "4px", 
            borderRadius: "4px",
            margin: "4px 0 1px 0",
            fontWeight: "bold",
            fontSize: "13px",
            border: "1px solid #A3D9A3",
            color: "#1F7A1F"
          }}>
            <CheckCircle2 style={{ height: "15px", width: "15px" }} />
            <span>{t("paidInFull")} {isRtl ? "(PAID)" : "(تم الدفع بالكامل)"}</span>
          </div>
        ) : (
          <div className="payment-remaining" style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            backgroundColor: "#FEE2E2", 
            padding: "4px", 
            borderRadius: "4px",
            margin: "4px 0 1px 0",
            fontWeight: "bold",
            fontSize: "13px",
            border: "1px solid #FECACA",
            color: "#B91C1C"
          }}>
            <span>{t("remaining")} {isRtl ? "(REMAINING)" : "(المتبقي)"}:</span>
            <span>{remaining.toFixed(3)} KWD</span>
          </div>
        )}
      </div>
      
      <div style={{ borderTop: "1px dashed #000", margin: "2px 0", paddingTop: "2px" }}></div>
      
      <div style={{ textAlign: "center", marginBottom: "1px", fontSize: "8px" }}>
        {isRtl ? (
          <p style={{ margin: "0" }}>شكراً لاختياركم نظارات المعين. يسعدنا خدمتكم دائماً!</p>
        ) : (
          <p style={{ margin: "0" }}>Thank you for choosing Moein Optical. We're always delighted to serve you!</p>
        )}
        <div style={{ margin: "2px auto", width: "32px", height: "32px" }}>
          <QRCodeSVG value={generateQRData()} size={32} />
        </div>
      </div>
    </div>
  );
};

export const printWorkOrderReceipt = (props: WorkOrderReceiptPrintProps) => {
  const container = document.createElement('div');
  container.style.display = 'none';
  document.body.appendChild(container);
  
  const { language, t } = useLanguageStore.getState();
  const isRtl = language === 'ar';
  
  const { invoice, patientName, rx, frame, lensType, coating } = props;
  const invoiceNumber = invoice.invoiceId || invoice.workOrderId || "";
  
  const htmlContent = `
    <div dir="${isRtl ? 'rtl' : 'ltr'}" style="width: 80mm; font-family: ${isRtl ? 'Zain, sans-serif' : 'Yrsa, serif'}; text-align: ${isRtl ? 'right' : 'left'}; font-size: 9px; line-height: 1.1;">
      <div style="text-align: center; margin-bottom: 3px;">
        <h1 style="font-size: 12px; font-weight: bold; margin: 1px 0;">${t("workOrder")}</h1>
        <p style="font-size: 10px; margin: 1px 0;">${invoiceNumber}</p>
        <p style="font-size: 8px; margin: 1px 0;">${new Date(invoice.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div style="margin-bottom: 3px; border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 1px 0;">
        <p style="margin: 0; font-size: 9px;"><strong>${t("name")}:</strong> ${patientName || invoice.patientName || t("notSpecified")}</p>
        <p style="margin: 0; font-size: 9px;"><strong>${t("phone")}:</strong> ${props.patientPhone || invoice.patientPhone || t("notSpecified")}</p>
      </div>
      
      ${rx ? `
      <div style="margin-bottom: 3px;">
        <h2 style="font-size: 10px; font-weight: bold; margin: 1px 0; border-bottom: 1px solid #ccc; padding-bottom: 1px;">${t("prescription")}</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 7px;">
          <tr>
            <th style="border: 1px solid #000; padding: 1px;"></th>
            <th style="border: 1px solid #000; padding: 1px;">SPH</th>
            <th style="border: 1px solid #000; padding: 1px;">CYL</th>
            <th style="border: 1px solid #000; padding: 1px;">AX</th>
            ${(rx.pdOD || rx.pdOS || rx.pd) ? `<th style="border: 1px solid #000; padding: 1px;">PD</th>` : ''}
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 1px; font-weight: bold;">OD ${isRtl ? '(يمين)' : ''}</td>
            <td style="border: 1px solid #000; padding: 1px;">${rx.sphereOD || "-"}</td>
            <td style="border: 1px solid #000; padding: 1px;">${rx.cylOD || "-"}</td>
            <td style="border: 1px solid #000; padding: 1px;">${rx.axisOD || "-"}</td>
            ${(rx.pdOD || rx.pdOS || rx.pd) ? `<td style="border: 1px solid #000; padding: 1px;">${rx.pdOD || rx.pd || "-"}</td>` : ''}
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 1px; font-weight: bold;">OS ${isRtl ? '(يسار)' : ''}</td>
            <td style="border: 1px solid #000; padding: 1px;">${rx.sphereOS || "-"}</td>
            <td style="border: 1px solid #000; padding: 1px;">${rx.cylOS || "-"}</td>
            <td style="border: 1px solid #000; padding: 1px;">${rx.axisOS || "-"}</td>
            ${(rx.pdOD || rx.pdOS || rx.pd) ? `<td style="border: 1px solid #000; padding: 1px;">${rx.pdOS || rx.pd || "-"}</td>` : ''}
          </tr>
        </table>
        ${rx.add ? `<p style="margin: 1px 0; font-size: 8px;"><strong>ADD:</strong> ${rx.add}</p>` : ''}
      </div>
      ` : ''}
      
      ${frame ? `
      <div style="margin-bottom: 2px;">
        <h2 style="font-size: 10px; font-weight: bold; margin: 1px 0; border-bottom: 1px solid #ccc; padding-bottom: 1px;">${t("frame")}</h2>
        <p style="margin: 0; font-size: 8px;"><strong>${t("brand")}/${t("model")}:</strong> ${frame.brand} ${frame.model}</p>
        <p style="margin: 0; font-size: 8px;"><strong>${t("color")}:</strong> ${frame.color}</p>
        ${frame.size ? `<p style="margin: 0; font-size: 8px;"><strong>${t("size")}:</strong> ${frame.size}</p>` : ''}
        <p style="margin: 0; font-size: 8px;"><strong>${t("price")}:</strong> ${frame.price.toFixed(3)} KWD</p>
      </div>
      ` : ''}
      
      ${lensType ? `
      <div style="margin-bottom: 2px;">
        <h2 style="font-size: 10px; font-weight: bold; margin: 1px 0; border-bottom: 1px solid #ccc; padding-bottom: 1px;">${t("lensType")}</h2>
        <p style="margin: 0; font-size: 8px;"><strong>${t("type")}:</strong> ${lensType}</p>
        <p style="margin: 0; font-size: 8px;"><strong>${t("price")}:</strong> ${invoice.lensPrice.toFixed(3)} KWD</p>
      </div>
      ` : ''}
      
      ${coating ? `
      <div style="margin-bottom: 2px;">
        <h2 style="font-size: 10px; font-weight: bold; margin: 1px 0; border-bottom: 1px solid #ccc; padding-bottom: 1px;">${t("coating")}</h2>
        <p style="margin: 0; font-size: 8px;"><strong>${t("type")}:</strong> ${coating}</p>
        <p style="margin: 0; font-size: 8px;"><strong>${t("price")}:</strong> ${invoice.coatingPrice.toFixed(3)} KWD</p>
      </div>
      ` : ''}
      
      <div style="margin-top: 2px; border-top: 1px dashed #000; padding-top: 1px;">
        <p style="margin: 0; font-size: 8px;"><strong>${t("total")}:</strong> ${invoice.total.toFixed(3)} KWD</p>
        <p style="margin: 0; font-size: 8px;"><strong>${t("paid")}:</strong> ${invoice.deposit.toFixed(3)} KWD</p>
        <p style="margin: 0; font-size: 8px;"><strong>${t("remaining")}:</strong> ${(invoice.total - invoice.deposit).toFixed(3)} KWD</p>
      </div>
      
      <div style="text-align: center; margin-top: 2px; font-size: 7px;">
        ${isRtl 
          ? '<p style="margin: 0;">شكراً لاختياركم نظارات المعين</p>' 
          : '<p style="margin: 0;">Thank you for choosing Moein Optical</p>'
        }
      </div>
    </div>
  `;
  
  try {
    document.body.classList.add('printing');
    
    const printDoc = PrintService.prepareWorkOrderDocument(htmlContent, t("workOrder"));
    
    PrintService.printHtml(printDoc, 'receipt', () => {
      document.body.classList.remove('printing');
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
      toast({
        title: t("success"),
        description: t("printJobSent")
      });
    });
  } catch (error) {
    console.error('Print error:', error);
    document.body.classList.remove('printing');
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    toast({
      title: t("error"),
      description: t("printError"),
      variant: "destructive"
    });
  }
};
