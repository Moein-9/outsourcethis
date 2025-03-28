
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { useInvoiceStore, Invoice, Refund } from "@/store/invoiceStore";
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
  Phone,
  RefreshCcw
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
  const refunds: Refund[] = invoiceStore?.refunds || [];
  
  const [todaySales, setTodaySales] = useState<Invoice[]>([]);
  const [todayRefunds, setTodayRefunds] = useState<Refund[]>([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState<{
    method: string;
    amount: number;
    count: number;
  }[]>([]);
  
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalRefunds, setTotalRefunds] = useState(0);
  const [netRevenue, setNetRevenue] = useState(0);
  const [totalLensRevenue, setTotalLensRevenue] = useState(0);
  const [totalFrameRevenue, setTotalFrameRevenue] = useState(0);
  const [totalCoatingRevenue, setTotalCoatingRevenue] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  
  const [expandedInvoices, setExpandedInvoices] = useState<Record<string, boolean>>({});
  
  const t = {
    dailySalesReport: language === 'ar' ? "تقرير المبيعات اليومي" : "Daily Sales Report",
    printReport: language === 'ar' ? "طباعة التقرير" : "Print Report",
    totalSales: language === 'ar' ? "إجمالي المبيعات" : "Total Sales",
    netSales: language === 'ar' ? "صافي المبيعات" : "Net Sales",
    totalRefunds: language === 'ar' ? "إجمالي المبالغ المستردة" : "Total Refunds",
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
    todaysRefundsList: language === 'ar' ? "قائمة المبالغ المستردة اليوم" : "Today's Refunds List",
    noInvoices: language === 'ar' ? "لا توجد فواتير" : "No Invoices",
    noRefunds: language === 'ar' ? "لا توجد مبالغ مستردة" : "No Refunds",
    noInvoicesToday: language === 'ar' ? "لم يتم إنشاء أي فواتير لليوم الحالي" : "No invoices have been created for today",
    noRefundsToday: language === 'ar' ? "لم يتم استرداد أي مبالغ لليوم الحالي" : "No refunds have been processed for today",
    lensRevenue: language === 'ar' ? "مبيعات العدسات" : "Lens Revenue",
    frameRevenue: language === 'ar' ? "مبيعات الإطارات" : "Frame Revenue",
    coatingRevenue: language === 'ar' ? "مبيعات الطلاءات" : "Coating Revenue",
    customerInfo: language === 'ar' ? "معلومات العميل" : "Customer Information",
    fileNumber: language === 'ar' ? "رقم الملف" : "File Number",
    paymentInfo: language === 'ar' ? "معلومات الدفع" : "Payment Information",
    refundInfo: language === 'ar' ? "معلومات الاسترداد" : "Refund Information",
    total: language === 'ar' ? "المجموع" : "Total",
    paid: language === 'ar' ? "المدفوع" : "Paid",
    remaining: language === 'ar' ? "المتبقي" : "Remaining",
    discount: language === 'ar' ? "الخصم" : "Discount",
    paymentMethod: language === 'ar' ? "طريقة الدفع" : "Payment Method",
    refundMethod: language === 'ar' ? "طريقة الاسترداد" : "Refund Method",
    refundReason: language === 'ar' ? "سبب الاسترداد" : "Refund Reason",
    invoiceStatus: language === 'ar' ? "حالة الفاتورة" : "Invoice Status",
    refunded: language === 'ar' ? "تم الاسترداد" : "Refunded",
    fullyPaid: language === 'ar' ? "مدفوعة بالكامل" : "Fully Paid",
    partiallyPaid: language === 'ar' ? "مدفوعة جزئياً" : "Partially Paid",
    creationDate: language === 'ar' ? "تاريخ الإنشاء" : "Creation Date",
    refundDate: language === 'ar' ? "تاريخ الاسترداد" : "Refund Date",
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
    
    // Get today's sales and exclude refunded invoices from revenue calculations
    const todaySalesData = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.createdAt);
      invoiceDate.setHours(0, 0, 0, 0);
      return invoiceDate.getTime() === today.getTime();
    });
    
    setTodaySales(todaySalesData);
    
    // Get today's refunds
    const todayRefundsData = refunds.filter(refund => {
      const refundDate = new Date(refund.date);
      refundDate.setHours(0, 0, 0, 0);
      return refundDate.getTime() === today.getTime();
    });
    
    setTodayRefunds(todayRefundsData);
    
    // Calculate total revenue excluding refunded invoices
    const revenue = todaySalesData.reduce((sum, invoice) => {
      if (invoice.isRefunded) return sum; // Skip refunded invoices
      
      if (invoice.invoiceType === 'contacts' && invoice.contactLensItems?.length) {
        const contactLensTotal = invoice.contactLensItems.reduce(
          (lensSum, lens) => lensSum + (lens.price || 0) * (lens.qty || 1), 0
        );
        return sum + Math.max(0, contactLensTotal - (invoice.discount || 0));
      }
      return sum + invoice.total;
    }, 0);
    
    // Calculate total refund amounts for today
    const refundsTotal = todayRefundsData.reduce((sum, refund) => sum + refund.amount, 0);
    
    // Net revenue after refunds
    const netRevenueAfterRefunds = revenue - refundsTotal;
    
    // Calculate revenue by product category (excluding refunded items)
    const lensRevenue = todaySalesData.reduce((sum, invoice) => {
      if (invoice.isRefunded) return sum;
      return sum + invoice.lensPrice;
    }, 0);
    
    const frameRevenue = todaySalesData.reduce((sum, invoice) => {
      if (invoice.isRefunded) return sum;
      return sum + invoice.framePrice;
    }, 0);
    
    const coatingRevenue = todaySalesData.reduce((sum, invoice) => {
      if (invoice.isRefunded) return sum;
      return sum + invoice.coatingPrice;
    }, 0);
    
    const contactLensRevenue = todaySalesData.reduce((sum, invoice) => {
      if (invoice.isRefunded) return sum;
      if (invoice.invoiceType === 'contacts' && invoice.contactLensItems?.length) {
        return sum + invoice.contactLensItems.reduce(
          (lensSum, lens) => lensSum + (lens.price || 0) * (lens.qty || 1), 0
        );
      }
      return sum;
    }, 0);
    
    // Calculate deposits excluding refunded invoices
    const deposits = todaySalesData.reduce((sum, invoice) => {
      if (invoice.isRefunded) return sum;
      return sum + invoice.deposit;
    }, 0);
    
    setTotalRevenue(revenue);
    setTotalRefunds(refundsTotal);
    setNetRevenue(netRevenueAfterRefunds);
    setTotalLensRevenue(lensRevenue + contactLensRevenue);
    setTotalFrameRevenue(frameRevenue);
    setTotalCoatingRevenue(coatingRevenue);
    setTotalDeposit(deposits);
    
    // Calculate payment method breakdown (excluding refunded invoices)
    const paymentMethods: Record<string, { amount: number; count: number }> = {};
    
    todaySalesData.forEach(invoice => {
      if (invoice.isRefunded) return; // Skip refunded invoices
      
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
  }, [invoices, refunds]);
  
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
      if (invoice.isRefunded) {
        invoicesHTML += `
          <tr class="refunded-row">
            <td class="invoice-customer">${invoice.patientName} <span class="refund-marker">(${t.refunded})</span></td>
            <td class="invoice-total"><s>${invoice.total.toFixed(2)} ${t.currency}</s></td>
            <td class="invoice-paid"><s>${invoice.deposit.toFixed(2)} ${t.currency}</s></td>
            <td class="invoice-method">${invoice.paymentMethod || '-'}</td>
          </tr>
        `;
      } else {
        invoicesHTML += `
          <tr>
            <td class="invoice-customer">${invoice.patientName}</td>
            <td class="invoice-total">${invoice.total.toFixed(2)} ${t.currency}</td>
            <td class="invoice-paid">${invoice.deposit.toFixed(2)} ${t.currency}</td>
            <td class="invoice-method">${invoice.paymentMethod || '-'}</td>
          </tr>
        `;
      }
    });
    
    // Add refunds table
    let refundsHTML = '';
    todayRefunds.forEach(refund => {
      refundsHTML += `
        <tr>
          <td class="refund-id">${refund.refundId}</td>
          <td class="refund-invoice">${refund.associatedInvoiceId}</td>
          <td class="refund-amount">${refund.amount.toFixed(2)} ${t.currency}</td>
          <td class="refund-method">${refund.method}</td>
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
              <td class="summary-label">${t.totalRefunds} | Total Refunds:</td>
              <td class="summary-value red-text">-${totalRefunds.toFixed(2)} ${t.currency}</td>
            </tr>
            <tr>
              <td class="summary-label">${t.netSales} | Net Sales:</td>
              <td class="summary-value">${netRevenue.toFixed(2)} ${t.currency}</td>
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
        
        ${todayRefunds.length > 0 ? `
          <div class="summary-section">
            <div class="section-header">${language === 'ar' ? 'المبالغ المستردة | Refunds' : 'Refunds | المبالغ المستردة'}</div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>${language === 'ar' ? 'رقم الاسترداد | Refund ID' : 'Refund ID | رقم الاسترداد'}</th>
                  <th>${language === 'ar' ? 'رقم الفاتورة | Invoice ID' : 'Invoice ID | رقم الفاتورة'}</th>
                  <th>${language === 'ar' ? 'المبلغ | Amount' : 'Amount | المبلغ'}</th>
                  <th>${language === 'ar' ? 'الطريقة | Method' : 'Method | الطريقة'}</th>
                </tr>
              </thead>
              <tbody>
                ${refundsHTML}
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
        
        .payment-method, .invoice-customer, .refund-id, .refund-invoice {
          text-align: left;
        }
        
        .payment-count, .payment-amount, .invoice-total, .invoice-paid, .invoice-method, .refund-amount, .refund-method {
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
        
        .red-text {
          color: #ea384c;
        }
        
        .refunded-row {
          color: #ea384c;
        }
        
        .refund-marker {
          font-style: italic;
          font-size: 90%;
        }
        
        s {
          text-decoration: line-through;
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
              {t.netSales}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-4">
            <div className="text-xl md:text-2xl font-bold text-blue-900">{netRevenue.toFixed(2)} {t.currency}</div>
            <p className="text-xs text-blue-600 mt-1">
              {t.forDay}: {format(new Date(), 'MM/dd/yyyy', { locale: enUS })}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2 px-3 md:px-4">
            <CardTitle className="text-xs md:text-sm font-medium text-red-700">
              {t.totalRefunds}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 md:px-4">
            <div className="text-xl md:text-2xl font-bold text-red-900">-{totalRefunds.toFixed(2)} {t.currency}</div>
            <p className="text-xs text-red-600 mt-1">
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
          <CardTitle className="text-gray-700 text-sm md:text-base flex items-center justify-between">
            <span>{t.todaysInvoiceList}</span>
            <span className="text-xs font-normal text-gray-500">
              {todaySales.length} {language === 'ar' ? 'فاتورة' : 'invoices'}
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {todaySales.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {todaySales.map((invoice, index) => (
                <Collapsible 
                  key={invoice.invoiceId || index}
                  open={expandedInvoices[invoice.invoiceId || `temp-${index}`]}
                  onOpenChange={() => toggleInvoiceExpansion(invoice.invoiceId || `temp-${index}`)}
                  className={`${invoice.isRefunded ? 'bg-red-50' : 'hover:bg-gray-50'} transition-colors`}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 md:p-4 text-left">
                    <div className="flex items-center gap-2">
                      {invoice.isRefunded ? (
                        <RefreshCcw className="h-4 w-4 text-red-500" />
                      ) : invoice.remaining > 0 ? (
                        <Tag className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Receipt className="h-4 w-4 text-green-600" />
                      )}
                      <div>
                        <p className={`font-medium ${invoice.isRefunded ? 'text-red-700' : 'text-gray-900'}`}>
                          {invoice.patientName} 
                          {invoice.isRefunded && (
                            <span className="ml-2 text-xs font-normal text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                              {t.refunded}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(invoice.createdAt), 'hh:mm a', { locale: enUS })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-6">
                      <div className="text-right">
                        <p className={`font-medium ${invoice.isRefunded ? 'text-red-700 line-through' : 'text-gray-900'}`}>
                          {invoice.total.toFixed(2)} {t.currency}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                          {invoice.paymentMethod || '-'} 
                          <span className={`${invoice.remaining > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                            ({invoice.remaining > 0 ? `${invoice.deposit.toFixed(2)}/${invoice.total.toFixed(2)}` : t.fullyPaid})
                          </span>
                        </p>
                      </div>
                      {expandedInvoices[invoice.invoiceId || `temp-${index}`] ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="px-3 pb-3 md:px-4 md:pb-4 pt-0 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1 text-sm border-t border-gray-200 pt-3">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" /> {t.customerInfo}
                        </h4>
                        <p className="flex justify-between text-gray-600 mb-1">
                          <span>{language === 'ar' ? 'الاسم:' : 'Name:'}</span>
                          <span className="font-medium">{invoice.patientName}</span>
                        </p>
                        {invoice.patientPhone && (
                          <p className="flex justify-between text-gray-600 mb-1">
                            <span>{language === 'ar' ? 'الهاتف:' : 'Phone:'}</span>
                            <span className="font-medium">{invoice.patientPhone}</span>
                          </p>
                        )}
                        {invoice.fileNumber && (
                          <p className="flex justify-between text-gray-600">
                            <span>{t.fileNumber}:</span>
                            <span className="font-medium">{invoice.fileNumber}</span>
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <CreditCard className="h-3.5 w-3.5" /> {invoice.isRefunded ? t.refundInfo : t.paymentInfo}
                        </h4>
                        <p className="flex justify-between text-gray-600 mb-1">
                          <span>{t.total}:</span>
                          <span className={`font-medium ${invoice.isRefunded ? 'line-through text-red-700' : ''}`}>
                            {invoice.total.toFixed(2)} {t.currency}
                          </span>
                        </p>
                        <p className="flex justify-between text-gray-600 mb-1">
                          <span>{t.paid}:</span>
                          <span className={`font-medium ${invoice.isRefunded ? 'line-through text-red-700' : ''}`}>
                            {invoice.deposit.toFixed(2)} {t.currency}
                          </span>
                        </p>
                        <p className="flex justify-between text-gray-600 mb-1">
                          <span>{t.remaining}:</span>
                          <span className={`font-medium ${invoice.isRefunded ? 'line-through text-red-700' : invoice.remaining > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                            {invoice.remaining.toFixed(2)} {t.currency}
                          </span>
                        </p>
                        <p className="flex justify-between text-gray-600 mb-1">
                          <span>{invoice.isRefunded ? t.refundMethod : t.paymentMethod}:</span>
                          <span className="font-medium">{invoice.paymentMethod || '-'}</span>
                        </p>
                        <p className="flex justify-between text-gray-600">
                          <span>{t.invoiceStatus}:</span>
                          <span className={`font-medium ${invoice.isRefunded ? 'text-red-600' : invoice.remaining > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                            {invoice.isRefunded ? t.refunded : invoice.remaining > 0 ? t.partiallyPaid : t.fullyPaid}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Product details - only show for non-contact lens invoices */}
                    {invoice.invoiceType !== 'contacts' && (
                      <div className="mt-3 text-sm border-t border-gray-200 pt-3">
                        <h4 className="font-medium text-gray-700 mb-2">{language === 'ar' ? 'تفاصيل المنتجات:' : 'Product Details:'}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {invoice.lensType && (
                            <div className="bg-white p-2 rounded border border-gray-200">
                              <h5 className="font-medium text-gray-800 mb-1">{t.lenses}</h5>
                              <p className="text-gray-600 mb-0.5">{invoice.lensType}</p>
                              <p className="text-gray-900">{invoice.lensPrice.toFixed(2)} {t.currency}</p>
                            </div>
                          )}
                          
                          {invoice.frameBrand && (
                            <div className="bg-white p-2 rounded border border-gray-200">
                              <h5 className="font-medium text-gray-800 mb-1">{t.frame}</h5>
                              <p className="text-gray-600 mb-0.5">{invoice.frameBrand} {invoice.frameModel && `- ${invoice.frameModel}`}</p>
                              <p className="text-gray-900">{invoice.framePrice.toFixed(2)} {t.currency}</p>
                            </div>
                          )}
                          
                          {invoice.coating && (
                            <div className="bg-white p-2 rounded border border-gray-200">
                              <h5 className="font-medium text-gray-800 mb-1">{t.coating}</h5>
                              <p className="text-gray-600 mb-0.5">{invoice.coating}</p>
                              <p className="text-gray-900">{invoice.coatingPrice.toFixed(2)} {t.currency}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <Receipt className="h-8 w-8 mx-auto mb-3 text-gray-300" />
              <p>{t.noInvoicesToday}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {todayRefunds.length > 0 && (
        <Card className="border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg py-3 px-3 md:p-4">
            <CardTitle className="text-red-700 text-sm md:text-base flex items-center justify-between">
              <span>{t.todaysRefundsList}</span>
              <span className="text-xs font-normal text-red-500">
                {todayRefunds.length} {language === 'ar' ? 'عملية استرداد' : 'refunds'}
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            {todayRefunds.length > 0 ? (
              <div className="divide-y divide-red-100">
                {todayRefunds.map((refund) => (
                  <div key={refund.refundId} className="p-3 md:p-4 hover:bg-red-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RefreshCcw className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {refund.refundId}
                          </p>
                          <p className="text-xs text-gray-500">
                            {t.refundDate}: {format(new Date(refund.date), 'dd/MM/yyyy hh:mm a', { locale: enUS })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-700">
                          -{refund.amount.toFixed(2)} {t.currency}
                        </p>
                        <p className="text-xs text-gray-500">
                          {refund.method}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-red-100">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{language === 'ar' ? 'الفاتورة المرتبطة:' : 'Associated Invoice:'}</span> {refund.associatedInvoiceId}
                      </p>
                      {refund.reason && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">{t.refundReason}:</span> {refund.reason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <RefreshCcw className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                <p>{t.noRefundsToday}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
