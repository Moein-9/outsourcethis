
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

interface WorkOrderEditFormProps {
  workOrder: any;
  onSave: () => void;
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
  
  const [editData, setEditData] = useState({
    frameBrand: workOrder.frameBrand || '',
    frameModel: workOrder.frameModel || '',
    frameColor: workOrder.frameColor || '',
    frameSize: workOrder.frameSize || '',
    framePrice: workOrder.framePrice || 0,
    lensType: workOrder.lensType || '',
    lensPrice: workOrder.lensPrice || 0,
    coating: workOrder.coating || '',
    coatingPrice: workOrder.coatingPrice || 0,
    discount: workOrder.discount || 0,
    total: workOrder.total || 0,
  });
  
  const getLensPrice = (lens: any): number => {
    return lens && lens.price !== undefined ? lens.price : 0;
  };
  
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
          lensPrice: getLensPrice(selectedLens)
        }));
      }
    } else if (name === 'coating') {
      const selectedCoating = lensCoatings.find(coating => coating.name === value);
      if (selectedCoating) {
        setEditData(prev => ({
          ...prev,
          coatingPrice: selectedCoating.price
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
  
  const handleSaveChanges = () => {
    try {
      const subtotal = editData.framePrice + editData.lensPrice + editData.coatingPrice;
      const newTotal = subtotal - editData.discount;
      
      // Create timestamp for the edit
      const now = new Date().toISOString();
      
      // Create edit history entry
      const editHistoryEntry = {
        timestamp: now,
        notes: language === 'ar' ? "تم تعديل أمر العمل" : "Work order has been edited"
      };
      
      // Combine existing history with new entry
      const existingHistory = workOrder.editHistory || [];
      const updatedHistory = [...existingHistory, editHistoryEntry];
      
      // Update work order with new data and edit history
      const updatedWorkOrder = {
        ...workOrder,
        ...editData,
        total: newTotal,
        lastEditedAt: now,
        editHistory: updatedHistory
      };
      
      // Also update the related invoice if it exists
      const invoiceToUpdate = {
        ...updatedWorkOrder,
        invoiceId: workOrder.invoiceId || workOrder.id,
      };
      
      // Update invoice in store
      updateInvoice(invoiceToUpdate);
      
      // Update work order in patient store if patient ID exists
      if (workOrder.patientId) {
        editWorkOrder({
          patientId: workOrder.patientId,
          workOrderId: workOrder.invoiceId || workOrder.workOrderId || workOrder.id,
          updatedData: updatedWorkOrder
        });
      }
      
      // Show success message
      toast({
        title: t("success"),
        description: t("workOrderUpdated")
      });
      
      // Call the onSave callback
      onSave();
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
