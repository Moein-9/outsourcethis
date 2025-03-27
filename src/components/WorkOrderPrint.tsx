
import React from "react";
import { format } from "date-fns";
import { Invoice } from "@/store/invoiceStore";
import { Eye, Ruler, CircleDot, ClipboardCheck, User, Glasses, BadgeCheck, Contact } from "lucide-react";
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
  const dirClass = language === 'ar' ? 'rtl text-right' : 'ltr text-left';
  
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
  const remaining = invoice.remaining || 0;
  const isPaid = remaining <= 0;

  const formatDate = () => {
    const date = new Date(invoice.createdAt);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${format(date, 'yyyy-MM-dd')}`;
  };

  return (
    <div className="print-wrapper">
      <style>
        {`
          @media print {
            .hide-print {
              display: none !important;
            }
    
            @page {
              size: 80mm auto !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            html, body {
              width: 80mm !important;
              height: auto !important;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }

            .print-wrapper {
              visibility: visible !important;
              width: 80mm !important;
            }

            #work-order-print {
              visibility: visible !important;
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 80mm !important;
              padding: 0mm !important;
              margin: 0 !important;
              background: white !important;
              border: none !important;
            }

            .section-heading {
              background-color: black !important;
              color: white !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .logo-img {
              margin: 0 auto !important;
              display: block !important;
              width: auto !important;
              height: 10mm !important;
            }

            .red-bg {
              background-color: #ffeeee !important;
              border: 1px solid #ffdddd !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            table {
              width: 100% !important;
              border-collapse: collapse !important;
            }

            td, th {
              border: 1px solid black !important;
              padding: 1mm !important;
              text-align: center !important;
            }

            .signature-box {
              border: 1px solid #ddd !important;
            }
          }
        `}
      </style>

      <div 
        id="work-order-print" 
        className={dirClass} 
        style={{ 
          width: "80mm", 
          margin: "0 auto", 
          padding: "0", 
          backgroundColor: "white", 
          border: "1px solid #ddd", 
          boxSizing: "border-box",
          fontSize: "14px",
          fontFamily: "'Cairo', sans-serif"
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", padding: "8px 0 6px" }}>
          <div style={{ marginBottom: "5px" }}>
            <MoenLogo className="logo-img mx-auto" style={{ height: "36px", width: "auto" }} />
          </div>
          <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "2px" }}>
            Moen Optician
          </div>
          <div style={{ fontSize: "12px", marginBottom: "2px" }}>
            {storeInfo.address}
          </div>
          <div style={{ fontSize: "12px", marginBottom: "4px" }}>
            {t("phone")}: {storeInfo.phone}
          </div>
          
          <div style={{ borderTop: "1px solid #ddd", paddingTop: "6px", marginBottom: "2px" }}>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>
              {language === 'ar' ? 'أمر عمل' : 'ORDER'} + PREVIEW
            </div>
            <div style={{ fontSize: "13px", color: "#555" }}>
              {orderNumber}
            </div>
            <div style={{ fontSize: "13px", color: "#555" }}>
              {formatDate()}
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div style={{ marginBottom: "8px" }}>
          <div 
            className="section-heading" 
            style={{ 
              backgroundColor: "black", 
              color: "white", 
              padding: "4px 8px", 
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span>{language === 'ar' ? 'معلومات المريض' : 'Patient Information'} | {language === 'ar' ? 'Patient Information' : 'معلومات المريض'}</span>
          </div>
          
          <div style={{ marginTop: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px" }}>
              <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                {language === 'ar' ? 'الاسم:' : 'Customer Name'}
              </div>
              <div>
                {name}
              </div>
            </div>
            
            {phone && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px", marginTop: "4px" }}>
                <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                  {language === 'ar' ? 'الهاتف:' : 'Phone'}
                </div>
                <div>
                  {phone}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div style={{ marginBottom: "8px" }}>
          <div 
            className="section-heading" 
            style={{ 
              backgroundColor: "black", 
              color: "white", 
              padding: "4px 8px", 
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span>{language === 'ar' ? 'تفاصيل المنتج' : 'Product Details'} | {language === 'ar' ? 'Product Details' : 'تفاصيل المنتج'}</span>
          </div>
          
          {/* Lenses Information */}
          {lensTypeValue && !isContactLens && (
            <div style={{ padding: "0 8px", marginTop: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: "bold" }}>
                  {language === 'ar' ? 'العدسات (Lenses)' : 'Lenses (العدسات)'}:
                </div>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <div style={{ fontSize: "14px" }}>
                  {language === 'ar' ? 'النوع (Type)' : 'Type (النوع)'}:
                </div>
                <div>
                  {lensTypeValue === 'Single Vision' ? 'نظارات للقراءة' : lensTypeValue}
                </div>
              </div>

              {coatingValue && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <div style={{ fontSize: "14px" }}>
                    {language === 'ar' ? 'الطلاء (Coating)' : 'Coating (الطلاء)'}:
                  </div>
                  <div>
                    {coatingValue === 'Anti-Reflective' ? 'Basic (عادي)' : coatingValue}
                  </div>
                </div>
              )}

              {thicknessValue && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <div style={{ fontSize: "14px" }}>
                    {language === 'ar' ? 'السماكة (Thickness)' : 'Thickness (السماكة)'}:
                  </div>
                  <div>
                    {thicknessValue === 'Super Thin 1.67' ? 'Super Thin 1.67 (رقيق جداً)' : thicknessValue}
                  </div>
                </div>
              )}
              
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <div style={{ fontSize: "14px" }}>
                  {language === 'ar' ? 'السعر (Price)' : 'Price (السعر)'}:
                </div>
                <div>
                  KWD {invoice.lensPrice?.toFixed(3) || "0.000"}
                </div>
              </div>
            </div>
          )}
          
          {/* Frame Information */}
          {frameData && frameData.brand && !isContactLens && (
            <div style={{ padding: "0 8px", marginTop: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontWeight: "bold" }}>
                  {language === 'ar' ? 'الإطار (Frame)' : 'Frame (الإطار)'}:
                </div>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <div style={{ fontSize: "14px" }}>
                  {language === 'ar' ? 'الماركة:' : 'Brand:'}
                </div>
                <div>
                  {frameData.brand}
                </div>
              </div>
              
              {frameData.model && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <div style={{ fontSize: "14px" }}>
                    {language === 'ar' ? 'الموديل:' : 'Model:'}
                  </div>
                  <div>
                    {frameData.model}
                  </div>
                </div>
              )}
              
              {frameData.color && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <div style={{ fontSize: "14px" }}>
                    {language === 'ar' ? 'اللون:' : 'Color:'}
                  </div>
                  <div>
                    {frameData.color}
                  </div>
                </div>
              )}
              
              {frameData.size && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                  <div style={{ fontSize: "14px" }}>
                    {language === 'ar' ? 'الحجم:' : 'Size:'}
                  </div>
                  <div>
                    {frameData.size}
                  </div>
                </div>
              )}
              
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <div style={{ fontSize: "14px" }}>
                  {language === 'ar' ? 'السعر:' : 'Price:'}
                </div>
                <div>
                  KWD {frameData.price?.toFixed(3) || "0.000"}
                </div>
              </div>
            </div>
          )}
          
          {/* Contact Lens Information */}
          {isContactLens && contactLensItems.length > 0 && (
            <div style={{ padding: "0 8px", marginTop: "6px" }}>
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                {language === 'ar' ? 'العدسات اللاصقة:' : 'Contact Lenses:'}
              </div>
              
              {contactLensItems.map((lens, idx) => (
                <div key={idx} style={{ marginBottom: idx < contactLensItems.length - 1 ? "8px" : "0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontSize: "14px" }}>
                      {language === 'ar' ? 'النوع:' : 'Type:'}
                    </div>
                    <div>
                      {lens.brand} {lens.type}
                    </div>
                  </div>
                  
                  {lens.color && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                      <div style={{ fontSize: "14px" }}>
                        {language === 'ar' ? 'اللون:' : 'Color:'}
                      </div>
                      <div>
                        {lens.color}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                    <div style={{ fontSize: "14px" }}>
                      {language === 'ar' ? 'الكمية:' : 'Quantity:'}
                    </div>
                    <div>
                      {lens.qty || 1}
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                    <div style={{ fontSize: "14px" }}>
                      {language === 'ar' ? 'السعر:' : 'Price:'}
                    </div>
                    <div>
                      KWD {lens.price?.toFixed(3) || "0.000"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prescription Details (if exists) */}
        {rx && invoiceType === 'glasses' && (
          <div style={{ marginBottom: "8px" }}>
            <div 
              className="section-heading" 
              style={{ 
                backgroundColor: "black", 
                color: "white", 
                padding: "4px 8px", 
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <span>{language === 'ar' ? 'تفاصيل الوصفة الطبية' : 'Prescription Details'} | {language === 'ar' ? 'Prescription Details' : 'تفاصيل الوصفة الطبية'}</span>
            </div>
            
            <div style={{ padding: "6px 8px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", direction: "ltr" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontSize: "13px" }}>{t("eye")}</th>
                    <th style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontSize: "13px" }}>SPH</th>
                    <th style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontSize: "13px" }}>CYL</th>
                    <th style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontSize: "13px" }}>AXIS</th>
                    <th style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontSize: "13px" }}>ADD</th>
                    <th style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontSize: "13px" }}>PD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontWeight: "bold", fontSize: "13px" }}>OD (يمين)</td>
                    <td style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontSize: "13px" }}>{rx?.sphereOD || "----"}</td>
                    <td style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontSize: "13px" }}>{rx?.cylOD || "----"}</td>
                    <td style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontSize: "13px" }}>{rx?.axisOD || "----"}</td>
                    <td style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontSize: "13px" }}>{rx?.addOD || "----"}</td>
                    <td style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontSize: "13px" }}>{rx?.pdRight || rx?.pd || "----"}</td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontWeight: "bold", fontSize: "13px" }}>OS (يسار)</td>
                    <td style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontSize: "13px" }}>{rx?.sphereOS || "----"}</td>
                    <td style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontSize: "13px" }}>{rx?.cylOS || "----"}</td>
                    <td style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontSize: "13px" }}>{rx?.axisOS || "----"}</td>
                    <td style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontSize: "13px" }}>{rx?.addOS || "----"}</td>
                    <td style={{ border: "1px solid black", padding: "3px", textAlign: "center", fontSize: "13px" }}>{rx?.pdLeft || rx?.pd || "----"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Payment Information */}
        <div style={{ marginBottom: "8px" }}>
          <div 
            className="section-heading" 
            style={{ 
              backgroundColor: "black", 
              color: "white", 
              padding: "4px 8px", 
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span>{language === 'ar' ? 'معلومات الدفع' : 'Payment Information'} | {language === 'ar' ? 'Payment Information' : 'معلومات الدفع'}</span>
          </div>
          
          <div style={{ padding: "6px 8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                {language === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}
              </div>
              <div>
                KWD {total.toFixed(3)}
              </div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                {language === 'ar' ? 'المدفوع:' : 'Paid:'}
              </div>
              <div>
                KWD {deposit.toFixed(3)}
              </div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: !isPaid ? "8px" : "0" }}>
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                {language === 'ar' ? 'المتبقي:' : 'Remaining:'}
              </div>
              <div>
                KWD {remaining.toFixed(3)}
              </div>
            </div>
            
            {!isPaid && remaining > 0 && (
              <div 
                className="red-bg"
                style={{ 
                  textAlign: "center", 
                  padding: "6px", 
                  backgroundColor: "#ffeeee", 
                  border: "1px solid #ffdddd",
                  borderRadius: "4px", 
                  marginTop: "4px" 
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "#cc0000" }}>
                  {language === 'ar' ? 'المبلغ المتبقي' : 'REMAINING AMOUNT'}
                </div>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#cc0000" }}>
                  KWD {remaining.toFixed(3)}
                </div>
                <div style={{ fontSize: "12px", color: "#cc0000" }}>
                  {language === 'ar' ? 'REMAINING AMOUNT' : 'المبلغ المتبقي'}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Quality Confirmation */}
        <div style={{ marginBottom: "8px" }}>
          <div 
            className="section-heading" 
            style={{ 
              backgroundColor: "black", 
              color: "white", 
              padding: "4px 8px", 
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span>{language === 'ar' ? 'تأكيد الجودة' : 'Quality Confirmation'} | {language === 'ar' ? 'Quality Confirmation' : 'تأكيد الجودة'}</span>
          </div>
          
          <div style={{ display: "flex", marginTop: "4px" }}>
            <div 
              className="signature-box"
              style={{ 
                flex: "1", 
                borderRight: language === 'ar' ? "none" : "1px solid #ddd", 
                borderLeft: language === 'ar' ? "1px solid #ddd" : "none",
                padding: "8px", 
                textAlign: "center",
                minHeight: "60px"
              }}
            >
              <div style={{ marginBottom: "6px", fontSize: "14px", fontWeight: "bold" }}>
                {language === 'ar' ? 'توقيع الفني' : 'Technician Signature'}
              </div>
              <div style={{ fontSize: "12px", marginTop: "30px" }}>
                {language === 'ar' ? 'التاريخ: __/__/____' : 'Date: __/__/____'}
              </div>
            </div>
            
            <div 
              className="signature-box"
              style={{ 
                flex: "1", 
                padding: "8px", 
                textAlign: "center",
                minHeight: "60px"
              }}
            >
              <div style={{ marginBottom: "6px", fontSize: "14px", fontWeight: "bold" }}>
                {language === 'ar' ? 'توقيع المدير' : 'Manager Signature'}
              </div>
              <div style={{ fontSize: "12px", marginTop: "30px" }}>
                {language === 'ar' ? 'التاريخ: __/__/____' : 'Date: __/__/____'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Notes */}
        <div style={{ marginBottom: "10px" }}>
          <div 
            className="section-heading" 
            style={{ 
              backgroundColor: "black", 
              color: "white", 
              padding: "4px 8px", 
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span>{language === 'ar' ? 'ملاحظات' : 'Notes'} | {language === 'ar' ? 'Notes' : 'ملاحظات'}</span>
          </div>
          
          <div 
            style={{ 
              minHeight: "60px", 
              border: "1px solid #ddd", 
              margin: "4px 8px 0", 
              borderRadius: "2px",
              textAlign: "center",
              padding: "8px"
            }}
          >
            {/* Notes content would go here */}
          </div>
        </div>
      </div>
    </div>
  );
};
