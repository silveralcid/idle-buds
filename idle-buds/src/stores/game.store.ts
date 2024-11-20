import { create } from "zustand";
import { allResources } from "../data/allResources.data";
import { useBankStore } from "./bank.store";
import { useHunterStore } from "./hunter.store";
import { defaultSkillMapping } from "../data/defaultSkillMapping";
import { useResourceAssignmentStore } from "./resourceAssignment.store";

interface GameState {
  resources: Record<string, number>;
  fractionalResources: Record<string, number>; // Add fractional resources
  fractionalXP: Record<string, number>; // Add fractional XP
  isGathering: boolean;
  currentActivity: string | null; // Track the current activity
  startGathering: (activityId: string) => void;
  stopGathering: () => void;
  updateResources: (deltaTime: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  resources: {},
  fractionalResources: {}, // Initialize fractional resources
  fractionalXP: {}, // Initialize fractional XP
  isGathering: false,
  currentActivity: null,
  startGathering: (activityId) => set((state) => {
    if (state.currentActivity !== activityId) {
      return { isGathering: true, currentActivity: activityId };
    }
    return state;
  }),
  stopGathering: () => set({ isGathering: false, currentActivity: null }),
  updateResources: (deltaTime: number) => set((state) => {
    if (!state.isGathering || !state.currentActivity) return state;
    const resource = allResources.find(r => r.id === state.currentActivity);
    if (!resource) return state;
  
    const { assignments } = useResourceAssignmentStore.getState();
    const assignedBud = assignments[state.currentActivity];
  
    const gatherAmount = resource.gatherRate * deltaTime;
    const xpGain = resource.experienceGain * deltaTime;
    const currentFraction = state.fractionalResources[resource.id] || 0;
    const totalAmount = currentFraction + gatherAmount;
    const wholeAmount = Math.floor(totalAmount);
    const newFraction = totalAmount - wholeAmount;
  
    if (assignedBud) {
      // Bud is gathering
      useBankStore.getState().addResource(resource.id, wholeAmount);
  
      // Update Bud's experience
      const budSkillId = assignedBud.skillId; // Assuming Bud has a skillId property
      const currentXPFraction = state.fractionalXP[budSkillId] || 0;
      const totalXP = currentXPFraction + xpGain;
      const wholeXP = Math.floor(totalXP);
      const newXPFraction = totalXP - wholeXP;
  
      useHunterStore.getState().increaseSkillExperience(budSkillId, wholeXP);
  
      console.log(`Bud ${assignedBud.id} gathered ${wholeAmount} of ${resource.name}`);
      console.log(`Bud ${assignedBud.id} gained ${wholeXP} XP`);
  
      return {
        ...state,
        fractionalResources: {
          ...state.fractionalResources,
          [resource.id]: newFraction,
        },
        fractionalXP: {
          ...state.fractionalXP,
          [budSkillId]: newXPFraction,
        },
      };
    } else {
      // Hunter is gathering
      const skillId = defaultSkillMapping[resource.type];
      const currentXPFraction = state.fractionalXP[skillId] || 0;
      const totalXP = currentXPFraction + xpGain;
      const wholeXP = Math.floor(totalXP);
      const newXPFraction = totalXP - wholeXP;
  
      useBankStore.getState().addResource(resource.id, wholeAmount);
      useHunterStore.getState().increaseSkillExperience(skillId, wholeXP);
  
      console.log(`Hunter gathered ${wholeAmount} of ${resource.name}`);
      console.log(`Hunter gained ${wholeXP} XP in ${skillId}`);
  
      return {
        ...state,
        fractionalResources: {
          ...state.fractionalResources,
          [resource.id]: newFraction,
        },
        fractionalXP: {
          ...state.fractionalXP,
          [skillId]: newXPFraction,
        },
      };
    }
  }),
}));