// src/stores/useStore.ts
import { create } from 'zustand';
import type { Tree } from '../types/resources';
import type { WoodcuttingSkill } from '../types/skills';
import type { Activity } from '../types/activities';
import { TREES } from '../data/trees';

// Constants
export const MAX_LEVEL = 99;

// Types
interface Inventory {
  [key: string]: number;
}

interface GameState {
  level: number;
  experience: number;
  woodcutting: WoodcuttingSkill;
  inventory: Inventory;
  currentActivity: Activity;
  
  // Actions
  addExperience: (amount: number) => void;
  addWoodcuttingExperience: (amount: number) => void;
  startChopping: (treeId: string) => void;
  stopChopping: () => void;
  updateChoppingProgress: (progress: number) => void;
  addResource: (resourceName: string, amount: number) => void;
  setCurrentActivity: (activity: Activity) => void;
  
  // Utility
  getRequiredXPForLevel: (level: number) => number;
  canChopTree: (tree: Tree) => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
  level: 1,
  experience: 0,
  
  woodcutting: {
    level: 1,
    experience: 0,
    isChopping: false,
    progress: 0
  },
  
  inventory: {},
  currentActivity: 'woodcutting',

  addExperience: (amount) => set((state) => {
    if (state.level >= MAX_LEVEL) return state;
    
    const newExperience = state.experience + amount;
    let newLevel = state.level;
    
    while (newExperience >= get().getRequiredXPForLevel(newLevel) && newLevel < MAX_LEVEL) {
      newLevel++;
    }
    
    return { 
      experience: newExperience,
      level: Math.min(newLevel, MAX_LEVEL)
    };
  }),

  addWoodcuttingExperience: (amount) => set((state) => {
    if (state.woodcutting.level >= MAX_LEVEL) return state;

    const newExperience = state.woodcutting.experience + amount;
    let newLevel = state.woodcutting.level;
    
    while (newExperience >= get().getRequiredXPForLevel(newLevel) && newLevel < MAX_LEVEL) {
      newLevel++;
    }
    
    return {
      woodcutting: {
        ...state.woodcutting,
        experience: newExperience,
        level: Math.min(newLevel, MAX_LEVEL)
      }
    };
  }),

  startChopping: (treeId) => set((state) => {
    const tree = TREES.find(t => t.id === treeId);
    if (!tree || !get().canChopTree(tree)) return state;

    return {
      woodcutting: {
        ...state.woodcutting,
        isChopping: true,
        currentTree: tree,
        progress: 0
      }
    };
  }),

  stopChopping: () => set((state) => ({
    woodcutting: {
      ...state.woodcutting,
      isChopping: false,
      currentTree: undefined,
      progress: 0
    }
  })),

  updateChoppingProgress: (progress) => set((state) => ({
    woodcutting: {
      ...state.woodcutting,
      progress
    }
  })),

  addResource: (resourceName, amount) => set((state) => ({
    inventory: {
      ...state.inventory,
      [resourceName]: (state.inventory[resourceName] || 0) + amount
    }
  })),

  getRequiredXPForLevel: (level) => {
    if (level > MAX_LEVEL) return Infinity;
    return Math.floor(100 * Math.pow(1.5, level - 1));
  },

  canChopTree: (tree) => {
    const state = get();
    return state.woodcutting.level >= tree.requiredLevel;
  },
  
  setCurrentActivity: (activity) => set({ currentActivity: activity }),
}));
