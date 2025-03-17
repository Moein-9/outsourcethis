
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Contact, Eye, Search, ShoppingCart, Plus, Trash2, Check, Filter } from "lucide-react";
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
import { ContactLensRx } from "@/store/patientStore";
import { useInventoryStore } from "@/store/inventoryStore";

export interface ContactLensItem {
  id: string;
  brand: string;
  type: string;
  bc: string; // Base curve
  diameter: string;
  power: string; // Keeping this for data structure, will hide in UI
  price: number;
  qty: number;
  color?: string;
}

export interface ContactLensSelection {
  items: ContactLensItem[];
  rxData?: ContactLensRx;
  quantities?: Record<string, number>; // Track quantities for each lens ID
}

interface ContactLensSelectorProps {
  onSelect: (selection: ContactLensSelection) => void;
  initialRxData?: ContactLensRx;
}

export const ContactLensSelector: React.FC<ContactLensSelectorProps> = ({ onSelect, initialRxData }) => {
  const { contactLenses, searchContactLenses } = useInventoryStore();
  
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ContactLensItem[]>(contactLenses);
  const [selectedLenses, setSelectedLenses] = useState<ContactLensItem[]>([]);
  const [rxData, setRxData] = useState<ContactLensRx | undefined>(initialRxData);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  
  const [filterBrand, setFilterBrand] = useState<string>("all");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  const brands = [...new Set(contactLenses.map(lens => lens.brand))];
  const types = [...new Set(contactLenses.map(lens => lens.type))];

  useEffect(() => {
    handleFilterApply();
  }, [filterBrand, filterType, search]);

  const totalPrice = selectedLenses.reduce((sum, lens) => {
    const quantity = itemQuantities[lens.id] || 1;
    return sum + (lens.price * quantity);
  }, 0);

  const handleFilterApply = () => {
    let filtered = search ? searchContactLenses(search) : contactLenses;
    
    if (filterBrand && filterBrand !== "all") {
      filtered = filtered.filter(lens => lens.brand === filterBrand);
    }
    
    if (filterType && filterType !== "all") {
      filtered = filtered.filter(lens => lens.type === filterType);
    }
    
    setResults(filtered);
    
    if (filtered.length === 0 && (search || filterBrand !== "all" || filterType !== "all")) {
      toast("لم يتم العثور على عدسات مطابقة للبحث");
    }
  };

  const handleSelectLens = (lens: ContactLensItem) => {
    const existingIndex = selectedLenses.findIndex(item => item.id === lens.id);
    
    // If the lens is already selected, increment its quantity instead of showing error
    if (existingIndex >= 0) {
      const currentQty = itemQuantities[lens.id] || 1;
      setItemQuantities({
        ...itemQuantities,
        [lens.id]: currentQty + 1
      });
      
      // No need to update selectedLenses array since the item is already there
      // But we need to trigger the onSelect with updated quantities
      onSelect({
        items: selectedLenses,
        rxData,
        quantities: {
          ...itemQuantities,
          [lens.id]: currentQty + 1
        }
      });
      
      toast(`تمت زيادة كمية ${lens.brand} ${lens.type} بنجاح`);
      return;
    }
    
    const updatedSelection = [...selectedLenses, lens];
    setSelectedLenses(updatedSelection);
    
    // Initialize quantity to 1 for newly added items
    setItemQuantities({
      ...itemQuantities,
      [lens.id]: 1
    });
    
    onSelect({
      items: updatedSelection,
      rxData,
      quantities: {
        ...itemQuantities,
        [lens.id]: 1
      }
    });
    
    toast(`تمت إضافة ${lens.brand} ${lens.type} بنجاح`);
  };

  const handleRemoveLens = (lensId: string) => {
    const updatedSelection = selectedLenses.filter(lens => lens.id !== lensId);
    setSelectedLenses(updatedSelection);
    
    // Remove the item from quantities
    const updatedQuantities = { ...itemQuantities };
    delete updatedQuantities[lensId];
    setItemQuantities(updatedQuantities);
    
    onSelect({
      items: updatedSelection,
      rxData,
      quantities: updatedQuantities
    });
  };
  
  const handleUpdateQuantity = (lensId: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Don't allow less than 1
    
    setItemQuantities({
      ...itemQuantities,
      [lensId]: newQuantity
    });
    
    onSelect({
      items: selectedLenses,
      rxData,
      quantities: {
        ...itemQuantities,
        [lensId]: newQuantity
      }
    });
  };
  
  const handleConfirmSelection = () => {
    onSelect({
      items: selectedLenses,
      rxData,
      quantities: itemQuantities
    });
    
    toast(`تمت إضافة ${selectedLenses.length} عدسة للفاتورة`);
  };
  
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-2 rounded-full">
            <Contact className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-blue-800">العدسات اللاصقة</h3>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedLenses.length > 0 && (
            <Badge variant="outline" className="px-3 py-1.5 bg-blue-50 text-blue-700 border-blue-200">
              {selectedLenses.length} عدسة مختارة
            </Badge>
          )}
          
          {selectedLenses.length > 0 && (
            <Badge className="bg-primary text-white px-3 py-1.5 flex items-center gap-1">
              <ShoppingCart className="h-3.5 w-3.5" />
              {totalPrice.toFixed(2)} KWD
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 py-3">
              <CardTitle className="text-blue-800 flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-600" />
                  بحث في المخزون
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setFiltersVisible(!filtersVisible)}
                  className="h-8 text-blue-700 hover:bg-blue-100"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  {filtersVisible ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن عدسة لاصقة..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-3 border-blue-200"
                />
              </div>
              
              {filtersVisible && (
                <div className="space-y-3 border-t pt-3 mt-2 border-blue-100">
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
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSearch("");
                      setFilterBrand("all");
                      setFilterType("all");
                      setResults(contactLenses);
                    }}
                    className="w-full mt-2 text-blue-700 border-blue-200 hover:bg-blue-50"
                  >
                    إعادة ضبط البحث
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {selectedLenses.length > 0 && (
            <Card className="border-blue-200 shadow-sm overflow-hidden mt-5">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 py-3">
                <CardTitle className="text-blue-800 flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                    العدسات المختارة
                  </span>
                  <Badge className="bg-blue-100 text-blue-700 px-2">
                    {selectedLenses.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 divide-y divide-blue-100">
                {selectedLenses.map((lens) => (
                  <div 
                    key={lens.id} 
                    className="flex justify-between items-center py-2.5"
                  >
                    <div>
                      <div className="font-medium">
                        {lens.brand} {lens.type}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {lens.color || "Clear"} | {lens.price.toFixed(2)} KWD
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border rounded overflow-hidden">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-blue-700 hover:bg-blue-50 rounded-r-none border-r"
                          onClick={() => handleUpdateQuantity(lens.id, (itemQuantities[lens.id] || 1) - 1)}
                        >
                          -
                        </Button>
                        <div className="px-3 py-1 min-w-[40px] text-center">
                          {itemQuantities[lens.id] || 1}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-blue-700 hover:bg-blue-50 rounded-l-none border-l"
                          onClick={() => handleUpdateQuantity(lens.id, (itemQuantities[lens.id] || 1) + 1)}
                        >
                          +
                        </Button>
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
                  </div>
                ))}
              </CardContent>
              <CardFooter className="border-t border-blue-100 p-3 bg-blue-50/50">
                <div className="w-full flex justify-between items-center">
                  <span className="font-semibold">المجموع:</span>
                  <Badge className="bg-primary text-white px-2.5 py-1 text-sm">
                    {totalPrice.toFixed(2)} KWD
                  </Badge>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 py-3">
              <CardTitle className="text-blue-800 flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  نتائج البحث
                </span>
                <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                  {results.length} عدسة
                </Badge>
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
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-blue-800">BC</th>
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
                          <td className="py-2.5 px-3 text-sm">{lens.bc}</td>
                          <td className="py-2.5 px-3 text-sm font-medium">{lens.price.toFixed(2)} KWD</td>
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
          
          {selectedLenses.length > 0 && (
            <Button 
              className="w-full mt-4 bg-primary hover:bg-primary/90 h-12 gap-2 text-lg"
              onClick={handleConfirmSelection}
            >
              <Check className="w-5 h-5" />
              إضافة للفاتورة ({totalPrice.toFixed(2)} KWD)
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
