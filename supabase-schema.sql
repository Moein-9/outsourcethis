CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  date_of_birth DATE,
  skip_dob BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create patient_notes table for storing multiple notes per patient
CREATE TABLE IF NOT EXISTS public.patient_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create glasses_prescriptions table
CREATE TABLE IF NOT EXISTS public.glasses_prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  prescription_date DATE NOT NULL,
  
  -- Right Eye (OD) measurements
  od_sph TEXT,
  od_cyl TEXT,
  od_axis TEXT,
  od_add TEXT,
  od_pd TEXT,
  
  -- Left Eye (OS) measurements
  os_sph TEXT,
  os_cyl TEXT,
  os_axis TEXT,
  os_add TEXT,
  os_pd TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create contact_lens_prescriptions table
CREATE TABLE IF NOT EXISTS public.contact_lens_prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  prescription_date DATE NOT NULL,
  
  -- Right Eye (OD) measurements
  od_sphere TEXT,
  od_cylinder TEXT,
  od_axis TEXT,
  od_base_curve TEXT,
  od_diameter TEXT,
  
  -- Left Eye (OS) measurements
  os_sphere TEXT,
  os_cylinder TEXT,
  os_axis TEXT,
  os_base_curve TEXT,
  os_diameter TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.frames (
      frameId text PRIMARY KEY,
      brand text NOT NULL,
      model text NOT NULL,
      color text NOT NULL,
      size text NOT NULL,
      price numeric NOT NULL,
      qty integer NOT NULL,
      createdAt timestamp with time zone DEFAULT now()
    );

CREATE TABLE public.lens_types (
  lens_id text PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

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

CREATE TABLE public.lens_thicknesses (
  thickness_id text PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  description text,
  category text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Lens Pricing Combinations Setup

-- Check if the lens_pricing_combinations table exists, if not create it
CREATE TABLE IF NOT EXISTS lens_pricing_combinations (
  combination_id TEXT PRIMARY KEY,
  lens_type_id TEXT NOT NULL,
  coating_id TEXT NOT NULL,
  thickness_id TEXT NOT NULL,
  price NUMERIC(10, 3) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Add foreign key constraints to ensure data consistency
  CONSTRAINT fk_lens_type
    FOREIGN KEY (lens_type_id)
    REFERENCES lens_types(lens_id)
    ON DELETE CASCADE,
  
  CONSTRAINT fk_coating
    FOREIGN KEY (coating_id)
    REFERENCES lens_coatings(coating_id)
    ON DELETE CASCADE,
  
  CONSTRAINT fk_thickness
    FOREIGN KEY (thickness_id)
    REFERENCES lens_thicknesses(thickness_id)
    ON DELETE CASCADE,
  
  -- Add a unique constraint to prevent duplicate combinations
  CONSTRAINT unique_lens_combination
    UNIQUE (lens_type_id, coating_id, thickness_id)
);

-- Create an index for faster lookups by combination components
CREATE INDEX IF NOT EXISTS idx_lens_pricing_components ON lens_pricing_combinations (lens_type_id, coating_id, thickness_id);

CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 3) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('exam', 'repair', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

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

-- Create invoices table to store all invoice data
CREATE TABLE IF NOT EXISTS public.invoices (
  id text PRIMARY KEY,
  invoice_id TEXT UNIQUE NOT NULL,
  work_order_id TEXT,
  patient_id UUID REFERENCES public.patients(id),
  patient_name TEXT NOT NULL,
  patient_phone TEXT,
  
  invoice_type TEXT NOT NULL CHECK (invoice_type IN ('glasses', 'contacts', 'exam', 'repair')),
  
  -- Lens related fields
  lens_type TEXT,
  lens_price NUMERIC(10, 3),
  
  coating TEXT,
  coating_price NUMERIC(10, 3),
  coating_color TEXT,
  
  thickness TEXT,
  thickness_price NUMERIC(10, 3),
  
  -- Frame related fields
  frame_brand TEXT,
  frame_model TEXT,
  frame_color TEXT,
  frame_size TEXT,
  frame_price NUMERIC(10, 3),
  
  -- Contact lens items stored as JSON array
  contact_lens_items JSONB,
  contact_lens_rx JSONB,
  
  -- Service information for eye exams and repairs
  service_name TEXT,
  service_id TEXT,
  service_description TEXT,
  service_price NUMERIC(10, 3),
  
  -- Repair specific fields
  repair_type TEXT,
  repair_description TEXT,
  repair_price NUMERIC(10, 3),
  
  -- Payment information
  discount NUMERIC(10, 3) DEFAULT 0,
  deposit NUMERIC(10, 3) DEFAULT 0,
  total NUMERIC(10, 3) NOT NULL,
  remaining NUMERIC(10, 3),
  payments JSONB DEFAULT '[]'::jsonb,
  
  payment_method TEXT NOT NULL,
  auth_number TEXT,
  is_paid BOOLEAN DEFAULT FALSE,
  
  -- Pickup status
  is_picked_up BOOLEAN DEFAULT FALSE,
  picked_up_at TIMESTAMP WITH TIME ZONE,
  
  -- Refund related fields
  is_refunded BOOLEAN DEFAULT FALSE,
  refund_date TIMESTAMP WITH TIME ZONE,
  refund_amount NUMERIC(10, 3),
  refund_reason TEXT,
  refund_method TEXT,
  refund_id TEXT,
  staff_notes TEXT,
  
  -- Archive related fields
  is_archived BOOLEAN DEFAULT FALSE,
  archived_at TIMESTAMP WITH TIME ZONE,
  archive_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create work_orders table to store detailed information about orders
CREATE TABLE IF NOT EXISTS public.work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id TEXT UNIQUE NOT NULL,
  patient_id UUID REFERENCES public.patients(id),
  invoice_id TEXT REFERENCES public.invoices(invoice_id),
  
  -- Common fields
  is_contact_lens BOOLEAN DEFAULT FALSE,
  is_paid BOOLEAN DEFAULT FALSE,
  
  -- Lens type details as JSON
  lens_type JSONB,
  
  -- Contact lens information
  contact_lenses JSONB,
  contact_lens_rx JSONB,
  
  -- Prescription information
  rx JSONB,
  
  -- Additional details
  coating_color TEXT,
  discount NUMERIC(10, 3),
  
  -- Status tracking
  status TEXT DEFAULT 'pending',
  is_complete BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Archive related fields
  is_archived BOOLEAN DEFAULT FALSE,
  archived_at TIMESTAMP WITH TIME ZONE,
  archive_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_invoices_patient_id ON public.invoices(patient_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_patient_id ON public.work_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_id ON public.invoices(invoice_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_work_order_id ON public.work_orders(work_order_id);