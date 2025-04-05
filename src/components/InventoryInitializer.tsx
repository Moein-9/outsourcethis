
import { useEffect } from 'react';
import { useInventoryStore } from "@/store/inventoryStore";
import { toast } from "sonner";

// Sample frames data
const sampleFrames = [
  { brand: "RayBan", model: "Wayfarer", color: "Black", size: "52-18-140", price: 95, qty: 3 },
  { brand: "RayBan", model: "Clubmaster", color: "Tortoise", size: "51-21-145", price: 110, qty: 2 },
  { brand: "RayBan", model: "Aviator", color: "Gold", size: "58-14-135", price: 120, qty: 5 },
  { brand: "Oakley", model: "Holbrook", color: "Matte Black", size: "55-18-137", price: 130, qty: 4 },
  { brand: "Oakley", model: "Jawbreaker", color: "Polished White", size: "53-19-145", price: 150, qty: 2 },
  { brand: "Prada", model: "PR 17WS", color: "Black", size: "53-20-140", price: 210, qty: 3 },
  { brand: "Prada", model: "PR 51VS", color: "Silver", size: "54-18-140", price: 240, qty: 1 },
  { brand: "Gucci", model: "GG0010S", color: "Black/Gold", size: "58-16-145", price: 320, qty: 2 },
  { brand: "Gucci", model: "GG0418S", color: "Havana", size: "54-20-150", price: 300, qty: 3 },
  { brand: "Versace", model: "VE4361", color: "Black", size: "53-20-140", price: 270, qty: 2 },
  { brand: "Versace", model: "VE2210", color: "Gold", size: "56-16-140", price: 280, qty: 1 },
  { brand: "Persol", model: "PO3199S", color: "Tortoise", size: "53-20-145", price: 190, qty: 4 },
  { brand: "Persol", model: "PO0649", color: "Black", size: "54-20-140", price: 180, qty: 2 },
  { brand: "Burberry", model: "BE4160", color: "Havana", size: "58-17-140", price: 225, qty: 3 },
  { brand: "Tom Ford", model: "FT0935", color: "Black", size: "52-20-145", price: 340, qty: 2 }
];

export const InventoryInitializer = () => {
  const { frames, cleanupSamplePhotochromicCoatings, addFrame } = useInventoryStore(
    (state) => ({
      frames: state.frames,
      cleanupSamplePhotochromicCoatings: state.cleanupSamplePhotochromicCoatings,
      addFrame: state.addFrame
    })
  );

  useEffect(() => {
    // Clean up any existing sample photochromic coatings on component mount
    cleanupSamplePhotochromicCoatings();
    
    // Initialize sample frames if none exist
    if (frames.length === 0) {
      let importedCount = 0;
      
      sampleFrames.forEach(frame => {
        addFrame(frame);
        importedCount++;
      });
      
      if (importedCount > 0) {
        toast.success(`Initialized ${importedCount} sample frames in inventory`);
      }
    }
  }, [frames.length, cleanupSamplePhotochromicCoatings, addFrame]);

  return null; // This component doesn't render anything
};
