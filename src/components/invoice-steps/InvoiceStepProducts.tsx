
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInvoiceForm } from "./InvoiceFormContext";
import { useInventoryStore, LensType, LensCoating } from "@/store/inventoryStore";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LensSelector } from "@/components/LensSelector";
import { ContactLensSelector, ContactLensSelection } from "@/components/ContactLensSelector";
import { 
  Search, Package, Plus, PackageCheck, Eye, Glasses
} from "lucide-react";

interface InvoiceStepProductsProps {
  invoiceType: "glasses" | "contacts";
}

export const InvoiceStepProducts: React.FC<InvoiceStepProductsProps> = ({ invoiceType }) => {
  const { t, language } = useLanguageStore();
  const searchFrames = useInventoryStore((state) => state.searchFrames);
  const addFrame = useInventoryStore((state) => state.addFrame);
  const { getValues, setValue } = useInvoiceForm();
  
  const [skipFrame, setSkipFrame] = useState(getValues<boolean>('skipFrame'));
  const [selectedLensType, setSelectedLensType] = useState<LensType | null>(null);
  const [selectedCoating, setSelectedCoating] = useState<LensCoating | null>(null);
  
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
  
  // Initialize from form values if they exist
  React.useEffect(() => {
    // If we have form values for frames, update the local state
    if (getValues<string>('frameBrand')) {
      setSelectedFrame({
        brand: getValues<string>('frameBrand'),
        model: getValues<string>('frameModel'),
        color: getValues<string>('frameColor'),
        size: getValues<string>('frameSize'),
        price: getValues<number>('framePrice')
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
    brand: getValues<string>('frameBrand') || "", 
    model: getValues<string>('frameModel') || "", 
    color: getValues<string>('frameColor') || "", 
    size: getValues<string>('frameSize') || "", 
    price: getValues<number>('framePrice') || 0 
  });
  
  const handleFrameSearch = () => {
    if (!frameSearch.trim()) {
      toast({
        title: t('error'),
        description: t('searchTermError'),
        variant: "destructive"
      });
      return;
    }
    
    const results = searchFrames(frameSearch);
    setFrameResults(results);
    
    if (results.length === 0) {
      toast({
        description: t('noFramesFound'),
      });
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
    
    // Update form values
    setValue('frameBrand', newFrame.brand);
    setValue('frameModel', newFrame.model);
    setValue('frameColor', newFrame.color);
    setValue('frameSize', newFrame.size);
    setValue('framePrice', newFrame.price);
  };
  
  const handleLensTypeSelect = (lens: LensType | null) => {
    setSelectedLensType(lens);
    setValue('lensType', lens?.name || '');
    setValue('lensPrice', lens?.price || 0);
  };
  
  const handleCoatingSelect = (coating: LensCoating | null) => {
    setSelectedCoating(coating);
    setValue('coating', coating?.name || '');
    setValue('coatingPrice', coating?.price || 0);
  };
  
  const handleSkipFrameChange = (skip: boolean) => {
    setSkipFrame(skip);
    setValue('skipFrame', skip);
  };
  
  const handleAddNewFrame = () => {
    if (!newBrand || !newModel || !newColor || !newPrice) {
      toast({
        title: t('error'),
        description: t('frameDetailsError'),
        variant: "destructive"
      });
      return;
    }
    
    const price = parseFloat(newPrice);
    const qty = parseInt(newQty);
    
    if (isNaN(price) || price <= 0) {
      toast({
        title: t('error'),
        description: t('priceError'),
        variant: "destructive"
      });
      return;
    }
    
    if (isNaN(qty) || qty <= 0) {
      toast({
        title: t('error'),
        description: t('quantityError'),
        variant: "destructive"
      });
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
    
    // Update form values
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
    
    toast({
      description: t('frameAddedSuccess'),
    });
  };
  
  const handleContactLensSelection = (selection: ContactLensSelection) => {
    if (selection.items) {
      setValue('contactLensItems', selection.items);
      
      if (selection.rxData) {
        setValue('contactLensRx', selection.rxData);
      }
      
      const lensesTotal = selection.items.reduce((sum, lens) => sum + lens.price, 0);
      setValue('total', lensesTotal - (getValues<number>('discount') || 0));
      setValue('remaining', Math.max(0, lensesTotal - (getValues<number>('discount') || 0) - (getValues<number>('deposit') || 0)));
      
      toast({
        description: `${t('contactLensesTotal')} (${selection.items.length} ${t('lensCount')})`,
      });
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      {invoiceType === "glasses" ? (
        <>
          <div className="border rounded-lg p-5 bg-card shadow-sm">
            <div className="flex justify-between items-center border-b border-primary/30 pb-3 mb-4">
              <h3 className={`text-lg font-semibold text-primary flex items-center gap-2 ${textAlignClass}`}>
                <Eye className="w-5 h-5" />
                {t('lensSection')}
              </h3>
            </div>
            
            <LensSelector 
              onSelectLensType={handleLensTypeSelect}
              onSelectCoating={handleCoatingSelect}
              skipLens={skipFrame}
              onSkipLensChange={handleSkipFrameChange}
              initialLensType={selectedLensType}
              initialCoating={selectedCoating}
            />
          </div>

          {!skipFrame && (
            <div className="border rounded-lg p-5 bg-card shadow-sm">
              <div className="border-b border-primary/30 pb-3 mb-4">
                <h3 className={`text-lg font-semibold text-primary flex items-center gap-2 ${textAlignClass}`}>
                  <Glasses className="w-5 h-5" />
                  {t('frameSection')}
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="frameSearchBox" className={`text-muted-foreground block ${textAlignClass}`}>{t('searchTerm')}</Label>
                  <div className={`flex ${language === 'ar' ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
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
                  <div className="mt-4 p-3 border rounded-lg bg-primary/5 border-primary/20">
                    <h4 className={`font-medium text-primary mb-2 flex items-center ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
                      <PackageCheck className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                      {t('selectedFrame')}
                    </h4>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
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
                          <td className={`p-1 ${textAlignClass}`}>{selectedFrame.price.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowManualFrame(!showManualFrame)}
                  className="w-full"
                >
                  <Plus className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                  {t('addFrameButton')}
                </Button>
                
                {showManualFrame && (
                  <div className="p-4 border rounded-lg mt-2 bg-muted/10">
                    <h4 className={`font-semibold mb-3 text-primary ${textAlignClass}`}>{t('newFrameDetails')}</h4>
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
                      <Button onClick={handleAddNewFrame} className="w-full">{t('saveFrame')}</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <ContactLensSelector 
          onSelect={handleContactLensSelection} 
          initialRxData={getValues<any>('contactLensRx')} 
        />
      )}
    </div>
  );
};
