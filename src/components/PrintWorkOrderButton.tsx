
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Store } from "lucide-react";
import { WorkOrderPrintSelector } from "./WorkOrderPrintSelector";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, useInvoiceStore } from "@/store/invoiceStore";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { storeLocations } from "@/assets/logo";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

interface PrintWorkOrderButtonProps {
  invoice: Invoice;
  patientName?: string;
  patientPhone?: string;
  rx?: any;
  lensType?: string;
  coating?: string;
  frame?: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  };
  contactLenses?: any[];
  contactLensRx?: any;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  thermalOnly?: boolean;
  isNewInvoice?: boolean;
  onInvoiceSaved?: (invoiceId: string, workOrderId: string) => void;
}

export const PrintWorkOrderButton: React.FC<PrintWorkOrderButtonProps> = ({
  invoice,
  patientName,
  patientPhone,
  rx,
  lensType,
  coating,
  frame,
  contactLenses,
  contactLensRx,
  className,
  variant = "outline",
  size = "sm",
  thermalOnly = false,
  isNewInvoice = false,
  onInvoiceSaved,
}) => {
  const { t, language } = useLanguageStore();
  const [loading, setLoading] = useState(false);
  const [storeLocation, setStoreLocation] = useState<string>("alSomait");
  const [openLocationDialog, setOpenLocationDialog] = useState(false);
  const { addInvoice, addExistingInvoice, addWorkOrder } = useInvoiceStore();
  
  const handlePrint = () => {
    if (isNewInvoice && !invoice.invoiceId) {
      setOpenLocationDialog(true);
    } else {
      // If already has an ID, just show the print selector
      showPrintSelector(invoice);
    }
  };
  
  const saveInvoiceAndPrint = () => {
    // If it's a new invoice, save it first to generate an invoice ID
    if (isNewInvoice && !invoice.invoiceId) {
      setLoading(true);
      try {
        // Create a work order
        const workOrder = {
          patientId: invoice.patientId || 'anonymous',
          lensType: {
            name: invoice.lensType,
            price: invoice.lensPrice
          }
        };
        
        // Generate work order ID
        const workOrderId = addWorkOrder?.(workOrder) || `WO${Date.now()}`;
        
        // Save the invoice to get an ID and link to work order
        const invoiceId = addInvoice({
          patientId: invoice.patientId,
          patientName: invoice.patientName,
          patientPhone: invoice.patientPhone,
          lensType: invoice.lensType,
          lensPrice: invoice.lensPrice,
          coating: invoice.coating,
          coatingPrice: invoice.coatingPrice,
          frameBrand: invoice.frameBrand,
          frameModel: invoice.frameModel,
          frameColor: invoice.frameColor,
          frameSize: invoice.frameSize,
          framePrice: invoice.framePrice,
          discount: invoice.discount,
          deposit: invoice.deposit,
          total: invoice.total,
          paymentMethod: invoice.paymentMethod,
          authNumber: invoice.authNumber,
          workOrderId: workOrderId
        });
        
        // Update the invoice with the new IDs
        const updatedInvoice = { 
          ...invoice, 
          invoiceId, 
          workOrderId 
        };
        
        // If callback provided, call it with the new IDs
        if (onInvoiceSaved) {
          onInvoiceSaved(invoiceId, workOrderId);
        }
        
        toast({
          title: t("invoiceSaved"),
          description: t("invoiceNumber") + ": " + invoiceId,
        });
        
        // Show the print selector with the updated invoice that has an ID
        setOpenLocationDialog(false);
        showPrintSelector(updatedInvoice);
      } catch (error) {
        console.error("Error saving invoice:", error);
        toast({
          title: t("error"),
          description: t("errorSavingInvoice"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };
  
  const showPrintSelector = (invoiceToUse: Invoice) => {
    // Create the print selector with proper styling for printing
    const selectorContainer = document.createElement('div');
    selectorContainer.style.overflow = 'hidden'; // Prevent scrollbars
    document.body.appendChild(selectorContainer);
    
    const selector = (
      <WorkOrderPrintSelector
        invoice={invoiceToUse}
        patientName={patientName}
        patientPhone={patientPhone}
        rx={rx}
        lensType={lensType}
        coating={coating}
        frame={frame}
        contactLenses={contactLenses}
        contactLensRx={contactLensRx}
        thermalOnly={thermalOnly}
        storeLocation={storeLocation}
      />
    );
    
    return selector;
  };
  
  const isRtl = language === 'ar';

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={handlePrint}
        disabled={loading}
      >
        <Printer className="h-4 w-4 mr-1" /> 
        {loading ? t("saving") : t("printWorkOrder")}
      </Button>
      
      <Dialog open={openLocationDialog} onOpenChange={setOpenLocationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isRtl ? "اختر موقع المتجر" : "Select Store Location"}</DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center gap-2 py-4">
            <Store className="h-4 w-4 text-blue-600" />
            <Select 
              value={storeLocation}
              onValueChange={setStoreLocation}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={isRtl ? "اختر الفرع" : "Select Location"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alSomait">
                  {isRtl ? storeLocations.alSomait.locationAr : storeLocations.alSomait.locationEn}
                </SelectItem>
                <SelectItem value="alArbid">
                  {isRtl ? storeLocations.alArbid.locationAr : storeLocations.alArbid.locationEn}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenLocationDialog(false)}>
              {isRtl ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={saveInvoiceAndPrint} disabled={loading}>
              {loading ? (isRtl ? "جاري الحفظ..." : "Saving...") : (isRtl ? "حفظ وطباعة" : "Save & Print")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {!isNewInvoice && (
        <WorkOrderPrintSelector
          invoice={invoice}
          patientName={patientName}
          patientPhone={patientPhone}
          rx={rx}
          lensType={lensType}
          coating={coating}
          frame={frame}
          contactLenses={contactLenses}
          contactLensRx={contactLensRx}
          thermalOnly={thermalOnly}
          storeLocation={storeLocation}
          trigger={
            <Button variant={variant} size={size} className={className}>
              <Printer className="h-4 w-4 mr-1" /> {t("printWorkOrder")}
            </Button>
          }
        />
      )}
    </>
  );
};
