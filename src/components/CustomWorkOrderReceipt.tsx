
import React from "react";
import { format } from "date-fns";
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
  
  // Find the actual lens name from store based on type (lowercased for case-insensitive comparison)
  // Important: We need to find the lens by its type value (e.g., "reading", "distance")
  const matchingLens = lensTypes.find(lt => lt.type?.toLowerCase() === lensType?.toLowerCase());
  const lensName = matchingLens?.name || getLensTypeArabic(lensType);
  
  // Extract coating data
  const coating = workOrder?.coating || invoice?.coating || "";
  const coatingPrice = workOrder?.coatingPrice || invoice?.coatingPrice || 0;
  
  // Find the actual coating name from store
  // Try to match by partial name or description (case-insensitive)
  const matchingCoating = lensCoatings.find(c => 
    (c.name && coating && c.name.toLowerCase().includes(coating.toLowerCase())) || 
    (c.description && coating && c.description.toLowerCase().includes(coating.toLowerCase()))
  );
  const coatingName = matchingCoating?.name || getCoatingArabic(coating);
  
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
  
  // For debugging
  console.log("Lens data:", { 
    lensType, 
    matchingLens, 
    lensName, 
    allLensTypes: lensTypes.map(lt => ({type: lt.type, name: lt.name}))
  });
  
  console.log("Coating data:", { 
    coating, 
    matchingCoating, 
    coatingName, 
    allCoatings: lensCoatings.map(c => ({name: c.name, desc: c.description}))
  });
  
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
        padding: '3mm',
        fontSize: '11px',
        border: isPrintable ? 'none' : '1px solid #ddd',
        borderRadius: isPrintable ? '0' : '5px',
        boxShadow: isPrintable ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
        fontFamily: isRtl ? 'Cairo, sans-serif' : 'Cairo, sans-serif'
      }}
    >
      {/* Header Section with Logo */}
      <div className="text-center border-b pb-2 mb-2">
        <div className="flex justify-center mb-1">
          <MoenLogo className="w-auto h-14 mb-1" />
        </div>
        <h2 className="font-bold text-lg mb-0.5">{storeInfo.name}</h2>
        <p className="text-xs text-muted-foreground">{storeInfo.address}</p>
        <p className="text-xs text-muted-foreground">{t("phone")}: {storeInfo.phone}</p>
      </div>

      {/* Work Order Header */}
      <div className="text-center mb-3">
        <h3 className="font-bold text-lg">
          {isRtl ? "أمر عمل" : "WORK ORDER"}
        </h3>
        <p className="text-xs">
          {isRtl ? "ORDER #: " : "رقم الطلب: "}
          {invoiceNumber}
        </p>
        <p className="text-xs">
          {format(new Date(), 'yyyy-MM-dd HH:mm')}
        </p>
      </div>

      {/* Patient Information */}
      <div className="mb-3">
        <div className="text-center bg-muted py-1 mb-2 font-bold text-sm border-y">
          {isRtl 
            ? "معلومات المريض | Patient Information" 
            : "Patient Information | معلومات المريض"}
        </div>
        
        <div className="space-y-1 text-xs">
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

      {/* Prescription Information */}
      {rx && (
        <div className="mb-3">
          <div className="text-center bg-muted py-1 mb-2 font-bold text-sm border-y">
            {isRtl 
              ? "تفاصيل الوصفة الطبية | Prescription Details" 
              : "Prescription Details | تفاصيل الوصفة الطبية"}
          </div>
          
          <table className="w-full border-collapse text-xs" style={{ direction: 'ltr' }}>
            <thead>
              <tr className="bg-muted/50">
                <th className="p-1 border text-center">Eye</th>
                <th className="p-1 border text-center">Sphere</th>
                <th className="p-1 border text-center">Cylinder</th>
                <th className="p-1 border text-center">Axis</th>
                <th className="p-1 border text-center">Add</th>
                <th className="p-1 border text-center">PD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-1 border font-bold text-center">R</td>
                <td className="p-1 border text-center">{rx.sphereOD || "—"}</td>
                <td className="p-1 border text-center">{rx.cylOD || "—"}</td>
                <td className="p-1 border text-center">{rx.axisOD || "—"}</td>
                <td className="p-1 border text-center">{rx.addOD || rx.add || "—"}</td>
                <td className="p-1 border text-center">{rx.pdRight || rx.pdOD || rx.pd || "—"}</td>
              </tr>
              <tr>
                <td className="p-1 border font-bold text-center">L</td>
                <td className="p-1 border text-center">{rx.sphereOS || "—"}</td>
                <td className="p-1 border text-center">{rx.cylOS || "—"}</td>
                <td className="p-1 border text-center">{rx.axisOS || "—"}</td>
                <td className="p-1 border text-center">{rx.addOS || rx.add || "—"}</td>
                <td className="p-1 border text-center">{rx.pdLeft || rx.pdOS || rx.pd || "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Product Information */}
      <div className="mb-3">
        <div className="text-center bg-muted py-1 mb-2 font-bold text-sm border-y">
          {isRtl 
            ? "تفاصيل المنتج | Product Details" 
            : "Product Details | تفاصيل المنتج"}
        </div>
        
        <div className="space-y-1.5 text-xs">
          {/* Frame section */}
          {frameData.brand && (
            <div className="mb-2">
              <div className="font-semibold border-b pb-0.5 mb-1">
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
            <div className="mb-2">
              <div className="font-semibold border-b pb-0.5 mb-1">
                {isRtl ? "العدسات (Lenses)" : "Lenses (العدسات)"}:
              </div>
              <div className="px-1 space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isRtl ? "النوع (Type)" : "Type (النوع)"}:</span>
                  <div className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-semibold">{lensName}</span>
                      <span className="border rounded px-1 bg-slate-50 text-xs text-blue-500">{lensType}</span>
                    </div>
                  </div>
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
            <div className="mb-2">
              <div className="font-semibold border-b pb-0.5 mb-1">
                {isRtl ? "الطلاء (Coating)" : "Coating (الطلاء)"}:
              </div>
              <div className="px-1 space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isRtl ? "النوع (Type)" : "Type (النوع)"}:</span>
                  <div className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-semibold">{coatingName}</span>
                      <span className="border rounded px-1 bg-slate-50 text-xs text-blue-500">{coating}</span>
                    </div>
                  </div>
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

      {/* Payment Information */}
      <div className="mb-3">
        <div className="text-center bg-muted py-1 mb-2 font-bold text-sm border-y">
          {isRtl 
            ? "معلومات الدفع | Payment Information" 
            : "Payment Information | معلومات الدفع"}
        </div>
        
        <div className="space-y-1 text-xs">
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
          
          {/* Payment Status Section */}
          {isPaid ? (
            <div className="mt-2 p-2 bg-green-100 rounded border border-green-300 text-center">
              <div className="flex items-center justify-center gap-1 text-green-700 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isRtl ? "تم الدفع بالكامل" : "PAID IN FULL"}</span>
              </div>
              {!isRtl ? <div className="text-green-600 text-xs">تم الدفع بالكامل</div> : 
                       <div className="text-green-600 text-xs">PAID IN FULL</div>}
            </div>
          ) : (
            <div className="mt-2">
              <div className="p-2 bg-red-100 rounded border border-red-300 text-center">
                <div className="font-bold text-red-700 text-base">
                  {isRtl ? "المبلغ المتبقي" : "REMAINING AMOUNT"}
                </div>
                <div className="text-lg font-bold text-red-600 mt-1">
                  {remaining.toFixed(3)} KWD
                </div>
                {!isRtl ? <div className="text-red-600 text-xs">المبلغ المتبقي</div> : 
                         <div className="text-red-600 text-xs">REMAINING AMOUNT</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quality Confirmation */}
      <div className="mb-3">
        <div className="text-center bg-muted py-1 mb-2 font-bold text-sm border-y">
          {isRtl 
            ? "تأكيد الجودة | Quality Confirmation" 
            : "Quality Confirmation | تأكيد الجودة"}
        </div>
        
        <div className="flex gap-2 text-xs mb-1">
          <div className="border rounded p-1 flex-1">
            <div className="font-semibold mb-1 text-center border-b pb-1">
              {isRtl ? "توقيع الفني" : "Technician Signature"}
            </div>
            <div className="h-10"></div>
          </div>
          
          <div className="border rounded p-1 flex-1">
            <div className="font-semibold mb-1 text-center border-b pb-1">
              {isRtl ? "توقيع المدير" : "Manager Signature"}
            </div>
            <div className="h-10"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t pt-2 text-xs">
        <p className="font-semibold">
          {isRtl ? "شكراً لاختياركم نظارات المعين" : "Thank you for choosing Moein Optical"}
        </p>
        <p className="text-[9px] text-muted-foreground mt-1">
          {isRtl ? "هذا الإيصال يعتبر إثبات للطلب فقط وليس إيصال دفع" : 
                  "This receipt is proof of order only and not a payment receipt"}
        </p>
      </div>
    </div>
  );
};

// Helper functions to map lens types and coatings to their Arabic equivalents
// These are kept as fallbacks in case the store doesn't have the data
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
