
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInvoiceStore } from "@/store/invoiceStore";
import { usePatientStore, WorkOrderEdit as PatientWorkOrderEdit } from "@/store/patientStore";
import { useLanguageStore } from "@/store/languageStore";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventoryStore } from "@/store/inventoryStore";
import { Search, Edit, Clock, Glasses, CheckCircle2, Eye, Calculator, AlertTriangle } from "lucide-react";
import { Frame, WorkOrder, WorkOrderEdit } from "@/types/inventory";

interface EditWorkOrderDialogProps {
  workOrder: WorkOrder;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedWorkOrder: WorkOrder) => void;
}

export const EditWorkOrderDialog: React.FC<EditWorkOrderDialogProps> = ({
  workOrder,
  isOpen,
  onClose,
  onSave
}) => {
  const { t, language } = useLanguageStore();
  const { updateWorkOrder, getInvoiceById, updateInvoice } = useInvoiceStore();
  const { editWorkOrder, getPatientById } = usePatientStore();
  const { lensTypes, lensCoatings, frames: storeFrames } = useInventoryStore();
  const isRtl = language === 'ar';
  const [activeTab, setActiveTab] = useState('prescription');
  
  const patient = workOrder.patientId ? getPatientById?.(workOrder.patientId) : null;
  const originalInvoice = workOrder.invoiceId ? getInvoiceById?.(workOrder.invoiceId) : null;
  
  const frames = React.useMemo(() => {
    return storeFrames.map(frame => ({
      id: frame.frameId,
      brand: frame.brand,
      model: frame.model,
      color: frame.color,
      size: frame.size,
      price: frame.price,
      stock: frame.qty
    }));
  }, [storeFrames]);
  
  const [useManualFrameInput, setUseManualFrameInput] = useState(
    !frames.some(f => f.brand === workOrder.frameBrand && 
                       f.model === workOrder.frameModel &&
                       f.color === workOrder.frameColor)
  );
  
  const [frameSearchQuery, setFrameSearchQuery] = useState('');
  const [filteredFrames, setFilteredFrames] = useState<Frame[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  
  const [rxData, setRxData] = useState({
    sphereOD: patient?.rx?.sphereOD || "—",
    cylOD: patient?.rx?.cylOD || "—",
    axisOD: patient?.rx?.axisOD || "—",
    addOD: patient?.rx?.addOD || "—",
    pdRight: patient?.rx?.pdRight || "—",
    
    sphereOS: patient?.rx?.sphereOS || "—",
    cylOS: patient?.rx?.cylOS || "—",
    axisOS: patient?.rx?.axisOS || "—",
    addOS: patient?.rx?.addOS || "—",
    pdLeft: patient?.rx?.pdLeft || "—",
  });
  
  const [originalTotal, setOriginalTotal] = useState(originalInvoice?.total || workOrder.total || 0);
  const [currentTotal, setCurrentTotal] = useState(workOrder.total || 0);
  const [priceDifference, setPriceDifference] = useState(0);
  
  const [editData, setEditData] = useState({
    frameBrand: workOrder.frameBrand || '',
    frameModel: workOrder.frameModel || '',
    frameColor: workOrder.frameColor || '',
    frameSize: workOrder.frameSize || '',
    framePrice: workOrder.framePrice || 0,
    lensType: typeof workOrder.lensType === 'object' && workOrder.lensType && 'name' in workOrder.lensType
      ? workOrder.lensType.name 
      : (workOrder.lensType as string) || '',
    lensPrice: workOrder.lensPrice || 0,
    coating: workOrder.coating || '',
    coatingPrice: workOrder.coatingPrice || 0,
    thickness: (workOrder as any).thickness || '',
    discount: workOrder.discount || 0,
    total: workOrder.total || 0,
  });
  
  useEffect(() => {
    if (isOpen) {
      setFrameSearchQuery('');
      setFilteredFrames([]);
      
      setUseManualFrameInput(
        !frames.some(f => f.brand === workOrder.frameBrand && 
                         f.model === workOrder.frameModel &&
                         f.color === workOrder.frameColor)
      );
      
      setEditData({
        frameBrand: workOrder.frameBrand || '',
        frameModel: workOrder.frameModel || '',
        frameColor: workOrder.frameColor || '',
        frameSize: workOrder.frameSize || '',
        framePrice: workOrder.framePrice || 0,
        lensType: typeof workOrder.lensType === 'object' && workOrder.lensType && 'name' in workOrder.lensType
          ? workOrder.lensType.name 
          : (workOrder.lensType as string) || '',
        lensPrice: workOrder.lensPrice || 0,
        coating: workOrder.coating || '',
        coatingPrice: workOrder.coatingPrice || 0,
        thickness: (workOrder as any).thickness || '',
        discount: workOrder.discount || 0,
        total: workOrder.total || 0,
      });
      
      if (patient?.rx) {
        setRxData({
          sphereOD: patient.rx.sphereOD || "—",
          cylOD: patient.rx.cylOD || "—",
          axisOD: patient.rx.axisOD || "—",
          addOD: patient.rx.addOD || "—",
          pdRight: patient.rx.pdRight || "—",
          
          sphereOS: patient.rx.sphereOS || "—",
          cylOS: patient.rx.cylOS || "—",
          axisOS: patient.rx.axisOS || "—",
          addOS: patient.rx.addOS || "—",
          pdLeft: patient.rx.pdLeft || "—",
        });
      }
      
      setOriginalTotal(originalInvoice?.total || workOrder.total || 0);
      setCurrentTotal(workOrder.total || 0);
    }
  }, [isOpen, workOrder, frames, patient, originalInvoice]);
  
  useEffect(() => {
    const newTotal = editData.framePrice + editData.lensPrice + editData.coatingPrice;
    setCurrentTotal(newTotal);
    setPriceDifference(newTotal - originalTotal);
  }, [editData, originalTotal]);
  
  useEffect(() => {
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
  
  const handleRxChange = (field: string, value: string) => {
    setRxData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
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
      
      // Create a note about price changes if any
      let editNote = "Order updated";
      if (priceDifference !== 0) {
        const formattedDiff = Math.abs(priceDifference).toFixed(3);
        editNote = priceDifference > 0 
          ? `Order updated with price increase of ${formattedDiff} KWD` 
          : `Order updated with price decrease of ${formattedDiff} KWD`;
      }
      
      const updatedWorkOrder: WorkOrder = {
        ...workOrder,
        frameBrand: editData.frameBrand,
        frameModel: editData.frameModel,
        frameColor: editData.frameColor,
        frameSize: editData.frameSize,
        framePrice: editData.framePrice,
        lensType: editData.lensType,
        lensPrice: editData.lensPrice,
        coating: editData.coating,
        coatingPrice: editData.coatingPrice,
        discount: editData.discount,
        total: newTotal,
        lastEditedAt: currentDateTime,
        thickness: editData.thickness, // Add thickness property
        editHistory: [
          ...(workOrder.editHistory || []),
          {
            timestamp: currentDateTime,
            notes: editNote
          }
        ]
      };
      
      if (updateWorkOrder) {
        const storeWorkOrder = {
          ...updatedWorkOrder,
          lensType: typeof editData.lensType === 'string' ? 
            { name: editData.lensType, price: editData.lensPrice } : 
            (typeof editData.lensType === 'object' && editData.lensType ? 
              editData.lensType : { name: "", price: 0 })
        };
        updateWorkOrder(storeWorkOrder);
      }
      
      // Update related invoice if it exists
      if (workOrder.invoiceId && originalInvoice) {
        const updatedInvoice = {
          ...originalInvoice,
          frameBrand: editData.frameBrand,
          frameModel: editData.frameModel,
          frameColor: editData.frameColor,
          frameSize: editData.frameSize,
          framePrice: editData.framePrice,
          lensType: editData.lensType,
          lensPrice: editData.lensPrice,
          coating: editData.coating,
          coatingPrice: editData.coatingPrice,
          discount: editData.discount,
          total: newTotal,
          lastEditedAt: currentDateTime,
          thickness: editData.thickness, // Add thickness property
          editHistory: [
            ...(originalInvoice.editHistory || []),
            {
              timestamp: currentDateTime,
              notes: editNote
            }
          ]
        };
        
        updateInvoice(updatedInvoice);
      }
      
      if (workOrder.patientId && editWorkOrder) {
        const workOrderEditData: PatientWorkOrderEdit = {
          patientId: workOrder.patientId,
          workOrderId: workOrder.workOrderId,
          updatedData: updatedWorkOrder,
        };
        
        editWorkOrder(workOrderEditData);
      }
      
      const successMessage = priceDifference !== 0
        ? language === 'ar' 
          ? `تم تحديث البيانات بنجاح. ${priceDifference > 0 ? 'زيادة' : 'نقص'} في السعر: ${Math.abs(priceDifference).toFixed(3)} د.ك`
          : `Order updated successfully. Price ${priceDifference > 0 ? 'increased' : 'decreased'} by ${Math.abs(priceDifference).toFixed(3)} KWD`
        : language === 'ar' ? "تم تحديث البيانات بنجاح" : "Order updated successfully";
      
      toast.success(successMessage);
      
      onClose();
      onSave(updatedWorkOrder);
    } catch (error) {
      console.error("Error updating work order:", error);
      toast.error(language === 'ar' ? "حدث خطأ أثناء التحديث" : "Error updating order");
    }
  };
  
  const renderPrescriptionTab = () => (
    <div className="grid gap-4 py-4">
      {patient && (
        <div className="mb-6 bg-primary/5 p-4 rounded-lg">
          <h3 className="text-primary font-medium mb-3 flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            {language === 'ar' ? "معلومات الوصفة الطبية" : "Prescription Information"}
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse ltr">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-2 border text-center">{t('eye')}</th>
                  <th className="p-2 border text-center">SPH</th>
                  <th className="p-2 border text-center">CYL</th>
                  <th className="p-2 border text-center">AXIS</th>
                  <th className="p-2 border text-center">ADD</th>
                  <th className="p-2 border text-center">PD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border font-bold text-center">{t('rightEyeAbbr')}</td>
                  <td className="p-2 border text-center">
                    <Input className="h-8 text-center" value={rxData.sphereOD} onChange={(e) => handleRxChange('sphereOD', e.target.value)} />
                  </td>
                  <td className="p-2 border text-center">
                    <Input className="h-8 text-center" value={rxData.cylOD} onChange={(e) => handleRxChange('cylOD', e.target.value)} />
                  </td>
                  <td className="p-2 border text-center">
                    <Input className="h-8 text-center" value={rxData.axisOD} onChange={(e) => handleRxChange('axisOD', e.target.value)} />
                  </td>
                  <td className="p-2 border text-center">
                    <Input className="h-8 text-center" value={rxData.addOD} onChange={(e) => handleRxChange('addOD', e.target.value)} />
                  </td>
                  <td className="p-2 border text-center">
                    <Input className="h-8 text-center" value={rxData.pdRight} onChange={(e) => handleRxChange('pdRight', e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border font-bold text-center">{t('leftEyeAbbr')}</td>
                  <td className="p-2 border text-center">
                    <Input className="h-8 text-center" value={rxData.sphereOS} onChange={(e) => handleRxChange('sphereOS', e.target.value)} />
                  </td>
                  <td className="p-2 border text-center">
                    <Input className="h-8 text-center" value={rxData.cylOS} onChange={(e) => handleRxChange('cylOS', e.target.value)} />
                  </td>
                  <td className="p-2 border text-center">
                    <Input className="h-8 text-center" value={rxData.axisOS} onChange={(e) => handleRxChange('axisOS', e.target.value)} />
                  </td>
                  <td className="p-2 border text-center">
                    <Input className="h-8 text-center" value={rxData.addOS} onChange={(e) => handleRxChange('addOS', e.target.value)} />
                  </td>
                  <td className="p-2 border text-center">
                    <Input className="h-8 text-center" value={rxData.pdLeft} onChange={(e) => handleRxChange('pdLeft', e.target.value)} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="bg-primary/5 p-4 rounded-lg mb-4">
            <h3 className="text-primary font-medium mb-2 flex items-center">
              <Glasses className="w-4 h-4 mr-2" />
              {language === 'ar' ? "معلومات العدسات" : "Lens Information"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="lensType">{language === 'ar' ? "نوع العدسة" : "Lens Type"}</Label>
                <Select 
                  value={editData.lensType} 
                  onValueChange={(value) => handleSelectChange('lensType', value)}
                >
                  <SelectTrigger id="lensType">
                    <SelectValue placeholder={language === 'ar' ? "اختر نوع العدسة" : "Select lens type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {lensTypes.map(lens => (
                      <SelectItem key={lens.id} value={lens.type}>
                        {language === 'ar' 
                          ? lens.name + ' - ' + (lens.price !== undefined ? lens.price.toFixed(3) : '0.000') + ' ' + t('kwd') 
                          : lens.name + ' - ' + (lens.price !== undefined ? lens.price.toFixed(3) : '0.000') + ' ' + t('kwd')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="lensPrice">{language === 'ar' ? "سعر العدسة" : "Lens Price"}</Label>
                <Input
                  id="lensPrice"
                  name="lensPrice"
                  type="number"
                  value={editData.lensPrice}
                  onChange={handleChange}
                  className="bg-muted/20"
                />
              </div>
              
              <div>
                <Label htmlFor="coating">{language === 'ar' ? "الطلاء" : "Coating"}</Label>
                <Select 
                  value={editData.coating} 
                  onValueChange={(value) => handleSelectChange('coating', value)}
                >
                  <SelectTrigger id="coating">
                    <SelectValue placeholder={language === 'ar' ? "اختر الطلاء" : "Select coating"} />
                  </SelectTrigger>
                  <SelectContent>
                    {lensCoatings.map(coating => (
                      <SelectItem key={coating.id} value={coating.name}>
                        {language === 'ar' 
                          ? coating.name + ' - ' + (coating.price !== undefined ? coating.price.toFixed(3) : '0.000') + ' ' + t('kwd') 
                          : coating.name + ' - ' + (coating.price !== undefined ? coating.price.toFixed(3) : '0.000') + ' ' + t('kwd')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="coatingPrice">{language === 'ar' ? "سعر الطلاء" : "Coating Price"}</Label>
                <Input
                  id="coatingPrice"
                  name="coatingPrice"
                  type="number"
                  value={editData.coatingPrice}
                  onChange={handleChange}
                  className="bg-muted/20"
                />
              </div>

              <div>
                <Label htmlFor="thickness">{language === 'ar' ? "سماكة العدسة" : "Lens Thickness"}</Label>
                <Select 
                  value={editData.thickness} 
                  onValueChange={(value) => setEditData(prev => ({...prev, thickness: value}))}
                >
                  <SelectTrigger id="thickness">
                    <SelectValue placeholder={language === 'ar' ? "اختر سماكة العدسة" : "Select lens thickness"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">
                      {language === 'ar' ? "قياسي" : "Standard"}
                    </SelectItem>
                    <SelectItem value="Thin">
                      {language === 'ar' ? "رقيق" : "Thin"}
                    </SelectItem>
                    <SelectItem value="Ultra-thin">
                      {language === 'ar' ? "رقيق جداً" : "Ultra-thin"}
                    </SelectItem>
                    <SelectItem value="Super-thin">
                      {language === 'ar' ? "فائق الرقة" : "Super-thin"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-primary/5 p-4 rounded-lg mb-4">
            <h3 className="text-primary font-medium mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 12C8 14.5 9 16 12 16C15 16 16 14.5 16 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {language === 'ar' ? "معلومات الإطار" : "Frame Information"}
            </h3>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Label>{language === 'ar' ? "بحث عن إطار" : "Frame Search"}</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 text-xs"
                  onClick={() => setUseManualFrameInput(!useManualFrameInput)}
                >
                  {useManualFrameInput 
                    ? (language === 'ar' ? "استخدام البحث" : "Use Search") 
                    : (language === 'ar' ? "إدخال يدوي" : "Manual Input")}
                </Button>
              </div>
              
              {!useManualFrameInput ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={language === 'ar' ? "ابحث عن الإطارات..." : "Search frames..."}
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
                          <div className="font-medium">{frame.price.toFixed(3)} {t('kwd')}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {frameSearchQuery && filteredFrames.length === 0 && (
                    <div className="text-center py-2 text-muted-foreground">
                      {language === 'ar' ? "لم يتم العثور على إطارات" : "No frames found"}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="frameBrand">{language === 'ar' ? "ماركة الإطار" : "Frame Brand"}</Label>
                    <Input
                      id="frameBrand"
                      name="frameBrand"
                      value={editData.frameBrand}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="frameModel">{language === 'ar' ? "موديل الإطار" : "Frame Model"}</Label>
                    <Input
                      id="frameModel"
                      name="frameModel"
                      value={editData.frameModel}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="frameColor">{language === 'ar' ? "لون الإطار" : "Frame Color"}</Label>
                    <Input
                      id="frameColor"
                      name="frameColor"
                      value={editData.frameColor}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="frameSize">{language === 'ar' ? "حجم الإطار" : "Frame Size"}</Label>
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
                <Label htmlFor="framePrice">{language === 'ar' ? "سعر الإطار" : "Frame Price"}</Label>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-primary/5 p-4 rounded-lg mb-4">
          <h3 className="text-primary font-medium mb-2">{language === 'ar' ? "ملخص الطلب" : "Order Summary"}</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount">{language === 'ar' ? "الخصم" : "Discount"}</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  value={editData.discount}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="total">{language === 'ar' ? "المجموع" : "Total"}</Label>
                <Input
                  id="total"
                  name="total"
                  type="number"
                  value={((editData.framePrice || 0) + (editData.lensPrice || 0) + (editData.coatingPrice || 0) - (editData.discount || 0)).toFixed(3)}
                  disabled
                  className="bg-primary/10 font-semibold"
                />
              </div>
            </div>
            
            {priceDifference !== 0 && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">
                      {language === 'ar' 
                        ? `تغيير في السعر: ${priceDifference > 0 ? '+' : ''}${priceDifference.toFixed(3)} د.ك`
                        : `Price change: ${priceDifference > 0 ? '+' : ''}${priceDifference.toFixed(3)} KWD`}
                    </p>
                    <p className="text-sm text-amber-700">
                      {priceDifference > 0 
                        ? (language === 'ar' ? "العميل سيدفع مبلغ إضافي" : "Customer will pay additional amount") 
                        : (language === 'ar' ? "العميل سيستلم مبلغ مسترد" : "Customer will receive a refund")}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {workOrder.editHistory && workOrder.editHistory.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {language === 'ar' ? "سجل التعديلات" : "Edit History"}
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
        
        <div className="bg-primary/5 p-4 rounded-lg mb-4">
          <h3 className="text-primary font-medium mb-2 flex items-center">
            <Calculator className="w-4 h-4 mr-2" />
            {language === 'ar' ? "ملخص التكلفة" : "Cost Summary"}
          </h3>
          
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center py-1 border-b">
              <span className="text-sm">{language === 'ar' ? "المبلغ الأصلي" : "Original Amount"}</span>
              <span className="font-medium">{(originalTotal || 0).toFixed(3)} {t('kwd')}</span>
            </div>
            
            <div className="flex justify-between items-center py-1 border-b">
              <span className="text-sm">{language === 'ar' ? "المبلغ الجديد" : "New Amount"}</span>
              <span className="font-medium">{(currentTotal || 0).toFixed(3)} {t('kwd')}</span>
            </div>
            
            <div className="flex justify-between items-center py-1 border-b">
              <span className="text-sm">{language === 'ar' ? "الخصم" : "Discount"}</span>
              <span className="font-medium">{(editData.discount || 0).toFixed(3)} {t('kwd')}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 mt-2 bg-primary/10 rounded p-2">
              <span className="font-medium">{language === 'ar' ? "الفرق" : "Difference"}</span>
              <span className={`font-bold ${priceDifference > 0 ? 'text-green-600' : priceDifference < 0 ? 'text-red-600' : ''}`}>
                {priceDifference > 0 ? '+' : ''}{(priceDifference || 0).toFixed(3)} {t('kwd')}
              </span>
            </div>
            
            {priceDifference !== 0 && (
              <Button 
                className="w-full mt-2"
                variant={priceDifference > 0 ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const message = priceDifference > 0
                    ? language === 'ar' 
                      ? `يجب إبلاغ العميل بدفع مبلغ إضافي قدره ${Math.abs(priceDifference).toFixed(3)} د.ك` 
                      : `Notify customer to pay additional ${Math.abs(priceDifference).toFixed(3)} KWD`
                    : language === 'ar'
                      ? `يجب إرجاع مبلغ للعميل قدره ${Math.abs(priceDifference).toFixed(3)} د.ك`
                      : `Issue refund of ${Math.abs(priceDifference).toFixed(3)} KWD to customer`;
                  
                  toast.info(message, {
                    duration: 5000,
                  });
                }}
              >
                {priceDifference > 0 
                  ? (language === 'ar' ? "إبلاغ العميل بالدفع" : "Notify Customer") 
                  : (language === 'ar' ? "إصدار استرداد" : "Issue Refund")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className={`${isRtl ? 'rtl' : 'ltr'}`}>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            {language === 'ar' ? "تعديل طلب العمل" : "Edit Work Order"}
          </h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prescription">
                <Glasses className="w-4 h-4 mr-2" />
                {language === 'ar' ? "الوصفة والمنتجات" : "Prescription & Products"}
              </TabsTrigger>
              <TabsTrigger value="summary">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {language === 'ar' ? "الملخص" : "Summary"}
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
            <Button variant="outline" onClick={onClose}>
              {language === 'ar' ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={handleSaveChanges} className="bg-primary">
              {language === 'ar' ? "حفظ التغييرات" : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
