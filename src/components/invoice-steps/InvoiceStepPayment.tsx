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
import { ReceiptInvoice } from "../ReceiptInvoice";
import { PrintService } from "@/utils/PrintService";

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

  const handlePrintReceipt = () => {
    setPrintLoading(true);
    try {
      const container = document.createElement('div');
      container.style.display = 'none';
      document.body.appendChild(container);
      
      const receiptDiv = document.createElement('div');
      receiptDiv.id = 'receipt-to-print';
      container.appendChild(receiptDiv);
      
      const ReactDOM = require('react-dom');
      ReactDOM.render(
        React.createElement(ReceiptInvoice, { 
          invoice: getValues(),
          patientName: getValues<string>('patientName'),
          patientPhone: getValues<string>('patientPhone'),
          isPrintable: true
        }),
        receiptDiv,
        () => {
          const receiptHtml = receiptDiv.innerHTML;
          
          setTimeout(() => {
            if (document.body.contains(container)) {
              document.body.removeChild(container);
            }
            setPrintLoading(false);
          }, 500);
          
          PrintService.printHtml(
            PrintService.prepareReceiptDocument(receiptHtml, language === 'ar' ? 'إيصال' : 'Receipt'),
            'receipt',
            () => {
              setPrintLoading(false);
            }
          );
        }
      );
    } catch (error) {
      console.error("Error printing receipt:", error);
      toast({
        title: t("error"),
        description: language === 'ar' ? "حدث خطأ أثناء طباعة الإيصال" : "Error printing receipt",
        variant: "destructive",
      });
      setPrintLoading(false);
    }
  };

  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border rounded-lg p-5 bg-card shadow-sm">
        <div className="border-b border-primary/30 pb-3 mb-4">
          <h3 className={`text-lg font-semibold text-primary flex items-center gap-2 ${textAlignClass}`}>
            <BadgePercent className="w-5 h-5" />
            {t('discountSection')}
          </h3>
        </div>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BadgePercent className="w-5 h-5 text-primary" />
              </div>
              <Label htmlFor="discount" className={`text-muted-foreground mb-1.5 block ${textAlignClass}`}>{t('discountColon')}</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                value={discount || ""}
                onChange={handleDiscountChange}
                className={`pl-10 border-primary/20 focus:border-primary ${textAlignClass}`}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Banknote className="w-5 h-5 text-green-500" />
              </div>
              <Label htmlFor="deposit" className={`text-muted-foreground mb-1.5 block ${textAlignClass}`}>{t('depositColon')}</Label>
              <Input
                id="deposit"
                type="number"
                step="0.01"
                value={deposit || ""}
                onChange={handleDepositChange}
                className={`pl-10 border-primary/20 focus:border-primary ${textAlignClass}`}
              />
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handlePayInFull} 
            className="w-full border-primary/20 hover:bg-primary/5 text-primary hover:text-primary/80"
          >
            <Banknote className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'} text-green-500`} />
            {t('payInFull')} ({total.toFixed(2)} {t('kwd')})
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-5 bg-card shadow-sm">
        <div className="border-b border-primary/30 pb-3 mb-4">
          <h3 className={`text-lg font-semibold text-primary flex items-center gap-2 ${textAlignClass}`}>
            <CreditCard className="w-5 h-5" />
            {t('paymentSection')}
          </h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div 
            className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
              paymentMethod === (language === 'ar' ? "نقداً" : "Cash")
                ? "border-primary bg-primary/5 shadow-sm" 
                : "hover:border-primary/30 hover:bg-muted/10"
            }`}
            onClick={() => selectPaymentMethod(language === 'ar' ? "نقداً" : "Cash")}
          >
            <img 
              src="https://cdn-icons-png.flaticon.com/512/7083/7083125.png" 
              alt={t('cash')} 
              title={t('cash')}
              className="w-12 h-10 object-contain mx-auto mb-2"
            />
            <span className="text-sm font-medium">{t('cash')}</span>
          </div>
          
          <div 
            className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
              paymentMethod === (language === 'ar' ? "كي نت" : "KNET")
                ? "border-primary bg-primary/5 shadow-sm" 
                : "hover:border-primary/30 hover:bg-muted/10"
            }`}
            onClick={() => selectPaymentMethod(language === 'ar' ? "كي نت" : "KNET")}
          >
            <img 
              src="https://kabkg.com/staticsite/images/knet.png" 
              alt={t('knet')} 
              title={t('knet')}
              className="w-12 h-10 object-contain mx-auto mb-2"
            />
            <span className="text-sm font-medium">{t('knet')}</span>
          </div>
          
          <div 
            className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
              paymentMethod === "Visa" 
                ? "border-primary bg-primary/5 shadow-sm" 
                : "hover:border-primary/30 hover:bg-muted/10"
            }`}
            onClick={() => selectPaymentMethod("Visa")}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
              alt="Visa" 
              title="Visa"
              className="w-12 h-10 object-contain mx-auto mb-2 bg-white rounded"
            />
            <span className="text-sm font-medium">{t('visa')}</span>
          </div>
          
          <div 
            className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
              paymentMethod === "MasterCard" 
                ? "border-primary bg-primary/5 shadow-sm" 
                : "hover:border-primary/30 hover:bg-muted/10"
            }`}
            onClick={() => selectPaymentMethod("MasterCard")}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
              alt="MasterCard" 
              title="MasterCard"
              className="w-12 h-10 object-contain mx-auto mb-2 bg-white rounded"
            />
            <span className="text-sm font-medium">{t('mastercard')}</span>
          </div>
        </div>
        
        {(paymentMethod === "Visa" || paymentMethod === "MasterCard" || paymentMethod === "كي نت" || paymentMethod === "KNET") && (
          <div className="mt-4 space-y-2">
            <Label htmlFor="authNumber" className={`text-muted-foreground block ${textAlignClass}`}>{t('approvalNumber')}:</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <CardIcon className="w-5 h-5 text-primary" />
              </div>
              <Input
                id="authNumber"
                value={authNumber}
                onChange={handleAuthNumberChange}
                placeholder="xxxxxx"
                className={`pl-10 ${textAlignClass}`}
              />
            </div>
          </div>
        )}
        
        <div className="mt-6 p-4 border rounded-lg bg-primary/5">
          <div className={`flex justify-between text-lg font-medium ${textAlignClass}`}>
            <span>{t('totalInvoice')}:</span>
            <span>{total.toFixed(2)} {t('kwd')}</span>
          </div>
          
          <div className={`flex justify-between mt-2 text-green-600 ${textAlignClass}`}>
            <span>{t('deposit')}:</span>
            <span>{deposit.toFixed(2)} {t('kwd')}</span>
          </div>
          
          <div className={`flex justify-between mt-2 ${remaining > 0 ? 'text-amber-600' : 'text-green-600'} font-medium ${textAlignClass}`}>
            <span>{t('remaining')}:</span>
            <span>{remaining.toFixed(2)} {t('kwd')}</span>
          </div>
        </div>
        
        {!invoiceCreated ? (
          <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button 
              className="w-full" 
              size="lg"
              onClick={saveOrder}
              disabled={loading}
            >
              {loading ? t('saving') : language === 'ar' ? 'حفظ الطلب' : 'Save Order'}
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="mt-6" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-3 border border-green-500 rounded-lg bg-green-50 text-green-700 mb-4">
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">{t('orderCreated')}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full mt-2">
                  <div className="border border-green-300 rounded p-2 text-center bg-green-100">
                    <div className="text-xs text-green-600 font-medium">{t('workOrder')}</div>
                    <div className="font-bold">{getValues<string>('workOrderId')}</div>
                  </div>
                  
                  <div className="border border-green-300 rounded p-2 text-center bg-green-100">
                    <div className="text-xs text-green-600 font-medium">{t('invoice')}</div>
                    <div className="font-bold">{getValues<string>('invoiceId')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <PrintWorkOrderButton
                invoice={getValues()}
                patientName={getValues<string>('patientName')}
                patientPhone={getValues<string>('patientPhone')}
                rx={getValues('rx')}
                lensType={getValues<string>('lensType')}
                coating={getValues<string>('coating')}
                frame={{
                  brand: getValues<string>('frameBrand'),
                  model: getValues<string>('frameModel'),
                  color: getValues<string>('frameColor'),
                  size: getValues<string>('frameSize'),
                  price: getValues<number>('framePrice'),
                }}
                variant="outline"
                className="w-full"
                isNewInvoice={true}
              >
                <Button variant="outline" className="w-full gap-2" size="lg">
                  <Printer className="h-4 w-4" />
                  {t('printWorkOrder')}
                </Button>
              </PrintWorkOrderButton>
              
              <Button 
                variant="default" 
                className="w-full gap-2" 
                size="lg"
                onClick={handlePrintReceipt}
                disabled={printLoading}
              >
                <Receipt className="h-4 w-4" />
                {language === 'ar' ? 'طباعة الإيصال' : 'Print Receipt'}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
