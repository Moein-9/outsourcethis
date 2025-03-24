
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, FileText, Receipt } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { Invoice } from '@/store/invoiceStore';
import { Patient, usePatientStore } from '@/store/patientStore';

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('printOptions')}</DialogTitle>
          <DialogDescription>
            {t('selectDocumentToPrint')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-28 p-4 bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
            onClick={() => {
              setOpen(false);
              onPrintWorkOrder();
            }}
          >
            <FileText className="h-10 w-10 mb-2 text-blue-600" />
            <span className="text-blue-700 font-medium">{t('workOrder')}</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-28 p-4 bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300"
            onClick={() => {
              setOpen(false);
              onPrintInvoice();
            }}
            disabled={!invoice}
          >
            <Receipt className="h-10 w-10 mb-2 text-green-600" />
            <span className="text-green-700 font-medium">{t('invoice')}</span>
          </Button>
        </div>
        <div className="flex justify-center">
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
