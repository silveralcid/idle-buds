import { create } from "zustand";
import { allResources } from "../data/allResources.data";
import { useBankStore } from "./bank.store";
import { useHunterStore } from "./hunter.store";
import { defaultSkillMapping } from "../data/defaultSkillMapping";
import { useResourceAssignmentStore } from "./resourceAssignment.store";

interface GameState {
  resources: Record<string, number>;
  fractionalResources: Record<string, number>;
  fractionalXP: Record<string, number>;
  isGathering: boolean;
  currentActivity: string | null; // Hunter's current activity
  budActivity: string | null; // Bud's current activity
  startGathering: (activityId: string, isBud: boolean) => void;
  stopGathering: (isBud: boolean) => void;
  updateResources: (deltaTime: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  resources: {},
  fractionalResources: {}, // Initialize fractional resources
  fractionalXP: {}, // Initialize fractional XP
  isGathering: false,
  currentActivity: null,
  budActivity: null,
  startGathering: (activityId, isBud) => set((state) => {
    if (isBud) {
      if (state.budActivity !== activityId) {
        return { isGathering: true, budActivity: activityId };
      }
    } else {
      if (state.currentActivity !== activityId) {
        return { isGathering: true, currentActivity: activityId };
      }
    }
    return state;
  }),
  stopGathering: (isBud) => set((state) => ({
    isGathering: false,
    ...(isBud ? { budActivity: null } : { currentActivity: null }),
  })),

  updateResources: (deltaTime: number) => set((state) => {
    let newState = { ...state };
  
    // Process Hunter's gathering
    if (state.currentActivity) {
      const resource = allResources.find(r => r.id === state.currentActivity);
      if (resource) {
        const gatherAmount = resource.gatherRate * deltaTime;
        const xpGain = resource.experienceGain * deltaTime;
        const currentFraction = state.fractionalResources[resource.id] || 0;
        const totalAmount = currentFraction + gatherAmount;
        const wholeAmount = Math.floor(totalAmount);
        const newFraction = totalAmount - wholeAmount;
  
        // Hunter gathering logic
        const skillId = defaultSkillMapping[resource.type];
        const currentXPFraction = state.fractionalXP[skillId] || 0;
        const totalXP = currentXPFraction + xpGain;
        const wholeXP = Math.floor(totalXP);
        const newXPFraction = totalXP - wholeXP;
  
        useBankStore.getState().addResource(resource.id, wholeAmount);
        useHunterStore.getState().increaseSkillExperience(skillId, wholeXP);
  
        newState = {
          ...newState,
          fractionalResources: {
            ...newState.fractionalResources,
            [resource.id]: newFraction,
          },
          fractionalXP: {
            ...newState.fractionalXP,
            [skillId]: newXPFraction,
          },
        };
      }
    }
  
    // Process Bud's gathering
    if (state.budActivity) {
      const resource = allResources.find(r => r.id === state.budActivity);
      if (resource) {
        const { assignments } = useResourceAssignmentStore.getState();
        const assignedBud = assignments[state.budActivity];
  
        if (assignedBud) {
          const gatherAmount = resource.gatherRate * deltaTime;
          const xpGain = resource.experienceGain * deltaTime;
          const currentFraction = state.fractionalResources[resource.id] || 0;
          const totalAmount = currentFraction + gatherAmount;
          const wholeAmount = Math.floor(totalAmount);
          const newFraction = totalAmount - wholeAmount;
  
          const currentXPFraction = state.fractionalXP[assignedBud.id] || 0;
          const totalXP = currentXPFraction + xpGain;
          const wholeXP = Math.floor(totalXP);
          const newXPFraction = totalXP - wholeXP;
  
          useBankStore.getState().addResource(resource.id, wholeAmount);
          useHunterStore.getState().increaseBudExperience(assignedBud.id, wholeXP);
  
          newState = {
            ...newState,
            fractionalResources: {
              ...newState.fractionalResources,
              [resource.id]: newFraction,
            },
            fractionalXP: {
              ...newState.fractionalXP,
              [assignedBud.id]: newXPFraction,
            },
          };
        }
      }
    }
  
    return newState;
  }),
}));