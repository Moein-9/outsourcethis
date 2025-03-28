
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
  const { language, t } = useLanguageStore();
  
  return (
    <Button 
      onClick={onPrint} 
      className={`flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm ${className}`}
    >
      <Printer size={16} />
      <span>{language === 'ar' ? 'طباعة التقرير' : 'Print Report'}</span>
    </Button>
  );
};
