
import React from 'react';
import { Button } from "@/components/ui/button";
import { Printer, ChevronRight } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

interface PrintReportButtonProps {
  onPrint: () => void;
  className?: string;
  label?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  icon?: React.ReactNode;
  disabled?: boolean;
  description?: string;
}

export const PrintReportButton: React.FC<PrintReportButtonProps> = ({ 
  onPrint,
  className = "",
  label,
  variant = "default",
  icon,
  disabled = false,
  description
}) => {
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  const defaultLabel = language === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice';
  const buttonLabel = label || defaultLabel;
  const buttonDescription = description || (language === 'ar' ? 'طباعة نسخة من الفاتورة' : 'Print a copy of the invoice');
  
  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add a slight delay to ensure any state updates have completed
    setTimeout(() => {
      onPrint();
    }, 100);
  };
  
  return (
    <Button 
      onClick={handlePrint}
      variant={variant}
      disabled={disabled}
      className={`w-full justify-between group hover:shadow-sm p-4 h-auto transition-all duration-300 ${
        variant === "default" ? "bg-green-600 hover:bg-green-700 text-white" : ""
      } ${className}`}
    >
      <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center justify-center ${
          variant === "default" ? "text-white" : "text-green-600"
        }`}>
          {icon || <Printer className="w-5 h-5" />}
        </div>
        <div className={`text-${isRtl ? 'right' : 'left'}`}>
          <div className="font-medium">{buttonLabel}</div>
          <div className="text-xs text-muted-foreground">{buttonDescription}</div>
        </div>
      </div>
      <ChevronRight className={`w-5 h-5 ${variant === "default" ? "text-white/70" : "text-muted-foreground"} group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
    </Button>
  );
};
