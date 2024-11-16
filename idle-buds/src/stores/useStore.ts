import { create } from 'zustand'

// Define types for trees
interface Tree {
  id: string;
  name: string;
  requiredLevel: number;
  xpPerCut: number;
  timeToChop: number; // in milliseconds
  resourceName: string;
}

// Define available trees
export const TREES: Tree[] = [
  {
    id: 'normal_tree',
    name: 'Normal Tree',
    requiredLevel: 1,
    xpPerCut: 25,
    timeToChop: 3000,
    resourceName: 'normal_logs'
  },
  {
    id: 'oak_tree',
    name: 'Oak Tree',
    requiredLevel: 5,
    xpPerCut: 37.5,
    timeToChop: 4000,
    resourceName: 'oak_logs'
  },
  // Add more trees as needed
];

interface WoodcuttingSkill {
  level: number;
  experience: number;
  isChopping: boolean;
  currentTree?: Tree;
  progress: number;
}

interface Inventory {
  [key: string]: number;
}

interface GameState {
  // General state
  level: number;
  experience: number;
  
  // Woodcutting skill
  woodcutting: WoodcuttingSkill;
  
  // Inventory
  inventory: Inventory;

  // General actions
  addExperience: (amount: number) => void;
  
  // Woodcutting actions
  addWoodcuttingExperience: (amount: number) => void;
  startChopping: (treeId: string) => void;
  stopChopping: () => void;
  updateChoppingProgress: (progress: number) => void;
  
  // Inventory actions
  addResource: (resourceName: string, amount: number) => void;
  
  // Utility functions
  getRequiredXPForLevel: (level: number) => number;
  canChopTree: (tree: Tree) => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  level: 1,
  experience: 0,
  
  woodcutting: {
    level: 1,
    experience: 0,
    isChopping: false,
    progress: 0
  },
  
  inventory: {},

  // General actions
  addExperience: (amount) => set((state) => {
    const newExperience = state.experience + amount;
    let newLevel = state.level;
    
    while (newExperience >= get().getRequiredXPForLevel(newLevel)) {
      newLevel++;
    }
    
    return { 
      experience: newExperience,
      level: newLevel
    };
  }),

  // Woodcutting actions
  addWoodcuttingExperience: (amount) => set((state) => {
    const newExperience = state.woodcutting.experience + amount;
    let newLevel = state.woodcutting.level;
    
    while (newExperience >= get().getRequiredXPForLevel(newLevel)) {
      newLevel++;
    }
    
    return {
      woodcutting: {
        ...state.woodcutting,
        experience: newExperience,
        level: newLevel
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

  // Utility functions
  getRequiredXPForLevel: (level) => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  },

  canChopTree: (tree) => {
    const state = get();
    return state.woodcutting.level >= tree.requiredLevel;
  }
}));
