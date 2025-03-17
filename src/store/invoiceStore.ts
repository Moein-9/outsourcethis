
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  createdAt: string;
  isPaid: boolean;
}

interface InvoiceState {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, "invoiceId" | "createdAt" | "remaining" | "isPaid">) => string;
  markAsPaid: (invoiceId: string) => void;
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
        
        set((state) => ({
          invoices: [
            ...state.invoices,
            { 
              ...invoice, 
              invoiceId, 
              createdAt, 
              remaining,
              isPaid
            }
          ]
        }));
        
        return invoiceId;
      },
      
      markAsPaid: (invoiceId) => {
        set((state) => ({
          invoices: state.invoices.map(invoice => 
            invoice.invoiceId === invoiceId 
              ? { ...invoice, isPaid: true, remaining: 0, deposit: invoice.total } 
              : invoice
          )
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
        set((state) => ({
          invoices: [...state.invoices, invoice]
        }));
      }
    }),
    {
      name: 'invoice-store'
    }
  )
);
