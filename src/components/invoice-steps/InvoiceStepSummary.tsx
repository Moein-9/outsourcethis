
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInvoiceForm } from "./InvoiceFormContext";
import { Button } from "@/components/ui/button";
import { 
  ClipboardCheck, Printer, Receipt, 
  Check, ChevronRight, FileText, PartyPopper,
  CreditCard, User, Phone, Calendar
} from "lucide-react";

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
    <div className="space-y-8 animate-fade-in">
      <div className="p-6 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 shadow-sm">
        <div className="flex items-center mb-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-md">
            <PartyPopper className="w-7 h-7 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-green-800">
              {t('invoiceCreated')}
            </h3>
            <p className="text-green-700 text-sm">
              {t('invoiceSuccessMessage')}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-green-200 mb-5 shadow-sm">
          <div className="flex flex-col space-y-4">
            <div className={`flex justify-between items-center pb-3 border-b border-dashed border-green-200 ${textAlignClass}`}>
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-primary mr-2" />
                <span className="text-gray-600 font-medium">{t('workOrderNumber')}:</span>
              </div>
              <span className="font-bold text-lg text-primary">{invoice.workOrderId}</span>
            </div>
            
            <div className={`flex justify-between items-center ${textAlignClass}`}>
              <div className="flex items-center">
                <User className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-gray-600 font-medium">{t('clientName')}:</span>
              </div>
              <span className="font-medium">{invoice.patientName || t('anonymous')}</span>
            </div>
            
            {invoice.patientPhone && (
              <div className={`flex justify-between items-center ${textAlignClass}`}>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-gray-600 font-medium">{t('phoneNumber')}:</span>
                </div>
                <span>{invoice.patientPhone}</span>
              </div>
            )}
            
            <div className={`flex justify-between items-center ${textAlignClass}`}>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-amber-500 mr-2" />
                <span className="text-gray-600 font-medium">{t('date')}:</span>
              </div>
              <span>{new Date().toLocaleDateString('en-US')}</span>
            </div>
            
            <div className="my-3 border-t border-dashed border-green-200"></div>
            
            <div className={`flex justify-between items-center ${textAlignClass}`}>
              <div className="flex items-center">
                <Receipt className="w-5 h-5 text-purple-500 mr-2" />
                <span className="text-gray-600 font-medium">{t('totalAmount')}:</span>
              </div>
              <span className="font-bold text-lg">{invoice.total.toFixed(2)} {t('kwd')}</span>
            </div>
            
            <div className={`flex justify-between items-center ${textAlignClass}`}>
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-orange-500 mr-2" />
                <span className="text-gray-600 font-medium">{t('paymentStatus')}:</span>
              </div>
              <div className={`px-3 py-1 rounded-full ${invoice.isPaid ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"} font-medium text-sm`}>
                {invoice.isPaid ? t('paid') : t('partiallyPaid')}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 border-2 border-primary/20 rounded-lg bg-primary/5 shadow-sm">
        <h3 className={`text-lg font-semibold text-primary pb-3 border-b border-primary/20 flex items-center ${textAlignClass}`}>
          <FileText className="w-5 h-5 mr-2 text-primary" />
          {t('nextSteps')}
        </h3>
        
        <div className="mt-6 space-y-4">
          <Button 
            variant="outline"
            className="w-full justify-between group hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 hover:shadow-sm p-4 h-auto"
            onClick={() => setWorkOrderPrintOpen(true)}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                <ClipboardCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">{t('printWorkOrder')}</div>
                <div className="text-xs text-muted-foreground">{t('printWorkOrderDescription')}</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline"
            className="w-full justify-between group hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700 transition-all duration-300 hover:shadow-sm p-4 h-auto"
            onClick={() => setInvoicePrintOpen(true)}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                <Receipt className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">{t('printInvoice')}</div>
                <div className="text-xs text-muted-foreground">{t('printInvoiceDescription')}</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};
