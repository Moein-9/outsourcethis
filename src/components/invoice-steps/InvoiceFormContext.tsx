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
  validateCurrentStep: (step: string) => boolean;
  
  // Calculation helpers
  calculateTotal: () => number;
  calculateRemaining: () => number;
  updateServicePrice: (price: number) => void;
  
  // Final price input handling
  isFinalPriceMode: boolean;
  setIsFinalPriceMode: React.Dispatch<React.SetStateAction<boolean>>;
  finalPrice: number;
  setFinalPrice: React.Dispatch<React.SetStateAction<number>>;
  updateFinalPrice: (price: number) => void;
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
  });
  
  const [patientSearchResults, setPatientSearchResults] = useState<Patient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  
  // Final price mode state
  const [isFinalPriceMode, setIsFinalPriceMode] = useState<boolean>(false);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  
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
  
  // Validation helpers
  const validateCurrentStep = (step: string): boolean => {
    // Patient step validation
    if (step === 'patient') {
      if (!getValues<boolean>('skipPatient') && !getValues<string>('patientName')) {
        toast({
          title: t('validationError'),
          description: t('patientNameRequired'),
          variant: "destructive"
        });
        return false;
      }
      return true;
    }
    
    // Products step validation
    else if (step === 'products') {
      const invoiceType = getValues<string>('invoiceType');
      
      if (invoiceType === 'glasses') {
        // For glasses, validate lens type or frame info is entered
        const hasLensType = !!getValues<string>('lensType');
        const skipFrame = getValues<boolean>('skipFrame');
        const hasFrameInfo = !skipFrame && !!getValues<string>('frameBrand');
        
        if (!hasLensType && !hasFrameInfo) {
          toast({
            title: t('validationError'),
            description: t('productDetailsRequired'),
            variant: "destructive"
          });
          return false;
        }
      } 
      else if (invoiceType === 'contacts') {
        // For contacts, validate at least one contact lens item
        const contactLensItems = getValues<any[]>('contactLensItems') || [];
        if (contactLensItems.length === 0) {
          toast({
            title: t('validationError'),
            description: t('contactLensItemsRequired'),
            variant: "destructive"
          });
          return false;
        }
      }
      else if (invoiceType === 'exam') {
        // For exam, validate service price
        const servicePrice = getValues<number>('servicePrice') || 0;
        if (servicePrice <= 0) {
          toast({
            title: t('validationError'),
            description: t('servicePriceRequired'),
            variant: "destructive"
          });
          return false;
        }
      }
      return true;
    }
    
    // Payment step validation
    else if (step === 'payment') {
      const paymentMethod = getValues<string>('paymentMethod');
      
      if (!paymentMethod) {
        toast({
          title: t('validationError'),
          description: t('paymentMethodRequired'),
          variant: "destructive"
        });
        return false;
      }
      
      // Validate auth number for card payments
      if ((paymentMethod === "Visa" || paymentMethod === "MasterCard" || 
           paymentMethod === "كي نت" || paymentMethod === "KNET") && 
           !getValues<string>('authNumber')) {
        toast({
          title: t('validationError'),
          description: t('authNumberRequired'),
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    }
    
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
  
  // Update from final price
  const updateFinalPrice = (price: number) => {
    setFinalPrice(price);
    
    // Calculate total without discount first
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
    
    // Calculate discount as the difference between subtotal and final price
    const newDiscount = Math.max(0, subtotal - price);
    setValue('discount', newDiscount);
    setValue('total', price);
    
    // Update remaining after setting the total
    const deposit = getValues<number>('deposit') || 0;
    setValue('remaining', Math.max(0, price - deposit));
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
    isFinalPriceMode,
    setIsFinalPriceMode,
    finalPrice,
    setFinalPrice,
    updateFinalPrice
  };
  
  return (
    <InvoiceFormContext.Provider value={contextValue}>
      {children}
    </InvoiceFormContext.Provider>
  );
};
