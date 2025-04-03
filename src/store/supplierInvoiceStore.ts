
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface SupplierInvoice {
  id: string;
  companyName: string;
  invoiceNumber: string;
  invoiceAmount: number;
  date: string;
  color: string;
}

interface SupplierInvoiceState {
  invoices: SupplierInvoice[];
  companies: {
    name: string;
    color: string;
  }[];
  addInvoice: (invoice: Omit<SupplierInvoice, 'id' | 'color'>) => void;
  updateInvoice: (id: string, invoice: Partial<SupplierInvoice>) => void;
  deleteInvoice: (id: string) => void;
  getCompanyColor: (companyName: string) => string;
}

// Predefined colors for companies
const COMPANY_COLORS = [
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#0EA5E9', // Blue
  '#10B981', // Green
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#6D28D9', // Violet
];

export const useSupplierInvoiceStore = create<SupplierInvoiceState>()(
  persist(
    (set, get) => ({
      invoices: [],
      companies: [],
      
      addInvoice: (invoice) => {
        const { companyName } = invoice;
        const companies = get().companies;
        let color = '';
        
        // Check if company already exists
        const existingCompany = companies.find(c => c.name === companyName);
        
        if (existingCompany) {
          // Use existing color
          color = existingCompany.color;
        } else {
          // Assign new color for new company
          const usedColors = companies.map(c => c.color);
          const availableColors = COMPANY_COLORS.filter(c => !usedColors.includes(c));
          
          // Use a new color or cycle back if all are used
          color = availableColors.length > 0
            ? availableColors[0]
            : COMPANY_COLORS[companies.length % COMPANY_COLORS.length];
            
          // Add new company
          set(state => ({
            companies: [...state.companies, { name: companyName, color }]
          }));
        }
        
        // Add invoice with generated ID and color
        set(state => ({
          invoices: [...state.invoices, { 
            ...invoice, 
            id: uuidv4(),
            color,
            date: invoice.date || new Date().toISOString().split('T')[0]
          }]
        }));
      },
      
      updateInvoice: (id, updatedInvoice) => {
        set(state => ({
          invoices: state.invoices.map(invoice => 
            invoice.id === id ? { ...invoice, ...updatedInvoice } : invoice
          )
        }));
      },
      
      deleteInvoice: (id) => {
        set(state => ({
          invoices: state.invoices.filter(invoice => invoice.id !== id)
        }));
      },
      
      getCompanyColor: (companyName) => {
        const company = get().companies.find(c => c.name === companyName);
        return company?.color || COMPANY_COLORS[0];
      }
    }),
    {
      name: 'supplier-invoice-storage',
    }
  )
);
