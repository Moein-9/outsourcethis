
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Printer, FileText } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { ReceiptInvoice } from "./ReceiptInvoice";
import { CustomPrintWorkOrderButton } from "./CustomPrintWorkOrderButton";
import { CustomPrintService } from "@/utils/CustomPrintService";

interface InvoiceWorkOrderActionsProps {
  invoice: any;
  onSaveInvoice: () => void;
  isSaved: boolean;
  workOrderPrinted: boolean;
  setWorkOrderPrinted: (printed: boolean) => void;
  patient?: any;
}

export const InvoiceWorkOrderActions: React.FC<InvoiceWorkOrderActionsProps> = ({
  invoice,
  onSaveInvoice,
  isSaved,
  workOrderPrinted,
  setWorkOrderPrinted,
  patient
}) => {
  const { t, language } = useLanguageStore();
  const [showReceipt, setShowReceipt] = useState(false);
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  
  const handlePrintWorkOrder = () => {
    // Mark work order as printed
    setWorkOrderPrinted(true);
  };
  
  const handlePrintInvoice = () => {
    // Just print the invoice
    if (invoice) {
      const receiptContent = document.getElementById(`print-receipt-${invoice.invoiceId}`)?.innerHTML;
      if (!receiptContent) {
        return;
      }
      
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        return;
      }
      
      const printStyles = `
        @page {
          size: 80mm auto;
          margin: 0;
        }
        body {
          width: 80mm !important;
          margin: 0 !important;
          padding: 0 !important;
          font-family: 'Courier New', monospace;
        }
        .receipt-container {
          width: 80mm !important;
          max-width: 80mm !important;
          padding: 5mm;
          box-sizing: border-box;
          margin: 0 auto;
        }
        @media print {
          .print-button {
            display: none !important;
          }
        }
      `;
      
      const printContent = `
        <!DOCTYPE html>
        <html dir="${language === 'ar' ? 'rtl' : 'ltr'}" lang="${language}">
        <head>
          <title>${language === 'ar' ? 'فاتورة' : 'Invoice'} ${invoice.invoiceId}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${printStyles}</style>
        </head>
        <body>
          <div class="receipt-container">
            ${receiptContent}
          </div>
          <button class="print-button" onclick="window.print(); setTimeout(() => window.close(), 500);" 
            style="display: block; margin: 20px auto; padding: 10px 20px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">
            ${language === 'ar' ? 'طباعة' : 'Print'}
          </button>
          <script>
            setTimeout(() => {
              window.print();
              setTimeout(() => window.close(), 500);
            }, 500);
          </script>
        </body>
        </html>
      `;
      
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };
  
  return (
    <div className={`space-y-4 py-4 ${dirClass}`}>
      <h3 className="text-lg font-semibold border-b pb-2">
        {language === 'ar' ? 'إجراءات الفاتورة وأمر العمل' : 'Invoice & Work Order Actions'}
      </h3>
      
      <div className="rounded-md border p-4">
        <div className="space-y-6">
          {/* Step 1: Save Invoice */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                1
              </div>
              <h4 className="font-medium">
                {language === 'ar' ? 'الخطوة الأولى: حفظ الفاتورة' : 'Step 1: Save Invoice'}
              </h4>
            </div>
            <p className="text-sm text-muted-foreground ml-9">
              {language === 'ar' 
                ? 'انقر لحفظ الفاتورة وإنشاء رقم الفاتورة' 
                : 'Click to save the invoice and generate invoice number'}
            </p>
            <div className="ml-9">
              <Button 
                onClick={onSaveInvoice} 
                disabled={isSaved}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {language === 'ar' ? 'حفظ الفاتورة' : 'Save Invoice'}
              </Button>
              
              {isSaved && invoice?.invoiceId && (
                <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <span>✓</span>
                  <span>
                    {language === 'ar' 
                      ? `تم الحفظ. رقم الفاتورة: ${invoice.invoiceId}` 
                      : `Saved. Invoice ID: ${invoice.invoiceId}`}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Step 2: Print Work Order */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                2
              </div>
              <h4 className="font-medium">
                {language === 'ar' ? 'الخطوة الثانية: طباعة أمر العمل' : 'Step 2: Print Work Order'}
              </h4>
            </div>
            <p className="text-sm text-muted-foreground ml-9">
              {language === 'ar' 
                ? 'بعد حفظ الفاتورة، اطبع أمر العمل' 
                : 'After saving the invoice, print the work order'}
            </p>
            <div className="ml-9">
              {isSaved ? (
                <CustomPrintWorkOrderButton
                  workOrder={invoice}
                  invoice={invoice}
                  patient={patient}
                  variant="default"
                  size="default"
                  className="gap-2"
                />
              ) : (
                <Button disabled className="gap-2">
                  <Printer className="h-4 w-4" />
                  {language === 'ar' ? 'طباعة أمر العمل' : 'Print Work Order'}
                </Button>
              )}
              
              {workOrderPrinted && (
                <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <span>✓</span>
                  <span>
                    {language === 'ar' 
                      ? 'تمت طباعة أمر العمل' 
                      : 'Work order printed'}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Step 3: Print Invoice */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                3
              </div>
              <h4 className="font-medium">
                {language === 'ar' ? 'الخطوة الثالثة: طباعة الفاتورة' : 'Step 3: Print Invoice'}
              </h4>
            </div>
            <p className="text-sm text-muted-foreground ml-9">
              {language === 'ar' 
                ? 'بعد طباعة أمر العمل، اطبع الفاتورة النهائية' 
                : 'After printing the work order, print the final invoice'}
            </p>
            <div className="ml-9">
              <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    disabled={!isSaved}
                  >
                    <FileText className="h-4 w-4" />
                    {language === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice'}
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>
                      {language === 'ar' ? 'معاينة الفاتورة' : 'Invoice Preview'}
                    </DialogTitle>
                    <DialogDescription>
                      {language === 'ar' 
                        ? 'تحقق من الفاتورة قبل الطباعة'
                        : 'Check the invoice before printing'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="max-h-[70vh] overflow-y-auto py-4" id={`print-receipt-${invoice?.invoiceId || 'preview'}`}>
                    <ReceiptInvoice invoice={invoice} isPrintable={false} />
                  </div>
                  
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowReceipt(false)}
                    >
                      {language === 'ar' ? 'إغلاق' : 'Close'}
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowReceipt(false);
                        handlePrintInvoice();
                      }}
                      className="gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      {language === 'ar' ? 'طباعة' : 'Print'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
