import React, { createContext, useContext, useState, useCallback } from "react";

interface InvoiceFormData {
  invoiceType: "glasses" | "contacts" | "exam";
  patientName: string;
  patientPhone: string;
  date: Date | null;
  dueDate: Date | null;
  notes: string;
  discount: number;
  deposit: number;
  remaining: number;
  total: number;
  
  // Glasses-specific
  skipFrame: boolean;
  frameBrand: string;
  frameModel: string;
  frameColor: string;
  frameSize: string;
  framePrice: number;
  lensType: string;
  lensPrice: number;
  coating: string;
  coatingPrice: number;
  thickness: string;
  thicknessPrice: number;
  rx: any; // prescription
  
  // Contacts-specific
  contactLensItems: any[];
  contactLensRx: any;
  
  // Exam-specific
  serviceName: string;
  serviceId: string;
  serviceDescription: string;
  servicePrice: number;

  lensCombinationPrice: number | null;
}

interface InvoiceFormContextType {
  formData: InvoiceFormData;
  setValue: <T extends keyof InvoiceFormData>(field: T, value: InvoiceFormData[T]) => void;
  getValues: <T extends keyof InvoiceFormData>(field?: T) => T extends undefined ? InvoiceFormData : InvoiceFormData[T];
  updateServicePrice: (price: number) => void;
}

const InvoiceFormContext = createContext<InvoiceFormContextType | undefined>(undefined);

const defaultFormState: InvoiceFormData = {
  invoiceType: "glasses",
  patientName: "",
  patientPhone: "",
  date: null,
  dueDate: null,
  notes: "",
  discount: 0,
  deposit: 0,
  remaining: 0,
  total: 0,
  
  skipFrame: false,
  frameBrand: "",
  frameModel: "",
  frameColor: "",
  frameSize: "",
  framePrice: 0,
  lensType: "",
  lensPrice: 0,
  coating: "",
  coatingPrice: 0,
  thickness: "",
  thicknessPrice: 0,
  rx: null,
  
  contactLensItems: [],
  contactLensRx: null,
  
  serviceName: "",
  serviceId: "",
  serviceDescription: "",
  servicePrice: 0,
  lensCombinationPrice: null,
};

export const InvoiceFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<InvoiceFormData>(defaultFormState);
  
  const setValue = useCallback(<T extends keyof InvoiceFormData>(field: T, value: InvoiceFormData[T]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);
  
  const getValues = useCallback(<T extends keyof InvoiceFormData>(field?: T): T extends undefined ? InvoiceFormData : InvoiceFormData[T] => {
    return field ? formData[field] : formData as any;
  }, [formData]);
  
  const updateServicePrice = useCallback((price: number) => {
    setFormData(prev => ({
      ...prev,
      total: price - prev.discount,
      remaining: price - prev.discount - prev.deposit,
      servicePrice: price
    }));
  }, []);
  
  const contextValue: InvoiceFormContextType = {
    formData,
    setValue,
    getValues,
    updateServicePrice
  };
  
  return (
    <InvoiceFormContext.Provider value={contextValue}>
      {children}
    </InvoiceFormContext.Provider>
  );
};

export const useInvoiceForm = () => {
  const context = useContext(InvoiceFormContext);
  if (!context) {
    throw new Error("useInvoiceForm must be used within a InvoiceFormProvider");
  }
  return context;
};
