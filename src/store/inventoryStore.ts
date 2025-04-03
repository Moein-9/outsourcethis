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
  category: string; // Changed to string type to support multiple categories
  categories?: ("distance-reading" | "progressive" | "bifocal")[]; // New field to support multiple categories
  isPhotochromic?: boolean;
  availableColors?: string[];
}

export interface LensThickness {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: string; // Changed to string type to support multiple categories
  categories?: ("distance-reading" | "progressive" | "bifocal")[]; // New field to support multiple categories
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

export interface LensPricingCombination {
  id: string;
  lensTypeId: string;
  coatingId: string;
  thicknessId: string;
  price: number;
}

interface InventoryState {
  frames: FrameItem[];
  lensTypes: LensType[];
  lensCoatings: LensCoating[];
  lensThicknesses: LensThickness[];
  contactLenses: ContactLensItem[];
  services: ServiceItem[];
  lensPricingCombinations: LensPricingCombination[];
  
  addFrame: (frame: Omit<FrameItem, "frameId" | "createdAt">) => string;
  updateFrameQuantity: (frameId: string, newQty: number) => void;
  searchFrames: (query: string) => FrameItem[];
  getFrameById: (id: string) => FrameItem | undefined;
  
  addLensType: (lens: Omit<LensType, "id">) => string;
  updateLensType: (id: string, lens: Partial<Omit<LensType, "id">>) => void;
  deleteLensType: (id: string) => void;
  
  addLensCoating: (coating: Omit<LensCoating, "id">) => string;
  updateLensCoating: (id: string, coating: Partial<Omit<LensCoating, "id">>) => void;
  deleteLensCoating: (id: string) => void;
  getLensCoatingsByCategory: (category: "distance-reading" | "progressive" | "bifocal") => LensCoating[];
  getAvailableCoatings: (lensTypeId: string, category: "distance-reading" | "progressive" | "bifocal") => LensCoating[];
  
  addLensThickness: (thickness: Omit<LensThickness, "id">) => string;
  updateLensThickness: (id: string, thickness: Partial<Omit<LensThickness, "id">>) => void;
  deleteLensThickness: (id: string) => void;
  getLensThicknessesByCategory: (category: "distance-reading" | "progressive" | "bifocal") => LensThickness[];
  getAvailableThicknesses: (lensTypeId: string, coatingId: string, category: "distance-reading" | "progressive" | "bifocal") => LensThickness[];
  
  addContactLens: (lens: Omit<ContactLensItem, "id">) => string;
  updateContactLens: (id: string, lens: Partial<Omit<ContactLensItem, "id">>) => void;
  deleteContactLens: (id: string) => void;
  searchContactLenses: (query: string) => ContactLensItem[];
  
  addService: (service: Omit<ServiceItem, "id">) => string;
  updateService: (id: string, service: Partial<Omit<ServiceItem, "id">>) => void;
  deleteService: (id: string) => void;
  getServiceById: (id: string) => ServiceItem | undefined;
  getServicesByCategory: (category: ServiceItem['category']) => ServiceItem[];
  
  addLensPricingCombination: (combination: Omit<LensPricingCombination, "id">) => string;
  updateLensPricingCombination: (id: string, combination: Partial<Omit<LensPricingCombination, "id">>) => void;
  deleteLensPricingCombination: (id: string) => void;
  getLensPricingCombinations: () => LensPricingCombination[];
  getLensPricingByComponents: (lensTypeId: string, coatingId: string, thicknessId: string) => number | null;
  
