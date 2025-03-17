
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
}

export interface RxHistoryItem extends RxData {
  createdAt: string;
}

export interface Patient {
  patientId: string;
  name: string;
  phone: string;
  dob: string;
  notes: string;
  rx: RxData;
  rxHistory?: RxHistoryItem[];
  createdAt: string;
}

interface PatientState {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "patientId" | "createdAt">) => string;
  getPatientById: (id: string) => Patient | undefined;
  searchPatients: (query: string) => Patient[];
  updatePatient: (patient: Patient) => void;
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get) => ({
      patients: [],
      
      addPatient: (patient) => {
        const patientId = `PT${Date.now()}`;
        const createdAt = new Date().toISOString();
        
        set((state) => ({
          patients: [
            ...state.patients,
            { ...patient, patientId, createdAt }
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
      }
    }),
    {
      name: 'patient-store'
    }
  )
);
