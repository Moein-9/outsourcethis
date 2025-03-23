
import React, { useState, useEffect } from "react";
import { usePatientStore } from "@/store/patientStore";
import { useInventoryStore, LensType, LensCoating } from "@/store/inventoryStore";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactLensSelector, ContactLensItem, ContactLensSelection } from "@/components/ContactLensSelector";
import { ContactLensForm } from "@/components/ContactLensForm";
import { LensSelector } from "@/components/LensSelector";
import { ReceiptInvoice } from "@/components/ReceiptInvoice";
import { WorkOrderPrintSelector } from "@/components/WorkOrderPrintSelector";
import { CustomPrintService } from "@/utils/CustomPrintService";
import { motion } from "framer-motion";
import { 
  User, Glasses, Package, FileText, CreditCard, Eye, Search, 
  Banknote, Plus, PackageCheck, EyeOff, ExternalLink,
  ClipboardCheck, BadgePercent, Printer, CreditCard as CardIcon,
  Receipt, Save, Check, CircleCheck, BadgeDollarSign, Smile,
  ListTodo, Calculator, DollarSign, ShoppingCart, CircleX, RefreshCw
} from "lucide-react";

const CreateInvoice: React.FC = () => {
  const { t, language } = useLanguageStore();
  const searchPatients = usePatientStore((state) => state.searchPatients);
  const searchFrames = useInventoryStore((state) => state.searchFrames);
  const addFrame = useInventoryStore((state) => state.addFrame);
  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  
  const [invoiceType, setInvoiceType] = useState<"glasses" | "contacts">("glasses");
  const [activeStep, setActiveStep] = useState<"patient" | "product" | "payment" | "complete">("patient");
  
  const [skipPatient, setSkipPatient] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const [patientResults, setPatientResults] = useState<ReturnType<typeof searchPatients>>([]);
  const [currentPatient, setCurrentPatient] = useState<ReturnType<typeof searchPatients>[0] | null>(null);
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [rxVisible, setRxVisible] = useState(false);
  
  const [skipFrame, setSkipFrame] = useState(false);
  const [selectedLensType, setSelectedLensType] = useState<LensType | null>(null);
  const [selectedCoating, setSelectedCoating] = useState<LensCoating | null>(null);
  
  const [frameSearch, setFrameSearch] = useState("");
  const [frameResults, setFrameResults] = useState<ReturnType<typeof searchFrames>>([]);
  const [selectedFrame, setSelectedFrame] = useState<{
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  }>({ brand: "", model: "", color: "", size: "", price: 0 });
  
  const [showManualFrame, setShowManualFrame] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newQty, setNewQty] = useState("1");
  
  const [discount, setDiscount] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [authNumber, setAuthNumber] = useState("");
  
  const [invoicePrintOpen, setInvoicePrintOpen] = useState(false);
  const [workOrderPrintOpen, setWorkOrderPrintOpen] = useState(false);
  
  const [contactLensItems, setContactLensItems] = useState<ContactLensItem[]>([]);
  
  const [contactLensRx, setContactLensRx] = useState({
    rightEye: {
      sphere: "-",
      cylinder: "-",
      axis: "-",
      bc: "-",
      dia: "14.2"
    },
    leftEye: {
      sphere: "-",
      cylinder: "-",
      axis: "-",
      bc: "-",
      dia: "14.2"
    }
  });
  
  const [showMissingRxWarning, setShowMissingRxWarning] = useState(false);
  
  const [savedInvoiceId, setSavedInvoiceId] = useState<string | null>(null);
  const [savedWorkOrderId, setSavedWorkOrderId] = useState<string | null>(null);
  const [showSavedDetails, setShowSavedDetails] = useState(false);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  useEffect(() => {
    if (invoiceType === "glasses") {
      const lensPrice = selectedLensType?.price || 0;
      const coatingPrice = selectedCoating?.price || 0;
      const frameCost = skipFrame ? 0 : selectedFrame.price;
      const totalCost = lensPrice + coatingPrice + frameCost - discount;
      const calculatedTotal = totalCost > 0 ? totalCost : 0;
      const calculatedRemaining = Math.max(0, calculatedTotal - deposit);
      
      setFrameTotal(frameCost);
      setTotal(calculatedTotal);
      setRemaining(calculatedRemaining);
    } else {
      const lensesTotal = contactLensItems.reduce((sum, lens) => sum + lens.price, 0);
      const calculatedTotal = Math.max(0, lensesTotal - discount);
      const calculatedRemaining = Math.max(0, calculatedTotal - deposit);
      
      setTotal(calculatedTotal);
      setRemaining(calculatedRemaining);
    }
  }, [
    invoiceType,
    selectedLensType, 
    selectedCoating, 
    selectedFrame.price, 
    skipFrame, 
    discount, 
    deposit,
    contactLensItems
  ]);
  
  const [frameTotal, setFrameTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);
  
  const handlePatientSearch = () => {
    if (!patientSearch.trim()) {
      toast({
        title: t('error'),
        description: t('phoneSearchError'),
        variant: "destructive"
      });
      return;
    }
    
    const results = searchPatients(patientSearch);
    setPatientResults(results);
    
    if (results.length === 0) {
      toast({
        description: t('noClientsFound'),
      });
    }
  };
  
  const handleFrameSearch = () => {
    if (!frameSearch.trim()) {
      toast({
        title: t('error'),
        description: t('searchTermError'),
        variant: "destructive"
      });
      return;
    }
    
    const results = searchFrames(frameSearch);
    setFrameResults(results);
    
    if (results.length === 0) {
      toast({
        description: t('noFramesFound'),
      });
    }
  };
  
  const selectPatient = (patient: ReturnType<typeof searchPatients>[0]) => {
    setCurrentPatient(patient);
    setPatientResults([]);
    setRxVisible(true);
    
    if (invoiceType === "contacts") {
      if (patient.contactLensRx) {
        setContactLensRx(patient.contactLensRx);
        setShowMissingRxWarning(false);
      } else {
        setShowMissingRxWarning(true);
      }
    }
  };
  
  const selectFrame = (frame: ReturnType<typeof searchFrames>[0]) => {
    setSelectedFrame({
      brand: frame.brand,
      model: frame.model,
      color: frame.color,
      size: frame.size,
      price: frame.price
    });
    setFrameResults([]);
  };
  
  const handleLensTypeSelect = (lens: LensType | null) => {
    setSelectedLensType(lens);
  };
  
  const handleCoatingSelect = (coating: LensCoating | null) => {
    setSelectedCoating(coating);
  };
  
  const handleSkipFrameChange = (skip: boolean) => {
    setSkipFrame(skip);
  };
  
  const handleAddNewFrame = () => {
    if (!newBrand || !newModel || !newColor || !newPrice) {
      toast({
        title: t('error'),
        description: t('frameDetailsError'),
        variant: "destructive"
      });
      return;
    }
    
    const price = parseFloat(newPrice);
    const qty = parseInt(newQty);
    
    if (isNaN(price) || price <= 0) {
      toast({
        title: t('error'),
        description: t('priceError'),
        variant: "destructive"
      });
      return;
    }
    
    if (isNaN(qty) || qty <= 0) {
      toast({
        title: t('error'),
        description: t('quantityError'),
        variant: "destructive"
      });
      return;
    }
    
    addFrame({
      brand: newBrand,
      model: newModel,
      color: newColor,
      size: newSize,
      price,
      qty
    });
    
    setSelectedFrame({
      brand: newBrand,
      model: newModel,
      color: newColor,
      size: newSize,
      price
    });
    
    setShowManualFrame(false);
    setNewBrand("");
    setNewModel("");
    setNewColor("");
    setNewSize("");
    setNewPrice("");
    setNewQty("1");
    
    toast({
      description: t('frameAddedSuccess'),
    });
  };
  
  const handlePayInFull = () => {
    setDeposit(total);
  };
  
  const handleContactLensRxChange = (rxData: typeof contactLensRx) => {
    setContactLensRx(rxData);
  };
  
  const handleContactLensSelection = (selection: ContactLensSelection) => {
    if (selection.items) {
      setContactLensItems(selection.items);
    }
    
    if (selection.rxData) {
      setContactLensRx(selection.rxData);
    }
  };
  
  const handleSaveInvoice = () => {
    let patientName = "";
    let patientPhone = "";
    let patientId = undefined;
    
    if (skipPatient) {
      patientName = manualName;
      patientPhone = manualPhone;
    } else if (currentPatient) {
      patientName = currentPatient.name;
      patientPhone = currentPatient.phone;
      patientId = currentPatient.patientId;
    } else {
      toast({
        title: t('error'),
        description: t('clientSelectionError'),
        variant: "destructive"
      });
      return;
    }
    
    if (invoiceType === "glasses") {
      if (!selectedLensType && !skipFrame) {
        toast({
          title: t('error'),
          description: t('lensSelectionError'),
          variant: "destructive"
        });
        return;
      }
      
      if (!skipFrame && (!selectedFrame.brand || !selectedFrame.model)) {
        toast({
          title: t('error'),
          description: t('frameSelectionError'),
          variant: "destructive"
        });
        return;
      }
    } else {
      if (contactLensItems.length === 0) {
        toast({
          title: t('error'),
          description: t('contactLensSelectionError'),
          variant: "destructive"
        });
        return;
      }
    }
    
    if (!paymentMethod) {
      toast({
        title: t('error'),
        description: t('paymentMethodError'),
        variant: "destructive"
      });
      return;
    }
    
    const paymentDetails = (paymentMethod === "Visa" || paymentMethod === "MasterCard" || paymentMethod === "كي نت" || paymentMethod === "KNET") 
      ? { authNumber } 
      : {};
    
    let invoiceData;
    
    if (invoiceType === "glasses") {
      invoiceData = {
        patientId,
        patientName,
        patientPhone,
        
        lensType: selectedLensType?.name || "",
        lensPrice: selectedLensType?.price || 0,
        
        coating: selectedCoating?.name || "",
        coatingPrice: selectedCoating?.price || 0,
        
        frameBrand: skipFrame ? "" : selectedFrame.brand,
        frameModel: skipFrame ? "" : selectedFrame.model,
        frameColor: skipFrame ? "" : selectedFrame.color,
        framePrice: skipFrame ? 0 : selectedFrame.price,
        
        discount,
        deposit,
        total,
        
        paymentMethod,
        ...paymentDetails
      };
    } else {
      const lensDescription = contactLensItems
        .map(lens => `${lens.brand} ${lens.type} ${lens.power} ${lens.color || ""}`)
        .join(", ");
      
      invoiceData = {
        patientId,
        patientName,
        patientPhone,
        
        lensType: lensDescription,
        lensPrice: contactLensItems.reduce((sum, lens) => sum + lens.price, 0),
        
        coating: "",
        coatingPrice: 0,
        
        frameBrand: "",
        frameModel: "",
        frameColor: "",
        framePrice: 0,
        
        discount,
        deposit,
        total,
        
        paymentMethod,
        ...paymentDetails
      };
    }
    
    // Generate a unique work order ID
    const workOrderId = `WO${Date.now()}`;
    invoiceData.workOrderId = workOrderId;
    
    const invoiceId = addInvoice(invoiceData);
    
    setSavedInvoiceId(invoiceId);
    setSavedWorkOrderId(workOrderId);
    setShowSavedDetails(true);
    setActiveStep("complete");
    
    toast({
      title: t('success'),
      description: `${t('invoiceSavedSuccess')} ${invoiceId}`,
    });
  };
  
  const handlePrintInvoice = () => {
    if (!savedInvoiceId) {
      toast({
        title: t('error'),
        description: t('saveInvoiceFirst'),
        variant: "destructive",
      });
      return;
    }
    
    setInvoicePrintOpen(true);
    setTimeout(() => {
      window.print();
      toast({
        description: t('invoicePrinted'),
      });
    }, 500);
  };
  
  const handlePrintWorkOrder = () => {
    if (!savedInvoiceId) {
      toast({
        title: t('error'),
        description: t('saveInvoiceFirst'),
        variant: "destructive",
      });
      return;
    }
    
    setWorkOrderPrintOpen(true);
  };
  
  const handleCompleteTransaction = () => {
    resetForm();
    setSavedInvoiceId(null);
    setSavedWorkOrderId(null);
    setShowSavedDetails(false);
    setActiveStep("patient");
    
    toast({
      description: t('transactionCompleted'),
    });
  };
  
  const resetForm = () => {
    setSkipPatient(false);
    setPatientSearch("");
    setPatientResults([]);
    setCurrentPatient(null);
    setManualName("");
    setManualPhone("");
    setRxVisible(false);
    
    setSkipFrame(false);
    setSelectedLensType(null);
    setSelectedCoating(null);
    
    setFrameSearch("");
    setFrameResults([]);
    setSelectedFrame({ brand: "", model: "", color: "", size: "", price: 0 });
    
    setShowManualFrame(false);
    setNewBrand("");
    setNewModel("");
    setNewColor("");
    setNewSize("");
    setNewPrice("");
    setNewQty("1");
    
    setDiscount(0);
    setDeposit(0);
    setPaymentMethod("");
    setAuthNumber("");
    
    setContactLensRx({
      rightEye: {
        sphere: "-",
        cylinder: "-",
        axis: "-",
        bc: "-",
        dia: "14.2"
      },
      leftEye: {
        sphere: "-",
        cylinder: "-",
        axis: "-",
        bc: "-",
        dia: "14.2"
      }
    });
    
    setShowMissingRxWarning(false);
  };
  
  const previewInvoice = {
    invoiceId: savedInvoiceId || "PREVIEW",
    workOrderId: savedWorkOrderId || `WO${Date.now()}`,
    createdAt: new Date().toISOString(),
    patientName: currentPatient?.name || manualName || "Customer Name",
    patientPhone: currentPatient?.phone || manualPhone || "",
    patientId: currentPatient?.patientId,
    lensType: invoiceType === "glasses"
      ? (selectedLensType?.name || "")
      : (contactLensItems.length > 0 
          ? contactLensItems.map(lens => `${lens.brand} ${lens.type}`).join(", ")
          : ""),
    lensPrice: invoiceType === "glasses"
      ? (selectedLensType?.price || 0)
      : contactLensItems.reduce((sum, lens) => sum + lens.price, 0),
    coating: invoiceType === "glasses" ? (selectedCoating?.name || "") : "",
    coatingPrice: invoiceType === "glasses" ? (selectedCoating?.price || 0) : 0,
    frameBrand: invoiceType === "glasses" ? (skipFrame ? "" : selectedFrame.brand) : "",
    frameModel: invoiceType === "glasses" ? (skipFrame ? "" : selectedFrame.model) : "",
    frameColor: invoiceType === "glasses" ? (skipFrame ? "" : selectedFrame.color) : "",
    framePrice: invoiceType === "glasses" ? (skipFrame ? 0 : selectedFrame.price) : 0,
    discount: discount,
    deposit: deposit,
    total: total,
    remaining: remaining,
    paymentMethod: paymentMethod || "Cash",
    isPaid: remaining <= 0,
    authNumber: authNumber
  };
  
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  
  const renderStepIndicator = () => {
    const steps = [
      { id: "patient", icon: <User />, name: t('client') },
      { id: "product", icon: invoiceType === "glasses" ? <Glasses /> : <Eye />, name: invoiceType === "glasses" ? t('glasses') : t('contacts') },
      { id: "payment", icon: <CreditCard />, name: t('payment') },
      { id: "complete", icon: <Check />, name: t('complete') }
    ];
    
    return (
      <div className="flex justify-between mb-8 relative z-10 px-2">
        <div className="absolute h-1 bg-muted top-1/2 left-0 right-0 -z-10 transform -translate-y-1/2" />
        
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`flex flex-col items-center ${activeStep === step.id ? 'opacity-100' : 'opacity-60'}`}
          >
            <div 
              className={`rounded-full w-10 h-10 flex items-center justify-center mb-1 ${
                activeStep === step.id 
                  ? 'bg-primary text-primary-foreground' 
                  : index < steps.findIndex(s => s.id === activeStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {index < steps.findIndex(s => s.id === activeStep) ? (
                <Check className="h-5 w-5" />
              ) : (
                <div className="h-5 w-5 flex items-center justify-center">
                  {step.icon}
                </div>
              )}
            </div>
            <span className="text-xs font-medium">
              {step.name}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  const goToNextStep = () => {
    if (activeStep === "patient") {
      if (!skipPatient && !currentPatient) {
        toast({
          title: t('error'),
          description: t('clientSelectionError'),
          variant: "destructive"
        });
        return;
      }
      setActiveStep("product");
    } else if (activeStep === "product") {
      if (invoiceType === "glasses") {
        if (!selectedLensType && !skipFrame) {
          toast({
            title: t('error'),
            description: t('lensSelectionError'),
            variant: "destructive"
          });
          return;
        }
        
        if (!skipFrame && (!selectedFrame.brand || !selectedFrame.model)) {
          toast({
            title: t('error'),
            description: t('frameSelectionError'),
            variant: "destructive"
          });
          return;
        }
      } else {
        if (contactLensItems.length === 0) {
          toast({
            title: t('error'),
            description: t('contactLensSelectionError'),
            variant: "destructive"
          });
          return;
        }
      }
      setActiveStep("payment");
    }
  };
  
  const goToPreviousStep = () => {
    if (activeStep === "product") {
      setActiveStep("patient");
    } else if (activeStep === "payment") {
      setActiveStep("product");
    }
  };
  
  return (
    <div className="py-6 px-4 max-w-7xl mx-auto">
      <motion.div 
        className="mb-8 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={`text-2xl font-bold flex items-center gap-2 ${textAlignClass}`}>
          <FileText className="w-7 h-7 text-primary" />
          {t('invoiceTitle')}
        </h2>
        
        <Tabs 
          value={invoiceType} 
          onValueChange={(v) => {
            setInvoiceType(v as "glasses" | "contacts");
            // Reset product-specific selections
            if (v === "glasses") {
              setContactLensItems([]);
            } else {
              setSelectedLensType(null);
              setSelectedCoating(null);
              setSelectedFrame({ brand: "", model: "", color: "", size: "", price: 0 });
              setSkipFrame(false);
            }
          }}
          className="w-auto"
        >
          <TabsList className="p-1 bg-primary/10 border border-primary/20 rounded-full shadow-sm text-base">
            <TabsTrigger 
              value="glasses" 
              className="flex items-center gap-2 px-5 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300"
            >
              <Glasses className="w-5 h-5" />
              {t('glasses')}
            </TabsTrigger>
            <TabsTrigger 
              value="contacts" 
              className="flex items-center gap-2 px-5 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300"
            >
              <Eye className="w-5 h-5" />
              {t('contacts')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>
      
      {renderStepIndicator()}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Section */}
          {activeStep === "patient" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-lg p-6 border shadow-sm"
            >
              <motion.div 
                variants={itemVariants}
                className="flex justify-between items-center border-b border-primary/30 pb-3 mb-4"
              >
                <h3 className={`text-lg font-semibold text-primary flex items-center gap-2 ${textAlignClass}`}>
                  <User className="w-5 h-5" />
                  {t('clientSection')}
                </h3>
                <div className={`flex items-center ${language === 'ar' ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                  <Checkbox 
                    id="skipPatientCheck" 
                    checked={skipPatient} 
                    onCheckedChange={(checked) => setSkipPatient(checked === true)} 
                  />
                  <Label 
                    htmlFor="skipPatientCheck" 
                    className={`font-normal text-sm ${language === 'ar' ? 'mr-2' : 'ml-2'}`}
                  >
                    {t('noClientFile')}
                  </Label>
                </div>
              </motion.div>
              
              {!skipPatient ? (
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientSearch" className={`text-muted-foreground block ${textAlignClass}`}>{t('phoneColon')}</Label>
                    <div className={`flex ${language === 'ar' ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                      <Input
                        id="patientSearch"
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        placeholder={t('typeToSearch')}
                        className={`flex-1 ${textAlignClass}`}
                      />
                      <Button onClick={handlePatientSearch} variant="default" className="gap-1 bg-primary hover:bg-primary/90">
                        <Search className="w-4 h-4" />
                        {t('search')}
                      </Button>
                    </div>
                  </div>
                  
                  {patientResults.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="border rounded-md divide-y max-h-[200px] overflow-y-auto"
                    >
                      {patientResults.map((patient) => (
                        <motion.div 
                          key={patient.patientId}
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                          className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => selectPatient(patient)}
                        >
                          <div className={`font-medium ${textAlignClass}`}>{patient.name}</div>
                          <div className={`text-sm text-muted-foreground ${textAlignClass}`}>{patient.phone}</div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                  
                  {currentPatient && (
                    <motion.div 
                      variants={itemVariants}
                      className="mt-4"
                    >
                      <div className="border-2 border-primary/20 rounded-lg p-4 bg-primary/5">
                        <div className={`flex justify-between mb-2 ${textAlignClass}`}>
                          <span className="font-semibold">{t('clientName')}:</span>
                          <span>{currentPatient.name}</span>
                        </div>
                        <div className={`flex justify-between mb-2 ${textAlignClass}`}>
                          <span className="font-semibold">{t('clientPhone')}:</span>
                          <span dir="ltr">{currentPatient.phone}</span>
                        </div>
                        <div className={`flex justify-between ${textAlignClass}`}>
                          <span className="font-semibold">{t('patientID')}:</span>
                          <span>{currentPatient.patientId || "N/A"}</span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="mt-3 w-full" 
                        onClick={() => setRxVisible(!rxVisible)}
                      >
                        {rxVisible ? (
                          <>
                            <EyeOff className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                            {t('hideRx')}
                          </>
                        ) : (
                          <>
                            <Eye className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                            {t('showRx')}
                          </>
                        )}
                      </Button>
                      
                      {rxVisible && invoiceType === "glasses" && currentPatient.rx && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                          className="p-3 mt-3 bg-white border rounded-lg"
                        >
                          <table className="w-full border-collapse ltr">
                            <thead>
                              <tr className="bg-muted/50">
                                <th className="p-2 border text-center">{t('eye')}</th>
                                <th className="p-2 border text-center">{t('sphere')}</th>
                                <th className="p-2 border text-center">{t('cylinder')}</th>
                                <th className="p-2 border text-center">{t('axis')}</th>
                                <th className="p-2 border text-center">{t('addition')}</th>
                                <th className="p-2 border text-center">{t('pdRight')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="p-2 border font-bold text-center">{t('rightEyeAbbr')}</td>
                                <td className="p-2 border text-center">{currentPatient.rx.sphereOD || ""}</td>
                                <td className="p-2 border text-center">{currentPatient.rx.cylOD || "—"}</td>
                                <td className="p-2 border text-center">{currentPatient.rx.axisOD || "—"}</td>
                                <td className="p-2 border text-center">{currentPatient.rx.addOD || "—"}</td>
                                <td className="p-2 border text-center">{currentPatient.rx.pdRight || "—"}</td>
                              </tr>
                              <tr>
                                <td className="p-2 border font-bold text-center">{t('leftEyeAbbr')}</td>
                                <td className="p-2 border text-center">{currentPatient.rx.sphereOS || "—"}</td>
                                <td className="p-2 border text-center">{currentPatient.rx.cylOS || "—"}</td>
                                <td className="p-2 border text-center">{currentPatient.rx.axisOS || "—"}</td>
                                <td className="p-2 border text-center">{currentPatient.rx.addOS || "—"}</td>
                                <td className="p-2 border text-center">{currentPatient.rx.pdLeft || "—"}</td>
                              </tr>
                            </tbody>
                          </table>
                        </motion.div>
                      )}
                      
                      {rxVisible && invoiceType === "contacts" && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                          className="mt-3"
                        >
                          <ContactLensForm 
                            rxData={contactLensRx}
                            onChange={handleContactLensRxChange}
                            showMissingRxWarning={showMissingRxWarning}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="manualName" className={`text-muted-foreground block ${textAlignClass}`}>{t('clientName')} ({t('optional')}):</Label>
                    <Input
                      id="manualName"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      className={textAlignClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manualPhone" className={`text-muted-foreground block ${textAlignClass}`}>{t('clientPhone')} ({t('optional')}):</Label>
                    <Input
                      id="manualPhone"
                      value={manualPhone}
                      onChange={(e) => setManualPhone(e.target.value)}
                      className={textAlignClass}
                    />
                  </div>
                  
                  {invoiceType === "contacts" && (
                    <ContactLensForm 
                      rxData={contactLensRx}
                      onChange={handleContactLensRxChange}
                    />
                  )}
                </motion.div>
              )}
              
              <motion.div 
                variants={itemVariants}
                className="flex justify-end mt-6"
              >
                <Button
                  onClick={goToNextStep}
                  className="px-8 py-2 bg-primary hover:bg-primary/90"
                >
                  {t('next')}
                </Button>
              </motion.div>
            </motion.div>
          )}
          
          {/* Product Section */}
          {activeStep === "product" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {invoiceType === "glasses" ? (
                <>
                  <motion.div 
                    variants={itemVariants}
                    className="bg-white rounded-lg p-6 border shadow-sm"
                  >
                    <div className="flex justify-between items-center border-b border-primary/30 pb-3 mb-4">
                      <h3 className={`text-lg font-semibold text-primary flex items-center gap-2 ${textAlignClass}`}>
                        <Eye className="w-5 h-5" />
                        {t('lensSection')}
                      </h3>
                    </div>
                    
                    <LensSelector 
                      onSelectLensType={handleLensTypeSelect}
                      onSelectCoating={handleCoatingSelect}
                      skipLens={skipFrame}
                      onSkipLensChange={handleSkipFrameChange}
                    />
                  </motion.div>

                  {!skipFrame && (
                    <motion.div 
                      variants={itemVariants}
                      className="bg-white rounded-lg p-6 border shadow-sm"
                    >
                      <div className="border-b border-primary/30 pb-3 mb-4">
                        <h3 className={`text-lg font-semibold text-primary flex items-center gap-2 ${textAlignClass}`}>
                          <Glasses className="w-5 h-5" />
                          {t('frameSection')}
                        </h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="frameSearchBox" className={`text-muted-foreground block ${textAlignClass}`}>{t('searchTerm')}</Label>
                          <div className={`flex ${language === 'ar' ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                            <Input
                              id="frameSearchBox"
                              value={frameSearch}
                              onChange={(e) => setFrameSearch(e.target.value)}
                              placeholder={t('searchExample')}
                              className={`flex-1 ${textAlignClass}`}
                            />
                            <Button onClick={handleFrameSearch} className="gap-1 bg-primary hover:bg-primary/90">
                              <Search className="w-4 h-4" />
                              {t('search')}
                            </Button>
                          </div>
                        </div>
                        
                        {frameResults.length > 0 && (
                          <div className="overflow-x-auto border rounded-lg">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-muted/50">
                                  <th className="p-2 border">{t('brand')}</th>
                                  <th className="p-2 border">{t('model')}</th>
                                  <th className="p-2 border">{t('color')}</th>
                                  <th className="p-2 border">{t('size')}</th>
                                  <th className="p-2 border">{t('price')} ({t('kwd')})</th>
                                  <th className="p-2 border">{t('quantity')}</th>
                                  <th className="p-2 border"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {frameResults.map((frame, index) => (
                                  <tr 
                                    key={index}
                                    className="hover:bg-muted/30 transition-colors"
                                  >
                                    <td className="p-2 border">{frame.brand}</td>
                                    <td className="p-2 border">{frame.model}</td>
                                    <td className="p-2 border">{frame.color}</td>
                                    <td className="p-2 border">{frame.size}</td>
                                    <td className="p-2 border">{frame.price.toFixed(2)}</td>
                                    <td className="p-2 border">{frame.qty}</td>
                                    <td className="p-2 border">
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => selectFrame(frame)}
                                        className="w-full"
                                      >
                                        <Plus className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                                        {t('choose')}
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        
                        {selectedFrame.brand && (
                          <div className="mt-4 p-4 border-2 rounded-lg bg-primary/5 border-primary/20">
                            <h4 className={`font-medium text-primary mb-2 flex items-center ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
                              <PackageCheck className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                              {t('selectedFrame')}
                            </h4>
                            <table className="w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}>{t('brand')}</th>
                                  <th className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}>{t('model')}</th>
                                  <th className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}>{t('color')}</th>
                                  <th className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}>{t('size')}</th>
                                  <th className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}>{t('price')} ({t('kwd')})</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className={`p-1 ${textAlignClass}`}>{selectedFrame.brand}</td>
                                  <td className={`p-1 ${textAlignClass}`}>{selectedFrame.model}</td>
                                  <td className={`p-1 ${textAlignClass}`}>{selectedFrame.color}</td>
                                  <td className={`p-1 ${textAlignClass}`}>{selectedFrame.size}</td>
                                  <td className={`p-1 ${textAlignClass}`}>{selectedFrame.price.toFixed(2)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                        
                        <Button 
                          variant="outline" 
                          onClick={() => setShowManualFrame(!showManualFrame)}
                          className="w-full"
                        >
                          <Plus className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                          {t('addFrameButton')}
                        </Button>
                        
                        {showManualFrame && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                            className="p-4 border rounded-lg mt-2 bg-muted/10"
                          >
                            <h4 className={`font-semibold mb-3 text-primary ${textAlignClass}`}>{t('newFrameDetails')}</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor="newBrand" className={`text-muted-foreground block ${textAlignClass}`}>{t('brand')}*:</Label>
                                <Input
                                  id="newBrand"
                                  value={newBrand}
                                  onChange={(e) => setNewBrand(e.target.value)}
                                  className={textAlignClass}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="newModel" className={`text-muted-foreground block ${textAlignClass}`}>{t('model')}*:</Label>
                                <Input
                                  id="newModel"
                                  value={newModel}
                                  onChange={(e) => setNewModel(e.target.value)}
                                  className={textAlignClass}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="newColor" className={`text-muted-foreground block ${textAlignClass}`}>{t('color')}*:</Label>
                                <Input
                                  id="newColor"
                                  value={newColor}
                                  onChange={(e) => setNewColor(e.target.value)}
                                  className={textAlignClass}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="newSize" className={`text-muted-foreground block ${textAlignClass}`}>{t('size')}:</Label>
                                <Input
                                  id="newSize"
                                  value={newSize}
                                  onChange={(e) => setNewSize(e.target.value)}
                                  className={textAlignClass}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="newPrice" className={`text-muted-foreground block ${textAlignClass}`}>{t('price')}*:</Label>
                                <Input
                                  id="newPrice"
                                  value={newPrice}
                                  onChange={(e) => setNewPrice(e.target.value)}
                                  type="number"
                                  min="0"
                                  step="0.001"
                                  className={textAlignClass}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="newQty" className={`text-muted-foreground block ${textAlignClass}`}>{t('quantity')}*:</Label>
                                <Input
                                  id="newQty"
                                  value={newQty}
                                  onChange={(e) => setNewQty(e.target.value)}
                                  type="number"
                                  min="1"
                                  step="1"
                                  className={textAlignClass}
                                />
                              </div>
                            </div>
                            
                            <Button 
                              onClick={handleAddNewFrame}
                              className="mt-4 w-full bg-primary hover:bg-primary/90"
                            >
                              <Plus className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                              {t('addToInventory')}
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div 
                  variants={itemVariants}
                  className="bg-white rounded-lg p-6 border shadow-sm"
                >
                  <div className="flex justify-between items-center border-b border-primary/30 pb-3 mb-4">
                    <h3 className={`text-lg font-semibold text-primary flex items-center gap-2 ${textAlignClass}`}>
                      <Eye className="w-5 h-5" />
                      {t('contactLensSection')}
                    </h3>
                  </div>
                  
                  <ContactLensSelector
                    onSelect={handleContactLensSelection}
                    initialRxData={contactLensRx}
                  />
                </motion.div>
              )}
              
              <motion.div 
                variants={itemVariants}
                className="flex justify-between mt-6"
              >
                <Button
                  onClick={goToPreviousStep}
                  variant="outline"
                  className="px-6"
                >
                  {t('previous')}
                </Button>
                <Button
                  onClick={goToNextStep}
                  className="px-8 py-2 bg-primary hover:bg-primary/90"
                >
                  {t('next')}
                </Button>
              </motion.div>
            </motion.div>
          )}
          
          {/* Payment Section */}
          {activeStep === "payment" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-lg p-6 border shadow-sm"
            >
              <motion.div 
                variants={itemVariants}
                className="border-b border-primary/30 pb-3 mb-4"
              >
                <h3 className={`text-lg font-semibold text-primary flex items-center gap-2 ${textAlignClass}`}>
                  <CreditCard className="w-5 h-5" />
                  {t('paymentSection')}
                </h3>
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount" className={`text-muted-foreground block ${textAlignClass}`}>
                      <span className="flex items-center">
                        <BadgePercent className="inline-block w-4 h-4 mr-1" />
                        {t('discount')}:
                      </span>
                    </Label>
                    <Input
                      id="discount"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      type="number"
                      min="0"
                      step="0.001"
                      className={textAlignClass}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deposit" className={`text-muted-foreground block ${textAlignClass}`}>
                      <span className="flex items-center">
                        <DollarSign className="inline-block w-4 h-4 mr-1" />
                        {t('deposit')}:
                      </span>
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="deposit"
                        value={deposit}
                        onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)}
                        type="number"
                        min="0"
                        step="0.001"
                        className="flex-grow"
                      />
                      <Button 
                        variant="secondary" 
                        onClick={handlePayInFull}
                        className="whitespace-nowrap"
                      >
                        {t('payInFull')}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className={`block ${textAlignClass}`}>
                    <span className="flex items-center">
                      <CreditCard className="inline-block w-4 h-4 mr-1" />
                      {t('paymentMethod')}*:
                    </span>
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {["Cash", "Visa", "MasterCard", "KNET", "كي نت"].map((method) => (
                      <Button
                        key={method}
                        type="button"
                        variant={paymentMethod === method ? "default" : "outline"}
                        className={`${textAlignClass} ${
                          paymentMethod === method 
                            ? "bg-primary text-white border-primary" 
                            : "hover:border-primary/50"
                        } transition-all duration-300`}
                        onClick={() => setPaymentMethod(method)}
                      >
                        {method === "Cash" && <Banknote className={`w-4 h-4 ${language === 'ar' ? 'ml-1.5' : 'mr-1.5'}`} />}
                        {(method === "Visa" || method === "MasterCard" || method === "KNET" || method === "كي نت") && (
                          <CardIcon className={`w-4 h-4 ${language === 'ar' ? 'ml-1.5' : 'mr-1.5'}`} />
                        )}
                        {method}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {(paymentMethod === "Visa" || paymentMethod === "MasterCard" || paymentMethod === "KNET" || paymentMethod === "كي نت") && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="authNumber" className={`text-muted-foreground block ${textAlignClass}`}>
                      <span className="flex items-center">
                        <ClipboardCheck className="inline-block w-4 h-4 mr-1" />
                        {t('authNumber')}:
                      </span>
                    </Label>
                    <Input
                      id="authNumber"
                      value={authNumber}
                      onChange={(e) => setAuthNumber(e.target.value)}
                      className={textAlignClass}
                    />
                  </motion.div>
                )}
                
                <motion.div 
                  variants={itemVariants}
                  className="grid grid-cols-1 gap-3 border-2 rounded-lg p-6 bg-primary/5 border-primary/20"
                >
                  <div className={`flex justify-between items-center ${textAlignClass}`}>
                    <span className="font-medium flex items-center">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      {t('subtotal')}:
                    </span>
                    <span>{(total + discount).toFixed(3)} {t('kwd')}</span>
                  </div>
                  
                  <div className={`flex justify-between items-center ${textAlignClass}`}>
                    <span className="font-medium flex items-center">
                      <BadgePercent className="w-4 h-4 mr-1" />
                      {t('discount')}:
                    </span>
                    <span>{discount.toFixed(3)} {t('kwd')}</span>
                  </div>
                  
                  <div className={`flex justify-between items-center text-lg font-bold border-t pt-2 ${textAlignClass}`}>
                    <span className="flex items-center">
                      <Calculator className="w-5 h-5 mr-1" />
                      {t('total')}:
                    </span>
                    <span>{total.toFixed(3)} {t('kwd')}</span>
                  </div>
                  
                  <div className={`flex justify-between items-center ${textAlignClass}`}>
                    <span className="font-medium flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {t('deposit')}:
                    </span>
                    <span>{deposit.toFixed(3)} {t('kwd')}</span>
                  </div>
                  
                  <div className={`flex justify-between items-center text-lg font-bold border-t pt-2 text-primary ${textAlignClass}`}>
                    <span className="flex items-center">
                      <BadgeDollarSign className="w-5 h-5 mr-1" />
                      {t('remaining')}:
                    </span>
                    <span>{remaining.toFixed(3)} {t('kwd')}</span>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="flex justify-between mt-6"
              >
                <Button
                  onClick={goToPreviousStep}
                  variant="outline"
                  className="px-6"
                >
                  {t('previous')}
                </Button>
                <Button 
                  onClick={handleSaveInvoice}
                  className="px-8 py-6 text-lg bg-primary hover:bg-primary/90"
                  disabled={!paymentMethod}
                >
                  <Save className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {t('saveInvoice')}
                </Button>
              </motion.div>
            </motion.div>
          )}
          
          {/* Complete Section */}
          {activeStep === "complete" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-lg p-6 border shadow-sm"
            >
              <motion.div 
                variants={itemVariants}
                className="border-b border-primary/30 pb-3 mb-4"
              >
                <h3 className={`text-lg font-semibold text-primary flex items-center gap-2 ${textAlignClass}`}>
                  <Check className="w-5 h-5" />
                  {t('completed')}
                </h3>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="border-2 border-green-500 rounded-lg p-4 bg-green-50"
              >
                <div className="flex items-center justify-center mb-4 text-green-600">
                  <CircleCheck className="w-12 h-12" />
                </div>
                
                <div className="text-center mb-4">
                  <h4 className="text-xl font-medium text-green-700 mb-1">
                    {t('invoiceSaved')}
                  </h4>
                  <p className="text-green-600 opacity-80">
                    {t('invoiceSavedDescription')}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="border rounded-lg p-3 bg-white hover:shadow-md transition-shadow">
                    <div className="text-sm text-gray-500">{t('invoiceNumber')}</div>
                    <div className="text-lg font-bold text-primary">{savedInvoiceId}</div>
                  </div>
                  <div className="border rounded-lg p-3 bg-white hover:shadow-md transition-shadow">
                    <div className="text-sm text-gray-500">{t('workOrderNumber')}</div>
                    <div className="text-lg font-bold text-primary">{savedWorkOrderId}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={handlePrintInvoice}
                    variant="outline"
                    className="py-5 hover:bg-primary/10 transition-colors"
                  >
                    <Printer className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                    {t('printInvoice')}
                  </Button>
                  
                  <Button
                    onClick={() => setWorkOrderPrintOpen(true)}
                    variant="outline"
                    className="py-5 hover:bg-primary/10 transition-colors"
                  >
                    <ListTodo className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                    {t('printWorkOrder')}
                  </Button>
                </div>
                
                <Button
                  onClick={handleCompleteTransaction}
                  variant="default"
                  className="w-full mt-4 py-6 bg-green-600 hover:bg-green-700 flex items-center justify-center"
                >
                  <Smile className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {t('completeTransaction')}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
        
        {/* Preview Section */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg p-5 border shadow-sm sticky top-20"
          >
            <h3 className={`text-lg font-semibold mb-4 flex items-center justify-between ${textAlignClass}`}>
              <span className="flex items-center">
                <Receipt className="w-5 h-5 text-primary mr-2" />
                {t('preview')}
              </span>
              <Button variant="ghost" size="sm" onClick={() => window.print()} className="hidden print:hidden">
                <Printer className="w-4 h-4 mr-1" />
                {t('print')}
              </Button>
            </h3>
            
            <div className="border rounded-lg p-4 max-h-[calc(100vh-160px)] overflow-y-auto bg-white/60 backdrop-blur-sm">
              <div className="border-b pb-3 mb-4">
                <div className={`text-sm text-muted-foreground mb-1 ${textAlignClass}`}>{t('invoiceNumber')}: {previewInvoice.invoiceId}</div>
                <div className={`text-sm text-muted-foreground ${textAlignClass}`}>{t('workOrderNumber')}: {previewInvoice.workOrderId}</div>
                <div className={`text-sm text-muted-foreground mt-1 ${textAlignClass}`}>
                  {new Date(previewInvoice.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <h4 className={`font-medium mb-2 ${textAlignClass} flex items-center`}>
                <User className="w-4 h-4 mr-1" /> 
                {t('client')}
              </h4>
              <div className={`text-sm mb-4 ${textAlignClass} pl-5`}>
                <div>{previewInvoice.patientName}</div>
                {previewInvoice.patientPhone && <div dir="ltr">{previewInvoice.patientPhone}</div>}
              </div>
              
              {invoiceType === "glasses" ? (
                <>
                  {/* Lens Information */}
                  {previewInvoice.lensType && (
                    <>
                      <h4 className={`font-medium mb-2 ${textAlignClass} flex items-center`}>
                        <Eye className="w-4 h-4 mr-1" />
                        {t('lensType')}
                      </h4>
                      <div className={`text-sm mb-3 flex justify-between ${textAlignClass} pl-5`}>
                        <span>{previewInvoice.lensType}</span>
                        <span className="font-medium">{previewInvoice.lensPrice.toFixed(3)} {t('kwd')}</span>
                      </div>
                    </>
                  )}
                  
                  {/* Coating Information */}
                  {previewInvoice.coating && (
                    <>
                      <h4 className={`font-medium mb-2 ${textAlignClass} flex items-center`}>
                        <Package className="w-4 h-4 mr-1" />
                        {t('coating')}
                      </h4>
                      <div className={`text-sm mb-3 flex justify-between ${textAlignClass} pl-5`}>
                        <span>{previewInvoice.coating}</span>
                        <span className="font-medium">{previewInvoice.coatingPrice.toFixed(3)} {t('kwd')}</span>
                      </div>
                    </>
                  )}
                  
                  {/* Frame Information */}
                  {previewInvoice.frameBrand && (
                    <>
                      <h4 className={`font-medium mb-2 ${textAlignClass} flex items-center`}>
                        <Glasses className="w-4 h-4 mr-1" />
                        {t('frame')}
                      </h4>
                      <div className={`text-sm mb-3 ${textAlignClass} pl-5`}>
                        <div className="flex justify-between mb-1">
                          <span>{previewInvoice.frameBrand} {previewInvoice.frameModel}</span>
                          <span className="font-medium">{previewInvoice.framePrice.toFixed(3)} {t('kwd')}</span>
                        </div>
                        {previewInvoice.frameColor && (
                          <div className="text-muted-foreground">
                            {t('color')}: {previewInvoice.frameColor}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* Contact Lens Information */}
                  {previewInvoice.lensType && (
                    <>
                      <h4 className={`font-medium mb-2 ${textAlignClass} flex items-center`}>
                        <Eye className="w-4 h-4 mr-1" />
                        {t('contactLenses')}
                      </h4>
                      <div className={`text-sm mb-3 flex justify-between ${textAlignClass} pl-5`}>
                        <span className="max-w-[200px] break-words">{previewInvoice.lensType}</span>
                        <span className="font-medium">{previewInvoice.lensPrice.toFixed(3)} {t('kwd')}</span>
                      </div>
                    </>
                  )}
                </>
              )}
              
              {/* Payment Information */}
              <div className="border-t mt-4 pt-4">
                <div className={`flex justify-between mb-1 ${textAlignClass}`}>
                  <span className="flex items-center">
                    <BadgePercent className="w-3 h-3 mr-1 text-muted-foreground" />
                    {t('discount')}:
                  </span>
                  <span>{previewInvoice.discount.toFixed(3)} {t('kwd')}</span>
                </div>
                <div className={`flex justify-between mb-1 font-medium ${textAlignClass}`}>
                  <span className="flex items-center">
                    <Calculator className="w-3 h-3 mr-1 text-muted-foreground" />
                    {t('total')}:
                  </span>
                  <span>{previewInvoice.total.toFixed(3)} {t('kwd')}</span>
                </div>
                <div className={`flex justify-between mb-1 ${textAlignClass}`}>
                  <span className="flex items-center">
                    <DollarSign className="w-3 h-3 mr-1 text-muted-foreground" />
                    {t('deposit')}:
                  </span>
                  <span>{previewInvoice.deposit.toFixed(3)} {t('kwd')}</span>
                </div>
                <div className={`flex justify-between font-bold text-primary ${textAlignClass}`}>
                  <span className="flex items-center">
                    <BadgeDollarSign className="w-3 h-3 mr-1" />
                    {t('remaining')}:
                  </span>
                  <span>{previewInvoice.remaining.toFixed(3)} {t('kwd')}</span>
                </div>
                
                {previewInvoice.paymentMethod && (
                  <div className={`mt-3 p-2 bg-muted/20 rounded text-sm ${textAlignClass}`}>
                    <span className="font-medium flex items-center">
                      <CreditCard className="w-3 h-3 mr-1 text-muted-foreground" />
                      {t('paymentMethod')}: {previewInvoice.paymentMethod}
                    </span>
                    {previewInvoice.authNumber && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {t('authNumber')}: {previewInvoice.authNumber}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Print Dialogs */}
      {invoicePrintOpen && (
        <div className="hidden print:block">
          <ReceiptInvoice invoice={previewInvoice} />
        </div>
      )}
      
      {/* Work Order Print Dialog */}
      <WorkOrderPrintSelector
        invoice={previewInvoice}
        patientName={currentPatient?.name || manualName}
        patientPhone={currentPatient?.phone || manualPhone}
        rx={currentPatient?.rx}
        lensType={selectedLensType?.name}
        coating={selectedCoating?.name}
        frame={!skipFrame ? selectedFrame : undefined}
        contactLenses={contactLensItems}
        contactLensRx={contactLensRx}
        isOpen={workOrderPrintOpen}
        onOpenChange={setWorkOrderPrintOpen}
        isNewInvoice={!savedInvoiceId}
        onInvoiceSaved={(invoiceId) => {
          setSavedInvoiceId(invoiceId);
        }}
      />
    </div>
  );
};

export default CreateInvoice;
