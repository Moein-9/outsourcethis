import { supabase } from '@/integrations/supabase/client';

/**
 * Lens Type definition for database operations
 */
export interface LensType {
  lens_id: string;
  name: string;
  type: "distance" | "reading" | "progressive" | "bifocal" | "sunglasses";
  created_at?: string;
}

export type LensTypeInsert = Omit<LensType, 'created_at'>;
export type LensTypeUpdate = Partial<Omit<LensType, 'lens_id' | 'created_at'>>;

// Type assertion helper - this function allows us to cast the Supabase instance 
// to work with tables not yet in the generated types
const createClient = () => {
  // Create a type that extends the existing client with our custom table
  type CustomSupabaseClient = typeof supabase & {
    from(table: 'lens_types'): any;
  };
  
  return supabase as CustomSupabaseClient;
};

/**
 * Fetches all lens types from the database
 */
export async function getAllLensTypes(): Promise<LensType[]> {
  try {
    const client = createClient();
    const { data, error } = await client
      .from('lens_types')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching lens types:', error);
      return [];
    }

    return data as LensType[] || [];
  } catch (error) {
    console.error('Unexpected error fetching lens types:', error);
    return [];
  }
}

/**
 * Add a new lens type to the database
 */
export async function addLensType(lensType: Omit<LensTypeInsert, 'lens_id'>): Promise<string | null> {
  try {
    const lens_id = `LT${Date.now()}`;
    
    const lensTypeData: LensTypeInsert = {
      ...lensType,
      lens_id,
    };
    
    const client = createClient();
    const { error } = await client
      .from('lens_types')
      .insert(lensTypeData);

    if (error) {
      console.error('Error adding lens type:', error);
      return null;
    }

    return lens_id;
  } catch (error) {
    console.error('Unexpected error adding lens type:', error);
    return null;
  }
}

/**
 * Update an existing lens type
 */
export async function updateLensType(lens_id: string, lensTypeData: LensTypeUpdate): Promise<boolean> {
  try {
    const client = createClient();
    const { error } = await client
      .from('lens_types')
      .update(lensTypeData)
      .eq('lens_id', lens_id);

    if (error) {
      console.error('Error updating lens type:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error updating lens type:', error);
    return false;
  }
}

/**
 * Delete a lens type
 */
export async function deleteLensType(lens_id: string): Promise<boolean> {
  try {
    const client = createClient();
    const { error } = await client
      .from('lens_types')
      .delete()
      .eq('lens_id', lens_id);

    if (error) {
      console.error('Error deleting lens type:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting lens type:', error);
    return false;
  }
} 