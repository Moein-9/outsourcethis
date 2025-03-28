
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
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeftRight, AlertCircle } from "lucide-react";
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
    <Card className="shadow-md border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <CardTitle className="text-blue-800 flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5 text-blue-600" />
          {t('processExchange') || "Process Exchange"}
        </CardTitle>
        <CardDescription>
          {t('processExchangeDescription') || "Create an exchange for this order and generate a new invoice"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="invoiceDetails" className="text-sm font-medium text-gray-700">
              {t('invoiceDetails') || "Invoice Details"}
            </Label>
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium text-gray-500">{t('invoiceNumber') || "Invoice #"}:</div>
                <div className="text-sm font-medium text-gray-900">{invoice.invoiceId}</div>
                
                <div className="text-sm font-medium text-gray-500">{t('customer') || "Customer"}:</div>
                <div className="text-sm font-medium text-gray-900">{invoice.patientName}</div>
                
                <div className="text-sm font-medium text-gray-500">{t('phone') || "Phone"}:</div>
                <div className="text-sm font-medium text-gray-900">{invoice.patientPhone}</div>
                
                <div className="text-sm font-medium text-gray-500">{t('totalAmount') || "Total Amount"}:</div>
                <div className="text-sm font-medium text-gray-900 font-mono">{invoice.total.toFixed(3)} KWD</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="itemDetails" className="text-sm font-medium text-gray-700">
              {t('itemDetails') || "Item Details"}
            </Label>
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              {invoice.invoiceType === "glasses" ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium text-gray-500">{t('frameBrand') || "Frame"}:</div>
                  <div className="text-sm font-medium text-gray-900">{invoice.frameBrand} {invoice.frameModel}</div>
                  
                  <div className="text-sm font-medium text-gray-500">{t('lensType') || "Lens"}:</div>
                  <div className="text-sm font-medium text-gray-900">{invoice.lensType}</div>
                  
                  <div className="text-sm font-medium text-gray-500">{t('coating') || "Coating"}:</div>
                  <div className="text-sm font-medium text-gray-900">{invoice.coating || t('none') || "None"}</div>
                </div>
              ) : (
                <div className="text-sm font-medium text-gray-900">{t('contactLenses') || "Contact Lenses"}</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="exchangeReason" className="text-sm font-medium text-gray-700">
            {t('exchangeReason') || "Exchange Reason"} <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="exchangeReason"
            value={exchangeReason}
            onChange={(e) => setExchangeReason(e.target.value)}
            placeholder={t('enterExchangeReason') || "Enter the reason for exchange..."}
            rows={3}
            className="resize-none"
          />
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            {t('exchangeWarning') || "After initiating the exchange, you will be redirected to create a new invoice for the replacement item."}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-gray-200 px-6 py-4 bg-gray-50">
        <Button variant="outline" onClick={onComplete}>
          {t('cancel') || "Cancel"}
        </Button>
        <Button 
          variant="default" 
          onClick={handleProcessExchange} 
          disabled={isProcessing || !exchangeReason.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeftRight className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
          {t('initiateExchange') || "Initiate Exchange"}
        </Button>
      </CardFooter>
    </Card>
  );
};
