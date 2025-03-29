
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, FileText, Receipt } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { Invoice } from '@/store/invoiceStore';
import { Patient } from '@/store/patientStore';
import { CustomWorkOrderReceipt } from './CustomWorkOrderReceipt';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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

  const handlePrintWorkOrder = () => {
    setOpen(false);
    setTimeout(() => {
      onPrintWorkOrder();
    }, 100);
  };

  const handlePrintInvoice = () => {
    setOpen(false);
    setTimeout(() => {
      onPrintInvoice();
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{t('printOptions')}</DialogTitle>
          <DialogDescription>
            {t('selectDocumentToPrint')}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="options" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="options">
              {language === 'ar' ? "خيارات الطباعة" : "Print Options"}
            </TabsTrigger>
            <TabsTrigger value="workorder-preview">
              {language === 'ar' ? "معاينة أمر العمل" : "Work Order Preview"}
            </TabsTrigger>
            <TabsTrigger value="invoice-preview" disabled={!invoice}>
              {language === 'ar' ? "معاينة الفاتورة" : "Invoice Preview"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="options">
            <div className="grid grid-cols-2 gap-4 py-4">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-32 p-4 bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
                onClick={handlePrintWorkOrder}
              >
                <FileText className="h-12 w-12 mb-3 text-blue-600" />
                <span className="text-blue-700 font-medium text-base">{t('workOrder')}</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-32 p-4 bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300"
                onClick={handlePrintInvoice}
                disabled={!invoice}
              >
                <Receipt className="h-12 w-12 mb-3 text-green-600" />
                <span className="text-green-700 font-medium text-base">{t('invoice')}</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="workorder-preview">
            <div className="bg-gray-100 p-4 rounded-lg border">
              <div className="bg-white max-w-[80mm] mx-auto p-1 border rounded shadow-sm">
                <div id="work-order-receipt">
                  <CustomWorkOrderReceipt 
                    workOrder={workOrder} 
                    invoice={invoice} 
                    patient={patient}
                    isPrintable={false}
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
                  {/* Invoice preview using the existing invoice template */}
                  <div className="receipt-content p-2 text-black text-sm">
                    <div className="text-center border-b pb-2 mb-2">
                      <div className="font-bold text-lg">{language === 'ar' ? "فاتورة" : "INVOICE"}</div>
                      <div># {invoice.invoiceId}</div>
                      <div>{new Date(invoice.createdAt).toLocaleDateString()}</div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="font-semibold">{language === 'ar' ? "العميل:" : "Customer:"}</div>
                      <div>{invoice.patientName}</div>
                      <div>{invoice.patientPhone}</div>
                    </div>
                    
                    <div className="border-t border-b py-2 mb-2">
                      <div className="font-semibold">{language === 'ar' ? "المنتجات:" : "Items:"}</div>
                      {invoice.invoiceType === 'glasses' ? (
                        <div className="space-y-1 mt-1">
                          {invoice.frameBrand && (
                            <div className="flex justify-between">
                              <div>{invoice.frameBrand} {invoice.frameModel}</div>
                              <div>{invoice.framePrice.toFixed(3)} KWD</div>
                            </div>
                          )}
                          {invoice.lensType && (
                            <div className="flex justify-between">
                              <div>{invoice.lensType}</div>
                              <div>{invoice.lensPrice.toFixed(3)} KWD</div>
                            </div>
                          )}
                          {invoice.coating && (
                            <div className="flex justify-between">
                              <div>{invoice.coating}</div>
                              <div>{invoice.coatingPrice.toFixed(3)} KWD</div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1 mt-1">
                          {invoice.contactLensItems?.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <div>{item.brand} {item.type}</div>
                              <div>{(item.price * (item.qty || 1)).toFixed(3)} KWD</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between font-medium">
                        <div>{language === 'ar' ? "المجموع:" : "Subtotal:"}</div>
                        <div>{(invoice.total + invoice.discount).toFixed(3)} KWD</div>
                      </div>
                      {invoice.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <div>{language === 'ar' ? "الخصم:" : "Discount:"}</div>
                          <div>-{invoice.discount.toFixed(3)} KWD</div>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg pt-1 border-t">
                        <div>{language === 'ar' ? "الإجمالي:" : "Total:"}</div>
                        <div>{invoice.total.toFixed(3)} KWD</div>
                      </div>
                      <div className="flex justify-between">
                        <div>{language === 'ar' ? "المدفوع:" : "Paid:"}</div>
                        <div>{invoice.deposit.toFixed(3)} KWD</div>
                      </div>
                      <div className="flex justify-between">
                        <div>{language === 'ar' ? "المتبقي:" : "Remaining:"}</div>
                        <div>{invoice.remaining.toFixed(3)} KWD</div>
                      </div>
                    </div>
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
