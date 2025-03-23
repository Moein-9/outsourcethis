
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { CustomWorkOrderReceipt } from './CustomWorkOrderReceipt';

interface PrintWorkOrderButtonProps {
  workOrder: any;
  invoice?: any;
  patient?: any;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const CustomPrintWorkOrderButton: React.FC<PrintWorkOrderButtonProps> = ({
  workOrder,
  invoice,
  patient,
  className = '',
  variant = "outline",
  size = "sm"
}) => {
  const { t } = useLanguageStore();
  const [open, setOpen] = useState(false);
  
  const handlePrint = () => {
    console.log("CustomPrintWorkOrderButton: Printing work order", { workOrder, invoice, patient });
    setOpen(false); // Close dialog before printing
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Failed to open print window');
      return;
    }

    // Create a container for the receipt
    const container = document.createElement('div');
    container.className = 'print-container';
    printWindow.document.body.appendChild(container);

    // Add necessary styles for thermal paper
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
      
      body {
        margin: 0;
        padding: 0;
        font-family: 'Cairo', sans-serif;
        width: 80mm;
        background-color: white;
      }
      
      .print-container {
        width: 80mm;
        margin: 0 auto;
        background-color: white;
      }
      
      @media print {
        @page {
          size: 80mm auto;
          margin: 0;
        }
        
        body {
          width: 80mm;
          margin: 0;
          padding: 0;
        }
        
        .print-container {
          width: 80mm;
          margin: 0;
        }
      }
    `;
    printWindow.document.head.appendChild(style);

    // Clone the receipt component directly to the print window
    const receiptElement = document.createElement('div');
    receiptElement.className = 'receipt-content';
    container.appendChild(receiptElement);
    
    // Add title for the print job
    const title = document.createElement('title');
    title.textContent = t('workOrderReceipt');
    printWindow.document.head.appendChild(title);

    // Render the component
    const renderReceiptContent = () => {
      const receiptHtml = `
        <div style="width: 80mm; background-color: white; padding: 5px;">
          ${document.getElementById('work-order-receipt')?.outerHTML || ''}
        </div>
      `;
      receiptElement.innerHTML = receiptHtml;
      
      // Add print script
      const script = document.createElement('script');
      script.innerHTML = `
        // Wait for content and images to load
        window.onload = function() {
          setTimeout(function() {
            window.focus();
            window.print();
            // Don't close the window automatically to allow user to see preview
          }, 500);
        };
      `;
      printWindow.document.body.appendChild(script);
    };

    // Delay to ensure dialog is fully closed
    setTimeout(() => {
      // Create a temporary element to render the receipt
      const tempElement = document.createElement('div');
      document.body.appendChild(tempElement);
      
      // Render temporarily to the DOM to capture HTML
      const tempComponent = document.createElement('div');
      tempComponent.id = 'temp-work-order-receipt';
      tempElement.appendChild(tempComponent);
      
      const content = document.createElement('div');
      content.innerHTML = `
        <div id="work-order-receipt" class="print-content" style="width: 80mm; background-color: white;">
          ${renderCustomWorkOrderReceipt()}
        </div>
      `;
      tempComponent.appendChild(content);
      
      // Extract the generated HTML
      const receiptHtml = document.getElementById('work-order-receipt')?.outerHTML || '';
      
      // Remove the temporary element
      document.body.removeChild(tempElement);
      
      // Add the HTML to the print window
      receiptElement.innerHTML = receiptHtml;
      
      // Add print script
      const script = document.createElement('script');
      script.innerHTML = `
        // Wait for content and images to load
        window.onload = function() {
          setTimeout(function() {
            window.focus();
            window.print();
          }, 500);
        };
      `;
      printWindow.document.body.appendChild(script);
    }, 300);
  };
  
  // Function to generate receipt content as HTML string
  const renderCustomWorkOrderReceipt = () => {
    // Create a representation of the receipt as HTML
    const { language } = useLanguageStore.getState();
    const isRtl = language === 'ar';
    
    // This is a simplified representation of the receipt
    // You may need to enhance this based on your specific receipt design
    return `
      <div dir="${isRtl ? 'rtl' : 'ltr'}" class="receipt-content" style="font-family: ${isRtl ? 'Cairo' : 'Arial'}, sans-serif; width: 80mm; padding: 8px; background-color: white;">
        <div style="text-align: center; margin-bottom: 10px;">
          <h1 style="font-size: 16px; margin: 0;">${workOrder.title || 'Work Order Receipt'}</h1>
          <p style="font-size: 12px; margin: 5px 0;">${workOrder.invoiceId || workOrder.id || ''}</p>
          <p style="font-size: 10px; margin: 0;">${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="margin-bottom: 10px; border-top: 1px dashed #000; padding-top: 5px;">
          <p style="margin: 2px 0; font-size: 12px;"><strong>Patient:</strong> ${patient?.name || workOrder.patientName || ''}</p>
          <p style="margin: 2px 0; font-size: 12px;"><strong>Phone:</strong> ${patient?.phone || workOrder.patientPhone || ''}</p>
        </div>
        
        ${workOrder.frame ? `
        <div style="margin-bottom: 10px;">
          <h2 style="font-size: 14px; margin: 5px 0; border-bottom: 1px solid #ccc;">Frame Details</h2>
          <p style="margin: 2px 0; font-size: 12px;"><strong>Brand/Model:</strong> ${workOrder.frame.brand} ${workOrder.frame.model}</p>
          <p style="margin: 2px 0; font-size: 12px;"><strong>Color:</strong> ${workOrder.frame.color}</p>
          <p style="margin: 2px 0; font-size: 12px;"><strong>Price:</strong> ${workOrder.frame.price?.toFixed(3) || '0.000'} KWD</p>
        </div>
        ` : ''}
        
        <div style="margin-top: 10px; border-top: 1px dashed #000; padding-top: 5px;">
          <p style="margin: 2px 0; font-size: 12px;"><strong>Total:</strong> ${invoice?.total?.toFixed(3) || '0.000'} KWD</p>
          <p style="margin: 2px 0; font-size: 12px;"><strong>Paid:</strong> ${invoice?.deposit?.toFixed(3) || '0.000'} KWD</p>
          <p style="margin: 2px 0; font-size: 12px;"><strong>Remaining:</strong> ${((invoice?.total || 0) - (invoice?.deposit || 0)).toFixed(3)} KWD</p>
        </div>
        
        <div style="text-align: center; margin-top: 15px; font-size: 10px;">
          <p style="margin: 0;">Thank you for choosing our services</p>
        </div>
      </div>
    `;
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={variant}
          size={size}
          className={`gap-1 ${className}`}
        >
          <Printer className="h-4 w-4" />
          {t('printWorkOrder')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto p-0">
        <div className="p-6 flex flex-col items-center">
          <DialogTitle className="sr-only">{t('workOrderPreview')}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('previewBeforePrinting')}
          </DialogDescription>
          
          <div className="w-full max-w-[80mm] bg-white p-0 border rounded shadow-sm mb-4">
            <CustomWorkOrderReceipt 
              workOrder={workOrder} 
              invoice={invoice} 
              patient={patient}
              isPrintable={false}
            />
          </div>
          <Button onClick={handlePrint} className="mt-4 gap-2">
            <Printer className="h-4 w-4" />
            {t('print')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
