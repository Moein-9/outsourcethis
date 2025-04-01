
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInvoiceForm } from "./InvoiceFormContext";
import { Button } from "@/components/ui/button";
import { 
  ClipboardCheck, Printer, Receipt, 
  Check, ChevronRight, FileText, PartyPopper,
  CreditCard, User, Phone, Calendar, AlertTriangle,
  Contact, ScrollText, Glasses
} from "lucide-react";
import { CustomPrintService } from "@/utils/CustomPrintService";
import { Invoice } from "@/store/invoiceStore";
import { CustomPrintWorkOrderButton } from "@/components/CustomPrintWorkOrderButton";
import { PrintOptionsDialog } from "@/components/PrintOptionsDialog";
import { toast } from "sonner";
import { WorkOrder as InventoryWorkOrder } from "@/types/inventory";
import { PrintButton } from "@/components/PrintButton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface InvoiceStepSummaryProps {
  setInvoicePrintOpen: (open: boolean) => void;
  setWorkOrderPrintOpen: (open: boolean) => void;
  setActiveTab?: (tab: string) => void;
}

export const InvoiceStepSummary: React.FC<InvoiceStepSummaryProps> = ({ 
  setInvoicePrintOpen, 
  setWorkOrderPrintOpen,
  setActiveTab
}) => {
  const { t, language } = useLanguageStore();
  const { getValues, calculateTotal, calculateRemaining } = useInvoiceForm();
  
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  const directionClass = language === 'ar' ? 'rtl' : 'ltr';
  
  const currentTimestamp = new Date().toISOString();
  
  const invoice = {
    invoiceId: getValues<string>('invoiceId') || "",
    workOrderId: getValues<string>('workOrderId') || "",
    patientName: getValues<string>('patientName') || "",
    patientPhone: getValues<string>('patientPhone') || "",
    patientId: getValues<string>('patientId') || "",
    invoiceType: getValues<string>('invoiceType') || "glasses",
    lensType: getValues<string>('lensType') || "",
    lensPrice: getValues<number>('lensPrice') || 0,
    coating: getValues<string>('coating') || "",
    coatingPrice: getValues<number>('coatingPrice') || 0,
    thickness: getValues<string>('thickness') || "",
    thicknessPrice: getValues<number>('thicknessPrice') || 0,
    frameBrand: getValues<string>('frameBrand') || "",
    frameModel: getValues<string>('frameModel') || "",
    frameColor: getValues<string>('frameColor') || "",
    framePrice: getValues<number>('framePrice') || 0,
    contactLensItems: getValues('contactLensItems') || [],
    discount: getValues<number>('discount') || 0,
    deposit: getValues<number>('deposit') || 0,
    total: calculateTotal(),
    remaining: calculateRemaining(),
    paymentMethod: getValues<string>('paymentMethod') || "",
    isPaid: calculateRemaining() <= 0,
    authNumber: getValues<string>('authNumber') || "",
    serviceName: getValues<string>('serviceName') || "",
    serviceId: getValues<string>('serviceId') || "",
    serviceDescription: getValues<string>('serviceDescription') || "",
    servicePrice: getValues<number>('servicePrice') || 0,
    createdAt: currentTimestamp,
  } as Invoice;
  
  const rxData = getValues('rx') || {
    sphereOD: "",
    cylOD: "",
    axisOD: "",
    sphereOS: "",
    cylOS: "",
    axisOS: "",
    add: "",
    pd: "",
    pdRight: "",
    pdLeft: "",
    addOD: "",
    addOS: "",
    prism: "",
    base: "",
    va: "",
    notes: "",
    optometrist: ""
  };
  
  const patient = {
    patientId: getValues<string>('patientId') || "",
    name: getValues<string>('patientName') || "",
    phone: getValues<string>('patientPhone') || "",
    dob: "",
    notes: "",
    rx: rxData,
    contactLensRx: getValues('contactLensRx') || null,
    createdAt: currentTimestamp
  };
  
  const hasInvoiceData = !!invoice.invoiceId;
  const isContactLens = invoice.invoiceType === "contacts";
  const isEyeExam = invoice.invoiceType === "exam";
  
  const lensTypeValue = getValues<string>('lensType') || "";
  const lensTypeObject = typeof lensTypeValue === 'string' 
    ? { name: lensTypeValue, price: getValues<number>('lensPrice') || 0 }
    : lensTypeValue;
  
  const workOrder = {
    id: invoice.workOrderId || "",
    patientId: patient.patientId || "",
    createdAt: currentTimestamp,
    lensType: lensTypeObject,
    contactLenses: invoice.contactLensItems,
    isPaid: invoice.isPaid,
    rx: rxData,
    isContactLens: isContactLens,
    contactLensRx: getValues('contactLensRx'),
    ...(invoice.discount ? { discount: invoice.discount } : {})
  } as any;
  
  const handlePrintInvoice = () => {
    CustomPrintService.printInvoice(invoice);
  };
  
  const handlePrintWorkOrder = () => {
    CustomPrintService.printWorkOrder(workOrder, invoice, patient);
  };
  
  if (!hasInvoiceData) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="p-8 rounded-lg bg-amber-50 border-2 border-amber-200 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center shadow-md">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <div className="ml-5">
              <h3 className="text-xl font-semibold text-amber-800">
                {language === 'ar' ? 'لا توجد بيانات للفاتورة بعد' : 'No invoice data yet'}
              </h3>
              <p className="text-amber-700 text-base mt-1">
                {t('startBySelectingClient')}
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={() => setActiveTab && setActiveTab("patient")}
              className="px-6 py-3 h-auto text-base"
            >
              <User className="w-5 h-5 mr-2" />
              {t('goToClientSection')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="p-8 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-md">
            <PartyPopper className="w-8 h-8 text-white" />
          </div>
          <div className="ml-5">
            <h3 className="text-xl font-semibold text-green-800">
              {t('invoiceCreated')}
            </h3>
            <p className="text-green-700 text-base mt-1">
              {t('invoiceSuccessMessage')}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-green-200 mb-5 shadow-sm">
          <div className="flex flex-col space-y-4">
            <div className={`flex justify-between items-center pb-3 border-b border-dashed border-green-200 ${textAlignClass}`}>
              <div className="flex items-center">
                <Receipt className="w-5 h-5 text-amber-500 mr-2" />
                <span className="text-gray-600 font-medium">{t('invoiceNumber')}:</span>
              </div>
              <span className="font-bold text-lg text-amber-500">{invoice.invoiceId}</span>
            </div>
            
            {!isEyeExam && (
              <div className={`flex justify-between items-center pb-3 border-b border-dashed border-green-200 ${textAlignClass}`}>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-primary mr-2" />
                  <span className="text-gray-600 font-medium">{t('workOrderNumber')}:</span>
                </div>
                <span className="font-bold text-lg text-primary">{invoice.workOrderId}</span>
              </div>
            )}
            
            <div className={`flex justify-between items-center pb-3 border-b border-dashed border-green-200 ${textAlignClass}`}>
              <div className="flex items-center">
                {isEyeExam ? (
                  <ScrollText className="w-5 h-5 text-blue-600 mr-2" />
                ) : isContactLens ? (
                  <Contact className="w-5 h-5 text-blue-600 mr-2" />
                ) : (
                  <Glasses className="w-5 h-5 text-blue-600 mr-2" />
                )}
                <span className="text-gray-600 font-medium">{t('orderType')}:</span>
              </div>
              <span className="font-medium">
                {isEyeExam 
                  ? (language === 'ar' ? 'فحص العين' : 'Eye Exam') 
                  : isContactLens 
                    ? t('contactLenses') 
                    : t('glasses')}
              </span>
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
                  <span className="text-gray-600 font-medium">{t('clientPhone')}:</span>
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
                <span className="text-gray-600 font-medium">{t('totalInvoice')}:</span>
              </div>
              <span className="font-bold text-lg">{invoice.total.toFixed(2)} {t('kwd')}</span>
            </div>
            
            <div className={`flex justify-between items-center ${textAlignClass}`}>
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-orange-500 mr-2" />
                <span className="text-gray-600 font-medium">{t('paymentStatus')}:</span>
              </div>
              <div className={`px-3 py-1 rounded-full ${invoice.isPaid ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"} font-medium text-sm`}>
                {invoice.isPaid ? t('paidInFull') : t('partiallyPaid')}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Card className="border-2 border-primary/20 shadow-sm overflow-hidden">
        <div className="p-6 bg-primary/5">
          <h3 className={`text-lg font-semibold text-primary pb-3 flex items-center ${textAlignClass}`}>
            <FileText className="w-5 h-5 mr-2" />
            {t('nextSteps')}
          </h3>
          <Separator className="my-2 bg-primary/20" />
        </div>
        
        <CardContent className="p-4 space-y-4">
          {!isEyeExam && (
            <CustomPrintWorkOrderButton
              workOrder={workOrder}
              invoice={invoice}
              patient={patient}
            >
              <div className="group cursor-pointer rounded-lg border hover:border-blue-400 transition-all duration-300 overflow-hidden hover:shadow-md">
                <div className="flex items-center">
                  <div className={`${language === 'ar' ? 'order-last' : 'order-first'} w-16 h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-4`}>
                    <ClipboardCheck className="w-8 h-8 text-white" />
                  </div>
                  <div className={`flex-grow p-4 ${textAlignClass}`}>
                    <h4 className="font-medium text-lg text-blue-700">{t('printWorkOrder')}</h4>
                    <p className="text-sm text-gray-600">{t('printWorkOrderDescription')}</p>
                  </div>
                  <div className={`p-4 ${language === 'ar' ? 'rotate-180' : ''}`}>
                    <ChevronRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </CustomPrintWorkOrderButton>
          )}
          
          <div 
            className="group cursor-pointer rounded-lg border hover:border-green-400 transition-all duration-300 overflow-hidden hover:shadow-md"
            onClick={handlePrintInvoice}
          >
            <div className="flex items-center">
              <div className={`${language === 'ar' ? 'order-last' : 'order-first'} w-16 h-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center p-4`}>
                <Receipt className="w-8 h-8 text-white" />
              </div>
              <div className={`flex-grow p-4 ${textAlignClass}`}>
                <h4 className="font-medium text-lg text-green-700">{t('printInvoice')}</h4>
                <p className="text-sm text-gray-600">{t('printInvoiceDescription')}</p>
              </div>
              <div className={`p-4 ${language === 'ar' ? 'rotate-180' : ''}`}>
                <ChevronRight className="w-5 h-5 text-green-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
