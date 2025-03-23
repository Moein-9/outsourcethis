
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RxData {
  sphereOD: string;
  cylOD: string;
  axisOD: string;
  addOD: string;
  sphereOS: string;
  cylOS: string;
  axisOS: string;
  addOS: string;
  pdRight: string;
  pdLeft: string;
  createdAt?: string; // Date when the RX was created
}

export interface RxHistoryItem extends RxData {
  createdAt: string;
}

export interface PatientNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface ContactLensRx {
  rightEye: {
    sphere: string;
    cylinder: string;
    axis: string;
    bc: string;
    dia: string;
  };
  leftEye: {
    sphere: string;
    cylinder: string;
    axis: string;
    bc: string;
    dia: string;
  };
  createdAt?: string; // Date when the contact lens RX was created
}

export interface ContactLensRxHistoryItem extends ContactLensRx {
  createdAt: string;
}

export interface Patient {
  patientId: string;
  name: string;
  phone: string;
  dob: string;
  notes: string;
  patientNotes?: PatientNote[]; // Array of timestamped notes
  rx: RxData;
  rxHistory?: RxHistoryItem[];
  contactLensRx?: ContactLensRx; // Contact lens prescription
  contactLensRxHistory?: ContactLensRxHistoryItem[]; // History of contact lens prescriptions
  createdAt: string;
}

export interface WorkOrderEdit {
  patientId: string;
  workOrderId: string;
  updatedData: any;
}

interface PatientState {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "patientId" | "createdAt">) => string;
  getPatientById: (id: string) => Patient | undefined;
  searchPatients: (query: string) => Patient[];
  updatePatient: (patient: Patient) => void;
  updatePatientRx: (patientId: string, newRx: RxData) => void;
  updateContactLensRx: (patientId: string, newRx: ContactLensRx) => void; // New method for contact lens RX
  addPatientNote: (patientId: string, noteText: string) => void;
  deletePatientNote: (patientId: string, noteId: string) => void;
  editWorkOrder: (edit: WorkOrderEdit) => void;
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get) => ({
      patients: [],
      
      addPatient: (patient) => {
        const patientId = `PT${Date.now()}`;
        const createdAt = new Date().toISOString();
        
        // Convert notes from the text field to a PatientNote entry if provided
        const patientNotes: PatientNote[] = [];
        if (patient.notes && patient.notes.trim() !== '') {
          patientNotes.push({
            id: `note-${Date.now()}`,
            text: patient.notes,
            createdAt
          });
        }
        
        set((state) => ({
          patients: [
            ...state.patients,
            { 
              ...patient, 
              patientId, 
              createdAt,
              patientNotes: [...(patient.patientNotes || []), ...patientNotes],
              rx: {
                ...patient.rx,
                createdAt: patient.rx.createdAt || createdAt // Add creation date to initial RX
              },
              // Initialize contact lens RX if provided
              contactLensRx: patient.contactLensRx ? {
                ...patient.contactLensRx,
                createdAt: patient.contactLensRx.createdAt || createdAt
              } : undefined,
            }
          ]
        }));
        
        return patientId;
      },
      
      getPatientById: (id) => {
        return get().patients.find(p => p.patientId === id);
      },
      
      searchPatients: (query) => {
        const q = query.toLowerCase();
        return get().patients.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.phone.includes(q)
        );
      },
      
      updatePatient: (patient) => {
        set((state) => ({
          patients: state.patients.map(p => 
            p.patientId === patient.patientId ? patient : p
          )
        }));
      },
      
      updatePatientRx: (patientId, newRx) => {
        set((state) => {
          const patient = state.patients.find(p => p.patientId === patientId);
          
          if (!patient) return state;
          
          // Add timestamp to the new RX if not present
          const timestampedRx = {
            ...newRx,
            createdAt: newRx.createdAt || new Date().toISOString()
          };
          
          // Move current RX to history if it exists
          const rxHistory = [...(patient.rxHistory || [])];
          if (Object.values(patient.rx).some(v => v)) {
            rxHistory.unshift({
              ...patient.rx,
              createdAt: patient.rx.createdAt || new Date().toISOString()
            });
          }
          
          return {
            patients: state.patients.map(p => 
              p.patientId === patientId 
                ? { ...p, rx: timestampedRx, rxHistory } 
                : p
            )
          };
        });
      },
      
      // New method for updating contact lens RX
      updateContactLensRx: (patientId, newContactLensRx) => {
        set((state) => {
          const patient = state.patients.find(p => p.patientId === patientId);
          
          if (!patient) return state;
          
          // Add timestamp to the new contact lens RX if not present
          const timestampedContactLensRx = {
            ...newContactLensRx,
            createdAt: newContactLensRx.createdAt || new Date().toISOString()
          };
          
          // Move current contact lens RX to history if it exists
          const contactLensRxHistory = [...(patient.contactLensRxHistory || [])];
          if (patient.contactLensRx) {
            contactLensRxHistory.unshift({
              ...patient.contactLensRx,
              createdAt: patient.contactLensRx.createdAt || new Date().toISOString()
            });
          }
          
          return {
            patients: state.patients.map(p => 
              p.patientId === patientId 
                ? { ...p, contactLensRx: timestampedContactLensRx, contactLensRxHistory } 
                : p
            )
          };
        });
      },
      
      addPatientNote: (patientId, noteText) => {
        set((state) => {
          const patient = state.patients.find(p => p.patientId === patientId);
          
          if (!patient) return state;
          
          const newNote = {
            id: `note-${Date.now()}`,
            text: noteText,
            createdAt: new Date().toISOString()
          };
          
          return {
            patients: state.patients.map(p => 
              p.patientId === patientId 
                ? { 
                    ...p, 
                    patientNotes: [...(p.patientNotes || []), newNote] 
                  } 
                : p
            )
          };
        });
      },
      
      deletePatientNote: (patientId, noteId) => {
        set((state) => {
          const patient = state.patients.find(p => p.patientId === patientId);
          
          if (!patient || !patient.patientNotes) return state;
          
          return {
            patients: state.patients.map(p => 
              p.patientId === patientId 
                ? { 
                    ...p, 
                    patientNotes: p.patientNotes?.filter(note => note.id !== noteId) || [] 
                  } 
                : p
            )
          };
        });
      },
      
      editWorkOrder: (edit) => {
        // This will be implemented in the invoiceStore where work orders are stored
        // Here we ensure any patient-related data is updated if needed
        const { patientId, updatedData } = edit;
        
        if (updatedData.rx) {
          get().updatePatientRx(patientId, updatedData.rx);
        }
        
        if (updatedData.contactLensRx) {
          get().updateContactLensRx(patientId, updatedData.contactLensRx);
        }
      }
    }),
    {
      name: 'patient-store'
    }
  )
);
