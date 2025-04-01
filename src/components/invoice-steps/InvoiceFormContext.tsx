
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { usePatientStore } from "@/store/patientStore";
import { Patient } from "@/store/patientStore";
import { toast } from "@/components/ui/use-toast";
import { useLanguageStore } from "@/store/languageStore";

interface InvoiceFormContextType {
  // Form state
  getValues: <T = any>(key?: string) => T;
  setValue: <T = any>(key: string, value: T) => void;
  formState: Record<string, any>;
  
  // Patient state
  patientSearchResults: Patient[];
  setPatientSearchResults: React.Dispatch<React.SetStateAction<Patient[]>>;
  currentPatient: Patient | null;
  setCurrentPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
  
  // Navigation helpers
  validateCurrentStep: (stepName: string) => boolean;
  
  // Calculation helpers
  calculateTotal: () => number;
  calculateRemaining: () => number;
  updateServicePrice: (price: number) => void;
  
  // New price/discount calculation
  updateFinalPrice: (finalPrice: number) => void;
  useFinalPrice: boolean;
}

const InvoiceFormContext = createContext<InvoiceFormContextType | undefined>(undefined);

export const useInvoiceForm = (): InvoiceFormContextType => {
  const context = useContext(InvoiceFormContext);
  if (!context) {
    throw new Error('useInvoiceForm must be used within an InvoiceFormProvider');
  }
  return context;
};

interface InvoiceFormProviderProps {
  children: ReactNode;
  value?: InvoiceFormContextType;
}

