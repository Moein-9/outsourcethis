import React, { useState, useEffect, useMemo } from "react";
import { format, subDays, startOfMonth, endOfMonth, parseISO, isWithinInterval, differenceInDays } from "date-fns";
import { useInvoiceStore, Invoice, Refund } from "@/store/invoiceStore";
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
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  MapPin, 
  Store, 
  Phone, 
  RefreshCcw, 
  CreditCard, 
  Receipt, 
  Calendar,
  Info
} from "lucide-react";
import { PrintService } from "@/utils/PrintService";
import { PrintReportButton } from "./PrintReportButton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const STORE_INFO = {
  name: {
    en: "Moein Optical",
    ar: "نظارات المعين"
  },
  logo: "/lovable-uploads/826ece02-80b8-482d-a2be-8292f3460297.png",
  address: {
    en: "123 Vision Street, Kuwait City",
    ar: "١٢٣ شارع الرؤية، مدينة الكويت"
  },
  phone: "+965 1234 5678"
};

const CHART_COLORS = {
  sales: "#22c55e",
  refunds: "#ef4444",
  lens: "#8B5CF6",
  frame: "#F97316",
  coating: "#0EA5E9"
};

interface ComparativeAnalysisProps {
  className?: string;
}

const ComparativeAnalysis: React.FC<ComparativeAnalysisProps> = ({ className }) => {
  const invoiceStore = useInvoiceStore();
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  const invoices: Invoice[] = useMemo(() => {
    return invoiceStore?.invoices || [];
  }, [invoiceStore?.invoices]);
  
  const refunds: Refund[] = useMemo(() => {
    return invoiceStore?.refunds || [];
  }, [invoiceStore?.refunds]);
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState<"week" | "month" | "custom">("week");
  const [salesData, setSalesData] = useState<any[]>([]);
  const [productSalesData, setProductSalesData] = useState<any[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalRefunds, setTotalRefunds] = useState(0);
  const [netRevenue, setNetRevenue] = useState(0);
  const [averageDailySales, setAverageDailySales] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [refundCount, setRefundCount] = useState(0);
  const [selectedBarIndex, setSelectedBarIndex] = useState(-1);
  
  const translations = {
    comparativeAnalysis: language === 'ar' ? "التحليل المقارن | Comparative Analysis" : "Comparative Analysis | التحليل المقارن",
    timeRange: language === 'ar' ? "المدى الزمني | Time Range" : "Time Range | المدى الزمني",
    lastWeek: language === 'ar' ? "الأسبوع الماضي | Last Week" : "Last Week | الأسبوع الماضي",
    lastMonth: language === 'ar' ? "الشهر الماضي | Last Month" : "Last Month | الشهر الماضي",
    customRange: language === 'ar' ? "مدى مخصص | Custom Range" : "Custom Range | مدى مخصص",
    selectRange: language === 'ar' ? "اختر مدى | Select Range" : "Select Range | اختر مدى",
    totalSales: language === 'ar' ? "إجمالي المبيعات | Total Sales" : "Total Sales | إجمالي المبيعات",
    averageDailySales: language === 'ar' ? "متوسط المبيعات اليومية | Average Daily Sales" : "Average Daily Sales | متوسط المبيعات اليومية",
    transactionCount: language === 'ar' ? "عدد المعاملات | Transaction Count" : "Transaction Count | عدد المعاملات",
    salesTrend: language === 'ar' ? "اتجاه المبيعات | Sales Trend" : "Sales Trend | اتجاه المبي��ات",
    productSales: language === 'ar' ? "مبيعات المنتجات | Product Sales" : "Product Sales | مبيعات المنتجات",
    lensSales: language === 'ar' ? "مبيعات العدسات | Lens Sales" : "Lens Sales | مبيعات العدسات",
    frameSales: language === 'ar' ? "مبيعات الإطارات | Frame Sales" : "Frame Sales | مبيعات الإطارات",
    coatingSales: language === 'ar' ? "مبيعات الطلاءات | Coating Sales" : "Coating Sales | مبيعات الطلاءات",
    currency: language === 'ar' ? "د.ك | KWD" : "KWD | د.ك",
    printReport: language === 'ar' ? "طباعة التقرير | Print Report" : "Print Report | طباعة التقرير",
    noDataAvailable: language === 'ar' ? "لا توجد بيانات متاحة | No data available" : "No data available | لا توجد بيانات متاحة",
    totalRefunds: language === 'ar' ? "إجمالي المستردات | Total Refunds" : "Total Refunds | إجمالي المستردات",
    refundCount: language === 'ar' ? "عدد المستردات | Refund Count" : "Refund Count | عدد المستردات",
    netRevenue: language === 'ar' ? "صافي الإيرادات | Net Revenue" : "Net Revenue | صافي الإيرادات",
  };
  
  useEffect(() => {
    if (selectedTimeRange === "week") {
      const endDate = new Date();
      const startDate = subDays(endDate, 7);
      setDate({ from: startDate, to: endDate });
    } else if (selectedTimeRange === "month") {
      const currentDate = new Date();
      const startDate = startOfMonth(currentDate);
      const endDate = endOfMonth(currentDate);
      setDate({ from: startDate, to: endDate });
    }
  }, [selectedTimeRange]);
  
  useEffect(() => {
    if (!date?.from || !date?.to) return;
    
    const startDate = date.from;
    const endDate = date.to;
    
    const filteredInvoices = invoices.filter(invoice => {
      const invoiceDate = parseISO(invoice.createdAt);
      return isWithinInterval(invoiceDate, { start: startDate, end: endDate });
    });
    
    const filteredRefunds = refunds.filter(refund => {
      const refundDate = parseISO(refund.date);
      return isWithinInterval(refundDate, { start: startDate, end: endDate });
    });
    
    const dailySales: { [key: string]: { sales: number, refunds: number } } = {};
    let total = 0;
    let refundTotal = 0;
    
    const dateRange = Math.abs(differenceInDays(startDate, endDate)) + 1;
    for (let i = 0; i < dateRange; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      dailySales[dateKey] = { sales: 0, refunds: 0 };
    }
    
    filteredInvoices.forEach(invoice => {
      const dateKey = format(parseISO(invoice.createdAt), 'yyyy-MM-dd');
      dailySales[dateKey].sales = (dailySales[dateKey]?.sales || 0) + invoice.total;
      total += invoice.total;
    });
    
    filteredRefunds.forEach(refund => {
      const dateKey = format(parseISO(refund.date), 'yyyy-MM-dd');
      dailySales[dateKey].refunds = (dailySales[dateKey]?.refunds || 0) + refund.amount;
      refundTotal += refund.amount;
    });
    
    const chartData = Object.entries(dailySales)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, data]) => ({
        date,
        displayDate: format(new Date(date), 'MMM dd'),
        sales: data.sales,
        refunds: data.refunds,
        net: data.sales - data.refunds
      }));
    
    setSalesData(chartData);
    
    const lensSales = filteredInvoices.reduce((sum, invoice) => sum + invoice.lensPrice, 0);
    const frameSales = filteredInvoices.reduce((sum, invoice) => sum + invoice.framePrice, 0);
    const coatingSales = filteredInvoices.reduce((sum, invoice) => sum + invoice.coatingPrice, 0);
    
    setProductSalesData([
      { name: language === 'ar' ? 'العدسات' : 'Lenses', sales: lensSales, color: CHART_COLORS.lens },
      { name: language === 'ar' ? 'الإطارات' : 'Frames', sales: frameSales, color: CHART_COLORS.frame },
      { name: language === 'ar' ? 'الطلاءات' : 'Coatings', sales: coatingSales, color: CHART_COLORS.coating },
    ]);
    
    setTotalSales(total);
    setTotalRefunds(refundTotal);
    setNetRevenue(total - refundTotal);
    setTransactionCount(filteredInvoices.length);
    setRefundCount(filteredRefunds.length);
    
    const numberOfDays = Math.max(1, Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
    ));
    setAverageDailySales((total - refundTotal) / numberOfDays);
  }, [date, invoices, refunds, language]);
  
  const handleTimeRangeChange = (value: "week" | "month" | "custom") => {
    setSelectedTimeRange(value);
  };
  
  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    if (newDateRange) {
      setDate(newDateRange);
      setSelectedTimeRange("custom");
    }
  };
  
  const handlePrintReport = () => {
    const { language } = useLanguageStore();
    
    const timeRangeText = language === 'ar' ? 'الفترة الزمنية | Time Period' : 'Time Period | الفترة الزمنية';
    const dateRange = language === 'ar' ? 'نطاق التاريخ | Date Range' : 'Date Range | نطاق التاريخ';
    const pageTitle = language === 'ar' ? 'تقرير التحليل المقارن | Comparative Analysis Report' : 'Comparative Analysis Report | تقرير التحليل المقارن';
    
    const storeInfo = `
      <div class="store-header">
        <div class="store-logo">
          <img src="${STORE_INFO.logo}" alt="${STORE_INFO.name[language === 'ar' ? 'ar' : 'en']}" />
        </div>
        <div class="store-info">
          <p class="store-name"><strong>${STORE_INFO.name[language === 'ar' ? 'ar' : 'en']}</strong></p>
          <p class="store-address">${STORE_INFO.address[language === 'ar' ? 'ar' : 'en']}</p>
          <p class="store-phone">${STORE_INFO.phone}</p>
        </div>
      </div>
    `;
    
    const dateRangeDisplay = date?.from && date?.to ? 
      `${format(date.from, 'MM/dd/yyyy')} - ${format(date.to, 'MM/dd/yyyy')}` : 
      language === 'ar' ? 'غير محدد | Not specified' : 'Not specified | غير محدد';
    
    const productAnalysis = `
      <div class="summary-item-row">
        <span class="summary-item-title">${language === 'ar' ? 'مبيعات العدسات | Lens Sales' : 'Lens Sales | مبيعات العدسات'}:</span>
        <span class="summary-item-value">${productSalesData.find(item => 
          item.name === translations.lensSales)?.sales.toFixed(2) || '0.00'} ${language === 'ar' ? 'د.ك | KWD' : 'KWD | د.ك'}</span>
      </div>
      <div class="summary-item-row">
        <span class="summary-item-title">${language === 'ar' ? 'مبيعات الإطارات | Frame Sales' : 'Frame Sales | مبيعات الإطارات'}:</span>
        <span class="summary-item-value">${productSalesData.find(item => 
          item.name === translations.frameSales)?.sales.toFixed(2) || '0.00'} ${language === 'ar' ? 'د.ك | KWD' : 'KWD | د.ك'}</span>
      </div>
      <div class="summary-item-row">
        <span class="summary-item-title">${language === 'ar' ? 'مبيعات الطلاءات | Coating Sales' : 'Coating Sales | مبيعات الطلاءات'}:</span>
        <span class="summary-item-value">${productSalesData.find(item => 
          item.name === translations.coatingSales)?.sales.toFixed(2) || '0.00'} ${language === 'ar' ? 'د.ك | KWD' : 'KWD | د.ك'}</span>
      </div>
    `;
    
    const refundAnalysis = `
      <div class="section-title">${language === 'ar' ? 'معلومات المستردات | Refund Information' : 'Refund Information | معلومات المستردات'}</div>
      <div class="summary-item">
        <div class="summary-item-row">
          <span class="summary-item-title">${language === 'ar' ? 'إجمالي المستردات | Total Refunds' : 'Total Refunds | إجمالي المستردات'}:</span>
          <span class="summary-item-value">${totalRefunds.toFixed(2)} ${language === 'ar' ? 'د.ك | KWD' : 'KWD | د.ك'}</span>
        </div>
        <div class="summary-item-row">
          <span class="summary-item-title">${language === 'ar' ? 'عدد المستردات | Refund Count' : 'Refund Count | عدد المستردات'}:</span>
          <span class="summary-item-value">${refundCount}</span>
        </div>
      </div>
    `;
    
    const reportContent = `
      ${storeInfo}
      
      <div class="report-header">
        <div class="report-title">${pageTitle}</div>
        <div class="report-date">${language === 'ar' ? 'تاريخ الطباعة | Print Date' : 'Print Date | تاريخ الطباعة'}: ${format(new Date(), 'MM/dd/yyyy')}</div>
      </div>
      
      <div class="summary-section">
        <div class="section-title">${language === 'ar' ? 'معلومات التقرير | Report Information' : 'Report Information | معلومات التقرير'}</div>
        <div class="summary-item">
          <div class="summary-item-row">
            <span class="summary-item-title">${timeRangeText}:</span>
            <span class="summary-item-value">${dateRangeDisplay}</span>
          </div>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div class="summary-section">
        <div class="section-title">${language === 'ar' ? 'ملخص المبيعات | Sales Summary' : 'Sales Summary | ملخص المبيعات'}</div>
        <div class="summary-item">
          <div class="summary-item-row">
            <span class="summary-item-title">${language === 'ar' ? 'إجمالي المبيعات | Total Sales' : 'Total Sales | إجمالي المبيعات'}:</span>
            <span class="summary-item-value">${totalSales.toFixed(2)} ${language === 'ar' ? 'د.ك | KWD' : 'KWD | د.ك'}</span>
          </div>
          <div class="summary-item-row highlight-row">
            <span class="summary-item-title">${language === 'ar' ? 'صافي الإيرادات | Net Revenue' : 'Net Revenue | صافي الإيرادات'}:</span>
            <span class="summary-item-value">${netRevenue.toFixed(2)} ${language === 'ar' ? 'د.ك | KWD' : 'KWD | د.ك'}</span>
          </div>
          <div class="summary-item-row">
            <span class="summary-item-title">${language === 'ar' ? 'متوسط ​​المبيعات اليومي | Average Daily Sales' : 'Average Daily Sales | متوسط ​​المبيعات اليومي'}:</span>
            <span class="summary-item-value">${averageDailySales.toFixed(2)} ${language === 'ar' ? 'د.ك | KWD' : 'KWD | د.ك'}</span>
          </div>
          <div class="summary-item-row">
            <span class="summary-item-title">${language === 'ar' ? 'عدد المعاملات | Transaction Count' : 'Transaction Count | عدد المعاملات'}:</span>
            <span class="summary-item-value">${transactionCount}</span>
          </div>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div class="summary-section">
        ${refundAnalysis}
      </div>
      
      <div class="divider"></div>
      
      <div class="summary-section">
        <div class="section-title">${language === 'ar' ? 'تحليل المنتج | Product Analysis' : 'Product Analysis | تحليل المنتج'}</div>
        <div class="summary-item">
          ${productAnalysis}
        </div>
      </div>
      
      <div class="footer">
        <p>${language === 'ar' 
          ? `© ${new Date().getFullYear()} نظارات المعين - جميع الحقوق محفوظة | Moein Optical - All rights reserved`
          : `© ${new Date().getFullYear()} Moein Optical - All rights reserved | نظارات المعين - جميع الحقوق محفوظة`}</p>
      </div>
    `;
    
    const printCss = `
      <style>
        @page {
          size: 80mm auto;
          margin: 0;
        }
        
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          width: 76mm;
          max-width: 76mm;
        }
        
        .store-header {
          text-align: center;
          margin-bottom: 10px;
          padding: 5px;
          border-bottom: 1px solid #000;
        }
        
        .store-logo {
          margin: 0 auto;
          width: 100%;
          max-height: 60px;
          text-align: center;
          margin-bottom: 5px;
        }
        
        .store-logo img {
          height: 50px;
          width: auto;
        }
        
        .store-name {
          font-size: 18px;
          font-weight: bold;
          margin: 5px 0;
        }
        
        .store-address, .store-phone {
          font-size: 14px;
          margin: 3px 0;
        }
        
        .report-header {
          text-align: center;
          margin-bottom: 15px;
          padding: 5px;
        }
        
        .report-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
          padding: 3px 0;
          border-bottom: 1px dashed #000;
          border-top: 1px dashed #000;
        }
        
        .report-date {
          font-size: 14px;
          margin-top: 5px;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: bold;
          background-color: #eee;
          padding: 5px;
          margin-bottom: 10px;
          text-align: center;
          border-radius: 3px;
        }
        
        .summary-section {
          margin-bottom: 15px;
          padding: 0 5px;
        }
        
        .summary-item-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .highlight-row {
          font-weight: bold;
          font-size: 16px;
          background-color: #f3f3f3;
          padding: 3px 5px;
          border-radius: 3px;
        }
        
        .summary-item-title {
          font-weight: bold;
        }
        
        .summary-item-value {
          font-weight: bold;
          margin-left: 10px;
        }
        
        .divider {
          border-top: 1px dashed #000;
          margin: 10px 0;
        }
        
        .footer {
          text-align: center;
          font-size: 12px;
          margin-top: 15px;
          padding-top: 5px;
          border-top: 1px solid #000;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
          font-size: 14px;
        }
        
        th, td {
          padding: 6px 4px;
          text-align: left;
          font-size: 14px;
        }
        
        th {
          border-bottom: 1px solid #ddd;
          font-weight: bold;
        }
        
        tr {
          border-bottom: 1px dashed #eee;
        }
        
        * {
          box-sizing: border-box;
        }
      </style>
    `;
    
    PrintService.printReport(reportContent + printCss, pageTitle, () => {
      toast.success(language === 'ar' ? 'تم إرسال التقرير للطباعة' : 'Report sent to printer');
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-KW' : 'en-KW', { 
      style: 'currency', 
      currency: 'KWD',
      maximumFractionDigits: 2 
    }).format(value);
  };
  
  const handleBarClick = (data: any, index: number) => {
    setSelectedBarIndex(index === selectedBarIndex ? -1 : index);
  };
  
  const hasData = salesData.length > 0;
  
  return (
    <div 
      className={`space-y-4 ${className}`} 
      style={{ direction: isRtl ? 'rtl' : 'ltr' }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {translations.comparativeAnalysis}
            </span>
            <div className="hidden sm:flex items-center text-sm text-muted-foreground gap-1">
              <Store className="h-4 w-4" />
              <span>{STORE_INFO.name[language === 'ar' ? 'ar' : 'en']}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-full sm:w-auto">
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
            </div>
            
            <div className="w-full sm:w-auto">
              <DatePicker
                date={date}
                onSelect={handleDateRangeChange}
                defaultMonth={date?.from}
                className="w-full sm:w-auto"
              />
            </div>
            
            <div className="w-full sm:w-auto sm:ml-auto">
              <PrintReportButton 
                onPrint={handlePrintReport} 
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            {translations.totalSales}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 border rounded-lg bg-white shadow-sm">
              <p className="text-sm font-semibold mb-1">{translations.totalSales}</p>
              <p className="text-3xl font-bold">
                {formatCurrency(totalSales)}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-white shadow-sm">
              <p className="text-sm font-semibold mb-1">{translations.averageDailySales}</p>
              <p className="text-3xl font-bold">
                {formatCurrency(averageDailySales)}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-white shadow-sm">
              <p className="text-sm font-semibold mb-1">{translations.transactionCount}</p>
              <p className="text-3xl font-bold">{transactionCount}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-white shadow-sm border-red-200">
              <div className="flex items-center gap-1 text-sm font-semibold mb-1 text-red-600">
                <RefreshCcw className="h-4 w-4" />
                <p>{translations.totalRefunds}</p>
              </div>
              <p className="text-3xl font-bold text-red-600">
                -{formatCurrency(totalRefunds)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{translations.refundCount}: {refundCount}</p>
            </div>
            <div className="md:col-span-2 p-4 border rounded-lg bg-white shadow-sm border-green-200">
              <div className="flex items-center gap-1 text-sm font-semibold mb-1 text-green-600">
                <Receipt className="h-4 w-4" />
                <p>{translations.netRevenue}</p>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(netRevenue)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5" />
                {translations.salesTrend}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{language === 'ar' 
                      ? 'انقر على النقاط لعرض التفاصيل' 
                      : 'Click on dots to see details'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {hasData ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart 
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="displayDate" 
                    angle={-45} 
                    textAnchor="end" 
                    height={60}
                    tickMargin={15}
                    interval={0}
                    reversed={isRtl}
                  />
                  <YAxis />
                  <RechartsTooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => format(new Date(salesData.find(item => item.displayDate === label)?.date || new Date()), 'PPP')}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    name={language === 'ar' ? 'المبيعات' : 'Sales'}
                    stroke={CHART_COLORS.sales}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8, onClick: (e: any) => console.log('clicked', e) }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="refunds" 
                    name={language === 'ar' ? 'المستردات' : 'Refunds'}
                    stroke={CHART_COLORS.refunds} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="net" 
                    name={language === 'ar' ? 'صافي' : 'Net'}
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-center text-muted-foreground">
                  {translations.noDataAvailable}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {translations.productSales}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{language === 'ar' 
                      ? 'انقر على الأعمدة لعرض التفاصيل' 
                      : 'Click on bars to see details'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {productSalesData.length > 0 && productSalesData.some(item => item.sales > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={productSalesData} 
                  margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
                  layout={isRtl ? "vertical" : "horizontal"}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  {isRtl ? (
                    <>
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false}
                        tickLine={false}
                        width={80}
                      />
                      <XAxis 
                        type="number"
                        domain={[0, 'dataMax']}
                      />
                    </>
                  ) : (
                    <>
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                      />
                      <YAxis />
                    </>
                  )}
                  <RechartsTooltip 
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar 
                    dataKey="sales" 
                    name={language === 'ar' ? 'المبيعات' : 'Sales'}
                    radius={[4, 4, 0, 0]}
                    onClick={handleBarClick}
                  >
                    {productSalesData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke={entry.color}
                        opacity={selectedBarIndex === -1 || selectedBarIndex === index ? 1 : 0.5}
                        strokeWidth={selectedBarIndex === index ? 2 : 0}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-center text-muted-foreground">
                  {translations.noDataAvailable}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparativeAnalysis;
