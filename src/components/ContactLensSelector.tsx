import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Contact as ContactIcon, Eye, ShoppingCart, Plus, Filter, Check, Glasses } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ContactLensItem {
  id: string;
  brand: string;
  type: string;
  bc: string; // Base curve
  diameter: string;
  power: string;
  price: number;
  qty: number;
}

interface ContactLensSelection {
  rightEye: ContactLensItem | null;
  leftEye: ContactLensItem | null;
  sameForBoth: boolean;
}

interface ContactLensSelectorProps {
  onSelect: (selection: ContactLensSelection) => void;
}

const mockContactLenses: ContactLensItem[] = [
  {
    id: "cl1",
    brand: "Acuvue",
    type: "Daily",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 25,
    qty: 30
  },
  {
    id: "cl2",
    brand: "Acuvue",
    type: "Daily",
    bc: "8.5",
    diameter: "14.2",
    power: "-1.50",
    price: 25,
    qty: 15
  },
  {
    id: "cl3",
    brand: "Biofinty",
    type: "Monthly",
    bc: "8.6",
    diameter: "14.0",
    power: "-3.00",
    price: 20,
    qty: 12
  },
  {
    id: "cl4",
    brand: "Air Optix",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "+1.50",
    price: 22,
    qty: 8
  }
];

