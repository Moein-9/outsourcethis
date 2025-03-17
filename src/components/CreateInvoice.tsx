
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactLensSelector } from "@/components/ContactLensSelector";
import { ReceiptInvoice } from "@/components/ReceiptInvoice";
import { WorkOrderPrint } from "@/components/WorkOrderPrint";
import { 
  User, Glasses, Package, Receipt, CreditCard, Eye, Search, 
  Banknote, Plus, PackageCheck, EyeOff, ExternalLink,
  ClipboardCheck, BadgePercent, DollarSign, Printer, CreditCard as CardIcon
} from "lucide-react";

// New component for contact lens form
const ContactLensForm = () => {
  const [leftEye, setLeftEye] = useState({
    power: "-",
    bc: "-",
    dia: "14.4",
    axis: "-",
    cylinder: "-"
  });

  const [rightEye, setRightEye] = useState({
    power: "-",
    bc: "-",
    dia: "14.4",
    axis: "-",
    cylinder: "-"
  });

  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm">
      <div className="border-b border-primary/30 pb-3 mb-6">
        <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
          <Eye className="w-5 h-5" />
          عدسات لاصقة (مواصفات)
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6">
        <div className="space-y-5">
          <h4 className="font-medium text-primary border-b pb-1">العين اليمنى (OD)</h4>

          <div className="space-y-1">
            <Label className="text-muted-foreground">POWER / SPHERE</Label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={rightEye.power}
              onChange={(e) => setRightEye({...rightEye, power: e.target.value})}
            >
              <option value="-">-</option>
              <option value="-0.50">-0.50</option>
              <option value="-1.00">-1.00</option>
              <option value="-1.50">-1.50</option>
              <option value="-2.00">-2.00</option>
              <option value="-2.50">-2.50</option>
              <option value="-3.00">-3.00</option>
              <option value="-3.50">-3.50</option>
              <option value="-4.00">-4.00</option>
              <option value="-4.50">-4.50</option>
              <option value="-5.00">-5.00</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground">BC</Label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={rightEye.bc}
              onChange={(e) => setRightEye({...rightEye, bc: e.target.value})}
            >
              <option value="-">-</option>
              <option value="8.4">8.4</option>
              <option value="8.5">8.5</option>
              <option value="8.6">8.6</option>
              <option value="8.7">8.7</option>
              <option value="8.8">8.8</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground">DIA</Label>
            <Input 
              type="text" 
              value={rightEye.dia} 
              onChange={(e) => setRightEye({...rightEye, dia: e.target.value})}
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground">AXIS</Label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={rightEye.axis}
              onChange={(e) => setRightEye({...rightEye, axis: e.target.value})}
            >
              <option value="-">-</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="60">60</option>
              <option value="70">70</option>
              <option value="80">80</option>
              <option value="90">90</option>
              <option value="100">100</option>
              <option value="110">110</option>
              <option value="120">120</option>
              <option value="130">130</option>
              <option value="140">140</option>
              <option value="150">150</option>
              <option value="160">160</option>
              <option value="170">170</option>
              <option value="180">180</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground">CYLINDER</Label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={rightEye.cylinder}
              onChange={(e) => setRightEye({...rightEye, cylinder: e.target.value})}
            >
              <option value="-">-</option>
              <option value="-0.75">-0.75</option>
              <option value="-1.25">-1.25</option>
              <option value="-1.75">-1.75</option>
              <option value="-2.25">-2.25</option>
            </select>
          </div>
        </div>

        <div className="space-y-5">
          <h4 className="font-medium text-primary border-b pb-1">العين اليسرى (OS)</h4>
          
          <div className="space-y-1">
            <Label className="text-muted-foreground">POWER / SPHERE</Label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={leftEye.power}
              onChange={(e) => setLeftEye({...leftEye, power: e.target.value})}
            >
              <option value="-">-</option>
              <option value="-0.50">-0.50</option>
              <option value="-1.00">-1.00</option>
              <option value="-1.50">-1.50</option>
              <option value="-2.00">-2.00</option>
              <option value="-2.50">-2.50</option>
              <option value="-3.00">-3.00</option>
              <option value="-3.50">-3.50</option>
              <option value="-4.00">-4.00</option>
              <option value="-4.50">-4.50</option>
              <option value="-5.00">-5.00</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground">BC</Label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={leftEye.bc}
              onChange={(e) => setLeftEye({...leftEye, bc: e.target.value})}
            >
              <option value="-">-</option>
              <option value="8.4">8.4</option>
              <option value="8.5">8.5</option>
              <option value="8.6">8.6</option>
              <option value="8.7">8.7</option>
              <option value="8.8">8.8</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground">DIA</Label>
            <Input 
              type="text" 
              value={leftEye.dia} 
              onChange={(e) => setLeftEye({...leftEye, dia: e.target.value})}
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground">AXIS</Label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={leftEye.axis}
              onChange={(e) => setLeftEye({...leftEye, axis: e.target.value})}
            >
              <option value="-">-</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="60">60</option>
              <option value="70">70</option>
              <option value="80">80</option>
              <option value="90">90</option>
              <option value="100">100</option>
              <option value="110">110</option>
              <option value="120">120</option>
              <option value="130">130</option>
              <option value="140">140</option>
              <option value="150">150</option>
              <option value="160">160</option>
              <option value="170">170</option>
              <option value="180">180</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground">CYLINDER</Label>
            <select 
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={leftEye.cylinder}
              onChange={(e) => setLeftEye({...leftEye, cylinder: e.target.value})}
            >
              <option value="-">-</option>
              <option value="-0.75">-0.75</option>
              <option value="-1.25">-1.25</option>
              <option value="-1.75">-1.75</option>
              <option value="-2.25">-2.25</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-medium text-primary">ماركة العدسات</Label>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2">
              <option value="">اختر الماركة</option>
              <option value="Acuvue">Acuvue</option>
              <option value="Air Optix">Air Optix</option>
              <option value="Bausch & Lomb">Bausch & Lomb</option>
              <option value="Biofinity">Biofinity</option>
              <option value="FreshLook">FreshLook</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="font-medium text-primary">نوع العدسات</Label>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2">
              <option value="">اختر النوع</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateInvoice = () => {
  const { addInvoice } = useInvoiceStore();
  const { patients } = usePatientStore();
  const { frames } = useInventoryStore(); // Fixed: use frames instead of inventory

  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [invoiceType, setInvoiceType] = useState("glasses");
  const [lensType, setLensType] = useState("");
  const [lensPrice, setLensPrice] = useState(0);
  const [coating, setCoating] = useState("");
  const [coatingPrice, setCoatingPrice] = useState(0);
  const [frameBrand, setFrameBrand] = useState("");
  const [frameModel, setFrameModel] = useState("");
  const [framePrice, setFramePrice] = useState(0);
  const [frameColor, setFrameColor] = useState(""); // Added frameColor state
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [authNumber, setAuthNumber] = useState("");
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Calculate total and remaining amounts
    const calculatedTotal = lensPrice + coatingPrice + framePrice - discount;
    setTotal(calculatedTotal);
    const calculatedRemaining = calculatedTotal - deposit;
    setRemaining(calculatedRemaining);
  }, [lensPrice, coatingPrice, framePrice, discount, deposit]);

  const handleCreateInvoice = () => {
    if (!selectedPatient) {
      toast({
        title: "Error",
        description: "Please select a patient.",
        variant: "destructive",
      });
      return;
    }

    const newInvoice = {
      invoiceId: Math.random().toString(36).substring(7),
      patientName: selectedPatient.name,
      patientPhone: selectedPatient.phone,
      invoiceType,
      lensType,
      lensPrice,
      coating,
      coatingPrice,
      frameBrand,
      frameModel,
      frameColor, // Added frameColor to match the Invoice type
      framePrice,
      discount,
      total,
      deposit,
      remaining,
      paymentMethod,
      authNumber,
      createdAt: new Date(),
    };

    addInvoice(newInvoice);
    toast({
      title: "Success",
      description: "Invoice created successfully.",
    });
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Create Invoice</Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent dir="rtl">
          <SheetHeader>
            <SheetTitle>Create Invoice</SheetTitle>
          </SheetHeader>

          <Tabs defaultValue="glasses" className="mt-4">
            <TabsList>
              <TabsTrigger value="glasses" onClick={() => setInvoiceType("glasses")}>
                <Glasses className="mr-2 h-4 w-4" />
                نظارات
              </TabsTrigger>
              <TabsTrigger value="contact-lens" onClick={() => setInvoiceType("contact-lens")}>
                <Eye className="mr-2 h-4 w-4" />
                عدسات لاصقة
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="glasses">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patient">اختر عميل</Label>
                    <select
                      id="patient"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={(e) => {
                        const patient = patients.find((p) => p.patientId === e.target.value);
                        setSelectedPatient(patient);
                      }}
                    >
                      <option value="">اختر عميل</option>
                      {patients.map((patient) => (
                        <option key={patient.patientId} value={patient.patientId}>
                          {patient.name} - {patient.phone}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="lensType">نوع العدسة</Label>
                    <Input
                      type="text"
                      id="lensType"
                      value={lensType}
                      onChange={(e) => setLensType(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lensPrice">سعر العدسة</Label>
                    <Input
                      type="number"
                      id="lensPrice"
                      value={lensPrice}
                      onChange={(e) => setLensPrice(parseFloat(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="coating">الطلاء</Label>
                    <Input
                      type="text"
                      id="coating"
                      value={coating}
                      onChange={(e) => setCoating(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="coatingPrice">سعر الطلاء</Label>
                    <Input
                      type="number"
                      id="coatingPrice"
                      value={coatingPrice}
                      onChange={(e) => setCoatingPrice(parseFloat(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="frameBrand">ماركة الإطار</Label>
                    <Input
                      type="text"
                      id="frameBrand"
                      value={frameBrand}
                      onChange={(e) => setFrameBrand(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frameModel">موديل الإطار</Label>
                    <Input
                      type="text"
                      id="frameModel"
                      value={frameModel}
                      onChange={(e) => setFrameModel(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="framePrice">سعر الإطار</Label>
                    <Input
                      type="number"
                      id="framePrice"
                      value={framePrice}
                      onChange={(e) => setFramePrice(parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frameColor">لون الإطار</Label>
                    <Input
                      type="text"
                      id="frameColor"
                      value={frameColor}
                      onChange={(e) => setFrameColor(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="discount">الخصم</Label>
                    <Input
                      type="number"
                      id="discount"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="total">المجموع</Label>
                    <Input
                      type="number"
                      id="total"
                      value={total}
                      readOnly
                    />
                  </div>

                  <div>
                    <Label htmlFor="deposit">المقدم</Label>
                    <Input
                      type="number"
                      id="deposit"
                      value={deposit}
                      onChange={(e) => setDeposit(parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="remaining">المتبقي</Label>
                    <Input
                      type="number"
                      id="remaining"
                      value={remaining}
                      readOnly
                    />
                  </div>

                  <div>
                    <Label htmlFor="paymentMethod">طريقة الدفع</Label>
                    <select
                      id="paymentMethod"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="knet">KNET</option>
                    </select>
                  </div>
                </div>

                {paymentMethod !== 'cash' && (
                  <div>
                    <Label htmlFor="authNumber">رقم التفويض</Label>
                    <Input
                      type="text"
                      id="authNumber"
                      value={authNumber}
                      onChange={(e) => setAuthNumber(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="contact-lens">
              <ContactLensForm />
            </TabsContent>
          </Tabs>

          <Button onClick={handleCreateInvoice}>انشاء الفاتورة</Button>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CreateInvoice;
