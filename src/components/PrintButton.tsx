
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

interface PrintButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const PrintButton: React.FC<PrintButtonProps> = ({
  onClick,
  label,
  className = "",
  variant = "default", // Changed to default variant which uses the primary colors
  size = "sm",
  disabled = false,
  icon,
}) => {
  const { t } = useLanguageStore();
  
  // Use the provided label or default to "Print"
  const buttonLabel = label || t("print");
  
  // Use the provided icon or default to Printer
  const buttonIcon = icon || <Printer className="h-4 w-4 mr-1" />;
  
  return (
    <Button 
      variant={variant} 
      size={size} 
      className={`gap-1 ${className}`} // Removed hardcoded bg-indigo classes to use the button's variant styles
      onClick={onClick}
      disabled={disabled}
    >
      {buttonIcon}
      {buttonLabel}
    </Button>
  );
};
