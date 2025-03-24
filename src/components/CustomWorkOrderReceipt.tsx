
import React from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { CheckCircle2, AlertTriangle } from "lucide-react";
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
  
  const patientName = patient?.name || invoice?.patientName || workOrder?.patientName || t("anonymous");
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

  // If there's no workOrder or invoice data, show a message
  if (!workOrder && !invoice) {
    return (
      <div 
        className={`${dirClass} print-receipt`} 
        id="work-order-receipt"
        dir={isRtl ? "rtl" : "ltr"}
        style={{ 
          width: '80mm', 
          maxWidth: '80mm',
          margin: '0 auto',
          backgroundColor: '#FFFBEB', // Light yellow background
          padding: '6mm',
          fontSize: '12px',
          border: '1px solid #FDE68A',
          borderRadius: '4px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          fontFamily: isRtl ? 'Cairo, sans-serif' : 'Cairo, sans-serif',
          pageBreakInside: 'avoid',
          pageBreakAfter: 'always'
        }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-3 py-6">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
          <h3 className="font-bold text-amber-800 text-lg text-center">
            {t("startBySelectingClient")}
          </h3>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`${dirClass} print-receipt`} 
      id="work-order-receipt"
      dir={isRtl ? "rtl" : "ltr"}
      style={{ 
        width: '80mm', 
        maxWidth: '80mm',
        margin: '0 auto',
        backgroundColor: '#222222', // Dark background
        color: 'white',
        padding: '3mm',
        fontSize: '12px',
        border: isPrintable ? 'none' : '1px solid #333',
        borderRadius: isPrintable ? '0' : '4px',
        boxShadow: isPrintable ? 'none' : '0 1px 3px rgba(0,0,0,0.3)',
        fontFamily: isRtl ? 'Cairo, sans-serif' : 'Cairo, sans-serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always'
      }}
    >
      <div className="text-center border-b border-gray-700 pb-2 mb-2">
        <div className="flex justify-center mb-1">
          <MoenLogo className="w-auto h-12" />
        </div>
        <h2 className="font-bold text-lg mb-0 text-yellow-300">{storeInfo.name}</h2>
        <p className="text-xs font-medium mb-0 text-gray-300">{storeInfo.address}</p>
        <p className="text-xs font-medium text-gray-300">{t("phone")}: {storeInfo.phone}</p>
      </div>

      <div className="text-center mb-2">
        <h3 className="font-bold text-lg mb-0 text-yellow-300">
          {isRtl ? "أمر عمل" : "WORK ORDER"}
        </h3>
        <p className="text-xs mb-0 text-gray-300">
          {isRtl ? "ORDER #: " : "رقم الطلب: "}
          <span className="text-white">{invoiceNumber}</span>
        </p>
        <p className="text-xs text-gray-300">
          {format(new Date(), 'yyyy-MM-dd HH:mm', { locale: enUS })}
        </p>
      </div>

      <div className="mb-3">
        <div className="text-center bg-yellow-600 text-white py-1 mb-1.5 font-bold text-base rounded">
          {isRtl 
            ? "معلومات المريض | Patient Information" 
            : "Patient Information | معلومات المريض"}
        </div>
        
        <div className="space-y-1 text-xs px-3">
          <div className="flex justify-between">
            <span className="font-bold text-gray-300">{t("customer")}:</span>
            <span className="font-semibold text-white">{patientName}</span>
          </div>
          
          {patientPhone && (
            <div className="flex justify-between">
              <span className="font-bold text-gray-300">{t("phone")}:</span>
              <span className="font-semibold text-white">{patientPhone}</span>
            </div>
          )}
        </div>
      </div>

      {rx && (
        <div className="mb-3">
          <div className="text-center bg-yellow-600 text-white py-1 mb-1.5 font-bold text-base rounded">
            {isRtl 
              ? "تفاصيل الوصفة الطبية | Prescription Details" 
              : "Prescription Details | تفاصيل الوصفة الطبية"}
          </div>
          
          <table className="w-full border-collapse text-xs" style={{ direction: 'ltr' }}>
            <thead>
              <tr className="bg-gray-700">
                <th className="p-1 border border-gray-600 text-center font-bold">Eye</th>
                <th className="p-1 border border-gray-600 text-center font-bold">Sphere</th>
                <th className="p-1 border border-gray-600 text-center font-bold">Cylinder</th>
                <th className="p-1 border border-gray-600 text-center font-bold">Axis</th>
                <th className="p-1 border border-gray-600 text-center font-bold">Add</th>
                <th className="p-1 border border-gray-600 text-center font-bold">PD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-1 border border-gray-600 font-bold text-center bg-gray-800">R</td>
                <td className="p-1 border border-gray-600 text-center">{rx.sphereOD || "—"}</td>
                <td className="p-1 border border-gray-600 text-center">{rx.cylOD || "—"}</td>
                <td className="p-1 border border-gray-600 text-center">{rx.axisOD || "—"}</td>
                <td className="p-1 border border-gray-600 text-center">{rx.addOD || rx.add || "—"}</td>
                <td className="p-1 border border-gray-600 text-center">{rx.pdRight || rx.pdOD || rx.pd || "—"}</td>
              </tr>
              <tr>
                <td className="p-1 border border-gray-600 font-bold text-center bg-gray-800">L</td>
                <td className="p-1 border border-gray-600 text-center">{rx.sphereOS || "—"}</td>
                <td className="p-1 border border-gray-600 text-center">{rx.cylOS || "—"}</td>
                <td className="p-1 border border-gray-600 text-center">{rx.axisOS || "—"}</td>
                <td className="p-1 border border-gray-600 text-center">{rx.addOS || rx.add || "—"}</td>
                <td className="p-1 border border-gray-600 text-center">{rx.pdLeft || rx.pdOS || rx.pd || "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="mb-3">
        <div className="text-center bg-yellow-600 text-white py-1 mb-1.5 font-bold text-base rounded">
          {isRtl 
            ? "تفاصيل المنتج | Product Details" 
            : "Product Details | تفاصيل المنتج"}
        </div>
        
        <div className="space-y-2 text-xs px-2">
          {frameData.brand && (
            <div className="mb-2">
              <div className="font-bold border-b border-gray-700 pb-1 mb-1 text-yellow-300">
                {isRtl ? "الإطار (Frame)" : "Frame (الإطار)"}:
              </div>
              <div className="px-2 space-y-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-300">{isRtl ? "الماركة (Brand)" : "Brand (الماركة)"}:</span>
                  <span className="text-white">{frameData.brand}</span>
                </div>
                {frameData.model && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-300">{isRtl ? "الموديل (Model)" : "Model (الموديل)"}:</span>
                    <span className="text-white">{frameData.model}</span>
                  </div>
                )}
                {frameData.color && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-300">{isRtl ? "اللون (Color)" : "Color (اللون)"}:</span>
                    <span className="text-white">{frameData.color}</span>
                  </div>
                )}
                {frameData.size && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-300">{isRtl ? "المقاس (Size)" : "Size (المقاس)"}:</span>
                    <span className="text-white">{frameData.size}</span>
                  </div>
                )}
                {frameData.price > 0 && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-300">{isRtl ? "السعر (Price)" : "Price (السعر)"}:</span>
                    <span className="text-white">{frameData.price.toFixed(3)} KWD</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {lensType && (
            <div className="mb-2">
              <div className="font-bold border-b border-gray-700 pb-1 mb-1 text-yellow-300">
                {isRtl ? "العدسات (Lenses)" : "Lenses (العدسات)"}:
              </div>
              <div className="px-2 space-y-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-300">{isRtl ? "النوع (Type)" : "Type (النوع)"}:</span>
                  <span className="font-semibold text-white">{lensName}</span>
                </div>
                {lensPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-300">{isRtl ? "السعر (Price)" : "Price (السعر)"}:</span>
                    <span className="text-white">{lensPrice.toFixed(3)} KWD</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {coating && (
            <div className="mb-2">
              <div className="font-bold border-b border-gray-700 pb-1 mb-1 text-yellow-300">
                {isRtl ? "الطلاء (Coating)" : "Coating (الطلاء)"}:
              </div>
              <div className="px-2 space-y-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-300">{isRtl ? "النوع (Type)" : "Type (النوع)"}:</span>
                  <span className="font-semibold text-white">{coatingName}</span>
                </div>
                {coatingPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-300">{isRtl ? "السعر (Price)" : "Price (السعر)"}:</span>
                    <span className="text-white">{coatingPrice.toFixed(3)} KWD</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-center bg-yellow-600 text-white py-1 mb-1.5 font-bold text-base rounded">
          {isRtl 
            ? "معلومات الدفع | Payment Information" 
            : "Payment Information | معلومات الدفع"}
        </div>
        
        <div className="space-y-1 text-xs px-3">
          <div className="flex justify-between">
            <span className="font-bold text-gray-300">{t("subtotal")}:</span>
            <span className="font-semibold text-white">{subtotal.toFixed(3)} KWD</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="font-bold text-gray-300">{t("discount")}:</span>
              <span className="font-semibold text-white">-{discount.toFixed(3)} KWD</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="font-bold text-gray-300">{t("total")}:</span>
            <span className="font-semibold text-white">{total.toFixed(3)} KWD</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-bold text-gray-300">{t("paid")}:</span>
            <span className="font-semibold text-white">{amountPaid.toFixed(3)} KWD</span>
          </div>
          
          {isPaid ? (
            <div className="mt-2 p-1.5 bg-green-900 rounded border border-green-700 text-center">
              <div className="flex items-center justify-center gap-1 text-green-300 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">{isRtl ? "تم الدفع بالكامل" : "PAID IN FULL"}</span>
              </div>
              {!isRtl ? <div className="text-green-400 text-xs">تم الدفع بالكامل</div> : 
                       <div className="text-green-400 text-xs">PAID IN FULL</div>}
            </div>
          ) : (
            <div className="mt-2">
              <div className="p-1.5 bg-red-900 rounded border border-red-700 text-center">
                <div className="font-bold text-red-300 text-sm">
                  {isRtl ? "المبلغ المتبقي" : "REMAINING AMOUNT"}
                </div>
                <div className="text-base font-bold text-red-200">
                  {remaining.toFixed(3)} KWD
                </div>
                {!isRtl ? <div className="text-red-300 text-xs">المبلغ المتبقي</div> : 
                         <div className="text-red-300 text-xs">REMAINING AMOUNT</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-center bg-yellow-600 text-white py-1 mb-1.5 font-bold text-base rounded">
          {isRtl 
            ? "تأكيد الجودة | Quality Confirmation" 
            : "Quality Confirmation | تأكيد الجودة"}
        </div>
        
        <div className="flex gap-2 text-xs mb-1 px-1">
          <div className="border border-gray-700 rounded p-1 flex-1 bg-gray-800">
            <div className="font-bold mb-1 text-center border-b border-gray-700 pb-0.5 text-gray-300">
              {isRtl ? "توقيع الفني" : "Technician Signature"}
            </div>
            <div className="h-8"></div>
          </div>
          
          <div className="border border-gray-700 rounded p-1 flex-1 bg-gray-800">
            <div className="font-bold mb-1 text-center border-b border-gray-700 pb-0.5 text-gray-300">
              {isRtl ? "توقيع المدير" : "Manager Signature"}
            </div>
            <div className="h-8"></div>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-center bg-yellow-600 text-white py-1 mb-1.5 font-bold text-base rounded">
          {isRtl 
            ? "ملاحظات | Notes" 
            : "Notes | ملاحظات"}
        </div>
        
        <div className="border border-gray-700 rounded p-2 min-h-16 bg-gray-800">
          
        </div>
      </div>

      <div className="text-center border-t border-gray-700 pt-2 text-xs">
        <p className="font-bold text-sm mb-0 text-yellow-300">
          {isRtl ? "شكراً لاختياركم نظارات المعين" : "Thank you for choosing Moein Optical"}
        </p>
        <p className="text-[9px] mt-1 text-gray-400">
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
              background: #222222 !important; /* Dark background for print */
              color: white !important;
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
              background: #222222 !important; /* Dark background for print */
              color: white !important;
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
