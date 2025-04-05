
import { useEffect, useState } from 'react';
import { useInventoryStore } from "@/store/inventoryStore";
import { 
  loadFramesFromDatabase, 
  loadLensTypesFromDatabase,
  loadLensCoatingsFromDatabase,
  loadLensThicknessesFromDatabase,
  loadLensPricingCombinationsFromDatabase,
  loadContactLensesFromDatabase,
  loadServicesFromDatabase
} from "@/utils/databaseSync";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export const InventoryInitializer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState("");
  
  const cleanupSamplePhotochromicCoatings = useInventoryStore(
    (state) => state.cleanupSamplePhotochromicCoatings
  );
  
  const syncFromDatabase = useInventoryStore(
    (state) => state.syncFromDatabase
  );

  useEffect(() => {
    // Clean up any existing sample photochromic coatings on component mount
    cleanupSamplePhotochromicCoatings();
    
    // Try loading all data from database
    const loadAllData = async () => {
      setIsLoading(true);
      let totalSuccessCount = 0;
      let totalErrorCount = 0;
      
      try {
        // Step 1: Load frames
        setLoadingStatus("Loading frames...");
        setLoadingProgress(10);
        const dbFrames = await loadFramesFromDatabase();
        if (dbFrames.length > 0) {
          syncFromDatabase('frames', dbFrames);
          console.log(`Loaded ${dbFrames.length} frames from the database`);
          totalSuccessCount += dbFrames.length;
        }
        
        // Step 2: Load lens types
        setLoadingStatus("Loading lens types...");
        setLoadingProgress(25);
        const dbLensTypes = await loadLensTypesFromDatabase();
        if (dbLensTypes.length > 0) {
          syncFromDatabase('lensTypes', dbLensTypes);
          console.log(`Loaded ${dbLensTypes.length} lens types from the database`);
          totalSuccessCount += dbLensTypes.length;
        }
        
        // Step 3: Load lens coatings
        setLoadingStatus("Loading lens coatings...");
        setLoadingProgress(40);
        const dbLensCoatings = await loadLensCoatingsFromDatabase();
        if (dbLensCoatings.length > 0) {
          syncFromDatabase('lensCoatings', dbLensCoatings);
          console.log(`Loaded ${dbLensCoatings.length} lens coatings from the database`);
          totalSuccessCount += dbLensCoatings.length;
        }
        
        // Step 4: Load lens thicknesses
        setLoadingStatus("Loading lens thicknesses...");
        setLoadingProgress(55);
        const dbLensThicknesses = await loadLensThicknessesFromDatabase();
        if (dbLensThicknesses.length > 0) {
          syncFromDatabase('lensThicknesses', dbLensThicknesses);
          console.log(`Loaded ${dbLensThicknesses.length} lens thicknesses from the database`);
          totalSuccessCount += dbLensThicknesses.length;
        }
        
        // Step 5: Load lens pricing combinations
        setLoadingStatus("Loading lens pricing combinations...");
        setLoadingProgress(70);
        const dbLensPricingCombinations = await loadLensPricingCombinationsFromDatabase();
        if (dbLensPricingCombinations.length > 0) {
          syncFromDatabase('lensPricingCombinations', dbLensPricingCombinations);
          console.log(`Loaded ${dbLensPricingCombinations.length} lens pricing combinations from the database`);
          totalSuccessCount += dbLensPricingCombinations.length;
        }
        
        // Step 6: Load contact lenses
        setLoadingStatus("Loading contact lenses...");
        setLoadingProgress(85);
        const dbContactLenses = await loadContactLensesFromDatabase();
        if (dbContactLenses.length > 0) {
          syncFromDatabase('contactLenses', dbContactLenses);
          console.log(`Loaded ${dbContactLenses.length} contact lenses from the database`);
          totalSuccessCount += dbContactLenses.length;
        }
        
        // Step 7: Load services
        setLoadingStatus("Loading services...");
        setLoadingProgress(95);
        const dbServices = await loadServicesFromDatabase();
        if (dbServices.length > 0) {
          syncFromDatabase('services', dbServices);
          console.log(`Loaded ${dbServices.length} services from the database`);
          totalSuccessCount += dbServices.length;
        }
        
        setLoadingProgress(100);
        
        if (totalSuccessCount > 0) {
          toast.success(`Loaded ${totalSuccessCount} inventory items from database`);
        }
      } catch (error) {
        console.error('Failed to load data from database:', error);
        toast.error('Failed to load inventory data');
        totalErrorCount++;
      } finally {
        setIsLoading(false);
        setLoadingStatus("");
      }
    };
    
    loadAllData();
  }, [cleanupSamplePhotochromicCoatings, syncFromDatabase]);

  if (isLoading) {
    return (
      <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
        <div className="flex justify-between text-sm">
          <span>{loadingStatus || "Initializing inventory..."}</span>
          <span>{loadingProgress}%</span>
        </div>
        <Progress value={loadingProgress} />
      </div>
    );
  }
  
  return null; // This component doesn't render anything when not loading
};
