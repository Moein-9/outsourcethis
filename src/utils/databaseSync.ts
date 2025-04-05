
import { supabase } from "@/integrations/supabase/client";
import { FrameItem, LensType, LensCoating, LensThickness, ContactLensItem, ServiceItem, LensPricingCombination } from "@/store/inventoryStore";
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
    const { error } = await supabase
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
        
        const { error } = await supabase
          .from('frames')
          .upsert(dbFrames, {
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
    const { data, error } = await supabase
      .from('frames')
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
 * Sync lens types to the database
 */
export const syncLensTypesToDatabase = async (
  lensTypes: LensType[],
  onProgress?: (processed: number, total: number, success: number, failed: number) => void
): Promise<{success: number, failed: number, details?: string}> => {
  let successCount = 0;
  let failedCount = 0;
  const totalItems = lensTypes.length;
  const failedItems: string[] = [];
  
  for (let i = 0; i < totalItems; i += SYNC_CONFIG.BATCH_SIZE) {
    const batch = lensTypes.slice(i, i + SYNC_CONFIG.BATCH_SIZE);
    let retryCount = 0;
    let batchSuccess = false;
    
    while (!batchSuccess && retryCount <= SYNC_CONFIG.MAX_RETRIES) {
      try {
        const dbItems = batch.map(item => ({
          lens_id: item.id,
          name: item.name,
          type: item.type,
          price: item.price || null
        }));
        
        const { error } = await supabase
          .from('lens_types')
          .upsert(dbItems, {
            onConflict: 'lens_id'
          });
        
        if (error) {
          console.error('Error in lens types batch sync:', error);
          retryCount++;
          
          if (retryCount > SYNC_CONFIG.MAX_RETRIES) {
            failedCount += batch.length;
            batch.forEach(item => failedItems.push(item.id));
          }
        } else {
          successCount += batch.length;
          batchSuccess = true;
        }
      } catch (error) {
        console.error('Exception during lens types sync:', error);
        retryCount++;
        
        if (retryCount > SYNC_CONFIG.MAX_RETRIES) {
          failedCount += batch.length;
          batch.forEach(item => failedItems.push(item.id));
        }
      }
    }
    
    if (onProgress) {
      onProgress(i + batch.length, totalItems, successCount, failedCount);
    }
    
    if (i + SYNC_CONFIG.BATCH_SIZE < totalItems) {
      await delay(200);
    }
  }
  
  let details = undefined;
  if (failedItems.length > 0) {
    details = `Failed lens type IDs: ${failedItems.slice(0, 5).join(', ')}${failedItems.length > 5 ? '...' : ''}`;
  }
  
  return { success: successCount, failed: failedCount, details };
};

/**
 * Load lens types from the database
 */
export const loadLensTypesFromDatabase = async (): Promise<LensType[]> => {
  try {
    const { data, error } = await supabase
      .from('lens_types')
      .select('*');
    
    if (error) {
      console.error('Error loading lens types from database:', error);
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    const lensTypes: LensType[] = data.map((item: any) => ({
      id: item.lens_id,
      name: item.name,
      type: item.type,
      price: item.price || undefined
    }));
    
    return lensTypes;
  } catch (error) {
    console.error('Exception during lens types loading:', error);
    return [];
  }
};

/**
 * Sync lens coatings to the database
 */
export const syncLensCoatingsToDatabase = async (
  coatings: LensCoating[],
  onProgress?: (processed: number, total: number, success: number, failed: number) => void
): Promise<{success: number, failed: number, details?: string}> => {
  let successCount = 0;
  let failedCount = 0;
  const totalItems = coatings.length;
  const failedItems: string[] = [];
  
  for (let i = 0; i < totalItems; i += SYNC_CONFIG.BATCH_SIZE) {
    const batch = coatings.slice(i, i + SYNC_CONFIG.BATCH_SIZE);
    let retryCount = 0;
    let batchSuccess = false;
    
    while (!batchSuccess && retryCount <= SYNC_CONFIG.MAX_RETRIES) {
      try {
        const dbItems = batch.map(item => ({
          coating_id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          description: item.description || null,
          is_photochromic: item.isPhotochromic || false,
          available_colors: item.availableColors || null
        }));
        
        const { error } = await supabase
          .from('lens_coatings')
          .upsert(dbItems, {
            onConflict: 'coating_id'
          });
        
        if (error) {
          console.error('Error in lens coatings batch sync:', error);
          retryCount++;
          
          if (retryCount > SYNC_CONFIG.MAX_RETRIES) {
            failedCount += batch.length;
            batch.forEach(item => failedItems.push(item.id));
          }
        } else {
          successCount += batch.length;
          batchSuccess = true;
        }
      } catch (error) {
        console.error('Exception during lens coatings sync:', error);
        retryCount++;
        
        if (retryCount > SYNC_CONFIG.MAX_RETRIES) {
          failedCount += batch.length;
          batch.forEach(item => failedItems.push(item.id));
        }
      }
    }
    
    if (onProgress) {
      onProgress(i + batch.length, totalItems, successCount, failedCount);
    }
    
    if (i + SYNC_CONFIG.BATCH_SIZE < totalItems) {
      await delay(200);
    }
  }
  
  let details = undefined;
  if (failedItems.length > 0) {
    details = `Failed lens coating IDs: ${failedItems.slice(0, 5).join(', ')}${failedItems.length > 5 ? '...' : ''}`;
  }
  
  return { success: successCount, failed: failedCount, details };
};

/**
 * Load lens coatings from the database
 */
export const loadLensCoatingsFromDatabase = async (): Promise<LensCoating[]> => {
  try {
    const { data, error } = await supabase
      .from('lens_coatings')
      .select('*');
    
    if (error) {
      console.error('Error loading lens coatings from database:', error);
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    const lensCoatings: LensCoating[] = data.map((item: any) => ({
      id: item.coating_id,
      name: item.name,
      category: item.category as any,
      price: item.price,
      description: item.description || undefined,
      isPhotochromic: item.is_photochromic || false,
      availableColors: item.available_colors || undefined
    }));
    
    return lensCoatings;
  } catch (error) {
    console.error('Exception during lens coatings loading:', error);
    return [];
  }
};

/**
 * Sync lens thicknesses to the database
 */
export const syncLensThicknessesToDatabase = async (
  thicknesses: LensThickness[],
  onProgress?: (processed: number, total: number, success: number, failed: number) => void
): Promise<{success: number, failed: number, details?: string}> => {
  let successCount = 0;
  let failedCount = 0;
  const totalItems = thicknesses.length;
  const failedItems: string[] = [];
  
  for (let i = 0; i < totalItems; i += SYNC_CONFIG.BATCH_SIZE) {
    const batch = thicknesses.slice(i, i + SYNC_CONFIG.BATCH_SIZE);
    let retryCount = 0;
    let batchSuccess = false;
    
    while (!batchSuccess && retryCount <= SYNC_CONFIG.MAX_RETRIES) {
      try {
        const dbItems = batch.map(item => ({
          thickness_id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          description: item.description || null
        }));
        
        const { error } = await supabase
          .from('lens_thicknesses')
          .upsert(dbItems, {
            onConflict: 'thickness_id'
          });
        
        if (error) {
          console.error('Error in lens thicknesses batch sync:', error);
          retryCount++;
          
          if (retryCount > SYNC_CONFIG.MAX_RETRIES) {
            failedCount += batch.length;
            batch.forEach(item => failedItems.push(item.id));
          }
        } else {
          successCount += batch.length;
          batchSuccess = true;
        }
      } catch (error) {
        console.error('Exception during lens thicknesses sync:', error);
        retryCount++;
        
        if (retryCount > SYNC_CONFIG.MAX_RETRIES) {
          failedCount += batch.length;
          batch.forEach(item => failedItems.push(item.id));
        }
      }
    }
    
    if (onProgress) {
      onProgress(i + batch.length, totalItems, successCount, failedCount);
    }
    
    if (i + SYNC_CONFIG.BATCH_SIZE < totalItems) {
      await delay(200);
    }
  }
  
  let details = undefined;
  if (failedItems.length > 0) {
    details = `Failed lens thickness IDs: ${failedItems.slice(0, 5).join(', ')}${failedItems.length > 5 ? '...' : ''}`;
  }
  
  return { success: successCount, failed: failedCount, details };
};

/**
 * Load lens thicknesses from the database
 */
export const loadLensThicknessesFromDatabase = async (): Promise<LensThickness[]> => {
  try {
    const { data, error } = await supabase
      .from('lens_thicknesses')
      .select('*');
    
    if (error) {
      console.error('Error loading lens thicknesses from database:', error);
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    const lensThicknesses: LensThickness[] = data.map((item: any) => ({
      id: item.thickness_id,
      name: item.name,
      category: item.category as any,
      price: item.price,
      description: item.description || undefined
    }));
    
    return lensThicknesses;
  } catch (error) {
    console.error('Exception during lens thicknesses loading:', error);
    return [];
  }
};

/**
 * Sync lens pricing combinations to the database
 */
export const syncLensPricingCombinationsToDatabase = async (
  combinations: LensPricingCombination[],
  onProgress?: (processed: number, total: number, success: number, failed: number) => void
): Promise<{success: number, failed: number, details?: string}> => {
  let successCount = 0;
  let failedCount = 0;
  const totalItems = combinations.length;
  const failedItems: string[] = [];
  
  for (let i = 0; i < totalItems; i += SYNC_CONFIG.BATCH_SIZE) {
    const batch = combinations.slice(i, i + SYNC_CONFIG.BATCH_SIZE);
    let retryCount = 0;
    let batchSuccess = false;
    
    while (!batchSuccess && retryCount <= SYNC_CONFIG.MAX_RETRIES) {
      try {
        const dbItems = batch.map(item => ({
          combo_id: item.id,
          lens_type_id: item.lensTypeId,
          coating_id: item.coatingId,
          thickness_id: item.thicknessId,
          price: item.price
        }));
        
        const { error } = await supabase
          .from('lens_pricing_combinations')
          .upsert(dbItems, {
            onConflict: 'combo_id'
          });
        
        if (error) {
          console.error('Error in lens pricing combinations batch sync:', error);
          retryCount++;
          
          if (retryCount > SYNC_CONFIG.MAX_RETRIES) {
            failedCount += batch.length;
            batch.forEach(item => failedItems.push(item.id));
          }
        } else {
          successCount += batch.length;
          batchSuccess = true;
        }
      } catch (error) {
        console.error('Exception during lens pricing combinations sync:', error);
        retryCount++;
        
        if (retryCount > SYNC_CONFIG.MAX_RETRIES) {
          failedCount += batch.length;
          batch.forEach(item => failedItems.push(item.id));
        }
      }
    }
    
    if (onProgress) {
      onProgress(i + batch.length, totalItems, successCount, failedCount);
    }
    
    if (i + SYNC_CONFIG.BATCH_SIZE < totalItems) {
      await delay(200);
    }
  }
  
  let details = undefined;
  if (failedItems.length > 0) {
    details = `Failed lens pricing combination IDs: ${failedItems.slice(0, 5).join(', ')}${failedItems.length > 5 ? '...' : ''}`;
  }
  
  return { success: successCount, failed: failedCount, details };
};

/**
 * Load lens pricing combinations from the database
 */
export const loadLensPricingCombinationsFromDatabase = async (): Promise<LensPricingCombination[]> => {
  try {
    const { data, error } = await supabase
      .from('lens_pricing_combinations')
      .select('*');
    
    if (error) {
      console.error('Error loading lens pricing combinations from database:', error);
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    const lensPricingCombinations: LensPricingCombination[] = data.map((item: any) => ({
      id: item.combo_id,
      lensTypeId: item.lens_type_id,
      coatingId: item.coating_id,
      thicknessId: item.thickness_id,
      price: item.price
    }));
    
    return lensPricingCombinations;
  } catch (error) {
    console.error('Exception during lens pricing combinations loading:', error);
    return [];
  }
};

/**
 * Sync contact lenses to the database
 */
export const syncContactLensesToDatabase = async (
  contactLenses: ContactLensItem[],
  onProgress?: (processed: number, total: number, success: number, failed: number) => void
): Promise<{success: number, failed: number, details?: string}> => {
  let successCount = 0;
  let failedCount = 0;
  const totalItems = contactLenses.length;
  const failedItems: string[] = [];
  
  for (let i = 0; i < totalItems; i += SYNC_CONFIG.BATCH_SIZE) {
    const batch = contactLenses.slice(i, i + SYNC_CONFIG.BATCH_SIZE);
    let retryCount = 0;
    let batchSuccess = false;
    
    while (!batchSuccess && retryCount <= SYNC_CONFIG.MAX_RETRIES) {
      try {
        const dbItems = batch.map(item => ({
          lens_id: item.id,
          brand: item.brand,
          type: item.type,
          bc: item.bc,
          diameter: item.diameter,
          power: item.power,
          price: item.price,
          qty: item.qty,
          color: item.color || null
        }));
        
        const { error } = await supabase
          .from('contact_lenses')
          .upsert(dbItems, {
            onConflict: 'lens_id'
          });
        
        if (error) {
          console.error('Error in contact lenses batch sync:', error);
          retryCount++;
          
          if (retryCount > SYNC_CONFIG.MAX_RETRIES) {
            failedCount += batch.length;
            batch.forEach(item => failedItems.push(item.id));
          }
        } else {
          successCount += batch.length;
          batchSuccess = true;
        }
      } catch (error) {
        console.error('Exception during contact lenses sync:', error);
        retryCount++;
        
        if (retryCount > SYNC_CONFIG.MAX_RETRIES) {
          failedCount += batch.length;
          batch.forEach(item => failedItems.push(item.id));
        }
      }
    }
    
    if (onProgress) {
      onProgress(i + batch.length, totalItems, successCount, failedCount);
    }
    
    if (i + SYNC_CONFIG.BATCH_SIZE < totalItems) {
      await delay(200);
    }
  }
  
  let details = undefined;
  if (failedItems.length > 0) {
    details = `Failed contact lens IDs: ${failedItems.slice(0, 5).join(', ')}${failedItems.length > 5 ? '...' : ''}`;
  }
  
  return { success: successCount, failed: failedCount, details };
};

/**
 * Load contact lenses from the database
 */
export const loadContactLensesFromDatabase = async (): Promise<ContactLensItem[]> => {
  try {
    const { data, error } = await supabase
      .from('contact_lenses')
      .select('*');
    
    if (error) {
      console.error('Error loading contact lenses from database:', error);
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    const contactLenses: ContactLensItem[] = data.map((item: any) => ({
      id: item.lens_id,
      brand: item.brand,
      type: item.type,
      bc: item.bc,
      diameter: item.diameter,
      power: item.power,
      price: item.price,
      qty: item.qty,
      color: item.color || undefined
    }));
    
    return contactLenses;
  } catch (error) {
    console.error('Exception during contact lenses loading:', error);
    return [];
  }
};

/**
 * Sync services to the database
 */
export const syncServicesToDatabase = async (
  services: ServiceItem[],
  onProgress?: (processed: number, total: number, success: number, failed: number) => void
): Promise<{success: number, failed: number, details?: string}> => {
  let successCount = 0;
  let failedCount = 0;
  const totalItems = services.length;
  const failedItems: string[] = [];
  
  for (let i = 0; i < totalItems; i += SYNC_CONFIG.BATCH_SIZE) {
    const batch = services.slice(i, i + SYNC_CONFIG.BATCH_SIZE);
    let retryCount = 0;
    let batchSuccess = false;
    
    while (!batchSuccess && retryCount <= SYNC_CONFIG.MAX_RETRIES) {
      try {
        const dbItems = batch.map(item => ({
          service_id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category
        }));
        
        const { error } = await supabase
          .from('services')
          .upsert(dbItems, {
            onConflict: 'service_id'
          });
        
        if (error) {
          console.error('Error in services batch sync:', error);
          retryCount++;
          
          if (retryCount > SYNC_CONFIG.MAX_RETRIES) {
            failedCount += batch.length;
            batch.forEach(item => failedItems.push(item.id));
          }
        } else {
          successCount += batch.length;
          batchSuccess = true;
        }
      } catch (error) {
        console.error('Exception during services sync:', error);
        retryCount++;
        
        if (retryCount > SYNC_CONFIG.MAX_RETRIES) {
          failedCount += batch.length;
          batch.forEach(item => failedItems.push(item.id));
        }
      }
    }
    
    if (onProgress) {
      onProgress(i + batch.length, totalItems, successCount, failedCount);
    }
    
    if (i + SYNC_CONFIG.BATCH_SIZE < totalItems) {
      await delay(200);
    }
  }
  
  let details = undefined;
  if (failedItems.length > 0) {
    details = `Failed service IDs: ${failedItems.slice(0, 5).join(', ')}${failedItems.length > 5 ? '...' : ''}`;
  }
  
  return { success: successCount, failed: failedCount, details };
};

/**
 * Load services from the database
 */
export const loadServicesFromDatabase = async (): Promise<ServiceItem[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*');
    
    if (error) {
      console.error('Error loading services from database:', error);
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    const services: ServiceItem[] = data.map((item: any) => ({
      id: item.service_id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category as any
    }));
    
    return services;
  } catch (error) {
    console.error('Exception during services loading:', error);
    return [];
  }
};

/**
 * Resume sync for previously failed items
 */
export const resumeFailedSync = async (
  frames: FrameItem[],
  onProgress?: (processed: number, total: number, success: number, failed: number) => void
): Promise<{success: number, failed: number, details?: string}> => {
  return batchSyncFramesToDatabase(frames, onProgress);
};
