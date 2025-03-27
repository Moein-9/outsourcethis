
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
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
  const [open, setOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  
  const handlePrint = async () => {
    console.log("CustomPrintWorkOrderButton: Printing work order", { workOrder, invoice, patient });
    setIsPrinting(true);
    setOpen(false); // Close dialog before printing
    
    // Slightly longer delay to ensure dialog is fully closed and DOM is updated
    setTimeout(() => {
      CustomPrintService.printWorkOrder(workOrder, invoice, patient);
      setIsPrinting(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerElement}
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto p-0">
        <div className="p-6 flex flex-col items-center">
          <DialogTitle className="sr-only">{t('workOrderPreview')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('previewBeforePrinting')}
          </DialogDescription>
          
          <div className="w-full max-w-[80mm] bg-white p-0 border rounded shadow-sm mb-4">
            <CustomWorkOrderReceipt 
              workOrder={workOrder} 
              invoice={invoice} 
              patient={patient}
              isPrintable={false}
            />
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
