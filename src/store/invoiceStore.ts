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
  amount: number;
  method: string;
  date: string;
  reason: string;
  staffNotes?: string;
  associatedInvoiceId: string;
}

export interface EditHistory {
  timestamp: string;
  notes: string;
}

export interface Invoice {
  invoiceId: string;
  patientId?: string;
  patientName: string;
  patientPhone: string;
  
  invoiceType?: 'glasses' | 'contacts' | 'exam';
  
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
  
  // Edit tracking
  lastEditedAt?: string;
  editHistory?: EditHistory[];
  
  // Refund related fields
  isRefunded?: boolean;
  refundDate?: string;
  refundAmount?: number;
  refundReason?: string;
  refundMethod?: string;
  refundId?: string;
  
  // Archive related fields
  isArchived?: boolean;
  archivedAt?: string;
  archiveReason?: string;
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
  
  // Edit tracking
  lastEditedAt?: string;
  editHistory?: EditHistory[];
  
  // Refund related fields
  isRefunded?: boolean;
  refundDate?: string;
  
  // Archive related fields
  isArchived?: boolean;
  archivedAt?: string;
  archiveReason?: string;
}

interface InvoiceState {
  invoices: Invoice[];
  workOrders: WorkOrder[];
  refunds: Refund[];
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
  
  // New functions for archiving/deleting orders
  deleteWorkOrder: (workOrderId: string, reason: string) => string | undefined;
  getArchivedWorkOrdersByPatientId: (patientId: string) => WorkOrder[];
  getArchivedInvoicesByPatientId: (patientId: string) => Invoice[];
  
