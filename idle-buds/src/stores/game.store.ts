import { create } from "zustand";
import { allResources } from "../data/allResources.data";
import { useBankStore } from "./bank.store";
import { useHunterStore } from "./hunter.store";
import { defaultSkillMapping } from "../data/defaultSkillMapping";

interface GameState {
  resources: Record<string, number>;
  fractionalResources: Record<string, number>; // Add fractional resources
  isGathering: boolean;
  currentActivity: string | null; // Track the current activity
  startGathering: (activityId: string) => void;
  stopGathering: () => void;
  updateResources: (deltaTime: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  resources: {},
  fractionalResources: {}, // Initialize fractional resources
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

    // Calculate gather amount and XP gain
    const gatherAmount = resource.gatherRate * deltaTime;
    const xpGain = resource.experienceGain * deltaTime;
    const skillId = defaultSkillMapping[resource.type];

    // Accumulate fractional resources
    const currentFraction = state.fractionalResources[resource.id] || 0;
    const totalAmount = currentFraction + gatherAmount;

    // Calculate whole and fractional parts
    const wholeAmount = Math.floor(totalAmount);
    const newFraction = totalAmount - wholeAmount;

    // Update resources and fractional parts
    useBankStore.getState().addResource(resource.id, wholeAmount);
    useHunterStore.getState().increaseSkillExperience(skillId, xpGain);

    return {
      ...state,
      fractionalResources: {
        ...state.fractionalResources,
        [resource.id]: newFraction,
      },
    };
  }),
}));