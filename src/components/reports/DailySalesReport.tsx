
import React, { useState, useEffect } from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartLineUp, 
  Printer, 
  CreditCard, 
  Wallet, 
  Receipt, 
  ArrowRight
} from "lucide-react";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { SalesChart } from "./SalesChart";

export const DailySalesReport: React.FC = () => {
  const { invoices } = useInvoiceStore();
  const [todaySales, setTodaySales] = useState<ReturnType<typeof useInvoiceStore>["invoices"]>([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState<{
    method: string;
    amount: number;
    count: number;
  }[]>([]);
  
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalLensRevenue, setTotalLensRevenue] = useState(0);
  const [totalFrameRevenue, setTotalFrameRevenue] = useState(0);
  const [totalCoatingRevenue, setTotalCoatingRevenue] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  
  // Filter today's sales
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySalesData = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.createdAt);
      invoiceDate.setHours(0, 0, 0, 0);
      return invoiceDate.getTime() === today.getTime();
    });
    
    setTodaySales(todaySalesData);
    
    // Calculate totals
    const revenue = todaySalesData.reduce((sum, invoice) => sum + invoice.total, 0);
    const lensRevenue = todaySalesData.reduce((sum, invoice) => sum + invoice.lensPrice, 0);
    const frameRevenue = todaySalesData.reduce((sum, invoice) => sum + invoice.framePrice, 0);
    const coatingRevenue = todaySalesData.reduce((sum, invoice) => sum + invoice.coatingPrice, 0);
    const deposits = todaySalesData.reduce((sum, invoice) => sum + invoice.deposit, 0);
    
    setTotalRevenue(revenue);
    setTotalLensRevenue(lensRevenue);
    setTotalFrameRevenue(frameRevenue);
    setTotalCoatingRevenue(coatingRevenue);
    setTotalDeposit(deposits);
    
    // Calculate payment breakdown
    const paymentMethods: Record<string, { amount: number; count: number }> = {};
    
    todaySalesData.forEach(invoice => {
      const method = invoice.paymentMethod || 'غير محدد';
      if (!paymentMethods[method]) {
        paymentMethods[method] = { amount: 0, count: 0 };
      }
      paymentMethods[method].amount += invoice.deposit;
      paymentMethods[method].count += 1;
    });
    
    const breakdownData = Object.entries(paymentMethods).map(([method, data]) => ({
      method,
      amount: data.amount,
      count: data.count
    }));
    
    setPaymentBreakdown(breakdownData);
  }, [invoices]);
  
  // Print function for daily report
  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const today = new Date().toLocaleDateString('ar-EG');
    const pageTitle = `تقرير المبيعات اليومي - ${today}`;
    
    let paymentBreakdownHTML = '';
    paymentBreakdown.forEach(payment => {
      paymentBreakdownHTML += `
        <tr>
          <td>${payment.method}</td>
          <td>${payment.count}</td>
          <td>${payment.amount.toFixed(2)} د.ك</td>
        </tr>
      `;
    });
    
    let invoicesHTML = '';
    todaySales.forEach(invoice => {
      invoicesHTML += `
        <tr>
          <td>${invoice.invoiceId}</td>
          <td>${invoice.patientName}</td>
          <td>${invoice.lensType}</td>
          <td>${invoice.frameBrand} ${invoice.frameModel}</td>
          <td>${invoice.total.toFixed(2)} د.ك</td>
          <td>${invoice.deposit.toFixed(2)} د.ك</td>
          <td>${invoice.paymentMethod}</td>
        </tr>
      `;
    });
    
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
          .report-date {
            font-size: 14px;
            color: #555;
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
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 20px;
          }
          .summary-item {
            background-color: #f9f9f9;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #eee;
          }
          .summary-item-title {
            font-weight: bold;
            margin-bottom: 5px;
            color: #555;
          }
          .summary-item-value {
            font-size: 20px;
            font-weight: bold;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: right;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
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
          <h1 class="report-title">تقرير المبيعات اليومي</h1>
          <p class="report-date">التاريخ: ${today}</p>
        </div>
        
        <div class="summary-section">
          <h2 class="section-title">ملخص المبيعات</h2>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-item-title">إجمالي المبيعات</div>
              <div class="summary-item-value">${totalRevenue.toFixed(2)} د.ك</div>
            </div>
            <div class="summary-item">
              <div class="summary-item-title">إجمالي المدفوعات</div>
              <div class="summary-item-value">${totalDeposit.toFixed(2)} د.ك</div>
            </div>
            <div class="summary-item">
              <div class="summary-item-title">عدد الفواتير</div>
              <div class="summary-item-value">${todaySales.length}</div>
            </div>
          </div>
        </div>
        
        <div class="summary-section">
          <h2 class="section-title">تفاصيل المبيعات</h2>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-item-title">مبيعات العدسات</div>
              <div class="summary-item-value">${totalLensRevenue.toFixed(2)} د.ك</div>
            </div>
            <div class="summary-item">
              <div class="summary-item-title">مبيعات الإطارات</div>
              <div class="summary-item-value">${totalFrameRevenue.toFixed(2)} د.ك</div>
            </div>
            <div class="summary-item">
              <div class="summary-item-title">مبيعات الطلاءات</div>
              <div class="summary-item-value">${totalCoatingRevenue.toFixed(2)} د.ك</div>
            </div>
          </div>
        </div>
        
        <div class="summary-section">
          <h2 class="section-title">طرق الدفع</h2>
          <table>
            <thead>
              <tr>
                <th>طريقة الدفع</th>
                <th>عدد المعاملات</th>
                <th>المبلغ</th>
              </tr>
            </thead>
            <tbody>
              ${paymentBreakdownHTML}
            </tbody>
          </table>
        </div>
        
        <div class="summary-section">
          <h2 class="section-title">قائمة الفواتير</h2>
          <table>
            <thead>
              <tr>
                <th>رقم الفاتورة</th>
                <th>اسم العميل</th>
                <th>نوع العدسة</th>
                <th>الإطار</th>
                <th>المجموع</th>
                <th>المدفوع</th>
                <th>طريقة الدفع</th>
              </tr>
            </thead>
            <tbody>
              ${invoicesHTML}
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
      // Uncomment to automatically trigger print
      // printWindow.print();
    };
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">تقرير المبيعات اليومي</h2>
        <Button onClick={handlePrintReport} className="gap-2">
          <Printer size={16} />
          طباعة التقرير
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي المبيعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} د.ك</div>
            <p className="text-xs text-muted-foreground mt-1">
              لليوم: {new Date().toLocaleDateString('ar-EG')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              عدد الفواتير
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySales.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              في معاملات اليوم
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي المدفوعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeposit.toFixed(2)} د.ك</div>
            <p className="text-xs text-muted-foreground mt-1">
              المستلم فعلياً
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              المبالغ المتبقية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalRevenue - totalDeposit).toFixed(2)} د.ك</div>
            <p className="text-xs text-muted-foreground mt-1">
              المبالغ المؤجلة
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts - Today's Sales Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>توزيع المبيعات</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart 
              lensRevenue={totalLensRevenue}
              frameRevenue={totalFrameRevenue}
              coatingRevenue={totalCoatingRevenue}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>طرق الدفع</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {paymentBreakdown.map((payment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {payment.method === 'نقداً' ? (
                    <Wallet className="h-4 w-4 text-green-500" />
                  ) : payment.method === 'كي نت' ? (
                    <CreditCard className="h-4 w-4 text-blue-500" />
                  ) : payment.method === 'Visa' ? (
                    <CreditCard className="h-4 w-4 text-indigo-500" />
                  ) : payment.method === 'MasterCard' ? (
                    <CreditCard className="h-4 w-4 text-orange-500" />
                  ) : (
                    <Receipt className="h-4 w-4 text-gray-500" />
                  )}
                  <span>{payment.method}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{payment.count} معاملات</span>
                  <span className="font-medium">{payment.amount.toFixed(2)} د.ك</span>
                </div>
              </div>
            ))}
            
            {paymentBreakdown.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                لا توجد مبيعات لليوم الحالي
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الفواتير اليوم</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الفاتورة</TableHead>
                <TableHead>اسم العميل</TableHead>
                <TableHead>نوع العدسة</TableHead>
                <TableHead>الإطار</TableHead>
                <TableHead>المجموع</TableHead>
                <TableHead>المدفوع</TableHead>
                <TableHead>طريقة الدفع</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todaySales.length > 0 ? (
                todaySales.map((invoice) => (
                  <TableRow key={invoice.invoiceId}>
                    <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                    <TableCell>{invoice.patientName}</TableCell>
                    <TableCell>{invoice.lensType}</TableCell>
                    <TableCell>
                      {invoice.frameBrand ? `${invoice.frameBrand} ${invoice.frameModel}` : 'بدون إطار'}
                    </TableCell>
                    <TableCell>{invoice.total.toFixed(2)} د.ك</TableCell>
                    <TableCell>{invoice.deposit.toFixed(2)} د.ك</TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    لا توجد فواتير لهذا اليوم
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
