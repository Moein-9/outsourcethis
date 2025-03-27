
import React, { useState, useEffect } from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { 
  FileText, Printer, Receipt, User, PackageCheck, CreditCard,
  PartyPopper, DollarSign, Info, ShoppingBag, Tag, Calculator,
  MessageCircleDashed, Loader, Check, Ruler
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceStepPatient } from "@/components/invoice-steps/InvoiceStepPatient";
import { InvoiceStepProducts } from "@/components/invoice-steps/InvoiceStepProducts";
import { InvoiceStepPayment } from "@/components/invoice-steps/InvoiceStepPayment";
import { InvoiceStepSummary } from "@/components/invoice-steps/InvoiceStepSummary";
import { InvoiceFormProvider, useInvoiceForm } from "@/components/invoice-steps/InvoiceFormContext";
import { ReceiptInvoice } from "@/components/ReceiptInvoice";
import { WorkOrderPrint } from "@/components/WorkOrderPrint";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";

const CreateInvoiceContent: React.FC = () => {
  const { t, language } = useLanguageStore();
  const [invoiceType, setInvoiceType] = useState<"glasses" | "contacts">("glasses");
  const [invoicePrintOpen, setInvoicePrintOpen] = useState(false);
  const [workOrderPrintOpen, setWorkOrderPrintOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("patient");
  const { getValues, setValue, calculateTotal, calculateRemaining } = useInvoiceForm();
  
  useEffect(() => {
    const handleNavigateToSummary = () => {
      setActiveTab("summary");
    };
    
    window.addEventListener('navigateToSummary', handleNavigateToSummary);
    
    return () => {
      window.removeEventListener('navigateToSummary', handleNavigateToSummary);
    };
  }, []);
  
  const handlePrintWorkOrder = () => {
    setWorkOrderPrintOpen(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };
  
  const handlePrintInvoice = () => {
    setInvoicePrintOpen(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const previewInvoice = {
    invoiceId: getValues("invoiceId") || "PREVIEW",
    workOrderId: getValues("workOrderId") || "PREVIEW",
    createdAt: new Date().toISOString(),
    patientName: getValues("patientName") || "Customer Name",
    patientPhone: getValues("patientPhone") || "",
    patientId: getValues("patientId"),
    invoiceType: getValues("invoiceType") || "glasses",
    lensType: getValues("lensType") || "",
    lensPrice: getValues("lensPrice") || 0, // Added lensPrice
    coating: getValues("coating") || "",
    coatingPrice: getValues("coatingPrice") || 0,
    thickness: getValues("thickness") || "",
    thicknessPrice: getValues("thicknessPrice") || 0,
    frameBrand: getValues("frameBrand") || "",
    frameModel: getValues("frameModel") || "",
    frameColor: getValues("frameColor") || "",
    framePrice: getValues("framePrice") || 0,
    discount: getValues("discount") || 0,
    deposit: getValues("deposit") || 0,
    total: calculateTotal(),
    remaining: calculateRemaining(),
    paymentMethod: getValues("paymentMethod") || "Cash",
    isPaid: calculateRemaining() <= 0,
    authNumber: getValues("authNumber") || "",
    contactLensItems: getValues("contactLensItems") || []
  };

  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';

  const total = calculateTotal();
  const remaining = calculateRemaining();
  
  const hasPatientData = !!getValues("patientName");
  const hasProductData = invoiceType === "glasses" 
    ? (!!getValues("lensType") || (!getValues("skipFrame") && !!getValues("frameBrand")))
    : (getValues("contactLensItems")?.length > 0);

  return (
    <div className="py-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold flex items-center gap-2 ${textAlignClass}`}>
          <FileText className="w-6 h-6 text-primary" />
          {t('invoiceTitle')}
        </h2>
        
        <div className="flex items-center space-x-3">
          <Button 
            onClick={handlePrintInvoice} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Receipt className="w-4 h-4" />
            {t('printInvoice')}
          </Button>
          
          <Button 
            onClick={handlePrintWorkOrder} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            {t('printWorkOrder')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <Card className="border border-muted-foreground/10 shadow-md h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full rounded-none">
                <TabsTrigger value="patient" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t('clientSection')}
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <PackageCheck className="w-4 h-4" />
                  {t('productSection')}
                </TabsTrigger>
                <TabsTrigger value="payment" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  {t('paymentSection')}
                </TabsTrigger>
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {t('summarySection')}
                </TabsTrigger>
              </TabsList>
              
              <CardContent className="p-6 min-h-[500px]">
                <TabsContent value="patient" className="mt-0 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <InvoiceStepPatient 
                      invoiceType={invoiceType} 
                      onInvoiceTypeChange={setInvoiceType} 
                    />
                    
                    <div className="flex justify-end mt-4">
                      <Button 
                        onClick={() => setActiveTab("products")} 
                        className="flex items-center gap-2"
                      >
                        {t('next')}
                      </Button>
                    </div>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="products" className="mt-0 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <InvoiceStepProducts invoiceType={invoiceType} />
                    
                    <div className="flex justify-between mt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab("patient")} 
                        className="flex items-center gap-2"
                      >
                        {t('previous')}
                      </Button>
                      <Button 
                        onClick={() => setActiveTab("payment")} 
                        className="flex items-center gap-2"
                      >
                        {t('next')}
                      </Button>
                    </div>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="payment" className="mt-0 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <InvoiceStepPayment />
                    
                    <div className="flex justify-between mt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab("products")} 
                        className="flex items-center gap-2"
                      >
                        {t('previous')}
                      </Button>
                    </div>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="summary" className="mt-0 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <InvoiceStepSummary 
                      setInvoicePrintOpen={setInvoicePrintOpen}
                      setWorkOrderPrintOpen={setWorkOrderPrintOpen}
                      setActiveTab={setActiveTab}
                    />
                    
                    <div className="flex justify-between mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab("payment")} 
                        className="flex items-center gap-2"
                      >
                        {t('previous')}
                      </Button>
                      <Button 
                        variant="default" 
                        onClick={() => {
                          setActiveTab("patient");
                        }} 
                        className="flex items-center gap-2"
                      >
                        {language === 'ar' ? 'فاتورة جديدة' : 'New Invoice'}
                      </Button>
                    </div>
                  </motion.div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
        
        <div className="col-span-1">
          <Card className="border border-primary-foreground/20 shadow-lg rounded-xl h-full overflow-hidden bg-gradient-to-b from-white to-slate-50">
            <CardHeader className="bg-gradient-to-r from-primary/80 to-primary p-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-white" />
                {t('invoiceSummary')}
              </CardTitle>
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: 15 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <MessageCircleDashed className="w-5 h-5 text-yellow-300" />
              </motion.div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="divide-y divide-dashed">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-indigo-700">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="border-b-2 border-blue-200 pb-1 w-full">{t('clientInformation')}</span>
                  </h4>
                  
                  {hasPatientData ? (
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <p className="text-base font-semibold text-gray-800">{getValues("patientName")}</p>
                      {getValues("patientPhone") && (
                        <p className="text-sm text-indigo-600 mt-1 flex items-center gap-1">
                          <Info className="w-3 h-3" /> 
                          {getValues("patientPhone")}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-white/80 rounded-lg text-center">
                      <MessageCircleDashed className="w-5 h-5 text-blue-300 mx-auto mb-1 animate-pulse" />
                      <p className="text-sm text-blue-400">{t('waitingForClientData')}</p>
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-teal-700">
                    <ShoppingBag className="w-4 h-4 text-emerald-500" />
                    <span className="border-b-2 border-emerald-200 pb-1 w-full">{language === 'ar' ? "معلومات المنتجات" : "Products Information"}</span>
                  </h4>
                  
                  {hasProductData ? (
                    <div className="space-y-3">
                      {invoiceType === "glasses" ? (
                        <div>
                          {!getValues("skipFrame") && getValues("frameBrand") && (
                            <div className="p-3 bg-white rounded-lg shadow-sm mb-2 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100 rounded-bl-full opacity-20"></div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-amber-700 flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> {t('frame')}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {getValues("frameBrand")} {getValues("frameModel")}
                                  </p>
                                </div>
                                <p className="font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-sm">
                                  {getValues("framePrice")?.toFixed(3)} KWD
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {getValues("lensType") && (
                            <div className="p-3 bg-white rounded-lg shadow-sm mb-2 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full opacity-20"></div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-blue-700 flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> {t('lensType')}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {getValues("lensType")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {getValues("coating") && (
                            <div className="p-3 bg-white rounded-lg shadow-sm mb-2 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 rounded-bl-full opacity-20"></div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-purple-700 flex items-center gap-1">
                                    <Paintbrush className="w-3 h-3" /> {t('coating')}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {getValues("coating")}
                                  </p>
                                </div>
                                <p className="font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md text-sm">
                                  {getValues("coatingPrice")?.toFixed(3)} KWD
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {getValues("thickness") && (
                            <div className="p-3 bg-white rounded-lg shadow-sm relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full opacity-20"></div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-green-700 flex items-center gap-1">
                                    <Ruler className="w-3 h-3" /> {t('thickness') || "Thickness"}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {getValues("thickness")}
                                  </p>
                                </div>
                                <p className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md text-sm">
                                  {getValues("thicknessPrice")?.toFixed(3)} KWD
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {(getValues("contactLensItems") || []).map((lens, index) => (
                            <div key={index} className="p-3 bg-white rounded-lg shadow-sm relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full opacity-20"></div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-green-700 flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> {lens.brand} {lens.type}
                                  </p>
                                  {lens.qty > 1 && (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {t('quantity')}: {lens.qty}
                                    </p>
                                  )}
                                </div>
                                <p className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md text-sm">
                                  {(lens.price * (lens.qty || 1)).toFixed(3)} KWD
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-white/80 rounded-lg text-center">
                      <Loader className="w-5 h-5 text-emerald-300 mx-auto mb-1 animate-spin" />
                      <p className="text-sm text-emerald-400">{t('waitingForProductData')}</p>
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-amber-700">
                    <DollarSign className="w-4 h-4 text-orange-500" />
                    <span className="border-b-2 border-amber-200 pb-1 w-full">{language === 'ar' ? "معلومات الدفع" : "Payment Information"}</span>
                  </h4>
                  
                  {hasProductData ? (
                    <div className="p-3 bg-white rounded-lg shadow-sm space-y-2">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-600">{t('subtotal')}</span>
                        <span className="font-medium">{(total + (getValues("discount") || 0)).toFixed(3)} KWD</span>
                      </div>
                      
                      {(getValues("discount") || 0) > 0 && (
                        <div className="flex justify-between items-center py-1 text-rose-600">
                          <span className="text-sm flex items-center gap-1">
                            <Calculator className="w-3 h-3" /> {t('discount')}
                          </span>
                          <span className="font-medium">-{(getValues("discount") || 0).toFixed(3)} KWD</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center py-2 border-t border-dashed border-amber-200">
                        <span className="font-medium text-gray-800">{t('total')}</span>
                        <span className="text-lg font-bold text-amber-600">{total.toFixed(3)} KWD</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-600">{t('deposit')}</span>
                        <span className="font-medium text-green-600">{(getValues("deposit") || 0).toFixed(3)} KWD</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-t border-dashed border-amber-200">
                        <span className="font-medium text-gray-800">{t('remaining')}</span>
                        <span className={`text-lg font-bold ${remaining <= 0 ? "text-green-600" : "text-amber-600"}`}>
                          {remaining.toFixed(3)} KWD
                        </span>
                      </div>
                      
                      {remaining <= 0 && (
                        <div className="mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-3 rounded-md flex items-center justify-center gap-2 shadow-sm">
                          <Check className="w-4 h-4" />
                          <span className="font-medium">{t('paidInFull')}</span>
                          <PartyPopper className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-white/80 rounded-lg text-center">
                      <MessageCircleDashed className="w-5 h-5 text-amber-300 mx-auto mb-1 animate-pulse" />
                      <p className="text-sm text-amber-400">{t('waitingForPaymentData')}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Sheet open={invoicePrintOpen} onOpenChange={setInvoicePrintOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto print:w-full print:max-w-none">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-4" />
              {t('invoice')}
            </SheetTitle>
            <SheetDescription>
              <Button onClick={handlePrintInvoice} className="mt-2">
                <Printer className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {t('print')}
              </Button>
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 print:mt-0">
            <ReceiptInvoice 
              invoice={previewInvoice}
              isPrintable={true}
            />
          </div>
          <SheetFooter className="print:hidden mt-4">
            <Button onClick={() => setInvoicePrintOpen(false)}>{t('close')}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      <Sheet open={workOrderPrintOpen} onOpenChange={setWorkOrderPrintOpen}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto print:w-full print:!px-1 print:max-w-none">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 hide-print">
              <FileText className="w-5 h-5" />
              {t('workOrder')}
            </SheetTitle>
            <SheetDescription>
              <Button onClick={handlePrintWorkOrder} className="mt-2">
                <Printer className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {t('print')}
              </Button>
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 print:mt-0">
            <WorkOrderPrint 
              invoice={previewInvoice}
              patientName={getValues("patientName") || ""}
              patientPhone={getValues("patientPhone") || ""}
              rx={getValues("rx")}
              lensType={getValues("lensType") || ""}
              coating={getValues("coating") || ""}
              thickness={getValues("thickness") || ""}
              frame={getValues("skipFrame") ? undefined : {
                brand: getValues("frameBrand") || "",
                model: getValues("frameModel") || "",
                color: getValues("frameColor") || "",
                size: getValues("frameSize") || "",
                price: getValues("framePrice") || 0
              }}
              contactLenses={getValues("contactLensItems") || []}
              contactLensRx={getValues("contactLensRx")}
            />
          </div>
          <SheetFooter className="print:hidden mt-4">
            <Button onClick={() => setWorkOrderPrintOpen(false)}>{t('close')}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export const CreateInvoice: React.FC = () => {
  return (
    <InvoiceFormProvider>
      <CreateInvoiceContent />
    </InvoiceFormProvider>
  );
};
