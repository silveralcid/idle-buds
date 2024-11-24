import { create } from 'zustand';

interface ViewState {
  currentView: string;
  setView: (view: string) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: 'mining', // Default to empty or "mining"
  setView: (view) => set({ currentView: view }),
}));
