
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

export const ComparativeAnalysis: React.FC = () => {
  const { invoices } = useInvoiceStore();
  
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
        const label = date.toLocaleDateString('ar-EG', { 
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
        const label = date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' });
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
  }, [comparisonType]);
  
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
        xLabel = `اليوم ${date}`;
      } else if (comparisonType === "year") {
        const monthNames = [
          "يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو", 
          "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
        ];
        xLabel = monthNames[parseInt(date) - 1];
      }
      
      return { 
        date: xLabel, 
        period1: data.period1, 
        period2: data.period2 
      };
    }).sort((a, b) => {
      // Sort by date for proper display
      if (comparisonType === "month") {
        return parseInt(a.date.replace("اليوم ", "")) - parseInt(b.date.replace("اليوم ", ""));
      }
      return 0;
    });
    
    // Product type breakdown (lenses, frames, coatings)
    const productTypes = [
      { id: "lens", name: "العدسات" },
      { id: "frame", name: "الإطارات" },
      { id: "coating", name: "الطلاءات" }
    ];
    
    const productData = productTypes.map(product => {
      let period1Value = 0;
      let period2Value = 0;
      
      if (product.id === "lens") {
        period1Value = period1Invoices.reduce((sum, inv) => sum + inv.lensPrice, 0);
        period2Value = period2Invoices.reduce((sum, inv) => sum + inv.lensPrice, 0);
      } else if (product.id === "frame") {
        period1Value = period1Invoices.reduce((sum, inv) => sum + inv.framePrice, 0);
        period2Value = period2Invoices.reduce((sum, inv) => sum + inv.framePrice, 0);
      } else if (product.id === "coating") {
        period1Value = period1Invoices.reduce((sum, inv) => sum + inv.coatingPrice, 0);
        period2Value = period2Invoices.reduce((sum, inv) => sum + inv.coatingPrice, 0);
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
    
  }, [period1, period2, comparisonType, invoices]);
  
  // Handle print report
  const handlePrintComparison = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const pageTitle = `تقرير مقارنة - ${comparisonData.period1.label} و ${comparisonData.period2.label}`;
    
    // Format labels based on comparison type
    let period1Label = comparisonData.period1.label;
    let period2Label = comparisonData.period2.label;
    let comparisonTitle = "";
    
    if (comparisonType === "day") {
      comparisonTitle = "مقارنة بين يومين";
    } else if (comparisonType === "month") {
      comparisonTitle = "مقارنة بين شهرين";
    } else {
      comparisonTitle = "مقارنة بين سنتين";
    }
    
    let productRows = '';
    comparisonData.productData.forEach(item => {
      const diff = item.period2 - item.period1;
      const percentChange = item.period1 !== 0 
        ? ((item.period2 - item.period1) / item.period1 * 100).toFixed(1) 
        : "—";
      
      productRows += `
        <tr>
          <td>${item.name}</td>
          <td>${item.period1.toFixed(2)} د.ك</td>
          <td>${item.period2.toFixed(2)} د.ك</td>
          <td>
            ${diff > 0 ? '+' : ''}${diff.toFixed(2)} د.ك
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
        <td>الإجمالي</td>
        <td>${comparisonData.period1.total.toFixed(2)} د.ك</td>
        <td>${comparisonData.period2.total.toFixed(2)} د.ك</td>
        <td>
          ${totalDiff > 0 ? '+' : ''}${totalDiff.toFixed(2)} د.ك
          (${totalDiff > 0 ? '+' : ''}${totalPercentChange}%)
        </td>
      </tr>
    `;
    
    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <title>${pageTitle}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            direction: rtl;
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
            text-align: right;
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
          <p class="report-subtitle">${period1Label} و ${period2Label}</p>
        </div>
        
        <div class="summary-section">
          <h2 class="section-title">ملخص المقارنة</h2>
          <div class="comparison-grid">
            <div class="comparison-item">
              <div class="period-label">${period1Label}</div>
              <div class="comparison-value">${comparisonData.period1.total.toFixed(2)} د.ك</div>
              <div class="comparison-count">${comparisonData.period1.count} فاتورة</div>
            </div>
            <div class="comparison-item">
              <div class="period-label">${period2Label}</div>
              <div class="comparison-value">${comparisonData.period2.total.toFixed(2)} د.ك</div>
              <div class="comparison-count">${comparisonData.period2.count} فاتورة</div>
              <div class="${totalDiff > 0 ? 'change positive' : 'change negative'}">
                ${totalDiff > 0 ? '+' : ''}${totalDiff.toFixed(2)} د.ك
                (${totalDiff > 0 ? '+' : ''}${totalPercentChange}%)
              </div>
            </div>
          </div>
        </div>
        
        <div class="summary-section">
          <h2 class="section-title">مقارنة تفصيلية للمنتجات</h2>
          <table>
            <thead>
              <tr>
                <th>نوع المنتج</th>
                <th>${period1Label}</th>
                <th>${period2Label}</th>
                <th>التغيير</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>تم إنشاء هذا التقرير بواسطة نظام النظارات - جميع الحقوق محفوظة © ${new Date().getFullYear()}</p>
        </div>
        
        <div class="no-print">
          <button onclick="window.print()" style="padding: 10px 20px; margin: 20px auto; display: block; background: #0066cc; color: white; border: none; border-radius: 5px; cursor: pointer;">
            طباعة التقرير
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">التحليل المقارن</h2>
        <Button onClick={handlePrintComparison} className="gap-2">
          <Printer size={16} />
          طباعة التقرير
        </Button>
      </div>
      
      {/* Comparison Settings */}
      <Card>
        <CardHeader>
          <CardTitle>إعدادات المقارنة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="comparisonType">نوع المقارنة</Label>
              <Select 
                value={comparisonType}
                onValueChange={(value) => setComparisonType(value as "day" | "month" | "year")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع المقارنة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">مقارنة يومية</SelectItem>
                  <SelectItem value="month">مقارنة شهرية</SelectItem>
                  <SelectItem value="year">مقارنة سنوية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period1">الفترة الأولى</Label>
              <Select 
                value={period1}
                onValueChange={setPeriod1}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفترة الأولى" />
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
              <Label htmlFor="period2">الفترة الثانية</Label>
              <Select 
                value={period2}
                onValueChange={setPeriod2}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفترة الثانية" />
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
                    {comparisonData.period1.total.toFixed(2)} د.ك
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {comparisonData.period1.count} فاتورة
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
                    {comparisonData.period2.total.toFixed(2)} د.ك
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {comparisonData.period2.count} فاتورة
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
                        {(comparisonData.period2.total - comparisonData.period1.total).toFixed(2)} د.ك
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
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex">
              <TabsTrigger value="bar">رسم شريطي</TabsTrigger>
              <TabsTrigger value="line">رسم خطي</TabsTrigger>
            </TabsList>
            
            <Card className="mt-4">
              <CardContent className="pt-6">
                <TabsContent value="bar" className="mt-0">
                  <h3 className="text-lg font-semibold mb-4">مقارنة المبيعات</h3>
                  <div className="h-[400px]">
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
                            formatter={(value: number) => `${value.toFixed(2)} د.ك`}
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
                          لا توجد بيانات كافية للمقارنة
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="line" className="mt-0">
                  <h3 className="text-lg font-semibold mb-4">اتجاهات المبيعات</h3>
                  <div className="h-[400px]">
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
                            formatter={(value: number) => `${value.toFixed(2)} د.ك`}
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
                          لا توجد بيانات كافية للمقارنة
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
              <CardTitle>مقارنة أنواع المنتجات</CardTitle>
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
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {item.period1.toFixed(2)} د.ك
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {item.period2.toFixed(2)} د.ك
                          </span>
                          <span className={`text-sm ${diff >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {diff > 0 ? "+" : ""}
                            {diff.toFixed(2)} د.ك
                            {" "}
                            ({percentChange.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-secondary/50 rounded-full h-2.5 dark:bg-gray-700">
                        <div className={`h-2.5 rounded-full ${item.period2 > item.period1 ? "bg-green-500" : item.period2 < item.period1 ? "bg-red-500" : "bg-primary"}`} 
                          style={{ 
                            width: `${Math.min(100, Math.abs(percentChange) * 2)}%`,
                            marginLeft: diff < 0 ? 'auto' : '0',
                            marginRight: diff < 0 ? '0' : 'auto'
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
                
                {comparisonData.productData.length === 0 && (
                  <div className="py-4 text-center text-muted-foreground">
                    لا توجد بيانات كافية للمقارنة
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
