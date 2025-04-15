import { Database } from './types';

export type Patient = Database['public']['Tables']['patients']['Row'];
export type PatientInsert = Database['public']['Tables']['patients']['Insert'];
export type PatientUpdate = Database['public']['Tables']['patients']['Update'];

export type PatientNote = Database['public']['Tables']['patient_notes']['Row'];
export type PatientNoteInsert = Database['public']['Tables']['patient_notes']['Insert'];
export type PatientNoteUpdate = Database['public']['Tables']['patient_notes']['Update'];

export type GlassesPrescription = Database['public']['Tables']['glasses_prescriptions']['Row'];
export type GlassesPrescriptionInsert = Database['public']['Tables']['glasses_prescriptions']['Insert'];
export type GlassesPrescriptionUpdate = Database['public']['Tables']['glasses_prescriptions']['Update'];

export type ContactLensPrescription = Database['public']['Tables']['contact_lens_prescriptions']['Row'];
export type ContactLensPrescriptionInsert = Database['public']['Tables']['contact_lens_prescriptions']['Insert'];
export type ContactLensPrescriptionUpdate = Database['public']['Tables']['contact_lens_prescriptions']['Update'];

export type Frame = Database['public']['Tables']['frames']['Row'];
export type FrameInsert = Database['public']['Tables']['frames']['Insert'];
export type FrameUpdate = Database['public']['Tables']['frames']['Update'];

export type ContactLens = Database['public']['Tables']['contact_lenses']['Row'];
export type ContactLensInsert = Database['public']['Tables']['contact_lenses']['Insert'];
export type ContactLensUpdate = Database['public']['Tables']['contact_lenses']['Update'];

// Lens-related types
export interface LensType {
  lens_id: string;
  name: string;
  type: string;
  created_at?: string;
}

export interface LensCoating {
  coating_id: string;
  name: string;
  price: number;
  description?: string | null;
  category: string;
  is_photochromic: boolean;
  available_colors?: string[] | null;
  created_at?: string;
}

export interface LensThickness {
  thickness_id: string;
  name: string;
  price: number;
  description?: string | null;
  category: string;
  created_at?: string;
}

export interface LensPricingCombination {
  combination_id: string;
  lens_type_id: string;
  coating_id: string;
  thickness_id: string;
  price: number;
  created_at?: string;
}

// Helper function to convert database date to a JavaScript Date object
export function parseDbDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  return new Date(dateStr);
}

// Helper function to format a date for display
export function formatDisplayDate(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString();
}

// Helper function to convert JavaScript Date to an ISO string for the database
export function formatDbDate(date: Date | null): string | null {
  if (!date) return null;
  return date.toISOString();
}