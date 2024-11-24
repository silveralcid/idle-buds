import { create } from "zustand";
import { GameConfig } from "../core/constants/game-config";
import { GameEvents } from "../core/game-events/game-events";
import { useHunterStore } from "./hunter.store";
import { useBankStore } from "./bank.store";

interface SavedGameState {
  lastSaveTime: number;
  isPaused: boolean;
  lastTickTime: number;
  tickRate: number;
  bankState: any;
  hunterState: any;
  [key: string]: any;
}

interface GameState {
  lastSaveTime: number;
  isPaused: boolean;
  isInitialLoad: boolean;
  lastTickTime: number;
  tickRate: number;
}

interface GameActions {
  saveGame: () => void;
  loadGame: (loadedState?: Partial<GameState>) => void;
  resetGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  togglePause: () => void;
  updateLastTickTime: (time: number) => void;
  tick: () => void;
  exportSave: () => void;
  importSave: (data: string) => void;
  startAutosave: () => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => {
  const saveKey = "idle_buds_save";

  const saveToLocalStorage = (state: SavedGameState) => {
    localStorage.setItem(saveKey, JSON.stringify(state));
  };

  const saveGameState = () => {
    const { lastSaveTime, isPaused, lastTickTime, tickRate } = get();
    const saveData: SavedGameState = {
      lastSaveTime,
      isPaused,
      lastTickTime,
      tickRate,
      bankState: useBankStore.getState(),
      hunterState: useHunterStore.getState(),
    };
    saveToLocalStorage(saveData);
  };

  let autosaveInterval: NodeJS.Timeout | null = null; // Reference for interval

  const startAutosave = () => {
    if (autosaveInterval) {
      console.warn("Autosave is already running.");
      return;
    }

    autosaveInterval = setInterval(() => {
      if (!get().isPaused) {
        console.log("Autosave triggered...");
        get().saveGame();
      }
    }, GameConfig.SAVE.AUTO_INTERVAL || 60000); // Default to 60 seconds if not configured

    console.log("Autosave started with interval:", GameConfig.SAVE.AUTO_INTERVAL || 60000);
  };

  const stopAutosave = () => {
    if (autosaveInterval) {
      clearInterval(autosaveInterval);
      autosaveInterval = null;
      console.log("Autosave stopped.");
    }
  };

  return {
    lastSaveTime: Date.now(),
    isPaused: false,
    isInitialLoad: true,
    lastTickTime: Date.now(),
    tickRate: GameConfig.TICK.RATE.DEFAULT,

    saveGame: () => {
      const currentTime = Date.now();
      const state = get();
      set({ lastSaveTime: currentTime });

      console.log("Attempting to save game...");
      console.log("Current Game State Snapshot:", {
        lastSaveTime: currentTime,
        isPaused: state.isPaused,
        lastTickTime: state.lastTickTime,
        tickRate: state.tickRate,
      });

      try {
        saveGameState();
        console.log("Game saved successfully at:", new Date(currentTime).toLocaleString());
        console.log("Saved Bank State:", useBankStore.getState().items);
        console.log("Saved Hunter State:", useHunterStore.getState());
      } catch (error) {
        console.error("Error saving game state:", error);
      }
    },

    loadGame: (loadedState?: Partial<GameState>) => {
      if (loadedState) {
        set({
          ...loadedState,
          isInitialLoad: false,
          lastTickTime: Date.now(),
        });
        console.log("Game loaded from provided state!");
      } else {
        const savedData = localStorage.getItem(saveKey);
        if (savedData) {
          const savedState = JSON.parse(savedData);
          set({
            lastSaveTime: savedState.lastSaveTime || Date.now(),
            isPaused: savedState.isPaused || false,
            lastTickTime: savedState.lastTickTime || Date.now(),
            tickRate: savedState.tickRate || GameConfig.TICK.RATE.DEFAULT,
            isInitialLoad: false,
          });
          console.log("Game loaded successfully from local storage!");
        } else {
          console.error("No saved data found.");
        }
      }
    },

    resetGame: () => {
      set({
        lastSaveTime: Date.now(),
        isPaused: false,
        isInitialLoad: true,
        lastTickTime: Date.now(),
      });

      useBankStore.getState().resetBank();
      useHunterStore.getState().resetHunterState();

      console.log("Game reset!");
    },

    pauseGame: () => {
      if (!get().isPaused) {
        set({ isPaused: true });
        console.log("Game paused!");
      }
    },

    resumeGame: () => {
      if (get().isPaused) {
        set({ isPaused: false, lastTickTime: Date.now() });
        console.log("Game unpaused!");
      }
    },

    togglePause: () => {
      if (get().isPaused) {
        get().resumeGame();
      } else {
        get().pauseGame();
      }
    },

    updateLastTickTime: (time: number) => {
      set({ lastTickTime: time });
    },

    tick: () => {
      if (get().isPaused) return;

      const currentTime = Date.now();
      const elapsedTime = currentTime - get().lastTickTime;
      const tickDuration = GameConfig.TICK.DURATION;

      if (elapsedTime >= tickDuration) {
        GameEvents.getInstance().emit("gameTick");
        set({ lastTickTime: currentTime });
      }
    },

    exportSave: () => {
      const { lastSaveTime, isPaused, lastTickTime, tickRate } = get();
      const saveData: SavedGameState = {
        lastSaveTime,
        isPaused,
        lastTickTime,
        tickRate,
        bankState: useBankStore.getState(),
        hunterState: useHunterStore.getState(),
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveData));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.href = dataStr;
      downloadAnchor.download = `IdleBuds_Save_${new Date().toISOString()}.json`;
      downloadAnchor.click();
      console.log("Save exported!");
    },

    importSave: (data: string) => {
      try {
        const importedState: SavedGameState = JSON.parse(data);
        set({
          lastSaveTime: importedState.lastSaveTime,
          isPaused: importedState.isPaused,
          lastTickTime: Date.now(),
          tickRate: importedState.tickRate,
          isInitialLoad: false,
        });

        useBankStore.getState().loadState(importedState.bankState);
        useHunterStore.getState().loadState(importedState.hunterState);

        console.log("Save imported!");
      } catch (error) {
        console.error("Failed to import save data:", error);
      }
    },

    startAutosave,
  };
});
