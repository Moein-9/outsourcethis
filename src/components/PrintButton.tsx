
import React from 'react';
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

interface PrintButtonProps {
  icon: LucideIcon;
  iconColor?: string;
  label: string;
  description?: string;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  children?: React.ReactNode;
}

export const PrintButton: React.FC<PrintButtonProps> = ({
  icon: Icon,
  iconColor,
  label,
  description,
  onClick,
  className = "",
  variant = "outline",
  disabled = false,
  isLoading = false,
  loadingText,
  children,
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  return (
    <Button
      variant={variant}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`w-full justify-between group transition-all duration-300 p-4 h-auto ${className}`}
    >
      <div className={`flex items-center ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className="w-12 h-12 rounded-full bg-opacity-20 flex items-center justify-center mx-4 transition-colors">
          <Icon className={`w-6 h-6 ${iconColor || 'text-primary'}`} />
        </div>
        <div className={`text-${isRtl ? 'right' : 'left'}`}>
          <div className="font-medium">{isLoading && loadingText ? loadingText : label}</div>
          {description && <div className="text-xs text-muted-foreground">{description}</div>}
        </div>
      </div>
      {children}
    </Button>
  );
};
