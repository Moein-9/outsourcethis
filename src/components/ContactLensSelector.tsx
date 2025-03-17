
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Contact as ContactIcon, Eye, ShoppingCart, Plus, Filter, Check, Glasses } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  items: ContactLensItem[];
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
  const [selectedLenses, setSelectedLenses] = useState<ContactLensItem[]>([]);
  
  const [powerFilter, setPowerFilter] = useState("");
  const [bcFilter, setBcFilter] = useState("");
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
    
    if (powerFilter) {
      filtered = filtered.filter(lens => lens.power === powerFilter);
    }
    
    if (bcFilter) {
      filtered = filtered.filter(lens => lens.bc === bcFilter);
    }
    
    setResults(filtered);
    
    if (filtered.length === 0) {
      toast({
        description: "لم يتم العثور على عدسات مطابقة للبحث",
        variant: "destructive"
      });
    }
  };

  const handleSelectLens = (lens: ContactLensItem) => {
    // Check if this lens is already selected
    const alreadySelected = selectedLenses.some(item => item.id === lens.id);
    
    if (alreadySelected) {
      toast({
        description: "هذه العدسة مضافة بالفعل",
      });
      return;
    }
    
    const updatedSelection = [...selectedLenses, lens];
    setSelectedLenses(updatedSelection);
    
    onSelect({
      items: updatedSelection
    });
    
    toast({
      description: `تمت إضافة ${lens.brand} ${lens.type} بنجاح`,
    });
  };

  const handleRemoveLens = (lensId: string) => {
    const updatedSelection = selectedLenses.filter(lens => lens.id !== lensId);
    setSelectedLenses(updatedSelection);
    
    onSelect({
      items: updatedSelection
    });
  };

  const brands = [...new Set(mockContactLenses.map(lens => lens.brand))];
  const powers = [...new Set(mockContactLenses.map(lens => lens.power))];
  const baseCurves = [...new Set(mockContactLenses.map(lens => lens.bc))];
  
  // Calculate total price of selected lenses
  const totalPrice = selectedLenses.reduce((sum, lens) => sum + lens.price, 0);
  
  return (
    <div className="space-y-6 rounded-lg">
      <div className="flex items-center justify-between gap-2 pb-4 mb-2 border-b">
        <div className="flex items-center gap-2">
          <ContactIcon className="w-6 h-6 text-amber-500" />
          <h3 className="text-xl font-bold">العدسات اللاصقة</h3>
        </div>
        
        {selectedLenses.length > 0 && (
          <Badge variant="outline" className="px-3 py-1.5 text-base bg-amber-50 text-amber-700 border-amber-200">
            {selectedLenses.length} عدسة مختارة
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Lens RX Card */}
        <Card className="border-amber-200 overflow-hidden">
          <CardHeader className="bg-amber-50 border-b border-amber-200 py-3">
            <CardTitle className="text-amber-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-amber-500" />
                العدسات اللاصقة
              </div>
              <ContactIcon className="h-5 w-5 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Right Eye */}
              <div className="space-y-3">
                <div className="flex items-center text-amber-700 gap-1.5">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">العين اليمنى (OD)</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label className="text-muted-foreground">Power:</Label>
                    <Select value={powerFilter} onValueChange={setPowerFilter}>
                      <SelectTrigger className="w-[180px] text-right">
                        <SelectValue placeholder="اختر القوة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">الكل</SelectItem>
                        {powers.map(power => (
                          <SelectItem key={power} value={power}>{power}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label className="text-muted-foreground">Base Curve:</Label>
                    <Select value={bcFilter} onValueChange={setBcFilter}>
                      <SelectTrigger className="w-[180px] text-right">
                        <SelectValue placeholder="اختر BC" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">الكل</SelectItem>
                        {baseCurves.map(bc => (
                          <SelectItem key={bc} value={bc}>{bc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Left Eye */}
              <div className="space-y-3">
                <div className="flex items-center text-amber-700 gap-1.5">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">العين اليسرى (OS)</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label className="text-muted-foreground">Power:</Label>
                    <div className="w-[180px] text-right text-muted-foreground italic text-sm">
                      (نفس الخيارات)
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label className="text-muted-foreground">Base Curve:</Label>
                    <div className="w-[180px] text-right text-muted-foreground italic text-sm">
                      (نفس الخيارات)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
              <Button onClick={handleSearch} className="gap-1 bg-amber-600 hover:bg-amber-700">
                <Filter className="w-4 h-4" />
                بحث
              </Button>
            </div>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div className="border rounded-lg overflow-hidden mt-4 border-amber-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-50">
                <tr>
                  <th className="p-2 text-right text-amber-800">Brand</th>
                  <th className="p-2 text-right text-amber-800">Type</th>
                  <th className="p-2 text-right text-amber-800">Power</th>
                  <th className="p-2 text-right text-amber-800">BC</th>
                  <th className="p-2 text-right text-amber-800">Price</th>
                  <th className="p-2 text-right text-amber-800">Qty</th>
                  <th className="p-2 text-right text-amber-800">اختيار</th>
                </tr>
              </thead>
              <tbody>
                {results.map((lens) => (
                  <tr key={lens.id} className="hover:bg-amber-50/50 border-t border-amber-100">
                    <td className="p-2">{lens.brand}</td>
                    <td className="p-2">{lens.type}</td>
                    <td className="p-2">{lens.power}</td>
                    <td className="p-2">{lens.bc}</td>
                    <td className="p-2">{lens.price} KWD</td>
                    <td className="p-2">{lens.qty}</td>
                    <td className="p-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSelectLens(lens)}
                        className="gap-1 border-amber-300 text-amber-700 hover:bg-amber-50"
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
      
      {selectedLenses.length > 0 && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center gap-2 text-amber-800">
              <ShoppingCart className="w-5 h-5 text-amber-600" />
              العدسات المختارة
            </h4>
            <span className="font-bold text-lg text-amber-700">
              {totalPrice.toFixed(2)} KWD
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            {selectedLenses.map((lens) => (
              <div key={lens.id} className="flex justify-between items-center p-2 bg-white rounded border border-amber-100">
                <div>
                  <span className="font-medium">{lens.brand} {lens.type}</span>
                  <div className="text-sm text-muted-foreground">
                    Power: {lens.power} | BC: {lens.bc} | {lens.price.toFixed(2)} KWD
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveLens(lens.id)}
                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                >
                  إزالة
                </Button>
              </div>
            ))}
          </div>
          
          <Button className="w-full bg-amber-600 hover:bg-amber-700">
            إضافة للفاتورة
          </Button>
        </div>
      )}
    </div>
  );
};
