import { create } from 'zustand';
import { Skill } from '../types/skill.types';
import { increaseSkillExperience } from '../utils/skill-management.utils';

interface HunterState {
  skills: Record<string, Skill>;
  increaseSkillExperience: (skillId: string, amount: number) => void;
  setSkillLevel: (skillId: string, level: number) => void;
  setSkillExperience: (skillId: string, experience: number) => void;
  refreshSkills: () => void;
  resetHunter: () => void;
}

const initialSkills: Record<string, Skill> = {
  lumbering: {
    id: 'lumbering',
    name: 'Lumbering',
    level: 2,
    experience: 10,
    experienceToNextLevel: 100,
  },
  mining: {
    id: 'mining',
    name: 'Mining',
    level: 2,
    experience: 10,
    experienceToNextLevel: 100,
  },
  smithing: {
    id: 'smithing',
    name: 'Smithing',
    level: 5,
    experience: 10,
    experienceToNextLevel: 100,
  },
};

export const useHunterStore = create<HunterState>((set) => ({
  skills: { ...initialSkills },
  
  increaseSkillExperience: (skillId, amount) => set((state) => ({
    skills: increaseSkillExperience(state.skills, skillId, amount),
  })),
  
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
  
  resetHunter: () => set({
    skills: { ...initialSkills },
  }),
}));

