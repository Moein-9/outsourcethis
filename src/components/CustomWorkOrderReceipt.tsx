
import React from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { enUS } from "date-fns/locale/en-US";
import { QRCodeSVG } from "qrcode.react";
import { useLanguageStore } from "@/store/languageStore";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { CheckCircle2 } from "lucide-react";

interface CustomWorkOrderReceiptProps {
  workOrder: any;
  invoice?: any;
  patient?: any;
  isPrintable?: boolean;
}

export const CustomWorkOrderReceipt: React.FC<CustomWorkOrderReceiptProps> = ({
  workOrder,
  invoice,
  patient,
  isPrintable = true
}) => {
  const { t, language } = useLanguageStore.getState();
  const isRtl = language === "ar";
  
  const formatDate = (date: Date | string) => {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "PPP", { locale: isRtl ? ar : enUS });
  };
  
  // Handle circular references
  const invoiceData = invoice && typeof invoice === 'object' && invoice !== workOrder ? invoice : workOrder;
  
  // Make sure to use workOrderId, not invoiceId
  const orderNumber = workOrder.workOrderId || (workOrder.invoiceId ? `WO${workOrder.invoiceId.substring(3)}` : "");
  
  const generateQRData = () => {
    return JSON.stringify({
      workOrderId: orderNumber,
      patientName: patient?.name || workOrder.patientName,
      total: workOrder.total,
      date: workOrder.createdAt,
    });
  };

  const patientName = patient?.name || workOrder.patientName;
  const patientPhone = patient?.phone || workOrder.patientPhone;
  const rx = patient?.rx;

  const subtotal = workOrder.total + (workOrder.discount || 0);
  const amountPaid = workOrder.deposit || 0;
  const remaining = workOrder.total - amountPaid;
  const isPaid = remaining <= 0;

  return (
    <div 
      id="custom-work-order-receipt"
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
          <span>{formatDate(workOrder.createdAt)}</span>
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
        
        {workOrder.frameBrand && (
          <div style={{ marginBottom: "3px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: "bold", margin: "2px 0" }}>
              {isRtl ? 'الإطار' : 'Frame'} {isRtl ? <span style={{ fontSize: "10px" }}>(Frame)</span> : <span style={{ fontSize: "10px" }}>(الإطار)</span>}
            </h3>
            <div style={{ marginLeft: "2px" }}>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{isRtl ? "الماركة/الموديل" : "Brand/Model"}:</span>
                <span>{workOrder.frameBrand} {workOrder.frameModel}</span>
              </div>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{isRtl ? "اللون" : "Color"}:</span>
                <span>{workOrder.frameColor}</span>
              </div>
              {workOrder.frameSize && (
                <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "bold" }}>{isRtl ? "الحجم" : "Size"}:</span>
                  <span>{workOrder.frameSize}</span>
                </div>
              )}
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{isRtl ? "السعر" : "Price"}:</span>
                <span>{workOrder.framePrice.toFixed(3)} KWD</span>
              </div>
            </div>
          </div>
        )}
        
        {workOrder.lensType && (
          <div style={{ marginBottom: "3px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: "bold", margin: "2px 0" }}>
              {isRtl ? 'العدسات الطبية' : 'Lenses'} {isRtl ? <span style={{ fontSize: "10px" }}>(Lenses)</span> : <span style={{ fontSize: "10px" }}>(العدسات الطبية)</span>}
            </h3>
            <div style={{ marginLeft: "2px" }}>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{isRtl ? "النوع" : "Type"}:</span>
                <span>{workOrder.lensType}</span>
              </div>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{isRtl ? "السعر" : "Price"}:</span>
                <span>{workOrder.lensPrice.toFixed(3)} KWD</span>
              </div>
            </div>
          </div>
        )}
        
        {workOrder.coating && (
          <div style={{ marginBottom: "3px" }}>
            <h3 style={{ fontSize: "11px", fontWeight: "bold", margin: "2px 0" }}>
              {isRtl ? 'الطلاء' : 'Coating'} {isRtl ? <span style={{ fontSize: "10px" }}>(Coating)</span> : <span style={{ fontSize: "10px" }}>(الطلاء)</span>}
            </h3>
            <div style={{ marginLeft: "2px" }}>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{isRtl ? "النوع" : "Type"}:</span>
                <span>{workOrder.coating}</span>
              </div>
              <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{isRtl ? "السعر" : "Price"}:</span>
                <span>{workOrder.coatingPrice.toFixed(3)} KWD</span>
              </div>
            </div>
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
        {workOrder.discount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1px" }}>
            <span style={{ fontWeight: "bold" }}>{isRtl ? "الخصم" : "Discount"}:</span>
            <span>-{workOrder.discount.toFixed(3)} KWD</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1px" }}>
          <span style={{ fontWeight: "bold" }}>{isRtl ? "المجموع" : "Total"}:</span>
          <span>{workOrder.total.toFixed(3)} KWD</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1px" }}>
          <span style={{ fontWeight: "bold" }}>{isRtl ? "المدفوع" : "Paid"}:</span>
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

      {/* Quality confirmation section */}
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

        <div style={{ marginBottom: "5px" }}>
          <h3 style={{ fontSize: "11px", fontWeight: "bold", margin: "2px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {isRtl ? (
              <>
                <span>توقيع الفني</span>
                <span style={{ fontSize: "10px" }}>technician Signature</span>
              </>
            ) : (
              <>
                <span>technician Signature</span>
                <span style={{ fontSize: "10px" }}>توقيع الفني</span>
              </>
            )}
          </h3>
          <div style={{ borderBottom: "1px solid #ccc", height: "15px", marginTop: "5px" }}></div>
          <div style={{ display: "flex", justifyContent: "flex-end", fontSize: "9px", marginTop: "2px" }}>
            <span>{isRtl ? "التاريخ" : "Date"}: ____ /____ /____</span>
          </div>
        </div>
      </div>
      
      <div style={{ borderTop: "1px dashed #000", margin: "2px 0", paddingTop: "2px" }}></div>
      
      <div style={{ textAlign: "center", marginBottom: "1px", fontSize: "8px" }}>
        <div style={{ margin: "2px auto", width: "32px", height: "32px" }}>
          <QRCodeSVG value={generateQRData()} size={32} />
        </div>
      </div>
    </div>
  );
};
