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
  isEyeExam?: boolean;
}

export const printWorkOrderReceipt = (props: WorkOrderReceiptPrintProps) => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.zIndex = '-1000';
  container.style.opacity = '0';
  document.body.appendChild(container);
  
  try {
    const { language } = useLanguageStore.getState();
    const isRtl = language === "ar";
    
    const content = `
      <div 
        id="work-order-receipt"
        dir="${isRtl ? "rtl" : "ltr"}"
        class="print-receipt"
        style="
          width: 80mm; 
          font-family: ${isRtl ? "'Zain', sans-serif" : "'Yrsa', serif"};
          max-width: 80mm;
          overflow: hidden; 
          margin: 0 auto;
          padding: 2mm;
          background-color: white;
          font-size: 10px;
          line-height: 1.2
        "
      >
        <div style="text-align: center; margin-bottom: 4px;">
          <div style="margin-bottom: 2px; display: flex; justify-content: center;">
            <img src="/lovable-uploads/d0902afc-d6a5-486b-9107-68104dfd2a68.png" style="height: 24px; margin: 0 auto;" />
          </div>
          <h1 style="font-size: 14px; font-weight: bold; margin: 2px 0;">
            ${storeInfo.name}
          </h1>
          <p style="font-size: 9px; margin: 0;">${storeInfo.address}</p>
          <p style="font-size: 9px; margin: 0;">${storeInfo.phone}</p>
        </div>
        
        <div style="border-top: 1px dashed #000; margin: 4px 0;"></div>
        
        <div style="margin-bottom: 4px;">
          <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px;">
            <span style="font-weight: bold;">${isRtl ? "رقم أمر العمل" : "Work Order Number"}:</span> 
            <span>${props.invoice.workOrderId || ""}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px;">
            <span style="font-weight: bold;">${isRtl ? "التاريخ" : "Date"}:</span>
            <span>${format(new Date(props.invoice.createdAt || new Date()), "PPP", { locale: isRtl ? ar : enUS })}</span>
          </div>
        </div>
        
        <div style="margin-bottom: 4px; font-size: 10px;">
          <h2 style="
            font-size: 12px; 
            font-weight: bold; 
            margin: 2px 0; 
            border-bottom: 1px solid #ccc; 
            padding-bottom: 2px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 4px;
          ">
            ${isRtl ? (
              `<span>معلومات المريض</span>
               <span style="font-size: 10px;">patient Information</span>`
            ) : (
              `<span>patient Information</span>
               <span style="font-size: 10px;">معلومات المريض</span>`
            )}
          </h2>
          <div style="margin-left: 2px;">
            <div style="margin-bottom: 1px; display: flex; justify-content: space-between;">
              <span style="font-weight: bold;">${isRtl ? "الاسم" : "Name"}:</span>
              <span>${props.patientName || props.invoice.patientName || (isRtl ? "غير محدد" : "Not Specified")}</span>
            </div>
            ${props.patientPhone ? `
            <div style="margin-bottom: 1px; display: flex; justify-content: space-between;">
              <span style="font-weight: bold;">${isRtl ? "الهاتف" : "Phone"}:</span>
              <span>${props.patientPhone}</span>
            </div>
            ` : ''}
          </div>
        </div>
        
        ${props.rx ? `
        <div style="margin-bottom: 4px; font-size: 10px;">
          <h2 style="
            font-size: 12px; 
            font-weight: bold; 
            margin: 2px 0; 
            border-bottom: 1px solid #ccc; 
            padding-bottom: 2px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 4px;
          ">
            ${isRtl ? (
              `<span>تفاصيل الوصفة الطبية</span>
               <span style="font-size: 10px;">prescription Details</span>`
            ) : (
              `<span>prescription Details</span>
               <span style="font-size: 10px;">تفاصيل الوصفة الطبية</span>`
            )}
          </h2>
          
          <table style="
            width: 100%; 
            border-collapse: collapse; 
            font-size: 8px; 
            margin-top: 2px;
            direction: ltr;
          ">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 2px; text-align: center;"></th>
                <th style="border: 1px solid #ddd; padding: 2px; text-align: center;">SPH</th>
                <th style="border: 1px solid #ddd; padding: 2px; text-align: center;">CYL</th>
                <th style="border: 1px solid #ddd; padding: 2px; text-align: center;">AX</th>
                ${(props.rx.pdOD || props.rx.pdOS || props.rx.pd) ? `<th style="border: 1px solid #ddd; padding: 2px; text-align: center;">PD</th>` : ''}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #ddd; padding: 2px; font-weight: bold; text-align: center;">
                  OD ${isRtl ? '(يمين)' : '(Right)'}
                </td>
                <td style="border: 1px solid #ddd; padding: 2px; text-align: center;">${props.rx.sphereOD || "-"}</td>
                <td style="border: 1px solid #ddd; padding: 2px; text-align: center;">${props.rx.cylOD || "-"}</td>
                <td style="border: 1px solid #ddd; padding: 2px; text-align: center;">${props.rx.axisOD || "-"}</td>
                ${(props.rx.pdOD || props.rx.pdOS || props.rx.pd) ? `
                  <td style="border: 1px solid #ddd; padding: 2px; text-align: center;">
                    ${props.rx.pdOD || props.rx.pd || "-"}
                  </td>
                ` : ''}
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 2px; font-weight: bold; text-align: center;">
                  OS ${isRtl ? '(يسار)' : '(Left)'}
                </td>
                <td style="border: 1px solid #ddd; padding: 2px; text-align: center;">${props.rx.sphereOS || "-"}</td>
                <td style="border: 1px solid #ddd; padding: 2px; text-align: center;">${props.rx.cylOS || "-"}</td>
                <td style="border: 1px solid #ddd; padding: 2px; text-align: center;">${props.rx.axisOS || "-"}</td>
                ${(props.rx.pdOD || props.rx.pdOS || props.rx.pd) ? `
                  <td style="border: 1px solid #ddd; padding: 2px; text-align: center;">
                    ${props.rx.pdOS || props.rx.pd || "-"}
                  </td>
                ` : ''}
              </tr>
            </tbody>
          </table>
          
          ${props.rx.add ? `
          <div style="margin-top: 2px; display: flex; justify-content: space-between;">
            <span style="font-weight: bold;">ADD:</span>
            <span>${props.rx.add}</span>
          </div>
          ` : ''}
        </div>
        ` : ''}
        
        <div style="margin-bottom: 4px; font-size: 10px;">
          <h2 style="
            font-size: 12px; 
            font-weight: bold; 
            margin: 2px 0; 
            border-bottom: 1px solid #ccc; 
            padding-bottom: 2px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 4px;
          ">
            ${isRtl ? (
              `<span>تفاصيل المنتج</span>
               <span style="font-size: 10px;">product Details</span>`
            ) : (
              `<span>product Details</span>
               <span style="font-size: 10px;">تفاصيل المنتج</span>`
            )}
          </h2>
          
          ${props.frame ? `
          <div style="margin-bottom: 3px;">
            <h3 style="font-size: 11px; font-weight: bold; margin: 2px 0;">
              ${isRtl ? 'الإطار' : 'Frame'} ${isRtl ? `<span style="font-size: 10px;">(Frame)</span>` : `<span style="font-size: 10px;">(الإطار)</span>`}
            </h3>
            <div style="margin-left: 2px;">
              <div style="margin-bottom: 1px; display: flex; justify-content: space-between;">
                <span style="font-weight: bold;">${isRtl ? "الماركة/الموديل" : "Brand/Model"}:</span>
                <span>${props.frame.brand} ${props.frame.model}</span>
              </div>
              <div style="margin-bottom: 1px; display: flex; justify-content: space-between;">
                <span style="font-weight: bold;">${isRtl ? "اللون" : "Color"}:</span>
                <span>${props.frame.color}</span>
              </div>
              ${props.frame.size ? `
              <div style="margin-bottom: 1px; display: flex; justify-content: space-between;">
                <span style="font-weight: bold;">${isRtl ? "الحجم" : "Size"}:</span>
                <span>${props.frame.size}</span>
              </div>
              ` : ''}
              <div style="margin-bottom: 1px; display: flex; justify-content: space-between;">
                <span style="font-weight: bold;">${isRtl ? "السعر" : "Price"}:</span>
                <span>${props.frame.price.toFixed(3)} KWD</span>
              </div>
            </div>
          </div>
          ` : ''}
          
          ${props.lensType ? `
          <div style="margin-bottom: 3px;">
            <h3 style="font-size: 11px; font-weight: bold; margin: 2px 0;">
              ${isRtl ? 'العدسات الطبية' : 'Lenses'} ${isRtl ? `<span style="font-size: 10px;">(Lenses)</span>` : `<span style="font-size: 10px;">(العدسات الطبية)</span>`}
            </h3>
            <div style="margin-left: 2px;">
              <div style="margin-bottom: 1px; display: flex; justify-content: space-between;">
                <span style="font-weight: bold;">${isRtl ? "النوع" : "Type"}:</span>
                <span>${props.lensType}</span>
              </div>
              <div style="margin-bottom: 1px; display: flex; justify-content: space-between;">
                <span style="font-weight: bold;">${isRtl ? "السعر" : "Price"}:</span>
                <span>${props.invoice.lensPrice.toFixed(3)} KWD</span>
              </div>
            </div>
          </div>
          ` : ''}
          
          ${props.coating ? `
          <div style="margin-bottom: 3px;">
            <h3 style="font-size: 11px; font-weight: bold; margin: 2px 0;">
              ${isRtl ? 'الطلاء' : 'Coating'} ${isRtl ? `<span style="font-size: 10px;">(Coating)</span>` : `<span style="font-size: 10px;">(الطلاء)</span>`}
            </h3>
            <div style="margin-left: 2px;">
              <div style="margin-bottom: 1px; display: flex; justify-content: space-between;">
                <span style="font-weight: bold;">${isRtl ? "النوع" : "Type"}:</span>
                <span>${props.coating}</span>
              </div>
              <div style="margin-bottom: 1px; display: flex; justify-content: space-between;">
                <span style="font-weight: bold;">${isRtl ? "السعر" : "Price"}:</span>
                <span>${props.invoice.coatingPrice.toFixed(3)} KWD</span>
              </div>
            </div>
          </div>
          ` : ''}
          
          ${props.contactLenses && props.contactLenses.length > 0 ? `
          <div style="margin-bottom: 3px;">
            <h3 style="font-size: 11px; font-weight: bold; margin: 2px 0;">
              ${isRtl ? 'العدسات اللاصقة' : 'Contact Lenses'} ${isRtl ? `<span style="font-size: 10px;">(Contact Lenses)</span>` : `<span style="font-size: 10px;">(العدسات اللاصقة)</span>`}
            </h3>
            ${props.contactLenses.slice(0, 2).map((lens, index) => `
              <div key="${index}" style="margin-left: 2px; margin-bottom: 1px;">
                <div style="margin-bottom: 1px; display: flex; justify-content: space-between;">
                  <span style="font-weight: bold;">${isRtl ? "النوع" : "Type"}:</span>
                  <span>${lens.brand} ${lens.type}</span>
                </div>
                ${lens.color ? `
                <div style="margin-bottom: 1px; display: flex; justify-content: space-between;">
                  <span style="font-weight: bold;">${isRtl ? "اللون" : "Color"}:</span>
                  <span>${lens.color}</span>
                </div>
                ` : ''}
                <div style="margin-bottom: 1px; display: flex; justify-content: space-between;">
                  <span style="font-weight: bold;">${isRtl ? "الكمية" : "Quantity"}:</span>
                  <span>${lens.qty || 1}</span>
                </div>
                <div style="margin-bottom: 1px; display: flex; justify-content: space-between;">
                  <span style="font-weight: bold;">${isRtl ? "السعر الإفرادي" : "Unit Price"}:</span>
                  <span>${lens.price.toFixed(3)} KWD</span>
                </div>
                ${(lens.qty && lens.qty > 1) ? `
                <div style="margin-bottom: 1px; display: flex; justify-content: space-between;">
                  <span style="font-weight: bold;">${isRtl ? "المجموع" : "Total"}:</span>
                  <span>${(lens.price * (lens.qty || 1)).toFixed(3)} KWD</span>
                </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
        
        <div style="
          margin-bottom: 3px;
          font-size: 11px;
          border: 1px solid #ccc;
          padding: 3px;
          border-radius: 3px;
          background-color: #f8f8f8;
        ">
          <h2 style="
            font-size: 13px;
            font-weight: bold;
            margin: 1px 0 2px 0;
            border-bottom: 1px solid #ccc;
            padding-bottom: 2px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 4px;
          ">
            ${isRtl ? (
              `<span>معلومات الدفع</span>
               <span style="font-size: 11px;">payment Information</span>`
            ) : (
              `<span>payment Information</span>
               <span style="font-size: 11px;">معلومات الدفع</span>`
            )}
          </h2>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
            <span style="font-weight: bold;">${isRtl ? "المجموع الفرعي" : "Subtotal"}:</span>
            <span>${(props.invoice.total + props.invoice.discount).toFixed(3)} KWD</span>
          </div>
          
          ${props.invoice.discount > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
            <span style="font-weight: bold;">${isRtl ? "الخصم" : "Discount"}:</span>
            <span>-${props.invoice.discount.toFixed(3)} KWD</span>
          </div>
          ` : ''}
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
            <span style="font-weight: bold;">${isRtl ? "المجموع" : "Total"}:</span>
            <span>${props.invoice.total.toFixed(3)} KWD</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
            <span style="font-weight: bold;">${isRtl ? "المدفوع" : "Paid"}:</span>
            <span>${props.invoice.deposit.toFixed(3)} KWD</span>
          </div>
          
          ${props.invoice.deposit >= props.invoice.total ? `
          <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 4px;
            background-color: #E6F7E6;
            padding: 4px;
            border-radius: 4px;
            margin: 4px 0 1px 0;
            font-weight: bold;
            font-size: 13px;
            border: 1px solid #A3D9A3;
            color: #1F7A1F;
          ">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 10L11 15L8 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ${isRtl ? (
              `<span>تم الدفع بالكامل (PAID IN FULL)</span>`
            ) : (
              `<span>PAID IN FULL (تم الدفع بالكامل)</span>`
            )}
          </div>
          ` : `
          <div style="
            display: flex;
            justify-content: space-between;
            background-color: #FEE2E2;
            padding: 4px;
            border-radius: 4px;
            margin: 4px 0 1px 0;
            font-weight: bold;
            font-size: 15px;
            border: 1px solid #FECACA;
            color: #B91C1C;
          ">
            ${isRtl ? (
              `<span>المتبقي (REMAINING):</span>`
            ) : (
              `<span>REMAINING (المتبقي):</span>`
            )}
            <span>${(props.invoice.total - props.invoice.deposit).toFixed(3)} KWD</span>
          </div>
          `}
        </div>

        <div style="margin-top: 10px; border-top: 1px dashed #000; padding-top: 5px;">
          <div style="margin-bottom: 8px;">
            <h3 style="font-size: 11px; font-weight: bold; margin: 2px 0; display: flex; align-items: center; justify-content: space-between;">
              ${isRtl ? (
                `<span>تأكيد الجودة</span>
                 <span style="font-size: 10px;">quality Confirmation</span>`
              ) : (
                `<span>quality Confirmation</span>
                 <span style="font-size: 10px;">تأكيد الجودة</span>`
              )}
            </h3>
            <div style="border-bottom: 1px solid #ccc; height: 15px; margin-top: 5px;"></div>
            <div style="display: flex; justify-content: flex-end; font-size: 9px; margin-top: 2px;">
              <span>${isRtl ? "التاريخ" : "Date"}: ____ /____ /____</span>
            </div>
          </div>
        </div>
        
        <div style="border-top: 1px dashed #000; padding-top: 5px; margin-top: 10px; text-align: center;">
          <div style="font-size: 10px; font-weight: bold; margin-bottom: 2px;">
            ${isRtl ? "شكراً لاختياركم نظارات المعين" : "Thank you for choosing Moein Optical"}
          </div>
          <div style="font-size: 7px; color: #666;">
            ${isRtl ? 
              "هذا الإيصال دليل طلب فقط وليس إيصال دفع" : 
              "This receipt is proof of order only and not a payment receipt"
            }
          </div>
        </div>
      </div>
    `;
    
    const printContent = PrintService.prepareReceiptDocument(content);
    PrintService.printHtml(printContent, 'receipt');
    
    setTimeout(() => {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, 2000);
    
  } catch (error) {
    console.error("Error printing work order receipt:", error);
    toast({
      title: "Error",
      description: "Failed to print work order receipt. Please try again.",
      variant: "destructive"
    });
  }
};

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
  isEyeExam,
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
            direction: "ltr"
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
                  <span style={{ fontWeight: "bold" }}>{isRtl ? "الكمية" : "Quantity"}:</span>
                  <span>{lens.qty || 1}</span>
                </div>
                <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "bold" }}>{isRtl ? "السعر الإفرادي" : "Unit Price"}:</span>
                  <span>{lens.price.toFixed(3)} KWD</span>
                </div>
                {lens.qty && lens.qty > 1 && (
                  <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "bold" }}>{isRtl ? "المجموع" : "Total"}:</span>
                    <span>{(lens.price * (lens.qty || 1)).toFixed(3)} KWD</span>
                  </div>
                )}
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
      
      {isEyeExam && (
        <div style={{ marginBottom: "3px" }}>
          <h3 style={{ fontSize: "11px", fontWeight: "bold", margin: "2px 0" }}>
            {isRtl ? 'فحص العين' : 'Eye Exam'} {isRtl ? <span style={{ fontSize: "10px" }}>(Eye Exam)</span> : <span style={{ fontSize: "10px" }}>(فحص العين)</span>}
          </h3>
          <div style={{ marginLeft: "2px" }}>
            <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "bold" }}>{isRtl ? "الخدمة" : "Service"}:</span>
              <span>{invoice.serviceName || t("eyeExam")}</span>
            </div>
            <div style={{ marginBottom: "1px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "bold" }}>{isRtl ? "السعر" : "Price"}:</span>
              <span>{invoice.servicePrice.toFixed(3)} KWD</span>
            </div>
          </div>
        </div>
      )}
      
      <style>
        {`
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
        `}
      </style>
    </div>
  );
};
