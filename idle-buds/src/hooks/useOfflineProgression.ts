import { useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { useAutoSave } from './useAutoSave';

export const useOfflineProgression = () => {
  const saveGame = useGameStore((state) => state.saveGame);
  const pauseGame = useGameStore((state) => state.pauseGame);
  const stopAutoSave = useAutoSave(); // This should now be a function

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Save the game state
        saveGame();
        // Stop auto-save
        if (typeof stopAutoSave === 'function') {
          stopAutoSave(); // Call the function if it's callable
        }
        // Pause the game
        pauseGame();
      } else if (document.visibilityState === 'visible') {
        // Resume auto-save if needed
        // Unpause the game if needed
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveGame, pauseGame, stopAutoSave]);
};