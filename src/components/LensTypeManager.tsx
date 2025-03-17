
import React, { useState } from "react";
import { useInventoryStore, LensType } from "@/store/inventoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

export const LensTypeManager: React.FC = () => {
  const { lensTypes, addLensType, updateLensType, deleteLensType } = useInventoryStore();
  const [activeTab, setActiveTab] = useState<string>("distance");
  
  // New lens form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLensName, setNewLensName] = useState("");
  const [newLensPrice, setNewLensPrice] = useState<number | "">("");
  const [newLensType, setNewLensType] = useState<"distance" | "reading" | "progressive" | "bifocal" | "sunglasses">("distance");
  
  // Edit lens form state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editLensId, setEditLensId] = useState("");
  const [editLensName, setEditLensName] = useState("");
  const [editLensPrice, setEditLensPrice] = useState<number | "">("");
  const [editLensType, setEditLensType] = useState<"distance" | "reading" | "progressive" | "bifocal" | "sunglasses">("distance");
  
  const handleAddLens = () => {
    if (!newLensName || newLensPrice === "") {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    
    addLensType({
      name: newLensName,
      price: Number(newLensPrice),
      type: newLensType
    });
    
    toast.success("تمت إضافة نوع العدسة بنجاح");
    
    // Reset form
    setNewLensName("");
    setNewLensPrice("");
    setIsAddDialogOpen(false);
  };
  
  const handleEditLens = () => {
    if (!editLensName || editLensPrice === "") {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    
    updateLensType(editLensId, {
      name: editLensName,
      price: Number(editLensPrice),
      type: editLensType
    });
    
    toast.success("تم تحديث نوع العدسة بنجاح");
    
    // Reset form
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteLens = (id: string) => {
    deleteLensType(id);
    toast.success("تم حذف نوع العدسة بنجاح");
  };
  
  const startEditLens = (lens: LensType) => {
    setEditLensId(lens.id);
    setEditLensName(lens.name);
    setEditLensPrice(lens.price);
    setEditLensType(lens.type);
    setIsEditDialogOpen(true);
  };
  
  const lensTypeCategories = [
    { value: "distance", label: "النظر البعيد" },
    { value: "reading", label: "القراءة" },
    { value: "progressive", label: "التقدمية" },
    { value: "bifocal", label: "ثنائية البؤرة" },
    { value: "sunglasses", label: "النظارات الشمسية" }
  ];
  
  const filteredLenses = lensTypes.filter(lens => lens.type === activeTab);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">أنواع العدسات</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus size={16} />
              إضافة نوع عدسة
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة نوع عدسة جديد</DialogTitle>
              <DialogDescription>
                أدخل تفاصيل نوع العدسة الجديد أدناه
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">اسم العدسة</Label>
                <Input
                  id="name"
                  value={newLensName}
                  onChange={(e) => setNewLensName(e.target.value)}
                  placeholder="مثال: عدسات القراءة الممتازة"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">السعر (د.ك)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newLensPrice}
                  onChange={(e) => setNewLensPrice(e.target.value ? Number(e.target.value) : "")}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">النوع</Label>
                <Select value={newLensType} onValueChange={(value) => setNewLensType(value as any)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="اختر نوع العدسة" />
                  </SelectTrigger>
                  <SelectContent>
                    {lensTypeCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleAddLens}>إضافة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="distance" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-4">
          <TabsTrigger value="distance">النظر البعيد</TabsTrigger>
          <TabsTrigger value="reading">القراءة</TabsTrigger>
          <TabsTrigger value="progressive">التقدمية</TabsTrigger>
          <TabsTrigger value="bifocal">ثنائية البؤرة</TabsTrigger>
          <TabsTrigger value="sunglasses">الشمسية</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {filteredLenses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLenses.map((lens) => (
                <Card key={lens.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">{lens.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 pb-2">
                    <p className="text-lg font-bold">{lens.price.toFixed(2)} د.ك</p>
                  </CardContent>
                  <CardFooter className="p-2 flex justify-end gap-2 bg-muted/50">
                    <Button variant="ghost" size="icon" onClick={() => startEditLens(lens)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteLens(lens.id)}>
                      <Trash size={16} />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-muted/50 rounded-lg">
              <p>لا توجد عدسات في هذه الفئة</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsAddDialogOpen(true)}>
                إضافة نوع عدسة
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل نوع العدسة</DialogTitle>
            <DialogDescription>
              قم بتحديث تفاصيل نوع العدسة أدناه
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">اسم العدسة</Label>
              <Input
                id="edit-name"
                value={editLensName}
                onChange={(e) => setEditLensName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">السعر (د.ك)</Label>
              <Input
                id="edit-price"
                type="number"
                value={editLensPrice}
                onChange={(e) => setEditLensPrice(e.target.value ? Number(e.target.value) : "")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">النوع</Label>
              <Select value={editLensType} onValueChange={(value) => setEditLensType(value as any)}>
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="اختر نوع العدسة" />
                </SelectTrigger>
                <SelectContent>
                  {lensTypeCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleEditLens}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
