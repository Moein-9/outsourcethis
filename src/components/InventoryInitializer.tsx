
import { useEffect } from 'react';
import { useInventoryStore } from "@/store/inventoryStore";
import { toast } from "sonner";

export const InventoryInitializer = () => {
  const cleanupSamplePhotochromicCoatings = useInventoryStore(
    (state) => state.cleanupSamplePhotochromicCoatings
  );
  
  const frames = useInventoryStore(state => state.frames);
  const resetLensPricing = useInventoryStore(state => state.resetLensPricing);

  useEffect(() => {
    // Clean up any existing sample photochromic coatings on component mount
    cleanupSamplePhotochromicCoatings();
    
    // Initialize lens pricing if needed
    const needPricingReset = useInventoryStore.getState().lensPricingCombinations.length === 0;
    if (needPricingReset) {
      resetLensPricing();
    }
    
    // Show welcome message about frame import
    if (frames.length === 0) {
      setTimeout(() => {
        toast.info(
          "Welcome to your optical shop! You can import frames to your inventory using the 'Import Frames' button.", 
          { duration: 6000 }
        );
      }, 2000);
    }
  }, [cleanupSamplePhotochromicCoatings, frames.length, resetLensPricing]);

  return null; // This component doesn't render anything
};
