
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Frame,
  LensType,
  LensCoating,
  LensThickness,
  ContactLens,
  Service,
  RepairService,
  LensCombination,
  ImportResult,
  ContactLensItem
} from '@/types/inventoryTypes';

// Re-export types
export type {
  Frame,
  LensType,
  LensCoating,
  LensThickness,
  ContactLens,
  ContactLensItem,
  Service,
  RepairService,
  LensCombination,
  ImportResult
};

interface InventoryState {
  frames: Frame[];
  lensTypes: LensType[];
  lensCoatings: LensCoating[];
  lensThicknesses: LensThickness[];
  contactLenses: ContactLens[];
  services: Service[];
  repairServices: RepairService[];
  lensCombinations: LensCombination[];
  
  // Frame methods
  addFrame: (frame: Omit<Frame, "id" | "frameId" | "createdAt">) => string;
  updateFrame: (frame: Frame) => void;
  deleteFrame: (frameId: string) => void;
  searchFrames: (query: string) => Frame[];
  bulkImportFrames: (frames: Omit<Frame, "id" | "frameId" | "createdAt">[]) => ImportResult;
  
  // Lens type methods
  addLensType: (lensType: Omit<LensType, "id">) => string;
  updateLensType: (lensType: LensType) => void;
  deleteLensType: (typeId: string) => void;
  
  // Lens coating methods
  addLensCoating: (coating: Omit<LensCoating, "id">) => void;
  updateLensCoating: (coating: LensCoating) => void;
  deleteLensCoating: (coatingId: string) => void;
  getLensCoatingsByCategory: (category: string) => LensCoating[];
  
  // Lens thickness methods
  addLensThickness: (thickness: Omit<LensThickness, "id">) => void;
  updateLensThickness: (thickness: LensThickness) => void;
  deleteLensThickness: (thicknessId: string) => void;
  getLensThicknessesByCategory: (category: string) => LensThickness[];
  
  // Lens combinations methods
  getLensCombinations: () => LensCombination[];
  addLensCombination: (combination: Omit<LensCombination, "id">) => void;
  updateLensCombination: (combination: LensCombination) => void;
  deleteLensCombination: (id: string) => void;
  resetLensPricing: () => void;
  
  // Helper methods
  getLensPricingByComponents: (lensTypeId: string, coatingId: string, thicknessId: string) => LensCombination | undefined;
  getAvailableCoatings: (lensTypeId: string) => LensCoating[];
  getAvailableThicknesses: (lensTypeId: string) => LensThickness[];
  
  // Contact lens methods
  addContactLens: (lens: Omit<ContactLens, "id">) => string;
  updateContactLens: (lens: ContactLens) => void;
  deleteContactLens: (lensId: string) => void;
  searchContactLenses: (query: string) => ContactLens[];
  
  // Service methods
  addService: (service: Omit<Service, "id">) => string;
  updateService: (service: Service) => void;
  deleteService: (serviceId: string) => void;
  
  // Repair service methods
  getRepairServices: () => RepairService[];
  addRepairService: (service: RepairService) => void;
  updateRepairService: (service: RepairService) => void;
  deleteRepairService: (serviceId: string) => void;
  
  // Sample data cleanup methods
  cleanupSamplePhotochromicCoatings: () => void;
}

