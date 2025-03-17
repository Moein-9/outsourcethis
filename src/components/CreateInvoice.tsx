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
              <option value="Weekly">Weekly</
