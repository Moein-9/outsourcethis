
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
import { useLanguage } from "@/contexts/LanguageContext";

export const LensTypeManager: React.FC = () => {
  const { lensTypes, addLensType, updateLensType, deleteLensType } = useInventoryStore();
  const [activeTab, setActiveTab] = useState<string>("distance");
  const { t, language } = useLanguage();
  
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
      toast.error(language === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }
    
    addLensType({
      name: newLensName,
      price: Number(newLensPrice),
      type: newLensType
    });
    
    toast.success(language === "ar" ? "تمت إضافة نوع العدسة بنجاح" : "Lens type added successfully");
    
    // Reset form
    setNewLensName("");
    setNewLensPrice("");
    setIsAddDialogOpen(false);
  };
  
  const handleEditLens = () => {
    if (!editLensName || editLensPrice === "") {
      toast.error(language === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }
    
    updateLensType(editLensId, {
      name: editLensName,
      price: Number(editLensPrice),
      type: editLensType
    });
    
    toast.success(language === "ar" ? "تم تحديث نوع العدسة بنجاح" : "Lens type updated successfully");
    
    // Reset form
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteLens = (id: string) => {
    deleteLensType(id);
    toast.success(language === "ar" ? "تم حذف نوع العدسة بنجاح" : "Lens type deleted successfully");
  };
  
  const startEditLens = (lens: LensType) => {
    setEditLensId(lens.id);
    setEditLensName(lens.name);
    setEditLensPrice(lens.price);
    setEditLensType(lens.type);
    setIsEditDialogOpen(true);
  };
  
  const lensTypeCategories = [
    { value: "distance", label: t("distance") },
    { value: "reading", label: t("reading") },
    { value: "progressive", label: t("progressive") },
    { value: "bifocal", label: t("bifocal") },
    { value: "sunglasses", label: t("sunglasses") }
  ];
  
  const filteredLenses = lensTypes.filter(lens => lens.type === activeTab);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t("lens_types")}</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus size={16} />
              {t("add_lens_type")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("add_new_lens_type")}</DialogTitle>
              <DialogDescription>
                {t("enter_lens_details")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t("lens_name")}</Label>
                <Input
                  id="name"
                  value={newLensName}
                  onChange={(e) => setNewLensName(e.target.value)}
                  placeholder={language === "ar" ? "مثال: عدسات القراءة الممتازة" : "Example: Premium Reading Lenses"}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">{t("price")}</Label>
                <Input
                  id="price"
                  type="number"
                  value={newLensPrice}
                  onChange={(e) => setNewLensPrice(e.target.value ? Number(e.target.value) : "")}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">{t("type")}</Label>
                <Select value={newLensType} onValueChange={(value) => setNewLensType(value as any)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder={t("select_lens_type")} />
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
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>{t("cancel")}</Button>
              <Button onClick={handleAddLens}>{t("add")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="distance" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-4">
          <TabsTrigger value="distance">{t("distance")}</TabsTrigger>
          <TabsTrigger value="reading">{t("reading")}</TabsTrigger>
          <TabsTrigger value="progressive">{t("progressive")}</TabsTrigger>
          <TabsTrigger value="bifocal">{t("bifocal")}</TabsTrigger>
          <TabsTrigger value="sunglasses">{t("sunglasses")}</TabsTrigger>
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
                    <p className="text-lg font-bold">{lens.price.toFixed(2)} {language === "ar" ? "د.ك" : "KD"}</p>
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
              <p>{t("no_lenses")}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsAddDialogOpen(true)}>
                {t("add_lens_type")}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("edit_lens_type")}</DialogTitle>
            <DialogDescription>
              {t("update_lens_details")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">{t("lens_name")}</Label>
              <Input
                id="edit-name"
                value={editLensName}
                onChange={(e) => setEditLensName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">{t("price")}</Label>
              <Input
                id="edit-price"
                type="number"
                value={editLensPrice}
                onChange={(e) => setEditLensPrice(e.target.value ? Number(e.target.value) : "")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">{t("type")}</Label>
              <Select value={editLensType} onValueChange={(value) => setEditLensType(value as any)}>
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder={t("select_lens_type")} />
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>{t("cancel")}</Button>
            <Button onClick={handleEditLens}>{t("save_changes")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
