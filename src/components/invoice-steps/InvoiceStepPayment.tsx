
import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInvoiceForm } from "./InvoiceFormContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  BadgePercent, Banknote, CreditCard, Check,
  CreditCard as CardIcon, Save
} from "lucide-react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { toast } from "@/hooks/use-toast";

export const InvoiceStepPayment: React.FC = () => {
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  const { getValues, setValue, calculateTotal, calculateRemaining } = useInvoiceForm();
  const addWorkOrder = useInvoiceStore(state => state.addWorkOrder);
  const addInvoice = useInvoiceStore(state => state.addInvoice);
  
  const [discount, setDiscount] = useState(getValues<number>('discount') || 0);
  const [deposit, setDeposit] = useState(getValues<number>('deposit') || 0);
  const [paymentMethod, setPaymentMethod] = useState(getValues<string>('paymentMethod') || "");
  const [authNumber, setAuthNumber] = useState(getValues<string>('authNumber') || "");
  const [orderSaved, setOrderSaved] = useState(!!getValues<string>('workOrderId') && !!getValues<string>('invoiceId'));
  
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
      toast.error(t('paymentMethodError'));
      return;
    }
    
    const patientId = getValues<string>('patientId') || 'anonymous';
    const invoiceType = getValues<string>('invoiceType') || 'glasses';
    
    // Create work order with both prescription types
    let workOrder: any = {
      patientId,
      // Include rx data in all work orders
      rx: getValues('rx')
    };
    
    if (invoiceType === 'glasses') {
      workOrder.lensType = {
        name: getValues<string>('lensType'),
        price: getValues<number>('lensPrice')
      };
      // Include contact lens rx data even for glasses orders if it exists
      if (getValues('contactLensRx')) {
        workOrder.contactLensRx = getValues('contactLensRx');
      }
    } else if (invoiceType === 'contacts') {
      workOrder.contactLenses = getValues('contactLensItems') || [];
      workOrder.contactLensRx = getValues('contactLensRx') || null;
      // Include glasses rx data even for contact lens orders
      if (getValues('rx')) {
        workOrder.rx = getValues('rx');
      }
    }
    
    const workOrderId = addWorkOrder?.(workOrder) || `WO${Date.now()}`;
    setValue('workOrderId', workOrderId);
    
    const formData = getValues();
    const invoiceData: any = {
      patientId: formData.patientId,
      patientName: formData.patientName,
      patientPhone: formData.patientPhone,
      invoiceType: formData.invoiceType || 'glasses',
      
      discount: formData.discount,
      deposit: formData.deposit,
      total: formData.total,
      
      paymentMethod: formData.paymentMethod,
      authNumber: formData.authNumber,
      workOrderId: workOrderId, // Link to the work order
      
      // Include both types of prescription data in the invoice
      rx: formData.rx,
      contactLensRx: formData.contactLensRx
    };
    
    if (invoiceType === 'glasses') {
      invoiceData.lensType = formData.lensType;
      invoiceData.lensPrice = formData.lensPrice;
      
      invoiceData.coating = formData.coating;
      invoiceData.coatingPrice = formData.coatingPrice;
      
      invoiceData.frameBrand = formData.frameBrand;
      invoiceData.frameModel = formData.frameModel;
      invoiceData.frameColor = formData.frameColor;
      invoiceData.framePrice = formData.framePrice;
    } else if (invoiceType === 'contacts') {
      invoiceData.contactLensItems = formData.contactLensItems || [];
    }
    
    const invoiceId = addInvoice(invoiceData);
    setValue('invoiceId', invoiceId);
    
    setOrderSaved(true);
    
    toast.success(t('orderSavedSuccess'));

    if (window && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('navigateToSummary'));
    }
  };
  
  const textAlignClass = isRtl ? 'text-right' : 'text-left';
  const directionClass = isRtl ? 'rtl' : 'ltr';
  
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
            <Banknote className={`w-5 h-5 ${isRtl ? 'ml-2' : 'mr-2'} text-green-500`} />
            {t('payInFull')} ({total.toFixed(2)} {isRtl ? 'د.ك' : t('kwd')})
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
              paymentMethod === (isRtl ? "نقداً" : "Cash")
                ? "border-primary bg-primary/5 shadow-sm" 
                : "hover:border-primary/30 hover:bg-muted/10"
            }`}
            onClick={() => selectPaymentMethod(isRtl ? "نقداً" : "Cash")}
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
              paymentMethod === (isRtl ? "كي نت" : "KNET")
                ? "border-primary bg-primary/5 shadow-sm" 
                : "hover:border-primary/30 hover:bg-muted/10"
            }`}
            onClick={() => selectPaymentMethod(isRtl ? "كي نت" : "KNET")}
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
            <span>{total.toFixed(2)} {isRtl ? 'د.ك' : t('kwd')}</span>
          </div>
          
          <div className={`flex justify-between mt-2 text-green-600 ${textAlignClass}`}>
            <span>{t('deposit')}:</span>
            <span>{deposit.toFixed(2)} {isRtl ? 'د.ك' : t('kwd')}</span>
          </div>
          
          <div className={`flex justify-between mt-2 ${remaining > 0 ? 'text-amber-600' : 'text-green-600'} font-medium ${textAlignClass}`}>
            <span>{t('remaining')}:</span>
            <span>{remaining.toFixed(2)} {isRtl ? 'د.ك' : t('kwd')}</span>
          </div>
        </div>
        
        {!orderSaved ? (
          <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button 
              className="w-full" 
              size="lg"
              onClick={saveOrder}
            >
              <Save className="w-5 h-5 mr-2" />
              {isRtl ? 'حفظ الطلب' : 'Save Order'}
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="mt-6 p-3 border border-green-500 rounded-lg flex items-center justify-center bg-green-50 text-green-700" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Check className="w-5 h-5 mr-2" />
            <span className="font-medium">
              {isRtl ? 'تم حفظ الطلب بنجاح' : 'Order saved successfully'}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
