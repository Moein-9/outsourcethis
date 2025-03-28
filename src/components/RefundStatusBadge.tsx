
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { useLanguageStore } from "@/store/languageStore";
import { RefreshCw, ArrowDownLeft, Check, Clock, X } from "lucide-react";

interface RefundStatusBadgeProps {
  status?: 'refunded' | 'exchanged' | 'not_refunded' | 'not_exchanged' | 'pending';
  className?: string;
}

export const RefundStatusBadge: React.FC<RefundStatusBadgeProps> = ({ 
  status = 'not_refunded',
  className = ""
}) => {
  const { t } = useLanguageStore();
  
  switch (status) {
    case 'refunded':
      return (
        <Badge className={`bg-red-100 text-red-800 hover:bg-red-200 ${className}`}>
          <ArrowDownLeft className="h-3 w-3 mr-1" />
          {t('refunded')}
        </Badge>
      );
    case 'exchanged':
      return (
        <Badge className={`bg-blue-100 text-blue-800 hover:bg-blue-200 ${className}`}>
          <RefreshCw className="h-3 w-3 mr-1" />
          {t('exchanged')}
        </Badge>
      );
    case 'pending':
      return (
        <Badge className={`bg-amber-100 text-amber-800 hover:bg-amber-200 ${className}`}>
          <Clock className="h-3 w-3 mr-1" />
          {t('pending')}
        </Badge>
      );
    case 'not_exchanged':
      return (
        <Badge className={`bg-gray-100 text-gray-500 hover:bg-gray-200 ${className}`}>
          <X className="h-3 w-3 mr-1" />
          {t('notExchanged')}
        </Badge>
      );
    case 'not_refunded':
    default:
      return (
        <Badge className={`bg-green-100 text-green-700 hover:bg-green-200 ${className}`}>
          <Check className="h-3 w-3 mr-1" />
          {t('notRefunded')}
        </Badge>
      );
  }
};
