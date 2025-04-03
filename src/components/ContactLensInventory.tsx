
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { ContactLensCard } from "./contact-lens/ContactLensCard";
import { ContactLensForm } from "./contact-lens/ContactLensForm";
import { CustomBrandsManager } from "./contact-lens/CustomBrandsManager";
import { CustomTypesManager } from "./contact-lens/CustomTypesManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Contact, Settings, Tag } from "lucide-react";

export const ContactLensInventory: React.FC = () => {
  const { contactLenses, addContactLens, updateContactLens, deleteContactLens, searchContactLenses } = useInventoryStore();
  const { language } = useLanguageStore();
  
  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchContactLenses>>(contactLenses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [editingLens, setEditingLens] = useState<ContactLensItem | null>(null);
  const [deletingLensId, setDeletingLensId] = useState<string | null>(null);
  const [activeManageTab, setActiveManageTab] = useState<"brands" | "types">("brands");
  
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
  
  // Handle delete lens
  const handleDeleteLens = (id: string) => {
    setDeletingLensId(id);
  };
  
  // Confirm delete lens
  const confirmDeleteLens = () => {
    if (deletingLensId) {
      const lensToDelete = contactLenses.find(lens => lens.id === deletingLensId);
      deleteContactLens(deletingLensId);
      setDeletingLensId(null);
      setSearchResults(prev => prev.filter(lens => lens.id !== deletingLensId));
      
      toast.success(language === 'ar'
        ? `تم حذف العدسة اللاصقة بنجاح: ${lensToDelete?.brand} ${lensToDelete?.type}`
        : `Successfully deleted contact lens: ${lensToDelete?.brand} ${lensToDelete?.type}`);
    }
  };
  
  // Handle add/edit custom brand
  const handleAddCustomBrand = (brand: string) => {
    setSavedCustomBrands(prev => [...prev, brand]);
  };
  
  // Handle delete custom brand
  const handleDeleteCustomBrand = (brand: string) => {
    // Check if the brand is in use
    const brandInUse = contactLenses.some(lens => lens.brand === brand);
    if (brandInUse) {
      toast.error(
        language === 'ar'
          ? `لا يمكن حذف البراند "${brand}" لأنه مستخدم في عدسات لاصقة موجودة`
          : `Cannot delete brand "${brand}" as it is used in existing contact lenses`
      );
      return;
    }
    setSavedCustomBrands(prev => prev.filter(b => b !== brand));
  };
  
  // Handle add/edit custom type
  const handleAddCustomType = (type: string) => {
    setSavedCustomTypes(prev => [...prev, type]);
  };
  
  // Handle delete custom type
  const handleDeleteCustomType = (type: string) => {
    // Check if the type is in use
    const typeInUse = contactLenses.some(lens => lens.type === type);
    if (typeInUse) {
      toast.error(
        language === 'ar'
          ? `لا يمكن حذف النوع "${type}" لأنه مستخدم في عدسات لاصقة موجودة`
          : `Cannot delete type "${type}" as it is used in existing contact lenses`
      );
      return;
    }
    setSavedCustomTypes(prev => prev.filter(t => t !== type));
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
  
  // Group contact lenses by brand
  const groupedByBrand = React.useMemo(() => {
    const grouped: Record<string, ContactLensItem[]> = {};
    
    searchResults.forEach(lens => {
      if (!grouped[lens.brand]) {
        grouped[lens.brand] = [];
      }
      grouped[lens.brand].push(lens);
    });
    
    return grouped;
  }, [searchResults]);
  
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
          <Select value={filterBrand} onValueChange={setFilterBrand}>
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
          
          <Select value={filterType} onValueChange={setFilterType}>
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
          
          <Button
            variant="outline"
            className="shrink-0 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
            onClick={() => setIsManageDialogOpen(true)}
          >
            <Settings className="h-4 w-4 mr-1" /> {language === 'ar' ? 'إدارة الخيارات' : 'Manage Options'}
          </Button>
        </div>
      </div>
      
      {Object.keys(groupedByBrand).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedByBrand).map(([brand, lenses]) => (
            <CollapsibleCard 
              key={brand}
              title={`${brand} (${lenses.length})`}
              defaultOpen={true}
              headerClassName="bg-gradient-to-r from-blue-50 to-blue-100"
              titleClassName="text-blue-800 font-medium flex items-center gap-2"
              contentClassName="p-4 bg-white"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lenses.map(lens => (
                  <ContactLensCard
                    key={lens.id}
                    lens={lens}
                    onEdit={handleEditLens}
                    onDelete={handleDeleteLens}
                  />
                ))}
              </div>
            </CollapsibleCard>
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
      
      {/* Manage Brands and Types Dialog */}
      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'إدارة البراندات والأنواع' : 'Manage Brands & Types'}
            </DialogTitle>
            <DialogDescription>
              {language === 'ar' 
                ? 'أضف أو احذف البراندات والأنواع المخصصة من هذه القائمة'
                : 'Add or remove custom brands and types from this list'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeManageTab} onValueChange={(value) => setActiveManageTab(value as "brands" | "types")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="brands" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {language === 'ar' ? 'البراندات' : 'Brands'}
              </TabsTrigger>
              <TabsTrigger value="types" className="flex items-center gap-2">
                <Contact className="h-4 w-4" />
                {language === 'ar' ? 'الأنواع' : 'Types'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="brands" className="mt-0">
              <CustomBrandsManager
                savedBrands={savedCustomBrands}
                onSaveBrand={handleAddCustomBrand}
                onDeleteBrand={handleDeleteCustomBrand}
              />
            </TabsContent>
            
            <TabsContent value="types" className="mt-0">
              <CustomTypesManager
                savedTypes={savedCustomTypes}
                onSaveType={handleAddCustomType}
                onDeleteType={handleDeleteCustomType}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={() => setIsManageDialogOpen(false)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {language === 'ar' ? 'تم' : 'Done'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingLensId} onOpenChange={(open) => !open && setDeletingLensId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'ar' 
                ? 'هل أنت متأكد أنك تريد حذف هذه العدسة اللاصقة؟ لا يمكن التراجع عن هذا الإجراء.'
                : 'Are you sure you want to delete this contact lens? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === 'ar' ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteLens}
              className="bg-destructive hover:bg-destructive/90"
            >
              {language === 'ar' ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
