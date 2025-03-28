
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ContactLensItem } from '@/components/ContactLensSelector';

export interface Payment {
  amount: number;
  method: string;
  date: string;
  authNumber?: string; // Added for card payment authorization numbers
}

export interface Refund {
  refundId: string;
  invoiceId: string;
  amount: number;
  reason: string;
  date: string;
  method: string;
  authNumber?: string;
  processedBy?: string;
}

export interface Exchange {
  exchangeId: string;
  originalInvoiceId: string;
  newInvoiceId?: string;
  reason: string;
  date: string;
  processedBy?: string;
}

export interface Invoice {
  invoiceId: string;
  patientId?: string;
  patientName: string;
  patientPhone: string;
  
  invoiceType?: 'glasses' | 'contacts';
  
  lensType: string;
  lensPrice: number;
  
  coating: string;
  coatingPrice: number;
  
  frameBrand: string;
  frameModel: string;
  frameColor: string;
  frameSize?: string;
  framePrice: number;
  
  contactLensItems?: ContactLensItem[];
  contactLensRx?: any;
  
  discount: number;
  deposit: number;
  total: number;
  remaining: number;
  
  paymentMethod: string;
  payments?: Payment[];
  createdAt: string;
  isPaid: boolean;
  isPickedUp?: boolean;
  pickedUpAt?: string;
  authNumber?: string;
  workOrderId?: string;
  
  // New fields for refund/exchange tracking
  isRefunded?: boolean;
  refundId?: string;
  refundedAt?: string;
  isExchanged?: boolean;
  exchangeId?: string;
  exchangedAt?: string;
}

// Define WorkOrder interface
export interface WorkOrder {
  id: string;
  patientId: string;
  createdAt: string;
  
  lensType?: {
    name: string;
    price: number;
  };
  
  contactLenses?: ContactLensItem[];
  contactLensRx?: any;
  isPickedUp?: boolean;
  pickedUpAt?: string;
  
  // New fields for refund/exchange tracking
  isRefunded?: boolean;
  refundId?: string;
  refundedAt?: string;
  isExchanged?: boolean;
  exchangeId?: string;
  exchangedAt?: string;
}

interface InvoiceState {
  invoices: Invoice[];
  workOrders: WorkOrder[];
  refunds: Refund[];
  exchanges: Exchange[];
  addInvoice: (invoice: Omit<Invoice, "invoiceId" | "createdAt" | "remaining" | "isPaid" | "payments">) => string;
  markAsPaid: (invoiceId: string, paymentMethod?: string, authNumber?: string) => void;
  markAsPickedUp: (id: string, isInvoice?: boolean) => void;
  addPartialPayment: (invoiceId: string, payment: Omit<Payment, "date">) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  getUnpaidInvoices: () => Invoice[];
  getInvoicesByPatientId: (patientId: string) => Invoice[];
  getWorkOrdersByPatientId: (patientId: string) => WorkOrder[];
  clearInvoices?: () => void;
  addExistingInvoice?: (invoice: Invoice) => void;
  addWorkOrder?: (workOrder: Omit<WorkOrder, "id" | "createdAt">) => string;
  updateInvoice: (updatedInvoice: Invoice) => void;
  updateWorkOrder?: (workOrder: WorkOrder) => void;
  
  // New functions for refund and exchange
  processRefund: (invoiceId: string, amount: number, reason: string, method: string, authNumber?: string) => string;
  processExchange: (originalInvoiceId: string, newInvoiceId: string | undefined, reason: string) => string;
  getRefundById: (refundId: string) => Refund | undefined;
  getExchangeById: (exchangeId: string) => Exchange | undefined;
  searchTransactions: (query: string) => { invoices: Invoice[], workOrders: WorkOrder[] };
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      invoices: [],
      workOrders: [], 
      refunds: [],
      exchanges: [],
      
