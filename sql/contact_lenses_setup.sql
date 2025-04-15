-- Setup for contact_lenses table
-- This script should be run in the Supabase SQL Editor

-- Create the contact lenses table
CREATE TABLE IF NOT EXISTS public.contact_lenses (
  contact_lens_id text PRIMARY KEY,
  brand text NOT NULL,
  type text NOT NULL,
  bc text NOT NULL,
  diameter text NOT NULL,
  power text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  qty integer NOT NULL DEFAULT 0 CHECK (qty >= 0),
  color text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Set up RLS (Row Level Security) policies
ALTER TABLE public.contact_lenses ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service Role Full Access"
ON public.contact_lenses
USING (true)
WITH CHECK (true);

-- Create or replace function to update timestamp
CREATE OR REPLACE FUNCTION public.update_contact_lens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_contact_lens_updated_at_trigger ON public.contact_lenses;
CREATE TRIGGER update_contact_lens_updated_at_trigger
BEFORE UPDATE ON public.contact_lenses
FOR EACH ROW
EXECUTE FUNCTION public.update_contact_lens_updated_at();

-- Add some sample contact lenses data
INSERT INTO public.contact_lenses (contact_lens_id, brand, type, bc, diameter, power, price, qty, color)
VALUES 
  ('CL1001', 'Acuvue', 'Daily', '8.5', '14.2', '-2.00', 25, 30, NULL),
  ('CL1002', 'Acuvue', 'Daily', '8.5', '14.2', '-3.00', 25, 20, NULL),
  ('CL1003', 'Air Optix', 'Monthly', '8.6', '14.1', '-1.50', 30, 15, NULL),
  ('CL1004', 'Air Optix', 'Monthly', '8.6', '14.1', '-2.50', 30, 10, NULL),
  ('CL1005', 'Biofinty', 'Monthly', '8.7', '14.0', '-4.00', 35, 5, NULL),
  ('CL1006', 'Bella', 'Monthly', '8.5', '14.2', '-2.00', 14, 10, 'Contour - Contour Gray | كونتور - كونتور جراي'),
  ('CL1007', 'Bella', 'Monthly', '8.5', '14.2', '-2.00', 14, 10, 'Diamond - Agate Brown | دايموند - أجات براون'),
  ('CL1008', 'Dahab', 'Monthly', '8.4', '14.2', '-2.00', 14, 10, 'Lumirere Blue - لوميرير بلو'),
  ('CL1009', 'Dahab', 'Daily', '8.4', '14.2', '-2.00', 14, 10, 'Daily Mix - ديلي ميكس')
ON CONFLICT (contact_lens_id) DO NOTHING;