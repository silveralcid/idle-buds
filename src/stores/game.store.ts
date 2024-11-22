import { create } from "zustand";
import { saveGameState, loadGameState, resetGameState } from "../utils/save-management.utils";
import { useBankStore } from "./bank.store";
import { useHunterStore } from "./hunter.store";
import { useHunterActivityStore } from "./hunter-activity.store";
import { useBudActivityStore } from "./bud-activity.store";

interface GameState {
  lastSaveTime: number;
  isPaused: boolean;
  isInitialLoad: boolean;
  saveGame: () => void;
  loadGame: () => void;
  resetGame: () => void;
  togglePause: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  lastSaveTime: Date.now(),
  isPaused: false,
  isInitialLoad: true,
  
  saveGame: () => {
    saveGameState();
  },
  
  loadGame: () => {
    const savedState = loadGameState();
    if (savedState) {
      set({
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
      lastSaveTime: resetTime,
      isPaused: false,
      isInitialLoad: true
    });
    
    // Reset all related stores
    useBankStore.getState().resetBank();
    useHunterStore.getState().resetHunter();
    useHunterActivityStore.getState().stopActivity();
    useBudActivityStore.getState().activities = {};
    
    saveGameState();
  },
  
  togglePause: () => set((state) => ({ 
    isPaused: !state.isPaused 
  })),
}));