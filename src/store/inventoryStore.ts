
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
  price: number;
  type: "distance" | "reading" | "progressive" | "bifocal" | "sunglasses";
}

export interface LensCoating {
  id: string;
  name: string;
  price: number;
  description?: string;
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
}

interface InventoryState {
  frames: FrameItem[];
  lensTypes: LensType[];
  lensCoatings: LensCoating[];
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
        { id: "lens1", name: "نظارات طبية للقراءة", price: 15, type: "reading" },
        { id: "lens2", name: "نظارات للنظر البعيد", price: 20, type: "distance" },
        { id: "lens3", name: "عدسات تقدمية", price: 40, type: "progressive" },
        { id: "lens4", name: "عدسات ثنائية", price: 25, type: "bifocal" },
        { id: "lens5", name: "عدسات شمسية", price: 30, type: "sunglasses" }
      ],
      lensCoatings: [
        { id: "coat1", name: "مضاد للانعكاس", price: 5, description: "Anti-Reflective Coating" },
        { id: "coat2", name: "حماية شاشة", price: 7, description: "Blue Light Protection" },
        { id: "coat3", name: "ضد الخدش", price: 8, description: "Scratch Resistant" }
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
