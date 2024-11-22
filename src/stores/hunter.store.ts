import { create } from 'zustand';
import { Skill } from '../types/skill.types';
import { calculateExperienceRequirement } from '../utils/experience.utils';

interface HunterState {
  skills: Record<string, Skill>;
  party: any[]; // TODO: Replace with proper BudInstance type
  stats: {
    health: number;
    wisdom: number;
    attack: number;
    defense: number;
    dexterity: number;
    skillPoints: number;
  };
}

interface HunterActions {
  // Skill Management
  increaseSkillExperience: (skillId: string, amount: number) => void;
  setSkillLevel: (skillId: string, level: number) => void;
  setSkillExperience: (skillId: string, experience: number) => void;
  
  // Party Management
  addBudToParty: (bud: any) => void; // TODO: Type properly
  removeBudFromParty: (budId: string) => void;
  
  // Stats Management
  increaseStats: (stat: keyof HunterState['stats'], amount: number) => void;
  spendSkillPoint: (stat: keyof HunterState['stats']) => boolean;
  
  // State Management
  refreshSkills: () => void;
  resetHunter: () => void;
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
  party: [],
  stats: { ...initialStats },
  
  increaseSkillExperience: (skillId, amount) => set((state) => {
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
  
  setSkillLevel: (skillId, level) => set((state) => ({
    skills: {
      ...state.skills,
      [skillId]: {
        ...state.skills[skillId],
        level,
        experienceToNextLevel: calculateExperienceRequirement(level),
      },
    },
  })),
  
  setSkillExperience: (skillId, experience) => set((state) => ({
    skills: {
      ...state.skills,
      [skillId]: {
        ...state.skills[skillId],
        experience,
      },
    },
  })),
  
  // Party Management
  addBudToParty: (bud) => set((state) => ({
    party: [...state.party, bud],
  })),
  
  removeBudFromParty: (budId) => set((state) => ({
    party: state.party.filter((b) => b.id !== budId),
  })),
  
  // Stats Management
  increaseStats: (stat, amount) => set((state) => ({
    stats: {
      ...state.stats,
      [stat]: state.stats[stat] + amount,
    },
  })),
  
  spendSkillPoint: (stat) => {
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
  
  // State Management
  refreshSkills: () => set(() => ({
    skills: { ...initialSkills },
    stats: { ...initialStats },
  })),
  
  resetHunter: () => set({
    skills: { ...initialSkills },
    party: [],
    stats: { ...initialStats },
  }),
  
  saveHunterState: () => {
    const state = get();
    return {
      skills: state.skills,
      party: state.party,
      stats: state.stats,
    };
  },
  
  loadHunterState: (savedState) => {
    if (!savedState) return;
    set({
      skills: savedState.skills || initialSkills,
      party: savedState.party || [],
      stats: savedState.stats || initialStats,
    });
  },
}));