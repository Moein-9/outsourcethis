
import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInvoiceForm } from "./InvoiceFormContext";
import { useInventoryStore, LensType, LensCoating, LensThickness } from "@/store/inventoryStore";
import { ContactLensSelector, ContactLensSelection } from "@/components/ContactLensSelector";
import { toast } from "sonner";

// Import our newly created components
import { EyeExamSection } from "./EyeExamSection";
import { LensSection } from "./LensSection";
import { FrameSection } from "./FrameSection";

interface InvoiceStepProductsProps {
  invoiceType: "glasses" | "contacts" | "exam";
}

export const InvoiceStepProducts: React.FC<InvoiceStepProductsProps> = ({ invoiceType }) => {
  const { t } = useLanguageStore();
  const { getValues, setValue, updateServicePrice } = useInvoiceForm();
  const getServicesByCategory = useInventoryStore((state) => state.getServicesByCategory);
  
  const [eyeExamService, setEyeExamService] = useState(() => {
    const examServices = getServicesByCategory("exam");
    return examServices.length > 0 ? examServices[0] : null;
  });
  
  useEffect(() => {
    if (invoiceType === 'exam' && eyeExamService) {
      setValue('serviceName', eyeExamService.name);
      setValue('serviceId', eyeExamService.id);
      setValue('serviceDescription', eyeExamService.description || '');
      updateServicePrice(eyeExamService.price);
    }
  }, [invoiceType, eyeExamService, setValue, updateServicePrice]);
  
  const [skipFrame, setSkipFrame] = useState(getValues('skipFrame'));
  const [selectedLensType, setSelectedLensType] = useState<LensType | null>(null);
  const [selectedCoating, setSelectedCoating] = useState<LensCoating | null>(null);
  const [selectedThickness, setSelectedThickness] = useState<LensThickness | null>(null);
  const [combinedLensPrice, setCombinedLensPrice] = useState<number | null>(null);
  const [coatingColor, setCoatingColor] = useState(getValues('coatingColor') || "");
  
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
    if (getValues('frameBrand')) {
      setSelectedFrame({
        brand: getValues('frameBrand') as string,
        model: getValues('frameModel') as string,
        color: getValues('frameColor') as string,
        size: getValues('frameSize') as string,
        price: getValues('framePrice') as number
      });
    }
    
    // Load saved coating color if any
    if (getValues('coatingColor')) {
      setCoatingColor(getValues('coatingColor'));
    }
  }, [getValues]);
  
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
  
  const handleFrameSelected = (frame: typeof selectedFrame) => {
    setSelectedFrame(frame);
    
    setValue('frameBrand', frame.brand);
    setValue('frameModel', frame.model);
    setValue('frameColor', frame.color);
    setValue('frameSize', frame.size);
    setValue('framePrice', frame.price);
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
    
    // Reset coating color if changing coatings or if not photochromic
    if (!coating?.isPhotochromic) {
      setCoatingColor("");
      setValue('coatingColor', "");
    }
    
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
  
  const handleCoatingColorChange = (color: string) => {
    setCoatingColor(color);
    setValue('coatingColor', color);
  };
  
  const handleCombinationPriceChange = (price: number | null) => {
    setCombinedLensPrice(price);
    
    if (price !== null) {
      setValue('lensCombinationPrice', price);
    } else {
      setValue('lensCombinationPrice', null);
    }
  };
  
  const handleSkipFrameChange = (skip: boolean) => {
    setSkipFrame(skip);
    setValue('skipFrame', skip);
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
      
      const discount = getValues('discount') as number || 0;
      setValue('total', lensesTotal - discount);
      setValue('remaining', Math.max(0, lensesTotal - discount - (getValues('deposit') as number || 0)));
      
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
      const discount = getValues('discount') as number || 0;
      
      setValue('total', totalPrice - discount);
      setValue('remaining', Math.max(0, totalPrice - discount - (getValues('deposit') as number || 0)));
    }
  }, [selectedLensType, selectedCoating, selectedThickness, combinedLensPrice, skipFrame, selectedFrame.price, setValue, getValues, invoiceType]);

  if (invoiceType === "exam") {
    return <EyeExamSection examService={eyeExamService} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {invoiceType === "glasses" ? (
        <>
          <LensSection
            selectedLensType={selectedLensType}
            selectedCoating={selectedCoating}
            selectedThickness={selectedThickness}
            skipFrame={skipFrame}
            onLensTypeSelect={handleLensTypeSelect}
            onCoatingSelect={handleCoatingSelect}
            onThicknessSelect={handleThicknessSelect}
            onSkipFrameChange={handleSkipFrameChange}
            onCombinationPriceChange={handleCombinationPriceChange}
            onCoatingColorChange={handleCoatingColorChange}
            selectedCoatingColor={coatingColor}
            combinedLensPrice={combinedLensPrice}
            rx={rxFormatted || getValues('rx')}
          />

          <FrameSection
            selectedFrame={selectedFrame}
            onFrameSelected={handleFrameSelected}
          />
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
