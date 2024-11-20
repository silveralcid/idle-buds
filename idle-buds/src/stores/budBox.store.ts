import { create } from 'zustand';
import { budInstance } from '../types/budInstance.types';

interface BudBoxState {
  buds: budInstance[];
  addBud: (bud: budInstance) => void;
  removeBud: (budId: string) => void;
}

export const useBudBoxStore = create<BudBoxState>((set) => ({
  buds: [],
  addBud: (bud) => set((state) => ({
    buds: [...state.buds, bud],
  })),
  removeBud: (budId) => set((state) => ({
    buds: state.buds.filter((bud) => bud.id !== budId),
  })),
}));