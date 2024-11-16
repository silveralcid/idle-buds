// src/utils/autoSave.ts
import { useGameStore } from '../stores/useStore';

const AUTO_SAVE_INTERVAL = 60000; // 1 minute

export const initializeAutoSave = () => {
  // Load saved game on initialization
  useGameStore.getState().loadGame();

  // Set up auto-save interval
  setInterval(() => {
    useGameStore.getState().saveGame();
  }, AUTO_SAVE_INTERVAL);

  // Save on page unload
  window.addEventListener('beforeunload', () => {
    useGameStore.getState().saveGame();
  });
};
