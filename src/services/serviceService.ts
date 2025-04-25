import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service definition for database operations
 */
export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: "exam" | "repair" | "other";
  created_at?: string;
  updated_at?: string;
}

/**
 * Custom client for type safety with the services table
 */
const createClient = () => {
  // Create a type that extends the existing client with our custom table
  type CustomSupabaseClient = typeof supabase & {
    from(table: 'services'): any;
  };
  
  return supabase as CustomSupabaseClient;
};

/**
 * Get all services from the database
 */
export const getAllServices = async (): Promise<Service[]> => {
  const client = createClient();
  
  const { data, error } = await client
    .from('services')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
  
  return data || [];
};

/**
 * Get a service by its ID
 */
export const getServiceById = async (id: string): Promise<Service | null> => {
  const client = createClient();
  
  const { data, error } = await client
    .from('services')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching service with ID ${id}:`, error);
    throw error;
  }
  
  return data;
};

/**
 * Get services by category
 */
export const getServicesByCategory = async (category: Service['category']): Promise<Service[]> => {
  const client = createClient();
  
  const { data, error } = await client
    .from('services')
    .select('*')
    .eq('category', category)
    .order('name');
  
  if (error) {
    console.error(`Error fetching services with category ${category}:`, error);
    throw error;
  }
  
  return data || [];
};

/**
 * Add a new service to the database
 */
export const addService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
  const client = createClient();
  const id = uuidv4();
  
  const { error } = await client
    .from('services')
    .insert({
      id,
      ...service
    });
  
  if (error) {
    console.error('Error adding service:', error);
    throw error;
  }
  
  return id;
};

/**
 * Update an existing service in the database
 */
export const updateService = async (
  id: string, 
  updates: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> => {
  const client = createClient();
  
  const { error } = await client
    .from('services')
    .update(updates)
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating service with ID ${id}:`, error);
    throw error;
  }
  
  return true;
};

/**
 * Delete a service from the database
 */
export const deleteService = async (id: string): Promise<boolean> => {
  const client = createClient();
  
  const { error } = await client
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting service with ID ${id}:`, error);
    throw error;
  }
  
  return true;
}; 