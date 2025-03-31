
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
import { useLocationStore } from '@/store/locationStore';
import { LocationSelector } from './LocationSelector';

interface PrintOptionsDialogProps {
  invoice?: Invoice;
  workOrder: any;
  patient?: Patient;
  children: React.ReactNode;
  onPrintWorkOrder: (locationId?: string) => void;
  onPrintInvoice: (locationId?: string) => void;
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
  const { selectedLocation } = useLocationStore();
  const [open, setOpen] = React.useState(false);
  const [selectedLocationId, setSelectedLocationId] = React.useState<string>(
    invoice?.locationId || workOrder?.locationId || selectedLocation.id
  );

  const handlePrintWorkOrder = () => {
    setOpen(false);
    // Wait for the dialog to close before printing
    setTimeout(() => {
      onPrintWorkOrder(selectedLocationId);
    }, 150);
  };

  const handlePrintInvoice = () => {
    setOpen(false);
    // Wait for the dialog to close before printing
    setTimeout(() => {
      onPrintInvoice(selectedLocationId);
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

        <div className="mb-4">
          <LocationSelector
            selectedLocationId={selectedLocationId}
            onLocationChange={setSelectedLocationId}
            inline={true}
          />
        </div>

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
                    workOrder={workOrder} 
                    invoice={invoice} 
                    patient={patient}
                    isPrintable={true}
                    locationId={selectedLocationId}
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
                      locationId={selectedLocationId}
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
