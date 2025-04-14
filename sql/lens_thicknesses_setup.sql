-- Create lens_thicknesses table
CREATE TABLE public.lens_thicknesses (
  thickness_id text PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  description text,
  category text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Set up table access via RLS (Row Level Security)
ALTER TABLE public.lens_thicknesses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all lens thicknesses
CREATE POLICY "Allow authenticated users to read lens thicknesses" 
  ON public.lens_thicknesses
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert lens thicknesses
CREATE POLICY "Allow authenticated users to insert lens thicknesses" 
  ON public.lens_thicknesses
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update their lens thicknesses
CREATE POLICY "Allow authenticated users to update lens thicknesses" 
  ON public.lens_thicknesses 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete lens thicknesses
CREATE POLICY "Allow authenticated users to delete lens thicknesses" 
  ON public.lens_thicknesses
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Insert some sample lens thicknesses
INSERT INTO public.lens_thicknesses (thickness_id, name, price, description, category)
VALUES
  ('LT1000', 'Standard', 5.00, 'Standard thickness lens', 'distance-reading'),
  ('LT1001', 'Thin', 15.00, 'Thin lens with reduced edge thickness', 'distance-reading'),
  ('LT1002', 'Ultra Thin', 25.00, 'Premium ultra-thin lens for high prescriptions', 'distance-reading'),
  ('LT1003', 'Standard Progressive', 10.00, 'Standard thickness for progressive lenses', 'progressive'),
  ('LT1004', 'Thin Progressive', 30.00, 'Thin lens for progressive prescriptions', 'progressive'),
  ('LT1005', 'Ultra Thin Progressive', 45.00, 'Premium ultra-thin option for high progressive prescriptions', 'progressive'),
  ('LT1006', 'Standard Bifocal', 8.00, 'Standard thickness for bifocal lenses', 'bifocal'),
  ('LT1007', 'Thin Bifocal', 25.00, 'Thin lens for bifocal prescriptions', 'bifocal'); 