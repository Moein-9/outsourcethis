
import { useEffect } from 'react';
import { useInventoryStore } from "@/store/inventoryStore";
import { loadFramesFromDatabase } from "@/utils/databaseSync";
import { toast } from "sonner";

export const InventoryInitializer = () => {
  const cleanupSamplePhotochromicCoatings = useInventoryStore(
    (state) => state.cleanupSamplePhotochromicCoatings
  );
  
  const syncFramesFromDatabase = useInventoryStore(
    (state) => state.syncFramesFromDatabase
  );

  useEffect(() => {
    // Clean up any existing sample photochromic coatings on component mount
    cleanupSamplePhotochromicCoatings();
    
    // Try loading frames from database
    const loadFrames = async () => {
      try {
        const dbFrames = await loadFramesFromDatabase();
        
        if (dbFrames.length > 0) {
          syncFramesFromDatabase(dbFrames);
          console.log(`Loaded ${dbFrames.length} frames from the database`);
        }
      } catch (error) {
        console.error('Failed to load frames from database:', error);
      }
    };
    
    loadFrames();
  }, [cleanupSamplePhotochromicCoatings, syncFramesFromDatabase]);

  return null; // This component doesn't render anything
};
