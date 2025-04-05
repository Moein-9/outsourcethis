
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/types/supabase";

// Define types for our inventory items based on Supabase tables
export interface FrameItem {
  frameId: string;
  brand: string;
  model: string;
  color: string;
  size: string;
  price: number;
  qty: number;
  createdAt: string;
}

export const FrameService = {
  async fetchFrames() {
    try {
      // Make sure to specify the correct type parameters for the query
      const { data, error } = await supabase
        .from('frames')
        .select('*');
      
      if (error) {
        console.error("Error fetching frames:", error);
        throw error;
      }
      
      // Convert Supabase frames to match the store's frame format
      const convertedFrames = data.map(frame => ({
        frameId: frame.frame_id,
        brand: frame.brand,
        model: frame.model,
        color: frame.color,
        size: frame.size || "",
        price: frame.price,
        qty: frame.qty,
        createdAt: frame.created_at
      }));
      
      return convertedFrames;
    } catch (error) {
      console.error("Error in fetchFrames:", error);
      toast.error("Failed to fetch frames");
      throw error;
    }
  },
  
  async addFrame(frame: { 
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
    qty: number;
  }) {
    try {
      const frameId = `FR${Date.now()}`;
      
      const { error } = await supabase
        .from('frames')
        .insert([{
          frame_id: frameId,
          brand: frame.brand,
          model: frame.model,
          color: frame.color,
          size: frame.size,
          price: frame.price,
          qty: frame.qty,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error("Error adding frame:", error);
        throw error;
      }
      
      return frameId;
    } catch (error) {
      console.error("Error in addFrame:", error);
      toast.error("Failed to add frame");
      throw error;
    }
  },
  
  async updateFrameQuantity(frameId: string, newQty: number) {
    try {
      const { error } = await supabase
        .from('frames')
        .update({ qty: newQty, updated_at: new Date().toISOString() })
        .eq('frame_id', frameId);
      
      if (error) {
        console.error("Error updating frame quantity:", error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Error in updateFrameQuantity:", error);
      toast.error("Failed to update frame quantity");
      throw error;
    }
  },
  
  async bulkImportFrames(frames: Array<{
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
    qty: number;
  }>) {
    try {
      // First fetch existing frames to check for duplicates
      const { data: existingFrames, error: fetchError } = await supabase
        .from('frames')
        .select('brand, model, color, size');
      
      if (fetchError) {
        console.error("Error fetching existing frames:", fetchError);
        throw fetchError;
      }
      
      // Create a map for fast duplicate checking
      const existingCombinations = new Map();
      existingFrames.forEach(frame => {
        const key = `${frame.brand.toLowerCase()}|${frame.model.toLowerCase()}|${frame.color.toLowerCase()}|${frame.size?.toLowerCase() || ""}`;
        existingCombinations.set(key, true);
      });
      
      // Filter out duplicates
      const newFrames = [];
      let duplicateCount = 0;
      
      for (const frame of frames) {
        const key = `${frame.brand.toLowerCase()}|${frame.model.toLowerCase()}|${frame.color.toLowerCase()}|${frame.size?.toLowerCase() || ""}`;
        
        if (existingCombinations.has(key)) {
          duplicateCount++;
          continue;
        }
        
        const frameId = `FR${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        
        newFrames.push({
          frame_id: frameId,
          brand: frame.brand,
          model: frame.model, 
          color: frame.color,
          size: frame.size || "",
          price: frame.price,
          qty: frame.qty,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
        // Add to map to catch duplicates within the import batch too
        existingCombinations.set(key, true);
      }
      
      // Insert new frames in batches to avoid request size limits
      let addedCount = 0;
      if (newFrames.length > 0) {
        const BATCH_SIZE = 100;
        for (let i = 0; i < newFrames.length; i += BATCH_SIZE) {
          const batch = newFrames.slice(i, i + BATCH_SIZE);
          const { error } = await supabase
            .from('frames')
            .insert(batch);
          
          if (error) {
            console.error("Error adding frames batch:", error);
            throw error;
          }
          
          addedCount += batch.length;
        }
      }
      
      return {
        added: addedCount,
        duplicates: duplicateCount
      };
    } catch (error) {
      console.error("Error in bulkImportFrames:", error);
      toast.error("Failed to bulk import frames");
      throw error;
    }
  }
};

export const LensService = {
  async fetchLensTypes() {
    try {
      const { data, error } = await supabase
        .from('lens_types')
        .select('*');
      
      if (error) {
        console.error("Error fetching lens types:", error);
        throw error;
      }
      
      // Convert Supabase lens types to match the store's format
      const convertedLensTypes = data.map(lt => ({
        id: lt.lens_id,
        name: lt.name,
        type: lt.type,
        price: lt.price || undefined
      }));
      
      return convertedLensTypes;
    } catch (error) {
      console.error("Error in fetchLensTypes:", error);
      toast.error("Failed to fetch lens types");
      throw error;
    }
  },
  
  async fetchLensCoatings() {
    try {
      const { data, error } = await supabase
        .from('lens_coatings')
        .select('*');
      
      if (error) {
        console.error("Error fetching lens coatings:", error);
        throw error;
      }
      
      // Convert Supabase lens coatings to match the store's format
      const convertedCoatings = data.map(coating => ({
        id: coating.coating_id,
        name: coating.name,
        price: coating.price,
        description: coating.description,
        category: coating.category,
        isPhotochromic: coating.is_photochromic,
        availableColors: coating.available_colors
      }));
      
      return convertedCoatings;
    } catch (error) {
      console.error("Error in fetchLensCoatings:", error);
      toast.error("Failed to fetch lens coatings");
      throw error;
    }
  },
  
  async fetchLensThicknesses() {
    try {
      const { data, error } = await supabase
        .from('lens_thicknesses')
        .select('*');
      
      if (error) {
        console.error("Error fetching lens thicknesses:", error);
        throw error;
      }
      
      // Convert Supabase lens thicknesses to match the store's format
      const convertedThicknesses = data.map(thickness => ({
        id: thickness.thickness_id,
        name: thickness.name,
        price: thickness.price,
        description: thickness.description,
        category: thickness.category
      }));
      
      return convertedThicknesses;
    } catch (error) {
      console.error("Error in fetchLensThicknesses:", error);
      toast.error("Failed to fetch lens thicknesses");
      throw error;
    }
  },
  
  async fetchLensPricingCombinations() {
    try {
      const { data, error } = await supabase
        .from('lens_pricing_combinations')
        .select('*');
      
      if (error) {
        console.error("Error fetching lens pricing combinations:", error);
        throw error;
      }
      
      // Convert Supabase lens pricing combinations to match the store's format
      const convertedCombinations = data.map(combo => ({
        id: combo.combo_id,
        lensTypeId: combo.lens_type_id,
        coatingId: combo.coating_id,
        thicknessId: combo.thickness_id,
        price: combo.price
      }));
      
      return convertedCombinations;
    } catch (error) {
      console.error("Error in fetchLensPricingCombinations:", error);
      toast.error("Failed to fetch lens pricing combinations");
      throw error;
    }
  }
};

export const ContactLensService = {
  async fetchContactLenses() {
    try {
      const { data, error } = await supabase
        .from('contact_lenses')
        .select('*');
      
      if (error) {
        console.error("Error fetching contact lenses:", error);
        throw error;
      }
      
      // Convert Supabase contact lenses to match the store's format
      const convertedLenses = data.map(lens => ({
        id: lens.lens_id,
        brand: lens.brand,
        type: lens.type,
        bc: lens.bc,
        diameter: lens.diameter,
        power: lens.power,
        price: lens.price,
        qty: lens.qty,
        color: lens.color
      }));
      
      return convertedLenses;
    } catch (error) {
      console.error("Error in fetchContactLenses:", error);
      toast.error("Failed to fetch contact lenses");
      throw error;
    }
  }
};

export const ServiceItemService = {
  async fetchServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*');
      
      if (error) {
        console.error("Error fetching services:", error);
        throw error;
      }
      
      // Convert Supabase services to match the store's format
      const convertedServices = data.map(service => ({
        id: service.service_id,
        name: service.name,
        description: service.description || "",
        price: service.price,
        category: service.category
      }));
      
      return convertedServices;
    } catch (error) {
      console.error("Error in fetchServices:", error);
      toast.error("Failed to fetch services");
      throw error;
    }
  },
  
  async addService(service: {
    name: string;
    description: string;
    price: number;
    category: string;
  }) {
    try {
      const serviceId = `service${Date.now()}`;
      
      const { error } = await supabase
        .from('services')
        .insert([{
          service_id: serviceId,
          name: service.name,
          description: service.description,
          price: service.price,
          category: service.category,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error("Error adding service:", error);
        throw error;
      }
      
      return serviceId;
    } catch (error) {
      console.error("Error in addService:", error);
      toast.error("Failed to add service");
      throw error;
    }
  }
};
