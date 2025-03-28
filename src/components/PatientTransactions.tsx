
import React from "react";
import { format, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, WorkOrder } from "@/store/invoiceStore";
import { RefundStatusBadge } from "./RefundStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Clock, CheckCircle, Edit } from "lucide-react";

interface PatientTransactionsProps {
  invoices: Invoice[];
  workOrders: WorkOrder[];
  onEditWorkOrder: (workOrder: WorkOrder) => void;
}

export const PatientTransactions: React.FC<PatientTransactionsProps> = ({
  invoices,
  workOrders,
  onEditWorkOrder
}) => {
  const { language, t } = useLanguageStore();
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP", { locale: language === 'ar' ? ar : enUS });
    } catch (error) {
      return language === 'ar' ? "تاريخ غير صالح" : "Invalid date";
    }
  };
  
  const getStatusBadge = (workOrder: WorkOrder) => {
    if (workOrder.isRefunded) {
      return <RefundStatusBadge invoice={{ isRefunded: true } as Invoice} size="sm" />;
    }
    
    if (workOrder.isExchanged) {
      return <RefundStatusBadge invoice={{ isExchanged: true } as Invoice} size="sm" />;
    }
    
    if (workOrder.isPickedUp) {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3" />
          {language === 'ar' ? "تم الاستلام" : "Picked Up"}
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="flex items-center gap-1 bg-amber-100 text-amber-800 hover:bg-amber-100">
        <Clock className="h-3 w-3" />
        {language === 'ar' ? "في الانتظار" : "Pending"}
      </Badge>
    );
  };
  
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium text-amber-700">
          {language === 'ar' ? "المعاملات والوصفات الطبية" : "Transactions & Prescriptions"}
        </h3>
      </div>
      
      {(workOrders.length > 0 || invoices.length > 0) ? (
        <div className="rounded-md border mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">{language === 'ar' ? "رقم المعاملة" : "Transaction #"}</TableHead>
                <TableHead>{language === 'ar' ? "النوع" : "Type"}</TableHead>
                <TableHead>{language === 'ar' ? "التاريخ" : "Date"}</TableHead>
                <TableHead>{language === 'ar' ? "المبلغ" : "Amount"}</TableHead>
                <TableHead>{language === 'ar' ? "الحالة" : "Status"}</TableHead>
                <TableHead className="text-right">{language === 'ar' ? "إجراءات" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders.map((workOrder) => {
                const relatedInvoice = invoices.find(invoice => invoice.workOrderId === workOrder.id);
                return (
                  <TableRow key={workOrder.id}>
                    <TableCell className="font-medium">{workOrder.id}</TableCell>
                    <TableCell>{language === 'ar' ? "طلب عمل" : "Work Order"}</TableCell>
                    <TableCell>{formatDate(workOrder.createdAt)}</TableCell>
                    <TableCell>{relatedInvoice ? `${relatedInvoice.total.toFixed(3)} KWD` : "-"}</TableCell>
                    <TableCell>{getStatusBadge(workOrder)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditWorkOrder(workOrder)}
                        disabled={workOrder.isRefunded || workOrder.isExchanged}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        {language === 'ar' ? "تعديل" : "Edit"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {invoices
                .filter(invoice => !workOrders.some(wo => invoice.workOrderId === wo.id))
                .map((invoice) => (
                  <TableRow key={invoice.invoiceId}>
                    <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                    <TableCell>{language === 'ar' ? "فاتورة" : "Invoice"}</TableCell>
                    <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                    <TableCell>{invoice.total.toFixed(3)} KWD</TableCell>
                    <TableCell>
                      <RefundStatusBadge invoice={invoice} size="sm" />
                    </TableCell>
                    <TableCell className="text-right">
                      {/* No edit button for standalone invoices */}
                      <span className="text-xs text-gray-500">
                        {invoice.isRefunded 
                          ? (language === 'ar' ? "تم استرداد المبلغ" : "Refunded") 
                          : (invoice.isExchanged 
                            ? (language === 'ar' ? "تم الاستبدال" : "Exchanged") 
                            : "-")}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          {language === 'ar' ? "لا توجد معاملات" : "No transactions found"}
        </div>
      )}
    </div>
  );
};
