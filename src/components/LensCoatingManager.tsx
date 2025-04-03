
import React, { useState, useEffect } from "react";
import { useInventoryStore, LensCoating } from "@/store/inventoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/languageStore";

export const LensCoatingManager: React.FC = () => {
  const { lensCoatings, addLensCoating, updateLensCoating, deleteLensCoating } = useInventoryStore();
  const { t, language } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<string>("distance-reading");
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCoatingName, setNewCoatingName] = useState("");
  const [newCoatingPrice, setNewCoatingPrice] = useState<number | "">("");
  const [newCoatingDescription, setNewCoatingDescription] = useState("");
  const [newCoatingCategory, setNewCoatingCategory] = useState<"distance-reading" | "progressive" | "bifocal" | "sunglasses">("distance-reading");
  const [newIsPhotochromic, setNewIsPhotochromic] = useState(false);
  const [newAvailableColors, setNewAvailableColors] = useState<string[]>(["Brown", "Gray", "Green", "Blue"]);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editCoatingId, setEditCoatingId] = useState("");
  const [editCoatingName, setEditCoatingName] = useState("");
  const [editCoatingPrice, setEditCoatingPrice] = useState<number | "">("");
  const [editCoatingDescription, setEditCoatingDescription] = useState("");
  const [editCoatingCategory, setEditCoatingCategory] = useState<"distance-reading" | "progressive" | "bifocal" | "sunglasses">("distance-reading");
  const [editIsPhotochromic, setEditIsPhotochromic] = useState(false);
  const [editAvailableColors, setEditAvailableColors] = useState<string[]>([]);
  
  // Force update when active tab changes
  const [, forceUpdate] = useState({});
  
  const handleAddCoating = () => {
    if (!newCoatingName || newCoatingPrice === "") {
      toast.error(t("fillRequiredFields"));
      return;
    }
    
    const coatingData: Omit<LensCoating, "id"> = {
      name: newCoatingName,
      price: Number(newCoatingPrice),
      description: newCoatingDescription,
      category: newCoatingCategory
    };
    
    if (newIsPhotochromic) {
      coatingData.isPhotochromic = true;
      coatingData.availableColors = [...newAvailableColors];
    }
    
    const id = addLensCoating(coatingData);
    
    if (id) {
      toast.success(t("coatingAddedSuccess"));
      
      // Force re-render to show the new coating
      setTimeout(() => {
        forceUpdate({});
      }, 100);
      
      setNewCoatingName("");
      setNewCoatingPrice("");
      setNewCoatingDescription("");
      setNewIsPhotochromic(false);
      setIsAddDialogOpen(false);
    } else {
      toast.error("Failed to add coating");
    }
  };
  
  const handleEditCoating = () => {
    if (!editCoatingName || editCoatingPrice === "") {
      toast.error(t("fillRequiredFields"));
      return;
    }
    
    const coatingData: Partial<Omit<LensCoating, "id">> = {
      name: editCoatingName,
      price: Number(editCoatingPrice),
      description: editCoatingDescription,
      category: editCoatingCategory
    };
    
    if (editIsPhotochromic) {
      coatingData.isPhotochromic = true;
      coatingData.availableColors = [...editAvailableColors];
    } else {
      coatingData.isPhotochromic = false;
      coatingData.availableColors = undefined;
    }
    
    updateLensCoating(editCoatingId, coatingData);
    
    toast.success(t("coatingUpdatedSuccess"));
    
    // Force re-render to show the updated coating
    setTimeout(() => {
      forceUpdate({});
    }, 100);
    
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteCoating = (id: string) => {
    deleteLensCoating(id);
    toast.success(t("coatingDeletedSuccess"));
    
    // Force re-render
    setTimeout(() => {
      forceUpdate({});
    }, 100);
  };
  
  const startEditCoating = (coating: LensCoating) => {
    setEditCoatingId(coating.id);
    setEditCoatingName(coating.name);
    setEditCoatingPrice(coating.price);
    setEditCoatingDescription(coating.description || "");
    setEditCoatingCategory(coating.category);
    setEditIsPhotochromic(!!coating.isPhotochromic);
    setEditAvailableColors(coating.availableColors || ["Brown", "Gray", "Green"]);
    setIsEditDialogOpen(true);
  };
  
  const coatingCategories = [
    { value: "distance-reading", label: t("distanceReading") },
    { value: "progressive", label: t("progressive") },
    { value: "bifocal", label: t("bifocal") },
    { value: "sunglasses", label: t("sunglasses") }
  ];
  
  // Use memo to prevent unnecessary re-filtering
  const filteredCoatings = React.useMemo(() => {
    return lensCoatings.filter(coating => coating.category === activeTab);
  }, [lensCoatings, activeTab]);
  
  // Debug logging to see what's happening with the coatings
  useEffect(() => {
    console.log("All lens coatings:", lensCoatings);
    console.log("Filtered coatings for tab", activeTab, ":", filteredCoatings);
  }, [lensCoatings, filteredCoatings, activeTab]);
  
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
              <div className="grid gap-2">
                <Label htmlFor="category">{t("category") || "Category"}</Label>
                <Select value={newCoatingCategory} onValueChange={(value: any) => setNewCoatingCategory(value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder={t("chooseCategory") || "Choose category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {coatingCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPhotochromic"
                  checked={newIsPhotochromic}
                  onChange={(e) => setNewIsPhotochromic(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isPhotochromic">{t("isPhotochromic") || "Photochromic Coating"}</Label>
              </div>
              
              {newIsPhotochromic && (
                <div className="grid gap-2">
                  <Label>{t("availableColors") || "Available Colors"}</Label>
                  <div className="flex flex-wrap gap-2">
                    {newAvailableColors.map((color, index) => (
                      <Badge key={index}>{color}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("defaultColorsNote") || "Default colors: Brown, Gray, Green, Blue"}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>{t("cancel")}</Button>
              <Button onClick={handleAddCoating}>{t("save")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="distance-reading" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="distance-reading">{t("distanceReading")}</TabsTrigger>
          <TabsTrigger value="progressive">{t("progressive")}</TabsTrigger>
          <TabsTrigger value="bifocal">{t("bifocal")}</TabsTrigger>
          <TabsTrigger value="sunglasses">{t("sunglasses")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {filteredCoatings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCoatings.map((coating) => (
                <Card key={coating.id} className={`overflow-hidden ${coating.isPhotochromic ? 'border-blue-300' : ''}`}>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">
                      {coating.name}
                      {coating.isPhotochromic && (
                        <Badge className="ml-2 bg-blue-100 text-blue-800">{t("photochromic")}</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 pb-2">
                    <p className="text-lg font-bold">{coating.price.toFixed(2)} {language === 'ar' ? 'د.ك' : 'KD'}</p>
                    {coating.description && (
                      <p className="text-sm text-muted-foreground mt-1">{coating.description}</p>
                    )}
                    {coating.isPhotochromic && coating.availableColors && coating.availableColors.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-500">{t("availableColors") || "Available Colors"}:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {coating.availableColors.map((color, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{color}</Badge>
                          ))}
                        </div>
                      </div>
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
        </TabsContent>
      </Tabs>
      
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
            <div className="grid gap-2">
              <Label htmlFor="edit-category">{t("category") || "Category"}</Label>
              <Select value={editCoatingCategory} onValueChange={(value: any) => setEditCoatingCategory(value)}>
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder={t("chooseCategory") || "Choose category"} />
                </SelectTrigger>
                <SelectContent>
                  {coatingCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isPhotochromic"
                checked={editIsPhotochromic}
                onChange={(e) => setEditIsPhotochromic(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="edit-isPhotochromic">{t("isPhotochromic") || "Photochromic Coating"}</Label>
            </div>
            
            {editIsPhotochromic && (
              <div className="grid gap-2">
                <Label>{t("availableColors") || "Available Colors"}</Label>
                <div className="flex flex-wrap gap-2">
                  {editAvailableColors.map((color, index) => (
                    <Badge key={index}>{color}</Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("defaultColorsNote") || "Default colors: Brown, Gray, Green"}
                </p>
              </div>
            )}
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
