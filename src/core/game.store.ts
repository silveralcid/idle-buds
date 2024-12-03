import { create } from 'zustand';
import { GameEvents } from '../core/game-events';
import { GameLoop } from './game-loop';
import { useBankStore } from '../features/bank/bank.store';
import { useMiningStore } from '../features/mining/mining.store';
import { useViewStore } from './view.store';
import { GameConfig } from '../core/constants/game-config';

interface GameState {
  isInitialLoad: boolean;
  lastSaveTime: number;
}

interface GameActions {
    saveGame: () => void;
    loadGame: () => void;
    resetGame: () => void;
    pauseGame: () => void;
    resumeGame: () => void;
  }
  
  const gameLoop = GameLoop.getInstance();
  const gameEvents = GameEvents.getInstance();
  
  export const useGameStore = create<GameState & GameActions>((set, get) => ({
    // Simplified State
    isInitialLoad: true,
    lastSaveTime: Date.now(),
  
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
  
    pauseGame: () => gameLoop.pause(),
    resumeGame: () => gameLoop.resume(),
  }));
  
  // Setup auto-save functionality
//   setInterval(() => {
//     if (!gameLoop.isPaused && !useGameStore.getState().isInitialLoad) {
//       useGameStore.getState().saveGame();
//     }
//   }, GameConfig.SAVE.AUTO_INTERVAL);