
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInvoiceStore } from "@/store/invoiceStore";
import { usePatientStore } from "@/store/patientStore";
import { useLanguageStore } from "@/store/languageStore";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventoryStore } from "@/store/inventoryStore";
import { Search, Edit, Clock, Glasses, CheckCircle2, BarChart2, Pencil, RefreshCw, Calculator } from "lucide-react";
import { Frame, WorkOrder, LensType, LensCoating } from "@/types/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const { editWorkOrder } = usePatientStore();
  const { lensTypes, lensCoatings } = useInventoryStore();
  const isRtl = language === 'ar';
  const [activeTab, setActiveTab] = useState('prescription');
  
  // Get frames from the store, but convert them to the Frame type
  const storeFrames = useInventoryStore(state => state.frames);
  
  // Convert FrameItem[] to Frame[]
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
  
  // Initialize the rx object if it doesn't exist
  const initialRx = workOrder.rx || {
    right: { sphere: '', cylinder: '', axis: '', add: '', pd: '' },
    left: { sphere: '', cylinder: '', axis: '', add: '', pd: '' }
  };
  
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
    rx: initialRx
  });
  
  // Financial summary state
  const [financialSummary, setFinancialSummary] = useState({
    originalTotal: workOrder.total || 0,
    newTotal: workOrder.total || 0,
    difference: 0,
    originalPaid: workOrder.deposit || 0,
    remainingToPay: 0
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
      
      // Initialize the rx object if it doesn't exist
      const initialRx = workOrder.rx || {
        right: { sphere: '', cylinder: '', axis: '', add: '', pd: '' },
        left: { sphere: '', cylinder: '', axis: '', add: '', pd: '' }
      };
      
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
        rx: initialRx
      });
      
      // Initialize financial summary
      setFinancialSummary({
        originalTotal: workOrder.total || 0,
        newTotal: workOrder.total || 0,
        difference: 0,
        originalPaid: workOrder.deposit || 0,
        remainingToPay: (workOrder.total || 0) - (workOrder.deposit || 0)
      });
    }
  }, [isOpen, workOrder, frames]);
  
  useEffect(() => {
    // Calculate new total based on current edit data
    const newSubtotal = editData.framePrice + editData.lensPrice + editData.coatingPrice;
    const newTotalAmount = Math.max(0, newSubtotal - editData.discount);
    
    setEditData(prev => ({
      ...prev,
      total: newTotalAmount
    }));
    
    // Update financial summary
    setFinancialSummary(prev => ({
      ...prev,
      newTotal: newTotalAmount,
      difference: newTotalAmount - prev.originalTotal,
      remainingToPay: Math.max(0, newTotalAmount - prev.originalPaid)
    }));
  }, [editData.framePrice, editData.lensPrice, editData.coatingPrice, editData.discount]);
  
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
  
  const handleRxChange = (eye: 'right' | 'left', field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      rx: {
        ...prev.rx,
        [eye]: {
          ...prev.rx[eye],
          [field]: value
        }
      }
    }));
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
          lensPrice: selectedLens.price
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
      
      const updatedWorkOrder: WorkOrder = {
        ...workOrder,
        ...editData,
        total: newTotal,
        rx: editData.rx,
        // Add edit history information
        lastEditedAt: currentDateTime,
        editHistory: [
          ...(workOrder.editHistory || []),
          {
            timestamp: currentDateTime,
            notes: language === 'ar' ? "تم تحديث الطلب" : "Order updated"
          }
        ]
      };
      
      onSave(updatedWorkOrder);
      onClose();
      
      toast.success(language === 'ar' ? "تم تحديث البيانات بنجاح" : "Successfully updated");
    } catch (error) {
      console.error("Error updating work order:", error);
      toast.error(language === 'ar' ? "حدث خطأ أثناء التحديث" : "Error updating");
    }
  };
  
  const renderRxTab = () => (
    <div className="grid gap-4 py-4">
      <div className="bg-primary/5 p-4 rounded-lg">
        <h3 className="text-primary font-medium mb-4 flex items-center">
          <Glasses className="w-4 h-4 mr-2" />
          {language === 'ar' ? "الوصفة الطبية" : "Prescription Information"}
        </h3>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{language === 'ar' ? "العين" : "Eye"}</TableHead>
              <TableHead>{language === 'ar' ? "المجال" : "Sphere (SPH)"}</TableHead>
              <TableHead>{language === 'ar' ? "الاسطوانة" : "Cylinder (CYL)"}</TableHead>
              <TableHead>{language === 'ar' ? "المحور" : "Axis"}</TableHead>
              <TableHead>{language === 'ar' ? "الإضافة" : "Addition (ADD)"}</TableHead>
              <TableHead>{language === 'ar' ? "المسافة البؤبؤية" : "PD"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                {language === 'ar' ? "اليمنى" : "Right (OD)"}
              </TableCell>
              <TableCell>
                <Input 
                  value={editData.rx?.right?.sphere || ''}
                  onChange={(e) => handleRxChange('right', 'sphere', e.target.value)}
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={editData.rx?.right?.cylinder || ''}
                  onChange={(e) => handleRxChange('right', 'cylinder', e.target.value)}
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={editData.rx?.right?.axis || ''}
                  onChange={(e) => handleRxChange('right', 'axis', e.target.value)}
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={editData.rx?.right?.add || ''}
                  onChange={(e) => handleRxChange('right', 'add', e.target.value)}
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={editData.rx?.right?.pd || ''}
                  onChange={(e) => handleRxChange('right', 'pd', e.target.value)}
                  className="w-full"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                {language === 'ar' ? "اليسرى" : "Left (OS)"}
              </TableCell>
              <TableCell>
                <Input 
                  value={editData.rx?.left?.sphere || ''}
                  onChange={(e) => handleRxChange('left', 'sphere', e.target.value)}
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={editData.rx?.left?.cylinder || ''}
                  onChange={(e) => handleRxChange('left', 'cylinder', e.target.value)}
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={editData.rx?.left?.axis || ''}
                  onChange={(e) => handleRxChange('left', 'axis', e.target.value)}
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={editData.rx?.left?.add || ''}
                  onChange={(e) => handleRxChange('left', 'add', e.target.value)}
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={editData.rx?.left?.pd || ''}
                  onChange={(e) => handleRxChange('left', 'pd', e.target.value)}
                  className="w-full"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
  
  const renderLensTab = () => (
    <div className="grid gap-4 py-4">
      <div className="bg-primary/5 p-4 rounded-lg">
        <h3 className="text-primary font-medium mb-4 flex items-center">
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
                <SelectValue placeholder={language === 'ar' ? "اختر نوع العدسة" : "Select Lens Type"} />
              </SelectTrigger>
              <SelectContent>
                {lensTypes.map(lens => (
                  <SelectItem key={lens.id} value={lens.type}>
                    {language === 'ar' ? lens.name : lens.type.charAt(0).toUpperCase() + lens.type.slice(1)}
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
              readOnly
              className="bg-muted"
            />
          </div>
          
          <div>
            <Label htmlFor="coating">{language === 'ar' ? "طلاء العدسة" : "Lens Coating"}</Label>
            <Select 
              value={editData.coating} 
              onValueChange={(value) => handleSelectChange('coating', value)}
            >
              <SelectTrigger id="coating">
                <SelectValue placeholder={language === 'ar' ? "اختر طلاء العدسة" : "Select Coating"} />
              </SelectTrigger>
              <SelectContent>
                {lensCoatings.map(coating => (
                  <SelectItem key={coating.id} value={coating.name}>
                    {coating.name}
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
              readOnly
              className="bg-muted"
            />
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderFrameTab = () => (
    <div className="grid gap-4 py-4">
      <div className="bg-primary/5 p-4 rounded-lg">
        <h3 className="text-primary font-medium mb-4 flex items-center">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 12C8 14.5 9 16 12 16C15 16 16 14.5 16 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {language === 'ar' ? "معلومات الإطار" : "Frame Information"}
        </h3>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <Label>{language === 'ar' ? "بحث الإطار" : "Frame Search"}</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-xs flex items-center"
              onClick={() => setUseManualFrameInput(!useManualFrameInput)}
            >
              {useManualFrameInput ? 
                <span className="flex items-center">
                  <Search className="w-3.5 h-3.5 mr-1" />
                  {language === 'ar' ? "استخدام البحث" : "Use Search"}
                </span> : 
                <span className="flex items-center">
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  {language === 'ar' ? "إدخال يدوي" : "Manual Input"}
                </span>
              }
            </Button>
          </div>
          
          {!useManualFrameInput ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={language === 'ar' ? "البحث عن إطارات..." : "Search frames..."}
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
                      <div className="font-medium">{frame.price.toFixed(2)} {language === 'ar' ? "د.ك" : "KWD"}</div>
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
              readOnly={!useManualFrameInput && selectedFrame !== null}
              className={!useManualFrameInput && selectedFrame !== null ? "bg-muted" : ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderSummaryTab = () => (
    <div className="grid gap-4 py-4">
      <div className="bg-primary/5 p-4 rounded-lg mb-4">
        <h3 className="text-primary font-medium mb-4 flex items-center">
          <BarChart2 className="w-4 h-4 mr-2" />
          {language === 'ar' ? "ملخص الطلب" : "Order Summary"}
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Calculator className="w-4 h-4 mr-1.5" />
                    {language === 'ar' ? "تفاصيل الأسعار" : "Price Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? "سعر الإطار" : "Frame Price"}:</span>
                      <span>{editData.framePrice.toFixed(2)} {language === 'ar' ? "د.ك" : "KWD"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? "سعر العدسة" : "Lens Price"}:</span>
                      <span>{editData.lensPrice.toFixed(2)} {language === 'ar' ? "د.ك" : "KWD"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? "سعر الطلاء" : "Coating Price"}:</span>
                      <span>{editData.coatingPrice.toFixed(2)} {language === 'ar' ? "د.ك" : "KWD"}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>{language === 'ar' ? "المجموع الفرعي" : "Subtotal"}:</span>
                      <span>{(editData.framePrice + editData.lensPrice + editData.coatingPrice).toFixed(2)} {language === 'ar' ? "د.ك" : "KWD"}</span>
                    </div>
                    <div className="flex justify-between text-red-500">
                      <span>{language === 'ar' ? "الخصم" : "Discount"}:</span>
                      <span>-{editData.discount.toFixed(2)} {language === 'ar' ? "د.ك" : "KWD"}</span>
                    </div>
                    <div className="flex justify-between pt-1 font-bold border-t">
                      <span>{language === 'ar' ? "المجموع" : "Total"}:</span>
                      <span>{editData.total.toFixed(2)} {language === 'ar' ? "د.ك" : "KWD"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <RefreshCw className="w-4 h-4 mr-1.5" />
                    {language === 'ar' ? "التغييرات المالية" : "Financial Changes"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? "السعر الأصلي" : "Original Price"}:</span>
                      <span>{financialSummary.originalTotal.toFixed(2)} {language === 'ar' ? "د.ك" : "KWD"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? "السعر الجديد" : "New Price"}:</span>
                      <span>{financialSummary.newTotal.toFixed(2)} {language === 'ar' ? "د.ك" : "KWD"}</span>
                    </div>
                    <div className={`flex justify-between font-medium ${financialSummary.difference > 0 ? 'text-red-500' : financialSummary.difference < 0 ? 'text-green-500' : ''}`}>
                      <span>{language === 'ar' ? "الفرق" : "Difference"}:</span>
                      <span>{financialSummary.difference > 0 ? '+' : ''}{financialSummary.difference.toFixed(2)} {language === 'ar' ? "د.ك" : "KWD"}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t">
                      <span>{language === 'ar' ? "المدفوع" : "Already Paid"}:</span>
                      <span>{financialSummary.originalPaid.toFixed(2)} {language === 'ar' ? "د.ك" : "KWD"}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>{language === 'ar' ? "المتبقي للدفع" : "Remaining to Pay"}:</span>
                      <span>{financialSummary.remainingToPay.toFixed(2)} {language === 'ar' ? "د.ك" : "KWD"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
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
          
          {workOrder.editHistory && workOrder.editHistory.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {language === 'ar' ? "تاريخ التعديلات" : "Edit History"}
              </h4>
              <div className="text-sm text-muted-foreground space-y-1 max-h-32 overflow-y-auto border rounded-md p-2">
                {workOrder.editHistory.map((edit, index) => (
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className={`${isRtl ? 'rtl' : 'ltr'}`}>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            {language === 'ar' ? "تعديل طلب العمل" : "Edit Work Order"}
          </h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="rx">
                <Glasses className="w-4 h-4 mr-2" />
                {language === 'ar' ? "الوصفة الطبية" : "RX"}
              </TabsTrigger>
              <TabsTrigger value="lens">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
                {language === 'ar' ? "العدسات" : "Lens"}
              </TabsTrigger>
              <TabsTrigger value="frame">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16v16H4z" />
                </svg>
                {language === 'ar' ? "الإطار" : "Frame"}
              </TabsTrigger>
              <TabsTrigger value="summary">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {language === 'ar' ? "الملخص" : "Summary"}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="rx">
              {renderRxTab()}
            </TabsContent>
            
            <TabsContent value="lens">
              {renderLensTab()}
            </TabsContent>
            
            <TabsContent value="frame">
              {renderFrameTab()}
            </TabsContent>
            
            <TabsContent value="summary">
              {renderSummaryTab()}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              {language === 'ar' ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={handleSaveChanges}>
              {language === 'ar' ? "حفظ" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
