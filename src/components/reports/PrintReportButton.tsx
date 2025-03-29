
import React from 'react';
import { useLanguageStore } from "@/store/languageStore";
import { PrintButton } from "../PrintButton";

interface PrintReportButtonProps {
  onPrint: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const PrintReportButton: React.FC<PrintReportButtonProps> = ({ 
  onPrint,
  className = "",
  variant = "default", // Changed to default to match the standard
  size = "sm"
}) => {
  const { language } = useLanguageStore();
  
  return (
    <PrintButton
      onClick={onPrint}
      label={language === 'ar' ? 'طباعة التقرير' : 'Print Report'}
      className={className}
      variant={variant}
      size={size}
    />
  );
};
