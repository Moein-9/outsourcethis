
import React, { useState, useEffect } from "react";
import { useInventoryStore, ContactLensItem } from "@/store/inventoryStore";
import { useLanguageStore } from "@/store/languageStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Contact, Edit, Save } from "lucide-react";

// Common values for dropdowns
const COMMON_BC_VALUES = ["8.3", "8.4", "8.5", "8.6", "8.7", "8.8", "8.9", "9.0"];
const COMMON_DIAMETER_VALUES = ["13.8", "14.0", "14.2", "14.5", "14.8"];
const COMMON_BRANDS = ["Acuvue", "Air Optix", "Biofinty", "Bella", "FreshLook", "PureVision", "SofLens"];
const COMMON_TYPES = ["Daily", "Monthly", "Biweekly", "Yearly", "Color"];
const COMMON_COLORS = ["none", "Clear", "Blue", "Green", "Brown", "Hazel", "Gray", "Honey"];

// Contact Lens Item Component
const ContactLensItemCard = ({ lens, onEdit }: { 
  lens: ContactLensItem; 
  onEdit: (lens: ContactLensItem) => void;
}) => {
  const { language } = useLanguageStore();
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 border-blue-200">
      <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Contact className="h-4 w-4 text-blue-600" />
              {lens.brand} - {lens.type}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              {lens.price.toFixed(2)} KWD
              {lens.color && <span className="text-xs text-blue-500">| {lens.color}</span>}
            </CardDescription>
          </div>
          <Badge variant={lens.qty > 5 ? "outline" : "destructive"} className="text-xs">
            {lens.qty} {language === 'ar' ? 'في المخزون' : 'in stock'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">BC:</span>
          <span className="font-medium">{lens.bc}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{language === 'ar' ? 'القطر' : 'Diameter'}:</span>
          <span className="font-medium">{lens.diameter}</span>
        </div>
      </CardContent>
      <CardFooter className="p-0 border-t">
        <Button variant="ghost" className="rounded-none h-10 text-blue-600 w-full" onClick={() => onEdit(lens)}>
          <Edit className="h-4 w-4 mr-1" /> {language === 'ar' ? 'تعديل' : 'Edit'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export const ContactLensInventory: React.FC = () => {
  const { contactLenses, addContactLens, updateContactLens, searchContactLenses } = useInventoryStore();
  const { language } = useLanguageStore();
  
  // State variables
  const [contactLensSearchTerm, setContactLensSearchTerm] = useState("");
  const [contactLensResults, setContactLensResults] = useState<ReturnType<typeof searchContactLenses>>(contactLenses);
  const [isAddContactLensDialogOpen, setIsAddContactLensDialogOpen] = useState(false);
  const [editingLens, setEditingLens] = useState<ContactLensItem | null>(null);
  
  // Add the missing state variables
  const [contactLensBrand, setContactLensBrand] = useState("");
  const [contactLensType, setContactLensType] = useState("");
  const [contactLensBC, setContactLensBC] = useState("");
  const [contactLensDiameter, setContactLensDiameter] = useState("");
  const [contactLensPower, setContactLensPower] = useState("-0.00");
  const [contactLensColor, setContactLensColor] = useState("none");
  const [contactLensPrice, setContactLensPrice] = useState("");
  const [contactLensQty, setContactLensQty] = useState("1");
  
  // Custom entries for select fields
  const [customBrand, setCustomBrand] = useState("");
  const [customType, setCustomType] = useState("");
  const [customBC, setCustomBC] = useState("");
  const [customDiameter, setCustomDiameter] = useState("");
  const [customColor, setCustomColor] = useState("");
  
  // User-saved custom values
  const [savedCustomBrands, setSavedCustomBrands] = useState<string[]>(() => {
    const saved = localStorage.getItem("customBrands");
    return saved ? JSON.parse(saved) : [];
  });
  const [savedCustomTypes, setSavedCustomTypes] = useState<string[]>(() => {
    const saved = localStorage.getItem("customTypes");
    return saved ? JSON.parse(saved) : [];
  });
  
  // Save custom values to localStorage when they change
  useEffect(() => {
    localStorage.setItem("customBrands", JSON.stringify(savedCustomBrands));
  }, [savedCustomBrands]);
  
  useEffect(() => {
    localStorage.setItem("customTypes", JSON.stringify(savedCustomTypes));
  }, [savedCustomTypes]);
  
  // Filters
  const [filterBrand, setFilterBrand] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  
  // Extract unique values for filters
  const brands = [...new Set(contactLenses.map(lens => lens.brand))];
  const types = [...new Set(contactLenses.map(lens => lens.type))];
  
  // Handle contact lens search
  const handleContactLensSearch = () => {
    let results = contactLenses;
    
    if (contactLensSearchTerm) {
      results = searchContactLenses(contactLensSearchTerm);
    }
    
    if (filterBrand && filterBrand !== "all") {
      results = results.filter(lens => lens.brand === filterBrand);
    }
    
    if (filterType && filterType !== "all") {
      results = results.filter(lens => lens.type === filterType);
    }
    
    setContactLensResults(results);
    
    if (results.length === 0 && (contactLensSearchTerm || filterBrand !== "all" || filterType !== "all")) {
      toast.info(language === 'ar' 
        ? "لم يتم العثور على عدسات لاصقة مطابقة للبحث."
        : "No matching contact lenses were found.");
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setContactLensSearchTerm("");
    setFilterBrand("all");
    setFilterType("all");
    setContactLensResults(contactLenses);
  };
  
  // Handle adding a new contact lens
  const handleAddContactLens = () => {
    if (!contactLensBrand || !contactLensType || !contactLensBC || !contactLensDiameter || !contactLensPrice) {
      toast.error(language === 'ar'
        ? "الرجاء إدخال تفاصيل العدسة اللاصقة كاملة"
        : "Please enter all contact lens details");
      return;
    }
    
    const price = parseFloat(contactLensPrice);
    const qty = parseInt(contactLensQty);
    
    if (isNaN(price) || price <= 0) {
      toast.error(language === 'ar'
        ? "الرجاء إدخال سعر صحيح"
        : "Please enter a valid price");
      return;
    }
    
    if (isNaN(qty) || qty <= 0) {
      toast.error(language === 'ar'
        ? "الرجاء إدخال كمية صحيحة"
        : "Please enter a valid quantity");
      return;
    }
    
    // Save custom brand if it's a new one
    if (contactLensBrand && !COMMON_BRANDS.includes(contactLensBrand) && !savedCustomBrands.includes(contactLensBrand)) {
      setSavedCustomBrands(prev => [...prev, contactLensBrand]);
    }
    
    // Save custom type if it's a new one
    if (contactLensType && !COMMON_TYPES.includes(contactLensType) && !savedCustomTypes.includes(contactLensType)) {
      setSavedCustomTypes(prev => [...prev, contactLensType]);
    }
    
    // Create the base object with required properties
    const newContactLens: Omit<ContactLensItem, "id"> = {
      brand: contactLensBrand,
      type: contactLensType,
      bc: contactLensBC,
      diameter: contactLensDiameter,
      power: contactLensPower,
      price,
      qty,
      color: contactLensColor !== "none" ? contactLensColor : undefined
    };
    
    if (editingLens) {
      updateContactLens(editingLens.id, newContactLens);
      toast.success(language === 'ar'
        ? `تم تحديث العدسة اللاصقة بنجاح: ${contactLensBrand} ${contactLensType}`
        : `Successfully updated contact lens: ${contactLensBrand} ${contactLensType}`);
    } else {
      const id = addContactLens(newContactLens);
      toast.success(language === 'ar'
        ? `تم إضافة العدسة اللاصقة بنجاح: ${contactLensBrand} ${contactLensType}`
        : `Successfully added contact lens: ${contactLensBrand} ${contactLensType}`);
    }
    
    resetContactLensForm();
    setIsAddContactLensDialogOpen(false);
    
    setContactLensResults(contactLenses);
  };
  
  // Reset contact lens form
  const resetContactLensForm = () => {
    setContactLensBrand("");
    setContactLensType("");
    setContactLensBC("");
    setContactLensDiameter("");
    setContactLensPower("-0.00");
    setContactLensColor("none");
    setContactLensPrice("");
    setContactLensQty("1");
    setCustomBrand("");
    setCustomType("");
    setCustomBC("");
    setCustomDiameter("");
    setCustomColor("");
    setEditingLens(null);
  };
  
  // Handle edit lens
  const handleEditLens = (lens: ContactLensItem) => {
    setEditingLens(lens);
    setContactLensBrand(lens.brand);
    setContactLensType(lens.type);
    setContactLensBC(lens.bc);
    setContactLensDiameter(lens.diameter);
    setContactLensPower(lens.power);
    setContactLensColor(lens.color || "none");
    setContactLensPrice(lens.price.toString());
    setContactLensQty(lens.qty.toString());
    setIsAddContactLensDialogOpen(true);
  };
  
  // Handle custom brand change
  const handleCustomBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBrand(e.target.value);
    setContactLensBrand(e.target.value);
  };
  
  // Handle custom type change
  const handleCustomTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomType(e.target.value);
    setContactLensType(e.target.value);
  };
  
  // Handle custom BC change
  const handleCustomBCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBC(e.target.value);
    setContactLensBC(e.target.value);
  };
  
  // Handle custom diameter change
  const handleCustomDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDiameter(e.target.value);
    setContactLensDiameter(e.target.value);
  };
  
  // Handle custom color change
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
    setContactLensColor(e.target.value);
  };
  
  // Initialize search results
  useEffect(() => {
    setContactLensResults(contactLenses);
  }, [contactLenses]);
  
  // Apply filters when they change
  useEffect(() => {
    handleContactLensSearch();
  }, [filterBrand, filterType]);
  
  // Text direction based on language
  const textDirection = language === 'ar' ? 'rtl' : 'ltr';
  
  // Combine standard brands with custom saved brands for the dropdown
  const allBrands = [...COMMON_BRANDS, ...savedCustomBrands.filter(brand => !COMMON_BRANDS.includes(brand))];
  
  // Combine standard types with custom saved types for the dropdown
  const allTypes = [...COMMON_TYPES, ...savedCustomTypes.filter(type => !COMMON_TYPES.includes(type))];
  
  return (
    <div className="space-y-6" dir={textDirection}>
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={contactLensSearchTerm}
              onChange={(e) => setContactLensSearchTerm(e.target.value)}
              placeholder={language === 'ar' 
                ? "البحث عن عدسة لاصقة (ماركة، نوع، قطر...)"
                : "Search contact lenses (brand, type, diameter...)"}
              className="pl-9 w-full"
              onKeyDown={(e) => e.key === 'Enter' && handleContactLensSearch()}
            />
          </div>
          <Button onClick={handleContactLensSearch} variant="secondary" className="shrink-0">
            <Search className="h-4 w-4 mr-1" /> {language === 'ar' ? 'بحث' : 'Search'}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filterBrand} onValueChange={(value) => {
            setFilterBrand(value);
          }}>
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder={language === 'ar' ? 'اختر البراند' : 'Select Brand'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'ar' ? 'كل البراندات' : 'All Brands'}</SelectItem>
              {brands.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterType} onValueChange={(value) => {
            setFilterType(value);
          }}>
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder={language === 'ar' ? 'اختر النوع' : 'Select Type'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'ar' ? 'كل الأنواع' : 'All Types'}</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={isAddContactLensDialogOpen} onOpenChange={setIsAddContactLensDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-1" /> {language === 'ar' ? 'إضافة عدسة لاصقة' : 'Add Contact Lens'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingLens 
                    ? (language === 'ar' ? 'تعديل عدسة لاصقة' : 'Edit Contact Lens')
                    : (language === 'ar' ? 'إضافة عدسة لاصقة جديدة' : 'Add New Contact Lens')
                  }
                </DialogTitle>
                <DialogDescription>
                  {editingLens 
                    ? (language === 'ar' ? 'قم بتعديل بيانات العدسة اللاصقة' : 'Update the contact lens details')
                    : (language === 'ar' ? 'أدخل تفاصيل العدسة اللاصقة الجديدة لإضافتها إلى المخزون' : 'Enter new contact lens details to add to inventory')
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactLensBrand">{language === 'ar' ? 'الماركة' : 'Brand'}</Label>
                    <Select 
                      value={contactLensBrand} 
                      onValueChange={(value) => {
                        if (value !== "other") {
                          setContactLensBrand(value);
                          setCustomBrand("");
                        } else {
                          setContactLensBrand("");
                        }
                      }}
                    >
                      <SelectTrigger id="contactLensBrand" className="w-full">
                        <SelectValue placeholder={language === 'ar' ? 'اختر الماركة' : 'Select brand'} />
                      </SelectTrigger>
                      <SelectContent>
                        {allBrands.map(brand => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                        <SelectItem value="other">{language === 'ar' ? 'أخرى' : 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                    {(contactLensBrand === "other" || (!allBrands.includes(contactLensBrand) && contactLensBrand !== "")) && (
                      <Input
                        className="mt-2"
                        placeholder={language === 'ar' ? 'أدخل اسم الماركة' : 'Enter brand name'}
                        onChange={handleCustomBrandChange}
                        value={customBrand}
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactLensType">{language === 'ar' ? 'النوع' : 'Type'}</Label>
                    <Select 
                      value={contactLensType} 
                      onValueChange={(value) => {
                        if (value !== "other") {
                          setContactLensType(value);
                          setCustomType("");
                        } else {
                          setContactLensType("");
                        }
                      }}
                    >
                      <SelectTrigger id="contactLensType" className="w-full">
                        <SelectValue placeholder={language === 'ar' ? 'اختر النوع' : 'Select type'} />
                      </SelectTrigger>
                      <SelectContent>
                        {allTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                        <SelectItem value="other">{language === 'ar' ? 'أخرى' : 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                    {(contactLensType === "other" || (!allTypes.includes(contactLensType) && contactLensType !== "")) && (
                      <Input
                        className="mt-2"
                        placeholder={language === 'ar' ? 'أدخل النوع' : 'Enter type'}
                        onChange={handleCustomTypeChange}
                        value={customType}
                      />
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactLensBC">BC</Label>
                    <Select 
                      value={contactLensBC} 
                      onValueChange={(value) => {
                        if (value !== "other") {
                          setContactLensBC(value);
                          setCustomBC("");
                        } else {
                          setContactLensBC("");
                        }
                      }}
                    >
                      <SelectTrigger id="contactLensBC" className="w-full">
                        <SelectValue placeholder={language === 'ar' ? 'اختر BC' : 'Select BC'} />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_BC_VALUES.map(bc => (
                          <SelectItem key={bc} value={bc}>{bc}</SelectItem>
                        ))}
                        <SelectItem value="other">{language === 'ar' ? 'أخرى' : 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                    {(contactLensBC === "other" || (!COMMON_BC_VALUES.includes(contactLensBC) && contactLensBC !== "")) && (
                      <Input
                        className="mt-2"
                        placeholder={language === 'ar' ? 'أدخل BC' : 'Enter BC'}
                        onChange={handleCustomBCChange}
                        value={customBC}
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactLensDiameter">{language === 'ar' ? 'القطر' : 'Diameter'}</Label>
                    <Select 
                      value={contactLensDiameter} 
                      onValueChange={(value) => {
                        if (value !== "other") {
                          setContactLensDiameter(value);
                          setCustomDiameter("");
                        } else {
                          setContactLensDiameter("");
                        }
                      }}
                    >
                      <SelectTrigger id="contactLensDiameter" className="w-full">
                        <SelectValue placeholder={language === 'ar' ? 'اختر القطر' : 'Select diameter'} />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_DIAMETER_VALUES.map(dia => (
                          <SelectItem key={dia} value={dia}>{dia}</SelectItem>
                        ))}
                        <SelectItem value="other">{language === 'ar' ? 'أخرى' : 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                    {(contactLensDiameter === "other" || (!COMMON_DIAMETER_VALUES.includes(contactLensDiameter) && contactLensDiameter !== "")) && (
                      <Input
                        className="mt-2"
                        placeholder={language === 'ar' ? 'أدخل القطر' : 'Enter diameter'}
                        onChange={handleCustomDiameterChange}
                        value={customDiameter}
                      />
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactLensColor">{language === 'ar' ? 'اللون (اختياري)' : 'Color (Optional)'}</Label>
                  <Select 
                    value={contactLensColor} 
                    onValueChange={(value) => {
                      if (value !== "other") {
                        setContactLensColor(value);
                        setCustomColor("");
                      } else {
                        setContactLensColor("");
                      }
                    }}
                  >
                    <SelectTrigger id="contactLensColor" className="w-full">
                      <SelectValue placeholder={language === 'ar' ? 'اختر اللون' : 'Select color'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{language === 'ar' ? 'بدون لون' : 'No color'}</SelectItem>
                      {COMMON_COLORS.filter(color => color !== "none").map(color => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                      <SelectItem value="other">{language === 'ar' ? 'أخرى' : 'Other'}</SelectItem>
                    </SelectContent>
                  </Select>
                  {(contactLensColor === "other" || (!COMMON_COLORS.includes(contactLensColor) && contactLensColor !== "" && contactLensColor !== "none")) && (
                    <Input
                      className="mt-2"
                      placeholder={language === 'ar' ? 'أدخل اللون' : 'Enter color'}
                      onChange={handleCustomColorChange}
                      value={customColor}
                    />
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactLensPrice">{language === 'ar' ? 'السعر (KWD)' : 'Price (KWD)'}</Label>
                    <Input
                      id="contactLensPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={contactLensPrice}
                      onChange={(e) => setContactLensPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactLensQty">{language === 'ar' ? 'الكمية' : 'Quantity'}</Label>
                    <Input
                      id="contactLensQty"
                      type="number"
                      step="1"
                      min="1"
                      value={contactLensQty}
                      onChange={(e) => setContactLensQty(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  resetContactLensForm();
                  setIsAddContactLensDialogOpen(false);
                }}>
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button onClick={handleAddContactLens} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-1" /> {editingLens 
                    ? (language === 'ar' ? 'تحديث' : 'Update') 
                    : (language === 'ar' ? 'حفظ العدسة' : 'Save Lens')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {contactLensResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contactLensResults.map((lens) => (
            <ContactLensItemCard 
              key={lens.id} 
              lens={lens} 
              onEdit={handleEditLens}
            />
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg p-12 text-center">
          <Contact className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-1">{language === 'ar' ? 'لا توجد عدسات لاصقة' : 'No Contact Lenses'}</h3>
          <p className="text-muted-foreground mb-4">
            {language === 'ar' 
              ? 'لم يتم العثور على عدسات لاصقة مطابقة للبحث.'
              : 'No matching contact lenses were found.'}
          </p>
          <Button variant="outline" onClick={resetFilters}>
            {language === 'ar' ? 'عرض جميع العدسات اللاصقة' : 'Show All Contact Lenses'}
          </Button>
        </div>
      )}
    </div>
  );
};