  cleanupSamplePhotochromicCoatings: () => void;
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
      // Consolidated lens coatings with categories field
      lensCoatings: [
        { 
          id: "coat1", 
          name: "مضاد للانعكاس", 
          price: 5, 
          description: "Anti-Reflective Coating", 
          category: "all",
          categories: ["distance-reading", "progressive", "bifocal"]
        },
        { 
          id: "coat2", 
          name: "حماية شاشة", 
          price: 7, 
          description: "Blue Light Protection", 
          category: "all",
          categories: ["distance-reading", "progressive", "bifocal"]
        },
        { 
          id: "coat3", 
          name: "ضد الخدش", 
          price: 8, 
          description: "Scratch Resistant", 
          category: "all",
          categories: ["distance-reading", "progressive", "bifocal"] 
        },
        // Basic coating items (consolidated)
        { 
          id: "coat8", 
          name: "Basic (عادي)", 
          price: 0, 
          description: "Basic Coating", 
          category: "all",
          categories: ["distance-reading", "progressive", "bifocal"]
        },
        { 
          id: "coat9", 
          name: "Filter (فلتر)", 
          price: 0, 
          description: "Filter Coating", 
          category: "all",
          categories: ["distance-reading", "progressive", "bifocal"]
        },
        { 
          id: "coat10", 
          name: "Super Filter (سوبر فلتر)", 
          price: 0, 
          description: "Super Filter Coating", 
          category: "all",
          categories: ["distance-reading", "progressive", "bifocal"]
        },
        // Photochromic coating (consolidated)
        { 
          id: "coat17", 
          name: "Photochromic (فوتوكروميك)", 
          price: 15, 
          description: "Photochromic lenses that darken in sunlight", 
          category: "all",
          categories: ["distance-reading", "progressive", "bifocal"],
          isPhotochromic: true,
          availableColors: ["Brown", "Gray", "Green", "Blue"]
        }
      ],
      // Consolidated lens thicknesses with categories field
      lensThicknesses: [
        { 
          id: "thick1", 
          name: "عادي", 
          price: 0, 
          description: "Standard Thickness", 
          category: "all",
          categories: ["distance-reading", "progressive", "bifocal"]
        },
        { 
          id: "thick2", 
          name: "رقيق", 
          price: 10, 
          description: "Thin", 
          category: "all",
          categories: ["distance-reading", "progressive", "bifocal"]
        },
        { 
          id: "thick3", 
          name: "رقيق جداً", 
          price: 20, 
          description: "Ultra Thin", 
          category: "all",
          categories: ["distance-reading", "progressive", "bifocal"]
        },
        // Consolidated thickness items
        { 
          id: "thick8", 
          name: "1.56 عادي (Standard)", 
          price: 0, 
          description: "Standard 1.56 Thickness", 
          category: "all",
          categories: ["distance-reading", "progressive", "bifocal"]
        },
        { 
          id: "thick9", 
          name: "Standard Thickness", 
          price: 0, 
          description: "Standard Thickness", 
          category: "all",
          categories: ["distance-reading", "progressive", "bifocal"]
        },
        { 
          id: "thick10", 
          name: "Polycarbonate", 
          price: 0, 
          description: "Polycarbonate Material", 
          category: "all",
          categories: ["distance-reading", "progressive", "bifocal"]
        },
        { 
          id: "thick11", 
          name: "1.6 Thin (رقيق)", 
          price: 0, 
          description: "1.6 Thin Lens", 
          category: "all",
          categories: ["distance-reading", "progressive", "bifocal"]
        },
        { 
          id: "thick12", 
          name: "1.67 Super Thin (رقيق جداً)", 
          price: 0, 
          description: "1.67 Super Thin Lens", 
          category: "all",
          categories: ["distance-reading", "progressive", "bifocal"]
        },
        { 
          id: "thick13", 
          name: "1.75 Ultra Thin (فائق الرقة)", 
          price: 0, 
          description: "1.75 Ultra Thin Lens", 
          category: "all",
          categories: ["distance-reading", "progressive", "bifocal"]
        }
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
      // Keep pricing combinations the same since IDs are still valid
      lensPricingCombinations: [
        {
          id: "combo1",
          lensTypeId: "lens2",
          coatingId: "coat8",
          thicknessId: "thick8",
          price: 15
        },
        {
          id: "combo2",
          lensTypeId: "lens2",
          coatingId: "coat8",
          thicknessId: "thick11",
          price: 25
        },
        {
          id: "combo3",
          lensTypeId: "lens2",
          coatingId: "coat9",
          thicknessId: "thick8",
          price: 20
        },
        {
          id: "combo4",
          lensTypeId: "lens3",
          coatingId: "coat8",
          thicknessId: "thick8",
          price: 40
        },
        
        // Add pricing combinations for photochromic coatings
        // Distance-reading combinations
        {
          id: "combo5",
          lensTypeId: "lens2",
          coatingId: "coat17",
          thicknessId: "thick8",
          price: 30
        },
        {
          id: "combo6",
          lensTypeId: "lens2",
          coatingId: "coat17",
          thicknessId: "thick11",
          price: 40
        },
        {
          id: "combo7",
          lensTypeId: "lens1",
          coatingId: "coat17",
          thicknessId: "thick8",
          price: 30
        },
        {
          id: "combo8",
          lensTypeId: "lens1",
          coatingId: "coat17",
          thicknessId: "thick11",
          price: 40
        },
        // Progressive combinations
        {
          id: "combo9",
          lensTypeId: "lens3",
          coatingId: "coat17",
          thicknessId: "thick8",
          price: 55
        },
        {
          id: "combo10",
          lensTypeId: "lens3",
          coatingId: "coat17",
          thicknessId: "thick11",
          price: 65
        },
        // Bifocal combinations
        {
          id: "combo11",
          lensTypeId: "lens4",
          coatingId: "coat17",
          thicknessId: "thick8",
          price: 45
        },
        {
          id: "combo12",
          lensTypeId: "lens4",
          coatingId: "coat17",
          thicknessId: "thick11",
          price: 55
        }
      ],
      
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
      
      // Updated to check categories array
      getLensCoatingsByCategory: (category) => {
        return get().lensCoatings.filter(coating => 
          coating.category === "all" || 
          coating.category === category || 
          (coating.categories && coating.categories.includes(category))
        );
      },
      
      // Updated to filter by categories
      getAvailableCoatings: (lensTypeId, category) => {
        const combinations = get().lensPricingCombinations;
        
        // Find all unique coating IDs that have a combination with this lens type
        const availableCoatingIds = [...new Set(
          combinations
            .filter(combo => combo.lensTypeId === lensTypeId)
            .map(combo => combo.coatingId)
        )];
        
        // Get the actual coating objects for these IDs
        const availableCoatings = get().lensCoatings.filter(
          coating => availableCoatingIds.includes(coating.id) && 
          (coating.category === "all" || 
           coating.category === category || 
           (coating.categories && coating.categories.includes(category)))
        );
        
        return availableCoatings;
      },
      
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
      
      // Updated to check categories array
      getLensThicknessesByCategory: (category) => {
        return get().lensThicknesses.filter(thickness => 
          thickness.category === "all" || 
          thickness.category === category || 
          (thickness.categories && thickness.categories.includes(category))
        );
      },
      
      // Updated to filter by categories
      getAvailableThicknesses: (lensTypeId, coatingId, category) => {
        const combinations = get().lensPricingCombinations;
        
        // Find all unique thickness IDs that have a combination with this lens type and coating
        const availableThicknessIds = [...new Set(
          combinations
            .filter(combo => combo.lensTypeId === lensTypeId && combo.coatingId === coatingId)
            .map(combo => combo.thicknessId)
        )];
        
        // Get the actual thickness objects for these IDs
        const availableThicknesses = get().lensThicknesses.filter(
          thickness => availableThicknessIds.includes(thickness.id) && 
          (thickness.category === "all" || 
           thickness.category === category || 
           (thickness.categories && thickness.categories.includes(category)))
        );
        
        return availableThicknesses;
      },
      
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
      },
      
