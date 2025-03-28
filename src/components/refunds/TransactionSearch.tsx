
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInvoiceStore, Invoice } from "@/store/invoiceStore";
import { usePatientStore } from "@/store/patientStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Search, FileSearch, RefreshCw, ArrowDownLeft } from "lucide-react";
import { toast } from "sonner";
import { RefundStatusBadge } from "@/components/RefundStatusBadge";
import { format, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";

interface TransactionSearchProps {
  onSelectInvoice: (invoice: Invoice) => void;
}

export const TransactionSearch: React.FC<TransactionSearchProps> = ({ 
  onSelectInvoice 
}) => {
  const { language, t } = useLanguageStore();
  const { invoices, getInvoiceById } = useInvoiceStore();
  const { patients } = usePatientStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Invoice[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error(language === 'ar' ? "الرجاء إدخال مصطلح البحث" : "Please enter a search term");
      return;
    }
    
    // Search by invoice ID, patient name, or phone number
    const results = invoices.filter(invoice => {
      const invoiceIdMatch = invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
      const nameMatch = invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase());
      const phoneMatch = invoice.patientPhone.includes(searchTerm);
      
      return invoiceIdMatch || nameMatch || phoneMatch;
    });
    
    setSearchResults(results);
    setHasSearched(true);
    
    if (results.length === 0) {
      toast.info(t('noTransactionsFound'));
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPP', { 
        locale: language === 'ar' ? ar : enUS 
      });
    } catch (error) {
      return dateString;
    }
  };
  
  const getRefundStatus = (invoice: Invoice) => {
    if (invoice.isRefunded) return 'refunded';
    if (invoice.isExchanged) return 'exchanged';
    return 'not_refunded';
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{t('searchTransactions')}</CardTitle>
        <CardDescription>
          {t('searchForInvoice')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('searchByAny')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              {t('search')}
            </Button>
          </div>
          
          {hasSearched && (
            <div>
              <h3 className="text-lg font-medium mb-3">{t('searchResults')}</h3>
              
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((invoice) => (
                    <div 
                      key={invoice.invoiceId}
                      className="flex items-center justify-between border p-3 rounded-md hover:bg-slate-50 cursor-pointer"
                      onClick={() => onSelectInvoice(invoice)}
                    >
                      <div>
                        <p className="font-medium text-sm">{invoice.invoiceId}</p>
                        <p className="text-sm text-muted-foreground">{invoice.patientName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {formatDate(invoice.createdAt)}
                          </p>
                          <RefundStatusBadge status={getRefundStatus(invoice)} />
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold">{invoice.total.toFixed(3)} KWD</p>
                        <div className="flex items-center justify-end mt-1 gap-1">
                          {invoice.isRefunded ? (
                            <ArrowDownLeft className="h-4 w-4 text-red-500" />
                          ) : invoice.isExchanged ? (
                            <RefreshCw className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-7 px-2 text-xs"
                            >
                              {t('processRefund')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md bg-slate-50">
                  <FileSearch className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-muted-foreground">{t('noTransactionsFound')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
