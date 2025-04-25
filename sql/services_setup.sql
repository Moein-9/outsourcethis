-- Set up services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 3) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('exam', 'repair', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Allow public access 
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create Row Level Security policies
CREATE POLICY "Allow full access to all users" 
  ON public.services 
  FOR ALL 
  TO authenticated 
  USING (true);

-- Add trigger for updating the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_services_timestamp
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Insert sample service data
INSERT INTO public.services (name, description, price, category)
VALUES 
  ('Eye Exam', 'Standard eye examination service to evaluate eye health and vision.', 3.000, 'exam'),
  ('Frame Adjustment', 'Adjust frames for proper fit and comfort.', 1.000, 'repair'),
  ('Lens Cleaning', 'Professional cleaning of lenses.', 0.500, 'other')
ON CONFLICT (id) DO NOTHING;

-- Create an RPC function for validating services
CREATE OR REPLACE FUNCTION validate_service(
  p_name TEXT,
  p_price NUMERIC,
  p_category TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if name is empty
  IF p_name IS NULL OR trim(p_name) = '' THEN
    RAISE EXCEPTION 'Service name cannot be empty';
  END IF;
  
  -- Check if price is negative
  IF p_price < 0 THEN
    RAISE EXCEPTION 'Price cannot be negative';
  END IF;
  
  -- Check if category is valid
  IF p_category NOT IN ('exam', 'repair', 'other') THEN
    RAISE EXCEPTION 'Invalid category. Must be exam, repair, or other';
  END IF;
  
  RETURN TRUE;
END;
$$; 