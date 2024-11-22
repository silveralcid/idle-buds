import { create } from "zustand";
import { updateHunterResources, updateBudResources } from "../utils/resourceUpdate.utils";
import { saveGameState, loadGameState, resetGameState } from "../utils/saveLoad.utils";
import { useBankStore } from "./bank.store";
import { useHunterStore } from "./hunter.store";
import { GameState } from "../types/state.types";
import { useNodeAssignmentStore } from "./nodeAssignment.store"; 

// Use the functions inside the store
export const useGameStore = create<GameState>((set, get) => ({
  items: {},
  fractionalItems: {},
  fractionalXP: {},
  isGathering: false,
  currentActivity: null,
  budActivity: null,
  lastSaveTime: Date.now(),
  isPaused: false,
  isInitialLoad: true,
  pauseGame: () => set((state) => ({ isPaused: true })),
  unpauseGame: () => set((state) => ({ 
    isPaused: false,
    isInitialLoad: false 
  })),
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
  saveGame: () => {
    saveGameState();
  },
  loadGame: () => {
    const savedState = loadGameState();
    if (savedState) {
      set({
        ...savedState.game,
        lastSaveTime: savedState.timestamp,
        isPaused: true,
        isInitialLoad: false
      });
    }
  },
  resetGame: () => {
    resetGameState();
    const resetTime = Date.now();
    set({
      items: {},
      fractionalItems: {},
      fractionalXP: {},
      isGathering: false,
      currentActivity: null,
      budActivity: null,
      lastSaveTime: resetTime,
      isPaused: false,
      isInitialLoad: true
    });
    useBankStore.getState().resetBank();
    useHunterStore.getState().resetHunter();
    useNodeAssignmentStore.getState().clearAssignments();
    saveGameState();
  },
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
}));