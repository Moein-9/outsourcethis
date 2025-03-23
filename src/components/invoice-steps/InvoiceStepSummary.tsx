
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInvoiceForm } from "./InvoiceFormContext";
import { Button } from "@/components/ui/button";
import { 
  ClipboardCheck, Printer, Receipt, ExternalLink,
  Check, ChevronRight
} from "lucide-react";
import { CustomPrintWorkOrderButton } from "@/components/CustomPrintWorkOrderButton";

interface InvoiceStepSummaryProps {
  setInvoicePrintOpen: (open: boolean) => void;
  setWorkOrderPrintOpen: (open: boolean) => void;
}

export const InvoiceStepSummary: React.FC<InvoiceStepSummaryProps> = ({ 
  setInvoicePrintOpen, 
  setWorkOrderPrintOpen 
}) => {
  const { t, language } = useLanguageStore();
  const { getValues } = useInvoiceForm();
  
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  const invoice = {
    invoiceId: getValues<string>('workOrderId') || "PREVIEW",
    patientName: getValues<string>('patientName') || "",
    patientPhone: getValues<string>('patientPhone') || "",
    patientId: getValues<string>('patientId'),
    lensType: getValues<string>('lensType') || "",
    lensPrice: getValues<number>('lensPrice') || 0,
    coating: getValues<string>('coating') || "",
    coatingPrice: getValues<number>('coatingPrice') || 0,
    frameBrand: getValues<string>('frameBrand') || "",
    frameModel: getValues<string>('frameModel') || "",
    frameColor: getValues<string>('frameColor') || "",
    framePrice: getValues<number>('framePrice') || 0,
    discount: getValues<number>('discount') || 0,
    deposit: getValues<number>('deposit') || 0,
    total: getValues<number>('total') || 0,
    remaining: getValues<number>('remaining') || 0,
    paymentMethod: getValues<string>('paymentMethod') || "",
    isPaid: getValues<boolean>('isPaid'),
    authNumber: getValues<string>('authNumber') || "",
    workOrderId: getValues<string>('workOrderId') || "",
  };
  
  const patient = {
    name: getValues<string>('patientName') || "",
    phone: getValues<string>('patientPhone') || ""
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-5 border rounded-lg bg-green-50 border-green-200">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-6 h-6 text-white" />
          </div>
          <h3 className="ml-3 text-xl font-semibold text-green-800">
            {t('invoiceCreated')}
          </h3>
        </div>
        
        <p className="text-green-700 mb-4">
          {t('invoiceSuccessMessage')}
        </p>
        
        <div className="bg-white p-4 rounded-lg border border-green-200 mb-4">
          <div className={`flex justify-between ${textAlignClass}`}>
            <span className="text-gray-600">{t('workOrderNumber')}:</span>
            <span className="font-bold">{invoice.workOrderId}</span>
          </div>
          
          <div className={`flex justify-between ${textAlignClass}`}>
            <span className="text-gray-600">{t('clientName')}:</span>
            <span>{invoice.patientName || t('anonymous')}</span>
          </div>
          
          <div className={`flex justify-between ${textAlignClass}`}>
            <span className="text-gray-600">{t('totalAmount')}:</span>
            <span>{invoice.total.toFixed(2)} {t('kwd')}</span>
          </div>
          
          <div className={`flex justify-between ${textAlignClass}`}>
            <span className="text-gray-600">{t('paymentStatus')}:</span>
            <span className={invoice.isPaid ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
              {invoice.isPaid ? t('paid') : t('partiallyPaid')}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-5 border rounded-lg">
        <h3 className={`text-lg font-semibold text-primary pb-3 border-b ${textAlignClass}`}>
          {t('nextSteps')}
        </h3>
        
        <div className="mt-4 space-y-3">
          <Button 
            variant="outline"
            className="w-full justify-between"
            onClick={() => setWorkOrderPrintOpen(true)}
          >
            <div className="flex items-center">
              <ClipboardCheck className="w-5 h-5 mr-2 text-primary" />
              {t('printWorkOrder')}
            </div>
            <ChevronRight className="w-5 h-5" />
          </Button>
          
          <Button 
            variant="outline"
            className="w-full justify-between"
            onClick={() => setInvoicePrintOpen(true)}
          >
            <div className="flex items-center">
              <Receipt className="w-5 h-5 mr-2 text-primary" />
              {t('printInvoice')}
            </div>
            <ChevronRight className="w-5 h-5" />
          </Button>
          
          <CustomPrintWorkOrderButton 
            workOrder={invoice}
            invoice={invoice}
            patient={patient}
            className="w-full justify-between"
          />
        </div>
      </div>
    </div>
  );
};
