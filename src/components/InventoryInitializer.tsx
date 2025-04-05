
import { useEffect } from 'react';
import { useInventoryStore } from "@/store/inventoryStore";
import { useInventorySynchronization } from '@/hooks/useInventorySynchronization';
import { toast } from 'sonner';

export const InventoryInitializer = () => {
  const cleanupSamplePhotochromicCoatings = useInventoryStore(
    (state) => state.cleanupSamplePhotochromicCoatings
  );
  
  const { isLoading, error, syncInventory } = useInventorySynchronization();

  useEffect(() => {
    // Clean up any existing sample photochromic coatings on component mount
    cleanupSamplePhotochromicCoatings();
    
    if (error) {
      console.error("Error syncing inventory:", error);
      toast.error("Failed to load inventory data. Using local data instead.");
    }
  }, [cleanupSamplePhotochromicCoatings, error]);

  return null; // This component doesn't render anything
};
