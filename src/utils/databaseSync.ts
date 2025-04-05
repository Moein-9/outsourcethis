
import { supabase } from "@/integrations/supabase/client";
import { FrameItem } from "@/store/inventoryStore";
import { toast } from "sonner";

// Configuration for sync operations
const SYNC_CONFIG = {
  BATCH_SIZE: 20,      // Reduced batch size for better throughput
  MAX_RETRIES: 3,      // Number of retry attempts for failed batches
  RETRY_DELAY: 1500,   // Delay between retries in ms
};

/**
 * Helper function to delay execution
 */
const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Syncs a frame to the Supabase database with retry logic
 */
export const syncFrameToDatabase = async (frame: FrameItem, retries = SYNC_CONFIG.MAX_RETRIES): Promise<boolean> => {
  try {
    // Using from with a type assertion to bypass TypeScript table name checking
    const { error } = await supabase
      .from('frames' as any)
      .upsert({
        frame_id: frame.frameId,
        brand: frame.brand,
        model: frame.model,
        color: frame.color,
        size: frame.size || '',  // Handle nullable field
        price: frame.price,
        qty: frame.qty
      }, {
        onConflict: 'frame_id'
      });
    
    if (error) {
      console.error('Error syncing frame to database:', error);
      
      if (retries > 0) {
        // Implement exponential backoff
        await delay(SYNC_CONFIG.RETRY_DELAY * (SYNC_CONFIG.MAX_RETRIES - retries + 1));
        return syncFrameToDatabase(frame, retries - 1);
      }
      
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception during frame sync:', error);
    
    if (retries > 0) {
      // Implement exponential backoff for exceptions too
      await delay(SYNC_CONFIG.RETRY_DELAY * (SYNC_CONFIG.MAX_RETRIES - retries + 1));
      return syncFrameToDatabase(frame, retries - 1);
    }
    
    return false;
  }
};

/**
 * Syncs multiple frames to the Supabase database with improved batching and error handling
 */
export const batchSyncFramesToDatabase = async (
  frames: FrameItem[], 
  onProgress?: (processed: number, total: number, success: number, failed: number) => void
): Promise<{success: number, failed: number, details?: string}> => {
  let successCount = 0;
  let failedCount = 0;
  const totalFrames = frames.length;
  const failedFrames: string[] = [];
  
  // Process frames in smaller batches
  for (let i = 0; i < totalFrames; i += SYNC_CONFIG.BATCH_SIZE) {
    const batch = frames.slice(i, i + SYNC_CONFIG.BATCH_SIZE);
    let retryCount = 0;
    let batchSuccess = false;
    
    while (!batchSuccess && retryCount <= SYNC_CONFIG.MAX_RETRIES) {
      if (retryCount > 0) {
        console.log(`Retry attempt ${retryCount} for batch starting at index ${i}`);
        await delay(SYNC_CONFIG.RETRY_DELAY * retryCount);
      }
      
      try {
        // Transform frames to database format
        const dbFrames = batch.map(frame => ({
          frame_id: frame.frameId,
          brand: frame.brand,
          model: frame.model,
          color: frame.color,
          size: frame.size || '',
          price: frame.price,
          qty: frame.qty
        }));
        
        // Using from with a type assertion to bypass TypeScript table name checking
        const { error } = await supabase
          .from('frames' as any)
          .upsert(dbFrames as any, {
            onConflict: 'frame_id'
          });
        
        if (error) {
          console.error('Error in batch sync:', error);
          retryCount++;
          
          // Check if it's the last retry attempt
          if (retryCount > SYNC_CONFIG.MAX_RETRIES) {
            failedCount += batch.length;
            batch.forEach(frame => failedFrames.push(frame.frameId));
          }
        } else {
          successCount += batch.length;
          batchSuccess = true;
        }
      } catch (error) {
        console.error('Exception during batch sync:', error);
        retryCount++;
        
        // Check if it's the last retry attempt
        if (retryCount > SYNC_CONFIG.MAX_RETRIES) {
          failedCount += batch.length;
          batch.forEach(frame => failedFrames.push(frame.frameId));
        }
      }
    }
    
    // Report progress
    if (onProgress) {
      onProgress(i + batch.length, totalFrames, successCount, failedCount);
    }
    
    // Add a small delay between batches to avoid rate limiting
    if (i + SYNC_CONFIG.BATCH_SIZE < totalFrames) {
      await delay(200);
    }
  }
  
  let details = undefined;
  if (failedFrames.length > 0) {
    details = `Failed frame IDs: ${failedFrames.slice(0, 5).join(', ')}${failedFrames.length > 5 ? '...' : ''}`;
  }
  
  return { success: successCount, failed: failedCount, details };
};

/**
 * Load frames from the database and update local storage
 */
export const loadFramesFromDatabase = async (): Promise<FrameItem[]> => {
  try {
    // Using from with a type assertion to bypass TypeScript table name checking
    const { data, error } = await supabase
      .from('frames' as any)
      .select('*');
    
    if (error) {
      console.error('Error loading frames from database:', error);
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    // Convert database format to FrameItem format
    const frames: FrameItem[] = data.map((item: any) => ({
      frameId: item.frame_id,
      brand: item.brand,
      model: item.model,
      color: item.color,
      size: item.size || '',
      price: item.price,
      qty: item.qty,
      createdAt: item.created_at
    }));
    
    return frames;
  } catch (error) {
    console.error('Exception during frames loading:', error);
    return [];
  }
};

/**
 * Resume sync for previously failed frames
 */
export const resumeFailedSync = async (
  frames: FrameItem[],
  onProgress?: (processed: number, total: number, success: number, failed: number) => void
): Promise<{success: number, failed: number, details?: string}> => {
  return batchSyncFramesToDatabase(frames, onProgress);
};
