import { supabase } from "@/integrations/supabase/client";
import { format, parse, getMonth, getYear } from "date-fns";
import { Database } from "@/types/reportingTypes";
import { useInvoiceStore } from "@/store/invoiceStore";
import type { Invoice, Refund } from "@/store/invoiceStore";

// Export types using 'export type' syntax
export type DailySalesSummary = {
  id?: string;
  date: string;
  total_sales: number;
  total_refunds: number;
  net_sales: number;
  glasses_sales_count: number;
  contacts_sales_count: number;
  exam_sales_count: number;
  location_id: string;
  created_at?: string;
  updated_at: string;
};

export type PaymentMethodSummary = {
  id?: string;
  daily_summary_id: string;
  payment_method: string;
  amount: number;
  transaction_count: number;
  created_at?: string;
};

export type InvoiceTypeSummary = {
  id?: string;
  daily_summary_id: string;
  invoice_type: string;
  amount: number;
  count: number;
  created_at?: string;
};

export type MonthlySalesSummary = {
  id?: string;
  year: number;
  month: number;
  total_sales: number;
  total_refunds: number;
  net_sales: number;
  glasses_sales_count: number;
  contacts_sales_count: number;
  exam_sales_count: number;
  location_id: string;
  created_at?: string;
  updated_at: string;
};

export type InvoiceRecord = {
  id?: string;
  invoice_id: string;
  patient_id?: string | null;
  patient_name: string;
  date: string;
  invoice_type: string;
  total_amount: number;
  deposit_amount: number;
  remaining_amount: number;
  payment_method: string;
  is_paid: boolean;
  is_refunded: boolean;
  refund_id?: string | null;
  location_id: string;
  created_at?: string;
  updated_at?: string;
};

export type RefundRecord = {
  id?: string;
  refund_id: string;
  invoice_id: string;
  date: string;
  amount: number;
  reason: string | null;
  location_id: string;
  created_at?: string;
};

export class ReportingService {
  static async syncInvoiceToDatabase(invoice: Invoice): Promise<void> {
    const { data: existingInvoice, error: checkError } = await supabase
      .from('invoice_records')
      .select('invoice_id')
      .eq('invoice_id', invoice.invoiceId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking for existing invoice:', checkError);
      return;
    }

    const invoiceDate = new Date(invoice.createdAt).toISOString().split('T')[0];
    
    const invoiceRecord = {
      invoice_id: invoice.invoiceId,
      patient_id: invoice.patientId || null,
      patient_name: invoice.patientName,
      date: invoiceDate,
      invoice_type: invoice.invoiceType || 'glasses',
      total_amount: invoice.total,
      deposit_amount: invoice.deposit,
      remaining_amount: invoice.remaining,
      payment_method: invoice.paymentMethod,
      is_paid: invoice.isPaid,
      is_refunded: invoice.isRefunded || false,
      refund_id: invoice.refundId || null,
      location_id: 'main',
    };

    if (existingInvoice) {
      const { error: updateError } = await supabase
        .from('invoice_records')
        .update(invoiceRecord)
        .eq('invoice_id', invoice.invoiceId);

      if (updateError) {
        console.error('Error updating invoice record:', updateError);
      }
    } else {
      const { error: insertError } = await supabase
        .from('invoice_records')
        .insert(invoiceRecord);

      if (insertError) {
        console.error('Error inserting invoice record:', insertError);
      }
    }

    await this.updateDailySummary(invoiceDate);
  }

  static async syncRefundToDatabase(refund: Refund): Promise<void> {
    const { data: existingRefund, error: checkError } = await supabase
      .from('refund_records')
      .select('refund_id')
      .eq('refund_id', refund.refundId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking for existing refund:', checkError);
      return;
    }

    const refundDate = new Date(refund.date).toISOString().split('T')[0];
    
    const refundRecord = {
      refund_id: refund.refundId,
      invoice_id: refund.associatedInvoiceId,
      date: refundDate,
      amount: refund.amount,
      reason: refund.reason || null,
      location_id: 'main',
    };

    if (existingRefund) {
      const { error: updateError } = await supabase
        .from('refund_records')
        .update(refundRecord)
        .eq('refund_id', refund.refundId);

      if (updateError) {
        console.error('Error updating refund record:', updateError);
      }
    } else {
      const { error: insertError } = await supabase
        .from('refund_records')
        .insert(refundRecord);

      if (insertError) {
        console.error('Error inserting refund record:', insertError);
      }
    }

    await this.updateDailySummary(refundDate);
  }

