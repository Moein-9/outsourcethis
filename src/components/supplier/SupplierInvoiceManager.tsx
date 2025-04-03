
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useLanguageStore } from '@/store/languageStore';
import { useSupplierInvoiceStore } from '@/store/supplierInvoiceStore';
import { SupplierInvoiceList } from './SupplierInvoiceList';
import { SupplierInvoiceSummary } from './SupplierInvoiceSummary';
import { SupplierInvoiceDialog } from './SupplierInvoiceDialog';
import { Button } from '@/components/ui/button';
import { SupplierInvoicePrint } from './SupplierInvoicePrint';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Printer, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SupplierInvoiceManager: React.FC = () => {
  const { language, t } = useLanguageStore();
  const isRtl = language === 'ar';
  const [activeTab, setActiveTab] = useState('list');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const invoices = useSupplierInvoiceStore(state => state.invoices);
  const navigate = useNavigate();

  const handleNavigate = (section: string) => {
    navigate("/");
    setTimeout(() => {
      const rootElement = document.getElementById('root');
      if (rootElement) {
        const event = new CustomEvent('navigate', { detail: { section } });
        rootElement.dispatchEvent(event);
      }
    }, 100);
  };

  const translations = {
    supplierInvoice: language === 'ar' ? 'فواتير الموردين' : 'Supplier Invoices',
    backToDashboard: language === 'ar' ? 'العودة إلى لوحة التحكم' : 'Back to Dashboard',
    invoicesList: language === 'ar' ? 'قائمة الفواتير' : 'Invoices List',
    monthlySummary: language === 'ar' ? 'التقرير الشهري' : 'Monthly Summary',
    addNewInvoice: language === 'ar' ? 'إضافة فاتورة جديدة' : 'Add New Invoice',
    print: language === 'ar' ? 'طباعة التقرير' : 'Print Report',
  };

  return (
    <Layout activeSection="supplierInvoice" onNavigate={handleNavigate}>
      <div className="container px-4 py-6 md:px-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold">{translations.supplierInvoice}</h1>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-600 border-teal-200"
            onClick={() => handleNavigate("dashboard")}
          >
            {language === 'ar' ? "←" : "←"} {translations.backToDashboard}
          </Button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-3 justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="list" className="text-sm">{translations.invoicesList}</TabsTrigger>
              <TabsTrigger value="summary" className="text-sm">{translations.monthlySummary}</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => setDialogOpen(true)} 
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              <PlusCircle size={16} />
              {translations.addNewInvoice}
            </Button>
            <Button 
              onClick={() => setPrintDialogOpen(true)} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Printer size={16} />
              {translations.print}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <TabsContent value="list" className="mt-0">
              <SupplierInvoiceList />
            </TabsContent>
            <TabsContent value="summary" className="mt-0">
              <SupplierInvoiceSummary />
            </TabsContent>
          </CardContent>
        </Card>

        <SupplierInvoiceDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />

        <SupplierInvoicePrint
          open={printDialogOpen}
          onOpenChange={setPrintDialogOpen}
        />
      </div>
    </Layout>
  );
};

export default SupplierInvoiceManager;
