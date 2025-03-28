
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice } from "@/store/invoiceStore";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, ArrowLeftRight } from "lucide-react";

interface RefundStatusBadgeProps {
  invoice: Invoice;
  size?: "sm" | "default";
}

export const RefundStatusBadge: React.FC<RefundStatusBadgeProps> = ({ 
  invoice,
  size = "default"
}) => {
  const { language, t } = useLanguageStore();
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const iconClass = `${iconSize} ${language === 'ar' ? 'ml-1' : 'mr-1'}`;
  
  if (invoice.isRefunded) {
    return (
      <Badge variant="outline" className="flex items-center gap-1 bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
        <XCircle className={iconClass} />
        {t('refunded') || "Refunded"}
      </Badge>
    );
  }
  
  if (invoice.isExchanged) {
    return (
      <Badge variant="outline" className="flex items-center gap-1 bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
        <ArrowLeftRight className={iconClass} />
        {t('exchanged') || "Exchanged"}
      </Badge>
    );
  }
  
  if (!invoice.isPaid) {
    return (
      <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">
        <Clock className={iconClass} />
        {t('unpaid') || "Unpaid"}
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
      <CheckCircle className={iconClass} />
      {t('completed') || "Completed"}
    </Badge>
  );
};
