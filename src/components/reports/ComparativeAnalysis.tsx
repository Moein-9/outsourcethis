
import React, { useState, useEffect } from "react";
import { format, subDays, startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";
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
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart3, LineChart as LineChartIcon, MapPin, Store, Phone, RefreshCcw, CreditCard, Receipt } from "lucide-react";
import { PrintService } from "@/utils/PrintService";
import { PrintReportButton } from "./PrintReportButton";
import { MoenLogo } from "@/assets/logo";

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

interface ComparativeAnalysisProps {
  className?: string;
}

const ComparativeAnalysis: React.FC<ComparativeAnalysisProps> = ({ className }) => {
  const invoiceStore = useInvoiceStore();
  const { language } = useLanguageStore();
  const invoices: Invoice[] = invoiceStore?.invoices || [];
  const refunds: Refund[] = invoiceStore?.refunds || [];
  const isRtl = language === 'ar';
  
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
    salesTrend: language === 'ar' ? "اتجاه المبيعات | Sales Trend" : "Sales Trend | اتجاه المبيعات",
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
    
    const filteredRefunds = refunds.filter(refund => {
      const refundDate = parseISO(refund.date);
      return isWithinInterval(refundDate, { start: startDate, end: endDate });
    });
    
    const dailySales: { [key: string]: number } = {};
    let total = 0;
    let refundTotal = 0;
    
    filteredInvoices.forEach(invoice => {
      const dateKey = format(parseISO(invoice.createdAt), 'yyyy-MM-dd');
      dailySales[dateKey] = (dailySales[dateKey] || 0) + invoice.total;
      total += invoice.total;
    });
    
    // Calculate refund totals
    filteredRefunds.forEach(refund => {
      const dateKey = format(parseISO(refund.date), 'yyyy-MM-dd');
      dailySales[dateKey] = (dailySales[dateKey] || 0) - refund.amount; // Subtract refunds from daily sales
      refundTotal += refund.amount;
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
    setTotalRefunds(refundTotal);
    setNetRevenue(total - refundTotal);
    setTransactionCount(filteredInvoices.length);
    setRefundCount(filteredRefunds.length);
    
    const numberOfDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
    );
    setAverageDailySales((total - refundTotal) / numberOfDays);
  }, [date, invoices, refunds, selectedTimeRange, translations]);
  
  const handleTimeRangeChange = (value: "week" | "month" | "custom") => {
    setSelectedTimeRange(value);
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
    
    // Add refund section
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

  return (
    <div className={`space-y-4 ${className} ${isRtl ? 'rtl' : 'ltr'}`} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
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
          <CardContent className="px-1 sm:px-4">
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" angle={-45} textAnchor="end" height={50} />
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
          <CardContent className="px-1 sm:px-4">
            {productSalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productSalesData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 border rounded-lg bg-white shadow-sm">
              <p className="text-sm font-semibold mb-1">{translations.totalSales}</p>
              <p className="text-3xl font-bold">
                {totalSales.toFixed(2)} {translations.currency}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-white shadow-sm">
              <p className="text-sm font-semibold mb-1">{translations.averageDailySales}</p>
              <p className="text-3xl font-bold">
                {averageDailySales.toFixed(2)} {translations.currency}
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-white shadow-sm">
              <p className="text-sm font-semibold mb-1">{translations.transactionCount}</p>
              <p className="text-3xl font-bold">{transactionCount}</p>
            </div>
          </div>
          
          {/* Added Refund and Net Revenue Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-white shadow-sm border-red-200">
              <div className="flex items-center gap-1 text-sm font-semibold mb-1 text-red-600">
                <RefreshCcw className="h-4 w-4" />
                <p>{translations.totalRefunds}</p>
              </div>
              <p className="text-3xl font-bold text-red-600">
                -{totalRefunds.toFixed(2)} {translations.currency}
              </p>
              <p className="text-xs text-gray-500 mt-1">{translations.refundCount}: {refundCount}</p>
            </div>
            <div className="md:col-span-2 p-4 border rounded-lg bg-white shadow-sm border-green-200">
              <div className="flex items-center gap-1 text-sm font-semibold mb-1 text-green-600">
                <Receipt className="h-4 w-4" />
                <p>{translations.netRevenue}</p>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {netRevenue.toFixed(2)} {translations.currency}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparativeAnalysis;
