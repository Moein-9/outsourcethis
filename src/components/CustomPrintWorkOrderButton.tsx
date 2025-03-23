
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
}

export const CustomPrintWorkOrderButton: React.FC<PrintWorkOrderButtonProps> = ({
  workOrder,
  invoice,
  patient,
  className = '',
  variant = "outline",
  size = "sm"
}) => {
  const { t } = useLanguageStore();
  const [open, setOpen] = useState(false);
  
  const handlePrint = () => {
    console.log("CustomPrintWorkOrderButton: Printing work order", { workOrder, invoice, patient });
    setOpen(false); // Close dialog before printing
    
    // Slightly longer delay to ensure dialog is fully closed and DOM is updated
    setTimeout(() => {
      CustomPrintService.printWorkOrder(workOrder, invoice, patient);
    }, 300);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={variant}
          size={size}
          className={`gap-1 ${className}`}
        >
          <Printer className="h-4 w-4" />
          {t('printWorkOrder')}
        </Button>
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
          <Button onClick={handlePrint} className="mt-4 gap-2">
            <Printer className="h-4 w-4" />
            {t('print')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
