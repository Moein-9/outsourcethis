
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { useInventoryStore } from "@/store/inventoryStore";

export const SamplePhotochromicCoating = () => {
  const { 
    lensCoatings, 
    lensTypes,
    lensThicknesses,
    addLensCoating, 
    addLensPricingCombination,
    deleteLensCoating,
    getLensCoatingsByCategory
  } = useInventoryStore();

  useEffect(() => {
    // Add sample photochromic coating if needed
    const distanceReadingCoatings = getLensCoatingsByCategory("distance-reading");
    
    // Check if we already have a sample photochromic coating
    const hasPhotochromicSample = distanceReadingCoatings.some(
      coating => coating.name === "Sample Photochromic" && coating.isPhotochromic
    );
    
    if (!hasPhotochromicSample) {
      // Create a sample photochromic coating
      const newCoatingId = addLensCoating({
        name: "Sample Photochromic",
        price: 25,
        description: "Sample photochromic coating that changes color in sunlight",
        category: "distance-reading",
        isPhotochromic: true,
        availableColors: ["Brown", "Gray", "Green", "Blue"]
      });
      
      // We need to create combinations with lens types and thicknesses
      // Find a distance lens type
      const distanceLensType = lensTypes.find(lens => lens.type === "distance");
      
      // Find a standard thickness
      const standardThickness = lensThicknesses.find(
        thickness => thickness.category === "distance-reading" && thickness.name.includes("Standard")
      );
      
      if (distanceLensType && standardThickness) {
        // Create the pricing combination
        addLensPricingCombination({
          lensTypeId: distanceLensType.id,
          coatingId: newCoatingId,
          thicknessId: standardThickness.id,
          price: 45 // Custom combined price
        });
        
        toast.success("Sample photochromic coating added successfully!");
      }
    }
  }, []);

  return null; // This component doesn't render anything
};