  // New refund related functions
  processRefund: (
    invoiceId: string, 
    refundAmount: number, 
    refundMethod: string, 
    reason: string, 
    staffNotes?: string
  ) => string;
  getRefundById: (refundId: string) => Refund | undefined;
  getRefundsByPatientId: (patientId: string) => Refund[];
  getRefundsByInvoiceId: (invoiceId: string) => Refund | undefined;
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      invoices: [],
      workOrders: [], 
      refunds: [],
      
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
        return get().invoices.filter(invoice => !invoice.isPaid && !invoice.isArchived);
      },
      
      getInvoicesByPatientId: (patientId) => {
        return get().invoices.filter(invoice => 
          invoice.patientId === patientId && !invoice.isArchived
        );
      },
      
      getWorkOrdersByPatientId: (patientId) => {
        return get().workOrders.filter(workOrder => 
          workOrder.patientId === patientId && !workOrder.isArchived
        );
      },
      
      getArchivedWorkOrdersByPatientId: (patientId) => {
        return get().workOrders.filter(workOrder => 
          workOrder.patientId === patientId && workOrder.isArchived
        );
      },
      
      getArchivedInvoicesByPatientId: (patientId) => {
        return get().invoices.filter(invoice => 
          invoice.patientId === patientId && invoice.isArchived
        );
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
              createdAt,
              isPickedUp: false // Initialize as not picked up
            }
          ]
        }));
        
        return id;
      },
      
      updateInvoice: (updatedInvoice) => {
        set((state) => ({
          invoices: state.invoices.map((invoice) => {
            if (invoice.invoiceId === updatedInvoice.invoiceId) {
              // Ensure the edit history is preserved
              const editHistory = updatedInvoice.editHistory || invoice.editHistory || [];
              
              // If lastEditedAt is new, add to edit history if not already tracked
              if (updatedInvoice.lastEditedAt && 
                  (!invoice.lastEditedAt || 
                   new Date(updatedInvoice.lastEditedAt).getTime() !== new Date(invoice.lastEditedAt || '').getTime())) {
                
                // Only add new history entry if it doesn't exist already
                const historyExists = editHistory.some(
                  h => new Date(h.timestamp).getTime() === new Date(updatedInvoice.lastEditedAt || '').getTime()
                );
                
                if (!historyExists) {
                  editHistory.push({
                    timestamp: updatedInvoice.lastEditedAt,
                    notes: "Order updated" 
                  });
                }
              }
              
              return {
                ...updatedInvoice,
                editHistory
              };
            }
            return invoice;
          })
        }));
      },
      
      updateWorkOrder: (updatedWorkOrder) => {
        set((state) => ({
          workOrders: state.workOrders.map((workOrder) => {
            if (workOrder.id === updatedWorkOrder.id) {
              // Ensure the edit history is preserved
              const editHistory = updatedWorkOrder.editHistory || workOrder.editHistory || [];
              
              // If lastEditedAt is new, add to edit history if not already tracked
              if (updatedWorkOrder.lastEditedAt && 
                  (!workOrder.lastEditedAt || 
                   new Date(updatedWorkOrder.lastEditedAt).getTime() !== new Date(workOrder.lastEditedAt || '').getTime())) {
                
                // Only add new history entry if it doesn't exist already
                const historyExists = editHistory.some(
                  h => new Date(h.timestamp).getTime() === new Date(updatedWorkOrder.lastEditedAt || '').getTime()
                );
                
                if (!historyExists) {
                  editHistory.push({
                    timestamp: updatedWorkOrder.lastEditedAt,
                    notes: "Order updated" 
                  });
                }
              }
              
              return {
                ...updatedWorkOrder,
                editHistory
              };
            }
            return workOrder;
          })
        }));
      },
      
      deleteWorkOrder: (workOrderId, reason) => {
        const now = new Date().toISOString();
        const workOrder = get().workOrders.find(wo => wo.id === workOrderId);
        
        if (!workOrder) {
          console.error(`Work order with ID ${workOrderId} not found`);
          return undefined;
        }
        
        // Find any associated invoice
        const relatedInvoice = get().invoices.find(inv => inv.workOrderId === workOrderId);
        
        // Check if there are payments to refund
        if (relatedInvoice && relatedInvoice.deposit > 0) {
          // Process a refund if there was a deposit
          const refundId = get().processRefund(
            relatedInvoice.invoiceId,
            relatedInvoice.deposit,
            relatedInvoice.paymentMethod,
            reason || 'Order deleted',
            'Automatic refund due to order deletion'
          );
          
          // Mark workOrder as archived
          set((state) => ({
            workOrders: state.workOrders.map(wo => {
              if (wo.id === workOrderId) {
                return {
                  ...wo,
                  isArchived: true,
                  archivedAt: now,
                  archiveReason: reason || 'Order deleted'
                };
              }
              return wo;
            })
          }));
          
          // If there's a related invoice, mark it as archived too
          if (relatedInvoice) {
            set((state) => ({
              invoices: state.invoices.map(inv => {
                if (inv.invoiceId === relatedInvoice.invoiceId) {
                  return {
                    ...inv,
                    isArchived: true,
                    archivedAt: now,
                    archiveReason: reason || 'Order deleted',
                    // Clear remaining payments
                    remaining: 0
                  };
                }
                return inv;
              })
            }));
          }
          
          return refundId;
        } else {
          // No deposit to refund, just mark as archived
          set((state) => ({
            workOrders: state.workOrders.map(wo => {
              if (wo.id === workOrderId) {
                return {
                  ...wo,
                  isArchived: true,
                  archivedAt: now,
                  archiveReason: reason || 'Order deleted'
                };
              }
              return wo;
            })
          }));
          
          // If there's a related invoice, mark it as archived too
          if (relatedInvoice) {
            set((state) => ({
              invoices: state.invoices.map(inv => {
                if (inv.invoiceId === relatedInvoice.invoiceId) {
                  return {
                    ...inv,
                    isArchived: true,
                    archivedAt: now,
                    archiveReason: reason || 'Order deleted',
                    // Clear remaining payments
                    remaining: 0
                  };
                }
                return inv;
              })
            }));
          }
          
          return undefined; // No refund was processed
        }
      },
      
      processRefund: (invoiceId, refundAmount, refundMethod, reason, staffNotes) => {
        const invoice = get().invoices.find(inv => inv.invoiceId === invoiceId);
        if (!invoice) {
          throw new Error("Invoice not found");
        }
        
        const refundId = `RF${Date.now()}`;
        const refundDate = new Date().toISOString();
        
        // Create a new refund record
        const newRefund: Refund = {
          refundId,
          amount: refundAmount,
          method: refundMethod,
          date: refundDate,
          reason,
          staffNotes,
          associatedInvoiceId: invoiceId
        };
        
        // Update the invoice with refund information
        const updatedInvoice: Invoice = {
          ...invoice,
          isRefunded: true,
          refundDate,
          refundAmount,
          refundReason: reason,
          refundMethod,
          refundId
        };
        
        // If there's a related work order, update it as well
        const workOrder = invoice.workOrderId ? 
          get().workOrders.find(wo => wo.id === invoice.workOrderId) : undefined;
        
        let updatedWorkOrders = [...get().workOrders];
        if (workOrder) {
          updatedWorkOrders = updatedWorkOrders.map(wo => 
            wo.id === workOrder.id ? 
            { ...wo, isRefunded: true, refundDate } : wo
          );
        }
        
        // Update the store
        set(state => ({
          refunds: [...state.refunds, newRefund],
          invoices: state.invoices.map(inv => 
            inv.invoiceId === invoiceId ? updatedInvoice : inv
          ),
          workOrders: updatedWorkOrders
        }));
        
        return refundId;
      },
      
      getRefundById: (refundId) => {
        return get().refunds.find(refund => refund.refundId === refundId);
      },
      
      getRefundsByPatientId: (patientId) => {
        const patientInvoiceIds = get().invoices
          .filter(invoice => invoice.patientId === patientId)
          .map(invoice => invoice.invoiceId);
        
        return get().refunds.filter(refund => 
          patientInvoiceIds.includes(refund.associatedInvoiceId)
        );
      },
      
      getRefundsByInvoiceId: (invoiceId) => {
        return get().refunds.find(refund => refund.associatedInvoiceId === invoiceId);
      }
    }),
    {
      name: 'invoice-store'
    }
  )
);
