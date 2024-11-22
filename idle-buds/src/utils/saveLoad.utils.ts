import { useBankStore } from "../stores/bank.store";
import { useGameStore } from "../stores/game.store";
import { useHunterStore } from "../stores/hunter.store";
import { useNodeAssignmentStore } from "../stores/nodeAssignment.store";
import { GameState } from "../types/state.types";

const SAVE_VERSION = '1.0.0';
const SAVE_KEY = 'idle_buds_save';

export function saveGameState() {
    const gameState = useGameStore.getState();
    const bankState = useBankStore.getState();
    const hunterState = useHunterStore.getState();
    const nodeAssignmentState = useNodeAssignmentStore.getState();
    
    const currentTime = Date.now();
    useGameStore.setState({ lastSaveTime: currentTime });
    
    const saveData = {
        version: SAVE_VERSION,
        timestamp: currentTime,
        state: {
            game: { ...gameState, lastSaveTime: currentTime },
            bank: bankState,
            hunter: hunterState,
            nodeAssignment: nodeAssignmentState,
            currentActivity: gameState.currentActivity, 
            budActivity: gameState.budActivity
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
        
        if (saveData.version !== SAVE_VERSION) {
            console.warn('Save version mismatch. Some features may not work correctly.');
        }

        const { game, bank, hunter, nodeAssignment } = saveData.state;
        
        useBankStore.setState(bank);
        useHunterStore.setState(hunter);
        useNodeAssignmentStore.setState(nodeAssignment);
        useGameStore.setState({
            currentActivity: game.currentActivity,
            budActivity: game.budActivity
        });
        
        return saveData;
    } catch (error) {
        console.error('Failed to load game:', error);
        return null;
    }
};

  
export const resetGameState = () => ({
    resources: {},
    fractionalResources: {},
    fractionalXP: {},
    isGathering: false,
    currentActivity: null,
    budActivity: null,
});
  

export function exportSave() {
  const savedState = localStorage.getItem(SAVE_KEY);
  if (!savedState) {
      console.warn('No save data found to export.');
      return;
  }

  const blob = new Blob([savedState], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'idle_buds_save.json';
  a.click();
  URL.revokeObjectURL(url);
}


export function importSave(file: File) {
  const reader = new FileReader();
  reader.onload = (event) => {
      try {
          const saveData = JSON.parse(event.target?.result as string);
          localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
          loadGameState(); // Reload the game state from the imported data
          console.log('Game state imported successfully.');
      } catch (error) {
          console.error('Failed to import save:', error);
      }
  };
  reader.readAsText(file);
}
