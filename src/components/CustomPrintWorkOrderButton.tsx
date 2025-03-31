
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, MapPin } from 'lucide-react';
import { CustomPrintService } from '@/utils/CustomPrintService';
import { useLanguageStore } from '@/store/languageStore';
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { CustomWorkOrderReceipt } from './CustomWorkOrderReceipt';
import { storeLocations } from '@/assets/logo';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface PrintWorkOrderButtonProps {
  workOrder: any;
  invoice?: any;
  patient?: any;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode; // This prop is used when passing custom trigger element
}

export const CustomPrintWorkOrderButton: React.FC<PrintWorkOrderButtonProps> = ({
  workOrder,
  invoice,
  patient,
  className = '',
  variant = "outline",
  size = "sm",
  children // This prop holds any custom trigger element
}) => {
  const { t, language } = useLanguageStore();
  const [open, setOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState(storeLocations[0].id);
  
  const handlePrint = () => {
    if (isPrinting) return; // Prevent multiple calls
    
    setIsPrinting(true);
    setOpen(false); // Close dialog before printing
    
    console.log("[CustomPrintWorkOrderButton] Triggering print for workOrder:", workOrder.id);
    
    // Slightly longer delay to ensure dialog is fully closed and DOM is updated
    setTimeout(() => {
      CustomPrintService.printWorkOrder(workOrder, invoice, patient, selectedLocationId);
      setTimeout(() => setIsPrinting(false), 1000); // Reset printing state after a delay
    }, 300);
  };
  
  // Create a default button if no children are provided or if children is not a valid element
  const defaultButton = (
    <Button 
      variant={variant}
      size={size}
      className={`gap-1 ${className}`}
      disabled={isPrinting}
    >
      <Printer className="h-4 w-4" />
      {isPrinting ? t('printing') : t('printWorkOrder')}
    </Button>
  );
  
  // Ensure we only pass a single valid element to DialogTrigger
  const triggerElement = React.isValidElement(children) ? children : defaultButton;
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (isPrinting) return; // Don't toggle if printing
      setOpen(newOpen);
    }}>
      <DialogTrigger asChild>
        {triggerElement}
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto p-0">
        <div className="p-6 flex flex-col items-center">
          <DialogTitle className="sr-only">{t('workOrderPreview')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('previewBeforePrinting')}
          </DialogDescription>
          
          <div className="mb-4 flex items-center gap-3">
            <MapPin className="h-4 w-4 text-gray-500" />
            <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder={language === 'ar' ? "اختر الموقع" : "Select location"} />
              </SelectTrigger>
              <SelectContent>
                {storeLocations.map(location => (
                  <SelectItem key={location.id} value={location.id}>
                    {language === 'ar' ? location.title.ar : location.title.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full max-w-[80mm] bg-white p-0 border rounded shadow-sm mb-4">
            <div id="work-order-receipt">
              <CustomWorkOrderReceipt 
                workOrder={workOrder} 
                invoice={invoice} 
                patient={patient}
                isPrintable={true}
                locationId={selectedLocationId}
              />
            </div>
          </div>
          <Button 
            onClick={handlePrint} 
            className="mt-4 gap-2"
            disabled={isPrinting}
          >
            <Printer className="h-4 w-4" />
            {isPrinting ? t('printing') : t('print')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
