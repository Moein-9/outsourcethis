import { supabase } from '@/integrations/supabase/client';
import { LensType, LensCoating, LensThickness, LensPricingCombination } from '@/store/inventoryStore';

/**
 * Fetches all lens types from the database
 */
export const getAllLensTypes = async (): Promise<LensType[]> => {
  try {
    // @ts-ignore - Tables exist at runtime but not in TypeScript definitions
    const { data, error } = await supabase
      .from('lens_types')
      .select('*');
    
    if (error) throw error;
    
    return data.map((item: any) => ({
      id: item.lens_id,
      name: item.name,
      type: item.type as LensType['type'],
      price: item.price || undefined
    }));
  } catch (error) {
    console.error('Error fetching lens types:', error);
    return [];
  }
};

/**
 * Fetches all lens coatings from the database
 */
export const getAllLensCoatings = async (): Promise<LensCoating[]> => {
  try {
    // @ts-ignore - Tables exist at runtime but not in TypeScript definitions
    const { data, error } = await supabase
      .from('lens_coatings')
      .select('*');
    
    if (error) throw error;
    
    return data.map((item: any) => ({
      id: item.coating_id,
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category as LensCoating['category'],
      isPhotochromic: item.is_photochromic,
      availableColors: item.available_colors
    }));
  } catch (error) {
    console.error('Error fetching lens coatings:', error);
    return [];
  }
};

/**
 * Fetches lens coatings by category
 */
export const getLensCoatingsByCategory = async (category: LensCoating['category']): Promise<LensCoating[]> => {
  try {
    // @ts-ignore - Tables exist at runtime but not in TypeScript definitions
    const { data, error } = await supabase
      .from('lens_coatings')
      .select('*')
      .eq('category', category);
    
    if (error) throw error;
    
    return data.map((item: any) => ({
      id: item.coating_id,
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category as LensCoating['category'],
      isPhotochromic: item.is_photochromic,
      availableColors: item.available_colors
    }));
  } catch (error) {
    console.error(`Error fetching lens coatings for category ${category}:`, error);
    return [];
  }
};

/**
 * Fetches all lens thicknesses from the database
 */
export const getAllLensThicknesses = async (): Promise<LensThickness[]> => {
  try {
    // @ts-ignore - Tables exist at runtime but not in TypeScript definitions
    const { data, error } = await supabase
      .from('lens_thicknesses')
      .select('*');
    
    if (error) throw error;
    
    return data.map((item: any) => ({
      id: item.thickness_id,
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category as LensThickness['category']
    }));
  } catch (error) {
    console.error('Error fetching lens thicknesses:', error);
    return [];
  }
};

/**
 * Fetches lens thicknesses by category
 */
export const getLensThicknessesByCategory = async (category: LensThickness['category']): Promise<LensThickness[]> => {
  try {
    // @ts-ignore - Tables exist at runtime but not in TypeScript definitions
    const { data, error } = await supabase
      .from('lens_thicknesses')
      .select('*')
      .eq('category', category);
    
    if (error) throw error;
    
    return data.map((item: any) => ({
      id: item.thickness_id,
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category as LensThickness['category']
    }));
  } catch (error) {
    console.error(`Error fetching lens thicknesses for category ${category}:`, error);
    return [];
  }
};

/**
 * Fetches all lens pricing combinations from the database
 */
export const getAllLensPricingCombinations = async (): Promise<LensPricingCombination[]> => {
  try {
    // @ts-ignore - Tables exist at runtime but not in TypeScript definitions
    const { data, error } = await supabase
      .from('lens_pricing_combinations')
      .select('*');
    
    if (error) throw error;
    
    return data.map((item: any) => ({
      id: item.combination_id,
      lensTypeId: item.lens_type_id,
      coatingId: item.coating_id,
      thicknessId: item.thickness_id,
      price: item.price
    }));
  } catch (error) {
    console.error('Error fetching lens pricing combinations:', error);
    return [];
  }
};

/**
 * Fetches lens pricing combinations with detailed information
 */
export const getLensPricingCombinationsWithDetails = async () => {
  try {
    // @ts-ignore - Tables exist at runtime but not in TypeScript definitions
    const { data, error } = await supabase
      .from('lens_pricing_combinations')
      .select(`
        combination_id,
        lens_type_id,
        coating_id,
        thickness_id,
        price,
        lens_types(lens_id, name, type),
        lens_coatings(coating_id, name, price, description, category, is_photochromic, available_colors),
        lens_thicknesses(thickness_id, name, price, description, category)
      `);
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching lens pricing combinations with details:', error);
    return [];
  }
};

/**
 * Gets the price for a specific lens combination
 */
export const getLensPriceByComponents = async (
  lensTypeId: string, 
  coatingId: string, 
  thicknessId: string
): Promise<number | null> => {
  try {
    // @ts-ignore - Tables exist at runtime but not in TypeScript definitions
    const { data, error } = await supabase
      .from('lens_pricing_combinations')
      .select('price')
      .eq('lens_type_id', lensTypeId)
      .eq('coating_id', coatingId)
      .eq('thickness_id', thicknessId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw error;
    }
    
    return data ? data.price : null;
  } catch (error) {
    console.error('Error fetching lens price:', error);
    return null;
  }
}; 