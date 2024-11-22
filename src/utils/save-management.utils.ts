import { useBankStore } from "../stores/bank.store";
import { useGameStore } from "../stores/game.store";
import { useHunterStore } from "../stores/hunter.store";
import { useActivityStore } from "../stores/activity.store";
import { useBudStore } from "../stores/bud.store";
import { GameConfig } from "../constants/game-config";
import { SAVE_KEY } from "../constants/save-key";

export function saveGameState() {
    const gameState = useGameStore.getState();
    const bankState = useBankStore.getState();
    const hunterState = useHunterStore.getState().saveHunterState();
    const activityState = useActivityStore.getState();
    const budState = useBudStore.getState().saveBudState();
    
    const currentTime = Date.now();
    useGameStore.setState({ lastSaveTime: currentTime });
    
    const saveData = {
        version: GameConfig.SAVE.VERSION,
        timestamp: currentTime,
        state: {
            game: { ...gameState, lastSaveTime: currentTime },
            bank: bankState,
            hunter: hunterState,
            buds: budState,
            activities: {
                hunterActivity: activityState.hunterActivity,
                budActivities: activityState.budActivities,
                fractionalProgress: activityState.fractionalProgress
            }
        }
    };
  
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        console.log('Game state saved successfully');
    } catch (error) {
        console.error('Failed to save game state:', error);
    }
}

export const loadGameState = () => {
    try {
        const savedState = localStorage.getItem(SAVE_KEY);
        if (!savedState) return null;

        const saveData = JSON.parse(savedState);
        
        if (saveData.version !== GameConfig.SAVE.VERSION) {
            console.warn('Save version mismatch. Some features may not work correctly.');
        }

        const { game, bank, hunter, buds, activities } = saveData.state;
        
        // Load states in the correct order to maintain dependencies
        useGameStore.setState({
            ...game,
            isInitialLoad: false
        });
        
        useBankStore.setState(bank);
        useHunterStore.getState().loadHunterState(hunter);
        useBudStore.getState().loadBudState(buds);
        
        // Load activity state last since it depends on other states
        useActivityStore.setState({
            hunterActivity: activities.hunterActivity,
            budActivities: activities.budActivities,
            fractionalProgress: activities.fractionalProgress
        });
        
        return saveData;
    } catch (error) {
        console.error('Failed to load game:', error);
        return null;
    }
};

export const resetGameState = () => {
    const resetTime = Date.now();
    
    // Reset all stores in the correct order to maintain dependencies
    useActivityStore.getState().resetActivities();
    useBudStore.getState().resetBuds();
    useBankStore.getState().resetBank();
    useHunterStore.getState().resetHunter();
    
    // Return initial game state
    return {
        lastSaveTime: resetTime,
        isPaused: false,
        isInitialLoad: true,
        lastTickTime: resetTime,
        tickRate: GameConfig.TICK.RATE.DEFAULT
    };
};

export const exportSave = () => {
  try {
    const saveData = localStorage.getItem(SAVE_KEY);
    if (!saveData) {
      console.error('No save data found');
      return;
    }

    // Create blob and download
    const blob = new Blob([saveData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `idle-buds-save-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export save:', error);
  }
};

export const importSave = async (file: File) => {
  try {
    const text = await file.text();
    const saveData = JSON.parse(text);
    
    // Validate save data structure
    if (!saveData.version || !saveData.state) {
      throw new Error('Invalid save file format');
    }

    // Version check
    if (saveData.version !== GameConfig.SAVE.VERSION) {
      console.warn('Save version mismatch. Some features may not work correctly.');
    }

    // Store the save data
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    
    // Reload the game state
    const loadResult = loadGameState();
    if (loadResult) {
      console.log('Save imported successfully');
    }
  } catch (error) {
    console.error('Failed to import save:', error);
  }
};