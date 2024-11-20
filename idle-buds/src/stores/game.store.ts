import { create } from "zustand";
import { allResources } from "../data/allResources.data";
import { useBankStore } from "./bank.store";
import { useHunterStore } from "./hunter.store";
import { defaultSkillMapping } from "../data/defaultSkillMapping";

interface GameState {
  resources: Record<string, number>;
  isGathering: boolean;
  currentActivity: string | null; // Track the current activity
  startGathering: (activityId: string) => void;
  stopGathering: () => void;
  updateResources: (deltaTime: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  resources: {},
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
  
    const gatherAmount = resource.gatherRate * deltaTime;
    const xpGain = resource.experienceGain * deltaTime;
    const skillId = defaultSkillMapping[resource.type];
  
    useBankStore.getState().addResource(resource.id, gatherAmount);
    useHunterStore.getState().increaseSkillExperience(skillId, xpGain);
  
    console.log(`Gathered ${gatherAmount} of ${resource.name}`);
    console.log(`Gained ${xpGain} XP in ${skillId}`);
    return state;
  }),

}));