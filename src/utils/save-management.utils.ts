import { useBankStore } from "../stores/bank.store";
import { useGameStore } from "../stores/game.store";
import { useHunterStore } from "../stores/hunter.store";
import { useActiveBudStore } from "../stores/active-bud.store";
import { GameConfig } from "../constants/game-config";
import { SAVE_KEY } from "../constants/save-key";

export function saveGameState() {
    const gameState = useGameStore.getState();
    const bankState = useBankStore.getState();
    const hunterState = useHunterStore.getState().saveHunterState();
    const activeBudState = useActiveBudStore.getState().saveBudState();
    
    const currentTime = Date.now();
    useGameStore.setState({ lastSaveTime: currentTime });
    
    const saveData = {
        version: GameConfig.SAVE.VERSION,
        timestamp: currentTime,
        state: {
            game: { ...gameState, lastSaveTime: currentTime },
            bank: bankState,
            hunter: hunterState,
            buds: activeBudState,
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
        useActiveBudStore.getState().loadBudState(buds);
        
        // Load activity state last since it depends on other states
        useActiveBudStore.setState({
            budActivities: activities.budActivities || {},
            budProgress: activities.budProgress || {}
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
    useActiveBudStore.getState().resetBudState();
    useHunterStore.getState().resetHunterState();
    useBankStore.getState().resetBank();
    
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
        
        if (!saveData.version || !saveData.state) {
            throw new Error('Invalid save file format');
        }

        if (saveData.version !== GameConfig.SAVE.VERSION) {
            console.warn('Save version mismatch. Some features may not work correctly.');
        }

        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        
        const loadResult = loadGameState();
        if (loadResult) {
            console.log('Save imported successfully');
        }
    } catch (error) {
        console.error('Failed to import save:', error);
    }
};