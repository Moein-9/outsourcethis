
import React, { useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { CustomWorkOrderReceipt } from "./CustomWorkOrderReceipt";

interface WorkOrderPrintProps {
  invoice?: any;
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
  } | null;
  contactLenses?: any[];
  contactLensRx?: any;
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
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  // Determine if this is a contact lens work order
  const isContactLens = contactLenses?.length > 0 || 
                       invoice?.contactLensItems?.length > 0 ||
                       invoice?.invoiceType === 'contacts';
  
  console.log("WorkOrderPrint - Is contact lens:", isContactLens);
  console.log("WorkOrderPrint - Contact lens RX:", contactLensRx);
  
  // Create a workorder object from props
  const workOrder = {
    id: invoice?.workOrderId || "PREVIEW",
    patientName: patientName,
    patientPhone: patientPhone,
    lensType: lensType,
    contactLenses: contactLenses || invoice?.contactLensItems,
    rx: rx,
    contactLensRx: contactLensRx, // Important: Pass the contact lens RX
    isContactLens: isContactLens, // Set the contact lens flag
    frameBrand: frame?.brand,
    frameModel: frame?.model,
    frameColor: frame?.color,
    frameSize: frame?.size
  };
  
  // Create a patient object from props
  const patient = {
    name: patientName,
    phone: patientPhone,
    rx: rx,
    contactLensRx: contactLensRx // Also pass to the patient object
  };

  return (
    <div className={`print:w-full ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="hidden print:block">
        <CustomWorkOrderReceipt 
          workOrder={workOrder}
          invoice={invoice}
          patient={patient}
          isPrintable={true}
        />
      </div>
      
      <div className="print:hidden w-full max-w-[80mm] bg-white mx-auto border rounded shadow-sm">
        <CustomWorkOrderReceipt 
          workOrder={workOrder}
          invoice={invoice}
          patient={patient}
        />
      </div>
    </div>
  );
};
