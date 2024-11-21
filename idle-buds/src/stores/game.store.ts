import { create } from "zustand";
import { updateHunterResources, updateBudResources } from "../utils/resourceUpdate.utils";
import { saveGameState, loadGameState, resetGameState } from "../utils/saveLoad.utils";
import { useBankStore } from "./bank.store";
import { useHunterStore } from "./hunter.store";
import { GameState } from "../types/state.types";
import { useResourceAssignmentStore } from "./resourceAssignment.store";

// Use the functions inside the store
export const useGameStore = create<GameState>((set, get) => ({
  resources: {},
  fractionalResources: {},
  fractionalXP: {},
  isGathering: false,
  currentActivity: null,
  budActivity: null,
  lastSaveTime: Date.now(),
  isPaused: false,
  pauseGame: () => set((state) => ({ isPaused: true })),
  unpauseGame: () => set((state) => ({ isPaused: false })),
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
    const savedState = loadGameState() || {}; // Ensure loadGameState returns an object
    if (savedState) {
      set({
        ...savedState,
        lastSaveTime: savedState.lastSaveTime || Date.now(), // Restore lastSaveTime
        isPaused: true, // Ensure the game is paused when loaded
      });
    }
  },
  resetGame: () => {
    resetGameState();
    set({
      resources: {},
      fractionalResources: {},
      fractionalXP: {},
      isGathering: false,
      currentActivity: null,
      budActivity: null,
      lastSaveTime: Date.now(),
      isPaused: false, // Reset isPaused state
    });
    console.log('State after reset: ', get());
    useBankStore.getState().resetBank();
    useHunterStore.getState().resetHunter();
    useResourceAssignmentStore.getState().clearAssignments(); // Clear assignments
  },
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
}));