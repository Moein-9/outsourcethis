
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

// Create a button specifically for print functionality
export const PrintButton: React.FC<PrintButtonProps> = ({
  onClick,
  label,
  className = "",
  variant = "default",
  size = "sm",
  disabled = false,
  icon,
}) => {
  const { t } = useLanguageStore();
  
  // Use the provided label or default to "Print"
  const buttonLabel = label || t("print");
  
  // Use the provided icon or default to Printer
  const buttonIcon = icon || <Printer className="h-4 w-4 mr-1" />;
  
  // Prevent multiple print dialogs by debouncing the click handler
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default form submission
    
    // Only execute onClick if the button is not disabled
    if (!disabled && onClick) {
      onClick();
    }
  };
  
  return (
    <Button 
      variant={variant} 
      size={size} 
      className={`gap-1 ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {buttonIcon}
      {buttonLabel}
    </Button>
  );
};
