import { supabase } from '../integrations/supabase/client';
import { LensType, LensCoating, LensThickness, LensPricingCombination } from '../integrations/supabase/schema';
import { v4 as uuidv4 } from 'uuid';

// Fetch all lens types from Supabase
export async function fetchLensTypes(): Promise<LensType[]> {
  const { data, error } = await supabase
    .from('lens_types')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching lens types:', error);
    throw new Error(`Failed to fetch lens types: ${error.message}`);
  }
  
  return data.map(item => ({
    lens_id: item.lens_id,
    name: item.name,
    type: item.type,
    created_at: item.created_at
  }));
}

// Fetch all lens coatings from Supabase
export async function fetchLensCoatings(): Promise<LensCoating[]> {
  const { data, error } = await supabase
    .from('lens_coatings')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching lens coatings:', error);
    throw new Error(`Failed to fetch lens coatings: ${error.message}`);
  }
  
  return data.map(item => ({
    coating_id: item.coating_id,
    name: item.name,
    price: item.price,
    description: item.description,
    category: item.category,
    is_photochromic: item.is_photochromic,
    available_colors: item.available_colors,
    created_at: item.created_at
  }));
}

// Fetch all lens thicknesses from Supabase
export async function fetchLensThicknesses(): Promise<LensThickness[]> {
  const { data, error } = await supabase
    .from('lens_thicknesses')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching lens thicknesses:', error);
    throw new Error(`Failed to fetch lens thicknesses: ${error.message}`);
  }
  
  return data.map(item => ({
    thickness_id: item.thickness_id,
    name: item.name,
    price: item.price,
    description: item.description,
    category: item.category,
    created_at: item.created_at
  }));
}

// Fetch all lens pricing combinations from Supabase
export async function fetchLensPricingCombinations(): Promise<LensPricingCombination[]> {
  const { data, error } = await supabase
    .from('lens_pricing_combinations')
    .select('*');
  
  if (error) {
    console.error('Error fetching lens pricing combinations:', error);
    throw new Error(`Failed to fetch lens pricing combinations: ${error.message}`);
  }
  
  return data.map(item => ({
    combination_id: item.combination_id,
    lens_type_id: item.lens_type_id,
    coating_id: item.coating_id,
    thickness_id: item.thickness_id,
    price: item.price,
    created_at: item.created_at
  }));
}

// Add a new lens pricing combination to Supabase
export async function addLensPricingCombination(combination: Omit<LensPricingCombination, 'combination_id' | 'created_at'>): Promise<string> {
  const combinationId = `LPC${Date.now()}`;
  
  const { data, error } = await supabase
    .from('lens_pricing_combinations')
    .insert({
      combination_id: combinationId,
      lens_type_id: combination.lens_type_id,
      coating_id: combination.coating_id,
      thickness_id: combination.thickness_id,
      price: combination.price
    })
    .select('combination_id')
    .single();
  
  if (error) {
    console.error('Error adding lens pricing combination:', error);
    throw new Error(`Failed to add lens pricing combination: ${error.message}`);
  }
  
  return data.combination_id;
}

// Update an existing lens pricing combination in Supabase
export async function updateLensPricingCombination(
  combinationId: string,
  updates: Partial<Omit<LensPricingCombination, 'combination_id' | 'created_at'>>
): Promise<void> {
  const { error } = await supabase
    .from('lens_pricing_combinations')
    .update(updates)
    .eq('combination_id', combinationId);
  
  if (error) {
    console.error('Error updating lens pricing combination:', error);
    throw new Error(`Failed to update lens pricing combination: ${error.message}`);
  }
}

// Delete a lens pricing combination from Supabase
export async function deleteLensPricingCombination(combinationId: string): Promise<void> {
  const { error } = await supabase
    .from('lens_pricing_combinations')
    .delete()
    .eq('combination_id', combinationId);
  
  if (error) {
    console.error('Error deleting lens pricing combination:', error);
    throw new Error(`Failed to delete lens pricing combination: ${error.message}`);
  }
}

// Check if a combination already exists
export async function checkCombinationExists(
  lensTypeId: string,
  coatingId: string,
  thicknessId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('lens_pricing_combinations')
    .select('combination_id')
    .eq('lens_type_id', lensTypeId)
    .eq('coating_id', coatingId)
    .eq('thickness_id', thicknessId)
    .maybeSingle();
  
  if (error) {
    console.error('Error checking for existing combination:', error);
    throw new Error(`Failed to check for existing combination: ${error.message}`);
  }
  
  return !!data;
}

// Reset lens pricing combinations to default values
export async function resetLensPricingCombinations(): Promise<void> {
  // First, delete all existing combinations
  const { error: deleteError } = await supabase
    .from('lens_pricing_combinations')
    .delete()
    .neq('combination_id', 'dummy_value'); // This will delete all rows
  
  if (deleteError) {
    console.error('Error resetting lens pricing combinations:', deleteError);
    throw new Error(`Failed to reset lens pricing combinations: ${deleteError.message}`);
  }
  
  // Then, add default combinations back
  // Note: In a real implementation, you would have a predefined set of default combinations
  // For this example, we'll leave it empty as the default values would be application-specific
}