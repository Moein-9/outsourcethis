
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
          padding: '4mm',
          fontSize: '11px',
          border: '1px solid #FDE68A',
          borderRadius: '4px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          fontFamily: 'Cairo, sans-serif',
          pageBreakInside: 'avoid',
          pageBreakAfter: 'always'
        }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-2 py-4">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
          <h3 className="font-bold text-amber-800 text-base text-center">
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
        padding: '1mm',
        fontSize: '10px',
        border: isPrintable ? 'none' : '1px solid #ddd',
        borderRadius: isPrintable ? '0' : '4px',
        boxShadow: isPrintable ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
        fontFamily: 'Cairo, sans-serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always'
      }}
    >
      <div className="text-center border-b border-gray-300 pb-1 mb-1">
        <div className="flex justify-center mb-0">
          <MoenLogo className="w-auto h-10" />
        </div>
        <h2 className="font-bold text-base mb-0">{storeInfo.name}</h2>
        <p className="text-xs font-medium mb-0 text-gray-600">{storeInfo.address}</p>
        <p className="text-xs font-medium text-gray-600">{t("phone")}: {storeInfo.phone}</p>
      </div>

      <div className="text-center mb-1">
        <div className="bg-black text-white py-0.5 px-2 mb-1 font-bold text-sm rounded">
          {isRtl ? "أمر عمل | WORK ORDER" : "WORK ORDER | أمر عمل"}
        </div>
        <p className="text-[9px] mb-0 text-gray-600">
          {isRtl ? "ORDER #: " : "رقم الطلب: "}
          <span className="font-semibold">{orderNumber}</span>
        </p>
        <p className="text-[9px] text-gray-600 rx-creation-date">
          {format(new Date(), 'yyyy-MM-dd HH:mm', { locale: enUS })}
        </p>
      </div>

      <div className="mb-1">
        <div className="text-center bg-black text-white py-0.5 mb-1 font-bold text-sm rounded">
          {isRtl 
            ? "معلومات المريض | Patient Information" 
            : "Patient Information | معلومات المريض"}
        </div>
        
        <div className="space-y-0.5 text-xs px-2">
          <div className="flex justify-between items-center">
            <span className="font-bold flex items-center gap-1">
              <User className="h-3 w-3" /> {t("customer")}:
            </span>
            <span className="font-medium">{patientName}</span>
          </div>
          
          {patientPhone && (
            <div className="flex justify-between items-center">
              <span className="font-bold flex items-center gap-1">
                <Phone className="h-3 w-3" /> {t("phone")}:
              </span>
              <span>{patientPhone}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="font-bold flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {t("date")}:
            </span>
            <span>{format(new Date(), 'dd/MM/yyyy')}</span>
          </div>
        </div>
      </div>

      <div className="mb-1">
        <div className="text-center bg-black text-white py-0.5 mb-1 font-bold text-sm rounded">
          {isRtl 
            ? "تفاصيل الوصفة الطبية | Prescription Details" 
            : "Prescription Details | تفاصيل الوصفة الطبية"}
        </div>
        
        {/* RX Table - Always LTR regardless of language setting */}
        <table className="w-full border-collapse text-[9px]" dir="ltr" style={{ direction: 'ltr', tableLayout: 'fixed' }}>
          <thead>
            <tr className="bg-gray-100">
              <th className="p-0.5 border border-gray-300 text-center font-bold" style={{ width: '15%' }}>Eye</th>
              <th className="p-0.5 border border-gray-300 text-center font-bold" style={{ width: '17%' }}>SPH</th>
              <th className="p-0.5 border border-gray-300 text-center font-bold" style={{ width: '17%' }}>CYL</th>
              <th className="p-0.5 border border-gray-300 text-center font-bold" style={{ width: '17%' }}>AXIS</th>
              <th className="p-0.5 border border-gray-300 text-center font-bold" style={{ width: '17%' }}>ADD</th>
              <th className="p-0.5 border border-gray-300 text-center font-bold" style={{ width: '17%' }}>PD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-0.5 border border-gray-300 font-bold text-center bg-gray-100">OD</td>
              <td className="p-0.5 border border-gray-300 text-center">{rx.sphereOD || "—"}</td>
              <td className="p-0.5 border border-gray-300 text-center">{rx.cylOD || "—"}</td>
              <td className="p-0.5 border border-gray-300 text-center">{rx.axisOD || "—"}</td>
              <td className="p-0.5 border border-gray-300 text-center">{rx.addOD || rx.add || "—"}</td>
              <td className="p-0.5 border border-gray-300 text-center">{rx.pdRight || rx.pdOD || rx.pd || "—"}</td>
            </tr>
            <tr>
              <td className="p-0.5 border border-gray-300 font-bold text-center bg-gray-100">OS</td>
              <td className="p-0.5 border border-gray-300 text-center">{rx.sphereOS || "—"}</td>
              <td className="p-0.5 border border-gray-300 text-center">{rx.cylOS || "—"}</td>
              <td className="p-0.5 border border-gray-300 text-center">{rx.axisOS || "—"}</td>
              <td className="p-0.5 border border-gray-300 text-center">{rx.addOS || rx.add || "—"}</td>
              <td className="p-0.5 border border-gray-300 text-center">{rx.pdLeft || rx.pdOS || rx.pd || "—"}</td>
            </tr>
          </tbody>
        </table>
        
        <div className="mt-0.5 text-[8px] flex justify-between px-1 font-medium">
          <span>OD = {isRtl ? "العين اليمنى" : "Right Eye"}</span>
          <span>OS = {isRtl ? "العين اليسرى" : "Left Eye"}</span>
        </div>
      </div>

      <div className="mb-1">
        <div className="text-center bg-black text-white py-0.5 mb-1 font-bold text-sm rounded">
          {isRtl 
            ? "تفاصيل المنتج | Product Details" 
            : "Product Details | تفاصيل المنتج"}
        </div>
        
        <div className="space-y-1 text-xs px-1">
          {frameData.brand && !isContactLens && (
            <Card className="mb-1 border border-gray-200 rounded-md">
              <CardContent className="p-1">
                <div className="font-bold border-b border-gray-300 pb-0.5 mb-0.5">
                  {isRtl ? "الإطار (Frame)" : "Frame (الإطار)"}
                </div>
                <div className="px-1 space-y-0.5 text-[9px]">
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
            <Card className="mb-1 border border-gray-200 rounded-md">
              <CardContent className="p-1">
                <div className="font-bold border-b border-gray-300 pb-0.5 mb-0.5">
                  {isRtl ? "العدسات اللاصقة (Contact Lenses)" : "Contact Lenses (العدسات اللاصقة)"}
                </div>
                <div className="px-1 space-y-1 text-[9px]">
                  {contactLensItems.map((lens, idx) => (
                    <div key={idx} className={idx !== 0 ? "border-t border-dashed border-gray-200 pt-0.5 mt-0.5" : ""}>
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
                      <div className="flex justify-between">
                        <span className="font-semibold">{isRtl ? "الكمية" : "Quantity"}:</span>
                        <span>{lens.qty || 1}</span>
                      </div>
                      {lens.price > 0 && (
                        <div className="flex justify-between">
                          <span className="font-semibold">{isRtl ? "السعر الإفرادي" : "Unit Price"}:</span>
                          <span className="font-bold">{lens.price.toFixed(3)} KWD</span>
                        </div>
                      )}
                      {lens.price > 0 && lens.qty > 1 && (
                        <div className="flex justify-between">
                          <span className="font-semibold">{isRtl ? "المجموع" : "Total"}:</span>
                          <span className="font-bold">{(lens.price * (lens.qty || 1)).toFixed(3)} KWD</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {!isContactLens && lensType && (
            <Card className="mb-1 border border-gray-200 rounded-md">
              <CardContent className="p-1">
                <div className="font-bold border-b border-gray-300 pb-0.5 mb-0.5">
                  {isRtl ? "العدسات (Lenses)" : "Lenses (العدسات)"}
                </div>
                <div className="px-1 space-y-0.5 text-[9px]">
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
            <Card className="mb-1 border border-gray-200 rounded-md">
              <CardContent className="p-1">
                <div className="font-bold border-b border-gray-300 pb-0.5 mb-0.5">
                  {isRtl ? "الطلاء (Coating)" : "Coating (الطلاء)"}
                </div>
                <div className="px-1 space-y-0.5 text-[9px]">
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

      <div className="mb-1">
        <div className="text-center bg-black text-white py-0.5 mb-1 font-bold text-sm rounded">
          {isRtl 
            ? "معلومات الدفع | Payment Information" 
            : "Payment Information | معلومات الدفع"}
        </div>
        
        <Card className="border border-gray-200 rounded-md">
          <CardContent className="p-1">
            <div className="space-y-0.5 text-xs">
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
              
              <div className="flex justify-between border-b border-gray-200 pb-0.5">
                <span className="font-bold">{t("total")}:</span>
                <span className="font-semibold">{total.toFixed(3)} KWD</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-bold">{t("paid")}:</span>
                <span className="font-semibold">{amountPaid.toFixed(3)} KWD</span>
              </div>
              
              {isPaid ? (
                <div className="mt-1 p-1 bg-green-100 rounded border border-green-300 text-center">
                  <div className="flex items-center justify-center gap-1 text-green-800 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isRtl ? "تم الدفع بالكامل" : "PAID IN FULL"}</span>
                  </div>
                  {!isRtl ? <div className="text-green-700 text-[8px]">تم الدفع بالكامل</div> : 
                           <div className="text-green-700 text-[8px]">PAID IN FULL</div>}
                </div>
              ) : (
                <div className="mt-1">
                  <div className="p-1 bg-[#FFDEE2] rounded border border-red-300 text-center" style={{ backgroundColor: '#FFDEE2' }}>
                    <div className="font-bold text-red-700 text-sm">
                      {isRtl ? "المبلغ المتبقي" : "REMAINING AMOUNT"}
                    </div>
                    <div className="text-base font-bold text-red-800">
                      {remaining.toFixed(3)} KWD
                    </div>
                    {!isRtl ? <div className="text-red-700 text-[8px]">المبلغ المتبقي</div> : 
                             <div className="text-red-700 text-[8px]">REMAINING AMOUNT</div>}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-1">
        <div className="text-center bg-black text-white py-0.5 mb-1 font-bold text-sm rounded">
          {isRtl 
            ? "تأكيد الجودة | Quality Confirmation" 
            : "Quality Confirmation | تأكيد الجودة"}
        </div>
        
        <div className="flex gap-1 text-[9px] mb-0.5">
          <div className="border border-gray-300 rounded p-0.5 flex-1">
            <div className="font-bold mb-0.5 text-center border-b border-gray-300 pb-0.5 text-[8px]">
              {isRtl ? "Technician Signature | توقيع الفني" : "Technician Signature | توقيع الفني"}
            </div>
            <div className="h-7 border-dashed border border-gray-200 rounded-sm"></div>
          </div>
          
          <div className="border border-gray-300 rounded p-0.5 flex-1">
            <div className="font-bold mb-0.5 text-center border-b border-gray-300 pb-0.5 text-[8px]">
              {isRtl ? "Manager Signature | توقيع المدير" : "Manager Signature | توقيع المدير"}
            </div>
            <div className="h-7 border-dashed border border-gray-200 rounded-sm"></div>
          </div>
        </div>
      </div>

      <div className="mb-0">
        <div className="text-center bg-black text-white py-0.5 mb-1 font-bold text-sm rounded">
          {isRtl 
            ? "ملاحظات | Notes" 
            : "Notes | ملاحظات"}
        </div>
        
        <div className="border border-gray-300 rounded p-1 min-h-8">
          
        </div>
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
              padding: 1mm !important;
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
            
            .bg-black {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              background-color: black !important;
              color: white !important;
            }
            
            .bg-\\[\\#FFDEE2\\] {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              background-color: #FFDEE2 !important;
            }
            
            table {
              direction: ltr !important;
              table-layout: fixed !important;
            }
            
            table th, table td {
              padding: 0.5px !important;
              text-align: center !important;
              font-size: 8px !important;
              border: 1px solid #d1d5db !important;
            }
            
            /* Fix signature boxes */
            .h-7 {
              height: 1.75rem !important;
              min-height: 1.75rem !important;
            }
            
            /* Reduce margins between sections */
            .mb-1 {
              margin-bottom: 0.15rem !important;
            }
            
            /* Make font sizes smaller for printing */
            .text-xs {
              font-size: 0.65rem !important;
            }
            
            .text-[9px] {
              font-size: 8px !important;
            }
            
            .text-[8px] {
              font-size: 7px !important;
            }
            
            /* Reduce padding */
            .p-1 {
              padding: 0.15rem !important;
            }
            
            .py-0.5 {
              padding-top: 0.1rem !important;
              padding-bottom: 0.1rem !important;
            }
            
            .px-1 {
              padding-left: 0.15rem !important;
              padding-right: 0.15rem !important;
            }
            
            /* Make headings smaller */
            .text-sm {
              font-size: 0.75rem !important;
            }
            
            .text-base {
              font-size: 0.85rem !important;
            }
            
            /* Reduce space for the header */
            .h-10 {
              height: 2rem !important;
            }
            
            /* Reduce card margin and padding */
            .card {
              margin-bottom: 0.15rem !important;
            }
            
            .space-y-0.5 > * + * {
              margin-top: 0.1rem !important;
            }
            
            /* Ensure all content fits on one page */
            .min-h-8 {
              min-height: 0.5rem !important;
              max-height: 1rem !important;
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
