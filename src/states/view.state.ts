import { create } from 'zustand';

interface ViewState {
  currentView: string;
  setView: (view: string) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: 'LumberingView', // Default view
  setView: (view) => set({ currentView: view }),
}));
