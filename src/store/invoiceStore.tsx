
import React, { createContext, useContext, useState } from 'react';
import { LocationId } from '@/store/storeLocationStore';

export interface Invoice {
  invoiceId: string;
  patientId?: string;
  lensType?: string;
  lensPrice?: number;
  frameBrand?: string;
  frameModel?: string;
  frameColor?: string;
  frameSize?: string;
  framePrice?: number;
  coatingType?: string;
  coatingPrice?: number;
  subtotal: number;
  discount?: number;
  total: number;
  deposit?: number;
  remaining: number;
  isPaid: boolean;
  paymentMethod?: string;
  approvalNumber?: string;
  createdAt: string;
  workOrderId?: string;
  locationId?: LocationId;
  payments: Payment[];
}

interface Payment {
  id: string;
  amount: number;
  method: string;
  date: string;
  approvalNumber?: string;
}

interface WorkOrder {
  id: string;
  patientId: string;
  lensType?: {
    name: string;
    price: number;
  };
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  locationId?: LocationId;
}

interface InvoiceContextType {
  invoices: Invoice[];
  workOrders: WorkOrder[];
  addInvoice: (invoice: Omit<Invoice, "invoiceId" | "createdAt" | "remaining" | "isPaid" | "payments" | "locationId"> & { locationId?: LocationId }) => string;
  addExistingInvoice: (invoice: Invoice) => void;
  getInvoice: (id: string) => Invoice | undefined;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  addWorkOrder: (workOrder: Omit<WorkOrder, "id">) => string;
  getWorkOrder: (id: string) => WorkOrder | undefined;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
  addPayment: (invoiceId: string, payment: Omit<Payment, "id">) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  const addInvoice = (invoice: Omit<Invoice, "invoiceId" | "createdAt" | "remaining" | "isPaid" | "payments" | "locationId"> & { locationId?: LocationId }): string => {
    const invoiceId = `INV${Date.now()}`;
    const createdAt = new Date().toISOString();
    const remaining = invoice.total - (invoice.deposit || 0);
    const isPaid = remaining <= 0;
    
    const newInvoice: Invoice = {
      ...invoice,
      invoiceId,
      createdAt,
      remaining,
      isPaid,
      payments: [],
      locationId: invoice.locationId
    };
    
    setInvoices((prev) => [...prev, newInvoice]);
    return invoiceId;
  };

  const addExistingInvoice = (invoice: Invoice): void => {
    setInvoices((prev) => [...prev, invoice]);
  };

  const getInvoice = (id: string): Invoice | undefined => {
    return invoices.find((inv) => inv.invoiceId === id);
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>): void => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.invoiceId === id ? { ...inv, ...updates } : inv
      )
    );
  };

  const addWorkOrder = (workOrder: Omit<WorkOrder, "id">): string => {
    const id = `WO${Date.now()}`;
    const newWorkOrder = { ...workOrder, id };
    setWorkOrders((prev) => [...prev, newWorkOrder]);
    return id;
  };

  const getWorkOrder = (id: string): WorkOrder | undefined => {
    return workOrders.find((wo) => wo.id === id);
  };

  const updateWorkOrder = (id: string, updates: Partial<WorkOrder>): void => {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === id ? { ...wo, ...updates } : wo))
    );
  };

  const addPayment = (invoiceId: string, payment: Omit<Payment, "id">): void => {
    const paymentId = `PAY${Date.now()}`;
    const newPayment = { ...payment, id: paymentId };
    
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.invoiceId === invoiceId) {
          const updatedPayments = [...inv.payments, newPayment];
          const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
          const remaining = inv.total - totalPaid;
          const isPaid = remaining <= 0;
          
          return {
            ...inv,
            payments: updatedPayments,
            remaining,
            isPaid,
          };
        }
        return inv;
      })
    );
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        workOrders,
        addInvoice,
        addExistingInvoice,
        getInvoice,
        updateInvoice,
        addWorkOrder,
        getWorkOrder,
        updateWorkOrder,
        addPayment,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoiceStore = (): InvoiceContextType => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoiceStore must be used within an InvoiceProvider');
  }
  return context;
};
