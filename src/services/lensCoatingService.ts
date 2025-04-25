import { supabase } from '@/integrations/supabase/client';

/**
 * Lens Coating definition for database operations
 */
export interface LensCoating {
  coating_id: string;
  name: string;
  price: number;
  description?: string;
  category: "distance-reading" | "progressive" | "bifocal" | "sunglasses";
  is_photochromic?: boolean;
  available_colors?: string[];
  created_at?: string;
}

export type LensCoatingInsert = Omit<LensCoating, 'created_at'>;
export type LensCoatingUpdate = Partial<Omit<LensCoating, 'coating_id' | 'created_at'>>;

// Type assertion helper - this function allows us to cast the Supabase instance 
// to work with tables not yet in the generated types
const createClient = () => {
  // Create a type that extends the existing client with our custom table
  type CustomSupabaseClient = typeof supabase & {
    from(table: 'lens_coatings'): any;
  };
  
  return supabase as CustomSupabaseClient;
};

/**
 * Fetches all lens coatings from the database
 */
export async function getAllLensCoatings(): Promise<LensCoating[]> {
  try {
    const client = createClient();
    const { data, error } = await client
      .from('lens_coatings')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching lens coatings:', error);
      return [];
    }

    return data as LensCoating[] || [];
  } catch (error) {
    console.error('Unexpected error fetching lens coatings:', error);
    return [];
  }
}

/**
 * Add a new lens coating to the database
 */
export async function addLensCoating(lensCoating: Omit<LensCoatingInsert, 'coating_id'>): Promise<string | null> {
  try {
    const coating_id = `LC${Date.now()}`;
    
    const lensCoatingData: LensCoatingInsert = {
      ...lensCoating,
      coating_id,
    };
    
    const client = createClient();
    const { error } = await client
      .from('lens_coatings')
      .insert(lensCoatingData);

    if (error) {
      console.error('Error adding lens coating:', error);
      return null;
    }

    return coating_id;
  } catch (error) {
    console.error('Unexpected error adding lens coating:', error);
    return null;
  }
}

/**
 * Update an existing lens coating
 */
export async function updateLensCoating(coating_id: string, lensCoatingData: LensCoatingUpdate): Promise<boolean> {
  try {
    const client = createClient();
    const { error } = await client
      .from('lens_coatings')
      .update(lensCoatingData)
      .eq('coating_id', coating_id);

    if (error) {
      console.error('Error updating lens coating:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error updating lens coating:', error);
    return false;
  }
}

/**
 * Delete a lens coating
 */
export async function deleteLensCoating(coating_id: string): Promise<boolean> {
  try {
    const client = createClient();
    const { error } = await client
      .from('lens_coatings')
      .delete()
      .eq('coating_id', coating_id);

    if (error) {
      console.error('Error deleting lens coating:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting lens coating:', error);
    return false;
  }
} 