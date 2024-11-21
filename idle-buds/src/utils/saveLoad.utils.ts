import { useBankStore } from "../stores/bank.store";
import { useGameStore } from "../stores/game.store";
import { useHunterStore } from "../stores/hunter.store";
import { useResourceAssignmentStore } from "../stores/resourceAssignment.store";
import { GameState } from "../types/state.types";

const SAVE_VERSION = '1.0.0';
const SAVE_KEY = 'idle_buds_save';

export function saveGameState() {
    const gameState = useGameStore.getState();
    const bankState = useBankStore.getState();
    const hunterState = useHunterStore.getState();
    const resourceAssignmentState = useResourceAssignmentStore.getState();
    
    const saveData = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        state: {
            game: gameState,
            bank: bankState,
            hunter: hunterState,
            resourceAssignment: resourceAssignmentState,
        }
    };
  
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    console.log('Game state saved');
}

export const loadGameState = () => {
    try {
        const savedState = localStorage.getItem(SAVE_KEY);
        if (!savedState) return null;

        const saveData = JSON.parse(savedState);
        
        // Version check
        if (saveData.version !== SAVE_VERSION) {
            console.warn('Save version mismatch. Some features may not work correctly.');
        }

        // Actually update your stores with the loaded data
        const { game, bank, hunter, resourceAssignment } = saveData.state;
        useGameStore.setState(game);
        useBankStore.setState(bank);
        useHunterStore.setState(hunter);
        useResourceAssignmentStore.setState(resourceAssignment);
        return saveData.state;
    } catch (error) {
        console.error('Failed to load game:', error);
        return null;
    }
}

  
export const resetGameState = () => ({
    resources: {},
    fractionalResources: {},
    fractionalXP: {},
    isGathering: false,
    currentActivity: null,
    budActivity: null,
});
  
