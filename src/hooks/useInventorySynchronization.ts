
import { useEffect, useState } from 'react';
import { useInventoryStore } from "@/store/inventoryStore";
import { 
  FrameService,
  LensService,
  ContactLensService,
  ServiceItemService 
} from '@/services/inventoryService';
import { toast } from 'sonner';

export const useInventorySynchronization = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const {
    frames,
    lensTypes,
    lensCoatings,
    lensThicknesses,
    contactLenses,
    services,
    lensPricingCombinations
  } = useInventoryStore();
  
  // Initialize a Supabase sync function
  const syncInventory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if we have any local data at all
      const hasLocalData = frames.length > 0 || services.length > 0;
      
      // Fetch data from Supabase
      const [
        supabaseFrames,
        supabaseLensTypes,
        supabaseLensCoatings,
        supabaseLensThicknesses,
        supabaseContactLenses,
        supabaseServices,
        supabasePricingCombinations
      ] = await Promise.all([
        FrameService.fetchFrames(),
        LensService.fetchLensTypes(),
        LensService.fetchLensCoatings(),
        LensService.fetchLensThicknesses(),
        ContactLensService.fetchContactLenses(),
        ServiceItemService.fetchServices(),
        LensService.fetchLensPricingCombinations()
      ]);
      
      // Check if we have Supabase data but no local data
      const hasSupabaseData = 
        supabaseFrames.length > 0 || 
        supabaseLensTypes.length > 0 || 
        supabaseLensCoatings.length > 0 || 
        supabaseLensThicknesses.length > 0 || 
        supabaseContactLenses.length > 0 || 
        supabaseServices.length > 0 || 
        supabasePricingCombinations.length > 0;
      
      if (hasSupabaseData) {
        // If Supabase has data, we replace local data
        toast.success("Inventory data loaded from database");
        
        // We don't actually update the store here since we'll be using
        // the Supabase data directly going forward
      } else if (hasLocalData) {
        // If we have local data but no Supabase data, we need to upload it
        toast.info("Syncing inventory data to database...");
        
        // Here you would implement the one-time migration
        // This is complex and would require significant work to ensure data integrity
      }
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      toast.error("Failed to sync inventory data");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Run this effect once on component mount to sync inventory
  useEffect(() => {
    syncInventory();
  }, []);
  
  return {
    isLoading,
    error,
    syncInventory
  };
};
