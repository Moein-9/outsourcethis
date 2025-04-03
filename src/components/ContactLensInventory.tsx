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
import { Search, Plus, Contact, Settings, Tag, Database, UploadCloud, Filter, RefreshCw } from "lucide-react";

const bilingualContactLenses = [
  // Contour collection
  { brand: "Contour", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Contour Gray | كونتور - كونتور جراي" },
  { brand: "Contour", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Contour Green | كونتور - كونتور جرين" },
  { brand: "Contour", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Contour Hazel | كونتور - كونتور هيزل" },
  { brand: "Contour", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Platinum Gray | كونتور - بلاتينيوم جراي" },
  
  // Diamond collection
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Agate Brown | دايموند - أجات براون" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Allure Blonde | دايموند - ألور بلوند" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Almond Gray | دايموند - ألموند جراي" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Bluish Gray | دايموند - بلوش جراي" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Brown Shadow | دايموند - براون شادو" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Citrine Crystal | دايموند - سترين كريستال" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Glitter Gray | دايموند - جليتر جراي" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Gray Green | دايموند - جراي جرين" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Gray Shadow | دايموند - جراي شادو" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Hazel Beige | دايموند - هيزل بيج" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Hazel Honey | دايموند - هيزل هني" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Husky Gray Green | دايموند - هسكي جراي جرين" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Jade Green | دايموند - جيد جرين" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Lime Green | دايموند - لايم جرين" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Moon Stone | دايموند - مون ستون" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Mysterious | دايموند - مستيريوس" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Navy Gray | دايموند - نيفي جراي" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Nay | دايموند - ناي" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Oak | دايموند - أوك" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Ocean Blue | دايموند - أوشن بلو" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Pine | دايموند - باين" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Rosewood | دايموند - روزوود" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Saturn | دايموند - ساترن" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Silky Green | دايموند - سيلكي جرين" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Silver Mist | دايموند - سيلفر ميست" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Viola Gray | دايموند - فيولا جراي" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Wild Honey | دايموند - وايلد هني" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Wood Leaf | دايموند - وود ليف" },
  { brand: "Diamond", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Wood Stone | دايموند - وود ستون" },
  
  // Elite collection
  { brand: "Elite", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Amber Gray | إيليت - أمبر جراي" },
  { brand: "Elite", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Cinnamon Brown | إيليت - سينامون براون" },
  { brand: "Elite", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Cloudy Gray | إيليت - كلاودي جراي" },
  { brand: "Elite", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Crystal N | إيليت - كريستال إن" },
  { brand: "Elite", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Emerald Green | إيليت - إميرالد جرين" },
  { brand: "Elite", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Gray Beige | إيليت - جراي بيج" },
  { brand: "Elite", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Gray Olive | إيليت - جراي أوليف" },
  { brand: "Elite", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Green Olive | إيليت - جرين أوليف" },
  { brand: "Elite", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Lavender Gray | إيليت - لافندر جراي" },
  { brand: "Elite", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Matt Olive | إيليت - مات أوليف" },
  { brand: "Elite", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Midnight Blue | إيليت - ميدنايت بلو" },
  { brand: "Elite", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Mint Gray | إيليت - مينت جراي" },
  { brand: "Elite", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Sandy Brown | إيليت - ساندي براون" },
  { brand: "Elite", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Sandy Gray | إيليت - ساندي جراي" },
  { brand: "Elite", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Silky Gold | إيليت - سيلكي جولد" },
  { brand: "Elite", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Silky Gray | إيليت - سيلكي جراي" },
  
  // Glow collection
  { brand: "Glow", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Glow Radiant Hazelnut | جلو - جلو رادينت هيزلنَت" },
  { brand: "Glow", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Gray Caramel | جلو - جراي كراميل" },
  { brand: "Glow", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Radiant Brown | جلو - رادينت براون" },
  { brand: "Glow", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Radiant Gray | جلو - رادينت جراي" },
  { brand: "Glow", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Radiant Hazelnut | جلو - رادينت هيزلنَت" },
  { brand: "Glow", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Vivid Blue | جلو - فيفيد بلو" },
  
  // Highlight collection
  { brand: "Highlight", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Circle Brown | هايلايت - سيركل براون" },
  { brand: "Highlight", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Circle Gray | هايلايت - سيركل جراي" },
  { brand: "Highlight", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Highlight Cool Gray | هايلايت - هايلايت كوول جراي" },
  
  // Natural collection
  { brand: "Natural", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Marengo | ناتشورال - مارينجو" },
  { brand: "Natural", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Natural Cool Gray | ناتشورال - ناتشورال كوول جراي" },
  { brand: "Natural", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Natural Gray | ناتشورال - ناتشورال جراي" },
  { brand: "Natural", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Natural Gray Blue | ناتشورال - ناتشورال جراي بلو" },
  { brand: "Natural", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Natural Green Yellow | ناتشورال - ناتشورال جرين ييلو" },
  
  // One Day collection (daily)
  { brand: "One Day", type: "Daily", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Almond Brown (Daily Disposable) | وَن داي - ألموند براون (يومي)" },
  { brand: "One Day", type: "Daily", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Ash Brown (Daily Disposable) | وَن داي - آش براون (يومي)" },
  { brand: "One Day", type: "Daily", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Cedar (Daily Disposable) | وَن داي - سيدار (يومي)" },
  { brand: "One Day", type: "Daily", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Cove (Daily Disposable) | وَن داي - كوف (يومي)" },
  { brand: "One Day", type: "Daily", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Earth (Daily Disposable) | وَن داي - إيرث (يومي)" },
  { brand: "One Day", type: "Daily", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Mars (Daily Disposable) | وَن داي - مارس (يومي)" },
  { brand: "One Day", type: "Daily", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Moon (Daily Disposable) | وَن داي - مون (يومي)" },
  { brand: "One Day", type: "Daily", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Star (Daily Disposable) | وَن داي - ستار (يومي)" },
  { brand: "One Day", type: "Daily", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Venus (Daily Disposable) | وَن داي - فينوس (يومي)" },
  
  // Snow White collection
  { brand: "Snow White", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Snow White Black | سنو وايت - سنو وايت بلاك" },
  { brand: "Snow White", type: "Monthly", bc: "8.5", diameter: "14.2", power: "-2.00", price: 14, qty: 10, color: "Snow White Satin Gray | سنو وايت - سنو وايت ساتِن جراي" },
];

const allContactLenses = [...bilingualContactLenses];

export const ContactLensInventory: React.FC = () => {
  const { contactLenses, addContactLens, updateContactLens, deleteContactLens, searchContactLenses } = useInventoryStore();
  const { language } = useLanguageStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchContactLenses>>(contactLenses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [editingLens, setEditingLens] = useState<ContactLensItem | null>(null);
  const [deletingLensId, setDeletingLensId] = useState<string | null>(null);
  const [activeManageTab, setActiveManageTab] = useState<"brands" | "types">("brands");
  
  const [savedCustomBrands, setSavedCustomBrands] = useState<string[]>(() => {
    const saved = localStorage.getItem("customBrands");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [savedCustomTypes, setSavedCustomTypes] = useState<string[]>(() => {
    const saved = localStorage.getItem("customTypes");
    return saved ? JSON.parse(saved) : [];
  });
  
  useEffect(() => {
    localStorage.setItem("customBrands", JSON.stringify(savedCustomBrands));
  }, [savedCustomBrands]);
  
  useEffect(() => {
    localStorage.setItem("customTypes", JSON.stringify(savedCustomTypes));
  }, [savedCustomTypes]);
  
  const [filterBrand, setFilterBrand] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterColor, setFilterColor] = useState<string>("all");
  
  const brands = [...new Set(contactLenses.map(lens => lens.brand))].sort();
  const types = [...new Set(contactLenses.map(lens => lens.type))].sort();
  const colors = [...new Set(contactLenses.map(lens => lens.color).filter(Boolean))].sort();
  
  useEffect(() => {
    handleSearch();
  }, [searchTerm, filterBrand, filterType, filterColor, contactLenses]);
  
  const handleSearch = () => {
    let results = searchTerm ? searchContactLenses(searchTerm) : [...contactLenses];
    
    if (filterBrand && filterBrand !== "all") {
      results = results.filter(lens => lens.brand === filterBrand);
    }
    
    if (filterType && filterType !== "all") {
      results = results.filter(lens => lens.type === filterType);
    }
    
    if (filterColor && filterColor !== "all") {
      results = results.filter(lens => lens.color === filterColor);
    }
    
    setSearchResults(results);
    
    if (results.length === 0 && (searchTerm || filterBrand !== "all" || filterType !== "all" || filterColor !== "all")) {
      toast.info(language === 'ar' 
        ? "لم يتم العثور على عدسات لاصقة مطابقة للبحث."
        : "No matching contact lenses were found.");
    }
  };
  
  const resetFilters = () => {
    setSearchTerm("");
    setFilterBrand("all");
    setFilterType("all");
    setFilterColor("all");
    setSearchResults(contactLenses);
  };
  
  const handleFormSubmit = (lensData: Omit<ContactLensItem, "id">) => {
    if (lensData.brand && 
        !["Acuvue", "Air Optix", "Biofinty", "Bella", "FreshLook", "PureVision", "SofLens"].includes(lensData.brand) && 
        !savedCustomBrands.includes(lensData.brand)) {
      setSavedCustomBrands(prev => [...prev, lensData.brand]);
    }
    
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
  
  const handleEditLens = (lens: ContactLensItem) => {
    setEditingLens(lens);
    setIsAddDialogOpen(true);
  };
  
  const handleDeleteLens = (id: string) => {
    setDeletingLensId(id);
  };
  
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
  
  const handleAddCustomBrand = (brand: string) => {
    setSavedCustomBrands(prev => [...prev, brand]);
  };
  
  const handleDeleteCustomBrand = (brand: string) => {
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
  
  const handleAddCustomType = (type: string) => {
    setSavedCustomTypes(prev => [...prev, type]);
  };
  
  const handleDeleteCustomType = (type: string) => {
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
  
  const closeDialog = () => {
    setIsAddDialogOpen(false);
    setEditingLens(null);
  };
  
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
  
  const textDirection = language === 'ar' ? 'rtl' : 'ltr';
  
  const handleBulkImport = () => {
    let importedCount = 0;
    
    allContactLenses.forEach(lens => {
      const existingLens = contactLenses.find(
        cl => cl.brand === lens.brand && 
             cl.type === lens.type && 
             cl.color === lens.color
      );
      
      if (!existingLens) {
        addContactLens(lens);
        importedCount++;
      }
    });
    
    setSearchResults(contactLenses);
    
    if (importedCount > 0) {
      toast.success(
        language === 'ar'
          ? `تم استيراد ${importedCount} عدسات لاصقة بنجاح`
          : `Successfully imported ${importedCount} contact lenses`
      );
    } else {
      toast.info(
        language === 'ar'
          ? `جميع العدسات اللاصقة موجودة بالفعل في المخزون`
          : `All contact lenses are already in the inventory`
      );
    }
  };
  
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
                ? "البحث عن عدسة لاصقة (ماركة، نوع، لون، قطر...)"
                : "Search contact lenses (brand, type, color, diameter...)"}
              className="pl-9 w-full"
            />
          </div>
          <Button variant="outline" onClick={resetFilters} className="shrink-0">
            <RefreshCw className="h-4 w-4 mr-1" /> {language === 'ar' ? 'إعادة ضبط' : 'Reset'}
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
          
          <Select value={filterColor} onValueChange={setFilterColor}>
            <SelectTrigger className="w-52 bg-white">
              <SelectValue placeholder={language === 'ar' ? 'اختر اللون' : 'Select Color'} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">{language === 'ar' ? 'كل الألوان' : 'All Colors'}</SelectItem>
              {colors.map(color => (
                <SelectItem key={color} value={color}>{color}</SelectItem>
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
          
          <Button
            variant="outline"
            className="shrink-0 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
            onClick={handleBulkImport}
          >
            <Database className="h-4 w-4 mr-1" /> {language === 'ar' ? 'استيراد بيانات العدسات' : 'Import Lenses'}
          </Button>
        </div>
      </div>
      
      {searchResults.length > 0 ? (
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
