import React, { useState, useEffect } from "react";
import { useInventoryStore } from "@/store/inventoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  LensType,
  addLensType,
  deleteLensType,
  getAllLensTypes,
  updateLensType,
} from "@/services/lensTypeService";

export const LensTypeManager: React.FC = () => {
  const { t, language } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<string>("distance-reading");
  const [lensTypes, setLensTypes] = useState<LensType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New lens form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLensName, setNewLensName] = useState("");
  const [newLensType, setNewLensType] = useState<
    "distance" | "reading" | "progressive" | "bifocal" | "sunglasses"
  >("distance");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit lens form state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editLensId, setEditLensId] = useState("");
  const [editLensName, setEditLensName] = useState("");
  const [editLensType, setEditLensType] = useState<
    "distance" | "reading" | "progressive" | "bifocal" | "sunglasses"
  >("distance");

  // Fetch lens types from Supabase
  const fetchLensTypes = async () => {
    setIsLoading(true);
    try {
      const data = await getAllLensTypes();
      setLensTypes(data);
    } catch (error) {
      console.error("Error fetching lens types", error);
      toast.error(t("errorFetchingLensTypes") || "Error fetching lens types");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchLensTypes();
  }, []);

  const handleAddLens = async () => {
    if (!newLensName) {
      toast.error(t("fillRequiredFields"));
      return;
    }

    setIsSubmitting(true);

    try {
      const lens_id = await addLensType({
        name: newLensName,
        type: newLensType,
      });

      if (lens_id) {
        toast.success(t("lensAddedSuccess"));
        // Reset form
        setNewLensName("");
        setIsAddDialogOpen(false);
        // Refresh data
        fetchLensTypes();
      } else {
        toast.error(t("errorAddingLens") || "Error adding lens");
      }
    } catch (error) {
      console.error("Error adding lens", error);
      toast.error(t("errorAddingLens") || "Error adding lens");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditLens = async () => {
    if (!editLensName) {
      toast.error(t("fillRequiredFields"));
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await updateLensType(editLensId, {
        name: editLensName,
        type: editLensType,
      });

      if (success) {
        toast.success(t("lensUpdatedSuccess"));
        // Reset form
        setIsEditDialogOpen(false);
        // Refresh data
        fetchLensTypes();
      } else {
        toast.error(t("errorUpdatingLens") || "Error updating lens");
      }
    } catch (error) {
      console.error("Error updating lens", error);
      toast.error(t("errorUpdatingLens") || "Error updating lens");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLens = async (id: string) => {
    try {
      const success = await deleteLensType(id);

      if (success) {
        toast.success(t("lensDeletedSuccess"));
        // Refresh data
        fetchLensTypes();
      } else {
        toast.error(t("errorDeletingLens") || "Error deleting lens");
      }
    } catch (error) {
      console.error("Error deleting lens", error);
      toast.error(t("errorDeletingLens") || "Error deleting lens");
    }
  };

  const startEditLens = (lens: LensType) => {
    setEditLensId(lens.lens_id);
    setEditLensName(lens.name);
    setEditLensType(lens.type);
    setIsEditDialogOpen(true);
  };

  const lensTypeCategories = [
    { value: "distance", label: t("distance") },
    { value: "reading", label: t("reading") },
    { value: "progressive", label: t("progressive") },
    { value: "bifocal", label: t("bifocal") },
    { value: "sunglasses", label: t("sunglasses") },
  ];

  // Get filtered lenses based on the active tab
  // For "distance-reading" tab, show both distance and reading lenses
  const filteredLenses =
    activeTab === "distance-reading"
      ? lensTypes.filter(
          (lens) => lens.type === "distance" || lens.type === "reading"
        )
      : lensTypes.filter((lens) => lens.type === activeTab);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t("lensTypes")}</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus size={16} />
              {t("addLens")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("addNewLensTitle")}</DialogTitle>
              <DialogDescription>
                {t("addNewLensDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t("lensName")}</Label>
                <Input
                  id="name"
                  value={newLensName}
                  onChange={(e) => setNewLensName(e.target.value)}
                  placeholder={t("lensNameExample")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">{t("type")}</Label>
                <Select
                  value={newLensType}
                  onValueChange={(value) => setNewLensType(value as any)}
                >
                  <SelectTrigger id="type">
                    <SelectValue
                      placeholder={t("chooseType") || "Choose type"}
                    />
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
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button onClick={handleAddLens} disabled={isSubmitting}>
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
            {t("loadingLensTypes") || "Loading lens types..."}
          </p>
        </div>
      ) : (
        <Tabs
          defaultValue="distance-reading"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 md:grid-cols-4 mb-4">
            <TabsTrigger value="distance-reading">
              {t("distanceReading")}
            </TabsTrigger>
            <TabsTrigger value="progressive">{t("progressive")}</TabsTrigger>
            <TabsTrigger value="bifocal">{t("bifocal")}</TabsTrigger>
            <TabsTrigger value="sunglasses">{t("sunglasses")}</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredLenses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLenses.map((lens) => (
                  <Card key={lens.lens_id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">{lens.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-2">
                      <p className="text-sm text-muted-foreground">
                        {t(lens.type)}
                      </p>
                    </CardContent>
                    <CardFooter className="p-2 flex justify-end gap-2 bg-muted/50">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditLens(lens)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteLens(lens.lens_id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-muted/50 rounded-lg">
                <p>{t("noLensesInCategory")}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  {t("addLens")}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editLensType")}</DialogTitle>
            <DialogDescription>{t("updateLensDetails")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">{t("lensName")}</Label>
              <Input
                id="edit-name"
                value={editLensName}
                onChange={(e) => setEditLensName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">{t("type")}</Label>
              <Select
                value={editLensType}
                onValueChange={(value) => setEditLensType(value as any)}
              >
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder={t("chooseType") || "Choose type"} />
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
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button onClick={handleEditLens} disabled={isSubmitting}>
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
