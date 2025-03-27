
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
  price?: number;
}

export interface LensCoating {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: "distance-reading" | "progressive" | "bifocal";
}

export interface LensThickness {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: "distance-reading" | "progressive" | "bifocal";
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
  lensThicknesses: LensThickness[];
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
  getLensCoatingsByCategory: (category: LensCoating['category']) => LensCoating[];
  
  // Thickness methods
  addLensThickness: (thickness: Omit<LensThickness, "id">) => string;
  updateLensThickness: (id: string, thickness: Partial<Omit<LensThickness, "id">>) => void;
  deleteLensThickness: (id: string) => void;
  getLensThicknessesByCategory: (category: LensThickness['category']) => LensThickness[];
  
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
        { id: "lens1", name: "نظارات طبية للقراءة", type: "reading", price: 15 },
        { id: "lens2", name: "نظارات للنظر البعيد", type: "distance", price: 15 },
        { id: "lens3", name: "عدسات تقدمية", type: "progressive", price: 25 },
        { id: "lens4", name: "عدسات ثنائية", type: "bifocal", price: 20 },
        { id: "lens5", name: "عدسات شمسية", type: "sunglasses", price: 18 }
      ],
      lensCoatings: [
        { id: "coat1", name: "مضاد للانعكاس", price: 5, description: "Anti-Reflective Coating", category: "distance-reading" },
        { id: "coat2", name: "حماية شاشة", price: 7, description: "Blue Light Protection", category: "distance-reading" },
        { id: "coat3", name: "ضد الخدش", price: 8, description: "Scratch Resistant", category: "distance-reading" },
        { id: "coat4", name: "مضاد للانعكاس للعدسات التقدمية", price: 10, description: "Anti-Reflective for Progressive", category: "progressive" },
        { id: "coat5", name: "حماية شاشة للعدسات التقدمية", price: 12, description: "Blue Light Protection for Progressive", category: "progressive" },
        { id: "coat6", name: "مضاد للانعكاس للعدسات الثنائية", price: 8, description: "Anti-Reflective for Bifocal", category: "bifocal" },
        { id: "coat7", name: "حماية شاشة للعدسات الثنائية", price: 9, description: "Blue Light Protection for Bifocal", category: "bifocal" }
      ],
      lensThicknesses: [
        { id: "thick1", name: "عادي", price: 0, description: "Standard Thickness", category: "distance-reading" },
        { id: "thick2", name: "رقيق", price: 10, description: "Thin", category: "distance-reading" },
        { id: "thick3", name: "رقيق جداً", price: 20, description: "Ultra Thin", category: "distance-reading" },
        { id: "thick4", name: "عادي للعدسات التقدمية", price: 5, description: "Standard for Progressive", category: "progressive" },
        { id: "thick5", name: "رقيق للعدسات التقدمية", price: 15, description: "Thin for Progressive", category: "progressive" },
        { id: "thick6", name: "عادي للعدسات الثنائية", price: 3, description: "Standard for Bifocal", category: "bifocal" },
        { id: "thick7", name: "رقيق للعدسات الثنائية", price: 12, description: "Thin for Bifocal", category: "bifocal" }
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
      
      getLensCoatingsByCategory: (category) => {
        return get().lensCoatings.filter(coating => coating.category === category);
      },
      
      // Thickness methods
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
      
      getLensThicknessesByCategory: (category) => {
        return get().lensThicknesses.filter(thickness => thickness.category === category);
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