  static async updateDailySummary(date: string): Promise<void> {
    const { data: invoices, error: invoiceError } = await supabase
      .from('invoice_records')
      .select('*')
      .eq('date', date);

    if (invoiceError) {
      console.error('Error fetching invoices for daily summary:', invoiceError);
      return;
    }

    const { data: refunds, error: refundError } = await supabase
      .from('refund_records')
      .select('*')
      .eq('date', date);

    if (refundError) {
      console.error('Error fetching refunds for daily summary:', refundError);
      return;
    }

    const total_sales = invoices ? invoices.reduce((sum, inv) => sum + inv.total_amount, 0) : 0;
    const total_refunds = refunds ? refunds.reduce((sum, ref) => sum + ref.amount, 0) : 0;
    const net_sales = total_sales - total_refunds;
    
    const glasses_sales_count = invoices ? invoices.filter(inv => inv.invoice_type === 'glasses').length : 0;
    const contacts_sales_count = invoices ? invoices.filter(inv => inv.invoice_type === 'contacts').length : 0;
    const exam_sales_count = invoices ? invoices.filter(inv => inv.invoice_type === 'exam').length : 0;

    const { data: existingSummary, error: checkError } = await supabase
      .from('daily_sales_summary')
      .select('id')
      .eq('date', date)
      .eq('location_id', 'main')
      .maybeSingle();

    if (checkError) {
      console.error('Error checking for existing daily summary:', checkError);
      return;
    }

    const summaryData = {
      date,
      total_sales,
      total_refunds,
      net_sales,
      glasses_sales_count,
      contacts_sales_count,
      exam_sales_count,
      location_id: 'main',
      updated_at: new Date().toISOString()
    };

    let daily_summary_id: string;

    if (existingSummary) {
      const { data: updatedSummary, error: updateError } = await supabase
        .from('daily_sales_summary')
        .update(summaryData)
        .eq('id', existingSummary.id)
        .select('id')
        .single();

      if (updateError) {
        console.error('Error updating daily summary:', updateError);
        return;
      }
      
      daily_summary_id = updatedSummary?.id || '';
      if (!daily_summary_id) {
        console.error('Failed to get daily summary ID after update');
        return;
      }

      await supabase
        .from('payment_methods_summary')
        .delete()
        .eq('daily_summary_id', daily_summary_id);

      await supabase
        .from('invoice_types_summary')
        .delete()
        .eq('daily_summary_id', daily_summary_id);
    } else {
      const { data: newSummary, error: insertError } = await supabase
        .from('daily_sales_summary')
        .insert(summaryData)
        .select('id')
        .single();

      if (insertError) {
        console.error('Error inserting daily summary:', insertError);
        return;
      }
      
      daily_summary_id = newSummary?.id || '';
      if (!daily_summary_id) {
        console.error('Failed to get daily summary ID after insert');
        return;
      }
    }

    if (invoices && invoices.length > 0) {
      const paymentMethods = [...new Set(invoices.map(inv => inv.payment_method))];
      for (const method of paymentMethods) {
        const methodInvoices = invoices.filter(inv => inv.payment_method === method);
        const amount = methodInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
        
        const { error } = await supabase
          .from('payment_methods_summary')
          .insert({
            daily_summary_id,
            payment_method: method,
            amount,
            transaction_count: methodInvoices.length
          });
        
        if (error) {
          console.error(`Error inserting payment method summary for ${method}:`, error);
        }
      }
    }

    if (invoices && invoices.length > 0) {
      const invoiceTypes = [...new Set(invoices.map(inv => inv.invoice_type))];
      for (const type of invoiceTypes) {
        const typeInvoices = invoices.filter(inv => inv.invoice_type === type);
        const amount = typeInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
        
        const { error } = await supabase
          .from('invoice_types_summary')
          .insert({
            daily_summary_id,
            invoice_type: type,
            amount,
            count: typeInvoices.length
          });
        
        if (error) {
          console.error(`Error inserting invoice type summary for ${type}:`, error);
        }
      }
    }

    await this.updateMonthlySummary(date);
  }

