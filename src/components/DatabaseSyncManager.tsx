
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventoryStore } from "@/store/inventoryStore";
import { toast } from "sonner";

type SyncStatus = {
  processed: number;
  total: number;
  success: number;
  failed: number;
};

type SyncCategory = 'frames' | 'lensTypes' | 'lensCoatings' | 'lensThicknesses' | 'pricingCombinations' | 'contactLenses' | 'services' | 'all';

export const DatabaseSyncManager: React.FC = () => {
  const [syncing, setSyncing] = useState<SyncCategory | null>(null);
  const [progress, setProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  
  // Get all inventory items and sync functions from the store
  const {
    frames,
    lensTypes,
    lensCoatings,
    lensThicknesses,
    contactLenses,
    services,
    lensPricingCombinations,
    
    syncFramesToDatabase,
    syncLensTypesToDatabase,
    syncLensCoatingsToDatabase,
    syncLensThicknessesToDatabase,
    syncLensPricingCombinationsToDatabase,
    syncContactLensesToDatabase,
    syncServicesToDatabase,
    syncAllToDatabase,
  } = useInventoryStore();
  
  const handleSync = async (category: SyncCategory) => {
    if (syncing) return;
    
    setSyncing(category);
    setSyncStatus(null);
    setProgress(0);
    
    try {
      let result;
      
      const progressCallback = (processed: number, total: number, success: number, failed: number) => {
        setProgress(Math.round((processed / total) * 100));
        setSyncStatus({ processed, total, success, failed });
      };
      
      switch (category) {
        case 'frames':
          result = await syncFramesToDatabase(progressCallback);
          break;
        case 'lensTypes':
          result = await syncLensTypesToDatabase(progressCallback);
          break;
        case 'lensCoatings':
          result = await syncLensCoatingsToDatabase(progressCallback);
          break;
        case 'lensThicknesses':
          result = await syncLensThicknessesToDatabase(progressCallback);
          break;
        case 'pricingCombinations':
          result = await syncLensPricingCombinationsToDatabase(progressCallback);
          break;
        case 'contactLenses':
          result = await syncContactLensesToDatabase(progressCallback);
          break;
        case 'services':
          result = await syncServicesToDatabase(progressCallback);
          break;
        case 'all':
          result = await syncAllToDatabase(progressCallback);
          break;
      }
      
      if (result.failed > 0) {
        toast.error(`${result.failed} items failed to sync. You can retry.`);
        if (result.details) {
          console.error(result.details);
        }
      } else {
        toast.success(`Successfully synced ${result.success} items to database`);
      }
    } catch (error) {
      console.error("Error during sync:", error);
      toast.error(`Sync process encountered an error: ${(error as Error).message}`);
    } finally {
      setSyncing(null);
    }
  };
  
  const handleRetryFailedItems = async () => {
    // Not implemented yet - would need to track failed items by category
    toast.info("Retry functionality will be implemented in a future update");
  };
  
  const getCategoryLabel = (category: SyncCategory): string => {
    switch (category) {
      case 'frames': return 'Frames';
      case 'lensTypes': return 'Lens Types';
      case 'lensCoatings': return 'Lens Coatings';
      case 'lensThicknesses': return 'Lens Thicknesses';
      case 'pricingCombinations': return 'Pricing Combinations';
      case 'contactLenses': return 'Contact Lenses';
      case 'services': return 'Services';
      case 'all': return 'All Items';
      default: return '';
    }
  };
  
  const getCategoryCount = (category: SyncCategory): number => {
    switch (category) {
      case 'frames': return frames.length;
      case 'lensTypes': return lensTypes.length;
      case 'lensCoatings': return lensCoatings.length;
      case 'lensThicknesses': return lensThicknesses.length;
      case 'pricingCombinations': return lensPricingCombinations.length;
      case 'contactLenses': return contactLenses.length;
      case 'services': return services.length;
      case 'all': return frames.length + lensTypes.length + lensCoatings.length + 
                         lensThicknesses.length + lensPricingCombinations.length + 
                         contactLenses.length + services.length;
      default: return 0;
    }
  };
  
  // Prepare data for rendering sync buttons
  const syncOptions: SyncCategory[] = [
    'frames', 'lensTypes', 'lensCoatings', 'lensThicknesses', 
    'pricingCombinations', 'contactLenses', 'services', 'all'
  ];
  
  return (
    <Card className="border rounded-lg bg-card">
      <CardHeader className="pb-2">
        <CardTitle>Database Synchronization</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="category">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="category">By Category</TabsTrigger>
            <TabsTrigger value="full">Full Sync</TabsTrigger>
          </TabsList>
          
          <TabsContent value="category" className="space-y-4">
            {syncStatus && syncing !== 'all' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sync Progress:</span>
                  <span>{syncStatus.processed} / {syncStatus.total} items</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Successful:</span>
                    <span className="text-green-600 font-medium">{syncStatus.success}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Failed:</span>
                    <span className="text-red-600 font-medium">{syncStatus.failed}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {syncOptions.filter(c => c !== 'all').map((category) => (
                <Button 
                  key={category}
                  onClick={() => handleSync(category)} 
                  disabled={!!syncing || getCategoryCount(category) === 0}
                  variant="outline"
                  className="justify-start"
                >
                  <span className="flex-1 text-left">
                    {getCategoryLabel(category)} ({getCategoryCount(category)})
                  </span>
                  {syncing === category && <span className="ml-2">Syncing...</span>}
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="full" className="space-y-4">
            {syncStatus && syncing === 'all' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sync Progress:</span>
                  <span>{syncStatus.processed} / {syncStatus.total} items</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Successful:</span>
                    <span className="text-green-600 font-medium">{syncStatus.success}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Failed:</span>
                    <span className="text-red-600 font-medium">{syncStatus.failed}</span>
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              onClick={() => handleSync('all')} 
              disabled={!!syncing || getCategoryCount('all') === 0}
              className="w-full bg-primary text-white"
            >
              {syncing === 'all' ? "Syncing All Items..." : `Sync All Items (${getCategoryCount('all')})`}
            </Button>
            
            {syncStatus && syncStatus.failed > 0 && (
              <Button 
                onClick={handleRetryFailedItems} 
                disabled={!!syncing}
                variant="outline"
                className="w-full border-red-400 text-red-600 hover:bg-red-50"
              >
                Retry Failed ({syncStatus.failed})
              </Button>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="text-sm text-muted-foreground">
          <p>Sync your inventory items to the database to ensure all data is backed up and accessible across devices.</p>
        </div>
      </CardContent>
    </Card>
  );
};
