
import React, { useState, useEffect } from 'react';
import { useSupplierInvoiceStore, SupplierInvoice } from '@/store/supplierInvoiceStore';
import { useLanguageStore } from '@/store/languageStore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow, 
  TableFooter 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { 
  filterByMonth, 
  generateMonthOptions, 
  getMonthYearString 
} from '@/utils/dateUtils';

export const SupplierInvoiceSummary: React.FC = () => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  const invoices = useSupplierInvoiceStore(state => state.invoices);
  const companies = useSupplierInvoiceStore(state => state.companies);
  
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()}`;
  });
  
  const [monthlyInvoices, setMonthlyInvoices] = useState<SupplierInvoice[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [companyTotals, setCompanyTotals] = useState<{[key: string]: number}>({});
  
  const monthOptions = generateMonthOptions(language === 'ar' ? 'ar-KW' : 'en-US');

  // Translations
  const translations = {
    monthlySummary: language === 'ar' ? 'ملخص الشهر' : 'Monthly Summary',
    selectMonth: language === 'ar' ? 'اختر الشهر' : 'Select Month',
    companyName: language === 'ar' ? 'اسم الشركة' : 'Company Name',
    invoiceCount: language === 'ar' ? 'عدد الفواتير' : 'Invoice Count',
    totalAmount: language === 'ar' ? 'المبلغ الإجمالي' : 'Total Amount',
    total: language === 'ar' ? 'المجموع' : 'Total',
    currency: language === 'ar' ? 'د.ك' : 'KWD',
    noInvoices: language === 'ar' ? 'لا توجد فواتير لهذا الشهر' : 'No invoices found for this month',
  };

  // Filter invoices based on selected month
  useEffect(() => {
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-').map(Number);
      const filtered = filterByMonth(invoices, 'date', year, month);
      setMonthlyInvoices(filtered);
      
      // Calculate monthly total
      const total = filtered.reduce((sum, invoice) => sum + invoice.invoiceAmount, 0);
      setMonthlyTotal(total);
      
      // Calculate totals by company
      const companyTotals: {[key: string]: number} = {};
      filtered.forEach(invoice => {
        if (!companyTotals[invoice.companyName]) {
          companyTotals[invoice.companyName] = 0;
        }
        companyTotals[invoice.companyName] += invoice.invoiceAmount;
      });
      setCompanyTotals(companyTotals);
    }
  }, [invoices, selectedMonth]);

  // Count invoices by company
  const getInvoiceCountByCompany = (companyName: string) => {
    return monthlyInvoices.filter(invoice => invoice.companyName === companyName).length;
  };

  // Get unique companies from the filtered invoices
  const uniqueCompanies = [...new Set(monthlyInvoices.map(invoice => invoice.companyName))];

  // Get company color
  const getCompanyColor = (companyName: string) => {
    const company = companies.find(c => c.name === companyName);
    return company?.color || '#888888';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">{translations.monthlySummary}</h2>
        <div className="flex items-center gap-3">
          <Label htmlFor="month-select">{translations.selectMonth}</Label>
          <Select
            value={selectedMonth}
            onValueChange={(value) => setSelectedMonth(value)}
          >
            <SelectTrigger id="month-select" className="w-[180px]">
              <SelectValue placeholder={translations.selectMonth} />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {monthlyInvoices.length > 0 ? (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isRtl ? 'text-right' : ''}>{translations.companyName}</TableHead>
                    <TableHead className="text-center">{translations.invoiceCount}</TableHead>
                    <TableHead className={isRtl ? 'text-right' : ''}>{translations.totalAmount}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uniqueCompanies.map((company) => (
                    <TableRow key={company}>
                      <TableCell className={isRtl ? 'text-right' : ''}>
                        <div className="flex items-center gap-2">
                          <Badge
                            style={{ backgroundColor: getCompanyColor(company) }}
                            className="w-3 h-3 rounded-full p-0"
                          />
                          {company}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{getInvoiceCountByCompany(company)}</TableCell>
                      <TableCell className={isRtl ? 'text-right' : ''}>
                        {companyTotals[company].toFixed(3)} {translations.currency}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} className="font-medium">
                      {translations.total}
                    </TableCell>
                    <TableCell className={isRtl ? 'text-right' : ''}>
                      {monthlyTotal.toFixed(3)} {translations.currency}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
          
          {/* Monthly Chart - could be added here */}
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          {translations.noInvoices}
        </div>
      )}
    </div>
  );
};
