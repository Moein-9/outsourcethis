-- Function to properly update invoice payments
CREATE OR REPLACE FUNCTION update_invoice_payment(
  p_invoice_id TEXT,
  p_deposit NUMERIC,
  p_payments JSONB
) RETURNS VOID AS $$
DECLARE
  v_total NUMERIC;
  v_remaining NUMERIC;
  v_is_paid BOOLEAN;
  v_work_order_id TEXT;
BEGIN
  -- Get the total amount for this invoice
  SELECT total, work_order_id 
  INTO v_total, v_work_order_id 
  FROM invoices 
  WHERE invoice_id = p_invoice_id;

  -- Calculate remaining amount
  v_remaining = GREATEST(0, v_total - p_deposit);
  
  -- Determine if the invoice is now paid
  v_is_paid = (v_remaining = 0);
  
  -- Update the invoice
  UPDATE invoices 
  SET 
    deposit = p_deposit,
    remaining = v_remaining,
    payments = p_payments,
    is_paid = v_is_paid,
    updated_at = NOW()
  WHERE invoice_id = p_invoice_id;
  
  -- Update the associated work order if it exists and invoice is paid
  IF v_work_order_id IS NOT NULL AND v_is_paid THEN
    UPDATE work_orders
    SET 
      is_paid = TRUE,
      updated_at = NOW()
    WHERE work_order_id = v_work_order_id;
  END IF;
END;
$$ LANGUAGE plpgsql; 