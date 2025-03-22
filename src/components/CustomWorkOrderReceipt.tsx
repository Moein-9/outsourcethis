import React from "react";
import { format } from "date-fns";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
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
  isPrintable = false
}) => {
  const { language, t } = useLanguageStore();
  const isRtl = language === 'ar';
  const dirClass = isRtl ? "rtl" : "ltr";
  
  // Get data from either workOrder, invoice, or directly provided patient
  const patientName = patient?.name || invoice?.patientName || workOrder?.patientName || "Customer";
  const patientPhone = patient?.phone || invoice?.patientPhone || workOrder?.patientPhone;
  
  // Extract prescription data
  const rx = patient?.rx || workOrder?.rx;
  
  // Extract frame data
  const frameData = {
    brand: workOrder?.frameBrand || invoice?.frameBrand || "",
    model: workOrder?.frameModel || invoice?.frameModel || "",
    color: workOrder?.frameColor || invoice?.frameColor || "",
    size: workOrder?.frameSize || invoice?.frameSize || "",
    price: workOrder?.framePrice || invoice?.framePrice || 0
  };
  
  // Extract lens data
  const lensType = workOrder?.lensType || invoice?.lensType || "";
  const lensPrice = workOrder?.lensPrice || invoice?.lensPrice || 0;
  
  // Extract coating data
  const coating = workOrder?.coating || invoice?.coating || "";
  const coatingPrice = workOrder?.coatingPrice || invoice?.coatingPrice || 0;
  
  // Payment data
  const total = invoice?.total || workOrder?.total || 0;
  const deposit = invoice?.deposit || workOrder?.deposit || 0;
  const discount = invoice?.discount || workOrder?.discount || 0;
  const subtotal = total + discount;
  const amountPaid = invoice?.payments 
    ? invoice.payments.reduce((sum, payment) => sum + payment.amount, 0) 
    : deposit || 0;
  const remaining = total - amountPaid;
  const isPaid = remaining <= 0;
  
  const invoiceNumber = invoice?.invoiceId || invoice?.workOrderId || workOrder?.id || `WO${Date.now().toString().slice(-6)}`;
  
  return (
    <div 
      className={`${dirClass} print-receipt`} 
      id="work-order-receipt"
      dir={isRtl ? "rtl" : "ltr"}
      style={{ 
        width: '80mm', 
        maxWidth: '80mm',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '2mm',
        fontSize: '10px',
        border: isPrintable ? 'none' : '1px solid #ddd',
        borderRadius: isPrintable ? '0' : '5px',
        boxShadow: isPrintable ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
        fontFamily: 'Cairo, sans-serif',
        lineHeight: '1.1'
      }}
    >
      {/* Header Section with Logo - Reduced spacing */}
      <div className="text-center border-b pb-1 mb-1">
        <div className="flex justify-center mb-0.5">
          <MoenLogo className="w-auto h-10 mb-0.5" />
        </div>
        <h2 className="font-bold text-base mb-0">
          {storeInfo.name}
        </h2>
        <p className="text-[9px] text-muted-foreground">{storeInfo.address}</p>
        <p className="text-[9px] text-muted-foreground">{t("phone")}: {storeInfo.phone}</p>
      </div>

      {/* Work Order Header - Reduced spacing */}
      <div className="text-center mb-1">
        <h3 className="font-bold text-base">
          {isRtl ? "أمر عمل" : "WORK ORDER"}
          {!isRtl && " - أمر عمل"}
        </h3>
        <p className="text-[9px]">
          {isRtl ? "ORDER #: " : "رقم الطلب: "}
          {invoiceNumber}
        </p>
        <p className="text-[9px]">
          {format(new Date(), 'yyyy-MM-dd HH:mm')}
        </p>
      </div>

      {/* Patient Information - Reduced spacing */}
      <div className="mb-1">
        <div className="text-center bg-muted py-0.5 mb-1 font-bold text-[10px] border-y">
          {isRtl ? "معلومات المريض" : "PATIENT INFORMATION"}
          {!isRtl && " - معلومات المريض"}
        </div>
        
        <div className="space-y-0.5 text-[9px]">
          <div className="flex justify-between">
            <span className="font-semibold">{t("customer")}:</span>
            <span>{patientName}</span>
          </div>
          
          {patientPhone && (
            <div className="flex justify-between">
              <span className="font-semibold">{t("phone")}:</span>
              <span>{patientPhone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Prescription Information - English format & Reduced spacing */}
      {rx && (
        <div className="mb-1">
          <div className="text-center bg-muted py-0.5 mb-1 font-bold text-[10px] border-y">
            {isRtl ? "تفاصيل الوصفة الطبية" : "PRESCRIPTION DETAILS"}
            {!isRtl && " - تفاصيل الوصفة الطبية"}
          </div>
          
          <table className="w-full border-collapse text-[8px]" style={{ direction: 'ltr' }}>
            <thead>
              <tr className="bg-muted/50">
                <th className="p-0.5 border text-center">Eye</th>
                <th className="p-0.5 border text-center">SPH</th>
                <th className="p-0.5 border text-center">CYL</th>
                <th className="p-0.5 border text-center">AXIS</th>
                <th className="p-0.5 border text-center">ADD</th>
                <th className="p-0.5 border text-center">PD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-0.5 border font-bold text-center">OD (R)</td>
                <td className="p-0.5 border text-center">{rx.sphereOD || "—"}</td>
                <td className="p-0.5 border text-center">{rx.cylOD || "—"}</td>
                <td className="p-0.5 border text-center">{rx.axisOD || "—"}</td>
                <td className="p-0.5 border text-center">{rx.addOD || rx.add || "—"}</td>
                <td className="p-0.5 border text-center">{rx.pdOD || rx.pdRight || rx.pd || "—"}</td>
              </tr>
              <tr>
                <td className="p-0.5 border font-bold text-center">OS (L)</td>
                <td className="p-0.5 border text-center">{rx.sphereOS || "—"}</td>
                <td className="p-0.5 border text-center">{rx.cylOS || "—"}</td>
                <td className="p-0.5 border text-center">{rx.axisOS || "—"}</td>
                <td className="p-0.5 border text-center">{rx.addOS || rx.add || "—"}</td>
                <td className="p-0.5 border text-center">{rx.pdOS || rx.pdLeft || rx.pd || "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Product Information - Reduced spacing */}
      <div className="mb-1">
        <div className="text-center bg-muted py-0.5 mb-1 font-bold text-[10px] border-y">
          {isRtl ? "تفاصيل المنتج" : "PRODUCT DETAILS"}
          {!isRtl && " - تفاصيل المنتج"}
        </div>
        
        <div className="space-y-0.5 text-[9px]">
          {/* Frame section */}
          {frameData.brand && (
            <div className="mb-1">
              <div className="font-semibold border-b pb-0.5 mb-0.5">
                {isRtl ? "الإطار (Frame)" : "Frame (الإطار)"}:
              </div>
              <div className="px-1 space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isRtl ? "الماركة (Brand)" : "Brand (الماركة)"}:</span>
                  <span>{frameData.brand}</span>
                </div>
                {frameData.model && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRtl ? "الموديل (Model)" : "Model (الموديل)"}:</span>
                    <span>{frameData.model}</span>
                  </div>
                )}
                {frameData.color && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRtl ? "اللون (Color)" : "Color (اللون)"}:</span>
                    <span>{frameData.color}</span>
                  </div>
                )}
                {frameData.size && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRtl ? "المقاس (Size)" : "Size (المقاس)"}:</span>
                    <span>{frameData.size}</span>
                  </div>
                )}
                {frameData.price > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRtl ? "السعر (Price)" : "Price (السعر)"}:</span>
                    <span>{frameData.price.toFixed(3)} KWD</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Lens section */}
          {lensType && (
            <div className="mb-1">
              <div className="font-semibold border-b pb-0.5 mb-0.5">
                {isRtl ? "العدسات (Lenses)" : "Lenses (العدسات)"}:
              </div>
              <div className="px-1 space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isRtl ? "النوع (Type)" : "Type (النوع)"}:</span>
                  <span>{lensType}</span>
                </div>
                {lensPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRtl ? "السعر (Price)" : "Price (السعر)"}:</span>
                    <span>{lensPrice.toFixed(3)} KWD</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Coating section */}
          {coating && (
            <div className="mb-1">
              <div className="font-semibold border-b pb-0.5 mb-0.5">
                {isRtl ? "الطلاء (Coating)" : "Coating (الطلاء)"}:
              </div>
              <div className="px-1 space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isRtl ? "النوع (Type)" : "Type (النوع)"}:</span>
                  <span>{coating}</span>
                </div>
                {coatingPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isRtl ? "السعر (Price)" : "Price (السعر)"}:</span>
                    <span>{coatingPrice.toFixed(3)} KWD</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Information - Reduced spacing */}
      <div className="mb-1">
        <div className="text-center bg-muted py-0.5 mb-1 font-bold text-[10px] border-y">
          {isRtl ? "معلومات الدفع" : "PAYMENT INFORMATION"}
          {!isRtl && " - معلومات الدفع"}
        </div>
        
        <div className="space-y-0.5 text-[9px]">
          <div className="flex justify-between">
            <span className="font-semibold">{t("subtotal")}:</span>
            <span>{subtotal.toFixed(3)} KWD</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="font-semibold">{t("discount")}:</span>
              <span>-{discount.toFixed(3)} KWD</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="font-semibold">{t("total")}:</span>
            <span>{total.toFixed(3)} KWD</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-semibold">{t("paid")}:</span>
            <span>{amountPaid.toFixed(3)} KWD</span>
          </div>
          
          {/* Payment Status Section - More compact */}
          {isPaid ? (
            <div className="mt-1 p-1 bg-green-100 rounded border border-green-300 text-center">
              <div className="flex items-center justify-center gap-1 text-green-700 font-bold text-[10px]">
                <CheckCircle2 className="w-3 h-3" />
                <span>{isRtl ? "تم الدفع بالكامل" : "PAID IN FULL"}</span>
              </div>
              {!isRtl ? <div className="text-green-600 text-[8px]">تم الدفع بالكامل</div> : 
                       <div className="text-green-600 text-[8px]">PAID IN FULL</div>}
            </div>
          ) : (
            <div className="mt-1">
              <div className="p-1 bg-red-100 rounded border border-red-300 text-center">
                <div className="font-bold text-red-700 text-[10px]">
                  {isRtl ? "المبلغ المتبقي" : "REMAINING AMOUNT"}
                </div>
                <div className="text-base font-bold text-red-600">
                  {remaining.toFixed(3)} KWD
                </div>
                {!isRtl ? <div className="text-red-600 text-[8px]">المبلغ المتبقي</div> : 
                         <div className="text-red-600 text-[8px]">REMAINING AMOUNT</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quality Confirmation - Reduced spacing */}
      <div className="mb-1">
        <div className="text-center bg-muted py-0.5 mb-1 font-bold text-[10px] border-y">
          {isRtl ? "تأكيد الجودة" : "QUALITY CONFIRMATION"}
          {!isRtl && " - تأكيد الجودة"}
        </div>
        
        <div className="flex gap-1 text-[8px] mb-0.5">
          <div className="border rounded p-0.5 flex-1">
            <div className="font-semibold mb-0.5 text-center border-b pb-0.5">
              {isRtl ? "توقيع الفني" : "Technician Signature"}
            </div>
            <div className="h-7"></div>
          </div>
          
          <div className="border rounded p-0.5 flex-1">
            <div className="font-semibold mb-0.5 text-center border-b pb-0.5">
              {isRtl ? "توقيع المدير" : "Manager Signature"}
            </div>
            <div className="h-7"></div>
          </div>
        </div>
      </div>

      {/* Footer - Keep the Arabic text as requested */}
      <div className="text-center border-t pt-1 text-[9px]">
        <p className="font-semibold mb-0.5">
          {isRtl ? "شكراً لاختياركم نظارات المعين" : "Thank you for choosing Moein Optical"}
          {!isRtl && " - شكراً لاختياركم نظارات المعين"}
        </p>
        <p className="text-[8px] text-muted-foreground">
          {isRtl ? "هذا الإيصال يعتبر إثبات للطلب فقط وليس إيصال دفع" : 
                  "This receipt is proof of order only and not a payment receipt"}
          {!isRtl && " - هذا الإيصال يعتبر إثبات للطلب فقط وليس إيصال دفع"}
        </p>
      </div>
    </div>
  );
};
