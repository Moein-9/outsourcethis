import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, isSameMonth, isWithinInterval, isAfter, isBefore, isEqual } from "date-fns";
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Download, BarChart, LineChart, PieChart, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/store/languageStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesChart } from "./SalesChart";
import { PrintReportButton } from "./PrintReportButton";
import { useReportStore } from "@/store/reportStore";

interface DateRange {
  from: Date;
  to: Date;
}

const ComparativeAnalysis: React.FC = () => {
  const { language } = useLanguageStore();
  const [activeChart, setActiveChart] = useState("line");
  
  const {
    startDate,
    endDate,
    setComparativeDateRange,
    loadComparativeData,
    comparativeSummaries,
    comparativeLoading
  } = useReportStore();
  
  const [date, setDate] = useState<DateRange>({
    from: new Date(startDate),
    to: new Date(endDate)
  });
  
  useEffect(() => {
    if (startDate && endDate) {
      setDate({
        from: new Date(startDate),
        to: new Date(endDate)
      });
    }
  }, [startDate, endDate]);
  
  useEffect(() => {
    if (date.from && date.to) {
      setComparativeDateRange(
        format(date.from, "yyyy-MM-dd"),
        format(date.to, "yyyy-MM-dd")
      );
    }
  }, [date, setComparativeDateRange]);
  
  useEffect(() => {
    loadComparativeData();
  }, [loadComparativeData]);
  
  const isPreviousMonthDisabled = isBefore(
    startOfMonth(subMonths(date.from, 1)),
    startOfMonth(subMonths(new Date(), 12))
  );
  
  const isNextMonthDisabled = isAfter(
    endOfMonth(addMonths(date.to, 1)),
    endOfMonth(new Date())
  );
  
  const handlePreviousMonth = () => {
    if (!isPreviousMonthDisabled) {
      setDate(prev => ({
        from: subMonths(prev.from, 1),
        to: isEqual(endOfMonth(prev.from), prev.to) 
          ? endOfMonth(subMonths(prev.from, 1)) 
          : subMonths(prev.to, 1)
      }));
    }
  };
  
  const handleNextMonth = () => {
    if (!isNextMonthDisabled) {
      setDate(prev => ({
        from: addMonths(prev.from, 1),
        to: isEqual(endOfMonth(prev.from), prev.to) 
          ? endOfMonth(addMonths(prev.from, 1)) 
          : addMonths(prev.to, 1)
      }));
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KWD',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(amount);
  };
  
  const generateCSV = () => {
    if (!comparativeSummaries.length) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Comparative Sales Analysis - " + format(date.from, "yyyy-MM-dd") + " to " + format(date.to, "yyyy-MM-dd") + "\r\n\r\n";
    
    csvContent += "Date,Total Sales,Refunds,Net Sales,Glasses Count,Contacts Count,Exam Count\r\n";
    
    comparativeSummaries.forEach(day => {
      csvContent += `${day.date},${day.total_sales},${day.total_refunds},${day.net_sales},${day.glasses_sales_count},${day.contacts_sales_count},${day.exam_sales_count}\r\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `comparative_report_${format(date.from, "yyyy-MM-dd")}_to_${format(date.to, "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const prepareChartData = () => {
    return comparativeSummaries.map(day => ({
      date: day.date,
      totalSales: day.total_sales,
      refunds: day.total_refunds,
      netSales: day.net_sales,
      glasses: day.glasses_sales_count,
      contacts: day.contacts_sales_count,
      exam: day.exam_sales_count
    }));
  };
  
  const calculateStats = () => {
    if (!comparativeSummaries.length) return {
      totalSales: 0,
      totalRefunds: 0,
      netSales: 0,
      glasses: 0,
      contacts: 0,
      exam: 0,
      highestSalesDay: { date: "", amount: 0 },
      lowestSalesDay: { date: "", amount: 0 },
      averageDailySales: 0
    };
    
    const totalSales = comparativeSummaries.reduce((sum, day) => sum + day.total_sales, 0);
    const totalRefunds = comparativeSummaries.reduce((sum, day) => sum + day.total_refunds, 0);
    const netSales = comparativeSummaries.reduce((sum, day) => sum + day.net_sales, 0);
    const glasses = comparativeSummaries.reduce((sum, day) => sum + day.glasses_sales_count, 0);
    const contacts = comparativeSummaries.reduce((sum, day) => sum + day.contacts_sales_count, 0);
    const exam = comparativeSummaries.reduce((sum, day) => sum + day.exam_sales_count, 0);
    
    let highestSalesDay = { date: "", amount: 0 };
    let lowestSalesDay = { date: "", amount: Number.MAX_VALUE };
    
    comparativeSummaries.forEach(day => {
      if (day.total_sales > highestSalesDay.amount) {
        highestSalesDay = { date: day.date, amount: day.total_sales };
      }
      if (day.total_sales < lowestSalesDay.amount) {
        lowestSalesDay = { date: day.date, amount: day.total_sales };
      }
    });
    
    if (lowestSalesDay.amount === Number.MAX_VALUE) {
      lowestSalesDay = { date: "", amount: 0 };
    }
    
    const averageDailySales = comparativeSummaries.length 
      ? totalSales / comparativeSummaries.length 
      : 0;
    
    return {
      totalSales,
      totalRefunds,
      netSales,
      glasses,
      contacts,
      exam,
      highestSalesDay,
      lowestSalesDay,
      averageDailySales
    };
  };
  
  const stats = calculateStats();
  const chartData = prepareChartData();
  
  const translations = {
    comparativeAnalysis: language === 'ar' ? "التحليل المقارن" : "Comparative Analysis",
    dateRange: language === 'ar' ? "نطاق التاريخ" : "Date Range",
    from: language === 'ar' ? "من" : "From",
    to: language === 'ar' ? "إلى" : "To",
    refreshData: language === 'ar' ? "تحديث البيانات" : "Refresh Data",
    printReport: language === 'ar' ? "طباعة التقرير" : "Print Report",
    downloadCSV: language === 'ar' ? "تنزيل CSV" : "Download CSV",
    loading: language === 'ar' ? "جاري التحميل..." : "Loading...",
    noData: language === 'ar' ? "لا توجد بيانات متاحة لنطاق التاريخ المحدد" : "No data available for selected date range",
    summary: language === 'ar' ? "ملخص" : "Summary",
    totalSales: language === 'ar' ? "إجمالي المبيعات" : "Total Sales",
    refunds: language === 'ar' ? "المبالغ المستردة" : "Refunds",
    netSales: language === 'ar' ? "صافي المبيعات" : "Net Sales",
    productBreakdown: language === 'ar' ? "تحليل المنتجات" : "Product Breakdown",
    glasses: language === 'ar' ? "نظارات" : "Glasses",
    contacts: language === 'ar' ? "عدسات لاصقة" : "Contact Lenses",
    exam: language === 'ar' ? "فحص العين" : "Eye Exams",
    keyInsights: language === 'ar' ? "أبرز الرؤى" : "Key Insights",
    highestSalesDay: language === 'ar' ? "يوم الأعلى مبيعاً" : "Highest Sales Day",
    lowestSalesDay: language === 'ar' ? "يوم الأقل مبيعاً" : "Lowest Sales Day",
    averageDailySales: language === 'ar' ? "متوسط المبيعات اليومية" : "Average Daily Sales",
    chartType: language === 'ar' ? "نوع الرسم البياني" : "Chart Type",
    line: language === 'ar' ? "خط" : "Line",
    bar: language === 'ar' ? "شريط" : "Bar",
    pie: language === 'ar' ? "دائري" : "Pie",
    salesTrend: language === 'ar' ? "اتجاه المبيعات" : "Sales Trend",
  };
  
  const rtlClass = language === 'ar' ? 'rtl' : 'ltr';
  
  return (
    <div className={`space-y-6 ${rtlClass}`}>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handlePreviousMonth}
            disabled={isPreviousMonthDisabled}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-[240px]",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>
                  {date.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL d, y")} - {format(date.to, "LLL d, y")}
                      </>
                    ) : (
                      format(date.from, "LLL d, y")
                    )
                  ) : (
                    <span>{translations.dateRange}</span>
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date.from}
                selected={{
                  from: date.from,
                  to: date.to,
                }}
                onSelect={(range) => {
                  if (range?.from && range.to) {
                    setDate({ from: range.from, to: range.to });
                  } else if (range?.from) {
                    setDate({ from: range.from, to: range.from });
                  }
                }}
                numberOfMonths={2}
                disabled={(date) => {
                  const yearAgo = subMonths(new Date(), 12);
                  return isBefore(date, yearAgo) || isAfter(date, new Date());
                }}
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleNextMonth}
            disabled={isNextMonthDisabled}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={loadComparativeData}
            disabled={comparativeLoading}
          >
            <RefreshCw className={`h-4 w-4 ${comparativeLoading ? "animate-spin" : ""}`} />
            {translations.refreshData}
          </Button>
          
          <PrintReportButton 
            dateRange={{ from: date.from, to: date.to }}
            isComparative={true}
            label={translations.printReport}
            description={language === 'ar' ? 'طباعة تقرير المقارنة' : 'Print comparative report'}
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={generateCSV}
            disabled={comparativeLoading || !comparativeSummaries.length}
          >
            <Download className="h-4 w-4" />
            {translations.downloadCSV}
          </Button>
        </div>
      </div>
      
      {comparativeLoading ? (
        <div className="flex items-center justify-center p-10">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400 mr-2" />
          <span>{translations.loading}</span>
        </div>
      ) : !comparativeSummaries.length ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 text-center text-yellow-800">
          <div className="text-lg font-medium">{translations.noData}</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700">{translations.totalSales}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalSales)}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-700">{translations.refunds}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900">{formatCurrency(stats.totalRefunds)}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">{translations.netSales}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{formatCurrency(stats.netSales)}</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{translations.productBreakdown}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{translations.glasses}</span>
                    <span className="font-bold">{stats.glasses}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{translations.contacts}</span>
                    <span className="font-bold">{stats.contacts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{translations.exam}</span>
                    <span className="font-bold">{stats.exam}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{translations.keyInsights}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{translations.highestSalesDay}</span>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(stats.highestSalesDay.amount)}</div>
                      <div className="text-xs text-gray-500">
                        {stats.highestSalesDay.date ? format(new Date(stats.highestSalesDay.date), "PPP") : "-"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{translations.lowestSalesDay}</span>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(stats.lowestSalesDay.amount)}</div>
                      <div className="text-xs text-gray-500">
                        {stats.lowestSalesDay.date ? format(new Date(stats.lowestSalesDay.date), "PPP") : "-"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{translations.averageDailySales}</span>
                    <span className="font-bold">{formatCurrency(stats.averageDailySales)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-lg">{translations.salesTrend}</CardTitle>
              <Tabs defaultValue="line" value={activeChart} onValueChange={setActiveChart}>
                <TabsList>
                  <TabsTrigger value="line" className="flex items-center gap-1">
                    <LineChart className="h-4 w-4" />
                    {translations.line}
                  </TabsTrigger>
                  <TabsTrigger value="bar" className="flex items-center gap-1">
                    <BarChart className="h-4 w-4" />
                    {translations.bar}
                  </TabsTrigger>
                  <TabsTrigger value="pie" className="flex items-center gap-1">
                    <PieChart className="h-4 w-4" />
                    {translations.pie}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <SalesChart 
                  data={chartData} 
                  type={activeChart as "line" | "bar" | "pie"} 
                  language={language}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ComparativeAnalysis;
