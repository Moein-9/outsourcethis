
import React from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { CheckCircle2 } from "lucide-react";
import { useInventoryStore } from "@/store/inventoryStore";

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
  const { lensTypes, lensCoatings } = useInventoryStore();
  const isRtl = language === 'ar';
  const dirClass = isRtl ? "rtl" : "ltr";
  
  const patientName = patient?.name || invoice?.patientName || workOrder?.patientName || "Customer";
  const patientPhone = patient?.phone || invoice?.patientPhone || workOrder?.patientPhone;
  
  const rx = patient?.rx || workOrder?.rx;
  
  const frameData = {
    brand: workOrder?.frameBrand || invoice?.frameBrand || "",
    model: workOrder?.frameModel || invoice?.frameModel || "",
    color: workOrder?.frameColor || invoice?.frameColor || "",
    size: workOrder?.frameSize || invoice?.frameSize || "",
    price: workOrder?.framePrice || invoice?.framePrice || 0
  };
  
  const lensType = workOrder?.lensType || invoice?.lensType || "";
  const lensPrice = workOrder?.lensPrice || invoice?.lensPrice || 0;
  
  const matchingLens = lensTypes.find(lt => lt.type?.toLowerCase() === lensType?.toLowerCase());
  const lensName = matchingLens?.name || getLensTypeArabic(lensType);
  
  const coating = workOrder?.coating || invoice?.coating || "";
  const coatingPrice = workOrder?.coatingPrice || invoice?.coatingPrice || 0;
  
  const matchingCoating = lensCoatings.find(c => 
    (c.name && coating && c.name.toLowerCase().includes(coating.toLowerCase())) || 
    (c.description && coating && c.description.toLowerCase().includes(coating.toLowerCase()))
  );
  const coatingName = matchingCoating?.name || getCoatingArabic(coating);
  
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
        fontSize: '12px',
        border: isPrintable ? 'none' : '1px solid #ddd',
        borderRadius: isPrintable ? '0' : '4px',
        boxShadow: isPrintable ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
        fontFamily: isRtl ? 'Cairo, sans-serif' : 'Cairo, sans-serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always'
      }}
    >
      <div className="text-center border-b pb-1 mb-1">
        <div className="flex justify-center mb-1">
          <MoenLogo className="w-auto h-10" />
        </div>
        <h2 className="font-bold text-lg mb-0">{storeInfo.name}</h2>
        <p className="text-xs font-medium mb-0">{storeInfo.address}</p>
        <p className="text-xs font-medium">{t("phone")}: {storeInfo.phone}</p>
      </div>

      <div className="text-center mb-1">
        <h3 className="font-bold text-lg mb-0">
          {isRtl ? "أمر عمل" : "WORK ORDER"}
        </h3>
        <p className="text-xs mb-0">
          {isRtl ? "ORDER #: " : "رقم الطلب: "}
          {invoiceNumber}
        </p>
        <p className="text-xs">
          {format(new Date(), 'yyyy-MM-dd HH:mm', { locale: enUS })}
        </p>
      </div>

      <div className="mb-2">
        <div className="text-center bg-black text-white py-0.5 mb-1 font-bold text-base border-y">
          {isRtl 
            ? "معلومات المريض | Patient Information" 
            : "Patient Information | معلومات المريض"}
        </div>
        
        <div className="space-y-0.5 text-xs px-2">
          <div className="flex justify-between">
            <span className="font-bold">{t("customer")}:</span>
            <span className="font-semibold">{patientName}</span>
          </div>
          
          {patientPhone && (
            <div className="flex justify-between">
              <span className="font-bold">{t("phone")}:</span>
              <span className="font-semibold">{patientPhone}</span>
            </div>
          )}
        </div>
      </div>

      {rx && (
        <div className="mb-2">
          <div className="text-center bg-black text-white py-0.5 mb-1 font-bold text-base">
            {isRtl 
              ? "تفاصيل الوصفة الطبية | Prescription Details" 
              : "Prescription Details | تفاصيل الوصفة الطبية"}
          </div>
          
          <table className="w-full border-collapse text-xs" style={{ direction: 'ltr' }}>
            <thead>
              <tr className="bg-gray-200">
                <th className="p-0.5 border text-center font-bold">Eye</th>
                <th className="p-0.5 border text-center font-bold">Sphere</th>
                <th className="p-0.5 border text-center font-bold">Cylinder</th>
                <th className="p-0.5 border text-center font-bold">Axis</th>
                <th className="p-0.5 border text-center font-bold">Add</th>
                <th className="p-0.5 border text-center font-bold">PD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-0.5 border font-bold text-center">R</td>
                <td className="p-0.5 border text-center">{rx.sphereOD || "—"}</td>
                <td className="p-0.5 border text-center">{rx.cylOD || "—"}</td>
                <td className="p-0.5 border text-center">{rx.axisOD || "—"}</td>
                <td className="p-0.5 border text-center">{rx.addOD || rx.add || "—"}</td>
                <td className="p-0.5 border text-center">{rx.pdRight || rx.pdOD || rx.pd || "—"}</td>
              </tr>
              <tr>
                <td className="p-0.5 border font-bold text-center">L</td>
                <td className="p-0.5 border text-center">{rx.sphereOS || "—"}</td>
                <td className="p-0.5 border text-center">{rx.cylOS || "—"}</td>
                <td className="p-0.5 border text-center">{rx.axisOS || "—"}</td>
                <td className="p-0.5 border text-center">{rx.addOS || rx.add || "—"}</td>
                <td className="p-0.5 border text-center">{rx.pdLeft || rx.pdOS || rx.pd || "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="mb-2">
        <div className="text-center bg-black text-white py-0.5 mb-1 font-bold text-base">
          {isRtl 
            ? "تفاصيل المنتج | Product Details" 
            : "Product Details | تفاصيل المنتج"}
        </div>
        
        <div className="space-y-1 text-xs px-1">
          {frameData.brand && (
            <div className="mb-1">
              <div className="font-bold border-b pb-0.5 mb-0.5">
                {isRtl ? "الإطار (Frame)" : "Frame (الإطار)"}:
              </div>
              <div className="px-1 space-y-0.5">
                <div className="flex justify-between">
                  <span className="font-semibold">{isRtl ? "الماركة (Brand)" : "Brand (الماركة)"}:</span>
                  <span>{frameData.brand}</span>
                </div>
                {frameData.model && (
                  <div className="flex justify-between">
                    <span className="font-semibold">{isRtl ? "الموديل (Model)" : "Model (الموديل)"}:</span>
                    <span>{frameData.model}</span>
                  </div>
                )}
                {frameData.color && (
                  <div className="flex justify-between">
                    <span className="font-semibold">{isRtl ? "اللون (Color)" : "Color (اللون)"}:</span>
                    <span>{frameData.color}</span>
                  </div>
                )}
                {frameData.size && (
                  <div className="flex justify-between">
                    <span className="font-semibold">{isRtl ? "المقاس (Size)" : "Size (المقاس)"}:</span>
                    <span>{frameData.size}</span>
                  </div>
                )}
                {frameData.price > 0 && (
                  <div className="flex justify-between">
                    <span className="font-semibold">{isRtl ? "السعر (Price)" : "Price (السعر)"}:</span>
                    <span>{frameData.price.toFixed(3)} KWD</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {lensType && (
            <div className="mb-1">
              <div className="font-bold border-b pb-0.5 mb-0.5">
                {isRtl ? "العدسات (Lenses)" : "Lenses (العدسات)"}:
              </div>
              <div className="px-1 space-y-0.5">
                <div className="flex justify-between">
                  <span className="font-semibold">{isRtl ? "النوع (Type)" : "Type (النوع)"}:</span>
                  <span className="font-semibold">{lensName}</span>
                </div>
                {lensPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="font-semibold">{isRtl ? "السعر (Price)" : "Price (السعر)"}:</span>
                    <span>{lensPrice.toFixed(3)} KWD</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {coating && (
            <div className="mb-1">
              <div className="font-bold border-b pb-0.5 mb-0.5">
                {isRtl ? "الطلاء (Coating)" : "Coating (الطلاء)"}:
              </div>
              <div className="px-1 space-y-0.5">
                <div className="flex justify-between">
                  <span className="font-semibold">{isRtl ? "النوع (Type)" : "Type (النوع)"}:</span>
                  <span className="font-semibold">{coatingName}</span>
                </div>
                {coatingPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="font-semibold">{isRtl ? "السعر (Price)" : "Price (السعر)"}:</span>
                    <span>{coatingPrice.toFixed(3)} KWD</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-2">
        <div className="text-center bg-black text-white py-0.5 mb-1 font-bold text-base">
          {isRtl 
            ? "معلومات الدفع | Payment Information" 
            : "Payment Information | معلومات الدفع"}
        </div>
        
        <div className="space-y-0.5 text-xs px-2">
          <div className="flex justify-between">
            <span className="font-bold">{t("subtotal")}:</span>
            <span className="font-semibold">{subtotal.toFixed(3)} KWD</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="font-bold">{t("discount")}:</span>
              <span className="font-semibold">-{discount.toFixed(3)} KWD</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="font-bold">{t("total")}:</span>
            <span className="font-semibold">{total.toFixed(3)} KWD</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-bold">{t("paid")}:</span>
            <span className="font-semibold">{amountPaid.toFixed(3)} KWD</span>
          </div>
          
          {isPaid ? (
            <div className="mt-1 p-1 bg-green-100 rounded border border-green-300 text-center">
              <div className="flex items-center justify-center gap-0.5 text-green-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-sm">{isRtl ? "تم الدفع بالكامل" : "PAID IN FULL"}</span>
              </div>
              {!isRtl ? <div className="text-green-600 text-xs">تم الدفع بالكامل</div> : 
                       <div className="text-green-600 text-xs">PAID IN FULL</div>}
            </div>
          ) : (
            <div className="mt-1">
              <div className="p-1 bg-red-100 rounded border border-red-300 text-center">
                <div className="font-bold text-red-700 text-sm">
                  {isRtl ? "المبلغ المتبقي" : "REMAINING AMOUNT"}
                </div>
                <div className="text-base font-bold text-red-600">
                  {remaining.toFixed(3)} KWD
                </div>
                {!isRtl ? <div className="text-red-600 text-xs">المبلغ المتبقي</div> : 
                         <div className="text-red-600 text-xs">REMAINING AMOUNT</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-2">
        <div className="text-center bg-black text-white py-0.5 mb-1 font-bold text-base">
          {isRtl 
            ? "تأكيد الجودة | Quality Confirmation" 
            : "Quality Confirmation | تأكيد الجودة"}
        </div>
        
        <div className="flex gap-1 text-xs mb-1 px-1">
          <div className="border rounded p-0.5 flex-1">
            <div className="font-bold mb-0.5 text-center border-b pb-0.5">
              {isRtl ? "توقيع الفني" : "Technician Signature"}
            </div>
            <div className="h-6"></div>
          </div>
          
          <div className="border rounded p-0.5 flex-1">
            <div className="font-bold mb-0.5 text-center border-b pb-0.5">
              {isRtl ? "توقيع المدير" : "Manager Signature"}
            </div>
            <div className="h-6"></div>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div className="text-center bg-black text-white py-0.5 mb-1 font-bold text-base">
          {isRtl 
            ? "ملاحظات | Notes" 
            : "Notes | ملاحظات"}
        </div>
        
        <div className="border rounded p-1 min-h-16">
          
        </div>
      </div>

      <div className="text-center border-t pt-1 text-xs">
        <p className="font-bold text-sm mb-0">
          {isRtl ? "شكراً لاختياركم نظارات المعين" : "Thank you for choosing Moein Optical"}
        </p>
        <p className="text-[9px] mt-0.5">
          {isRtl ? "هذا الإيصال يعتبر إثبات للطلب فقط وليس إيصال دفع" : 
                  "This receipt is proof of order only and not a payment receipt"}
        </p>
      </div>
      
      <style>
        {`
          @media print {
            @page {
              size: 80mm auto !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            body {
              width: 80mm !important;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }
            
            #work-order-receipt {
              width: 76mm !important; /* 80mm - 4mm for padding */
              max-width: 76mm !important;
              page-break-after: always !important;
              page-break-inside: avoid !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              border: none !important;
              box-shadow: none !important;
              padding: 2mm !important;
              margin: 0 !important;
              background: white !important;
              height: auto !important;
              min-height: 0 !important;
              max-height: none !important;
            }
            
            .print-receipt * {
              visibility: visible !important;
              opacity: 1 !important;
            }
            
            html, body {
              height: auto !important;
              min-height: 0 !important;
              max-height: none !important;
              overflow: visible !important;
            }
            
            body {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .print-receipt {
              height: fit-content !important;
              min-height: fit-content !important;
              max-height: fit-content !important;
            }
            
            .print-receipt {
              break-inside: avoid !important;
              break-after: avoid-page !important;
              page-break-inside: avoid !important;
              page-break-after: avoid !important;
            }
            
            @supports (-webkit-appearance:none) {
              body, html, #work-order-receipt {
                height: fit-content !important;
                min-height: fit-content !important;
                max-height: fit-content !important;
              }
            }
          }
        `}
      </style>
    </div>
  );
};

const getLensTypeArabic = (lensType: string): string => {
  const lensTypeMap: Record<string, string> = {
    "Single Vision": "نظارات للنظر",
    "Progressive": "عدسات متعددة البؤر",
    "Bifocal": "ثنائية البؤرة",
    "Reading": "نظارات للقراءة",
    "Distance": "نظارات للنظر البعيد",
    "Intermediate": "نظارات للمسافة المتوسطة",
    // Add more mappings as needed
  };
  
  return lensTypeMap[lensType] || lensType;
};

const getCoatingArabic = (coating: string): string => {
  const coatingMap: Record<string, string> = {
    "Anti-Reflective": "طلاء مضاد للانعكاس",
    "Blue Light Filter": "فلتر الضوء الأزرق",
    "Photochromic": "عدسات متغيرة اللون",
    "Scratch Resistant": "مقاوم للخدش",
    "UV Protection": "حماية من الأشعة فوق البنفسجية",
    "Polarized": "استقطاب",
    // Add more mappings as needed
  };
  
  return coatingMap[coating] || coating;
};
