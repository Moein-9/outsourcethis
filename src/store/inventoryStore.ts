
import { create } from 'zustand';

export interface InventoryState {
  frames: Frame[];
  contactLenses: ContactLens[];
  lensTypes: LensType[];
  lensCoatings: LensCoating[];
  lensThicknesses: LensThickness[];
  lensCombinations: LensCombination[];
  services: Service[];
  repairServices: RepairService[];

  // Frame methods
  getFrames: () => Frame[];
  addFrame: (frame: Frame) => void;
  updateFrame: (frame: Frame) => void;
  deleteFrame: (frameId: string) => void;
  searchFrames: (query: string) => Frame[];
  bulkImportFrames: (frames: Frame[]) => void;

  // Contact Lens methods
  getContactLenses: () => ContactLens[];
  addContactLens: (contactLens: ContactLens) => void;
  updateContactLens: (contactLens: ContactLens) => void;
  deleteContactLens: (contactLensId: string) => void;
  searchContactLenses: (query: string) => ContactLens[];

  // Lens Type methods
  getLensTypes: () => LensType[];
  addLensType: (lensType: LensType) => void;
  updateLensType: (lensTypeId: string, lensType: Partial<Omit<LensType, "id">>) => void;
  deleteLensType: (lensTypeId: string) => void;

  // Lens Coating methods
  getLensCoatings: () => LensCoating[];
  addLensCoating: (lensCoating: LensCoating) => void;
  updateLensCoating: (lensCoatingId: string, lensCoating: Partial<Omit<LensCoating, "id">>) => void;
  deleteLensCoating: (lensCoatingId: string) => void;
  getLensCoatingsByCategory: (category: string) => LensCoating[];

  // Lens Thickness methods
  getLensThicknesses: () => LensThickness[];
  addLensThickness: (lensThickness: LensThickness) => void;
  updateLensThickness: (lensThicknessId: string, lensThickness: Partial<Omit<LensThickness, "id">>) => void;
  deleteLensThickness: (lensThicknessId: string) => void;
  getLensThicknessesByCategory: (category: string) => LensThickness[];

  // Lens Combination methods
  getLensCombinations: () => LensCombination[];
  addLensCombination: (lensCombination: LensCombination) => void;
  updateLensCombination: (lensCombinationId: string, lensCombination: Partial<Omit<LensCombination, "id">>) => void;
  deleteLensCombination: (lensCombinationId: string) => void;
  getLensPricingByComponents: (lensType: string, coating: string, thickness: string) => number | null;
  resetLensPricing: () => void;
  getAvailableCoatings: (lensType: string) => LensCoating[];
  getAvailableThicknesses: (lensType: string) => LensThickness[];

  // Service methods
  getServices: () => Service[];
  addService: (service: Service) => void;
  updateService: (serviceId: string, service: Partial<Omit<Service, "id">>) => void;
  deleteService: (serviceId: string) => void;
  getServicesByCategory: (category: string) => Service[];

  initialize: (data: any) => void;
  exportData: () => any;
  clearAllData: () => void;

  // Repair services methods
  getRepairServices: () => RepairService[];
  addRepairService: (service: RepairService) => void;
  updateRepairService: (service: RepairService) => void;
  deleteRepairService: (serviceId: string) => void;
  
  // Cleanup methods
  cleanupSamplePhotochromicCoatings: () => void;
}

export interface Frame {
  id: string;
  brand: string;
  model: string;
  color: string;
  size: string;
  price: number;
  qty?: number;
  frameId?: string;
  imageUrl?: string;
  stock?: number;
}

export interface ContactLens {
  id: string;
  brand: string;
  type: string;
  color: string;
  power: string;
  price: number;
  bc?: string;
  diameter?: string;
  qty?: number;
  imageUrl?: string;
}

export interface LensType {
  id: string;
  name: string;
  price: number;
  type?: "distance" | "reading" | "progressive" | "bifocal" | "sunglasses";
}

export interface LensCoating {
  id: string;
  name: string;
  price: number;
  isPhotochromic?: boolean;
  availableColors?: string[];
  description?: string;
  category?: "distance-reading" | "progressive" | "bifocal" | "sunglasses";
}

export interface LensThickness {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: "distance-reading" | "progressive" | "bifocal" | "sunglasses";
}

export interface LensCombination {
  id: string;
  name: string;
  lensType: string;
  coating: string;
  thickness: string;
  price: number;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
}

