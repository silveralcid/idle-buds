import { create } from 'zustand';
import { Skill } from '../types/skill.types';
import { budInstance } from '../types/budInstance.types';

interface HunterState {
  skills: Record<string, Skill>;
  increaseSkillExperience: (skillId: string, amount: number) => void;
  setSkillLevel: (skillId: string, level: number) => void;
  setSkillExperience: (skillId: string, experience: number) => void;
  refreshSkills: () => void;
  party: budInstance[];
  addBudToParty: (bud: budInstance) => void;
  removeBudFromParty: (budId: string) => void;
}

const initialSkills: Record<string, Skill> = {
  lumbering: {
    id: 'lumbering',
    name: 'Lumbering',
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
  },
  mining: {
    id: 'mining',
    name: 'Mining',
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
  },
};

export const useHunterStore = create<HunterState>((set) => ({
    party: [],
    addBudToParty: (bud) => set((state) => ({
        party: [...state.party, bud],
    })),
    removeBudFromParty: (budId) => set((state) => ({
        party: state.party.filter((bud) => bud.id !== budId),
    })),
  skills: { ...initialSkills },
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
            experience: newExperience - skill.experienceToNextLevel,
            level: skill.level + 1,
            experienceToNextLevel: skill.experienceToNextLevel * 1.1, // Example scaling
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
  refreshSkills: () => set(() => ({
    skills: { ...initialSkills },
  })),
}));