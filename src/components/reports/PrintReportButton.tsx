
import React from 'react';
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

interface PrintReportButtonProps {
  onPrint: () => void;
  className?: string;
}

export const PrintReportButton: React.FC<PrintReportButtonProps> = ({ 
  onPrint,
  className = ""
}) => {
  const { language } = useLanguageStore();
  
  // Make sure the onClick directly calls the onPrint function
  return (
    <Button 
      onClick={onPrint} 
      className={`gap-2 bg-primary hover:bg-primary/90 ${className}`}
      type="button"
    >
      <Printer size={16} />
      {language === 'ar' ? 'طباعة التقرير' : 'Print Report'}
    </Button>
  );
};
