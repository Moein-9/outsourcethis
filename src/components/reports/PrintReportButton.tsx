
import React from 'react';
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

interface PrintReportButtonProps {
  onPrint: () => void;
  className?: string;
  label?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const PrintReportButton: React.FC<PrintReportButtonProps> = ({ 
  onPrint,
  className = "",
  label,
  variant = "default",
  icon,
  disabled = false
}) => {
  const { language } = useLanguageStore();
  
  const defaultLabel = language === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice';
  
  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Direct printing without any dialog
    onPrint();
  };
  
  return (
    <Button 
      onClick={handlePrint} 
      className={`gap-2 text-base font-medium ${variant === "default" ? "bg-green-600 hover:bg-green-700 text-white" : ""} ${className}`}
      type="button"
      variant={variant}
      disabled={disabled}
    >
      {icon || <Printer size={20} />}
      {label || defaultLabel}
    </Button>
  );
};
