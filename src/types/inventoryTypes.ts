
// Define essential inventory types to resolve issues across components

// Common frame type
export interface Frame {
  id: string;
  brand: string;
  model: string;
  color: string;
  size?: string;
  price: number;
  stock: number;
  // Additional properties needed by components
  frameId?: string;
  createdAt?: string;
  qty?: number;
}

// Common lens type with all required properties
export interface LensType {
  id: string;
  name: string;
  price: number;
  type?: "progressive" | "bifocal" | "sunglasses" | "distance" | "reading";
  description?: string;
}

// Lens coating with all required properties
export interface LensCoating {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: "distance-reading" | "progressive" | "bifocal" | "sunglasses";
  isPhotochromic?: boolean;
  availableColors?: string[];
}

// Lens thickness with all required properties
export interface LensThickness {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: "distance-reading" | "progressive" | "bifocal" | "sunglasses";
}

// Contact lens type
export interface ContactLens {
  id: string;
  brand: string;
  type: string;
  bc?: string; // Base curve
  diameter?: string;
  power?: string;
  price: number;
  qty?: number;
  color?: string;
}

// Consistent with ContactLensSelector for compatibility
export interface ContactLensItem {
  id: string;
  brand: string;
  type: string;
  bc: string;
  diameter: string;
  power: string;
  price: number;
  qty: number;
  color?: string;
}

// Service type
export interface Service {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
}

// Repair service type
export interface RepairService {
  id: string;
  name: string;
  price: number;
  description?: string;
}

// Lens combination type
export interface LensCombination {
  id: string;
  lensTypeId: string;
  coatingId?: string;
  thicknessId?: string;
  price: number;
  description?: string;
}

// Import result type for frame bulk import
export interface ImportResult {
  added: number;
  duplicates: number;
}
