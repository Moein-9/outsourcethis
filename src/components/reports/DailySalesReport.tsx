
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, isToday, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Printer, Download, RefreshCw, CreditCard, Ban, Wallet, ShoppingBag, Contact, Glasses, Eye } from "lucide-react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/store/languageStore";
import { PrintReportButton } from "./PrintReportButton";
import { useReportStore } from "@/store/reportStore";

export const DailySalesReport = () => {
  const { language } = useLanguageStore();
  
  // Use the report store instead of local state
  const {
    selectedDate,
    setSelectedDate,
    previousDay,
    nextDay,
    loadDailyData,
    dailySummary,
    paymentMethods,
    invoiceTypes,
    dailyInvoices,
    dailyRefunds,
    loading
  } = useReportStore();
  
  // Reload data when component mounts
  useEffect(() => {
    loadDailyData();
  }, [loadDailyData]);
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setSelectedDate(formattedDate);
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
  
  const selectedDateObj = new Date(selectedDate);
  const isSelectedToday = isToday(selectedDateObj);
  
  // Prepare payment method data
  const paymentMethodIcons: Record<string, React.ReactNode> = {
    "Cash": <Wallet className="w-4 h-4 text-green-500" />,
    "Visa": <CreditCard className="w-4 h-4 text-blue-500" />,
    "MasterCard": <CreditCard className="w-4 h-4 text-red-500" />,
    "KNET": <CreditCard className="w-4 h-4 text-purple-500" />,
    "Other": <CreditCard className="w-4 h-4 text-gray-500" />,
  };
  
  // Prepare invoice type data
  const invoiceTypeIcons: Record<string, React.ReactNode> = {
    "glasses": <Glasses className="w-4 h-4 text-blue-500" />,
    "contacts": <Contact className="w-4 h-4 text-green-500" />,
    "exam": <Eye className="w-4 h-4 text-amber-500" />,
  };
  
  const translations = {
    dailySalesReport: language === 'ar' ? "تقرير المبيعات اليومي" : "Daily Sales Report",
    date: language === 'ar' ? "التاريخ" : "Date",
    today: language === 'ar' ? "اليوم" : "Today",
    totalSales: language === 'ar' ? "إجمالي المبيعات" : "Total Sales",
    refunds: language === 'ar' ? "المبالغ المستردة" : "Refunds",
    netSales: language === 'ar' ? "صافي المبيعات" : "Net Sales",
    paymentMethods: language === 'ar' ? "طرق الدفع" : "Payment Methods",
    invoiceTypes: language === 'ar' ? "أنواع الفواتير" : "Invoice Types",
    glasses: language === 'ar' ? "نظارات" : "Glasses",
    contacts: language === 'ar' ? "عدسات لاصقة" : "Contact Lenses",
    exam: language === 'ar' ? "فحص العين" : "Eye Exam",
    cash: language === 'ar' ? "نقدي" : "Cash",
    visa: language === 'ar' ? "فيزا" : "Visa",
    mastercard: language === 'ar' ? "ماستركارد" : "MasterCard",
    knet: language === 'ar' ? "كي نت" : "KNET",
    other: language === 'ar' ? "أخرى" : "Other",
    transactions: language === 'ar' ? "المعاملات" : "Transactions",
    noTransactions: language === 'ar' ? "لا توجد معاملات في هذا اليوم" : "No transactions for this day",
    amount: language === 'ar' ? "المبلغ" : "Amount",
    invoices: language === 'ar' ? "الفواتير" : "Invoices",
    refund: language === 'ar' ? "استرداد" : "Refund",
    refreshData: language === 'ar' ? "تحديث البيانات" : "Refresh Data",
    printReport: language === 'ar' ? "طباعة التقرير" : "Print Report",
    downloadCSV: language === 'ar' ? "تنزيل CSV" : "Download CSV",
    loading: language === 'ar' ? "جاري التحميل..." : "Loading...",
    noData: language === 'ar' ? "لا توجد بيانات متاحة لهذا اليوم" : "No data available for this day",
  };
  
  const rtlClass = language === 'ar' ? 'rtl' : 'ltr';
  
  // Helper function to create a CSV file for download
  const generateCSV = () => {
    // Header row
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Daily Sales Report - " + format(selectedDateObj, "yyyy-MM-dd") + "\r\n\r\n";
    
    // Summary data
    csvContent += "Total Sales,Refunds,Net Sales\r\n";
    csvContent += `${dailySummary?.total_sales || 0},${dailySummary?.total_refunds || 0},${dailySummary?.net_sales || 0}\r\n\r\n`;
    
    // Payment methods
    csvContent += "Payment Methods\r\n";
    csvContent += "Method,Amount,Transactions\r\n";
    paymentMethods.forEach(method => {
      csvContent += `${method.payment_method},${method.amount},${method.transaction_count}\r\n`;
    });
    csvContent += "\r\n";
    
    // Invoice types
    csvContent += "Invoice Types\r\n";
    csvContent += "Type,Amount,Count\r\n";
    invoiceTypes.forEach(type => {
      csvContent += `${type.invoice_type},${type.amount},${type.count}\r\n`;
    });
    csvContent += "\r\n";
    
    // Invoice data
    csvContent += "Invoices\r\n";
    csvContent += "Invoice ID,Patient Name,Type,Amount,Payment Method,Status\r\n";
    dailyInvoices.forEach(invoice => {
      csvContent += `${invoice.invoice_id},${invoice.patient_name},${invoice.invoice_type},${invoice.total_amount},${invoice.payment_method},${invoice.is_paid ? "Paid" : "Partial"}\r\n`;
    });
    csvContent += "\r\n";
    
    // Refund data
    if (dailyRefunds.length > 0) {
      csvContent += "Refunds\r\n";
      csvContent += "Refund ID,Invoice ID,Amount,Reason\r\n";
      dailyRefunds.forEach(refund => {
        csvContent += `${refund.refund_id},${refund.invoice_id},${refund.amount},${refund.reason || "N/A"}\r\n`;
      });
    }
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_report_${format(selectedDateObj, "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className={`space-y-6 ${rtlClass}`}>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon"
            onClick={previousDay}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-[240px]",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  isSelectedToday ? translations.today : format(selectedDateObj, "PPP")
                ) : (
                  translations.date
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDateObj}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={nextDay}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={loadDailyData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {translations.refreshData}
          </Button>
          
          <PrintReportButton date={selectedDate} />
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={generateCSV}
            disabled={loading || !dailySummary}
          >
            <Download className="h-4 w-4" />
            {translations.downloadCSV}
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center p-10">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400 mr-2" />
          <span>{translations.loading}</span>
        </div>
      ) : !dailySummary ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 text-center text-yellow-800">
          <Ban className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
          <h3 className="text-lg font-medium">{translations.noData}</h3>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-teal-700">{translations.totalSales}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-teal-900">{formatCurrency(dailySummary.total_sales)}</div>
                <p className="text-xs text-teal-600 mt-1">{dailySummary.glasses_sales_count + dailySummary.contacts_sales_count + dailySummary.exam_sales_count} {translations.transactions}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-700">{translations.refunds}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900">{formatCurrency(dailySummary.total_refunds)}</div>
                <p className="text-xs text-red-600 mt-1">{dailyRefunds.length} {translations.transactions}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">{translations.netSales}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{formatCurrency(dailySummary.net_sales)}</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{translations.paymentMethods}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map(method => (
                    <div key={method.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {paymentMethodIcons[method.payment_method] || <CreditCard className="w-4 h-4 text-gray-500" />}
                        <span className="font-medium">
                          {method.payment_method}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({method.transaction_count} {translations.transactions})
                        </span>
                      </div>
                      <span className="font-bold">{formatCurrency(method.amount)}</span>
                    </div>
                  ))}
                  
                  {paymentMethods.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      {translations.noTransactions}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{translations.invoiceTypes}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoiceTypes.map(type => (
                    <div key={type.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {invoiceTypeIcons[type.invoice_type] || <ShoppingBag className="w-4 h-4 text-gray-500" />}
                        <span className="font-medium">
                          {type.invoice_type === "glasses" ? translations.glasses :
                           type.invoice_type === "contacts" ? translations.contacts :
                           type.invoice_type === "exam" ? translations.exam : type.invoice_type}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({type.count} {translations.transactions})
                        </span>
                      </div>
                      <span className="font-bold">{formatCurrency(type.amount)}</span>
                    </div>
                  ))}
                  
                  {invoiceTypes.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      {translations.noTransactions}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{translations.invoices}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">{translations === 'ar' ? 'العميل' : 'Patient'}</th>
                      <th className="px-4 py-2">{translations === 'ar' ? 'النوع' : 'Type'}</th>
                      <th className="px-4 py-2">{translations.amount}</th>
                      <th className="px-4 py-2">{translations === 'ar' ? 'طريقة الدفع' : 'Payment'}</th>
                      <th className="px-4 py-2">{translations === 'ar' ? 'الحالة' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyInvoices.map(invoice => (
                      <tr key={invoice.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{invoice.invoice_id}</td>
                        <td className="px-4 py-2">{invoice.patient_name}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-1">
                            {invoiceTypeIcons[invoice.invoice_type]}
                            <span>
                              {invoice.invoice_type === "glasses" ? translations.glasses :
                               invoice.invoice_type === "contacts" ? translations.contacts :
                               invoice.invoice_type === "exam" ? translations.exam : invoice.invoice_type}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 font-medium">{formatCurrency(invoice.total_amount)}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-1">
                            {paymentMethodIcons[invoice.payment_method] || <CreditCard className="w-4 h-4" />}
                            <span>{invoice.payment_method}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            invoice.is_paid 
                              ? "bg-green-100 text-green-800" 
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {invoice.is_paid 
                              ? (language === 'ar' ? "مدفوع بالكامل" : "Paid") 
                              : (language === 'ar' ? "مدفوع جزئياً" : "Partial")}
                          </span>
                        </td>
                      </tr>
                    ))}
                    
                    {dailyInvoices.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                          {translations.noTransactions}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {dailyRefunds.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{translations.refund}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">{translations === 'ar' ? 'الفاتورة' : 'Invoice'}</th>
                        <th className="px-4 py-2">{translations.amount}</th>
                        <th className="px-4 py-2">{translations === 'ar' ? 'السبب' : 'Reason'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailyRefunds.map(refund => (
                        <tr key={refund.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{refund.refund_id}</td>
                          <td className="px-4 py-2">{refund.invoice_id}</td>
                          <td className="px-4 py-2 font-medium text-red-600">{formatCurrency(refund.amount)}</td>
                          <td className="px-4 py-2">{refund.reason || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
