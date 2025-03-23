
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInvoiceStore } from "@/store/invoiceStore";
import { usePatientStore } from "@/store/patientStore";
import { useLanguageStore } from "@/store/languageStore";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface EditWorkOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrder: any;
  patientId: string;
}

export const EditWorkOrderDialog: React.FC<EditWorkOrderDialogProps> = ({
  open,
  onOpenChange,
  workOrder,
  patientId
}) => {
  const { t, language } = useLanguageStore();
  const { updateInvoice } = useInvoiceStore();
  const { editWorkOrder } = usePatientStore();
  const isRtl = language === 'ar';
  
  const [editData, setEditData] = useState({
    frameBrand: workOrder.frameBrand || '',
    frameModel: workOrder.frameModel || '',
    frameColor: workOrder.frameColor || '',
    framePrice: workOrder.framePrice || 0,
    lensType: workOrder.lensType || '',
    lensPrice: workOrder.lensPrice || 0,
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
  
  const handleSave = () => {
    try {
      // Update the work order in the invoiceStore
      updateInvoice({
        ...workOrder,
        ...editData
      });
      
      // Update any patient-related data if needed
      editWorkOrder({
        patientId,
        workOrderId: workOrder.invoiceId || workOrder.workOrderId,
        updatedData: editData
      });
      
      toast({
        title: t("success"),
        description: t("workOrderUpdated"),
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating work order:", error);
      toast({
        title: t("error"),
        description: t("errorUpdatingWorkOrder"),
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isRtl ? 'rtl' : 'ltr'} sm:max-w-[425px]`}>
        <DialogHeader>
          <DialogTitle>{t("editWorkOrder")}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frameBrand" className="text-right">{t("frameBrand")}</Label>
            <Input
              id="frameBrand"
              name="frameBrand"
              value={editData.frameBrand}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frameModel" className="text-right">{t("frameModel")}</Label>
            <Input
              id="frameModel"
              name="frameModel"
              value={editData.frameModel}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frameColor" className="text-right">{t("frameColor")}</Label>
            <Input
              id="frameColor"
              name="frameColor"
              value={editData.frameColor}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="framePrice" className="text-right">{t("framePrice")}</Label>
            <Input
              id="framePrice"
              name="framePrice"
              type="number"
              value={editData.framePrice}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lensType" className="text-right">{t("lensType")}</Label>
            <Input
              id="lensType"
              name="lensType"
              value={editData.lensType}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lensPrice" className="text-right">{t("lensPrice")}</Label>
            <Input
              id="lensPrice"
              name="lensPrice"
              type="number"
              value={editData.lensPrice}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coating" className="text-right">{t("coating")}</Label>
            <Input
              id="coating"
              name="coating"
              value={editData.coating}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coatingPrice" className="text-right">{t("coatingPrice")}</Label>
            <Input
              id="coatingPrice"
              name="coatingPrice"
              type="number"
              value={editData.coatingPrice}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discount" className="text-right">{t("discount")}</Label>
            <Input
              id="discount"
              name="discount"
              type="number"
              value={editData.discount}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="total" className="text-right">{t("total")}</Label>
            <Input
              id="total"
              name="total"
              type="number"
              value={editData.total}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
          <Button onClick={handleSave}>{t("save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
