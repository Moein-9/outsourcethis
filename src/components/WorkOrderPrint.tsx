
import React from "react";
import { format } from "date-fns";
import { Invoice } from "@/store/invoiceStore";
import { Eye, Ruler, CircleDot, ClipboardCheck, User, Glasses, BadgeCheck, Contact, Receipt, UserCircle2, Phone, Calendar, CreditCard, CheckCircle2 } from "lucide-react";
import { ContactLensItem } from "./ContactLensSelector";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";

interface WorkOrderPrintProps {
  invoice: Invoice;
  patientName?: string;
  patientPhone?: string;
  rx?: any;
  lensType?: string;
  coating?: string;
  thickness?: string;
  frame?: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  };
  contactLenses?: ContactLensItem[];
  contactLensRx?: {
    rightEye: {
      sphere: string;
      cylinder: string;
      axis: string;
      bc: string;
      dia: string;
    };
    leftEye: {
      sphere: string;
      cylinder: string;
      axis: string;
      bc: string;
      dia: string;
    };
  };
}

export const WorkOrderPrint: React.FC<WorkOrderPrintProps> = ({ 
  invoice,
  patientName,
  patientPhone,
  rx,
  lensType,
  coating,
  thickness,
  frame,
  contactLenses,
  contactLensRx
}) => {
  const { language, t } = useLanguageStore();
  const isRtl = language === 'ar';
  const dirClass = isRtl ? 'rtl text-right' : 'ltr text-left';
  
  const name = patientName || invoice.patientName;
  const phone = patientPhone || invoice.patientPhone;
  const lensTypeValue = lensType || invoice.lensType;
  const coatingValue = coating || invoice.coating;
  const thicknessValue = thickness || (invoice as any).thickness;
  
  const contactLensItems = contactLenses || (invoice as any).contactLensItems || [];
  const contactLensRxData = contactLensRx || (invoice as any).contactLensRx;
  
  const frameData = frame || (invoice.frameBrand ? {
    brand: invoice.frameBrand,
    model: invoice.frameModel,
    color: invoice.frameColor,
    size: invoice.frameSize || "",
    price: invoice.framePrice
  } : undefined);
  
  const isContactLens = contactLensItems && contactLensItems.length > 0;
  const invoiceType = (invoice as any).invoiceType || 'glasses';
  
  const orderNumber = invoice.workOrderId || "NEW ORDER";
  
  const total = invoice.total || 0;
  const deposit = invoice.deposit || 0;
  const discount = invoice.discount || 0;
  const subtotal = total + discount;
  const remaining = total - deposit;
  const isPaid = remaining <= 0;

  return (
    <div className={`${dirClass} print-receipt`} id="work-order-print" style={{ width: '80mm', maxWidth: '80mm', margin: '0 auto', textAlign: 'center' }} dir={isRtl ? "rtl" : "ltr"}>
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
            
            #work-order-print {
              width: 76mm !important;
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
            <span className="font-semibold text-sm">{name}</span>
          </div>
          
          {phone && (
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span className="font-semibold text-sm">{t("phone")}:</span>
              </div>
              <span className="font-semibold text-sm">{phone}</span>
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

      {isContactLens && contactLensRxData && (
        <div className="mb-2 border-2 border-black rounded p-1.5">
          <div className="mb-1 border-b border-gray-400 pb-1">
            <div className="flex items-center justify-center gap-1">
              <Eye className="w-4 h-4" />
              <span className="font-bold text-base">
                {isRtl ? "وصفة العدسات اللاصقة | Contact Lens Rx" : "Contact Lens Rx | وصفة العدسات اللاصقة"}
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
                <th className="p-1 border border-gray-300 text-center font-bold">BC</th>
                <th className="p-1 border border-gray-300 text-center font-bold">DIA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-1 border border-gray-300 font-bold text-center bg-gray-100">OD</td>
                <td className="p-1 border border-gray-300 text-center">{contactLensRxData.rightEye.sphere || "—"}</td>
                <td className="p-1 border border-gray-300 text-center">{contactLensRxData.rightEye.cylinder || "—"}</td>
                <td className="p-1 border border-gray-300 text-center">{contactLensRxData.rightEye.axis || "—"}</td>
                <td className="p-1 border border-gray-300 text-center">{contactLensRxData.rightEye.bc || "—"}</td>
                <td className="p-1 border border-gray-300 text-center">{contactLensRxData.rightEye.dia || "—"}</td>
              </tr>
              <tr>
                <td className="p-1 border border-gray-300 font-bold text-center bg-gray-100">OS</td>
                <td className="p-1 border border-gray-300 text-center">{contactLensRxData.leftEye.sphere || "—"}</td>
                <td className="p-1 border border-gray-300 text-center">{contactLensRxData.leftEye.cylinder || "—"}</td>
                <td className="p-1 border border-gray-300 text-center">{contactLensRxData.leftEye.axis || "—"}</td>
                <td className="p-1 border border-gray-300 text-center">{contactLensRxData.leftEye.bc || "—"}</td>
                <td className="p-1 border border-gray-300 text-center">{contactLensRxData.leftEye.dia || "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="mb-2">
        <div className="py-1 bg-black text-white mb-2 font-bold text-base rounded">
          {isRtl ? "المنتجات | Products" : "Products | المنتجات"}
        </div>
        
        <div className="space-y-2 px-1">
          {isContactLens && contactLensItems.length > 0 ? (
            contactLensItems.map((lens, idx) => (
              <div key={idx} className="p-1.5 border border-gray-300 rounded">
                <div className="flex justify-between px-2 mb-1">
                  <div className="font-bold text-sm">{lens.brand} {lens.type}</div>
                  <span className="font-bold text-sm">{lens.price.toFixed(3)} KWD</span>
                </div>
                <div className="text-xs font-medium text-center">
                  {lens.color && <span>{t("color")}: {lens.color} - </span>}
                  <span>{t("quantity")}: {lens.qty || 1}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-2">
              {frameData && frameData.brand && (
                <div className="p-1.5 border border-gray-300 rounded">
                  <div className="flex justify-between px-2 mb-1">
                    <div className="font-bold text-sm">{isRtl ? "الإطار | Frame" : "Frame | الإطار"}</div>
                    <span className="font-bold text-sm">{frameData.price.toFixed(3)} KWD</span>
                  </div>
                  <div className="text-xs font-medium text-center">{frameData.brand} {frameData.model}</div>
                  {frameData.color && <div className="text-xs font-medium text-center">{t("color")}: {frameData.color}</div>}
                  {frameData.size && <div className="text-xs font-medium text-center">{t("size")}: {frameData.size}</div>}
                </div>
              )}
              
              {lensTypeValue && (
                <div className="p-1.5 border border-gray-300 rounded">
                  <div className="flex justify-between px-2 mb-1">
                    <div className="font-bold text-sm">{isRtl ? "العدسات | Lenses" : "Lenses | العدسات"}</div>
                    <span className="font-bold text-sm">{invoice.lensPrice.toFixed(3)} KWD</span>
                  </div>
                  <div className="text-xs font-medium text-center">{lensTypeValue}</div>
                </div>
              )}
              
              {coatingValue && (
                <div className="p-1.5 border border-gray-300 rounded">
                  <div className="flex justify-between px-2 mb-1">
                    <div className="font-bold text-sm">{isRtl ? "الطلاء | Coating" : "Coating | الطلاء"}</div>
                    <span className="font-bold text-sm">{invoice.coatingPrice.toFixed(3)} KWD</span>
                  </div>
                  <div className="text-xs font-medium text-center">{coatingValue}</div>
                </div>
              )}
              
              {thicknessValue && (
                <div className="p-1.5 border border-gray-300 rounded">
                  <div className="flex justify-between px-2 mb-1">
                    <div className="font-bold text-sm">{isRtl ? "السماكة | Thickness" : "Thickness | السماكة"}</div>
                    <span className="font-bold text-sm">{(invoice as any).thicknessPrice ? (invoice as any).thicknessPrice.toFixed(3) + ' KWD' : ''}</span>
                  </div>
                  <div className="text-xs font-medium text-center">{thicknessValue}</div>
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
        
        <div className="space-y-2">
          {invoice.payments?.map((payment, index) => (
            <div key={index} className="p-1.5 border border-gray-300 rounded">
              <div className="flex justify-between px-2 mb-1">
                <div className="font-bold text-sm">
                  {format(new Date(payment.date), 'dd/MM/yyyy')}
                </div>
                <span className="font-bold text-sm">{payment.amount.toFixed(3)} KWD</span>
              </div>
              <div className="text-xs font-medium flex items-center justify-center gap-0.5">
                <CreditCard className="w-3.5 h-3.5" />
                {payment.method}
                {payment.authNumber && <span> - {payment.authNumber}</span>}
              </div>
            </div>
          )) || (deposit > 0 && (
            <div className="p-1.5 border border-gray-300 rounded">
              <div className="flex justify-between px-2 mb-1">
                <div className="font-bold text-sm">
                  {format(new Date(), 'dd/MM/yyyy')}
                </div>
                <span className="font-bold text-sm">{deposit.toFixed(3)} KWD</span>
              </div>
              <div className="text-xs font-medium flex items-center justify-center gap-0.5">
                <CreditCard className="w-3.5 h-3.5" />
                {invoice.paymentMethod || t("cash")}
              </div>
            </div>
          ))}
          
          {remaining > 0 ? (
            <div className="flex justify-between font-bold mt-2 pt-1 border-t-2 border-black px-2">
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

      <div className="text-center border-t-2 border-black pt-2 text-xs">
        <p className="font-bold text-sm mb-0">
          {isRtl ? "شكراً لاختياركم نظارات المعين" : "Thank you for choosing Moein Optical"}
        </p>
        <p className="text-[9px] mt-1 text-gray-500">
          {isRtl ? "هذا الإيصال يعتبر إثبات للطلب فقط وليس إيصال دفع" : 
                  "This receipt is proof of order only and not a payment receipt"}
        </p>
      </div>
    </div>
  );
};
