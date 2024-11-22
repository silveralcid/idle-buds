import { create } from 'zustand';
import { budInstance } from '../types/budInstance.types';
import { GameConfig } from '../constants/game-config';
import { calculateExperienceRequirement } from '../utils/experience.utils';
import { budBase } from '../types/budBase.types';
import { createBudInstance } from '../factories/budFactory';

interface BudState {
  buds: {
    box: budInstance[];
    party: budInstance[];
    activities: Record<string, {
      type: 'gathering' | 'crafting';
      nodeId: string;
    }>;
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
  
  // Activity Management
  assignBudToNode: (budId: string, nodeId: string) => boolean;
  unassignBud: (budId: string) => boolean;
  
  // Add this new action
  createAndAddBud: (base: budBase) => budInstance;
}

export const useBudStore = create<BudState & BudActions>((set, get) => ({
  buds: {
    box: [],
    party: [],
    activities: {}
  },

  // Bud Management
  addBudToBox: (bud) => {
    console.log('📦 Adding bud to box:', { budId: bud.id });
    set((state) => ({
      buds: {
        ...state.buds,
        box: [...state.buds.box, bud]
      }
    }));
  },

  addBudToParty: (budId) => {
    const state = get();
    const bud = state.buds.box.find(b => b.id === budId);
    
    if (!bud) {
      console.warn('❌ Bud not found in box:', { budId });
      return false;
    }

    if (state.buds.party.length >= GameConfig.BUD.STORAGE.PARTY_CAPACITY) {
      console.warn('❌ Party is full');
      return false;
    }

    set((state) => ({
      buds: {
        ...state.buds,
        box: state.buds.box.filter(b => b.id !== budId),
        party: [...state.buds.party, bud]
      }
    }));
    
    console.log('✅ Added bud to party:', { budId });
    return true;
  },

  moveBudToBox: (budId) => {
    const state = get();
    const bud = state.buds.party.find(b => b.id === budId);
    
    if (!bud) {
      console.warn('❌ Bud not found in party:', { budId });
      return;
    }

    set((state) => ({
      buds: {
        ...state.buds,
        party: state.buds.party.filter(b => b.id !== budId),
        box: [...state.buds.box, bud],
        activities: {
          ...state.buds.activities
        }
      }
    }));
    
    console.log('✅ Moved bud to box:', { budId });
  },

  getBud: (budId) => {
    const state = get();
    return state.buds.box.find(b => b.id === budId) || 
           state.buds.party.find(b => b.id === budId) || 
           null;
  },

  // Experience & Stats
  gainExperience: (budId, amount) => {
    console.debug('🎯 Gaining experience:', { budId, amount });
    const bud = get().getBud(budId);
    if (!bud) {
      console.warn('❌ Bud not found for experience gain:', { budId });
      return;
    }

    const newExperience = bud.experience + amount;
    const experienceToNextLevel = calculateExperienceRequirement(bud.level);

    if (newExperience >= experienceToNextLevel) {
      const remainingExp = newExperience - experienceToNextLevel;
      get().updateBud(budId, {
        level: bud.level + 1,
        experience: remainingExp,
        experienceToNextLevel: calculateExperienceRequirement(bud.level + 1)
      });
      console.log('🎉 Bud leveled up!', { 
        budId, 
        newLevel: bud.level + 1, 
        remainingExp 
      });
    } else {
      get().updateBud(budId, { experience: newExperience });
    }
  },

  // State Management
  updateBud: (budId, updates) => {
    console.debug('🔄 Updating bud:', { budId, updates });
    set((state) => {
      const updateBudInArray = (buds: budInstance[]) => 
        buds.map(b => b.id === budId ? { ...b, ...updates } : b);

      return {
        buds: {
          ...state.buds,
          box: updateBudInArray(state.buds.box),
          party: updateBudInArray(state.buds.party)
        }
      };
    });
  },

  resetBuds: () => {
    console.log('🔄 Resetting all buds');
    set({ buds: { box: [], party: [], activities: {} } });
  },

  saveBudState: () => {
    const state = get();
    return { buds: state.buds };
  },

  loadBudState: (savedState) => {
    if (!savedState?.buds) {
      console.warn('❌ Invalid save state for buds');
      return;
    }
    set({ buds: savedState.buds });
    console.log('✅ Loaded bud state');
  },

  // Activity Management
  assignBudToNode: (budId: string, nodeId: string) => {
    const state = get();
    const bud = state.buds.party.find(b => b.id === budId);
    
    if (!bud) {
      console.warn('❌ Cannot assign bud: not found in party', { budId });
      return false;
    }

    // Check if bud is already assigned
    if (state.buds.activities[budId]) {
      console.warn('❌ Bud is already assigned to an activity', { budId });
      return false;
    }

    set((state) => ({
      buds: {
        ...state.buds,
        activities: {
          ...state.buds.activities,
          [budId]: { type: 'gathering', nodeId }
        }
      }
    }));
    
    console.log('✅ Assigned bud to node:', { budId, nodeId });
    return true;
  },

  unassignBud: (budId: string) => {
    const state = get();
    const bud = state.getBud(budId);
    
    if (!bud) {
      console.warn('❌ Cannot unassign bud: not found', { budId });
      return false;
    }
    
    set((state) => {
      const { [budId]: _, ...remainingActivities } = state.buds.activities;
      return {
        buds: {
          ...state.buds,
          activities: remainingActivities
        }
      };
    });
    
    console.log('✅ Unassigned bud from node:', { budId });
    return true;
  },

  // Add this new action
  createAndAddBud: (base) => {
    const bud = createBudInstance(base);
    
    set((state) => ({
      buds: {
        ...state.buds,
        box: [...state.buds.box, bud]
      }
    }));
    
    console.log('✅ Created and added bud to box:', { budId: bud.id });
    return bud;
  }
}));

export const getParty = (state: BudState) => state.buds.party;