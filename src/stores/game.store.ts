import { create } from "zustand";
import { saveGameState, loadGameState, resetGameState } from "../utils/save-management.utils";
import { useBankStore } from "./bank.store";
import { useHunterStore } from "./hunter.store";



interface GameState {
  isInitialLoad: boolean;
  isPaused: boolean;
  lastSaveTime: number;
}

interface GameActions {
  saveGame: () => void;
  loadGame: () => void;
  resetGame: () => void;
  pauseGame: () => void;
  unpauseGame: () => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  isInitialLoad: true,
  isPaused: false,
  lastSaveTime: Date.now(),
  
  saveGame: () => {
    const currentTime = Date.now();
    set({ lastSaveTime: currentTime });
    saveGameState();
  },
  
  loadGame: () => {
    const savedState = loadGameState();
    if (savedState) {
      set({
        lastSaveTime: savedState.timestamp,
        isPaused: false,
        isInitialLoad: false,
      });
    }
  },
  
  resetGame: () => {
    resetGameState();
    const resetTime = Date.now();
    
    // Reset all stores in the correct order
    useBankStore.getState().resetBank();
    useHunterStore.getState().resetHunterState();
    
    set({
      lastSaveTime: resetTime,
      isPaused: false,
      isInitialLoad: true,
    });
    
    saveGameState();
  },
  
  pauseGame: () => {
    if (!get().isPaused) {
      set({ isPaused: true });
    }
  },
  
  unpauseGame: () => {
    if (get().isPaused) {
      set({ 
        isPaused: false,});
    }
  },
}));