
// Type definitions for the reporting database schema

export interface DailySalesSummary {
  id: string;
  date: string;
  total_sales: number;
  total_refunds: number;
  net_sales: number;
  glasses_sales_count: number;
  contacts_sales_count: number;
  exam_sales_count: number;
  location_id: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethodSummary {
  id: string;
  daily_summary_id: string;
  payment_method: string;
  amount: number;
  transaction_count: number;
  created_at: string;
}

export interface InvoiceTypeSummary {
  id: string;
  daily_summary_id: string;
  invoice_type: string;
  amount: number;
  count: number;
  created_at: string;
}

export interface MonthlySalesSummary {
  id: string;
  year: number;
  month: number;
  total_sales: number;
  total_refunds: number;
  net_sales: number;
  glasses_sales_count: number;
  contacts_sales_count: number;
  exam_sales_count: number;
  location_id: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceRecord {
  id: string;
  invoice_id: string;
  patient_id: string | null;
  patient_name: string;
  date: string;
  invoice_type: string;
  total_amount: number;
  deposit_amount: number;
  remaining_amount: number;
  payment_method: string;
  is_paid: boolean;
  is_refunded: boolean;
  refund_id: string | null;
  location_id: string;
  created_at: string;
  updated_at: string;
}

export interface RefundRecord {
  id: string;
  refund_id: string;
  invoice_id: string;
  date: string;
  amount: number;
  reason: string | null;
  location_id: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      daily_sales_summary: {
        Row: DailySalesSummary;
        Insert: Omit<DailySalesSummary, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DailySalesSummary, 'id' | 'created_at'>>;
      };
      payment_methods_summary: {
        Row: PaymentMethodSummary;
        Insert: Omit<PaymentMethodSummary, 'id' | 'created_at'>;
        Update: Partial<Omit<PaymentMethodSummary, 'id' | 'created_at'>>;
      };
      invoice_types_summary: {
        Row: InvoiceTypeSummary;
        Insert: Omit<InvoiceTypeSummary, 'id' | 'created_at'>;
        Update: Partial<Omit<InvoiceTypeSummary, 'id' | 'created_at'>>;
      };
      monthly_sales_summary: {
        Row: MonthlySalesSummary;
        Insert: Omit<MonthlySalesSummary, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<MonthlySalesSummary, 'id' | 'created_at'>>;
      };
      invoice_records: {
        Row: InvoiceRecord;
        Insert: Omit<InvoiceRecord, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<InvoiceRecord, 'id' | 'created_at'>>;
      };
      refund_records: {
        Row: RefundRecord;
        Insert: Omit<RefundRecord, 'id' | 'created_at'>;
        Update: Partial<Omit<RefundRecord, 'id' | 'created_at'>>;
      };
    };
  };
}
