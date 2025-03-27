
import React from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { CheckCircle2, AlertTriangle, Calendar, User, Phone, Eye, Receipt, CreditCard } from "lucide-react";
import { useInventoryStore } from "@/store/inventoryStore";
import { 
  Card,
  CardContent, 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
  
  const contactLensItems = invoice?.contactLensItems || workOrder?.contactLenses || [];
  const isContactLens = contactLensItems && contactLensItems.length > 0;
  
  const lensType = workOrder?.lensType || invoice?.lensType || "";
  const lensPrice = workOrder?.lensPrice || invoice?.lensPrice || 0;
  
  const lensTypeString = typeof lensType === 'object' ? lensType?.type || '' : String(lensType);
  const matchingLens = lensTypes.find(lt => {
    const ltType = lt.type ? String(lt.type).toLowerCase() : '';
    return ltType === lensTypeString.toLowerCase();
  });
  
  const lensName = matchingLens?.name || getLensTypeArabic(lensTypeString);
  
  const coating = workOrder?.coating || invoice?.coating || "";
  const coatingPrice = workOrder?.coatingPrice || invoice?.coatingPrice || 0;
  
  const coatingString = typeof coating === 'object' ? coating?.name || '' : String(coating);
  const matchingCoating = lensCoatings.find(c => {
    const cName = c.name ? String(c.name).toLowerCase() : '';
    const cDesc = c.description ? String(c.description).toLowerCase() : '';
    return (cName && coatingString && cName.includes(coatingString.toLowerCase())) || 
           (cDesc && coatingString && cDesc.includes(coatingString.toLowerCase()));
  });
  
  const coatingName = matchingCoating?.name || getCoatingArabic(coatingString);
  
  const total = invoice?.total || workOrder?.total || 0;
  const deposit = invoice?.deposit || workOrder?.deposit || 0;
  const discount = invoice?.discount || workOrder?.discount || 0;
  const subtotal = total + discount;
  const amountPaid = invoice?.payments 
    ? invoice.payments.reduce((sum, payment) => sum + payment.amount, 0) 
    : deposit || 0;
  const remaining = total - amountPaid;
  const isPaid = remaining <= 0;
  
  const orderNumber = workOrder?.id || invoice?.workOrderId || `WO${Date.now().toString().slice(-6)}`;

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
          backgroundColor: '#FFFBEB',
          padding: '6mm',
          fontSize: '12px',
          border: '1px solid #FDE68A',
          borderRadius: '4px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          fontFamily: 'Cairo, sans-serif',
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
        backgroundColor: 'white',
        color: 'black',
        padding: '2mm',
        fontSize: '12px',
        border: isPrintable ? 'none' : '1px solid #222',
        borderRadius: isPrintable ? '0' : '4px',
        boxShadow: isPrintable ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
        fontFamily: 'Cairo, sans-serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always'
      }}
    >
      <div className="text-center border-b-2 border-black pb-2 mb-2">
        <div className="flex justify-center mb-1">
          <MoenLogo className="w-auto h-12" />
        </div>
        <h2 className="font-bold text-lg mb-0">{storeInfo.name}</h2>
        <p className="text-xs font-medium mb-0 text-gray-600">{storeInfo.address}</p>
        <p className="text-xs font-medium text-gray-600">{t("phone")}: {storeInfo.phone}</p>
      </div>

      <div className="text-center mb-3">
        <div className="inline-flex items-center justify-center gap-1 border-2 border-black px-2 py-0.5 rounded mb-1">
          <Receipt className="h-4 w-4" />
          <span className="font-bold text-base">
            {isRtl ? "أمر عمل | WORK ORDER" : "WORK ORDER | أمر عمل"}
          </span>
        </div>
        <div className="text-xs mb-0 text-gray-600">
          {isRtl ? "ORDER #: " : "رقم الطلب: "}
          <span className="font-semibold">{orderNumber}</span>
          <span className="mx-1">|</span>
          <span className="rx-creation-date">
            {format(new Date(), 'yyyy-MM-dd HH:mm', { locale: enUS })}
          </span>
        </div>
      </div>

      <div className="mb-3 border-2 border-black rounded p-1.5">
        <div className="mb-1 border-b border-gray-300 pb-1 text-center">
          <div className="flex items-center justify-center gap-1 font-bold">
            <User className="h-4 w-4" />
            <span>
              {isRtl ? "معلومات المريض | Patient" : "Patient | معلومات المريض"}
            </span>
          </div>
        </div>
        
        <div className="space-y-1 text-xs px-2">
          <div className="flex justify-between items-center">
            <span className="font-bold">{t("customer")}:</span>
            <span className="font-medium">{patientName}</span>
          </div>
          
          {patientPhone && (
            <div className="flex justify-between items-center">
              <span className="font-bold">{t("phone")}:</span>
              <span>{patientPhone}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="font-bold">{t("date")}:</span>
            <span>{format(new Date(), 'dd/MM/yyyy')}</span>
          </div>
        </div>
      </div>

      <div className="mb-3 border-2 border-black rounded p-1.5">
        <div className="mb-1 border-b border-gray-300 pb-1 text-center">
          <div className="flex items-center justify-center gap-1 font-bold">
            <Eye className="h-4 w-4" />
            <span>
              {isRtl ? "الوصفة الطبية | Prescription" : "Prescription | الوصفة الطبية"}
            </span>
          </div>
        </div>
        
        <table className="w-full border-collapse text-[10px]" style={{ direction: 'ltr' }}>
          <thead>
            <tr className="bg-gray-100">
              <th className="p-1 border border-gray-300 text-center font-bold">Eye</th>
              <th className="p-1 border border-gray-300 text-center font-bold">SPH</th>
              <th className="p-1 border border-gray-300 text-center font-bold">CYL</th>
              <th className="p-1 border border-gray-300 text-center font-bold">AXIS</th>
              <th className="p-1 border border-gray-300 text-center font-bold">ADD</th>
              <th className="p-1 border border-gray-300 text-center font-bold">PD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-1 border border-gray-300 font-bold text-center bg-gray-100">OD</td>
              <td className="p-1 border border-gray-300 text-center">{rx.sphereOD || "—"}</td>
              <td className="p-1 border border-gray-300 text-center">{rx.cylOD || "—"}</td>
              <td className="p-1 border border-gray-300 text-center">{rx.axisOD || "—"}</td>
              <td className="p-1 border border-gray-300 text-center">{rx.addOD || rx.add || "—"}</td>
              <td className="p-1 border border-gray-300 text-center">{rx.pdRight || rx.pdOD || rx.pd || "—"}</td>
            </tr>
            <tr>
              <td className="p-1 border border-gray-300 font-bold text-center bg-gray-100">OS</td>
              <td className="p-1 border border-gray-300 text-center">{rx.sphereOS || "—"}</td>
              <td className="p-1 border border-gray-300 text-center">{rx.cylOS || "—"}</td>
              <td className="p-1 border border-gray-300 text-center">{rx.axisOS || "—"}</td>
              <td className="p-1 border border-gray-300 text-center">{rx.addOS || rx.add || "—"}</td>
              <td className="p-1 border border-gray-300 text-center">{rx.pdLeft || rx.pdOS || rx.pd || "—"}</td>
            </tr>
          </tbody>
        </table>
        
        <div className="mt-1 text-[8px] flex justify-between px-1 font-medium">
          <span>OD = {isRtl ? "العين اليمنى" : "Right Eye"}</span>
          <span>OS = {isRtl ? "العين اليسرى" : "Left Eye"}</span>
        </div>
      </div>

      <div className="mb-3 border-2 border-black rounded p-1.5">
        <div className="mb-1 border-b border-gray-300 pb-1 text-center">
          <div className="flex items-center justify-center gap-1 font-bold">
            <span>
              {isRtl ? "المنتجات | Products" : "Products | المنتجات"}
            </span>
          </div>
        </div>
        
        <div className="space-y-1 text-xs px-1">
          {frameData.brand && !isContactLens && (
            <div className="border-b border-dashed border-gray-300 pb-1 mb-1">
              <div className="flex justify-between font-semibold">
                <span>{isRtl ? "الإطار" : "Frame"}:</span>
                <span>{frameData.price > 0 ? `${frameData.price.toFixed(3)} KWD` : ""}</span>
              </div>
              <div className="text-[9px] px-2">
                <div className="flex justify-between">
                  <span className="font-medium">{isRtl ? "الماركة" : "Brand"}:</span>
                  <span>{frameData.brand}</span>
                </div>
                {frameData.model && (
                  <div className="flex justify-between">
                    <span className="font-medium">{isRtl ? "الموديل" : "Model"}:</span>
                    <span>{frameData.model}</span>
                  </div>
                )}
                {frameData.color && (
                  <div className="flex justify-between">
                    <span className="font-medium">{isRtl ? "اللون" : "Color"}:</span>
                    <span>{frameData.color}</span>
                  </div>
                )}
                {frameData.size && (
                  <div className="flex justify-between">
                    <span className="font-medium">{isRtl ? "المقاس" : "Size"}:</span>
                    <span>{frameData.size}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {isContactLens && contactLensItems.length > 0 && (
            <div className="space-y-1">
              {contactLensItems.map((lens, idx) => (
                <div key={idx} className={idx !== 0 ? "border-t border-dashed border-gray-300 pt-1 mt-1" : ""}>
                  <div className="flex justify-between font-semibold">
                    <span>{lens.brand} {lens.type}</span>
                    <span>{lens.price > 0 ? `${lens.price.toFixed(3)} KWD` : ""}</span>
                  </div>
                  <div className="text-[9px] px-2">
                    {lens.color && (
                      <div className="flex justify-between">
                        <span className="font-medium">{isRtl ? "اللون" : "Color"}:</span>
                        <span>{lens.color}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium">{isRtl ? "الكمية" : "Quantity"}:</span>
                      <span>{lens.qty || 1}</span>
                    </div>
                    {lens.price > 0 && lens.qty > 1 && (
                      <div className="flex justify-between">
                        <span className="font-medium">{isRtl ? "المجموع" : "Total"}:</span>
                        <span>{(lens.price * (lens.qty || 1)).toFixed(3)} KWD</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isContactLens && lensType && (
            <div className="border-b border-dashed border-gray-300 pb-1 mb-1">
              <div className="flex justify-between font-semibold">
                <span>{isRtl ? "العدسات" : "Lenses"}:</span>
                <span>{lensPrice > 0 ? `${lensPrice.toFixed(3)} KWD` : ""}</span>
              </div>
              <div className="text-[9px] px-2">
                <div className="flex justify-between">
                  <span className="font-medium">{isRtl ? "النوع" : "Type"}:</span>
                  <span>{lensName}</span>
                </div>
              </div>
            </div>
          )}
          
          {!isContactLens && coating && (
            <div>
              <div className="flex justify-between font-semibold">
                <span>{isRtl ? "الطلاء" : "Coating"}:</span>
                <span>{coatingPrice > 0 ? `${coatingPrice.toFixed(3)} KWD` : ""}</span>
              </div>
              <div className="text-[9px] px-2">
                <div className="flex justify-between">
                  <span className="font-medium">{isRtl ? "النوع" : "Type"}:</span>
                  <span>{coatingName}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-3 border-2 border-black rounded p-1.5">
        <div className="mb-1 border-b border-gray-300 pb-1 text-center">
          <div className="flex items-center justify-center gap-1 font-bold">
            <CreditCard className="h-4 w-4" />
            <span>
              {isRtl ? "معلومات الدفع | Payment" : "Payment | معلومات الدفع"}
            </span>
          </div>
        </div>
        
        <div className="space-y-1 text-xs px-2">
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
          
          <div className="flex justify-between border-b border-gray-200 pb-1">
            <span className="font-bold">{t("total")}:</span>
            <span className="font-semibold">{total.toFixed(3)} KWD</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-bold">{t("paid")}:</span>
            <span className="font-semibold">{amountPaid.toFixed(3)} KWD</span>
          </div>
          
          {isPaid ? (
            <div className="mt-2 p-1.5 bg-green-100 rounded border border-green-300 text-center">
              <div className="flex items-center justify-center gap-1 text-green-800 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isRtl ? "تم الدفع بالكامل" : "PAID IN FULL"}</span>
              </div>
              {!isRtl ? <div className="text-green-700 text-xs">تم الدفع بالكامل</div> : 
                       <div className="text-green-700 text-xs">PAID IN FULL</div>}
            </div>
          ) : (
            <div className="mt-2">
              <div className="p-1.5 bg-red-100 rounded border border-red-300 text-center">
                <div className="font-bold text-red-700 text-base">
                  {isRtl ? "المبلغ المتبقي" : "REMAINING AMOUNT"}
                </div>
                <div className="text-lg font-bold text-[#ea384c]">
                  {remaining.toFixed(3)} KWD
                </div>
                {!isRtl ? <div className="text-red-700 text-xs">المبلغ المتبقي</div> : 
                         <div className="text-red-700 text-xs">REMAINING AMOUNT</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-2 border-2 border-black rounded p-1.5">
        <div className="mb-1 border-b border-gray-300 pb-1 text-center">
          <div className="font-bold">
            {isRtl ? "تأكيد الجودة | Quality Check" : "Quality Check | تأكيد الجودة"}
          </div>
        </div>
        
        <div className="flex gap-2 text-[10px] mb-1">
          <div className="border border-gray-300 rounded p-1 flex-1">
            <div className="font-bold mb-1 text-center border-b border-gray-300 pb-0.5 text-[9px]">
              {isRtl ? "توقيع الفني" : "Technician"}
            </div>
            <div className="h-6"></div>
          </div>
          
          <div className="border border-gray-300 rounded p-1 flex-1">
            <div className="font-bold mb-1 text-center border-b border-gray-300 pb-0.5 text-[9px]">
              {isRtl ? "توقيع المدير" : "Manager"}
            </div>
            <div className="h-6"></div>
          </div>
        </div>
      </div>

      <div className="mb-2 border-2 border-black rounded p-1.5">
        <div className="mb-1 border-b border-gray-300 pb-1 text-center font-bold">
          {isRtl ? "ملاحظات | Notes" : "Notes | ملاحظات"}
        </div>
        
        <div className="border border-gray-300 rounded p-1 min-h-8 text-[9px]">
          
        </div>
      </div>

      <div className="text-center pt-1 text-[9px]">
        <p className="text-gray-500">
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
              color: black !important;
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
              color: black !important;
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
            
            .bg-red-100 {
              background-color: #fee2e2 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            .border-red-300 {
              border-color: #fca5a5 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            .text-\\[\\#ea384c\\] {
              color: #ea384c !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            .text-red-700 {
              color: #b91c1c !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            .bg-green-100 {
              background-color: #dcfce7 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            .border-green-300 {
              border-color: #86efac !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            .text-green-800 {
              color: #166534 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            .text-green-700 {
              color: #15803d !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            .border-2 {
              border-width: 2px !important;
            }
            
            .border-black {
              border-color: #000 !important;
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
