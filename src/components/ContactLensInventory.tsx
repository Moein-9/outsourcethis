
import React, { useState } from "react";
import { useInventoryStore, ContactLensItem } from "@/store/inventoryStore";
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
import { Search, Plus, Contact, Edit, ShoppingCart, Save } from "lucide-react";

// Contact Lens Item Component
const ContactLensItemCard = ({ lens, index }: { lens: ContactLensItem; index: number }) => {
  return (
    <Card key={index} className="overflow-hidden hover:shadow-md transition-all duration-200">
      <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Contact className="h-4 w-4 text-blue-600" />
              {lens.brand} - {lens.type}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              {lens.price.toFixed(2)} KWD
            </CardDescription>
          </div>
          <Badge variant={lens.qty > 5 ? "outline" : "destructive"} className="text-xs">
            {lens.qty} في المخزون
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">BC:</span>
          <span className="font-medium">{lens.bc}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">القطر:</span>
          <span className="font-medium">{lens.diameter}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">القوة:</span>
          <span className="font-medium">{lens.power}</span>
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

export const ContactLensInventory: React.FC = () => {
  const { contactLenses, addContactLens, searchContactLenses } = useInventoryStore();
  
  // State variables
  const [contactLensSearchTerm, setContactLensSearchTerm] = useState("");
  const [contactLensResults, setContactLensResults] = useState<ReturnType<typeof searchContactLenses>>([]);
  const [isAddContactLensDialogOpen, setIsAddContactLensDialogOpen] = useState(false);
  
  // New contact lens states
  const [contactLensBrand, setContactLensBrand] = useState("");
  const [contactLensType, setContactLensType] = useState("");
  const [contactLensBC, setContactLensBC] = useState("");
  const [contactLensDiameter, setContactLensDiameter] = useState("");
  const [contactLensPower, setContactLensPower] = useState("");
  const [contactLensPrice, setContactLensPrice] = useState("");
  const [contactLensQty, setContactLensQty] = useState("1");
  
  // Handle contact lens search
  const handleContactLensSearch = () => {
    if (!contactLensSearchTerm.trim()) {
      setContactLensResults(contactLenses);
      return;
    }
    
    const results = searchContactLenses(contactLensSearchTerm);
    setContactLensResults(results);
    
    if (results.length === 0) {
      toast.info("لم يتم العثور على عدسات لاصقة مطابقة للبحث.");
    }
  };
  
  // Handle adding a new contact lens
  const handleAddContactLens = () => {
    if (!contactLensBrand || !contactLensType || !contactLensBC || !contactLensDiameter || !contactLensPower || !contactLensPrice) {
      toast.error("الرجاء إدخال تفاصيل العدسة اللاصقة كاملة");
      return;
    }
    
    const price = parseFloat(contactLensPrice);
    const qty = parseInt(contactLensQty);
    
    if (isNaN(price) || price <= 0) {
      toast.error("الرجاء إدخال سعر صحيح");
      return;
    }
    
    if (isNaN(qty) || qty <= 0) {
      toast.error("الرجاء إدخال كمية صحيحة");
      return;
    }
    
    const id = addContactLens({
      brand: contactLensBrand,
      type: contactLensType,
      bc: contactLensBC,
      diameter: contactLensDiameter,
      power: contactLensPower,
      price,
      qty
    });
    
    toast.success(`تم إضافة العدسة اللاصقة بنجاح: ${contactLensBrand} ${contactLensType}`);
    
    // Reset form and close dialog
    setContactLensBrand("");
    setContactLensType("");
    setContactLensBC("");
    setContactLensDiameter("");
    setContactLensPower("");
    setContactLensPrice("");
    setContactLensQty("1");
    setIsAddContactLensDialogOpen(false);
    
    // Refresh search results
    setContactLensResults(contactLenses);
  };
  
  // Initialize search results
  React.useEffect(() => {
    setContactLensResults(contactLenses);
  }, [contactLenses]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={contactLensSearchTerm}
              onChange={(e) => setContactLensSearchTerm(e.target.value)}
              placeholder="البحث عن عدسة لاصقة (ماركة، نوع، قوة...)"
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
                  <Label htmlFor="contactLensType">النوع</Label>
                  <Input
                    id="contactLensType"
                    value={contactLensType}
                    onChange={(e) => setContactLensType(e.target.value)}
                    placeholder="مثال: Daily"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactLensBC">BC</Label>
                  <Input
                    id="contactLensBC"
                    value={contactLensBC}
                    onChange={(e) => setContactLensBC(e.target.value)}
                    placeholder="مثال: 8.5"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactLensDiameter">القطر</Label>
                  <Input
                    id="contactLensDiameter"
                    value={contactLensDiameter}
                    onChange={(e) => setContactLensDiameter(e.target.value)}
                    placeholder="مثال: 14.2"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactLensPower">القوة</Label>
                  <Input
                    id="contactLensPower"
                    value={contactLensPower}
                    onChange={(e) => setContactLensPower(e.target.value)}
                    placeholder="مثال: -2.00"
                  />
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
            <ContactLensItemCard key={lens.id} lens={lens} index={index} />
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
            setContactLensResults(contactLenses);
          }}>
            عرض جميع العدسات اللاصقة
          </Button>
        </div>
      )}
    </div>
  );
};