export const ContactLensSelector: React.FC<ContactLensSelectorProps> = ({ onSelect }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ContactLensItem[]>([]);
  const [selection, setSelection] = useState<ContactLensSelection>({
    rightEye: null,
    leftEye: null,
    sameForBoth: false
  });
  
  const [rightEyePower, setRightEyePower] = useState("");
  const [leftEyePower, setLeftEyePower] = useState("");
  const [rightEyeBC, setRightEyeBC] = useState("");
  const [leftEyeBC, setLeftEyeBC] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const handleSearch = () => {
    let filtered = mockContactLenses;
    
    if (search) {
      filtered = filtered.filter(lens => 
        lens.brand.toLowerCase().includes(search.toLowerCase()) ||
        lens.type.toLowerCase().includes(search.toLowerCase()) ||
        lens.power.includes(search)
      );
    }
    
    if (selectedBrand) {
      filtered = filtered.filter(lens => lens.brand === selectedBrand);
    }
    
    if (rightEyePower && !leftEyePower) {
      filtered = filtered.filter(lens => lens.power === rightEyePower);
    }
    
    setResults(filtered);
    
    if (filtered.length === 0) {
      toast({
        description: "لم يتم العثور على عدسات مطابقة للبحث",
        variant: "destructive"
      });
    }
  };

  const handleSelectLens = (lens: ContactLensItem, eye: "right" | "left") => {
    if (eye === "right") {
      setSelection({
        ...selection,
        rightEye: lens,
        leftEye: selection.sameForBoth ? lens : selection.leftEye
      });
    } else {
      setSelection({
        ...selection,
        leftEye: lens,
        rightEye: selection.sameForBoth ? lens : selection.rightEye
      });
    }
    
    onSelect({
      ...selection,
      [eye === "right" ? "rightEye" : "leftEye"]: lens,
      [eye === "right" ? "leftEye" : "rightEye"]: selection.sameForBoth ? lens : (eye === "right" ? selection.leftEye : selection.rightEye)
    });
  };

  const handleSameForBoth = (checked: boolean) => {
    setSelection({
      ...selection,
      sameForBoth: checked,
      leftEye: checked && selection.rightEye ? selection.rightEye : selection.leftEye
    });
  };

  const brands = [...new Set(mockContactLenses.map(lens => lens.brand))];
  
  return (
    <div className="space-y-6 bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex items-center gap-2 pb-4 border-b">
        <ContactIcon className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold">العدسات اللاصقة</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Left Eye Section */}
        <div className="border rounded-lg p-4 bg-muted/5 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-4 text-primary">
            <Eye className="w-5 h-5" />
            <h4 className="font-semibold">العين اليسرى (OS)</h4>
          </div>
          <Separator className="my-3" />
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Power:</Label>
              <select 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                value={leftEyePower}
                onChange={(e) => setLeftEyePower(e.target.value)}
              >
                <option value="">اختر القوة</option>
                {Array.from({ length: 41 }, (_, i) => (i - 20) / 4).map(power => (
                  <option key={power} value={power.toFixed(2)}>{power.toFixed(2)}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="mb-2 block">Base Curve:</Label>
              <select 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                value={leftEyeBC}
                onChange={(e) => setLeftEyeBC(e.target.value)}
              >
                <option value="">BC اختر</option>
                <option value="8.4">8.4</option>
                <option value="8.6">8.6</option>
                <option value="8.8">8.8</option>
              </select>
            </div>
            {selection.leftEye && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="font-semibold text-green-700">{selection.leftEye.brand} - {selection.leftEye.type}</p>
                <p className="text-sm text-green-600">Power: {selection.leftEye.power} | BC: {selection.leftEye.bc}</p>
                <p className="text-sm text-green-600">Price: {selection.leftEye.price} KWD</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Eye Section */}
        <div className="border rounded-lg p-4 bg-muted/5 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-4 text-primary">
            <Eye className="w-5 h-5" />
            <h4 className="font-semibold">العين اليمنى (OD)</h4>
          </div>
          <Separator className="my-3" />
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Power:</Label>
              <select 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                value={rightEyePower}
                onChange={(e) => setRightEyePower(e.target.value)}
              >
                <option value="">اختر القوة</option>
                {Array.from({ length: 41 }, (_, i) => (i - 20) / 4).map(power => (
                  <option key={power} value={power.toFixed(2)}>{power.toFixed(2)}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="mb-2 block">Base Curve:</Label>
              <select 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                value={rightEyeBC}
                onChange={(e) => setRightEyeBC(e.target.value)}
              >
                <option value="">BC اختر</option>
                <option value="8.4">8.4</option>
                <option value="8.6">8.6</option>
                <option value="8.8">8.8</option>
              </select>
            </div>
            {selection.rightEye && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="font-semibold text-green-700">{selection.rightEye.brand} - {selection.rightEye.type}</p>
                <p className="text-sm text-green-600">Power: {selection.rightEye.power} | BC: {selection.rightEye.bc}</p>
                <p className="text-sm text-green-600">Price: {selection.rightEye.price} KWD</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 p-2 bg-muted/10 rounded-md">
        <input
          type="checkbox"
          id="sameForBoth"
          checked={selection.sameForBoth}
          onChange={(e) => handleSameForBoth(e.target.checked)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="sameForBoth" className="cursor-pointer">استخدام نفس العدسات للعينين</Label>
      </div>
      
      <div className="py-4 border-t border-b my-4">
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex-1">
            <Label className="mb-2 block">البراند:</Label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">جميع البراندات</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div className="flex-[2]">
            <Label className="mb-2 block">بحث:</Label>
            <div className="flex gap-2">
              <Input
                placeholder="ابحث عن العدسات اللاصقة..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} className="gap-1">
                <Filter className="w-4 h-4" />
                بحث
              </Button>
            </div>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div className="border rounded-lg overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-right">Brand</th>
                  <th className="p-2 text-right">Type</th>
                  <th className="p-2 text-right">BC</th>
                  <th className="p-2 text-right">Diameter</th>
                  <th className="p-2 text-right">Power</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Qty</th>
                  <th className="p-2 text-right">للعين اليسرى</th>
                  <th className="p-2 text-right">للعين اليمنى</th>
                </tr>
              </thead>
              <tbody>
                {results.map((lens) => (
                  <tr key={lens.id} className="hover:bg-muted/50 border-t">
                    <td className="p-2">{lens.brand}</td>
                    <td className="p-2">{lens.type}</td>
                    <td className="p-2">{lens.bc}</td>
                    <td className="p-2">{lens.diameter}</td>
                    <td className="p-2">{lens.power}</td>
                    <td className="p-2">{lens.price} KWD</td>
                    <td className="p-2">{lens.qty}</td>
                    <td className="p-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSelectLens(lens, "left")}
                        className="gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        اختر
                      </Button>
                    </td>
                    <td className="p-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSelectLens(lens, "right")}
                        className="gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        اختر
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {selection.leftEye || selection.rightEye ? (
        <div className="mt-4 p-4 bg-primary/5 border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              ملخص العدسات المختارة
            </h4>
            <span className="font-bold text-lg">
              {((selection.leftEye?.price || 0) + (selection.rightEye?.price || 0)).toFixed(2)} KWD
            </span>
          </div>
          
          <Button className="w-full">
            إضافة للفاتورة
          </Button>
        </div>
      ) : null}
    </div>
  );
};
