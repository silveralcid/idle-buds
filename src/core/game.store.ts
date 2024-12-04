import { create } from 'zustand';
import { GameEvents } from '../core/game-events';
import { GameLoop } from './game-loop';
import { useBankStore } from '../features/bank/bank.store';
import { useMiningStore } from '../features/mining/mining.store';
import { useViewStore } from './view.store';
import { GameConfig } from '../core/constants/game-config';
import { miningNodes } from '../data/nodes/mining.data';
import { convertNodesToRecord } from '../utils/nodes-to-record';
import { processOfflineProgress } from '../core/offline-loop';

interface GameState {
  isInitialLoad: boolean;
  lastSaveTime: number;
  isPaused: boolean;
  isVisible: boolean;
}

interface GameActions {
    saveGame: () => void;
    loadGame: () => void;
    resetGame: () => void;
    stopGame: () => void;
    startGame: () => void;
    handleVisibilityChange: () => void;
  }
  
  const gameLoop = GameLoop.getInstance();
  const gameEvents = GameEvents.getInstance();
  
  export const useGameStore = create<GameState & GameActions>((set, get) => ({
    // Simplified State
    isInitialLoad: true,
    lastSaveTime: Date.now(),
    isPaused: false,
    isVisible: true,
  
    // Actions
    saveGame: () => {
      const currentTime = Date.now();
      set({ lastSaveTime: currentTime });
  
      const saveData = {
        version: GameConfig.SAVE.VERSION,
        timestamp: currentTime,
        state: {
          game: get(),
          bank: useBankStore.getState(),
          mining: useMiningStore.getState(),
          view: useViewStore.getState()
        }
      };
  
      try {
        localStorage.setItem('game_save', JSON.stringify(saveData));
        console.log('Game saved successfully');
      } catch (error) {
        console.error('Failed to save game:', error);
      }
    },
  
    loadGame: () => {
      try {
        const savedData = localStorage.getItem('game_save');
        if (!savedData) return;
  
        const { version, timestamp, state } = JSON.parse(savedData);
        
        if (version !== GameConfig.SAVE.VERSION) {
          console.warn('Save version mismatch. Some features may not work correctly.');
        }
  
        set({ ...state.game, isInitialLoad: false });
        useBankStore.setState(state.bank);
        useMiningStore.setState(state.mining);
        useViewStore.setState(state.view);
      } catch (error) {
        console.error('Failed to load game:', error);
      }
    },
  
    resetGame: () => {
      gameLoop.stop();
      
      // Reset all stores
        useBankStore.setState({
            items: {},
            filters: [],
            sorting: 'name',
            totalValue: 0,
        });
        
        useMiningStore.setState({
            xp: 0,
            level: 1,
            progress: 0,
            isUnlocked: true,
            unlockRequirements: undefined,
            activeNode: null,
            nodes: convertNodesToRecord(miningNodes),
            ores: {},
        });
        
        useViewStore.setState({
            currentView: "MiningView",
         });
  
      set({
        isInitialLoad: true,
        lastSaveTime: Date.now()
      });
  
      gameLoop.start();
    },
  
    startGame: () => {
      set({ isPaused: false }); // Ensure modal closes
      gameLoop.start();        // Start the game loop
    },
    
    stopGame: () => gameLoop.stop(),
    
    handleVisibilityChange: () => {
      const isVisible = document.visibilityState === "visible";
      const gameStore = useGameStore.getState();
    
      if (!isVisible) {
        // Game is becoming invisible, save the game state
        gameLoop.stop();
        gameStore.saveGame(); // Save the current state
        set({ isPaused: true, lastSaveTime: Date.now() });
      } else {
        // Game is becoming visible, process offline progress without restarting the game
        const lastSaveTime = gameStore.lastSaveTime || Date.now();
        const currentTime = Date.now();
    
        // Trigger offline loop
        processOfflineProgress(lastSaveTime);
    
        // Keep the game paused after processing offline progress
        set({ isPaused: true });
      }
    
      set({ isVisible });
    },
 }));

  // Autosave
  setInterval(() => {
    if (!gameLoop.isPaused) {  // Only save if game loop is running
      useGameStore.getState().saveGame();
    }
  }, GameConfig.SAVE.AUTO_INTERVAL);