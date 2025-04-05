
import { ContactLens, ContactLensItem, Frame } from "@/types/inventoryTypes";

/**
 * Converts ContactLens to ContactLensItem for component compatibility
 */
export function convertToContactLensItem(contactLens: ContactLens): ContactLensItem {
  return {
    id: contactLens.id,
    brand: contactLens.brand,
    type: contactLens.type,
    bc: contactLens.bc || '',
    diameter: contactLens.diameter || '',
    power: contactLens.power || '',
    price: contactLens.price,
    qty: contactLens.qty || 1,
    color: contactLens.color
  };
}

/**
 * Converts an array of ContactLens to ContactLensItem[]
 */
export function convertToContactLensItems(contactLenses: ContactLens[]): ContactLensItem[] {
  return contactLenses.map(convertToContactLensItem);
}

/**
 * Ensures a frame has all required properties
 */
export function ensureFrameProps(frame: Partial<Frame>): Frame {
  return {
    id: frame.id || `F${Date.now()}`,
    frameId: frame.frameId || `F${Date.now()}`,
    brand: frame.brand || '',
    model: frame.model || '',
    color: frame.color || '',
    size: frame.size || '',
    price: frame.price || 0,
    stock: frame.stock || 0,
    qty: frame.qty || 0,
    createdAt: frame.createdAt || new Date().toISOString()
  };
}