export const InvoiceFormProvider: React.FC<InvoiceFormProviderProps> = ({ 
  children,
  value
}) => {
  const { t } = useLanguageStore();
  const [formState, setFormState] = useState<Record<string, any>>({
    // Patient details
    patientId: undefined,
    patientName: '',
    patientPhone: '',
    skipPatient: false,
    rx: null,
    contactLensRx: null,
    
    // Product details
    invoiceType: 'glasses',
    lensType: '',
    lensPrice: 0,
    coating: '',
    coatingPrice: 0,
    thickness: '',
    thicknessPrice: 0,
    skipFrame: false,
    frameBrand: '',
    frameModel: '',
    frameColor: '',
    frameSize: '',
    framePrice: 0,
    contactLensItems: [],
    
    // Payment details
    discount: 0,
    deposit: 0,
    total: 0,
    remaining: 0,
    paymentMethod: '',
    authNumber: '',
    workOrderId: '',
    invoiceId: '',
    isPaid: false,
    
    // Final price mode
    useFinalPrice: false, // Toggle between discount amount and final price input
    finalPrice: 0
  });
  
  const [patientSearchResults, setPatientSearchResults] = useState<Patient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  
  // Form value getters and setters
  const getValues = <T = any>(key?: string): T => {
    if (!key) return formState as T;
    return formState[key] as T;
  };
  
  const setValue = <T = any>(key: string, value: T) => {
    setFormState(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Validation helpers for each step
  const validateCurrentStep = (stepName: string): boolean => {
    const { t } = useLanguageStore();
    
    if (stepName === 'patient') {
      // Patient step validation
      if (!getValues('skipPatient') && !getValues('patientName')) {
        toast({
          title: t('validationError'),
          description: t('pleaseSelectOrCreateAPatient'),
          variant: "destructive"
        });
        return false;
      }
      return true;
    }
    
    else if (stepName === 'products') {
      // Products step validation
      const invoiceType = getValues<string>('invoiceType');
      
      if (invoiceType === 'glasses') {
        // For glasses, either lens or frame (if not skipped) must be selected
        const hasLens = !!getValues('lensType');
        const frameRequired = !getValues('skipFrame');
        const hasFrame = frameRequired ? !!getValues('frameBrand') : true;
        
        if (!hasLens && !hasFrame) {
          toast({
            title: t('validationError'),
            description: t('pleaseSelectLensOrFrame'),
            variant: "destructive"
          });
          return false;
        }
        
        if (frameRequired && !hasFrame) {
          toast({
            title: t('validationError'),
            description: t('pleaseSelectFrame'),
            variant: "destructive"
          });
          return false;
        }
        
        if (!hasLens) {
          toast({
            title: t('validationError'),
            description: t('pleaseSelectLens'),
            variant: "destructive"
          });
          return false;
        }
      } 
      else if (invoiceType === 'contacts') {
        // For contacts, at least one contact lens item must be added
        const contactItems = getValues<any[]>('contactLensItems') || [];
        if (contactItems.length === 0) {
          toast({
            title: t('validationError'),
            description: t('pleaseAddContactLenses'),
            variant: "destructive"
          });
          return false;
        }
      }
      else if (invoiceType === 'exam') {
        // For exam, service price must be set
        const servicePrice = getValues<number>('servicePrice');
        if (!servicePrice || servicePrice <= 0) {
          toast({
            title: t('validationError'),
            description: t('pleaseEnterServicePrice'),
            variant: "destructive"
          });
          return false;
        }
      }
      
      return true;
    }
    
    else if (stepName === 'payment') {
      // Payment step validation
      if (!getValues('paymentMethod')) {
        toast({
          title: t('validationError'),
          description: t('pleaseSelectPaymentMethod'),
          variant: "destructive"
        });
        return false;
      }
      
      // For card payments, auth number is required
      const paymentMethod = getValues<string>('paymentMethod');
      const isCardPayment = paymentMethod === 'Visa' || paymentMethod === 'MasterCard' || 
                            paymentMethod === 'كي نت' || paymentMethod === 'KNET';
      
      if (isCardPayment && !getValues('authNumber')) {
        toast({
          title: t('validationError'),
          description: t('pleaseEnterAuthNumber'),
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    }
    
    // Default to true for any unhandled step
    return true;
  };
  
  // Service price update function
  const updateServicePrice = (price: number) => {
    setValue('servicePrice', price);
    if (getValues<string>('invoiceType') === 'exam') {
      const discount = getValues<number>('discount') || 0;
      const newTotal = Math.max(0, price - discount);
      setValue('total', newTotal);
      const deposit = getValues<number>('deposit') || 0;
      setValue('remaining', Math.max(0, newTotal - deposit));
    }
  };
  
  // Calculation helpers
  const calculateTotal = () => {
    // Handle eye exam with service price
    if (getValues<string>('invoiceType') === 'exam') {
      const servicePrice = getValues<number>('servicePrice') || 0;
      const discount = getValues<number>('discount') || 0;
      return Math.max(0, servicePrice - discount);
    }
    
    const lensPrice = getValues<number>('lensPrice') || 0;
    const coatingPrice = getValues<number>('coatingPrice') || 0;
    const thicknessPrice = getValues<number>('thicknessPrice') || 0;
    const framePrice = getValues<boolean>('skipFrame') ? 0 : (getValues<number>('framePrice') || 0);
    const discount = getValues<number>('discount') || 0;
    
    const contactLensItems = getValues<any[]>('contactLensItems') || [];
    // Calculate contact lens total accounting for quantities
    const contactLensTotal = contactLensItems.reduce((sum, lens) => 
      sum + ((lens.price || 0) * (lens.qty || 1)), 0
    );
    
    if (getValues<string>('invoiceType') === 'glasses') {
      return Math.max(0, lensPrice + coatingPrice + thicknessPrice + framePrice - discount);
    } else {
      return Math.max(0, contactLensTotal - discount);
    }
  };
  
  const calculateRemaining = () => {
    const total = calculateTotal();
    const deposit = getValues<number>('deposit') || 0;
    return Math.max(0, total - deposit);
  };
  
  // New function to handle final price input
  const updateFinalPrice = (finalPrice: number) => {
    setValue('finalPrice', finalPrice);
    
    // Calculate the correct discount amount based on the final price
    let subtotal = 0;
    
    if (getValues<string>('invoiceType') === 'exam') {
      subtotal = getValues<number>('servicePrice') || 0;
    } else if (getValues<string>('invoiceType') === 'glasses') {
      const lensPrice = getValues<number>('lensPrice') || 0;
      const coatingPrice = getValues<number>('coatingPrice') || 0;
      const thicknessPrice = getValues<number>('thicknessPrice') || 0;
      const framePrice = getValues<boolean>('skipFrame') ? 0 : (getValues<number>('framePrice') || 0);
      subtotal = lensPrice + coatingPrice + thicknessPrice + framePrice;
    } else {
      const contactLensItems = getValues<any[]>('contactLensItems') || [];
      subtotal = contactLensItems.reduce((sum, lens) => 
        sum + ((lens.price || 0) * (lens.qty || 1)), 0
      );
    }
    
    // Calculate discount as the difference between subtotal and finalPrice
    const newDiscount = Math.max(0, subtotal - finalPrice);
    setValue('discount', newDiscount);
    
    // Update total and remaining
    setValue('total', finalPrice);
    const deposit = getValues<number>('deposit') || 0;
    setValue('remaining', Math.max(0, finalPrice - deposit));
  };
  
  // Create the context value
  const contextValue = value || {
    getValues,
    setValue,
    formState,
    patientSearchResults,
    setPatientSearchResults,
    currentPatient,
    setCurrentPatient,
    validateCurrentStep,
    calculateTotal,
    calculateRemaining,
    updateServicePrice,
    updateFinalPrice,
    useFinalPrice: getValues<boolean>('useFinalPrice') || false
  };
  
  return (
    <InvoiceFormContext.Provider value={contextValue}>
      {children}
    </InvoiceFormContext.Provider>
  );
};
