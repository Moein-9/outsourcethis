
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Contact, Eye, Search, ShoppingCart, Plus, Trash2, Check, ArrowDown, ArrowUp } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ContactLensForm } from "./ContactLensForm";
import { ContactLensRx } from "@/store/patientStore";

interface ContactLensItem {
  id: string;
  brand: string;
  type: string;
  bc: string; // Base curve
  diameter: string;
  power: string;
  price: number;
  qty: number;
  color?: string; // Added color field
}

interface ContactLensSelection {
  items: ContactLensItem[];
  rxData?: ContactLensRx;
}

interface ContactLensSelectorProps {
  onSelect: (selection: ContactLensSelection) => void;
  initialRxData?: ContactLensRx;
}

const emptyContactLensRx: ContactLensRx = {
  rightEye: {
    sphere: "-",
    cylinder: "-",
    axis: "-",
    bc: "-",
    dia: "-"
  },
  leftEye: {
    sphere: "-",
    cylinder: "-",
    axis: "-",
    bc: "-",
    dia: "-"
  }
};

const mockContactLenses: ContactLensItem[] = [
  {
    id: "cl1",
    brand: "Acuvue",
    type: "Daily",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 25,
    qty: 30,
    color: "Clear"
  },
  {
    id: "cl2",
    brand: "Acuvue",
    type: "Daily",
    bc: "8.5",
    diameter: "14.2",
    power: "-1.50",
    price: 25,
    qty: 15,
    color: "Clear"
  },
  {
    id: "cl3",
    brand: "Biofinty",
    type: "Monthly",
    bc: "8.6",
    diameter: "14.0",
    power: "-3.00",
    price: 20,
    qty: 12,
    color: "Blue"
  },
  {
    id: "cl4",
    brand: "Air Optix",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "+1.50",
    price: 22,
    qty: 8,
    color: "Green"
  }
];

