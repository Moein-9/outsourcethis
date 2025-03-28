
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { useInvoiceStore, Invoice } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartLine, 
  CreditCard, 
  Wallet, 
  Receipt, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Eye,
  Tag,
  MapPin,
  Store,
  Phone
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
import { SalesChart } from "./SalesChart";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PrintService } from "@/utils/PrintService";
import { PrintReportButton } from "./PrintReportButton";
import { Button } from "@/components/ui/button";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { toast } from "@/hooks/use-toast";

export const DailySalesReport: React.FC = () => {
  const invoiceStore = useInvoiceStore();
  const { language } = useLanguageStore();
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
  
  const [expandedInvoices, setExpandedInvoices] = useState<Record<string, boolean>>({});
  
  const t = {
    dailySalesReport: language === 'ar' ? "تقرير المبيعات اليومي" : "Daily Sales Report",
    printReport: language === 'ar' ? "طباعة التقرير" : "Print Report",
    totalSales: language === 'ar' ? "إجمالي المبيعات" : "Total Sales",
    forDay: language === 'ar' ? "لليوم" : "For day",
    invoiceCount: language === 'ar' ? "عدد الفواتير" : "Invoice Count",
    inTodaysTransactions: language === 'ar' ? "في معاملات اليوم" : "In today's transactions",
    totalPayments: language === 'ar' ? "إجمالي المدفوعات" : "Total Payments",
    actuallyReceived: language === 'ar' ? "المستلم فعلياً" : "Actually received",
    remainingAmounts: language === 'ar' ? "المبالغ المتبقية" : "Remaining Amounts",
    deferredAmounts: language === 'ar' ? "المبالغ المؤجلة" : "Deferred amounts",
    salesDistribution: language === 'ar' ? "توزيع المبيعات" : "Sales Distribution",
    paymentMethods: language === 'ar' ? "طرق الدفع" : "Payment Methods",
    transactions: language === 'ar' ? "معاملات" : "transactions",
    todaysInvoiceList: language === 'ar' ? "قائمة الفواتير اليوم" : "Today's Invoice List",
    noInvoices: language === 'ar' ? "لا توجد فواتير" : "No Invoices",
    noInvoicesToday: language === 'ar' ? "لم يتم إنشاء أي فواتير لليوم الحالي" : "No invoices have been created for today",
    lensRevenue: language === 'ar' ? "مبيعات العدسات" : "Lens Revenue",
    frameRevenue: language === 'ar' ? "مبيعات الإطارات" : "Frame Revenue",
    coatingRevenue: language === 'ar' ? "مبيعات الطلاءات" : "Coating Revenue",
    customerInfo: language === 'ar' ? "معلومات العميل" : "Customer Information",
    fileNumber: language === 'ar' ? "رقم الملف" : "File Number",
    paymentInfo: language === 'ar' ? "معلومات الدفع" : "Payment Information",
    total: language === 'ar' ? "المجموع" : "Total",
    paid: language === 'ar' ? "المدفوع" : "Paid",
    remaining: language === 'ar' ? "المتبقي" : "Remaining",
    discount: language === 'ar' ? "الخصم" : "Discount",
    paymentMethod: language === 'ar' ? "طريقة الدفع" : "Payment Method",
    invoiceStatus: language === 'ar' ? "حالة الفاتورة" : "Invoice Status",
    fullyPaid: language === 'ar' ? "مدفوعة بالكامل" : "Fully Paid",
    partiallyPaid: language === 'ar' ? "مدفوعة جزئياً" : "Partially Paid",
    creationDate: language === 'ar' ? "تاريخ الإنشاء" : "Creation Date",
    lenses: language === 'ar' ? "العدسات" : "Lenses",
    price: language === 'ar' ? "السعر" : "Price",
    frame: language === 'ar' ? "الإطار" : "Frame",
    color: language === 'ar' ? "اللون" : "Color",
    coating: language === 'ar' ? "الطلاء" : "Coating",
    currency: language === 'ar' ? "د.ك" : "KWD",
  };
  
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
    
    const revenue = todaySalesData.reduce((sum, invoice) => {
      if (invoice.invoiceType === 'contacts' && invoice.contactLensItems?.length) {
        const contactLensTotal = invoice.contactLensItems.reduce(
          (lensSum, lens) => lensSum + (lens.price || 0) * (lens.qty || 1), 0
        );
        return sum + Math.max(0, contactLensTotal - (invoice.discount || 0));
      }
      return sum + invoice.total;
    }, 0);
    
    const lensRevenue = todaySalesData.reduce((sum, invoice) => sum + invoice.lensPrice, 0);
    const frameRevenue = todaySalesData.reduce((sum, invoice) => sum + invoice.framePrice, 0);
    const coatingRevenue = todaySalesData.reduce((sum, invoice) => sum + invoice.coatingPrice, 0);
    
    const contactLensRevenue = todaySalesData.reduce((sum, invoice) => {
      if (invoice.invoiceType === 'contacts' && invoice.contactLensItems?.length) {
        return sum + invoice.contactLensItems.reduce(
          (lensSum, lens) => lensSum + (lens.price || 0) * (lens.qty || 1), 0
        );
      }
      return sum;
    }, 0);
    
    const deposits = todaySalesData.reduce((sum, invoice) => sum + invoice.deposit, 0);
    
    setTotalRevenue(revenue);
    setTotalLensRevenue(lensRevenue + contactLensRevenue);
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
    const today = format(new Date(), 'MM/dd/yyyy', { locale: enUS });
    const pageTitle = language === 'ar' 
      ? `تقرير المبيعات اليومي - ${today}` 
      : `Daily Sales Report - ${today}`;
    
    let paymentBreakdownHTML = '';
    paymentBreakdown.forEach(payment => {
      paymentBreakdownHTML += `
        <tr>
          <td class="payment-method">${payment.method}</td>
          <td class="payment-count">${payment.count}</td>
          <td class="payment-amount">${payment.amount.toFixed(2)} ${t.currency}</td>
        </tr>
      `;
    });
    
    let invoicesHTML = '';
    todaySales.forEach(invoice => {
      invoicesHTML += `
        <tr>
          <td class="invoice-customer">${invoice.patientName}</td>
          <td class="invoice-total">${invoice.total.toFixed(2)} ${t.currency}</td>
          <td class="invoice-paid">${invoice.deposit.toFixed(2)} ${t.currency}</td>
          <td class="invoice-method">${invoice.paymentMethod || '-'}</td>
        </tr>
      `;
    });
    
    const reportDate = format(new Date(), 'dd/MM/yyyy', { locale: enUS });
    
    // Create the report content with improved styling for thermal printer and bilingual support
    const reportContent = `
      <div class="report-container">
        <div class="report-header">
          <div class="store-logo">
            <img src="/lovable-uploads/d0902afc-d6a5-486b-9107-68104dfd2a68.png" alt="${storeInfo.name}" />
          </div>
          <div class="store-info">
            <h2 class="store-name">${storeInfo.name}</h2>
            <p class="store-address">${storeInfo.address}</p>
            <p class="store-phone">${language === 'ar' ? 'هاتف:' : 'Phone:'} ${storeInfo.phone}</p>
          </div>
        </div>

        <div class="report-title-box">
          <div class="report-title">${t.dailySalesReport} | Daily Sales Report</div>
          <div class="report-date">${language === 'ar' ? 'التاريخ:' : 'Date:'} ${reportDate}</div>
        </div>

        <div class="summary-section">
          <div class="section-header">${language === 'ar' ? 'ملخص المبيعات | Sales Summary' : 'Sales Summary | ملخص المبيعات'}</div>
          <table class="summary-table">
            <tr>
              <td class="summary-label">${t.totalSales} | Total Sales:</td>
              <td class="summary-value">${totalRevenue.toFixed(2)} ${t.currency}</td>
            </tr>
            <tr>
              <td class="summary-label">${t.totalPayments} | Total Payments:</td>
              <td class="summary-value">${totalDeposit.toFixed(2)} ${t.currency}</td>
            </tr>
            <tr>
              <td class="summary-label">${language === 'ar' ? 'عدد الفواتير | Invoice Count:' : 'Invoice Count | عدد الفواتير:'}</td>
              <td class="summary-value">${todaySales.length}</td>
            </tr>
          </table>
        </div>

        <div class="summary-section">
          <div class="section-header">${language === 'ar' ? 'تفاصيل المبيعات | Sales Details' : 'Sales Details | تفاصيل المبيعات'}</div>
          <table class="summary-table">
            <tr>
              <td class="summary-label">${t.lensRevenue} | Lens Revenue:</td>
              <td class="summary-value">${totalLensRevenue.toFixed(2)} ${t.currency}</td>
            </tr>
            <tr>
              <td class="summary-label">${t.frameRevenue} | Frame Revenue:</td>
              <td class="summary-value">${totalFrameRevenue.toFixed(2)} ${t.currency}</td>
            </tr>
            <tr>
              <td class="summary-label">${t.coatingRevenue} | Coating Revenue:</td>
              <td class="summary-value">${totalCoatingRevenue.toFixed(2)} ${t.currency}</td>
            </tr>
          </table>
        </div>

        <div class="summary-section">
          <div class="section-header">${language === 'ar' ? 'طرق الدفع | Payment Methods' : 'Payment Methods | طرق الدفع'}</div>
          <table class="data-table">
            <thead>
              <tr>
                <th>${language === 'ar' ? 'الطريقة | Method' : 'Method | الطريقة'}</th>
                <th>${language === 'ar' ? 'العدد | Count' : 'Count | العدد'}</th>
                <th>${language === 'ar' ? 'المبلغ | Amount' : 'Amount | المبلغ'}</th>
              </tr>
            </thead>
            <tbody>
              ${paymentBreakdownHTML || `
                <tr>
                  <td colspan="3" class="no-data">${language === 'ar' ? 'لا توجد بيانات | No data' : 'No data | لا توجد بيانات'}</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>

        ${todaySales.length > 0 ? `
          <div class="summary-section">
            <div class="section-header">${language === 'ar' ? 'قائمة الفواتير | Invoice List' : 'Invoice List | قائمة الفواتير'}</div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>${language === 'ar' ? 'العميل | Customer' : 'Customer | العميل'}</th>
                  <th>${language === 'ar' ? 'المجموع | Total' : 'Total | المجموع'}</th>
                  <th>${language === 'ar' ? 'المدفوع | Paid' : 'Paid | المدفوع'}</th>
                  <th>${language === 'ar' ? 'الطريقة | Method' : 'Method | الطريقة'}</th>
                </tr>
              </thead>
              <tbody>
                ${invoicesHTML}
              </tbody>
            </table>
          </div>
        ` : ''}

        <div class="report-footer">
          <p>${language === 'ar' 
            ? `© ${new Date().getFullYear()} ${storeInfo.name} - جميع الحقوق محفوظة`
            : `© ${new Date().getFullYear()} ${storeInfo.name} - All rights reserved`}</p>
        </div>
      </div>
      
      <style>
        @media print {
          @page {
            size: 80mm auto !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          body {
            width: 80mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            font-family: 'Arial', sans-serif !important;
          }
          
          .report-container {
            width: 72mm !important;
            margin: 4mm auto !important;
            padding: 0 !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            background: white !important;
            font-family: 'Arial', sans-serif !important;
          }
          
          /* Ensure all content is visible */
          * {
            visibility: visible !important;
            opacity: 1 !important;
          }
        }
        
        .report-container {
          text-align: center;
          font-family: 'Arial', sans-serif;
          width: 72mm;
          margin: 0 auto;
        }
        
        .report-header {
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #000;
          text-align: center;
        }
        
        .store-logo {
          text-align: center;
          margin-bottom: 5px;
        }
        
        .store-logo img {
          max-height: 40px;
          max-width: 100%;
        }
        
        .store-info {
          text-align: center;
        }
        
        .store-name {
          font-size: 16px;
          font-weight: bold;
          margin: 0;
        }
        
        .store-address, .store-phone {
          font-size: 12px;
          margin: 2px 0;
        }
        
        .report-title-box {
          border: 2px solid #000;
          padding: 5px;
          margin-bottom: 10px;
        }
        
        .report-title {
          font-size: 14px;
          font-weight: bold;
        }
        
        .report-date {
          font-size: 12px;
        }
        
        .section-header {
          background-color: #000;
          color: #fff;
          padding: 5px;
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 5px;
          text-align: center;
        }
        
        .summary-section {
          margin-bottom: 10px;
          border: 1px solid #000;
        }
        
        .summary-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        
        .summary-table td {
          padding: 4px;
        }
        
        .summary-label {
          text-align: left;
          font-weight: bold;
        }
        
        .summary-value {
          text-align: right;
          font-weight: bold;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }
        
        .data-table th, .data-table td {
          border: 1px solid #000;
          padding: 4px;
        }
        
        .data-table th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        
        .payment-method, .invoice-customer {
          text-align: left;
        }
        
        .payment-count, .payment-amount, .invoice-total, .invoice-paid, .invoice-method {
          text-align: right;
        }
        
        .no-data {
          text-align: center;
          padding: 10px;
        }
        
        .report-footer {
          margin-top: 10px;
          padding-top: 5px;
          border-top: 1px solid #000;
          font-size: 10px;
          text-align: center;
        }
      </style>
    `;
    
    PrintService.printReport(reportContent, pageTitle, () => {
      toast({
        title: language === 'ar' ? 'تم إرسال التقرير للطباعة' : 'Report sent to printer',
        description: language === 'ar' ? 'تتم معالجة طباعة التقرير' : 'Processing print request',
        variant: "default",
      });
    });
  };
  
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl md:text-2xl font-bold">{t.dailySalesReport}</h2>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center text-sm text-muted-foreground gap-1">
            <Store className="h-4 w-4" />
            <span>{storeInfo.name}</span>
          </div>
          <PrintReportButton onPrint={handlePrintReport} className="w-full sm:w-auto" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2 px-3 md:px-4">
            <CardTitle className="text-xs md:text-sm font-medium text-blue-700">
              {t.totalSales}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-4">
            <div className="text-xl md:text-2xl font-bold text-blue-900">{totalRevenue.toFixed(2)} {t.currency}</div>
            <p className="text-xs text-blue-600 mt-1">
              {t.forDay}: {format(new Date(), 'MM/dd/yyyy', { locale: enUS })}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2 px-3 md:px-4">
            <CardTitle className="text-xs md:text-sm font-medium text-purple-700">
              {t.invoiceCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-4">
            <div className="text-xl md:text-2xl font-bold text-purple-900">{todaySales.length}</div>
            <p className="text-xs text-purple-600 mt-1">
              {t.inTodaysTransactions}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2 px-3 md:px-4">
            <CardTitle className="text-xs md:text-sm font-medium text-green-700">
              {t.totalPayments}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-4">
            <div className="text-xl md:text-2xl font-bold text-green-900">{totalDeposit.toFixed(2)} {t.currency}</div>
            <p className="text-xs text-green-600 mt-1">
              {t.actuallyReceived}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2 px-3 md:px-4">
            <CardTitle className="text-xs md:text-sm font-medium text-amber-700">
              {t.remainingAmounts}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-4">
            <div className="text-xl md:text-2xl font-bold text-amber-900">{(totalRevenue - totalDeposit).toFixed(2)} {t.currency}</div>
            <p className="text-xs text-amber-600 mt-1">
              {t.deferredAmounts}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
        <Card className="border-indigo-200">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-t-lg py-3 px-3 md:p-4">
            <CardTitle className="text-indigo-700 text-sm md:text-base">{t.salesDistribution}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4">
            <SalesChart 
              lensRevenue={totalLensRevenue}
              frameRevenue={totalFrameRevenue}
              coatingRevenue={totalCoatingRevenue}
            />
          </CardContent>
        </Card>
        
        <Card className="border-teal-200">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-t-lg py-3 px-3 md:p-4">
            <CardTitle className="text-teal-700 text-sm md:text-base">{t.paymentMethods}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3 md:space-y-4 p-3 md:p-4">
            {paymentBreakdown.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-2 md:p-3 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  {payment.method === 'نقداً' || payment.method === 'Cash' ? (
                    <Wallet className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
                  ) : payment.method === 'كي نت' || payment.method === 'KNET' ? (
                    <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                  ) : payment.method === 'Visa' ? (
                    <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-indigo-500" />
                  ) : payment.method === 'MasterCard' ? (
                    <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                  ) : (
                    <Receipt className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                  )}
                  <span className="font-medium text-sm md:text-base">{payment.method}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <span className="text-xs md:text-sm text-gray-600 bg-gray-100 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
                    {payment.count} {t.transactions}
                  </span>
                  <span className="font-medium text-sm md:text-base text-gray-900">{payment.amount.toFixed(2)} {t.currency}</span>
                </div>
              </div>
            ))}
            
            {paymentBreakdown.length === 0 && (
              <p className="text-center text-m-text-xs md:text-smuted-foreground py-4">
                {t.noInvoices}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg py-3 px-3 md:p-4">
          <CardTitle className="text-gray-700 text-sm md:text-base">{t.todaysInvoiceList}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-4">
          {todaySales.length > 0 ? (
            <div className="space-y-3 md:space-y-4">
              {todaySales.map((invoice) => (
                <div key={invoice.invoiceId} 
                  className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200">
                  <div 
                    className={`flex flex-wrap md:flex-nowrap justify-between items-start md:items-center p-3 md:p-4 cursor-pointer gap-2 ${
                      expandedInvoices[invoice.invoiceId] ? 'bg-gray-50 border-b' : ''
                    }`}
                    onClick={() => toggleInvoiceExpansion(invoice.invoiceId)}
                  >
                    <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
                      <div className={`p-1.5 md:p-2 rounded-full ${invoice.isPaid ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        <Receipt size={16} className="md:w-[18px] md:h-[18px]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm md:text-base">{invoice.patientName}</h3>
                        <p className="text-xs md:text-sm text-gray-500">{invoice.invoiceId}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full md:w-auto gap-2 md:gap-6">
                      <div className="text-right">
                        <p className="font-medium text-sm md:text-base">{invoice.total.toFixed(2)} {t.currency}</p>
                        <p className="text-xs md:text-sm text-gray-500">{invoice.paymentMethod}</p>
                      </div>
                      <Button 
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 md:h-8 md:w-8 rounded-full"
                      >
                        {expandedInvoices[invoice.invoiceId] ? 
                          <ChevronUp size={16} className="md:w-[18px] md:h-[18px]" /> : 
                          <ChevronDown size={16} className="md:w-[18px] md:h-[18px]" />
                        }
                      </Button>
                    </div>
                  </div>
                  
                  {expandedInvoices[invoice.invoiceId] && (
                    <div className="p-3 md:p-4 bg-gray-50 space-y-3 md:space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                        <div className="bg-white p-2 md:p-3 rounded-md border">
                          <h4 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                            {t.customerInfo}
                          </h4>
                          <p className="font-medium text-sm md:text-base">{invoice.patientName}</p>
                          <p className="text-xs md:text-sm">{invoice.patientPhone}</p>
                          {invoice.patientId && <p className="text-xs text-gray-500">{t.fileNumber}: {invoice.patientId}</p>}
                        </div>
                        
                        <div className="bg-white p-2 md:p-3 rounded-md border">
                          <h4 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                            {t.paymentInfo}
                          </h4>
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-medium text-sm md:text-base">{t.total}:</span>
                            <span className="font-bold text-base md:text-lg">{invoice.total.toFixed(2)} {t.currency}</span>
                          </div>
                          <div className="flex justify-between items-center mt-1 md:mt-2">
                            <span className="text-blue-600 font-medium text-sm">{t.paid}:</span>
                            <span className="font-medium text-blue-600 text-sm">{invoice.deposit.toFixed(2)} {t.currency}</span>
                          </div>
                          {invoice.remaining > 0 && (
                            <div className="flex justify-between items-center mt-1 bg-amber-50 p-1 md:p-1.5 rounded">
                              <span className="text-amber-700 font-medium text-sm">{t.remaining}:</span>
                              <span className="font-medium text-amber-700 text-sm">{invoice.remaining.toFixed(2)} {t.currency}</span>
                            </div>
                          )}
                          {invoice.discount > 0 && (
                            <div className="flex justify-between text-green-600 mt-1 md:mt-2 bg-green-50 p-1 md:p-1.5 rounded">
                              <span className="flex items-center gap-1 font-medium text-sm">
                                <Tag size={12} className="md:w-[14px] md:h-[14px]" />
                                {t.discount}:
                              </span>
                              <span className="font-medium text-sm">{invoice.discount.toFixed(2)} {t.currency}</span>
                            </div>
                          )}
                          <div className="mt-2 md:mt-3 pt-1 md:pt-2 border-t">
                            <span className="text-xs md:text-sm font-medium text-gray-600">{t.paymentMethod}:</span>
                            <div className="flex items-center gap-1 mt-0.5 md:mt-1">
                              {invoice.paymentMethod === 'نقداً' || invoice.paymentMethod === 'Cash' ? (
                                <Wallet className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                              ) : invoice.paymentMethod === 'كي نت' || invoice.paymentMethod === 'KNET' ? (
                                <CreditCard className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
                              ) : invoice.paymentMethod === 'Visa' ? (
                                <CreditCard className="h-3 w-3 md:h-4 md:w-4 text-indigo-500" />
                              ) : invoice.paymentMethod === 'MasterCard' ? (
                                <CreditCard className="h-3 w-3 md:h-4 md:w-4 text-orange-500" />
                              ) : (
                                <Receipt className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
                              )}
                              <span className="text-xs md:text-sm">{invoice.paymentMethod}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-2 md:p-3 rounded-md border">
                          <h4 className="text-xs md:text-sm font-medium text-gray-500 mb-1">{t.invoiceStatus}</h4>
                          <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            invoice.isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {invoice.isPaid ? t.fullyPaid : t.partiallyPaid}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {t.creationDate}: {new Date(invoice.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                        <div className="bg-blue-50 p-2 md:p-3 rounded-md border border-blue-100">
                          <h4 className="text-xs md:text-sm font-medium text-blue-700 mb-1">{t.lenses}</h4>
                          <p className="font-medium text-sm md:text-base">{invoice.lensType}</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs md:text-sm text-blue-600">{t.price}:</span>
                            <span className="font-medium text-sm md:text-base">{invoice.lensPrice.toFixed(2)} {t.currency}</span>
                          </div>
                        </div>
                        
                        <div className="bg-purple-50 p-2 md:p-3 rounded-md border border-purple-100">
                          <h4 className="text-xs md:text-sm font-medium text-purple-700 mb-1">{t.frame}</h4>
                          <p className="font-medium text-sm md:text-base">{invoice.frameBrand} {invoice.frameModel}</p>
                          <p className="text-xs md:text-sm text-purple-600">{t.color}: {invoice.frameColor}</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs md:text-sm text-purple-600">{t.price}:</span>
                            <span className="font-medium text-sm md:text-base">{invoice.framePrice.toFixed(2)} {t.currency}</span>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 p-2 md:p-3 rounded-md border border-green-100">
                          <h4 className="text-xs md:text-sm font-medium text-green-700 mb-1">{t.coating}</h4>
                          <p className="font-medium text-sm md:text-base">{invoice.coating}</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs md:text-sm text-green-600">{t.price}:</span>
                            <span className="font-medium text-sm md:text-base">{invoice.coatingPrice.toFixed(2)} {t.currency}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12 bg-gray-50 rounded-lg">
              <Receipt className="h-8 w-8 md:h-12 md:w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-base md:text-lg font-medium text-gray-700 mb-1">{t.noInvoices}</h3>
              <p className="text-xs md:text-sm text-gray-500">{t.noInvoicesToday}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
