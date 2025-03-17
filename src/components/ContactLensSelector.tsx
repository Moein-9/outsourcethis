
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Contact, Eye, Search, ShoppingCart, Plus, Trash2, Check } from "lucide-react";
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
import { useInventoryStore } from "@/store/inventoryStore";

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

export const ContactLensSelector: React.FC<ContactLensSelectorProps> = ({ onSelect, initialRxData }) => {
  const { contactLenses, searchContactLenses } = useInventoryStore();
  
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ContactLensItem[]>(contactLenses);
  const [selectedLenses, setSelectedLenses] = useState<ContactLensItem[]>([]);
  const [hasExistingPatient, setHasExistingPatient] = useState(!!initialRxData);
  const [showRxForm, setShowRxForm] = useState(!initialRxData);
  const [rxData, setRxData] = useState<ContactLensRx>(initialRxData || emptyContactLensRx);
  
  const [filterBrand, setFilterBrand] = useState<string>("all");
  const [filterPower, setFilterPower] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  // Extract unique values for filters
  const brands = [...new Set(contactLenses.map(lens => lens.brand))];
  const powers = [...new Set(contactLenses.map(lens => lens.power))];
  const types = [...new Set(contactLenses.map(lens => lens.type))];

  // Apply filters when they change
  useEffect(() => {
    handleFilterApply();
  }, [filterBrand, filterPower, filterType, search]);

  const handleFilterApply = () => {
    // First search by query
    let filtered = search ? searchContactLenses(search) : contactLenses;
    
    // Then apply additional filters
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
      {/* Header with Invoice Summary */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-2 rounded-full">
            <Contact className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-blue-800">العدسات اللاصقة</h3>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Invoice Summary Card - Positioned at top */}
          {selectedLenses.length > 0 && (
            <Card className="w-full md:w-auto border-blue-200 shadow-sm overflow-hidden bg-gradient-to-r from-blue-50 to-white">
              <CardHeader className="py-2 px-4 flex flex-row items-center justify-between gap-3 border-b border-blue-100">
                <CardTitle className="text-blue-800 flex items-center gap-2 text-base">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                  ملخص الفاتورة
                </CardTitle>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 font-bold">
                  {totalPrice.toFixed(2)} KWD
                </Badge>
              </CardHeader>
            </Card>
          )}
          
          <Badge 
            variant={hasExistingPatient ? "outline" : "secondary"} 
            className={`cursor-pointer ${hasExistingPatient ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}
            onClick={togglePatientStatus}
          >
            {hasExistingPatient ? "يوجد ملف عميل" : "لا يوجد ملف عميل"}
          </Badge>
          
          {selectedLenses.length > 0 && (
            <Badge variant="outline" className="px-3 py-1.5 bg-blue-50 text-blue-700 border-blue-200">
              {selectedLenses.length} عدسة مختارة
            </Badge>
          )}
        </div>
      </div>

      {/* RX Form - Only show when needed */}
      {showRxForm && (
        <ContactLensForm
          rxData={rxData}
          onChange={handleRxChange}
          showMissingRxWarning={!hasExistingPatient}
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
            <CardContent className="p-4 space-y-4 bg-white">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-blue-700">البراند:</Label>
                  <Select value={filterBrand} onValueChange={setFilterBrand}>
                    <SelectTrigger className="w-full bg-white border-blue-200">
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
                  <Label className="text-sm font-medium text-blue-700">القوة (Power):</Label>
                  <Select value={filterPower} onValueChange={setFilterPower}>
                    <SelectTrigger className="w-full bg-white border-blue-200">
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
                  <Label className="text-sm font-medium text-blue-700">النوع:</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full bg-white border-blue-200">
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
                    className="pl-9 pr-3 border-blue-200"
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
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                      <tr className="border-b border-blue-100">
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-blue-800">البراند</th>
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-blue-800">النوع</th>
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
                          <td className="py-2.5 px-3 text-sm">{lens.color || "-"}</td>
                          <td className="py-2.5 px-3 text-sm font-medium">{lens.price} KWD</td>
                          <td className="py-2.5 px-3 text-sm">
                            <Badge variant={lens.qty > 5 ? "outline" : "destructive"} 
                                  className={`text-xs ${lens.qty > 5 ? 'bg-green-50 text-green-700 border-green-200' : ''}`}>
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
                      setResults(contactLenses);
                    }}
                    className="border-blue-200 hover:bg-blue-50 text-blue-700"
                  >
                    عرض جميع العدسات
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Selected Items Card - Live Invoice Summary */}
          {selectedLenses.length > 0 && (
            <Card className="border-blue-200 shadow-sm overflow-hidden">
              <CardHeader className="py-3 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white">
                <CardTitle className="text-blue-800 flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    العدسات المختارة
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2 bg-gradient-to-br from-blue-50/20 to-white">
                {selectedLenses.map((lens) => (
                  <div 
                    key={lens.id} 
                    className="flex justify-between items-center p-2.5 rounded-md bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="font-medium flex items-center gap-1.5">
                        <Badge variant="outline" className="bg-blue-50 text-xs border-blue-200 text-blue-700">
                          {lens.power}
                        </Badge>
                        <span>{lens.brand} {lens.type}</span>
                        {lens.color && (
                          <div className="ml-1 w-3 h-3 rounded-full" style={{ 
                            backgroundColor: lens.color.toLowerCase() === 'clear' ? '#f8fafc' : 
                                            lens.color.toLowerCase() === 'blue' ? '#3b82f6' : 
                                            lens.color.toLowerCase() === 'green' ? '#10b981' : 
                                            '#f8fafc',
                            border: lens.color.toLowerCase() === 'clear' ? '1px solid #e2e8f0' : 'none'
                          }}></div>
                        )}
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
              <CardFooter className="border-t border-blue-100 pt-3 px-3 pb-3 bg-gradient-to-r from-blue-50 to-white">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-9 gap-2">
                  <Check className="w-4 h-4" />
                  إضافة للفاتورة ({totalPrice.toFixed(2)} KWD)
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
