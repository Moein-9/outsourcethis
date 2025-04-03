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
  category: "distance-reading" | "progressive" | "bifocal" | "sunglasses";
  isPhotochromic?: boolean;
  availableColors?: string[];
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
  getLensCoatingsByCategory: (category: LensCoating['category']) => LensCoating[];
  getAvailableCoatings: (lensTypeId: string, category: LensCoating['category']) => LensCoating[];
  
  addLensThickness: (thickness: Omit<LensThickness, "id">) => string;
  updateLensThickness: (id: string, thickness: Partial<Omit<LensThickness, "id">>) => void;
  deleteLensThickness: (id: string) => void;
  getLensThicknessesByCategory: (category: LensThickness['category']) => LensThickness[];
  getAvailableThicknesses: (lensTypeId: string, coatingId: string, category: LensThickness['category']) => LensThickness[];
  
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
  resetLensPricing: () => void;
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
        { id: "lens5", name: "عدسات شمسية", type: "sunglasses" },
        { id: "lens6", name: "عدسات تقدمية PRO", type: "progressive" }
      ],
      lensCoatings: [
        // Basic lens coatings for Single Vision
        { 
          id: "basic-sv", 
          name: "Basic (عادي)", 
          price: 0, 
          description: "Basic coating for single vision lenses", 
          category: "distance-reading" 
        },
        // Filter lens coatings for Single Vision
        { 
          id: "filter-sv", 
          name: "Filter (فلتر)", 
          price: 0, 
          description: "Filter coating for single vision lenses", 
          category: "distance-reading" 
        },
        // Super Filter lens coatings for Single Vision
        { 
          id: "super-filter-sv", 
          name: "Super Filter (سوبر فلتر)", 
          price: 0, 
          description: "Super filter coating for single vision lenses", 
          category: "distance-reading" 
        },
        
        // Basic lens coatings for Progressive
        { 
          id: "basic-prog", 
          name: "Basic (عادي)", 
          price: 0, 
          description: "Basic coating for progressive lenses", 
          category: "progressive" 
        },
        // Filter lens coatings for Progressive
        { 
          id: "filter-prog", 
          name: "Filter (فلتر)", 
          price: 0, 
          description: "Filter coating for progressive lenses", 
          category: "progressive" 
        },
        
        // Basic lens coatings for Bifocal
        { 
          id: "basic-bif", 
          name: "Basic (عادي)", 
          price: 0, 
          description: "Basic coating for bifocal lenses", 
          category: "bifocal" 
        },
        // Filter lens coatings for Bifocal
        { 
          id: "filter-bif", 
          name: "Filter (فلتر)", 
          price: 0, 
          description: "Filter coating for bifocal lenses", 
          category: "bifocal" 
        },
        
        // Photochromic lens coatings
        { 
          id: "photochromic-sv", 
          name: "Photochromic (فوتوكروميك)", 
          price: 0, 
          description: "Photochromic coating for single vision lenses", 
          category: "distance-reading",
          isPhotochromic: true,
          availableColors: ["Brown", "Gray", "Green"]
        },
        { 
          id: "photochromic-prog", 
          name: "Photochromic (فوتوكروميك)", 
          price: 0, 
          description: "Photochromic coating for progressive lenses", 
          category: "progressive",
          isPhotochromic: true,
          availableColors: ["Brown", "Gray", "Green"]
        },
        
        // Sunglasses coatings
        { 
          id: "tinted-sun", 
          name: "Tinted (ملون)", 
          price: 0, 
          description: "Standard tinted sunglasses coating", 
          category: "sunglasses" 
        },
        { 
          id: "polarized-sun", 
          name: "Polarized (مستقطب)", 
          price: 0, 
          description: "Polarized coating for sunglasses", 
          category: "sunglasses" 
        },
        { 
          id: "mirrored-sun", 
          name: "Mirrored (مرآة)", 
          price: 0, 
          description: "Mirrored coating for sunglasses", 
          category: "sunglasses",
          availableColors: ["Silver", "Blue", "Gold", "Red"] 
        }
      ],
      lensThicknesses: [
        // Single Vision thicknesses
        { id: "sv-156", name: "1.56", price: 0, description: "Standard thickness (1.56)", category: "distance-reading" },
        { id: "sv-160", name: "1.60", price: 0, description: "Thin lens (1.60)", category: "distance-reading" },
        { id: "sv-167", name: "1.67", price: 0, description: "Super thin lens (1.67)", category: "distance-reading" },
        { id: "sv-174", name: "1.74", price: 0, description: "Ultra thin lens (1.74)", category: "distance-reading" },
        { id: "sv-poly", name: "Polycarbonate", price: 0, description: "Polycarbonate material", category: "distance-reading" },
        
        // Progressive thicknesses
        { id: "prog-156", name: "1.56", price: 0, description: "Standard thickness for progressive (1.56)", category: "progressive" },
        { id: "prog-160", name: "1.60", price: 0, description: "Thin lens for progressive (1.60)", category: "progressive" },
        { id: "prog-167", name: "1.67", price: 0, description: "Super thin lens for progressive (1.67)", category: "progressive" },
        { id: "prog-174", name: "1.74", price: 0, description: "Ultra thin lens for progressive (1.74)", category: "progressive" },
        { id: "prog-poly", name: "Polycarbonate", price: 0, description: "Polycarbonate material for progressive", category: "progressive" },
        
        // Bifocal thicknesses
        { id: "bif-basic", name: "Basic", price: 0, description: "Standard thickness for bifocal", category: "bifocal" },
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
      lensPricingCombinations: [
        // Initial empty array - will be populated with updated pricing
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
        
        if (coating.category === "sunglasses") {
          const store = get();
          const sunglassesLensType = store.lensTypes.find(lt => lt.type === "sunglasses");
          
          if (sunglassesLensType) {
            const basicThickness = store.lensThicknesses.find(t => t.id === "sv-156");
            
            if (basicThickness) {
              const defaultPrice = coating.price || 25;
              store.addLensPricingCombination({
                lensTypeId: sunglassesLensType.id,
                coatingId: id,
                thicknessId: basicThickness.id,
                price: defaultPrice
              });
              
              const thinnerThickness = store.lensThicknesses.find(t => t.id === "sv-160");
              if (thinnerThickness) {
                store.addLensPricingCombination({
                  lensTypeId: sunglassesLensType.id,
                  coatingId: id,
                  thicknessId: thinnerThickness.id,
                  price: defaultPrice + 10
                });
              }
            }
          }
        }
        
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
      
      getAvailableCoatings: (lensTypeId, category) => {
        const combinations = get().lensPricingCombinations;
        const allCoatingsByCategory = get().lensCoatings.filter(c => c.category === category);
        
        const lensType = get().lensTypes.find(lt => lt.id === lensTypeId);
        if (lensType && lensType.type === "sunglasses" && category === "sunglasses") {
          return allCoatingsByCategory;
        }
        
        const availableCoatingIds = [...new Set(
          combinations
            .filter(combo => combo.lensTypeId === lensTypeId)
            .map(combo => combo.coatingId)
        )];
        
        const availableCoatings = get().lensCoatings.filter(
          coating => availableCoatingIds.includes(coating.id) && coating.category === category
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
      
      getLensThicknessesByCategory: (category) => {
        return get().lensThicknesses.filter(thickness => thickness.category === category);
      },
      
      getAvailableThicknesses: (lensTypeId, coatingId, category) => {
        const combinations = get().lensPricingCombinations;
        
        const availableThicknessIds = [...new Set(
          combinations
            .filter(combo => combo.lensTypeId === lensTypeId && combo.coatingId === coatingId)
            .map(combo => combo.thicknessId)
        )];
        
        const availableThicknesses = get().lensThicknesses.filter(
          thickness => availableThicknessIds.includes(thickness.id) && thickness.category === category
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
        
        const sampleCoatingIds = state.lensCoatings
          .filter(coating => coating.name === "Sample Photochromic" && coating.isPhotochromic)
          .map(coating => coating.id);
        
        if (sampleCoatingIds.length > 0) {
          const updatedCombinations = state.lensPricingCombinations.filter(
            combo => !sampleCoatingIds.includes(combo.coatingId)
          );
          
          const updatedCoatings = state.lensCoatings.filter(
            coating => !sampleCoatingIds.includes(coating.id)
          );
          
          set({
            lensCoatings: updatedCoatings,
            lensPricingCombinations: updatedCombinations
          });
        }
      },
      
      resetLensPricing: () => {
        const newPricingCombinations: LensPricingCombination[] = [
          // Single Vision - Basic Lenses
          { id: "sv-basic-156", lensTypeId: "lens2", coatingId: "basic-sv", thicknessId: "sv-156", price: 8 },
          { id: "sv-basic-160", lensTypeId: "lens2", coatingId: "basic-sv", thicknessId: "sv-160", price: 18 },
          { id: "sv-basic-167", lensTypeId: "lens2", coatingId: "basic-sv", thicknessId: "sv-167", price: 30 },
          { id: "sv-basic-174", lensTypeId: "lens2", coatingId: "basic-sv", thicknessId: "sv-174", price: 40 },
          
          // Single Vision - Filter Lenses
          { id: "sv-filter-156", lensTypeId: "lens2", coatingId: "filter-sv", thicknessId: "sv-156", price: 13 },
          { id: "sv-filter-poly", lensTypeId: "lens2", coatingId: "filter-sv", thicknessId: "sv-poly", price: 18 },
          { id: "sv-filter-160", lensTypeId: "lens2", coatingId: "filter-sv", thicknessId: "sv-160", price: 20 },
          { id: "sv-filter-167", lensTypeId: "lens2", coatingId: "filter-sv", thicknessId: "sv-167", price: 38 },
          { id: "sv-filter-174", lensTypeId: "lens2", coatingId: "filter-sv", thicknessId: "sv-174", price: 43 },
          
          // Single Vision - Super Filter
          { id: "sv-superfilter-156", lensTypeId: "lens2", coatingId: "super-filter-sv", thicknessId: "sv-156", price: 18 },
          { id: "sv-superfilter-poly", lensTypeId: "lens2", coatingId: "super-filter-sv", thicknessId: "sv-poly", price: 25 },
          { id: "sv-superfilter-160", lensTypeId: "lens2", coatingId: "super-filter-sv", thicknessId: "sv-160", price: 28 },
          { id: "sv-superfilter-167", lensTypeId: "lens2", coatingId: "super-filter-sv", thicknessId: "sv-167", price: 35 },
          { id: "sv-superfilter-174", lensTypeId: "lens2", coatingId: "super-filter-sv", thicknessId: "sv-174", price: 40 },
          
          // Reading - Basic Lenses
          { id: "read-basic-156", lensTypeId: "lens1", coatingId: "basic-sv", thicknessId: "sv-156", price: 8 },
          { id: "read-basic-160", lensTypeId: "lens1", coatingId: "basic-sv", thicknessId: "sv-160", price: 18 },
          { id: "read-basic-167", lensTypeId: "lens1", coatingId: "basic-sv", thicknessId: "sv-167", price: 30 },
          { id: "read-basic-174", lensTypeId: "lens1", coatingId: "basic-sv", thicknessId: "sv-174", price: 40 },
          
          // Reading - Filter Lenses
          { id: "read-filter-156", lensTypeId: "lens1", coatingId: "filter-sv", thicknessId: "sv-156", price: 13 },
          { id: "read-filter-poly", lensTypeId: "lens1", coatingId: "filter-sv", thicknessId: "sv-poly", price: 18 },
          { id: "read-filter-160", lensTypeId: "lens1", coatingId: "filter-sv", thicknessId: "sv-160", price: 20 },
          { id: "read-filter-167", lensTypeId: "lens1", coatingId: "filter-sv", thicknessId: "sv-167", price: 38 },
          { id: "read-filter-174", lensTypeId: "lens1", coatingId: "filter-sv", thicknessId: "sv-174", price: 43 },
          
          // Reading - Super Filter
          { id: "read-superfilter-156", lensTypeId: "lens1", coatingId: "super-filter-sv", thicknessId: "sv-156", price: 18 },
          { id: "read-superfilter-poly", lensTypeId: "lens1", coatingId: "super-filter-sv", thicknessId: "sv-poly", price: 25 },
          { id: "read-superfilter-160", lensTypeId: "lens1", coatingId: "super-filter-sv", thicknessId: "sv-160", price: 28 },
          { id: "read-superfilter-167", lensTypeId: "lens1", coatingId: "super-filter-sv", thicknessId: "sv-167", price: 35 },
          { id: "read-superfilter-174", lensTypeId: "lens1", coatingId: "super-filter-sv", thicknessId: "sv-174", price: 40 },
          
          // Progressive - Basic
          { id: "prog-basic-156", lensTypeId: "lens3", coatingId: "basic-prog", thicknessId: "prog-156", price: 35 },
          { id: "prog-basic-160", lensTypeId: "lens3", coatingId: "basic-prog", thicknessId: "prog-160", price: 50 },
          { id: "prog-basic-167", lensTypeId: "lens3", coatingId: "basic-prog", thicknessId: "prog-167", price: 80 },
          { id: "prog-basic-174", lensTypeId: "lens3", coatingId: "basic-prog", thicknessId: "prog-174", price: 100 },
          
          // Progressive - Filter
          { id: "prog-filter-156", lensTypeId: "lens3", coatingId: "filter-prog", thicknessId: "prog-156", price: 50 },
          { id: "prog-filter-poly", lensTypeId: "lens3", coatingId: "filter-prog", thicknessId: "prog-poly", price: 70 },
          { id: "prog-filter-160", lensTypeId: "lens3", coatingId: "filter-prog", thicknessId: "prog-160", price: 85 },
          { id: "prog-filter-167", lensTypeId: "lens3", coatingId: "filter-prog", thicknessId: "prog-167", price: 114 },
          { id: "prog-filter-174", lensTypeId: "lens3", coatingId: "filter-prog", thicknessId: "prog-174", price: 200 },
          
          // PRO Progressive - Basic
          { id: "prog-pro-basic-156", lensTypeId: "lens6", coatingId: "basic-prog", thicknessId: "prog-156", price: 55 },
          { id: "prog-pro-basic-poly", lensTypeId: "lens6", coatingId: "basic-prog", thicknessId: "prog-poly", price: 85 },
          { id: "prog-pro-basic-160", lensTypeId: "lens6", coatingId: "basic-prog", thicknessId: "prog-160", price: 100 },
          { id: "prog-pro-basic-167", lensTypeId: "lens6", coatingId: "basic-prog", thicknessId: "prog-167", price: 140 },
          { id: "prog-pro-basic-174", lensTypeId: "lens6", coatingId: "basic-prog", thicknessId: "prog-174", price: 180 },
          
          // PRO Progressive - Filter
          { id: "prog-pro-filter-156", lensTypeId: "lens6", coatingId: "filter-prog", thicknessId: "prog-156", price: 55 },
          { id: "prog-pro-filter-poly", lensTypeId: "lens6", coatingId: "filter-prog", thicknessId: "prog-poly", price: 85 },
          { id: "prog-pro-filter-160", lensTypeId: "lens6", coatingId: "filter-prog", thicknessId: "prog-160", price: 100 },
          { id: "prog-pro-filter-167", lensTypeId: "lens6", coatingId: "filter-prog", thicknessId: "prog-167", price: 140 },
          { id: "prog-pro-filter-174", lensTypeId: "lens6", coatingId: "filter-prog", thicknessId: "prog-174", price: 180 },
          
          // Bifocal
          { id: "bif-basic", lensTypeId: "lens4", coatingId: "basic-bif", thicknessId: "bif-basic", price: 18 },
          { id: "bif-filter", lensTypeId: "lens4", coatingId: "filter-bif", thicknessId: "bif-basic", price: 28 },
          
          // Sunglasses
          { id: "sun-tinted-156", lensTypeId: "lens5", coatingId: "tinted-sun", thicknessId: "sv-156", price: 15 },
          { id: "sun-tinted-160", lensTypeId: "lens5", coatingId: "tinted-sun", thicknessId: "sv-160", price: 25 },
          { id: "sun-polarized-156", lensTypeId: "lens5", coatingId: "polarized-sun", thicknessId: "sv-156", price: 30 },
          { id: "sun-polarized-160", lensTypeId: "lens5", coatingId: "polarized-sun", thicknessId: "sv-160", price: 40 },
          { id: "sun-mirrored-156", lensTypeId: "lens5", coatingId: "mirrored-sun", thicknessId: "sv-156", price: 35 },
          { id: "sun-mirrored-160", lensTypeId: "lens5", coatingId: "mirrored-sun", thicknessId: "sv-160", price: 45 },
          
          // Photochromic - Single Vision (Distance & Reading)
          { id: "sv-photo-156", lensTypeId: "lens2", coatingId: "photochromic-sv", thicknessId: "sv-156", price: 18 },
          { id: "sv-photo-poly", lensTypeId: "lens2", coatingId: "photochromic-sv", thicknessId: "sv-poly", price: 30 },
          { id: "sv-photo-160", lensTypeId: "lens2", coatingId: "photochromic-sv", thicknessId: "sv-160", price: 40 },
          { id: "sv-photo-167", lensTypeId: "lens2", coatingId: "photochromic-sv", thicknessId: "sv-167", price: 60 },
          { id: "sv-photo-174", lensTypeId: "lens2", coatingId: "photochromic-sv", thicknessId: "sv-174", price: 90 },
          
          { id: "read-photo-156", lensTypeId: "lens1", coatingId: "photochromic-sv", thicknessId: "sv-156", price: 18 },
          { id: "read-photo-poly", lensTypeId: "lens1", coatingId: "photochromic-sv", thicknessId: "sv-poly", price: 30 },
          { id: "read-photo-160", lensTypeId: "lens1", coatingId: "photochromic-sv", thicknessId: "sv-160", price: 40 },
          { id: "read-photo-167", lensTypeId: "lens1", coatingId: "photochromic-sv", thicknessId: "sv-167", price: 60 },
          { id: "read-photo-174", lensTypeId: "lens1", coatingId: "photochromic-sv", thicknessId: "sv-174", price: 90 },
          
          // Progressive Photochromic
          { id: "prog-photo-156", lensTypeId: "lens3", coatingId: "photochromic-prog", thicknessId: "prog-156", price: 60 },
          { id: "prog-photo-poly", lensTypeId: "lens3", coatingId: "photochromic-prog", thicknessId: "prog-poly", price: 90 },
          { id: "prog-photo-160", lensTypeId: "lens3", coatingId: "photochromic-prog", thicknessId: "prog-160", price: 90 },
          { id: "prog-photo-167", lensTypeId: "lens3", coatingId: "photochromic-prog", thicknessId: "prog-167", price: 130 },
          { id: "prog-photo-174", lensTypeId: "lens3", coatingId: "photochromic-prog", thicknessId: "prog-174", price: 180 },
          
          // PRO Progressive Photochromic
          { id: "prog-pro-photo-156", lensTypeId: "lens6", coatingId: "photochromic-prog", thicknessId: "prog-156", price: 130 },
          { id: "prog-pro-photo-poly", lensTypeId: "lens6", coatingId: "photochromic-prog", thicknessId: "prog-poly", price: 180 },
          { id: "prog-pro-photo-160", lensTypeId: "lens6", coatingId: "photochromic-prog", thicknessId: "prog-160", price: 180 },
          { id: "prog-pro-photo-167", lensTypeId: "lens6", coatingId: "photochromic-prog", thicknessId: "prog-167", price: 220 },
          { id: "prog-pro-photo-174", lensTypeId: "lens6", coatingId: "photochromic-prog", thicknessId: "prog-174", price: 270 },
        ];
        
        set({
          lensPricingCombinations: newPricingCombinations
        });
      }
    }),
    {
      name: 'inventory-store',
      version: 3
    }
  )
);
