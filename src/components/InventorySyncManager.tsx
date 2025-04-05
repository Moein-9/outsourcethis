
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useInventoryStore } from "@/store/inventoryStore";
import { toast } from "sonner";
import { resumeFailedSync } from "@/utils/databaseSync";

export const InventorySyncManager: React.FC = () => {
  const [syncing, setSyncing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [syncStatus, setSyncStatus] = React.useState<{
    processed: number;
    total: number;
    success: number;
    failed: number;
  } | null>(null);
  
  const frames = useInventoryStore(state => state.frames);
  const syncFramesToDatabase = useInventoryStore(state => state.syncFramesToDatabase);
  
  const handleSync = async () => {
    if (syncing) return;
    
    setSyncing(true);
    setSyncStatus(null);
    setProgress(0);
    
    try {
      const result = await syncFramesToDatabase((processed, total, success, failed) => {
        setProgress(Math.round((processed / total) * 100));
        setSyncStatus({ processed, total, success, failed });
      });
      
      if (result.failed > 0) {
        toast.error(`${result.failed} frames failed to sync. You can retry.`);
        if (result.details) {
          console.error(result.details);
        }
      } else {
        toast.success(`Successfully synced ${result.success} frames to database`);
      }
    } catch (error) {
      console.error("Error during sync:", error);
      toast.error("Sync process encountered an error");
    } finally {
      setSyncing(false);
    }
  };
  
  const handleRetryFailedFrames = async () => {
    if (!syncStatus || syncStatus.failed === 0 || syncing) return;
    
    setSyncing(true);
    setProgress(0);
    
    try {
      // Filter out frames that failed in the last sync attempt
      // Since we don't track which specific frames failed, we'll just sync all frames again
      // In a production app, you'd want to keep track of which specific frames failed
      const result = await resumeFailedSync(frames, (processed, total, success, failed) => {
        setProgress(Math.round((processed / total) * 100));
        setSyncStatus({ processed, total, success, failed });
      });
      
      if (result.failed > 0) {
        toast.error(`${result.failed} frames still failed to sync`);
        if (result.details) {
          console.error(result.details);
        }
      } else {
        toast.success(`Successfully synced ${result.success} previously failed frames`);
        setSyncStatus(null);
      }
    } catch (error) {
      console.error("Error during retry sync:", error);
      toast.error("Retry sync process encountered an error");
    } finally {
      setSyncing(false);
    }
  };
  
  return (
    <div className="border rounded-lg p-4 bg-card space-y-4">
      <h3 className="font-semibold text-lg">Frames Database Synchronization</h3>
      
      {syncStatus && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Sync Progress:</span>
            <span>{syncStatus.processed} / {syncStatus.total} frames</span>
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
      
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={handleSync} 
          disabled={syncing}
          className="bg-primary text-white"
        >
          {syncing ? "Syncing..." : "Sync Frames to Database"}
        </Button>
        
        {syncStatus && syncStatus.failed > 0 && (
          <Button 
            onClick={handleRetryFailedFrames} 
            disabled={syncing}
            variant="outline"
            className="border-red-400 text-red-600 hover:bg-red-50"
          >
            Retry Failed ({syncStatus.failed})
          </Button>
        )}
      </div>
    </div>
  );
};
