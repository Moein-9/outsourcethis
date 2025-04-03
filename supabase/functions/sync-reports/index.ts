
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

interface Invoice {
  invoiceId: string;
  patientId?: string;
  patientName: string;
  invoiceType?: string;
  total: number;
  deposit: number;
  remaining: number;
  paymentMethod: string;
  createdAt: string;
  isPaid: boolean;
  isRefunded?: boolean;
  refundId?: string;
}

interface Refund {
  refundId: string;
  amount: number;
  method: string;
  date: string;
  reason: string;
  associatedInvoiceId: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get the request body
    const { action, data } = await req.json();

    if (action === "sync_invoice") {
      const invoice = data.invoice as Invoice;
      
      // Format date from ISO string to YYYY-MM-DD
      const invoiceDate = new Date(invoice.createdAt).toISOString().split("T")[0];
      
      const invoiceRecord = {
        invoice_id: invoice.invoiceId,
        patient_id: invoice.patientId || null,
        patient_name: invoice.patientName,
        date: invoiceDate,
        invoice_type: invoice.invoiceType || "glasses",
        total_amount: invoice.total,
        deposit_amount: invoice.deposit,
        remaining_amount: invoice.remaining,
        payment_method: invoice.paymentMethod,
        is_paid: invoice.isPaid,
        is_refunded: invoice.isRefunded || false,
        refund_id: invoice.refundId || null,
        location_id: "main",
      };
      
      // Check if invoice already exists
      const { data: existingInvoice, error: checkError } = await supabase
        .from("invoice_records")
        .select("invoice_id")
        .eq("invoice_id", invoice.invoiceId)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking for existing invoice:", checkError);
        throw new Error(`Failed to check for existing invoice: ${checkError.message}`);
      }
      
      let result;
      
      if (existingInvoice) {
        // Update existing record
        const { data: updatedInvoice, error: updateError } = await supabase
          .from("invoice_records")
          .update(invoiceRecord)
          .eq("invoice_id", invoice.invoiceId)
          .select();
        
        if (updateError) {
          console.error("Error updating invoice record:", updateError);
          throw new Error(`Failed to update invoice: ${updateError.message}`);
        }
        
        result = { message: "Invoice updated successfully", invoice: updatedInvoice };
      } else {
        // Insert new record
        const { data: newInvoice, error: insertError } = await supabase
          .from("invoice_records")
          .insert(invoiceRecord)
          .select();
        
        if (insertError) {
          console.error("Error inserting invoice record:", insertError);
          throw new Error(`Failed to insert invoice: ${insertError.message}`);
        }
        
        result = { message: "Invoice created successfully", invoice: newInvoice };
      }
      
      // Update or create the daily summary
      await updateDailySummary(supabase, invoiceDate);
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (action === "sync_refund") {
      const refund = data.refund as Refund;
      
      // Format date from ISO string to YYYY-MM-DD
      const refundDate = new Date(refund.date).toISOString().split("T")[0];
      
      const refundRecord = {
        refund_id: refund.refundId,
        invoice_id: refund.associatedInvoiceId,
        date: refundDate,
        amount: refund.amount,
        reason: refund.reason || null,
        location_id: "main",
      };
      
      // Check if refund already exists
      const { data: existingRefund, error: checkError } = await supabase
        .from("refund_records")
        .select("refund_id")
        .eq("refund_id", refund.refundId)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking for existing refund:", checkError);
        throw new Error(`Failed to check for existing refund: ${checkError.message}`);
      }
      
      let result;
      
      if (existingRefund) {
        // Update existing record
        const { data: updatedRefund, error: updateError } = await supabase
          .from("refund_records")
          .update(refundRecord)
          .eq("refund_id", refund.refundId)
          .select();
        
        if (updateError) {
          console.error("Error updating refund record:", updateError);
          throw new Error(`Failed to update refund: ${updateError.message}`);
        }
        
        result = { message: "Refund updated successfully", refund: updatedRefund };
      } else {
        // Insert new record
        const { data: newRefund, error: insertError } = await supabase
          .from("refund_records")
          .insert(refundRecord)
          .select();
        
        if (insertError) {
          console.error("Error inserting refund record:", insertError);
          throw new Error(`Failed to insert refund: ${insertError.message}`);
        }
        
        result = { message: "Refund created successfully", refund: newRefund };
      }
      
