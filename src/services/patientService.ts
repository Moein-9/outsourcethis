import { supabase } from '@/integrations/supabase/client';
import {
  Patient,
  PatientInsert,
  PatientUpdate,
  PatientNote,
  PatientNoteInsert,
  GlassesPrescription,
  GlassesPrescriptionInsert,
  ContactLensPrescription,
  ContactLensPrescriptionInsert,
  parseDbDate,
  formatDbDate
} from '@/integrations/supabase/schema';

// Interface for patient data including prescriptions
export interface PatientWithPrescriptions {
  patient: Patient;
  notes: PatientNote[];
  glassesPrescriptions: GlassesPrescription[];
  contactLensPrescriptions: ContactLensPrescription[];
}

/**
 * Create a new patient in the database
 */
export async function createPatient(
  patientData: PatientInsert,
  initialNote?: string,
  glassesRx?: Omit<GlassesPrescriptionInsert, 'patient_id'>,
  contactLensRx?: Omit<ContactLensPrescriptionInsert, 'patient_id'>
): Promise<string | null> {
  try {
    console.log('Creating patient with data:', JSON.stringify(patientData));
    
    // Insert patient data without selecting (split the operation)
    const { error: insertError } = await supabase
      .from('patients')
      .insert(patientData);

    if (insertError) {
      console.error('Error creating patient:', insertError);
      return null;
    }
    
    console.log('Patient inserted successfully, now finding the patient ID');
    
    // Always query for the patient after insert
    // This is a more reliable approach than insert-and-select
    const { data: queryResult, error: queryError } = await supabase
      .from('patients')
      .select('id')
      .eq('full_name', patientData.full_name)
      .eq('phone_number', patientData.phone_number)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (queryError) {
      console.error('Error finding patient after insert:', queryError);
      return null;
    }
    
    if (!queryResult || queryResult.length === 0) {
      console.error('Could not find patient after insert. Insert may have failed.');
      return null;
    }
    
    console.log('Found patient after querying:', queryResult);
    // Extract ID from the first item in the array
    const patientId = queryResult[0].id;
    console.log('Using patient ID:', patientId);

    // If there's an initial note, insert it
    if (initialNote && initialNote.trim() !== '' && patientId) {
      console.log('Adding initial note for patient:', patientId);
      const { error: noteError } = await supabase
        .from('patient_notes')
        .insert({
          patient_id: patientId,
          note_text: initialNote
        });

      if (noteError) {
        console.error('Error adding patient note:', noteError);
      }
    }

    // If there's glasses prescription data, insert it
    if (glassesRx && patientId) {
      console.log('Adding glasses prescription for patient:', patientId);
      const { error: glassesError } = await supabase
        .from('glasses_prescriptions')
        .insert({
          ...glassesRx,
          patient_id: patientId
        });

      if (glassesError) {
        console.error('Error adding glasses prescription:', glassesError);
      }
    }

    // If there's contact lens prescription data, insert it
    if (contactLensRx && patientId) {
      console.log('Adding contact lens prescription for patient:', patientId);
      const { error: contactLensError } = await supabase
        .from('contact_lens_prescriptions')
        .insert({
          ...contactLensRx,
          patient_id: patientId
        });

      if (contactLensError) {
        console.error('Error adding contact lens prescription:', contactLensError);
      }
    }

    return patientId || null;
  } catch (error) {
    console.error('Unexpected error creating patient:', error);
    return null;
  }
}

/**
 * Get a patient by ID including all related data
 */
export async function getPatientById(patientId: string): Promise<PatientWithPrescriptions | null> {
  try {
    // Get patient data
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      console.error('Error fetching patient:', patientError);
      return null;
    }

    // Get patient notes
    const { data: notes, error: notesError } = await supabase
      .from('patient_notes')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (notesError) {
      console.error('Error fetching patient notes:', notesError);
      return null;
    }

    // Get glasses prescriptions
    const { data: glassesPrescriptions, error: glassesError } = await supabase
      .from('glasses_prescriptions')
      .select('*')
      .eq('patient_id', patientId)
      .order('prescription_date', { ascending: false });

    if (glassesError) {
      console.error('Error fetching glasses prescriptions:', glassesError);
      return null;
    }

    // Get contact lens prescriptions
    const { data: contactLensPrescriptions, error: contactLensError } = await supabase
      .from('contact_lens_prescriptions')
      .select('*')
      .eq('patient_id', patientId)
      .order('prescription_date', { ascending: false });

    if (contactLensError) {
      console.error('Error fetching contact lens prescriptions:', contactLensError);
      return null;
    }

    return {
      patient,
      notes: notes || [],
      glassesPrescriptions: glassesPrescriptions || [],
      contactLensPrescriptions: contactLensPrescriptions || []
    };
  } catch (error) {
    console.error('Unexpected error fetching patient data:', error);
    return null;
  }
}

/**
 * Search for patients by name or phone number
 */
export async function searchPatients(query: string, limit = 20): Promise<Patient[]> {
  if (!query || query.trim() === '') return [];

  const searchTerm = `%${query.toLowerCase()}%`;

  try {
    // Search patients by name or phone number using ilike for case-insensitive matching
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or(`full_name.ilike.${searchTerm},phone_number.ilike.${searchTerm}`)
      .order('full_name', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error searching patients:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error searching patients:', error);
    return [];
  }
}

/**
 * Add a note to a patient
 */
export async function addPatientNote(patientId: string, noteText: string): Promise<PatientNote | null> {
  try {
    const { data, error } = await supabase
      .from('patient_notes')
      .insert({
        patient_id: patientId,
        note_text: noteText
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error adding patient note:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error adding patient note:', error);
    return null;
  }
}

/**
 * Delete a patient note
 */
export async function deletePatientNote(noteId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('patient_notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      console.error('Error deleting patient note:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting patient note:', error);
    return false;
  }
}

/**
 * Add a glasses prescription to a patient
 */
export async function addGlassesPrescription(
  prescription: GlassesPrescriptionInsert
): Promise<GlassesPrescription | null> {
  try {
    const { data, error } = await supabase
      .from('glasses_prescriptions')
      .insert(prescription)
      .select('*')
      .single();

    if (error) {
      console.error('Error adding glasses prescription:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error adding glasses prescription:', error);
    return null;
  }
}

/**
 * Add a contact lens prescription to a patient
 */
export async function addContactLensPrescription(
  prescription: ContactLensPrescriptionInsert
): Promise<ContactLensPrescription | null> {
  try {
    const { data, error } = await supabase
      .from('contact_lens_prescriptions')
      .insert(prescription)
      .select('*')
      .single();

    if (error) {
      console.error('Error adding contact lens prescription:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error adding contact lens prescription:', error);
    return null;
  }
}