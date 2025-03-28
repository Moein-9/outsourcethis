import React, { useState, useEffect } from "react";
import { format, subDays, startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";
import { useInvoiceStore, Invoice } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { DateRange } from "react-day-picker";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart3, LineChart as LineChartIcon, MapPin, Store, Phone } from "lucide-react";
import { PrintService } from "@/utils/PrintService";
import { PrintReportButton } from "./PrintReportButton";

const STORE_INFO = {
  name: {
    en: "Optical Center",
    ar: "المركز البصري"
  },
  logo: "/lovable-uploads/826ece02-80b8-482d-a2be-8292f3460297.png",
  address: {
    en: "123 Vision Street, Kuwait City",
    ar: "١٢٣ شارع الرؤية، مدينة الكويت"
  },
  phone: "+965 1234 5678"
};

interface ComparativeAnalysisProps {
  className?: string;
}

const ComparativeAnalysis: React.FC<ComparativeAnalysisProps> = ({ className }) => {
  const invoiceStore = useInvoiceStore();
  const { language } = useLanguageStore();
  const invoices: Invoice[] = invoiceStore?.invoices || [];
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState<"week" | "month" | "custom">("week");
  const [salesData, setSalesData] = useState<any[]>([]);
  const [productSalesData, setProductSalesData] = useState<any[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [averageDailySales, setAverageDailySales] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  
  const translations = {
    comparativeAnalysis: language === 'ar' ? "التحليل المقارن" : "Comparative Analysis",
    timeRange: language === 'ar' ? "المدى الزمني" : "Time Range",
    lastWeek: language === 'ar' ? "الأسبوع الماضي" : "Last Week",
    lastMonth: language === 'ar' ? "الشهر الماضي" : "Last Month",
    customRange: language === 'ar' ? "مدى مخصص" : "Custom Range",
    selectRange: language === 'ar' ? "اختر مدى" : "Select Range",
    totalSales: language === 'ar' ? "إجمالي المبيعات" : "Total Sales",
    averageDailySales: language === 'ar' ? "متوسط المبيعات اليومية" : "Average Daily Sales",
    transactionCount: language === 'ar' ? "عدد المعاملات" : "Transaction Count",
    salesTrend: language === 'ar' ? "اتجاه المبيعات" : "Sales Trend",
    productSales: language === 'ar' ? "مبيعات المنتجات" : "Product Sales",
    lensSales: language === 'ar' ? "مبيعات العدسات" : "Lens Sales",
    frameSales: language === 'ar' ? "مبيعات الإطارات" : "Frame Sales",
    coatingSales: language === 'ar' ? "مبيعات الطلاء" : "Coating Sales",
    currency: language === 'ar' ? "د.ك" : "KWD",
    printReport: language === 'ar' ? "طباعة التقرير" : "Print Report",
    noDataAvailable: language === 'ar' ? "لا توجد بيانات متاحة" : "No data available",
  };
  
  useEffect(() => {
    let startDate: Date;
    let endDate: Date;
    
    if (selectedTimeRange === "week") {
      endDate = new Date();
      startDate = subDays(endDate, 7);
      setDate({ from: startDate, to: endDate });
    } else if (selectedTimeRange === "month") {
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
      setDate({ from: startDate, to: endDate });
    } else if (date?.from && date?.to) {
      startDate = date.from;
      endDate = date.to;
    } else {
      return;
    }
    
    const filteredInvoices = invoices.filter(invoice => {
      const invoiceDate = parseISO(invoice.createdAt);
      return isWithinInterval(invoiceDate, { start: startDate, end: endDate });
    });
    
    const dailySales: { [key: string]: number } = {};
    let total = 0;
    
    filteredInvoices.forEach(invoice => {
      const dateKey = format(parseISO(invoice.createdAt), 'yyyy-MM-dd');
      dailySales[dateKey] = (dailySales[dateKey] || 0) + invoice.total;
      total += invoice.total;
    });
    
    const chartData = Object.entries(dailySales).map(([date, sales]) => ({
      date,
      sales,
    }));
    
    setSalesData(chartData);
    
    const lensSales = filteredInvoices.reduce((sum, invoice) => sum + invoice.lensPrice, 0);
    const frameSales = filteredInvoices.reduce((sum, invoice) => sum + invoice.framePrice, 0);
    const coatingSales = filteredInvoices.reduce((sum, invoice) => sum + invoice.coatingPrice, 0);
    
    setProductSalesData([
      { name: translations.lensSales, sales: lensSales },
      { name: translations.frameSales, sales: frameSales },
      { name: translations.coatingSales, sales: coatingSales },
    ]);
    
    setTotalSales(total);
    setTransactionCount(filteredInvoices.length);
    
    const numberOfDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
    );
    setAverageDailySales(total / numberOfDays);
  }, [date, invoices, selectedTimeRange, translations]);
  
  const handleTimeRangeChange = (value: "week" | "month" | "custom") => {
    setSelectedTimeRange(value);
  };
  
  const handlePrintReport = () => {
    const { language } = useLanguageStore();
    
    const timeRangeText = language === 'ar' ? 'الفترة الزمنية' : 'Time Period';
    const dateRange = language === 'ar' ? 'نطاق التاريخ' : 'Date Range';
    const pageTitle = language === 'ar' ? 'تقرير التحليل المقارن' : 'Comparative Analysis Report';
    
    const storeInfo = `
      <div class="store-logo">
        <img src="${STORE_INFO.logo}" alt="${STORE_INFO.name[language === 'ar' ? 'ar' : 'en']}" />
      </div>
      <div class="store-info">
        <p><strong>${STORE_INFO.name[language === 'ar' ? 'ar' : 'en']}</strong></p>
        <p>${STORE_INFO.address[language === 'ar' ? 'ar' : 'en']}</p>
        <p>${STORE_INFO.phone}</p>
      </div>
    `;
    
    const dateRangeDisplay = date?.from && date?.to ? 
      `${format(date.from, 'MM/dd/yyyy')} - ${format(date.to, 'MM/dd/yyyy')}` : 
      language === 'ar' ? 'غير محدد' : 'Not specified';
    
    const productAnalysis = `
      <div class="summary-item-row">
        <span class="summary-item-title">${language === 'ar' ? 'مبيعات العدسات' : 'Lens Sales'}:</span>
        <span class="summary-item-value">${productSalesData.find(item => 
          item.name === translations.lensSales)?.sales.toFixed(2) || '0.00'} ${translations.currency}</span>
      </div>
      <div class="summary-item-row">
        <span class="summary-item-title">${language === 'ar' ? 'مبيعات الإطارات' : 'Frame Sales'}:</span>
        <span class="summary-item-value">${productSalesData.find(item => 
          item.name === translations.frameSales)?.sales.toFixed(2) || '0.00'} ${translations.currency}</span>
      </div>
      <div class="summary-item-row">
        <span class="summary-item-title">${language === 'ar' ? 'مبيعات الطلاءات' : 'Coating Sales'}:</span>
        <span class="summary-item-value">${productSalesData.find(item => 
          item.name === translations.coatingSales)?.sales.toFixed(2) || '0.00'} ${translations.currency}</span>
      </div>
    `;
    
    const reportContent = `
      ${storeInfo}
      
      <div class="report-header">
        <div class="report-title">${pageTitle}</div>
        <div class="report-date">${language === 'ar' ? 'تاريخ الطباعة' : 'Print Date'}: ${format(new Date(), 'MM/dd/yyyy')}</div>
      </div>
      
      <div class="summary-section">
        <div class="section-title">${language === 'ar' ? 'معلومات التقرير' : 'Report Information'}</div>
        <div class="summary-item">
          <div class="summary-item-row">
            <span class="summary-item-title">${timeRangeText}:</span>
            <span class="summary-item-value">${dateRangeDisplay}</span>
          </div>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div class="summary-section">
        <div class="section-title">${language === 'ar' ? 'ملخص المبيعات' : 'Sales Summary'}</div>
        <div class="summary-item">
          <div class="summary-item-row">
            <span class="summary-item-title">${language === 'ar' ? 'إجمالي المبيعات' : 'Total Sales'}:</span>
            <span class="summary-item-value">${totalSales.toFixed(2)} ${translations.currency}</span>
          </div>
          <div class="summary-item-row">
            <span class="summary-item-title">${language === 'ar' ? 'متوسط ​​المبيعات اليومي' : 'Average Daily Sales'}:</span>
            <span class="summary-item-value">${averageDailySales.toFixed(2)} ${translations.currency}</span>
          </div>
          <div class="summary-item-row">
            <span class="summary-item-title">${language === 'ar' ? 'عدد المعاملات' : 'Transaction Count'}:</span>
            <span class="summary-item-value">${transactionCount}</span>
          </div>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div class="summary-section">
        <div class="section-title">${language === 'ar' ? 'تحليل المنتج' : 'Product Analysis'}</div>
        <div class="summary-item">
          ${productAnalysis}
        </div>
      </div>
      
      <div class="footer">
        <p>${language === 'ar' 
          ? `© ${new Date().getFullYear()} نظام النظارات - جميع الحقوق محفوظة`
          : `© ${new Date().getFullYear()} Optical System - All rights reserved`}</p>
      </div>
    `;
    
    PrintService.printReport(reportContent, pageTitle, () => {
      toast.success(language === 'ar' ? 'تم إرسال التقرير للطباعة' : 'Report sent to printer');
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{translations.comparativeAnalysis}</span>
            <div className="hidden sm:flex items-center text-sm text-muted-foreground gap-1">
              <Store className="h-4 w-4" />
              <span>{STORE_INFO.name[language === 'ar' ? 'ar' : 'en']}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pl-2 pb-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Select value={selectedTimeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={translations.timeRange} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">{translations.lastWeek}</SelectItem>
                <SelectItem value="month">{translations.lastMonth}</SelectItem>
                <SelectItem value="custom">{translations.customRange}</SelectItem>
              </SelectContent>
            </Select>
            {selectedTimeRange === "custom" && (
              <DatePicker
                date={date}
                onSelect={setDate}
                defaultMonth={date?.from}
                className="w-full sm:w-auto"
              />
            )}
            <PrintReportButton onPrint={handlePrintReport} className="mt-2 sm:mt-0 w-full sm:w-auto" />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              {translations.salesTrend}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-4">
                {translations.noDataAvailable}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {translations.productSales}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productSalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productSalesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-4">
                {translations.noDataAvailable}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{translations.totalSales}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">{translations.totalSales}</p>
              <p className="text-2xl font-bold">
                {totalSales.toFixed(2)} {translations.currency}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">{translations.averageDailySales}</p>
              <p className="text-2xl font-bold">
                {averageDailySales.toFixed(2)} {translations.currency}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">{translations.transactionCount}</p>
              <p className="text-2xl font-bold">{transactionCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparativeAnalysis;
