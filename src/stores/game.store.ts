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
  [key: string]: any; // Allow additional properties for extensibility
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
  unpauseGame: () => void;
  togglePause: () => void;
  updateLastTickTime: (time: number) => void;
  tick: () => void;
  exportSave: () => void;
  importSave: (data: string) => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => {
  const saveKey = "idle_buds_save";

  const saveToLocalStorage = (state: SavedGameState) => {
    localStorage.setItem(saveKey, JSON.stringify(state));
  };

  const loadFromLocalStorage = (): SavedGameState | null => {
    const savedData = localStorage.getItem(saveKey);
    return savedData ? JSON.parse(savedData) : null;
  };

  const handleOfflineProgression = (elapsedTime: number) => {
    const tickDuration = GameConfig.TICK.DURATION;
    const ticks = Math.floor(elapsedTime / tickDuration);

    if (ticks > 0) {
      for (let i = 0; i < ticks; i++) {
        GameEvents.getInstance().emit("gameTick");
      }
    }
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

  const loadGameState = () => {
    const savedState = loadFromLocalStorage();
    if (savedState) {
      console.log("Saved state loaded:", savedState); // Debugging
  
      const currentTime = Date.now();
      const elapsedTime = currentTime - savedState.lastSaveTime;
  
      // Restore core game state
      set({
        lastSaveTime: currentTime,
        isPaused: savedState.isPaused,
        lastTickTime: currentTime,
        tickRate: savedState.tickRate,
        isInitialLoad: false,
      });
  
      console.log("Restoring hunter and bank states...");
      // Restore hunter and bank states
      if (savedState.bankState) {
        useBankStore.getState().loadState(savedState.bankState);
      } else {
        console.warn("Bank state is missing in saved data.");
      }
  
      if (savedState.hunterState) {
        useHunterStore.getState().loadState(savedState.hunterState);
      } else {
        console.warn("Hunter state is missing in saved data.");
      }
  
      console.log("Processing offline progression...");
      // Process offline progression
      if (!savedState.isPaused) {
        handleOfflineProgression(elapsedTime);
      }
    } else {
      console.error("No saved state found in local storage.");
    }
  };
  

  // Autosave Logic
  const startAutosave = () => {
    setInterval(() => {
      get().saveGame();
    }, GameConfig.SAVE.AUTO_INTERVAL);
  };

  return {
    lastSaveTime: Date.now(),
    isPaused: false,
    isInitialLoad: true,
    lastTickTime: Date.now(),
    tickRate: GameConfig.TICK.RATE.DEFAULT,

    saveGame: () => {
      const currentTime = Date.now();
      const state = get(); // Fetch the current state
      set({ lastSaveTime: currentTime });
    
      console.log("Attempting to save game...");
      console.log("Current Game State Snapshot:", {
        lastSaveTime: currentTime,
        isPaused: state.isPaused,
        lastTickTime: state.lastTickTime,
        tickRate: state.tickRate,
      });
    
      try {
        saveGameState(); // Call the function to save the state
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
        loadGameState();
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

      saveGameState();
      console.log("Game reset!");
    },

    pauseGame: () => {
      if (!get().isPaused) {
        set({ isPaused: true });
        get().saveGame();
        console.log("Game paused!");
      }
    },

    unpauseGame: () => {
      if (get().isPaused) {
        set({
          isPaused: false,
          lastTickTime: Date.now(),
        });
        console.log("Game unpaused!");
      }
    },

    togglePause: () => {
      if (get().isPaused) {
        get().unpauseGame();
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
        console.error("Failed to import save data:", error)
      }
    },
  };
});

// Start autosave
// startAutosave();
