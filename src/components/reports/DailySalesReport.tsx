
import React, { useState, useMemo, useEffect } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { useInvoiceStore, Invoice, Payment } from '@/store/invoiceStore';
import { DatePicker } from '@/components/ui/date-picker';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isValid, parseISO, isAfter, isBefore, isEqual, subDays, addDays } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface DailySalesReportProps {
  className?: string;
}

export const DailySalesReport: React.FC<DailySalesReportProps> = ({ className }) => {
  const { language, t } = useLanguageStore();
  const { invoices, refunds } = useInvoiceStore();
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [activeTab, setActiveTab] = useState('sales');
  
  useEffect(() => {
    // Ensure that the 'from' date is always before or equal to the 'to' date
    if (dateRange.from && dateRange.to && isAfter(dateRange.from, dateRange.to)) {
      setDateRange({ from: dateRange.to, to: dateRange.from });
    }
  }, [dateRange.from, dateRange.to]);
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, "dd/MM/yyyy") : "Invalid Date";
    } catch (error) {
      return "Invalid Date";
    }
  };
  
  const invoicesInRange = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return invoices;
    
    return invoices.filter(invoice => {
      const invoiceDate = parseISO(invoice.createdAt);
      const fromDate = dateRange.from;
      const toDate = dateRange.to;
      
      return (isAfter(invoiceDate, subDays(fromDate, 1)) && isBefore(invoiceDate, addDays(toDate, 1)));
    });
  }, [invoices, dateRange]);
  
  const refundsInRange = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return refunds;
    
    return refunds.filter(refund => {
      const refundDate = parseISO(refund.date);
      const fromDate = dateRange.from;
      const toDate = dateRange.to;
      
      return (isAfter(refundDate, subDays(fromDate, 1)) && isBefore(refundDate, addDays(toDate, 1)));
    });
  }, [refunds, dateRange]);
  
  const totalSales = useMemo(() => {
    return invoicesInRange.reduce((sum, invoice) => sum + invoice.total, 0);
  }, [invoicesInRange]);
  
  const totalPayments = useMemo(() => {
    return invoicesInRange.reduce((sum, invoice) => {
      if (invoice.payments) {
        return sum + invoice.payments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0);
      }
      return sum;
    }, 0);
  }, [invoicesInRange]);
  
  const totalRefunds = useMemo(() => {
    return refundsInRange.length;
  }, [refundsInRange]);
  
  const totalRefundAmount = useMemo(() => {
    return refundsInRange.reduce((sum, refund) => sum + refund.amount, 0);
  }, [refundsInRange]);
  
  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="md:flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{t('dailySalesReport')}</h2>
          <p className="text-muted-foreground">{t('overviewOfSales')}</p>
        </div>
        <div className="flex space-x-2">
          <DatePicker 
            date={dateRange}
            onSelect={setDateRange}
            placeholder="From - To"
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sales">{t('sales')}</TabsTrigger>
          <TabsTrigger value="payments">{t('payments')}</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <Card className="border-blue-100">
            <CardHeader className="bg-blue-50/50 pb-2">
              <CardTitle className="text-base font-medium text-blue-800">
                {t('salesInfo')}
              </CardTitle>
              <CardDescription className="text-blue-700">
                {t('totalSales')}: {totalSales.toFixed(3)} {t('kwd')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table className="border-t border-blue-100">
                <TableHeader className="bg-blue-50/30">
                  <TableRow>
                    <TableHead>{t('invoiceId')}</TableHead>
                    <TableHead>{t('patientName')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                    <TableHead className="text-right">{t('amount')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoicesInRange.map((invoice) => (
                    <TableRow key={invoice.invoiceId}>
                      <TableCell>{invoice.invoiceId}</TableCell>
                      <TableCell>{invoice.patientName}</TableCell>
                      <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                      <TableCell className="text-right font-medium text-blue-700">
                        {invoice.total.toFixed(3)} {t('kwd')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments" className="space-y-4">
          <Card className="border-green-100">
            <CardHeader className="bg-green-50/50 pb-2">
              <CardTitle className="text-base font-medium text-green-800">
                {t('paymentInfo')}
              </CardTitle>
              <CardDescription className="text-green-700">
                {t('totalPayments')}: {totalPayments.toFixed(3)} {t('kwd')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table className="border-t border-green-100">
                <TableHeader className="bg-green-50/30">
                  <TableRow>
                    <TableHead>{t('invoiceId')}</TableHead>
                    <TableHead>{t('paymentMethod')}</TableHead>
                    <TableHead>{t('paymentDate')}</TableHead>
                    <TableHead className="text-right">{t('amount')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoicesInRange.map((invoice) => (
                    invoice.payments?.map((payment, index) => (
                      <TableRow key={`${invoice.invoiceId}-${index}`}>
                        <TableCell>{invoice.invoiceId}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell className="text-right font-medium text-green-700">
                          {payment.amount.toFixed(3)} {t('kwd')}
                        </TableCell>
                      </TableRow>
                    ))
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {totalRefunds > 0 && (
        <Card className="border-red-100">
          <CardHeader className="bg-red-50/50 pb-2">
            <CardTitle className="text-base font-medium text-red-800">
              {t('refundInfo')}
            </CardTitle>
            <CardDescription className="text-red-700">
              {t('refundAmount')}: {totalRefundAmount.toFixed(3)} {t('kwd')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="border-t border-red-100">
              <TableHeader className="bg-red-50/30">
                <TableRow>
                  <TableHead>{t('refundId')}</TableHead>
                  <TableHead>{t('method')}</TableHead>
                  <TableHead>{t('refundDate')}</TableHead>
                  <TableHead className="text-right">{t('amount')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refundsInRange.map((refund) => (
                  <TableRow key={refund.refundId}>
                    <TableCell>{refund.refundId}</TableCell>
                    <TableCell>{refund.method}</TableCell>
                    <TableCell>{formatDate(refund.date)}</TableCell>
                    <TableCell className="text-right font-medium text-red-700">
                      {refund.amount.toFixed(3)} {t('kwd')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
