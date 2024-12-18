import { create } from 'zustand';
import { budInstance } from '../../types/budInstance.types';
import { budBase } from '../../types/budBase.types';
import { createBudInstance } from '../../factories/budFactory';

interface PartyState {
  buds: Record<string, budInstance>;
  selectedBudId: string | null;
  addBud: (budId: string) => boolean; // Returns success status
  removeBud: (budId: string) => void;
  getBud: (budId: string) => budInstance | undefined;
  getAllBuds: () => budInstance[];
  selectBud: (budId: string | null) => void;
  isPartyFull: () => boolean;
  getPartySize: () => number;
  MAX_PARTY_SIZE: number;
}

export const usePartyStore = create<PartyState>((set, get) => ({
  buds: {},
  selectedBudId: null,
  MAX_PARTY_SIZE: 6,

  addBud: (budId: string) => {
    const state = get();
    if (Object.keys(state.buds).length >= state.MAX_PARTY_SIZE) {
      return false;
    }

    set((state) => ({
      buds: {
        ...state.buds,
        [budId]: state.buds[budId]
      }
    }));
    return true;
  },

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

  isPartyFull: () => {
    const state = get();
    return Object.keys(state.buds).length >= state.MAX_PARTY_SIZE;
  },

  getPartySize: () => {
    const state = get();
    return Object.keys(state.buds).length;
  }
}));
