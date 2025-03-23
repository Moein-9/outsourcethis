
import React from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { Button } from '@/components/ui/button';
import { 
  Printer, 
  Receipt, 
  RefreshCw, 
  Save, 
  ClipboardCheck,
  CheckCircle2
} from 'lucide-react';

interface WorkOrderConfirmationProps {
  invoiceId: string;
  onPrintInvoice: () => void;
  onPrintWorkOrder: () => void;
  onReset: () => void;
}

export const WorkOrderConfirmation: React.FC<WorkOrderConfirmationProps> = ({
  invoiceId,
  onPrintInvoice,
  onPrintWorkOrder,
  onReset
}) => {
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  return (
    <div className="mt-6 flex flex-col items-center space-y-4">
      <div className="flex items-center justify-center gap-2 text-primary bg-primary/10 p-3 rounded-lg w-full border border-primary/20">
        <CheckCircle2 className="h-6 w-6 text-green-600" />
        <span className="font-medium">
          {t('invoiceSavedSuccess')} {invoiceId}
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        <Button 
          onClick={onPrintInvoice}
          className="gap-2"
          variant="outline"
        >
          <Receipt className="h-4 w-4" />
          {t('printInvoice')}
        </Button>
        
        <Button 
          onClick={onPrintWorkOrder}
          className="gap-2"
        >
          <ClipboardCheck className="h-4 w-4" />
          {t('printWorkOrder')}
        </Button>
        
        <Button 
          onClick={onReset}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {t('newOrder')}
        </Button>
      </div>
    </div>
  );
};
