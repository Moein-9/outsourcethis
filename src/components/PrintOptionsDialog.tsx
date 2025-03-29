
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { Invoice } from '@/store/invoiceStore';
import { Patient } from '@/store/patientStore';
import { CustomWorkOrderReceipt } from './CustomWorkOrderReceipt';
import { ReceiptInvoice } from './ReceiptInvoice';
import { CustomPrintService } from '@/utils/CustomPrintService';

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
  const { language } = useLanguageStore();
  const [open, setOpen] = React.useState(false);

  // Automatically trigger printing when the button is clicked
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Directly print both the work order and invoice
    console.log("[PrintOptionsDialog] Directly printing without showing dialog");
    
    // Print work order first
    onPrintWorkOrder();
    
    // Then print invoice if available
    if (invoice) {
      setTimeout(() => {
        CustomPrintService.printInvoice(invoice);
      }, 500);
    }
  };

  return (
    <>
      {/* Instead of using the Dialog, we now directly handle the click */}
      <div onClick={handleButtonClick}>
        {children}
      </div>
    </>
  );
}
