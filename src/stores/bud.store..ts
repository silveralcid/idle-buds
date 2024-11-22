import { create } from 'zustand';
import { budInstance } from '../types/budInstance.types';
import { GameConfig } from '../constants/gameConfig';

interface BudState {
  buds: {
    box: budInstance[];
    party: budInstance[];
  };
  addBudToBox: (bud: budInstance) => void;
  addBudToParty: (budId: string) => boolean;
  moveBudToBox: (budId: string) => void;
  getBud: (budId: string) => budInstance | null;
  updateBud: (budId: string, updates: Partial<budInstance>) => void;
  resetBuds: () => void;
}

export const useBudStore = create<BudState>((set, get) => ({
  buds: {
    box: [],
    party: []
  },

  addBudToBox: (bud) => set((state) => ({
    buds: {
      ...state.buds,
      box: [...state.buds.box, bud]
    }
  })),

  addBudToParty: (budId) => {
    const state = get();
    const bud = state.buds.box.find(b => b.id === budId);
    
    if (!bud || state.buds.party.length >= GameConfig.partyCapacity) {
      return false;
    }

    set((state) => ({
      buds: {
        box: state.buds.box.filter(b => b.id !== budId),
        party: [...state.buds.party, bud]
      }
    }));
    return true;
  },

  moveBudToBox: (budId) => {
    const state = get();
    const bud = state.buds.party.find(b => b.id === budId);
    
    if (!bud) return;

    set((state) => ({
      buds: {
        party: state.buds.party.filter(b => b.id !== budId),
        box: [...state.buds.box, bud]
      }
    }));
  },

  getBud: (budId) => {
    const state = get();
    return state.buds.box.find(b => b.id === budId) || 
           state.buds.party.find(b => b.id === budId) || 
           null;
  },

  updateBud: (budId, updates) => set((state) => {
    const newState = { ...state };
    const updateBudInArray = (buds: budInstance[]) => 
      buds.map(b => b.id === budId ? { ...b, ...updates } : b);

    newState.buds.box = updateBudInArray(state.buds.box);
    newState.buds.party = updateBudInArray(state.buds.party);
    
    return newState;
  }),

  resetBuds: () => set({ buds: { box: [], party: [] } })
}));
