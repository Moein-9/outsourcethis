import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { ContactLens, ContactLensInsert, ContactLensUpdate } from '@/integrations/supabase/schema';

/**
 * Custom client for type safety with the contact_lenses table
 */
const createClient = () => {
  // Create a type that extends the existing client with our custom table
  type CustomSupabaseClient = typeof supabase & {
    from(table: 'contact_lenses'): any;
  };
  
  return supabase as CustomSupabaseClient;
};

/**
 * Get all contact lenses from the database
 */
export const getAllContactLenses = async (): Promise<ContactLens[]> => {
  const client = createClient();
  
  const { data, error } = await client
    .from('contact_lenses')
    .select('*')
    .order('brand');
  
  if (error) {
    console.error('Error fetching contact lenses:', error);
    throw error;
  }
  
  return data || [];
};

/**
 * Get a contact lens by its ID
 */
export const getContactLensById = async (id: string): Promise<ContactLens | null> => {
  const client = createClient();
  
  const { data, error } = await client
    .from('contact_lenses')
    .select('*')
    .eq('contact_lens_id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching contact lens with ID ${id}:`, error);
    throw error;
  }
  
  return data;
};

/**
 * Get contact lenses by brand
 */
export const getContactLensesByBrand = async (brand: string): Promise<ContactLens[]> => {
  const client = createClient();
  
  const { data, error } = await client
    .from('contact_lenses')
    .select('*')
    .eq('brand', brand)
    .order('type');
  
  if (error) {
    console.error(`Error fetching contact lenses with brand ${brand}:`, error);
    throw error;
  }
  
  return data || [];
};

/**
 * Get contact lenses by type
 */
export const getContactLensesByType = async (type: string): Promise<ContactLens[]> => {
  const client = createClient();
  
  const { data, error } = await client
    .from('contact_lenses')
    .select('*')
    .eq('type', type)
    .order('brand');
  
  if (error) {
    console.error(`Error fetching contact lenses with type ${type}:`, error);
    throw error;
  }
  
  return data || [];
};

/**
 * Search contact lenses by various fields
 */
export const searchContactLenses = async (searchTerm: string): Promise<ContactLens[]> => {
  const client = createClient();
  
  // Convert search term to lowercase for case-insensitive search
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  const { data, error } = await client
    .from('contact_lenses')
    .select('*')
    .or(`brand.ilike.%${lowerSearchTerm}%,type.ilike.%${lowerSearchTerm}%,bc.ilike.%${lowerSearchTerm}%,diameter.ilike.%${lowerSearchTerm}%,power.ilike.%${lowerSearchTerm}%,color.ilike.%${lowerSearchTerm}%`)
    .order('brand');
  
  if (error) {
    console.error('Error searching contact lenses:', error);
    throw error;
  }
  
  return data || [];
};

/**
 * Add a new contact lens to the database
 */
export const addContactLens = async (
  contactLens: Omit<ContactLensInsert, 'contact_lens_id' | 'created_at' | 'updated_at'>
): Promise<string> => {
  const client = createClient();
  const contact_lens_id = uuidv4();
  
  const { error } = await client
    .from('contact_lenses')
    .insert({
      contact_lens_id,
      ...contactLens
    });
  
  if (error) {
    console.error('Error adding contact lens:', error);
    throw error;
  }
  
  return contact_lens_id;
};

/**
 * Update an existing contact lens in the database
 */
export const updateContactLens = async (
  id: string, 
  updates: Partial<Omit<ContactLensUpdate, 'contact_lens_id' | 'created_at' | 'updated_at'>>
): Promise<boolean> => {
  const client = createClient();
  
  const { error } = await client
    .from('contact_lenses')
    .update(updates)
    .eq('contact_lens_id', id);
  
  if (error) {
    console.error(`Error updating contact lens with ID ${id}:`, error);
    throw error;
  }
  
  return true;
};

/**
 * Delete a contact lens from the database
 */
export const deleteContactLens = async (id: string): Promise<boolean> => {
  const client = createClient();
  
  const { error } = await client
    .from('contact_lenses')
    .delete()
    .eq('contact_lens_id', id);
  
  if (error) {
    console.error(`Error deleting contact lens with ID ${id}:`, error);
    throw error;
  }
  
  return true;
};

/**
 * Bulk import multiple contact lenses
 * Returns the number of successfully imported items
 */
export const bulkImportContactLenses = async (
  contactLenses: Omit<ContactLensInsert, 'contact_lens_id' | 'created_at' | 'updated_at'>[]
): Promise<number> => {
  const client = createClient();
  let successCount = 0;
  
  // Process in batches to avoid hitting limits
  const batchSize = 50;
  for (let i = 0; i < contactLenses.length; i += batchSize) {
    const batch = contactLenses.slice(i, i + batchSize).map(lens => ({
      contact_lens_id: uuidv4(),
      ...lens
    }));
    
    const { error, count } = await client
      .from('contact_lenses')
      .insert(batch);
    
    if (error) {
      console.error(`Error importing batch of contact lenses:`, error);
    } else {
      successCount += count || batch.length;
    }
  }
  
  return successCount;
}; 