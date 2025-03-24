import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInvoiceForm } from "./InvoiceFormContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  BadgePercent, Banknote, CreditCard, Check,
  CreditCard as CardIcon, Receipt, Printer
} from "lucide-react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { toast } from "@/hooks/use-toast";
import { PrintWorkOrderButton } from "../PrintWorkOrderButton";
import { PrintReceiptButton } from "../PrintReceiptButton";

export const InvoiceStepPayment: React.FC = () => {
  const { t, language } = useLanguageStore();
  const { getValues, setValue, calculateTotal, calculateRemaining } = useInvoiceForm();
  const { addInvoice, addWorkOrder } = useInvoiceStore();
  
  const [discount, setDiscount] = useState(getValues<number>('discount') || 0);
  const [deposit, setDeposit] = useState(getValues<number>('deposit') || 0);
  const [paymentMethod, setPaymentMethod] = useState(getValues<string>('paymentMethod') || "");
  const [authNumber, setAuthNumber] = useState(getValues<string>('authNumber') || "");
  const [invoiceCreated, setInvoiceCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  
  const [total, setTotal] = useState(calculateTotal());
  const [remaining, setRemaining] = useState(calculateRemaining());
  
  useEffect(() => {
    const newTotal = calculateTotal();
    const newRemaining = Math.max(0, newTotal - deposit);
    
    setTotal(newTotal);
    setRemaining(newRemaining);
    
    setValue('total', newTotal);
    setValue('remaining', newRemaining);
    setValue('isPaid', newRemaining <= 0);
  }, [discount, deposit, calculateTotal]);
  
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setDiscount(value);
    setValue('discount', value);
  };
  
  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setDeposit(value);
    setValue('deposit', value);
  };
  
  const handlePayInFull = () => {
    setDeposit(total);
    setValue('deposit', total);
  };
  
  const selectPaymentMethod = (method: string) => {
    setPaymentMethod(method);
    setValue('paymentMethod', method);
  };
  
  const handleAuthNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthNumber(e.target.value);
    setValue('authNumber', e.target.value);
  };

  const saveOrder = () => {
    if (!paymentMethod) {
      toast({
        title: t('error'),
        description: t('paymentMethodError'),
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const patientId = getValues<string>('patientId') || 'anonymous';
      
      const workOrder = {
        patientId,
        lensType: {
          name: getValues<string>('lensType'),
          price: getValues<number>('lensPrice')
        }
      };
      
      const workOrderId = addWorkOrder?.(workOrder) || `WO${Date.now()}`;
      setValue('workOrderId', workOrderId);
      
      const invoiceData = {
        patientId: getValues<string>('patientId'),
        patientName: getValues<string>('patientName'),
        patientPhone: getValues<string>('patientPhone'),
        lensType: getValues<string>('lensType'),
        lensPrice: getValues<number>('lensPrice'),
        coating: getValues<string>('coating'),
        coatingPrice: getValues<number>('coatingPrice'),
        frameBrand: getValues<string>('frameBrand'),
        frameModel: getValues<string>('frameModel'),
        frameColor: getValues<string>('frameColor'),
        frameSize: getValues<string>('frameSize'),
        framePrice: getValues<number>('framePrice'),
        discount: getValues<number>('discount'),
        deposit: getValues<number>('deposit'),
        total: getValues<number>('total'),
        paymentMethod: getValues<string>('paymentMethod'),
        authNumber: getValues<string>('authNumber'),
        workOrderId
      };
      
      const invoiceId = addInvoice(invoiceData);
      setValue('invoiceId', invoiceId);
      
      setInvoiceCreated(true);
      
      toast({
        title: t('success'),
        description: `${t('orderCreated')}\n${t('workOrder')}: ${workOrderId}\n${t('invoice')}: ${invoiceId}`,
      });
      
      const summaryTab = document.querySelector('[value="summary"]');
      if (summaryTab instanceof HTMLElement) {
        summaryTab.click();
      } else {
        console.log("Summary tab not found, manual navigation required");
      }
    } catch (error) {
      console.error("Error saving order:", error);
      toast({
        title: t('error'),
        description: t('errorSavingOrder'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Payment information section */}
      <div className="border rounded-lg p-5 bg-card shadow-sm">
        <h3 className="text-lg font-semibold text-primary flex items-center gap-2 border-b border-primary/30 pb-3 mb-4">
          <BadgePercent className="w-5 h-5" />
          {language === 'ar' ? 'تفاصيل الدفع' : t('paymentDetails')}
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount">{t('discount')}:</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                min="0"
                value={discount}
                onChange={handleDiscountChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit">{t('deposit')}:</Label>
              <div className="flex space-x-2">
                <Input
                  id="deposit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={deposit}
                  onChange={handleDepositChange}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={handlePayInFull}
                  className="whitespace-nowrap"
                >
                  {t('payInFull')}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 pt-2">
            <div className="flex justify-between text-lg border-b pb-2 mb-1">
              <span className="font-medium">{t('total')}:</span>
              <span>{total.toFixed(3)} {t('kwd')}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-medium">{t('remaining')}:</span>
              <span>{remaining.toFixed(3)} {t('kwd')}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment method section */}
      <div className="border rounded-lg p-5 bg-card shadow-sm">
        <h3 className="text-lg font-semibold text-primary flex items-center gap-2 border-b border-primary/30 pb-3 mb-4">
          <CreditCard className="w-5 h-5" />
          {language === 'ar' ? 'طريقة الدفع' : t('paymentMethod')}
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Button
              type="button"
              variant={paymentMethod === "cash" ? "default" : "outline"}
              className="w-full h-20 flex flex-col gap-2"
              onClick={() => selectPaymentMethod("cash")}
            >
              <Banknote className="h-6 w-6" />
              <span>{t('cash')}</span>
            </Button>
            <Button
              type="button"
              variant={paymentMethod === "card" ? "default" : "outline"}
              className="w-full h-20 flex flex-col gap-2"
              onClick={() => selectPaymentMethod("card")}
            >
              <CardIcon className="h-6 w-6" />
              <span>{t('card')}</span>
            </Button>
            <Button
              type="button"
              variant={paymentMethod === "knet" ? "default" : "outline"}
              className="w-full h-20 flex flex-col gap-2"
              onClick={() => selectPaymentMethod("knet")}
            >
              <Check className="h-6 w-6" />
              <span>K-Net</span>
            </Button>
          </div>
          
          {(paymentMethod === "card" || paymentMethod === "knet") && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="authNumber">{t('authNumber')}:</Label>
              <Input
                id="authNumber"
                value={authNumber}
                onChange={handleAuthNumberChange}
                placeholder={t('authNumberPlaceholder')}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Finalize order section */}
      <div className="border rounded-lg p-5 bg-card shadow-sm">
        <h3 className="text-lg font-semibold text-primary flex items-center gap-2 border-b border-primary/30 pb-3 mb-4">
          <Receipt className="w-5 h-5" />
          {language === 'ar' ? 'إنهاء الطلب' : t('finalizeOrder')}
        </h3>
        
        <div className="space-y-4">
          <Button 
            onClick={saveOrder} 
            className="w-full py-6 text-lg" 
            disabled={loading || invoiceCreated}
          >
            {loading ? (
              <span>{language === 'ar' ? 'جاري الحفظ...' : t('saving')}</span>
            ) : (
              <span>{language === 'ar' ? 'حفظ الطلب' : t('saveOrder')}</span>
            )}
          </Button>
          
          {invoiceCreated && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 pt-2"
            >
              <div className="flex space-x-2 justify-between">
                <PrintWorkOrderButton
                  invoice={getValues()}
                  patientName={getValues<string>('patientName')}
                  patientPhone={getValues<string>('patientPhone')}
                  rx={getValues<any>('rx')}
                  lensType={getValues<string>('lensType')}
                  coating={getValues<string>('coating')}
                  frame={
                    getValues<string>('frameBrand') 
                      ? {
                          brand: getValues<string>('frameBrand'),
                          model: getValues<string>('frameModel'),
                          color: getValues<string>('frameColor'),
                          size: getValues<string>('frameSize'),
                          price: getValues<number>('framePrice')
                        } 
                      : undefined
                  }
                  contactLenses={getValues<any>('contactLensItems')}
                  contactLensRx={getValues<any>('contactLensRx')}
                  className="w-full"
                >
                  <Button variant="outline" size="lg" className="w-full gap-2">
                    <Printer className="h-5 w-5" />
                    {language === 'ar' ? 'طباعة أمر العمل' : t('printWorkOrder')}
                  </Button>
                </PrintWorkOrderButton>
                
                <PrintReceiptButton
                  invoice={getValues()}
                  patientName={getValues<string>('patientName')}
                  patientPhone={getValues<string>('patientPhone')}
                  className="w-full"
                >
                  <Button variant="outline" size="lg" className="w-full gap-2">
                    <Printer className="h-5 w-5" />
                    {language === 'ar' ? 'طباعة الإيصال' : t('printReceipt')}
                  </Button>
                </PrintReceiptButton>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
