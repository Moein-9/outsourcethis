
import React, { useState, useEffect } from "react";
import { useInvoiceStore, Invoice } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartLine, 
  Printer, 
  CreditCard, 
  Wallet, 
  Receipt, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Eye
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const DailySalesReport: React.FC = () => {
  const invoiceStore = useInvoiceStore();
  const invoices: Invoice[] = invoiceStore?.invoices || [];
  
  const [todaySales, setTodaySales] = useState<Invoice[]>([]);
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
  
  // Track expanded invoice IDs
  const [expandedInvoices, setExpandedInvoices] = useState<Record<string, boolean>>({});
  
  // Toggle invoice expansion
  const toggleInvoiceExpansion = (invoiceId: string) => {
    setExpandedInvoices(prev => ({
      ...prev,
      [invoiceId]: !prev[invoiceId]
    }));
  };
  
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySalesData = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.createdAt);
      invoiceDate.setHours(0, 0, 0, 0);
      return invoiceDate.getTime() === today.getTime();
    });
    
    setTodaySales(todaySalesData);
    
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
    
    printWindow.onload = function() {
      printWindow.focus();
    };
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">تقرير المبيعات اليومي</h2>
        <Button onClick={handlePrintReport} className="gap-2 bg-primary hover:bg-primary/90">
          <Printer size={16} />
          طباعة التقرير
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              إجمالي المبيعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalRevenue.toFixed(2)} د.ك</div>
            <p className="text-xs text-blue-600 mt-1">
              لليوم: {new Date().toLocaleDateString('ar-EG')}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              عدد الفواتير
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{todaySales.length}</div>
            <p className="text-xs text-purple-600 mt-1">
              في معاملات اليوم
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              إجمالي المدفوعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{totalDeposit.toFixed(2)} د.ك</div>
            <p className="text-xs text-green-600 mt-1">
              المستلم فعلياً
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">
              المبالغ المتبقية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{(totalRevenue - totalDeposit).toFixed(2)} د.ك</div>
            <p className="text-xs text-amber-600 mt-1">
              المبالغ المؤجلة
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="border-indigo-200">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-lg">
            <CardTitle className="text-indigo-700">توزيع المبيعات</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart 
              lensRevenue={totalLensRevenue}
              frameRevenue={totalFrameRevenue}
              coatingRevenue={totalCoatingRevenue}
            />
          </CardContent>
        </Card>
        
        <Card className="border-teal-200">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-t-lg">
            <CardTitle className="text-teal-700">طرق الدفع</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {paymentBreakdown.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  {payment.method === 'نقداً' ? (
                    <Wallet className="h-5 w-5 text-green-500" />
                  ) : payment.method === 'كي نت' ? (
                    <CreditCard className="h-5 w-5 text-blue-500" />
                  ) : payment.method === 'Visa' ? (
                    <CreditCard className="h-5 w-5 text-indigo-500" />
                  ) : payment.method === 'MasterCard' ? (
                    <CreditCard className="h-5 w-5 text-orange-500" />
                  ) : (
                    <Receipt className="h-5 w-5 text-gray-500" />
                  )}
                  <span className="font-medium">{payment.method}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{payment.count} معاملات</span>
                  <span className="font-medium text-gray-900">{payment.amount.toFixed(2)} د.ك</span>
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
      
      <Card className="border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <CardTitle className="text-gray-700">قائمة الفواتير اليوم</CardTitle>
        </CardHeader>
        <CardContent>
          {todaySales.length > 0 ? (
            <div className="space-y-4">
              {todaySales.map((invoice) => (
                <div key={invoice.invoiceId} 
                  className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200">
                  <div 
                    className={`flex justify-between items-center p-4 cursor-pointer ${
                      expandedInvoices[invoice.invoiceId] ? 'bg-gray-50 border-b' : ''
                    }`}
                    onClick={() => toggleInvoiceExpansion(invoice.invoiceId)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${invoice.isPaid ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        <Receipt size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium">{invoice.patientName}</h3>
                        <p className="text-sm text-gray-500">{invoice.invoiceId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-medium">{invoice.total.toFixed(2)} د.ك</p>
                        <p className="text-sm text-gray-500">{invoice.paymentMethod}</p>
                      </div>
                      <Button 
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                      >
                        {expandedInvoices[invoice.invoiceId] ? 
                          <ChevronUp size={18} /> : 
                          <ChevronDown size={18} />
                        }
                      </Button>
                    </div>
                  </div>
                  
                  {expandedInvoices[invoice.invoiceId] && (
                    <div className="p-4 bg-gray-50 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded-md border">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">معلومات العميل</h4>
                          <p className="font-medium">{invoice.patientName}</p>
                          <p className="text-sm">{invoice.patientPhone}</p>
                          {invoice.patientId && <p className="text-xs text-gray-500">رقم الملف: {invoice.patientId}</p>}
                        </div>
                        
                        <div className="bg-white p-3 rounded-md border">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">معلومات الدفع</h4>
                          <div className="flex justify-between">
                            <span>المجموع:</span>
                            <span className="font-medium">{invoice.total.toFixed(2)} د.ك</span>
                          </div>
                          <div className="flex justify-between">
                            <span>المدفوع:</span>
                            <span className="font-medium">{invoice.deposit.toFixed(2)} د.ك</span>
                          </div>
                          {invoice.remaining > 0 && (
                            <div className="flex justify-between text-amber-600">
                              <span>المتبقي:</span>
                              <span className="font-medium">{invoice.remaining.toFixed(2)} د.ك</span>
                            </div>
                          )}
                          <div className="mt-1 pt-1 border-t">
                            <span className="text-sm text-gray-500">طريقة الدفع: {invoice.paymentMethod}</span>
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 rounded-md border">
                          <h4 className="text-sm font-medium text-gray-500 mb-1">حالة الفاتورة</h4>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            invoice.isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {invoice.isPaid ? 'مدفوعة بالكامل' : 'مدفوعة جزئياً'}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            تاريخ الإنشاء: {new Date(invoice.createdAt).toLocaleDateString('ar-EG')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                          <h4 className="text-sm font-medium text-blue-700 mb-1">العدسات</h4>
                          <p className="font-medium">{invoice.lensType}</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-blue-600">السعر:</span>
                            <span className="font-medium">{invoice.lensPrice.toFixed(2)} د.ك</span>
                          </div>
                        </div>
                        
                        <div className="bg-purple-50 p-3 rounded-md border border-purple-100">
                          <h4 className="text-sm font-medium text-purple-700 mb-1">الإطار</h4>
                          <p className="font-medium">{invoice.frameBrand} {invoice.frameModel}</p>
                          <p className="text-sm text-purple-600">اللون: {invoice.frameColor}</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-purple-600">السعر:</span>
                            <span className="font-medium">{invoice.framePrice.toFixed(2)} د.ك</span>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 p-3 rounded-md border border-green-100">
                          <h4 className="text-sm font-medium text-green-700 mb-1">الطلاء</h4>
                          <p className="font-medium">{invoice.coating}</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-green-600">السعر:</span>
                            <span className="font-medium">{invoice.coatingPrice.toFixed(2)} د.ك</span>
                          </div>
                        </div>
                      </div>
                      
                      {invoice.discount > 0 && (
                        <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
                          <div className="flex justify-between">
                            <span className="text-amber-700 font-medium">الخصم:</span>
                            <span className="font-medium text-amber-700">{invoice.discount.toFixed(2)} د.ك</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Receipt className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">لا توجد فواتير</h3>
              <p className="text-gray-500">لم يتم إنشاء أي فواتير لليوم الحالي</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