      addLensPricingCombination: (combination) => {
        const id = `combo${Date.now()}`;
        
        set((state) => ({
          lensPricingCombinations: [...state.lensPricingCombinations, { ...combination, id }]
        }));
        
        return id;
      },
      
      updateLensPricingCombination: (id, combination) => {
        set((state) => ({
          lensPricingCombinations: state.lensPricingCombinations.map(item => 
            item.id === id ? { ...item, ...combination } : item
          )
        }));
      },
      
      deleteLensPricingCombination: (id) => {
        set((state) => ({
          lensPricingCombinations: state.lensPricingCombinations.filter(item => item.id !== id)
        }));
      },
      
      getLensPricingCombinations: () => {
        return get().lensPricingCombinations;
      },
      
      getLensPricingByComponents: (lensTypeId: string, coatingId: string, thicknessId: string) => {
        const combination = get().lensPricingCombinations.find(
          c => c.lensTypeId === lensTypeId && 
               c.coatingId === coatingId && 
               c.thicknessId === thicknessId
        );
        
        if (combination) {
          return combination.price;
        }
        
        return null;
      },
      
      cleanupSamplePhotochromicCoatings: () => {
        const state = get();
        
        // Find sample photochromic coatings
        const sampleCoatingIds = state.lensCoatings
          .filter(coating => coating.name === "Sample Photochromic" && coating.isPhotochromic)
          .map(coating => coating.id);
        
        if (sampleCoatingIds.length > 0) {
          // Remove sample coating price combinations
          const updatedCombinations = state.lensPricingCombinations.filter(
            combo => !sampleCoatingIds.includes(combo.coatingId)
          );
          
          // Remove sample coatings
          const updatedCoatings = state.lensCoatings.filter(
            coating => !sampleCoatingIds.includes(coating.id)
          );
          
          // Update the state
          set({
            lensCoatings: updatedCoatings,
            lensPricingCombinations: updatedCombinations
          });
        }
      }
    }),
    {
      name: 'inventory-store',
      version: 3
    }
  )
);
