-- Create function to directly update invoice values from RPC call
CREATE OR REPLACE FUNCTION update_invoice_values(
  p_invoice_id TEXT,
  p_deposit NUMERIC,
  p_remaining NUMERIC,
  p_is_paid BOOLEAN
)
RETURNS BOOLEAN AS $$
DECLARE
  invoice_exists BOOLEAN;
BEGIN
  -- Check if the invoice exists
  SELECT EXISTS(
    SELECT 1 FROM invoices WHERE invoice_id = p_invoice_id
  ) INTO invoice_exists;
  
  IF NOT invoice_exists THEN
    RAISE EXCEPTION 'Invoice with ID % does not exist', p_invoice_id;
  END IF;

  -- Update the invoice with the provided values
  UPDATE invoices
  SET 
    deposit = p_deposit,
    remaining = p_remaining,
    is_paid = p_is_paid,
    updated_at = NOW()
  WHERE invoice_id = p_invoice_id;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error updating invoice %: %', p_invoice_id, SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql; 