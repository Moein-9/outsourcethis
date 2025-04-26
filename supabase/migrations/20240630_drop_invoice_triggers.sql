-- Drop the existing trigger first
DROP TRIGGER IF EXISTS invoice_remaining_trigger ON invoices;

-- Drop the trigger function
DROP FUNCTION IF EXISTS invoice_update_remaining();

-- Add a comment to explain the change
COMMENT ON TABLE invoices IS 'Invoice table with manual calculation of remaining amount and is_paid status. Trigger has been removed to prevent race conditions.'; 