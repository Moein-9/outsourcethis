
import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInvoiceForm } from "./InvoiceFormContext";
import { useInventoryStore, LensType, LensCoating, LensThickness } from "@/store/inventoryStore";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LensSelector } from "@/components/LensSelector";
import { ContactLensSelector, ContactLensSelection } from "@/components/ContactLensSelector";
import { 
  Search, Package, Plus, PackageCheck, Eye, Glasses, ScrollText, Check, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InvoiceStepProductsProps {
  invoiceType: "glasses" | "contacts" | "exam";
}

export const InvoiceStepProducts: React.FC<InvoiceStepProductsProps> = ({ invoiceType }) => {
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  const searchFrames = useInventoryStore((state) => state.searchFrames);
  const addFrame = useInventoryStore((state) => state.addFrame);
  const getServicesByCategory = useInventoryStore((state) => state.getServicesByCategory);
  const { getValues, setValue, updateServicePrice } = useInvoiceForm();
  
  const [eyeExamService, setEyeExamService] = useState(() => {
    const examServices = getServicesByCategory("exam");
    return examServices.length > 0 ? examServices[0] : null;
  });
  
  useEffect(() => {
    const examServices = getServicesByCategory("exam");
    if (examServices.length > 0) {
      setEyeExamService(examServices[0]);
    }
  }, [getServicesByCategory]);
  
  const [skipFrame, setSkipFrame] = useState(getValues('skipFrame'));
  const [selectedLensType, setSelectedLensType] = useState<LensType | null>(null);
  const [selectedCoating, setSelectedCoating] = useState<LensCoating | null>(null);
  const [selectedThickness, setSelectedThickness] = useState<LensThickness | null>(null);
  const [combinedLensPrice, setCombinedLensPrice] = useState<number | null>(null);
  
  const [frameSearch, setFrameSearch] = useState("");
  const [frameResults, setFrameResults] = useState<ReturnType<typeof searchFrames>>([]);
  
  const [showManualFrame, setShowManualFrame] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newQty, setNewQty] = useState("1");
  
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  
  React.useEffect(() => {
    if (getValues('frameBrand')) {
      setSelectedFrame({
        brand: getValues('frameBrand') as string,
        model: getValues('frameModel') as string,
        color: getValues('frameColor') as string,
        size: getValues('frameSize') as string,
        price: getValues('framePrice') as number
      });
    }
  }, []);
  
  const [selectedFrame, setSelectedFrame] = useState<{
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  }>({ 
    brand: getValues('frameBrand') as string || "", 
    model: getValues('frameModel') as string || "", 
    color: getValues('frameColor') as string || "", 
    size: getValues('frameSize') as string || "", 
    price: getValues('framePrice') as number || 0 
  });
  
  const [rxFormatted, setRxFormatted] = useState<any>(null);
  
  useEffect(() => {
    const rxData = getValues('rx');
    if (rxData) {
      const formattedRx = {
        ...rxData,
        addOD: rxData.addOD || '',
        addOS: rxData.addOS || ''
      };
      
      if (formattedRx.addOD === '-') formattedRx.addOD = '';
      if (formattedRx.addOS === '-') formattedRx.addOS = '';
      
      setRxFormatted(formattedRx);
    }
  }, [getValues]);
  
  const handleFrameSearch = () => {
    if (!frameSearch.trim()) {
      toast(t('searchTermError'));
      return;
    }
    
    const results = searchFrames(frameSearch);
    setFrameResults(results);
    
    if (results.length === 0) {
      toast(t('noFramesFound'));
    }
  };
  
  const selectFrame = (frame: ReturnType<typeof searchFrames>[0]) => {
    const newFrame = {
      brand: frame.brand,
      model: frame.model,
      color: frame.color,
      size: frame.size,
      price: frame.price
    };
    
    setSelectedFrame(newFrame);
    setFrameResults([]);
    
    setValue('frameBrand', newFrame.brand);
    setValue('frameModel', newFrame.model);
    setValue('frameColor', newFrame.color);
    setValue('frameSize', newFrame.size);
    setValue('framePrice', newFrame.price);
  };
  
  const getLensPrice = (lens: LensType | null): number => {
    return lens?.price !== undefined ? lens.price : 0;
  };
  
  const handleLensTypeSelect = (lens: LensType | null) => {
    setSelectedLensType(lens);
    setValue('lensType', lens?.name || '');
    
    if (lens?.price !== undefined) {
      setValue('lensPrice', lens.price);
    } else {
      setValue('lensPrice', 0);
    }
    
    if (!lens) {
      setCombinedLensPrice(null);
    }
  };
  
  const handleCoatingSelect = (coating: LensCoating | null) => {
    setSelectedCoating(coating);
    setValue('coating', coating?.name || '');
    
    if (coating?.price !== undefined) {
      setValue('coatingPrice', coating.price);
    } else {
      setValue('coatingPrice', 0);
    }
  };
  
  const handleThicknessSelect = (thickness: LensThickness | null) => {
    setSelectedThickness(thickness);
    setValue('thickness', thickness?.name || '');
    
    if (thickness?.price !== undefined) {
      setValue('thicknessPrice', thickness.price);
    } else {
      setValue('thicknessPrice', 0);
    }
  };
  
  const handleCombinationPriceChange = (price: number | null) => {
    setCombinedLensPrice(price);
    
    if (price !== null) {
      setValue('lensCombinationPrice', price);
      toast(
        `${t('combinationPriceFound')}: ${price.toFixed(3)} ${t('kwd')}`,
        { description: t('usingCombinedPrice') }
      );
    } else {
      setValue('lensCombinationPrice', null);
    }
  };
  
  const handleSkipFrameChange = (skip: boolean) => {
    setSkipFrame(skip);
    setValue('skipFrame', skip);
  };
  
  const handleAddNewFrame = () => {
    if (!newBrand || !newModel || !newColor || !newPrice) {
      toast(t('frameDetailsError'));
      return;
    }
    
    const price = parseFloat(newPrice);
    const qty = parseInt(newQty);
    
    if (isNaN(price) || price <= 0) {
      toast(t('priceError'));
      return;
    }
    
    if (isNaN(qty) || qty <= 0) {
      toast(t('quantityError'));
      return;
    }
    
    addFrame({
      brand: newBrand,
      model: newModel,
      color: newColor,
      size: newSize,
      price,
      qty
    });
    
    const newFrameData = {
      brand: newBrand,
      model: newModel,
      color: newColor,
      size: newSize,
      price
    };
    
    setSelectedFrame(newFrameData);
    
    setValue('frameBrand', newFrameData.brand);
    setValue('frameModel', newFrameData.model);
    setValue('frameColor', newFrameData.color);
    setValue('frameSize', newFrameData.size);
    setValue('framePrice', newFrameData.price);
    
    setShowManualFrame(false);
    setNewBrand("");
    setNewModel("");
    setNewColor("");
    setNewSize("");
    setNewPrice("");
    setNewQty("1");
    
    toast(t('frameAddedSuccess'));
  };
  
  const handleContactLensSelection = (selection: ContactLensSelection) => {
    if (selection.items) {
      const itemsWithQuantities = selection.items.map(item => ({
        ...item,
        qty: selection.quantities?.[item.id] || 1
      }));
      
      setValue('contactLensItems', itemsWithQuantities);
      
      if (selection.rxData) {
        setValue('contactLensRx', selection.rxData);
      }
      
      const lensesTotal = itemsWithQuantities.reduce((sum, lens) => 
        sum + (lens.price * (lens.qty || 1)), 0
      );
      
      setValue('total', lensesTotal - (getValues<number>('discount') || 0));
      setValue('remaining', Math.max(0, lensesTotal - (getValues<number>('discount') || 0) - (getValues<number>('deposit') || 0)));
      
      const totalLensCount = itemsWithQuantities.reduce((count, lens) => count + (lens.qty || 1), 0);
      
      toast(`${t('contactLensesTotal')} (${totalLensCount} ${t('lensCount')})`);
    }
  };
  
  useEffect(() => {
    if (invoiceType === 'glasses' && !skipFrame) {
      let totalLensPrice = 0;
      
      if (combinedLensPrice !== null) {
        totalLensPrice = combinedLensPrice;
        
        setValue('lensPrice', combinedLensPrice);
        setValue('coatingPrice', 0);
        setValue('thicknessPrice', 0);
      } else {
        const lensPrice = selectedLensType?.price || 0;
        const coatingPrice = selectedCoating?.price || 0;
        const thicknessPrice = selectedThickness?.price || 0;
        
        totalLensPrice = lensPrice + coatingPrice + thicknessPrice;
        
        setValue('lensPrice', lensPrice);
        setValue('coatingPrice', coatingPrice);
        setValue('thicknessPrice', thicknessPrice);
      }
      
      const framePrice = selectedFrame.price || 0;
      const totalPrice = totalLensPrice + framePrice;
      
      setValue('total', totalPrice - (getValues<number>('discount') || 0));
      setValue('remaining', Math.max(0, totalPrice - (getValues<number>('discount') || 0) - (getValues<number>('deposit') || 0)));
    }
  }, [selectedLensType, selectedCoating, selectedThickness, combinedLensPrice, skipFrame, selectedFrame.price, setValue, getValues, invoiceType]);
  
  if (invoiceType === "exam") {
    if (!eyeExamService) {
      return (
        <div className="space-y-6 animate-fade-in">
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary/10">
              <CardTitle className={`text-lg flex items-center gap-2 ${textAlignClass}`}>
                <ScrollText className="w-5 h-5 text-primary" />
                {t('eyeExam')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center p-4">
                <p className="text-muted-foreground">
                  {t('noExamServiceFound')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-primary/10">
            <CardTitle className={`text-lg flex items-center gap-2 ${textAlignClass}`}>
              <ScrollText className="w-5 h-5 text-primary" />
              {isRtl ? "فحص العين" : "Eye Exam"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <ScrollText className="w-5 h-5 text-primary" />
                  {isRtl ? "فحص العين" : "Eye Exam"}
                </div>
                <div className="font-semibold text-lg">
                  {eyeExamService.price.toFixed(3)} {isRtl ? 'د.ك' : 'KWD'}
                </div>
              </div>
              
              <p className={`mt-4 text-muted-foreground text-sm ${textAlignClass}`}>
                {isRtl 
                  ? "خدمة فحص العين القياسية لتقييم صحة العين والرؤية." 
                  : "Standard eye examination service to evaluate eye health and vision."}
              </p>
            </div>
            
            <div className="mt-6 flex items-center justify-center">
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md flex items-center gap-2">
                <Check className="w-4 h-4" />
                {isRtl ? "السعر: " : "Price: "} {eyeExamService.price.toFixed(3)} {isRtl ? 'د.ك' : 'KWD'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {invoiceType === "glasses" ? (
        <>
          <Card className="border shadow-sm">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-violet-100/50 border-b">
              <CardTitle className={`text-base flex justify-between items-center`}>
                <span className="flex items-center gap-2 text-violet-800">
                  <Eye className="w-4 h-4 text-violet-600" />
                  {t('lensSection')}
                </span>
                
                {combinedLensPrice !== null && (
                  <Badge 
                    className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 font-medium flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {t('combinedPrice')}: {combinedLensPrice.toFixed(3)} {t('kwd')}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <LensSelector 
                onSelectLensType={handleLensTypeSelect}
                onSelectCoating={handleCoatingSelect}
                onSelectThickness={handleThicknessSelect}
                skipLens={skipFrame}
                onSkipLensChange={handleSkipFrameChange}
                initialLensType={selectedLensType}
                initialCoating={selectedCoating}
                initialThickness={selectedThickness}
                rx={rxFormatted || getValues('rx')}
                onCombinationPriceChange={handleCombinationPriceChange}
              />
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-b">
              <CardTitle className={`text-base flex items-center gap-2 text-amber-800`}>
                <Glasses className="w-4 h-4 text-amber-600" />
                {t('frameSection')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="frameSearchBox" className={`text-muted-foreground block ${textAlignClass}`}>{t('searchTerm')}</Label>
                  <div className={`flex ${dirClass === 'rtl' ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                    <Input
                      id="frameSearchBox"
                      value={frameSearch}
                      onChange={(e) => setFrameSearch(e.target.value)}
                      placeholder={t('searchExample')}
                      className={`flex-1 ${textAlignClass}`}
                    />
                    <Button onClick={handleFrameSearch} className="gap-1">
                      <Search className="w-4 h-4" />
                      {t('search')}
                    </Button>
                  </div>
                </div>
                
                {frameResults.length > 0 && (
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="p-2 border">{t('brand')}</th>
                          <th className="p-2 border">{t('model')}</th>
                          <th className="p-2 border">{t('color')}</th>
                          <th className="p-2 border">{t('size')}</th>
                          <th className="p-2 border">{t('price')} ({t('kwd')})</th>
                          <th className="p-2 border">{t('quantity')}</th>
                          <th className="p-2 border"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {frameResults.map((frame, index) => (
                          <tr 
                            key={index}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <td className="p-2 border">{frame.brand}</td>
                            <td className="p-2 border">{frame.model}</td>
                            <td className="p-2 border">{frame.color}</td>
                            <td className="p-2 border">{frame.size}</td>
                            <td className="p-2 border">{frame.price.toFixed(2)}</td>
                            <td className="p-2 border">{frame.qty}</td>
                            <td className="p-2 border">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => selectFrame(frame)}
                                className="w-full"
                              >
                                <Plus className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                                {t('choose')}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {selectedFrame.brand && (
                  <div className="mt-4 p-3 border rounded-lg bg-amber-50/50 border-amber-200/70">
                    <h4 className={`font-medium text-amber-800 mb-2 flex items-center ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
                      <PackageCheck className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-amber-600`} />
                      {t('selectedFrame')}
                    </h4>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-amber-200/50">
                          <th className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}>{t('brand')}</th>
                          <th className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}>{t('model')}</th>
                          <th className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}>{t('color')}</th>
                          <th className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}>{t('size')}</th>
                          <th className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}>{t('price')} ({t('kwd')})</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className={`p-1 ${textAlignClass}`}>{selectedFrame.brand}</td>
                          <td className={`p-1 ${textAlignClass}`}>{selectedFrame.model}</td>
                          <td className={`p-1 ${textAlignClass}`}>{selectedFrame.color}</td>
                          <td className={`p-1 ${textAlignClass}`}>{selectedFrame.size}</td>
                          <td className={`p-1 ${textAlignClass} font-medium`}>{selectedFrame.price.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowManualFrame(!showManualFrame)}
                  className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
                >
                  <Plus className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                  {t('addFrameButton')}
                </Button>
                
                {showManualFrame && (
                  <div className="p-4 border rounded-lg mt-2 bg-amber-50/30 border-amber-200/50">
                    <h4 className={`font-semibold mb-3 text-amber-800 ${textAlignClass}`}>{t('newFrameDetails')}</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="newBrand" className="text-muted-foreground">{t('brand')}:</Label>
                          <Input
                            id="newBrand"
                            value={newBrand}
                            onChange={(e) => setNewBrand(e.target.value)}
                            className={textAlignClass}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="newModel" className="text-muted-foreground">{t('model')}:</Label>
                          <Input
                            id="newModel"
                            value={newModel}
                            onChange={(e) => setNewModel(e.target.value)}
                            className={textAlignClass}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="newColor" className="text-muted-foreground">{t('color')}:</Label>
                          <Input
                            id="newColor"
                            value={newColor}
                            onChange={(e) => setNewColor(e.target.value)}
                            className={textAlignClass}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="newSize" className="text-muted-foreground">{t('size')}:</Label>
                          <Input
                            id="newSize"
                            value={newSize}
                            onChange={(e) => setNewSize(e.target.value)}
                            placeholder={t('searchExample')}
                            className={textAlignClass}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="newPrice" className="text-muted-foreground">{t('price')} ({t('kwd')}):</Label>
                          <Input
                            id="newPrice"
                            type="number"
                            step="0.01"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className={textAlignClass}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="newQty" className="text-muted-foreground">{t('quantity')} ({t('pieces')}):</Label>
                          <Input
                            id="newQty"
                            type="number"
                            step="1"
                            value={newQty}
                            onChange={(e) => setNewQty(e.target.value)}
                            className={textAlignClass}
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={handleAddNewFrame} 
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        {t('saveFrame')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <ContactLensSelector 
          onSelect={handleContactLensSelection} 
          initialRxData={getValues('contactLensRx')} 
        />
      )}
    </div>
  );
};
