
import React from 'react';
import { useLanguageStore } from '@/store/languageStore';

interface WorkOrderReceiptProps {
  workOrder: any;
  invoice?: any;
  patient?: any;
}

export const CustomWorkOrderReceipt: React.FC<WorkOrderReceiptProps> = ({ 
  workOrder, 
  invoice, 
  patient 
}) => {
  const { language } = useLanguageStore();
  const isRTL = language === 'ar';
  
  // Determine payment status
  const isPaid = invoice?.isPaid;
  const remainingAmount = invoice?.remaining || 0;
  
  return (
    <div 
      className="thermal-print print-container" 
      dir={isRTL ? "rtl" : "ltr"}
      style={{ 
        width: '80mm', 
        maxWidth: '80mm',
        margin: '0 auto',
        padding: '0.5rem',
        fontSize: '12px'
      }}
    >
      <div className="p-2 text-center">
        <img 
          src="/lovable-uploads/826ece02-80b8-482d-a2be-8292f3460297.png" 
          alt="Logo" 
          className="mx-auto mb-2"
          style={{ height: '80px' }}
        />
        <h1 className="text-xl font-bold">WORK ORDER</h1>
        <h2 className="text-lg">أمر عمل</h2>
        <div className="text-xs mb-2">{new Date().toLocaleDateString()}</div>
      </div>

      <div className="border-b border-dashed pb-2 mb-2">
        <h3 className="font-bold">
          {isRTL ? "معلومات المريض (Patient Information)" : "Patient Information (معلومات المريض)"}
        </h3>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div>Name:</div>
          <div className="font-bold">{patient?.name || workOrder?.patientName || "-"}</div>
          <div>Phone:</div>
          <div className="font-bold">{patient?.phone || workOrder?.patientPhone || "-"}</div>
          <div>Order ID:</div>
          <div className="font-bold">{workOrder?.id || "-"}</div>
        </div>
      </div>

      <div className="border-b border-dashed pb-2 mb-2">
        <h3 className="font-bold">
          {isRTL ? "تفاصيل الوصفة (Prescription Details)" : "Prescription Details (تفاصيل الوصفة)"}
        </h3>
        {workOrder?.prescription && (
          <div className="flex flex-col space-y-1">
            <div className="grid grid-cols-8 gap-x-1 text-xs text-center">
              <div></div>
              <div>SPH</div>
              <div>CYL</div>
              <div>AXIS</div>
              <div>ADD</div>
              <div>PD</div>
              <div>VA</div>
              <div>PRISM</div>
            </div>
            <div className="grid grid-cols-8 gap-x-1 text-xs text-center">
              <div className="font-bold">R</div>
              <div>{workOrder.prescription.rSph || "-"}</div>
              <div>{workOrder.prescription.rCyl || "-"}</div>
              <div>{workOrder.prescription.rAxis || "-"}</div>
              <div>{workOrder.prescription.rAdd || "-"}</div>
              <div>{workOrder.prescription.rPd || "-"}</div>
              <div>{workOrder.prescription.rVa || "-"}</div>
              <div>{workOrder.prescription.rPrism || "-"}</div>
            </div>
            <div className="grid grid-cols-8 gap-x-1 text-xs text-center">
              <div className="font-bold">L</div>
              <div>{workOrder.prescription.lSph || "-"}</div>
              <div>{workOrder.prescription.lCyl || "-"}</div>
              <div>{workOrder.prescription.lAxis || "-"}</div>
              <div>{workOrder.prescription.lAdd || "-"}</div>
              <div>{workOrder.prescription.lPd || "-"}</div>
              <div>{workOrder.prescription.lVa || "-"}</div>
              <div>{workOrder.prescription.lPrism || "-"}</div>
            </div>
          </div>
        )}
      </div>

      <div className="border-b border-dashed pb-2 mb-2">
        <h3 className="font-bold">
          {isRTL ? "تفاصيل المنتج (Product Details)" : "Product Details (تفاصيل المنتج)"}
        </h3>
        
        {/* Frame Section */}
        {workOrder?.frame && (
          <div className="mb-2">
            <div className="text-xs font-bold">
              {isRTL ? "الإطار (Frame)" : "Frame (الإطار)"}:
            </div>
            <div className="pl-2 text-xs">
              <div><span className="text-blue-500">{isRTL ? "النوع (Brand)" : "Brand (النوع)"}:</span> {workOrder.frame.brand} {workOrder.frame.model}</div>
              <div><span className="text-blue-500">{isRTL ? "اللون (Color)" : "Color (اللون)"}:</span> {workOrder.frame.color}</div>
              <div><span className="text-blue-500">{isRTL ? "الحجم (Size)" : "Size (الحجم)"}:</span> {workOrder.frame.size || "-"}</div>
            </div>
          </div>
        )}
        
        {/* Lens Section */}
        {workOrder?.lens && (
          <div className="mb-2">
            <div className="text-xs font-bold">
              {isRTL ? "العدسات (Lenses)" : "Lenses (العدسات)"}:
            </div>
            <div className="pl-2 text-xs">
              <div><span className="text-blue-500">{isRTL ? "النوع (Type)" : "Type (النوع)"}:</span> {workOrder.lens.type}</div>
              <div><span className="text-blue-500">{isRTL ? "الشركة المصنعة (Brand)" : "Brand (الشركة المصنعة)"}:</span> {workOrder.lens.brand || "-"}</div>
              <div><span className="text-blue-500">{isRTL ? "المؤشر (Index)" : "Index (المؤشر)"}:</span> {workOrder.lens.index || "-"}</div>
            </div>
          </div>
        )}
        
        {/* Coating Section */}
        {workOrder?.coating && workOrder.coating.length > 0 && (
          <div className="mb-2">
            <div className="text-xs font-bold">
              {isRTL ? "الطلاء (Coatings)" : "Coatings (الطلاء)"}:
            </div>
            <div className="pl-2 text-xs">
              {workOrder.coating.map((coat: any, index: number) => (
                <div key={index}>{coat.name}</div>
              ))}
            </div>
          </div>
        )}
        
        {/* Contact Lens Section */}
        {workOrder?.contactLens && (
          <div className="mb-2">
            <div className="text-xs font-bold">
              {isRTL ? "عدسات لاصقة (Contact Lenses)" : "Contact Lenses (عدسات لاصقة)"}:
            </div>
            <div className="pl-2 text-xs">
              <div><span className="text-blue-500">{isRTL ? "النوع (Type)" : "Type (النوع)"}:</span> {workOrder.contactLens.type}</div>
              <div><span className="text-blue-500">{isRTL ? "الشركة المصنعة (Brand)" : "Brand (الشركة المصنعة)"}:</span> {workOrder.contactLens.brand || "-"}</div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Status Section - Enhanced */}
      <div className="border-b border-dashed pb-2 mb-3">
        <h3 className="font-bold">
          {isRTL ? "معلومات الدفع (Payment Information)" : "Payment Information (معلومات الدفع)"}
        </h3>
        
        {isPaid ? (
          <div className="py-2 px-1 rounded bg-green-100 border border-green-300 text-center my-1">
            <div className="font-bold text-green-700">
              {isRTL ? "تم الدفع بالكامل" : "PAID IN FULL"}
            </div>
            {!isRTL && <div className="text-xs text-green-600 font-semibold">تم الدفع بالكامل</div>}
            {isRTL && <div className="text-xs text-green-600 font-semibold">PAID IN FULL</div>}
          </div>
        ) : (
          <div className="py-2 px-1 rounded bg-red-100 border border-red-300 text-center my-1">
            <div className="font-bold text-red-700 text-lg">
              {isRTL ? "المبلغ المتبقي" : "REMAINING PAYMENT"}
            </div>
            {!isRTL && <div className="text-xs text-red-600 font-semibold">المبلغ المتبقي</div>}
            {isRTL && <div className="text-xs text-red-600 font-semibold">REMAINING PAYMENT</div>}
            <div className="text-xl font-bold text-red-700 mt-1">
              {remainingAmount.toFixed(3)} KWD
            </div>
          </div>
        )}
        
        <div className="text-xs mt-2">
          <div><span className="text-blue-500">{isRTL ? "المبلغ الإجمالي (Total)" : "Total (المبلغ الإجمالي)"}:</span> {invoice?.total?.toFixed(3) || "-"} KWD</div>
          <div><span className="text-blue-500">{isRTL ? "المدفوع (Paid)" : "Paid (المدفوع)"}:</span> {invoice?.deposit?.toFixed(3) || "-"} KWD</div>
          <div><span className="text-blue-500">{isRTL ? "المتبقي (Remaining)" : "Remaining (المتبقي)"}:</span> {invoice?.remaining?.toFixed(3) || "-"} KWD</div>
        </div>
      </div>
      
      {/* Quality Confirmation */}
      <div className="border-b border-dashed pb-2 mb-2">
        <h3 className="font-bold">
          {isRTL ? "تأكيد الجودة (Quality Confirmation)" : "Quality Confirmation (تأكيد الجودة)"}
        </h3>
        <div className="flex justify-between items-center mt-1">
          <div className="text-xs">□ Passed</div>
          <div className="text-xs">□ Rejected</div>
          <div className="text-xs">□ Needs Adjustment</div>
        </div>
      </div>
      
      {/* Technician Signature */}
      <div className="mb-2">
        <div className="text-xs font-bold mb-1">
          {isRTL ? "توقيع الفني (Technician Signature)" : "Technician Signature (توقيع الفني)"}:
        </div>
        <div className="border-b border-black h-8"></div>
      </div>
      
      <div className="text-center text-xs mt-4">
        <div>Thank you for your business!</div>
        <div>شكراً لثقتكم بنا</div>
      </div>
    </div>
  );
};
