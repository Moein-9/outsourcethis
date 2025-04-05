import { create } from 'zustand';

interface InventoryState {
  frames: Frame[];
  contactLenses: ContactLens[];
  lensTypes: LensType[];
  lensCoatings: LensCoating[];
  lensThicknesses: LensThickness[];
  lensCombinations: LensCombination[];
  services: Service[];
  repairServices: RepairService[];  // Added repair services

  // Frame methods
  getFrames: () => Frame[];
  addFrame: (frame: Frame) => void;
  updateFrame: (frame: Frame) => void;
  deleteFrame: (frameId: string) => void;

  // Contact Lens methods
  getContactLenses: () => ContactLens[];
  addContactLens: (contactLens: ContactLens) => void;
  updateContactLens: (contactLens: ContactLens) => void;
  deleteContactLens: (contactLensId: string) => void;

  // Lens Type methods
  getLensTypes: () => LensType[];
  addLensType: (lensType: LensType) => void;
  updateLensType: (lensType: LensType) => void;
  deleteLensType: (lensTypeId: string) => void;

  // Lens Coating methods
  getLensCoatings: () => LensCoating[];
  addLensCoating: (lensCoating: LensCoating) => void;
  updateLensCoating: (lensCoating: LensCoating) => void;
  deleteLensCoating: (lensCoatingId: string) => void;

  // Lens Thickness methods
  getLensThicknesses: () => LensThickness[];
  addLensThickness: (lensThickness: LensThickness) => void;
  updateLensThickness: (lensThickness: LensThickness) => void;
  deleteLensThickness: (lensThicknessId: string) => void;

  // Lens Combination methods
  getLensCombinations: () => LensCombination[];
  addLensCombination: (lensCombination: LensCombination) => void;
  updateLensCombination: (lensCombination: LensCombination) => void;
  deleteLensCombination: (lensCombinationId: string) => void;

  // Service methods
  getServices: () => Service[];
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  deleteService: (serviceId: string) => void;
  getServicesByCategory: (category: string) => Service[];

  initialize: (data: any) => void;
  exportData: () => any;
  clearAllData: () => void;

  // Added repair services methods
  getRepairServices: () => RepairService[];
  addRepairService: (service: RepairService) => void;
  updateRepairService: (service: RepairService) => void;
  deleteRepairService: (serviceId: string) => void;
}

export interface Frame {
  id: string;
  brand: string;
  model: string;
  color: string;
  size: string;
  price: number;
  imageUrl?: string;
}

export interface ContactLens {
  id: string;
  brand: string;
  type: string;
  color: string;
  power: string;
  price: number;
  imageUrl?: string;
}

export interface LensType {
  id: string;
  name: string;
  price: number;
}

export interface LensCoating {
  id: string;
  name: string;
  price: number;
  isPhotochromic?: boolean;
  availableColors?: string[];
}

export interface LensThickness {
  id: string;
  name: string;
  price: number;
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

const useInventoryStore = create<InventoryState>((set, get) => ({
  frames: [],
  contactLenses: [],
  lensTypes: [],
  lensCoatings: [],
  lensThicknesses: [],
  lensCombinations: [],
  services: [],
  repairServices: [],  // Initialize repair services array

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

  // Lens Type methods implementation
  getLensTypes: () => get().lensTypes,
  addLensType: (lensType) => {
    set((state) => ({
      lensTypes: [...state.lensTypes, lensType],
    }));
  },
  updateLensType: (lensType) => {
    set((state) => ({
      lensTypes: state.lensTypes.map((lt) =>
        lt.id === lensType.id ? lensType : lt
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
  updateLensCoating: (lensCoating) => {
    set((state) => ({
      lensCoatings: state.lensCoatings.map((lc) =>
        lc.id === lensCoating.id ? lensCoating : lc
      ),
    }));
  },
  deleteLensCoating: (lensCoatingId) => {
    set((state) => ({
      lensCoatings: state.lensCoatings.filter((lc) => lc.id !== lensCoatingId),
    }));
  },

  // Lens Thickness methods implementation
  getLensThicknesses: () => get().lensThicknesses,
  addLensThickness: (lensThickness) => {
    set((state) => ({
      lensThicknesses: [...state.lensThicknesses, lensThickness],
    }));
  },
  updateLensThickness: (lensThickness) => {
    set((state) => ({
      lensThicknesses: state.lensThicknesses.map((lt) =>
        lt.id === lensThickness.id ? lensThickness : lt
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

  // Lens Combination methods implementation
  getLensCombinations: () => get().lensCombinations,
  addLensCombination: (lensCombination) => {
    set((state) => ({
      lensCombinations: [...state.lensCombinations, lensCombination],
    }));
  },
  updateLensCombination: (lensCombination) => {
    set((state) => ({
      lensCombinations: state.lensCombinations.map((lc) =>
        lc.id === lensCombination.id ? lensCombination : lc
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

  // Service methods implementation
  getServices: () => get().services,
  addService: (service) => {
    set((state) => ({
      services: [...state.services, service],
    }));
  },
  updateService: (service) => {
    set((state) => ({
      services: state.services.map((s) => (s.id === service.id ? service : s)),
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
      repairServices: data.repairServices || []  // Initialize repair services
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
      repairServices: get().repairServices  // Export repair services
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
}));

export { useInventoryStore };
