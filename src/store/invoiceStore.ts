import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Payment {
  amount: number;
  method: string;
  date: string;
  authNumber?: string; // Added for card payment authorization numbers
}

export interface Invoice {
  invoiceId: string;
  patientId?: string;
  patientName: string;
  patientPhone: string;
  
  lensType: string;
  lensPrice: number;
  
  coating: string;
  coatingPrice: number;
  
  frameBrand: string;
  frameModel: string;
  frameColor: string;
  frameSize?: string; // Added frame size
  framePrice: number;
  
  discount: number;
  deposit: number;
  total: number;
  remaining: number;
  
  paymentMethod: string;
  payments?: Payment[];
  createdAt: string;
  isPaid: boolean;
  authNumber?: string; // Added for authorization numbers
  workOrderId?: string; // Reference to the work order
  notes?: string; // Added notes field for work orders
}

interface WorkOrder {
  id: string;
  patientId: string;
  createdAt: string;
  lensType?: {
    name: string;
    price: number;
  };
}

interface InvoiceState {
  invoices: Invoice[];
  workOrders: WorkOrder[];
  addInvoice: (invoice: Omit<Invoice, "invoiceId" | "createdAt" | "remaining" | "isPaid" | "payments">) => string;
  markAsPaid: (invoiceId: string, paymentMethod?: string, authNumber?: string) => void;
  addPartialPayment: (invoiceId: string, payment: Omit<Payment, "date">) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  getUnpaidInvoices: () => Invoice[];
  getInvoicesByPatientId: (patientId: string) => Invoice[];
  getWorkOrdersByPatientId: (patientId: string) => WorkOrder[];
  clearInvoices?: () => void;
  addExistingInvoice?: (invoice: Invoice) => void;
  addWorkOrder?: (workOrder: Omit<WorkOrder, "id" | "createdAt">) => string;
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      invoices: [],
      workOrders: [], 
      
      addInvoice: (invoice) => {
        const invoiceId = `INV${Date.now()}`;
        const createdAt = new Date().toISOString();
        const remaining = Math.max(0, invoice.total - invoice.deposit);
        const isPaid = remaining === 0;
        
        // Extract auth number if it exists
        const { authNumber, ...restInvoice } = invoice as (typeof invoice & { authNumber?: string });
        
        const initialPayment: Payment = {
          amount: invoice.deposit,
          method: invoice.paymentMethod,
          date: createdAt,
          authNumber: authNumber // Add auth number to payment
        };
        
        const payments = invoice.deposit > 0 ? [initialPayment] : [];
        
        set((state) => ({
          invoices: [
            ...state.invoices,
            { 
              ...restInvoice, 
              invoiceId, 
              createdAt, 
              remaining,
              isPaid,
              payments,
              authNumber // Store auth number at invoice level too
            }
          ]
        }));
        
        return invoiceId;
      },
      
      markAsPaid: (invoiceId, paymentMethod, authNumber) => {
        set((state) => ({
          invoices: state.invoices.map(invoice => {
            if (invoice.invoiceId === invoiceId) {
              const remainingAmount = invoice.remaining;
              const method = paymentMethod || invoice.paymentMethod;
              
              // Create a new payment record for the remaining amount
              const newPayment: Payment = {
                amount: remainingAmount,
                method: method,
                date: new Date().toISOString(),
                authNumber: authNumber // Add auth number to payment
              };
              
              // Get existing payments or create empty array if none exist
              const existingPayments = invoice.payments || [];
              
              return { 
                ...invoice, 
                isPaid: true, 
                remaining: 0, 
                deposit: invoice.total,
                paymentMethod: method,
                payments: [...existingPayments, newPayment],
                authNumber: authNumber || invoice.authNumber // Update or retain auth number
              };
            }
            return invoice;
          })
        }));
      },
      
      addPartialPayment: (invoiceId, payment) => {
        set((state) => ({
          invoices: state.invoices.map(invoice => {
            if (invoice.invoiceId === invoiceId) {
              // Get existing payments or create empty array if none exist
              const existingPayments = invoice.payments || [];
              
              // Create a new payment record
              const newPayment: Payment = {
                ...payment,
                date: new Date().toISOString()
              };
              
              // Calculate new remaining amount
              const newDeposit = existingPayments.reduce((sum, p) => sum + p.amount, 0) + payment.amount;
              const newRemaining = Math.max(0, invoice.total - newDeposit);
              const isPaid = newRemaining === 0;
              
              return { 
                ...invoice, 
                isPaid,
                remaining: newRemaining,
                deposit: newDeposit,
                payments: [...existingPayments, newPayment],
                authNumber: payment.authNumber || invoice.authNumber // Update auth number if provided
              };
            }
            return invoice;
          })
        }));
      },
      
      getInvoiceById: (id) => {
        return get().invoices.find(invoice => invoice.invoiceId === id);
      },
      
      getUnpaidInvoices: () => {
        return get().invoices.filter(invoice => !invoice.isPaid);
      },
      
      getInvoicesByPatientId: (patientId) => {
        return get().invoices.filter(invoice => invoice.patientId === patientId);
      },
      
      getWorkOrdersByPatientId: (patientId) => {
        return get().workOrders.filter(workOrder => workOrder.patientId === patientId);
      },
      
      clearInvoices: () => {
        set({ invoices: [], workOrders: [] });
      },
      
      addExistingInvoice: (invoice) => {
        let invoiceToAdd = invoice;
        
        if (!invoice.payments) {
          const initialPayment: Payment = {
            amount: invoice.deposit,
            method: invoice.paymentMethod,
            date: invoice.createdAt,
            authNumber: (invoice as any).authNumber // Add auth number if exists
          };
          
          invoiceToAdd = {
            ...invoice,
            payments: invoice.deposit > 0 ? [initialPayment] : []
          };
        }
        
        set((state) => ({
          invoices: [...state.invoices, invoiceToAdd]
        }));
      },
      
      addWorkOrder: (workOrder) => {
        const id = `WO${Date.now()}`;
        const createdAt = new Date().toISOString();
        
        set((state) => ({
          workOrders: [
            ...state.workOrders,
            { 
              ...workOrder, 
              id, 
              createdAt
            }
          ]
        }));
        
        return id;
      }
    }),
    {
      name: 'invoice-store'
    }
  )
);
