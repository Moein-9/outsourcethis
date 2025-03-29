
import React from 'react';
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

interface PrintReportButtonProps {
  onPrint: () => void;
  className?: string;
  label?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const PrintReportButton: React.FC<PrintReportButtonProps> = ({ 
  onPrint,
  className = "",
  label,
  variant = "default"
}) => {
  const { language } = useLanguageStore();
  
  const defaultLabel = language === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice';
  
  return (
    <Button 
      onClick={onPrint} 
      className={`gap-2 ${variant === "default" ? "bg-green-600 hover:bg-green-700 text-white" : ""} ${className}`}
      type="button"
      variant={variant}
    >
      <Printer size={16} />
      {label || defaultLabel}
    </Button>
  );
};
