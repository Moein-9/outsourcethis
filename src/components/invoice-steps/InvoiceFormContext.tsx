
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { usePatientStore } from "@/store/patientStore";
import { Patient } from "@/store/patientStore";

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
  validateCurrentStep: () => boolean;
  
  // Calculation helpers
  calculateTotal: () => number;
  calculateRemaining: () => number;
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
    isPaid: false,
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
  
  // Validation helpers
  const validateCurrentStep = () => {
    // We'll implement specific validations when needed
    return true;
  };
  
  // Calculation helpers
  const calculateTotal = () => {
    const lensPrice = getValues<number>('lensPrice') || 0;
    const coatingPrice = getValues<number>('coatingPrice') || 0;
    const framePrice = getValues<boolean>('skipFrame') ? 0 : (getValues<number>('framePrice') || 0);
    const discount = getValues<number>('discount') || 0;
    
    const contactLensItems = getValues<any[]>('contactLensItems') || [];
    const contactLensTotal = contactLensItems.reduce((sum, lens) => sum + (lens.price || 0), 0);
    
    if (getValues<string>('invoiceType') === 'glasses') {
      return Math.max(0, lensPrice + coatingPrice + framePrice - discount);
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
    calculateRemaining
  };
  
  return (
    <InvoiceFormContext.Provider value={contextValue}>
      {children}
    </InvoiceFormContext.Provider>
  );
};
