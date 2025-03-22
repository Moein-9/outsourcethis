
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { CustomPrintService } from '@/utils/CustomPrintService';
import { useLanguageStore } from '@/store/languageStore';

interface PrintWorkOrderButtonProps {
  workOrder: any;
  invoice?: any;
  patient?: any;
  className?: string;
}

export const CustomPrintWorkOrderButton: React.FC<PrintWorkOrderButtonProps> = ({
  workOrder,
  invoice,
  patient,
  className = ''
}) => {
  const { t } = useLanguageStore();
  
  const handlePrint = () => {
    CustomPrintService.printWorkOrder(workOrder, invoice, patient);
  };
  
  return (
    <Button 
      onClick={handlePrint} 
      variant="outline" 
      size="sm"
      className={`gap-1 ${className}`}
    >
      <Printer className="h-4 w-4" />
      {t('printWorkOrder')}
    </Button>
  );
};
