
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInvoiceStore } from "@/store/invoiceStore";
import { usePatientStore } from "@/store/patientStore";
import { useLanguageStore } from "@/store/languageStore";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventoryStore } from "@/store/inventoryStore";
import { Frame } from "@/types/inventory";
import { Search, Edit, Clock, Glasses, CheckCircle2 } from "lucide-react";

interface EditWorkOrderDialogProps {
  workOrder: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
}

export const EditWorkOrderDialog: React.FC<EditWorkOrderDialogProps> = ({
  workOrder,
  isOpen,
  onOpenChange,
  onSave
}) => {
  const { t, language } = useLanguageStore();
  const { updateInvoice } = useInvoiceStore();
  const { editWorkOrder } = usePatientStore();
  const { lensTypes, lensCoatings, frames } = useInventoryStore();
  const isRtl = language === 'ar';
  const [activeTab, setActiveTab] = useState('prescription');
  
  // State for manual frame input
  const [useManualFrameInput, setUseManualFrameInput] = useState(
    !frames.some(f => f.brand === workOrder.frameBrand && 
                       f.model === workOrder.frameModel &&
                       f.color === workOrder.frameColor)
  );
  
  // Frame search state
  const [frameSearchQuery, setFrameSearchQuery] = useState('');
  const [filteredFrames, setFilteredFrames] = useState<Frame[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  
  // Edit data state
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
  
  useEffect(() => {
    if (isOpen) {
      // Reset the frame search when dialog opens
      setFrameSearchQuery('');
      setFilteredFrames([]);
      
      // Check if we should start with manual frame input
      setUseManualFrameInput(
        !frames.some(f => f.brand === workOrder.frameBrand && 
                         f.model === workOrder.frameModel &&
                         f.color === workOrder.frameColor)
      );
      
      // Reset edit data when dialog opens
      setEditData({
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
    }
  }, [isOpen, workOrder, frames]);
  
  useEffect(() => {
    // Filter frames based on search query
    if (frameSearchQuery.trim()) {
      const query = frameSearchQuery.toLowerCase();
      const filtered = frames.filter(frame => 
        frame.brand.toLowerCase().includes(query) ||
        frame.model.toLowerCase().includes(query) ||
        frame.color.toLowerCase().includes(query)
      );
      setFilteredFrames(filtered);
    } else {
      setFilteredFrames([]);
    }
  }, [frameSearchQuery, frames]);
  
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
  
  const selectFrame = (frame: Frame) => {
    setSelectedFrame(frame);
    setEditData(prev => ({
      ...prev,
      frameBrand: frame.brand,
      frameModel: frame.model,
      frameColor: frame.color,
      frameSize: frame.size || '',
      framePrice: frame.price
    }));
  };
  
  const handleSaveChanges = () => {
    try {
      const subtotal = editData.framePrice + editData.lensPrice + editData.coatingPrice;
      const newTotal = subtotal - editData.discount;
      
      const currentDateTime = new Date().toISOString();
      
      const updatedWorkOrder = {
        ...workOrder,
        ...editData,
        total: newTotal,
        // Add edit history information
        lastEditedAt: currentDateTime,
        editHistory: [
          ...(workOrder.editHistory || []),
          {
            timestamp: currentDateTime,
            notes: "Order updated"
          }
        ]
      };
      
      updateInvoice(updatedWorkOrder);
      
      if (workOrder.patientId) {
        editWorkOrder({
          patientId: workOrder.patientId,
          workOrderId: workOrder.invoiceId || workOrder.workOrderId,
          updatedData: updatedWorkOrder
        });
      }
      
      toast({
        title: t("success"),
        description: t("workOrderUpdated")
      });
      
      onOpenChange(false);
      if (onSave) onSave();
    } catch (error) {
      console.error("Error updating work order:", error);
      toast({
        title: t("error"),
        description: t("errorUpdatingWorkOrder"),
        variant: "destructive"
      });
    }
  };
  
  const renderPrescriptionTab = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="bg-primary/5 p-4 rounded-lg mb-4">
            <h3 className="text-primary font-medium mb-2 flex items-center">
              <Glasses className="w-4 h-4 mr-2" />
              {t("lensInformation")}
            </h3>
            
            <div className="space-y-4">
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
          </div>
        </div>
        
        <div>
          <div className="bg-primary/5 p-4 rounded-lg mb-4">
            <h3 className="text-primary font-medium mb-2 flex items-center">
              <Frame className="w-4 h-4 mr-2" />
              {t("frameInformation")}
            </h3>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Label>{t("frameSearch")}</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-xs"
                  onClick={() => setUseManualFrameInput(!useManualFrameInput)}
                >
                  {useManualFrameInput ? t("useSearch") : t("manualInput")}
                </Button>
              </div>
              
              {!useManualFrameInput ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t("searchFrames")}
                      className="pl-8"
                      value={frameSearchQuery}
                      onChange={(e) => setFrameSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {filteredFrames.length > 0 && (
                    <div className="border rounded-md max-h-40 overflow-y-auto">
                      {filteredFrames.map((frame) => (
                        <div
                          key={`${frame.brand}-${frame.model}-${frame.color}`}
                          className={`p-2 cursor-pointer hover:bg-muted flex justify-between items-center ${
                            selectedFrame === frame ? 'bg-primary/10' : ''
                          }`}
                          onClick={() => selectFrame(frame)}
                        >
                          <div>
                            <div className="font-medium">{frame.brand} - {frame.model}</div>
                            <div className="text-sm text-muted-foreground">
                              {frame.color} {frame.size ? `(${frame.size})` : ''}
                            </div>
                          </div>
                          <div className="font-medium">{frame.price.toFixed(2)} {t('kwd')}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {frameSearchQuery && filteredFrames.length === 0 && (
                    <div className="text-center py-2 text-muted-foreground">
                      {t("noFramesFound")}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="frameBrand">{t("frameBrand")}</Label>
                    <Input
                      id="frameBrand"
                      name="frameBrand"
                      value={editData.frameBrand}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="frameModel">{t("frameModel")}</Label>
                    <Input
                      id="frameModel"
                      name="frameModel"
                      value={editData.frameModel}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="frameColor">{t("frameColor")}</Label>
                    <Input
                      id="frameColor"
                      name="frameColor"
                      value={editData.frameColor}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="frameSize">{t("frameSize")}</Label>
                    <Input
                      id="frameSize"
                      name="frameSize"
                      value={editData.frameSize}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <Label htmlFor="framePrice">{t("framePrice")}</Label>
                <Input
                  id="framePrice"
                  name="framePrice"
                  type="number"
                  value={editData.framePrice}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderSummaryTab = () => (
    <div className="grid gap-4 py-4">
      <div className="bg-primary/5 p-4 rounded-lg mb-4">
        <h3 className="text-primary font-medium mb-2">{t("orderSummary")}</h3>
        
        <div className="space-y-4">
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
          
          {workOrder.editHistory && workOrder.editHistory.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {t("editHistory")}
              </h4>
              <div className="text-sm text-muted-foreground space-y-1 max-h-32 overflow-y-auto border rounded-md p-2">
                {workOrder.editHistory.map((edit: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>{edit.notes}</span>
                    <span>{new Date(edit.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className={`${isRtl ? 'rtl' : 'ltr'}`}>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            {t("editWorkOrder")}
          </h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prescription">
                <Glasses className="w-4 h-4 mr-2" />
                {t("prescription")}
              </TabsTrigger>
              <TabsTrigger value="summary">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {t("summary")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="prescription">
              {renderPrescriptionTab()}
            </TabsContent>
            
            <TabsContent value="summary">
              {renderSummaryTab()}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSaveChanges}>
              {t("save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
