import { create } from 'zustand';
import { Skill } from '../types/skill.types';
import { calculateExperienceRequirement } from '../utils/experience.utils';



export interface HunterState {
  id: string;
  skills: Record<string, Skill>;
  stats: {
    health: number;
    wisdom: number;
    attack: number;
    defense: number;
    dexterity: number;
    skillPoints: number;
  };
  currentHunterActivity: HunterGathering | HunterCrafting | null;
}

export interface HunterGathering {
  type: 'gathering';
  nodeId: string;
  gatheringProgress: {
    resourcesGained: Record<string, number>;
    xpGained: Record<string, number>;
  };
}

export interface HunterCrafting {
  type: 'crafting';
  workbenchId: string;
  recipeId: string | null;
  craftingProgress: {
    materialsUsed: Record<string, number>;
    itemsCrafted: Record<string, number>;
    xpGained: Record<string, number>;
  };
}

export interface HunterActions {
  // Activity Management
  startHunterGathering: (nodeId: string) => void;
  startHunterCrafting: (workbenchId: string, recipeId: string) => void;
  stopHunterActivity: () => void;
  getHunterGatheringProgress: (nodeId: string) => number;
  getHunterCraftingProgress: (workbenchId: string, recipeId: string) => number;
  processHunterTick: () => void;

  // Skill Management
  increaseHunterSkillExperience: (skillId: string, amount: number) => void;
  setHunterSkillLevel: (skillId: string, level: number) => void;
  setHunterSkillExperience: (skillId: string, experience: number) => void;
  
  // Stats Management

  // State Management
  resetHunterState: () => void;
  saveHunterState: () => object;
  loadHunterState: (state: any) => void;
}

const initialSkills: Record<string, Skill> = {
  lumbering: {
    id: 'lumbering',
    name: 'Lumbering',
    level: 2,
    experience: 10,
    experienceToNextLevel: calculateExperienceRequirement(2),
  },
  mining: {
    id: 'mining',
    name: 'Mining',
    level: 2,
    experience: 10,
    experienceToNextLevel: calculateExperienceRequirement(2),
  },
  smithing: {
    id: 'smithing',
    name: 'Smithing',
    level: 5,
    experience: 10,
    experienceToNextLevel: calculateExperienceRequirement(5),
  },
};

const initialStats = {
  health: 1,
  wisdom: 1,
  attack: 1,
  defense: 1,
  dexterity: 1,
  skillPoints: 1,
};

export const useHunterStore = create<HunterState & HunterActions>((set, get) => ({
  id: crypto.randomUUID(),
  skills: { ...initialSkills },
  stats: { ...initialStats },
  currentHunterActivity: null,

  // Activity Management
  startHunterGathering: (nodeId: string) => set({
    currentHunterActivity: {
      type: 'gathering',
      nodeId,
      gatheringProgress: {
        resourcesGained: {},
        xpGained: {}
      }
    }
  }),

  startHunterCrafting: (workbenchId: string, recipeId: string) => set({
    currentHunterActivity: {
      type: 'crafting',
      workbenchId,
      recipeId,
      craftingProgress: {
        materialsUsed: {},
        itemsCrafted: {},
        xpGained: {}
      }
    }
  }),

  stopHunterActivity: () => set({ currentHunterActivity: null }),

  getHunterGatheringProgress: (nodeId: string) => {
    const state = get();
    if (!state.currentHunterActivity || state.currentHunterActivity.type !== 'gathering') return 0;
    return state.currentHunterActivity.gatheringProgress.resourcesGained[nodeId] || 0;
  },

  getHunterCraftingProgress: (workbenchId: string, recipeId: string) => {
    const state = get();
    if (!state.currentHunterActivity || state.currentHunterActivity.type !== 'crafting') return 0;
    return state.currentHunterActivity.craftingProgress.itemsCrafted[recipeId] || 0;
  },

  processHunterTick: () => set((state) => {
    if (!state.currentHunterActivity) return state;

    if (state.currentHunterActivity.type === 'gathering') {
      // Process gathering tick
      return {
        currentHunterActivity: {
          ...state.currentHunterActivity,
          gatheringProgress: {
            resourcesGained: { /* Update resources */ },
            xpGained: { /* Update XP */ }
          }
        }
      };
    }

    if (state.currentHunterActivity.type === 'crafting') {
      // Process crafting tick
      return {
        currentHunterActivity: {
          ...state.currentHunterActivity,
          craftingProgress: {
            materialsUsed: { /* Update materials */ },
            itemsCrafted: { /* Update crafted items */ },
            xpGained: { /* Update XP */ }
          }
        }
      };
    }

    return state;
  }),
  
  increaseHunterSkillExperience: (skillId, amount) => set((state) => {
    const skill = state.skills[skillId];
    if (!skill) return state;

    const newExperience = skill.experience + amount;
    if (newExperience >= skill.experienceToNextLevel) {
      return {
        skills: {
          ...state.skills,
          [skillId]: {
            ...skill,
            level: skill.level + 1,
            experience: newExperience - skill.experienceToNextLevel,
            experienceToNextLevel: calculateExperienceRequirement(skill.level + 1),
          },
        },
      };
    }
    
    return {
      skills: {
        ...state.skills,
        [skillId]: {
          ...skill,
          experience: newExperience,
        },
      },
    };
  }),
  
  setHunterSkillLevel: (skillId, level) => set((state) => ({
    skills: {
      ...state.skills,
      [skillId]: {
        ...state.skills[skillId],
        level,
        experienceToNextLevel: calculateExperienceRequirement(level),
      },
    },
  })),
  
  setHunterSkillExperience: (skillId, experience) => set((state) => ({
    skills: {
      ...state.skills,
      [skillId]: {
        ...state.skills[skillId],
        experience,
      },
    },
  })),
  

  
  resetHunterState: () => set({
    skills: { ...initialSkills },
    stats: { ...initialStats },
    currentHunterActivity: null
  }),
  
  saveHunterState: () => {
    const state = get();
    return {
      skills: state.skills,
      stats: state.stats,
      currentHunterActivity: state.currentHunterActivity
    };
  },
  
  loadHunterState: (savedState) => {
    if (!savedState) return;
    set({
      skills: savedState.skills || initialSkills,
      stats: savedState.stats || initialStats,
      currentHunterActivity: savedState.currentHunterActivity || null
    });
  }
}));