      addInvoice: (invoice) => {
        const invoiceId = `IN${Date.now()}`;
        const createdAt = new Date().toISOString();
        const remaining = Math.max(0, invoice.total - invoice.deposit);
        const isPaid = remaining === 0;
        
        // Extract auth number if it exists
        const { authNumber, workOrderId, ...restInvoice } = invoice as (typeof invoice & { authNumber?: string, workOrderId?: string });
        
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
              authNumber, // Store auth number at invoice level too
              workOrderId, // Store the work order ID if provided
              isPickedUp: false // Initialize as not picked up
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
      
      markAsPickedUp: (id, isInvoice = true) => {
        const pickedUpAt = new Date().toISOString();
        
        if (isInvoice) {
          // Mark invoice as picked up
          set((state) => ({
            invoices: state.invoices.map(invoice => {
              if (invoice.invoiceId === id) {
                return { 
                  ...invoice, 
                  isPickedUp: true,
                  pickedUpAt
                };
              }
              return invoice;
            })
          }));
          
          // Also mark associated work order as picked up if it exists
          const invoice = get().invoices.find(inv => inv.invoiceId === id);
          if (invoice?.workOrderId) {
            set((state) => ({
              workOrders: state.workOrders.map(wo => {
                if (wo.id === invoice.workOrderId) {
                  return {
                    ...wo,
                    isPickedUp: true,
                    pickedUpAt
                  };
                }
                return wo;
              })
            }));
          }
        } else {
          // Mark work order as picked up
          set((state) => ({
            workOrders: state.workOrders.map(wo => {
              if (wo.id === id) {
                return {
                  ...wo,
                  isPickedUp: true,
                  pickedUpAt
                };
              }
              return wo;
            })
          }));
          
          // Also mark associated invoice as picked up if it exists
          const relatedInvoice = get().invoices.find(inv => inv.workOrderId === id);
          if (relatedInvoice) {
            set((state) => ({
              invoices: state.invoices.map(invoice => {
                if (invoice.invoiceId === relatedInvoice.invoiceId) {
                  return {
                    ...invoice,
                    isPickedUp: true,
                    pickedUpAt
                  };
                }
                return invoice;
              })
            }));
          }
        }
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
        set({ invoices: [], workOrders: [], refunds: [], exchanges: [] });
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
              createdAt,
              isPickedUp: false // Initialize as not picked up
            }
          ]
        }));
        
        return id;
      },
      
      updateInvoice: (updatedInvoice) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) => 
            invoice.invoiceId === updatedInvoice.invoiceId ? updatedInvoice : invoice
          )
        }));
      },
      
      updateWorkOrder: (updatedWorkOrder) => {
        set((state) => ({
          workOrders: state.workOrders.map((workOrder) => 
            workOrder.id === updatedWorkOrder.id ? updatedWorkOrder : workOrder
          )
        }));
      },
      
      // New function to process a refund
      processRefund: (invoiceId, amount, reason, method, authNumber) => {
        const refundId = `RF${Date.now()}`;
        const date = new Date().toISOString();
        
        // Create the refund record
        const newRefund: Refund = {
          refundId,
          invoiceId,
          amount,
          reason,
          date,
          method,
          authNumber
        };
        
        // Update invoice to mark as refunded
        set((state) => {
          // Update the invoice
          const updatedInvoices = state.invoices.map(invoice => {
            if (invoice.invoiceId === invoiceId) {
              return {
                ...invoice,
                isRefunded: true,
                refundId,
                refundedAt: date
              };
            }
            return invoice;
          });
          
          // Also update any related work order
          const relatedWorkOrder = state.workOrders.find(wo => wo.id === state.invoices.find(inv => inv.invoiceId === invoiceId)?.workOrderId);
          let updatedWorkOrders = state.workOrders;
          
          if (relatedWorkOrder) {
            updatedWorkOrders = state.workOrders.map(wo => {
              if (wo.id === relatedWorkOrder.id) {
                return {
                  ...wo,
                  isRefunded: true,
                  refundId,
                  refundedAt: date
                };
              }
              return wo;
            });
          }
          
          // Add the refund to the state
          return {
            invoices: updatedInvoices,
            workOrders: updatedWorkOrders,
            refunds: [...state.refunds, newRefund]
          };
        });
        
        return refundId;
      },
      
      // New function to process an exchange
      processExchange: (originalInvoiceId, newInvoiceId, reason) => {
        const exchangeId = `EX${Date.now()}`;
        const date = new Date().toISOString();
        
        // Create the exchange record
        const newExchange: Exchange = {
          exchangeId,
          originalInvoiceId,
          newInvoiceId,
          reason,
          date
        };
        
        // Update invoices to mark as exchanged
        set((state) => {
          // Update the original invoice
          const updatedInvoices = state.invoices.map(invoice => {
            if (invoice.invoiceId === originalInvoiceId) {
              return {
                ...invoice,
                isExchanged: true,
                exchangeId,
                exchangedAt: date
              };
            }
            return invoice;
          });
          
          // Also update any related work order
          const relatedWorkOrder = state.workOrders.find(wo => wo.id === state.invoices.find(inv => inv.invoiceId === originalInvoiceId)?.workOrderId);
          let updatedWorkOrders = state.workOrders;
          
          if (relatedWorkOrder) {
            updatedWorkOrders = state.workOrders.map(wo => {
              if (wo.id === relatedWorkOrder.id) {
                return {
                  ...wo,
                  isExchanged: true,
                  exchangeId,
                  exchangedAt: date
                };
              }
              return wo;
            });
          }
          
          // Add the exchange to the state
          return {
            invoices: updatedInvoices,
            workOrders: updatedWorkOrders,
            exchanges: [...state.exchanges, newExchange]
          };
        });
        
        return exchangeId;
      },
      
      // Get a specific refund by ID
      getRefundById: (refundId) => {
        return get().refunds.find(refund => refund.refundId === refundId);
      },
      
      // Get a specific exchange by ID
      getExchangeById: (exchangeId) => {
        return get().exchanges.find(exchange => exchange.exchangeId === exchangeId);
      },
      
      // Search for transactions (invoices and work orders) by query
      searchTransactions: (query) => {
        const q = query.toLowerCase();
        
        // Search in invoices
        const invoices = get().invoices.filter(invoice => 
          invoice.invoiceId.toLowerCase().includes(q) ||
          invoice.patientName.toLowerCase().includes(q) ||
          invoice.patientPhone.includes(q)
        );
        
        // Search in work orders
        const workOrders = get().workOrders.filter(wo => {
          const patient = get().invoices.find(inv => inv.workOrderId === wo.id);
          return (
            wo.id.toLowerCase().includes(q) ||
            (patient?.patientName.toLowerCase().includes(q) || false) ||
            (patient?.patientPhone.includes(q) || false)
          );
        });
        
        return { invoices, workOrders };
      }
    }),
    {
      name: 'invoice-store'
    }
  )
);
