import React from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { CheckCircle2, AlertTriangle, Calendar, User, Phone, Eye } from "lucide-react";
import { useInventoryStore } from "@/store/inventoryStore";
import { 
  Card,
  CardContent, 
} from "@/components/ui/card";

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
        border: isPrintable ? 'none' : '1px solid #ddd',
        borderRadius: isPrintable ? '0' : '4px',
        boxShadow: isPrintable ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
        fontFamily: 'Cairo, sans-serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always'
      }}
    >
      <div className="text-center border-b border-gray-300 pb-2 mb-2">
        <div className="flex justify-center mb-1">
          <MoenLogo className="w-auto h-12" />
        </div>
        <h2 className="font-bold text-lg mb-0">{storeInfo.name}</h2>
        <p className="text-xs font-medium mb-0 text-gray-600">{storeInfo.address}</p>
        <p className="text-xs font-medium text-gray-600">{t("phone")}: {storeInfo.phone}</p>
      </div>

      <div className="text-center mb-3">
        <div className="bg-black text-white py-1 px-2 mb-2 font-bold text-base rounded">
          {isRtl ? "أمر عمل | WORK ORDER" : "WORK ORDER | أمر عمل"}
        </div>
        <p className="text-xs mb-0 text-gray-600">
          {isRtl ? "ORDER #: " : "رقم الطلب: "}
          <span className="font-semibold">{orderNumber}</span>
        </p>
        <p className="text-xs text-gray-600 rx-creation-date">
          {format(new Date(), 'yyyy-MM-dd HH:mm', { locale: enUS })}
        </p>
      </div>

      <div className="mb-3">
        <div className="text-center bg-black text-white py-1 mb-2 font-bold text-base rounded">
          {isRtl 
            ? "معلومات المريض | Patient Information" 
            : "Patient Information | معلومات المريض"}
        </div>
        
        <div className="space-y-1 text-sm px-3">
          <div className="flex justify-between items-center">
            <span className="font-bold flex items-center gap-1">
              <User className="h-3.5 w-3.5" /> {t("customer")}:
            </span>
            <span className="font-medium">{patientName}</span>
          </div>
          
          {patientPhone && (
            <div className="flex justify-between items-center">
              <span className="font-bold flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> {t("phone")}:
              </span>
              <span>{patientPhone}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="font-bold flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> {t("date")}:
            </span>
            <span>{format(new Date(), 'dd/MM/yyyy')}</span>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-center bg-black text-white py-1 mb-2 font-bold text-base rounded">
          {isRtl 
            ? "تفاصيل الوصفة الطبية | Prescription Details" 
            : "Prescription Details | تفاصيل الوصفة الطبية"}
        </div>
        
        <table className="w-full border-collapse text-xs" style={{ direction: 'ltr' }}>
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
        
        <div className="mt-1 text-[9px] flex justify-between px-2 font-medium">
          <span>OD = {isRtl ? "العين اليمنى" : "Right Eye"}</span>
          <span>OS = {isRtl ? "العين اليسرى" : "Left Eye"}</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-center bg-black text-white py-1 mb-2 font-bold text-base rounded">
          {isRtl 
            ? "ت��اصيل المنتج | Product Details" 
            : "Product Details | تفاصيل المنتج"}
        </div>
        
        <div className="space-y-2 text-sm px-2">
          {frameData.brand && !isContactLens && (
            <Card className="mb-2 border border-gray-200 rounded-md">
              <CardContent className="p-2">
                <div className="font-bold border-b border-gray-300 pb-1 mb-1">
                  {isRtl ? "الإطار (Frame)" : "Frame (الإطار)"}
                </div>
                <div className="px-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold">{isRtl ? "الماركة" : "Brand"}:</span>
                    <span>{frameData.brand}</span>
                  </div>
                  {frameData.model && (
                    <div className="flex justify-between">
                      <span className="font-semibold">{isRtl ? "الموديل" : "Model"}:</span>
                      <span>{frameData.model}</span>
                    </div>
                  )}
                  {frameData.color && (
                    <div className="flex justify-between">
                      <span className="font-semibold">{isRtl ? "اللون" : "Color"}:</span>
                      <span>{frameData.color}</span>
                    </div>
                  )}
                  {frameData.size && (
                    <div className="flex justify-between">
                      <span className="font-semibold">{isRtl ? "المقاس" : "Size"}:</span>
                      <span>{frameData.size}</span>
                    </div>
                  )}
                  {frameData.price > 0 && (
                    <div className="flex justify-between">
                      <span className="font-semibold">{isRtl ? "السعر" : "Price"}:</span>
                      <span className="font-bold">{frameData.price.toFixed(3)} KWD</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {isContactLens && contactLensItems.length > 0 && (
            <Card className="mb-2 border border-gray-200 rounded-md">
              <CardContent className="p-2">
                <div className="font-bold border-b border-gray-300 pb-1 mb-1">
                  {isRtl ? "العدسات اللاصقة (Contact Lenses)" : "Contact Lenses (العدسات اللاصقة)"}
                </div>
                <div className="px-2 space-y-2 text-xs">
                  {contactLensItems.map((lens, idx) => (
                    <div key={idx} className={idx !== 0 ? "border-t border-dashed border-gray-200 pt-2 mt-2" : ""}>
                      <div className="flex justify-between">
                        <span className="font-semibold">{isRtl ? "النوع" : "Type"}:</span>
                        <span>{lens.brand} {lens.type}</span>
                      </div>
                      {lens.color && (
                        <div className="flex justify-between">
                          <span className="font-semibold">{isRtl ? "اللون" : "Color"}:</span>
                          <span>{lens.color}</span>
                        </div>
                      )}
                      {lens.price > 0 && (
                        <div className="flex justify-between">
                          <span className="font-semibold">{isRtl ? "السعر" : "Price"}:</span>
                          <span className="font-bold">{lens.price.toFixed(3)} KWD</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {!isContactLens && lensType && (
            <Card className="mb-2 border border-gray-200 rounded-md">
              <CardContent className="p-2">
                <div className="font-bold border-b border-gray-300 pb-1 mb-1">
                  {isRtl ? "العدسات (Lenses)" : "Lenses (العدسات)"}
                </div>
                <div className="px-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold">{isRtl ? "النوع" : "Type"}:</span>
                    <span>{lensName}</span>
                  </div>
                  {lensPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="font-semibold">{isRtl ? "السعر" : "Price"}:</span>
                      <span className="font-bold">{lensPrice.toFixed(3)} KWD</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {!isContactLens && coating && (
            <Card className="mb-2 border border-gray-200 rounded-md">
              <CardContent className="p-2">
                <div className="font-bold border-b border-gray-300 pb-1 mb-1">
                  {isRtl ? "الطلاء (Coating)" : "Coating (الطلاء)"}
                </div>
                <div className="px-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold">{isRtl ? "النوع" : "Type"}:</span>
                    <span>{coatingName}</span>
                  </div>
                  {coatingPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="font-semibold">{isRtl ? "السعر" : "Price"}:</span>
                      <span className="font-bold">{coatingPrice.toFixed(3)} KWD</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-center bg-black text-white py-1 mb-2 font-bold text-base rounded">
          {isRtl 
            ? "معلومات الدفع | Payment Information" 
            : "Payment Information | معلومات الدفع"}
        </div>
        
        <Card className="border border-gray-200 rounded-md">
          <CardContent className="p-3">
            <div className="space-y-1 text-sm">
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
                    <div className="text-lg font-bold text-red-800">
                      {remaining.toFixed(3)} KWD
                    </div>
                    {!isRtl ? <div className="text-red-700 text-xs">المبلغ المتبقي</div> : 
                             <div className="text-red-700 text-xs">REMAINING AMOUNT</div>}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-3">
        <div className="text-center bg-black text-white py-1 mb-2 font-bold text-base rounded">
          {isRtl 
            ? "تأكيد الجودة | Quality Confirmation" 
            : "Quality Confirmation | تأكيد الجودة"}
        </div>
        
        <div className="flex gap-2 text-sm mb-1 px-1">
          <div className="border border-gray-300 rounded p-1 flex-1">
            <div className="font-bold mb-1 text-center border-b border-gray-300 pb-0.5 text-xs">
              {isRtl ? "توقيع الفني" : "Technician Signature"}
            </div>
            <div className="h-8"></div>
          </div>
          
          <div className="border border-gray-300 rounded p-1 flex-1">
            <div className="font-bold mb-1 text-center border-b border-gray-300 pb-0.5 text-xs">
              {isRtl ? "توقيع المدير" : "Manager Signature"}
            </div>
            <div className="h-8"></div>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-center bg-black text-white py-1 mb-2 font-bold text-base rounded">
          {isRtl 
            ? "ملاحظات | Notes" 
            : "Notes | ملاحظات"}
        </div>
        
        <div className="border border-gray-300 rounded p-2 min-h-16">
          
        </div>
      </div>

      <div className="text-center border-t border-gray-300 pt-2 text-xs">
        <p className="font-bold text-sm mb-0">
          {isRtl ? "شكراً لاختياركم نظارات المعين" : "Thank you for choosing Moein Optical"}
        </p>
        <p className="text-[9px] mt-1 text-gray-500">
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
            
            .bg-black {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              background-color: black !important;
              color: white !important;
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
