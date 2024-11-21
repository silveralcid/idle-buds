import { create } from "zustand";
import { updateHunterResources, updateBudResources } from "../utils/resourceUpdate.utils";
import { GameState } from "../types/gameState.types";

// Use the functions inside the store
export const useGameStore = create<GameState>((set) => ({
  resources: {},
  fractionalResources: {},
  fractionalXP: {},
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
  stopHunterGathering: () => set((state) => ({
    ...state,
    currentActivity: null,
    isGathering: state.budActivity !== null, // Only set isGathering to false if no Bud is gathering
  })),
  stopBudGathering: () => set((state) => ({
    ...state,
    budActivity: null,
    isGathering: state.currentActivity !== null, // Only set isGathering to false if no Hunter is gathering
  })),
  updateResources: (deltaTime: number) => set((state) => {
    let newState = { ...state };

    // Update Hunter Resources
    newState = updateHunterResources(newState, deltaTime);

    // Update Bud Resources
    newState = updateBudResources(newState, deltaTime);

    return newState;
  }),
}));