
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
      workOrderId: invoice.workOrderId,
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

  // Use workOrderId for the work order receipt
  const orderNumber = invoice.workOrderId || "";

  return (
    <div 
      id="work-order-receipt"
      dir={isRtl ? "rtl" : "ltr"}
      className="print-receipt"
      style={{ 
        width: "80mm", 
        fontFamily: isRtl ? "'Zain', sans-serif" : "'Yrsa', serif",
        maxWidth: "80mm",
        overflow: "hidden", 
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
          <span style={{ fontWeight: "bold" }}>{isRtl ? "رقم أمر العمل" : "Work Order Number"}:</span> 
          <span>{orderNumber}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", marginBottom: "2px" }}>
          <span style={{ fontWeight: "bold" }}>{isRtl ? "التاريخ" : "Date"}:</span>
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
          gap: "4px"
        }}>
          {isRtl ? (
            <>
              <span>معلومات المريض</span>
              <span style={{ fontSize: "10px" }}>patient Information</span>
            </>
          ) : (
            <>
              <span>patient Information</span>
              <span style={{ fontSize: "10px" }}>معلومات المريض</span>
            </>
          )}
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
            gap: "4px"
          }}>
            {isRtl ? (
              <>
                <span>تفاصيل الوصفة الطبية</span>
                <span style={{ fontSize: "10px" }}>prescription Details</span>
              </>
            ) : (
              <>
                <span>prescription Details</span>
                <span style={{ fontSize: "10px" }}>تفاصيل الوصفة الطبية</span>
              </>
            )}
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
          gap: "4px"
        }}>
          {isRtl ? (
            <>
              <span>تفاصيل المنتج</span>
              <span style={{ fontSize: "10px" }}>product Details</span>
            </>
          ) : (
            <>
              <span>product Details</span>
              <span style={{ fontSize: "10px" }}>تفاصيل المنتج</span>
            </>
          )}
        </h2>
        
        {frame && (
          <div style={{ marginBottom: "3px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: "bold", margin: "2px 0" }}>
              {isRtl ? 'الإطار' : 'Frame'} {isRtl ? <span style={{ fontSize: "10px" }}>(Frame)</span> : <span style={{ fontSize: "10px" }}>(الإطار)</span>}
            </h3>
            <div style={{ marginLeft: "2px" }}>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{isRtl ? "الماركة/الموديل" : "Brand/Model"}:</span>
                <span>{frame.brand} {frame.model}</span>
              </div>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{isRtl ? "اللون" : "Color"}:</span>
                <span>{frame.color}</span>
              </div>
              {frame.size && (
                <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "bold" }}>{isRtl ? "الحجم" : "Size"}:</span>
                  <span>{frame.size}</span>
                </div>
              )}
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{isRtl ? "السعر" : "Price"}:</span>
                <span>{frame.price.toFixed(3)} KWD</span>
              </div>
            </div>
          </div>
        )}
        
        {lensType && (
          <div style={{ marginBottom: "3px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: "bold", margin: "2px 0" }}>
              {isRtl ? 'العدسات الطبية' : 'Lenses'} {isRtl ? <span style={{ fontSize: "10px" }}>(Lenses)</span> : <span style={{ fontSize: "10px" }}>(العدسات الطبية)</span>}
            </h3>
            <div style={{ marginLeft: "2px" }}>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{isRtl ? "النوع" : "Type"}:</span>
                <span>{lensType}</span>
              </div>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{isRtl ? "السعر" : "Price"}:</span>
                <span>{invoice.lensPrice.toFixed(3)} KWD</span>
              </div>
            </div>
          </div>
        )}
        
        {coating && (
          <div style={{ marginBottom: "3px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: "bold", margin: "2px 0" }}>
              {isRtl ? 'الطلاء' : 'Coating'} {isRtl ? <span style={{ fontSize: "10px" }}>(Coating)</span> : <span style={{ fontSize: "10px" }}>(الطلاء)</span>}
            </h3>
            <div style={{ marginLeft: "2px" }}>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{isRtl ? "النوع" : "Type"}:</span>
                <span>{coating}</span>
              </div>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{isRtl ? "السعر" : "Price"}:</span>
                <span>{invoice.coatingPrice.toFixed(3)} KWD</span>
              </div>
            </div>
          </div>
        )}
        
        {contactLenses && contactLenses.length > 0 && (
          <div style={{ marginBottom: "3px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: "bold", margin: "2px 0" }}>
              {isRtl ? 'العدسات اللاصقة' : 'Contact Lenses'} {isRtl ? <span style={{ fontSize: "10px" }}>(Contact Lenses)</span> : <span style={{ fontSize: "10px" }}>(العدسات اللاصقة)</span>}
            </h3>
            {contactLenses.slice(0, 2).map((lens, index) => (
              <div key={index} style={{ marginLeft: "2px", marginBottom: "1px" }}>
                <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "bold" }}>{isRtl ? "النوع" : "Type"}:</span>
                  <span>{lens.brand} {lens.type}</span>
                </div>
                {lens.color && (
                  <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "bold" }}>{isRtl ? "اللون" : "Color"}:</span>
                    <span>{lens.color}</span>
                  </div>
                )}
                <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "bold" }}>{isRtl ? "السعر" : "Price"}:</span>
                  <span>{lens.price.toFixed(3)} KWD</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ 
        marginBottom: "3px",
        fontSize: "11px", 
        border: "1px solid #ccc", 
        padding: "3px",
        borderRadius: "3px",
        backgroundColor: "#f8f8f8"
      }}>
        <h2 style={{ 
          fontSize: "13px", 
          fontWeight: "bold", 
          margin: "1px 0 2px 0",
          borderBottom: "1px solid #ccc", 
          paddingBottom: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4px"
        }}>
          {isRtl ? (
            <>
              <span>معلومات الدفع</span>
              <span style={{ fontSize: "11px" }}>payment Information</span>
            </>
          ) : (
            <>
              <span>payment Information</span>
              <span style={{ fontSize: "11px" }}>معلومات الدفع</span>
            </>
          )}
        </h2>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1px" }}>
          <span style={{ fontWeight: "bold" }}>{isRtl ? "المجموع الفرعي" : "Subtotal"}:</span>
          <span>{subtotal.toFixed(3)} KWD</span>
        </div>
        {invoice.discount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1px" }}>
            <span style={{ fontWeight: "bold" }}>{isRtl ? "الخصم" : "Discount"}:</span>
            <span>-{invoice.discount.toFixed(3)} KWD</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1px" }}>
          <span style={{ fontWeight: "bold" }}>{isRtl ? "المجموع" : "Total"}:</span>
          <span>{invoice.total.toFixed(3)} KWD</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1px" }}>
          <span style={{ fontWeight: "bold" }}>{isRtl ? "المدفوع" : "Paid"}:</span>
          <span>{amountPaid.toFixed(3)} KWD</span>
        </div>
        
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
            {isRtl ? (
              <span>تم الدفع بالكامل (PAID IN FULL)</span>
            ) : (
              <span>PAID IN FULL (تم الدفع بالكامل)</span>
            )}
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
            fontSize: "15px",
            border: "1px solid #FECACA",
            color: "#B91C1C"
          }}>
            {isRtl ? (
              <span>المتبقي (REMAINING):</span>
            ) : (
              <span>REMAINING (المتبقي):</span>
            )}
            <span>{remaining.toFixed(3)} KWD</span>
          </div>
        )}
      </div>

      <div style={{ marginTop: "10px", borderTop: "1px dashed #000", paddingTop: "5px" }}>
        <div style={{ marginBottom: "8px" }}>
          <h3 style={{ fontSize: "11px", fontWeight: "bold", margin: "2px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {isRtl ? (
              <>
                <span>تأكيد الجودة</span>
                <span style={{ fontSize: "10px" }}>quality Confirmation</span>
              </>
            ) : (
              <>
                <span>quality Confirmation</span>
                <span style={{ fontSize: "10px" }}>تأكيد الجودة</span>
              </>
            )}
          </h3>
          <div style={{ borderBottom: "1px solid #ccc", height: "15px", marginTop: "5px" }}></div>
          <div style={{ display: "flex", justifyContent: "flex-end", fontSize: "9px", marginTop: "2px" }}>
            <span>{isRtl ? "التاريخ" : "Date"}: ____ /____ /____</span>
          </div>
        </div>
      </div>
      
      <div style={{ borderTop: "1px dashed #000", paddingTop: "5px", marginTop: "10px", textAlign: "center" }}>
        <div style={{ fontSize: "10px", fontWeight: "bold", marginBottom: "2px" }}>
          {isRtl ? "شكراً لاختياركم نظارات المعين" : "Thank you for choosing Moein Optical"}
        </div>
        <div style={{ fontSize: "7px", color: "#666" }}>
          {isRtl ? 
            "هذا الإيصال دليل طلب فقط وليس إيصال دفع" : 
            "This receipt is proof of order only and not a payment receipt"
          }
        </div>
      </div>
      
      <style jsx>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          
          #work-order-receipt {
            width: 80mm;
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  );
};
