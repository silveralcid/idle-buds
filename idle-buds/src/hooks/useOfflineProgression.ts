import { useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { GameConfig } from '../constants/gameConfig';

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
        let elapsedTime = (currentTime - lastActiveTime) / 1000; // Convert to seconds

        // Cap the offline time
        const maxOfflineTime = 24 * 60 * 60; // 24 hours in seconds
        const minOfflineTime = 60; // 1 minute in seconds

        if (elapsedTime < minOfflineTime) return; // Ignore short offline times
        elapsedTime = Math.min(elapsedTime, maxOfflineTime); // Cap offline time

        // Calculate the number of ticks to process
        const tickRate = 1 / GameConfig.ticksPerSecond;
        const ticksToProcess = Math.floor(elapsedTime / tickRate);

        // Process each tick
        for (let i = 0; i < ticksToProcess; i++) {
          updateResources(tickRate);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveGame, loadGame, updateResources]);
};