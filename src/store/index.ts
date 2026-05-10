import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

interface TripStore {
  trips: any[];
  currentTrip: any | null;
  setTrips: (trips: any[]) => void;
  setCurrentTrip: (trip: any | null) => void;
  addTrip: (trip: any) => void;
  removeTrip: (id: string) => void;
}

export const useTripStore = create<TripStore>((set) => ({
  trips: [],
  currentTrip: null,
  setTrips: (trips) => set({ trips }),
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  addTrip: (trip) =>
    set((state) => ({
      trips: [trip, ...state.trips],
    })),
  removeTrip: (id) =>
    set((state) => ({
      trips: state.trips.filter((t) => t._id !== id),
    })),
}));
