
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Save, FileCheck, ClipboardCheck } from "lucide-react";
import { WorkOrderPrintSelector } from "./WorkOrderPrintSelector";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, useInvoiceStore } from "@/store/invoiceStore";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const { addInvoice, addExistingInvoice } = useInvoiceStore();
  const [savedInvoice, setSavedInvoice] = useState<Invoice | null>(null);
  const [workOrderNote, setWorkOrderNote] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [printType, setPrintType] = useState<"invoice" | "workOrder" | null>(null);
  
  // Create refs for the print components
  const workOrderPrintRef = useRef<HTMLDivElement>(null);
  
  // Handle saving the invoice
  const handleSave = async () => {
    if (isNewInvoice && !invoice.invoiceId) {
      setLoading(true);
      try {
        console.log("Saving new invoice with note:", workOrderNote);
        
        // Create a new invoice with the note
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
          workOrderId: invoice.workOrderId,
          note: workOrderNote, // Add note to the invoice
        });
        
        console.log("Invoice saved with ID:", invoiceId);
        
        // Update the invoice with the new ID and note
        const updatedInvoice = { 
          ...invoice, 
          invoiceId, 
          note: workOrderNote,
          createdAt: new Date().toISOString() // Ensure createdAt is set
        };
        
        // Store for success dialog
        setSavedInvoice(updatedInvoice);
        
        // If callback provided, call it with the new ID
        if (onInvoiceSaved) {
          onInvoiceSaved(invoiceId);
        }
        
        // Close the save dialog and show success
        setShowSaveDialog(false);
        setShowSuccessDialog(true);
        
        toast({
          title: t("success"),
          description: t("invoiceSavedSuccessfully"),
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
    } else if (invoice.invoiceId) {
      // If already has an ID, just show the updated invoice with note
      console.log("Using existing invoice with ID:", invoice.invoiceId);
      const updatedInvoice = { 
        ...invoice, 
        note: workOrderNote 
      };
      setSavedInvoice(updatedInvoice);
      
      // Close the save dialog and show success
      setShowSaveDialog(false);
      setShowSuccessDialog(true);
      
      toast({
        title: t("success"),
        description: t("workOrderUpdated"),
      });
    }
  };
  
  // Handle printing the work order
  const handlePrintWorkOrder = () => {
    console.log("Printing work order");
    if (!savedInvoice) {
      console.error("No saved invoice to print");
      return;
    }
    
    setPrintType("workOrder");
    
    // Use setTimeout to ensure the component renders before printing
    setTimeout(() => {
      if (workOrderPrintRef.current) {
        console.log("Work order print component ready, printing...");
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write('<html><head><title>Print</title>');
          printWindow.document.write('<style>body { font-family: Arial, sans-serif; }</style>');
          printWindow.document.write('</head><body>');
          printWindow.document.write(workOrderPrintRef.current.innerHTML);
          printWindow.document.write('</body></html>');
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        } else {
          toast({
            title: t("error"),
            description: t("popupBlocked"),
            variant: "destructive",
          });
        }
      } else {
        console.error("Print ref not available");
        toast({
          title: t("error"),
          description: t("printComponentNotReady"),
          variant: "destructive",
        });
      }
    }, 500);
  };
  
  // Handle printing the invoice
  const handlePrintInvoice = () => {
    console.log("Printing invoice (placeholder)");
    toast({
      title: t("info"),
      description: t("printingInvoice"),
    });
    
    // TODO: Implement invoice printing
    setPrintType("invoice");
  };
  
  // Close success dialog and reset print type
  const handleDone = () => {
    setShowSuccessDialog(false);
    setPrintType(null);
  };

  return (
    <>
      {/* Save and Print Button */}
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={() => setShowSaveDialog(true)}
        disabled={loading}
      >
        <Save className="h-4 w-4 mr-1" /> 
        {loading ? t("saving") : t("saveAndPrint")}
      </Button>
      
      {/* Save Dialog with Notes Field */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("saveWorkOrder")}</DialogTitle>
            <DialogDescription>
              {t("addNotesToWorkOrder")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workOrderNote">{t("specialInstructions")}</Label>
              <Textarea
                id="workOrderNote"
                placeholder={t("enterSpecialInstructions")}
                value={workOrderNote}
                onChange={(e) => setWorkOrderNote(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSaveDialog(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? t("saving") : t("saveWorkOrder")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Success Dialog with Print Options */}
      <Dialog open={showSuccessDialog} onOpenChange={handleDone}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-green-500" />
              {t("workOrderSaved")}
            </DialogTitle>
            <DialogDescription>
              {savedInvoice && (
                <div className="mt-2 space-y-2">
                  <div className="bg-muted p-3 rounded-md">
                    <p className="font-medium">{t("invoiceNumber")}: <span className="text-primary">{savedInvoice.invoiceId}</span></p>
                    {savedInvoice.workOrderId && (
                      <p className="font-medium">{t("workOrderNumber")}: <span className="text-primary">{savedInvoice.workOrderId}</span></p>
                    )}
                  </div>
                  {workOrderNote && (
                    <div className="bg-muted/50 p-3 rounded-md border">
                      <p className="font-medium text-sm">{t("note")}:</p>
                      <p className="text-sm mt-1">{workOrderNote}</p>
                    </div>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-4 gap-2" 
              onClick={handlePrintInvoice}
            >
              <Printer className="h-5 w-5" />
              <span className="font-medium">{t("printInvoice")}</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-4 gap-2"
              onClick={handlePrintWorkOrder}
            >
              <ClipboardCheck className="h-5 w-5" />
              <span className="font-medium">{t("printWorkOrder")}</span>
            </Button>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              onClick={handleDone}
            >
              {t("done")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Hidden print components */}
      <div style={{ display: "none" }}>
        <div ref={workOrderPrintRef}>
          {printType === "workOrder" && savedInvoice && (
            <WorkOrderPrintSelector
              invoice={savedInvoice}
              patientName={patientName || savedInvoice.patientName}
              patientPhone={patientPhone || savedInvoice.patientPhone}
              rx={rx}
              lensType={lensType || savedInvoice.lensType}
              coating={coating || savedInvoice.coating}
              frame={frame}
              contactLenses={contactLenses}
              contactLensRx={contactLensRx}
              thermalOnly={true}
              note={savedInvoice.note || workOrderNote}
            />
          )}
        </div>
      </div>
    </>
  );
};
