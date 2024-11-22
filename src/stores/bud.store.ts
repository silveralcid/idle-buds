import { create } from 'zustand';
import { budInstance } from '../types/budInstance.types';
import { GameConfig } from '../constants/game-config';
import { calculateExperienceRequirement } from '../utils/experience.utils';

interface BudState {
  buds: {
    box: budInstance[];
    party: budInstance[];
  };
}

interface BudActions {
  // Bud Management
  addBudToBox: (bud: budInstance) => void;
  addBudToParty: (budId: string) => boolean;
  moveBudToBox: (budId: string) => void;
  getBud: (budId: string) => budInstance | null;
  
  // Experience & Stats
  gainExperience: (budId: string, amount: number) => void;
  
  // State Management
  updateBud: (budId: string, updates: Partial<budInstance>) => void;
  resetBuds: () => void;
  saveBudState: () => object;
  loadBudState: (state: any) => void;
}

export const useBudStore = create<BudState & BudActions>((set, get) => ({
  buds: {
    box: [],
    party: []
  },

  // Bud Management
  addBudToBox: (bud) => set((state) => ({
    buds: {
      ...state.buds,
      box: [...state.buds.box, bud]
    }
  })),

  addBudToParty: (budId) => {
    const state = get();
    const bud = state.buds.box.find(b => b.id === budId);
    
    if (!bud || state.buds.party.length >= GameConfig.BUD.STORAGE.PARTY_CAPACITY) {
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

  // Experience & Stats
  gainExperience: (budId, amount) => {
    const bud = get().getBud(budId);
    if (!bud) return;

    const newExperience = bud.experience + amount;
    const experienceToNextLevel = calculateExperienceRequirement(bud.level);

    if (newExperience >= experienceToNextLevel) {
      const remainingExp = newExperience - experienceToNextLevel;
      get().updateBud(budId, {
        level: bud.level + 1,
        experience: remainingExp,
        experienceToNextLevel: calculateExperienceRequirement(bud.level + 1)
      });
    } else {
      get().updateBud(budId, { experience: newExperience });
    }
  },

  // State Management
  updateBud: (budId, updates) => set((state) => {
    const updateBudInArray = (buds: budInstance[]) => 
      buds.map(b => b.id === budId ? { ...b, ...updates } : b);

    return {
      buds: {
        box: updateBudInArray(state.buds.box),
        party: updateBudInArray(state.buds.party)
      }
    };
  }),

  resetBuds: () => set({ buds: { box: [], party: [] } }),

  saveBudState: () => {
    const state = get();
    return {
      buds: state.buds
    };
  },

  loadBudState: (savedState) => {
    if (!savedState?.buds) return;
    set({ buds: savedState.buds });
  }
}));