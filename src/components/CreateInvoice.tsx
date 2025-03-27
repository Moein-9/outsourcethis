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
import { PaintBrush } from "lucide-react";
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
    lensPrice: 0,
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
    ? (getValues("coating") || getValues("thickness") || (!getValues("skipFrame") && !!getValues("frameBrand")))
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
                                    <PaintBrush className="w-3 h-3" /> {t('coating')}
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
                                  <p className="text-sm text-gray-600 mt-1">
                                    {lens.bc} | {lens.diameter} | {lens.power}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md text-sm">
                                    {lens.price.toFixed(3)} KWD
                                  </p>
                                  <p className="text-xs mt-1 text-muted-foreground">{t('qty')}: {lens.qty || 1}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {getValues("discount") > 0 && (
                        <div className="p-3 bg-white rounded-lg shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-bl-full opacity-20"></div>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-red-700 flex items-center gap-1">
                                <Tag className="w-3 h-3" /> {t('discount')}
                              </p>
                            </div>
                            <p className="font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md text-sm">
                              - {getValues("discount")?.toFixed(3)} KWD
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-white/80 rounded-lg text-center">
                      <MessageCircleDashed className="w-5 h-5 text-teal-300 mx-auto mb-1 animate-pulse" />
                      <p className="text-sm text-teal-400">{t('waitingForProductData')}</p>
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-amber-700">
                    <Calculator className="w-4 h-4 text-amber-500" />
                    <span className="border-b-2 border-amber-200 pb-1 w-full">{t('paymentSummary')}</span>
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2">
                      <span className="text-amber-700">{t('total')}:</span>
                      <span className="font-semibold">{total.toFixed(3)} KWD</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="text-amber-700">{t('deposit')}:</span>
                      <span className="font-semibold">{(getValues<number>('deposit') || 0).toFixed(3)} KWD</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 bg-amber-100/50 rounded-lg">
                      <span className="font-medium text-amber-800">{t('remaining')}:</span>
                      <span className="font-bold text-amber-800">{remaining.toFixed(3)} KWD</span>
                    </div>
                    
                    {getValues("paymentMethod") && (
                      <div className="p-2 mt-2 bg-white rounded-lg">
                        <p className="text-sm text-muted-foreground">{t('paymentMethod')}: <span className="font-medium text-amber-700">{getValues("paymentMethod")}</span></p>
                        {getValues("authNumber") && (
                          <p className="text-xs text-muted-foreground mt-1">{t('authNumber')}: {getValues("authNumber")}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Sheet open={invoicePrintOpen} onOpenChange={setInvoicePrintOpen}>
        <SheetContent side="bottom" className="h-screen max-w-full p-0 print:p-0 print:shadow-none print:border-none bg-white">
          <ReceiptInvoice invoice={previewInvoice} />
        </SheetContent>
      </Sheet>
      
      <Sheet open={workOrderPrintOpen} onOpenChange={setWorkOrderPrintOpen}>
        <SheetContent side="bottom" className="h-screen max-w-full p-0 print:p-0 print:shadow-none print:border-none bg-white">
          <WorkOrderPrint invoice={previewInvoice} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export { CreateInvoice };
