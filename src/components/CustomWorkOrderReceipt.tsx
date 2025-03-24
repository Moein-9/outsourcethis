
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { AlertTriangle, Eye } from "lucide-react";
import { ReceiptHeader } from "./workorder/ReceiptHeader";
import { PatientInfoSection } from "./workorder/PatientInfoSection";
import { PrescriptionSection } from "./workorder/PrescriptionSection";
import { ProductSection } from "./workorder/ProductSection";
import { PaymentSection } from "./workorder/PaymentSection";
import { QualitySection } from "./workorder/QualitySection";
import { NotesSection } from "./workorder/NotesSection";
import { ReceiptFooter } from "./workorder/ReceiptFooter";
import { PrintStyles } from "./workorder/PrintStyles";
import { EmptyReceiptMessage } from "./workorder/EmptyReceiptMessage";
import { getLensTypeArabic, getCoatingArabic } from "@/utils/workOrderUtils";

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
  const amountPaid = invoice?.payments 
    ? invoice.payments.reduce((sum, payment) => sum + payment.amount, 0) 
    : deposit || 0;
  const remaining = total - amountPaid;
  const isPaid = remaining <= 0;
  
  const invoiceNumber = invoice?.invoiceId || invoice?.workOrderId || workOrder?.id || `WO${Date.now().toString().slice(-6)}`;

  // If there's no workOrder or invoice data, show a message
  if (!workOrder && !invoice) {
    return <EmptyReceiptMessage />;
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
      <ReceiptHeader invoiceNumber={invoiceNumber} />
      
      <PatientInfoSection 
        patientName={patientName} 
        patientPhone={patientPhone} 
      />
      
      <PrescriptionSection rx={rx} />
      
      <ProductSection 
        frameData={frameData}
        lensType={lensType}
        lensName={lensName}
        lensPrice={lensPrice}
        coating={coating}
        coatingName={coatingName}
        coatingPrice={coatingPrice}
      />
      
      <PaymentSection 
        total={total}
        deposit={deposit}
        discount={discount}
        amountPaid={amountPaid}
        remaining={remaining}
        isPaid={isPaid}
      />
      
      <QualitySection />
      
      <NotesSection />
      
      <ReceiptFooter />
      
      <PrintStyles />
    </div>
  );
};
