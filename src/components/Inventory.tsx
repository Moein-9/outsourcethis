
import React, { useState } from "react";
import { useInventoryStore } from "@/store/inventoryStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Search,
  Plus,
  Package,
  Glasses,
  Contact,
  Droplets,
  X,
  Edit,
  Save,
  Eye,
  ArrowUpDown,
  Filter,
  AlertCircle,
  Target,
  Tag,
  Sparkles,
  ShoppingCart,
  Trash2,
  Copy,
  CircleDollarSign,
  Bookmark,
  PackageCheck,
  Layers
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Frame Item Component
const FrameItem = ({ frame, index }) => {
  return (
    <Card key={index} className="overflow-hidden hover:shadow-md transition-all duration-200">
      <CardHeader className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Glasses className="h-4 w-4 text-indigo-600" />
              {frame.brand} - {frame.model}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              <Tag className="h-3 w-3" /> {frame.price.toFixed(2)} KWD
            </CardDescription>
          </div>
          <Badge variant={frame.qty > 5 ? "outline" : "destructive"} className="text-xs">
            {frame.qty} في المخزون
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">اللون:</span>
          <span className="font-medium">{frame.color}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">المقاس:</span>
          <span className="font-medium">{frame.size || "غير محدد"}</span>
        </div>
      </CardContent>
      <CardFooter className="p-0 border-t">
        <div className="grid grid-cols-2 w-full divide-x divide-x-reverse">
          <Button variant="ghost" className="rounded-none h-10 text-blue-600">
            <Edit className="h-4 w-4 mr-1" /> تعديل
          </Button>
          <Button variant="ghost" className="rounded-none h-10 text-amber-600">
            <Copy className="h-4 w-4 mr-1" /> نسخ
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Contact Lens Component
const ContactLensItem = ({ lens, index }) => {
  return (
    <Card key={index} className="overflow-hidden hover:shadow-md transition-all duration-200">
      <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Contact className="h-4 w-4 text-blue-600" />
              {lens.brand} - {lens.name}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              <Tag className="h-3 w-3" /> {lens.price.toFixed(2)} KWD
            </CardDescription>
          </div>
          <Badge variant={lens.qty > 5 ? "outline" : "destructive"} className="text-xs">
            {lens.qty} في المخزون
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">النوع:</span>
          <span className="font-medium">{lens.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">مدة الاستخدام:</span>
          <span className="font-medium">{lens.duration}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">عبوة:</span>
          <span className="font-medium">{lens.packageCount} {lens.packageUnit}</span>
        </div>
      </CardContent>
      <CardFooter className="p-0 border-t">
        <div className="grid grid-cols-2 w-full divide-x divide-x-reverse">
          <Button variant="ghost" className="rounded-none h-10 text-blue-600">
            <Edit className="h-4 w-4 mr-1" /> تعديل
          </Button>
          <Button variant="ghost" className="rounded-none h-10 text-amber-600">
            <ShoppingCart className="h-4 w-4 mr-1" /> بيع
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Lens Item Component
const LensItem = ({ lens, index }) => {
  return (
    <Card key={index} className="overflow-hidden hover:shadow-md transition-all duration-200">
      <CardHeader className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-600" />
              {lens.name}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              <Tag className="h-3 w-3" /> {lens.price.toFixed(2)} KWD
            </CardDescription>
          </div>
          <Badge variant={lens.type === "bifocal" ? "default" : "secondary"} className="text-xs">
            {lens.type === "single" ? "أحادية البؤرة" : lens.type === "bifocal" ? "ثنائية البؤرة" : "متعددة البؤرة"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">المادة:</span>
          <span className="font-medium">{lens.material}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">الميزات:</span>
          <span className="font-medium">{lens.features.join(", ")}</span>
        </div>
      </CardContent>
      <CardFooter className="p-0 border-t">
        <div className="grid grid-cols-2 w-full divide-x divide-x-reverse">
          <Button variant="ghost" className="rounded-none h-10 text-blue-600">
            <Edit className="h-4 w-4 mr-1" /> تعديل
          </Button>
          <Button variant="ghost" className="rounded-none h-10 text-green-600">
            <Sparkles className="h-4 w-4 mr-1" /> إضافات
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Mock data for contact lenses
const mockContactLenses = [
  { 
    id: 'cl1', 
    brand: 'Acuvue', 
    name: 'Oasys', 
    type: 'يومية', 
    duration: 'يومي',
    packageCount: 30,
    packageUnit: 'عدسة',
    price: 25.00, 
    qty: 10 
  },
  { 
    id: 'cl2', 
    brand: 'Bausch & Lomb', 
    name: 'Ultra', 
    type: 'شهرية', 
    duration: 'شهر واحد',
    packageCount: 6,
    packageUnit: 'عدسات',
    price: 30.00, 
    qty: 8 
  },
  { 
    id: 'cl3', 
    brand: 'Air Optix', 
    name: 'Hydraglyde', 
    type: 'شهرية', 
    duration: 'شهر واحد',
    packageCount: 3,
    packageUnit: 'عدسات',
    price: 20.00, 
    qty: 12 
  },
];

// Mock data for lenses
const mockLenses = [
  { 
    id: 'l1', 
    name: 'عدسة فوتوكرومية بريميوم', 
    type: 'single', 
    material: 'بلاستيك خفيف الوزن',
    features: ['مقاومة للخدش', 'مضادة للأشعة الزرقاء'],
    price: 45.00
  },
  { 
    id: 'l2', 
    name: 'عدسة ثنائية البؤرة المتطورة', 
    type: 'bifocal', 
    material: 'بولي كربونات',
    features: ['مقاومة للكسر', 'مضادة للانعكاس'],
    price: 65.00
  },
  { 
    id: 'l3', 
    name: 'عدسة متعددة البؤرة الذكية', 
    type: 'multifocal', 
    material: 'تريفكس',
    features: ['مضادة للوهج', 'حماية UV', 'تلقائية التظليل'],
    price: 85.00
  },
];

export const Inventory: React.FC = () => {
  const { frames, addFrame, searchFrames } = useInventoryStore();
  
  // State variables
  const [activeTab, setActiveTab] = useState("frames");
  const [frameSearchTerm, setFrameSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchFrames>>([]);
  const [contactLensSearchTerm, setContactLensSearchTerm] = useState("");
  const [contactLensResults, setContactLensResults] = useState(mockContactLenses);
  const [lensSearchTerm, setLensSearchTerm] = useState("");
  const [lensResults, setLensResults] = useState(mockLenses);
  const [isAddFrameDialogOpen, setIsAddFrameDialogOpen] = useState(false);
  const [isAddContactLensDialogOpen, setIsAddContactLensDialogOpen] = useState(false);
  const [isAddLensDialogOpen, setIsAddLensDialogOpen] = useState(false);
  
  // New frame states
  const [frameBrand, setFrameBrand] = useState("");
  const [frameModel, setFrameModel] = useState("");
  const [frameColor, setFrameColor] = useState("");
  const [frameSize, setFrameSize] = useState("");
  const [framePrice, setFramePrice] = useState("");
  const [frameQty, setFrameQty] = useState("1");
  
  // New contact lens states
  const [contactLensBrand, setContactLensBrand] = useState("");
  const [contactLensName, setContactLensName] = useState("");
  const [contactLensType, setContactLensType] = useState("يومية");
  const [contactLensDuration, setContactLensDuration] = useState("يومي");
  const [contactLensPackageCount, setContactLensPackageCount] = useState("30");
  const [contactLensPackageUnit, setContactLensPackageUnit] = useState("عدسة");
  const [contactLensPrice, setContactLensPrice] = useState("");
  const [contactLensQty, setContactLensQty] = useState("1");
  
  // New lens states
  const [lensName, setLensName] = useState("");
  const [lensType, setLensType] = useState("single");
  const [lensMaterial, setLensMaterial] = useState("");
  const [lensFeatures, setLensFeatures] = useState("");
  const [lensPrice, setLensPrice] = useState("");
  
  // Handle frame search
  const handleFrameSearch = () => {
    if (!frameSearchTerm.trim()) {
      setSearchResults(frames);
      return;
    }
    
    const results = searchFrames(frameSearchTerm);
    setSearchResults(results);
    
    if (results.length === 0) {
      toast.info("لم يتم العثور على إطارات مطابقة للبحث.");
    }
  };
  
  // Handle contact lens search
  const handleContactLensSearch = () => {
    if (!contactLensSearchTerm.trim()) {
      setContactLensResults(mockContactLenses);
      return;
    }
    
    const results = mockContactLenses.filter(
      lens => lens.brand.toLowerCase().includes(contactLensSearchTerm.toLowerCase()) ||
              lens.name.toLowerCase().includes(contactLensSearchTerm.toLowerCase()) ||
              lens.type.includes(contactLensSearchTerm)
    );
    
    setContactLensResults(results);
    
    if (results.length === 0) {
      toast.info("لم يتم العثور على عدسات لاصقة مطابقة للبحث.");
    }
  };
  
  // Handle lens search
  const handleLensSearch = () => {
    if (!lensSearchTerm.trim()) {
      setLensResults(mockLenses);
      return;
    }
    
    const results = mockLenses.filter(
      lens => lens.name.includes(lensSearchTerm) ||
              lens.material.includes(lensSearchTerm) ||
              lens.features.some(feature => feature.includes(lensSearchTerm))
    );
    
    setLensResults(results);
    
    if (results.length === 0) {
      toast.info("لم يتم العثور على عدسات مطابقة للبحث.");
    }
  };
  
  // Handle adding a new frame
  const handleAddFrame = () => {
    if (!frameBrand || !frameModel || !frameColor || !framePrice) {
      toast.error("الرجاء إدخال تفاصيل الإطار كاملة");
      return;
    }
    
    const price = parseFloat(framePrice);
    const qty = parseInt(frameQty);
    
    if (isNaN(price) || price <= 0) {
      toast.error("الرجاء إدخال سعر صحيح");
      return;
    }
    
    if (isNaN(qty) || qty <= 0) {
      toast.error("الرجاء إدخال كمية صحيحة");
      return;
    }
    
    const frameId = addFrame({
      brand: frameBrand,
      model: frameModel,
      color: frameColor,
      size: frameSize,
      price,
      qty
    });
    
    toast.success(`تم إضافة الإطار بنجاح: ${frameBrand} ${frameModel}`);
    
    // Reset form and close dialog
    setFrameBrand("");
    setFrameModel("");
    setFrameColor("");
    setFrameSize("");
    setFramePrice("");
    setFrameQty("1");
    setIsAddFrameDialogOpen(false);
    
    // Refresh search results
    setSearchResults(frames);
  };
  
  // Handle adding a new contact lens
  const handleAddContactLens = () => {
    if (!contactLensBrand || !contactLensName || !contactLensPrice) {
      toast.error("الرجاء إدخال تفاصيل العدسة اللاصقة كاملة");
      return;
    }
    
    const price = parseFloat(contactLensPrice);
    const qty = parseInt(contactLensQty);
    const packageCount = parseInt(contactLensPackageCount);
    
    if (isNaN(price) || price <= 0) {
      toast.error("الرجاء إدخال سعر صحيح");
      return;
    }
    
    if (isNaN(qty) || qty <= 0) {
      toast.error("الرجاء إدخال كمية صحيحة");
      return;
    }
    
    if (isNaN(packageCount) || packageCount <= 0) {
      toast.error("الرجاء إدخال عدد العبوة بشكل صحيح");
      return;
    }
    
    // Simulate adding a contact lens (would need to be integrated with store)
    const newLens = {
      id: `cl${Date.now()}`,
      brand: contactLensBrand,
      name: contactLensName,
      type: contactLensType,
      duration: contactLensDuration,
      packageCount: packageCount,
      packageUnit: contactLensPackageUnit,
      price,
      qty
    };
    
    // Add to mock data for demo purposes
    mockContactLenses.push(newLens);
    setContactLensResults([...mockContactLenses]);
    
    toast.success(`تم إضافة العدسة اللاصقة بنجاح: ${contactLensBrand} ${contactLensName}`);
    
    // Reset form and close dialog
    setContactLensBrand("");
    setContactLensName("");
    setContactLensType("يومية");
    setContactLensDuration("يومي");
    setContactLensPackageCount("30");
    setContactLensPackageUnit("عدسة");
    setContactLensPrice("");
    setContactLensQty("1");
    setIsAddContactLensDialogOpen(false);
  };
  
  // Handle adding a new lens
  const handleAddLens = () => {
    if (!lensName || !lensMaterial || !lensPrice) {
      toast.error("الرجاء إدخال تفاصيل العدسة كاملة");
      return;
    }
    
    const price = parseFloat(lensPrice);
    
    if (isNaN(price) || price <= 0) {
      toast.error("الرجاء إدخال سعر صحيح");
      return;
    }
    
    const featuresArray = lensFeatures.split(',').map(feature => feature.trim());
    
    // Simulate adding a lens (would need to be integrated with store)
    const newLens = {
      id: `l${Date.now()}`,
      name: lensName,
      type: lensType,
      material: lensMaterial,
      features: featuresArray,
      price
    };
    
    // Add to mock data for demo purposes
    mockLenses.push(newLens);
    setLensResults([...mockLenses]);
    
    toast.success(`تم إضافة العدسة بنجاح: ${lensName}`);
    
    // Reset form and close dialog
    setLensName("");
    setLensType("single");
    setLensMaterial("");
    setLensFeatures("");
    setLensPrice("");
    setIsAddLensDialogOpen(false);
  };
  
  // Initialize search results
  React.useEffect(() => {
    setSearchResults(frames);
  }, [frames]);
  
  return (
    <div className="py-4 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">إدارة المخزون</h2>
          <p className="text-muted-foreground">إدارة الإطارات، العدسات، والعدسات اللاصقة</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="frames" className="flex items-center gap-2">
            <Glasses className="h-4 w-4" /> الإطارات
          </TabsTrigger>
          <TabsTrigger value="contactLenses" className="flex items-center gap-2">
            <Contact className="h-4 w-4" /> العدسات اللاصقة
          </TabsTrigger>
          <TabsTrigger value="lenses" className="flex items-center gap-2">
            <Layers className="h-4 w-4" /> العدسات الطبية
          </TabsTrigger>
        </TabsList>
        
        {/* Frames Tab */}
        <TabsContent value="frames" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={frameSearchTerm}
                  onChange={(e) => setFrameSearchTerm(e.target.value)}
                  placeholder="البحث عن إطار (ماركة، موديل، لون...)"
                  className="pl-9 w-full"
                  onKeyDown={(e) => e.key === 'Enter' && handleFrameSearch()}
                />
              </div>
              <Button onClick={handleFrameSearch} variant="secondary" className="shrink-0">
                <Search className="h-4 w-4 mr-1" /> بحث
              </Button>
            </div>
            
            <Dialog open={isAddFrameDialogOpen} onOpenChange={setIsAddFrameDialogOpen}>
              <DialogTrigger asChild>
                <Button className="shrink-0">
                  <Plus className="h-4 w-4 mr-1" /> إضافة إطار جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>إضافة إطار جديد</DialogTitle>
                  <DialogDescription>
                    أدخل تفاصيل الإطار الجديد لإضافته إلى المخزون
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frameBrand">الماركة</Label>
                      <Input
                        id="frameBrand"
                        value={frameBrand}
                        onChange={(e) => setFrameBrand(e.target.value)}
                        placeholder="مثال: RayBan"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="frameModel">الموديل</Label>
                      <Input
                        id="frameModel"
                        value={frameModel}
                        onChange={(e) => setFrameModel(e.target.value)}
                        placeholder="مثال: RB3025"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frameColor">اللون</Label>
                      <Input
                        id="frameColor"
                        value={frameColor}
                        onChange={(e) => setFrameColor(e.target.value)}
                        placeholder="مثال: أسود"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="frameSize">المقاس</Label>
                      <Input
                        id="frameSize"
                        value={frameSize}
                        onChange={(e) => setFrameSize(e.target.value)}
                        placeholder="مثال: 52-18-145"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="framePrice">السعر (KWD)</Label>
                      <Input
                        id="framePrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={framePrice}
                        onChange={(e) => setFramePrice(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="frameQty">الكمية</Label>
                      <Input
                        id="frameQty"
                        type="number"
                        step="1"
                        min="1"
                        value={frameQty}
                        onChange={(e) => setFrameQty(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddFrameDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleAddFrame}>
                    <Save className="h-4 w-4 mr-1" /> حفظ الإطار
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((frame, index) => (
                <FrameItem key={index} frame={frame} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 rounded-lg p-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-1">لا توجد إطارات</h3>
              <p className="text-muted-foreground mb-4">
                لم يتم العثور على إطارات مطابقة للبحث.
              </p>
              <Button variant="outline" onClick={() => {
                setFrameSearchTerm("");
                setSearchResults(frames);
              }}>
                عرض جميع الإطارات
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Contact Lenses Tab */}
        <TabsContent value="contactLenses" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={contactLensSearchTerm}
                  onChange={(e) => setContactLensSearchTerm(e.target.value)}
                  placeholder="البحث عن عدسة لاصقة (ماركة، نوع...)"
                  className="pl-9 w-full"
                  onKeyDown={(e) => e.key === 'Enter' && handleContactLensSearch()}
                />
              </div>
              <Button onClick={handleContactLensSearch} variant="secondary" className="shrink-0">
                <Search className="h-4 w-4 mr-1" /> بحث
              </Button>
            </div>
            
            <Dialog open={isAddContactLensDialogOpen} onOpenChange={setIsAddContactLensDialogOpen}>
              <DialogTrigger asChild>
                <Button className="shrink-0">
                  <Plus className="h-4 w-4 mr-1" /> إضافة عدسة لاصقة
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>إضافة عدسة لاصقة جديدة</DialogTitle>
                  <DialogDescription>
                    أدخل تفاصيل العدسة اللاصقة الجديدة لإضافتها إلى المخزون
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactLensBrand">الماركة</Label>
                      <Input
                        id="contactLensBrand"
                        value={contactLensBrand}
                        onChange={(e) => setContactLensBrand(e.target.value)}
                        placeholder="مثال: Acuvue"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactLensName">الاسم</Label>
                      <Input
                        id="contactLensName"
                        value={contactLensName}
                        onChange={(e) => setContactLensName(e.target.value)}
                        placeholder="مثال: Oasys"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactLensType">النوع</Label>
                      <Select 
                        value={contactLensType} 
                        onValueChange={setContactLensType}
                      >
                        <SelectTrigger id="contactLensType">
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="يومية">يومية</SelectItem>
                          <SelectItem value="أسبوعية">أسبوعية</SelectItem>
                          <SelectItem value="شهرية">شهرية</SelectItem>
                          <SelectItem value="ربع سنوية">ربع سنوية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactLensDuration">مدة الاستخدام</Label>
                      <Select 
                        value={contactLensDuration} 
                        onValueChange={setContactLensDuration}
                      >
                        <SelectTrigger id="contactLensDuration">
                          <SelectValue placeholder="اختر المدة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="يومي">يومي</SelectItem>
                          <SelectItem value="أسبوع واحد">أسبوع واحد</SelectItem>
                          <SelectItem value="شهر واحد">شهر واحد</SelectItem>
                          <SelectItem value="ثلاثة أشهر">ثلاثة أشهر</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactLensPackageCount">عدد العبوة</Label>
                      <Input
                        id="contactLensPackageCount"
                        type="number"
                        step="1"
                        min="1"
                        value={contactLensPackageCount}
                        onChange={(e) => setContactLensPackageCount(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactLensPackageUnit">وحدة العبوة</Label>
                      <Select 
                        value={contactLensPackageUnit} 
                        onValueChange={setContactLensPackageUnit}
                      >
                        <SelectTrigger id="contactLensPackageUnit">
                          <SelectValue placeholder="اختر الوحدة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="عدسة">عدسة</SelectItem>
                          <SelectItem value="عدسات">عدسات</SelectItem>
                          <SelectItem value="زوج">زوج</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactLensPrice">السعر (KWD)</Label>
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
                      <Label htmlFor="contactLensQty">الكمية</Label>
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
                  <Button variant="outline" onClick={() => setIsAddContactLensDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleAddContactLens}>
                    <Save className="h-4 w-4 mr-1" /> حفظ العدسة
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {contactLensResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contactLensResults.map((lens, index) => (
                <ContactLensItem key={index} lens={lens} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 rounded-lg p-12 text-center">
              <Contact className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-1">لا توجد عدسات لاصقة</h3>
              <p className="text-muted-foreground mb-4">
                لم يتم العثور على عدسات لاصقة مطابقة للبحث.
              </p>
              <Button variant="outline" onClick={() => {
                setContactLensSearchTerm("");
                setContactLensResults(mockContactLenses);
              }}>
                عرض جميع العدسات اللاصقة
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Lenses Tab */}
        <TabsContent value="lenses" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={lensSearchTerm}
                  onChange={(e) => setLensSearchTerm(e.target.value)}
                  placeholder="البحث عن عدسة (نوع، ميزات...)"
                  className="pl-9 w-full"
                  onKeyDown={(e) => e.key === 'Enter' && handleLensSearch()}
                />
              </div>
              <Button onClick={handleLensSearch} variant="secondary" className="shrink-0">
                <Search className="h-4 w-4 mr-1" /> بحث
              </Button>
            </div>
            
            <Dialog open={isAddLensDialogOpen} onOpenChange={setIsAddLensDialogOpen}>
              <DialogTrigger asChild>
                <Button className="shrink-0">
                  <Plus className="h-4 w-4 mr-1" /> إضافة عدسة طبية
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>إضافة عدسة طبية جديدة</DialogTitle>
                  <DialogDescription>
                    أدخل تفاصيل العدسة الطبية الجديدة لإضافتها إلى المخزون
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="lensName">اسم العدسة</Label>
                    <Input
                      id="lensName"
                      value={lensName}
                      onChange={(e) => setLensName(e.target.value)}
                      placeholder="مثال: عدسة فوتوكرومية بريميوم"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lensType">نوع العدسة</Label>
                    <Select 
                      value={lensType} 
                      onValueChange={setLensType}
                    >
                      <SelectTrigger id="lensType">
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">أحادية البؤرة</SelectItem>
                        <SelectItem value="bifocal">ثنائية البؤرة</SelectItem>
                        <SelectItem value="multifocal">متعددة البؤرة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lensMaterial">المادة</Label>
                    <Input
                      id="lensMaterial"
                      value={lensMaterial}
                      onChange={(e) => setLensMaterial(e.target.value)}
                      placeholder="مثال: بلاستيك خفيف الوزن"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lensFeatures">الميزات (مفصولة بفاصلة)</Label>
                    <Input
                      id="lensFeatures"
                      value={lensFeatures}
                      onChange={(e) => setLensFeatures(e.target.value)}
                      placeholder="مثال: مقاومة للخدش, مضادة للأشعة الزرقاء"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lensPrice">السعر (KWD)</Label>
                    <Input
                      id="lensPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={lensPrice}
                      onChange={(e) => setLensPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddLensDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleAddLens}>
                    <Save className="h-4 w-4 mr-1" /> حفظ العدسة
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {lensResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lensResults.map((lens, index) => (
                <LensItem key={index} lens={lens} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 rounded-lg p-12 text-center">
              <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-1">لا توجد عدسات طبية</h3>
              <p className="text-muted-foreground mb-4">
                لم يتم العثور على عدسات طبية مطابقة للبحث.
              </p>
              <Button variant="outline" onClick={() => {
                setLensSearchTerm("");
                setLensResults(mockLenses);
              }}>
                عرض جميع العدسات الطبية
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
