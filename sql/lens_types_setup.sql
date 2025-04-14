-- Create lens_types table
CREATE TABLE public.lens_types (
  lens_id text PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Set up table access via RLS (Row Level Security)
ALTER TABLE public.lens_types ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all lens types
CREATE POLICY "Allow authenticated users to read lens types" 
  ON public.lens_types 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert lens types
CREATE POLICY "Allow authenticated users to insert lens types" 
  ON public.lens_types 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update their lens types
CREATE POLICY "Allow authenticated users to update lens types" 
  ON public.lens_types 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete lens types
CREATE POLICY "Allow authenticated users to delete lens types" 
  ON public.lens_types 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Insert some sample lens types
INSERT INTO public.lens_types (lens_id, name, type)
VALUES
  ('LT1000', 'Standard CR-39', 'distance'),
  ('LT1001', 'CR-39 with Anti-Reflective', 'distance'),
  ('LT1002', 'Polycarbonate', 'distance'),
  ('LT1003', 'High-Index 1.67', 'distance'),
  ('LT1004', 'High-Index 1.74', 'distance'),
  ('LT1005', 'Trivex', 'distance'),
  ('LT1006', 'Photochromic (Transitions)', 'distance'),
  ('LT1007', 'Reading CR-39', 'reading'),
  ('LT1008', 'Reading Polycarbonate', 'reading'),
  ('LT1009', 'BlueTech Reading', 'reading'),
  ('LT1010', 'Progressive Standard', 'progressive'),
  ('LT1011', 'Progressive Premium', 'progressive'),
  ('LT1012', 'Progressive Ultra', 'progressive'),
  ('LT1013', 'Varilux X', 'progressive'),
  ('LT1014', 'Bifocal Standard', 'bifocal'),
  ('LT1015', 'Bifocal FT-28', 'bifocal'),
  ('LT1016', 'Bifocal FT-35', 'bifocal'),
  ('LT1017', 'Polarized Sun Lenses', 'sunglasses'),
  ('LT1018', 'Polarized Sun Lenses Gradient', 'sunglasses'),
  ('LT1019', 'Tinted Fashion Sun Lenses', 'sunglasses'); 