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

export interface LensPricingCombination {
  id: string;
  lensTypeId: string;
  coatingId: string;
  thicknessId: string;
  price: number;
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

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "exam" | "repair" | "other";
}

interface InventoryState {
  frames: FrameItem[];
  lensTypes: LensType[];
  lensCoatings: LensCoating[];
  lensThicknesses: LensThickness[];
  lensPricingCombinations: LensPricingCombination[];
  contactLenses: ContactLensItem[];
  services: ServiceItem[];
  
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
  
  // Pricing combination methods
  addLensPricingCombination: (combination: Omit<LensPricingCombination, "id">) => string;
  updateLensPricingCombination: (id: string, combination: Partial<Omit<LensPricingCombination, "id">>) => void;
  deleteLensPricingCombination: (id: string) => void;
  getLensPriceByCombination: (lensTypeId: string, coatingId: string, thicknessId: string) => number | undefined;
  getPricingCombinationsForLensTypeAndCoating: (lensTypeId: string, coatingId: string) => LensPricingCombination[];
  
  // Contact lens methods
  addContactLens: (lens: Omit<ContactLensItem, "id">) => string;
  updateContactLens: (id: string, lens: Partial<Omit<ContactLensItem, "id">>) => void;
  deleteContactLens: (id: string) => void;
  searchContactLenses: (query: string) => ContactLensItem[];
  
