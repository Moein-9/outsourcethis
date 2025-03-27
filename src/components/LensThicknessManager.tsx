
import React, { useState } from "react";
import { useInventoryStore, LensThickness } from "@/store/inventoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/languageStore";

export const LensThicknessManager: React.FC = () => {
  const { lensThicknesses, addLensThickness, updateLensThickness, deleteLensThickness } = useInventoryStore();
  const { t, language } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<string>("distance-reading");
  
  // New thickness form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newThicknessName, setNewThicknessName] = useState("");
  const [newThicknessPrice, setNewThicknessPrice] = useState<number | "">("");
  const [newThicknessDescription, setNewThicknessDescription] = useState("");
  const [newThicknessCategory, setNewThicknessCategory] = useState<"distance-reading" | "progressive" | "bifocal">("distance-reading");
  
  // Edit thickness form state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editThicknessId, setEditThicknessId] = useState("");
  const [editThicknessName, setEditThicknessName] = useState("");
  const [editThicknessPrice, setEditThicknessPrice] = useState<number | "">("");
  const [editThicknessDescription, setEditThicknessDescription] = useState("");
  const [editThicknessCategory, setEditThicknessCategory] = useState<"distance-reading" | "progressive" | "bifocal">("distance-reading");
  
  const handleAddThickness = () => {
    if (!newThicknessName || newThicknessPrice === "") {
      toast.error(t("fillRequiredFields"));
      return;
    }
    
    addLensThickness({
      name: newThicknessName,
      price: Number(newThicknessPrice),
      description: newThicknessDescription,
      category: newThicknessCategory
    });
    
    toast.success(t("thicknessAddedSuccess") || "Thickness added successfully");
    
    // Reset form
    setNewThicknessName("");
    setNewThicknessPrice("");
    setNewThicknessDescription("");
    setIsAddDialogOpen(false);
  };
  
  const handleEditThickness = () => {
    if (!editThicknessName || editThicknessPrice === "") {
      toast.error(t("fillRequiredFields"));
      return;
    }
    
    updateLensThickness(editThicknessId, {
      name: editThicknessName,
      price: Number(editThicknessPrice),
      description: editThicknessDescription,
      category: editThicknessCategory
    });
    
    toast.success(t("thicknessUpdatedSuccess") || "Thickness updated successfully");
    
    // Reset form
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteThickness = (id: string) => {
    deleteLensThickness(id);
    toast.success(t("thicknessDeletedSuccess") || "Thickness deleted successfully");
  };
  
  const startEditThickness = (thickness: LensThickness) => {
    setEditThicknessId(thickness.id);
    setEditThicknessName(thickness.name);
    setEditThicknessPrice(thickness.price);
    setEditThicknessDescription(thickness.description || "");
    setEditThicknessCategory(thickness.category);
    setIsEditDialogOpen(true);
  };
  
  const thicknessCategories = [
    { value: "distance-reading", label: t("distanceReading") || "Distance/Reading" },
    { value: "progressive", label: t("progressive") || "Progressive" },
    { value: "bifocal", label: t("bifocal") || "Bifocal" }
  ];
  
  const filteredThicknesses = lensThicknesses.filter(thickness => thickness.category === activeTab);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t("lensThicknesses") || "Lens Thicknesses"}</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus size={16} />
              {t("addThickness") || "Add Thickness"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("addNewThicknessTitle") || "Add New Lens Thickness"}</DialogTitle>
              <DialogDescription>
                {t("addNewThicknessDescription") || "Enter the details for the new lens thickness option."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t("thicknessName") || "Thickness Name"}</Label>
                <Input
                  id="name"
                  value={newThicknessName}
                  onChange={(e) => setNewThicknessName(e.target.value)}
                  placeholder={t("thicknessNameExample") || "e.g. Ultra Thin"}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">{t("price") || "Price"}</Label>
                <Input
                  id="price"
                  type="number"
                  value={newThicknessPrice}
                  onChange={(e) => setNewThicknessPrice(e.target.value ? Number(e.target.value) : "")}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">{t("description") || "Description"}</Label>
                <Textarea
                  id="description"
                  value={newThicknessDescription}
                  onChange={(e) => setNewThicknessDescription(e.target.value)}
                  placeholder={t("thicknessDescription") || "Optional description"}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">{t("category") || "Category"}</Label>
                <Select value={newThicknessCategory} onValueChange={(value: any) => setNewThicknessCategory(value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder={t("chooseCategory") || "Choose category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {thicknessCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>{t("cancel") || "Cancel"}</Button>
              <Button onClick={handleAddThickness}>{t("save") || "Save"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="distance-reading" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="distance-reading">{t("distanceReading") || "Distance/Reading"}</TabsTrigger>
          <TabsTrigger value="progressive">{t("progressive") || "Progressive"}</TabsTrigger>
          <TabsTrigger value="bifocal">{t("bifocal") || "Bifocal"}</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {filteredThicknesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredThicknesses.map((thickness) => (
                <Card key={thickness.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">{thickness.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 pb-2">
                    <p className="text-lg font-bold">{thickness.price.toFixed(2)} {language === 'ar' ? 'د.ك' : 'KD'}</p>
                    {thickness.description && (
                      <p className="text-sm text-muted-foreground mt-1">{thickness.description}</p>
                    )}
                  </CardContent>
                  <CardFooter className="p-2 flex justify-end gap-2 bg-muted/50">
                    <Button variant="ghost" size="icon" onClick={() => startEditThickness(thickness)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteThickness(thickness.id)}>
                      <Trash size={16} />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-muted/50 rounded-lg">
              <p>{t("noThicknessesInCategory") || "No thicknesses in this category"}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsAddDialogOpen(true)}>
                {t("addThickness") || "Add Thickness"}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editThickness") || "Edit Lens Thickness"}</DialogTitle>
            <DialogDescription>
              {t("updateThicknessDetails") || "Update the lens thickness details"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">{t("thicknessName") || "Thickness Name"}</Label>
              <Input
                id="edit-name"
                value={editThicknessName}
                onChange={(e) => setEditThicknessName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">{t("price") || "Price"}</Label>
              <Input
                id="edit-price"
                type="number"
                value={editThicknessPrice}
                onChange={(e) => setEditThicknessPrice(e.target.value ? Number(e.target.value) : "")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">{t("description") || "Description"}</Label>
              <Textarea
                id="edit-description"
                value={editThicknessDescription}
                onChange={(e) => setEditThicknessDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">{t("category") || "Category"}</Label>
              <Select value={editThicknessCategory} onValueChange={(value: any) => setEditThicknessCategory(value)}>
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder={t("chooseCategory") || "Choose category"} />
                </SelectTrigger>
                <SelectContent>
                  {thicknessCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>{t("cancel") || "Cancel"}</Button>
            <Button onClick={handleEditThickness}>{t("saveChanges") || "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
