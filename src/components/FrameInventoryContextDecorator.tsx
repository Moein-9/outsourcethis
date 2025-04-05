
import React from 'react';
import { FrameInventory } from './FrameInventory';
import { useQuery } from '@tanstack/react-query';
import { FrameService } from '@/services/inventoryService';
import { FrameItem } from '@/store/inventoryStore';

export const FrameInventoryContextDecorator: React.FC = () => {
  const { data: frames, isLoading, error } = useQuery<FrameItem[]>({
    queryKey: ['frames'],
    queryFn: FrameService.fetchFrames,
  });
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <div className="h-8 w-8 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading inventory data...</p>
      </div>
    </div>;
  }
  
  if (error) {
    console.error("Error loading frames:", error);
    return <div className="p-8 text-center">
      <p className="text-red-500 mb-4">Failed to load frame inventory</p>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>;
  }
  
  return <FrameInventory overrideFrames={frames || []} />;
};
