import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  contactLenses: ContactLensItem[];
  services: ServiceItem[];
  isLoading: boolean;
  isInitialized: boolean;
  
  // Initialization
  initializeStore: () => Promise<void>;
  migrateDefaultData: () => Promise<void>;
  
  // Helper methods for realtime updates
  handleRealtimeFramesUpdate: (payload: any) => void;
  handleRealtimeLensTypesUpdate: (payload: any) => void;
  handleRealtimeCoatingsUpdate: (payload: any) => void;
  handleRealtimeThicknessesUpdate: (payload: any) => void;
  handleRealtimeContactLensesUpdate: (payload: any) => void;
  handleRealtimeServicesUpdate: (payload: any) => void;
  
  // Default data functions
  getDefaultLensTypes: () => LensType[];
  getDefaultLensCoatings: () => LensCoating[];
  getDefaultLensThicknesses: () => LensThickness[];
  getDefaultContactLenses: () => ContactLensItem[];
  getDefaultServices: () => ServiceItem[];
  
  // Frame methods
  addFrame: (frame: Omit<FrameItem, "frameId" | "createdAt">) => Promise<string>;
  updateFrameQuantity: (frameId: string, newQty: number) => Promise<void>;
  searchFrames: (query: string) => FrameItem[];
  getFrameById: (id: string) => FrameItem | undefined;
  
  // Lens methods
  addLensType: (lens: Omit<LensType, "id">) => Promise<string>;
  updateLensType: (id: string, lens: Partial<Omit<LensType, "id">>) => Promise<void>;
  deleteLensType: (id: string) => Promise<void>;
  
  // Coating methods
  addLensCoating: (coating: Omit<LensCoating, "id">) => Promise<string>;
  updateLensCoating: (id: string, coating: Partial<Omit<LensCoating, "id">>) => Promise<void>;
  deleteLensCoating: (id: string) => Promise<void>;
  getLensCoatingsByCategory: (category: LensCoating['category']) => LensCoating[];
  
  // Thickness methods
  addLensThickness: (thickness: Omit<LensThickness, "id">) => Promise<string>;
  updateLensThickness: (id: string, thickness: Partial<Omit<LensThickness, "id">>) => Promise<void>;
  deleteLensThickness: (id: string) => Promise<void>;
  getLensThicknessesByCategory: (category: LensThickness['category']) => LensThickness[];
  
  // Contact lens methods
  addContactLens: (lens: Omit<ContactLensItem, "id">) => Promise<string>;
  updateContactLens: (id: string, lens: Partial<Omit<ContactLensItem, "id">>) => Promise<void>;
  deleteContactLens: (id: string) => Promise<void>;
  searchContactLenses: (query: string) => ContactLensItem[];
  
  // Service methods
  addService: (service: Omit<ServiceItem, "id">) => Promise<string>;
  updateService: (id: string, service: Partial<Omit<ServiceItem, "id">>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  getServiceById: (id: string) => ServiceItem | undefined;
  getServicesByCategory: (category: ServiceItem['category']) => ServiceItem[];
}

