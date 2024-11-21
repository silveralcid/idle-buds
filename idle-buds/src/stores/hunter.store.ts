import { create } from 'zustand';
import { GameConfig } from '../constants/gameConfig';
import { Skill } from '../types/skill.types';
import { budInstance } from '../types/budInstance.types';
import { useResourceAssignmentStore } from './resourceAssignment.store';

interface HunterState {
  skills: Record<string, Skill>;
  increaseSkillExperience: (skillId: string, amount: number) => void;
  setSkillLevel: (skillId: string, level: number) => void;
  setSkillExperience: (skillId: string, experience: number) => void;
  refreshSkills: () => void;
  party: budInstance[];
  addBudToParty: (bud: budInstance) => void;
  removeBudFromParty: (budId: string) => void;
  increaseBudExperience: (budId: string, amount: number) => void; // Add this line
}

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
  increaseBudExperience: (budId, amount) => {
    const { assignments } = useResourceAssignmentStore.getState();
    const bud = assignments[Object.keys(assignments).find(key => assignments[key]?.id === budId) as string];
    if (!bud) return;
  
    const newExperience = bud.experience + amount;
    if (newExperience >= bud.experienceToNextLevel) {
      useResourceAssignmentStore.setState((state) => ({
        assignments: {
          ...state.assignments,
          [Object.keys(assignments).find(key => assignments[key]?.id === budId) as string]: {
            ...bud,
            experience: newExperience - bud.experienceToNextLevel,
            level: bud.level + 1,
            experienceToNextLevel: bud.experienceToNextLevel * 1.1, // Example scaling
          },
        },
      }));
    } else {
      useResourceAssignmentStore.setState((state) => ({
        assignments: {
          ...state.assignments,
          [Object.keys(assignments).find(key => assignments[key]?.id === budId) as string]: {
            ...bud,
            experience: newExperience,
          },
        },
      }));
    }
  },
}));