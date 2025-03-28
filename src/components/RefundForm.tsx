
import React, { useState } from "react";
import { useInvoiceStore, Invoice, WorkOrder } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { RefundReceiptTemplate } from "./RefundReceiptTemplate";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Printer, Receipt, AlertCircle } from "lucide-react";

interface RefundFormProps {
  invoice: Invoice;
  workOrder: WorkOrder | null;
  onComplete: () => void;
}

export const RefundForm: React.FC<RefundFormProps> = ({
  invoice,
  workOrder,
  onComplete
}) => {
  const { language, t } = useLanguageStore();
  const { processRefund } = useInvoiceStore();
  
  const [refundAmount, setRefundAmount] = useState<number>(invoice.total);
  const [refundReason, setRefundReason] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [authNumber, setAuthNumber] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [refundId, setRefundId] = useState<string | null>(null);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    if (isNaN(amount)) {
      setRefundAmount(0);
    } else {
      setRefundAmount(Math.min(amount, invoice.total));
    }
  };
  
  const handleProcessRefund = () => {
    if (refundAmount <= 0) {
      toast.error(t('invalidRefundAmount') || "Please enter a valid refund amount");
      return;
    }
    
    if (!refundReason.trim()) {
      toast.error(t('refundReasonRequired') || "Please provide a reason for the refund");
      return;
    }
    
    if (paymentMethod === "Card" && !authNumber.trim()) {
      toast.error(t('authNumberRequired') || "Authorization number is required for card refunds");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const newRefundId = processRefund(
        invoice.invoiceId,
        refundAmount,
        refundReason,
        paymentMethod,
        authNumber || undefined
      );
      
      setRefundId(newRefundId);
      setIsReceiptOpen(true);
      toast.success(t('refundProcessedSuccessfully') || "Refund processed successfully");
    } catch (error) {
      console.error("Error processing refund:", error);
      toast.error(t('errorProcessingRefund') || "Error processing refund. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePrintReceipt = () => {
    window.print();
  };
  
  const handleCloseReceipt = () => {
    setIsReceiptOpen(false);
    onComplete();
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('processRefund') || "Process Refund"}</CardTitle>
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
            <Label htmlFor="refundAmount">{t('refundAmount') || "Refund Amount"} (KWD)</Label>
            <Input
              id="refundAmount"
              type="number"
              value={refundAmount}
              onChange={handleAmountChange}
              min={0}
              max={invoice.total}
              step={0.001}
            />
            {refundAmount !== invoice.total && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {t('partialRefundWarning') || "This is a partial refund. The full amount is"} {invoice.total.toFixed(3)} KWD
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="refundReason">{t('refundReason') || "Refund Reason"}</Label>
            <Textarea
              id="refundReason"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder={t('enterRefundReason') || "Enter the reason for refund..."}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">{t('refundMethod') || "Refund Method"}</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder={t('selectPaymentMethod') || "Select payment method"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">{t('cash') || "Cash"}</SelectItem>
                <SelectItem value="Card">{t('card') || "Card"}</SelectItem>
                <SelectItem value="Bank Transfer">{t('bankTransfer') || "Bank Transfer"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {paymentMethod === "Card" && (
            <div className="space-y-2">
              <Label htmlFor="authNumber">{t('authorizationNumber') || "Authorization Number"}</Label>
              <Input
                id="authNumber"
                value={authNumber}
                onChange={(e) => setAuthNumber(e.target.value)}
                placeholder={t('enterAuthorizationNumber') || "Enter authorization number..."}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onComplete}>
            {t('cancel') || "Cancel"}
          </Button>
          <Button 
            variant="default" 
            onClick={handleProcessRefund} 
            disabled={isProcessing || refundAmount <= 0 || !refundReason.trim()}
          >
            <Receipt className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
            {t('processRefund') || "Process Refund"}
          </Button>
        </CardFooter>
      </Card>
      
      {refundId && (
        <Sheet open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto print:w-full print:max-w-none">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-4" />
                {t('refundReceipt') || "Refund Receipt"}
              </SheetTitle>
              <SheetDescription>
                <Button onClick={handlePrintReceipt} className="mt-2">
                  <Printer className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                  {t('print') || "Print"}
                </Button>
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 print:mt-0">
              <RefundReceiptTemplate
                invoice={invoice}
                refundId={refundId}
                refundAmount={refundAmount}
                refundReason={refundReason}
                refundMethod={paymentMethod}
                isPrintable={true}
              />
            </div>
            <SheetFooter className="print:hidden mt-4">
              <Button onClick={handleCloseReceipt}>{t('close') || "Close"}</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};
