
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  name: string;
  type: "distance" | "reading" | "progressive" | "bifocal" | "sunglasses";
}

export interface LensCoating {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: "distance_reading" | "progressive" | "bifocal"; // Added category field
}

export interface LensThickness {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: "distance_reading" | "progressive" | "bifocal"; // Same categories as coatings
}

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

interface InventoryState {
  frames: FrameItem[];
  lensTypes: LensType[];
  lensCoatings: LensCoating[];
  lensThicknesses: LensThickness[]; // New array for lens thicknesses
  contactLenses: ContactLensItem[];
  
  // Frame methods
  addFrame: (frame: Omit<FrameItem, "frameId" | "createdAt">) => string;
  updateFrameQuantity: (frameId: string, newQty: number) => void;
  searchFrames: (query: string) => FrameItem[];
  getFrameById: (id: string) => FrameItem | undefined;
  
  // Lens methods
  addLensType: (lens: Omit<LensType, "id">) => string;
  updateLensType: (id: string, lens: Partial<Omit<LensType, "id">>) => void;
  deleteLensType: (id: string) => void;
  
  // Coating methods
  addLensCoating: (coating: Omit<LensCoating, "id">) => string;
  updateLensCoating: (id: string, coating: Partial<Omit<LensCoating, "id">>) => void;
  deleteLensCoating: (id: string) => void;
  
  // Thickness methods
  addLensThickness: (thickness: Omit<LensThickness, "id">) => string;
  updateLensThickness: (id: string, thickness: Partial<Omit<LensThickness, "id">>) => void;
  deleteLensThickness: (id: string) => void;
  
  // Contact lens methods
  addContactLens: (lens: Omit<ContactLensItem, "id">) => string;
  updateContactLens: (id: string, lens: Partial<Omit<ContactLensItem, "id">>) => void;
  deleteContactLens: (id: string) => void;
  searchContactLenses: (query: string) => ContactLensItem[];
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      frames: [],
      lensTypes: [
        { id: "lens1", name: "نظارات طبية للقراءة", type: "reading" },
        { id: "lens2", name: "نظارات للنظر البعيد", type: "distance" },
        { id: "lens3", name: "عدسات تقدمية", type: "progressive" },
        { id: "lens4", name: "عدسات ثنائية", type: "bifocal" },
        { id: "lens5", name: "عدسات شمسية", type: "sunglasses" }
      ],
      // Updated with categories
      lensCoatings: [
        { id: "coat1", name: "مضاد للانعكاس", price: 5, description: "Anti-Reflective Coating", category: "distance_reading" },
        { id: "coat2", name: "حماية شاشة", price: 7, description: "Blue Light Protection", category: "distance_reading" },
        { id: "coat3", name: "ضد الخدش", price: 8, description: "Scratch Resistant", category: "distance_reading" },
        { id: "coat4", name: "مضاد للانعكاس", price: 10, description: "Progressive Anti-Reflective", category: "progressive" },
        { id: "coat5", name: "حماية شاشة", price: 12, description: "Progressive Blue Light", category: "progressive" },
        { id: "coat6", name: "مضاد للانعكاس", price: 8, description: "Bifocal Anti-Reflective", category: "bifocal" },
      ],
      // New array for lens thicknesses with initial data
      lensThicknesses: [
        { id: "thick1", name: "قياسية", price: 5, description: "Standard Thickness", category: "distance_reading" },
        { id: "thick2", name: "خفيفة", price: 10, description: "Slim Lens", category: "distance_reading" },
        { id: "thick3", name: "فائقة الخفة", price: 15, description: "Ultra Slim", category: "distance_reading" },
        { id: "thick4", name: "قياسية", price: 8, description: "Standard Progressive", category: "progressive" },
        { id: "thick5", name: "خفيفة", price: 15, description: "Slim Progressive", category: "progressive" },
        { id: "thick6", name: "قياسية", price: 7, description: "Standard Bifocal", category: "bifocal" },
      ],
      contactLenses: [
        { id: "cl1", brand: "Acuvue", type: "Daily", bc: "8.5", diameter: "14.2", power: "-2.00", price: 25, qty: 30 },
        { id: "cl2", brand: "Biofinty", type: "Monthly", bc: "8.6", diameter: "14.0", power: "-3.00", price: 20, qty: 12 },
        { id: "cl3", brand: "Air Optix", type: "Monthly", bc: "8.4", diameter: "14.2", power: "+1.50", price: 22, qty: 8 }
      ],
      
