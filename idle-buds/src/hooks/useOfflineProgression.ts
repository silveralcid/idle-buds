import { useEffect } from 'react';
import { useGameStore } from '../stores/game.store';

export const useOfflineProgression = () => {
  const saveGame = useGameStore((state) => state.saveGame);
  const loadGame = useGameStore((state) => state.loadGame);
  const updateResources = useGameStore((state) => state.updateResources);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Save the game state and timestamp
        saveGame();
        localStorage.setItem('lastActiveTime', Date.now().toString());
      } else if (document.visibilityState === 'visible') {
        // Load the game state and calculate offline progression
        loadGame();
        const lastActiveTime = parseInt(localStorage.getItem('lastActiveTime') || '0', 10);
        const currentTime = Date.now();
        const timeDifference = (currentTime - lastActiveTime) / 1000; // Convert to seconds

        // Apply offline resource and XP gains
        updateResources(timeDifference);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveGame, loadGame, updateResources]);
};