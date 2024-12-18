import { create } from 'zustand';
import { budInstance } from '../../types/budInstance.types';
import { budBase } from '../../types/budBase.types';
import { createBudInstance } from '../../factories/budFactory';

interface BudBoxState {
  buds: Record<string, budInstance>;
  selectedBudId: string | null;
  addBud: (base: budBase) => void;
  removeBud: (budId: string) => void;
  getBud: (budId: string) => budInstance | undefined;
  getAllBuds: () => budInstance[];
  selectBud: (budId: string | null) => void;
  renameBud: (budId: string, nickname: string) => void;
  adjustBudLevel: (budId: string, newLevel: number) => void;
  deleteAllBuds: () => void;
}

export const useBudBoxStore = create<BudBoxState>((set, get) => ({
  buds: {},
  selectedBudId: null,

  addBud: (base: budBase) => 
    set((state) => {
      const newBud = createBudInstance(base);
      return {
        buds: {
          ...state.buds,
          [newBud.id]: newBud
        }
      };
    }),

  removeBud: (budId: string) =>
    set((state) => {
      const newBuds = { ...state.buds };
      delete newBuds[budId];
      return { buds: newBuds };
    }),

  getBud: (budId: string) => {
    const state = get();
    return state.buds[budId];
  },

  getAllBuds: () => {
    const state = get();
    return Object.values(state.buds);
  },

  selectBud: (budId: string | null) =>
    set(() => ({
      selectedBudId: budId
    })),

  renameBud: (budId: string, nickname: string) =>
    set((state) => {
      const bud = state.buds[budId];
      if (!bud) return state;

      return {
        buds: {
          ...state.buds,
          [budId]: {
            ...bud,
            nickname
          }
        }
      };
    }),

  adjustBudLevel: (budId: string, newLevel: number) =>
    set((state) => {
      const bud = state.buds[budId];
      if (!bud) return state;

      return {
        buds: {
          ...state.buds,
          [budId]: {
            ...bud,
            level: Math.min(Math.max(1, newLevel), 100)
          }
        }
      };
    }),

  deleteAllBuds: () => 
    set(() => ({
      buds: {},
      selectedBudId: null
    })),
}));
