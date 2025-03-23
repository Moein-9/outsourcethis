
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { PatientSearchForm } from "./PatientSearchForm";
import { CompactLensSelector } from "./CompactLensSelector";
import { ContactLensSelector } from "./ContactLensSelector";
import { LensSelector } from "./LensSelector";
import { WorkOrderPrintSelector } from "./WorkOrderPrintSelector";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Users, 
  Glasses, 
  Calculator, 
  CreditCard, 
  Receipt, 
  ContactIcon, 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  Printer,
  Eye,
  CheckCircle2,
  CircleDollarSign
} from "lucide-react";

const CreateInvoice: React.FC = () => {
  const { t, language } = useLanguageStore();
  const isRtl = language === "ar";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addInvoice } = useInvoiceStore();

  // State for multi-step form
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Invoice state
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [productType, setProductType] = useState<"glasses" | "contactLenses">("glasses");
  const [invoiceState, setInvoiceState] = useState({
    // Patient Info
    patientId: "",
    patientName: "",
    patientPhone: "",
    
    // Product Info - Glasses
    lensType: "",
    lensPrice: 0,
    coating: "",
    coatingPrice: 0,
    frameBrand: "",
    frameModel: "",
    frameColor: "",
    frameSize: "",
    framePrice: 0,
    
    // Product Info - Contact Lenses
    contactLenses: [] as any[],
    contactLensTotal: 0,
    
    // Pricing
    discount: 0,
    deposit: 0,
    total: 0,
    
    // Payment
    paymentMethod: "cash",
    workOrderId: "",
    authNumber: "",
  });

  // Lens and rx state
  const [frameInfo, setFrameInfo] = useState<any>(null);
  const [lensInfo, setLensInfo] = useState<any>(null);
  const [prescription, setPrescription] = useState<any>(null);
  const [contactLensRx, setContactLensRx] = useState<any>(null);
  
  // Show order confirmation dialog
  const [showWorkOrderPrint, setShowWorkOrderPrint] = useState(false);
  const [newInvoiceId, setNewInvoiceId] = useState<string | null>(null);
  
  // Animation variants
  const pageVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  // Handle patient selection
  useEffect(() => {
    if (selectedPatient) {
      setInvoiceState(prev => ({
        ...prev,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        patientPhone: selectedPatient.phone,
      }));
    }
  }, [selectedPatient]);

  // Calculate totals
  useEffect(() => {
    if (productType === "glasses") {
      const framePrice = invoiceState.framePrice || 0;
      const lensPrice = invoiceState.lensPrice || 0;
      const coatingPrice = invoiceState.coatingPrice || 0;
      const discount = invoiceState.discount || 0;
      
      const subtotal = framePrice + lensPrice + coatingPrice;
      const total = Math.max(0, subtotal - discount);
      
      setInvoiceState(prev => ({
        ...prev,
        total: total,
      }));
    } else {
      // Contact lens calculation
      const contactLensTotal = invoiceState.contactLensTotal || 0;
      const discount = invoiceState.discount || 0;
      
      const total = Math.max(0, contactLensTotal - discount);
      
      setInvoiceState(prev => ({
        ...prev,
        total: total,
      }));
    }
  }, [
    invoiceState.framePrice,
    invoiceState.lensPrice,
    invoiceState.coatingPrice,
    invoiceState.discount,
    invoiceState.contactLensTotal,
    productType,
  ]);

  // Step navigation
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle save invoice
  const handleSaveInvoice = () => {
    try {
      if (!selectedPatient) {
        toast({
          title: t("error"),
          description: t("pleaseSelectPatient"),
          variant: "destructive",
        });
        return;
      }

      if (productType === "glasses") {
        if (!invoiceState.frameBrand || !invoiceState.lensType) {
          toast({
            title: t("error"),
            description: t("pleaseFillAllRequiredFields"),
            variant: "destructive",
          });
          return;
        }
      } else {
        if (!invoiceState.contactLenses.length) {
          toast({
            title: t("error"),
            description: t("pleaseAddContactLenses"),
            variant: "destructive",
          });
          return;
        }
      }

      const invoiceToSave = {
        patientId: invoiceState.patientId,
        patientName: invoiceState.patientName,
        patientPhone: invoiceState.patientPhone,
        lensType: invoiceState.lensType,
        lensPrice: invoiceState.lensPrice,
        coating: invoiceState.coating,
        coatingPrice: invoiceState.coatingPrice,
        frameBrand: invoiceState.frameBrand,
        frameModel: invoiceState.frameModel,
        frameColor: invoiceState.frameColor,
        frameSize: invoiceState.frameSize,
        framePrice: invoiceState.framePrice,
        discount: invoiceState.discount,
        deposit: invoiceState.deposit,
        total: invoiceState.total,
        paymentMethod: invoiceState.paymentMethod,
        authNumber: invoiceState.authNumber,
        workOrderId: invoiceState.workOrderId,
      };

      const newId = addInvoice(invoiceToSave);
      setNewInvoiceId(newId);
      
      // Show print dialog
      setShowWorkOrderPrint(true);
      
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast({
        title: t("error"),
        description: t("errorSavingInvoice"),
        variant: "destructive",
      });
    }
  };

  // Handle lens selection from LensSelector
  const handleLensSelection = (lens: any) => {
    setLensInfo(lens);
    setInvoiceState(prev => ({
      ...prev,
      lensType: lens.name,
      lensPrice: lens.price,
      coating: lens.coating?.name || "",
      coatingPrice: lens.coating?.price || 0,
    }));
  };

  // Handle frame selection
  const handleFrameSelection = (frame: any) => {
    setFrameInfo(frame);
    setInvoiceState(prev => ({
      ...prev,
      frameBrand: frame.brand,
      frameModel: frame.model,
      frameColor: frame.color,
      frameSize: frame.size,
      framePrice: frame.price,
    }));
  };

  // Handle prescription selection
  const handlePrescriptionSelection = (rx: any) => {
    setPrescription(rx);
  };

  // Handle contact lens selection
  const handleContactLensSelection = (lenses: any[], rx: any, total: number) => {
    setInvoiceState(prev => ({
      ...prev,
      contactLenses: lenses,
      contactLensTotal: total,
    }));
    setContactLensRx(rx);
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method: string) => {
    setInvoiceState(prev => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  // Handle auth number change
  const handleAuthNumberChange = (authNumber: string) => {
    setInvoiceState(prev => ({
      ...prev,
      authNumber,
    }));
  };

  // Handle discount change
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const discountValue = parseFloat(e.target.value) || 0;
    setInvoiceState(prev => ({
      ...prev,
      discount: discountValue,
    }));
  };

  // Handle deposit change
  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const depositValue = parseFloat(e.target.value) || 0;
    
    // Ensure deposit doesn't exceed total
    const depositAmount = Math.min(depositValue, invoiceState.total);
    
    setInvoiceState(prev => ({
      ...prev,
      deposit: depositAmount,
    }));
  };

  // Handle print completion
  const handlePrintComplete = (invoiceId: string) => {
    // Close the print dialog
    setShowWorkOrderPrint(false);
    
    // Reset form and navigate
    resetForm();
    
    // Navigate to dashboard
    navigate("/", { state: { section: "dashboard" } });
    
    // Show success toast
    toast({
      title: t("success"),
      description: t("invoiceCreatedSuccessfully"),
    });
  };

  // Reset form to initial state
  const resetForm = () => {
    setSelectedPatient(null);
    setInvoiceState({
      patientId: "",
      patientName: "",
      patientPhone: "",
      lensType: "",
      lensPrice: 0,
      coating: "",
      coatingPrice: 0,
      frameBrand: "",
      frameModel: "",
      frameColor: "",
      frameSize: "",
      framePrice: 0,
      contactLenses: [],
      contactLensTotal: 0,
      discount: 0,
      deposit: 0,
      total: 0,
      paymentMethod: "cash",
      workOrderId: "",
      authNumber: "",
    });
    setProductType("glasses");
    setFrameInfo(null);
    setLensInfo(null);
    setPrescription(null);
    setContactLensRx(null);
    setCurrentStep(1);
  };

  // Render step indicators
  const renderStepIndicators = () => {
    return (
      <div className="flex justify-center items-center mb-6 gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index} 
            className={`h-2.5 w-2.5 rounded-full ${
              currentStep > index 
                ? "bg-primary" 
                : currentStep === index + 1 
                  ? "bg-primary/80 ring-2 ring-primary/30" 
                  : "bg-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  // Step titles
  const stepTitles = [
    t("selectPatient"),
    t("selectProducts"),
    t("setPricing"),
    t("payment"),
  ];

  // Render step content based on current step
  const renderStepContent = () => {
    const direction = 1; // For animation direction
    
    return (
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full"
        >
          {currentStep === 1 && (
            <Card className="w-full shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/30 to-primary/10 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t("selectPatient")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <PatientSearchForm 
                  onPatientSelect={setSelectedPatient}
                  selectedPatient={selectedPatient}
                />
                
                {selectedPatient && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-green-800 dark:text-green-300">{selectedPatient.name}</h3>
                        <p className="text-sm text-green-600 dark:text-green-400">{selectedPatient.phone}</p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  </motion.div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end pt-4 pb-6">
                <Button 
                  onClick={goToNextStep}
                  disabled={!selectedPatient}
                  className={`${isRtl ? "flex-row-reverse" : ""}`}
                >
                  {t("continue")}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="w-full shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/30 to-primary/10 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Glasses className="h-5 w-5" />
                  {t("selectProducts")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs
                  defaultValue="glasses"
                  value={productType}
                  onValueChange={(value: "glasses" | "contactLenses") => setProductType(value)}
                  className="w-full"
                >
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="glasses" className="w-1/2">
                      <Glasses className="h-4 w-4 mr-2" />
                      {t("glasses")}
                    </TabsTrigger>
                    <TabsTrigger value="contactLenses" className="w-1/2">
                      <ContactIcon className="h-4 w-4 mr-2" />
                      {t("contactLenses")}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="glasses" className="space-y-4">
                    {/* Glasses selection form */}
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-2">{t("selectFrame")}</h3>
                      <CompactLensSelector
                        onSelect={handleFrameSelection}
                        lensType="frame"
                        selectedPatient={selectedPatient}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-2">{t("selectLens")}</h3>
                      <LensSelector
                        onSelect={handleLensSelection}
                        selectedPatient={selectedPatient}
                        onRxSelected={handlePrescriptionSelection}
                      />
                    </div>
                    
                    {(frameInfo || lensInfo) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30"
                      >
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">{t("selectedItems")}</h3>
                        
                        {frameInfo && (
                          <div className="mb-2">
                            <span className="text-xs text-blue-600 dark:text-blue-300">{t("frame")}:</span>
                            <p className="text-sm">
                              {frameInfo.brand} {frameInfo.model} ({frameInfo.color}) - {frameInfo.price} {t("sar")}
                            </p>
                          </div>
                        )}
                        
                        {lensInfo && (
                          <div>
                            <span className="text-xs text-blue-600 dark:text-blue-300">{t("lens")}:</span>
                            <p className="text-sm">
                              {lensInfo.name} - {lensInfo.price} {t("sar")}
                            </p>
                            
                            {lensInfo.coating && (
                              <p className="text-sm">
                                <span className="text-xs text-blue-600 dark:text-blue-300">{t("coating")}:</span>{" "}
                                {lensInfo.coating.name} - {lensInfo.coating.price} {t("sar")}
                              </p>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="contactLenses">
                    {/* Contact lenses selection form */}
                    <ContactLensSelector
                      onSelect={handleContactLensSelection}
                      selectedPatient={selectedPatient}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between pt-4 pb-6">
                <Button 
                  variant="outline" 
                  onClick={goToPreviousStep}
                  className={`${isRtl ? "flex-row-reverse" : ""}`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t("back")}
                </Button>
                <Button 
                  onClick={goToNextStep}
                  disabled={
                    (productType === "glasses" && (!frameInfo || !lensInfo)) ||
                    (productType === "contactLenses" && (!invoiceState.contactLenses.length))
                  }
                  className={`${isRtl ? "flex-row-reverse" : ""}`}
                >
                  {t("continue")}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="w-full shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/30 to-primary/10 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  {t("pricing")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Price breakdown */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">{t("priceBreakdown")}</h3>
                    
                    <div className="space-y-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      {productType === "glasses" ? (
                        <>
                          <div className="flex justify-between">
                            <span>{t("framePrice")}</span>
                            <span>{invoiceState.framePrice} {t("sar")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t("lensPrice")}</span>
                            <span>{invoiceState.lensPrice} {t("sar")}</span>
                          </div>
                          {invoiceState.coatingPrice > 0 && (
                            <div className="flex justify-between">
                              <span>{t("coating")}</span>
                              <span>{invoiceState.coatingPrice} {t("sar")}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span>{t("contactLensesTotal")}</span>
                            <span>{invoiceState.contactLensTotal} {t("sar")}</span>
                          </div>
                        </>
                      )}
                      
                      <Separator className="my-2" />
                      
                      <div className="flex justify-between">
                        <span>{t("subtotal")}</span>
                        <span>
                          {productType === "glasses" 
                            ? (invoiceState.framePrice + invoiceState.lensPrice + invoiceState.coatingPrice) 
                            : invoiceState.contactLensTotal} {t("sar")}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>{t("discount")}</span>
                        <div className="w-24">
                          <Input
                            type="number"
                            value={invoiceState.discount}
                            onChange={handleDiscountChange}
                            min="0"
                            step="0.01"
                            className="text-right h-8"
                          />
                        </div>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="flex justify-between font-medium text-lg">
                        <span>{t("total")}</span>
                        <span>{invoiceState.total} {t("sar")}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <span>{t("deposit")}</span>
                        <div className="w-24">
                          <Input
                            type="number"
                            value={invoiceState.deposit}
                            onChange={handleDepositChange}
                            min="0"
                            max={invoiceState.total}
                            step="0.01"
                            className="text-right h-8"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-1 text-sm text-muted-foreground">
                        <span>{t("remainingBalance")}</span>
                        <span>
                          {Math.max(0, invoiceState.total - invoiceState.deposit)} {t("sar")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4 pb-6">
                <Button 
                  variant="outline" 
                  onClick={goToPreviousStep}
                  className={`${isRtl ? "flex-row-reverse" : ""}`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t("back")}
                </Button>
                <Button 
                  onClick={goToNextStep}
                  className={`${isRtl ? "flex-row-reverse" : ""}`}
                >
                  {t("continue")}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 4 && (
            <Card className="w-full shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/30 to-primary/10 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {t("payment")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Payment summary */}
                  <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30">
                    <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">
                      {t("orderSummary")}
                    </h3>
                    <div className="space-y-1 text-sm text-green-700 dark:text-green-400">
                      <p>
                        <span className="inline-block w-32">{t("patient")}: </span>
                        {invoiceState.patientName}
                      </p>
                      <p>
                        <span className="inline-block w-32">{t("productType")}: </span>
                        {productType === "glasses" ? t("glasses") : t("contactLenses")}
                      </p>
                      <p>
                        <span className="inline-block w-32">{t("totalAmount")}: </span>
                        {invoiceState.total} {t("sar")}
                      </p>
                      <p>
                        <span className="inline-block w-32">{t("deposit")}: </span>
                        {invoiceState.deposit} {t("sar")}
                      </p>
                      <p>
                        <span className="inline-block w-32">{t("remainingBalance")}: </span>
                        {Math.max(0, invoiceState.total - invoiceState.deposit)} {t("sar")}
                      </p>
                    </div>
                  </div>
                  
                  {/* Payment method selection */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">{t("paymentMethod")}</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="payment-cash"
                          name="paymentMethod"
                          value="cash"
                          checked={invoiceState.paymentMethod === "cash"}
                          onChange={() => handlePaymentMethodChange("cash")}
                          className="h-4 w-4 text-primary"
                        />
                        <Label htmlFor="payment-cash" className="cursor-pointer">
                          {t("cash")}
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="payment-card"
                          name="paymentMethod"
                          value="card"
                          checked={invoiceState.paymentMethod === "card"}
                          onChange={() => handlePaymentMethodChange("card")}
                          className="h-4 w-4 text-primary"
                        />
                        <Label htmlFor="payment-card" className="cursor-pointer">
                          {t("card")}
                        </Label>
                      </div>
                      
                      {invoiceState.paymentMethod === "card" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-6 mt-2"
                        >
                          <Label htmlFor="authNumber" className="text-sm">
                            {t("authorizationNumber")}
                          </Label>
                          <Input
                            id="authNumber"
                            type="text"
                            value={invoiceState.authNumber}
                            onChange={(e) => handleAuthNumberChange(e.target.value)}
                            placeholder={t("enterAuthorizationNumber")}
                            className="mt-1"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4 pb-6">
                <Button 
                  variant="outline" 
                  onClick={goToPreviousStep}
                  className={`${isRtl ? "flex-row-reverse" : ""}`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t("back")}
                </Button>
                <Button 
                  onClick={handleSaveInvoice}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {t("saveAndPrint")}
                </Button>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h1 className="text-2xl font-bold text-center">{t("createInvoice")}</h1>
          <Sparkles className="h-5 w-5 text-amber-500" />
        </div>
        
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {t("createInvoiceDescription")}
        </p>
        
        {/* Step indicators */}
        <div className="w-full max-w-md">
          <div className="relative mb-8">
            {/* Progress bar */}
            <div className="h-1 w-full bg-muted rounded-full">
              <div 
                className="h-1 bg-primary rounded-full transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>
            
            {/* Step labels */}
            <div className="flex justify-between mt-2">
              {stepTitles.map((title, index) => (
                <div 
                  key={index}
                  className={`text-xs ${
                    currentStep > index + 1 
                      ? "text-primary font-medium" 
                      : currentStep === index + 1 
                        ? "text-primary" 
                        : "text-muted-foreground"
                  }`}
                >
                  {title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Step content */}
      <div className="w-full">
        {renderStepContent()}
      </div>
      
      {/* Work order print dialog */}
      {showWorkOrderPrint && newInvoiceId && (
        <WorkOrderPrintSelector
          invoice={{
            invoiceId: newInvoiceId,
            patientId: invoiceState.patientId,
            patientName: invoiceState.patientName,
            patientPhone: invoiceState.patientPhone,
            lensType: invoiceState.lensType,
            lensPrice: invoiceState.lensPrice,
            coating: invoiceState.coating,
            coatingPrice: invoiceState.coatingPrice,
            frameBrand: invoiceState.frameBrand,
            frameModel: invoiceState.frameModel,
            frameColor: invoiceState.frameColor,
            frameSize: invoiceState.frameSize,
            framePrice: invoiceState.framePrice,
            discount: invoiceState.discount,
            deposit: invoiceState.deposit,
            total: invoiceState.total,
            remaining: Math.max(0, invoiceState.total - invoiceState.deposit),
            paymentMethod: invoiceState.paymentMethod,
            workOrderId: invoiceState.workOrderId,
            createdAt: new Date().toISOString(),
            isPaid: invoiceState.deposit >= invoiceState.total,
            authNumber: invoiceState.authNumber,
          }}
          patientName={invoiceState.patientName}
          patientPhone={invoiceState.patientPhone}
          rx={prescription}
          lensType={invoiceState.lensType}
          coating={invoiceState.coating}
          frame={frameInfo}
          contactLenses={invoiceState.contactLenses}
          contactLensRx={contactLensRx}
          isOpen={showWorkOrderPrint}
          onOpenChange={setShowWorkOrderPrint}
          isNewInvoice={false}
          onInvoiceSaved={handlePrintComplete}
        />
      )}
    </div>
  );
};

export default CreateInvoice;
