
import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInventoryStore, RepairService } from "@/store/inventoryStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Save, Wrench } from "lucide-react";
import { toast } from "sonner";

export const RepairServiceManager: React.FC = () => {
  const { language, t } = useLanguageStore();
  const { getRepairServices, addRepairService, updateRepairService, deleteRepairService } = useInventoryStore();
  
  const [repairServices, setRepairServices] = useState<RepairService[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<RepairService | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  
  const isRtl = language === 'ar';
  const textAlignClass = isRtl ? 'text-right' : 'text-left';
  
  useEffect(() => {
    const services = getRepairServices();
    setRepairServices(services);
  }, [getRepairServices]);
  
  const resetForm = () => {
    setName("");
    setPrice(0);
    setDescription("");
    setEditingService(null);
  };
  
  const handleAddOrUpdate = () => {
    if (!name.trim()) {
      toast.error(t('pleaseEnterServiceName'));
      return;
    }
    
    if (price <= 0) {
      toast.error(t('pleaseEnterValidPrice'));
      return;
    }
    
    const serviceData: RepairService = {
      id: editingService?.id || `repair-${Date.now()}`,
      name,
      price,
      description: description.trim() || undefined
    };
    
    if (editingService) {
      updateRepairService(serviceData);
      toast.success(t('serviceUpdated'));
    } else {
      addRepairService(serviceData);
      toast.success(t('serviceAdded'));
    }
    
    setDialogOpen(false);
    resetForm();
    
    // Refresh the list
    setRepairServices(getRepairServices());
  };
  
  const handleEditService = (service: RepairService) => {
    setEditingService(service);
    setName(service.name);
    setPrice(service.price);
    setDescription(service.description || "");
    setDialogOpen(true);
  };
  
  const handleDeleteService = (serviceId: string) => {
    if (window.confirm(t('confirmDeleteService'))) {
      deleteRepairService(serviceId);
      toast.success(t('serviceDeleted'));
      setRepairServices(getRepairServices());
    }
  };
  
  const handleOpenDialog = () => {
    resetForm();
    setDialogOpen(true);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-semibold ${textAlignClass}`}>
          {isRtl ? "خدمات الإصلاح" : "Repair Services"}
        </h3>
        <Button onClick={handleOpenDialog} variant="outline" className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          {isRtl ? "إضافة خدمة" : "Add Service"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repairServices.length > 0 ? (
          repairServices.map((service) => (
            <Card key={service.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-lg">{service.name}</h4>
                  <div className="font-bold text-purple-600">
                    {price.toFixed(3)} KWD
                  </div>
                </div>
                {service.description && (
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                )}
                <div className="flex justify-end gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleEditService(service)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    {isRtl ? "تعديل" : "Edit"}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {isRtl ? "حذف" : "Delete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">
              {isRtl ? "لا توجد خدمات إصلاح. قم بإضافة خدمات للبدء." : "No repair services. Add services to get started."}
            </p>
          </div>
        )}
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={`${isRtl ? 'rtl' : 'ltr'} sm:max-w-[425px]`}>
          <DialogHeader>
            <DialogTitle>
              {editingService 
                ? (isRtl ? "تعديل خدمة الإصلاح" : "Edit Repair Service") 
                : (isRtl ? "إضافة خدمة إصلاح جديدة" : "Add New Repair Service")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className={`${textAlignClass} col-span-4`}>
                {isRtl ? "اسم الخدمة" : "Service Name"}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`col-span-4 ${textAlignClass}`}
                placeholder={isRtl ? "أدخل اسم الخدمة" : "Enter service name"}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className={`${textAlignClass} col-span-4`}>
                {isRtl ? "السعر (د.ك)" : "Price (KWD)"}
              </Label>
              <Input
                id="price"
                type="number"
                step="0.001"
                min="0"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className={`col-span-4 ${textAlignClass}`}
                placeholder="0.000"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className={`${textAlignClass} col-span-4`}>
                {isRtl ? "الوصف (اختياري)" : "Description (Optional)"}
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`col-span-4 ${textAlignClass}`}
                placeholder={isRtl ? "أدخل وصف الخدمة" : "Enter service description"}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setDialogOpen(false)} variant="outline">
              {isRtl ? "إلغاء" : "Cancel"}
            </Button>
            <Button type="button" onClick={handleAddOrUpdate} className="flex items-center gap-1">
              <Save className="w-4 h-4" />
              {isRtl ? "حفظ" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
