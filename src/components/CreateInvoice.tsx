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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactLensSelector, ContactLensItem, ContactLensSelection } from "@/components/ContactLensSelector";
import { ContactLensForm } from "@/components/ContactLensForm";
import { LensSelector } from "@/components/LensSelector";
import { ReceiptInvoice } from "@/components/ReceiptInvoice";
import { WorkOrderPrint } from "@/components/WorkOrderPrint";
import { CustomPrintService } from "@/utils/CustomPrintService";
import { 
  User, Glasses, Package, FileText, CreditCard, Eye, Search, 
  Banknote, Plus, PackageCheck, EyeOff, ExternalLink,
  ClipboardCheck, BadgePercent, Printer, CreditCard as CardIcon,
  Receipt, Save, Check
} from "lucide-react";

const CreateInvoice: React.FC = () => {
  const { t, language } = useLanguageStore();
  const searchPatients = usePatientStore((state) => state.searchPatients);
  const searchFrames = useInventoryStore((state) => state.searchFrames);
  const addFrame = useInventoryStore((state) => state.addFrame);
  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  
  const [invoiceType, setInvoiceType] = useState<"glasses" | "contacts">("glasses");
  
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
  
  const [frameTotal, setFrameTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);
  
  const [showMissingRxWarning, setShowMissingRxWarning] = useState(false);
  
  const [savedInvoiceId, setSavedInvoiceId] = useState<string | null>(null);
  const [savedWorkOrderId, setSavedWorkOrderId] = useState<string | null>(null);
  const [showSavedDetails, setShowSavedDetails] = useState(false);
  
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
      const mainLens = contactLensItems[0];
      
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
    
    // Use CustomPrintService to print the work order
    const currentInvoice = {
      ...previewInvoice,
      invoiceId: savedInvoiceId,
      workOrderId: savedWorkOrderId
    };
    
    CustomPrintService.printWorkOrder(
      currentInvoice,
      currentInvoice,
      {
        name: currentPatient?.name || manualName,
        phone: currentPatient?.phone || manualPhone,
        rx: currentPatient?.rx
      }
    );
    
    toast({
      description: t('workOrderPrinted'),
    });
  };
  
  const handleCompleteTransaction = () => {
    resetForm();
    setSavedInvoiceId(null);
    setSavedWorkOrderId(null);
    setShowSavedDetails(false);
    
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
  
  return (
    <div className="py-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold flex items-center gap-2 ${textAlignClass}`}>
          <FileText className="w-6 h-6 text-primary" />
          {t('invoiceTitle')}
        </h2>
        <Tabs 
          value={invoiceType} 
          onValueChange={(v) => setInvoiceType(v as "glasses" | "contacts")}
          className="w-auto"
        >
          <TabsList className="p-1 bg-primary/10 border border-primary/20 rounded-lg shadow-sm text-base">
            <TabsTrigger 
              value="glasses" 
              className="flex items-center gap-2 px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Glasses className="w-5 h-5" />
              {t('glasses')}
            </TabsTrigger>
            <TabsTrigger 
              value="contacts" 
              className="flex items-center gap-2 px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Eye className="w-5 h-5" />
              {t('contacts')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6 border shadow-sm">
            <div className="flex justify-between items-center border-b border-primary/30 pb-3 mb-4">
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
            </div>
            
            {!skipPatient ? (
              <>
                <div className="space-y-4">
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
                      <Button onClick={handlePatientSearch} className="gap-1">
                        <Search className="w-4 h-4" />
                        {t('search')}
                      </Button>
                    </div>
                  </div>
                  
                  {patientResults.length > 0 && (
                    <div className="border rounded-md divide-y max-h-[200px] overflow-y-auto">
                      {patientResults.map((patient) => (
                        <div 
                          key={patient.patientId}
                          className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => selectPatient(patient)}
                        >
                          <div className={`font-medium ${textAlignClass}`}>{patient.name}</div>
                          <div className={`text-sm text-muted-foreground ${textAlignClass}`}>{patient.phone}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {currentPatient && (
                    <div className="mt-4">
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
                        <div className="p-3 mt-3 bg-white border rounded-lg">
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
                        </div>
                      )}
                      
                      {rxVisible && invoiceType === "contacts" && (
                        <div className="mt-3">
                          <ContactLensForm 
                            rxData={contactLensRx}
                            onChange={handleContactLensRxChange}
                            showMissingRxWarning={showMissingRxWarning}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
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
              </div>
            )}
          </div>

          {invoiceType === "glasses" ? (
            <>
              <div className="bg-white rounded-lg p-6 border shadow-sm">
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
              </div>

              {!skipFrame && (
                <div className="bg-white rounded-lg p-6 border shadow-sm">
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
                        <Button onClick={handleFrameSearch} className="gap-1">
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
                      <div className="mt-4 p-3 border rounded-lg bg-primary/5 border-primary/20">
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
                      <div className="p-4 border rounded-lg mt-2 bg-muted/10">
                        <h4 className={`font-semibold mb-3 text-primary ${textAlignClass}`}>{t('newFrameDetails')}</h4>
                        <div
