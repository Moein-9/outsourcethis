
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Save, FileText, CheckCircle2 } from "lucide-react";
import { WorkOrderPrintSelector } from "./WorkOrderPrintSelector";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, useInvoiceStore } from "@/store/invoiceStore";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  onInvoiceSaved?: (invoiceId: string) => void;
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
  const { t } = useLanguageStore();
  const [loading, setLoading] = useState(false);
  const [savedInvoice, setSavedInvoice] = useState<Invoice | null>(null);
  const [invoiceId, setInvoiceId] = useState<string>("");
  const [notes, setNotes] = useState<string>(invoice.notes || "");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { addInvoice, addExistingInvoice } = useInvoiceStore();
  
  // When the dialog opens, initialize notes from the invoice
  const handleOpenDialog = () => {
    setNotes(invoice.notes || "");
    setDialogOpen(true);
  };
  
  const handleSaveInvoice = () => {
    // If it's a new invoice, save it first to generate an invoice ID
    if (isNewInvoice && !invoice.invoiceId) {
      setLoading(true);
      try {
        // Include notes in the invoice data
        const invoiceWithNotes = {
          ...invoice,
          notes: notes
        };
        
        // Save the invoice to get an ID
        const newInvoiceId = addInvoice({
          patientId: invoiceWithNotes.patientId,
          patientName: invoiceWithNotes.patientName,
          patientPhone: invoiceWithNotes.patientPhone,
          lensType: invoiceWithNotes.lensType,
          lensPrice: invoiceWithNotes.lensPrice,
          coating: invoiceWithNotes.coating,
          coatingPrice: invoiceWithNotes.coatingPrice,
          frameBrand: invoiceWithNotes.frameBrand,
          frameModel: invoiceWithNotes.frameModel,
          frameColor: invoiceWithNotes.frameColor,
          frameSize: invoiceWithNotes.frameSize,
          framePrice: invoiceWithNotes.framePrice,
          discount: invoiceWithNotes.discount,
          deposit: invoiceWithNotes.deposit,
          total: invoiceWithNotes.total,
          paymentMethod: invoiceWithNotes.paymentMethod,
          authNumber: invoiceWithNotes.authNumber,
          workOrderId: invoiceWithNotes.workOrderId,
          notes: notes
        });
        
        // Update the invoice with the new ID
        const updatedInvoice = { ...invoiceWithNotes, invoiceId: newInvoiceId };
        setSavedInvoice(updatedInvoice);
        setInvoiceId(newInvoiceId);
        
        // If callback provided, call it with the new ID
        if (onInvoiceSaved) {
          onInvoiceSaved(newInvoiceId);
        }
        
        toast({
          title: t("invoiceSaved"),
          description: t("invoiceNumber") + ": " + newInvoiceId,
        });
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
    } else {
      // If already has an ID, use the existing invoice
      setSavedInvoice(invoice);
      setInvoiceId(invoice.invoiceId);
    }
  };
  
  const handlePrintInvoice = () => {
    if (!savedInvoice && !invoice.invoiceId) {
      toast({
        title: t("error"),
        description: t("pleaseCreateInvoiceFirst"),
        variant: "destructive",
      });
      return;
    }
    
    const invoiceToPrint = savedInvoice || invoice;
    // Create the print selector
    const invoiceSelector = (
      <WorkOrderPrintSelector
        invoice={invoiceToPrint}
        patientName={patientName}
        patientPhone={patientPhone}
        rx={rx}
        lensType={lensType}
        coating={coating}
        frame={frame}
        contactLenses={contactLenses}
        contactLensRx={contactLensRx}
        thermalOnly={true}
      />
    );
    
    return invoiceSelector;
  };
  
  const handlePrintWorkOrder = () => {
    if (!savedInvoice && !invoice.invoiceId) {
      toast({
        title: t("error"),
        description: t("pleaseCreateInvoiceFirst"),
        variant: "destructive",
      });
      return;
    }
    
    const invoiceToPrint = savedInvoice || invoice;
    // Create the print selector
    const selector = (
      <WorkOrderPrintSelector
        invoice={invoiceToPrint}
        patientName={patientName}
        patientPhone={patientPhone}
        rx={rx}
        lensType={lensType}
        coating={coating}
        frame={frame}
        contactLenses={contactLenses}
        contactLensRx={contactLensRx}
        thermalOnly={thermalOnly}
      />
    );
    
    return selector;
  };

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={handleOpenDialog}
        disabled={loading}
      >
        <Save className="h-4 w-4 mr-1" /> 
        {loading ? t("saving") : (isNewInvoice ? t("saveAndPrint") : t("printWorkOrder"))}
      </Button>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isNewInvoice ? t("createWorkOrder") : t("printWorkOrder")}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {/* Notes Section */}
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                {t("notes")}:
              </label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("additionalNotes")}
                className="min-h-[80px]"
              />
            </div>
            
            {/* Display Invoice ID after saving */}
            {invoiceId && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-green-800">{t("invoiceCreated")}</p>
                  <p className="text-sm text-green-700">{t("invoiceNumber")}: <span className="font-bold">{invoiceId}</span></p>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-3">
              {isNewInvoice && !invoiceId && (
                <Button 
                  onClick={handleSaveInvoice} 
                  disabled={loading}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? t("saving") : t("saveWorkOrder")}
                </Button>
              )}
              
              {(invoiceId || !isNewInvoice) && (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handlePrintInvoice}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {t("printInvoice")}
                  </Button>
                  
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={handlePrintWorkOrder}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    {t("printWorkOrder")}
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <DialogFooter className="flex justify-end">
            <Button 
              variant="ghost" 
              onClick={() => {
                setDialogOpen(false);
                // If we've saved a new invoice, we might want to refresh the page 
                // or do some other action to indicate completion
                if (invoiceId && isNewInvoice) {
                  toast({
                    title: t("success"),
                    description: t("workOrderCompleted"),
                  });
                }
              }}
            >
              {invoiceId ? t("done") : t("cancel")}
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
