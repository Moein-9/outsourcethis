
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupplierInvoiceStore, SupplierInvoice } from '@/store/supplierInvoiceStore';
import { useLanguageStore } from '@/store/languageStore';
import { MoenLogo } from "@/assets/logo";
import { Printer } from 'lucide-react';
import { formatDate, getMonthYearString } from '@/utils/dateUtils';
import { toast } from 'sonner';

interface SupplierInvoicePrintProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CompanySummary {
  name: string;
  color: string;
  invoices: SupplierInvoice[];
  total: number;
}

export const SupplierInvoicePrint: React.FC<SupplierInvoicePrintProps> = ({
  open,
  onOpenChange
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  const invoices = useSupplierInvoiceStore(state => state.invoices);
  
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [summaryData, setSummaryData] = useState<CompanySummary[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<SupplierInvoice[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [periodOptions, setPeriodOptions] = useState<{label: string, value: string}[]>([]);
  const [isPrinting, setIsPrinting] = useState(false);
  
  const printRef = useRef<HTMLDivElement>(null);

  // Translations
  const translations = {
    printReport: language === 'ar' ? 'طباعة تقرير فواتير الموردين' : 'Print Supplier Invoice Report',
    selectPeriod: language === 'ar' ? 'اختر الفترة' : 'Select Period',
    currentMonth: language === 'ar' ? 'الشهر الحالي' : 'Current Month',
    companyName: language === 'ar' ? 'اسم الشركة' : 'Company Name',
    invoiceNumber: language === 'ar' ? 'رقم الفاتورة' : 'Invoice Number',
    invoiceAmount: language === 'ar' ? 'مبلغ الفاتورة' : 'Invoice Amount',
    invoiceDate: language === 'ar' ? 'تاريخ الفاتورة' : 'Invoice Date',
    supplierInvoiceReport: language === 'ar' ? 'تقرير فواتير الموردين' : 'Supplier Invoice Report',
    companyTotals: language === 'ar' ? 'إجمالي الشركات' : 'Company Totals',
    invoiceDetails: language === 'ar' ? 'تفاصيل الفواتير' : 'Invoice Details',
    overallTotal: language === 'ar' ? 'المجموع الكلي' : 'Overall Total',
    period: language === 'ar' ? 'الفترة' : 'Period',
    printBtn: language === 'ar' ? 'طباعة' : 'Print',
    cancel: language === 'ar' ? 'إلغاء' : 'Cancel',
    printSuccess: language === 'ar' ? 'تم إرسال التقرير للطباعة' : 'Report sent to printer',
    currency: language === 'ar' ? 'د.ك' : 'KWD',
    noInvoices: language === 'ar' ? 'لا توجد فواتير في هذه الفترة' : 'No invoices for this period',
  };

  // Initialize period options
  useEffect(() => {
    const options = generateMonthOptions(language === 'ar' ? 'ar-KW' : 'en-US');
    setPeriodOptions(options);
    
    // Set default to current month
    if (options.length > 0 && !selectedPeriod) {
      setSelectedPeriod(options[0].value);
    }
  }, [language, open]);

  // Generate month options
  const generateMonthOptions = (locale: string) => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      const label = date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
      const value = `${year}-${month}`;
      
      options.push({ label, value });
    }
    
    return options;
  };

  // Get month-year display string
  const getMonthYearDisplay = (periodValue: string) => {
    if (!periodValue) return '';
    
    const [year, month] = periodValue.split('-').map(Number);
    const date = new Date(year, month, 1);
    return getMonthYearString(date, language === 'ar' ? 'ar-KW' : 'en-US');
  };

  // Filter invoices by selected period
  useEffect(() => {
    if (!selectedPeriod || invoices.length === 0) return;
    
    const [year, month] = selectedPeriod.split('-').map(Number);
    
    // Filter invoices for the selected month
    const filtered = invoices.filter(invoice => {
      const date = new Date(invoice.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
    
    setFilteredInvoices(filtered);
    
    // Calculate summary by company
    const summary: CompanySummary[] = [];
    const companyMap = new Map<string, CompanySummary>();
    
    filtered.forEach(invoice => {
      if (!companyMap.has(invoice.companyName)) {
        companyMap.set(invoice.companyName, {
          name: invoice.companyName,
          color: invoice.color,
          invoices: [],
          total: 0
        });
      }
      
      const company = companyMap.get(invoice.companyName)!;
      company.invoices.push(invoice);
      company.total += invoice.invoiceAmount;
    });
    
    const data = Array.from(companyMap.values());
    setSummaryData(data);
    
    // Calculate overall total
    const total = data.reduce((sum, company) => sum + company.total, 0);
    setTotalAmount(total);
    
  }, [selectedPeriod, invoices]);

  // Handle print
  const handlePrint = () => {
    setIsPrinting(true);
    
    setTimeout(() => {
      const printContent = printRef.current;
      const originalContent = document.body.innerHTML;
      
      if (printContent) {
        const printWindow = window.open('', '_blank');
        
        if (printWindow) {
          // Set up print document
          printWindow.document.open();
          printWindow.document.write(`
            <html dir="${isRtl ? 'rtl' : 'ltr'}">
              <head>
                <title>${translations.supplierInvoiceReport}</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    margin: 20mm;
                    padding: 0;
                    direction: ${isRtl ? 'rtl' : 'ltr'};
                  }
                  .print-container {
                    width: 100%;
                  }
                  .header {
                    text-align: center;
                    margin-bottom: 20px;
                  }
                  .logo {
                    max-width: 120px;
                    margin: 0 auto;
                    display: block;
                  }
                  h1 {
                    font-size: 20px;
                    margin: 10px 0;
                    color: #333;
                  }
                  .period {
                    font-size: 16px;
                    margin-bottom: 20px;
                    text-align: center;
                    color: #666;
                  }
                  table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                  }
                  table, th, td {
                    border: 1px solid #ddd;
                  }
                  th, td {
                    padding: 8px;
                    text-align: ${isRtl ? 'right' : 'left'};
                  }
                  th {
                    background-color: #f2f2f2;
                  }
                  .section-title {
                    font-size: 16px;
                    margin: 25px 0 10px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #ccc;
                  }
                  .total-row td {
                    font-weight: bold;
                    background-color: #f9f9f9;
                  }
                  .company-tag {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    margin-${isRtl ? 'left' : 'right'}: 5px;
                  }
                  @media print {
                    body {
                      -webkit-print-color-adjust: exact;
                      print-color-adjust: exact;
                    }
                  }
                </style>
              </head>
              <body>
                <div class="print-container">
                  ${printContent.innerHTML}
                </div>
                <script>
                  setTimeout(function() {
                    window.print();
                    window.close();
                  }, 500);
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
          
          toast.success(translations.printSuccess);
        }
      }
      
      setIsPrinting(false);
      onOpenChange(false);
    }, 500);
  };

  // Get period label
  const getPeriodLabel = () => {
    const option = periodOptions.find(opt => opt.value === selectedPeriod);
    return option ? option.label : '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{translations.printReport}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1">
            <Label htmlFor="print-period-select" className="mb-1 block">
              {translations.selectPeriod}
            </Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger id="print-period-select">
                <SelectValue placeholder={translations.selectPeriod} />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-6 border p-4 rounded-md max-h-[400px] overflow-y-auto">
            <div ref={printRef} className="print-preview">
              {/* This content will be printed */}
              <div className="header">
                <div className="logo-container" style={{ textAlign: 'center', marginBottom: '10px' }}>
                  <MoenLogo className="logo" style={{ width: '120px', margin: '0 auto' }} />
                </div>
                <h1 style={{ textAlign: 'center', marginBottom: '5px' }}>
                  {translations.supplierInvoiceReport}
                </h1>
                <div className="period">
                  {translations.period}: {getPeriodLabel()}
                </div>
              </div>
              
              {filteredInvoices.length > 0 ? (
                <>
                  {/* Company Totals Table */}
                  <h2 className="section-title">{translations.companyTotals}</h2>
                  <table className="summary-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '8px', backgroundColor: '#f2f2f2', border: '1px solid #ddd', textAlign: isRtl ? 'right' : 'left' }}>
                          {translations.companyName}
                        </th>
                        <th style={{ padding: '8px', backgroundColor: '#f2f2f2', border: '1px solid #ddd', textAlign: isRtl ? 'right' : 'left' }}>
                          {translations.invoiceAmount}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryData.map((company) => (
                        <tr key={company.name}>
                          <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: isRtl ? 'right' : 'left' }}>
                            <span 
                              className="company-tag" 
                              style={{ 
                                display: 'inline-block', 
                                width: '10px', 
                                height: '10px', 
                                borderRadius: '50%', 
                                marginRight: '5px',
                                backgroundColor: company.color 
                              }}
                            ></span>
                            {company.name}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: isRtl ? 'right' : 'left' }}>
                            {company.total.toFixed(3)} {translations.currency}
                          </td>
                        </tr>
                      ))}
                      <tr className="total-row">
                        <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold', backgroundColor: '#f9f9f9', textAlign: isRtl ? 'right' : 'left' }}>
                          {translations.overallTotal}
                        </td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold', backgroundColor: '#f9f9f9', textAlign: isRtl ? 'right' : 'left' }}>
                          {totalAmount.toFixed(3)} {translations.currency}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Invoice Details Table */}
                  <h2 className="section-title">{translations.invoiceDetails}</h2>
                  <table className="details-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '8px', backgroundColor: '#f2f2f2', border: '1px solid #ddd', textAlign: isRtl ? 'right' : 'left' }}>
                          {translations.companyName}
                        </th>
                        <th style={{ padding: '8px', backgroundColor: '#f2f2f2', border: '1px solid #ddd', textAlign: isRtl ? 'right' : 'left' }}>
                          {translations.invoiceNumber}
                        </th>
                        <th style={{ padding: '8px', backgroundColor: '#f2f2f2', border: '1px solid #ddd', textAlign: isRtl ? 'right' : 'left' }}>
                          {translations.invoiceDate}
                        </th>
                        <th style={{ padding: '8px', backgroundColor: '#f2f2f2', border: '1px solid #ddd', textAlign: isRtl ? 'right' : 'left' }}>
                          {translations.invoiceAmount}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: isRtl ? 'right' : 'left' }}>
                            <span 
                              className="company-tag" 
                              style={{ 
                                display: 'inline-block', 
                                width: '10px', 
                                height: '10px', 
                                borderRadius: '50%', 
                                marginRight: '5px',
                                backgroundColor: invoice.color 
                              }}
                            ></span>
                            {invoice.companyName}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: isRtl ? 'right' : 'left' }}>
                            {invoice.invoiceNumber}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: isRtl ? 'right' : 'left' }}>
                            {formatDate(invoice.date, language === 'ar' ? 'ar-KW' : 'en-US')}
                          </td>
                          <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: isRtl ? 'right' : 'left' }}>
                            {invoice.invoiceAmount.toFixed(3)} {translations.currency}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                  {translations.noInvoices}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {translations.cancel}
          </Button>
          <Button 
            onClick={handlePrint} 
            disabled={filteredInvoices.length === 0 || isPrinting}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Printer className="h-4 w-4" />
            {translations.printBtn}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