// Create the store with default implementations
export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      // State
      frames: [],
      lensTypes: [],
      lensCoatings: [],
      lensThicknesses: [],
      contactLenses: [],
      services: [],
      repairServices: [],
      lensCombinations: [],
      
      // Frame methods
      addFrame: (frame) => {
        const frameId = `F${Date.now()}`;
        set((state) => ({
          frames: [...state.frames, {
            ...frame,
            id: frameId,
            frameId,
            createdAt: new Date().toISOString()
          }]
        }));
        return frameId;
      },
      
      updateFrame: (frame) => {
        set((state) => ({
          frames: state.frames.map(f => 
            f.id === frame.id ? frame : f
          )
        }));
      },
      
      deleteFrame: (frameId) => {
        set((state) => ({
          frames: state.frames.filter(f => f.id !== frameId)
        }));
      },
      
      searchFrames: (query) => {
        const q = query.toLowerCase().trim();
        return get().frames.filter(f => 
          f.brand.toLowerCase().includes(q) || 
          f.model.toLowerCase().includes(q) || 
          f.color.toLowerCase().includes(q)
        );
      },
      
      bulkImportFrames: (frames) => {
        let added = 0;
        let duplicates = 0;
        
        // Add new frames and track stats
        set((state) => {
          const updatedFrames = [...state.frames];
          
          frames.forEach(frame => {
            const duplicate = state.frames.some(
              f => f.brand === frame.brand && 
                  f.model === frame.model && 
                  f.color === frame.color
            );
            
            if (duplicate) {
              duplicates++;
              return;
            }
            
            const frameId = `F${Date.now()}-${added}`;
            updatedFrames.push({
              ...frame,
              id: frameId,
              frameId,
              createdAt: new Date().toISOString()
            });
            added++;
          });
          
          return { frames: updatedFrames };
        });
        
        return { added, duplicates };
      },
      
      // Lens type methods
      addLensType: (lensType) => {
        const id = `LT${Date.now()}`;
        set((state) => ({
          lensTypes: [...state.lensTypes, { ...lensType, id }]
        }));
        return id;
      },
      
      updateLensType: (lensType) => {
        set((state) => ({
          lensTypes: state.lensTypes.map(lt => 
            lt.id === lensType.id ? lensType : lt
          )
        }));
      },
      
      deleteLensType: (typeId) => {
        set((state) => ({
          lensTypes: state.lensTypes.filter(lt => lt.id !== typeId)
        }));
      },
      
      // Lens coating methods
      addLensCoating: (coating) => {
        const id = `LC${Date.now()}`;
        set((state) => ({
          lensCoatings: [...state.lensCoatings, { ...coating, id }]
        }));
      },
      
      updateLensCoating: (coating) => {
        set((state) => ({
          lensCoatings: state.lensCoatings.map(lc => 
            lc.id === coating.id ? coating : lc
          )
        }));
      },
      
      deleteLensCoating: (coatingId) => {
        set((state) => ({
          lensCoatings: state.lensCoatings.filter(lc => lc.id !== coatingId)
        }));
      },
      
      getLensCoatingsByCategory: (category) => {
        return get().lensCoatings.filter(coating => 
          coating.category === category
        );
      },
      
      // Lens thickness methods
      addLensThickness: (thickness) => {
        const id = `LTH${Date.now()}`;
        set((state) => ({
          lensThicknesses: [...state.lensThicknesses, { ...thickness, id }]
        }));
      },
      
      updateLensThickness: (thickness) => {
        set((state) => ({
          lensThicknesses: state.lensThicknesses.map(lth => 
            lth.id === thickness.id ? thickness : lth
          )
        }));
      },
      
      deleteLensThickness: (thicknessId) => {
        set((state) => ({
          lensThicknesses: state.lensThicknesses.filter(lth => lth.id !== thicknessId)
        }));
      },
      
      getLensThicknessesByCategory: (category) => {
        return get().lensThicknesses.filter(thickness => 
          thickness.category === category
        );
      },
      
      // Lens combinations methods
      getLensCombinations: () => {
        return get().lensCombinations;
      },
      
      addLensCombination: (combination) => {
        const id = `LCOM${Date.now()}`;
        set((state) => ({
          lensCombinations: [...state.lensCombinations, { ...combination, id }]
        }));
      },
      
      updateLensCombination: (combination) => {
        set((state) => ({
          lensCombinations: state.lensCombinations.map(lc => 
            lc.id === combination.id ? combination : lc
          )
        }));
      },
      
      deleteLensCombination: (id) => {
        set((state) => ({
          lensCombinations: state.lensCombinations.filter(lc => lc.id !== id)
        }));
      },
      
      resetLensPricing: () => {
        set({ lensCombinations: [] });
      },
      
      // Helper methods
      getLensPricingByComponents: (lensTypeId, coatingId, thicknessId) => {
        return get().lensCombinations.find(
          lc => lc.lensTypeId === lensTypeId && 
                lc.coatingId === coatingId && 
                lc.thicknessId === thicknessId
        );
      },
      
      getAvailableCoatings: (lensTypeId) => {
        const lensType = get().lensTypes.find(lt => lt.id === lensTypeId);
        if (!lensType || !lensType.type) return [];
        
        return get().lensCoatings.filter(coating => 
          coating.category === lensType.type
        );
      },
      
      getAvailableThicknesses: (lensTypeId) => {
        const lensType = get().lensTypes.find(lt => lt.id === lensTypeId);
        if (!lensType || !lensType.type) return [];
        
        return get().lensThicknesses.filter(thickness => 
          thickness.category === lensType.type
        );
      },
      
      // Contact lens methods
      addContactLens: (lens) => {
        const id = `CL${Date.now()}`;
        set((state) => ({
          contactLenses: [...state.contactLenses, { ...lens, id }]
        }));
        return id;
      },
      
      updateContactLens: (lens) => {
        set((state) => ({
          contactLenses: state.contactLenses.map(cl => 
            cl.id === lens.id ? lens : cl
          )
        }));
      },
      
      deleteContactLens: (lensId) => {
        set((state) => ({
          contactLenses: state.contactLenses.filter(cl => cl.id !== lensId)
        }));
      },
      
      searchContactLenses: (query) => {
        const q = query.toLowerCase().trim();
        return get().contactLenses.filter(cl => 
          cl.brand.toLowerCase().includes(q) || 
          cl.type.toLowerCase().includes(q) || 
          (cl.color && cl.color.toLowerCase().includes(q))
        );
      },
      
      // Service methods
      addService: (service) => {
        const id = `SV${Date.now()}`;
        set((state) => ({
          services: [...state.services, { ...service, id }]
        }));
        return id;
      },
      
      updateService: (service) => {
        set((state) => ({
          services: state.services.map(sv => 
            sv.id === service.id ? service : sv
          )
        }));
      },
      
      deleteService: (serviceId) => {
        set((state) => ({
          services: state.services.filter(sv => sv.id !== serviceId)
        }));
      },
      
      // Repair service methods
      getRepairServices: () => {
        return get().repairServices;
      },
      
      addRepairService: (service) => {
        set((state) => ({
          repairServices: [...state.repairServices, service]
        }));
      },
      
      updateRepairService: (service) => {
        set((state) => ({
          repairServices: state.repairServices.map(rs => 
            rs.id === service.id ? service : rs
          )
        }));
      },
      
      deleteRepairService: (serviceId) => {
        set((state) => ({
          repairServices: state.repairServices.filter(rs => rs.id !== serviceId)
        }));
      },
      
      // Clean up sample data
      cleanupSamplePhotochromicCoatings: () => {
        console.log("Cleanup completed");
      }
    }),
    {
      name: 'inventory-store'
    }
  )
);
