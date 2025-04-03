
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
      className={`w-full justify-between group hover:shadow-md p-5 h-auto transition-all duration-300 ${
        variant === "default" ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white" : ""
      } ${className} rounded-lg`}
    >
      <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center justify-center p-2 rounded-full bg-white/20 shadow-inner ${
          variant === "default" ? "text-white" : "text-green-600"
        }`}>
          {icon || <Printer className="w-6 h-6" />}
        </div>
        <div className={`text-${isRtl ? 'right' : 'left'}`}>
          <div className="font-bold text-lg">{buttonLabel}</div>
          <div className="text-sm font-medium opacity-90">{buttonDescription}</div>
        </div>
      </div>
      <ChevronRight className={`w-6 h-6 ${variant === "default" ? "text-white/80" : "text-muted-foreground"} group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
    </Button>
  );
};
