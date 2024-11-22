import { create } from 'zustand';
import { budInstance } from '../types/budInstance.types';

interface BoxBudState {
  box: budInstance[];
}

interface BoxBudActions {
  addBudToBox: (bud: budInstance) => void;
  removeBudFromBox: (budId: string) => budInstance | null;
  getBudFromBox: (budId: string) => budInstance | null;
  updateBud: (budId: string, updates: Partial<budInstance>) => void;
  resetBox: () => void;
  saveState: () => object;
  loadState: (state: any) => void;
}

export const useBoxBudStore = create<BoxBudState & BoxBudActions>((set, get) => ({
  box: [],

  addBudToBox: (bud) => {
    console.log('📦 Adding bud to box:', { budId: bud.id });
    set((state) => ({
      box: [...state.box, bud]
    }));
  },

  removeBudFromBox: (budId) => {
    const state = get();
    const bud = state.box.find(b => b.id === budId);
    if (!bud) return null;

    set((state) => ({
      box: state.box.filter(b => b.id !== budId)
    }));
    return bud;
  },

  getBudFromBox: (budId) => {
    return get().box.find(b => b.id === budId) || null;
  },

  updateBud: (budId, updates) => {
    set((state) => ({
      box: state.box.map(b => 
        b.id === budId ? { ...b, ...updates } : b
      )
    }));
  },

  resetBox: () => set({ box: [] }),

  saveState: () => ({
    box: get().box
  }),

  loadState: (savedState) => {
    if (!savedState?.box) return;
    set({ box: savedState.box });
  }
}));