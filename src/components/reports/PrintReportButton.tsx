
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
  
  return (
    <Button 
      onClick={onPrint} 
      className={`gap-2 bg-primary hover:bg-primary/90 ${className}`}
    >
      <Printer size={16} />
      {language === 'ar' ? 'طباعة التقرير' : 'Print Report'}
    </Button>
  );
};
