import { useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { GameConfig } from '../constants/gameConfig';

export const useAutoSave = () => {
  const saveGame = useGameStore((state) => state.saveGame);
  const isPaused = useGameStore((state) => state.isPaused);
  const isInitialLoad = useGameStore((state) => state.isInitialLoad);
  let autoSaveInterval: ReturnType<typeof setInterval>;

  useEffect(() => {
    if (!isPaused && !isInitialLoad) {
      autoSaveInterval = setInterval(() => {
        saveGame();
      }, GameConfig.autoSaveInterval);

      return () => clearInterval(autoSaveInterval);
    }
  }, [saveGame, isPaused, isInitialLoad]);

  return () => clearInterval(autoSaveInterval);
};