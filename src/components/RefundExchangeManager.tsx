import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInvoiceStore, Invoice } from "@/store/invoiceStore";
import { TransactionSearch } from "@/components/TransactionSearch";
import { RefundForm } from "@/components/RefundForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCcw, DollarSign, Receipt } from "lucide-react";

export const RefundExchangeManager: React.FC = () => {
  const { t, language } = useLanguageStore();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [activeTab, setActiveTab] = useState<string>("refunds");
  
  const handleSelectInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };
  
  const handleRefundComplete = () => {
    // Keep the selected invoice to show the refund form with completed state
  };
  
  const handleBackToSearch = () => {
    setSelectedInvoice(null);
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-indigo-200 shadow-md">
        <CardHeader className="bg-gradient-to-r from-primary/15 to-primary/5">
          <CardTitle className="text-2xl text-primary flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            {t('refundsTitle')}
          </CardTitle>
          <CardDescription>
            {t('refundsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs
            defaultValue="refunds"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="refunds" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {language === 'ar' ? 'استرداد الأموال' : 'Refunds'}
              </TabsTrigger>
              <TabsTrigger value="exchanges" className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" />
                {language === 'ar' ? 'استبدال المنتجات' : 'Exchanges'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="refunds" className="mt-0">
              {selectedInvoice ? (
                <RefundForm 
                  invoice={selectedInvoice} 
                  onRefundComplete={handleRefundComplete}
                  onBack={handleBackToSearch}
                />
              ) : (
                <TransactionSearch onSelectInvoice={handleSelectInvoice} />
              )}
            </TabsContent>
            
            <TabsContent value="exchanges" className="mt-0">
              <Card className="border-dashed border-gray-300">
                <CardHeader className="text-center pb-2">
                  <RefreshCcw className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <CardTitle className="text-xl text-gray-600">
                    {language === 'ar' ? 'قريباً' : 'Coming Soon'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'ar' 
                      ? 'ميزة استبدال المنتجات ستكون متاحة قريباً. الرجاء المحاولة لاحقاً.'
                      : 'Product exchange functionality will be available soon. Please check back later.'}
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
