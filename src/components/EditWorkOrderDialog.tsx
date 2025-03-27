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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkOrder, Invoice, useInvoiceStore } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { usePatientStore, RxData } from "@/store/patientStore";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LensSelector } from "@/components/LensSelector";
import { LensType, LensCoating, LensThickness, useInventoryStore } from "@/store/inventoryStore";
import { Card, CardContent } from "@/components/ui/card";

interface EditWorkOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrder | Invoice;
  onSave: (updatedWorkOrder: WorkOrder | Invoice) => void;
}

export const EditWorkOrderDialog: React.FC<EditWorkOrderDialogProps> = ({
  isOpen,
  onClose,
  workOrder,
  onSave
}) => {
  const { language, t } = useLanguageStore();
  const { updateWorkOrder, updateInvoice } = useInvoiceStore();
  const { getPatientById, updatePatientRx } = usePatientStore();
  const { lensTypes, lensCoatings } = useInventoryStore();
  
  const [activeTab, setActiveTab] = useState("rx");
  const [editedWorkOrder, setEditedWorkOrder] = useState<any>({...workOrder});
  const [selectedLensType, setSelectedLensType] = useState<LensType | null>(null);
  const [selectedCoating, setSelectedCoating] = useState<LensCoating | null>(null);
  const [selectedThickness, setSelectedThickness] = useState<LensThickness | null>(null);
  const [skipLens, setSkipLens] = useState(false);
  
  const patient = workOrder.patientId ? getPatientById(workOrder.patientId) : null;
  const patientRx = patient?.rx || {
    sphereOD: "",
    cylOD: "",
    axisOD: "",
    addOD: "",
    sphereOS: "",
    cylOS: "",
    axisOS: "",
    addOS: "",
    pdRight: "",
    pdLeft: ""
  };
  
  const form = useForm<RxData>({
    defaultValues: {
      sphereOD: patientRx.sphereOD || "",
      cylOD: patientRx.cylOD || "",
      axisOD: patientRx.axisOD || "",
      addOD: patientRx.addOD || "",
      sphereOS: patientRx.sphereOS || "",
      cylOS: patientRx.cylOS || "",
      axisOS: patientRx.axisOS || "",
      addOS: patientRx.addOS || "",
      pdRight: patientRx.pdRight || "",
      pdLeft: patientRx.pdLeft || "",
    }
  });
  
  const getLensPrice = (lens: LensType | null): number => {
    return lens?.price !== undefined ? lens.price : 0;
  };

  useEffect(() => {
    if (workOrder) {
      if ('lensType' in workOrder && workOrder.lensType) {
        const lens = workOrder.lensType;
        const lensTypeObj = typeof lens === 'object' ? 
          lensTypes.find(lt => lt.name === lens.name) : 
          lensTypes.find(lt => lt.name === lens);
          
        setSelectedLensType(lensTypeObj || null);
      }
      
      if ('lensType' in workOrder && typeof workOrder.lensType === 'string') {
        const lensTypeObj = lensTypes.find(lt => lt.name === workOrder.lensType);
        setSelectedLensType(lensTypeObj || null);
      }
      
      if ('coating' in workOrder && workOrder.coating) {
        const coatingObj = lensCoatings.find(c => c.name === workOrder.coating);
        setSelectedCoating(coatingObj || null);
      }
      
      if (!('lensType' in workOrder) || !workOrder.lensType) {
        setSkipLens(true);
      }
    }
  }, [workOrder, lensTypes, lensCoatings]);
  
  const handleSave = () => {
    const rxData = form.getValues();
    
    if (workOrder.patientId) {
      updatePatientRx(workOrder.patientId, rxData);
    }
    
    const updatedOrder = {
      ...editedWorkOrder,
      rx: rxData,
    };
    
    if (!skipLens) {
      if (selectedLensType) {
        if ('lensType' in updatedOrder && typeof updatedOrder.lensType === 'object') {
          updatedOrder.lensType = {
            name: selectedLensType.name,
            price: getLensPrice(selectedLensType)
          };
        } else {
          updatedOrder.lensType = selectedLensType.name;
          updatedOrder.lensPrice = getLensPrice(selectedLensType);
        }
      }
      
      if (selectedCoating) {
        updatedOrder.coating = selectedCoating.name;
        updatedOrder.coatingPrice = selectedCoating.price;
      } else {
        updatedOrder.coating = '';
        updatedOrder.coatingPrice = 0;
      }
    } else {
      if ('lensType' in updatedOrder && typeof updatedOrder.lensType === 'object') {
        updatedOrder.lensType = null;
      } else {
        updatedOrder.lensType = '';
        updatedOrder.lensPrice = 0;
      }
      updatedOrder.coating = '';
      updatedOrder.coatingPrice = 0;
    }
    
    if ('invoiceId' in workOrder) {
      updateInvoice(updatedOrder);
    } else {
      updateWorkOrder(updatedOrder);
    }
    
    onSave(updatedOrder);
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('editWorkOrder')}</DialogTitle>
          <DialogDescription>
            {language === 'ar' 
              ? "قم بتعديل بيانات أمر العمل"
              : "Make changes to the work order details"}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="rx">
              {t('prescription')}
            </TabsTrigger>
            <TabsTrigger value="lensFrame">
              {t('lensAndFrame')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rx" className="space-y-4">
            <Form {...form}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-medium">{t('rightEye')} (OD)</h3>
                  
                  <FormField
                    control={form.control}
                    name="sphereOD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('sphere')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cylOD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('cylinder')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="axisOD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('axis')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="addOD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('add')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">{t('leftEye')} (OS)</h3>
                  
                  <FormField
                    control={form.control}
                    name="sphereOS"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('sphere')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cylOS"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('cylinder')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="axisOS"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('axis')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="addOS"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('add')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="pdRight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pdRight')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pdLeft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pdLeft')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </TabsContent>
          
          <TabsContent value="lensFrame" className="space-y-4">
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-medium mb-4">{t('lensSelection')}</h3>
                <LensSelector
                  onSelectLensType={setSelectedLensType}
                  onSelectCoating={setSelectedCoating}
                  onSelectThickness={setSelectedThickness}
                  skipLens={skipLens}
                  onSkipLensChange={setSkipLens}
                  initialLensType={selectedLensType}
                  initialCoating={selectedCoating}
                  initialThickness={selectedThickness}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-medium mb-4">{t('frameDetails')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frameBrand">{t('brand')}</Label>
                    <Input 
                      id="frameBrand" 
                      value={editedWorkOrder.frameBrand || ''} 
                      onChange={(e) => setEditedWorkOrder({...editedWorkOrder, frameBrand: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frameModel">{t('model')}</Label>
                    <Input 
                      id="frameModel" 
                      value={editedWorkOrder.frameModel || ''} 
                      onChange={(e) => setEditedWorkOrder({...editedWorkOrder, frameModel: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frameColor">{t('color')}</Label>
                    <Input 
                      id="frameColor" 
                      value={editedWorkOrder.frameColor || ''} 
                      onChange={(e) => setEditedWorkOrder({...editedWorkOrder, frameColor: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frameSize">{t('size')}</Label>
                    <Input 
                      id="frameSize" 
                      value={editedWorkOrder.frameSize || ''} 
                      onChange={(e) => setEditedWorkOrder({...editedWorkOrder, frameSize: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="framePrice">{t('price')}</Label>
                    <Input 
                      id="framePrice" 
                      type="number"
                      value={editedWorkOrder.framePrice || 0} 
                      onChange={(e) => setEditedWorkOrder({...editedWorkOrder, framePrice: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
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