      // Frame methods
      addFrame: (frame) => {
        const frameId = `FR${Date.now()}`;
        const createdAt = new Date().toISOString();
        
        set((state) => ({
          frames: [
            ...state.frames,
            { ...frame, frameId, createdAt }
          ]
        }));
        
        return frameId;
      },
      
      updateFrameQuantity: (frameId, newQty) => {
        set((state) => ({
          frames: state.frames.map(frame => 
            frame.frameId === frameId 
              ? { ...frame, qty: newQty } 
              : frame
          )
        }));
      },
      
      searchFrames: (query) => {
        if (!query) return get().frames;
        
        const q = query.toLowerCase();
        return get().frames.filter(frame => 
          frame.brand.toLowerCase().includes(q) || 
          frame.model.toLowerCase().includes(q) || 
          frame.color.toLowerCase().includes(q) || 
          frame.size.toLowerCase().includes(q)
        );
      },
      
      getFrameById: (id) => {
        return get().frames.find(frame => frame.frameId === id);
      },
      
      // Lens methods
      addLensType: (lens) => {
        const id = `lens${Date.now()}`;
        
        set((state) => ({
          lensTypes: [...state.lensTypes, { ...lens, id }]
        }));
        
        return id;
      },
      
      updateLensType: (id, lens) => {
        set((state) => ({
          lensTypes: state.lensTypes.map(type => 
            type.id === id ? { ...type, ...lens } : type
          )
        }));
      },
      
      deleteLensType: (id) => {
        set((state) => ({
          lensTypes: state.lensTypes.filter(type => type.id !== id)
        }));
      },
      
      // Coating methods
      addLensCoating: (coating) => {
        const id = `coat${Date.now()}`;
        
        set((state) => ({
          lensCoatings: [...state.lensCoatings, { ...coating, id }]
        }));
        
        return id;
      },
      
      updateLensCoating: (id, coating) => {
        set((state) => ({
          lensCoatings: state.lensCoatings.map(item => 
            item.id === id ? { ...item, ...coating } : item
          )
        }));
      },
      
      deleteLensCoating: (id) => {
        set((state) => ({
          lensCoatings: state.lensCoatings.filter(item => item.id !== id)
        }));
      },
      
      // Thickness methods - new methods
      addLensThickness: (thickness) => {
        const id = `thick${Date.now()}`;
        
        set((state) => ({
          lensThicknesses: [...state.lensThicknesses, { ...thickness, id }]
        }));
        
        return id;
      },
      
      updateLensThickness: (id, thickness) => {
        set((state) => ({
          lensThicknesses: state.lensThicknesses.map(item => 
            item.id === id ? { ...item, ...thickness } : item
          )
        }));
      },
      
      deleteLensThickness: (id) => {
        set((state) => ({
          lensThicknesses: state.lensThicknesses.filter(item => item.id !== id)
        }));
      },
      
      // Contact lens methods
      addContactLens: (lens) => {
        const id = `cl${Date.now()}`;
        
        set((state) => ({
          contactLenses: [...state.contactLenses, { ...lens, id }]
        }));
        
        return id;
      },
      
      updateContactLens: (id, lens) => {
        set((state) => ({
          contactLenses: state.contactLenses.map(item => 
            item.id === id ? { ...item, ...lens } : item
          )
        }));
      },
      
      deleteContactLens: (id) => {
        set((state) => ({
          contactLenses: state.contactLenses.filter(item => item.id !== id)
        }));
      },
      
      searchContactLenses: (query) => {
        if (!query) return get().contactLenses;
        
        const q = query.toLowerCase();
        return get().contactLenses.filter(lens => 
          lens.brand.toLowerCase().includes(q) || 
          lens.type.toLowerCase().includes(q) || 
          lens.power.includes(q) || 
          lens.bc.includes(q)
        );
      }
    }),
    {
      name: 'inventory-store'
    }
  )
);
