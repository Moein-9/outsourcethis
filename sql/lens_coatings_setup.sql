-- Create lens_coatings table
CREATE TABLE public.lens_coatings (
  coating_id text PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  description text,
  category text NOT NULL,
  is_photochromic boolean DEFAULT false,
  available_colors text[],
  created_at timestamp with time zone DEFAULT now()
);

-- Set up table access via RLS (Row Level Security)
ALTER TABLE public.lens_coatings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all lens coatings
CREATE POLICY "Allow authenticated users to read lens coatings" 
  ON public.lens_coatings
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert lens coatings
CREATE POLICY "Allow authenticated users to insert lens coatings" 
  ON public.lens_coatings
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update their lens coatings
CREATE POLICY "Allow authenticated users to update lens coatings" 
  ON public.lens_coatings 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete lens coatings
CREATE POLICY "Allow authenticated users to delete lens coatings" 
  ON public.lens_coatings
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Insert some sample lens coatings
INSERT INTO public.lens_coatings (coating_id, name, price, description, category, is_photochromic, available_colors)
VALUES
  ('LC1000', 'Anti-Reflective Basic', 15.00, 'Basic anti-reflective coating reduces glare', 'distance-reading', false, NULL),
  ('LC1001', 'Anti-Reflective Premium', 25.00, 'Premium anti-reflective coating with blue light protection', 'distance-reading', false, NULL),
  ('LC1002', 'UV Protection', 10.00, 'UV protective coating for all lenses', 'distance-reading', false, NULL),
  ('LC1003', 'Transitions Gen 8', 45.00, 'Light-reactive photochromic coating', 'distance-reading', true, ARRAY['Brown', 'Gray', 'Green']),
  ('LC1004', 'Scratch Resistant', 12.00, 'Hardened scratch resistant coating', 'distance-reading', false, NULL),
  ('LC1005', 'Anti-Reflective Premium', 30.00, 'Premium anti-reflective for progressive lenses', 'progressive', false, NULL),
  ('LC1006', 'Transitions XTRActive', 55.00, 'Extra dark photochromic coating for bright conditions', 'progressive', true, ARRAY['Brown', 'Gray']),
  ('LC1007', 'Premium Bifocal Treatment', 20.00, 'Premium coating package for bifocal lenses', 'bifocal', false, NULL),
  ('LC1008', 'Polarized Film', 35.00, 'Polarization for sunglasses', 'sunglasses', false, ARRAY['Brown', 'Gray', 'Green', 'Blue']),
  ('LC1009', 'Mirrored Coating', 30.00, 'Mirrored finish for sunglasses', 'sunglasses', false, ARRAY['Silver', 'Blue', 'Gold', 'Red']); 