
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
import { useLanguageStore } from "@/store/languageStore";

export interface ContactLensItem {
  id: string;
  brand: string;
  type: string;
  bc: string; // Base curve
  diameter: string;
  power: string; // Keeping this in the data structure, but not displaying it
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
  const { language, t } = useLanguageStore();
  
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

  // Calculate total with proper quantities
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
      toast(language === 'ar' ? "لم يتم العثور على عدسات مطابقة للبحث" : "No matching lenses found");
    }
  };

  const handleSelectLens = (lens: ContactLensItem) => {
    // Check if we already have this exact lens
    const existingLensIndex = selectedLenses.findIndex(item => 
      item.id === lens.id && 
      item.brand === lens.brand && 
      item.type === lens.type && 
      item.bc === lens.bc && 
      item.diameter === lens.diameter && 
      item.power === lens.power
    );
    
    if (existingLensIndex >= 0) {
      // Update quantity instead of adding duplicate
      const currentQty = itemQuantities[lens.id] || 1;
      setItemQuantities({
        ...itemQuantities,
        [lens.id]: currentQty + 1
      });
      
      // Update lens qty in the selected array
      const updatedLenses = [...selectedLenses];
      updatedLenses[existingLensIndex] = {
        ...updatedLenses[existingLensIndex],
        qty: currentQty + 1
      };
      
      setSelectedLenses(updatedLenses);
      
      onSelect({
        items: updatedLenses,
        rxData,
        quantities: {
          ...itemQuantities,
          [lens.id]: currentQty + 1
        }
      });
      
      toast(language === 'ar' 
        ? `تمت زيادة كمية ${lens.brand} ${lens.type} بنجاح` 
        : `Increased quantity of ${lens.brand} ${lens.type} successfully`);
      return;
    }
    
    // If it's a new lens, add it with qty 1
    const newLens = { ...lens, qty: 1 };
    const updatedSelection = [...selectedLenses, newLens];
    setSelectedLenses(updatedSelection);
    
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
    
    toast(language === 'ar'
      ? `تمت إضافة ${lens.brand} ${lens.type} بنجاح`
      : `Added ${lens.brand} ${lens.type} successfully`);
  };

  const handleRemoveLens = (lensId: string) => {
    const updatedSelection = selectedLenses.filter(lens => lens.id !== lensId);
    setSelectedLenses(updatedSelection);
    
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
    if (newQuantity < 1) return;
    
    // Update quantity in itemQuantities state
    setItemQuantities({
      ...itemQuantities,
      [lensId]: newQuantity
    });
    
    // Also update the qty property in the actual lens item
    const updatedLenses = selectedLenses.map(lens => 
      lens.id === lensId ? { ...lens, qty: newQuantity } : lens
    );
    
    setSelectedLenses(updatedLenses);
    
    onSelect({
      items: updatedLenses,
      rxData,
      quantities: {
        ...itemQuantities,
        [lensId]: newQuantity
      }
    });
  };
  
  const handleConfirmSelection = () => {
    // Make sure all lenses have their qty property updated before finalizing
    const finalLenses = selectedLenses.map(lens => ({
      ...lens,
      qty: itemQuantities[lens.id] || 1
    }));
    
    setSelectedLenses(finalLenses);
    
    onSelect({
      items: finalLenses,
      rxData,
      quantities: itemQuantities
    });
    
    toast(language === 'ar' 
      ? `تمت إضافة ${selectedLenses.length} عدسة للفاتورة`
      : `Added ${selectedLenses.length} lenses to the invoice`);
  };
  
  const textDirection = language === 'ar' ? 'rtl' : 'ltr';
  
  return (
    <div className="space-y-5" dir={textDirection}>
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-2 rounded-full">
            <Contact className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-blue-800">
            {language === 'ar' ? 'العدسات اللاصقة' : 'Contact Lenses'}
          </h3>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedLenses.length > 0 && (
            <Badge variant="outline" className="px-3 py-1.5 bg-blue-50 text-blue-700 border-blue-200">
              {selectedLenses.length} {language === 'ar' ? 'عدسة مختارة' : 'lenses selected'}
            </Badge>
          )}
          
          {selectedLenses.length > 0 && (
            <Badge className="bg-primary text-white px-3 py-1.5 flex items-center gap-1">
              <ShoppingCart className="h-3.5 w-3.5" />
              {totalPrice.toFixed(2)} {t('kwd')}
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
                  {language === 'ar' ? 'بحث في المخزون' : 'Search Inventory'}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setFiltersVisible(!filtersVisible)}
                  className="h-8 text-blue-700 hover:bg-blue-100"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  {filtersVisible 
                    ? (language === 'ar' ? 'إخفاء الفلاتر' : 'Hide Filters')
                    : (language === 'ar' ? 'إظهار الفلاتر' : 'Show Filters')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'ar' ? 'ابحث عن عدسة لاصقة...' : 'Search for contact lenses...'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-3 border-blue-200"
                />
              </div>
              
              {filtersVisible && (
                <div className="space-y-3 border-t pt-3 mt-2 border-blue-100">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-blue-700">
                      {language === 'ar' ? 'البراند:' : 'Brand:'}
                    </Label>
                    <Select value={filterBrand} onValueChange={setFilterBrand}>
                      <SelectTrigger className="w-full bg-white border-blue-200">
                        <SelectValue placeholder={language === 'ar' ? 'اختر البراند' : 'Select brand'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                        {brands.map(brand => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-blue-700">
                      {language === 'ar' ? 'النوع:' : 'Type:'}
                    </Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-full bg-white border-blue-200">
                        <SelectValue placeholder={language === 'ar' ? 'اختر النوع' : 'Select type'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
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
                    {language === 'ar' ? 'إعادة ضبط البحث' : 'Reset Search'}
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
                    {language === 'ar' ? 'العدسات المختارة' : 'Selected Lenses'}
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
                        {lens.color ? lens.color : "Clear"} | {lens.price.toFixed(2)} {t('kwd')}
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
                  <span className="font-semibold">
                    {language === 'ar' ? 'المجموع:' : 'Total:'}
                  </span>
                  <Badge className="bg-primary text-white px-2.5 py-1 text-sm">
                    {totalPrice.toFixed(2)} {t('kwd')}
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
                  {language === 'ar' ? 'نتائج البحث' : 'Search Results'}
                </span>
                <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                  {results.length} {language === 'ar' ? 'عدسة' : 'lenses'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                      <tr className="border-b border-blue-100">
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-blue-800">
                          {language === 'ar' ? 'البراند' : 'Brand'}
                        </th>
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-blue-800">
                          {language === 'ar' ? 'النوع' : 'Type'}
                        </th>
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-blue-800">
                          {language === 'ar' ? 'اللون' : 'Color'}
                        </th>
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-blue-800">
                          BC
                        </th>
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-blue-800">
                          {language === 'ar' ? 'السعر' : 'Price'}
                        </th>
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
                          <td className="py-2.5 px-3 text-sm font-medium">{lens.price.toFixed(2)} {t('kwd')}</td>
                          <td className="py-2 px-3">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleSelectLens(lens)}
                              className="h-7 gap-1 text-xs hover:bg-blue-100 text-blue-700"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              {language === 'ar' ? 'اختر' : 'Select'}
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
                  <h4 className="text-base font-medium text-blue-800 mb-1">
                    {language === 'ar' ? 'لا توجد نتائج' : 'No Results'}
                  </h4>
                  <p className="text-sm text-blue-600/80 mb-4">
                    {language === 'ar' 
                      ? 'لم يتم العثور على عدسات لاصقة مطابقة للبحث' 
                      : 'No matching contact lenses were found'}
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
                    {language === 'ar' ? 'عرض جميع العدسات' : 'Show All Lenses'}
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
              {language === 'ar' 
                ? `إضافة للفاتورة (${totalPrice.toFixed(2)} ${t('kwd')})` 
                : `Add to Invoice (${totalPrice.toFixed(2)} ${t('kwd')})`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
