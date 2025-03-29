
import React from 'react';
import { useLanguageStore } from "@/store/languageStore";
import { PrintButton } from "../PrintButton";

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
    <PrintButton
      onClick={onPrint}
      label={language === 'ar' ? 'طباعة التقرير' : 'Print Report'}
      className={className}
    />
  );
};
