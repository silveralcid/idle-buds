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
import { useLumberingStore } from '../features/lumbering/lumbering.store';
import { lumberingNodes } from '../data/nodes/lumbering.data';
import { HunterTask, HunterTaskState } from '../types/hunter-task.types';
import { useSmithingStore } from '../features/smithing/smithing.store';
import { recipeRegistry } from '../data/recipe-registry';
import { useBudBoxStore } from '../features/budbox/budbox.store';
import { usePartyStore } from '../features/party/party.store';
import { processHatchingTick } from '../features/tending/tending.logic';
import { useTendingStore } from '../features/tending/tending.store';
import { useShopStore } from '../features/shop/shop.store';
import { useAssignmentStore } from '../features/assignment/assignment.store';
import { useCombatStore } from '../features/combat/combat.store';

interface GameState extends HunterTaskState {
  isInitialLoad: boolean;
  lastSaveTime: number;
  isPaused: boolean;
  isVisible: boolean;
}

interface GameActions {
    saveGame: () => void;
    loadGame: () => void;
    resetGame: () => void;
    pauseGame: () => void;
    startGame: () => void;
    deleteSave: () => void;
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
      console.groupCollapsed('Game Save');
      const currentTime = Date.now();
      set({ lastSaveTime: currentTime });
      set({ isInitialLoad: false });
      console.log('Current time set for save:', currentTime);
    
      const saveData = {
        version: GameConfig.SAVE.VERSION,
        timestamp: currentTime,
        state: {
          game: get(),
          view: useViewStore.getState(),
          bank: useBankStore.getState(),
          party: usePartyStore.getState(),
          budBox: useBudBoxStore.getState(),
          assignment: useAssignmentStore.getState(),
          mining: useMiningStore.getState(),
          lumbering: useLumberingStore.getState(),
          smithing: useSmithingStore.getState(),
          tending: useTendingStore.getState(),
          combat: useCombatStore.getState(),
        },
      };
    
      console.groupCollapsed('Save Data Snapshot');
      console.log('Version:', saveData.version);
      console.log('Timestamp:', saveData.timestamp);
      console.log('State:', saveData.state);
      console.groupEnd();
    
      try {
        localStorage.setItem('game_save', JSON.stringify(saveData));
        console.log('Game saved successfully');
      } catch (error) {
        console.error('Failed to save game:', error);
      }
    
