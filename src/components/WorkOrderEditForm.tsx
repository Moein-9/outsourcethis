
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInvoiceStore } from "@/store/invoiceStore";
import { usePatientStore } from "@/store/patientStore";
import { useLanguageStore } from "@/store/languageStore";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventoryStore } from "@/store/inventoryStore";
import { WorkOrder as InventoryWorkOrder } from "@/types/inventory";

interface WorkOrderEditFormProps {
  workOrder: InventoryWorkOrder;
  onSave: (updatedWorkOrder: InventoryWorkOrder) => void;
  onCancel: () => void;
}

export const WorkOrderEditForm: React.FC<WorkOrderEditFormProps> = ({
  workOrder,
  onSave,
  onCancel
}) => {
  const { t, language } = useLanguageStore();
  const { updateInvoice } = useInvoiceStore();
  const { editWorkOrder } = usePatientStore();
  const { lensTypes, lensCoatings, frames } = useInventoryStore();
  const isRtl = language === 'ar';
  
  // Fix: Update the getLensTypeName function to handle type correctly
  const getLensTypeName = (lensType: any): string => {
    if (typeof lensType === 'object' && lensType !== null && 'name' in lensType) {
      return lensType.name || '';
    }
    return typeof lensType === 'string' ? lensType : '';
  };
  
  // Fix: Update the getLensPrice function to ensure it handles all possible input types
  const getLensPrice = (lensType: any, fallbackPrice: number): number => {
    if (typeof lensType === 'object' && lensType !== null && 'price' in lensType) {
      return lensType.price || fallbackPrice;
    }
    return fallbackPrice;
  };
  
  const [editData, setEditData] = useState({
    frameBrand: workOrder.frameBrand || '',
    frameModel: workOrder.frameModel || '',
    frameColor: workOrder.frameColor || '',
    frameSize: workOrder.frameSize || '',
    framePrice: workOrder.framePrice || 0,
    lensType: getLensTypeName(workOrder.lensType),
    lensPrice: getLensPrice(workOrder.lensType, workOrder.lensPrice || 0),
    coating: workOrder.coating || '',
    coatingPrice: workOrder.coatingPrice || 0,
    discount: workOrder.discount || 0,
    total: workOrder.total || 0,
  });
  
  // Track original values to identify what changed
  const [originalData] = useState({
    frameBrand: workOrder.frameBrand || '',
    frameModel: workOrder.frameModel || '',
    frameColor: workOrder.frameColor || '',
    frameSize: workOrder.frameSize || '',
    framePrice: workOrder.framePrice || 0,
    lensType: getLensTypeName(workOrder.lensType),
    lensPrice: getLensPrice(workOrder.lensType, workOrder.lensPrice || 0),
    coating: workOrder.coating || '',
    coatingPrice: workOrder.coatingPrice || 0,
    discount: workOrder.discount || 0,
    total: workOrder.total || 0,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'framePrice' || name === 'lensPrice' || name === 'coatingPrice' || name === 'discount' || name === 'total') {
      setEditData({
        ...editData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setEditData({
        ...editData,
        [name]: value
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setEditData({
      ...editData,
      [name]: value
    });
    
    if (name === 'lensType') {
      const selectedLens = lensTypes.find(lens => lens.type === value);
      if (selectedLens) {
        setEditData(prev => ({
          ...prev,
          lensPrice: selectedLens.price || 0
        }));
      }
    } else if (name === 'coating') {
      const selectedCoating = lensCoatings.find(coating => coating.name === value);
      if (selectedCoating) {
        setEditData(prev => ({
          ...prev,
          coatingPrice: selectedCoating.price || 0
        }));
      }
    } else if (name === 'frameBrand') {
      setEditData(prev => ({
        ...prev,
        frameModel: '',
        frameColor: ''
      }));
    }
  };
  
  const getChanges = (): string[] => {
    const changes: string[] = [];
    
    if (editData.frameBrand !== originalData.frameBrand) {
      changes.push(`${t("frameBrand")}: ${originalData.frameBrand} → ${editData.frameBrand}`);
    }
    if (editData.frameModel !== originalData.frameModel) {
      changes.push(`${t("frameModel")}: ${originalData.frameModel} → ${editData.frameModel}`);
    }
    if (editData.frameColor !== originalData.frameColor) {
      changes.push(`${t("frameColor")}: ${originalData.frameColor} → ${editData.frameColor}`);
    }
    if (editData.frameSize !== originalData.frameSize) {
      changes.push(`${t("frameSize")}: ${originalData.frameSize} → ${editData.frameSize}`);
    }
    if (editData.framePrice !== originalData.framePrice) {
      changes.push(`${t("framePrice")}: ${originalData.framePrice} → ${editData.framePrice}`);
    }
    if (editData.lensType !== originalData.lensType) {
      changes.push(`${t("lensType")}: ${originalData.lensType} → ${editData.lensType}`);
    }
    if (editData.lensPrice !== originalData.lensPrice) {
      changes.push(`${t("lensPrice")}: ${originalData.lensPrice} → ${editData.lensPrice}`);
    }
    if (editData.coating !== originalData.coating) {
      changes.push(`${t("coating")}: ${originalData.coating} → ${editData.coating}`);
    }
    if (editData.coatingPrice !== originalData.coatingPrice) {
      changes.push(`${t("coatingPrice")}: ${originalData.coatingPrice} → ${editData.coatingPrice}`);
    }
    if (editData.discount !== originalData.discount) {
      changes.push(`${t("discount")}: ${originalData.discount} → ${editData.discount}`);
    }
    
    return changes;
  };
  
  const handleSaveChanges = () => {
    try {
      const subtotal = editData.framePrice + editData.lensPrice + editData.coatingPrice;
      const newTotal = subtotal - editData.discount;
      
      // Create timestamp for the edit
      const now = new Date().toISOString();
      
      // Generate detailed notes about what changed
      const changes = getChanges();
      const changeNotes = changes.length > 0 
        ? language === 'ar' 
          ? `تم تعديل أمر العمل: ${changes.join('، ')}` 
          : `Work order edited: ${changes.join(', ')}`
        : language === 'ar' 
          ? "تم تعديل أمر العمل" 
          : "Work order has been edited";
      
      // Create edit history entry
      const editHistoryEntry = {
        timestamp: now,
        notes: changeNotes
      };
      
      // Combine existing history with new entry
      const existingHistory = workOrder.editHistory || [];
      const updatedHistory = [...existingHistory, editHistoryEntry];
      
      // Prepare lensType in the correct format for the WorkOrder
      const lensTypeForWorkOrder = {
        name: editData.lensType,
        price: editData.lensPrice
      };
      
      // Update work order with new data and edit history
      const updatedWorkOrder: InventoryWorkOrder = {
        ...workOrder,
        frameBrand: editData.frameBrand,
        frameModel: editData.frameModel,
        frameColor: editData.frameColor,
        frameSize: editData.frameSize,
        framePrice: editData.framePrice,
        lensType: lensTypeForWorkOrder,
        lensPrice: editData.lensPrice,
        coating: editData.coating,
        coatingPrice: editData.coatingPrice,
        discount: editData.discount,
        total: newTotal,
        lastEditedAt: now,
        editHistory: updatedHistory
      };
      
      // Call the onSave callback with the updated work order
      onSave(updatedWorkOrder);
      
      // Show success message
      toast({
        title: t("success"),
        description: t("workOrderUpdated")
      });
    } catch (error) {
      console.error("Error updating work order:", error);
      toast({
        title: t("error"),
        description: t("errorUpdatingWorkOrder"),
        variant: "destructive"
      });
    }
  };
  
  const availableBrands = [...new Set(frames.map(frame => frame.brand))];
  
  const availableModels = frames
    .filter(frame => frame.brand === editData.frameBrand)
    .map(frame => frame.model);
  
  const availableColors = frames
    .filter(frame => 
      frame.brand === editData.frameBrand && 
      frame.model === editData.frameModel
    )
    .map(frame => frame.color);
  
  return (
    <div className={`p-4 ${isRtl ? 'rtl' : 'ltr'}`}>
      <h3 className="text-lg font-medium mb-4">{t("editWorkOrder")}</h3>
      
      <div className="grid gap-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="frameBrand">{t("frameBrand")}</Label>
            <Select 
              value={editData.frameBrand} 
              onValueChange={(value) => handleSelectChange('frameBrand', value)}
            >
              <SelectTrigger id="frameBrand">
                <SelectValue placeholder={t("selectFrameBrand")} />
              </SelectTrigger>
              <SelectContent>
                {availableBrands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="frameModel">{t("frameModel")}</Label>
            <Select 
              value={editData.frameModel} 
              onValueChange={(value) => handleSelectChange('frameModel', value)}
              disabled={!editData.frameBrand}
            >
              <SelectTrigger id="frameModel">
                <SelectValue placeholder={t("selectFrameModel")} />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map(model => (
                  <SelectItem key={model} value={model}>{model}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="frameColor">{t("frameColor")}</Label>
            <Select 
              value={editData.frameColor} 
              onValueChange={(value) => handleSelectChange('frameColor', value)}
              disabled={!editData.frameModel}
            >
              <SelectTrigger id="frameColor">
                <SelectValue placeholder={t("selectFrameColor")} />
              </SelectTrigger>
              <SelectContent>
                {availableColors.map(color => (
                  <SelectItem key={color} value={color}>{color}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="framePrice">{t("framePrice")}</Label>
          <Input
            id="framePrice"
            name="framePrice"
            type="number"
            value={editData.framePrice}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lensType">{t("lensType")}</Label>
            <Select 
              value={editData.lensType} 
              onValueChange={(value) => handleSelectChange('lensType', value)}
            >
              <SelectTrigger id="lensType">
                <SelectValue placeholder={t("selectLensType")} />
              </SelectTrigger>
              <SelectContent>
                {lensTypes.map(lens => (
                  <SelectItem key={lens.id} value={lens.type}>{lens.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="lensPrice">{t("lensPrice")}</Label>
            <Input
              id="lensPrice"
              name="lensPrice"
              type="number"
              value={editData.lensPrice}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="coating">{t("coating")}</Label>
            <Select 
              value={editData.coating} 
              onValueChange={(value) => handleSelectChange('coating', value)}
            >
              <SelectTrigger id="coating">
                <SelectValue placeholder={t("selectCoating")} />
              </SelectTrigger>
              <SelectContent>
                {lensCoatings.map(coating => (
                  <SelectItem key={coating.id} value={coating.name}>{coating.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="coatingPrice">{t("coatingPrice")}</Label>
            <Input
              id="coatingPrice"
              name="coatingPrice"
              type="number"
              value={editData.coatingPrice}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="discount">{t("discount")}</Label>
            <Input
              id="discount"
              name="discount"
              type="number"
              value={editData.discount}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="total">{t("total")}</Label>
            <Input
              id="total"
              name="total"
              type="number"
              value={(editData.framePrice + editData.lensPrice + editData.coatingPrice - editData.discount).toFixed(3)}
              disabled
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button onClick={handleSaveChanges}>
          {t("save")}
        </Button>
      </div>
    </div>
  );
};
