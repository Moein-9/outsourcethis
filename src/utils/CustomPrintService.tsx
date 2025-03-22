
import React from 'react';
import { createRoot } from 'react-dom/client';
import { CustomWorkOrderReceipt } from '@/components/CustomWorkOrderReceipt';
import { toast } from '@/hooks/use-toast';
import { useLanguageStore } from '@/store/languageStore';
import { Button } from '@/components/ui/button';
import { X, Printer } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';

// Component for the print preview dialog
interface PrintPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  workOrder: any;
  invoice?: any;
  patient?: any;
}

const PrintPreviewDialog: React.FC<PrintPreviewDialogProps> = ({
  open,
  onClose,
  workOrder,
  invoice,
  patient
}) => {
  const { t, language } = useLanguageStore();
  
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Failed to open print window');
      toast({
        title: "Error",
        description: "Failed to open print window. Please check your browser settings.",
        variant: "destructive"
      });
      return;
    }

    // Add necessary styles
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
      body {
        margin: 0;
        padding: 0;
        font-family: 'Cairo', sans-serif;
        background-color: white;
      }
      
      @media print {
        @page {
          size: 80mm auto;
          margin: 0;
        }
        body {
          width: 80mm;
          background: white;
        }
      }
    `;
    printWindow.document.head.appendChild(style);
    
    // Create a container for the receipt content
    const container = document.createElement('div');
    printWindow.document.body.appendChild(container);
    
    // Render the receipt in the print window
    createRoot(container).render(
      <CustomWorkOrderReceipt
        workOrder={workOrder}
        invoice={invoice}
        patient={patient}
        isPrintable={true}
      />
    );
    
    // Execute print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      
      // Notify success
      toast({
        title: t("printJobSent"),
        description: t("printJobSentDescription"),
      });
      
      // Close the dialog after print is initialized
      onClose();
      
      // Close the print window after a delay to ensure print dialog appears
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    }, 500);
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] flex flex-col" style={{ width: 'auto' }}>
        <DialogHeader>
          <DialogTitle>{t("workOrderPreview")}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-4 flex justify-center bg-muted/20">
          <div className="bg-white shadow-md">
            <CustomWorkOrderReceipt
              workOrder={workOrder}
              invoice={invoice}
              patient={patient}
              isPrintable={false}
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'طباعة' : 'Print'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main PrintService
export const CustomPrintService = {
  // Private state to manage the dialog
  _dialogState: {
    isOpen: false,
    workOrder: null as any | null,
    invoice: null as any | null,
    patient: null as any | null,
    rootElement: null as HTMLElement | null,
    rootContainer: null as any | null,
  },
  
  // Method to initialize the dialog container once
  _initializeDialogContainer() {
    // Only create the container if it doesn't exist
    if (!this._dialogState.rootElement) {
      const container = document.createElement('div');
      container.id = 'print-preview-dialog-container';
      document.body.appendChild(container);
      this._dialogState.rootElement = container;
      this._dialogState.rootContainer = createRoot(container);
    }
  },
  
  // Method to open preview dialog
  previewWorkOrder: (workOrder: any, invoice?: any, patient?: any) => {
    console.log("CustomPrintService: Previewing work order", { workOrder, invoice, patient });
    
    // Initialize dialog container if needed
    CustomPrintService._initializeDialogContainer();
    
    // Update state
    CustomPrintService._dialogState.isOpen = true;
    CustomPrintService._dialogState.workOrder = workOrder;
    CustomPrintService._dialogState.invoice = invoice;
    CustomPrintService._dialogState.patient = patient;
    
    // Render dialog
    if (CustomPrintService._dialogState.rootContainer) {
      CustomPrintService._dialogState.rootContainer.render(
        <PrintPreviewDialog
          open={true}
          onClose={() => {
            CustomPrintService._dialogState.isOpen = false;
            CustomPrintService._dialogState.rootContainer.render(
              <PrintPreviewDialog
                open={false}
                onClose={() => {}}
                workOrder={CustomPrintService._dialogState.workOrder}
                invoice={CustomPrintService._dialogState.invoice}
                patient={CustomPrintService._dialogState.patient}
              />
            );
          }}
          workOrder={workOrder}
          invoice={invoice}
          patient={patient}
        />
      );
    }
  }
};
