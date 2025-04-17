import { Database } from './types';

// Type aliases for better readability
export type LensType = {
  lens_id: string;
  name: string;
  type: string;
  created_at?: string;
};

export type LensCoating = {
  coating_id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  is_photochromic: boolean;
  available_colors?: string[];
  created_at?: string;
};

export type LensThickness = {
  thickness_id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  created_at?: string;
};

export type LensPricingCombination = {
  combination_id: string;
  lens_type_id: string;
  coating_id: string;
  thickness_id: string;
  price: number;
  created_at?: string;
};

// Extending database tables
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Database types
export type Patient = Tables<'patients'>;
export type PatientNote = Tables<'patient_notes'>;
export type GlassesPrescription = Tables<'glasses_prescriptions'>;
export type ContactLensPrescription = Tables<'contact_lens_prescriptions'>;
export type InvoiceRecord = Tables<'invoice_records'>;
export type RefundRecord = Tables<'refund_records'>;
export type DailySalesSummary = Tables<'daily_sales_summary'>;
export type MonthlySalesSummary = Tables<'monthly_sales_summary'>;
export type PaymentMethodsSummary = Tables<'payment_methods_summary'>;
export type InvoiceTypesSummary = Tables<'invoice_types_summary'>;
export type Service = Tables<'services'>;

export type PatientInsert = Database['public']['Tables']['patients']['Insert'];
export type PatientUpdate = Database['public']['Tables']['patients']['Update'];

export type Frame = Database['public']['Tables']['frames']['Row'];
export type FrameInsert = Database['public']['Tables']['frames']['Insert'];
export type FrameUpdate = Database['public']['Tables']['frames']['Update'];

export type ContactLens = Database['public']['Tables']['contact_lenses']['Row'];
export type ContactLensInsert = Database['public']['Tables']['contact_lenses']['Insert'];
export type ContactLensUpdate = Database['public']['Tables']['contact_lenses']['Update'];

// Helper function to convert database date to a JavaScript Date object
export function parseDbDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  return new Date(dateStr);
}

// Helper function to format a date for display
export function formatDisplayDate(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString();
}

// Helper function to convert JavaScript Date to an ISO string for the database
export function formatDbDate(date: Date | null): string | null {
  if (!date) return null;
  return date.toISOString();
}