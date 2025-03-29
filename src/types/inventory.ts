
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
