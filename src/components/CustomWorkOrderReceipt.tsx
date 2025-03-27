
import React from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { User, Phone, Eye } from "lucide-react";
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
  
  const thickness = workOrder?.thickness || invoice?.thickness || "";
  
  const coatingString = typeof coating === 'object' ? coating?.name || '' : String(coating);
  const matchingCoating = lensCoatings.find(c => {
    const cName = c.name ? String(c.name).toLowerCase() : '';
    const cDesc = c.description ? String(c.description).toLowerCase() : '';
    return (cName && coatingString && cName.includes(coatingString.toLowerCase())) || 
           (cDesc && coatingString && cDesc.includes(coatingString.toLowerCase()));
  });
  
  const coatingName = matchingCoating?.name || getCoatingArabic(coatingString);
  
  const orderNumber = workOrder?.id || invoice?.workOrderId || `WO${Date.now().toString().slice(-6)}`;
  const dateFormatted = format(new Date(invoice?.createdAt || workOrder?.createdAt || new Date()), 'HH:mm dd/MM/yyyy', { locale: enUS });

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
          <Eye className="w-10 h-10 text-amber-500" />
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
        padding: '0',
        fontSize: '12px',
        border: isPrintable ? 'none' : '1px solid #ddd',
        borderRadius: isPrintable ? '0' : '4px',
        boxShadow: isPrintable ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
        fontFamily: 'Cairo, sans-serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always'
      }}
    >
      {/* Header */}
      <div className="text-center py-2 px-3">
        <div className="flex justify-center mb-1">
          <MoenLogo className="w-auto h-10" />
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 font-bold text-base">
            <span>{isRtl ? "أمر العمل" : "Work Order"}</span>
            <span>{!isRtl ? "| أمر العمل" : "| Work Order"}</span>
          </div>
          <div className="text-sm font-bold">{orderNumber}</div>
          <div className="text-xs">{dateFormatted}</div>
          <div className="text-xs mt-1">{storeInfo.address}</div>
          <div className="text-xs">{storeInfo.phone}</div>
        </div>
      </div>

      {/* Patient Information */}
      <div className="mb-3 px-3">
        <div className="bg-gray-100 py-1 px-2 mb-2">
          <div className="text-center font-semibold text-gray-600">
            {isRtl ? "معلومات المريض (Patient Info)" : "patientInformation (Patient Info)"}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-end font-semibold">{isRtl ? "الاسم:" : "Name:"}</div>
          <div>{patientName}</div>
          
          {patientPhone && (
            <>
              <div className="flex justify-end font-semibold">{isRtl ? "الهاتف:" : "Phone:"}</div>
              <div>{patientPhone}</div>
            </>
          )}
        </div>
      </div>

      {/* Product Details - Frame */}
      <div className="mb-3 px-3">
        <div className="bg-gray-100 py-1 px-2 mb-2">
          <div className="text-center font-semibold text-gray-600">
            {isRtl ? "تفاصيل المنتج (Product Details)" : "productDetails (Product Details)"}
          </div>
        </div>
        
        {!isContactLens && frameData.brand && (
          <div className="mb-2">
            <div className="border border-gray-200 rounded-md p-2">
              <div className="font-bold mb-1">
                {isRtl ? "الإطار (Frame)" : "Frame (الإطار)"}
              </div>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div className="flex justify-end font-semibold">{isRtl ? "الماركة:" : "Brand:"}</div>
                <div>{frameData.brand}</div>
                
                {frameData.model && (
                  <>
                    <div className="flex justify-end font-semibold">{isRtl ? "الموديل:" : "Model:"}</div>
                    <div>{frameData.model}</div>
                  </>
                )}
                
                {frameData.color && (
                  <>
                    <div className="flex justify-end font-semibold">{isRtl ? "اللون:" : "Color:"}</div>
                    <div>{frameData.color}</div>
                  </>
                )}
                
                {frameData.size && (
                  <>
                    <div className="flex justify-end font-semibold">{isRtl ? "الحجم:" : "Size:"}</div>
                    <div>{frameData.size}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Prescription Details */}
      {rx && (
        <div className="mb-3 px-3">
          <div className="bg-gray-100 py-1 px-2 mb-2">
            <div className="text-center font-semibold text-gray-600">
              {isRtl ? "تفاصيل الوصفة الطبية (Prescription Details)" : "prescriptionDetails (Prescription Details)"}
            </div>
          </div>
          
          <table className="w-full border-collapse text-xs" style={{ direction: 'ltr' }}>
            <thead>
              <tr className="bg-white">
                <th className="p-1 border border-gray-300 text-center font-bold">العين</th>
                <th className="p-1 border border-gray-300 text-center font-bold">SPH</th>
                <th className="p-1 border border-gray-300 text-center font-bold">CYL</th>
                <th className="p-1 border border-gray-300 text-center font-bold">AXIS</th>
                <th className="p-1 border border-gray-300 text-center font-bold">ADD</th>
                <th className="p-1 border border-gray-300 text-center font-bold">PD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-1 border border-gray-300 font-bold text-center">OD (يمين)</td>
                <td className="p-1 border border-gray-300 text-center">{rx.sphereOD || "—"}</td>
                <td className="p-1 border border-gray-300 text-center">{rx.cylOD || "—"}</td>
                <td className="p-1 border border-gray-300 text-center">{rx.axisOD || "—"}</td>
                <td className="p-1 border border-gray-300 text-center">{rx.addOD || rx.add || "—"}</td>
                <td className="p-1 border border-gray-300 text-center">{rx.pdRight || rx.pdOD || rx.pd || "—"}</td>
              </tr>
              <tr>
                <td className="p-1 border border-gray-300 font-bold text-center">OS (يسار)</td>
                <td className="p-1 border border-gray-300 text-center">{rx.sphereOS || "—"}</td>
                <td className="p-1 border border-gray-300 text-center">{rx.cylOS || "—"}</td>
                <td className="p-1 border border-gray-300 text-center">{rx.axisOS || "—"}</td>
                <td className="p-1 border border-gray-300 text-center">{rx.addOS || rx.add || "—"}</td>
                <td className="p-1 border border-gray-300 text-center">{rx.pdLeft || rx.pdOS || rx.pd || "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Lens Details */}
      {!isContactLens && lensType && (
        <div className="mb-3 px-3">
          <div className="grid grid-cols-2 gap-2 text-sm mb-2 mt-4">
            <div className="font-bold text-right">{isRtl ? "العدسات" : "Lenses"}</div>
            <div className="font-bold">type:</div>
            
            <div className="text-right">{lensName}</div>
            <div>{lensTypeString}</div>
            
            {coating && (
              <>
                <div className="font-bold text-right">coating:</div>
                <div>{coatingName}</div>
              </>
            )}
            
            {thickness && (
              <>
                <div className="font-bold text-right">thickness:</div>
                <div>{thickness}</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="mb-3 px-3">
        <div className="bg-gray-100 py-1 px-2 mb-2">
          <div className="text-center font-semibold text-gray-600">
            {isRtl ? "ملاحظات (Notes)" : "Notes (ملاحظات)"}
          </div>
        </div>
        
        <div className="border border-gray-300 rounded-md p-3 min-h-16">
          {/* Empty for notes */}
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-3 mb-4 px-3">
        <div className="border border-gray-300 rounded-md p-2">
          <div className="text-center font-semibold text-xs mb-1">
            {isRtl ? "تأكيد الجودة (QC)" : "qualityConfirmation (QC)"}
          </div>
          <div className="h-12 border-b border-gray-300 mb-1"></div>
          <div className="text-center text-xs">
            {isRtl ? "التاريخ" : "Date"}: __/__ /____
          </div>
        </div>
        
        <div className="border border-gray-300 rounded-md p-2">
          <div className="text-center font-semibold text-xs mb-1">
            {isRtl ? "توقيع الفني (Technician)" : "technicianSignature (Technician)"}
          </div>
          <div className="h-12 border-b border-gray-300 mb-1"></div>
          <div className="text-center text-xs">
            {isRtl ? "التاريخ" : "Date"}: __/__ /____
          </div>
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
              width: 76mm !important; 
              max-width: 76mm !important;
              page-break-after: always !important;
              page-break-inside: avoid !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              border: none !important;
              box-shadow: none !important;
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
    "Basic": "عادي",
    // Add more mappings as needed
  };
  
  return coatingMap[coating] || coating;
};
