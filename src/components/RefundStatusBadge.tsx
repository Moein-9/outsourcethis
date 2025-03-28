
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
  
  if (invoice.isRefunded) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
        {t('refunded') || "Refunded"}
      </Badge>
    );
  }
  
  if (invoice.isExchanged) {
    return (
      <Badge variant="outline" className="flex items-center gap-1 bg-amber-100 text-amber-800 hover:bg-amber-100">
        <ArrowLeftRight className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
        {t('exchanged') || "Exchanged"}
      </Badge>
    );
  }
  
  if (!invoice.isPaid) {
    return (
      <Badge variant="outline" className="flex items-center gap-1 bg-amber-100 text-amber-800 hover:bg-amber-100">
        <Clock className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
        {t('unpaid') || "Unpaid"}
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-100">
      <CheckCircle className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      {t('completed') || "Completed"}
    </Badge>
  );
};
