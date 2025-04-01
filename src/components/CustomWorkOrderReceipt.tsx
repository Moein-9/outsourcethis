import React from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { CheckCircle2, AlertTriangle, Calendar, User, Phone, Eye, History, Contact } from "lucide-react";
import { useInventoryStore } from "@/store/inventoryStore";
import { 
  Card,
  CardContent, 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function getLensTypeArabic(type: string): string {
  const typeMap: Record<string, string> = {
    'distance': 'نظارات للنظر البعيد',
    'reading': 'نظارات طبية للقراءة',
    'progressive': 'عدسات تقدمية',
    'bifocal': 'عدسات ثنائية',
    'sunglasses': 'عدسات شمسية'
  };
  
  return typeMap[type.toLowerCase()] || type;
}

function getCoatingArabic(coating: string): string {
  const coatingMap: Record<string, string> = {
    'anti-reflective': 'مضاد للانعكاس',
    'blue light': 'حماية شاشة',
    'scratch resistant': 'ضد الخدش',
    'basic': 'عادي',
    'filter': 'فلتر',
    'super filter': 'سوبر فلتر'
  };
  
  return coatingMap[coating.toLowerCase()] || coating;
}

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
  
  const rx = patient?.rx || workOrder?.rx || invoice?.rx || {
    sphereOD: '',
    cylOD: '',
    axisOD: '',
    addOD: '',
    pdOD: '',
    sphereOS: '',
    cylOS: '',
    axisOS: '',
    addOS: '',
    pdOS: '',
    pd: ''
  };
  
  const contactLensRx = workOrder?.contactLensRx || invoice?.contactLensRx;
  const hasContactLensRx = !!contactLensRx && 
    ((contactLensRx.rightEye && Object.values(contactLensRx.rightEye).some(v => v)) || 
     (contactLensRx.leftEye && Object.values(contactLensRx.leftEye).some(v => v)));
  
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
  
  const lastEditedAt = workOrder?.lastEditedAt || invoice?.lastEditedAt;
  const hasBeenEdited = !!lastEditedAt;
  const editHistory = workOrder?.editHistory || invoice?.editHistory || [];
  const latestEdit = editHistory.length > 0 ? editHistory[editHistory.length - 1] : null;
  
  const getLensTypeString = () => {
    if (!lensType) return '';
    if (typeof lensType === 'object' && lensType !== null) {
      return lensType.type || lensType.name || '';
    }
    return String(lensType);
  };
  
  const lensTypeString = getLensTypeString();
  
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
          width: '74mm', 
          maxWidth: '74mm',
          margin: '0 auto',
          backgroundColor: '#FFFBEB',
          padding: '4mm',
          fontSize: '13px',
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
        width: '74mm',
        maxWidth: '74mm',
        margin: '0 auto',
        backgroundColor: 'white',
        color: 'black',
        padding: '2mm',
        fontSize: '14px',
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
        <p className="text-sm font-medium mb-0 text-gray-600">{storeInfo.address}</p>
        <p className="text-sm font-medium text-gray-600">{t("phone")}: {storeInfo.phone}</p>
      </div>

      <div className="text-center mb-2">
        <div className="bg-black text-white py-1 px-2 mb-1 font-bold text-base rounded">
          {isRtl ? "أمر عمل | WORK ORDER" : "WORK ORDER | أمر عمل"}
        </div>
        <p className="text-sm mb-0 text-gray-600 font-bold">
          {isRtl ? "ORDER #: " : "رقم الطلب: "}
          <span className="font-bold work-order-number">{orderNumber}</span>
        </p>
        <p className="text-sm text-gray-600 rx-creation-date">
          {format(new Date(), 'yyyy-MM-dd HH:mm', { locale: enUS })}
        </p>
        
        {hasBeenEdited && (
          <div className="mt-1 inline-block">
            <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200 flex items-center gap-1 text-xs">
              <History className="h-3 w-3" />
              {isRtl ? "تم التعديل" : "Edited"}
              <span className="text-xs ml-1">
                {format(new Date(lastEditedAt), 'yyyy-MM-dd HH:mm', { locale: enUS })}
              </span>
            </Badge>
            
            {latestEdit && latestEdit.notes && (
              <div className="text-xs text-violet-700 mt-0.5">
                {latestEdit.notes}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-2">
        <div className="text-center bg-black text-white py-1 mb-1 font-bold text-base rounded">
          {isRtl 
            ? "معلومات المريض | Patient Information" 
            : "Patient Information | معلومات المريض"}
        </div>
        
        <div className="space-y-1 text-sm px-2"> 
          <div className="flex justify-between items-center">
            <span className="font-bold flex items-center gap-1">
              <User className="h-4 w-4" /> {t("customer")}:
            </span>
            <span className="font-medium">{patientName}</span>
          </div>
          
          {patientPhone && (
            <div className="flex justify-between items-center">
              <span className="font-bold flex items-center gap-1">
                <Phone className="h-4 w-4" /> {t("phone")}:
              </span>
              <span>{patientPhone}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="font-bold flex items-center gap-1">
              <Calendar className="h-4 w-4" /> {t("date")}:
            </span>
            <span>{format(new Date(), 'dd/MM/yyyy')}</span>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div className="text-center bg-black text-white py-1 mb-1 font-bold text-base rounded">
          {isRtl 
            ? "تفاصيل الوصفة الطبية | Prescription Details" 
            : "Prescription Details | تفاصيل الوصفة الطبية"}
        </div>
        
        <table className="w-full border-collapse text-sm" dir="ltr" style={{ direction: 'ltr', tableLayout: 'fixed' }}>
          <thead>
            <tr className="bg-gray-100">
              <th className="p-1 border border-gray-300 text-center font-bold" style={{ width: '15%' }}>Eye</th>
              <th className="p-1 border border-gray-300 text-center font-bold" style={{ width: '17%' }}>SPH</th>
              <th className="p-1 border border-gray-300 text-center font-bold" style={{ width: '17%' }}>CYL</th>
              <th className="p-1 border border-gray-300 text-center font-bold" style={{ width: '17%' }}>AXIS</th>
              <th className="p-1 border border-gray-300 text-center font-bold" style={{ width: '17%' }}>ADD</th>
              <th className="p-1 border border-gray-300 text-center font-bold" style={{ width: '17%' }}>PD</th>
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
        
        <div className="mt-1 text-sm flex justify-between px-1 font-medium">
          <span>OD = {isRtl ? "العين اليمنى" : "Right Eye"}</span>
          <span>OS = {isRtl ? "العين اليسرى" : "Left Eye"}</span>
        </div>
        
        {hasContactLensRx && (
          <div className="mt-3">
            <div className="font-bold text-sm mb-1 flex items-center justify-center gap-1 text-blue-700">
              <Contact className="w-4 h-4" /> {isRtl ? "وصفة العدسات اللاصقة" : "Contact Lens Prescription"}
            </div>
            <table className="w-full border-collapse text-sm" dir="ltr" style={{ direction: 'ltr', tableLayout: 'fixed' }}>
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-1 border border-gray-300 text-center font-bold" style={{ width: '16%' }}>Eye</th>
                  <th className="p-1 border border-gray-300 text-center font-bold" style={{ width: '16%' }}>SPH</th>
                  <th className="p-1 border border-gray-300 text-center font-bold" style={{ width: '16%' }}>CYL</th>
                  <th className="p-1 border border-gray-300 text-center font-bold" style={{ width: '16%' }}>AXIS</th>
                  <th className="p-1 border border-gray-300 text-center font-bold" style={{ width: '16%' }}>BC</th>
                  <th className="p-1 border border-gray-300 text-center font-bold" style={{ width: '16%' }}>DIA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-1 border border-gray-300 font-bold text-center bg-gray-100">R</td>
                  <td className="p-1 border border-gray-300 text-center">{contactLensRx?.rightEye?.sphere || "—"}</td>
                  <td className="p-1 border border-gray-300 text-center">{contactLensRx?.rightEye?.cylinder || "—"}</td>
                  <td className="p-1 border border-gray-300 text-center">{contactLensRx?.rightEye?.axis || "—"}</td>
                  <td className="p-1 border border-gray-300 text-center">{contactLensRx?.rightEye?.bc || "—"}</td>
                  <td className="p-1 border border-gray-300 text-center">{contactLensRx?.rightEye?.dia || "—"}</td>
                </tr>
                <tr>
                  <td className="p-1 border border-gray-300 font-bold text-center bg-gray-100">L</td>
                  <td className="p-1 border border-gray-300 text-center">{contactLensRx?.leftEye?.sphere || "—"}</td>
                  <td className="p-1 border border-gray-300 text-center">{contactLensRx?.leftEye?.cylinder || "—"}</td>
                  <td className="p-1 border border-gray-300 text-center">{contactLensRx?.leftEye?.axis || "—"}</td>
                  <td className="p-1 border border-gray-300 text-center">{contactLensRx?.leftEye?.bc || "—"}</td>
                  <td className="p-1 border border-gray-300 text-center">{contactLensRx?.leftEye?.dia || "—"}</td>
                </tr>
              </tbody>
            </table>
            
            <div className="mt-1 text-sm flex justify-between px-1 font-medium">
              <span>R = {isRtl ? "العين اليمنى" : "Right Eye"}</span>
              <span>L = {isRtl ? "العين اليسرى" : "Left Eye"}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mb-2">
        <div className="text-center bg-black text-white py-1 mb-1 font-bold text-base rounded">
          {isRtl 
            ? "تفاصيل المنتج | Product Details" 
            : "Product Details | تفاصيل المنتج"}
        </div>
        
        <div className="space-y-2 text-sm px-1">
          {frameData.brand && !isContactLens && (
            <Card className="mb-1 border border-gray-200 rounded-md">
              <CardContent className="p-1">
                <div className="font-bold border-b border-gray-300 pb-0.5 mb-0.5">
                  {isRtl ? "الإطار (Frame)" : "Frame (الإطار)"}
                </div>
                <div className="px-1 space-y-0.5 text-sm">
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
                <div className="px-1 space-y-1 text-xs">
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
          
          {!isContactLens && lensTypeString && (
            <Card className="mb-1 border border-gray-200 rounded-md">
              <CardContent className="p-1">
                <div className="font-bold border-b border-gray-300 pb-0.5 mb-0.5">
                  {isRtl ? "العدسات (Lenses)" : "Lenses (العدسات)"}
                </div>
                <div className="px-1 space-y-0.5 text-sm">
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
                <div className="px-1 space-y-0.5 text-sm">
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

      <div className="mb-2">
        <div className="text-center bg-black text-white py-1 mb-1 font-bold text-base rounded">
          {isRtl 
            ? "معلومات الدفع | Payment Information" 
            : "Payment Information | معلومات الدفع"}
        </div>
        
        <Card className="border border-gray-200 rounded-md">
          <CardContent className="p-1">
            <div className="space-y-0.5 text-sm">
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
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isRtl ? "تم الدفع بالكامل" : "PAID IN FULL"}</span>
                  </div>
                  {!isRtl ? <div className="text-green-700 text-sm">تم الدفع بالكامل</div> : 
                           <div className="text-green-700 text-sm">PAID IN FULL</div>}
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
                    {!isRtl ? <div className="text-red-700 text-sm">المبلغ المتبقي</div> : 
                             <div className="text-red-700 text-sm">REMAINING AMOUNT</div>}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-2">
        <div className="text-center bg-black text-white py-1 mb-1 font-bold text-base rounded">
          {isRtl 
            ? "تأكيد الجودة | Quality Confirmation" 
            : "Quality Confirmation | تأكيد الجودة"}
        </div>
        
        <div className="flex gap-1 text-sm mb-0.5">
          <div className="border border-gray-300 rounded p-0.5 flex-1">
            <div className="font-bold mb-0.5 text-center border-b border-gray-300 pb-0.5 text-sm">
              {isRtl ? "Technician Signature | توقيع الفني" : "Technician Signature | توقيع الفني"}
            </div>
            <div className="h-14 border-dashed border border-gray-200 rounded-sm bg-yellow-50"></div>
          </div>
          
          <div className="border border-gray-300 rounded p-0.5 flex-1">
            <div className="font-bold mb-0.5 text-center border-b border-gray-300 pb-0.5 text-sm">
              {isRtl ? "Manager Signature | توقيع المدير" : "Manager Signature | توقيع المدير"}
            </div>
            <div className="h-14 border-dashed border border-gray-200 rounded-sm bg-yellow-50"></div>
          </div>
        </div>
      </div>

      <div className="mb-0">
        <div className="text-center bg-black text-white py-1 mb-1 font-bold text-base rounded">
          {isRtl 
            ? "ملاحظات | Notes" 
            : "Notes | ملاحظات"}
        </div>
        
        <div className="border-2 border-gray-300 rounded p-1 min-h-[50px] bg-white">
          {/* Empty space for notes */}
        </div>
      </div>

      <style>
        {`
          @media print {
            @page {
              size: 80mm auto !important;
              margin: 3mm !important;
              padding: 0 !important;
            }
            
            body {
              width: 74mm !important;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              color: black !important;
            }
            
            #work-order-receipt {
              width: 74mm !important;
              max-width: 74mm !important;
              page-break-after: always !important;
              page-break-inside: avoid !important;
              position: relative !important;
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
              font-size: 14px !important; 
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
              padding: 3px !important;
              text-align: center !important;
              font-size: 12px !important;
              border: 1px solid #d1d5db !important;
            }
            
            .h-8 {
              height: 2rem !important;
              min-height: 2rem !important;
            }
            
            .mb-2 {
              margin-bottom: 0.3rem !important;
            }
            
            .text-xs {
              font-size: 11px !important;
            }
            
            .text-sm {
              font-size: 13px !important;
            }
            
            .text-base {
              font-size: 15px !important;
            }
            
            .text-lg {
              font-size: 17px !important;
            }
            
            .work-order-number {
              font-size: 15px !important;
              font-weight: bold !important;
            }
            
            .p-1 {
              padding: 0.2rem !important;
            }
            
            .py-1 {
              padding-top: 0.2rem !important;
              padding-bottom: 0.2rem !important;
            }
            
            .px-1 {
              padding-left: 0.25rem !important;
              padding-right: 0.25rem !important;
            }
            
            .px-2 {
              padding-left: 0.5rem !important;
              padding-right: 0.5rem !important;
            }
            
            .min-h-\\[50px\\] {
              min-height: 50px !important;
              border: 2px solid #d1d5db !important;
              background-color: white !important;
            }
            
            .edited-badge {
              background-color: #8b5cf6 !important;
              color: white !important;
              padding: 2px 6px !important;
              border-radius: 4px !important;
              font-size: 10px !important;
              margin-top: 4px !important;
              display: inline-block !important;
            }
          }
        `}
      </style>
    </div>
  );
};