  static async updateMonthlySummary(date: string): Promise<void> {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
    
    const { data: dailySummaries, error: summaryError } = await supabase
      .from('daily_sales_summary')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('location_id', 'main');

    if (summaryError) {
      console.error('Error fetching daily summaries for monthly summary:', summaryError);
      return;
    }

    if (!dailySummaries) {
      console.error('No daily summaries found');
      return;
    }

    const total_sales = dailySummaries.reduce((sum, day) => sum + day.total_sales, 0);
    const total_refunds = dailySummaries.reduce((sum, day) => sum + day.total_refunds, 0);
    const net_sales = total_sales - total_refunds;
    
    const glasses_sales_count = dailySummaries.reduce((sum, day) => sum + day.glasses_sales_count, 0);
    const contacts_sales_count = dailySummaries.reduce((sum, day) => sum + day.contacts_sales_count, 0);
    const exam_sales_count = dailySummaries.reduce((sum, day) => sum + day.exam_sales_count, 0);

    const monthlySummaryData = {
      year,
      month,
      total_sales,
      total_refunds,
      net_sales,
      glasses_sales_count,
      contacts_sales_count,
      exam_sales_count,
      location_id: 'main',
      updated_at: new Date().toISOString()
    };

    const { error: upsertError } = await supabase
      .from('monthly_sales_summary')
      .upsert(monthlySummaryData, { onConflict: 'year,month,location_id' });

    if (upsertError) {
      console.error('Error upserting monthly summary:', upsertError);
    }
  }

  static async getDailySummary(date: string): Promise<DailySalesSummary | null> {
    const { data, error } = await supabase
      .from('daily_sales_summary')
      .select('*')
      .eq('date', date)
      .eq('location_id', 'main')
      .maybeSingle();

    if (error) {
      console.error('Error fetching daily summary:', error);
      return null;
    }

    return data;
  }

  static async getDailySummaryWithDetails(date: string): Promise<{
    summary: DailySalesSummary | null;
    paymentMethods: PaymentMethodSummary[];
    invoiceTypes: InvoiceTypeSummary[];
  }> {
    const { data: summary, error: summaryError } = await supabase
      .from('daily_sales_summary')
      .select('*')
      .eq('date', date)
      .eq('location_id', 'main')
      .maybeSingle();

    if (summaryError) {
      console.error('Error fetching daily summary:', summaryError);
      return { summary: null, paymentMethods: [], invoiceTypes: [] };
    }

    if (!summary) {
      return { summary: null, paymentMethods: [], invoiceTypes: [] };
    }

    const { data: paymentMethods, error: paymentError } = await supabase
      .from('payment_methods_summary')
      .select('*')
      .eq('daily_summary_id', summary.id);

    if (paymentError) {
      console.error('Error fetching payment methods summary:', paymentError);
      return { summary, paymentMethods: [], invoiceTypes: [] };
    }

    const { data: invoiceTypes, error: typeError } = await supabase
      .from('invoice_types_summary')
      .select('*')
      .eq('daily_summary_id', summary.id);

    if (typeError) {
      console.error('Error fetching invoice types summary:', typeError);
      return { summary, paymentMethods: paymentMethods || [], invoiceTypes: [] };
    }

    return { 
      summary, 
      paymentMethods: paymentMethods || [], 
      invoiceTypes: invoiceTypes || [] 
    };
  }

  static async getDailyInvoices(date: string): Promise<InvoiceRecord[]> {
    const { data, error } = await supabase
      .from('invoice_records')
      .select('*')
      .eq('date', date)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching daily invoices:', error);
      return [];
    }

    return data || [];
  }

  static async getDailyRefunds(date: string): Promise<RefundRecord[]> {
    const { data, error } = await supabase
      .from('refund_records')
      .select('*')
      .eq('date', date)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching daily refunds:', error);
      return [];
    }

    return data || [];
  }

  static async getComparativeData(startDate: string, endDate: string): Promise<DailySalesSummary[]> {
    const { data, error } = await supabase
      .from('daily_sales_summary')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('location_id', 'main')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching comparative data:', error);
      return [];
    }

    return data || [];
  }

  static async syncAllInvoicesAndRefunds(invoices: Invoice[], refunds: Refund[]): Promise<void> {
    try {
      const response = await fetch(`${window.location.origin}/api/sync-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'bulk_sync',
          data: {
            invoices,
            refunds
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Bulk sync failed:', errorData);
        throw new Error(`Bulk sync failed: ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Bulk sync result:', result);
    } catch (error) {
      console.error('Error during bulk sync:', error);
      throw error;
    }
  }
}
