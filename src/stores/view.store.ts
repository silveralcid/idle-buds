import { create } from 'zustand';

interface ViewState {
  currentView: string;
  availableViews: string[]; // List of valid views
  setView: (view: string) => void;
}

export const useViewStore = create<ViewState>((set, get) => ({
  currentView: 'mining', // Default to "mining"
  availableViews: ['mining', 'smithing', 'lumbering'], // Add all views here
  setView: (view) => {
    const { availableViews } = get();
    if (availableViews.includes(view)) {
      set({ currentView: view });
    } else {
      console.warn(`View "${view}" is not available.`);
    }
  },
}));
