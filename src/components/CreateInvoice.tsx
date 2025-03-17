import React, { useState, useEffect } from "react";
import { usePatientStore } from "@/store/patientStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { useInvoiceStore } from "@/store/invoiceStore";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ContactLensSelector } from "@/components/ContactLensSelector";
import { ReceiptInvoice } from "@/components/ReceiptInvoice";
import { WorkOrderPrint } from "@/components/WorkOrderPrint";

const CreateInvoice: React.FC = () => {
  const searchPatients = usePatientStore((state) => state.searchPatients);
  const searchFrames = useInventoryStore((state) => state.searchFrames);
  const addFrame = useInventoryStore((state) => state.addFrame);
  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  
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
  
  // Print states
  const [invoicePrintOpen, setInvoicePrintOpen] = useState(false);
  const [workOrderPrintOpen, setWorkOrderPrintOpen] = useState(false);
  
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
    
    if (!lensType) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار نوع العدسة.",
        variant: "destructive"
      });
      return;
    }
    
    if (!skipFrame && (!selectedFrame.brand || !selectedFrame.model)) {
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
      
      paymentMethod
    };
    
    const invoiceId = addInvoice(invoiceData);
    
    toast({
      title: "تم الحفظ",
      description: `تم حفظ الفاتورة برقم ${invoiceId} بنجاح.`,
    });
    
    // Reset form
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
  };
  
  const [invoiceType, setInvoiceType] = useState<"glasses" | "contacts">("glasses");
  
  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">إنشاء فاتورة</h2>
        <div className="flex gap-2">
          <Button
            variant={invoiceType === "glasses" ? "default" : "outline"}
            onClick={() => setInvoiceType("glasses")}
          >
            نظارات
          </Button>
          <Button
            variant={invoiceType === "contacts" ? "default" : "outline"}
            onClick={() => setInvoiceType("contacts")}
          >
            عدسات لاصقة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1) Patient Search or Skip */}
          <div className="bg-card rounded-md p-4 border">
            <div className="flex justify-between items-center border-b border-primary pb-2 mb-4">
              <h3 className="text-lg font-semibold text-primary">١) البحث برقم الهاتف أو تخطي</h3>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox 
                  id="skipPatientCheck" 
                  checked={skipPatient} 
                  onCheckedChange={(checked) => setSkipPatient(checked === true)} 
                />
                <Label 
                  htmlFor="skipPatientCheck" 
                  className="font-normal text-sm"
                >
                  لا يوجد ملف عميل
                </Label>
              </div>
            </div>
            
            {!skipPatient ? (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientSearch">رقم الهاتف:</Label>
                    <div className="flex space-x-2 space-x-reverse">
                      <Input
                        id="patientSearch"
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        placeholder="اكتب للبحث..."
                      />
                      <Button onClick={handlePatientSearch}>بحث</Button>
                    </div>
                  </div>
                  
                  {patientResults.length > 0 && (
                    <div className="border rounded-md divide-y">
                      {patientResults.map((patient) => (
                        <div 
                          key={patient.patientId}
                          className="p-2 cursor-pointer hover:bg-muted"
                          onClick={() => selectPatient(patient)}
                        >
                          {patient.name} - ({patient.phone})
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {currentPatient && (
                    <div className="mt-4">
                      <div className="border-2 border-primary rounded-md p-2 bg-primary/5">
                        <strong>اسم العميل:</strong> {currentPatient.name}<br />
                        <strong>الهاتف:</strong> {currentPatient.phone}<br />
                        <strong>Patient ID:</strong> {currentPatient.patientId || "N/A"}
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="mt-2" 
                        onClick={() => setRxVisible(!rxVisible)}
                      >
                        {rxVisible ? "إخفاء الوصفة" : "عرض الوصفة"}
                      </Button>
                      
                      {rxVisible && currentPatient.rx && (
                        <div className="p-2 mt-2 bg-white border rounded-md">
                          <table className="w-full border-collapse ltr">
                            <thead>
                              <tr className="bg-muted">
                                <th className="p-1 border">العين</th>
                                <th className="p-1 border">Sphere</th>
                                <th className="p-1 border">Cyl</th>
                                <th className="p-1 border">Axis</th>
                                <th className="p-1 border">Add</th>
                                <th className="p-1 border">PD</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="p-1 border font-bold">OD (يمين)</td>
                                <td className="p-1 border">{currentPatient.rx.sphereOD || "—"}</td>
                                <td className="p-1 border">{currentPatient.rx.cylOD || "—"}</td>
                                <td className="p-1 border">{currentPatient.rx.axisOD || "—"}</td>
                                <td className="p-1 border">{currentPatient.rx.addOD || "—"}</td>
                                <td className="p-1 border">{currentPatient.rx.pdRight || "—"}</td>
                              </tr>
                              <tr>
                                <td className="p-1 border font-bold">OS (يسار)</td>
                                <td className="p-1 border">{currentPatient.rx.sphereOS || "—"}</td>
                                <td className="p-1 border">{currentPatient.rx.cylOS || "—"}</td>
                                <td className="p-1 border">{currentPatient.rx.axisOS || "—"}</td>
                                <td className="p-1 border">{currentPatient.rx.addOS || "—"}</td>
                                <td className="p-1 border">{currentPatient.rx.pdLeft || "—"}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="manualName">اسم العميل (اختياري):</Label>
                  <Input
                    id="manualName"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manualPhone">هاتف العميل (اختياري):</Label>
                  <Input
                    id="manualPhone"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {invoiceType === "glasses" ? (
            <>
              {/* 2) Lenses & Coating */}
              <div className="bg-card rounded-md p-4 border">
                <div className="flex justify-between items-center border-b border-primary pb-2 mb-4">
                  <h3 className="text-lg font-semibold text-primary">٢) العدسات</h3>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox 
                      id="skipFrameCheck" 
                      checked={skipFrame} 
                      onCheckedChange={(checked) => setSkipFrame(checked === true)} 
                    />
                    <Label 
                      htmlFor="skipFrameCheck" 
                      className="font-normal text-sm"
                    >
                      عدسات فقط (بدون إطار)
                    </Label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lensType">نوع العدسة:</Label>
                    <select
                      id="lensType"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
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
                    <Label htmlFor="coatingSelect">الطلاء:</Label>
                    <select
                      id="coatingSelect"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
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
                <div className="bg-card rounded-md p-4 border">
                  <div className="border-b border-primary pb-2 mb-4">
                    <h3 className="text-lg font-semibold text-primary">٣) الإطار</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="frameSearchBox">بحث (Brand/Model/Color/Size):</Label>
                      <div className="flex space-x-2 space-x-reverse">
                        <Input
                          id="frameSearchBox"
                          value={frameSearch}
                          onChange={(e) => setFrameSearch(e.target.value)}
                          placeholder="مثال: RayBan..."
                        />
                        <Button onClick={handleFrameSearch}>بحث</Button>
                      </div>
                    </div>
                    
                    {frameResults.length > 0 && (
                      <div className="overflow-x-auto border rounded-md">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-muted">
                              <th className="p-2 border">Brand</th>
                              <th className="p-2 border">Model</th>
                              <th className="p-2 border">Color</th>
                              <th className="p-2 border">Size</th>
                              <th className="p-2 border">Price (KWD)</th>
                              <th className="p-2 border">Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {frameResults.map((frame, index) => (
                              <tr 
                                key={index}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => selectFrame(frame)}
                              >
                                <td className="p-2 border">{frame.brand}</td>
                                <td className="p-2 border">{frame.model}</td>
                                <td className="p-2 border">{frame.color}</td>
                                <td className="p-2 border">{frame.size}</td>
                                <td className="p-2 border">{frame.price.toFixed(2)}</td>
                                <td className="p-2 border">{frame.qty}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    
                    {selectedFrame.brand && (
                      <div className="mt-4 p-2 border rounded-md">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="p-1">Brand</th>
                              <th className="p-1">Model</th>
                              <th className="p-1">Color</th>
                              <th className="p-1">Size</th>
                              <th className="p-1">Price (KWD)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="p-1">{selectedFrame.brand}</td>
                              <td className="p-1">{selectedFrame.model}</td>
                              <td className="p-1">{selectedFrame.color}</td>
                              <td className="p-1">{selectedFrame.size}</td>
                              <td className="p-1">{selectedFrame.price.toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setShowManualFrame(!showManualFrame)}
                    >
                      إضافة إطار جديد
                    </Button>
                    
                    {showManualFrame && (
                      <div className="p-3 border rounded-md mt-2 bg-card">
                        <h4 className="font-semibold mb-3">بيانات الإطار الجديد</h4>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="newBrand">Brand:</Label>
                            <Input
                              id="newBrand"
                              value={newBrand}
                              onChange={(e) => setNewBrand(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="newModel">Model:</Label>
                            <Input
                              id="newModel"
                              value={newModel}
                              onChange={(e) => setNewModel(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="newColor">Color:</Label>
                            <Input
                              id="newColor"
                              value={newColor}
                              onChange={(e) => setNewColor(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="newSize">Size:</Label>
                            <Input
                              id="newSize"
                              value={newSize}
                              onChange={(e) => setNewSize(e.target.value)}
                              placeholder="مثال: 51-18-145"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="newPrice">Price (KWD):</Label>
                            <Input
                              id="newPrice"
                              type="number"
                              step="0.01"
                              value={newPrice}
                              onChange={(e) => setNewPrice(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="newQty">Qty (عدد القطع):</Label>
                            <Input
                              id="newQty"
                              type="number"
                              step="1"
                              value={newQty}
                              onChange={(e) => setNewQty(e.target.value)}
                            />
                          </div>
                          <Button onClick={handleAddNewFrame}>حفظ الإطار</Button>
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

          {/* 4) Discount & Deposit */}
          <div className="bg-card rounded-md p-4 border">
            <div className="border-b border-primary pb-2 mb-4">
              <h3 className="text-lg font-semibold text-primary">٤) الخصم والدفعة</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="discount">الخصم (د.ك):</Label>
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  value={discount || ""}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deposit">الدفعة (د.ك):</Label>
                <Input
                  id="deposit"
                  type="number"
                  step="0.01"
                  value={deposit || ""}
                  onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <Button variant="outline" onClick={handlePayInFull}>دفع كامل</Button>
            </div>
          </div>

          {/* 5) Payment Method */}
          <div className="bg-card rounded-md p-4 border">
            <div className="border-b border-primary pb-2 mb-4">
              <h3 className="text-lg font-semibold text-primary">٥) طريقة الدفع</h3>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/7083/7083125.png" 
                alt="Cash" 
                title="Cash"
                className={`w-14 h-10 object-contain rounded cursor-pointer border-2 ${paymentMethod === "نقداً" ? "border-primary opacity-100" : "border-transparent opacity-70"} hover:opacity-100 transition-all`}
                onClick={() => setPaymentMethod("نقداً")}
              />
              <img 
                src="https://kabkg.com/staticsite/images/knet.png" 
                alt="KNET" 
                title="KNET"
                className={`w-14 h-10 object-contain rounded cursor-pointer border-2 ${paymentMethod === "كي نت" ? "border-primary opacity-100" : "border-transparent opacity-70"} hover:opacity-100 transition-all`}
                onClick={() => setPaymentMethod("كي نت")}
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                alt="Visa" 
                title="Visa"
                className={`w-14 h-10 object-contain rounded cursor-pointer border-2 bg-white ${paymentMethod === "Visa" ? "border-primary opacity-100" : "border-transparent opacity-70"} hover:opacity-100 transition-all`}
                onClick={() => setPaymentMethod("Visa")}
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                alt="MasterCard" 
                title="MasterCard"
                className={`w-14 h-10 object-contain rounded cursor-pointer border-2 ${paymentMethod === "MasterCard" ? "border-primary opacity-100" : "border-transparent opacity-70"} hover:opacity-100 transition-all`}
                onClick={() => setPaymentMethod("MasterCard")}
              />
            </div>
          </div>
        </div>

        {/* Right Section: Invoice Summary */}
        <div className="bg-card rounded-md border p-4 h-fit sticky top-24">
          <div className="text-center font-semibold text-lg border-b border-primary pb-2 mb-4">
            ملخص الفاتورة
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>سعر العدسة:</span>
              <span>{lensPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>سعر الطلاء:</span>
              <span>{coatingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>سعر الإطار:</span>
              <span>{frameTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>الخصم:</span>
              <span>{discount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between mt-2 pt-2 border-t font-semibold">
              <span>المجموع:</span>
              <span>{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>الدفعة:</span>
              <span>{deposit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>المتبقي:</span>
              <span>{remaining.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>طريقة الدفع:</span>
              <span>{paymentMethod || "غير محدد"}</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 mt-6">
            <Button onClick={handleSaveInvoice}>حفظ</Button>
            <Button 
              variant="outline" 
              onClick={() => setInvoicePrintOpen(true)}
            >
              طباعة الفاتورة
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setWorkOrderPrintOpen(true)}
            >
              طباعة أمر العمل
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Print Sheet */}
      <Sheet open={invoicePrintOpen} onOpenChange={setInvoicePrintOpen}>
        <SheetContent className="w-full sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle className="text-center">فاتورة بيع</SheetTitle>
          </SheetHeader>
          
          {/* Use our new ReceiptInvoice component */}
          <ReceiptInvoice 
            invoice={{
              invoiceId: "INV123",
              patientName: currentPatient ? currentPatient.name : manualName,
              patientPhone: currentPatient ? currentPatient.phone : manualPhone,
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
              remaining,
              paymentMethod,
              createdAt: new Date().toISOString(),
              isPaid: remaining === 0
            }}
            isPrintable
          />
          
          <div className="flex justify-center space-x-2 space-x-reverse mt-6">
            <Button onClick={() => window.print()}>طباعة</Button>
            <Button variant="outline" onClick={() => setInvoicePrintOpen(false)}>إغلاق</Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Work Order Print Sheet */}
      <Sheet open={workOrderPrintOpen} onOpenChange={setWorkOrderPrintOpen}>
        <SheetContent className="w-full sm:max-w-[800px]">
          <SheetHeader>
            <SheetTitle className="text-center">أمر العمل</SheetTitle>
          </SheetHeader>
          
          <WorkOrderPrint 
            invoice={{
              invoiceId: "INV123",
              patientName: currentPatient ? currentPatient.name : manualName,
              patientPhone: currentPatient ? currentPatient.phone : manualPhone,
              patientId: currentPatient?.patientId,
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
              remaining,
              paymentMethod,
              createdAt: new Date().toISOString(),
              isPaid: remaining === 0
            }}
          />
          
          <div className="flex justify-center space-x-2 space-x-reverse mt-6">
            <Button onClick={()
