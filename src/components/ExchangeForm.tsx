
import React, { useState } from "react";
import { useInvoiceStore, Invoice, WorkOrder } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeftRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExchangeFormProps {
  invoice: Invoice;
  workOrder: WorkOrder | null;
  onComplete: () => void;
}

export const ExchangeForm: React.FC<ExchangeFormProps> = ({
  invoice,
  workOrder,
  onComplete
}) => {
  const { language, t } = useLanguageStore();
  const { processExchange } = useInvoiceStore();
  const navigate = useNavigate();
  
  const [exchangeReason, setExchangeReason] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleProcessExchange = () => {
    if (!exchangeReason.trim()) {
      toast.error(t('exchangeReasonRequired') || "Please provide a reason for the exchange");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Process the exchange without creating a new invoice yet
      processExchange(
        invoice.invoiceId,
        undefined, // No new invoice yet
        exchangeReason
      );
      
      toast.success(t('exchangeInitiated') || "Exchange initiated successfully");
      
      // Navigate to create invoice page with the patient info pre-filled
      navigate("/", { 
        state: { 
          section: "createInvoice",
          patientId: invoice.patientId,
          isExchange: true,
          originalInvoiceId: invoice.invoiceId
        } 
      });
    } catch (error) {
      console.error("Error processing exchange:", error);
      toast.error(t('errorProcessingExchange') || "Error processing exchange. Please try again.");
      setIsProcessing(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('processExchange') || "Process Exchange"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceDetails">{t('invoiceDetails') || "Invoice Details"}</Label>
            <div className="p-3 bg-secondary/30 rounded-md">
              <p className="text-sm font-medium">{t('invoiceNumber') || "Invoice #"}: {invoice.invoiceId}</p>
              <p className="text-sm">{t('customer') || "Customer"}: {invoice.patientName}</p>
              <p className="text-sm">{t('phone') || "Phone"}: {invoice.patientPhone}</p>
              <p className="text-sm">{t('totalAmount') || "Total Amount"}: {invoice.total.toFixed(3)} KWD</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="itemDetails">{t('itemDetails') || "Item Details"}</Label>
            <div className="p-3 bg-secondary/30 rounded-md">
              {invoice.invoiceType === "glasses" ? (
                <>
                  <p className="text-sm">{t('frameBrand') || "Frame"}: {invoice.frameBrand} {invoice.frameModel}</p>
                  <p className="text-sm">{t('lensType') || "Lens"}: {invoice.lensType}</p>
                  <p className="text-sm">{t('coating') || "Coating"}: {invoice.coating || t('none') || "None"}</p>
                </>
              ) : (
                <p className="text-sm">{t('contactLenses') || "Contact Lenses"}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="exchangeReason">{t('exchangeReason') || "Exchange Reason"}</Label>
          <Textarea
            id="exchangeReason"
            value={exchangeReason}
            onChange={(e) => setExchangeReason(e.target.value)}
            placeholder={t('enterExchangeReason') || "Enter the reason for exchange..."}
            rows={3}
          />
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800">
          <p className="text-sm">
            {t('exchangeWarning') || "After initiating the exchange, you will be redirected to create a new invoice for the replacement item."}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onComplete}>
          {t('cancel') || "Cancel"}
        </Button>
        <Button 
          variant="default" 
          onClick={handleProcessExchange} 
          disabled={isProcessing || !exchangeReason.trim()}
        >
          <ArrowLeftRight className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
          {t('initiateExchange') || "Initiate Exchange"}
        </Button>
      </CardFooter>
    </Card>
  );
};
