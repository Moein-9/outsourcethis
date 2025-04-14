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
import { Edit, Plus, Trash, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/languageStore";
import {
  LensThickness,
  getAllLensThicknesses,
  addLensThickness,
  updateLensThickness,
  deleteLensThickness,
} from "@/services/lensThicknessService";

export const LensThicknessManager: React.FC = () => {
  const { t, language } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<string>("distance-reading");
  const [lensThicknesses, setLensThicknesses] = useState<LensThickness[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New thickness form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newThicknessName, setNewThicknessName] = useState("");
  const [newThicknessPrice, setNewThicknessPrice] = useState<number | "">("");
  const [newThicknessDescription, setNewThicknessDescription] = useState("");
  const [newThicknessCategory, setNewThicknessCategory] = useState<
    "distance-reading" | "progressive" | "bifocal"
  >("distance-reading");

  // Edit thickness form state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editThicknessId, setEditThicknessId] = useState("");
  const [editThicknessName, setEditThicknessName] = useState("");
  const [editThicknessPrice, setEditThicknessPrice] = useState<number | "">("");
  const [editThicknessDescription, setEditThicknessDescription] = useState("");
  const [editThicknessCategory, setEditThicknessCategory] = useState<
    "distance-reading" | "progressive" | "bifocal"
  >("distance-reading");

  // Fetch lens thicknesses from Supabase
  const fetchLensThicknesses = async () => {
    setIsLoading(true);
    try {
      const data = await getAllLensThicknesses();
      setLensThicknesses(data);
    } catch (error) {
      console.error("Error fetching lens thicknesses:", error);
      toast.error(
        t("errorFetchingLensThicknesses") || "Error fetching lens thicknesses"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchLensThicknesses();
  }, []);

  const handleAddThickness = async () => {
    if (!newThicknessName || newThicknessPrice === "") {
      toast.error(t("fillRequiredFields"));
      return;
    }

    setIsSubmitting(true);

    try {
      const thicknessData: Omit<LensThickness, "thickness_id" | "created_at"> =
        {
          name: newThicknessName,
          price: Number(newThicknessPrice),
          description: newThicknessDescription || undefined,
          category: newThicknessCategory,
        };

      const thickness_id = await addLensThickness(thicknessData);

      if (thickness_id) {
        toast.success(
          t("thicknessAddedSuccess") || "Thickness added successfully"
        );

        // Reset form
        setNewThicknessName("");
        setNewThicknessPrice("");
        setNewThicknessDescription("");
        setIsAddDialogOpen(false);

        // Refresh data
        fetchLensThicknesses();
      } else {
        toast.error(t("errorAddingThickness") || "Error adding thickness");
      }
    } catch (error) {
      console.error("Error adding thickness:", error);
      toast.error(t("errorAddingThickness") || "Error adding thickness");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditThickness = async () => {
    if (!editThicknessName || editThicknessPrice === "") {
      toast.error(t("fillRequiredFields"));
      return;
    }

    setIsSubmitting(true);

    try {
      const thicknessData: Partial<
        Omit<LensThickness, "thickness_id" | "created_at">
      > = {
        name: editThicknessName,
        price: Number(editThicknessPrice),
        description: editThicknessDescription || undefined,
        category: editThicknessCategory,
      };

      const success = await updateLensThickness(editThicknessId, thicknessData);

      if (success) {
        toast.success(
          t("thicknessUpdatedSuccess") || "Thickness updated successfully"
        );

        // Reset form
        setIsEditDialogOpen(false);

        // Refresh data
        fetchLensThicknesses();
      } else {
        toast.error(t("errorUpdatingThickness") || "Error updating thickness");
      }
    } catch (error) {
      console.error("Error updating thickness:", error);
      toast.error(t("errorUpdatingThickness") || "Error updating thickness");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteThickness = async (id: string) => {
    try {
      const success = await deleteLensThickness(id);

      if (success) {
        toast.success(
          t("thicknessDeletedSuccess") || "Thickness deleted successfully"
        );

        // Refresh data
        fetchLensThicknesses();
      } else {
        toast.error(t("errorDeletingThickness") || "Error deleting thickness");
      }
    } catch (error) {
      console.error("Error deleting thickness:", error);
      toast.error(t("errorDeletingThickness") || "Error deleting thickness");
    }
  };

  const startEditThickness = (thickness: LensThickness) => {
    setEditThicknessId(thickness.thickness_id);
    setEditThicknessName(thickness.name);
    setEditThicknessPrice(thickness.price);
    setEditThicknessDescription(thickness.description || "");
    setEditThicknessCategory(thickness.category);
    setIsEditDialogOpen(true);
  };

  const thicknessCategories = [
    {
      value: "distance-reading",
      label: t("distanceReading") || "Distance/Reading",
    },
    { value: "progressive", label: t("progressive") || "Progressive" },
    { value: "bifocal", label: t("bifocal") || "Bifocal" },
  ];

  // Get filtered thicknesses based on the active tab
  const filteredThicknesses = lensThicknesses.filter(
    (thickness) => thickness.category === activeTab
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {t("lensThicknesses") || "Lens Thicknesses"}
        </h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus size={16} />
              {t("addThickness") || "Add Thickness"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t("addNewThicknessTitle") || "Add New Lens Thickness"}
              </DialogTitle>
              <DialogDescription>
                {t("addNewThicknessDescription") ||
                  "Enter the details for the new lens thickness option."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  {t("thicknessName") || "Thickness Name"}
                </Label>
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
                  onChange={(e) =>
                    setNewThicknessPrice(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">
                  {t("description") || "Description"}
                </Label>
                <Textarea
                  id="description"
                  value={newThicknessDescription}
                  onChange={(e) => setNewThicknessDescription(e.target.value)}
                  placeholder={
                    t("thicknessDescription") || "Optional description"
                  }
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">{t("category") || "Category"}</Label>
                <Select
                  value={newThicknessCategory}
                  onValueChange={(value: any) => setNewThicknessCategory(value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue
                      placeholder={t("chooseCategory") || "Choose category"}
                    />
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
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isSubmitting}
              >
                {t("cancel") || "Cancel"}
              </Button>
              <Button onClick={handleAddThickness} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : null}
                {t("save") || "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p className="text-lg font-medium">
            {t("loadingLensThicknesses") || "Loading lens thicknesses..."}
          </p>
        </div>
      ) : (
        <Tabs
          defaultValue="distance-reading"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="distance-reading">
              {t("distanceReading") || "Distance/Reading"}
            </TabsTrigger>
            <TabsTrigger value="progressive">
              {t("progressive") || "Progressive"}
            </TabsTrigger>
            <TabsTrigger value="bifocal">
              {t("bifocal") || "Bifocal"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredThicknesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredThicknesses.map((thickness) => (
                  <Card
                    key={thickness.thickness_id}
                    className="overflow-hidden"
                  >
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">
                        {thickness.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-2">
                      <p className="text-lg font-bold">
                        {thickness.price.toFixed(2)}{" "}
                        {language === "ar" ? "د.ك" : "KD"}
                      </p>
                      {thickness.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {thickness.description}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="p-2 flex justify-end gap-2 bg-muted/50">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditThickness(thickness)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() =>
                          handleDeleteThickness(thickness.thickness_id)
                        }
                      >
                        <Trash size={16} />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-muted/50 rounded-lg">
                <p>
                  {t("noThicknessesInCategory") ||
                    "No thicknesses in this category"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  {t("addThickness") || "Add Thickness"}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("editThickness") || "Edit Lens Thickness"}
            </DialogTitle>
            <DialogDescription>
              {t("updateThicknessDetails") ||
                "Update the lens thickness details"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">
                {t("thicknessName") || "Thickness Name"}
              </Label>
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
                onChange={(e) =>
                  setEditThicknessPrice(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">
                {t("description") || "Description"}
              </Label>
              <Textarea
                id="edit-description"
                value={editThicknessDescription}
                onChange={(e) => setEditThicknessDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">
                {t("category") || "Category"}
              </Label>
              <Select
                value={editThicknessCategory}
                onValueChange={(value: any) => setEditThicknessCategory(value)}
              >
                <SelectTrigger id="edit-category">
                  <SelectValue
                    placeholder={t("chooseCategory") || "Choose category"}
                  />
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
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              {t("cancel") || "Cancel"}
            </Button>
            <Button onClick={handleEditThickness} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : null}
              {t("saveChanges") || "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
