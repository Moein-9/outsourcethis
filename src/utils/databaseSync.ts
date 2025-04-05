
import { supabase } from "@/integrations/supabase/client";
import { FrameItem } from "@/store/inventoryStore";
import { toast } from "sonner";

/**
 * Syncs a frame to the Supabase database
 */
export const syncFrameToDatabase = async (frame: FrameItem): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('frames')
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
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception during frame sync:', error);
    return false;
  }
};

/**
 * Syncs multiple frames to the Supabase database
 */
export const batchSyncFramesToDatabase = async (
  frames: FrameItem[], 
  onProgress?: (processed: number, total: number) => void
): Promise<{success: number, failed: number}> => {
  const BATCH_SIZE = 25;
  let successCount = 0;
  let failedCount = 0;
  const totalFrames = frames.length;
  
  // Process frames in batches
  for (let i = 0; i < totalFrames; i += BATCH_SIZE) {
    const batch = frames.slice(i, i + BATCH_SIZE);
    
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
    
    try {
      const { data, error } = await supabase
        .from('frames')
        .upsert(dbFrames, {
          onConflict: 'frame_id'
        });
      
      if (error) {
        console.error('Error in batch sync:', error);
        failedCount += batch.length;
      } else {
        successCount += batch.length;
      }
    } catch (error) {
      console.error('Exception during batch sync:', error);
      failedCount += batch.length;
    }
    
    // Report progress
    if (onProgress) {
      onProgress(i + batch.length, totalFrames);
    }
  }
  
  return { success: successCount, failed: failedCount };
};

/**
 * Load frames from the database and update local storage
 */
export const loadFramesFromDatabase = async (): Promise<FrameItem[]> => {
  try {
    const { data, error } = await supabase
      .from('frames')
      .select('*');
    
    if (error) {
      console.error('Error loading frames from database:', error);
      return [];
    }
    
    // Convert database format to FrameItem format
    const frames: FrameItem[] = data.map(item => ({
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
