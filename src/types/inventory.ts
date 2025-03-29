
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
  frameBrand?: string;
  frameModel?: string;
  frameColor?: string;
  frameSize?: string;
  framePrice: number;
  lensType?: string;
  lensPrice: number;
  coating?: string;
  coatingPrice: number;
  discount: number;
  total: number;
  isPaid?: boolean;
  isPickedUp?: boolean;
  pickedUpAt?: string;
  lastEditedAt?: string;
  deposit?: number;
  rx?: {
    right: { sphere: string; cylinder: string; axis: string; add: string; pd: string };
    left: { sphere: string; cylinder: string; axis: string; add: string; pd: string };
  };
  editHistory?: Array<{
    timestamp: string;
    notes: string;
  }>;
}
