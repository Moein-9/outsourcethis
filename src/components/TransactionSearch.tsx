
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInvoiceStore, Invoice, WorkOrder } from "@/store/invoiceStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefundStatusBadge } from "@/components/RefundStatusBadge";
import { Search, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { toast } from "sonner";

interface TransactionSearchProps {
  onSelectInvoice: (invoice: Invoice) => void;
}

export const TransactionSearch: React.FC<TransactionSearchProps> = ({ onSelectInvoice }) => {
  const { t, language } = useLanguageStore();
  const { searchTransactions } = useInvoiceStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<{ invoices: Invoice[], workOrders: WorkOrder[] }>({ 
    invoices: [], 
    workOrders: [] 
  });
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error(language === 'ar' ? "الرجاء إدخال مصطلح البحث" : "Please enter a search term");
      return;
    }
    
    const results = searchTransactions(searchTerm);
    setSearchResults(results);
    setHasSearched(true);
    
    if (results.invoices.length === 0 && results.workOrders.length === 0) {
      toast.info(t('noSearchResults'));
    }
  };
  
  const handleClear = () => {
    setSearchTerm("");
    setSearchResults({ invoices: [], workOrders: [] });
    setHasSearched(false);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP", { locale: language === 'ar' ? ar : enUS });
    } catch (error) {
      return language === 'ar' ? "تاريخ غير صالح" : "Invalid date";
    }
  };
  
  const renderInvoiceTable = () => {
    if (searchResults.invoices.length === 0) return null;
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">{t('invoiceDetails')}</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('invoice')}</TableHead>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('phoneNumber')}</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('total')}</TableHead>
                <TableHead>{t('refundStatus')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchResults.invoices.map((invoice) => (
                <TableRow key={invoice.invoiceId} className={invoice.isRefunded ? "bg-red-50" : ""}>
                  <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                  <TableCell>{invoice.patientName}</TableCell>
                  <TableCell dir="ltr" className="text-right">{invoice.patientPhone}</TableCell>
                  <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                  <TableCell className="font-medium">{invoice.total.toFixed(3)} KWD</TableCell>
                  <TableCell>
                    {invoice.isRefunded ? (
                      <RefundStatusBadge isRefunded={true} />
                    ) : (
                      <span className="text-green-600 font-medium">
                        {language === 'ar' ? 'غير مسترجع' : 'Not Refunded'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      onClick={() => onSelectInvoice(invoice)}
                      disabled={invoice.isRefunded}
                      variant={invoice.isRefunded ? "outline" : "default"}
                      size="sm"
                    >
                      {invoice.isRefunded 
                        ? (language === 'ar' ? 'تم الاسترداد' : 'Already Refunded') 
                        : t('processRefund')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t('searchTransactions')}</CardTitle>
        <CardDescription>{t('searchInstructions')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className={language === 'ar' ? "pr-9" : "pl-9"}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} variant="default">
            <Search className="h-4 w-4 mr-2" />
            {t('search')}
          </Button>
          {hasSearched && (
            <Button onClick={handleClear} variant="outline">
              <X className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'مسح' : 'Clear'}
            </Button>
          )}
        </div>
        
        {hasSearched && searchResults.invoices.length === 0 && searchResults.workOrders.length === 0 && (
          <div className="text-center py-8 mt-6">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">{t('noSearchResults')}</h3>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? "لم يتم العثور على معاملات مطابقة لمعايير البحث. جرب استخدام كلمات بحث مختلفة."
                : "No transactions match your search criteria. Try using different search terms."}
            </p>
          </div>
        )}
        
        {renderInvoiceTable()}
      </CardContent>
    </Card>
  );
};
