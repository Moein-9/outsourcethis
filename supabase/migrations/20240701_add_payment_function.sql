-- Create a specialized function to add payments to invoices
-- This function will ensure deposits are ADDED to the previous value, not replaced
CREATE OR REPLACE FUNCTION add_payment_to_invoice(
  p_invoice_id TEXT,
  p_payment_amount NUMERIC,
  p_payment_method TEXT,
  p_auth_number TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_invoice RECORD;
  v_current_deposit NUMERIC;
  v_current_total NUMERIC;
  v_new_deposit NUMERIC;
  v_new_remaining NUMERIC;
  v_is_paid BOOLEAN;
  v_current_payments JSONB;
  v_new_payment JSONB;
  v_updated_payments JSONB;
  v_result JSONB;
BEGIN
  -- First, get the current invoice data
  SELECT * INTO v_invoice FROM invoices WHERE invoice_id = p_invoice_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', 'Invoice not found'
    );
  END IF;
  
  -- Extract current values and convert to proper numeric types
  v_current_deposit := COALESCE(v_invoice.deposit, 0);
  v_current_total := COALESCE(v_invoice.total, 0);
  
  -- IMPORTANT: Add the new payment to the current deposit
  v_new_deposit := v_current_deposit + p_payment_amount;
  
  -- Calculate new remaining and paid status
  v_new_remaining := GREATEST(0, v_current_total - v_new_deposit);
  v_is_paid := (v_new_remaining = 0);
  
  -- Create new payment entry
  v_new_payment := jsonb_build_object(
    'amount', p_payment_amount,
    'method', p_payment_method,
    'date', NOW()
  );
  
  -- Add auth number if provided
  IF p_auth_number IS NOT NULL THEN
    v_new_payment := v_new_payment || jsonb_build_object('authNumber', p_auth_number);
  END IF;
  
  -- Get current payments array or create empty array
  v_current_payments := COALESCE(v_invoice.payments, '[]'::jsonb);
  
  -- Add new payment to the array
  v_updated_payments := v_current_payments || jsonb_build_array(v_new_payment);
  
  -- Update the invoice with the new values
  UPDATE invoices SET
    deposit = v_new_deposit,
    remaining = v_new_remaining,
    is_paid = v_is_paid,
    payments = v_updated_payments,
    updated_at = NOW()
  WHERE invoice_id = p_invoice_id;
  
  -- Update work order if needed
  IF v_is_paid AND v_invoice.work_order_id IS NOT NULL THEN
    UPDATE work_orders SET
      is_paid = TRUE,
      updated_at = NOW()
    WHERE work_order_id = v_invoice.work_order_id;
  END IF;
  
  -- Build result object with before and after values for debugging
  v_result := jsonb_build_object(
    'success', TRUE,
    'invoice_id', p_invoice_id,
    'before', jsonb_build_object(
      'deposit', v_current_deposit,
      'total', v_current_total,
      'remaining', v_invoice.remaining,
      'is_paid', v_invoice.is_paid
    ),
    'after', jsonb_build_object(
      'deposit', v_new_deposit,
      'total', v_current_total,
      'remaining', v_new_remaining,
      'is_paid', v_is_paid,
      'payment_added', p_payment_amount
    )
  );
  
  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql; 