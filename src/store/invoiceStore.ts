
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
  framePrice: number;
  
  discount: number;
  deposit: number;
  total: number;
  remaining: number;
  
  paymentMethod: string;
  payments?: Payment[];
  createdAt: string;
  isPaid: boolean;
}

interface InvoiceState {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, "invoiceId" | "createdAt" | "remaining" | "isPaid" | "payments">) => string;
  markAsPaid: (invoiceId: string, paymentMethod?: string) => void;
  addPartialPayment: (invoiceId: string, payment: Omit<Payment, "date">) => void; // New method for partial payments
  getInvoiceById: (id: string) => Invoice | undefined;
  getUnpaidInvoices: () => Invoice[];
  // Added for mock data functionality
  clearInvoices?: () => void;
  addExistingInvoice?: (invoice: Invoice) => void;
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      invoices: [],
      
      addInvoice: (invoice) => {
        const invoiceId = `INV${Date.now()}`;
        const createdAt = new Date().toISOString();
        const remaining = Math.max(0, invoice.total - invoice.deposit);
        const isPaid = remaining === 0;
        
        const initialPayment: Payment = {
          amount: invoice.deposit,
          method: invoice.paymentMethod,
          date: createdAt
        };
        
        const payments = invoice.deposit > 0 ? [initialPayment] : [];
        
        set((state) => ({
          invoices: [
            ...state.invoices,
            { 
              ...invoice, 
              invoiceId, 
              createdAt, 
              remaining,
              isPaid,
              payments
            }
          ]
        }));
        
        return invoiceId;
      },
      
      markAsPaid: (invoiceId, paymentMethod) => {
        set((state) => ({
          invoices: state.invoices.map(invoice => {
            if (invoice.invoiceId === invoiceId) {
              const remainingAmount = invoice.remaining;
              const method = paymentMethod || invoice.paymentMethod;
              
              // Create a new payment record for the remaining amount
              const newPayment: Payment = {
                amount: remainingAmount,
                method: method,
                date: new Date().toISOString()
              };
              
              // Get existing payments or create empty array if none exist
              const existingPayments = invoice.payments || [];
              
              return { 
                ...invoice, 
                isPaid: true, 
                remaining: 0, 
                deposit: invoice.total,
                paymentMethod: method,
                payments: [...existingPayments, newPayment]
              };
            }
            return invoice;
          })
        }));
      },
      
      // Add new method for partial payments
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
                payments: [...existingPayments, newPayment]
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
      
      // Add methods to support mock data
      clearInvoices: () => {
        set({ invoices: [] });
      },
      
      addExistingInvoice: (invoice) => {
        // If it's an old invoice without payments, add the payments array with initial payment
        let invoiceToAdd = invoice;
        
        if (!invoice.payments) {
          const initialPayment: Payment = {
            amount: invoice.deposit,
            method: invoice.paymentMethod,
            date: invoice.createdAt
          };
          
          invoiceToAdd = {
            ...invoice,
            payments: invoice.deposit > 0 ? [initialPayment] : []
          };
        }
        
        set((state) => ({
          invoices: [...state.invoices, invoiceToAdd]
        }));
      }
    }),
    {
      name: 'invoice-store'
    }
  )
);
