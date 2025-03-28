
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguageStore } from "@/store/languageStore";

interface RefundStatusBadgeProps {
  isRefunded?: boolean;
  className?: string;
}

export const RefundStatusBadge: React.FC<RefundStatusBadgeProps> = ({ 
  isRefunded, 
  className 
}) => {
  const { language } = useLanguageStore();
  
  if (!isRefunded) return null;
  
  return (
    <Badge
      variant="destructive"
      className={`bg-red-500 hover:bg-red-600 text-white ${className || ''}`}
    >
      {language === 'ar' ? 'مسترجع' : 'Refunded'}
    </Badge>
  );
};