export interface RepairService {
  id: string;
  name: string;
  price: number;
  description?: string;
}

// For compatibility with existing code
export type FrameItem = Frame;
export type ContactLensItem = ContactLens;
export type ServiceItem = Service;

const useInventoryStore = create<InventoryState>((set, get) => ({
  frames: [],
  contactLenses: [],
  lensTypes: [],
  lensCoatings: [],
  lensThicknesses: [],
  lensCombinations: [],
  services: [],
  repairServices: [],

  // Frame methods implementation
  getFrames: () => get().frames,
  addFrame: (frame) => {
    set((state) => ({
      frames: [...state.frames, frame],
    }));
  },
  updateFrame: (frame) => {
    set((state) => ({
      frames: state.frames.map((f) => (f.id === frame.id ? frame : f)),
    }));
  },
  deleteFrame: (frameId) => {
    set((state) => ({
      frames: state.frames.filter((f) => f.id !== frameId),
    }));
  },
  searchFrames: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().frames.filter(frame => 
      frame.brand.toLowerCase().includes(lowerQuery) ||
      frame.model.toLowerCase().includes(lowerQuery) ||
      frame.color.toLowerCase().includes(lowerQuery)
    );
  },
  bulkImportFrames: (frames) => {
    set((state) => ({
      frames: [...state.frames, ...frames],
    }));
  },

  // Contact Lens methods implementation
  getContactLenses: () => get().contactLenses,
  addContactLens: (contactLens) => {
    set((state) => ({
      contactLenses: [...state.contactLenses, contactLens],
    }));
  },
  updateContactLens: (contactLens) => {
    set((state) => ({
      contactLenses: state.contactLenses.map((cl) =>
        cl.id === contactLens.id ? contactLens : cl
      ),
    }));
  },
  deleteContactLens: (contactLensId) => {
    set((state) => ({
      contactLenses: state.contactLenses.filter((cl) => cl.id !== contactLensId),
    }));
  },
  searchContactLenses: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().contactLenses.filter(lens => 
      lens.brand.toLowerCase().includes(lowerQuery) ||
      lens.type.toLowerCase().includes(lowerQuery) ||
      (lens.color && lens.color.toLowerCase().includes(lowerQuery))
    );
  },

  // Lens Type methods implementation
  getLensTypes: () => get().lensTypes,
  addLensType: (lensType) => {
    set((state) => ({
      lensTypes: [...state.lensTypes, lensType],
    }));
  },
  updateLensType: (lensTypeId, lensType) => {
    set((state) => ({
      lensTypes: state.lensTypes.map((lt) =>
        lt.id === lensTypeId ? { ...lt, ...lensType } : lt
      ),
    }));
  },
  deleteLensType: (lensTypeId) => {
    set((state) => ({
      lensTypes: state.lensTypes.filter((lt) => lt.id !== lensTypeId),
    }));
  },

  // Lens Coating methods implementation
  getLensCoatings: () => get().lensCoatings,
  addLensCoating: (lensCoating) => {
    set((state) => ({
      lensCoatings: [...state.lensCoatings, lensCoating],
    }));
  },
  updateLensCoating: (lensCoatingId, lensCoating) => {
    set((state) => ({
      lensCoatings: state.lensCoatings.map((lc) =>
        lc.id === lensCoatingId ? { ...lc, ...lensCoating } : lc
      ),
    }));
  },
  deleteLensCoating: (lensCoatingId) => {
    set((state) => ({
      lensCoatings: state.lensCoatings.filter((lc) => lc.id !== lensCoatingId),
    }));
  },
  getLensCoatingsByCategory: (category) => {
    return get().lensCoatings.filter(coating => coating.category === category);
  },

  // Lens Thickness methods implementation
  getLensThicknesses: () => get().lensThicknesses,
  addLensThickness: (lensThickness) => {
    set((state) => ({
      lensThicknesses: [...state.lensThicknesses, lensThickness],
    }));
  },
  updateLensThickness: (lensThicknessId, lensThickness) => {
    set((state) => ({
      lensThicknesses: state.lensThicknesses.map((lt) =>
        lt.id === lensThicknessId ? { ...lt, ...lensThickness } : lt
      ),
    }));
  },
  deleteLensThickness: (lensThicknessId) => {
    set((state) => ({
      lensThicknesses: state.lensThicknesses.filter(
        (lt) => lt.id !== lensThicknessId
      ),
    }));
  },
  getLensThicknessesByCategory: (category) => {
    return get().lensThicknesses.filter(thickness => thickness.category === category);
  },

  // Lens Combination methods implementation
  getLensCombinations: () => get().lensCombinations,
  addLensCombination: (lensCombination) => {
    set((state) => ({
      lensCombinations: [...state.lensCombinations, lensCombination],
    }));
  },
  updateLensCombination: (lensCombinationId, lensCombination) => {
    set((state) => ({
      lensCombinations: state.lensCombinations.map((lc) =>
        lc.id === lensCombinationId ? { ...lc, ...lensCombination } : lc
      ),
    }));
  },
  deleteLensCombination: (lensCombinationId) => {
    set((state) => ({
      lensCombinations: state.lensCombinations.filter(
        (lc) => lc.id !== lensCombinationId
      ),
    }));
  },
  getLensPricingByComponents: (lensType, coating, thickness) => {
    const combination = get().lensCombinations.find(
      comb => comb.lensType === lensType && comb.coating === coating && comb.thickness === thickness
    );
    return combination ? combination.price : null;
  },
  resetLensPricing: () => {
    set((state) => ({
      lensCombinations: []
    }));
  },
  getAvailableCoatings: (lensType) => {
    // Find lensType's category
    const lens = get().lensTypes.find(lt => lt.name === lensType);
    if (!lens || !lens.type) return [];
    
    const category = lens.type === 'distance' || lens.type === 'reading' 
      ? 'distance-reading' 
      : lens.type;
    
    return get().lensCoatings.filter(coating => coating.category === category);
  },
  getAvailableThicknesses: (lensType) => {
    // Find lensType's category
    const lens = get().lensTypes.find(lt => lt.name === lensType);
    if (!lens || !lens.type) return [];
    
    const category = lens.type === 'distance' || lens.type === 'reading' 
      ? 'distance-reading' 
      : lens.type;
    
    return get().lensThicknesses.filter(thickness => thickness.category === category);
  },

  // Service methods implementation
  getServices: () => get().services,
  addService: (service) => {
    set((state) => ({
      services: [...state.services, service],
    }));
  },
  updateService: (serviceId, service) => {
    set((state) => ({
      services: state.services.map((s) => 
        s.id === serviceId ? { ...s, ...service } : s
      ),
    }));
  },
  deleteService: (serviceId) => {
    set((state) => ({
      services: state.services.filter((s) => s.id !== serviceId),
    }));
  },
  getServicesByCategory: (category) => {
    return get().services.filter((s) => s.category === category);
  },

  initialize: (data) => {
    set({
      frames: data.frames || [],
      contactLenses: data.contactLenses || [],
      lensTypes: data.lensTypes || [],
      lensCoatings: data.lensCoatings || [],
      lensThicknesses: data.lensThicknesses || [],
      lensCombinations: data.lensCombinations || [],
      services: data.services || [],
      repairServices: data.repairServices || []
    });
  },

  exportData: () => {
    const data = {
      frames: get().frames,
      contactLenses: get().contactLenses,
      lensTypes: get().lensTypes,
      lensCoatings: get().lensCoatings,
      lensThicknesses: get().lensThicknesses,
      lensCombinations: get().lensCombinations,
      services: get().services,
      repairServices: get().repairServices
    };
    return data;
  },

  clearAllData: () => {
    set({
      frames: [],
      contactLenses: [],
      lensTypes: [],
      lensCoatings: [],
      lensThicknesses: [],
      lensCombinations: [],
      services: [],
      repairServices: []
    });
  },

  // Implement repair services methods
  getRepairServices: () => get().repairServices,
  addRepairService: (service) => {
    set((state) => ({
      repairServices: [...state.repairServices, service]
    }));
  },
  updateRepairService: (service) => {
    set((state) => ({
      repairServices: state.repairServices.map((s) =>
        s.id === service.id ? service : s
      )
    }));
  },
  deleteRepairService: (serviceId) => {
    set((state) => ({
      repairServices: state.repairServices.filter((s) => s.id !== serviceId)
    }));
  },
  
  // Cleanup methods implementation
  cleanupSamplePhotochromicCoatings: () => {
    console.log('Cleanup method called - no implementation needed at this time');
  }
}));

export { useInventoryStore };
