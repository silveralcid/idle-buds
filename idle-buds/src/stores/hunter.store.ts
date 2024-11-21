import { create } from 'zustand';
import { GameConfig } from '../constants/gameConfig';
import { Skill } from '../types/skill.types';
import { budInstance } from '../types/budInstance.types';
import { increaseSkillExperience } from '../utils/skillManagement.utils';
import { increaseBudExperience } from '../utils/budManagement.utils';
import { HunterState } from '../types/state.types';


const initialSkills: Record<string, Skill> = {
  lumbering: {
    id: 'lumbering',
    name: 'Lumbering',
    level: 5,
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
  addBudToParty: (bud) => set((state) => {
    if (state.party.length < GameConfig.partyCapacity) {
      return { party: [...state.party, bud] };
    }
    console.warn('Party is full. Cannot add more Buds.');
    return state;
  }),
  removeBudFromParty: (budId) => set((state) => ({
    party: state.party.filter((bud) => bud.id !== budId),
  })),
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
  increaseBudExperience: (budId, amount) => increaseBudExperience(budId, amount),
  resetHunter: () => set({
    party: [],
    skills: { ...initialSkills },
  }),
}));