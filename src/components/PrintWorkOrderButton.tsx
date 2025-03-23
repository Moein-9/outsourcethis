
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Save, FileText } from "lucide-react";
import { WorkOrderPrintSelector } from "./WorkOrderPrintSelector";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, useInvoiceStore } from "@/store/invoiceStore";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const [notes, setNotes] = useState("");
  const [savedInvoice, setSavedInvoice] = useState<Invoice | null>(null);
  const { addInvoice } = useInvoiceStore();
  const workOrderSelectorRef = useRef<any>(null);
  const invoiceSelectorRef = useRef<any>(null);
  
  console.log("PrintWorkOrderButton rendered", { isNewInvoice, invoice });
  
  const handleSaveInvoice = async () => {
    if (!isNewInvoice || invoice.invoiceId) {
      // If it's not a new invoice or already has an ID, just return the current invoice
      console.log("Invoice already exists, using current", invoice);
      setSavedInvoice(invoice);
      toast({
        title: t("invoiceSaved"),
        description: t("invoiceNumber") + ": " + invoice.invoiceId,
      });
      return invoice;
    }
    
    console.log("Saving new invoice");
    setLoading(true);
    
    try {
      // Save the invoice to get an ID
      const invoiceWithNotes = {
        ...invoice,
        notes: notes // Add notes to the invoice object
      };
      
      console.log("Saving invoice with data:", invoiceWithNotes);
      
      const invoiceId = addInvoice({
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
        notes: notes // Include notes in addInvoice call
      });
      
      console.log("Invoice saved with ID:", invoiceId);
      
      // Update the invoice with the new ID
      const updatedInvoice = { 
        ...invoiceWithNotes, 
        invoiceId,
        notes
      };
      
      // Store the saved invoice for later use
      setSavedInvoice(updatedInvoice);
      
      // If callback provided, call it with the new ID
      if (onInvoiceSaved) {
        onInvoiceSaved(invoiceId);
      }
      
      toast({
        title: t("invoiceSaved"),
        description: t("invoiceNumber") + ": " + invoiceId,
      });
      
      return updatedInvoice;
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast({
        title: t("error"),
        description: t("errorSavingInvoice"),
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const handlePrintWorkOrder = async () => {
    const invoiceToUse = savedInvoice || await handleSaveInvoice();
    if (!invoiceToUse) return;
    
    console.log("Printing work order with invoice:", invoiceToUse);
    
    // Use the ref to trigger the print dialog
    if (workOrderSelectorRef.current) {
      workOrderSelectorRef.current.print("receipt", invoiceToUse);
    } else {
      console.error("Work order selector ref not found");
      toast({
        title: t("error"),
        description: t("errorPrintingWorkOrder"),
        variant: "destructive",
      });
    }
  };
  
  const handlePrintInvoice = async () => {
    const invoiceToUse = savedInvoice || await handleSaveInvoice();
    if (!invoiceToUse) return;
    
    console.log("Printing invoice with invoice:", invoiceToUse);
    
    // Use the ref to trigger the print dialog
    if (invoiceSelectorRef.current) {
      invoiceSelectorRef.current.print("a4", invoiceToUse);
    } else {
      console.error("Invoice selector ref not found");
      toast({
        title: t("error"),
        description: t("errorPrintingInvoice"),
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>{t("workOrderInvoice")}</CardTitle>
        <CardDescription>{t("saveAndPrintDescription")}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">
            {t("specialInstructions")}:
          </label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("enterSpecialInstructions")}
            className="resize-none min-h-[100px]"
          />
        </div>
        
        {savedInvoice && (
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm font-semibold">{t("invoiceNumber")}: {savedInvoice.invoiceId}</p>
            {savedInvoice.workOrderId && (
              <p className="text-sm font-semibold">{t("workOrderNumber")}: {savedInvoice.workOrderId}</p>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-3 pb-4">
        <Button 
          variant="default"
          size="default"
          className="w-full gap-2"
          onClick={handleSaveInvoice}
          disabled={loading || (savedInvoice !== null)}
        >
          <Save className="h-4 w-4" /> 
          {loading ? t("saving") : savedInvoice ? t("invoiceSaved") : t("saveInvoice")}
        </Button>
        
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="default"
            className="flex-1 gap-2"
            onClick={handlePrintWorkOrder}
            disabled={loading}
          >
            <FileText className="h-4 w-4" /> 
            {t("printWorkOrder")}
          </Button>
          
          <Button 
            variant="outline" 
            size="default"
            className="flex-1 gap-2"
            onClick={handlePrintInvoice}
            disabled={loading}
          >
            <Printer className="h-4 w-4" /> 
            {t("printInvoice")}
          </Button>
        </div>
      </CardFooter>
      
      {/* Hidden reference components for printing */}
      <div className="hidden">
        <WorkOrderPrintSelector
          ref={workOrderSelectorRef}
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
          notes={notes}
        />
        
        <WorkOrderPrintSelector
          ref={invoiceSelectorRef}
          invoice={invoice}
          patientName={patientName}
          patientPhone={patientPhone}
          rx={rx}
          lensType={lensType}
          coating={coating}
          frame={frame}
          contactLenses={contactLenses}
          contactLensRx={contactLensRx}
          thermalOnly={false}
          notes={notes}
        />
      </div>
    </Card>
  );
};
