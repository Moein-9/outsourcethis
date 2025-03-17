
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

export interface Patient {
  patientId: string;
  name: string;
  phone: string;
  dob: string;
  notes: string;
  rx: RxData;
  createdAt: string;
}

interface PatientState {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "patientId" | "createdAt">) => void;
  getPatientById: (id: string) => Patient | undefined;
  searchPatients: (query: string) => Patient[];
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
      }
    }),
    {
      name: 'patient-store'
    }
  )
);
