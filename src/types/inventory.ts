
// Define common types for the inventory store
export interface Frame {
  id: string;
  brand: string;
  model: string;
  color: string;
  size?: string;
  price: number;
  stock: number;
}

export interface FrameItem {
  frameId: string;
  brand: string;
  model: string;
  color: string;
  size: string;
  price: number;
  qty: number;
  createdAt: string;
}

export interface LensType {
  id: string;
  type: string;
  name: string;
  price: number;
  description?: string;
}

export interface LensCoating {
  id: string;
  name: string;
  price: number;
  description?: string;
}

// Update WorkOrder type to align with invoiceStore.ts
export interface WorkOrder {
  id: string;
  patientId: string;
  invoiceId?: string;
  workOrderId?: string;
  createdAt: string;
  
  // Frame details
  frameBrand?: string;
  frameModel?: string;
  frameColor?: string;
  frameSize?: string;
  framePrice: number;
  
  // Lens details
  lensType?: string;
  lensPrice: number;
  
  // Coating details
  coating?: string;
  coatingPrice: number;
  
  // Financial details
  discount: number;
  total: number;
  deposit?: number;
  
  // Status flags
  isPaid?: boolean;
  isPickedUp?: boolean;
  pickedUpAt?: string;
  lastEditedAt?: string;
  
  // Prescription data
  rx?: {
    right: { sphere: string; cylinder: string; axis: string; add: string; pd: string };
    left: { sphere: string; cylinder: string; axis: string; add: string; pd: string };
  };
  
  // Edit history
  editHistory?: Array<{
    timestamp: string;
    notes: string;
  }>;
}
