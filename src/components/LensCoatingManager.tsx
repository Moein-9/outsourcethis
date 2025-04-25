import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/languageStore";
import {
  LensCoating,
  addLensCoating,
  updateLensCoating,
  deleteLensCoating,
  getAllLensCoatings,
} from "@/services/lensCoatingService";

export const LensCoatingManager: React.FC = () => {
  const { t, language } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<string>("distance-reading");
  const [lensCoatings, setLensCoatings] = useState<LensCoating[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New coating form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCoatingName, setNewCoatingName] = useState("");
  const [newCoatingPrice, setNewCoatingPrice] = useState<number | "">("");
  const [newCoatingDescription, setNewCoatingDescription] = useState("");
  const [newCoatingCategory, setNewCoatingCategory] = useState<
    "distance-reading" | "progressive" | "bifocal" | "sunglasses"
  >("distance-reading");
  const [newIsPhotochromic, setNewIsPhotochromic] = useState(false);
  const [newAvailableColors, setNewAvailableColors] = useState<string[]>([
    "Brown",
    "Gray",
    "Green",
    "Blue",
  ]);

  // Edit coating form state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editCoatingId, setEditCoatingId] = useState("");
  const [editCoatingName, setEditCoatingName] = useState("");
  const [editCoatingPrice, setEditCoatingPrice] = useState<number | "">("");
  const [editCoatingDescription, setEditCoatingDescription] = useState("");
  const [editCoatingCategory, setEditCoatingCategory] = useState<
    "distance-reading" | "progressive" | "bifocal" | "sunglasses"
  >("distance-reading");
  const [editIsPhotochromic, setEditIsPhotochromic] = useState(false);
  const [editAvailableColors, setEditAvailableColors] = useState<string[]>([]);

  // Fetch lens coatings from Supabase
  const fetchLensCoatings = async () => {
    setIsLoading(true);
    try {
      const data = await getAllLensCoatings();
      setLensCoatings(data);
    } catch (error) {
      console.error("Error fetching lens coatings", error);
      toast.error(
        t("errorFetchingLensCoatings") || "Error fetching lens coatings"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchLensCoatings();
  }, []);

  const handleAddCoating = async () => {
    if (!newCoatingName || newCoatingPrice === "") {
      toast.error(t("fillRequiredFields"));
      return;
    }

    setIsSubmitting(true);

    try {
      const coatingData: Omit<LensCoating, "coating_id" | "created_at"> = {
        name: newCoatingName,
        price: Number(newCoatingPrice),
        description: newCoatingDescription || undefined,
        category: newCoatingCategory,
      };

      if (newIsPhotochromic || newCoatingCategory === "sunglasses") {
        coatingData.is_photochromic = newIsPhotochromic;
        coatingData.available_colors = [...newAvailableColors];
      }

      const coating_id = await addLensCoating(coatingData);

      if (coating_id) {
        toast.success(t("coatingAddedSuccess"));

        // Reset form
        setNewCoatingName("");
        setNewCoatingPrice("");
        setNewCoatingDescription("");
        setNewIsPhotochromic(false);
        setIsAddDialogOpen(false);

        // Refresh data
        fetchLensCoatings();
      } else {
        toast.error(t("errorAddingCoating") || "Error adding coating");
      }
    } catch (error) {
      console.error("Error adding coating", error);
      toast.error(t("errorAddingCoating") || "Error adding coating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCoating = async () => {
    if (!editCoatingName || editCoatingPrice === "") {
      toast.error(t("fillRequiredFields"));
      return;
    }

    setIsSubmitting(true);

    try {
      const coatingData: Partial<
        Omit<LensCoating, "coating_id" | "created_at">
      > = {
        name: editCoatingName,
        price: Number(editCoatingPrice),
        description: editCoatingDescription || undefined,
        category: editCoatingCategory,
      };

      if (editIsPhotochromic || editCoatingCategory === "sunglasses") {
        coatingData.is_photochromic = editIsPhotochromic;
        coatingData.available_colors = [...editAvailableColors];
      } else {
        coatingData.is_photochromic = false;
        coatingData.available_colors = undefined;
      }

      const success = await updateLensCoating(editCoatingId, coatingData);

      if (success) {
        toast.success(t("coatingUpdatedSuccess"));

        // Reset form
        setIsEditDialogOpen(false);

        // Refresh data
        fetchLensCoatings();
      } else {
        toast.error(t("errorUpdatingCoating") || "Error updating coating");
      }
    } catch (error) {
      console.error("Error updating coating", error);
      toast.error(t("errorUpdatingCoating") || "Error updating coating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoating = async (id: string) => {
    try {
      const success = await deleteLensCoating(id);

      if (success) {
        toast.success(t("coatingDeletedSuccess"));

        // Refresh data
        fetchLensCoatings();
      } else {
        toast.error(t("errorDeletingCoating") || "Error deleting coating");
      }
    } catch (error) {
      console.error("Error deleting coating", error);
      toast.error(t("errorDeletingCoating") || "Error deleting coating");
    }
  };

  const startEditCoating = (coating: LensCoating) => {
    setEditCoatingId(coating.coating_id);
    setEditCoatingName(coating.name);
    setEditCoatingPrice(coating.price);
    setEditCoatingDescription(coating.description || "");
    setEditCoatingCategory(coating.category);
    setEditIsPhotochromic(!!coating.is_photochromic);
    setEditAvailableColors(
      coating.available_colors || ["Brown", "Gray", "Green"]
    );
    setIsEditDialogOpen(true);
  };

  const coatingCategories = [
    { value: "distance-reading", label: t("distanceReading") },
    { value: "progressive", label: t("progressive") },
    { value: "bifocal", label: t("bifocal") },
    { value: "sunglasses", label: t("sunglasses") },
  ];

  // Additional useEffect to handle special case for sunglasses category
  useEffect(() => {
    if (newCoatingCategory === "sunglasses" && !newAvailableColors.length) {
      setNewAvailableColors(["Brown", "Gray", "Green", "Blue"]);
    }

    if (editCoatingCategory === "sunglasses" && !editAvailableColors.length) {
      setEditAvailableColors(["Brown", "Gray", "Green", "Blue"]);
    }
  }, [newCoatingCategory, editCoatingCategory]);

  // Get filtered coatings based on the active tab
  const filteredCoatings = lensCoatings.filter(
    (coating) => coating.category === activeTab
  );

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
                  onChange={(e) =>
                    setNewCoatingPrice(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
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
                <Select
                  value={newCoatingCategory}
                  onValueChange={(value: any) => setNewCoatingCategory(value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue
                      placeholder={t("chooseCategory") || "Choose category"}
                    />
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

              {newCoatingCategory !== "sunglasses" && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPhotochromic"
                    checked={newIsPhotochromic}
                    onChange={(e) => setNewIsPhotochromic(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isPhotochromic">
                    {t("isPhotochromic") || "Photochromic Coating"}
                  </Label>
                </div>
              )}

              {(newIsPhotochromic || newCoatingCategory === "sunglasses") && (
                <div className="grid gap-2">
                  <Label>{t("availableColors") || "Available Colors"}</Label>
                  <div className="flex flex-wrap gap-2">
                    {newAvailableColors.map((color, index) => (
                      <Badge key={index}>{color}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("defaultColorsNote") ||
                      "Default colors: Brown, Gray, Green, Blue"}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button onClick={handleAddCoating} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : null}
                {t("save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p className="text-lg font-medium">
            {t("loadingLensCoatings") || "Loading lens coatings..."}
          </p>
        </div>
      ) : (
        <Tabs
          defaultValue="distance-reading"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="distance-reading">
              {t("distanceReading")}
            </TabsTrigger>
            <TabsTrigger value="progressive">{t("progressive")}</TabsTrigger>
            <TabsTrigger value="bifocal">{t("bifocal")}</TabsTrigger>
            <TabsTrigger value="sunglasses">{t("sunglasses")}</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredCoatings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCoatings.map((coating) => (
                  <Card
                    key={coating.coating_id}
                    className={`overflow-hidden ${
                      coating.is_photochromic ? "border-blue-300" : ""
                    }`}
                  >
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">
                        {coating.name}
                        {coating.is_photochromic && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800">
                            {t("photochromic")}
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-2">
                      <p className="text-lg font-bold">
                        {coating.price.toFixed(2)}{" "}
                        {language === "ar" ? "د.ك" : "KD"}
                      </p>
                      {coating.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {coating.description}
                        </p>
                      )}
                      {(coating.is_photochromic ||
                        coating.category === "sunglasses") &&
                        coating.available_colors &&
                        coating.available_colors.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-500">
                              {t("availableColors") || "Available Colors"}:
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {coating.available_colors.map((color, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {color}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                    </CardContent>
                    <CardFooter className="p-2 flex justify-end gap-2 bg-muted/50">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditCoating(coating)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteCoating(coating.coating_id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-muted/50 rounded-lg">
                <p>{t("noCoatings")}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  {t("addCoating")}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editCoating")}</DialogTitle>
            <DialogDescription>{t("updateCoatingDetails")}</DialogDescription>
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
                onChange={(e) =>
                  setEditCoatingPrice(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
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
              <Label htmlFor="edit-category">
                {t("category") || "Category"}
              </Label>
              <Select
                value={editCoatingCategory}
                onValueChange={(value: any) => setEditCoatingCategory(value)}
              >
                <SelectTrigger id="edit-category">
                  <SelectValue
                    placeholder={t("chooseCategory") || "Choose category"}
                  />
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

            {editCoatingCategory !== "sunglasses" && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isPhotochromic"
                  checked={editIsPhotochromic}
                  onChange={(e) => setEditIsPhotochromic(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit-isPhotochromic">
                  {t("isPhotochromic") || "Photochromic Coating"}
                </Label>
              </div>
            )}

            {(editIsPhotochromic || editCoatingCategory === "sunglasses") && (
              <div className="grid gap-2">
                <Label>{t("availableColors") || "Available Colors"}</Label>
                <div className="flex flex-wrap gap-2">
                  {editAvailableColors.map((color, index) => (
                    <Badge key={index}>{color}</Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("defaultColorsNote") ||
                    "Default colors: Brown, Gray, Green"}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button onClick={handleEditCoating} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : null}
              {t("saveChanges")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
