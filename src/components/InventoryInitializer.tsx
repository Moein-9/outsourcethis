
import { useEffect } from 'react';
import { useInventoryStore } from "@/store/inventoryStore";
import { useReportInitializer } from '@/hooks/useReportInitializer';

export const InventoryInitializer = () => {
  const cleanupSamplePhotochromicCoatings = useInventoryStore(
    (state) => state.cleanupSamplePhotochromicCoatings
  );
  
  // Initialize reporting system
  useReportInitializer();

  useEffect(() => {
    // Clean up any existing sample photochromic coatings on component mount
    cleanupSamplePhotochromicCoatings();
  }, [cleanupSamplePhotochromicCoatings]);

  return null; // This component doesn't render anything
};