      // Update or create the daily summary
      await updateDailySummary(supabase, refundDate);
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (action === "bulk_sync") {
      const { invoices, refunds } = data;
      const results = {
        invoices: { success: 0, failed: 0 },
        refunds: { success: 0, failed: 0 },
        summaries: { updated: 0, failed: 0 },
      };
      
      // Process invoices
      if (invoices && invoices.length > 0) {
        for (const invoice of invoices) {
          try {
            // Format date from ISO string to YYYY-MM-DD
            const invoiceDate = new Date(invoice.createdAt).toISOString().split("T")[0];
            
            const invoiceRecord = {
              invoice_id: invoice.invoiceId,
              patient_id: invoice.patientId || null,
              patient_name: invoice.patientName,
              date: invoiceDate,
              invoice_type: invoice.invoiceType || "glasses",
              total_amount: invoice.total,
              deposit_amount: invoice.deposit,
              remaining_amount: invoice.remaining,
              payment_method: invoice.paymentMethod,
              is_paid: invoice.isPaid,
              is_refunded: invoice.isRefunded || false,
              refund_id: invoice.refundId || null,
              location_id: "main",
            };
            
            // Upsert invoice record
            const { error } = await supabase
              .from("invoice_records")
              .upsert(invoiceRecord, { onConflict: "invoice_id" });
            
            if (error) {
              console.error(`Error upserting invoice ${invoice.invoiceId}:`, error);
              results.invoices.failed++;
            } else {
              results.invoices.success++;
              
              // Update daily summary for this invoice date
              try {
                await updateDailySummary(supabase, invoiceDate);
                results.summaries.updated++;
              } catch (err) {
                console.error(`Error updating daily summary for date ${invoiceDate}:`, err);
                results.summaries.failed++;
              }
            }
          } catch (err) {
            console.error(`Error processing invoice ${invoice.invoiceId}:`, err);
            results.invoices.failed++;
          }
        }
      }
      
      // Process refunds
      if (refunds && refunds.length > 0) {
        for (const refund of refunds) {
          try {
            // Format date from ISO string to YYYY-MM-DD
            const refundDate = new Date(refund.date).toISOString().split("T")[0];
            
            const refundRecord = {
              refund_id: refund.refundId,
              invoice_id: refund.associatedInvoiceId,
              date: refundDate,
              amount: refund.amount,
              reason: refund.reason || null,
              location_id: "main",
            };
            
            // Upsert refund record
            const { error } = await supabase
              .from("refund_records")
              .upsert(refundRecord, { onConflict: "refund_id" });
            
            if (error) {
              console.error(`Error upserting refund ${refund.refundId}:`, error);
              results.refunds.failed++;
            } else {
              results.refunds.success++;
              
              // Update daily summary for this refund date
              try {
                await updateDailySummary(supabase, refundDate);
                results.summaries.updated++;
              } catch (err) {
                console.error(`Error updating daily summary for date ${refundDate}:`, err);
                results.summaries.failed++;
              }
            }
          } catch (err) {
            console.error(`Error processing refund ${refund.refundId}:`, err);
            results.refunds.failed++;
          }
        }
      }
      
      return new Response(JSON.stringify({
        message: "Bulk sync completed",
        results
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
  } catch (error) {
    console.error("Error in sync-reports function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Helper function to update daily and monthly summaries
async function updateDailySummary(supabase, date: string) {
  try {
    // Get all invoices for this date
    const { data: invoices, error: invoiceError } = await supabase
      .from("invoice_records")
      .select("*")
      .eq("date", date);
    
    if (invoiceError) {
      console.error("Error fetching invoices for daily summary:", invoiceError);
      throw invoiceError;
    }
    
    // Get all refunds for this date
    const { data: refunds, error: refundError } = await supabase
      .from("refund_records")
      .select("*")
      .eq("date", date);
    
    if (refundError) {
      console.error("Error fetching refunds for daily summary:", refundError);
      throw refundError;
    }
    
    // Calculate summary data
    const total_sales = invoices ? invoices.reduce((sum, inv) => sum + inv.total_amount, 0) : 0;
    const total_refunds = refunds ? refunds.reduce((sum, ref) => sum + ref.amount, 0) : 0;
    const net_sales = total_sales - total_refunds;
    
    const glasses_sales_count = invoices ? invoices.filter(inv => inv.invoice_type === "glasses").length : 0;
    const contacts_sales_count = invoices ? invoices.filter(inv => inv.invoice_type === "contacts").length : 0;
    const exam_sales_count = invoices ? invoices.filter(inv => inv.invoice_type === "exam").length : 0;
    
    // Check if summary already exists for this date
    const { data: existingSummary, error: checkError } = await supabase
      .from("daily_sales_summary")
      .select("id")
      .eq("date", date)
      .eq("location_id", "main")
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking for existing daily summary:", checkError);
      throw checkError;
    }
    
    const summaryData = {
      date,
      total_sales,
      total_refunds,
      net_sales,
      glasses_sales_count,
      contacts_sales_count,
      exam_sales_count,
      location_id: "main",
      updated_at: new Date().toISOString(),
    };
    
    let daily_summary_id: string;
    
    if (existingSummary) {
      // Update existing summary
      const { data: updatedSummary, error: updateError } = await supabase
        .from("daily_sales_summary")
        .update(summaryData)
        .eq("id", existingSummary.id)
        .select("id")
        .single();
      
      if (updateError) {
        console.error("Error updating daily summary:", updateError);
        throw updateError;
      }
      
      daily_summary_id = updatedSummary.id;
      
      // Delete existing payment method summaries
      await supabase
        .from("payment_methods_summary")
        .delete()
        .eq("daily_summary_id", daily_summary_id);
      
      // Delete existing invoice type summaries
      await supabase
        .from("invoice_types_summary")
        .delete()
        .eq("daily_summary_id", daily_summary_id);
    } else {
      // Insert new summary
      const { data: newSummary, error: insertError } = await supabase
        .from("daily_sales_summary")
        .insert(summaryData)
        .select("id")
        .single();
      
      if (insertError) {
        console.error("Error inserting daily summary:", insertError);
        throw insertError;
      }
      
      daily_summary_id = newSummary.id;
    }
    
    // Create payment method summaries
    if (invoices && invoices.length > 0) {
      const paymentMethods = [...new Set(invoices.map(inv => inv.payment_method))];
      for (const method of paymentMethods) {
        const methodInvoices = invoices.filter(inv => inv.payment_method === method);
        const amount = methodInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
        
        const { error } = await supabase
          .from("payment_methods_summary")
          .insert({
            daily_summary_id,
            payment_method: method,
            amount,
            transaction_count: methodInvoices.length,
          });
        
        if (error) {
          console.error(`Error inserting payment method summary for ${method}:`, error);
        }
      }
    }
    
    // Create invoice type summaries
    if (invoices && invoices.length > 0) {
      const invoiceTypes = [...new Set(invoices.map(inv => inv.invoice_type))];
      for (const type of invoiceTypes) {
        const typeInvoices = invoices.filter(inv => inv.invoice_type === type);
        const amount = typeInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
        
        const { error } = await supabase
          .from("invoice_types_summary")
          .insert({
            daily_summary_id,
            invoice_type: type,
            amount,
            count: typeInvoices.length,
          });
        
        if (error) {
          console.error(`Error inserting invoice type summary for ${type}:`, error);
        }
      }
    }
    
    // Update monthly summary
    await updateMonthlySummary(supabase, date);
    
    return { success: true, daily_summary_id };
  } catch (error) {
    console.error("Error in updateDailySummary:", error);
    throw error;
  }
}

async function updateMonthlySummary(supabase, date: string) {
  try {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // JavaScript months are 0-indexed
    
    // Get all daily summaries for this month
    const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.toString().padStart(2, "0")}-${lastDay}`;
    
    const { data: dailySummaries, error: summaryError } = await supabase
      .from("daily_sales_summary")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate)
      .eq("location_id", "main");
    
    if (summaryError) {
      console.error("Error fetching daily summaries for monthly summary:", summaryError);
      throw summaryError;
    }
    
    // Calculate monthly totals
    const total_sales = dailySummaries ? dailySummaries.reduce((sum, day) => sum + day.total_sales, 0) : 0;
    const total_refunds = dailySummaries ? dailySummaries.reduce((sum, day) => sum + day.total_refunds, 0) : 0;
    const net_sales = total_sales - total_refunds;
    
    const glasses_sales_count = dailySummaries ? dailySummaries.reduce((sum, day) => sum + day.glasses_sales_count, 0) : 0;
    const contacts_sales_count = dailySummaries ? dailySummaries.reduce((sum, day) => sum + day.contacts_sales_count, 0) : 0;
    const exam_sales_count = dailySummaries ? dailySummaries.reduce((sum, day) => sum + day.exam_sales_count, 0) : 0;
    
    const monthlySummaryData = {
      year,
      month,
      total_sales,
      total_refunds,
      net_sales,
      glasses_sales_count,
      contacts_sales_count,
      exam_sales_count,
      location_id: "main",
      updated_at: new Date().toISOString(),
    };
    
    // Upsert monthly summary (insert if not exists, update if exists)
    const { error: upsertError } = await supabase
      .from("monthly_sales_summary")
      .upsert(monthlySummaryData, { onConflict: "year,month,location_id" });
    
    if (upsertError) {
      console.error("Error upserting monthly summary:", upsertError);
      throw upsertError;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in updateMonthlySummary:", error);
    throw error;
  }
}
