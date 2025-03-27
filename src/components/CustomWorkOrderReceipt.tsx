
import React from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { CheckCircle2, AlertTriangle, Calendar, User, Phone, Eye, CreditCard, Receipt, UserCircle2, Ruler, Glasses, Contact } from "lucide-react";
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
        fontFamily: isRtl ? 'Zain, sans-serif' : 'Yrsa, serif',
        pageBreakInside: 'avoid',
        pageBreakAfter: 'always',
        textAlign: 'center' 
      }}
    >
      <div className="border-b-2 border-black pb-1 mb-2">
        <div className="flex justify-center mb-1">
          <MoenLogo className="w-auto h-10" />
        </div>
        <h2 className="font-bold text-lg mb-0">{storeInfo.name}</h2>
        <p className="text-xs font-medium mb-0">{storeInfo.address}</p>
        <p className="text-xs font-medium">{t("phone")}: {storeInfo.phone}</p>
      </div>

      <div className="mb-2">
        <div className="inline-flex items-center justify-center gap-1 border-2 border-black px-2 py-0.5 rounded">
          <Receipt className="w-4 h-4" />
          <span className="font-bold text-base">{t("workOrder")}</span>
        </div>
      </div>

      <div className="mb-2 border-2 border-black rounded p-1.5">
        <div className="mb-1 border-b border-gray-400 pb-1">
          <div className="flex items-center justify-center gap-1">
            <User className="w-4 h-4" />
            <span className="font-bold text-base">
              {isRtl ? "معلومات العميل | Customer Info" : "Customer Info | معلومات العميل"}
            </span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-1">
              <UserCircle2 className="w-3.5 h-3.5" />
              <span className="font-semibold text-sm">{t("name")}:</span>
            </div>
            <span className="font-semibold text-sm">{patientName}</span>
          </div>
          
          {patientPhone && (
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span className="font-semibold text-sm">{t("phone")}:</span>
              </div>
              <span className="font-semibold text-sm">{patientPhone}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-semibold text-sm">{t("date")}:</span>
            </div>
            <span className="font-semibold text-sm">{format(new Date(), 'dd/MM/yyyy')}</span>
          </div>
        </div>
      </div>

      <div className="mb-2 border-2 border-black rounded p-1.5">
        <div className="mb-1 border-b border-gray-400 pb-1">
          <div className="flex items-center justify-center gap-1">
            <Receipt className="w-4 h-4" />
            <span className="font-bold text-base">
              {isRtl ? "رقم أمر العمل | Work Order Number" : "Work Order Number | رقم أمر العمل"}
            </span>
          </div>
        </div>
        
        <div className="flex justify-center items-center px-2">
          <span className="font-semibold text-sm">#{orderNumber}</span>
        </div>
      </div>

      {rx && (
        <div className="mb-2 border-2 border-black rounded p-1.5">
          <div className="mb-1 border-b border-gray-400 pb-1">
            <div className="flex items-center justify-center gap-1">
              <Eye className="w-4 h-4" />
              <span className="font-bold text-base">
                {isRtl ? "تفاصيل الوصفة الطبية | Prescription" : "Prescription | تفاصيل الوصفة الطبية"}
              </span>
            </div>
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
      )}

      <div className="mb-2">
        <div className="py-1 bg-black text-white mb-2 font-bold text-base rounded">
          {isRtl ? "المنتجات | Products" : "Products | المنتجات"}
        </div>
        
        {/* More compact product section */}
        <div className="space-y-1.5 px-1">
          {isContactLens && contactLensItems.length > 0 ? (
            contactLensItems.map((lens, idx) => (
              <div key={idx} className="p-1 border border-gray-300 rounded">
                <div className="flex justify-between px-1 text-xs">
                  <div className="font-bold">{lens.brand} {lens.type}</div>
                  <span className="font-bold">{lens.price.toFixed(3)} KWD</span>
                </div>
                <div className="text-[10px] font-medium text-center">
                  {lens.color && <span>{t("color")}: {lens.color} - </span>}
                  <span>{t("quantity")}: {lens.qty || 1}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-1.5">
              {frameData.brand && (
                <div className="p-1 border border-gray-300 rounded">
                  <div className="flex justify-between px-1 text-xs">
                    <div className="font-bold">{isRtl ? "الإطار" : "Frame"}</div>
                    <span className="font-bold">{frameData.price.toFixed(3)} KWD</span>
                  </div>
                  <div className="text-[10px] font-medium text-center">{frameData.brand} {frameData.model}</div>
                  {frameData.color && <div className="text-[10px] font-medium text-center">{t("color")}: {frameData.color}</div>}
                  {frameData.size && <div className="text-[10px] font-medium text-center">{t("size")}: {frameData.size}</div>}
                </div>
              )}
              
              {lensName && (
                <div className="p-1 border border-gray-300 rounded">
                  <div className="flex justify-between px-1 text-xs">
                    <div className="font-bold">{isRtl ? "العدسات" : "Lenses"}</div>
                    <span className="font-bold">{lensPrice.toFixed(3)} KWD</span>
                  </div>
                  <div className="text-[10px] font-medium text-center">{lensName}</div>
                </div>
              )}
              
              {coatingName && (
                <div className="p-1 border border-gray-300 rounded">
                  <div className="flex justify-between px-1 text-xs">
                    <div className="font-bold">{isRtl ? "الطلاء" : "Coating"}</div>
                    <span className="font-bold">{coatingPrice.toFixed(3)} KWD</span>
                  </div>
                  <div className="text-[10px] font-medium text-center">{coatingName}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-2 border-2 border-black rounded p-1.5">
        <div className="space-y-1 px-2">
          <div className="flex justify-between text-sm">
            <span className="font-bold">{t("subtotal")}:</span>
            <span className="font-semibold">{subtotal.toFixed(3)} KWD</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="font-bold">{t("discount")}:</span>
              <span className="font-semibold">-{discount.toFixed(3)} KWD</span>
            </div>
          )}
          <div className="flex justify-between pt-0.5 mt-0.5 border-t-2 border-black">
            <span className="font-bold text-base">{t("total")}:</span>
            <span className="font-bold text-base">{total.toFixed(3)} KWD</span>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div className="py-1 bg-black text-white mb-2 font-bold text-base rounded">
          {isRtl ? "الدفع | Payment" : "Payment | الدفع"}
        </div>
        
        <div className="space-y-1.5">
          {invoice?.payments?.map((payment, index) => (
            <div key={index} className="p-1 border border-gray-300 rounded">
              <div className="flex justify-between px-1 text-xs">
                <div className="font-bold">
                  {format(new Date(payment.date), 'dd/MM/yyyy')}
                </div>
                <span className="font-bold">{payment.amount.toFixed(3)} KWD</span>
              </div>
              <div className="text-[10px] font-medium flex items-center justify-center gap-0.5">
                <CreditCard className="w-3 h-3" />
                {payment.method}
                {payment.authNumber && <span> - {payment.authNumber}</span>}
              </div>
            </div>
          )) || (deposit > 0 && (
            <div className="p-1 border border-gray-300 rounded">
              <div className="flex justify-between px-1 text-xs">
                <div className="font-bold">
                  {format(new Date(), 'dd/MM/yyyy')}
                </div>
                <span className="font-bold">{deposit.toFixed(3)} KWD</span>
              </div>
              <div className="text-[10px] font-medium flex items-center justify-center gap-0.5">
                <CreditCard className="w-3 h-3" />
                {invoice?.paymentMethod || t("cash")}
              </div>
            </div>
          ))}
          
          {remaining > 0 ? (
            <div className="flex justify-between font-bold mt-2 pt-1 border-t-2 border-black px-2 text-red-600" style={{ color: "#ea384c" }}>
              <span className="text-base">{t("remaining")}:</span>
              <span className="text-base">{remaining.toFixed(3)} KWD</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1 mt-2 font-bold border-2 border-black py-1 rounded">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">{t("paidInFull")}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-2">
        <div className="py-1 bg-black text-white mb-2 font-bold text-base rounded">
          {isRtl ? "تأكيد الجودة | Quality Control" : "Quality Control | تأكيد الجودة"}
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

      <div className="mb-2">
        <div className="py-1 bg-black text-white mb-2 font-bold text-base rounded">
          {isRtl ? "ملاحظات | Notes" : "Notes | ملاحظات"}
        </div>
        
        <div className="border border-gray-300 rounded p-2 min-h-16">
          
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
              padding: 2mm !important;
              margin: 0 !important;
              background: white !important;
              color: black !important;
              height: auto !important;
              min-height: 0 !important;
              max-height: none !important;
              text-align: center !important;
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
            
            .text-red-600 {
              color: #ea384c !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
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