      console.groupEnd();
    },
    
  
    loadGame: () => {
      console.groupCollapsed('Game Load');
      try {
          console.log('Attempting to load game save...');
          const savedData = localStorage.getItem('game_save');
          if (!savedData) {
              console.warn('No saved data found.');
              console.groupEnd();
              return;
          }
  
          const { version, timestamp, state } = JSON.parse(savedData);
          console.log('Loaded Save Data:', { version, timestamp, state });
  
          if (version !== GameConfig.SAVE.VERSION) {
              console.warn('Save version mismatch. Some features may not work correctly.');
          }
  
          console.groupCollapsed('State Updates');
          set({ ...state.game, isInitialLoad: false });
          useBankStore.setState(state.bank);
          console.log('Bank state loaded:', state.bank);
          useBudBoxStore.setState(state.budBox);
          console.log('BudBox state loaded:', state.budBox);
          usePartyStore.setState(state.party);
          console.log('Party state loaded:', state.party);
          useAssignmentStore.setState(state.assignment);
          console.log('Assignment state loaded:', state.assignment);
          useMiningStore.setState(state.mining);
          console.log('Mining state loaded:', state.mining);
          useViewStore.setState(state.view);
          console.log('View state loaded:', state.view);
          useLumberingStore.setState(state.lumbering);
          console.log('Lumbering state loaded:', state.lumbering);
          useTendingStore.setState(state.tending);
          console.log('Tending state loaded:', state.tending);
          useSmithingStore.setState(state.smithing);
          console.log('Smithing state loaded:', state.smithing);
          useCombatStore.setState(state.combat);
          console.log('Combat state loaded:', state.combat);

          console.groupEnd();
  
          // Pause the game loop after successful load
          if (gameLoop && typeof gameLoop.pause === 'function') {
              gameLoop.pause();
              console.log('Game loop paused successfully after loading.');
          } else {
              console.warn('gameLoop.pause is not available or not a function.');
          }
  
          // Process offline progress after state restoration
          processOfflineProgress(timestamp);
  
      } catch (error) {
          console.error('Failed to load game:', error);
      } finally {
          console.groupEnd();
      }
   },
  
    
  
    resetGame: () => {
      gameLoop.pause();
      
      // Reset all stores
        useViewStore.setState({
          currentView: "MiningView",
        });
        useBankStore.setState({
            items: {},
            filters: [],
            sorting: 'name',
            totalValue: 0,
        });
      
        useBudBoxStore.setState({
            buds: {},
            selectedBudId: null,
        });
      
        usePartyStore.setState({
            buds: {},
            selectedBudId: null,
        }); 
      
        useAssignmentStore.setState({
            buds: {},
            assignments: {},
        });
      

        useShopStore.setState({
            items: [],
            purchaseItem: () => false,
            sellItem: () => {},
        });
      
        useTendingStore.setState({
          xp: 0,
          level: 1,
          progress: 0,
          isUnlocked: true,
          unlockRequirements: undefined,
          activeHatching: null,
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
      
        useLumberingStore.setState({
            xp: 0,
            level: 1,
            progress: 0,
            isUnlocked: true,
            unlockRequirements: undefined,
            activeNode: null,
            nodes: convertNodesToRecord(lumberingNodes),
        });
      
        useSmithingStore.setState({
          xp: 0,
          level: 1,
          progress: 0,
          isUnlocked: true,
          unlockRequirements: undefined,
          workbenches: {
            smithing_anvil: {
              id: "smithing_anvil",
              type: "smithing",
              recipe: null,
              progress: 0,
              isActive: false,
            },
            smelting_furnace: {
              id: "smelting_furnace",
              type: "smelting",
              recipe: null,
              progress: 0,
              isActive: false,
            },
          },
          recipes: recipeRegistry,
          unlockedRecipes: [],
        });
      
        useCombatStore.setState({
          id: "combat",
          name: "Combat",
          description: "Train your combat abilities and grow stronger.",
          xp: 0,
          level: 1,
          progress: 0,
          isUnlocked: true,
          unlockRequirements: undefined,
          stats: {
            health: 10,
            intelligence: 5,
            attack: 5,
            defense: 5,
            dexterity: 5,
          },
          availableAttributePoints: 0,
          totalAttributePoints: 0,
        });

  
      set({
        isInitialLoad: true,
        lastSaveTime: Date.now()
      });
  
    },
  
    startGame: () => {
      set({ isPaused: false }); // Ensure modal closes
      gameLoop.start();        // Start the game loop
    },
    
    pauseGame: () => gameLoop.pause(),
  
    handleVisibilityChange: () => {
      const isVisible = document.visibilityState === "visible";
      const gameStore = useGameStore.getState();
    
      if (!isVisible) {
        // Game is becoming invisible, save the game state
        gameLoop.pause();
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

    deleteSave: () => {
      console.groupCollapsed('Delete Save');
      try {
          console.log('Attempting to delete save...');
          localStorage.removeItem('game_save');
          console.log('Game save deleted successfully.');
      } catch (error) {
          console.error('Failed to delete save:', error);
      } finally {
          console.groupEnd();
      }
    },

    currentTask: null,

    setCurrentTask: (task: HunterTask) => 
      set(() => ({ currentTask: task })),
  
    clearCurrentTask: () => 
      set(() => ({ currentTask: null })),
  }));

  // Autosave
  setInterval(() => {
    if (!gameLoop.isPaused) {  // Only save if game loop is running
      useGameStore.getState().saveGame();
    }
  }, GameConfig.SAVE.AUTO_INTERVAL);