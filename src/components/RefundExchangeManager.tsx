
import React, { useState } from "react";
import { useInvoiceStore, Invoice, WorkOrder } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { RefundForm } from "./RefundForm";
import { ExchangeForm } from "./ExchangeForm";
import { TransactionSearch } from "./TransactionSearch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Receipt, ArrowLeftRight, Search } from "lucide-react";

export const RefundExchangeManager: React.FC = () => {
  const { language, t } = useLanguageStore();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [activeTab, setActiveTab] = useState<"refund" | "exchange">("refund");
  
  const handleSelectTransaction = (invoice: Invoice, workOrder?: WorkOrder) => {
    if (invoice.isRefunded) {
      toast.error(t('invoiceAlreadyRefunded') || "This invoice has already been refunded");
      return;
    }
    
    if (invoice.isExchanged) {
      toast.error(t('invoiceAlreadyExchanged') || "This invoice has already been exchanged");
      return;
    }
    
    setSelectedInvoice(invoice);
    setSelectedWorkOrder(workOrder || null);
  };
  
  const handleClearSelection = () => {
    setSelectedInvoice(null);
    setSelectedWorkOrder(null);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {activeTab === "refund" ? (
              <Receipt className="h-5 w-5 text-primary" />
            ) : (
              <ArrowLeftRight className="h-5 w-5 text-primary" />
            )}
            {activeTab === "refund" ? t('refundManager') || "Refund Manager" : t('exchangeManager') || "Exchange Manager"}
          </CardTitle>
          <CardDescription>
            {activeTab === "refund" 
              ? (t('refundManagerDescription') || "Process refunds for customer purchases")
              : (t('exchangeManagerDescription') || "Process exchanges for customer purchases")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "refund" | "exchange")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="refund" className="flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                {t('refund') || "Refund"}
              </TabsTrigger>
              <TabsTrigger value="exchange" className="flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4" />
                {t('exchange') || "Exchange"}
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              {!selectedInvoice ? (
                <div className="mb-6">
                  <p className="text-sm mb-4">
                    {activeTab === "refund"
                      ? (t('searchForInvoiceToRefund') || "Search for an invoice to process a refund")
                      : (t('searchForInvoiceToExchange') || "Search for an invoice to process an exchange")}
                  </p>
                  <TransactionSearch onSelectTransaction={handleSelectTransaction} />
                </div>
              ) : (
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{t('selectedInvoice') || "Selected Invoice"}: {selectedInvoice.invoiceId}</h3>
                    <p className="text-sm text-muted-foreground">{selectedInvoice.patientName} - {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleClearSelection}>
                    {t('changeSelection') || "Change Selection"}
                  </Button>
                </div>
              )}
              
              <TabsContent value="refund" className="space-y-6 mt-4">
                {selectedInvoice && (
                  <RefundForm 
                    invoice={selectedInvoice} 
                    workOrder={selectedWorkOrder} 
                    onComplete={handleClearSelection}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="exchange" className="space-y-6 mt-4">
                {selectedInvoice && (
                  <ExchangeForm 
                    invoice={selectedInvoice} 
                    workOrder={selectedWorkOrder} 
                    onComplete={handleClearSelection}
                  />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
