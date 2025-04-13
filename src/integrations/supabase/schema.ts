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