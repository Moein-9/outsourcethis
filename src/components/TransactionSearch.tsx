
import React, { useState } from "react";
import { useInvoiceStore, Invoice, WorkOrder } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefundStatusBadge } from "./RefundStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Search, Info } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";

interface TransactionSearchProps {
  onSelectTransaction: (invoice: Invoice, workOrder?: WorkOrder) => void;
}

export const TransactionSearch: React.FC<TransactionSearchProps> = ({
  onSelectTransaction
}) => {
  const { language, t } = useLanguageStore();
  const { searchTransactions, getInvoiceById } = useInvoiceStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ invoices: Invoice[], workOrders: WorkOrder[] }>({ invoices: [], workOrders: [] });
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    const results = searchTransactions(searchQuery);
    setSearchResults(results);
    setHasSearched(true);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP", { locale: language === 'ar' ? ar : enUS });
    } catch (error) {
      return language === 'ar' ? "تاريخ غير صالح" : "Invalid date";
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchByInvoiceIdNamePhone') || "Search by invoice ID, customer name, or phone"}
            className={language === 'ar' ? "pr-9" : "pl-9"}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>
          <Search className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
          {t('search')}
        </Button>
      </div>
      
      {hasSearched && (
        <>
          {searchResults.invoices.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>{t('invoice') || "Invoice"}</TableHead>
                    <TableHead>{t('customer') || "Customer"}</TableHead>
                    <TableHead>{t('date') || "Date"}</TableHead>
                    <TableHead>{t('amount') || "Amount"}</TableHead>
                    <TableHead>{t('status') || "Status"}</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.invoices.map((invoice, index) => {
                    const workOrder = searchResults.workOrders.find(wo => wo.id === invoice.workOrderId);
                    return (
                      <TableRow key={invoice.invoiceId}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                        <TableCell>{invoice.patientName}</TableCell>
                        <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                        <TableCell>{invoice.total.toFixed(3)} KWD</TableCell>
                        <TableCell>
                          <RefundStatusBadge invoice={invoice} />
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onSelectTransaction(invoice, workOrder)}
                            disabled={invoice.isRefunded || invoice.isExchanged}
                          >
                            {t('select') || "Select"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Info className="h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">{t('noResults') || "No Results Found"}</h3>
              <p className="text-muted-foreground mt-1">
                {t('tryDifferentSearch') || "Try a different search term or check the customer's details again."}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
