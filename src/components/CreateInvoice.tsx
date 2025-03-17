
import React, { useState, useEffect } from "react";
import { usePatientStore } from "@/store/patientStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { useInvoiceStore } from "@/store/invoiceStore";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactLensSelector } from "@/components/ContactLensSelector";
import { ContactLensForm } from "@/components/ContactLensForm";
import { ReceiptInvoice } from "@/components/ReceiptInvoice";
import { WorkOrderPrint } from "@/components/WorkOrderPrint";
import { 
  User, Glasses, Package, FileText, CreditCard, Eye, Search, 
  Banknote, Plus, PackageCheck, EyeOff, ExternalLink,
  ClipboardCheck, BadgePercent, Printer, CreditCard as CardIcon,
  Receipt
} from "lucide-react";

const CreateInvoice: React.FC = () => {
  const searchPatients = usePatientStore((state) => state.searchPatients);
  const searchFrames = useInventoryStore((state) => state.searchFrames);
  const addFrame = useInventoryStore((state) => state.addFrame);
  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  
  // Invoice type state
  const [invoiceType, setInvoiceType] = useState<"glasses" | "contacts">("glasses");
  
  // Patient section states
  const [skipPatient, setSkipPatient] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const [patientResults, setPatientResults] = useState<ReturnType<typeof searchPatients>>([]);
  const [currentPatient, setCurrentPatient] = useState<ReturnType<typeof searchPatients>[0] | null>(null);
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [rxVisible, setRxVisible] = useState(false);
  
  // Lens & Coating states
  const [skipFrame, setSkipFrame] = useState(false);
  const [lensType, setLensType] = useState("");
  const [lensPrice, setLensPrice] = useState(0);
  const [coating, setCoating] = useState("");
  const [coatingPrice, setCoatingPrice] = useState(0);
  
  // Frame states
  const [frameSearch, setFrameSearch] = useState("");
  const [frameResults, setFrameResults] = useState<ReturnType<typeof searchFrames>>([]);
  const [selectedFrame, setSelectedFrame] = useState<{
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  }>({ brand: "", model: "", color: "", size: "", price: 0 });
  
  // Manual Frame states
  const [showManualFrame, setShowManualFrame] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newQty, setNewQty] = useState("1");
  
  // Payment states
  const [discount, setDiscount] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [authNumber, setAuthNumber] = useState("");
  
  // Print states
  const [invoicePrintOpen, setInvoicePrintOpen] = useState(false);
  const [workOrderPrintOpen, setWorkOrderPrintOpen] = useState(false);
  
  // Contact lens prescription states
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
  
  // Calculated totals
  const [frameTotal, setFrameTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);
  
  // Update totals when dependencies change
  useEffect(() => {
    const frameCost = skipFrame ? 0 : selectedFrame.price;
    const totalCost = lensPrice + coatingPrice + frameCost - discount;
    const calculatedTotal = totalCost > 0 ? totalCost : 0;
    const calculatedRemaining = Math.max(0, calculatedTotal - deposit);
    
    setFrameTotal(frameCost);
    setTotal(calculatedTotal);
    setRemaining(calculatedRemaining);
  }, [lensPrice, coatingPrice, selectedFrame.price, skipFrame, discount, deposit]);
  
  // Handle patient search
  const handlePatientSearch = () => {
    if (!patientSearch.trim()) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال رقم الهاتف للبحث.",
        variant: "destructive"
      });
      return;
    }
    
    const results = searchPatients(patientSearch);
    setPatientResults(results);
    
    if (results.length === 0) {
      toast({
        description: "لم يتم العثور على عملاء بهذا الرقم.",
      });
    }
  };
  
  // Handle frame search
  const handleFrameSearch = () => {
    if (!frameSearch.trim()) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال كلمات البحث.",
        variant: "destructive"
      });
      return;
    }
    
    const results = searchFrames(frameSearch);
    setFrameResults(results);
    
    if (results.length === 0) {
      toast({
        description: "لم يتم العثور على إطار.",
      });
    }
  };
  
  // Select a patient from search results
  const selectPatient = (patient: ReturnType<typeof searchPatients>[0]) => {
    setCurrentPatient(patient);
    setPatientResults([]);
    setRxVisible(true);
    
    // If the patient has contact lens RX data and the invoice type is contacts,
    // load that data into the contact lens form
    if (invoiceType === "contacts" && patient.contactLensRx) {
      setContactLensRx(patient.contactLensRx);
    }
  };
  
  // Select a frame from search results
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
  
  // Add a new frame to inventory
  const handleAddNewFrame = () => {
    if (!newBrand || !newModel || !newColor || !newPrice) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال تفاصيل الإطار.",
        variant: "destructive"
      });
      return;
    }
    
    const price = parseFloat(newPrice);
    const qty = parseInt(newQty);
    
    if (isNaN(price) || price <= 0) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال سعر صحيح.",
        variant: "destructive"
      });
      return;
    }
    
    if (isNaN(qty) || qty <= 0) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال كمية صحيحة.",
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
      description: "تم إضافة الإطار بنجاح.",
    });
  };
  
  // Pay in full handler
  const handlePayInFull = () => {
    setDeposit(total);
  };
  
  // Print handlers
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
  
  // Contact lens RX handler
  const handleContactLensRxChange = (rxData: typeof contactLensRx) => {
    setContactLensRx(rxData);
  };
  
  // Save invoice
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
        title: "خطأ",
        description: "الرجاء اختيار عميل أو تفعيل الخيار 'لا يوجد ملف عميل'.",
        variant: "destructive"
      });
      return;
    }
    
    if (invoiceType === "glasses" && !lensType) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار نوع العدسة.",
        variant: "destructive"
      });
      return;
    }
    
    if (invoiceType === "glasses" && !skipFrame && (!selectedFrame.brand || !selectedFrame.model)) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار إطار أو تفعيل خيار 'عدسات فقط'.",
        variant: "destructive"
      });
      return;
    }
    
    if (!paymentMethod) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار طريقة الدفع.",
        variant: "destructive"
      });
      return;
    }
    
    const paymentDetails = (paymentMethod === "Visa" || paymentMethod === "MasterCard" || paymentMethod === "كي نت") 
      ? { authNumber } 
      : {};
    
    const invoiceData = {
      patientId,
      patientName,
      patientPhone,
      
      lensType,
      lensPrice,
      
      coating,
      coatingPrice,
      
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
    
    const invoiceId = addInvoice(invoiceData);
    
    toast({
      title: "تم الحفظ",
      description: `تم حفظ الفاتورة برقم ${invoiceId} بنجاح.`,
    });
    
    resetForm();
  };
  
  // Reset form to initial state
  const resetForm = () => {
    setSkipPatient(false);
    setPatientSearch("");
    setPatientResults([]);
    setCurrentPatient(null);
    setManualName("");
    setManualPhone("");
    setRxVisible(false);
    
    setSkipFrame(false);
    setLensType("");
    setLensPrice(0);
    setCoating("");
    setCoatingPrice(0);
    
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
  };
  
  // Create a mock invoice for previews
  const previewInvoice = {
    invoiceId: "PREVIEW",
    createdAt: new Date().toISOString(),
    patientName: currentPatient?.name || manualName || "Customer Name",
    patientPhone: currentPatient?.phone || manualPhone || "",
    patientId: currentPatient?.patientId,
    lensType: lensType,
    lensPrice: lensPrice,
    coating: coating,
    coatingPrice: coatingPrice,
    frameBrand: skipFrame ? "" : selectedFrame.brand,
    frameModel: skipFrame ? "" : selectedFrame.model,
    frameColor: skipFrame ? "" : selectedFrame.color,
    framePrice: skipFrame ? 0 : selectedFrame.price,
    discount: discount,
    deposit: deposit,
    total: total,
    remaining: remaining,
    paymentMethod: paymentMethod || "Cash",
    isPaid: remaining <= 0,
    authNumber: authNumber
  };
  
  return (
    <div className="py-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-right">
          <FileText className="w-6 h-6 text-primary" />
          إنشاء فاتورة
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
              نظارات
            </TabsTrigger>
            <TabsTrigger 
              value="contacts" 
              className="flex items-center gap-2 px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Eye className="w-5 h-5" />
              عدسات لاصقة
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1) Patient Search or Skip */}
          <div className="bg-white rounded-lg p-6 border shadow-sm">
            <div className="flex justify-between items-center border-b border-primary/30 pb-3 mb-4">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <User className="w-5 h-5" />
                ١) بيانات العميل
              </h3>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox 
                  id="skipPatientCheck" 
                  checked={skipPatient} 
                  onCheckedChange={(checked) => setSkipPatient(checked === true)} 
                />
                <Label 
                  htmlFor="skipPatientCheck" 
                  className="font-normal text-sm mr-2"
                >
                  لا يوجد ملف عميل
                </Label>
              </div>
            </div>
            
            {!skipPatient ? (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientSearch" className="text-muted-foreground block text-right">رقم الهاتف:</Label>
                    <div className="flex space-x-2 space-x-reverse">
                      <Input
                        id="patientSearch"
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        placeholder="اكتب للبحث..."
                        className="flex-1 text-right"
                      />
                      <Button onClick={handlePatientSearch} className="gap-1">
                        <Search className="w-4 h-4" />
                        بحث
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
                          <div className="font-medium text-right">{patient.name}</div>
                          <div className="text-sm text-muted-foreground text-right">{patient.phone}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {currentPatient && (
                    <div className="mt-4">
                      <div className="border-2 border-primary/20 rounded-lg p-4 bg-primary/5">
                        <div className="flex justify-between mb-2 text-right">
                          <span className="font-semibold">اسم العميل:</span>
                          <span>{currentPatient.name}</span>
                        </div>
                        <div className="flex justify-between mb-2 text-right">
                          <span className="font-semibold">الهاتف:</span>
                          <span dir="ltr">{currentPatient.phone}</span>
                        </div>
                        <div className="flex justify-between text-right">
                          <span className="font-semibold">Patient ID:</span>
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
                            <EyeOff className="w-4 h-4 ml-1" />
                            إخفاء الوصفة
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 ml-1" />
                            عرض الوصفة
                          </>
                        )}
                      </Button>
                      
                      {rxVisible && invoiceType === "glasses" && currentPatient.rx && (
                        <div className="p-3 mt-3 bg-white border rounded-lg">
                          <table className="w-full border-collapse ltr">
                            <thead>
                              <tr className="bg-muted/50">
                                <th className="p-2 border text-center">العين</th>
                                <th className="p-2 border text-center">Sphere</th>
                                <th className="p-2 border text-center">Cyl</th>
                                <th className="p-2 border text-center">Axis</th>
                                <th className="p-2 border text-center">Add</th>
                                <th className="p-2 border text-center">PD</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="p-2 border font-bold text-center">OD (يمين)</td>
                                <td className="p-2 border text-center">{currentPatient.rx.sphereOD || "—"}</td>
                                <td className="p-2 border text-center">{currentPatient.rx.cylOD || "—"}</td>
                                <td className="p-2 border text-center">{currentPatient.rx.axisOD || "—"}</td>
                                <td className="p-2 border text-center">{currentPatient.rx.addOD || "—"}</td>
                                <td className="p-2 border text-center">{currentPatient.rx.pdRight || "—"}</td>
                              </tr>
                              <tr>
                                <td className="p-2 border font-bold text-center">OS (يسار)</td>
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
                      
                      {rxVisible && invoiceType === "contacts" && currentPatient.contactLensRx && (
                        <div className="mt-3">
                          <ContactLensForm 
                            rxData={contactLensRx}
                            onChange={handleContactLensRxChange}
                          />
                        </div>
                      )}
                      
                      {rxVisible && invoiceType === "contacts" && !currentPatient.contactLensRx && (
                        <div className="p-3 mt-3 bg-yellow-50 border border-yellow-200 rounded-lg text-right">
                          <p className="text-yellow-700">
                            لا توجد وصفة عدسات لاصقة لهذا العميل. يرجى إضافة وصفة عدسات لاصقة في ملف العميل.
                          </p>
                          <ContactLensForm 
                            rxData={contactLensRx}
                            onChange={handleContactLensRxChange}
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
                  <Label htmlFor="manualName" className="text-muted-foreground block text-right">اسم العميل (اختياري):</Label>
                  <Input
                    id="manualName"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manualPhone" className="text-muted-foreground block text-right">هاتف العميل (اختياري):</Label>
                  <Input
                    id="manualPhone"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="text-right"
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
              {/* 2) Lenses & Coating */}
              <div className="bg-white rounded-lg p-6 border shadow-sm">
                <div className="flex justify-between items-center border-b border-primary/30 pb-3 mb-4">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    ٢) العدسات
                  </h3>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox 
                      id="skipFrameCheck" 
                      checked={skipFrame} 
                      onCheckedChange={(checked) => setSkipFrame(checked === true)} 
                    />
                    <Label 
                      htmlFor="skipFrameCheck" 
                      className="font-normal text-sm mr-2"
                    >
                      عدسات فقط (بدون إطار)
                    </Label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lensType" className="text-muted-foreground block text-right">نوع العدسة:</Label>
                    <select
                      id="lensType"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-right"
                      value={lensType}
                      onChange={(e) => {
                        setLensType(e.target.value);
                        const option = e.target.options[e.target.selectedIndex];
                        setLensPrice(parseFloat(option.getAttribute("data-price") || "0"));
                      }}
                    >
                      <option value="" data-price="0">-- اختر --</option>
                      <option value="Single Vision Distance" data-price="20">Single Vision Distance (20 KWD)</option>
                      <option value="Single Vision Reading" data-price="15">Single Vision Reading (15 KWD)</option>
                      <option value="Progressive" data-price="40">Progressive (40 KWD)</option>
                      <option value="Bifocal" data-price="25">Bifocal (25 KWD)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="coatingSelect" className="text-muted-foreground block text-right">الطلاء:</Label>
                    <select
                      id="coatingSelect"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-right"
                      value={coating}
                      onChange={(e) => {
                        setCoating(e.target.value);
                        const option = e.target.options[e.target.selectedIndex];
                        setCoatingPrice(parseFloat(option.getAttribute("data-price") || "0"));
                      }}
                    >
                      <option value="" data-price="0">بدون (0 KWD)</option>
                      <option value="مضاد للانعكاس" data-price="5">مضاد للانعكاس (5 KWD)</option>
                      <option value="حماية شاشة" data-price="7">حماية شاشة (7 KWD)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3) Frame Section */}
              {!skipFrame && (
                <div className="bg-white rounded-lg p-6 border shadow-sm">
                  <div className="border-b border-primary/30 pb-3 mb-4">
                    <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                      <Glasses className="w-5 h-5" />
                      ٣) الإطار
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="frameSearchBox" className="text-muted-foreground block text-right">بحث (Brand/Model/Color/Size):</Label>
                      <div className="flex space-x-2 space-x-reverse">
                        <Input
                          id="frameSearchBox"
                          value={frameSearch}
                          onChange={(e) => setFrameSearch(e.target.value)}
                          placeholder="مثال: RayBan..."
                          className="flex-1 text-right"
                        />
                        <Button onClick={handleFrameSearch} className="gap-1">
                          <Search className="w-4 h-4" />
                          بحث
                        </Button>
                      </div>
                    </div>
                    
                    {frameResults.length > 0 && (
                      <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="p-2 border">Brand</th>
                              <th className="p-2 border">Model</th>
                              <th className="p-2 border">Color</th>
                              <th className="p-2 border">Size</th>
                              <th className="p-2 border">Price (KWD)</th>
                              <th className="p-2 border">Qty</th>
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
                                    <Plus className="w-4 h-4 mr-1" />
                                    اختر
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
                        <h4 className="font-medium text-primary mb-2 flex items-center">
                          <PackageCheck className="w-4 h-4 mr-1" />
                          الإطار المختار
                        </h4>
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="p-1 text-right text-muted-foreground text-sm">Brand</th>
                              <th className="p-1 text-right text-muted-foreground text-sm">Model</th>
                              <th className="p-1 text-right text-muted-foreground text-sm">Color</th>
                              <th className="p-1 text-right text-muted-foreground text-sm">Size</th>
                              <th className="p-1 text-right text-muted-foreground text-sm">Price (KWD)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="p-1 text-right">{selectedFrame.brand}</td>
                              <td className="p-1 text-right">{selectedFrame.model}</td>
                              <td className="p-1 text-right">{selectedFrame.color}</td>
                              <td className="p-1 text-right">{selectedFrame.size}</td>
                              <td className="p-1 text-right">{selectedFrame.price.toFixed(2)}</td>
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
                      <Plus className="w-4 h-4 ml-1" />
                      إضافة إطار جديد
                    </Button>
                    
                    {showManualFrame && (
                      <div className="p-4 border rounded-lg mt-2 bg-muted/10">
                        <h4 className="font-semibold mb-3 text-primary">بيانات الإطار الجديد</h4>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="newBrand" className="text-muted-foreground">Brand:</Label>
                              <Input
                                id="newBrand"
                                value={newBrand}
                                onChange={(e) => setNewBrand(e.target.value)}
                                className="text-right"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="newModel" className="text-muted-foreground">Model:</Label>
                              <Input
                                id="newModel"
                                value={newModel}
                                onChange={(e) => setNewModel(e.target.value)}
                                className="text-right"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="newColor" className="text-muted-foreground">Color:</Label>
                              <Input
                                id="newColor"
                                value={newColor}
                                onChange={(e) => setNewColor(e.target.value)}
                                className="text-right"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="newSize" className="text-muted-foreground">Size:</Label>
                              <Input
                                id="newSize"
                                value={newSize}
                                onChange={(e) => setNewSize(e.target.value)}
                                placeholder="مثال: 51-18-145"
                                className="text-right"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="newPrice" className="text-muted-foreground">Price (KWD):</Label>
                              <Input
                                id="newPrice"
                                type="number"
                                step="0.01"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                className="text-right"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="newQty" className="text-muted-foreground">Qty (عدد القطع):</Label>
                              <Input
                                id="newQty"
                                type="number"
                                step="1"
                                value={newQty}
                                onChange={(e) => setNewQty(e.target.value)}
                                className="text-right"
                              />
                            </div>
                          </div>
                          <Button onClick={handleAddNewFrame} className="w-full">حفظ الإطار</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <ContactLensSelector onSelect={() => {}} />
          )}

          {/* 4) Discount & Deposit - Redesigned with icons */}
          <div className="bg-white rounded-lg p-6 border shadow-sm">
            <div className="border-b border-primary/30 pb-3 mb-4">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <Banknote className="w-5 h-5" />
                ٤) الخصم والدفعة
              </h3>
            </div>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <BadgePercent className="w-5 h-5 text-primary" />
                  </div>
                  <Label htmlFor="discount" className="text-muted-foreground mb-1.5 block text-right">الخصم (د.ك):</Label>
                  <Input
                    id="discount"
                    type="number"
                    step="0.01"
                    value={discount || ""}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="pl-10 border-primary/20 focus:border-primary text-right"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Banknote className="w-5 h-5 text-green-500" />
                  </div>
                  <Label htmlFor="deposit" className="text-muted-foreground mb-1.5 block text-right">الدفعة (د.ك):</Label>
                  <Input
                    id="deposit"
                    type="number"
                    step="0.01"
                    value={deposit || ""}
                    onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)}
                    className="pl-10 border-primary/20 focus:border-primary text-right"
                  />
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handlePayInFull} 
                className="w-full border-primary/20 hover:bg-primary/5 text-primary hover:text-primary/80"
              >
                <Banknote className="w-5 h-5 ml-2 text-green-500" />
                دفع كامل ({total.toFixed(2)} د.ك)
              </Button>
            </div>
          </div>

          {/* 5) Payment Method - Updated with authorization number field */}
          <div className="bg-white rounded-lg p-6 border shadow-sm">
            <div className="border-b border-primary/30 pb-3 mb-4">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                ٥) طريقة الدفع
              </h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div 
                className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                  paymentMethod === "نقداً" 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "hover:border-primary/30 hover:bg-muted/10"
                }`}
                onClick={() => setPaymentMethod("نقداً")}
              >
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/7083/7083125.png" 
                  alt="Cash" 
                  title="Cash"
                  className="w-12 h-10 object-contain mx-auto mb-2"
                />
                <span className="text-sm font-medium">نقداً</span>
              </div>
              
              <div 
                className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                  paymentMethod === "كي نت" 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "hover:border-primary/30 hover:bg-muted/10"
                }`}
                onClick={() => setPaymentMethod("كي نت")}
              >
                <img 
                  src="https://kabkg.com/staticsite/images/knet.png" 
                  alt="KNET" 
                  title="KNET"
                  className="w-12 h-10 object-contain mx-auto mb-2"
                />
                <span className="text-sm font-medium">كي نت</span>
              </div>
              
              <div 
                className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                  paymentMethod === "Visa" 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "hover:border-primary/30 hover:bg-muted/10"
                }`}
                onClick={() => setPaymentMethod("Visa")}
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                  alt="Visa" 
                  title="Visa"
                  className="w-12 h-10 object-contain mx-auto mb-2 bg-white rounded"
                />
                <span className="text-sm font-medium">Visa</span>
              </div>
              
              <div 
                className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                  paymentMethod === "MasterCard" 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "hover:border-primary/30 hover:bg-muted/10"
                }`}
                onClick={() => setPaymentMethod("MasterCard")}
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                  alt="MasterCard" 
                  title="MasterCard"
                  className="w-12 h-10 object-contain mx-auto mb-2 bg-white rounded"
                />
                <span className="text-sm font-medium">MasterCard</span>
              </div>
            </div>
            
            {/* Authorization Number field for card payments */}
            {(paymentMethod === "Visa" || paymentMethod === "MasterCard" || paymentMethod === "كي نت") && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="authNumber" className="text-muted-foreground block text-right">رقم الموافقة (Authorization No.):</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <CardIcon className="w-5 h-5 text-primary" />
                  </div>
                  <Input
                    id="authNumber"
                    value={authNumber}
                    onChange={(e) => setAuthNumber(e.target.value)}
                    placeholder="xxxxxx"
                    className="pl-10 text-right"
                  />
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-between">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handlePrintWorkOrder}
              >
                <Printer className="w-4 h-4" />
                طباعة أمر العمل
              </Button>
              
              <div className="space-x-2 space-x-reverse">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setInvoicePrintOpen(true)}
                >
                  <Receipt className="w-4 h-4" />
                  معاينة الفاتورة
                </Button>
                
                <Button 
                  className="flex items-center gap-2"
                  onClick={handleSaveInvoice}
                >
                  <ExternalLink className="w-4 h-4" />
                  حفظ وطباعة
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Section: Summary - Made sticky */}
        <div className="space-y-5">
          <div className="bg-white rounded-lg p-6 border shadow-sm sticky top-5">
            <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
              <FileText className="w-5 h-5" />
              ملخص الفاتورة
            </h3>
            
            <div className="space-y-3">
              {lensType && (
                <div className="flex justify-between text-right">
                  <span className="text-muted-foreground">العدسة:</span>
                  <span className="font-medium">{lensType}</span>
                </div>
              )}
              
              {lensPrice > 0 && (
                <div className="flex justify-between text-right">
                  <span className="text-muted-foreground">سعر العدسة:</span>
                  <span>{lensPrice.toFixed(2)} د.ك</span>
                </div>
              )}
              
              {coating && (
                <div className="flex justify-between text-right">
                  <span className="text-muted-foreground">الطلاء:</span>
                  <span className="font-medium">{coating}</span>
                </div>
              )}
              
              {coatingPrice > 0 && (
                <div className="flex justify-between text-right">
                  <span className="text-muted-foreground">سعر الطلاء:</span>
                  <span>{coatingPrice.toFixed(2)} د.ك</span>
                </div>
              )}
              
              {!skipFrame && selectedFrame.brand && (
                <>
                  <div className="flex justify-between text-right">
                    <span className="text-muted-foreground">الإطار:</span>
                    <span className="font-medium">{selectedFrame.brand} {selectedFrame.model}</span>
                  </div>
                  <div className="flex justify-between text-right">
                    <span className="text-muted-foreground">سعر الإطار:</span>
                    <span>{selectedFrame.price.toFixed(2)} د.ك</span>
                  </div>
                </>
              )}
              
              {discount > 0 && (
                <div className="flex justify-between text-rose-500 text-right">
                  <span>الخصم:</span>
                  <span>- {discount.toFixed(2)} د.ك</span>
                </div>
              )}
              
              {(paymentMethod === "Visa" || paymentMethod === "MasterCard" || paymentMethod === "كي نت") && authNumber && (
                <div className="flex justify-between text-right">
                  <span className="text-muted-foreground">رقم الموافقة:</span>
                  <span>{authNumber}</span>
                </div>
              )}
              
              <div className="pt-2 border-t">
                <div className="flex justify-between font-bold text-lg text-right">
                  <span>المجموع:</span>
                  <span>{total.toFixed(2)} د.ك</span>
                </div>
                
                {deposit > 0 && (
                  <>
                    <div className="flex justify-between text-green-600 mt-1 text-right">
                      <span>المدفوع:</span>
                      <span>{deposit.toFixed(2)} د.ك</span>
                    </div>
                    
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t text-right">
                      <span>المتبقي:</span>
                      <span>{remaining.toFixed(2)} د.ك</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Work Order Print Sheet */}
      <Sheet open={workOrderPrintOpen} onOpenChange={setWorkOrderPrintOpen}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto print:w-full print:max-w-none">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5" />
              أمر العمل
            </SheetTitle>
            <SheetDescription>
              <Button onClick={handlePrintWorkOrder} className="mt-2">
                <Printer className="w-4 h-4 mr-2" />
                طباعة
              </Button>
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 print:mt-0">
            <WorkOrderPrint 
              invoice={previewInvoice}
              patientName={currentPatient?.name || manualName}
              patientPhone={currentPatient?.phone || manualPhone}
              rx={currentPatient?.rx}
              lensType={lensType}
              coating={coating}
              frame={!skipFrame ? selectedFrame : undefined}
            />
          </div>
          <SheetFooter className="print:hidden mt-4">
            <Button onClick={() => setWorkOrderPrintOpen(false)}>إغلاق</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Invoice Print Sheet */}
      <Sheet open={invoicePrintOpen} onOpenChange={setInvoicePrintOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto print:w-full print:max-w-none">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              الفاتورة
            </SheetTitle>
            <SheetDescription>
              <Button onClick={handlePrintInvoice} className="mt-2">
                <Printer className="w-4 h-4 mr-2" />
                طباعة
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
            <Button onClick={() => setInvoicePrintOpen(false)}>إغلاق</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CreateInvoice;
