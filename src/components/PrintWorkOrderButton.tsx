
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, FileText, Check, Save } from "lucide-react";
import { WorkOrderPrintSelector } from "./WorkOrderPrintSelector";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, useInvoiceStore } from "@/store/invoiceStore";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workflowStep, setWorkflowStep] = useState<'initial' | 'saved' | 'invoice' | 'workorder' | 'complete'>('initial');
  const [notes, setNotes] = useState("");
  const [savedInvoice, setSavedInvoice] = useState<Invoice | null>(null);
  const [invoiceId, setInvoiceId] = useState<string>("");
  
  const handleStartProcess = () => {
    if (isNewInvoice && !invoice.invoiceId) {
      // For new invoices, open the dialog to add notes before saving
      setIsDialogOpen(true);
    } else {
      // For existing invoices, just show the workflow dialog
      setSavedInvoice(invoice);
      setInvoiceId(invoice.invoiceId || invoice.workOrderId || "");
      setWorkflowStep('saved');
      setIsDialogOpen(true);
    }
  };
  
  const handleSaveInvoice = () => {
    if (!isNewInvoice || invoice.invoiceId) return;
    
    setLoading(true);
    try {
      // Save the invoice with notes to get an ID
      const newInvoiceId = addInvoice({
        ...invoice,
        notes: notes,
      });
      
      // Update state with the new invoice ID
      setInvoiceId(newInvoiceId);
      setSavedInvoice({...invoice, invoiceId: newInvoiceId, notes});
      setWorkflowStep('saved');
      
      // Call onInvoiceSaved callback if provided
      if (onInvoiceSaved) {
        onInvoiceSaved(newInvoiceId);
      }
      
      toast.success(t("invoiceSaved") + " - " + t("invoiceNumber") + ": " + newInvoiceId);
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error(t("errorSavingInvoice"));
    } finally {
      setLoading(false);
    }
  };
  
  const showInvoicePrint = () => {
    if (!savedInvoice) return;
    
    return (
      <WorkOrderPrintSelector
        invoice={savedInvoice}
        patientName={patientName}
        patientPhone={patientPhone}
        rx={rx}
        lensType={lensType}
        coating={coating}
        frame={frame}
        contactLenses={contactLenses}
        contactLensRx={contactLensRx}
        thermalOnly={thermalOnly}
        notes={notes}
        isInvoice={true}
        onPrintComplete={() => setWorkflowStep('workorder')}
      />
    );
  };
  
  const showWorkOrderPrint = () => {
    if (!savedInvoice) return;
    
    return (
      <WorkOrderPrintSelector
        invoice={savedInvoice}
        patientName={patientName}
        patientPhone={patientPhone}
        rx={rx}
        lensType={lensType}
        coating={coating}
        frame={frame}
        contactLenses={contactLenses}
        contactLensRx={contactLensRx}
        thermalOnly={thermalOnly}
        notes={notes}
        isInvoice={false}
        onPrintComplete={() => setWorkflowStep('complete')}
      />
    );
  };
  
  const handleComplete = () => {
    setIsDialogOpen(false);
    setWorkflowStep('initial');
    
    // Optionally refresh the page or show a completion notification
    toast.success(t("processCompleted"));
    
    // If you want to refresh the page, uncomment the next line
    // window.location.reload();
  };

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={handleStartProcess}
        disabled={loading}
      >
        <Printer className="h-4 w-4 mr-1" /> 
        {loading ? t("saving") : t("printWorkOrder")}
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open && workflowStep === 'complete') {
          handleComplete();
        }
        setIsDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {workflowStep === 'initial' && t("workOrderNotes")}
              {workflowStep === 'saved' && t("workOrderSaved")}
              {workflowStep === 'invoice' && t("printInvoice")}
              {workflowStep === 'workorder' && t("printWorkOrder")}
              {workflowStep === 'complete' && t("processCompleted")}
            </DialogTitle>
            <DialogDescription>
              {workflowStep === 'initial' && t("addOptionalNotes")}
              {workflowStep === 'saved' && t("workOrderSavedDescription").replace('{id}', invoiceId)}
              {workflowStep === 'invoice' && t("printInvoiceDescription")}
              {workflowStep === 'workorder' && t("printWorkOrderDescription")}
              {workflowStep === 'complete' && t("processCompletedDescription")}
            </DialogDescription>
          </DialogHeader>
          
          {workflowStep === 'initial' && (
            <div className="py-4">
              <Textarea
                placeholder={t("enterNotesHere")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          )}
          
          {workflowStep === 'saved' && (
            <div className="flex flex-col items-center py-4 space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-center">
                <p className="font-medium">{t("workOrderId")}: {invoiceId}</p>
                {notes && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm">
                    <p className="font-medium">{t("notes")}:</p>
                    <p className="whitespace-pre-wrap">{notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {workflowStep === 'invoice' && showInvoicePrint()}
          
          {workflowStep === 'workorder' && showWorkOrderPrint()}
          
          {workflowStep === 'complete' && (
            <div className="flex flex-col items-center py-4 space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-center">{t("allDocumentsPrinted")}</p>
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            {workflowStep === 'initial' && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {t("cancel")}
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveInvoice}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? t("saving") : t("saveAndContinue")}
                </Button>
              </>
            )}
            
            {workflowStep === 'saved' && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {t("cancel")}
                </Button>
                <Button
                  type="button"
                  onClick={() => setWorkflowStep('invoice')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {t("printInvoice")}
                </Button>
              </>
            )}
            
            {workflowStep === 'complete' && (
              <Button
                type="button"
                onClick={handleComplete}
              >
                {t("done")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
