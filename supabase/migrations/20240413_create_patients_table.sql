-- Create patients table for storing patient information
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