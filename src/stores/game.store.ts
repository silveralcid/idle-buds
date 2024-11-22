import { create } from "zustand";
import { saveGameState, loadGameState, resetGameState } from "../utils/save-management.utils";
import { useBankStore } from "./bank.store";
import { useHunterStore } from "./hunter.store";
import { useActiveBudStore } from "./active-bud.store";
import { useBoxBudStore } from "./box-bud.store";


interface GameState {
  lastSaveTime: number;
  isPaused: boolean;
  isInitialLoad: boolean;
  lastTickTime: number;
  tickRate: number;
}

interface GameActions {
  saveGame: () => void;
  loadGame: () => void;
  resetGame: () => void;
  pauseGame: () => void;
  unpauseGame: () => void;
  togglePause: () => void;
  updateLastTickTime: (time: number) => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  lastSaveTime: Date.now(),
  isPaused: false,
  isInitialLoad: true,
  lastTickTime: Date.now(),
  tickRate: 50, // 20 ticks per second
  
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
        lastTickTime: Date.now()
      });
    }
  },
  
  resetGame: () => {
    resetGameState();
    const resetTime = Date.now();
    
    // Reset all stores in the correct order
    useActiveBudStore.getState().resetBudState();
    useBankStore.getState().resetBank();
    useHunterStore.getState().resetHunterState();
    
    set({
      lastSaveTime: resetTime,
      isPaused: false,
      isInitialLoad: true,
      lastTickTime: resetTime
    });
    
    saveGameState();
  },
  
  pauseGame: () => {
    if (!get().isPaused) {
      set({ isPaused: true });
      // Save state when pausing
      get().saveGame();
    }
  },
  
  unpauseGame: () => {
    if (get().isPaused) {
      set({ 
        isPaused: false,
        lastTickTime: Date.now()
      });
    }
  },
  
  togglePause: () => {
    const isPaused = get().isPaused;
    if (isPaused) {
      get().unpauseGame();
    } else {
      get().pauseGame();
    }
  },
  
  updateLastTickTime: (time: number) => {
    set({ lastTickTime: time });
  }
}));