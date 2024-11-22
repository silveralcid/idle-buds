// stores/features/activity.store.ts
import { create } from 'zustand';
import { budInstance } from '../types/budInstance.types';
import { GameConfig } from '../constants/game-config';
import { createBudInstance } from '../factories/budFactory';
import { budBase } from '../types/budBase.types';

interface ActiveBudState {
  party: budInstance[];
  activeBuds: budInstance[];
  budActivities: Record<string, {
    type: 'gathering' | 'crafting';
    nodeId: string;
    budId: string;
    recipeId?: string;
    experience?: number;
  }>;
  budProgress: Record<string, {
    items: Record<string, number>;
    xp: Record<string, number>;
  }>;
}

interface ActiveBudActions {
  // Party Management
  addBudToParty: (bud: budInstance) => boolean;
  removeBudFromParty: (budId: string) => void;
  getBudFromParty: (budId: string) => budInstance | null;
  
  // Activity Management
  startBudActivity: (budId: string, type: 'gathering' | 'crafting', nodeId: string) => boolean;
  stopBudActivity: (budId: string) => void;
  getBudActivity: (budId: string) => ActiveBudState['budActivities'][string] | null;
  updateBudProgress: (deltaTime: number) => void;
  getBudProgress: (nodeId: string) => number;
  
  // State Management
  resetBudState: () => void;
  saveBudState: () => object;
  loadBudState: (state: any) => void;
  increaseBudSkillExperience: (budId: string, xp: number) => void;
  createBud: (species: budBase) => budInstance;
}

const initialState: ActiveBudState = {
  party: [],
  activeBuds: [],
  budActivities: {},
  budProgress: {}
};

export const useActiveBudStore = create<ActiveBudState & ActiveBudActions>((set, get) => ({
  ...initialState,

  // Party Management
  addBudToParty: (bud) => {
    const state = get();
    if (state.party.length >= GameConfig.BUD.STORAGE.PARTY_CAPACITY) {
      console.warn('❌ Party is full');
      return false;
    }

    set((state) => ({
      party: [...state.party, bud]
    }));
    console.log('✅ Added bud to party:', { budId: bud.id });
    return true;
  },

  removeBudFromParty: (budId) => {
    console.log('🔄 Removing bud from party:', { budId });
    set((state) => ({
      party: state.party.filter(b => b.id !== budId),
      // Also clean up any active activities
      budActivities: Object.fromEntries(
        Object.entries(state.budActivities).filter(([id]) => id !== budId)
      )
    }));
  },

  getBudFromParty: (budId) => {
    const state = get();
    return state.party.find(b => b.id === budId) || 
           state.activeBuds.find(b => b.id === budId) || 
           null;
  },

  // Activity Management
  startBudActivity: (budId, type, nodeId) => {
    const state = get();
    if (state.budActivities[budId]) {
      console.warn('❌ Bud is already assigned to an activity', { budId });
      return false;
    }

    const bud = state.party.find(b => b.id === budId);
    if (!bud) {
      console.warn('❌ Bud not found in party', { budId });
      return false;
    }

    set((state) => ({
      party: state.party.filter(b => b.id !== budId),
      activeBuds: [...state.activeBuds, bud],
      budActivities: {
        ...state.budActivities,
        [budId]: { type, nodeId, budId }
      }
    }));
    console.log('✅ Started bud activity:', { budId, type, nodeId });
    return true;
  },

  stopBudActivity: (budId) => {
    const state = get();
    const bud = state.activeBuds.find(b => b.id === budId);
    
    if (bud) {
      set((state) => {
        const { [budId]: _, ...remainingActivities } = state.budActivities;
        return {
          budActivities: remainingActivities,
          activeBuds: state.activeBuds.filter(b => b.id !== budId),
          party: [...state.party, bud]
        };
      });
      console.log('✅ Stopped bud activity and returned to party:', { budId });
    }
  },

  getBudActivity: (budId) => {
    return get().budActivities[budId] || null;
  },

  updateBudProgress: (deltaTime) => {
    set((state) => {
      const newProgress = { ...state.budProgress };
      
      Object.entries(state.budActivities).forEach(([budId, activity]) => {
        if (!newProgress[budId]) {
          newProgress[budId] = { items: {}, xp: {} };
        }
        
        const nodeId = activity.nodeId;
        newProgress[budId].items[nodeId] = 
          (newProgress[budId].items[nodeId] || 0) + deltaTime;
        newProgress[budId].xp[nodeId] = 
          (newProgress[budId].xp[nodeId] || 0) + deltaTime;
      });

      return { budProgress: newProgress };
    });
  },

  getBudProgress: (nodeId) => {
    const state = get();
    return Object.keys(state.budActivities).reduce((max, budId) => {
      const progress = state.budProgress[budId]?.items[nodeId] || 0;
      return Math.max(max, progress);
    }, 0) * 100;
  },

  // State Management
  resetBudState: () => set(initialState),

  saveBudState: () => {
    const state = get();
    return {
      party: state.party,
      budActivities: state.budActivities,
      budProgress: state.budProgress
    };
  },

  loadBudState: (savedState) => {
    if (!savedState) return;
    set({
      party: savedState.party || [],
      budActivities: savedState.budActivities || {},
      budProgress: savedState.budProgress || {}
    });
  },

  increaseBudSkillExperience: (budId: string, xp: number) => 
    set((state) => ({
      budActivities: {
        ...state.budActivities,
        [budId]: {
          ...state.budActivities[budId],
          experience: (state.budActivities[budId]?.experience || 0) + xp
        }
      }
    })),

  createBud: (species) => {
    const newBud = createBudInstance(species);
    console.log('✅ Created new bud:', { budId: newBud.id, species: species.name });
    return newBud;
  }
}));

export const getBudParty = (state: ActiveBudState) => state.party;

