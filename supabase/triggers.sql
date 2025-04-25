-- This trigger automatically updates the 'remaining' and 'is_paid' columns
-- whenever the deposit is updated on an invoice

CREATE OR REPLACE FUNCTION invoice_update_remaining()
RETURNS TRIGGER AS $$
BEGIN
  -- Only calculate if deposit changed to avoid infinite recursion
  IF OLD.deposit IS DISTINCT FROM NEW.deposit THEN
    -- Calculate remaining amount
    NEW.remaining = GREATEST(0, NEW.total - NEW.deposit);
    
    -- Set is_paid flag
    NEW.is_paid = (NEW.remaining = 0);
    
    -- Update work_order status if paid and work_order exists
    IF NEW.is_paid = TRUE AND NEW.work_order_id IS NOT NULL THEN
      UPDATE work_orders 
      SET is_paid = TRUE, updated_at = NOW()
      WHERE work_order_id = NEW.work_order_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS invoice_remaining_trigger ON invoices;

CREATE TRIGGER invoice_remaining_trigger
BEFORE UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION invoice_update_remaining(); 