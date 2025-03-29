
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

// Update WorkOrder type to include all required properties
export interface WorkOrder {
  invoiceId?: string;
  workOrderId?: string;
  patientId?: string;
  id?: string;
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
  createdAt?: string;
  lastEditedAt?: string;
  editHistory?: Array<{
    timestamp: string;
    notes: string;
  }>;
}
