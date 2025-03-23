
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, FileText } from 'lucide-react';
import { CustomPrintService } from '@/utils/CustomPrintService';
import { useLanguageStore } from '@/store/languageStore';
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CustomWorkOrderReceipt } from './CustomWorkOrderReceipt';
import { toast } from '@/components/ui/use-toast';

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
  const [notes, setNotes] = useState(workOrder?.notes || "");
  const receiptRef = useRef<HTMLDivElement>(null);
  
  console.log("CustomPrintWorkOrderButton: Initial render with workOrder", { 
    workOrderId: workOrder?.id,
    workOrderNotes: workOrder?.notes,
    passedNotes: notes
  });
  
  const handlePrint = () => {
    console.log("CustomPrintWorkOrderButton: Printing work order", { 
      workOrderId: workOrder?.id, 
      invoiceId: invoice?.invoiceId, 
      patientName: patient?.name,
      notes
    });
    
    setOpen(false); // Close dialog before printing
    
    // Add notes to the workOrder object
    const workOrderWithNotes = {
      ...workOrder,
      notes
    };
    
    // Slightly longer delay to ensure dialog is fully closed and DOM is updated
    setTimeout(() => {
      const result = CustomPrintService.printWorkOrder(workOrderWithNotes, invoice, patient);
      if (result) {
        toast({
          title: t('success'),
          description: t('workOrderPrinted'),
        });
      }
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
          <FileText className="h-4 w-4" />
          {t('printWorkOrder')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto p-4">
        <div className="p-4 flex flex-col items-center">
          <DialogTitle className="text-xl mb-2">{t('workOrderPreview')}</DialogTitle>
          <DialogDescription className="mb-4 text-center">
            {t('previewBeforePrinting')}
          </DialogDescription>
          
          <div className="w-full max-w-md mb-4">
            <label htmlFor="notes" className="text-sm font-medium mb-2 block">
              {t("specialInstructions")}:
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("enterSpecialInstructions")}
              className="resize-none min-h-[100px] mb-4"
            />
          </div>
          
          <div className="w-full max-w-[80mm] bg-white p-0 border rounded shadow-sm mb-4" ref={receiptRef}>
            <CustomWorkOrderReceipt 
              workOrder={{...workOrder, notes}} 
              invoice={invoice} 
              patient={patient}
              isPrintable={false}
            />
          </div>
          
          <DialogFooter className="w-full flex justify-end">
            <Button onClick={handlePrint} className="mt-4 gap-2">
              <Printer className="h-4 w-4" />
              {t('print')}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
