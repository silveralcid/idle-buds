import { create } from 'zustand';
import { Skill } from '../types/skill.types';

interface HunterState {
  skills: Record<string, Skill>;
  increaseSkillExperience: (skillId: string, amount: number) => void;
  setSkillLevel: (skillId: string, level: number) => void;
  setSkillExperience: (skillId: string, experience: number) => void;
  refreshSkills: () => void;
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