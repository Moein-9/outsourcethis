
import { useEffect } from 'react';
import { useInventoryStore } from "@/store/inventoryStore";

export const InventoryInitializer = () => {
  const cleanupSamplePhotochromicCoatings = useInventoryStore(
    (state) => state.cleanupSamplePhotochromicCoatings
  );

  useEffect(() => {
    // Clean up any existing sample photochromic coatings on component mount
    cleanupSamplePhotochromicCoatings();
  }, [cleanupSamplePhotochromicCoatings]);

  return null; // This component doesn't render anything
};
