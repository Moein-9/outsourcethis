import React, { useState, useEffect } from "react";
import { useInventoryStore, Frame } from "@/store/inventoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Plus, Printer, Search, Trash } from "lucide-react";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/languageStore";
import { Checkbox } from "@/components/ui/checkbox";

export const FrameInventory: React.FC = () => {
  const { frames, addFrame, updateFrame, deleteFrame } = useInventoryStore();
  const { t, language } = useLanguageStore();
  
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFrames, setFilteredFrames] = useState<Frame[]>(frames);
  
  // State for frame form
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false);
  
  // Frame form state
  const [currentFrameId, setCurrentFrameId] = useState<string | null>(null);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">(1);
  
  // Label printing state
  const [selectedFrames, setSelectedFrames] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Filter frames when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFrames(frames);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = frames.filter(
        (frame) =>
          frame.brand.toLowerCase().includes(lowercasedSearch) ||
          frame.model.toLowerCase().includes(lowercasedSearch) ||
          frame.color.toLowerCase().includes(lowercasedSearch) ||
          frame.size.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredFrames(filtered);
    }
  }, [searchTerm, frames]);
  
  // Reset form when dialog closes
  useEffect(() => {
    if (!isAddDialogOpen && !isEditDialogOpen) {
      resetForm();
    }
  }, [isAddDialogOpen, isEditDialogOpen]);
  
  // Update selected frames when frames change
  useEffect(() => {
    if (selectAll) {
      setSelectedFrames(filteredFrames.map(frame => frame.id));
    }
  }, [filteredFrames, selectAll]);
  
  const resetForm = () => {
    setCurrentFrameId(null);
    setBrand("");
    setModel("");
    setColor("");
    setSize("");
    setPrice("");
    setQuantity(1);
  };
  
  const handleAddFrame = () => {
    if (!brand || !model || !color || price === "" || quantity === "") {
      toast.error(t("frameDetailsError"));
      return;
    }
    
    addFrame({
      brand,
      model,
      color,
      size,
      price: Number(price),
      quantity: Number(quantity)
    });
    
    toast.success(t("frameAddedSuccess"));
    setIsAddDialogOpen(false);
    resetForm();
  };
  
  const handleEditFrame = () => {
    if (!currentFrameId || !brand || !model || !color || price === "" || quantity === "") {
      toast.error(t("frameDetailsError"));
      return;
    }
    
    updateFrame(currentFrameId, {
      brand,
      model,
      color,
      size,
      price: Number(price),
      quantity: Number(quantity)
    });
    
    toast.success(t("frameUpdatedSuccess"));
    setIsEditDialogOpen(false);
    resetForm();
  };
  
  const handleDeleteFrame = () => {
    if (currentFrameId) {
      deleteFrame(currentFrameId);
      toast.success(t("frameDeletedSuccess"));
      setIsDeleteDialogOpen(false);
      setCurrentFrameId(null);
    }
  };
  
  const startEditFrame = (frame: Frame) => {
    setCurrentFrameId(frame.id);
    setBrand(frame.brand);
    setModel(frame.model);
    setColor(frame.color);
    setSize(frame.size);
    setPrice(frame.price);
    setQuantity(frame.quantity);
    setIsEditDialogOpen(true);
  };
  
  const startDeleteFrame = (frameId: string) => {
    setCurrentFrameId(frameId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleSelectFrame = (frameId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedFrames(prev => [...prev, frameId]);
    } else {
      setSelectedFrames(prev => prev.filter(id => id !== frameId));
    }
  };
  
  const handleSelectAll = (isSelected: boolean) => {
    setSelectAll(isSelected);
    if (isSelected) {
      setSelectedFrames(filteredFrames.map(frame => frame.id));
    } else {
      setSelectedFrames([]);
    }
  };
  
  const handlePrintLabels = () => {
    // Implement label printing logic here
    console.log("Printing labels for frames:", selectedFrames);
    toast.success(`Printing ${selectedFrames.length} frame labels`);
    setIsLabelDialogOpen(false);
  };
  
  const handleShowAllFrames = () => {
    setSearchTerm("");
    setFilteredFrames(frames);
  };
  
  const isRtl = language === 'ar';
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchForFrame")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShowAllFrames}>
            {t("showAllFrames")}
          </Button>
          <Dialog open={isLabelDialogOpen} onOpenChange={setIsLabelDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Printer size={16} />
                {t("printLabels")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("printFrameLabels")}</DialogTitle>
                <DialogDescription>
                  {t("selectFramesForLabels")}
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[400px] overflow-y-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={selectAll} 
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>{t("brand")}</TableHead>
                      <TableHead>{t("model")}</TableHead>
                      <TableHead>{t("color")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFrames.map((frame) => (
                      <TableRow key={frame.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedFrames.includes(frame.id)}
                            onCheckedChange={(checked) => 
                              handleSelectFrame(frame.id, checked === true)
                            }
                          />
                        </TableCell>
                        <TableCell>{frame.brand}</TableCell>
                        <TableCell>{frame.model}</TableCell>
                        <TableCell>{frame.color}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsLabelDialogOpen(false)}
                >
                  {t("cancel")}
                </Button>
                <Button 
                  onClick={handlePrintLabels}
                  disabled={selectedFrames.length === 0}
                >
                  {t("print")} ({selectedFrames.length})
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus size={16} />
                {t("addFrame")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("addNewFrame")}</DialogTitle>
                <DialogDescription>
                  {t("addNewFrameDescription")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="brand">{t("brand")}</Label>
                    <Input
                      id="brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder={t("brandExample")}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="model">{t("model")}</Label>
                    <Input
                      id="model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder={t("modelExample")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="color">{t("color")}</Label>
                    <Input
                      id="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder={t("colorExample")}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="size">{t("size")}</Label>
                    <Input
                      id="size"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder={t("sizeExample")}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">{t("price")}</Label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">{t("quantity")}</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : "")}
                      min={1}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button onClick={handleAddFrame}>{t("save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {filteredFrames.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("brand")}</TableHead>
                <TableHead>{t("model")}</TableHead>
                <TableHead>{t("color")}</TableHead>
                <TableHead>{t("size")}</TableHead>
                <TableHead className="text-right">{t("price")}</TableHead>
                <TableHead className="text-right">{t("quantity")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFrames.map((frame) => (
                <TableRow key={frame.id}>
                  <TableCell className="font-medium">{frame.brand}</TableCell>
                  <TableCell>{frame.model}</TableCell>
                  <TableCell>{frame.color}</TableCell>
                  <TableCell>{frame.size}</TableCell>
                  <TableCell className="text-right">
                    {frame.price.toFixed(2)} {isRtl ? 'د.ك' : 'KD'}
                  </TableCell>
                  <TableCell className="text-right">{frame.quantity}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditFrame(frame)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => startDeleteFrame(frame.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-8 bg-muted/50 rounded-lg">
          <p>{t("noFramesMatchingSearch")}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={handleShowAllFrames}>
            {t("showAllFrames")}
          </Button>
        </div>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editFrame")}</DialogTitle>
            <DialogDescription>
              {t("updateFrameDetails")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-brand">{t("brand")}</Label>
                <Input
                  id="edit-brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-model">{t("model")}</Label>
                <Input
                  id="edit-model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-color">{t("color")}</Label>
                <Input
                  id="edit-color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-size">{t("size")}</Label>
                <Input
                  id="edit-size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">{t("price")}</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-quantity">{t("quantity")}</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : "")}
                  min={0}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleEditFrame}>{t("saveChanges")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmDelete")}</DialogTitle>
            <DialogDescription>
              {t("deleteFrameConfirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDeleteFrame}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
