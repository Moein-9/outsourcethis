
import React, { useState, useEffect } from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartLine, Printer, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useLanguageStore } from "@/store/languageStore";

export const ComparativeAnalysis: React.FC = () => {
  const { invoices } = useInvoiceStore();
  const { language } = useLanguageStore();
  
  const [comparisonType, setComparisonType] = useState<"day" | "month" | "year">("month");
  const [period1, setPeriod1] = useState("");
  const [period2, setPeriod2] = useState("");
  
  const [comparisonData, setComparisonData] = useState<{
    period1: { label: string; total: number; count: number };
    period2: { label: string; total: number; count: number };
    dailyData: { date: string; period1: number; period2: number }[];
    productData: { name: string; period1: number; period2: number }[];
  }>({
    period1: { label: "", total: 0, count: 0 },
    period2: { label: "", total: 0, count: 0 },
    dailyData: [],
    productData: []
  });

  // Translations
  const translations = {
    comparativeAnalysis: language === 'ar' ? "التحليل المقارن" : "Comparative Analysis",
    printReport: language === 'ar' ? "طباعة التقرير" : "Print Report",
    comparisonSettings: language === 'ar' ? "إعدادات المقارنة" : "Comparison Settings",
    comparisonType: language === 'ar' ? "نوع المقارنة" : "Comparison Type",
    dailyComparison: language === 'ar' ? "مقارنة يومية" : "Daily Comparison",
    monthlyComparison: language === 'ar' ? "مقارنة شهرية" : "Monthly Comparison",
    yearlyComparison: language === 'ar' ? "مقارنة سنوية" : "Yearly Comparison",
    firstPeriod: language === 'ar' ? "الفترة الأولى" : "First Period",
    secondPeriod: language === 'ar' ? "الفترة الثانية" : "Second Period",
    salesComparison: language === 'ar' ? "مقارنة المبيعات" : "Sales Comparison",
    salesTrends: language === 'ar' ? "اتجاهات المبيعات" : "Sales Trends",
    noDataComparison: language === 'ar' ? "لا توجد بيانات كافية للمقارنة" : "Not enough data for comparison",
    barChart: language === 'ar' ? "رسم شريطي" : "Bar Chart",
    lineChart: language === 'ar' ? "رسم خطي" : "Line Chart",
    productComparison: language === 'ar' ? "مقارنة أنواع المنتجات" : "Product Type Comparison",
    day: language === 'ar' ? "اليوم" : "Day",
    currency: language === 'ar' ? "د.ك" : "KWD",
    invoice: language === 'ar' ? "فاتورة" : "invoice",
    invoices: language === 'ar' ? "فواتير" : "invoices",
    lenses: language === 'ar' ? "العدسات" : "Lenses",
    frames: language === 'ar' ? "الإطارات" : "Frames", 
    coatings: language === 'ar' ? "الطلاءات" : "Coatings",
    total: language === 'ar' ? "الإجمالي" : "Total",
  };

  // Month names based on language
  const monthNames = language === 'ar' 
    ? ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Generate period options based on comparison type
  const generatePeriodOptions = () => {
    const options: { value: string; label: string }[] = [];
    const today = new Date();
    
    if (comparisonType === "day") {
      // Generate last 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const value = date.toISOString().split('T')[0];
        const label = date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        options.push({ value, label });
      }
    } else if (comparisonType === "month") {
      // Generate last 12 months
      for (let i = 0; i < 12; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const value = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        const label = date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { 
          year: 'numeric', 
          month: 'long' 
        });
        options.push({ value, label });
      }
    } else if (comparisonType === "year") {
      // Generate last 5 years
      for (let i = 0; i < 5; i++) {
        const year = today.getFullYear() - i;
        options.push({ value: year.toString(), label: year.toString() });
      }
    }
    
    return options;
  };
  
  const periodOptions = generatePeriodOptions();
  
  // Set default periods when comparison type changes
  useEffect(() => {
    if (periodOptions.length >= 2) {
      setPeriod1(periodOptions[0].value);
      setPeriod2(periodOptions[1].value);
    }
  }, [comparisonType, language]);
  
  // Calculate comparison data when periods change
  useEffect(() => {
    if (!period1 || !period2) return;
    
    const filterInvoicesByPeriod = (period: string) => {
      return invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.createdAt);
        
        if (comparisonType === "day") {
          const invoiceDateStr = invoiceDate.toISOString().split('T')[0];
          return invoiceDateStr === period;
        } else if (comparisonType === "month") {
          const [year, month] = period.split('-').map(Number);
          return (
            invoiceDate.getFullYear() === year && 
            invoiceDate.getMonth() + 1 === month
          );
        } else if (comparisonType === "year") {
          return invoiceDate.getFullYear().toString() === period;
        }
        
        return false;
      });
    };
    
    const period1Invoices = filterInvoicesByPeriod(period1);
    const period2Invoices = filterInvoicesByPeriod(period2);
    
    const period1Total = period1Invoices.reduce((sum, inv) => sum + inv.total, 0);
    const period2Total = period2Invoices.reduce((sum, inv) => sum + inv.total, 0);
    
    // Get daily data for chart
    const dailyData: Record<string, { period1: number; period2: number }> = {};
    
    const getDayKey = (date: Date, forPeriod: string) => {
      if (comparisonType === "day") {
        return '1'; // Only one day, so just use a constant
      } else if (comparisonType === "month") {
        return date.getDate().toString(); // Day of month
      } else {
        const month = date.getMonth() + 1;
        return month.toString(); // Month number for year comparison
      }
    };
    
    // Process period 1 invoices
    period1Invoices.forEach(invoice => {
      const date = new Date(invoice.createdAt);
      const dayKey = getDayKey(date, period1);
      
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = { period1: 0, period2: 0 };
      }
      
      dailyData[dayKey].period1 += invoice.total;
    });
    
    // Process period 2 invoices
    period2Invoices.forEach(invoice => {
      const date = new Date(invoice.createdAt);
      const dayKey = getDayKey(date, period2);
      
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = { period1: 0, period2: 0 };
      }
      
      dailyData[dayKey].period2 += invoice.total;
    });
    
    // Convert to array format for charts
    const dailyDataArray = Object.entries(dailyData).map(([date, data]) => {
      let xLabel = date;
      
      if (comparisonType === "month") {
        xLabel = language === 'ar' ? `اليوم ${date}` : `Day ${date}`;
      } else if (comparisonType === "year") {
        const monthIndex = parseInt(date) - 1;
        xLabel = monthNames[monthIndex];
      }
      
      return { 
        date: xLabel, 
        period1: data.period1, 
        period2: data.period2 
      };
    }).sort((a, b) => {
      // Sort by date for proper display
      if (comparisonType === "month") {
        const aDay = parseInt(a.date.replace(language === 'ar' ? "اليوم " : "Day ", ""));
        const bDay = parseInt(b.date.replace(language === 'ar' ? "اليوم " : "Day ", ""));
        return aDay - bDay;
      }
      return 0;
    });
    
    // Product type breakdown (lenses, frames, coatings)
    const productTypes = [
      { id: "lens", name: language === 'ar' ? "العدسات" : "Lenses" },
      { id: "frame", name: language === 'ar' ? "الإطارات" : "Frames" },
      { id: "coating", name: language === 'ar' ? "الطلاءات" : "Coatings" }
    ];
    
    const productData = productTypes.map(product => {
      let period1Value = 0;
      let period2Value = 0;
      
      if (product.id === "lens") {
        period1Value = period1Invoices.reduce((sum, inv) => sum + (inv.lensPrice || 0), 0);
        period2Value = period2Invoices.reduce((sum, inv) => sum + (inv.lensPrice || 0), 0);
      } else if (product.id === "frame") {
        period1Value = period1Invoices.reduce((sum, inv) => sum + (inv.framePrice || 0), 0);
        period2Value = period2Invoices.reduce((sum, inv) => sum + (inv.framePrice || 0), 0);
      } else if (product.id === "coating") {
        period1Value = period1Invoices.reduce((sum, inv) => sum + (inv.coatingPrice || 0), 0);
        period2Value = period2Invoices.reduce((sum, inv) => sum + (inv.coatingPrice || 0), 0);
      }
      
      return {
        name: product.name,
        period1: period1Value,
        period2: period2Value
      };
    });
    
    // Find period labels
    const period1Label = periodOptions.find(opt => opt.value === period1)?.label || period1;
    const period2Label = periodOptions.find(opt => opt.value === period2)?.label || period2;
    
    setComparisonData({
      period1: { 
        label: period1Label, 
        total: period1Total,
        count: period1Invoices.length
      },
      period2: { 
        label: period2Label, 
        total: period2Total,
        count: period2Invoices.length 
      },
      dailyData: dailyDataArray,
      productData
    });
    
  }, [period1, period2, comparisonType, invoices, language, monthNames]);
  
  // Handle print report
  const handlePrintComparison = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const comparisonTitle = language === 'ar' 
      ? (comparisonType === "day" ? "مقارنة بين يومين" : comparisonType === "month" ? "مقارنة بين شهرين" : "مقارنة بين سنتين")
      : (comparisonType === "day" ? "Comparison between two days" : comparisonType === "month" ? "Comparison between two months" : "Comparison between two years");
    
    const pageTitle = language === 'ar' 
      ? `تقرير مقارنة - ${comparisonData.period1.label} و ${comparisonData.period2.label}`
      : `Comparison Report - ${comparisonData.period1.label} and ${comparisonData.period2.label}`;
    
    let productRows = '';
    comparisonData.productData.forEach(item => {
      const diff = item.period2 - item.period1;
      const percentChange = item.period1 !== 0 
        ? ((item.period2 - item.period1) / item.period1 * 100).toFixed(1) 
        : "—";
      
      productRows += `
        <tr>
          <td>${item.name}</td>
          <td>${item.period1.toFixed(2)} ${translations.currency}</td>
          <td>${item.period2.toFixed(2)} ${translations.currency}</td>
          <td>
            ${diff > 0 ? '+' : ''}${diff.toFixed(2)} ${translations.currency}
            (${diff > 0 ? '+' : ''}${percentChange}%)
          </td>
        </tr>
      `;
    });
    
    const totalDiff = comparisonData.period2.total - comparisonData.period1.total;
    const totalPercentChange = comparisonData.period1.total !== 0 
      ? ((comparisonData.period2.total - comparisonData.period1.total) / comparisonData.period1.total * 100).toFixed(1) 
      : "—";
    
    productRows += `
      <tr class="summary-row">
        <td>${translations.total}</td>
        <td>${comparisonData.period1.total.toFixed(2)} ${translations.currency}</td>
        <td>${comparisonData.period2.total.toFixed(2)} ${translations.currency}</td>
        <td>
          ${totalDiff > 0 ? '+' : ''}${totalDiff.toFixed(2)} ${translations.currency}
          (${totalDiff > 0 ? '+' : ''}${totalPercentChange}%)
        </td>
      </tr>
    `;
    
    const summaryTitle = language === 'ar' ? "ملخص المقارنة" : "Comparison Summary";
    const detailedComparisonTitle = language === 'ar' ? "مقارنة تفصيلية للمنتجات" : "Detailed Product Comparison";
    const invoiceText = language === 'ar' ? "فاتورة" : "invoice";
    const invoicesText = language === 'ar' ? "فواتير" : "invoices";
    const footerText = language === 'ar' 
      ? `تم إنشاء هذا التقرير بواسطة نظام النظارات - جميع الحقوق محفوظة © ${new Date().getFullYear()}`
      : `Generated by Optical System - All rights reserved © ${new Date().getFullYear()}`;
    const printButtonText = language === 'ar' ? "طباعة التقرير" : "Print Report";
    
    const printContent = `
      <!DOCTYPE html>
      <html dir="${language === 'ar' ? 'rtl' : 'ltr'}">
      <head>
        <title>${pageTitle}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            direction: ${language === 'ar' ? 'rtl' : 'ltr'};
          }
          .report-header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #333;
          }
          .report-title {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }
          .report-subtitle {
            font-size: 16px;
            color: #555;
            margin-top: 5px;
          }
          .summary-section {
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ccc;
          }
          .comparison-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 20px;
          }
          .comparison-item {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #eee;
          }
          .period-label {
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px dashed #ccc;
          }
          .comparison-value {
            font-size: 24px;
            font-weight: bold;
            margin: 10px 0;
          }
          .comparison-count {
            font-size: 14px;
            color: #555;
          }
          .change {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px dashed #ccc;
          }
          .change.positive {
            color: #22c55e;
          }
          .change.negative {
            color: #ef4444;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: ${language === 'ar' ? 'right' : 'left'};
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .summary-row {
            font-weight: bold;
            background-color: #f2f2f2;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1 class="report-title">${comparisonTitle}</h1>
          <p class="report-subtitle">${comparisonData.period1.label} ${language === 'ar' ? 'و' : 'and'} ${comparisonData.period2.label}</p>
        </div>
        
        <div class="summary-section">
          <h2 class="section-title">${summaryTitle}</h2>
          <div class="comparison-grid">
            <div class="comparison-item">
              <div class="period-label">${comparisonData.period1.label}</div>
              <div class="comparison-value">${comparisonData.period1.total.toFixed(2)} ${translations.currency}</div>
              <div class="comparison-count">${comparisonData.period1.count} ${comparisonData.period1.count === 1 ? invoiceText : invoicesText}</div>
            </div>
            <div class="comparison-item">
              <div class="period-label">${comparisonData.period2.label}</div>
              <div class="comparison-value">${comparisonData.period2.total.toFixed(2)} ${translations.currency}</div>
              <div class="comparison-count">${comparisonData.period2.count} ${comparisonData.period2.count === 1 ? invoiceText : invoicesText}</div>
              <div class="${totalDiff > 0 ? 'change positive' : 'change negative'}">
                ${totalDiff > 0 ? '+' : ''}${totalDiff.toFixed(2)} ${translations.currency}
                (${totalDiff > 0 ? '+' : ''}${totalPercentChange}%)
              </div>
            </div>
          </div>
        </div>
        
        <div class="summary-section">
          <h2 class="section-title">${detailedComparisonTitle}</h2>
          <table>
            <thead>
              <tr>
                <th>${language === 'ar' ? 'نوع المنتج' : 'Product Type'}</th>
                <th>${comparisonData.period1.label}</th>
                <th>${comparisonData.period2.label}</th>
                <th>${language === 'ar' ? 'التغيير' : 'Change'}</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>${footerText}</p>
        </div>
        
        <div class="no-print">
          <button onclick="window.print()" style="padding: 10px 20px; margin: 20px auto; display: block; background: #0066cc; color: white; border: none; border-radius: 5px; cursor: pointer;">
            ${printButtonText}
          </button>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Print after resources are loaded
    printWindow.onload = function() {
      printWindow.focus();
    };
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <h2 className="text-2xl font-bold">{translations.comparativeAnalysis}</h2>
        <Button onClick={handlePrintComparison} className="gap-2 w-full md:w-auto">
          <Printer size={16} />
          {translations.printReport}
        </Button>
      </div>
      
      {/* Comparison Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{translations.comparisonSettings}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="comparisonType">{translations.comparisonType}</Label>
              <Select 
                value={comparisonType}
                onValueChange={(value) => setComparisonType(value as "day" | "month" | "year")}
              >
                <SelectTrigger id="comparisonType">
                  <SelectValue placeholder={language === 'ar' ? 'اختر نوع المقارنة' : 'Choose comparison type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">{translations.dailyComparison}</SelectItem>
                  <SelectItem value="month">{translations.monthlyComparison}</SelectItem>
                  <SelectItem value="year">{translations.yearlyComparison}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period1">{translations.firstPeriod}</Label>
              <Select 
                value={period1}
                onValueChange={setPeriod1}
              >
                <SelectTrigger id="period1">
                  <SelectValue placeholder={language === 'ar' ? 'اختر الفترة الأولى' : 'Choose first period'} />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period2">{translations.secondPeriod}</Label>
              <Select 
                value={period2}
                onValueChange={setPeriod2}
              >
                <SelectTrigger id="period2">
                  <SelectValue placeholder={language === 'ar' ? 'اختر الفترة الثانية' : 'Choose second period'} />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Comparison Results */}
      {period1 && period2 && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {comparisonData.period1.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="text-3xl font-bold">
                    {comparisonData.period1.total.toFixed(2)} {translations.currency}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {comparisonData.period1.count} {comparisonData.period1.count === 1 ? translations.invoice : translations.invoices}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {comparisonData.period2.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="text-3xl font-bold">
                    {comparisonData.period2.total.toFixed(2)} {translations.currency}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {comparisonData.period2.count} {comparisonData.period2.count === 1 ? translations.invoice : translations.invoices}
                  </div>
                  
                  {comparisonData.period1.total > 0 && (
                    <div className={`flex items-center mt-2 gap-1 ${
                      comparisonData.period2.total >= comparisonData.period1.total
                        ? "text-green-500"
                        : "text-red-500"
                    }`}>
                      {comparisonData.period2.total >= comparisonData.period1.total ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>
                        {comparisonData.period2.total >= comparisonData.period1.total ? "+" : ""}
                        {(comparisonData.period2.total - comparisonData.period1.total).toFixed(2)} {translations.currency}
                        {" "}
                        ({comparisonData.period1.total !== 0 ? (
                          <>
                            {comparisonData.period2.total >= comparisonData.period1.total ? "+" : ""}
                            {((comparisonData.period2.total - comparisonData.period1.total) / comparisonData.period1.total * 100).toFixed(1)}%
                          </>
                        ) : "—"})
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Chart Tabs */}
          <Tabs defaultValue="bar">
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex">
              <TabsTrigger value="bar">{translations.barChart}</TabsTrigger>
              <TabsTrigger value="line">{translations.lineChart}</TabsTrigger>
            </TabsList>
            
            <Card className="mt-4">
              <CardContent className="pt-6">
                <TabsContent value="bar" className="mt-0">
                  <h3 className="text-lg font-semibold mb-4">{translations.salesComparison}</h3>
                  <div className="h-[300px] md:h-[400px]">
                    {comparisonData.dailyData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={comparisonData.dailyData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip 
                            formatter={(value: number) => `${value.toFixed(2)} ${translations.currency}`}
                          />
                          <Legend 
                            payload={[
                              { value: comparisonData.period1.label, type: 'rect', color: '#9b87f5' },
                              { value: comparisonData.period2.label, type: 'rect', color: '#F97316' }
                            ]}
                          />
                          <Bar 
                            name={comparisonData.period1.label} 
                            dataKey="period1" 
                            fill="#9b87f5" 
                          />
                          <Bar 
                            name={comparisonData.period2.label} 
                            dataKey="period2" 
                            fill="#F97316" 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-center text-muted-foreground">
                          {translations.noDataComparison}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="line" className="mt-0">
                  <h3 className="text-lg font-semibold mb-4">{translations.salesTrends}</h3>
                  <div className="h-[300px] md:h-[400px]">
                    {comparisonData.dailyData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={comparisonData.dailyData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip 
                            formatter={(value: number) => `${value.toFixed(2)} ${translations.currency}`}
                          />
                          <Legend 
                            payload={[
                              { value: comparisonData.period1.label, type: 'rect', color: '#9b87f5' },
                              { value: comparisonData.period2.label, type: 'rect', color: '#F97316' }
                            ]}
                          />
                          <Line 
                            type="monotone" 
                            name={comparisonData.period1.label} 
                            dataKey="period1" 
                            stroke="#9b87f5" 
                            activeDot={{ r: 8 }} 
                          />
                          <Line 
                            type="monotone" 
                            name={comparisonData.period2.label} 
                            dataKey="period2" 
                            stroke="#F97316" 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-center text-muted-foreground">
                          {translations.noDataComparison}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
          
          {/* Product Type Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>{translations.productComparison}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comparisonData.productData.map((item, index) => {
                  const diff = item.period2 - item.period1;
                  const percentChange = item.period1 !== 0 
                    ? ((item.period2 - item.period1) / item.period1 * 100) 
                    : 0;
                  
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                          <span className="text-sm text-muted-foreground">
                            {item.period1.toFixed(2)} {translations.currency}
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
                          <span className="text-sm text-muted-foreground">
                            {item.period2.toFixed(2)} {translations.currency}
                          </span>
                          <span className={`text-sm ${diff >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {diff > 0 ? "+" : ""}
                            {diff.toFixed(2)} {translations.currency}
                            {" "}
                            ({percentChange.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-secondary/50 rounded-full h-2.5 dark:bg-gray-700">
                        <div className={`h-2.5 rounded-full ${item.period2 > item.period1 ? "bg-green-500" : item.period2 < item.period1 ? "bg-red-500" : "bg-primary"}`} 
                          style={{ 
                            width: `${Math.min(100, Math.abs(percentChange) * 2)}%`,
                            marginLeft: diff < 0 && language === 'en' ? 'auto' : (diff < 0 && language === 'ar' ? '0' : (language === 'ar' ? 'auto' : '0')),
                            marginRight: diff < 0 && language === 'ar' ? 'auto' : (diff < 0 && language === 'en' ? '0' : (language === 'en' ? 'auto' : '0'))
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
                
                {comparisonData.productData.length === 0 && (
                  <div className="py-4 text-center text-muted-foreground">
                    {translations.noDataComparison}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
