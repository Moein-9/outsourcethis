
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice } from "@/store/invoiceStore";
import { TransactionSearch } from "@/components/refunds/TransactionSearch";
import { RefundForm } from "@/components/refunds/RefundForm";
import { RefundReceipt } from "@/components/refunds/RefundReceipt";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownLeft, RefreshCw, Clock } from "lucide-react";

type ActiveView = 'search' | 'refund' | 'exchange' | 'receipt';

export const RefundExchangeManager: React.FC = () => {
  const { t } = useLanguageStore();
  
  const [activeView, setActiveView] = useState<ActiveView>('search');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [activeTab, setActiveTab] = useState<string>('refund');
  
  const handleSelectInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    if (activeTab === 'refund') {
      setActiveView('refund');
    } else {
      setActiveView('exchange');
    }
  };
  
  const handleRefundComplete = (refundId: string) => {
    setActiveView('receipt');
  };
  
  const handlePrintReceipt = () => {
    window.print();
  };
  
  const handleBackToSearch = () => {
    setActiveView('search');
    setSelectedInvoice(null);
  };
  
  const renderContent = () => {
    switch (activeView) {
      case 'refund':
        return selectedInvoice && (
          <RefundForm 
            invoice={selectedInvoice}
            onBack={handleBackToSearch}
            onRefundComplete={handleRefundComplete}
          />
        );
      case 'receipt':
        return selectedInvoice && (
          <RefundReceipt
            invoice={selectedInvoice}
            onBack={handleBackToSearch}
            onPrint={handlePrintReceipt}
          />
        );
      case 'search':
      default:
        return (
          <Card className="shadow-sm border-none">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg font-semibold">
                {t('exchangeAndRefunds')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value)}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="refund" className="flex items-center gap-2">
                    <ArrowDownLeft className="w-4 h-4" />
                    {t('processRefund')}
                  </TabsTrigger>
                  <TabsTrigger value="exchange" className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    {t('processExchange')}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="refund" className="mt-0">
                  <TransactionSearch onSelectInvoice={handleSelectInvoice} />
                </TabsContent>
                
                <TabsContent value="exchange" className="mt-0">
                  <div className="h-96 flex items-center justify-center border rounded-md bg-slate-50 mb-4">
                    <div className="text-center">
                      <Clock className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-lg font-medium text-slate-400">{t('comingSoon')}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        );
    }
  };
  
  return (
    <div className="py-4 max-w-4xl mx-auto">
      {renderContent()}
    </div>
  );
};