export const useInventoryStore = create<InventoryState>()((set, get) => ({
  frames: [],
  lensTypes: [],
  lensCoatings: [],
  lensThicknesses: [],
  contactLenses: [],
  services: [],
  isLoading: false,
  isInitialized: false,
  
  // Initialization function to load data from Supabase
  initializeStore: async () => {
    if (get().isInitialized) return;
    
    set({ isLoading: true });
    
    try {
      // Fetch frames
      const { data: framesData, error: framesError } = await supabase
        .from('frames')
        .select('*');
      
      if (framesError) throw framesError;
      
      const frames = framesData.map(frame => ({
        frameId: frame.frame_id,
        brand: frame.brand,
        model: frame.model,
        color: frame.color,
        size: frame.size,
        price: Number(frame.price),
        qty: frame.qty,
        createdAt: frame.created_at
      }));
      
      // Fetch lens types
      const { data: lensTypesData, error: lensTypesError } = await supabase
        .from('lens_types')
        .select('*');
      
      if (lensTypesError) throw lensTypesError;
      
      const lensTypes = lensTypesData.map(lens => ({
        id: lens.lens_id,
        name: lens.name,
        type: lens.type as "distance" | "reading" | "progressive" | "bifocal" | "sunglasses",
        price: lens.price ? Number(lens.price) : undefined
      }));
      
      // Fetch lens coatings
      const { data: lensCoatingsData, error: lensCoatingsError } = await supabase
        .from('lens_coatings')
        .select('*');
      
      if (lensCoatingsError) throw lensCoatingsError;
      
      const lensCoatings = lensCoatingsData.map(coating => ({
        id: coating.coating_id,
        name: coating.name,
        price: Number(coating.price),
        description: coating.description,
        category: coating.category as "distance-reading" | "progressive" | "bifocal"
      }));
      
      // Fetch lens thicknesses
      const { data: lensThicknessesData, error: lensThicknessesError } = await supabase
        .from('lens_thicknesses')
        .select('*');
      
      if (lensThicknessesError) throw lensThicknessesError;
      
      const lensThicknesses = lensThicknessesData.map(thickness => ({
        id: thickness.thickness_id,
        name: thickness.name,
        price: Number(thickness.price),
        description: thickness.description,
        category: thickness.category as "distance-reading" | "progressive" | "bifocal"
      }));
      
      // Fetch contact lenses
      const { data: contactLensesData, error: contactLensesError } = await supabase
        .from('contact_lenses')
        .select('*');
      
      if (contactLensesError) throw contactLensesError;
      
      const contactLenses = contactLensesData.map(lens => ({
        id: lens.lens_id,
        brand: lens.brand,
        type: lens.type,
        bc: lens.bc,
        diameter: lens.diameter,
        power: lens.power,
        price: Number(lens.price),
        qty: lens.qty,
        color: lens.color
      }));
      
      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*');
      
      if (servicesError) throw servicesError;
      
      const services = servicesData.map(service => ({
        id: service.service_id,
        name: service.name,
        description: service.description,
        price: Number(service.price),
        category: service.category as "exam" | "repair" | "other"
      }));
      
      // Check if ALL tables are empty before migrating default data
      // Only migrate default data if all inventory tables are completely empty
      const allTablesEmpty = 
        frames.length === 0 && 
        lensTypes.length === 0 && 
        lensCoatings.length === 0 && 
        lensThicknesses.length === 0 && 
        contactLenses.length === 0 && 
        services.length === 0;
        
      if (allTablesEmpty) {
        await get().migrateDefaultData();
        // After migration, fetch data again to get the newly created records
        return get().initializeStore();
      }
      
      // Setup realtime subscriptions
      const channel = supabase
        .channel('inventory_changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'frames' 
        }, payload => {
          get().handleRealtimeFramesUpdate(payload);
        })
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'lens_types' 
        }, payload => {
          get().handleRealtimeLensTypesUpdate(payload);
        })
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'lens_coatings' 
        }, payload => {
          get().handleRealtimeCoatingsUpdate(payload);
        })
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'lens_thicknesses' 
        }, payload => {
          get().handleRealtimeThicknessesUpdate(payload);
        })
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'contact_lenses' 
        }, payload => {
          get().handleRealtimeContactLensesUpdate(payload);
        })
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'services' 
        }, payload => {
          get().handleRealtimeServicesUpdate(payload);
        })
        .subscribe();
      
      // Set the store data
      set({
        frames,
        lensTypes,
        lensCoatings,
        lensThicknesses,
        contactLenses,
        services,
        isLoading: false,
        isInitialized: true
      });
    } catch (error) {
      console.error('Failed to initialize inventory store:', error);
      toast.error('Failed to load inventory data: ' + handleSupabaseError(error));
      set({ isLoading: false });
    }
  },
  
  // Helper methods for realtime updates
  handleRealtimeFramesUpdate: (payload: any) => {
    if (payload.eventType === 'INSERT') {
      const newFrame = {
        frameId: payload.new.frame_id,
        brand: payload.new.brand,
        model: payload.new.model,
        color: payload.new.color,
        size: payload.new.size,
        price: Number(payload.new.price),
        qty: payload.new.qty,
        createdAt: payload.new.created_at
      };
      
      set(state => ({
        frames: [...state.frames, newFrame]
      }));
    } 
    else if (payload.eventType === 'UPDATE') {
      set(state => ({
        frames: state.frames.map(frame => 
          frame.frameId === payload.new.frame_id 
            ? {
                frameId: payload.new.frame_id,
                brand: payload.new.brand,
                model: payload.new.model,
                color: payload.new.color,
                size: payload.new.size,
                price: Number(payload.new.price),
                qty: payload.new.qty,
                createdAt: payload.new.created_at
              }
            : frame
        )
      }));
    }
    else if (payload.eventType === 'DELETE') {
      set(state => ({
        frames: state.frames.filter(frame => frame.frameId !== payload.old.frame_id)
      }));
    }
  },
  
  handleRealtimeLensTypesUpdate: (payload: any) => {
    if (payload.eventType === 'INSERT') {
      const newLens = {
        id: payload.new.lens_id,
        name: payload.new.name,
        type: payload.new.type as "distance" | "reading" | "progressive" | "bifocal" | "sunglasses",
        price: payload.new.price ? Number(payload.new.price) : undefined
      };
      
      set(state => ({
        lensTypes: [...state.lensTypes, newLens]
      }));
    }
    else if (payload.eventType === 'UPDATE') {
      set(state => ({
        lensTypes: state.lensTypes.map(lens => 
          lens.id === payload.new.lens_id
            ? {
                id: payload.new.lens_id,
                name: payload.new.name,
                type: payload.new.type as "distance" | "reading" | "progressive" | "bifocal" | "sunglasses",
                price: payload.new.price ? Number(payload.new.price) : undefined
              }
            : lens
        )
      }));
    }
    else if (payload.eventType === 'DELETE') {
      set(state => ({
        lensTypes: state.lensTypes.filter(lens => lens.id !== payload.old.lens_id)
      }));
    }
  },
  
  handleRealtimeCoatingsUpdate: (payload: any) => {
    if (payload.eventType === 'INSERT') {
      const newCoating = {
        id: payload.new.coating_id,
        name: payload.new.name,
        price: Number(payload.new.price),
        description: payload.new.description,
        category: payload.new.category as "distance-reading" | "progressive" | "bifocal"
      };
      
      set(state => ({
        lensCoatings: [...state.lensCoatings, newCoating]
      }));
    }
    else if (payload.eventType === 'UPDATE') {
      set(state => ({
        lensCoatings: state.lensCoatings.map(coating => 
          coating.id === payload.new.coating_id
            ? {
                id: payload.new.coating_id,
                name: payload.new.name,
                price: Number(payload.new.price),
                description: payload.new.description,
                category: payload.new.category as "distance-reading" | "progressive" | "bifocal"
              }
            : coating
        )
      }));
    }
    else if (payload.eventType === 'DELETE') {
      set(state => ({
        lensCoatings: state.lensCoatings.filter(coating => coating.id !== payload.old.coating_id)
      }));
    }
  },
  
  handleRealtimeThicknessesUpdate: (payload: any) => {
    if (payload.eventType === 'INSERT') {
      const newThickness = {
        id: payload.new.thickness_id,
        name: payload.new.name,
        price: Number(payload.new.price),
        description: payload.new.description,
        category: payload.new.category as "distance-reading" | "progressive" | "bifocal"
      };
      
      set(state => ({
        lensThicknesses: [...state.lensThicknesses, newThickness]
      }));
    }
    else if (payload.eventType === 'UPDATE') {
      set(state => ({
        lensThicknesses: state.lensThicknesses.map(thickness => 
          thickness.id === payload.new.thickness_id
            ? {
                id: payload.new.thickness_id,
                name: payload.new.name,
                price: Number(payload.new.price),
                description: payload.new.description,
                category: payload.new.category as "distance-reading" | "progressive" | "bifocal"
              }
            : thickness
        )
      }));
    }
    else if (payload.eventType === 'DELETE') {
      set(state => ({
        lensThicknesses: state.lensThicknesses.filter(thickness => thickness.id !== payload.old.thickness_id)
      }));
    }
  },
  
  handleRealtimeContactLensesUpdate: (payload: any) => {
    if (payload.eventType === 'INSERT') {
      const newLens = {
        id: payload.new.lens_id,
        brand: payload.new.brand,
        type: payload.new.type,
        bc: payload.new.bc,
        diameter: payload.new.diameter,
        power: payload.new.power,
        price: Number(payload.new.price),
        qty: payload.new.qty,
        color: payload.new.color
      };
      
      set(state => ({
        contactLenses: [...state.contactLenses, newLens]
      }));
    }
    else if (payload.eventType === 'UPDATE') {
      set(state => ({
        contactLenses: state.contactLenses.map(lens => 
          lens.id === payload.new.lens_id
            ? {
                id: payload.new.lens_id,
                brand: payload.new.brand,
                type: payload.new.type,
                bc: payload.new.bc,
                diameter: payload.new.diameter,
                power: payload.new.power,
                price: Number(payload.new.price),
                qty: payload.new.qty,
                color: payload.new.color
              }
            : lens
        )
      }));
    }
    else if (payload.eventType === 'DELETE') {
      set(state => ({
        contactLenses: state.contactLenses.filter(lens => lens.id !== payload.old.lens_id)
      }));
    }
  },
  
  handleRealtimeServicesUpdate: (payload: any) => {
    if (payload.eventType === 'INSERT') {
      const newService = {
        id: payload.new.service_id,
        name: payload.new.name,
        description: payload.new.description,
        price: Number(payload.new.price),
        category: payload.new.category as "exam" | "repair" | "other"
      };
      
      set(state => ({
        services: [...state.services, newService]
      }));
    }
    else if (payload.eventType === 'UPDATE') {
      set(state => ({
        services: state.services.map(service => 
          service.id === payload.new.service_id
            ? {
                id: payload.new.service_id,
                name: payload.new.name,
                description: payload.new.description,
                price: Number(payload.new.price),
                category: payload.new.category as "exam" | "repair" | "other"
              }
            : service
        )
      }));
    }
    else if (payload.eventType === 'DELETE') {
      set(state => ({
        services: state.services.filter(service => service.id !== payload.old.service_id)
      }));
    }
  },
  
  // Default data functions
  getDefaultLensTypes: () => [
    { id: "lens1", name: "نظارات طبية للقراءة", type: "reading" },
    { id: "lens2", name: "نظارات للنظر البعيد", type: "distance" },
    { id: "lens3", name: "عدسات تقدمية", type: "progressive" },
    { id: "lens4", name: "عدسات ثنائية", type: "bifocal" },
    { id: "lens5", name: "عدسات شمسية", type: "sunglasses" }
  ],
  
  getDefaultLensCoatings: () => [
    { id: "coat1", name: "مضاد للانعكاس", price: 5, description: "Anti-Reflective Coating", category: "distance-reading" },
    { id: "coat2", name: "حماية شاشة", price: 7, description: "Blue Light Protection", category: "distance-reading" },
    { id: "coat3", name: "ضد الخدش", price: 8, description: "Scratch Resistant", category: "distance-reading" },
    { id: "coat4", name: "مضاد للانعكاس للعدسات التقدمية", price: 10, description: "Anti-Reflective for Progressive", category: "progressive" },
    { id: "coat5", name: "حماية شاشة للعدسات التقدمية", price: 12, description: "Blue Light Protection for Progressive", category: "progressive" },
    { id: "coat6", name: "مضاد للانعكاس للعدسات الثنائية", price: 8, description: "Anti-Reflective for Bifocal", category: "bifocal" },
    { id: "coat7", name: "حماية شاشة للعدسات الثنائية", price: 9, description: "Blue Light Protection for Bifocal", category: "bifocal" },
    { id: "coat8", name: "Basic (عادي)", price: 0, description: "Basic Coating", category: "distance-reading" },
    { id: "coat9", name: "Filter (فلتر)", price: 0, description: "Filter Coating", category: "distance-reading" },
    { id: "coat10", name: "Super Filter (سوبر فلتر)", price: 0, description: "Super Filter Coating", category: "distance-reading" },
    { id: "coat11", name: "Basic (عادي)", price: 0, description: "Basic Coating for Progressive", category: "progressive" },
    { id: "coat12", name: "Filter (فلتر)", price: 0, description: "Filter Coating for Progressive", category: "progressive" },
    { id: "coat13", name: "Super Filter (سوبر فلتر)", price: 0, description: "Super Filter Coating for Progressive", category: "progressive" },
    { id: "coat14", name: "Basic (عادي)", price: 0, description: "Basic Coating for Bifocal", category: "bifocal" },
    { id: "coat15", name: "Filter (فلتر)", price: 0, description: "Filter Coating for Bifocal", category: "bifocal" },
    { id: "coat16", name: "Super Filter (سوبر فلتر)", price: 0, description: "Super Filter Coating for Bifocal", category: "bifocal" }
  ],
  
  getDefaultLensThicknesses: () => [
    { id: "thick1", name: "عادي", price: 0, description: "Standard Thickness", category: "distance-reading" },
    { id: "thick2", name: "رقيق", price: 10, description: "Thin", category: "distance-reading" },
    { id: "thick3", name: "رقيق جداً", price: 20, description: "Ultra Thin", category: "distance-reading" },
    { id: "thick4", name: "عادي للعدسات التقدمية", price: 5, description: "Standard for Progressive", category: "progressive" },
    { id: "thick5", name: "رقيق للعدسات التقدمية", price: 15, description: "Thin for Progressive", category: "progressive" },
    { id: "thick6", name: "عادي للعدسات الثنائية", price: 3, description: "Standard for Bifocal", category: "bifocal" },
    { id: "thick7", name: "رقيق للعدسات الثنائية", price: 12, description: "Thin for Bifocal", category: "bifocal" },
    { id: "thick8", name: "1.56 عادي (Standard)", price: 0, description: "Standard 1.56 Thickness", category: "distance-reading" },
    { id: "thick9", name: "Standard Thickness", price: 0, description: "Standard Thickness", category: "distance-reading" },
    { id: "thick10", name: "Polycarbonate", price: 0, description: "Polycarbonate Material", category: "distance-reading" },
    { id: "thick11", name: "1.6 Thin (رقيق)", price: 0, description: "1.6 Thin Lens", category: "distance-reading" },
    { id: "thick12", name: "1.67 Super Thin (رقيق جداً)", price: 0, description: "1.67 Super Thin Lens", category: "distance-reading" },
    { id: "thick13", name: "1.75 Ultra Thin (فائق الرقة)", price: 0, description: "1.75 Ultra Thin Lens", category: "distance-reading" },
    { id: "thick14", name: "1.56 عادي (Standard)", price: 0, description: "Standard 1.56 Thickness for Progressive", category: "progressive" },
    { id: "thick15", name: "Standard Thickness", price: 0, description: "Standard Thickness for Progressive", category: "progressive" },
    { id: "thick16", name: "Polycarbonate", price: 0, description: "Polycarbonate Material for Progressive", category: "progressive" },
    { id: "thick17", name: "1.6 Thin (رقيق)", price: 0, description: "1.6 Thin Lens for Progressive", category: "progressive" },
    { id: "thick18", name: "1.67 Super Thin (رقيق جداً)", price: 0, description: "1.67 Super Thin Lens for Progressive", category: "progressive" },
    { id: "thick19", name: "1.75 Ultra Thin (فائق الرقة)", price: 0, description: "1.75 Ultra Thin Lens for Progressive", category: "progressive" },
    { id: "thick20", name: "1.56 عادي (Standard)", price: 0, description: "Standard 1.56 Thickness for Bifocal", category: "bifocal" },
    { id: "thick21", name: "Standard Thickness", price: 0, description: "Standard Thickness for Bifocal", category: "bifocal" },
    { id: "thick22", name: "Polycarbonate", price: 0, description: "Polycarbonate Material for Bifocal", category: "bifocal" },
    { id: "thick23", name: "1.6 Thin (رقيق)", price: 0, description: "1.6 Thin Lens for Bifocal", category: "bifocal" },
    { id: "thick24", name: "1.67 Super Thin (رقيق جداً)", price: 0, description: "1.67 Super Thin Lens for Bifocal", category: "bifocal" },
    { id: "thick25", name: "1.75 Ultra Thin (فائق الرقة)", price: 0, description: "1.75 Ultra Thin Lens for Bifocal", category: "bifocal" }
  ],
  
  getDefaultContactLenses: () => [
    { id: "cl1", brand: "Acuvue", type: "Daily", bc: "8.5", diameter: "14.2", power: "-2.00", price: 25, qty: 30 },
    { id: "cl2", brand: "Biofinty", type: "Monthly", bc: "8.6", diameter: "14.0", power: "-3.00", price: 20, qty: 12 },
    { id: "cl3", brand: "Air Optix", type: "Monthly", bc: "8.4", diameter: "14.2", power: "+1.50", price: 22, qty: 8 }
  ],
  
  getDefaultServices: () => [
    { 
      id: "service1", 
      name: "Eye Exam", 
      description: "Standard eye examination service to evaluate eye health and vision.", 
      price: 3, 
      category: "exam" 
    }
  ],
  
  // Function to migrate default data to Supabase if needed
  migrateDefaultData: async () => {
    try {
      // Migrate lens types
      const lensTypes = get().getDefaultLensTypes();
      for (const lens of lensTypes) {
        await supabase.from('lens_types').insert({
          lens_id: lens.id,
          name: lens.name,
          type: lens.type,
          price: lens.price || null
        });
      }
      
      // Migrate lens coatings
      const lensCoatings = get().getDefaultLensCoatings();
      for (const coating of lensCoatings) {
        await supabase.from('lens_coatings').insert({
          coating_id: coating.id,
          name: coating.name,
          price: coating.price,
          description: coating.description || null,
          category: coating.category
        });
      }
      
      // Migrate lens thicknesses
      const lensThicknesses = get().getDefaultLensThicknesses();
      for (const thickness of lensThicknesses) {
        await supabase.from('lens_thicknesses').insert({
          thickness_id: thickness.id,
          name: thickness.name,
          price: thickness.price,
          description: thickness.description || null,
          category: thickness.category
        });
      }
      
      // Migrate contact lenses
      const contactLenses = get().getDefaultContactLenses();
      for (const lens of contactLenses) {
        await supabase.from('contact_lenses').insert({
          lens_id: lens.id,
          brand: lens.brand,
          type: lens.type,
          bc: lens.bc,
          diameter: lens.diameter,
          power: lens.power,
          price: lens.price,
          qty: lens.qty,
          color: lens.color || null
        });
      }
      
      // Migrate services
      const services = get().getDefaultServices();
      for (const service of services) {
        await supabase.from('services').insert({
          service_id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          category: service.category
        });
      }
      
      toast.success('Default inventory data has been migrated to the database.');
    } catch (error) {
      console.error('Failed to migrate default data:', error);
      toast.error('Failed to migrate default data: ' + handleSupabaseError(error));
    }
  },
  
  // Frame methods
  addFrame: async (frame) => {
    const frameId = `FR${Date.now()}`;
    const createdAt = new Date().toISOString();
    
    try {
      const { error } = await supabase.from('frames').insert({
        frame_id: frameId,
        brand: frame.brand,
        model: frame.model,
        color: frame.color,
        size: frame.size,
        price: frame.price,
        qty: frame.qty,
        created_at: createdAt
      });
      
      if (error) throw error;
      
      const newFrame = { ...frame, frameId, createdAt };
      
      set((state) => ({
        frames: [...state.frames, newFrame]
      }));
      
      return frameId;
    } catch (error) {
      console.error('Error adding frame:', error);
      toast.error('Failed to add frame: ' + handleSupabaseError(error));
      throw error;
    }
  },
  
  updateFrameQuantity: async (frameId, newQty) => {
    try {
      const { error } = await supabase
        .from('frames')
        .update({ qty: newQty })
        .eq('frame_id', frameId);
      
      if (error) throw error;
      
      set((state) => ({
        frames: state.frames.map(frame => 
          frame.frameId === frameId 
            ? { ...frame, qty: newQty } 
            : frame
        )
      }));
    } catch (error) {
      console.error('Error updating frame quantity:', error);
      toast.error('Failed to update frame quantity: ' + handleSupabaseError(error));
      throw error;
    }
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
  addLensType: async (lens) => {
    const id = `lens${Date.now()}`;
    
    try {
      const { error } = await supabase.from('lens_types').insert({
        lens_id: id,
        name: lens.name,
        type: lens.type,
        price: lens.price || null
      });
      
      if (error) throw error;
      
      set((state) => ({
        lensTypes: [...state.lensTypes, { ...lens, id }]
      }));
      
      return id;
    } catch (error) {
      console.error('Error adding lens type:', error);
      toast.error('Failed to add lens type: ' + handleSupabaseError(error));
      throw error;
    }
  },
  
  updateLensType: async (id, lens) => {
    try {
      const { error } = await supabase
        .from('lens_types')
        .update({
          name: lens.name,
          type: lens.type,
          price: lens.price || null
        })
        .eq('lens_id', id);
      
      if (error) throw error;
      
      set((state) => ({
        lensTypes: state.lensTypes.map(type => 
          type.id === id ? { ...type, ...lens } : type
        )
      }));
    } catch (error) {
      console.error('Error updating lens type:', error);
      toast.error('Failed to update lens type: ' + handleSupabaseError(error));
      throw error;
    }
  },
  
  deleteLensType: async (id) => {
    try {
      const { error } = await supabase
        .from('lens_types')
        .delete()
        .eq('lens_id', id);
      
      if (error) throw error;
      
      set((state) => ({
        lensTypes: state.lensTypes.filter(type => type.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting lens type:', error);
      toast.error('Failed to delete lens type: ' + handleSupabaseError(error));
      throw error;
    }
  },
  
  // Coating methods
  addLensCoating: async (coating) => {
    const id = `coat${Date.now()}`;
    
    try {
      const { error } = await supabase.from('lens_coatings').insert({
        coating_id: id,
        name: coating.name,
        price: coating.price,
        description: coating.description || null,
        category: coating.category
      });
      
      if (error) throw error;
      
      set((state) => ({
        lensCoatings: [...state.lensCoatings, { ...coating, id }]
      }));
      
      return id;
    } catch (error) {
      console.error('Error adding lens coating:', error);
      toast.error('Failed to add lens coating: ' + handleSupabaseError(error));
      throw error;
    }
  },
  
  updateLensCoating: async (id, coating) => {
    try {
      const { error } = await supabase
        .from('lens_coatings')
        .update({
          name: coating.name,
          price: coating.price,
          description: coating.description || null,
          category: coating.category
        })
        .eq('coating_id', id);
      
      if (error) throw error;
      
      set((state) => ({
        lensCoatings: state.lensCoatings.map(item => 
          item.id === id ? { ...item, ...coating } : item
        )
      }));
    } catch (error) {
      console.error('Error updating lens coating:', error);
      toast.error('Failed to update lens coating: ' + handleSupabaseError(error));
      throw error;
    }
  },
  
  deleteLensCoating: async (id) => {
    try {
      const { error } = await supabase
        .from('lens_coatings')
        .delete()
        .eq('coating_id', id);
      
      if (error) throw error;
      
      set((state) => ({
        lensCoatings: state.lensCoatings.filter(item => item.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting lens coating:', error);
      toast.error('Failed to delete lens coating: ' + handleSupabaseError(error));
      throw error;
    }
  },
  
  getLensCoatingsByCategory: (category) => {
    return get().lensCoatings.filter(coating => coating.category === category);
  },
  
  // Thickness methods
  addLensThickness: async (thickness) => {
    const id = `thick${Date.now()}`;
    
    try {
      const { error } = await supabase.from('lens_thicknesses').insert({
        thickness_id: id,
        name: thickness.name,
        price: thickness.price,
        description: thickness.description || null,
        category: thickness.category
      });
      
      if (error) throw error;
      
      set((state) => ({
        lensThicknesses: [...state.lensThicknesses, { ...thickness, id }]
      }));
      
      return id;
    } catch (error) {
      console.error('Error adding lens thickness:', error);
      toast.error('Failed to add lens thickness: ' + handleSupabaseError(error));
      throw error;
    }
  },
  
  updateLensThickness: async (id, thickness) => {
    try {
      const { error } = await supabase
        .from('lens_thicknesses')
        .update({
          name: thickness.name,
          price: thickness.price,
          description: thickness.description || null,
          category: thickness.category
        })
        .eq('thickness_id', id);
      
      if (error) throw error;
      
      set((state) => ({
        lensThicknesses: state.lensThicknesses.map(item => 
          item.id === id ? { ...item, ...thickness } : item
        )
      }));
    } catch (error) {
      console.error('Error updating lens thickness:', error);
      toast.error('Failed to update lens thickness: ' + handleSupabaseError(error));
      throw error;
    }
  },
  
  deleteLensThickness: async (id) => {
    try {
      const { error } = await supabase
        .from('lens_thicknesses')
        .delete()
        .eq('thickness_id', id);
      
      if (error) throw error;
      
      set((state) => ({
        lensThicknesses: state.lensThicknesses.filter(item => item.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting lens thickness:', error);
      toast.error('Failed to delete lens thickness: ' + handleSupabaseError(error));
      throw error;
    }
  },
  
  getLensThicknessesByCategory: (category) => {
    return get().lensThicknesses.filter(thickness => thickness.category === category);
  },
  
  // Contact lens methods
  addContactLens: async (lens) => {
    const id = `cl${Date.now()}`;
    
    try {
      const { error } = await supabase.from('contact_lenses').insert({
        lens_id: id,
        brand: lens.brand,
        type: lens.type,
        bc: lens.bc,
        diameter: lens.diameter,
        power: lens.power,
        price: lens.price,
        qty: lens.qty,
        color: lens.color || null
      });
      
      if (error) throw error;
      
      set((state) => ({
        contactLenses: [...state.contactLenses, { ...lens, id }]
      }));
      
      return id;
    } catch (error) {
      console.error('Error adding contact lens:', error);
      toast.error('Failed to add contact lens: ' + handleSupabaseError(error));
      throw error;
    }
  },
  
  updateContactLens: async (id, lens) => {
    try {
      const { error } = await supabase
        .from('contact_lenses')
        .update({
          brand: lens.brand,
          type: lens.type,
          bc: lens.bc,
          diameter: lens.diameter,
          power: lens.power,
          price: lens.price,
          qty: lens.qty,
          color: lens.color || null
        })
        .eq('lens_id', id);
      
      if (error) throw error;
      
      set((state) => ({
        contactLenses: state.contactLenses.map(item => 
          item.id === id ? { ...item, ...lens } : item
        )
      }));
    } catch (error) {
      console.error('Error updating contact lens:', error);
      toast.error('Failed to update contact lens: ' + handleSupabaseError(error));
      throw error;
    }
  },
  
  deleteContactLens: async (id) => {
    try {
      const { error } = await supabase
        .from('contact_lenses')
        .delete()
        .eq('lens_id', id);
      
      if (error) throw error;
      
      set((state) => ({
        contactLenses: state.contactLenses.filter(item => item.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting contact lens:', error);
      toast.error('Failed to delete contact lens: ' + handleSupabaseError(error));
      throw error;
    }
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
  addService: async (service) => {
    const id = `service${Date.now()}`;
    
    try {
      const { error } = await supabase.from('services').insert({
        service_id: id,
        name: service.name,
        description: service.description,
        price: service.price,
        category: service.category
      });
      
      if (error) throw error;
      
      set((state) => ({
        services: [...state.services, { ...service, id }]
      }));
      
      return id;
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Failed to add service: ' + handleSupabaseError(error));
      throw error;
    }
  },
  
  updateService: async (id, service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({
          name: service.name,
          description: service.description,
          price: service.price,
          category: service.category
        })
        .eq('service_id', id);
      
      if (error) throw error;
      
      set((state) => ({
        services: state.services.map(item => 
          item.id === id ? { ...item, ...service } : item
        )
      }));
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service: ' + handleSupabaseError(error));
      throw error;
    }
  },
  
  deleteService: async (id) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('service_id', id);
      
      if (error) throw error;
      
      set((state) => ({
        services: state.services.filter(item => item.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service: ' + handleSupabaseError(error));
      throw error;
    }
  },
  
  getServiceById: (id) => {
    return get().services.find(service => service.id === id);
  },
  
  getServicesByCategory: (category) => {
    return get().services.filter(service => service.category === category);
  }
}));
