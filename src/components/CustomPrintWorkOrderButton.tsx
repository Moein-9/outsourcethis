
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { CustomPrintService } from '@/utils/CustomPrintService';
import { useLanguageStore } from '@/store/languageStore';
import { useStoreLocation } from '@/store/storeLocationStore';
import { LocationSelector } from './LocationSelector';
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { CustomWorkOrderReceipt } from './CustomWorkOrderReceipt';
import { storeLocations } from '@/assets/logo';

// Define the location ID type
type LocationId = keyof typeof storeLocations;

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
  const { t } = useLanguageStore();
  const { selectedLocation } = useStoreLocation();
  const [open, setOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printLocation, setPrintLocation] = useState<LocationId>(selectedLocation);
  
  const handlePrint = () => {
    if (isPrinting) return; // Prevent multiple calls
    
    setIsPrinting(true);
    setOpen(false); // Close dialog before printing
    
    console.log("[CustomPrintWorkOrderButton] Triggering print for workOrder:", workOrder.id, "with location:", printLocation);
    
    // Slightly longer delay to ensure dialog is fully closed and DOM is updated
    setTimeout(() => {
      // Updated to use only 3 parameters since CustomPrintService.printWorkOrder expects only 3
      CustomPrintService.printWorkOrder(workOrder, invoice, patient);
      setTimeout(() => setIsPrinting(false), 1000); // Reset printing state after a delay
    }, 300);
  };
  
  const handleLocationSelect = (locationId: string) => {
    // Type assertion to ensure locationId is treated as LocationId
    setPrintLocation(locationId as LocationId);
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
      // Reset the print location to the current selected location when opening the dialog
      if (newOpen) {
        setPrintLocation(selectedLocation);
      }
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
          
          <div className="w-full flex justify-center mb-4">
            <LocationSelector 
              mini={false}
              className="w-full max-w-xs"
              onSelect={handleLocationSelect}
            />
          </div>
          
          <div className="w-full max-w-[80mm] bg-white p-0 border rounded shadow-sm mb-4">
            <div id="work-order-receipt">
              <CustomWorkOrderReceipt 
                workOrder={workOrder} 
                invoice={invoice} 
                patient={patient}
                isPrintable={true}
                locationId={printLocation}
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
