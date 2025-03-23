
import React, { useState } from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { 
  FileText, Printer, Receipt, Save, User, PackageCheck, CreditCard, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  const { getValues, setValue } = useInvoiceForm();
  
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
    invoiceId: getValues("workOrderId") || "PREVIEW",
    createdAt: new Date().toISOString(),
    patientName: getValues("patientName") || "Customer Name",
    patientPhone: getValues("patientPhone") || "",
    patientId: getValues("patientId"),
    lensType: getValues("lensType") || "",
    lensPrice: getValues("lensPrice") || 0,
    coating: getValues("coating") || "",
    coatingPrice: getValues("coatingPrice") || 0,
    frameBrand: getValues("frameBrand") || "",
    frameModel: getValues("frameModel") || "",
    frameColor: getValues("frameColor") || "",
    framePrice: getValues("framePrice") || 0,
    discount: getValues("discount") || 0,
    deposit: getValues("deposit") || 0,
    total: getValues("total") || 0,
    remaining: getValues("remaining") || 0,
    paymentMethod: getValues("paymentMethod") || "Cash",
    isPaid: (getValues("remaining") || 0) <= 0,
    authNumber: getValues("authNumber") || ""
  };

  const calculateTotal = () => {
    const lensPrice = getValues("lensPrice") || 0;
    const coatingPrice = getValues("coatingPrice") || 0;
    const framePrice = getValues("skipFrame") ? 0 : (getValues("framePrice") || 0);
    const discount = getValues("discount") || 0;
    
    const contactLensItems = getValues("contactLensItems") || [];
    const contactLensTotal = contactLensItems.reduce((sum, lens) => sum + (lens.price || 0), 0);
    
    if (invoiceType === "glasses") {
      return Math.max(0, lensPrice + coatingPrice + framePrice - discount);
    } else {
      return Math.max(0, contactLensTotal - discount);
    }
  };

  const calculateRemaining = () => {
    const total = calculateTotal();
    const deposit = getValues("deposit") || 0;
    return Math.max(0, total - deposit);
  };

  const handleSaveInvoice = () => {
    const formData = getValues();
    const invoiceData = {
      patientId: formData.patientId,
      patientName: formData.patientName,
      patientPhone: formData.patientPhone,
      
      lensType: formData.lensType,
      lensPrice: formData.lensPrice,
      
      coating: formData.coating,
      coatingPrice: formData.coatingPrice,
      
      frameBrand: formData.frameBrand,
      frameModel: formData.frameModel,
      frameColor: formData.frameColor,
      framePrice: formData.framePrice,
      
      discount: formData.discount,
      deposit: formData.deposit,
      total: formData.total,
      
      paymentMethod: formData.paymentMethod,
      authNumber: formData.authNumber
    };
    
    const invoiceId = addInvoice(invoiceData);
    setValue("workOrderId", invoiceId);
    
    toast({
      title: t('success'),
      description: `${t('invoiceSavedSuccess')} ${invoiceId}.`,
    });
    
    setActiveTab("summary");
  };

  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';

  const total = calculateTotal();
  const remaining = calculateRemaining();

  return (
    <div className="py-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold flex items-center gap-2 ${textAlignClass}`}>
          <FileText className="w-6 h-6 text-primary" />
          {t('invoiceTitle')}
        </h2>
        
        <div className="flex items-center space-x-3">
          <Button onClick={handleSaveInvoice} variant="outline" className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {t('saveInvoice')}
          </Button>
          
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
                      <Button 
                        onClick={handleSaveInvoice} 
                        className="flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {t('saveInvoice')}
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
                    />
                    
                    <div className="flex justify-between mt-4">
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
                          // Reset form state and go back to patient step
                          setActiveTab("patient");
                        }} 
                        className="flex items-center gap-2"
                      >
                        {t('newInvoice')}
                      </Button>
                    </div>
                  </motion.div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
        
        <div className="col-span-1">
          <Card className="border border-muted-foreground/10 shadow-md h-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                {t('invoiceSummary')}
              </h3>
              
              <div className="space-y-4">
                {/* Patient Information */}
                <div className="p-3 bg-muted/30 rounded-md">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {t('clientInformation')}
                  </h4>
                  <p className="text-sm">{getValues("patientName") || t('noClientSelected')}</p>
                  {getValues("patientPhone") && (
                    <p className="text-sm text-muted-foreground">{getValues("patientPhone")}</p>
                  )}
                </div>
                
                {/* Products Information */}
                <div className="p-3 bg-muted/30 rounded-md">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                    <PackageCheck className="w-3.5 h-3.5" />
                    {t('productsInformation')}
                  </h4>
                  
                  {invoiceType === "glasses" ? (
                    <div className="space-y-2 text-sm">
                      {/* Frame Information */}
                      {!getValues("skipFrame") && getValues("frameBrand") && (
                        <div>
                          <p className="font-medium">{t('frame')}</p>
                          <p className="text-muted-foreground">
                            {getValues("frameBrand")} {getValues("frameModel")}
                          </p>
                          <p className="font-medium text-right">{getValues("framePrice")?.toFixed(3)} KWD</p>
                        </div>
                      )}
                      
                      {/* Lens Information */}
                      {getValues("lensType") && (
                        <div>
                          <p className="font-medium">{t('lensType')}</p>
                          <p className="text-muted-foreground">{getValues("lensType")}</p>
                          <p className="font-medium text-right">{getValues("lensPrice")?.toFixed(3)} KWD</p>
                        </div>
                      )}
                      
                      {/* Coating Information */}
                      {getValues("coating") && (
                        <div>
                          <p className="font-medium">{t('coating')}</p>
                          <p className="text-muted-foreground">{getValues("coating")}</p>
                          <p className="font-medium text-right">{getValues("coatingPrice")?.toFixed(3)} KWD</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      {/* Contact Lens Information */}
                      {(getValues("contactLensItems") || []).map((lens, index) => (
                        <div key={index}>
                          <p className="font-medium">{lens.brand} {lens.type}</p>
                          <p className="text-muted-foreground">{lens.power}</p>
                          <p className="font-medium text-right">{lens.price?.toFixed(3)} KWD</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Show message if no products selected */}
                  {invoiceType === "glasses" && 
                   !getValues("lensType") && 
                   (getValues("skipFrame") || !getValues("frameBrand")) && (
                    <p className="text-sm text-muted-foreground">{t('noProductsSelected')}</p>
                  )}
                  
                  {invoiceType === "contacts" && 
                   (!getValues("contactLensItems") || getValues("contactLensItems").length === 0) && (
                    <p className="text-sm text-muted-foreground">{t('noProductsSelected')}</p>
                  )}
                </div>
                
                {/* Payment Information */}
                <div className="p-3 bg-muted/30 rounded-md">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    {t('paymentInformation')}
                  </h4>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>{t('subtotal')}</span>
                      <span>{(total + (getValues("discount") || 0)).toFixed(3)} KWD</span>
                    </div>
                    
                    {(getValues("discount") || 0) > 0 && (
                      <div className="flex justify-between">
                        <span>{t('discount')}</span>
                        <span>-{(getValues("discount") || 0).toFixed(3)} KWD</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-medium border-t pt-1 mt-1">
                      <span>{t('total')}</span>
                      <span>{total.toFixed(3)} KWD</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>{t('deposit')}</span>
                      <span>{(getValues("deposit") || 0).toFixed(3)} KWD</span>
                    </div>
                    
                    <div className="flex justify-between font-medium border-t pt-1 mt-1">
                      <span>{t('remaining')}</span>
                      <span className={remaining <= 0 ? "text-green-600" : "text-amber-600"}>
                        {remaining.toFixed(3)} KWD
                      </span>
                    </div>
                    
                    {remaining <= 0 && (
                      <div className="flex items-center justify-center gap-1.5 bg-green-50 text-green-700 py-1 px-2 rounded-md mt-2">
                        <Check className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{t('paidInFull')}</span>
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
              frame={getValues("skipFrame") ? undefined : {
                brand: getValues("frameBrand") || "",
                model: getValues("frameModel") || "",
                color: getValues("frameColor") || "",
                size: getValues("frameSize") || "",
                price: getValues("framePrice") || 0
              }}
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

const CreateInvoice: React.FC = () => {
  return (
    <InvoiceFormProvider>
      <CreateInvoiceContent />
    </InvoiceFormProvider>
  );
};

export default CreateInvoice;
