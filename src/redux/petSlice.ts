import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdoptionApplication, AdoptionApplicationDetailsForAdmin, PetProfile } from '@/types/type';

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

type Application<T> = {
  applications: T[];
  pagination: Pagination;
}

type PetData = {
  pets: PetProfile[];
  pagination:  {
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  }
}

interface PetState {
  petData: PetData;
  adoptionApplicationList: Application<AdoptionApplication>;
  adoptionApplicationListForAdmin: Application<AdoptionApplicationDetailsForAdmin>;
}

const initialState: PetState = {
  petData: { pets: [], pagination: { total: 0, page: 0, totalPages: 0, hasMore: false } },
  adoptionApplicationList: { applications: [], pagination: { currentPage: 0, totalPages: 0, totalItems: 0, itemsPerPage: 0 } },
  adoptionApplicationListForAdmin: { applications: [], pagination: { currentPage: 0, totalPages: 0, totalItems: 0, itemsPerPage: 0 } },
};

const petSlice = createSlice({
  name: 'pet',
  initialState,
  reducers: {
    addPet: (state, action: PayloadAction<PetProfile>) => {
      if (!state.petData.pets?.some(pet => pet.id === action.payload.id)) state.petData.pets.push(action.payload);
    },
    setPets: (state, action: PayloadAction<PetData>) => {
      // Remove duplicates by ID using a Map or Set
      const uniquePets = Array.from(
        new Map(action.payload.pets.map(pet => [pet.id, pet])).values()
      );
      
      // Update the state with the filtered (unique) list and pagination
      state.petData.pets = uniquePets;
      state.petData.pagination = action.payload.pagination;
    },
    updatePet: (state, action: PayloadAction<{ id: string; updates: Partial<PetProfile>; partial?: boolean }>) => {
      const { id, updates, partial } = action.payload;
      if(!partial) {
        const index = state.petData.pets.findIndex(pet => pet.id === id);
        if (index !== -1) {
          state.petData.pets[index] = { ...state.petData.pets[index], ...updates };
        }
      } else {
        state.petData.pets = [...state.petData.pets.filter(pet => pet.id !== id), updates as PetProfile]
      }
    },
    deletePet: (state, action: PayloadAction<string>) => {
      state.petData.pets = state.petData.pets.filter(pet => pet.id !== action.payload);
    },
    setAdoptionApplicationList: (state, action: PayloadAction<Application<AdoptionApplication>>) => {
      // Remove duplicates by ID using a Map or Set
      const uniqueApplications = Array.from(
        new Map(action.payload.applications.map(app => [app._id, app])).values()
      );
      
      // Update the state with the filtered (unique) list
      state.adoptionApplicationList.applications = uniqueApplications;
      state.adoptionApplicationList.pagination = action.payload.pagination;
    },
    setAdoptionApplicationListForAdmin: (state, action: PayloadAction<Application<AdoptionApplicationDetailsForAdmin>>) => {
      // Remove duplicates by ID using a Map or Set
      const uniqueApplications = Array.from(
        new Map(action.payload.applications.map(app => [app._id, app])).values()
      );
      
      // Update the state with the filtered (unique) list
      state.adoptionApplicationListForAdmin.applications = uniqueApplications;
      state.adoptionApplicationListForAdmin.pagination = action.payload.pagination;
    },
    addAdoptionApplication: (state, action: PayloadAction<AdoptionApplication>) => {
      state.adoptionApplicationList.applications.push(action.payload);
    },
    updateAdoptionApplication: (state, action: PayloadAction<{ id: string; updates: Partial<AdoptionApplication>; partial?: boolean }>) => {
      const { id, updates, partial } = action.payload;
      if(!partial) {
        const index = state.adoptionApplicationList.applications.findIndex(application => application._id === id);
        if (index !== -1) {
          state.adoptionApplicationList.applications[index] = { ...state.adoptionApplicationList.applications[index], ...updates };
        }
      }
    },
    deleteAdoptionApplication: (state, action: PayloadAction<string>) => {
      state.adoptionApplicationList.applications = state.adoptionApplicationList.applications.filter(application => application._id !== action.payload);
    },
    addAdoptionApplicationForAdmin: (state, action: PayloadAction<AdoptionApplicationDetailsForAdmin>) => {
      state.adoptionApplicationListForAdmin.applications.push(action.payload);
    },
    updateAdoptionApplicationForAdmin: (state, action: PayloadAction<{ id: string; updates: Partial<AdoptionApplicationDetailsForAdmin>; partial?: boolean }>) => {
      const { id, updates, partial } = action.payload;
      if(!partial) {
          const index = state.adoptionApplicationListForAdmin.applications.findIndex(application => application._id === id);
        if (index !== -1) {
          state.adoptionApplicationListForAdmin.applications[index] = { ...state.adoptionApplicationListForAdmin.applications[index], ...updates };
        }
      }
    },
    deleteAdoptionApplicationForAdmin: (state, action: PayloadAction<string>) => {
      state.adoptionApplicationListForAdmin.applications = state.adoptionApplicationListForAdmin.applications.filter(application => application._id !== action.payload);
    }
  },
});

export const { addPet, setPets, updatePet, deletePet, setAdoptionApplicationList, addAdoptionApplication, updateAdoptionApplication, deleteAdoptionApplication, setAdoptionApplicationListForAdmin, addAdoptionApplicationForAdmin, updateAdoptionApplicationForAdmin, deleteAdoptionApplicationForAdmin } = petSlice.actions;

export default petSlice.reducer;