export const ContactLensSelector: React.FC<ContactLensSelectorProps> = ({ onSelect, initialRxData }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ContactLensItem[]>(mockContactLenses);
  const [selectedLenses, setSelectedLenses] = useState<ContactLensItem[]>([]);
  const [hasExistingPatient, setHasExistingPatient] = useState(!!initialRxData);
  const [showRxForm, setShowRxForm] = useState(!initialRxData);
  const [rxData, setRxData] = useState<ContactLensRx>(initialRxData || emptyContactLensRx);
  
  const [filterBrand, setFilterBrand] = useState<string>("all");
  const [filterPower, setFilterPower] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  // Extract unique values for filters
  const brands = [...new Set(mockContactLenses.map(lens => lens.brand))];
  const powers = [...new Set(mockContactLenses.map(lens => lens.power))];
  const types = [...new Set(mockContactLenses.map(lens => lens.type))];

  // Apply filters when they change
  useEffect(() => {
    handleFilterApply();
  }, [filterBrand, filterPower, filterType, search]);

  const handleFilterApply = () => {
    let filtered = mockContactLenses;
    
    if (search) {
      filtered = filtered.filter(lens => 
        lens.brand.toLowerCase().includes(search.toLowerCase()) ||
        lens.type.toLowerCase().includes(search.toLowerCase()) ||
        lens.power.includes(search) ||
        (lens.color && lens.color.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    if (filterBrand && filterBrand !== "all") {
      filtered = filtered.filter(lens => lens.brand === filterBrand);
    }
    
    if (filterPower && filterPower !== "all") {
      filtered = filtered.filter(lens => lens.power === filterPower);
    }
    
    if (filterType && filterType !== "all") {
      filtered = filtered.filter(lens => lens.type === filterType);
    }
    
    setResults(filtered);
    
    if (filtered.length === 0 && (search || filterBrand !== "all" || filterPower !== "all" || filterType !== "all")) {
      toast("لم يتم العثور على عدسات مطابقة للبحث");
    }
  };

  const handleSelectLens = (lens: ContactLensItem) => {
    // Check if this lens is already selected
    const alreadySelected = selectedLenses.some(item => item.id === lens.id);
    
    if (alreadySelected) {
      toast("هذه العدسة مضافة بالفعل");
      return;
    }
    
    const updatedSelection = [...selectedLenses, lens];
    setSelectedLenses(updatedSelection);
    
    onSelect({
      items: updatedSelection,
      rxData: rxData
    });
    
    toast(`تمت إضافة ${lens.brand} ${lens.type} بنجاح`);
  };

  const handleRemoveLens = (lensId: string) => {
    const updatedSelection = selectedLenses.filter(lens => lens.id !== lensId);
    setSelectedLenses(updatedSelection);
    
    onSelect({
      items: updatedSelection,
      rxData: rxData
    });
  };
  
  const handleRxChange = (newRxData: ContactLensRx) => {
    setRxData(newRxData);
    
    // Also update the selection with the new RX data
    onSelect({
      items: selectedLenses,
      rxData: newRxData
    });
  };
  
  const togglePatientStatus = () => {
    setHasExistingPatient(!hasExistingPatient);
    setShowRxForm(!hasExistingPatient);
  };
  
  // Calculate total price of selected lenses
  const totalPrice = selectedLenses.reduce((sum, lens) => sum + lens.price, 0);
  
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-full">
            <Contact className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold">العدسات اللاصقة</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={hasExistingPatient ? "outline" : "secondary"} className="cursor-pointer" onClick={togglePatientStatus}>
            {hasExistingPatient ? "يوجد ملف عميل" : "لا يوجد ملف عميل"}
          </Badge>
          
          {selectedLenses.length > 0 && (
            <Badge variant="outline" className="px-3 py-1.5 bg-blue-50 text-blue-700 border-blue-200">
              {selectedLenses.length} عدسة مختارة
            </Badge>
          )}
        </div>
      </div>

      {/* RX Form for manual input when no patient file */}
      {showRxForm && (
        <ContactLensForm
          rxData={rxData}
          onChange={handleRxChange}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Filters */}
        <div className="lg:col-span-1">
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 pb-3">
              <CardTitle className="text-blue-800 flex items-center gap-2 text-base">
                <Search className="h-4 w-4 text-blue-600" />
                بحث في المخزون
              </CardTitle>
              <CardDescription className="text-blue-700/80">
                حدد معايير البحث لإيجاد العدسات المناسبة
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">البراند:</Label>
                  <Select value={filterBrand} onValueChange={setFilterBrand}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="اختر البراند" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">القوة (Power):</Label>
                  <Select value={filterPower} onValueChange={setFilterPower}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="اختر القوة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      {powers.map(power => (
                        <SelectItem key={power} value={power}>{power}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">النوع:</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      {types.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث عن عدسة لاصقة..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results and Selected Items */}
        <div className="lg:col-span-2 space-y-5">
          {/* Results Card */}
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 py-3">
              <CardTitle className="text-blue-800 flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-600" />
                  نتائج البحث ({results.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-50/50">
                      <tr className="border-b border-blue-100">
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-blue-800">البراند</th>
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-blue-800">النوع</th>
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-blue-800">القوة</th>
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-blue-800">اللون</th>
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-blue-800">السعر</th>
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-blue-800">الكمية</th>
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-blue-800"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-100">
                      {results.map((lens) => (
                        <tr key={lens.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="py-2.5 px-3 text-sm">{lens.brand}</td>
                          <td className="py-2.5 px-3 text-sm">{lens.type}</td>
                          <td className="py-2.5 px-3 text-sm">{lens.power}</td>
                          <td className="py-2.5 px-3 text-sm">{lens.color || "-"}</td>
                          <td className="py-2.5 px-3 text-sm font-medium">{lens.price} KWD</td>
                          <td className="py-2.5 px-3 text-sm">
                            <Badge variant={lens.qty > 5 ? "outline" : "destructive"} className="text-xs">
                              {lens.qty}
                            </Badge>
                          </td>
                          <td className="py-2 px-3">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleSelectLens(lens)}
                              className="h-7 gap-1 text-xs hover:bg-blue-100 text-blue-700"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              اختر
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <Contact className="h-12 w-12 text-blue-200 mb-2" />
                  <h4 className="text-base font-medium text-blue-800 mb-1">لا توجد نتائج</h4>
                  <p className="text-sm text-blue-600/80 mb-4">
                    لم يتم العثور على عدسات لاصقة مطابقة للبحث
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setFilterBrand("all");
                      setFilterPower("all");
                      setFilterType("all");
                      setResults(mockContactLenses);
                    }}
                    className="border-blue-200 hover:bg-blue-50 text-blue-700"
                  >
                    عرض جميع العدسات
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Selected Items Card */}
          {selectedLenses.length > 0 && (
            <Card className="border-blue-200 shadow-sm bg-gradient-to-r from-blue-50/50 to-white">
              <CardHeader className="py-3 border-b border-blue-100">
                <CardTitle className="text-blue-800 flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                    ملخص الفاتورة
                  </span>
                  <span className="text-base font-bold text-blue-600">
                    {totalPrice.toFixed(2)} KWD
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                {selectedLenses.map((lens) => (
                  <div 
                    key={lens.id} 
                    className="flex justify-between items-center p-2.5 rounded-md bg-white border border-blue-100 shadow-sm"
                  >
                    <div>
                      <div className="font-medium flex items-center gap-1.5">
                        <Badge variant="outline" className="bg-blue-50 text-xs border-blue-200 text-blue-700">
                          {lens.power}
                        </Badge>
                        <span>{lens.brand} {lens.type}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        {lens.color && `${lens.color} | `}BC: {lens.bc} | {lens.price.toFixed(2)} KWD
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveLens(lens.id)}
                      className="h-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-0 px-3 pb-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-9">
                  <Check className="w-4 h-4 mr-1" />
                  إضافة للفاتورة
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
