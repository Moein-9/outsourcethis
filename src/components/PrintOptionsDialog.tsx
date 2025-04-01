
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { Invoice } from '@/store/invoiceStore';
import { Patient } from '@/store/patientStore';
import { CustomWorkOrderReceipt } from './CustomWorkOrderReceipt';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ReceiptInvoice } from './ReceiptInvoice';

interface PrintOptionsDialogProps {
  invoice?: Invoice;
  workOrder: any;
  patient?: Patient;
  children: React.ReactNode;
  onPrintWorkOrder: () => void;
  onPrintInvoice: () => void;
}

export function PrintOptionsDialog({
  invoice,
  workOrder,
  patient,
  children,
  onPrintWorkOrder,
  onPrintInvoice
}: PrintOptionsDialogProps) {
  const { t, language } = useLanguageStore();
  const [open, setOpen] = React.useState(false);

  // Make sure workOrder has isContactLens and contactLensRx if needed
  const preparedWorkOrder = React.useMemo(() => {
    let prepared = { ...workOrder };
    
    // Check if this is a contact lens order
    const isContactLens = workOrder?.contactLenses?.length > 0 || 
                          invoice?.contactLensItems?.length > 0 ||
                          workOrder?.isContactLens === true;
    
    // Set isContactLens flag if needed
    if (isContactLens && !prepared.isContactLens) {
      prepared.isContactLens = true;
    }
    
    // Set contactLensRx if needed
    if (isContactLens && !prepared.contactLensRx) {
      if (invoice?.contactLensRx) {
        prepared.contactLensRx = invoice.contactLensRx;
      } else if (patient?.contactLensRx) {
        prepared.contactLensRx = patient.contactLensRx;
      }
    }
    
    return prepared;
  }, [workOrder, invoice, patient]);

  const handlePrintWorkOrder = () => {
    setOpen(false);
    // Wait for the dialog to close before printing
    setTimeout(() => {
      onPrintWorkOrder();
    }, 150);
  };

  const handlePrintInvoice = () => {
    setOpen(false);
    // Wait for the dialog to close before printing
    setTimeout(() => {
      onPrintInvoice();
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{t('printPreview')}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="workorder-preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="workorder-preview" className="bg-gray-100 data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
              {language === 'ar' ? "معاينة أمر العمل" : "Work Order Preview"}
            </TabsTrigger>
            <TabsTrigger value="invoice-preview" disabled={!invoice} className="bg-gray-100 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800">
              {language === 'ar' ? "معاينة الفاتورة" : "Invoice Preview"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workorder-preview">
            <div className="bg-gray-100 p-4 rounded-lg border">
              <div className="bg-white max-w-[80mm] mx-auto p-1 border rounded shadow-sm">
                <div id="work-order-receipt">
                  <CustomWorkOrderReceipt 
                    workOrder={preparedWorkOrder} 
                    invoice={invoice} 
                    patient={patient}
                    isPrintable={true}
                  />
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <Button 
                  onClick={handlePrintWorkOrder}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Printer className="h-4 w-4" />
                  {language === 'ar' ? "طباعة أمر العمل" : "Print Work Order"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="invoice-preview">
            {invoice ? (
              <div className="bg-gray-100 p-4 rounded-lg border">
                <div className="bg-white max-w-[80mm] mx-auto p-1 border rounded shadow-sm">
                  <div id="receipt-invoice">
                    <ReceiptInvoice 
                      invoice={invoice} 
                      isPrintable={true}
                    />
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <Button 
                    onClick={handlePrintInvoice}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Printer className="h-4 w-4" />
                    {language === 'ar' ? "طباعة الفاتورة" : "Print Invoice"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                {language === 'ar' ? "لا توجد فاتورة متاحة للطباعة" : "No invoice available for printing"}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-center mt-2">
          <Button 
            variant="ghost"
            onClick={() => setOpen(false)}
          >
            {t('cancel')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
