
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WorkOrder } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";

interface EditWorkOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrder;
  onSave: (updatedWorkOrder: WorkOrder) => void;
}

export const EditWorkOrderDialog: React.FC<EditWorkOrderDialogProps> = ({
  isOpen,
  onClose,
  workOrder,
  onSave
}) => {
  const { language, t } = useLanguageStore();
  const [editedWorkOrder, setEditedWorkOrder] = useState<WorkOrder>({...workOrder});
  
  const handleSave = () => {
    onSave(editedWorkOrder);
    onClose();
  };
  
  useEffect(() => {
    setEditedWorkOrder({...workOrder});
  }, [workOrder]);
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editWorkOrder')}</DialogTitle>
          <DialogDescription>
            {language === 'ar' 
              ? "قم بتعديل بيانات أمر العمل"
              : "Make changes to the work order details"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="lensType">{t('lensType')}</Label>
            <Input 
              id="lensType" 
              value={editedWorkOrder.lensType?.name || ''} 
              onChange={(e) => setEditedWorkOrder({
                ...editedWorkOrder, 
                lensType: { 
                  ...editedWorkOrder.lensType || {}, 
                  name: e.target.value,
                  price: editedWorkOrder.lensType?.price || 0
                }
              })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">{t('price')}</Label>
            <Input 
              id="price" 
              type="number"
              value={editedWorkOrder.lensType?.price || 0} 
              onChange={(e) => setEditedWorkOrder({
                ...editedWorkOrder, 
                lensType: { 
                  ...editedWorkOrder.lensType || {}, 
                  name: editedWorkOrder.lensType?.name || '',
                  price: Number(e.target.value) 
                }
              })}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave}>
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
