import { supabase } from '@/integrations/supabase/client';

/**
 * Lens Thickness definition for database operations
 */
export interface LensThickness {
  thickness_id: string;
  name: string;
  price: number;
  description?: string;
  category: "distance-reading" | "progressive" | "bifocal";
  created_at?: string;
}

export type LensThicknessInsert = Omit<LensThickness, 'created_at'>;
export type LensThicknessUpdate = Partial<Omit<LensThickness, 'thickness_id' | 'created_at'>>;

// Type assertion helper - this function allows us to cast the Supabase instance 
// to work with tables not yet in the generated types
const createClient = () => {
  // Create a type that extends the existing client with our custom table
  type CustomSupabaseClient = typeof supabase & {
    from(table: 'lens_thicknesses'): any;
  };
  
  return supabase as CustomSupabaseClient;
};

/**
 * Fetches all lens thicknesses from the database
 */
export async function getAllLensThicknesses(): Promise<LensThickness[]> {
  try {
    const client = createClient();
    const { data, error } = await client
      .from('lens_thicknesses')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching lens thicknesses:', error);
      return [];
    }

    return data as LensThickness[] || [];
  } catch (error) {
    console.error('Unexpected error fetching lens thicknesses:', error);
    return [];
  }
}

/**
 * Add a new lens thickness to the database
 */
export async function addLensThickness(lensThickness: Omit<LensThicknessInsert, 'thickness_id'>): Promise<string | null> {
  try {
    const thickness_id = `LT${Date.now()}`;
    
    const lensThicknessData: LensThicknessInsert = {
      ...lensThickness,
      thickness_id,
    };
    
    const client = createClient();
    const { error } = await client
      .from('lens_thicknesses')
      .insert(lensThicknessData);

    if (error) {
      console.error('Error adding lens thickness:', error);
      return null;
    }

    return thickness_id;
  } catch (error) {
    console.error('Unexpected error adding lens thickness:', error);
    return null;
  }
}

/**
 * Update an existing lens thickness
 */
export async function updateLensThickness(thickness_id: string, lensThicknessData: LensThicknessUpdate): Promise<boolean> {
  try {
    const client = createClient();
    const { error } = await client
      .from('lens_thicknesses')
      .update(lensThicknessData)
      .eq('thickness_id', thickness_id);

    if (error) {
      console.error('Error updating lens thickness:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error updating lens thickness:', error);
    return false;
  }
}

/**
 * Delete a lens thickness
 */
export async function deleteLensThickness(thickness_id: string): Promise<boolean> {
  try {
    const client = createClient();
    const { error } = await client
      .from('lens_thicknesses')
      .delete()
      .eq('thickness_id', thickness_id);

    if (error) {
      console.error('Error deleting lens thickness:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting lens thickness:', error);
    return false;
  }
} 