  // Service methods
  addService: (service: Omit<ServiceItem, "id">) => string;
  updateService: (id: string, service: Partial<Omit<ServiceItem, "id">>) => void;
  deleteService: (id: string) => void;
  getServiceById: (id: string) => ServiceItem | undefined;
  getServicesByCategory: (category: ServiceItem['category']) => ServiceItem[];
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
      lensCoatings: [
        { id: "coat1", name: "مضاد للانعكاس", price: 5, description: "Anti-Reflective Coating", category: "distance-reading" },
        { id: "coat2", name: "حماية شاشة", price: 7, description: "Blue Light Protection", category: "distance-reading" },
        { id: "coat3", name: "ضد الخدش", price: 8, description: "Scratch Resistant", category: "distance-reading" },
        { id: "coat4", name: "مضاد للانعكاس للعدسات التقدمية", price: 10, description: "Anti-Reflective for Progressive", category: "progressive" },
        { id: "coat5", name: "حماية شاشة للعدسات التقدمية", price: 12, description: "Blue Light Protection for Progressive", category: "progressive" },
        { id: "coat6", name: "مضاد للانعكاس للعدسات الثنائية", price: 8, description: "Anti-Reflective for Bifocal", category: "bifocal" },
        { id: "coat7", name: "حماية شاشة للعدسات الثنائية", price: 9, description: "Blue Light Protection for Bifocal", category: "bifocal" },
        
        // New coating items for distance-reading
        { id: "coat8", name: "Basic (عادي)", price: 0, description: "Basic Coating", category: "distance-reading" },
        { id: "coat9", name: "Filter (فلتر)", price: 0, description: "Filter Coating", category: "distance-reading" },
        { id: "coat10", name: "Super Filter (سوبر فلتر)", price: 0, description: "Super Filter Coating", category: "distance-reading" },
        
        // New coating items for progressive
        { id: "coat11", name: "Basic (عادي)", price: 0, description: "Basic Coating for Progressive", category: "progressive" },
        { id: "coat12", name: "Filter (فلتر)", price: 0, description: "Filter Coating for Progressive", category: "progressive" },
        { id: "coat13", name: "Super Filter (سوبر فلتر)", price: 0, description: "Super Filter Coating for Progressive", category: "progressive" },
        
        // New coating items for bifocal
        { id: "coat14", name: "Basic (عادي)", price: 0, description: "Basic Coating for Bifocal", category: "bifocal" },
        { id: "coat15", name: "Filter (فلتر)", price: 0, description: "Filter Coating for Bifocal", category: "bifocal" },
        { id: "coat16", name: "Super Filter (سوبر فلتر)", price: 0, description: "Super Filter Coating for Bifocal", category: "bifocal" }
      ],
      lensThicknesses: [
        { id: "thick1", name: "عادي", price: 0, description: "Standard Thickness", category: "distance-reading" },
        { id: "thick2", name: "رقيق", price: 10, description: "Thin", category: "distance-reading" },
        { id: "thick3", name: "رقيق جداً", price: 20, description: "Ultra Thin", category: "distance-reading" },
        { id: "thick4", name: "عادي للعدسات التقدمية", price: 5, description: "Standard for Progressive", category: "progressive" },
        { id: "thick5", name: "رقيق للعدسات التقدمية", price: 15, description: "Thin for Progressive", category: "progressive" },
        { id: "thick6", name: "عادي للعدسات الثنائية", price: 3, description: "Standard for Bifocal", category: "bifocal" },
        { id: "thick7", name: "رقيق للعدسات الثنائية", price: 12, description: "Thin for Bifocal", category: "bifocal" },
        
        // New thickness items for distance-reading
        { id: "thick8", name: "1.56 عادي (Standard)", price: 0, description: "Standard 1.56 Thickness", category: "distance-reading" },
        { id: "thick9", name: "Standard Thickness", price: 0, description: "Standard Thickness", category: "distance-reading" },
        { id: "thick10", name: "Polycarbonate", price: 0, description: "Polycarbonate Material", category: "distance-reading" },
        { id: "thick11", name: "1.6 Thin (رقيق)", price: 0, description: "1.6 Thin Lens", category: "distance-reading" },
        { id: "thick12", name: "1.67 Super Thin (رقيق جداً)", price: 0, description: "1.67 Super Thin Lens", category: "distance-reading" },
        { id: "thick13", name: "1.75 Ultra Thin (فائق الرقة)", price: 0, description: "1.75 Ultra Thin Lens", category: "distance-reading" },
        
        // New thickness items for progressive
        { id: "thick14", name: "1.56 عادي (Standard)", price: 0, description: "Standard 1.56 Thickness for Progressive", category: "progressive" },
        { id: "thick15", name: "Standard Thickness", price: 0, description: "Standard Thickness for Progressive", category: "progressive" },
        { id: "thick16", name: "Polycarbonate", price: 0, description: "Polycarbonate Material for Progressive", category: "progressive" },
        { id: "thick17", name: "1.6 Thin (رقيق)", price: 0, description: "1.6 Thin Lens for Progressive", category: "progressive" },
        { id: "thick18", name: "1.67 Super Thin (رقيق جداً)", price: 0, description: "1.67 Super Thin Lens for Progressive", category: "progressive" },
        { id: "thick19", name: "1.75 Ultra Thin (فائق الرقة)", price: 0, description: "1.75 Ultra Thin Lens for Progressive", category: "progressive" },
        
        // New thickness items for bifocal
        { id: "thick20", name: "1.56 عادي (Standard)", price: 0, description: "Standard 1.56 Thickness for Bifocal", category: "bifocal" },
        { id: "thick21", name: "Standard Thickness", price: 0, description: "Standard Thickness for Bifocal", category: "bifocal" },
        { id: "thick22", name: "Polycarbonate", price: 0, description: "Polycarbonate Material for Bifocal", category: "bifocal" },
        { id: "thick23", name: "1.6 Thin (رقيق)", price: 0, description: "1.6 Thin Lens for Bifocal", category: "bifocal" },
        { id: "thick24", name: "1.67 Super Thin (رقيق جداً)", price: 0, description: "1.67 Super Thin Lens for Bifocal", category: "bifocal" },
        { id: "thick25", name: "1.75 Ultra Thin (فائق الرقة)", price: 0, description: "1.75 Ultra Thin Lens for Bifocal", category: "bifocal" }
      ],
      lensPricingCombinations: [
        // Initial sample pricing combinations
        { id: "combo1", lensTypeId: "lens2", coatingId: "coat8", thicknessId: "thick8", price: 15 },
        { id: "combo2", lensTypeId: "lens2", coatingId: "coat8", thicknessId: "thick11", price: 25 },
        { id: "combo3", lensTypeId: "lens2", coatingId: "coat8", thicknessId: "thick12", price: 35 },
        { id: "combo4", lensTypeId: "lens2", coatingId: "coat9", thicknessId: "thick8", price: 20 },
        { id: "combo5", lensTypeId: "lens2", coatingId: "coat9", thicknessId: "thick11", price: 30 },
        { id: "combo6", lensTypeId: "lens2", coatingId: "coat10", thicknessId: "thick8", price: 25 },
        { id: "combo7", lensTypeId: "lens3", coatingId: "coat11", thicknessId: "thick14", price: 50 },
        { id: "combo8", lensTypeId: "lens3", coatingId: "coat12", thicknessId: "thick14", price: 60 },
        { id: "combo9", lensTypeId: "lens3", coatingId: "coat13", thicknessId: "thick14", price: 70 },
        { id: "combo10", lensTypeId: "lens4", coatingId: "coat14", thicknessId: "thick20", price: 40 },
      ],
      contactLenses: [
        { id: "cl1", brand: "Acuvue", type: "Daily", bc: "8.5", diameter: "14.2", power: "-2.00", price: 25, qty: 30 },
        { id: "cl2", brand: "Biofinty", type: "Monthly", bc: "8.6", diameter: "14.0", power: "-3.00", price: 20, qty: 12 },
        { id: "cl3", brand: "Air Optix", type: "Monthly", bc: "8.4", diameter: "14.2", power: "+1.50", price: 22, qty: 8 }
      ],
      services: [
        { 
          id: "service1", 
          name: "Eye Exam", 
          description: "Standard eye examination service to evaluate eye health and vision.", 
          price: 3, 
          category: "exam" 
        }
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
      
      // Pricing combination methods
      addLensPricingCombination: (combination) => {
        const id = `combo${Date.now()}`;
        
        set((state) => ({
          lensPricingCombinations: [...state.lensPricingCombinations, { ...combination, id }]
        }));
        
        return id;
      },
      
      updateLensPricingCombination: (id, combination) => {
        set((state) => ({
          lensPricingCombinations: state.lensPricingCombinations.map(combo => 
            combo.id === id ? { ...combo, ...combination } : combo
          )
        }));
      },
      
      deleteLensPricingCombination: (id) => {
        set((state) => ({
          lensPricingCombinations: state.lensPricingCombinations.filter(combo => combo.id !== id)
        }));
      },
      
      getLensPriceByCombination: (lensTypeId, coatingId, thicknessId) => {
        const combination = get().lensPricingCombinations.find(
          c => c.lensTypeId === lensTypeId && c.coatingId === coatingId && c.thicknessId === thicknessId
        );
        
        return combination?.price;
      },
      
      getPricingCombinationsForLensTypeAndCoating: (lensTypeId, coatingId) => {
        return get().lensPricingCombinations.filter(
          c => c.lensTypeId === lensTypeId && c.coatingId === coatingId
        );
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
      },
      
      // Service methods
      addService: (service) => {
        const id = `service${Date.now()}`;
        
        set((state) => ({
          services: [...state.services, { ...service, id }]
        }));
        
        return id;
      },
      
      updateService: (id, service) => {
        set((state) => ({
          services: state.services.map(item => 
            item.id === id ? { ...item, ...service } : item
          )
        }));
      },
      
      deleteService: (id) => {
        set((state) => ({
          services: state.services.filter(item => item.id !== id)
        }));
      },
      
      getServiceById: (id) => {
        return get().services.find(service => service.id === id);
      },
      
      getServicesByCategory: (category) => {
        return get().services.filter(service => service.category === category);
      }
    }),
    {
      name: 'inventory-store',
      version: 2
    }
  )
);
