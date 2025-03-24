
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { CustomWorkOrderReceipt } from './CustomWorkOrderReceipt';
import { CustomPrintService } from '@/utils/CustomPrintService';

interface PrintWorkOrderButtonProps {
  workOrder: any;
  invoice?: any;
  patient?: any;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode; 
}

export const CustomPrintWorkOrderButton: React.FC<PrintWorkOrderButtonProps> = ({
  workOrder,
  invoice,
  patient,
  className = '',
  variant = "outline",
  size = "sm",
  children
}) => {
  const { t } = useLanguageStore();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePrint = () => {
    setIsLoading(true);
    
    // Close the sheet before printing to avoid stacking dialogs
    setOpen(false);
    
    // Add a delay before printing to ensure the sheet is fully closed
    setTimeout(() => {
      try {
        // Use our unified printing method
        CustomPrintService.printWorkOrder(workOrder, invoice, patient);
      } catch (error) {
        console.error("Error printing work order:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };
  
  // Create a default button if no children are provided or if children is not a valid element
  const defaultButton = (
    <Button 
      variant={variant} 
      size={size} 
      className={`gap-1 ${className}`}
      disabled={isLoading}
    >
      <Printer className="h-4 w-4" />
      {isLoading ? t('printing') : t('printWorkOrder')}
    </Button>
  );
  
  // Ensure we only pass a single valid element to SheetTrigger
  const triggerElement = React.isValidElement(children) ? children : defaultButton;
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {triggerElement}
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md p-0 overflow-y-auto">
        <div className="p-6 flex flex-col items-center">
          <SheetTitle className="text-center">{t('workOrderPreview')}</SheetTitle>
          <SheetDescription className="text-center mb-4">
            {t('previewBeforePrinting')}
          </SheetDescription>
          
          <div className="w-full max-w-[80mm] bg-white p-0 border rounded shadow-sm mb-4">
            <CustomWorkOrderReceipt 
              workOrder={workOrder} 
              invoice={invoice} 
              patient={patient}
              isPrintable={false}
            />
          </div>
          
          <SheetFooter className="w-full flex justify-center mt-4">
            <Button 
              onClick={handlePrint} 
              className="gap-2"
              disabled={isLoading}
              size="lg"
            >
              <Printer className="h-4 w-4" />
              {isLoading ? t('printing') : t('print')}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
