import { create } from "zustand";

interface ViewState {
  currentView: string;
  setView: (view: string) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: "MiningView", // Default view
  setView: (view: string) => set({ currentView: view }), // Explicitly typed parameter
}));
