
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
  
  const handlePrint = () => {
    console.log("CustomPrintWorkOrderButton: Previewing work order", { workOrder, invoice, patient });
    CustomPrintService.previewWorkOrder(workOrder, invoice, patient);
  };
  
  return (
    <Button 
      onClick={handlePrint} 
      variant={variant}
      size={size}
      className={`gap-1 ${className}`}
    >
      <Printer className="h-4 w-4" />
      {t('printWorkOrder')}
    </Button>
  );
};
