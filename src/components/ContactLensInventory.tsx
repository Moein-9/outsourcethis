
import React, { useState, useEffect } from "react";
import { useInventoryStore, ContactLensItem } from "@/store/inventoryStore";
import { useLanguageStore } from "@/store/languageStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContactLensCard } from "./contact-lens/ContactLensCard";
import { ContactLensForm } from "./contact-lens/ContactLensForm";
import { Search, Plus, Contact } from "lucide-react";

export const ContactLensInventory: React.FC = () => {
  const { contactLenses, addContactLens, updateContactLens, searchContactLenses } = useInventoryStore();
  const { language } = useLanguageStore();
  
  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchContactLenses>>(contactLenses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLens, setEditingLens] = useState<ContactLensItem | null>(null);
  
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
  const handleSearch = () => {
    let results = contactLenses;
    
    if (searchTerm) {
      results = searchContactLenses(searchTerm);
    }
    
    if (filterBrand && filterBrand !== "all") {
      results = results.filter(lens => lens.brand === filterBrand);
    }
    
    if (filterType && filterType !== "all") {
      results = results.filter(lens => lens.type === filterType);
    }
    
    setSearchResults(results);
    
    if (results.length === 0 && (searchTerm || filterBrand !== "all" || filterType !== "all")) {
      toast.info(language === 'ar' 
        ? "لم يتم العثور على عدسات لاصقة مطابقة للبحث."
        : "No matching contact lenses were found.");
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilterBrand("all");
    setFilterType("all");
    setSearchResults(contactLenses);
  };
  
  // Handle form submission
  const handleFormSubmit = (lensData: Omit<ContactLensItem, "id">) => {
    // Save custom brand if it's a new one
    if (lensData.brand && 
        !["Acuvue", "Air Optix", "Biofinty", "Bella", "FreshLook", "PureVision", "SofLens"].includes(lensData.brand) && 
        !savedCustomBrands.includes(lensData.brand)) {
      setSavedCustomBrands(prev => [...prev, lensData.brand]);
    }
    
    // Save custom type if it's a new one
    if (lensData.type && 
        !["Daily", "Monthly", "Biweekly", "Yearly", "Color"].includes(lensData.type) && 
        !savedCustomTypes.includes(lensData.type)) {
      setSavedCustomTypes(prev => [...prev, lensData.type]);
    }
    
    if (editingLens) {
      updateContactLens(editingLens.id, lensData);
      toast.success(language === 'ar'
        ? `تم تحديث العدسة اللاصقة بنجاح: ${lensData.brand} ${lensData.type}`
        : `Successfully updated contact lens: ${lensData.brand} ${lensData.type}`);
    } else {
      const id = addContactLens(lensData);
      toast.success(language === 'ar'
        ? `تم إضافة العدسة اللاصقة بنجاح: ${lensData.brand} ${lensData.type}`
        : `Successfully added contact lens: ${lensData.brand} ${lensData.type}`);
    }
    
    closeDialog();
    setSearchResults(contactLenses);
  };
  
  // Handle edit lens
  const handleEditLens = (lens: ContactLensItem) => {
    setEditingLens(lens);
    setIsAddDialogOpen(true);
  };
  
  // Close dialog and reset form
  const closeDialog = () => {
    setIsAddDialogOpen(false);
    setEditingLens(null);
  };
  
  // Initialize search results
  useEffect(() => {
    setSearchResults(contactLenses);
  }, [contactLenses]);
  
  // Apply filters when they change
  useEffect(() => {
    handleSearch();
  }, [filterBrand, filterType]);
  
  // Text direction based on language
  const textDirection = language === 'ar' ? 'rtl' : 'ltr';
  
  return (
    <div className="space-y-6" dir={textDirection}>
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'ar' 
                ? "البحث عن عدسة لاصقة (ماركة، نوع، قطر...)"
                : "Search contact lenses (brand, type, diameter...)"}
              className="pl-9 w-full"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} variant="secondary" className="shrink-0">
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
          
          <Button 
            className="shrink-0 bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> {language === 'ar' ? 'إضافة عدسة لاصقة' : 'Add Contact Lens'}
          </Button>
        </div>
      </div>
      
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((lens) => (
            <ContactLensCard 
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

      {/* Add/Edit Contact Lens Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        if (!open) closeDialog();
      }}>
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
          
          <ContactLensForm 
            onSubmit={handleFormSubmit}
            onCancel={closeDialog}
            initialValues={editingLens || {}}
            savedCustomBrands={savedCustomBrands}
            savedCustomTypes={savedCustomTypes}
            isEditing={!!editingLens}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
