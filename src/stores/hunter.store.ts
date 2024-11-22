import { create } from 'zustand';
import { Skill } from '../types/skill.types';
import { calculateExperienceRequirement } from '../utils/experience.utils';

interface HunterActivity {
  type: 'gathering' | 'crafting';
  nodeId: string;
  fractionalProgress: {
    items: Record<string, number>;
    xp: Record<string, number>;
  };
}

interface HunterState {
  skills: Record<string, Skill>;
  stats: {
    health: number;
    wisdom: number;
    attack: number;
    defense: number;
    dexterity: number;
    skillPoints: number;
  };
  currentActivity: HunterActivity | null;
}

interface HunterActions {
  // Activity Management
  startHunterActivity: (type: 'gathering' | 'crafting', nodeId: string) => void;
  stopHunterActivity: () => void;
  updateHunterActivityProgress: (deltaTime: number) => void;
  getHunterActivityProgress: (nodeId: string) => number;
  
  // Skill Management
  increaseHunterSkillExperience: (skillId: string, amount: number) => void;
  setHunterSkillLevel: (skillId: string, level: number) => void;
  setHunterSkillExperience: (skillId: string, experience: number) => void;
  
  // Stats Management
  increaseHunterStats: (stat: keyof HunterState['stats'], amount: number) => void;
  spendHunterSkillPoint: (stat: keyof HunterState['stats']) => boolean;
  
  // State Management
  refreshHunterSkills: () => void;
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
  health: 100,
  wisdom: 50,
  attack: 75,
  defense: 60,
  dexterity: 80,
  skillPoints: 10,
};

export const useHunterStore = create<HunterState & HunterActions>((set, get) => ({
  skills: { ...initialSkills },
  stats: { ...initialStats },
  currentActivity: null,
  
  startHunterActivity: (type, nodeId) => set({
    currentActivity: {
      type,
      nodeId,
      fractionalProgress: {
        items: {},
        xp: {}
      }
    }
  }),
  
  stopHunterActivity: () => set({ currentActivity: null }),
  
  updateHunterActivityProgress: (deltaTime) => set((state) => {
    if (!state.currentActivity) return state;

    const { nodeId } = state.currentActivity;
    const currentProgress = state.currentActivity.fractionalProgress;

    return {
      currentActivity: {
        ...state.currentActivity,
        fractionalProgress: {
          items: {
            ...currentProgress.items,
            [nodeId]: (currentProgress.items[nodeId] || 0) + deltaTime
          },
          xp: {
            ...currentProgress.xp,
            [nodeId]: (currentProgress.xp[nodeId] || 0) + deltaTime
          }
        }
      }
    };
  }),
  
  getHunterActivityProgress: (nodeId) => {
    const state = get();
    if (!state.currentActivity) return 0;
    return (state.currentActivity.fractionalProgress.items[nodeId] || 0) * 100;
  },
  
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
  
  increaseHunterStats: (stat, amount) => set((state) => ({
    stats: {
      ...state.stats,
      [stat]: state.stats[stat] + amount,
    },
  })),
  
  spendHunterSkillPoint: (stat) => {
    const { stats } = get();
    if (stats.skillPoints <= 0) return false;
    
    set((state) => ({
      stats: {
        ...state.stats,
        skillPoints: state.stats.skillPoints - 1,
        [stat]: state.stats[stat] + 1,
      },
    }));
    return true;
  },
  
  refreshHunterSkills: () => set(() => ({
    skills: { ...initialSkills },
    stats: { ...initialStats },
    currentActivity: null
  })),
  
  resetHunterState: () => set({
    skills: { ...initialSkills },
    stats: { ...initialStats },
    currentActivity: null
  }),
  
  saveHunterState: () => {
    const state = get();
    return {
      skills: state.skills,
      stats: state.stats,
      currentActivity: state.currentActivity
    };
  },
  
  loadHunterState: (savedState) => {
    if (!savedState) return;
    set({
      skills: savedState.skills || initialSkills,
      stats: savedState.stats || initialStats,
      currentActivity: savedState.currentActivity || null
    });
  }
}));