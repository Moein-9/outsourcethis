
import React, { useState } from "react";
import { useInventoryStore, LensThickness } from "@/store/inventoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/languageStore";

export const LensThicknessManager: React.FC = () => {
  const { lensThicknesses, addLensThickness, updateLensThickness, deleteLensThickness } = useInventoryStore();
  const { t, language } = useLanguageStore();
  
  // Add/Edit form states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newThicknessName, setNewThicknessName] = useState("");
  const [newThicknessPrice, setNewThicknessPrice] = useState<number | "">("");
  const [newThicknessDescription, setNewThicknessDescription] = useState("");
  
  // Edit thickness form state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editThicknessId, setEditThicknessId] = useState("");
  const [editThicknessName, setEditThicknessName] = useState("");
  const [editThicknessPrice, setEditThicknessPrice] = useState<number | "">("");
  const [editThicknessDescription, setEditThicknessDescription] = useState("");
  
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  const textDirClass = language === 'ar' ? 'rtl' : 'ltr';
  
  const handleAddThickness = () => {
    if (!newThicknessName || newThicknessPrice === "") {
      toast.error(t("fillRequiredFields"));
      return;
    }
    
    addLensThickness({
      name: newThicknessName,
      price: Number(newThicknessPrice),
      description: newThicknessDescription
    });
    
    toast.success(t("thicknessAddedSuccess"));
    
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
      description: editThicknessDescription
    });
    
    toast.success(t("thicknessUpdatedSuccess"));
    
    // Reset form
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteThickness = (id: string) => {
    deleteLensThickness(id);
    toast.success(t("thicknessDeletedSuccess"));
  };
  
  const startEditThickness = (thickness: LensThickness) => {
    setEditThicknessId(thickness.id);
    setEditThicknessName(thickness.name);
    setEditThicknessPrice(thickness.price);
    setEditThicknessDescription(thickness.description || "");
    setIsEditDialogOpen(true);
  };
  
  return (
    <div className={`space-y-4 ${textDirClass}`}>
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-bold ${textAlignClass}`}>{t("lensThicknesses")}</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus size={16} />
              {t("addThickness")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("addNewThicknessTitle")}</DialogTitle>
              <DialogDescription>
                {t("addNewThicknessDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className={textAlignClass}>{t("thicknessName")}</Label>
                <Input
                  id="name"
                  value={newThicknessName}
                  onChange={(e) => setNewThicknessName(e.target.value)}
                  placeholder={t("thicknessNameExample")}
                  className={textAlignClass}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price" className={textAlignClass}>{t("price")}</Label>
                <Input
                  id="price"
                  type="number"
                  value={newThicknessPrice}
                  onChange={(e) => setNewThicknessPrice(e.target.value ? Number(e.target.value) : "")}
                  placeholder="0.00"
                  className={textAlignClass}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className={textAlignClass}>{t("description")}</Label>
                <Input
                  id="description"
                  value={newThicknessDescription}
                  onChange={(e) => setNewThicknessDescription(e.target.value)}
                  placeholder={t("thicknessDescription")}
                  className={textAlignClass}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>{t("cancel")}</Button>
              <Button onClick={handleAddThickness}>{t("save")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {lensThicknesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lensThicknesses.map((thickness) => (
            <Card key={thickness.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">{thickness.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 pb-2">
                <p className="text-sm text-muted-foreground mb-2">{thickness.description}</p>
                <p className="text-lg font-bold">{thickness.price.toFixed(2)} {language === 'ar' ? 'د.ك' : 'KD'}</p>
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
          <p>{t("noThicknesses")}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsAddDialogOpen(true)}>
            {t("addThickness")}
          </Button>
        </div>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editThickness")}</DialogTitle>
            <DialogDescription>
              {t("updateThicknessDetails")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className={textAlignClass}>{t("thicknessName")}</Label>
              <Input
                id="edit-name"
                value={editThicknessName}
                onChange={(e) => setEditThicknessName(e.target.value)}
                className={textAlignClass}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price" className={textAlignClass}>{t("price")}</Label>
              <Input
                id="edit-price"
                type="number"
                value={editThicknessPrice}
                onChange={(e) => setEditThicknessPrice(e.target.value ? Number(e.target.value) : "")}
                className={textAlignClass}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description" className={textAlignClass}>{t("description")}</Label>
              <Input
                id="edit-description"
                value={editThicknessDescription}
                onChange={(e) => setEditThicknessDescription(e.target.value)}
                className={textAlignClass}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>{t("cancel")}</Button>
            <Button onClick={handleEditThickness}>{t("saveChanges")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
