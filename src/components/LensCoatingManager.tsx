
import React, { useState } from "react";
import { useInventoryStore, LensCoating } from "@/store/inventoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/languageStore";

export const LensCoatingManager: React.FC = () => {
  const { lensCoatings, addLensCoating, updateLensCoating, deleteLensCoating } = useInventoryStore();
  const { t, language } = useLanguageStore();
  
  // New coating form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCoatingName, setNewCoatingName] = useState("");
  const [newCoatingPrice, setNewCoatingPrice] = useState<number | "">("");
  const [newCoatingDescription, setNewCoatingDescription] = useState("");
  
  // Edit coating form state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editCoatingId, setEditCoatingId] = useState("");
  const [editCoatingName, setEditCoatingName] = useState("");
  const [editCoatingPrice, setEditCoatingPrice] = useState<number | "">("");
  const [editCoatingDescription, setEditCoatingDescription] = useState("");
  
  const handleAddCoating = () => {
    if (!newCoatingName || newCoatingPrice === "") {
      toast.error(t("fillRequiredFields"));
      return;
    }
    
    addLensCoating({
      name: newCoatingName,
      price: Number(newCoatingPrice),
      description: newCoatingDescription
    });
    
    toast.success(t("coatingAddedSuccess"));
    
    // Reset form
    setNewCoatingName("");
    setNewCoatingPrice("");
    setNewCoatingDescription("");
    setIsAddDialogOpen(false);
  };
  
  const handleEditCoating = () => {
    if (!editCoatingName || editCoatingPrice === "") {
      toast.error(t("fillRequiredFields"));
      return;
    }
    
    updateLensCoating(editCoatingId, {
      name: editCoatingName,
      price: Number(editCoatingPrice),
      description: editCoatingDescription
    });
    
    toast.success(t("coatingUpdatedSuccess"));
    
    // Reset form
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteCoating = (id: string) => {
    deleteLensCoating(id);
    toast.success(t("coatingDeletedSuccess"));
  };
  
  const startEditCoating = (coating: LensCoating) => {
    setEditCoatingId(coating.id);
    setEditCoatingName(coating.name);
    setEditCoatingPrice(coating.price);
    setEditCoatingDescription(coating.description || "");
    setIsEditDialogOpen(true);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t("lensCoatings")}</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus size={16} />
              {t("addCoating")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("addNewCoatingTitle")}</DialogTitle>
              <DialogDescription>
                {t("addNewCoatingDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t("coatingName")}</Label>
                <Input
                  id="name"
                  value={newCoatingName}
                  onChange={(e) => setNewCoatingName(e.target.value)}
                  placeholder={t("coatingNameExample")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">{t("price")}</Label>
                <Input
                  id="price"
                  type="number"
                  value={newCoatingPrice}
                  onChange={(e) => setNewCoatingPrice(e.target.value ? Number(e.target.value) : "")}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">{t("description")}</Label>
                <Textarea
                  id="description"
                  value={newCoatingDescription}
                  onChange={(e) => setNewCoatingDescription(e.target.value)}
                  placeholder={t("coatingDescription")}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>{t("cancel")}</Button>
              <Button onClick={handleAddCoating}>{t("save")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {lensCoatings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lensCoatings.map((coating) => (
            <Card key={coating.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">{coating.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 pb-2">
                <p className="text-lg font-bold">{coating.price.toFixed(2)} {language === 'ar' ? 'د.ك' : 'KD'}</p>
                {coating.description && (
                  <p className="text-sm text-muted-foreground mt-1">{coating.description}</p>
                )}
              </CardContent>
              <CardFooter className="p-2 flex justify-end gap-2 bg-muted/50">
                <Button variant="ghost" size="icon" onClick={() => startEditCoating(coating)}>
                  <Edit size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteCoating(coating.id)}>
                  <Trash size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-muted/50 rounded-lg">
          <p>{t("noCoatings")}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsAddDialogOpen(true)}>
            {t("addCoating")}
          </Button>
        </div>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editCoating")}</DialogTitle>
            <DialogDescription>
              {t("updateCoatingDetails")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">{t("coatingName")}</Label>
              <Input
                id="edit-name"
                value={editCoatingName}
                onChange={(e) => setEditCoatingName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">{t("price")}</Label>
              <Input
                id="edit-price"
                type="number"
                value={editCoatingPrice}
                onChange={(e) => setEditCoatingPrice(e.target.value ? Number(e.target.value) : "")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">{t("description")}</Label>
              <Textarea
                id="edit-description"
                value={editCoatingDescription}
                onChange={(e) => setEditCoatingDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>{t("cancel")}</Button>
            <Button onClick={handleEditCoating}>{t("saveChanges")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
