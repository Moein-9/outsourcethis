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
import { LensType, LensCoating, LensThickness, Frame, useInventoryStore } from "@/store/inventoryStore";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { 
  Search, 
  User, 
  Eye, 
  Clock 
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

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
  const { lensTypes, lensCoatings, frames } = useInventoryStore();
  
  const [activeTab, setActiveTab] = useState("rx");
  const [editedWorkOrder, setEditedWorkOrder] = useState<any>({...workOrder});
  const [selectedLensType, setSelectedLensType] = useState<LensType | null>(null);
  const [selectedCoating, setSelectedCoating] = useState<LensCoating | null>(null);
  const [selectedThickness, setSelectedThickness] = useState<LensThickness | null>(null);
  const [skipLens, setSkipLens] = useState(false);
  const [frameSearchQuery, setFrameSearchQuery] = useState("");
  const [frameInputMode, setFrameInputMode] = useState<'search' | 'manual'>('search');
  const [searchResults, setSearchResults] = useState<Frame[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  
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
      
      if ('frameBrand' in workOrder && workOrder.frameBrand && 'frameModel' in workOrder && workOrder.frameModel) {
        const matchingFrame = frames.find(f => 
          f.brand === workOrder.frameBrand && 
          f.model === workOrder.frameModel &&
          f.color === workOrder.frameColor
        );
        
        if (matchingFrame) {
          setSelectedFrame(matchingFrame);
          setFrameInputMode('search');
        } else {
          setFrameInputMode('manual');
        }
      } else {
        setFrameInputMode('manual');
      }
    }
  }, [workOrder, lensTypes, lensCoatings, frames]);
  
  useEffect(() => {
    if (frameSearchQuery.trim().length > 2) {
      const query = frameSearchQuery.toLowerCase();
      const results = frames.filter(frame => 
        frame.brand.toLowerCase().includes(query) || 
        frame.model.toLowerCase().includes(query) ||
        frame.color.toLowerCase().includes(query)
      );
      setSearchResults(results.slice(0, 10));
    } else {
      setSearchResults([]);
    }
  }, [frameSearchQuery, frames]);
  
  const handleSave = () => {
    const rxData = form.getValues();
    
    if (workOrder.patientId) {
      updatePatientRx(workOrder.patientId, rxData);
    }
    
    const updatedOrder = {
      ...editedWorkOrder,
      rx: rxData,
      lastEditedAt: new Date().toISOString(),
      editHistory: [
        ...((editedWorkOrder.editHistory || []) as any[]),
        {
          timestamp: new Date().toISOString(),
          notes: "Order updated"
        }
      ]
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
    
    toast.success(language === 'ar' 
      ? "تم تحديث الطلب بنجاح" 
      : "Order updated successfully");
    
    onSave(updatedOrder);
  };
  
  const handleFrameSelect = (frame: Frame) => {
    setSelectedFrame(frame);
    setEditedWorkOrder({
      ...editedWorkOrder,
      frameBrand: frame.brand,
      frameModel: frame.model,
      frameColor: frame.color,
      frameSize: frame.size || "",
      framePrice: frame.price || 0
    });
    setFrameSearchQuery("");
  };
  
  const handleChangeInputMode = (mode: 'search' | 'manual') => {
    setFrameInputMode(mode);
    if (mode === 'manual' && selectedFrame) {
      setSelectedFrame(null);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('editWorkOrder')}</DialogTitle>
          <DialogDescription>
            {language === 'ar' 
              ? "قم بتعديل بيانات أمر العمل"
              : "Make changes to the work order details"}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="rx">
              {t('prescription')}
            </TabsTrigger>
            <TabsTrigger value="lensFrame">
              {t('lensAndFrame')}
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1">
            <TabsContent value="rx" className="space-y-4 p-1 m-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {t('prescriptionDetails')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3 border rounded-md p-3 bg-slate-50">
                        <h3 className="font-medium text-primary flex items-center gap-1.5">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          {t('rightEye')} (OD)
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-3">
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
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
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
                      </div>
                      
                      <div className="space-y-3 border rounded-md p-3 bg-slate-50">
                        <h3 className="font-medium text-primary flex items-center gap-1.5">
                          <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                          {t('leftEye')} (OS)
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-3">
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
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
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
                    </div>
                    
                    <div className="mt-4 p-3 border rounded-md bg-blue-50">
                      <h3 className="font-medium text-primary mb-3">{t('pupillaryDistance')}</h3>
                      <div className="grid grid-cols-2 gap-4">
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
                    </div>
                  </Form>
                </CardContent>
              </Card>
              
              {patient && (
                <Card className="bg-blue-50/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-blue-600">
                      <User className="h-4 w-4" />
                      {t('patientInfo')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div>
                      <span className="font-medium">{t('name')}:</span> {patient.name}
                    </div>
                    <div>
                      <span className="font-medium">{t('phone')}:</span> {patient.phone}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="lensFrame" className="space-y-4 p-1 m-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('lensSelection')}</CardTitle>
                </CardHeader>
                <CardContent>
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
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('frameDetails')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex gap-2 mb-3">
                      <Button 
                        variant={frameInputMode === 'search' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => handleChangeInputMode('search')}
                      >
                        <Search className="h-4 w-4 mr-1" />
                        {t('searchFrame')}
                      </Button>
                      <Button 
                        variant={frameInputMode === 'manual' ? "default" : "outline"} 
                        size="sm"
                        onClick={() => handleChangeInputMode('manual')}
                      >
                        {t('manualEntry')}
                      </Button>
                    </div>
                    
                    {frameInputMode === 'search' ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder={t('searchByBrandModelOrColor')}
                            value={frameSearchQuery}
                            onChange={(e) => setFrameSearchQuery(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                        
                        {selectedFrame ? (
                          <div className="p-3 border rounded-md bg-green-50">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">{selectedFrame.brand} {selectedFrame.model}</h4>
                                <div className="text-sm text-muted-foreground">
                                  {selectedFrame.color} - {selectedFrame.size || "N/A"}
                                </div>
                              </div>
                              <div className="font-medium text-green-700">
                                {selectedFrame.price?.toFixed(3) || "0.000"} KWD
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => {
                                setSelectedFrame(null);
                                setFrameSearchQuery("");
                              }}
                            >
                              {t('change')}
                            </Button>
                          </div>
                        ) : (
                          <div className="border rounded-md overflow-hidden">
                            {searchResults.length > 0 ? (
                              <div className="max-h-40 overflow-y-auto">
                                {searchResults.map((frame, index) => (
                                  <div 
                                    key={`${frame.brand}-${frame.model}-${frame.color}-${index}`}
                                    className="p-2 hover:bg-slate-50 cursor-pointer border-b last:border-b-0 flex justify-between"
                                    onClick={() => handleFrameSelect(frame)}
                                  >
                                    <div>
                                      <div className="font-medium">{frame.brand} {frame.model}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {frame.color} - {frame.size || "N/A"}
                                      </div>
                                    </div>
                                    <div className="font-medium">
                                      {frame.price?.toFixed(3) || "0.000"} KWD
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : frameSearchQuery.length > 0 ? (
                              <div className="p-3 text-center text-muted-foreground">
                                {t('noFramesFound')}
                              </div>
                            ) : (
                              <div className="p-3 text-center text-muted-foreground">
                                {t('typeToSearchFrames')}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
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
                            step="0.001"
                            value={editedWorkOrder.framePrice || 0} 
                            onChange={(e) => setEditedWorkOrder({...editedWorkOrder, framePrice: Number(e.target.value)})}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {editedWorkOrder.editHistory && editedWorkOrder.editHistory.length > 0 && (
                <Card className="bg-amber-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-amber-700">
                      <Clock className="h-4 w-4" />
                      {t('editHistory')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {editedWorkOrder.editHistory.map((edit: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                          <div>
                            {new Date(edit.timestamp).toLocaleString()} - {edit.notes}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="mt-2">
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
