// src/utils/saveGame.ts
import { GameState } from '../../../stores/useStore'

const SAVE_KEY = 'idle_buds_save';
const SAVE_VERSION = '1.0.0';

interface SaveData extends Partial<GameState> {
  version?: string;
  timestamp?: number;
}

export const saveGame = (state: Partial<GameState>) => {
  try {
    const saveData: SaveData = {
      ...state,
      version: SAVE_VERSION,
      timestamp: Date.now()
    };
    const saveString = JSON.stringify(saveData);
    localStorage.setItem(SAVE_KEY, saveString);
    console.log('Game saved successfully');
  } catch (error) {
    console.error('Failed to save game:', error);
  }
};

export const loadGame = (): Partial<GameState> | null => {
  try {
    const saveString = localStorage.getItem(SAVE_KEY);
    if (!saveString) return null;

    const saveData: SaveData = JSON.parse(saveString);
    
    // Version check (for future compatibility)
    if (saveData.version !== SAVE_VERSION) {
      console.warn('Save version mismatch. Some features may not work correctly.');
    }

    // Remove metadata before returning
    const { version, timestamp, ...gameState } = saveData;
    return gameState;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
};

export const clearSave = () => {
  try {
    localStorage.removeItem(SAVE_KEY);
    console.log('Save data cleared');
  } catch (error) {
    console.error('Failed to clear save:', error);
  }
};
